// Balance-Validator für FAO Rinder-Futterrechner
// Implementiert strikte "Dieta balanceada" Logik

import { 
  BALANCE_TOLERANCE, 
  NUTRIENT_LIMITS,
  calculateCaPhosphorusAnalysis,
  checkIngredientLimits,
  calculateForageContent
} from './nutritionConstraints';

/**
 * Hauptvalidierung: Prüft ob eine Ration als "balanceada" gelten kann
 * @param {object} optimizedDiet - Optimierte Ration
 * @param {object} requirements - Nährstoffbedarf
 * @param {object} animalData - Tierdaten
 * @returns {object} Vollständige Balance-Analyse
 */
export const validateDietBalance = (optimizedDiet, requirements, animalData) => {
  const analysis = {
    isBalanced: false,
    overallStatus: 'not_balanced',
    violations: [],
    warnings: [],
    nutrientStatus: {},
    mineralStatus: {},
    ingredientLimitStatus: {},
    forageStatus: {},
    recommendations: []
  };

  // 1. Prüfe Pflichtziele (ME, CP, TM) - müssen 95-105% sein
  const nutrientChecks = checkMandatoryNutrients(optimizedDiet, requirements);
  analysis.nutrientStatus = nutrientChecks;
  
  // 2. Prüfe Ca/P Grenzen und Verhältnis
  const mineralChecks = checkMineralLimits(optimizedDiet);
  analysis.mineralStatus = mineralChecks;
  
  // 3. Prüfe Zutaten-Limits
  const ingredientChecks = checkIngredientConstraints(optimizedDiet);
  analysis.ingredientLimitStatus = ingredientChecks;
  
  // 4. Prüfe Raufutteranteil
  const forageChecks = checkForageRequirements(optimizedDiet);
  analysis.forageStatus = forageChecks;
  
  // 5. Sammle Verletzungen und Warnungen
  collectViolationsAndWarnings(analysis, nutrientChecks, mineralChecks, ingredientChecks, forageChecks);
  
  // 6. Bestimme Gesamtstatus
  analysis.isBalanced = analysis.violations.length === 0;
  analysis.overallStatus = analysis.isBalanced ? 'balanced' : 'not_balanced';
  
  // 7. Generiere Empfehlungen
  analysis.recommendations = generateRecommendations(analysis, optimizedDiet, requirements);
  
  return analysis;
};

/**
 * Prüft Pflichtnährstoffe (ME, CP, TM)
 */
function checkMandatoryNutrients(optimizedDiet, requirements) {
  const checks = {};
  
  // Energie (ME)
  const energyCoverage = optimizedDiet.totalNutrients.energy / requirements.energy.totalME;
  checks.energy = {
    required: requirements.energy.totalME,
    provided: optimizedDiet.totalNutrients.energy,
    coverage: energyCoverage,
    within_tolerance: energyCoverage >= BALANCE_TOLERANCE.min && energyCoverage <= BALANCE_TOLERANCE.max,
    status: getStatusFromCoverage(energyCoverage)
  };
  
  // Protein (CP)
  const proteinCoverage = optimizedDiet.totalNutrients.protein / requirements.nutrients.crudeProteinRequired;
  checks.protein = {
    required: requirements.nutrients.crudeProteinRequired,
    provided: optimizedDiet.totalNutrients.protein,
    coverage: proteinCoverage,
    within_tolerance: proteinCoverage >= BALANCE_TOLERANCE.min && proteinCoverage <= BALANCE_TOLERANCE.max,
    status: getStatusFromCoverage(proteinCoverage)
  };
  
  // Trockensubstanz (TM)
  const dmCoverage = optimizedDiet.totalNutrients.dryMatter / requirements.nutrients.dryMatterIntake;
  checks.dryMatter = {
    required: requirements.nutrients.dryMatterIntake,
    provided: optimizedDiet.totalNutrients.dryMatter,
    coverage: dmCoverage,
    within_tolerance: dmCoverage >= BALANCE_TOLERANCE.min && dmCoverage <= BALANCE_TOLERANCE.max,
    status: getStatusFromCoverage(dmCoverage)
  };
  
  return checks;
}

/**
 * Prüft Mineral-Grenzen (Ca, P, Ca:P-Verhältnis)
 */
