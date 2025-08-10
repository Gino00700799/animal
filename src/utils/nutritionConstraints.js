// Nährstoff-Constraints und Validierungsregeln für FAO Rinder-Futterrechner
// Implementiert strikte Validierungen, Nährstoff-Grenzen und Zutaten-Limits

export const BALANCE_TOLERANCE = { 
  min: 0.95, // 95% Mindestabdeckung für "Dieta balanceada"
  max: 1.05  // 105% Maximalabdeckung für "Dieta balanceada"
};

export const NUTRIENT_LIMITS = {
  // Calcium und Phosphor als % der gesamten Trockensubstanz
  ca_pct_dm: { min: 0.004, max: 0.008 },   // 0.4–0.8 % der TM
  p_pct_dm:  { min: 0.0025, max: 0.0045 }, // 0.25–0.45 % der TM
  ca_p_ratio: { min: 1.5, max: 2.5 },      // Ca:P Verhältnis
  
  // Optionale Grenzen (falls Daten vorhanden)
  fat_pct_dm: { max: 0.06 },               // Rohfett ≤ 6 % TM
  ndf_pct_dm: { min: 0.28, max: 0.40 },    // NDF 28–40 % TM
  
  // Mindest-Raufutteranteil
  forage_min_pct: 0.30                     // ≥ 30% TM Raufutter
};

// Aktivitätsfaktor-Validierung
export const ACTIVITY_FACTORS = {
  INTENSIVE: 0.1,    // Intensiv (Confinamiento)
  SEMI_INTENSIVE: 0.2, // Semi-intensiv
  EXTENSIVE: 0.3     // Extensiv
};

export const VALID_ACTIVITY_FACTORS = Object.values(ACTIVITY_FACTORS);

// Zutaten-Limits (praktische Obergrenzen, als % der TM)
export const INGREDIENT_CAPS = [
  { 
    match: /fleisch|knochen|harina de carne|meat.*bone|bone.*meal/i, 
    max_pct_dm: 0.03,
    name: 'Fleisch-/Knochenmehl'
  },
  { 
    match: /calciumcarbonat|caco3|calcium.*carbonate/i, 
    max_pct_dm: 0.003,
    name: 'Calciumcarbonat'
  },
  { 
    match: /tierfett|grasa animal|animal.*fat/i, 
    max_pct_dm: 0.02,
    name: 'Tierfett'
  },
  { 
    match: /bentonit/i, 
    max_pct_dm: 0.01,
    name: 'Bentonit'
  },
  { 
    match: /fischmehl|harina de pescado|fish.*meal/i, 
    max_pct_dm: 0.05,
    name: 'Fischmehl'
  },
  { 
    match: /reisstroh|paja de arroz|rice.*straw|stroh/i, 
    max_pct_dm: 0.25,
    name: 'Stroh'
  },
  {
    match: /mineral.*supplement|suplemento.*mineral/i,
    max_pct_dm: 0.01,
    name: 'Mineralpräparate'
  }
];

// Datenqualitäts-Heuristiken für verschiedene Futterkategorien
export const DATA_QUALITY_RANGES = {
  forrajes_secos: {
    dryMatter: { min: 84, max: 93 },
    metabolizableEnergy: { min: 4.0, max: 10.8 },
    crudeProtein: { min: 3, max: 22 },
    calcium: { min: 0.15, max: 1.6 },
    phosphorus: { min: 0.05, max: 0.45 }
  },
  pastos_verdes: {
    dryMatter: { min: 12, max: 30 },
    metabolizableEnergy: { min: 6.0, max: 12.5 },
    crudeProtein: { min: 6, max: 26 },
    calcium: { min: 0.2, max: 2.6 },
    phosphorus: { min: 0.05, max: 0.6 }
  },
  ensilados: {
    dryMatter: { min: 25, max: 40 },
    metabolizableEnergy: { min: 7.5, max: 11.5 },
    crudeProtein: { min: 7, max: 26 },
    calcium: { min: 0.2, max: 1.6 },
    phosphorus: { min: 0.05, max: 0.6 }
  },
  alimentos_energeticos: {
    dryMatter: { min: 84, max: 92 },
    metabolizableEnergy: { min: 10.5, max: 13.5 },
    crudeProtein: { min: 7, max: 18 },
    calcium: { min: 0.01, max: 0.15 },
    phosphorus: { min: 0.1, max: 1.5 }
  }
};

