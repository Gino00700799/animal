// Erweiterte Diät-Optimierung mit strikten Nährstoff-Constraints und Zutaten-Limits
// Implementiert harte Grenzen für Ca/P, Zutaten-Limits und Balance-Validierung

import { 
  NUTRIENT_LIMITS, 
  INGREDIENT_CAPS, 
  calculateCaPhosphorusAnalysis,
  checkIngredientLimits,
  calculateForageContent
} from './nutritionConstraints';

/**
 * Erweiterte Diät-Optimierung mit strikten Constraints
 * @param {object} requirements - Nährstoffbedarf
 * @param {array} ingredients - Verfügbare Zutaten
 * @param {object} constraints - Zusätzliche Beschränkungen
 * @param {string} method - Optimierungsmethode
 * @returns {object} Optimierte Diät mit Constraint-Validierung
 */
export const optimizeDietWithConstraints = (requirements, ingredients, constraints = {}, method = 'linear') => {
  const {
    totalME,
    crudeProteinRequired,
    calciumRequired,
    phosphorusRequired,
    dryMatterIntake
  } = requirements;

  // Erweiterte Kategorie-Limits mit Raufutter-Minimum
  const categoryLimits = {
    forrajes_secos: dryMatterIntake * 0.70,
    pastos_verdes: dryMatterIntake * 0.05,
    ensilados: dryMatterIntake * 0.60,
    alimentos_energeticos: dryMatterIntake * 0.70, // Reduziert für bessere Balance
    suplementos_proteicos: dryMatterIntake * 0.20, // Reduziert
    minerales: dryMatterIntake * 0.03, // Reduziert
    vitaminas: dryMatterIntake * 0.01,
    aditivos: dryMatterIntake * 0.02,
    ...constraints.categoryLimits
  };

  // Berechne Zutaten-spezifische Limits basierend auf Namen
  const ingredientLimits = calculateIngredientSpecificLimits(ingredients, dryMatterIntake);

  // Führe Optimierung mit Constraints durch
  let solution = constrainedSequentialOptimization(
    requirements,
    ingredients,
    categoryLimits,
    ingredientLimits
  );

  // Falls Lösung nicht feasible, verwende Relaxation
  if (!solution.isFeasible) {
    solution = relaxedOptimization(requirements, ingredients, categoryLimits, ingredientLimits);
  }

  // Validiere finale Lösung gegen alle Constraints
  const validation = validateSolutionConstraints(solution, requirements);
  
  return {
    ...solution,
    validation,
    method: solution.method || 'Enhanced Linear Programming',
    constraintsApplied: {
      categoryLimits,
      ingredientLimits,
      mineralLimits: NUTRIENT_LIMITS,
      forageMinimum: NUTRIENT_LIMITS.forage_min_pct
    }
  };
};

/**
 * Berechnet zutatenspezifische Limits basierend auf Namen-Matching
 */
function calculateIngredientSpecificLimits(ingredients, totalDM) {
  const limits = {};
  
  ingredients.forEach(ingredient => {
    INGREDIENT_CAPS.forEach(cap => {
      if (cap.match.test(ingredient.name.es) || cap.match.test(ingredient.name.en || '')) {
        limits[ingredient.id] = {
          maxAmount: totalDM * cap.max_pct_dm,
          maxPctDM: cap.max_pct_dm * 100,
          category: cap.name
        };
      }
    });
  });
  
  return limits;
}

/**
 * Constraint-basierte sequentielle Optimierung
 */
