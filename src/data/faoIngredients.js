// Base de datos de ingredientes según clasificación FAO
// Composición basada en FutureBeef y fuentes FAO
import { detailedNutritionData, proteinFeedstuffs, calculateEnergyFromComposition } from './detailedNutritionData';
import { feedipediaIngredients, getAllFeedipediaIngredients } from './feedipediaIngredients';

export const faoIngredientCategories = {
  forrajes_secos: {
    name: {
      es: "Forrajes Secos",
      en: "Dry Forages",
      de: "Trockenfutter"
    },
    emoji: "🌾",
    color: "#f59e0b"
  },
  pastos_verdes: {
    name: {
      es: "Pastos Verdes (Uso Mínimo)",
      en: "Green Pastures (Minimal Use)",
      de: "Grünfutter (Minimaler Einsatz)"
    },
    emoji: "🌱",
    color: "#10b981",
    note: "Solo para fibra mínima en sistema intensivo (0-5%)"
  },
  ensilados: {
    name: {
      es: "Ensilados",
      en: "Silages",
      de: "Silagen"
    },
    emoji: "🌽",
    color: "#06b6d4"
  },
  alimentos_energeticos: {
    name: {
      es: "Alimentos Energéticos",
      en: "Energy Feeds",
      de: "Energiefutter"
    },
    emoji: "⚡",
    color: "#8b5cf6"
  },
  suplementos_proteicos: {
    name: {
      es: "Suplementos Proteicos",
      en: "Protein Supplements",
      de: "Proteinergänzungen"
    },
    emoji: "💪",
    color: "#ef4444"
  },
  minerales: {
    name: {
      es: "Minerales",
      en: "Minerals",
      de: "Mineralstoffe"
    },
    emoji: "🧂",
    color: "#6b7280"
  },
  vitaminas: {
    name: {
      es: "Vitaminas",
      en: "Vitamins",
      de: "Vitaminzusätze"
    },
    emoji: "💊",
    color: "#f59e0b"
  },
  aditivos: {
    name: {
      es: "Aditivos",
      en: "Additives",
      de: "Additive"
    },
    emoji: "🧪",
    color: "#8b5cf6"
  }
};

