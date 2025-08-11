// Solver LP para formulación de dietas usando glpk.js (WASM browser-safe)
import { NUTRIENT_LIMITS } from './nutritionConstraints';
import { intensiveCategoryProfiles } from '../data/intensiveCategoryRequirements';
import GLPKFactory from 'glpk.js';

// Helper to resolve WASM path in CRA (expects glpk.wasm placed in public root or at /glpk/glpk.wasm)
function resolveGlpkWasmPath() {
  if (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL + '/glpk.wasm';
  }
  return '/glpk.wasm';
}

let glpkInstancePromise = null;
let glpkAvailabilityChecked = false;
let glpkWasmPresent = null; // tri-state: null unknown, boolean once checked

async function checkGlpkWasmExists(wasmPath) {
  if (glpkAvailabilityChecked) return glpkWasmPresent;
  glpkAvailabilityChecked = true;
  try {
    const res = await fetch(wasmPath, { method: 'HEAD' });
    glpkWasmPresent = res.ok;
    if (!res.ok) console.warn('[GLPK] WASM not found at', wasmPath, 'status', res.status);
  } catch (e) {
    console.warn('[GLPK] WASM HEAD check failed', e);
    glpkWasmPresent = false;
  }
  return glpkWasmPresent;
}

async function getGlpkInstance() {
  if (!glpkInstancePromise) {
    const wasmPath = resolveGlpkWasmPath();
    // Pre-flight check to avoid uncaught ErrorEvent from failed internal WASM fetch
    const exists = await checkGlpkWasmExists(wasmPath);
    if (!exists) {
      console.warn('[GLPK] Skipping initialization – glpk.wasm missing. Using heuristic fallback.');
      return null; // Force caller to fallback
    }
    console.log('[GLPK] Initializing with wasm path', wasmPath);
    glpkInstancePromise = GLPKFactory({ locateFile: (file) => {
      if (file === 'glpk.wasm') return wasmPath; // custom path
      return file;
    }}).catch(err => {
      console.error('[GLPK] Initialization failed', err);
      glpkInstancePromise = null;
      throw err;
    });
  }
  return glpkInstancePromise;
}

/**
 * Construye y resuelve un modelo LP de minimización de costo con múltiples restricciones nutricionales usando GLPK
 * Decision variables: cantidad (kg as-fed) de cada ingrediente
 * Objetivo: minimizar costo total
 */