function checkMineralLimits(optimizedDiet) {
  const totalDM = optimizedDiet.totalNutrients.dryMatter;
  const caPhosphorusAnalysis = calculateCaPhosphorusAnalysis(optimizedDiet.composition, totalDM);
  
  return {
    calcium: {
      pct_dm: caPhosphorusAnalysis.calcium.pct_dm * 100, // Als Prozent
      within_limits: caPhosphorusAnalysis.calcium.within_limits,
      min_required: NUTRIENT_LIMITS.ca_pct_dm.min * 100,
      max_allowed: NUTRIENT_LIMITS.ca_pct_dm.max * 100,
      status: caPhosphorusAnalysis.calcium.within_limits ? 'ok' : 
              (caPhosphorusAnalysis.calcium.pct_dm < NUTRIENT_LIMITS.ca_pct_dm.min ? 'too_low' : 'too_high')
    },
    phosphorus: {
      pct_dm: caPhosphorusAnalysis.phosphorus.pct_dm * 100, // Als Prozent
      within_limits: caPhosphorusAnalysis.phosphorus.within_limits,
      min_required: NUTRIENT_LIMITS.p_pct_dm.min * 100,
      max_allowed: NUTRIENT_LIMITS.p_pct_dm.max * 100,
      status: caPhosphorusAnalysis.phosphorus.within_limits ? 'ok' : 
              (caPhosphorusAnalysis.phosphorus.pct_dm < NUTRIENT_LIMITS.p_pct_dm.min ? 'too_low' : 'too_high')
    },
    ca_p_ratio: {
      value: caPhosphorusAnalysis.ratio.value,
      within_limits: caPhosphorusAnalysis.ratio.within_limits,
      min_required: NUTRIENT_LIMITS.ca_p_ratio.min,
      max_allowed: NUTRIENT_LIMITS.ca_p_ratio.max,
      status: caPhosphorusAnalysis.ratio.within_limits ? 'ok' : 
              (caPhosphorusAnalysis.ratio.value < NUTRIENT_LIMITS.ca_p_ratio.min ? 'too_low' : 'too_high')
    }
  };
}

/**
 * Prüft Zutaten-Constraints
 */
function checkIngredientConstraints(optimizedDiet) {
  const totalDM = optimizedDiet.totalNutrients.dryMatter;
  const violations = checkIngredientLimits(optimizedDiet.composition, totalDM);
  
  return {
    violations,
    has_violations: violations.length > 0,
    total_violations: violations.length
  };
}

/**
 * Prüft Raufutter-Anforderungen
 */
function checkForageRequirements(optimizedDiet) {
  const totalDM = optimizedDiet.totalNutrients.dryMatter;
  const forageAnalysis = calculateForageContent(optimizedDiet.composition, totalDM);
  
  return {
    forage_pct: forageAnalysis.forage_pct_dm * 100, // Als Prozent
    meets_minimum: forageAnalysis.meets_minimum,
    minimum_required: forageAnalysis.minimum_required * 100,
    status: forageAnalysis.meets_minimum ? 'ok' : 'insufficient'
  };
}

/**
 * Bestimmt Status basierend auf Abdeckungsgrad
 */
function getStatusFromCoverage(coverage) {
  if (coverage < BALANCE_TOLERANCE.min) return 'too_low';
  if (coverage > BALANCE_TOLERANCE.max) return 'too_high';
  return 'ok';
}

/**
 * Sammelt alle Verletzungen und Warnungen
 */