function constrainedSequentialOptimization(requirements, ingredients, categoryLimits, ingredientLimits) {
  const {
    totalME,
    crudeProteinRequired,
    calciumRequired,
    phosphorusRequired,
    dryMatterIntake
  } = requirements;

  let remainingEnergy = totalME;
  let remainingProtein = crudeProteinRequired;
  let remainingDM = dryMatterIntake;
  
  const dietComposition = [];
  const categoryUsed = {};
  const penaltyCost = 0;
  
  // Initialisiere Kategorie-Nutzung
  Object.keys(categoryLimits).forEach(cat => {
    categoryUsed[cat] = 0;
  });

  // Phase 1: Raufutter-Basis (MINDESTENS 30% TM)
  const foragePhase = addForageBase(
    ingredients, dietComposition, categoryUsed, categoryLimits, 
    remainingEnergy, remainingProtein, remainingDM, dryMatterIntake
  );
  
  remainingEnergy = foragePhase.remainingEnergy;
  remainingProtein = foragePhase.remainingProtein;
  remainingDM = foragePhase.remainingDM;

  // Phase 2: Energie-Deckung mit Constraints
  const energyPhase = addEnergySourcesWithConstraints(
    ingredients, dietComposition, categoryUsed, categoryLimits, ingredientLimits,
    remainingEnergy, remainingProtein, remainingDM
  );
  
  remainingEnergy = energyPhase.remainingEnergy;
  remainingProtein = energyPhase.remainingProtein;
  remainingDM = energyPhase.remainingDM;

  // Phase 3: Protein-Ergänzung
  const proteinPhase = addProteinSourcesWithConstraints(
    ingredients, dietComposition, categoryUsed, categoryLimits, ingredientLimits,
    remainingEnergy, remainingProtein, remainingDM
  );
  
  remainingEnergy = proteinPhase.remainingEnergy;
  remainingProtein = proteinPhase.remainingProtein;
  remainingDM = proteinPhase.remainingDM;

  // Phase 4: Mineral-Balance mit strikten Ca/P-Limits
  const mineralPhase = balanceMineralsWithConstraints(
    ingredients, dietComposition, categoryUsed, categoryLimits, ingredientLimits,
    requirements, remainingDM
  );

  // Berechne finale Nährstoffe und Kosten
  const finalSolution = calculateFinalSolution(dietComposition, requirements);
  
  // Prüfe Feasibility
  const feasibilityCheck = checkSolutionFeasibility(finalSolution, requirements);
  
  return {
    ...finalSolution,
    isFeasible: feasibilityCheck.isFeasible,
    feasibilityIssues: feasibilityCheck.issues,
    categoryUsage: categoryUsed
  };
}

/**
 * Fügt Raufutter-Basis hinzu (mindestens 30% TM)
 */
function addForageBase(ingredients, dietComposition, categoryUsed, categoryLimits, 
                      remainingEnergy, remainingProtein, remainingDM, totalDM) {
  
  const forageCategories = ['forrajes_secos', 'pastos_verdes', 'ensilados'];
  const forages = ingredients.filter(ing => forageCategories.includes(ing.category));
  
  if (forages.length === 0) {
    return { remainingEnergy, remainingProtein, remainingDM };
  }

  // Mindest-Raufutter: 30% der Gesamt-TM
  const minForageDM = totalDM * NUTRIENT_LIMITS.forage_min_pct;
  
  // Wähle bestes Raufutter (Energie/Kosten-Verhältnis)
  const bestForage = forages.reduce((best, current) => {
    const bestScore = best.composition.metabolizableEnergy / best.costPerKg;
    const currentScore = current.composition.metabolizableEnergy / current.costPerKg;
    return currentScore > bestScore ? current : best;
  });

  // Berechne benötigte Menge für Minimum
  const forageAmount = Math.min(
    minForageDM / (bestForage.composition.dryMatter / 100),
    categoryLimits[bestForage.category] || totalDM * 0.7,
    remainingDM * 0.6
  );

  if (forageAmount > 0.1) {
    dietComposition.push({
      ingredient: bestForage,
      amount: parseFloat(forageAmount.toFixed(2)),
      contribution: calculateNutrientContribution(bestForage, forageAmount)
    });

    const contribution = calculateNutrientContribution(bestForage, forageAmount);
    remainingEnergy -= contribution.energy;
    remainingProtein -= contribution.protein;
    remainingDM -= contribution.dryMatter;
    categoryUsed[bestForage.category] += forageAmount;
  }

  return { remainingEnergy, remainingProtein, remainingDM };
}

/**
 * Fügt Energiequellen mit Constraints hinzu
 */
