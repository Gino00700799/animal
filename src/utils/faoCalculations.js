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
 * Calcula energía para actividad en sistema intensivo (confinamiento)
 * Actividad mínima: 10% de la energía de mantenimiento
 * @param {number} weight - Peso corporal en kg
 * @param {number} activityFactor - Factor de actividad (default 0.1 para confinamiento)
 * @returns {number} Energía para actividad en MJ ME/día
 */
export const calculateActivityEnergy = (weight, activityFactor = 0.1) => {
  const maintenanceNE = calculateMaintenanceNetEnergy(weight);
  const maintenanceME = convertNetToMetabolizable(maintenanceNE);
  return maintenanceME * activityFactor;
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
 * Calcula el requerimiento total de energía metabolizable para sistema intensivo
 * @param {number} weight - Peso corporal en kg
 * @param {number} dailyGain - Ganancia diaria en kg
 * @param {number} activityFactor - Factor de actividad (default 0.1 para confinamiento)
 * @returns {object} Desglose de energía requerida
 */
export const calculateTotalEnergyRequirement = (weight, dailyGain, activityFactor = 0.1) => {
  const maintenanceNE = calculateMaintenanceNetEnergy(weight);
  const maintenanceME = convertNetToMetabolizable(maintenanceNE);
  const activityME = calculateActivityEnergy(weight, activityFactor);
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
 * Estima el consumo de materia seca para sistema intensivo
 * Mayor consumo debido a dietas más concentradas y palatables
 * @param {number} weight - Peso corporal en kg
 * @param {string} category - Categoría del animal
 * @returns {number} Consumo de materia seca en kg/día
 */
export const estimateDryMatterIntake = (weight, category) => {
  const intakePercentages = {
    becerro_destetado: 0.032, // 3.2% del peso corporal - sistema intensivo
    torete: 0.030, // 3.0%
    novillo: 0.028, // 2.8%
    novillo_final: 0.026, // 2.6%
    toro_adulto: 0.022 // 2.2%
  };
  
  const percentage = intakePercentages[category] || 0.028;
  return weight * percentage;
};

/**
 * Tabla de requerimientos de nutrientes para sistema intensivo de engorde
 * Basada en NASEM/OSU adaptada para mayores ganancias de peso
 */
const nasemNutrientTable = [
  // Peso (kg), Ganancia (kg/día), CP (%), Ca (%), P (%), MS intake (% peso)
  // Sistema intensivo - mayores ganancias y consumos
  { weight: 200, gain: 1.0, cp: 16.5, ca: 0.38, p: 0.22, dmIntake: 3.2 },
  { weight: 200, gain: 1.2, cp: 18.0, ca: 0.42, p: 0.25, dmIntake: 3.3 },
  { weight: 250, gain: 1.1, cp: 15.8, ca: 0.36, p: 0.21, dmIntake: 3.1 },
  { weight: 250, gain: 1.3, cp: 17.2, ca: 0.40, p: 0.24, dmIntake: 3.2 },
  { weight: 300, gain: 1.2, cp: 15.0, ca: 0.34, p: 0.20, dmIntake: 3.0 },
  { weight: 300, gain: 1.4, cp: 16.5, ca: 0.38, p: 0.23, dmIntake: 3.1 },
  { weight: 400, gain: 1.4, cp: 14.2, ca: 0.32, p: 0.19, dmIntake: 2.8 },
  { weight: 400, gain: 1.6, cp: 15.5, ca: 0.36, p: 0.22, dmIntake: 2.9 },
  { weight: 500, gain: 1.5, cp: 13.5, ca: 0.30, p: 0.18, dmIntake: 2.7 },
  { weight: 500, gain: 1.7, cp: 14.8, ca: 0.34, p: 0.21, dmIntake: 2.8 },
  { weight: 600, gain: 1.6, cp: 12.8, ca: 0.28, p: 0.17, dmIntake: 2.6 },
  { weight: 600, gain: 1.8, cp: 14.0, ca: 0.32, p: 0.20, dmIntake: 2.7 },
  { weight: 700, gain: 0.0, cp: 9.5, ca: 0.18, p: 0.12, dmIntake: 2.2 }, // mantenimiento
  { weight: 800, gain: 0.0, cp: 9.0, ca: 0.16, p: 0.11, dmIntake: 2.2 }
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
  const { weight, dailyGain, category, activityFactor = 0.1 } = animalData;
  
  const energyReq = calculateTotalEnergyRequirement(weight, dailyGain, activityFactor);
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