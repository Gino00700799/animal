// Ingredientes enfocados a engorde intensivo (Feedlot) según perfiles típicos FAO / feedlot
// Reemplazo completo de la base previa para simplificar y centrar en dietas de ternero, novillo y toro intensivo.

export const faoIngredientCategories = {
  forrajes_secos: {
    name: { es: 'Forrajes Secos', en: 'Dry Forages', de: 'Trockenfutter' },
    emoji: '🌾',
    color: '#f59e0b'
  },
  ensilados: {
    name: { es: 'Ensilados', en: 'Silages', de: 'Silagen' },
    emoji: '🌽',
    color: '#06b6d4'
  },
  alimentos_energeticos: {
    name: { es: 'Concentrados Energéticos', en: 'Energy Concentrates', de: 'Energiekonzentrate' },
    emoji: '⚡',
    color: '#8b5cf6'
  },
  suplementos_proteicos: {
    name: { es: 'Proteicos', en: 'Protein Sources', de: 'Proteinträger' },
    emoji: '💪',
    color: '#ef4444'
  },
  subproductos_fibro_energeticos: {
    name: { es: 'Subproductos Fibro-Energéticos', en: 'Fibrous By-products', de: 'Faserreiche Nebenprodukte' },
    emoji: '🧃',
    color: '#10b981'
  },
  minerales: {
    name: { es: 'Minerales', en: 'Minerals', de: 'Mineralstoffe' },
    emoji: '🧂',
    color: '#6b7280'
  },
  premix: {
    name: { es: 'Premix Vitam/Mineral', en: 'Vitamin/Mineral Premix', de: 'Vitamin-/Mineral-Premix' },
    emoji: '💊',
    color: '#f59e0b'
  }
};

// Notas:
// dryMatter (% materia fresca), metabolizableEnergy (MJ/kg MS), crudeProtein (% MS),
// fiber (% MS, aproximación NDF funcional), calcium & phosphorus (% MS)
// maxUsage = límite recomendado (% de la MS total de la dieta)
// costPerKg expresado sobre producto tal cual (fresco) cuando aplica.