function addEnergySourcesWithConstraints(ingredients, dietComposition, categoryUsed, 
                                       categoryLimits, ingredientLimits,
                                       remainingEnergy, remainingProtein, remainingDM) {
  
  if (remainingEnergy <= 0) return { remainingEnergy, remainingProtein, remainingDM };

  const energyFeeds = ingredients.filter(ing => 
    ing.category === 'alimentos_energeticos' && 
    ing.composition.metabolizableEnergy > 8.0
  );

  if (energyFeeds.length === 0) return { remainingEnergy, remainingProtein, remainingDM };

  // Sortiere nach Energie-Effizienz
  const sortedEnergyFeeds = energyFeeds.sort((a, b) => 
    (b.composition.metabolizableEnergy / b.costPerKg) - (a.composition.metabolizableEnergy / a.costPerKg)
  );

  for (const energyFeed of sortedEnergyFeeds) {
    if (remainingEnergy <= totalME * 0.05) break; // Stoppe bei <5% verbleibendem Bedarf

    // Prüfe Kategorie-Limit
    const categoryLimit = categoryLimits[energyFeed.category] || 0;
    const categoryRemaining = categoryLimit - (categoryUsed[energyFeed.category] || 0);
    
    // Prüfe Zutaten-spezifisches Limit
    const ingredientLimit = ingredientLimits[energyFeed.id];
    const maxByIngredient = ingredientLimit ? ingredientLimit.maxAmount : Infinity;

    // Berechne maximale Menge
    const maxAmount = Math.min(
      remainingEnergy / energyFeed.composition.metabolizableEnergy,
      categoryRemaining,
      maxByIngredient,
      remainingDM * 0.4 // Max 40% der verbleibenden TM pro Zutat
    );

    if (maxAmount > 0.05) {
      const amount = Math.min(maxAmount, remainingEnergy / energyFeed.composition.metabolizableEnergy);
      
      dietComposition.push({
        ingredient: energyFeed,
        amount: parseFloat(amount.toFixed(2)),
        contribution: calculateNutrientContribution(energyFeed, amount)
      });

      const contribution = calculateNutrientContribution(energyFeed, amount);
      remainingEnergy -= contribution.energy;
      remainingProtein -= contribution.protein;
      remainingDM -= contribution.dryMatter;
      categoryUsed[energyFeed.category] = (categoryUsed[energyFeed.category] || 0) + amount;
    }
  }

  return { remainingEnergy, remainingProtein, remainingDM };
}

/**
 * Fügt Proteinquellen mit Constraints hinzu
 */
function addProteinSourcesWithConstraints(ingredients, dietComposition, categoryUsed, 
                                        categoryLimits, ingredientLimits,
                                        remainingEnergy, remainingProtein, remainingDM) {
  
  if (remainingProtein <= 0) return { remainingEnergy, remainingProtein, remainingDM };

  const proteinFeeds = ingredients.filter(ing => 
    ing.category === 'suplementos_proteicos' && 
    ing.composition.crudeProtein > 15
  );

  if (proteinFeeds.length === 0) return { remainingEnergy, remainingProtein, remainingDM };

  // Wähle beste Proteinquelle
  const bestProtein = proteinFeeds.reduce((best, current) => {
    const bestScore = (best.composition.crudeProtein / best.costPerKg) + 
                     (best.composition.calcium * 2) + (best.composition.phosphorus * 2);
    const currentScore = (current.composition.crudeProtein / current.costPerKg) + 
                        (current.composition.calcium * 2) + (current.composition.phosphorus * 2);
    return currentScore > bestScore ? current : best;
  });

  // Prüfe Limits
  const categoryLimit = categoryLimits[bestProtein.category] || 0;
  const categoryRemaining = categoryLimit - (categoryUsed[bestProtein.category] || 0);
  const ingredientLimit = ingredientLimits[bestProtein.id];
  const maxByIngredient = ingredientLimit ? ingredientLimit.maxAmount : Infinity;

  const maxAmount = Math.min(
    remainingProtein / (bestProtein.composition.crudeProtein / 100),
    categoryRemaining,
    maxByIngredient,
    remainingDM * 0.3
  );

  if (maxAmount > 0.02) {
    dietComposition.push({
      ingredient: bestProtein,
      amount: parseFloat(maxAmount.toFixed(2)),
      contribution: calculateNutrientContribution(bestProtein, maxAmount)
    });

    const contribution = calculateNutrientContribution(bestProtein, maxAmount);
    remainingEnergy -= contribution.energy;
    remainingProtein -= contribution.protein;
    remainingDM -= contribution.dryMatter;
    categoryUsed[bestProtein.category] = (categoryUsed[bestProtein.category] || 0) + maxAmount;
  }

  return { remainingEnergy, remainingProtein, remainingDM };
}

