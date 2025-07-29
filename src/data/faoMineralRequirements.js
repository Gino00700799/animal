// Tablas de requerimientos minerales para engorde de vacuno según FAO
// Basado en FAO Animal Production and Health Paper No. 102 y NASEM 2016

/**
 * Requerimientos minerales para ganado de engorde según peso corporal y ganancia diaria
 * Valores expresados en g/día (macrominerales) y mg/día (microminerales)
 */

export const faoMineralRequirements = {
  // MACROMINERALES (g/día)
  macrominerals: [
    // Peso 200-300 kg
    { 
      weightRange: "200-300", 
      dailyGain: 0.5, 
      calcium: 18, 
      phosphorus: 12, 
      magnesium: 8, 
      potassium: 35, 
      sodium: 4, 
      chlorine: 6, 
      sulfur: 8 
    },
    { 
      weightRange: "200-300", 
      dailyGain: 0.8, 
      calcium: 22, 
      phosphorus: 15, 
      magnesium: 10, 
      potassium: 42, 
      sodium: 5, 
      chlorine: 7, 
      sulfur: 10 
    },
    { 
      weightRange: "200-300", 
      dailyGain: 1.0, 
      calcium: 25, 
      phosphorus: 17, 
      magnesium: 11, 
      potassium: 48, 
      sodium: 6, 
      chlorine: 8, 
      sulfur: 12 
    },

    // Peso 300-400 kg
    { 
      weightRange: "300-400", 
      dailyGain: 0.6, 
      calcium: 22, 
      phosphorus: 14, 
      magnesium: 10, 
      potassium: 42, 
      sodium: 5, 
      chlorine: 7, 
      sulfur: 10 
    },
    { 
      weightRange: "300-400", 
      dailyGain: 0.9, 
      calcium: 27, 
      phosphorus: 18, 
      magnesium: 12, 
      potassium: 50, 
      sodium: 6, 
      chlorine: 9, 
      sulfur: 13 
    },
    { 
      weightRange: "300-400", 
      dailyGain: 1.2, 
      calcium: 32, 
      phosphorus: 21, 
      magnesium: 14, 
      potassium: 58, 
      sodium: 7, 
      chlorine: 10, 
      sulfur: 15 
    },

    // Peso 400-500 kg
    { 
      weightRange: "400-500", 
      dailyGain: 0.7, 
      calcium: 26, 
      phosphorus: 17, 
      magnesium: 12, 
      potassium: 48, 
      sodium: 6, 
      chlorine: 8, 
      sulfur: 12 
    },
    { 
      weightRange: "400-500", 
      dailyGain: 1.0, 
      calcium: 32, 
      phosphorus: 21, 
      magnesium: 14, 
      potassium: 58, 
      sodium: 7, 
      chlorine: 10, 
      sulfur: 15 
    },
    { 
      weightRange: "400-500", 
      dailyGain: 1.3, 
      calcium: 38, 
      phosphorus: 25, 
      magnesium: 16, 
      potassium: 68, 
      sodium: 8, 
      chlorine: 12, 
      sulfur: 18 
    },

    // Peso 500-600 kg
    { 
      weightRange: "500-600", 
      dailyGain: 0.8, 
      calcium: 30, 
      phosphorus: 19, 
      magnesium: 14, 
      potassium: 55, 
      sodium: 7, 
      chlorine: 9, 
      sulfur: 14 
    },
    { 
      weightRange: "500-600", 
      dailyGain: 1.1, 
      calcium: 36, 
      phosphorus: 24, 
      magnesium: 16, 
      potassium: 65, 
      sodium: 8, 
      chlorine: 11, 
      sulfur: 17 
    },
    { 
      weightRange: "500-600", 
      dailyGain: 1.4, 
      calcium: 42, 
      phosphorus: 28, 
      magnesium: 18, 
      potassium: 75, 
      sodium: 9, 
      chlorine: 13, 
      sulfur: 20 
    },

    // Peso 600+ kg (finalización)
    { 
      weightRange: "600+", 
      dailyGain: 0.9, 
      calcium: 34, 
      phosphorus: 22, 
      magnesium: 16, 
      potassium: 62, 
      sodium: 8, 
      chlorine: 10, 
      sulfur: 16 
    },
    { 
      weightRange: "600+", 
      dailyGain: 1.2, 
      calcium: 40, 
      phosphorus: 26, 
      magnesium: 18, 
      potassium: 72, 
      sodium: 9, 
      chlorine: 12, 
      sulfur: 19 
    },
    { 
      weightRange: "600+", 
      dailyGain: 1.5, 
      calcium: 46, 
      phosphorus: 30, 
      magnesium: 20, 
      potassium: 82, 
      sodium: 10, 
      chlorine: 14, 
      sulfur: 22 
    }
  ],

  // MICROMINERALES (mg/día)
  microminerals: [
    // Peso 200-300 kg
    { 
      weightRange: "200-300", 
      dailyGain: 0.5, 
      iron: 50, 
      zinc: 30, 
      copper: 10, 
      manganese: 40, 
      cobalt: 0.1, 
      iodine: 0.5, 
      selenium: 0.1 
    },
    { 
      weightRange: "200-300", 
      dailyGain: 0.8, 
      iron: 60, 
      zinc: 36, 
      copper: 12, 
      manganese: 48, 
      cobalt: 0.12, 
      iodine: 0.6, 
      selenium: 0.12 
    },
    { 
      weightRange: "200-300", 
      dailyGain: 1.0, 
      iron: 70, 
      zinc: 42, 
      copper: 14, 
      manganese: 56, 
      cobalt: 0.14, 
      iodine: 0.7, 
      selenium: 0.14 
    },

    // Peso 300-400 kg
    { 
      weightRange: "300-400", 
      dailyGain: 0.6, 
      iron: 60, 
      zinc: 36, 
      copper: 12, 
      manganese: 48, 
      cobalt: 0.12, 
      iodine: 0.6, 
      selenium: 0.12 
    },
    { 
      weightRange: "300-400", 
      dailyGain: 0.9, 
      iron: 72, 
      zinc: 43, 
      copper: 14, 
      manganese: 58, 
      cobalt: 0.14, 
      iodine: 0.7, 
      selenium: 0.14 
    },
    { 
      weightRange: "300-400", 
      dailyGain: 1.2, 
      iron: 84, 
      zinc: 50, 
      copper: 17, 
      manganese: 67, 
      cobalt: 0.17, 
      iodine: 0.8, 
      selenium: 0.17 
    },

    // Peso 400-500 kg
    { 
      weightRange: "400-500", 
      dailyGain: 0.7, 
      iron: 70, 
      zinc: 42, 
      copper: 14, 
      manganese: 56, 
      cobalt: 0.14, 
      iodine: 0.7, 
      selenium: 0.14 
    },
    { 
      weightRange: "400-500", 
      dailyGain: 1.0, 
      iron: 84, 
      zinc: 50, 
      copper: 17, 
      manganese: 67, 
      cobalt: 0.17, 
      iodine: 0.8, 
      selenium: 0.17 
    },
    { 
      weightRange: "400-500", 
      dailyGain: 1.3, 
      iron: 98, 
      zinc: 59, 
      copper: 20, 
      manganese: 78, 
      cobalt: 0.20, 
      iodine: 1.0, 
      selenium: 0.20 
    },

    // Peso 500-600 kg
    { 
      weightRange: "500-600", 
      dailyGain: 0.8, 
      iron: 80, 
      zinc: 48, 
      copper: 16, 
      manganese: 64, 
      cobalt: 0.16, 
      iodine: 0.8, 
      selenium: 0.16 
    },
    { 
      weightRange: "500-600", 
      dailyGain: 1.1, 
      iron: 94, 
      zinc: 56, 
      copper: 19, 
      manganese: 75, 
      cobalt: 0.19, 
      iodine: 0.9, 
      selenium: 0.19 
    },
    { 
      weightRange: "500-600", 
      dailyGain: 1.4, 
      iron: 108, 
      zinc: 65, 
      copper: 22, 
      manganese: 86, 
      cobalt: 0.22, 
      iodine: 1.1, 
      selenium: 0.22 
    },

    // Peso 600+ kg (finalización)
    { 
      weightRange: "600+", 
      dailyGain: 0.9, 
      iron: 90, 
      zinc: 54, 
      copper: 18, 
      manganese: 72, 
      cobalt: 0.18, 
      iodine: 0.9, 
      selenium: 0.18 
    },
    { 
      weightRange: "600+", 
      dailyGain: 1.2, 
      iron: 104, 
      zinc: 62, 
      copper: 21, 
      manganese: 83, 
      cobalt: 0.21, 
      iodine: 1.0, 
      selenium: 0.21 
    },
    { 
      weightRange: "600+", 
      dailyGain: 1.5, 
      iron: 118, 
      zinc: 71, 
      copper: 24, 
      manganese: 94, 
      cobalt: 0.24, 
      iodine: 1.2, 
      selenium: 0.24 
    }
  ]
};