export const faoIngredients = [
  // FORRAJES SECOS BASE
  {
    id: 'heno_pradera',
    name: { es: 'Heno de Pradera', en: 'Meadow Hay', de: 'Wiesenheu' },
    category: 'forrajes_secos',
    composition: {
      dryMatter: 85,
      metabolizableEnergy: 8.5,
      crudeProtein: 8.0,
      fiber: 55, // NDF aprox
      calcium: 0.45,
      phosphorus: 0.25
    },
    costPerKg: 0.15,
    availability: 'year_round',
    maxUsage: 30
  },
  {
    id: 'heno_alfalfa_premium',
    name: { es: 'Heno de Alfalfa Premium', en: 'Premium Alfalfa Hay', de: 'Premium Luzerneheu' },
    category: 'forrajes_secos',
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 9.5,
      crudeProtein: 18.0,
      fiber: 42,
      calcium: 1.35,
      phosphorus: 0.24
    },
    costPerKg: 0.24,
    availability: 'year_round',
    maxUsage: 25
  },
  {
    id: 'paja_trigo',
    name: { es: 'Paja de Trigo', en: 'Wheat Straw', de: 'Weizenstroh' },
    category: 'forrajes_secos',
    composition: {
      dryMatter: 86,
      metabolizableEnergy: 6.2,
      crudeProtein: 3.5,
      fiber: 75,
      calcium: 0.18,
      phosphorus: 0.08
    },
    costPerKg: 0.05,
    availability: 'seasonal',
    maxUsage: 10
  },

  // ENSILADOS
  {
    id: 'ensilado_maiz',
    name: { es: 'Ensilado de Maíz', en: 'Corn Silage', de: 'Maissilage' },
    category: 'ensilados',
    composition: {
      dryMatter: 35,
      metabolizableEnergy: 10.8,
      crudeProtein: 8.0,
      fiber: 45,
      calcium: 0.25,
      phosphorus: 0.22
    },
    costPerKg: 0.08,
    availability: 'year_round',
    maxUsage: 65
  },
  {
    id: 'ensilado_sorgo',
    name: { es: 'Ensilado de Sorgo', en: 'Sorghum Silage', de: 'Sorghumsilage' },
    category: 'ensilados',
    composition: {
      dryMatter: 32,
      metabolizableEnergy: 10.2,
      crudeProtein: 7.5,
      fiber: 50,
      calcium: 0.28,
      phosphorus: 0.25
    },
    costPerKg: 0.07,
    availability: 'seasonal',
    maxUsage: 50
  },

  // CONCENTRADOS ENERGÉTICOS
  {
    id: 'maiz_grano',
    name: { es: 'Maíz Grano', en: 'Corn Grain', de: 'Maiskorn' },
    category: 'alimentos_energeticos',
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 13.2,
      crudeProtein: 8.5,
      fiber: 12, // NDF aprox
      calcium: 0.03,
      phosphorus: 0.28
    },
    costPerKg: 0.28,
    availability: 'year_round',
    maxUsage: 70
  },
  {
    id: 'cebada',
    name: { es: 'Cebada', en: 'Barley', de: 'Gerste' },
    category: 'alimentos_energeticos',
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 11.8,
      crudeProtein: 12.0,
      fiber: 20,
      calcium: 0.07,
      phosphorus: 0.34
    },
    costPerKg: 0.25,
    availability: 'seasonal',
    maxUsage: 50
  },
  {
    id: 'sorgo_grano',
    name: { es: 'Sorgo Grano', en: 'Sorghum Grain', de: 'Sorghum' },
    category: 'alimentos_energeticos',
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 10.6,
      crudeProtein: 10.0,
      fiber: 16,
      calcium: 0.04,
      phosphorus: 0.32
    },
    costPerKg: 0.24,
    availability: 'seasonal',
    maxUsage: 55
  },
  {
    id: 'trigo',
    name: { es: 'Trigo', en: 'Wheat', de: 'Weizen' },
    category: 'alimentos_energeticos',
    composition: {
      dryMatter: 87,
      metabolizableEnergy: 12.8,
      crudeProtein: 12.5,
      fiber: 11,
      calcium: 0.05,
      phosphorus: 0.35
    },
    costPerKg: 0.30,
    availability: 'seasonal',
    maxUsage: 40
  },
  {
    id: 'melaza',
    name: { es: 'Melaza', en: 'Molasses', de: 'Melasse' },
    category: 'alimentos_energeticos',
    composition: {
      dryMatter: 75,
      metabolizableEnergy: 8.7,
      crudeProtein: 4.3,
      fiber: 0,
      calcium: 0.89,
      phosphorus: 0.05
    },
    costPerKg: 0.19,
    availability: 'year_round',
    maxUsage: 5
  },
  {
    id: 'aceite_soya',
    name: { es: 'Aceite de Soya', en: 'Soybean Oil', de: 'Sojaöl' },
    category: 'alimentos_energeticos',
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 37.0,
      crudeProtein: 0.0,
      fiber: 0,
      calcium: 0.0,
      phosphorus: 0.0
    },
    costPerKg: 1.20,
    availability: 'year_round',
    maxUsage: 3
  },

  // PROTEICOS
  {
    id: 'harina_soya',
    name: { es: 'Harina de Soya', en: 'Soybean Meal', de: 'Sojaschrot' },
    category: 'suplementos_proteicos',
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 11.0,
      crudeProtein: 45.0,
      fiber: 15,
      calcium: 0.24,
      phosphorus: 0.84
    },
    costPerKg: 0.45,
    availability: 'year_round',
    maxUsage: 25
  },
  {
    id: 'harina_canola',
    name: { es: 'Harina de Canola', en: 'Canola Meal', de: 'Rapsschrot' },
    category: 'suplementos_proteicos',
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 9.5,
      crudeProtein: 38.0,
      fiber: 20,
      calcium: 0.65,
      phosphorus: 1.15
    },
    costPerKg: 0.38,
    availability: 'year_round',
    maxUsage: 20
  },
  {
    id: 'harina_girasol',
    name: { es: 'Harina de Girasol', en: 'Sunflower Meal', de: 'Sonnenblumenschrot' },
    category: 'suplementos_proteicos',
    composition: {
      dryMatter: 89,
      metabolizableEnergy: 8.0,
      crudeProtein: 32.0,
      fiber: 30,
      calcium: 0.38,
      phosphorus: 0.93
    },
    costPerKg: 0.35,
    availability: 'seasonal',
    maxUsage: 20
  },
  {
    id: 'gluten_maiz',
    name: { es: 'Gluten de Maíz', en: 'Corn Gluten Meal', de: 'Maiskleber' },
    category: 'suplementos_proteicos',
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 12.5,
      crudeProtein: 60.0,
      fiber: 10,
      calcium: 0.05,
      phosphorus: 0.40
    },
    costPerKg: 0.55,
    availability: 'year_round',
    maxUsage: 15
  },
  {
    id: 'urea',
    name: { es: 'Urea', en: 'Urea', de: 'Harnstoff' },
    category: 'suplementos_proteicos',
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 287.0, // Equivalente proteico
      fiber: 0,
      calcium: 0.0,
      phosphorus: 0.0
    },
    costPerKg: 0.80,
    availability: 'year_round',
    maxUsage: 1
  },

  // SUBPRODUCTOS FIBRO-ENERGÉTICOS
  {
    id: 'pulpa_remolacha',
    name: { es: 'Pulpa de Remolacha', en: 'Sugar Beet Pulp', de: 'Zuckerrübenschnitzel' },
    category: 'subproductos_fibro_energeticos',
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 10.8,
      crudeProtein: 9.5,
      fiber: 42,
      calcium: 0.65,
      phosphorus: 0.08
    },
    costPerKg: 0.18,
    availability: 'year_round',
    maxUsage: 30
  },
  {
    id: 'cascarilla_soya',
    name: { es: 'Cascarilla de Soya', en: 'Soybean Hulls', de: 'Sojahülsen' },
    category: 'subproductos_fibro_energeticos',
    composition: {
      dryMatter: 90,
      metabolizableEnergy: 8.2,
      crudeProtein: 12.0,
      fiber: 60,
      calcium: 0.50,
      phosphorus: 0.15
    },
    costPerKg: 0.15,
    availability: 'year_round',
    maxUsage: 35
  },
  {
    id: 'salvado_trigo',
    name: { es: 'Salvado de Trigo', en: 'Wheat Bran', de: 'Weizenkleie' },
    category: 'subproductos_fibro_energeticos',
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 9.5,
      crudeProtein: 15.5,
      fiber: 40,
      calcium: 0.12,
      phosphorus: 1.20
    },
    costPerKg: 0.22,
    availability: 'year_round',
    maxUsage: 20
  },
  {
    id: 'bagazo_cerveza',
    name: { es: 'Bagazo de Cerveza', en: 'Brewers Grains (Wet)', de: 'Biertreber (frisch)' },
    category: 'subproductos_fibro_energeticos',
    composition: {
      dryMatter: 25,
      metabolizableEnergy: 9.8,
      crudeProtein: 24.0,
      fiber: 48,
      calcium: 0.30,
      phosphorus: 0.50
    },
    costPerKg: 0.10,
    availability: 'year_round',
    maxUsage: 20
  },
  {
    id: 'pulpa_citricos',
    name: { es: 'Pulpa de Cítricos', en: 'Citrus Pulp', de: 'Zitrustrester' },
    category: 'subproductos_fibro_energeticos',
    composition: {
      dryMatter: 88,
      metabolizableEnergy: 11.2,
      crudeProtein: 7.0,
      fiber: 30,
      calcium: 1.80,
      phosphorus: 0.12
    },
    costPerKg: 0.16,
    availability: 'seasonal',
    maxUsage: 25
  },

  // MINERALES BÁSICOS
  {
    id: 'carbonato_calcio',
    name: { es: 'Carbonato de Calcio', en: 'Calcium Carbonate', de: 'Calciumcarbonat' },
    category: 'minerales',
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      fiber: 0,
      calcium: 40.0,
      phosphorus: 0.0
    },
    costPerKg: 0.25,
    availability: 'year_round',
    maxUsage: 2
  },
  {
    id: 'fosfato_dicalcico',
    name: { es: 'Fosfato Dicálcico', en: 'Dicalcium Phosphate', de: 'Dicalciumphosphat' },
    category: 'minerales',
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      fiber: 0,
      calcium: 23.0,
      phosphorus: 18.0
    },
    costPerKg: 0.85,
    availability: 'year_round',
    maxUsage: 1.5
  },
  {
    id: 'sal_comun',
    name: { es: 'Sal Común (NaCl)', en: 'Common Salt (NaCl)', de: 'Kochsalz (NaCl)' },
    category: 'minerales',
    composition: {
      dryMatter: 99,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      fiber: 0,
      calcium: 0.0,
      phosphorus: 0.0
    },
    costPerKg: 0.15,
    availability: 'year_round',
    maxUsage: 1
  },

  // PREMIX VITAM/MINERAL (trazas concentradas)
  {
    id: 'premix_vitam_mineral',
    name: { es: 'Premix Vitam-Mineral', en: 'Vitamin-Mineral Premix', de: 'Vitamin-Mineral-Premix' },
    category: 'premix',
    composition: {
      dryMatter: 95,
      metabolizableEnergy: 0.0,
      crudeProtein: 0.0,
      fiber: 0,
      calcium: 8.0,
      phosphorus: 4.0,
      // Ejemplo de inclusión de micro (comentado si no se usan en cálculos):
      // vitaminA: 500000, // UI/kg
      // vitaminD3: 100000,
      // vitaminE: 50000,
      // zinc: 4.0, // % (40,000 ppm)
      // copper: 1.0,
      // selenium: 0.02 // 200 ppm
    },
    costPerKg: 2.50,
    availability: 'year_round',
    maxUsage: 0.5
  },

  // NUEVOS INGREDIENTES FEEDLOT ADICIONALES
  {
    id: 'heno_pellets_alfalfa',
    name: { es: 'Pellets de Alfalfa', en: 'Alfalfa Pellets', de: 'Luzernepellets' },
    category: 'forrajes_secos',
    composition: { dryMatter: 90, metabolizableEnergy: 9.8, crudeProtein: 17.0, fiber: 40, calcium: 1.30, phosphorus: 0.24 },
    costPerKg: 0.26,
    availability: 'year_round',
    maxUsage: 25
  },
  {
    id: 'ensilado_alfalfa',
    name: { es: 'Ensilado de Alfalfa', en: 'Alfalfa Silage', de: 'Luzernesilage' },
    category: 'ensilados',
    composition: { dryMatter: 35, metabolizableEnergy: 9.5, crudeProtein: 16.0, fiber: 45, calcium: 1.10, phosphorus: 0.25 },
    costPerKg: 0.11,
    availability: 'year_round',
    maxUsage: 40
  },
  {
    id: 'maiz_rollado',
    name: { es: 'Maíz ROL (Rolado)', en: 'Rolled Corn', de: 'Gewalzter Mais' },
    category: 'alimentos_energeticos',
    composition: { dryMatter: 88, metabolizableEnergy: 13.4, crudeProtein: 8.5, fiber: 11, calcium: 0.03, phosphorus: 0.28 },
    costPerKg: 0.30,
    availability: 'year_round',
    maxUsage: 70
  },
  {
    id: 'sebo_bovino',
    name: { es: 'Sebo Bovino', en: 'Beef Tallow', de: 'Rindertalg' },
    category: 'alimentos_energeticos',
    composition: { dryMatter: 99, metabolizableEnergy: 33.0, crudeProtein: 0.0, fiber: 0, calcium: 0.0, phosphorus: 0.0 },
    costPerKg: 0.95,
    availability: 'year_round',
    maxUsage: 3
  },
  {
    id: 'ddgs_maiz',
    name: { es: 'DDGS de Maíz', en: 'Corn DDGS', de: 'Mais DDGS' },
    category: 'suplementos_proteicos',
    composition: { dryMatter: 90, metabolizableEnergy: 13.0, crudeProtein: 30.0, fiber: 28, calcium: 0.20, phosphorus: 0.85 },
    costPerKg: 0.32,
    availability: 'year_round',
    maxUsage: 25
  },
  {
    id: 'semilla_algodon_entera',
    name: { es: 'Semilla de Algodón Entera', en: 'Whole Cottonseed', de: 'Ganze Baumwollsaat' },
    category: 'suplementos_proteicos',
    composition: { dryMatter: 92, metabolizableEnergy: 12.5, crudeProtein: 23.0, fiber: 32, calcium: 0.15, phosphorus: 0.65 },
    costPerKg: 0.40,
    availability: 'seasonal',
    maxUsage: 20
  },
  {
    id: 'harina_sangre',
    name: { es: 'Harina de Sangre', en: 'Blood Meal', de: 'Blutmehl' },
    category: 'suplementos_proteicos',
    composition: { dryMatter: 92, metabolizableEnergy: 12.0, crudeProtein: 88.0, fiber: 1, calcium: 0.30, phosphorus: 0.30 },
    costPerKg: 1.10,
    availability: 'year_round',
    maxUsage: 5
  },
  {
    id: 'harina_pluma',
    name: { es: 'Harina de Pluma Hidrolizada', en: 'Hydrolyzed Feather Meal', de: 'Hydrolisiertes Federmehl' },
    category: 'suplementos_proteicos',
    composition: { dryMatter: 92, metabolizableEnergy: 10.5, crudeProtein: 80.0, fiber: 1, calcium: 0.25, phosphorus: 0.55 },
    costPerKg: 0.90,
    availability: 'year_round',
    maxUsage: 5
  },
  {
    id: 'afrechillo_arroz',
    name: { es: 'Afrechillo de Arroz', en: 'Rice Bran', de: 'Reiskleie' },
    category: 'subproductos_fibro_energeticos',
    composition: { dryMatter: 90, metabolizableEnergy: 11.5, crudeProtein: 14.0, fiber: 20, calcium: 0.07, phosphorus: 1.50 },
    costPerKg: 0.26,
    availability: 'year_round',
    maxUsage: 25
  },
  {
    id: 'cascarilla_arroz',
    name: { es: 'Cascarilla de Arroz', en: 'Rice Hulls', de: 'Reisschalen' },
    category: 'subproductos_fibro_energeticos',
    composition: { dryMatter: 90, metabolizableEnergy: 5.0, crudeProtein: 3.0, fiber: 75, calcium: 0.10, phosphorus: 0.10 },
    costPerKg: 0.05,
    availability: 'year_round',
    maxUsage: 10
  }
];