/**
 * Balanciert Mineralstoffe mit strikten Ca/P-Constraints
 */
function balanceMineralsWithConstraints(ingredients, dietComposition, categoryUsed, 
                                      categoryLimits, ingredientLimits, requirements, remainingDM) {
  
  // Berechne aktuelle Ca/P-Werte
  const currentTotalDM = dietComposition.reduce((sum, item) => 
    sum + item.amount * (item.ingredient.composition.dryMatter / 100), 0
  );
  
  if (currentTotalDM === 0) return;

  const caPhosphorusAnalysis = calculateCaPhosphorusAnalysis(dietComposition, currentTotalDM);
  
  // Prüfe ob Ca/P-Adjustierung nötig
  const needsCaAdjustment = !caPhosphorusAnalysis.calcium.within_limits;
  const needsPAdjustment = !caPhosphorusAnalysis.phosphorus.within_limits;
  const needsRatioAdjustment = !caPhosphorusAnalysis.ratio.within_limits;

  if (!needsCaAdjustment && !needsPAdjustment && !needsRatioAdjustment) {
    return; // Bereits balanciert
  }

  // Finde geeignete Mineralquellen
  const mineralSources = ingredients.filter(ing => 
    ing.category === 'minerales' || 
    ing.composition.calcium > 1.0 || 
    ing.composition.phosphorus > 0.5
  );

  if (mineralSources.length === 0) return;

  // Wähle beste Mineralquelle basierend auf Bedarf
  let bestMineral;
  if (needsCaAdjustment && caPhosphorusAnalysis.calcium.pct_dm < NUTRIENT_LIMITS.ca_pct_dm.min) {
    // Brauchen mehr Calcium
    bestMineral = mineralSources.reduce((best, current) => 
      current.composition.calcium > (best?.composition.calcium || 0) ? current : best
    );
  } else if (needsPAdjustment && caPhosphorusAnalysis.phosphorus.pct_dm < NUTRIENT_LIMITS.p_pct_dm.min) {
    // Brauchen mehr Phosphor
    bestMineral = mineralSources.reduce((best, current) => 
      current.composition.phosphorus > (best?.composition.phosphorus || 0) ? current : best
    );
  } else {
    // Ausgewogene Mineralquelle
    bestMineral = mineralSources.reduce((best, current) => {
      const bestScore = (best?.composition.calcium || 0) + (best?.composition.phosphorus || 0);
      const currentScore = current.composition.calcium + current.composition.phosphorus;
      return currentScore > bestScore ? current : best;
    });
  }

  if (!bestMineral) return;

  // Berechne sichere Menge (max 1% TM für Mineralstoffe)
  const maxMineralAmount = Math.min(
    remainingDM * 0.1,
    requirements.dryMatterIntake * 0.01, // Max 1% der Gesamt-TM
    categoryLimits[bestMineral.category] || 0.5
  );

  const ingredientLimit = ingredientLimits[bestMineral.id];
  const finalAmount = ingredientLimit ? 
    Math.min(maxMineralAmount, ingredientLimit.maxAmount) : 
    maxMineralAmount;

  if (finalAmount > 0.005) { // Mindestens 5g
    dietComposition.push({
      ingredient: bestMineral,
      amount: parseFloat(finalAmount.toFixed(3)),
      contribution: calculateNutrientContribution(bestMineral, finalAmount)
    });

    categoryUsed[bestMineral.category] = (categoryUsed[bestMineral.category] || 0) + finalAmount;
  }
}

/**
 * Relaxierte Optimierung falls Standard-Lösung nicht feasible
 */
function relaxedOptimization(requirements, ingredients, categoryLimits, ingredientLimits) {
  // Implementiere Prioritäts-basierte Relaxation
  // 1. Priorität: ME/CP/TM erfüllen
  // 2. Priorität: Ca/P in Grenzen
  // 3. Priorität: Zutaten-Limits
  
  // Für jetzt: Verwende Standard-Optimierung mit gelockerten Limits
  const relaxedCategoryLimits = Object.fromEntries(
    Object.entries(categoryLimits).map(([cat, limit]) => [cat, limit * 1.2])
  );

  const solution = constrainedSequentialOptimization(
    requirements, ingredients, relaxedCategoryLimits, {}
  );

  return {
    ...solution,
    method: 'Relaxed Linear Programming',
    isRelaxed: true,
    relaxationNote: 'Einige Constraints wurden gelockert um eine Lösung zu finden'
  };
}