/**
 * Validiert Aktivitätsfaktor und migriert alte Werte
 * @param {number} activityFactor - Zu validierender Aktivitätsfaktor
 * @returns {object} Validierungsresultat mit korrigiertem Wert
 */
export const validateActivityFactor = (activityFactor) => {
  const factor = parseFloat(activityFactor);
  
  // Migration: 0.05 auf 0.1 runden
  if (factor === 0.05) {
    return {
      isValid: true,
      correctedValue: ACTIVITY_FACTORS.INTENSIVE,
      migrated: true,
      message: 'Aktivitätsfaktor von 0.05 auf 0.1 (intensiv) migriert'
    };
  }
  
  // Prüfe auf gültige Werte
  if (VALID_ACTIVITY_FACTORS.includes(factor)) {
    return {
      isValid: true,
      correctedValue: factor,
      migrated: false
    };
  }
  
  // Ungültiger Wert
  return {
    isValid: false,
    correctedValue: ACTIVITY_FACTORS.INTENSIVE,
    migrated: false,
    error: `Aktivitätsfaktor muss einer der folgenden Werte sein: ${VALID_ACTIVITY_FACTORS.join(', ')}`
  };
};

/**
 * Berechnet Ca/P-Anteile und -Verhältnis einer Ration
 * @param {array} dietComposition - Rations-Zusammensetzung
 * @param {number} totalDryMatter - Gesamt-Trockensubstanz
 * @returns {object} Ca/P-Analyse
 */
export const calculateCaPhosphorusAnalysis = (dietComposition, totalDryMatter) => {
  let totalCa = 0;
  let totalP = 0;
  
  dietComposition.forEach(item => {
    const dmAmount = item.amount * (item.ingredient.composition.dryMatter / 100);
    totalCa += dmAmount * (item.ingredient.composition.calcium / 100);
    totalP += dmAmount * (item.ingredient.composition.phosphorus / 100);
  });
  
  const caPctDM = totalCa / totalDryMatter;
  const pPctDM = totalP / totalDryMatter;
  const caPhosphorusRatio = totalP > 0 ? totalCa / totalP : 0;
  
  return {
    calcium: {
      total_kg: totalCa,
      pct_dm: caPctDM,
      within_limits: caPctDM >= NUTRIENT_LIMITS.ca_pct_dm.min && caPctDM <= NUTRIENT_LIMITS.ca_pct_dm.max
    },
    phosphorus: {
      total_kg: totalP,
      pct_dm: pPctDM,
      within_limits: pPctDM >= NUTRIENT_LIMITS.p_pct_dm.min && pPctDM <= NUTRIENT_LIMITS.p_pct_dm.max
    },
    ratio: {
      value: caPhosphorusRatio,
      within_limits: caPhosphorusRatio >= NUTRIENT_LIMITS.ca_p_ratio.min && caPhosphorusRatio <= NUTRIENT_LIMITS.ca_p_ratio.max
    }
  };
};

/**
 * Prüft Zutaten-Limits
 * @param {array} dietComposition - Rations-Zusammensetzung
 * @param {number} totalDryMatter - Gesamt-Trockensubstanz
 * @returns {object} Limit-Verletzungen
 */
export const checkIngredientCompliance = (dietComposition, totalDryMatter) => {
  const violations = [];
  
  dietComposition.forEach(item => {
    const dmAmount = item.amount * (item.ingredient.composition.dryMatter / 100);
    const pctDM = dmAmount / totalDryMatter;
    
    // Prüfe gegen alle definierten Limits
    INGREDIENT_CAPS.forEach(cap => {
      if (cap.match.test(item.ingredient.name.es) || cap.match.test(item.ingredient.name.en || '')) {
        if (pctDM > cap.max_pct_dm) {
          violations.push({
            ingredient: item.ingredient.name.es,
            category: cap.name,
            actual_pct: pctDM * 100,
            max_pct: cap.max_pct_dm * 100,
            excess: (pctDM - cap.max_pct_dm) * 100
          });
        }
      }
    });
  });
  
  return violations;
};

/**
 * Berechnet Raufutteranteil
 * @param {array} dietComposition - Rations-Zusammensetzung
 * @param {number} totalDryMatter - Gesamt-Trockensubstanz
 * @returns {object} Raufutter-Analyse
 */