export const faoIngredients = [
  // FORRAJES SECOS
  {
    id: "heno_pradera",
    name: {
      es: "Heno de Pradera",
      en: "Meadow Hay",
      de: "Wiesenheu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 85, // %
      metabolizableEnergy: 8.5, // MJ/kg MS
      crudeProtein: 8.2, // % MS
      calcium: 0.45, // % MS
      phosphorus: 0.25, // % MS
      fiber: 28.5 // % MS
    },
    costPerKg: 0.15,
    availability: "year_round"
  },
  {
    id: "heno_alfalfa",
    name: {
      es: "Heno de Alfalfa",
      en: "Alfalfa Hay",
      de: "Luzerneheu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 9.2,
      crudeProtein: 18.5,
      calcium: 1.35,
      phosphorus: 0.24,
      fiber: 25.0
    },
    costPerKg: 0.22,
    availability: "year_round"
  },
  {
    id: "paja_trigo",
    name: {
      es: "Paja de Trigo",
      en: "Wheat Straw",
      de: "Weizenstroh"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 86,
      metabolizableEnergy: 6.2,
      crudeProtein: 3.5,
      calcium: 0.18,
      phosphorus: 0.08,
      fiber: 42.0
    },
    costPerKg: 0.05,
    availability: "seasonal"
  },

  // PASTOS VERDES
  {
    id: "pasto_ryegrass",
    name: {
      es: "Pasto Ryegrass",
      en: "Ryegrass Pasture",
      de: "Weidelgras"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 20,
      metabolizableEnergy: 11.5,
      crudeProtein: 22.0,
      calcium: 0.55,
      phosphorus: 0.35,
      fiber: 18.0
    },
    costPerKg: 0.03,
    availability: "seasonal"
  },
  {
    id: "pasto_kikuyu",
    name: {
      es: "Pasto Kikuyu",
      en: "Kikuyu Grass",
      de: "Kikuyu-Gras"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 18,
      metabolizableEnergy: 10.8,
      crudeProtein: 18.5,
      calcium: 0.42,
      phosphorus: 0.28,
      fiber: 22.0
    },
    costPerKg: 0.02,
    availability: "year_round"
  },

  // ENSILADOS
  {
    id: "ensilado_maiz",
    name: {
      es: "Ensilado de Maíz",
      en: "Corn Silage",
      de: "Maissilage"
    },
    category: "ensilados",
    composition: {
      dryMatter: 35,
      metabolizableEnergy: 10.8,
      crudeProtein: 8.0,
      calcium: 0.25,
      phosphorus: 0.22,
      fiber: 22.0
    },
    costPerKg: 0.08,
    availability: "year_round"
  },
  {
    id: "ensilado_sorgo",
    name: {
      es: "Ensilado de Sorgo",
      en: "Sorghum Silage",
      de: "Sorghumsilage"
    },
    category: "ensilados",
    composition: {
      dryMatter: 32,
      metabolizableEnergy: 10.2,
      crudeProtein: 7.5,
      calcium: 0.28,
      phosphorus: 0.25,
      fiber: 24.0
    },
    costPerKg: 0.07,
    availability: "seasonal"
  },

  // ALIMENTOS ENERGÉTICOS
  {
    id: "maiz_grano",
    name: {
      es: "Maíz en Grano",
      en: "Corn Grain",
      de: "Maiskorn"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 13.2,
      crudeProtein: 8.5,
      calcium: 0.03,
      phosphorus: 0.28,
      fiber: 2.5
    },
    costPerKg: 0.28,
    availability: "year_round"
  },
  {
    id: "cebada",
    name: {
      es: "Cebada",
      en: "Barley",
      de: "Gerste"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 11.3,
      crudeProtein: 12.0,
      calcium: 0.07,
      phosphorus: 0.34,
      fiber: 5.5
    },
    costPerKg: 0.25,
    availability: "seasonal"
  },
  {
    id: "avena",
    name: {
      es: "Avena",
      en: "Oats",
      de: "Hafer"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 9.1,
      crudeProtein: 9.0,
      calcium: 0.13,
      phosphorus: 0.32,
      fiber: 12.0
    },
    costPerKg: 0.30,
    availability: "seasonal"
  },
  {
    id: "sorgo_grano",
    name: {
      es: "Sorgo en Grano",
      en: "Sorghum Grain",
      de: "Sorghum"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 10.6,
      crudeProtein: 10.0,
      calcium: 0.04,
      phosphorus: 0.32,
      fiber: 3.0
    },
    costPerKg: 0.24,
    availability: "seasonal"
  },
  {
    id: "melaza",
    name: {
      es: "Melaza",
      en: "Molasses",
      de: "Melasse"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 75,
      metabolizableEnergy: 8.7,
      crudeProtein: 4.3,
      calcium: 0.89,
      phosphorus: 0.05,
      fiber: 0.0
    },
    costPerKg: 0.18,
    availability: "year_round"
  },

  // SUPLEMENTOS PROTEICOS
  {
    id: "harina_soya",
    name: {
      es: "Harina de Soya",
      en: "Soybean Meal",
      de: "Sojaschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 11.0,
      crudeProtein: 45.0,
      calcium: 0.24,
      phosphorus: 0.84,
      fiber: 7.0
    },
    costPerKg: 0.45,
    availability: "year_round",
    hasDetailedData: true
  },
  {
    id: "harina_girasol",
    name: {
      es: "Harina de Girasol",
      en: "Sunflower Meal",
      de: "Sonnenblumenschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 8.0,
      crudeProtein: 32.0,
      calcium: 0.38,
      phosphorus: 0.93,
      fiber: 25.0
    },
    costPerKg: 0.35,
    availability: "seasonal"
  },
  {
    id: "harina_canola",
    name: {
      es: "Harina de Canola",
      en: "Canola Meal",
      de: "Rapsschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 9.5,
      crudeProtein: 38.0,
      calcium: 0.65,
      phosphorus: 1.15,
      fiber: 12.0
    },
    costPerKg: 0.40,
    availability: "year_round"
  },
  {
    id: "harina_pescado",
    name: {
      es: "Harina de Pescado",
      en: "Fish Meal",
      de: "Fischmehl"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 92,
      metabolizableEnergy: 10.5,
      crudeProtein: 65.0,
      calcium: 5.5,
      phosphorus: 3.2,
      fiber: 1.0
    },
    costPerKg: 1.20,
    availability: "year_round"
  },
  {
    id: "harina_carne_hueso",
    name: {
      es: "Harina de Carne y Hueso",
      en: "Meat and Bone Meal",
      de: "Fleisch- und Knochenmehl"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 93,
      metabolizableEnergy: 8.5,
      crudeProtein: 50.0,
      calcium: 8.0,
      phosphorus: 4.5,
      fiber: 2.5
    },
    costPerKg: 0.65,
    availability: "year_round"
  },
  {
    id: "harina_algodon",
    name: {
      es: "Harina de Algodón",
      en: "Cottonseed Meal",
      de: "Baumwollsamenmehl"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 7.8,
      crudeProtein: 41.0,
      calcium: 0.18,
      phosphorus: 1.2,
      fiber: 12.0
    },
    costPerKg: 0.38,
    availability: "seasonal"
  },
  {
    id: "harina_lino",
    name: {
      es: "Harina de Lino",
      en: "Linseed Meal",
      de: "Leinsamenmehl"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 9.2,
      crudeProtein: 35.0,
      calcium: 0.4,
      phosphorus: 0.9,
      fiber: 8.5
    },
    costPerKg: 0.42,
    availability: "year_round"
  },
  {
    id: "torta_palma",
    name: {
      es: "Torta de Palma",
      en: "Palm Kernel Meal",
      de: "Palmkernschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 91,
      metabolizableEnergy: 7.5,
      crudeProtein: 18.0,
      calcium: 0.4,
      phosphorus: 0.6,
      fiber: 16.0
    },
    costPerKg: 0.28,
    availability: "year_round"
  },
  {
    id: "harina_coco",
    name: {
      es: "Harina de Coco",
      en: "Coconut Meal",
      de: "Kokosmehl"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 8.2,
      crudeProtein: 21.0,
      calcium: 0.2,
      phosphorus: 0.6,
      fiber: 14.5
    },
    costPerKg: 0.32,
    availability: "year_round"
  },
  {
    id: "urea",
    name: {
      es: "Urea",
      en: "Urea",
      de: "Harnstoff"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 287.0, // Equivalente proteico
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0
    },
    costPerKg: 0.80,
    availability: "year_round"
  },

  // FORRAJES SECOS ADICIONALES
  {
    id: "heno_trebol",
    name: {
      es: "Heno de Trébol",
      en: "Clover Hay",
      de: "Kleeheu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 9.8,
      crudeProtein: 15.5,
      calcium: 1.2,
      phosphorus: 0.3,
      fiber: 24.0
    },
    costPerKg: 0.18,
    availability: "seasonal"
  },
  {
    id: "heno_timothy",
    name: {
      es: "Heno de Timothy",
      en: "Timothy Hay",
      de: "Timothee-Heu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 8.8,
      crudeProtein: 9.5,
      calcium: 0.4,
      phosphorus: 0.25,
      fiber: 31.0
    },
    costPerKg: 0.16,
    availability: "year_round"
  },
  {
    id: "heno_avena",
    name: {
      es: "Heno de Avena",
      en: "Oat Hay",
      de: "Haferheu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 85,
      metabolizableEnergy: 8.2,
      crudeProtein: 7.8,
      calcium: 0.3,
      phosphorus: 0.22,
      fiber: 32.5
    },
    costPerKg: 0.14,
    availability: "seasonal"
  },
  {
    id: "paja_cebada",
    name: {
      es: "Paja de Cebada",
      en: "Barley Straw",
      de: "Gerstenstroh"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 6.5,
      crudeProtein: 4.2,
      calcium: 0.2,
      phosphorus: 0.1,
      fiber: 40.0
    },
    costPerKg: 0.06,
    availability: "seasonal"
  },
  {
    id: "paja_avena",
    name: {
      es: "Paja de Avena",
      en: "Oat Straw",
      de: "Haferstroh"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 86,
      metabolizableEnergy: 6.8,
      crudeProtein: 3.8,
      calcium: 0.25,
      phosphorus: 0.12,
      fiber: 38.5
    },
    costPerKg: 0.07,
    availability: "seasonal"
  },
  {
    id: "paja_arroz",
    name: {
      es: "Paja de Arroz",
      en: "Rice Straw",
      de: "Reisstroh"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 5.8,
      crudeProtein: 3.2,
      calcium: 0.15,
      phosphorus: 0.08,
      fiber: 35.0
    },
    costPerKg: 0.05,
    availability: "seasonal"
  },

  // PASTOS VERDES ADICIONALES
  {
    id: "pasto_festuca",
    name: {
      es: "Pasto Festuca",
      en: "Fescue Grass",
      de: "Schwingel"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 22,
      metabolizableEnergy: 10.5,
      crudeProtein: 16.8,
      calcium: 0.45,
      phosphorus: 0.32,
      fiber: 25.0
    },
    costPerKg: 0.025,
    availability: "seasonal"
  },
  {
    id: "pasto_bermuda",
    name: {
      es: "Pasto Bermuda",
      en: "Bermuda Grass",
      de: "Bermuda-Gras"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 25,
      metabolizableEnergy: 9.8,
      crudeProtein: 14.2,
      calcium: 0.38,
      phosphorus: 0.28,
      fiber: 28.0
    },
    costPerKg: 0.02,
    availability: "year_round"
  },
  {
    id: "trebol_blanco",
    name: {
      es: "Trébol Blanco",
      en: "White Clover",
      de: "Weißklee"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 18,
      metabolizableEnergy: 12.2,
      crudeProtein: 25.0,
      calcium: 1.8,
      phosphorus: 0.4,
      fiber: 15.0
    },
    costPerKg: 0.035,
    availability: "seasonal"
  },
  {
    id: "trebol_rojo",
    name: {
      es: "Trébol Rojo",
      en: "Red Clover",
      de: "Rotklee"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 20,
      metabolizableEnergy: 11.8,
      crudeProtein: 22.5,
      calcium: 1.5,
      phosphorus: 0.35,
      fiber: 18.0
    },
    costPerKg: 0.032,
    availability: "seasonal"
  },
  {
    id: "alfalfa_verde",
    name: {
      es: "Alfalfa Verde",
      en: "Fresh Alfalfa",
      de: "Frische Luzerne"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 22,
      metabolizableEnergy: 11.5,
      crudeProtein: 20.0,
      calcium: 1.4,
      phosphorus: 0.3,
      fiber: 20.0
    },
    costPerKg: 0.04,
    availability: "seasonal"
  },

  // ENSILADOS ADICIONALES
  {
    id: "ensilado_alfalfa",
    name: {
      es: "Ensilado de Alfalfa",
      en: "Alfalfa Silage",
      de: "Luzernesilage"
    },
    category: "ensilados",
    composition: {
      dryMatter: 40,
      metabolizableEnergy: 9.5,
      crudeProtein: 16.0,
      calcium: 1.2,
      phosphorus: 0.28,
      fiber: 28.0
    },
    costPerKg: 0.12,
    availability: "year_round"
  },
  {
    id: "ensilado_trebol",
    name: {
      es: "Ensilado de Trébol",
      en: "Clover Silage",
      de: "Kleesilage"
    },
    category: "ensilados",
    composition: {
      dryMatter: 38,
      metabolizableEnergy: 9.2,
      crudeProtein: 14.5,
      calcium: 1.0,
      phosphorus: 0.25,
      fiber: 26.0
    },
    costPerKg: 0.10,
    availability: "seasonal"
  },
  {
    id: "ensilado_ryegrass",
    name: {
      es: "Ensilado de Ryegrass",
      en: "Ryegrass Silage",
      de: "Weidelgrassilage"
    },
    category: "ensilados",
    composition: {
      dryMatter: 25,
      metabolizableEnergy: 10.2,
      crudeProtein: 12.8,
      calcium: 0.6,
      phosphorus: 0.3,
      fiber: 24.0
    },
    costPerKg: 0.09,
    availability: "seasonal"
  },
  {
    id: "ensilado_avena",
    name: {
      es: "Ensilado de Avena",
      en: "Oat Silage",
      de: "Hafersilage"
    },
    category: "ensilados",
    composition: {
      dryMatter: 30,
      metabolizableEnergy: 9.8,
      crudeProtein: 10.5,
      calcium: 0.4,
      phosphorus: 0.28,
      fiber: 28.0
    },
    costPerKg: 0.08,
    availability: "seasonal"
  },

  // ALIMENTOS ENERGÉTICOS ADICIONALES
  {
    id: "trigo",
    name: {
      es: "Trigo",
      en: "Wheat",
      de: "Weizen"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 12.8,
      crudeProtein: 12.5,
      calcium: 0.05,
      phosphorus: 0.35,
      fiber: 3.2
    },
    costPerKg: 0.32,
    availability: "seasonal"
  },
  {
    id: "centeno",
    name: {
      es: "Centeno",
      en: "Rye",
      de: "Roggen"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 11.8,
      crudeProtein: 11.0,
      calcium: 0.06,
      phosphorus: 0.32,
      fiber: 2.8
    },
    costPerKg: 0.29,
    availability: "seasonal"
  },
  {
    id: "mijo",
    name: {
      es: "Mijo",
      en: "Millet",
      de: "Hirse"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 11.5,
      crudeProtein: 10.8,
      calcium: 0.08,
      phosphorus: 0.28,
      fiber: 8.5
    },
    costPerKg: 0.35,
    availability: "seasonal"
  },
  {
    id: "salvado_trigo",
    name: {
      es: "Salvado de Trigo",
      en: "Wheat Bran",
      de: "Weizenkleie"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 9.5,
      crudeProtein: 15.5,
      calcium: 0.12,
      phosphorus: 1.2,
      fiber: 11.0
    },
    costPerKg: 0.22,
    availability: "year_round"
  },
  {
    id: "pulpa_remolacha",
    name: {
      es: "Pulpa de Remolacha",
      en: "Sugar Beet Pulp",
      de: "Zuckerrübenschnitzel"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 10.8,
      crudeProtein: 9.5,
      calcium: 0.65,
      phosphorus: 0.08,
      fiber: 18.0
    },
    costPerKg: 0.18,
    availability: "year_round"
  },
  {
    id: "cascarilla_soya",
    name: {
      es: "Cascarilla de Soya",
      en: "Soybean Hulls",
      de: "Sojahülsen"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 8.2,
      crudeProtein: 12.0,
      calcium: 0.5,
      phosphorus: 0.15,
      fiber: 35.0
    },
    costPerKg: 0.15,
    availability: "year_round"
  },
  {
    id: "grasa_animal",
    name: {
      es: "Grasa Animal",
      en: "Animal Fat",
      de: "Tierfett"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 35.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0
    },
    costPerKg: 0.85,
    availability: "year_round"
  },
  {
    id: "aceite_soya",
    name: {
      es: "Aceite de Soya",
      en: "Soybean Oil",
      de: "Sojaöl"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 37.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0
    },
    costPerKg: 1.20,
    availability: "year_round"
  },

  // MINERALES
  {
    id: "carbonato_calcio",
    name: {
      es: "Carbonato de Calcio",
      en: "Calcium Carbonate",
      de: "Calciumcarbonat"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 40.0,
      phosphorus: 0.0,
      fiber: 0.0
    },
    costPerKg: 0.25,
    availability: "year_round",
    maxUsage: 2.0 // % de la dieta
  },
  {
    id: "fosfato_dicalcico",
    name: {
      es: "Fosfato Dicálcico",
      en: "Dicalcium Phosphate",
      de: "Dicalciumphosphat"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 23.0,
      phosphorus: 18.0,
      fiber: 0.0
    },
    costPerKg: 0.85,
    availability: "year_round",
    maxUsage: 1.5
  },
  {
    id: "sal_comun",
    name: {
      es: "Sal Común (NaCl)",
      en: "Common Salt (NaCl)",
      de: "Kochsalz (NaCl)"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      sodium: 39.0,
      chlorine: 61.0
    },
    costPerKg: 0.15,
    availability: "year_round",
    maxUsage: 0.5
  },
  {
    id: "oxido_magnesio",
    name: {
      es: "Óxido de Magnesio",
      en: "Magnesium Oxide",
      de: "Magnesiumoxid"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      magnesium: 60.0
    },
    costPerKg: 0.45,
    availability: "year_round",
    maxUsage: 0.3
  },
  {
    id: "sulfato_zinc",
    name: {
      es: "Sulfato de Zinc",
      en: "Zinc Sulfate",
      de: "Zinksulfat"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      zinc: 36.0
    },
    costPerKg: 2.50,
    availability: "year_round",
    maxUsage: 0.01
  },
  {
    id: "sulfato_cobre",
    name: {
      es: "Sulfato de Cobre",
      en: "Copper Sulfate",
      de: "Kupfersulfat"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      copper: 25.0
    },
    costPerKg: 3.20,
    availability: "year_round",
    maxUsage: 0.005
  },
  {
    id: "selenito_sodio",
    name: {
      es: "Selenito de Sodio",
      en: "Sodium Selenite",
      de: "Natriumselenit"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      selenium: 45.0
    },
    costPerKg: 25.00,
    availability: "year_round",
    maxUsage: 0.0001
  },

  // VITAMINAS
  {
    id: "vitamina_a",
    name: {
      es: "Vitamina A",
      en: "Vitamin A",
      de: "Vitamin A"
    },
    category: "vitaminas",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      vitaminA: 500000 // UI/kg
    },
    costPerKg: 15.00,
    availability: "year_round",
    maxUsage: 0.01
  },
  {
    id: "vitamina_d3",
    name: {
      es: "Vitamina D3",
      en: "Vitamin D3",
      de: "Vitamin D3"
    },
    category: "vitaminas",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      vitaminD3: 100000 // UI/kg
    },
    costPerKg: 18.00,
    availability: "year_round",
    maxUsage: 0.01
  },
  {
    id: "vitamina_e",
    name: {
      es: "Vitamina E",
      en: "Vitamin E",
      de: "Vitamin E"
    },
    category: "vitaminas",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      vitaminE: 50000 // UI/kg
    },
    costPerKg: 22.00,
    availability: "year_round",
    maxUsage: 0.02
  },
  {
    id: "complejo_b",
    name: {
      es: "Complejo Vitamina B",
      en: "Vitamin B Complex",
      de: "Vitamin B Komplex"
    },
    category: "vitaminas",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      vitaminB1: 1000, // mg/kg
      vitaminB2: 2000,
      vitaminB12: 10
    },
    costPerKg: 12.00,
    availability: "year_round",
    maxUsage: 0.05
  },

  // ADITIVOS
  {
    id: "probioticos",
    name: {
      es: "Probióticos",
      en: "Probiotics",
      de: "Probiotika"
    },
    category: "aditivos",
    composition: {
      dryMatter: 95,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      probiotics: 1000000 // UFC/g
    },
    costPerKg: 8.50,
    availability: "year_round",
    maxUsage: 0.1
  },
  {
    id: "prebioticos",
    name: {
      es: "Prebióticos",
      en: "Prebiotics",
      de: "Präbiotika"
    },
    category: "aditivos",
    composition: {
      dryMatter: 95,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      prebiotics: 95.0 // % pureza
    },
    costPerKg: 6.80,
    availability: "year_round",
    maxUsage: 0.2
  },
  {
    id: "enzimas_digestivas",
    name: {
      es: "Enzimas Digestivas",
      en: "Digestive Enzymes",
      de: "Verdauungsenzyme"
    },
    category: "aditivos",
    composition: {
      dryMatter: 95,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      enzymes: 50000 // Unidades/g
    },
    costPerKg: 12.50,
    availability: "year_round",
    maxUsage: 0.05
  },
  {
    id: "antioxidantes",
    name: {
      es: "Antioxidantes",
      en: "Antioxidants",
      de: "Antioxidantien"
    },
    category: "aditivos",
    composition: {
      dryMatter: 98,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      antioxidants: 90.0 // % actividad
    },
    costPerKg: 4.20,
    availability: "year_round",
    maxUsage: 0.02
  },
  {
    id: "acidificantes",
    name: {
      es: "Acidificantes",
      en: "Acidifiers",
      de: "Säuerungsmittel"
    },
    category: "aditivos",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      organicAcids: 85.0 // % ácidos orgánicos
    },
    costPerKg: 3.50,
    availability: "year_round",
    maxUsage: 0.3
  },
  {
    id: "levadura_viva",
    name: {
      es: "Levadura Viva",
      en: "Live Yeast",
      de: "Lebende Hefe"
    },
    category: "aditivos",
    composition: {
      dryMatter: 95,
      metabolizableEnergy: 0.0,
      crudeProtein: 45.0,
      calcium: 0.1,
      phosphorus: 1.5,
      fiber: 0.0,
      yeastCells: 20000000 // células/g
    },
    costPerKg: 7.80,
    availability: "year_round",
    maxUsage: 0.1
  },

  // SUBPRODUCTOS INDUSTRIALES EUROPEOS
  {
    id: "bagazo_cerveza",
    name: {
      es: "Bagazo de Cerveza",
      en: "Brewers Grains",
      de: "Biertreber"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 22,
      metabolizableEnergy: 9.8,
      crudeProtein: 24.0,
      calcium: 0.3,
      phosphorus: 0.5,
      fiber: 17.0
    },
    costPerKg: 0.12,
    availability: "year_round"
  },
  {
    id: "pulpa_citricos",
    name: {
      es: "Pulpa de Cítricos",
      en: "Citrus Pulp",
      de: "Zitrustrester"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 11.2,
      crudeProtein: 7.0,
      calcium: 1.8,
      phosphorus: 0.12,
      fiber: 13.0
    },
    costPerKg: 0.16,
    availability: "seasonal"
  },
  {
    id: "harina_colza",
    name: {
      es: "Harina de Colza",
      en: "Rapeseed Meal",
      de: "Rapsschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 9.8,
      crudeProtein: 36.0,
      calcium: 0.7,
      phosphorus: 1.1,
      fiber: 11.5
    },
    costPerKg: 0.38,
    availability: "year_round"
  },
  {
    id: "gluten_maiz",
    name: {
      es: "Gluten de Maíz",
      en: "Corn Gluten Meal",
      de: "Maiskleber"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 12.5,
      crudeProtein: 60.0,
      calcium: 0.05,
      phosphorus: 0.4,
      fiber: 3.0
    },
    costPerKg: 0.55,
    availability: "year_round"
  },
  {
    id: "harina_girasol_descascarillada",
    name: {
      es: "Harina de Girasol Descascarillada",
      en: "Dehulled Sunflower Meal",
      de: "Geschältes Sonnenblumenschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 9.5,
      crudeProtein: 42.0,
      calcium: 0.4,
      phosphorus: 1.2,
      fiber: 12.0
    },
    costPerKg: 0.42,
    availability: "seasonal"
  },

  // LEGUMINOSAS EUROPEAS
  {
    id: "guisantes",
    name: {
      es: "Guisantes",
      en: "Field Peas",
      de: "Erbsen"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 11.8,
      crudeProtein: 23.0,
      calcium: 0.08,
      phosphorus: 0.42,
      fiber: 6.0
    },
    costPerKg: 0.35,
    availability: "seasonal"
  },
  {
    id: "habas",
    name: {
      es: "Habas",
      en: "Faba Beans",
      de: "Ackerbohnen"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 86,
      metabolizableEnergy: 11.5,
      crudeProtein: 28.0,
      calcium: 0.12,
      phosphorus: 0.45,
      fiber: 8.0
    },
    costPerKg: 0.32,
    availability: "seasonal"
  },
  {
    id: "lupino",
    name: {
      es: "Lupino",
      en: "Lupin",
      de: "Lupine"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 10.8,
      crudeProtein: 32.0,
      calcium: 0.15,
      phosphorus: 0.38,
      fiber: 15.0
    },
    costPerKg: 0.38,
    availability: "seasonal"
  },
  {
    id: "veza",
    name: {
      es: "Veza",
      en: "Vetch",
      de: "Wicke"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 10.2,
      crudeProtein: 25.0,
      calcium: 0.18,
      phosphorus: 0.35,
      fiber: 12.0
    },
    costPerKg: 0.28,
    availability: "seasonal"
  },

  // FORRAJES EUROPEOS ADICIONALES
  {
    id: "heno_dactilo",
    name: {
      es: "Heno de Dáctilo",
      en: "Cocksfoot Hay",
      de: "Knaulgras-Heu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 86,
      metabolizableEnergy: 8.5,
      crudeProtein: 11.0,
      calcium: 0.5,
      phosphorus: 0.28,
      fiber: 30.0
    },
    costPerKg: 0.17,
    availability: "seasonal"
  },
  {
    id: "heno_ballico",
    name: {
      es: "Heno de Ballico",
      en: "Ryegrass Hay",
      de: "Weidelgras-Heu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 85,
      metabolizableEnergy: 9.0,
      crudeProtein: 12.5,
      calcium: 0.45,
      phosphorus: 0.32,
      fiber: 28.0
    },
    costPerKg: 0.18,
    availability: "seasonal"
  },
  {
    id: "heno_festuca",
    name: {
      es: "Heno de Festuca",
      en: "Fescue Hay",
      de: "Schwingel-Heu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 8.2,
      crudeProtein: 9.5,
      calcium: 0.4,
      phosphorus: 0.25,
      fiber: 32.0
    },
    costPerKg: 0.16,
    availability: "seasonal"
  },
  {
    id: "heno_esparceta",
    name: {
      es: "Heno de Esparceta",
      en: "Sainfoin Hay",
      de: "Esparsetten-Heu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 9.5,
      crudeProtein: 16.0,
      calcium: 1.5,
      phosphorus: 0.25,
      fiber: 25.0
    },
    costPerKg: 0.20,
    availability: "seasonal"
  },

  // CEREALES MENORES EUROPEOS
  {
    id: "triticale",
    name: {
      es: "Triticale",
      en: "Triticale",
      de: "Triticale"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 12.2,
      crudeProtein: 13.0,
      calcium: 0.06,
      phosphorus: 0.38,
      fiber: 3.5
    },
    costPerKg: 0.27,
    availability: "seasonal"
  },
  {
    id: "espelta",
    name: {
      es: "Espelta",
      en: "Spelt",
      de: "Dinkel"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 11.8,
      crudeProtein: 14.5,
      calcium: 0.08,
      phosphorus: 0.42,
      fiber: 4.0
    },
    costPerKg: 0.38,
    availability: "seasonal"
  },
  {
    id: "alforfon",
    name: {
      es: "Alforfón",
      en: "Buckwheat",
      de: "Buchweizen"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 11.2,
      crudeProtein: 12.0,
      calcium: 0.12,
      phosphorus: 0.35,
      fiber: 10.0
    },
    costPerKg: 0.42,
    availability: "seasonal"
  },

  // SUBPRODUCTOS DE OLEAGINOSAS
  {
    id: "torta_sesamo",
    name: {
      es: "Torta de Sésamo",
      en: "Sesame Meal",
      de: "Sesamschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 92,
      metabolizableEnergy: 8.5,
      crudeProtein: 45.0,
      calcium: 2.1,
      phosphorus: 1.8,
      fiber: 6.0
    },
    costPerKg: 0.65,
    availability: "year_round"
  },
  {
    id: "torta_cartamo",
    name: {
      es: "Torta de Cártamo",
      en: "Safflower Meal",
      de: "Färberdistelschrot"
    },
    category: "suplementos_proteicos",
    composition: {
      dryMatter: 91,
      metabolizableEnergy: 7.8,
      crudeProtein: 38.0,
      calcium: 0.4,
      phosphorus: 0.8,
      fiber: 18.0
    },
    costPerKg: 0.45,
    availability: "seasonal"
  },

  // RAÍCES Y TUBÉRCULOS
  {
    id: "remolacha_forrajera",
    name: {
      es: "Remolacha Forrajera",
      en: "Fodder Beet",
      de: "Futterrübe"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 12,
      metabolizableEnergy: 12.5,
      crudeProtein: 5.0,
      calcium: 0.15,
      phosphorus: 0.08,
      fiber: 4.0
    },
    costPerKg: 0.04,
    availability: "seasonal"
  },
  {
    id: "nabo_forrajero",
    name: {
      es: "Nabo Forrajero",
      en: "Fodder Turnip",
      de: "Futterrübe"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 10,
      metabolizableEnergy: 11.8,
      crudeProtein: 8.0,
      calcium: 0.25,
      phosphorus: 0.12,
      fiber: 6.0
    },
    costPerKg: 0.03,
    availability: "seasonal"
  },
  {
    id: "zanahoria_forrajera",
    name: {
      es: "Zanahoria Forrajera",
      en: "Fodder Carrot",
      de: "Futtermöhre"
    },
    category: "alimentos_energeticos",
    composition: {
      dryMatter: 11,
      metabolizableEnergy: 12.0,
      crudeProtein: 6.0,
      calcium: 0.18,
      phosphorus: 0.10,
      fiber: 5.0
    },
    costPerKg: 0.05,
    availability: "seasonal"
  },

  // PASTOS ESPECIALIZADOS
  {
    id: "ray_grass_italiano",
    name: {
      es: "Ray Grass Italiano",
      en: "Italian Ryegrass",
      de: "Italienisches Weidelgras"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 16,
      metabolizableEnergy: 12.5,
      crudeProtein: 20.0,
      calcium: 0.6,
      phosphorus: 0.4,
      fiber: 20.0
    },
    costPerKg: 0.035,
    availability: "seasonal"
  },
  {
    id: "pasto_sudan",
    name: {
      es: "Pasto Sudán",
      en: "Sudan Grass",
      de: "Sudangras"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 20,
      metabolizableEnergy: 10.5,
      crudeProtein: 15.0,
      calcium: 0.4,
      phosphorus: 0.3,
      fiber: 26.0
    },
    costPerKg: 0.025,
    availability: "seasonal"
  },
  {
    id: "pasto_elefante",
    name: {
      es: "Pasto Elefante",
      en: "Elephant Grass",
      de: "Elefantengras"
    },
    category: "pastos_verdes",
    composition: {
      dryMatter: 18,
      metabolizableEnergy: 9.8,
      crudeProtein: 12.0,
      calcium: 0.35,
      phosphorus: 0.25,
      fiber: 30.0
    },
    costPerKg: 0.02,
    availability: "year_round"
  },

  // MINERALES ADICIONALES
  {
    id: "harina_huesos",
    name: {
      es: "Harina de Huesos",
      en: "Bone Meal",
      de: "Knochenmehl"
    },
    category: "minerales",
    composition: {
      dryMatter: 95,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 24.0,
      phosphorus: 12.0,
      fiber: 0.0
    },
    costPerKg: 0.45,
    availability: "year_round",
    maxUsage: 1.0
  },
  {
    id: "yodato_calcio",
    name: {
      es: "Yodato de Calcio",
      en: "Calcium Iodate",
      de: "Calciumjodat"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 11.0,
      phosphorus: 0.0,
      fiber: 0.0,
      iodine: 65.0
    },
    costPerKg: 18.00,
    availability: "year_round",
    maxUsage: 0.001
  },
  {
    id: "sulfato_hierro",
    name: {
      es: "Sulfato de Hierro",
      en: "Iron Sulfate",
      de: "Eisensulfat"
    },
    category: "minerales",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      iron: 20.0
    },
    costPerKg: 1.80,
    availability: "year_round",
    maxUsage: 0.02
  },

  // ADITIVOS ADICIONALES
  {
    id: "bentonita",
    name: {
      es: "Bentonita",
      en: "Bentonite",
      de: "Bentonit"
    },
    category: "aditivos",
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.8,
      phosphorus: 0.0,
      fiber: 0.0,
      bindingCapacity: 95.0
    },
    costPerKg: 0.35,
    availability: "year_round",
    maxUsage: 2.0
  },
  {
    id: "bicarbonato_sodio",
    name: {
      es: "Bicarbonato de Sodio",
      en: "Sodium Bicarbonate",
      de: "Natriumbicarbonat"
    },
    category: "aditivos",
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      calcium: 0.0,
      phosphorus: 0.0,
      fiber: 0.0,
      sodium: 27.0,
      bufferCapacity: 95.0
    },
    costPerKg: 0.65,
    availability: "year_round",
    maxUsage: 1.0
  },

  // NEUE FUTTERMITTEL - Trockenfutter
  {
    id: "mixed_meadow_hay_fine",
    name: {
      es: "Heno de pradera mixta fino",
      en: "Mixed meadow hay fine",
      de: "Wiesenheu fein"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 86.4,
      metabolizableEnergy: 7.8,
      crudeProtein: 11.1,
      crudeProteinDigestible: 7.8,
      crudeFiber: 28.0,
      calcium: 0.68,
      phosphorus: 0.27,
      ndf: 55.0,
      adf: 32.0
    },
    costPerKg: 0.08,
    availability: "seasonal",
    description: {
      es: "Heno de pradera natural mixta de alta calidad",
      en: "High quality mixed natural meadow hay",
      de: "Hochwertiges Wiesenheu aus Naturwiesen"
    }
  },

  {
    id: "clover_hay",
    name: {
      es: "Heno de trébol",
      en: "Clover hay",
      de: "Kleeheu"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 87.5,
      metabolizableEnergy: 8.6,
      crudeProtein: 11.7,
      crudeProteinDigestible: 8.2,
      crudeFiber: 26.5,
      calcium: 1.89,
      phosphorus: 0.24,
      ndf: 48.0,
      adf: 30.5
    },
    costPerKg: 0.11,
    availability: "year_round",
    description: {
      es: "Heno de trébol rico en proteína y calcio",
      en: "Protein and calcium rich clover hay",
      de: "Protein- und calciumreiches Kleeheu"
    }
  },

  {
    id: "turnip_tops_hay_premium",
    name: {
      es: "Heno de hojas de nabo premium",
      en: "Turnip tops hay premium",
      de: "Rübenblattheu Premium"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 90.7,
      metabolizableEnergy: 7.3,
      crudeProtein: 8.9,
      crudeProteinDigestible: 5.8,
      crudeFiber: 32.0,
      calcium: 0.60,
      phosphorus: 0.24,
      ndf: 58.0,
      adf: 35.5
    },
    costPerKg: 0.16,
    availability: "seasonal",
    description: {
      es: "Heno de hojas de nabo de calidad premium",
      en: "Premium quality turnip tops hay",
      de: "Premium Rübenblattheu"
    }
  },

  {
    id: "velvet_bean_hay_fine",
    name: {
      es: "Heno de frijol terciopelo fino",
      en: "Velvet bean hay fine",
      de: "Samtbohnenheu fein"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 89.3,
      metabolizableEnergy: 8.5,
      crudeProtein: 12.0,
      crudeProteinDigestible: 8.5,
      crudeFiber: 19.4,
      calcium: 1.16,
      phosphorus: 0.18,
      ndf: 34.9,
      adf: 15.5
    },
    costPerKg: 0.17,
    availability: "year_round",
    description: {
      es: "Heno de leguminosa tropical rica en proteína",
      en: "Protein-rich tropical legume hay",
      de: "Proteinreiches Heu aus tropischen Leguminosen"
    }
  },

  {
    id: "wheat_chaff_elite",
    name: {
      es: "Paja de trigo elite",
      en: "Wheat chaff elite",
      de: "Weizenspreu Elite"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 85.3,
      metabolizableEnergy: 7.7,
      crudeProtein: 7.9,
      crudeProteinDigestible: 4.6,
      crudeFiber: 27.2,
      calcium: 0.40,
      phosphorus: 0.21,
      ndf: 49.0,
      adf: 21.8
    },
    costPerKg: 0.19,
    availability: "year_round",
    description: {
      es: "Subproducto de trigo de alta calidad",
      en: "High quality wheat by-product",
      de: "Hochwertiges Weizen-Nebenprodukt"
    }
  },

  {
    id: "rice_husks_premium",
    name: {
      es: "Cascarilla de arroz premium",
      en: "Rice husks premium",
      de: "Reishülsen Premium"
    },
    category: "forrajes_secos",
    composition: {
      dryMatter: 87.0,
      metabolizableEnergy: 6.5,
      crudeProtein: 15.9,
      crudeProteinDigestible: 13.1,
      crudeFiber: 36.0,
      calcium: 0.87,
      phosphorus: 0.28,
      ndf: 65.0,
      adf: 28.8
    },
    costPerKg: 0.11,
    availability: "seasonal",
    description: {
      es: "Cascarilla de arroz rica en proteína",
      en: "Protein-rich rice husks",
      de: "Proteinreiche Reishülsen"
    }
  }
];

export const getIngredientById = (ingredientId) => {
  return faoIngredients.find(ingredient => ingredient.id === ingredientId) || null;
};

export const getIngredientsByCategory = (categoryId) => {
  const allIngredients = getAllIngredients();
  return allIngredients.filter(ingredient => ingredient.category === categoryId);
};

export const getAllIngredients = () => {
  // Kombiniere ursprüngliche FAO-Ingredienzien mit Feedipedia-Daten
  return [...faoIngredients, ...feedipediaIngredients];
};

// Funktion um erweiterte Nährstoffdaten zu einem Ingredienz hinzuzufügen
export const getDetailedNutritionData = (ingredientId) => {
  return detailedNutritionData[ingredientId] || null;
};

// Erweiterte Proteinfuttermittel
export const getProteinFeedstuffs = () => {
  return proteinFeedstuffs;
};