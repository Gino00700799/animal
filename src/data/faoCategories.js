// Categorías FAO para machos de ganado vacuno de carne
export const faoCategories = {
  becerro_destetado: {
    id: "becerro_destetado",
    name: {
      es: "Becerro Destetado",
      en: "Weaned Calf",
      de: "Abgesetztes Kalb"
    },
    description: {
      es: "Terneros machos recién destetados, alimentados con pastos y suplemento",
      en: "Recently weaned male calves, fed with pasture and supplement",
      de: "Kürzlich abgesetzte männliche Kälber, gefüttert mit Weide und Ergänzung"
    },
    emoji: "🐄",
    weightRange: { min: 150, max: 250 },
    ageRange: { min: 4, max: 8 }, // meses
    dailyGainRange: { min: 0.5, max: 0.7 }, // kg/día
    defaultValues: {
      weight: 200,
      age: 6,
      dailyGain: 0.6
    }
  },
  torete: {
    id: "torete",
    name: {
      es: "Torete",
      en: "Young Bull",
      de: "Jungbulle"
    },
    description: {
      es: "Machos jóvenes en crecimiento intermedio",
      en: "Young males in intermediate growth",
      de: "Junge Männchen im mittleren Wachstum"
    },
    emoji: "🐂",
    weightRange: { min: 250, max: 350 },
    ageRange: { min: 8, max: 14 },
    dailyGainRange: { min: 0.7, max: 0.9 },
    defaultValues: {
      weight: 300,
      age: 11,
      dailyGain: 0.8
    }
  },
  novillo: {
    id: "novillo",
    name: {
      es: "Novillo",
      en: "Steer",
      de: "Ochse"
    },
    description: {
      es: "Machos castrados en fase de recría",
      en: "Castrated males in rearing phase",
      de: "Kastrierte Männchen in der Aufzuchtphase"
    },
    emoji: "🐃",
    weightRange: { min: 350, max: 450 },
    ageRange: { min: 14, max: 20 },
    dailyGainRange: { min: 0.9, max: 1.0 },
    defaultValues: {
      weight: 400,
      age: 17,
      dailyGain: 0.95
    }
  },
  novillo_final: {
    id: "novillo_final",
    name: {
      es: "Novillo Final (Engorde)",
      en: "Finishing Steer",
      de: "Mastochse (Endmast)"
    },
    description: {
      es: "Machos destinados al sacrificio, ración con mayor energía",
      en: "Males destined for slaughter, higher energy ration",
      de: "Für die Schlachtung bestimmte Männchen, energiereichere Ration"
    },
    emoji: "🥩",
    weightRange: { min: 450, max: 650 },
    ageRange: { min: 20, max: 24 },
    dailyGainRange: { min: 1.0, max: 1.2 },
    defaultValues: {
      weight: 550,
      age: 22,
      dailyGain: 1.1
    }
  },
  toro_adulto: {
    id: "toro_adulto",
    name: {
      es: "Toro Adulto",
      en: "Adult Bull",
      de: "Erwachsener Bulle"
    },
    description: {
      es: "Machos enteros para reproducción o mantenimiento",
      en: "Intact males for breeding or maintenance",
      de: "Intakte Männchen für Zucht oder Erhaltung"
    },
    emoji: "🐂",
    weightRange: { min: 650, max: 1200 },
    ageRange: { min: 24, max: 120 },
    dailyGainRange: { min: 0, max: 0.3 }, // mantenimiento
    defaultValues: {
      weight: 800,
      age: 36,
      dailyGain: 0
    }
  }
};

export const getCategoryById = (categoryId) => {
  return faoCategories[categoryId] || null;
};

export const getAllCategories = () => {
  return Object.values(faoCategories);
};