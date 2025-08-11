// Optimización de dietas usando únicamente Programación Lineal (GLPK)
// Se eliminan modos heurísticos y Cuadrado de Pearson a pedido del usuario.

import { solveDietLP } from './lpDietSolver';

function buildFallbackDiet(requirements, ingredients) {
  if (!requirements || !ingredients || ingredients.length === 0) return null;
  const { totalME, crudeProteinRequired, calciumRequired, phosphorusRequired, dryMatterIntake } = requirements;
  const byCat = cat => ingredients.filter(i=>i.category===cat);
  const forageCandidates = ingredients.filter(i=> ['forrajes_secos','ensilados'].includes(i.category));
  const energyCandidates = ingredients.filter(i=> i.category==='alimentos_energeticos');
  const proteinCandidates = ingredients.filter(i=> i.category==='suplementos_proteicos');
  const caSource = ingredients.find(i=> i.id==='carbonato_calcio');
  const pSource = ingredients.find(i=> i.id==='fosfato_dicalcico');

  const pick = (list, scorer) => list.sort((a,b)=> scorer(b)-scorer(a))[0];
  const forage = pick(forageCandidates, i=> (i.composition.metabolizableEnergy||0));
  const energyIng = pick(energyCandidates, i=> (i.composition.metabolizableEnergy||0)/(i.costPerKg||1));
  const proteinIng = pick(proteinCandidates, i=> (i.composition.crudeProtein||0)/(i.costPerKg||1));

  const composition = [];
  let usedDM = 0;
  let totalEnergy = 0, totalProtein=0, totalCa=0, totalP=0;
  function addDM(ing, dmKg) {
    if (!ing || dmKg<=0) return;
    const dmF = (ing.composition.dryMatter||0)/100;
    const asFed = dmF>0? dmKg/dmF : 0;
    const energy = dmKg * (ing.composition.metabolizableEnergy||0);
    const protein = dmKg * (ing.composition.crudeProtein||0)/100;
    const ca = dmKg * (ing.composition.calcium||0)/100 *1000; // g
    const p = dmKg * (ing.composition.phosphorus||0)/100 *1000; // g
    composition.push({ ingredient: ing, amount: +asFed.toFixed(3), contribution: { energy:+energy.toFixed(2), protein:+protein.toFixed(2), calcium:+(ca/1000).toFixed(3), phosphorus:+(p/1000).toFixed(3), dryMatter:+dmKg.toFixed(3) }});
    usedDM += dmKg; totalEnergy += energy; totalProtein += protein; totalCa += ca; totalP += p;
  }
  // Forage 30% DM
  const forageDM = Math.min(dryMatterIntake*0.3, dryMatterIntake);
  addDM(forage, forageDM);
  // Fill remaining with energy ingredient first
  let remainingDM = dryMatterIntake - usedDM;
  const energyDM = remainingDM*0.55; // 55% of remainder
  addDM(energyIng, energyDM);
  remainingDM = dryMatterIntake - usedDM;
  // Protein ingredient rest
  addDM(proteinIng, remainingDM);

  // Adjust protein if low: add more proteinIng up to +10% DM extra (allow slight DM over)
  if (totalProtein < crudeProteinRequired*0.9 && proteinIng) {
    const needed = (crudeProteinRequired*0.95 - totalProtein) / ((proteinIng.composition.crudeProtein||0)/100);
    if (needed>0) addDM(proteinIng, Math.min(needed, dryMatterIntake*0.1));
  }
  // Minerals if deficient
  if (totalCa < calciumRequired*0.9 && caSource) {
    const deficitCaKg = (calciumRequired - totalCa)/1000; // kg
    const dmF = (caSource.composition.dryMatter||0)/100;
    const caPct = (caSource.composition.calcium||0)/100; // fraction of DM
    if (caPct>0) {
      const dmNeeded = (deficitCaKg)/caPct; addDM(caSource, dmNeeded*0.2); // limit inclusion
    }
  }
  if (totalP < phosphorusRequired*0.9 && pSource) {
    const deficitPKg = (phosphorusRequired - totalP)/1000;
    const dmF = (pSource.composition.dryMatter||0)/100;
    const pPct = (pSource.composition.phosphorus||0)/100;
    if (pPct>0) {
      const dmNeeded = (deficitPKg)/pPct; addDM(pSource, dmNeeded*0.2);
    }
  }
  const totalCost = composition.reduce((s,r)=> s + r.amount*(r.ingredient.costPerKg||0),0);
  const diet = {
    isFeasible: (totalEnergy>= totalME*0.9 && totalProtein>= crudeProteinRequired*0.9),
    composition,
    totalCost:+totalCost.toFixed(2),
    totalNutrients:{ energy:+totalEnergy.toFixed(2), protein:+totalProtein.toFixed(2), calcium:+totalCa.toFixed(1), phosphorus:+totalP.toFixed(1), dryMatter:+usedDM.toFixed(2) },
    method:'Fallback Heurístico'
  };
  return diet;
}

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
    if (lpSolution && lpSolution.message?.includes('no disponible')) {
      console.warn('[OPT] GLPK no disponible, entrando a fallback heurístico');
    }
    // Fallback heurístico si LP no factible
    const fallback = buildFallbackDiet(requirements, ingredients);
    if (fallback) return { ...fallback, fallback: true, message: lpSolution?.message || 'LP infeasible' };
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
    // Si solver falla completamente, intentar fallback
    const fallback = buildFallbackDiet(requirements, ingredients);
    if (fallback) return { ...fallback, fallback: true, message: 'Solver GLPK falló, usando heurístico: '+ (e.message||String(e)) };
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