/**
 * Concentraciones minerales recomendadas en la dieta (% de materia seca)
 * Para formulación de raciones completas
 */
export const faoMineralConcentrations = {
  // MACROMINERALES (% de MS)
  macrominerals: {
    calcium: {
      minimum: 0.31,
      recommended: 0.40,
      maximum: 2.00,
      unit: "% MS",
      notes: "Relación Ca:P debe ser 1.2:1 a 2:1"
    },
    phosphorus: {
      minimum: 0.18,
      recommended: 0.25,
      maximum: 0.80,
      unit: "% MS",
      notes: "Esencial para metabolismo energético"
    },
    magnesium: {
      minimum: 0.10,
      recommended: 0.15,
      maximum: 0.40,
      unit: "% MS",
      notes: "Previene tetania de los pastos"
    },
    potassium: {
      minimum: 0.60,
      recommended: 0.80,
      maximum: 3.00,
      unit: "% MS",
      notes: "Alto en forrajes verdes"
    },
    sodium: {
      minimum: 0.06,
      recommended: 0.10,
      maximum: 0.30,
      unit: "% MS",
      notes: "Usualmente suplementado como sal"
    },
    chlorine: {
      minimum: 0.10,
      recommended: 0.15,
      maximum: 0.40,
      unit: "% MS",
      notes: "Proporcionado con cloruro de sodio"
    },
    sulfur: {
      minimum: 0.15,
      recommended: 0.20,
      maximum: 0.40,
      unit: "% MS",
      notes: "Importante para síntesis de aminoácidos"
    }
  },

  // MICROMINERALES (mg/kg MS)
  microminerals: {
    iron: {
      minimum: 30,
      recommended: 50,
      maximum: 1000,
      unit: "mg/kg MS",
      notes: "Raramente deficiente, cuidado con excesos"
    },
    zinc: {
      minimum: 20,
      recommended: 30,
      maximum: 500,
      unit: "mg/kg MS",
      notes: "Esencial para crecimiento y reproducción"
    },
    copper: {
      minimum: 8,
      recommended: 10,
      maximum: 40,
      unit: "mg/kg MS",
      notes: "Antagonismo con molibdeno y azufre"
    },
    manganese: {
      minimum: 20,
      recommended: 40,
      maximum: 1000,
      unit: "mg/kg MS",
      notes: "Importante para desarrollo óseo"
    },
    cobalt: {
      minimum: 0.10,
      recommended: 0.15,
      maximum: 10,
      unit: "mg/kg MS",
      notes: "Necesario para síntesis de vitamina B12"
    },
    iodine: {
      minimum: 0.25,
      recommended: 0.50,
      maximum: 50,
      unit: "mg/kg MS",
      notes: "Función tiroidea, varía por región"
    },
    selenium: {
      minimum: 0.10,
      recommended: 0.20,
      maximum: 2,
      unit: "mg/kg MS",
      notes: "Antioxidante, tóxico en exceso"
    }
  }
};

