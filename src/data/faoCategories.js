// Categorías generales intensivas: ternero, novillo y toro
export const faoCategories = {
  ternero: {
    id: 'ternero',
    system: 'intensivo',
    name: { es: 'Ternero (Feedlot)', en: 'Calf (Feedlot)', de: 'Kalb (Feedlot)' },
    description: {
      es: 'Fase inicial post-destete y recría temprana intensiva (adaptación y crecimiento estructural).',
      en: 'Early post-weaning/backgrounding intensive phase (adaptation and frame growth).',
      de: 'Frühe Phase nach dem Absetzen / intensive Aufzucht (Anpassung und Rahmenwachstum).'
    },
    emoji: '🐄',
    ageRange: { min: 5, max: 10 },      // meses
    weightRange: { min: 150, max: 300 },
    dailyGainRange: { min: 0.9, max: 1.4 },
    defaultValues: { weight: 225, age: 7, dailyGain: 1.15 }
  },
  novillo: {
    id: 'novillo',
    system: 'intensivo',
    name: { es: 'Novillo (Feedlot)', en: 'Steer (Feedlot)', de: 'Mastochse (Feedlot)' },
    description: {
      es: 'Fase de crecimiento y engorde intensivo (crecimiento muscular y deposición inicial de grasa).',
      en: 'Intensive growth and fattening phase (muscle growth and initial fat deposition).',
      de: 'Intensive Wachstums- und Mastphase (Muskelwachstum und erste Fettablagerung).'
    },
    emoji: '📈',
    ageRange: { min: 10, max: 18 },      // meses
    weightRange: { min: 300, max: 500 },
    dailyGainRange: { min: 1.2, max: 1.8 },
    defaultValues: { weight: 400, age: 14, dailyGain: 1.5 }
  },
  toro: {
    id: 'toro',
    system: 'intensivo',
    name: { es: 'Toro (Engorde Intensivo)', en: 'Bull (Intensive Fattening)', de: 'Bulle (Intensive Mast)' },
    description: {
      es: 'Machos enteros pesados en fase de terminación intensiva (alto potencial de crecimiento y eficiencia).',
      en: 'Heavy intact males in intensive finishing (high growth and efficiency potential).',
      de: 'Schwere intakte männliche Tiere in intensiver Endmast (hohes Wachstumspotential, Effizienz).'
    },
    emoji: '🐂',
    ageRange: { min: 12, max: 20 },
    weightRange: { min: 500, max: 750 },
    dailyGainRange: { min: 1.4, max: 2.0 },
    defaultValues: { weight: 625, age: 16, dailyGain: 1.7 }
  }
};

export const getCategoryById = (categoryId) => faoCategories[categoryId] || null;
export const getAllCategories = () => Object.values(faoCategories);