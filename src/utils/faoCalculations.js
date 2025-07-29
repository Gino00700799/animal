// Cálculos de requerimientos nutricionales según estándares FAO
// Basado en FAO Animal Production and Health Paper y tablas NASEM/OSU

/**
 * Calcula la energía neta para mantenimiento según FAO
 * Fórmula: Em = 0.293 × W^0.75 (MJ NE/día)
 * @param {number} weight - Peso corporal en kg
 * @returns {number} Energía neta para mantenimiento en MJ NE/día
 */
export const calculateMaintenanceNetEnergy = (weight) => {
  return 0.293 * Math.pow(weight, 0.75);
};

/**
 * Convierte energía neta a energía metabolizable
 * ME = NE / Km, donde Km ≈ 0.67 para mantenimiento
 * @param {number} netEnergy - Energía neta en MJ
 * @param {number} efficiency - Eficiencia de utilización (default 0.67)
 * @returns {number} Energía metabolizable en MJ
 */
export const convertNetToMetabolizable = (netEnergy, efficiency = 0.67) => {
  return netEnergy / efficiency;
};

/**
 * Calcula energía para actividad/forrajeo
 * Ef = 1.8/1000 × W × d (MJ ME/día)
 * @param {number} weight - Peso corporal en kg
 * @param {number} distance - Distancia diaria recorrida en km (default 2 km)
 * @returns {number} Energía para actividad en MJ ME/día
 */
export const calculateActivityEnergy = (weight, distance = 2) => {
  return (1.8 / 1000) * weight * distance;
};

/**
 * Calcula energía para crecimiento
 * MEg = 16 × g (MJ ME/día) donde g es ganancia diaria en kg
 * @param {number} dailyGain - Ganancia diaria deseada en kg
 * @returns {number} Energía para crecimiento en MJ ME/día
 */
export const calculateGrowthEnergy = (dailyGain) => {
  return 16 * dailyGain;
};

/**
 * Calcula el requerimiento total de energía metabolizable
 * @param {number} weight - Peso corporal en kg
 * @param {number} dailyGain - Ganancia diaria en kg
 * @param {number} distance - Distancia diaria recorrida en km
 * @returns {object} Desglose de energía requerida
 */
export const calculateTotalEnergyRequirement = (weight, dailyGain, distance = 2) => {
  const maintenanceNE = calculateMaintenanceNetEnergy(weight);
  const maintenanceME = convertNetToMetabolizable(maintenanceNE);
  const activityME = calculateActivityEnergy(weight, distance);
  const growthME = calculateGrowthEnergy(dailyGain);
  
  const totalME = maintenanceME + activityME + growthME;
  
  return {
    maintenanceNE: parseFloat(maintenanceNE.toFixed(2)),
    maintenanceME: parseFloat(maintenanceME.toFixed(2)),
    activityME: parseFloat(activityME.toFixed(2)),
    growthME: parseFloat(growthME.toFixed(2)),
    totalME: parseFloat(totalME.toFixed(2))
  };
};

/**
 * Estima el consumo de materia seca basado en peso corporal
 * Generalmente 2-3% del peso corporal para animales en crecimiento
 * @param {number} weight - Peso corporal en kg
 * @param {string} category - Categoría del animal
 * @returns {number} Consumo de materia seca en kg/día
 */
export const estimateDryMatterIntake = (weight, category) => {
  const intakePercentages = {
    becerro_destetado: 0.028, // 2.8% del peso corporal
    torete: 0.026, // 2.6%
    novillo: 0.024, // 2.4%
    novillo_final: 0.022, // 2.2%
    toro_adulto: 0.020 // 2.0%
  };
  
  const percentage = intakePercentages[category] || 0.024;
  return weight * percentage;
};

/**
 * Tabla de requerimientos de nutrientes basada en NASEM/OSU
 * Interpolación para diferentes pesos y ganancias
 */