/**
 * Síntomas de deficiencias minerales en ganado de engorde
 */
export const mineralDeficiencySymptoms = {
  calcium: {
    symptoms: ["Debilidad ósea", "Fracturas", "Tetania", "Reducción del crecimiento"],
    causes: ["Dietas altas en fósforo", "Forrajes de baja calidad", "Falta de suplementación"]
  },
  phosphorus: {
    symptoms: ["Apetito depravado", "Fragilidad ósea", "Baja fertilidad", "Crecimiento lento"],
    causes: ["Forrajes maduros", "Suelos deficientes", "Dietas altas en calcio"]
  },
  magnesium: {
    symptoms: ["Tetania de los pastos", "Convulsiones", "Muerte súbita", "Nerviosismo"],
    causes: ["Pastos jóvenes", "Fertilización potásica alta", "Estrés climático"]
  },
  zinc: {
    symptoms: ["Paraqueratosis", "Crecimiento retardado", "Problemas reproductivos", "Lesiones cutáneas"],
    causes: ["Dietas altas en calcio", "Suelos alcalinos", "Antagonismo con hierro"]
  },
  copper: {
    symptoms: ["Anemia", "Despigmentación", "Problemas óseos", "Diarrea"],
    causes: ["Alto molibdeno", "Alto azufre", "Suelos ácidos", "Antagonismo mineral"]
  },
  selenium: {
    symptoms: ["Enfermedad del músculo blanco", "Retención placentaria", "Inmunidad reducida"],
    causes: ["Suelos deficientes", "Forrajes de regiones selenio-pobres"]
  }
};

