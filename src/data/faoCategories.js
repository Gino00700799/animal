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
      es: "Terneros machos recién destetados en sistema intensivo de engorde",
      en: "Recently weaned male calves in intensive feedlot system",
      de: "Kürzlich abgesetzte männliche Kälber im intensiven Mastsystem"
    },
    emoji: "🐄",
    weightRange: { min: 150, max: 250 },
    ageRange: { min: 4, max: 8 }, // meses
    dailyGainRange: { min: 0.8, max: 1.2 }, // kg/día - sistema intensivo
    defaultValues: {
      weight: 200,
      age: 6,
      dailyGain: 1.0
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
      es: "Machos jóvenes en engorde intensivo intermedio",
      en: "Young males in intermediate intensive fattening",
      de: "Junge Männchen in mittlerer intensiver Mast"
    },
    emoji: "🐂",
    weightRange: { min: 250, max: 350 },
    ageRange: { min: 8, max: 14 },
    dailyGainRange: { min: 1.0, max: 1.4 }, // sistema intensivo
    defaultValues: {
      weight: 300,
      age: 11,
      dailyGain: 1.2
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
      es: "Machos castrados en engorde intensivo avanzado",
      en: "Castrated males in advanced intensive fattening",
      de: "Kastrierte Männchen in fortgeschrittener intensiver Mast"
    },
    emoji: "🐃",
    weightRange: { min: 350, max: 450 },
    ageRange: { min: 14, max: 20 },
    dailyGainRange: { min: 1.2, max: 1.6 }, // sistema intensivo
    defaultValues: {
      weight: 400,
      age: 17,
      dailyGain: 1.4
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
      es: "Machos en engorde intensivo final, máxima ganancia de peso",
      en: "Males in final intensive fattening, maximum weight gain",
      de: "Männchen in der finalen intensiven Mast, maximale Gewichtszunahme"
    },
    emoji: "🥩",
    weightRange: { min: 450, max: 650 },
    ageRange: { min: 20, max: 24 },
    dailyGainRange: { min: 1.4, max: 1.8 }, // sistema intensivo final
    defaultValues: {
      weight: 550,
      age: 22,
      dailyGain: 1.6
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