/**
 * Berechnet Nährstoff-Beitrag einer Zutat
 */
function calculateNutrientContribution(ingredient, amount) {
  const comp = ingredient.composition;
  const dmAmount = amount * (comp.dryMatter / 100);
  
  return {
    energy: parseFloat((dmAmount * comp.metabolizableEnergy).toFixed(2)),
    protein: parseFloat((dmAmount * comp.crudeProtein / 100).toFixed(2)),
    calcium: parseFloat((dmAmount * comp.calcium / 100).toFixed(3)),
    phosphorus: parseFloat((dmAmount * comp.phosphorus / 100).toFixed(3)),
    dryMatter: parseFloat(dmAmount.toFixed(2))
  };
}

/**
 * Berechnet finale Lösung
 */
function calculateFinalSolution(dietComposition, requirements) {
  const totalCost = dietComposition.reduce((sum, item) => 
    sum + (item.amount * item.ingredient.costPerKg), 0
  );

  const totalNutrients = dietComposition.reduce((totals, item) => ({
    energy: totals.energy + item.contribution.energy,
    protein: totals.protein + item.contribution.protein,
    calcium: totals.calcium + item.contribution.calcium * 1000,
    phosphorus: totals.phosphorus + item.contribution.phosphorus * 1000,
    dryMatter: totals.dryMatter + item.contribution.dryMatter
  }), { energy: 0, protein: 0, calcium: 0, phosphorus: 0, dryMatter: 0 });

  return {
    composition: dietComposition,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalNutrients,
    adequacy: {
      energy: parseFloat((totalNutrients.energy / requirements.energy.totalME * 100).toFixed(1)),
      protein: parseFloat((totalNutrients.protein / requirements.nutrients.crudeProteinRequired * 100).toFixed(1)),
      calcium: parseFloat((totalNutrients.calcium / requirements.nutrients.calciumRequired * 100).toFixed(1)),
      phosphorus: parseFloat((totalNutrients.phosphorus / requirements.nutrients.phosphorusRequired * 100).toFixed(1)),
      dryMatter: parseFloat((totalNutrients.dryMatter / requirements.nutrients.dryMatterIntake * 100).toFixed(1))
    }
  };
}

/**
 * Prüft Feasibility der Lösung
 */
function checkSolutionFeasibility(solution, requirements) {
  const issues = [];
  
  // Prüfe Mindest-Abdeckung (85%)
  if (solution.adequacy.energy < 85) {
    issues.push('Energie-Abdeckung zu niedrig');
  }
  if (solution.adequacy.protein < 85) {
    issues.push('Protein-Abdeckung zu niedrig');
  }
  if (solution.adequacy.dryMatter < 85) {
    issues.push('Trockensubstanz-Aufnahme zu niedrig');
  }

  return {
    isFeasible: issues.length === 0,
    issues
  };
}

/**
 * Validiert Lösung gegen alle Constraints
 */
function validateSolutionConstraints(solution, requirements) {
  const totalDM = solution.totalNutrients.dryMatter;
  
  // Ca/P-Analyse
  const caPhosphorusAnalysis = calculateCaPhosphorusAnalysis(solution.composition, totalDM);
  
  // Zutaten-Limits
  const ingredientViolations = checkIngredientLimits(solution.composition, totalDM);
  
  // Raufutter-Anteil
  const forageAnalysis = calculateForageContent(solution.composition, totalDM);
  
  return {
    minerals: caPhosphorusAnalysis,
    ingredientLimits: {
      violations: ingredientViolations,
      hasViolations: ingredientViolations.length > 0
    },
    forage: forageAnalysis,
    overallValid: ingredientViolations.length === 0 && 
                  caPhosphorusAnalysis.calcium.within_limits && 
                  caPhosphorusAnalysis.phosphorus.within_limits && 
                  caPhosphorusAnalysis.ratio.within_limits &&
                  forageAnalysis.meets_minimum
  };
}