/**
 * Fuentes minerales comunes para suplementación
 */
export const mineralSources = {
  calcium: [
    { source: "Carbonato de calcio", content: 40, availability: "Alta", cost: "Bajo" },
    { source: "Fosfato dicálcico", content: 23, availability: "Alta", cost: "Medio" },
    { source: "Harina de huesos", content: 24, availability: "Media", cost: "Medio" },
    { source: "Sulfato de calcio", content: 29, availability: "Media", cost: "Bajo" }
  ],
  phosphorus: [
    { source: "Fosfato dicálcico", content: 18, availability: "Alta", cost: "Medio" },
    { source: "Fosfato monocálcico", content: 21, availability: "Alta", cost: "Alto" },
    { source: "Harina de huesos", content: 12, availability: "Media", cost: "Medio" },
    { source: "Ácido fosfórico", content: 23, availability: "Alta", cost: "Alto" }
  ],
  magnesium: [
    { source: "Óxido de magnesio", content: 60, availability: "Baja", cost: "Bajo" },
    { source: "Sulfato de magnesio", content: 10, availability: "Alta", cost: "Medio" },
    { source: "Cloruro de magnesio", content: 12, availability: "Alta", cost: "Medio" }
  ],
  zinc: [
    { source: "Sulfato de zinc", content: 36, availability: "Alta", cost: "Medio" },
    { source: "Óxido de zinc", content: 80, availability: "Media", cost: "Bajo" },
    { source: "Zinc quelado", content: 20, availability: "Muy Alta", cost: "Alto" }
  ],
  copper: [
    { source: "Sulfato de cobre", content: 25, availability: "Alta", cost: "Medio" },
    { source: "Óxido de cobre", content: 80, availability: "Baja", cost: "Bajo" },
    { source: "Cobre quelado", content: 15, availability: "Muy Alta", cost: "Alto" }
  ]
};

/**
 * Calcula requerimientos minerales para un animal específico
 * @param {number} weight - Peso corporal en kg
 * @param {number} dailyGain - Ganancia diaria en kg
 * @param {number} dryMatterIntake - Consumo de materia seca en kg/día
 * @returns {object} Requerimientos minerales calculados
 */