const nasemNutrientTable = [
  // Peso (kg), Ganancia (kg/día), CP (%), Ca (%), P (%), MS intake (% peso)
  { weight: 200, gain: 0.5, cp: 14.5, ca: 0.31, p: 0.18, dmIntake: 2.8 },
  { weight: 200, gain: 0.7, cp: 16.2, ca: 0.35, p: 0.20, dmIntake: 2.9 },
  { weight: 250, gain: 0.6, cp: 13.8, ca: 0.29, p: 0.17, dmIntake: 2.7 },
  { weight: 250, gain: 0.8, cp: 15.5, ca: 0.33, p: 0.19, dmIntake: 2.8 },
  { weight: 300, gain: 0.7, cp: 13.2, ca: 0.27, p: 0.16, dmIntake: 2.6 },
  { weight: 300, gain: 0.9, cp: 14.8, ca: 0.31, p: 0.18, dmIntake: 2.7 },
  { weight: 400, gain: 0.9, cp: 12.5, ca: 0.25, p: 0.15, dmIntake: 2.5 },
  { weight: 400, gain: 1.1, cp: 14.0, ca: 0.29, p: 0.17, dmIntake: 2.6 },
  { weight: 500, gain: 1.0, cp: 11.8, ca: 0.23, p: 0.14, dmIntake: 2.4 },
  { weight: 500, gain: 1.2, cp: 13.2, ca: 0.27, p: 0.16, dmIntake: 2.5 },
  { weight: 600, gain: 1.1, cp: 11.2, ca: 0.21, p: 0.13, dmIntake: 2.3 },
  { weight: 600, gain: 1.3, cp: 12.5, ca: 0.25, p: 0.15, dmIntake: 2.4 },
  { weight: 700, gain: 0.0, cp: 9.5, ca: 0.18, p: 0.12, dmIntake: 2.0 }, // mantenimiento
  { weight: 800, gain: 0.0, cp: 9.0, ca: 0.16, p: 0.11, dmIntake: 2.0 }
];

/**
 * Interpola los requerimientos de nutrientes basado en peso y ganancia
 * @param {number} weight - Peso corporal en kg
 * @param {number} dailyGain - Ganancia diaria en kg
 * @returns {object} Requerimientos de nutrientes
 */
export const interpolateNutrientRequirements = (weight, dailyGain) => {
  // Buscar los puntos más cercanos en la tabla
  let closest = nasemNutrientTable[0];
  let minDistance = Math.abs(weight - closest.weight) + Math.abs(dailyGain - closest.gain) * 100;
  
  for (const entry of nasemNutrientTable) {
    const distance = Math.abs(weight - entry.weight) + Math.abs(dailyGain - entry.gain) * 100;
    if (distance < minDistance) {
      minDistance = distance;
      closest = entry;
    }
  }
  
  // Interpolación simple basada en peso si no hay coincidencia exacta
  const weightRatio = weight / closest.weight;
  const gainRatio = dailyGain / closest.gain || 1;
  
  const dmIntake = weight * (closest.dmIntake / 100);
  
  return {
    crudeProteinPercent: parseFloat((closest.cp * gainRatio).toFixed(1)),
    calciumPercent: parseFloat((closest.ca * weightRatio).toFixed(3)),
    phosphorusPercent: parseFloat((closest.p * weightRatio).toFixed(3)),
    dryMatterIntake: parseFloat(dmIntake.toFixed(1)),
    crudeProteinRequired: parseFloat((dmIntake * closest.cp * gainRatio / 100).toFixed(2)),
    calciumRequired: parseFloat((dmIntake * closest.ca * weightRatio / 100 * 1000).toFixed(1)), // gramos
    phosphorusRequired: parseFloat((dmIntake * closest.p * weightRatio / 100 * 1000).toFixed(1)) // gramos
  };
};

/**
 * Calcula todos los requerimientos nutricionales para un animal
 * @param {object} animalData - Datos del animal (peso, ganancia, categoría)
 * @returns {object} Requerimientos completos
 */
export const calculateCompleteNutrientRequirements = (animalData) => {
  const { weight, dailyGain, category, distance = 2 } = animalData;
  
  const energyReq = calculateTotalEnergyRequirement(weight, dailyGain, distance);
  const nutrientReq = interpolateNutrientRequirements(weight, dailyGain);
  
  return {
    energy: energyReq,
    nutrients: nutrientReq,
    waterRequirement: calculateWaterRequirement(weight, nutrientReq.dryMatterIntake)
  };
};

/**
 * Calcula el requerimiento de agua
 * Aproximadamente 3-5 litros por kg de materia seca consumida
 * @param {number} weight - Peso corporal en kg
 * @param {number} dmIntake - Consumo de materia seca en kg
 * @returns {number} Requerimiento de agua en litros/día
 */
export const calculateWaterRequirement = (weight, dmIntake) => {
  const baseWater = weight * 0.04; // 4% del peso corporal como base
  const feedWater = dmIntake * 4; // 4 litros por kg de MS
  return parseFloat((baseWater + feedWater).toFixed(1));
};