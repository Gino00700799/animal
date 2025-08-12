// Optimización de dietas usando únicamente Programación Lineal (GLPK)
// Se eliminan modos heurísticos y Cuadrado de Pearson a pedido del usuario.

import { solveDietLP } from './lpDietSolver';

/**
 * Optimiza la dieta usando el solver LP (GLPK)
 * @param {object} requirements { totalME, crudeProteinRequired, calciumRequired, phosphorusRequired, dryMatterIntake }
 * @param {array} ingredients lista de ingredientes seleccionados
 * @param {object} constraints restricciones opcionales (category, categoryLimits, ingredientLimits)
 * @returns {Promise<object>} resultado del solver
 */
export const optimizeDiet = async (requirements, ingredients, constraints = {}) => {
  try {
    console.log('[OPT] Starting optimization', { req: requirements, ingredientCount: ingredients?.length });
    const lpSolution = await solveDietLP(requirements, ingredients, constraints);
    console.log('[OPT] LP solution raw', lpSolution);
    if (lpSolution && lpSolution.isFeasible) {
      return { ...lpSolution, method: 'Programación Lineal (GLPK)' };
    }
    return {
      isFeasible: false,
      composition: [],
      totalNutrients: { energy: 0, protein: 0, calcium: 0, phosphorus: 0, dryMatter: 0 },
      totalCost: 0,
      message: lpSolution?.message || 'Modelo no factible',
      method: 'Programación Lineal (GLPK)'
    };
  } catch (e) {
    console.error('[OPT] Exception in optimizeDiet', e);
    return {
      isFeasible: false,
      composition: [],
      totalNutrients: { energy: 0, protein: 0, calcium: 0, phosphorus: 0, dryMatter: 0 },
      totalCost: 0,
      message: e.message || 'Error solver',
      method: 'Programación Lineal (GLPK)'
    };
  }
};

// Validación (se mantiene igual)
export const validateDiet = (diet, requirements) => {
  const { checkDietBalance } = require('./nutritionConstraints');
  if (!diet || !diet.totalNutrients) {
    return { isValid: false, warnings: ['Sin datos de nutrientes'], errors: ['Dieta inválida'], balanceDetails: null };
    }
  const balanceCheck = checkDietBalance(diet, requirements);
  return {
    isValid: balanceCheck.isBalanced,
    warnings: balanceCheck.warnings,
    errors: balanceCheck.reasons,
    balanceDetails: balanceCheck
  };
};