export const calculateForageContent = (dietComposition, totalDryMatter) => {
  const forageCategories = ['forrajes_secos', 'pastos_verdes', 'ensilados'];
  
  let forageDM = 0;
  dietComposition.forEach(item => {
    if (forageCategories.includes(item.ingredient.category)) {
      forageDM += item.amount * (item.ingredient.composition.dryMatter / 100);
    }
  });
  
  const foragePct = forageDM / totalDryMatter;
  
  return {
    forage_dm_kg: forageDM,
    forage_pct_dm: foragePct,
    meets_minimum: foragePct >= NUTRIENT_LIMITS.forage_min_pct,
    minimum_required: NUTRIENT_LIMITS.forage_min_pct
  };
};

/**
 * Validiert Datenqualität eines Ingredients
 * @param {object} ingredient - Zutat
 * @returns {array} Liste von Qualitätswarnungen
 */
export const validateIngredientDataQuality = (ingredient) => {
  const warnings = [];
  const ranges = DATA_QUALITY_RANGES[ingredient.category];
  
  if (!ranges) return warnings; // Keine Heuristiken für diese Kategorie
  
  const comp = ingredient.composition;
  
  // Prüfe alle definierten Bereiche
  Object.entries(ranges).forEach(([nutrient, range]) => {
    const value = comp[nutrient];
    if (value !== undefined && (value < range.min || value > range.max)) {
      warnings.push({
        ingredient: ingredient.name.es,
        nutrient,
        value,
        expected_range: range,
        category: ingredient.category
      });
    }
  });
  
  return warnings;
};

/**
 * Berechnet Ca und P Prozente in der Trockensubstanz
 * @param {object} diet - Optimierte Diät
 * @param {object} requirements - Nährstoffbedarf
 * @returns {object} Ca/P Prozente und Verhältnis
 */
export const calculateCaPhosphorusPercentages = (diet, requirements) => {
  const totalDM = diet.totalNutrients.dryMatter;
  
  if (totalDM === 0) {
    return {
      ca_pct_dm: 0,
      p_pct_dm: 0,
      ca_p_ratio: 0,
      isValid: false
    };
  }
  
  // Ca und P in kg umrechnen (von Gramm)
  const ca_kg = diet.totalNutrients.calcium / 1000;
  const p_kg = diet.totalNutrients.phosphorus / 1000;
  
  const ca_pct_dm = ca_kg / totalDM;
  const p_pct_dm = p_kg / totalDM;
  const ca_p_ratio = p_pct_dm > 0 ? ca_pct_dm / p_pct_dm : 0;
  
  return {
    ca_pct_dm: parseFloat(ca_pct_dm.toFixed(4)),
    p_pct_dm: parseFloat(p_pct_dm.toFixed(4)),
    ca_p_ratio: parseFloat(ca_p_ratio.toFixed(2)),
    isValid: true
  };
};

/**
 * Prüft ob eine Diät als "balanceada" gelten kann
 * @param {object} diet - Optimierte Diät
 * @param {object} requirements - Nährstoffbedarf
 * @returns {object} Balance-Status mit Details
 */
