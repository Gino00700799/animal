// Cálculos de requerimientos nutricionales según estándares FAO (adaptado a sistema intensivo feedlot)
// Basado en FAO Animal Production and Health Paper y referencias NASEM para engorde intensivo

/**
 * Energía neta mantenimiento (MJ NE/día)
 */
export const calculateMaintenanceNetEnergy = (weight) => 0.293 * Math.pow(weight, 0.75);

/**
 * Conversión NE -> ME (Km ≈ 0.67)
 */
export const convertNetToMetabolizable = (netEnergy, efficiency = 0.67) => netEnergy / efficiency;

/**
 * Factor de actividad según categoría (solo intensivo)
 */
export const getActivityFactor = (category) => {
  const map = {
    ternero_destetado: 0.10,
    ternero_recria: 0.10,
    novillo_crecimiento: 0.10,
    novillo_engorde: 0.10,
    novillo_terminacion: 0.08, // Menor movimiento al final
    toro_engorde: 0.10
  };
  return map[category] ?? 0.10;
};

export const calculateActivityEnergy = (weight, activityFactor = 0.1) => {
  const maintenanceNE = calculateMaintenanceNetEnergy(weight);
  const maintenanceME = convertNetToMetabolizable(maintenanceNE);
  return maintenanceME * activityFactor;
};

/**
 * Energía crecimiento (MJ ME/kg ganancia)
 * Ajustado a mayor eficiencia a mayor peso.
 */
export const getGrowthEnergyFactor = (weight) => {
  if (weight < 250) return 19; // ternero destetado
  if (weight < 350) return 17; // recría / crecimiento temprano
  if (weight < 450) return 16; // crecimiento / engorde
  if (weight < 550) return 15; // engorde intermedio
  return 14; // terminación
};

export const calculateGrowthEnergy = (dailyGain, weight) => getGrowthEnergyFactor(weight) * dailyGain;

/**
 * Requerimiento total ME
 */
export const calculateTotalEnergyRequirement = (weight, dailyGain, activityFactor = 0.1) => {
  const maintenanceNE = calculateMaintenanceNetEnergy(weight);
  const maintenanceME = convertNetToMetabolizable(maintenanceNE);
  const activityME = calculateActivityEnergy(weight, activityFactor);
  const growthME = calculateGrowthEnergy(dailyGain, weight);
  const totalME = maintenanceME + activityME + growthME;
  return {
    maintenanceNE: +maintenanceNE.toFixed(2),
    maintenanceME: +maintenanceME.toFixed(2),
    activityME: +activityME.toFixed(2),
    growthME: +growthME.toFixed(2),
    totalME: +totalME.toFixed(2)
  };
};

/**
 * Consumo de MS estimado (% PV) en intensivo
 */
export const estimateDryMatterIntake = (weight, category) => {
  const perc = {
    ternero_destetado: 0.032,
    ternero_recria: 0.031,
    novillo_crecimiento: 0.029,
    novillo_engorde: 0.0275,
    novillo_terminacion: 0.026,
    toro_engorde: 0.027
  };
  return weight * (perc[category] ?? 0.028);
};

/**
 * Tabla intensiva (valores orientativos de % en MS de dieta) - CP Ca P
 */
const intensiveTable = [
  { w: 170, g: 1.0, cp: 17.5, ca: 0.48, p: 0.30, dmpct: 3.2 },
  { w: 200, g: 1.2, cp: 17.0, ca: 0.46, p: 0.28, dmpct: 3.15 },
  { w: 240, g: 1.3, cp: 16.5, ca: 0.44, p: 0.26, dmpct: 3.1 },
  { w: 300, g: 1.4, cp: 15.8, ca: 0.40, p: 0.24, dmpct: 3.0 },
  { w: 330, g: 1.5, cp: 15.2, ca: 0.38, p: 0.23, dmpct: 2.95 },
  { w: 400, g: 1.6, cp: 14.5, ca: 0.34, p: 0.21, dmpct: 2.85 },
  { w: 470, g: 1.6, cp: 13.8, ca: 0.32, p: 0.20, dmpct: 2.75 },
  { w: 520, g: 1.7, cp: 13.5, ca: 0.30, p: 0.19, dmpct: 2.65 },
  { w: 520, g: 1.9, cp: 14.2, ca: 0.32, p: 0.20, dmpct: 2.7 }
];

/**
 * Selección del punto más cercano
 */
export const interpolateNutrientRequirements = (weight, dailyGain) => {
  let closest = intensiveTable[0];
  let bestDist = Infinity;
  for (const row of intensiveTable) {
    const d = Math.abs(weight - row.w) + Math.abs(dailyGain - row.g) * 80;
    if (d < bestDist) { bestDist = d; closest = row; }
  }
  const dmIntake = weight * (closest.dmpct / 100);
  const cpReqKg = dmIntake * closest.cp / 100;
  const caReqG = dmIntake * closest.ca / 100 * 1000;
  const pReqG = dmIntake * closest.p / 100 * 1000;
  return {
    crudeProteinPercent: +closest.cp.toFixed(1),
    calciumPercent: +closest.ca.toFixed(3),
    phosphorusPercent: +closest.p.toFixed(3),
    dryMatterIntake: +dmIntake.toFixed(2),
    crudeProteinRequired: +cpReqKg.toFixed(2),
    calciumRequired: +caReqG.toFixed(1),
    phosphorusRequired: +pReqG.toFixed(1)
  };
};

/**
 * Requerimientos completos
 */
export const calculateCompleteNutrientRequirements = (animalData) => {
  const { weight, dailyGain, category } = animalData;
  const activityFactor = getActivityFactor(category);
  const energy = calculateTotalEnergyRequirement(weight, dailyGain, activityFactor);
  const nutrients = interpolateNutrientRequirements(weight, dailyGain);
  return {
    energy,
    nutrients,
    waterRequirement: calculateWaterRequirement(weight, nutrients.dryMatterIntake)
  };
};

/** Agua (L/día) */
export const calculateWaterRequirement = (weight, dmIntake) => {
  const base = weight * 0.035;
  const feed = dmIntake * 4;
  return +(base + feed).toFixed(1);
};