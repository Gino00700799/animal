// Erweiterte Ingredienzien-Datenbank basierend auf Feedipedia-Daten
// Wissenschaftliche Nährstoffdaten für Wiederkäuer

export const feedipediaIngredients = [
  {
    id: "medicago_sativa_heu",
    name: {
      es: "Heno de Alfalfa",
      en: "Alfalfa Hay", 
      de: "Luzerne (Heu)"
    },
    scientificName: "Medicago sativa",
    category: "forrajes_secos",
    type: "Gras / Heu",
    regions: ["Europa", "Lateinamerika", "Afrika", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh", "Kälber", "Trächtige Kühe"],
    composition: {
      dryMatter: 89.4,
      metabolizableEnergy: 8.4,
      crudeProtein: 18.2,
      bypassProtein: 21, // % of crude protein
      rumenProtein: 79, // % of crude protein
      starch: null,
      ndf: 44.8,
      adf: 33.4,
      crudeFat: 2.1,
      ash: 10.7,
      netEnergy: 5.38,
      calcium: null,
      phosphorus: null,
      fiber: 33.4
    },
    costPerKg: 0.20,
    availability: "year_round",
    source: "https://www.feedipedia.org/node/275"
  },
  {
    id: "zea_mays_korner",
    name: {
      es: "Maíz en Grano",
      en: "Corn Grain",
      de: "Maiskörner"
    },
    scientificName: "Zea mays (Körner)",
    category: "alimentos_energeticos",
    type: "Korn",
    regions: ["Europa", "Lateinamerika", "Afrika", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh", "Kälber"],
    composition: {
      dryMatter: 86.3,
      metabolizableEnergy: 13.6,
      crudeProtein: 9.4,
      bypassProtein: null,
      rumenProtein: null,
      starch: 73.4,
      ndf: 12.2,
      adf: 3.0,
      crudeFat: 4.3,
      ash: 1.4,
      netEnergy: 8.7,
      calcium: 0.7,
      phosphorus: 3.6,
      fiber: 3.0
    },
    costPerKg: 0.28,
    availability: "year_round",
    source: "https://www.feedipedia.org/node/36"
  },
  {
    id: "avena_sativa",
    name: {
      es: "Avena en Grano",
      en: "Oat Grain",
      de: "Haferkörner"
    },
    scientificName: "Avena sativa",
    category: "alimentos_energeticos",
    type: "Korn",
    regions: ["Europa", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh", "Kälber"],
    composition: {
      dryMatter: 87.9,
      metabolizableEnergy: 12.2,
      crudeProtein: 11.0,
      bypassProtein: 10,
      rumenProtein: 90,
      starch: 40.6,
      ndf: 35.5,
      adf: 16.2,
      crudeFat: 5.4,
      ash: 3.0,
      netEnergy: 7.81,
      calcium: null,
      phosphorus: null,
      fiber: 16.2
    },
    costPerKg: 0.30,
    availability: "seasonal",
    source: "https://www.feedipedia.org/node/253"
  },
  {
    id: "brachiaria_decumbens",
    name: {
      es: "Pasto Señal Fresco",
      en: "Signal Grass Fresh",
      de: "Signalgras (frisch)"
    },
    scientificName: "Brachiaria decumbens",
    category: "pastos_verdes",
    type: "Gras / Frischmasse",
    regions: ["Afrika", "Lateinamerika"],
    animalTypes: ["Milchvieh", "Mastvieh", "Schafe", "Ziegen"],
    composition: {
      dryMatter: 26.8,
      metabolizableEnergy: 7.7,
      crudeProtein: 8.9,
      bypassProtein: 40,
      rumenProtein: 60,
      starch: null,
      ndf: 68.1,
      adf: 37.2,
      crudeFat: 1.9,
      ash: 8.6,
      netEnergy: 4.93,
      calcium: null,
      phosphorus: null,
      fiber: 37.2
    },
    costPerKg: 0.02,
    availability: "year_round",
    source: "https://www.feedipedia.org/node/287"
  },
  {
    id: "cynodon_dactylon",
    name: {
      es: "Heno de Bermuda",
      en: "Bermuda Grass Hay",
      de: "Bermudagras-Heu"
    },
    scientificName: "Cynodon dactylon",
    category: "forrajes_secos",
    type: "Gras / Heu",
    regions: ["Afrika", "Lateinamerika", "USA"],
    animalTypes: ["Milchvieh", "Schafe", "Ziegen", "Pferde"],
    composition: {
      dryMatter: 91.5,
      metabolizableEnergy: 7.4,
      crudeProtein: 10.2,
      bypassProtein: null,
      rumenProtein: null,
      starch: null,
      ndf: 73.7,
      adf: 35.5,
      crudeFat: 2.7,
      ash: 8.3,
      netEnergy: 4.74,
      calcium: null,
      phosphorus: null,
      fiber: 35.5
    },
    costPerKg: 0.12,
    availability: "year_round",
    source: "https://www.feedipedia.org/node/622"
  },
  {
    id: "glycine_max_schrot",
    name: {
      es: "Harina de Soja Tipo 48",
      en: "Soybean Meal Type 48",
      de: "Sojaschrot (Typ 48)"
    },
    scientificName: "Glycine max (Sojaschrot)",
    category: "suplementos_proteicos",
    type: "Proteinmehl",
    regions: ["Europa", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh", "Kälber"],
    composition: {
      dryMatter: 88.0,
      metabolizableEnergy: 13.4,
      crudeProtein: 52.6,
      bypassProtein: null,
      rumenProtein: null,
      starch: 5.7,
      ndf: 14.2,
      adf: 8.4,
      crudeFat: 1.8,
      ash: 7.1,
      netEnergy: 8.58,
      calcium: null,
      phosphorus: null,
      fiber: 8.4
    },
    costPerKg: 0.48,
    availability: "year_round",
    source: "https://www.feedipedia.org/node/507"
  },
  {
    id: "zea_mays_silage",
    name: {
      es: "Ensilado de Maíz",
      en: "Corn Silage",
      de: "Maissilage (30-35 % TM)"
    },
    scientificName: "Zea mays (Silage)",
    category: "ensilados",
    type: "Silage",
    regions: ["Europa", "Afrika", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh"],
    composition: {
      dryMatter: 32.5,
      metabolizableEnergy: 10.8,
      crudeProtein: 6.9,
      bypassProtein: 33,
      rumenProtein: 67,
      starch: 29.1,
      ndf: 44.3,
      adf: 23.3,
      crudeFat: 2.8,
      ash: 3.7,
      netEnergy: 6.91,
      calcium: null,
      phosphorus: null,
      fiber: 23.3
    },
    costPerKg: 0.08,
    availability: "year_round",
    source: "https://www.feedipedia.org/node/387"
  },
  {
    id: "hordeum_vulgare",
    name: {
      es: "Cebada en Grano",
      en: "Barley Grain",
      de: "Gerste (Korn)"
    },
    scientificName: "Hordeum vulgare",
    category: "alimentos_energeticos",
    type: "Korn",
    regions: ["Europa", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh", "Kälber"],
    composition: {
      dryMatter: 87.1,
      metabolizableEnergy: 12.4,
      crudeProtein: 11.8,
      bypassProtein: 29,
      rumenProtein: 71,
      starch: 59.7,
      ndf: 21.7,
      adf: 6.4,
      crudeFat: 2.0,
      ash: 2.6,
      netEnergy: 7.94,
      calcium: null,
      phosphorus: null,
      fiber: 6.4
    },
    costPerKg: 0.25,
    availability: "seasonal",
    source: "https://www.feedipedia.org/node/11705"
  },
  {
    id: "triticum_aestivum",
    name: {
      es: "Trigo en Grano",
      en: "Wheat Grain",
      de: "Weizen (Korn)"
    },
    scientificName: "Triticum aestivum",
    category: "alimentos_energeticos",
    type: "Korn",
    regions: ["Europa", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh", "Kälber"],
    composition: {
      dryMatter: 87.0,
      metabolizableEnergy: 13.1,
      crudeProtein: 12.6,
      bypassProtein: 40,
      rumenProtein: 60,
      starch: 69.1,
      ndf: 13.9,
      adf: 3.6,
      crudeFat: 1.7,
      ash: 1.8,
      netEnergy: 8.38,
      calcium: 0.7,
      phosphorus: 3.6,
      fiber: 3.6
    },
    costPerKg: 0.26,
    availability: "seasonal",
    source: "https://www.feedipedia.org/node/223"
  },
  {
    id: "wheat_bran",
    name: {
      es: "Salvado de Trigo",
      en: "Wheat Bran",
      de: "Weizenkleie"
    },
    scientificName: "Wheat bran",
    category: "suplementos_proteicos",
    type: "Nebenprodukt",
    regions: ["Europa", "USA"],
    animalTypes: ["Milchvieh", "Mastvieh"],
    composition: {
      dryMatter: 87.0,
      metabolizableEnergy: 11.0,
      crudeProtein: 17.3,
      bypassProtein: 20,
      rumenProtein: 80,
      starch: 23.1,
      ndf: 45.2,
      adf: 13.4,
      crudeFat: 3.9,
      ash: 5.6,
      netEnergy: 7.04,
      calcium: null,
      phosphorus: null,
      fiber: 13.4
    },
    costPerKg: 0.18,
    availability: "year_round",
    source: "https://www.feedipedia.org/node/726"
  }
];

// Funktion um Feedipedia-Ingredienzien nach Kategorie zu filtern
export const getFeedipediaByCategory = (categoryId) => {
  return feedipediaIngredients.filter(ingredient => ingredient.category === categoryId);
};

// Funktion um alle Feedipedia-Ingredienzien zu bekommen
export const getAllFeedipediaIngredients = () => {
  return feedipediaIngredients;
};

// Funktion um Ingredienz nach wissenschaftlichem Namen zu finden
export const getFeedipediaByScientificName = (scientificName) => {
  return feedipediaIngredients.find(ingredient => 
    ingredient.scientificName.toLowerCase().includes(scientificName.toLowerCase())
  );
};

// Funktion um Ingredienzien nach Region zu filtern
export const getFeedipediaByRegion = (region) => {
  return feedipediaIngredients.filter(ingredient => 
    ingredient.regions.includes(region)
  );
};

// Funktion um Ingredienzien nach Tierart zu filtern
export const getFeedipediaByAnimalType = (animalType) => {
  return feedipediaIngredients.filter(ingredient => 
    ingredient.animalTypes.includes(animalType)
  );
};