export const calculateMineralRequirements = (weight, dailyGain, dryMatterIntake) => {
  // Determinar rango de peso
  let weightRange;
  if (weight <= 300) weightRange = "200-300";
  else if (weight <= 400) weightRange = "300-400";
  else if (weight <= 500) weightRange = "400-500";
  else if (weight <= 600) weightRange = "500-600";
  else weightRange = "600+";

  // Buscar datos más cercanos en las tablas
  const macroData = faoMineralRequirements.macrominerals.filter(item => 
    item.weightRange === weightRange
  );
  const microData = faoMineralRequirements.microminerals.filter(item => 
    item.weightRange === weightRange
  );

  // Interpolación simple basada en ganancia diaria
  const interpolate = (data, gain) => {
    if (data.length === 0) return null;
    
    // Encontrar los dos puntos más cercanos
    data.sort((a, b) => a.dailyGain - b.dailyGain);
    
    let lower = data[0];
    let upper = data[data.length - 1];
    
    for (let i = 0; i < data.length - 1; i++) {
      if (gain >= data[i].dailyGain && gain <= data[i + 1].dailyGain) {
        lower = data[i];
        upper = data[i + 1];
        break;
      }
    }
    
    if (lower.dailyGain === upper.dailyGain) return lower;
    
    const ratio = (gain - lower.dailyGain) / (upper.dailyGain - lower.dailyGain);
    const result = {};
    
    Object.keys(lower).forEach(key => {
      if (typeof lower[key] === 'number') {
        result[key] = lower[key] + (upper[key] - lower[key]) * ratio;
      } else {
        result[key] = lower[key];
      }
    });
    
    return result;
  };

  const macroReq = interpolate(macroData, dailyGain);
  const microReq = interpolate(microData, dailyGain);

  // Calcular concentraciones en la dieta
  const calculateConcentration = (requirement, dmIntake, factor = 1) => {
    return (requirement * factor) / (dmIntake * 1000) * 100; // % de MS
  };

  const result = {
    requirements: {
      macrominerals: macroReq,
      microminerals: microReq
    },
    concentrations: {},
    adequacy: {}
  };

  // Calcular concentraciones necesarias en la dieta
  if (macroReq && dryMatterIntake > 0) {
    result.concentrations.macrominerals = {
      calcium: calculateConcentration(macroReq.calcium, dryMatterIntake, 10),
      phosphorus: calculateConcentration(macroReq.phosphorus, dryMatterIntake, 10),
      magnesium: calculateConcentration(macroReq.magnesium, dryMatterIntake, 10),
      potassium: calculateConcentration(macroReq.potassium, dryMatterIntake, 10),
      sodium: calculateConcentration(macroReq.sodium, dryMatterIntake, 10),
      chlorine: calculateConcentration(macroReq.chlorine, dryMatterIntake, 10),
      sulfur: calculateConcentration(macroReq.sulfur, dryMatterIntake, 10)
    };
  }

  if (microReq && dryMatterIntake > 0) {
    result.concentrations.microminerals = {
      iron: microReq.iron / dryMatterIntake,
      zinc: microReq.zinc / dryMatterIntake,
      copper: microReq.copper / dryMatterIntake,
      manganese: microReq.manganese / dryMatterIntake,
      cobalt: microReq.cobalt / dryMatterIntake,
      iodine: microReq.iodine / dryMatterIntake,
      selenium: microReq.selenium / dryMatterIntake
    };
  }

  return result;
};

/**
 * Evalúa la adecuación mineral de una dieta
 * @param {object} dietMinerals - Contenido mineral de la dieta
 * @param {object} requirements - Requerimientos calculados
 * @returns {object} Evaluación de adecuación
 */
export const evaluateMineralAdequacy = (dietMinerals, requirements) => {
  const adequacy = {};
  
  // Evaluar macrominerales
  if (dietMinerals.macrominerals && requirements.concentrations.macrominerals) {
    adequacy.macrominerals = {};
    Object.keys(requirements.concentrations.macrominerals).forEach(mineral => {
      const supplied = dietMinerals.macrominerals[mineral] || 0;
      const required = requirements.concentrations.macrominerals[mineral];
      const percentage = (supplied / required) * 100;
      
      adequacy.macrominerals[mineral] = {
        supplied,
        required,
        adequacy: Math.round(percentage),
        status: percentage >= 100 ? 'adequate' : percentage >= 80 ? 'marginal' : 'deficient'
      };
    });
  }
  
  // Evaluar microminerales
  if (dietMinerals.microminerals && requirements.concentrations.microminerals) {
    adequacy.microminerals = {};
    Object.keys(requirements.concentrations.microminerals).forEach(mineral => {
      const supplied = dietMinerals.microminerals[mineral] || 0;
      const required = requirements.concentrations.microminerals[mineral];
      const percentage = (supplied / required) * 100;
      
      adequacy.microminerals[mineral] = {
        supplied,
        required,
        adequacy: Math.round(percentage),
        status: percentage >= 100 ? 'adequate' : percentage >= 80 ? 'marginal' : 'deficient'
      };
    });
  }
  
  return adequacy;
};

export default {
  faoMineralRequirements,
  faoMineralConcentrations,
  mineralDeficiencySymptoms,
  mineralSources,
  calculateMineralRequirements,
  evaluateMineralAdequacy
};