function collectViolationsAndWarnings(analysis, nutrientChecks, mineralChecks, ingredientChecks, forageChecks) {
  // Pflichtnährstoff-Verletzungen
  Object.entries(nutrientChecks).forEach(([nutrient, check]) => {
    if (!check.within_tolerance) {
      analysis.violations.push({
        type: 'mandatory_nutrient',
        nutrient,
        severity: 'high',
        message: `${nutrient.toUpperCase()}: ${(check.coverage * 100).toFixed(1)}% (erforderlich: 95-105%)`,
        coverage: check.coverage
      });
    }
  });
  
  // Mineral-Verletzungen
  Object.entries(mineralChecks).forEach(([mineral, check]) => {
    if (!check.within_limits) {
      analysis.violations.push({
        type: 'mineral_limit',
        mineral,
        severity: 'high',
        message: `${mineral.toUpperCase()}: ${check.pct_dm?.toFixed(2) || check.value?.toFixed(2)}${mineral === 'ca_p_ratio' ? ':1' : '% TM'} (erlaubt: ${check.min_required}${mineral === 'ca_p_ratio' ? '' : '%'}-${check.max_allowed}${mineral === 'ca_p_ratio' ? ':1' : '% TM'})`,
        status: check.status
      });
    }
  });
  
  // Zutaten-Limit-Verletzungen
  if (ingredientChecks.has_violations) {
    ingredientChecks.violations.forEach(violation => {
      analysis.violations.push({
        type: 'ingredient_limit',
        ingredient: violation.ingredient,
        severity: 'medium',
        message: `${violation.ingredient}: ${violation.actual_pct.toFixed(1)}% TM (max: ${violation.max_pct.toFixed(1)}% TM)`,
        excess: violation.excess
      });
    });
  }
  
  // Raufutter-Verletzungen
  if (!forageChecks.meets_minimum) {
    analysis.violations.push({
      type: 'forage_minimum',
      severity: 'medium',
      message: `Raufutteranteil: ${forageChecks.forage_pct.toFixed(1)}% TM (min: ${forageChecks.minimum_required}% TM)`,
      deficit: forageChecks.minimum_required - forageChecks.forage_pct
    });
  }
}

/**
 * Generiert Empfehlungen zur Verbesserung
 */
function generateRecommendations(analysis, optimizedDiet, requirements) {
  const recommendations = [];
  
  analysis.violations.forEach(violation => {
    switch (violation.type) {
      case 'mandatory_nutrient':
        if (violation.nutrient === 'energy' && violation.coverage < 0.95) {
          recommendations.push('Erhöhen Sie energiereiche Futtermittel (Getreide, Fette)');
        } else if (violation.nutrient === 'protein' && violation.coverage < 0.95) {
          recommendations.push('Fügen Sie proteinreiche Futtermittel hinzu (Sojaschrot, Rapsschrot)');
        } else if (violation.coverage > 1.05) {
          recommendations.push(`Reduzieren Sie ${violation.nutrient}-reiche Komponenten zur Kostenoptimierung`);
        }
        break;
        
      case 'mineral_limit':
        if (violation.mineral === 'calcium' && violation.status === 'too_high') {
          recommendations.push('Reduzieren Sie calciumreiche Futtermittel oder Mineralstoffe');
        } else if (violation.mineral === 'phosphorus' && violation.status === 'too_low') {
          recommendations.push('Fügen Sie phosphorreiche Futtermittel hinzu (Kleie, Phosphate)');
        } else if (violation.mineral === 'ca_p_ratio') {
          recommendations.push('Adjustieren Sie das Ca:P-Verhältnis durch gezielte Mineralstoffgaben');
        }
        break;
        
      case 'ingredient_limit':
        recommendations.push(`Reduzieren Sie ${violation.ingredient} auf max. ${violation.max_pct?.toFixed(1)}% der Trockensubstanz`);
        break;
        
      case 'forage_minimum':
        recommendations.push('Erhöhen Sie den Raufutteranteil (Heu, Silage, Stroh) auf mindestens 30% TM');
        break;
    }
  });
  
  return [...new Set(recommendations)]; // Duplikate entfernen
}

/**
 * Erstellt benutzerfreundliche Balance-Nachricht
 */
export const getBalanceStatusMessage = (balanceAnalysis, language = 'de') => {
  const messages = {
    de: {
      balanced: 'Dieta balanceada ✅',
      not_balanced: 'Dieta nicht balanceada ❌',
      violations_count: (count) => `${count} Grenzwert${count > 1 ? 'e' : ''} überschritten`
    },
    es: {
      balanced: 'Dieta balanceada ✅',
      not_balanced: 'Dieta no balanceada ❌',
      violations_count: (count) => `${count} límite${count > 1 ? 's' : ''} excedido${count > 1 ? 's' : ''}`
    },
    en: {
      balanced: 'Balanced Diet ✅',
      not_balanced: 'Diet Not Balanced ❌',
      violations_count: (count) => `${count} limit${count > 1 ? 's' : ''} exceeded`
    }
  };
  
  const lang = messages[language] || messages.de;
  
  if (balanceAnalysis.isBalanced) {
    return {
      status: 'balanced',
      message: lang.balanced,
      color: 'green'
    };
  } else {
    return {
      status: 'not_balanced',
      message: `${lang.not_balanced} (${lang.violations_count(balanceAnalysis.violations.length)})`,
      color: 'red',
      violations: balanceAnalysis.violations
    };
  }
};