export async function solveDietLP(requirements, ingredients, constraints = {}) {
  console.log('[LP] solveDietLP start', { requirements, ingredientCount: ingredients?.length, constraints });
  const { totalME, crudeProteinRequired, calciumRequired, phosphorusRequired, dryMatterIntake } = requirements || {};
  if (!requirements || !ingredients || ingredients.length === 0) {
    console.warn('[LP] Missing requirements or ingredients');
    return { isFeasible: false, message: 'Faltan datos para optimizar' };
  }

  const category = constraints.category;
  const profile = category ? intensiveCategoryProfiles[category] : null;
  if (!ingredients || ingredients.length === 0) return null;

  // Convert requirements
  const caReqKg = calciumRequired / 1000;
  const pReqKg = phosphorusRequired / 1000;

  // Build columns (variables)
  const cols = [];
  const varIndexMap = {}; // id -> 1-based index

  ingredients.forEach((ing, idx) => {
    varIndexMap[ing.id] = idx + 1; // GLPK columns 1..n
    cols.push({
      name: ing.id,
      kind: 'glp_cv', // continuous variable
      bounds: { type: 'glp_lo', lb: 0, ub: 0 } // set later if needed (default >=0)
    });
  });

  // Helper arrays for constraint matrix
  // We'll accumulate rows with sparse coefficients
  const rows = [];
  function addRow(name, type, lb, ub, coeffsObj) {
    rows.push({ name, bounds: { type, lb, ub }, coeffs: coeffsObj });
  }

  // Core constraints (>= / <= / == handled via types)
  // Energy >= totalME
  addRow('energy_min', 'glp_lo', +totalME.toFixed(4), 0, {});
  // Protein >= crudeProteinRequired
  addRow('protein_min', 'glp_lo', +crudeProteinRequired.toFixed(4), 0, {});
  // Calcium >= caReqKg
  addRow('calcium_min', 'glp_lo', +caReqKg.toFixed(5), 0, {});
  // Phosphorus >= pReqKg
  addRow('phosphorus_min', 'glp_lo', +pReqKg.toFixed(5), 0, {});
  // DM range 95% - 105%
  const dmMin = +(dryMatterIntake * 0.95).toFixed(4);
  const dmMax = +(dryMatterIntake * 1.05).toFixed(4);
  addRow('dm_minmax', 'glp_db', dmMin, dmMax, {});

  // Profile density constraints: transform to linear form
  // energyDensityMin: energy - minDensity * DM >= 0
  if (profile?.meDensity) {
    addRow('energy_density_min', 'glp_lo', 0, 0, {});
    addRow('energy_density_max', 'glp_up', 0, 0, {}); // energy - maxDensity*DM <= 0
  }
  if (profile?.crudeProteinPct) {
    addRow('cp_density_min', 'glp_lo', 0, 0, {});
    addRow('cp_density_max', 'glp_up', 0, 0, {});
  }
  if (profile?.ndfPct) {
    addRow('ndf_density_min', 'glp_lo', 0, 0, {});
    addRow('ndf_density_max', 'glp_up', 0, 0, {});
  }
  if (profile?.starchPct) {
    addRow('starch_density_max', 'glp_up', 0, 0, {});
  }
  if (profile?.fatPct) {
    addRow('fat_density_max', 'glp_up', 0, 0, {});
  }

  // General NDF if no profile (ya existe). Añadir límite global de grasa si definido
  if (!profile && NUTRIENT_LIMITS?.ndf_pct_dm) {
    const ndfMinKg = dryMatterIntake * NUTRIENT_LIMITS.ndf_pct_dm.min;
    const ndfMaxKg = dryMatterIntake * NUTRIENT_LIMITS.ndf_pct_dm.max;
    addRow('ndf_range', 'glp_db', +ndfMinKg.toFixed(4), +ndfMaxKg.toFixed(4), {});
  }
  if (NUTRIENT_LIMITS?.fat_pct_dm?.max) {
    const fatMaxKg = dryMatterIntake * NUTRIENT_LIMITS.fat_pct_dm.max;
    addRow('fat_max', 'glp_up', 0, +fatMaxKg.toFixed(4), {});
  }

  // Ca:P ratio -> calcium - R * phosphorus >= 0 and <= 0 for min/max
  if (NUTRIENT_LIMITS?.ca_p_ratio) {
    addRow('ca_p_min', 'glp_lo', 0, 0, {});
    addRow('ca_p_max', 'glp_up', 0, 0, {});
  }

  // Category caps
  const categoryLimits = constraints.categoryLimits || {};
  const defaultCategoryMax = {
    forrajes_secos: dryMatterIntake * 0.70,
    pastos_verdes: dryMatterIntake * 0.10,
    ensilados: dryMatterIntake * 0.60,
    alimentos_energeticos: dryMatterIntake * 0.65,
    suplementos_proteicos: dryMatterIntake * 0.25,
    minerales: dryMatterIntake * 0.02,
    vitaminas: dryMatterIntake * 0.01,
    aditivos: dryMatterIntake * 0.02
  };

  const categoryRows = {}; // map category -> row name

  // Ingredient share (individual upper bounds via new row) implemented as <= maxKg of DM
  const ingredientLimitRows = [];

  // Forage min (sum DM of forage cats >= 30% DM)
  let needForageMin = ingredients.some(i => ['forrajes_secos','pastos_verdes','ensilados'].includes(i.category));
  if (needForageMin) {
    addRow('forage_min', 'glp_lo', +(dryMatterIntake * 0.30).toFixed(4), 0, {});
  }

  // Populate coefficients per ingredient
  ingredients.forEach(ing => {
    const comp = ing.composition;
    if (!comp?.dryMatter || !comp.metabolizableEnergy) return;
    const dmF = comp.dryMatter / 100; // DM fraction
    // Mapear NDF: usar comp.ndf si existe, sino fallback a comp.fiber
    const ndfPct = comp.ndf != null ? comp.ndf : (comp.fiber != null ? comp.fiber : null);
    // Asignar crudeFat para aceite / sebo si no definido
    let crudeFatPct = comp.crudeFat;
    if (crudeFatPct == null) {
      if (ing.id === 'aceite_soya' || ing.id === 'sebo_bovino') crudeFatPct = 100;
    }
    const energyKg = dmF * comp.metabolizableEnergy;
    const proteinKg = dmF * (comp.crudeProtein || 0) / 100;
    const calciumKg = dmF * (comp.calcium || 0) / 100;
    const phosphorusKg = dmF * (comp.phosphorus || 0) / 100;
    const ndfKg = ndfPct != null ? dmF * (ndfPct / 100) : 0;
    const starchKg = comp.starch != null ? dmF * (comp.starch / 100) : 0;
    const fatKg = crudeFatPct != null ? dmF * (crudeFatPct / 100) : 0;

    const col = varIndexMap[ing.id];

    function setCoeff(rowName, value) {
      const row = rows.find(r => r.name === rowName);
      if (row) row.coeffs[col] = value;
    }

    // Core
    setCoeff('energy_min', energyKg);
    setCoeff('protein_min', proteinKg);
    setCoeff('calcium_min', calciumKg);
    setCoeff('phosphorus_min', phosphorusKg);
    setCoeff('dm_minmax', dmF);

    // Profile densities
    if (profile?.meDensity) {
      setCoeff('energy_density_min', energyKg - profile.meDensity.min * dmF);
      setCoeff('energy_density_max', energyKg - profile.meDensity.max * dmF);
    }
    if (profile?.crudeProteinPct) {
      setCoeff('cp_density_min', proteinKg - (profile.crudeProteinPct.min / 100) * dmF);
      setCoeff('cp_density_max', proteinKg - (profile.crudeProteinPct.max / 100) * dmF);
    }
    if (profile?.ndfPct) {
      setCoeff('ndf_density_min', ndfKg - (profile.ndfPct.min / 100) * dmF);
      setCoeff('ndf_density_max', ndfKg - (profile.ndfPct.max / 100) * dmF);
    }
    if (profile?.starchPct) {
      setCoeff('starch_density_max', starchKg - (profile.starchPct.max / 100) * dmF);
    }
    if (profile?.fatPct) {
      setCoeff('fat_density_max', fatKg - (profile.fatPct.max / 100) * dmF);
    }

    if (!profile && NUTRIENT_LIMITS?.ndf_pct_dm) {
      setCoeff('ndf_range', ndfKg);
    }
    if (NUTRIENT_LIMITS?.fat_pct_dm?.max) {
      setCoeff('fat_max', fatKg);
    }

    // Category caps
    if (ing.category) {
      const maxCat = categoryLimits[ing.category] ?? defaultCategoryMax[ing.category];
      if (maxCat) {
        const rowName = 'cat_' + ing.category;
        if (!categoryRows[ing.category]) {
          addRow(rowName, 'glp_up', 0, +maxCat.toFixed(4), {});
          categoryRows[ing.category] = rowName;
        }
        setCoeff(rowName, dmF);
      }
    }

    // Ingredient individual limit (share default) -> create row with upper bound of kg DM
    const explicitIngLimit = constraints.ingredientLimits?.[ing.id]?.max;
    // maxUsage (%) -> límite en kg de MS: (maxUsage/100)*dryMatterIntake
    let maxKgDM = null;
    if (ing.maxUsage != null) {
      maxKgDM = dryMatterIntake * (ing.maxUsage / 100);
    }
    if (explicitIngLimit) {
      // si se pasa límite explícito (as-fed), se prioriza ese (convertir a DM si quisieras, aquí se deja as-fed clásico)
      const rowName = ing.id + '_max_explicit';
      addRow(rowName, 'glp_up', 0, explicitIngLimit, { [col]: 1 });
    }
    if (maxKgDM != null) {
      const rowName = ing.id + '_maxUsage';
      addRow(rowName, 'glp_up', 0, +maxKgDM.toFixed(4), { [col]: dmF });
    }

    // Forage min
    if (needForageMin && ['forrajes_secos','pastos_verdes','ensilados'].includes(ing.category)) {
      setCoeff('forage_min', dmF);
    }
  });

  // Objective coefficients (cost)
  const objective = { direction: 'min', name: 'cost', vars: {} };
  ingredients.forEach(ing => {
    objective.vars[ing.id] = ing.costPerKg || 0.3;
  });

  // Build GLPK problem object
  const glpkProblem = {
    name: 'diet_lp',
    objective,
    subjectTo: rows.map(r => ({
      name: r.name,
      vars: Object.entries(r.coeffs).map(([colIndex, val]) => ({ name: ingredients[colIndex - 1].id, coef: val })),
      bounds: r.bounds
    })),
    bounds: cols.map(c => ({ name: c.name, bounds: { type: 'glp_lo', lb: 0, ub: 0 } })),
    generals: [],
    binaries: []
  };

  try {
    const glpk = await getGlpkInstance();
    if (!glpk || !glpk.solve) {
      return { isFeasible:false, message:'GLPK no disponible (WASM no cargado)', profileApplied: !!profile };
    }
    console.log('[LP] GLPK instance ready');
    const res = glpk.solve(glpkProblem, { msgLevel: 'GLP_MSG_OFF' });
    console.log('[LP] Solve status', res.result?.status);
    if (!res.result || res.result.status !== 'glp_opt') {
      return { isFeasible: false, message: res.result ? 'Modelo infeasible' : 'Error interno solver', profileApplied: !!profile };
    }

    // Extract solution
    const values = res.result.vars;
    const composition = [];
    let totalCost = 0;
    const totals = { energy: 0, protein: 0, calcium: 0, phosphorus: 0, dryMatter: 0, ndf: 0, starch: 0, fat: 0 };

    ingredients.forEach(ing => {
      const qty = values[ing.id];
      if (qty && qty > 1e-6) {
        const c = ing.composition;
        const dmF = c.dryMatter / 100;
        const ndfPct = c.ndf != null ? c.ndf : (c.fiber != null ? c.fiber : null);
        let crudeFatPct = c.crudeFat;
        if (crudeFatPct == null) {
          if (ing.id === 'aceite_soya' || ing.id === 'sebo_bovino') crudeFatPct = 100;
        }
        const energy = qty * dmF * c.metabolizableEnergy;
        const protein = qty * dmF * (c.crudeProtein || 0) / 100;
        const calcium = qty * dmF * (c.calcium || 0) / 100 * 1000; // g
        const phosphorus = qty * dmF * (c.phosphorus || 0) / 100 * 1000; // g
        const dm = qty * dmF;
        const ndf = ndfPct != null ? dm * (ndfPct / 100) : 0;
        const starch = c.starch != null ? dm * (c.starch / 100) : 0;
        const fat = crudeFatPct != null ? dm * (crudeFatPct / 100) : 0;

        totalCost += qty * (ing.costPerKg || 0);
        totals.energy += energy;
        totals.protein += protein;
        totals.calcium += calcium;
        totals.phosphorus += phosphorus;
        totals.dryMatter += dm;
        totals.ndf += ndf;
        totals.starch += starch;
        totals.fat += fat;

        composition.push({
          ingredient: ing,
          amount: +qty.toFixed(3),
          contribution: {
            energy: +energy.toFixed(2),
            protein: +protein.toFixed(2),
            calcium: +(calcium / 1000).toFixed(3),
            phosphorus: +(phosphorus / 1000).toFixed(3),
            dryMatter: +dm.toFixed(3),
            ndf: +ndf.toFixed(3),
            starch: +starch.toFixed(3),
            fat: +fat.toFixed(3)
          }
        });
      }
    });

    const adequacy = {
      energy: +(totals.energy / totalME * 100).toFixed(1),
      protein: +(totals.protein / crudeProteinRequired * 100).toFixed(1),
      calcium: +(totals.calcium / calciumRequired * 100).toFixed(1),
      phosphorus: +(totals.phosphorus / phosphorusRequired * 100).toFixed(1),
      dryMatter: +(totals.dryMatter / dryMatterIntake * 100).toFixed(1),
      ndf_pct_dm: totals.dryMatter ? +((totals.ndf / totals.dryMatter) * 100).toFixed(1) : 0,
      starch_pct_dm: totals.dryMatter ? +((totals.starch / totals.dryMatter) * 100).toFixed(1) : 0,
      fat_pct_dm: totals.dryMatter ? +((totals.fat / totals.dryMatter) * 100).toFixed(1) : 0
    };

    return {
      isFeasible: true,
      composition,
      totalCost: +totalCost.toFixed(2),
      totalNutrients: {
        energy: +totals.energy.toFixed(2),
        protein: +totals.protein.toFixed(2),
        calcium: +totals.calcium.toFixed(1),
        phosphorus: +totals.phosphorus.toFixed(1),
        dryMatter: +totals.dryMatter.toFixed(2),
        ndfKg: +totals.ndf.toFixed(2),
        starchKg: +totals.starch.toFixed(2),
        fatKg: +totals.fat.toFixed(2)
      },
      adequacy,
      profileApplied: !!profile,
      profileReference: profile || null,
      modelMeta: { category, constraintsApplied: { categoryLimits, ingredientLimits: constraints.ingredientLimits || {} } }
    };
  } catch (err) {
    console.warn('GLPK solve error:', err);
    return { isFeasible: false, message: err.message || 'Error en solver', profileApplied: !!profile, error: true };
  }
}