export const checkDietBalance = (diet, requirements) => {
  const result = {
    isBalanced: false,
    reasons: [],
    warnings: [],
    adequacyRates: {}
  };
  
  // 1. Berechne Abdeckungsraten für Pflicht-Nährstoffe
  const energyRate = diet.totalNutrients.energy / requirements.totalME;
  const proteinRate = diet.totalNutrients.protein / requirements.crudeProteinRequired;
  const dmRate = diet.totalNutrients.dryMatter / requirements.dryMatterIntake;
  
  result.adequacyRates = {
    energy: parseFloat((energyRate * 100).toFixed(1)),
    protein: parseFloat((proteinRate * 100).toFixed(1)),
    dryMatter: parseFloat((dmRate * 100).toFixed(1))
  };
  
  // 2. Prüfe Energie, Protein, TM (95-105% Toleranz)
  if (energyRate < BALANCE_TOLERANCE.min) {
    result.reasons.push(`Energie unterdeckt: ${result.adequacyRates.energy}% (min. 95%)`);
  } else if (energyRate > BALANCE_TOLERANCE.max) {
    result.reasons.push(`Energie überdeckt: ${result.adequacyRates.energy}% (max. 105%)`);
  }
  
  if (proteinRate < BALANCE_TOLERANCE.min) {
    result.reasons.push(`Protein unterdeckt: ${result.adequacyRates.protein}% (min. 95%)`);
  } else if (proteinRate > BALANCE_TOLERANCE.max) {
    result.reasons.push(`Protein überdeckt: ${result.adequacyRates.protein}% (max. 105%)`);
  }
  
  if (dmRate < BALANCE_TOLERANCE.min) {
    result.reasons.push(`Trockenmasse unterdeckt: ${result.adequacyRates.dryMatter}% (min. 95%)`);
  } else if (dmRate > BALANCE_TOLERANCE.max) {
    result.reasons.push(`Trockenmasse überdeckt: ${result.adequacyRates.dryMatter}% (max. 105%)`);
  }
  
  // 3. Prüfe Ca/P Grenzen und Verhältnis
  const caPhosphorus = calculateCaPhosphorusPercentages(diet, requirements);
  if (caPhosphorus.isValid) {
    result.adequacyRates.ca_pct_dm = parseFloat((caPhosphorus.ca_pct_dm * 100).toFixed(2));
    result.adequacyRates.p_pct_dm = parseFloat((caPhosphorus.p_pct_dm * 100).toFixed(2));
    result.adequacyRates.ca_p_ratio = caPhosphorus.ca_p_ratio;
    
    // Ca Grenzen: 0.4-0.8% TM
    if (caPhosphorus.ca_pct_dm < NUTRIENT_LIMITS.ca_pct_dm.min) {
      result.reasons.push(`Calcium zu niedrig: ${result.adequacyRates.ca_pct_dm}% TM (min. 0.4%)`);
    } else if (caPhosphorus.ca_pct_dm > NUTRIENT_LIMITS.ca_pct_dm.max) {
      result.reasons.push(`Calcium zu hoch: ${result.adequacyRates.ca_pct_dm}% TM (max. 0.8%)`);
    }
    
    // P Grenzen: 0.25-0.45% TM
    if (caPhosphorus.p_pct_dm < NUTRIENT_LIMITS.p_pct_dm.min) {
      result.reasons.push(`Phosphor zu niedrig: ${result.adequacyRates.p_pct_dm}% TM (min. 0.25%)`);
    } else if (caPhosphorus.p_pct_dm > NUTRIENT_LIMITS.p_pct_dm.max) {
      result.reasons.push(`Phosphor zu hoch: ${result.adequacyRates.p_pct_dm}% TM (max. 0.45%)`);
    }
    
    // Ca:P Verhältnis: 1.5-2.5:1
    if (caPhosphorus.ca_p_ratio < NUTRIENT_LIMITS.ca_p_ratio.min) {
      result.reasons.push(`Ca:P Verhältnis zu niedrig: ${caPhosphorus.ca_p_ratio}:1 (min. 1.5:1)`);
    } else if (caPhosphorus.ca_p_ratio > NUTRIENT_LIMITS.ca_p_ratio.max) {
      result.reasons.push(`Ca:P Verhältnis zu hoch: ${caPhosphorus.ca_p_ratio}:1 (max. 2.5:1)`);
    }
  }
  
  // 4. Prüfe Zutaten-Limits
  const ingredientViolations = checkIngredientLimitsForDiet(diet);
  result.reasons.push(...ingredientViolations);
  
  // 5. Bestimme finalen Status
  result.isBalanced = result.reasons.length === 0;
  
  return result;
};

/**
 * Prüft Zutaten-Limits für eine komplette Diät (praktische Obergrenzen)
 * @param {object} diet - Optimierte Diät
 * @returns {array} Array von Verletzungen
 */
export const checkIngredientLimitsForDiet = (diet) => {
  const violations = [];
  const totalDM = diet.totalNutrients.dryMatter;
  
  if (totalDM === 0) return violations;
  
  diet.composition.forEach(item => {
    const ingredient = item.ingredient;
    const dmAmount = item.amount * (ingredient.composition.dryMatter / 100);
    const pctOfTotalDM = dmAmount / totalDM;
    
    // Prüfe gegen Zutaten-Caps
    for (const cap of INGREDIENT_CAPS) {
      if (cap.match.test(ingredient.name.es) || cap.match.test(ingredient.name.de || "")) {
        if (pctOfTotalDM > cap.max_pct_dm) {
          violations.push(
            `${cap.name} überschreitet Limit: ${(pctOfTotalDM * 100).toFixed(1)}% TM (max. ${(cap.max_pct_dm * 100).toFixed(1)}%)`
          );
        }
        break; // Nur erste Übereinstimmung prüfen
      }
    }
  });
  
  return violations;
};

