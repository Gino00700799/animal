// Categorías orientadas a formulación de dietas INTENSIVAS (feedlot) para terneros, novillos y toros de carne
export const faoCategories = {
  ternero_destetado: {
    id: "ternero_destetado",
    system: 'intensivo',
    name: { es: "Ternero Destetado (Feedlot)", en: "Weaned Calf (Feedlot)", de: "Abgesetztes Kalb (Feedlot)" },
    description: {
      es: "Ingreso a corral tras destete / fase de adaptación y arranque energético-proteico",
      en: "Feedlot receiving phase post-weaning; adaptation to high-energy starter",
      de: "Einstiegs-/Anpassungsphase nach dem Absetzen im Feedlot"
    },
    emoji: "🐄",
    // Feedlot intensivo: recepción 4-7 meses
    ageRange: { min: 4, max: 7 },
    weightRange: { min: 140, max: 200 },
    dailyGainRange: { min: 0.8, max: 1.2 }, // adaptación + arranque
    defaultValues: { weight: 170, age: 6, dailyGain: 1.0 }
  },
  ternero_recria: {
    id: "ternero_recria",
    system: 'intensivo',
    name: { es: "Recría Temprana (Feedlot)", en: "Early Backgrounding", de: "Frühe Aufzucht" },
    description: {
      es: "Fase de recría acelerada enfocada en crecimiento óseo-muscular con dieta balanceada",
      en: "Accelerated backgrounding focusing on frame and muscle growth",
      de: "Beschleunigte Aufzucht mit Fokus auf Rahmen- und Muskelwachstum"
    },
    emoji: "🧬",
    ageRange: { min: 7, max: 10 },
    weightRange: { min: 200, max: 280 },
    dailyGainRange: { min: 1.1, max: 1.5 },
    defaultValues: { weight: 240, age: 9, dailyGain: 1.3 }
  },
  novillo_crecimiento: {
    id: "novillo_crecimiento",
    system: 'intensivo',
    name: { es: "Crecimiento Intensivo", en: "Intensive Growing", de: "Intensives Wachstum" },
    description: {
      es: "Fase de crecimiento medio; incremento de energía manteniendo proteína adecuada",
      en: "Mid growing phase; higher energy with adequate protein",
      de: "Mittlere Wachstumsphase; höhere Energie bei ausreichendem Protein"
    },
    emoji: "📈",
    ageRange: { min: 10, max: 14 },
    weightRange: { min: 280, max: 380 },
    dailyGainRange: { min: 1.2, max: 1.6 },
    defaultValues: { weight: 330, age: 12, dailyGain: 1.4 }
  },
  novillo_engorde: {
    id: "novillo_engorde",
    system: 'intensivo',
    name: { es: "Engorde Intermedio", en: "Intermediate Fattening", de: "Zwischenmast" },
    description: {
      es: "Transición a dietas de mayor concentración energética (grano + subproductos)",
      en: "Transition to higher energy (grain/subproduct) diets",
      de: "Übergang zu energiereicheren (Getreide/Subprodukt) Rationen"
    },
    emoji: "🥩",
    ageRange: { min: 14, max: 18 },
    weightRange: { min: 380, max: 470 },
    dailyGainRange: { min: 1.3, max: 1.8 },
    defaultValues: { weight: 420, age: 16, dailyGain: 1.5 }
  },
  novillo_terminacion: {
    id: "novillo_terminacion",
    system: 'intensivo',
    name: { es: "Terminación", en: "Finishing", de: "Endmast" },
    description: {
      es: "Fase final para maximizar acabado y peso canal con alta densidad energética",
      en: "Final phase to maximize finish and carcass weight with high energy density",
      de: "Letzte Phase zur Maximierung von Fettabdeckung und Schlachtgewicht"
    },
    emoji: "✅",
    ageRange: { min: 16, max: 20 },
    weightRange: { min: 420, max: 520 },
    dailyGainRange: { min: 1.4, max: 1.9 },
    defaultValues: { weight: 470, age: 18, dailyGain: 1.6 }
  },
  toro_engorde: {
    id: "toro_engorde",
    system: 'intensivo',
    name: { es: "Toro Engorde Intensivo", en: "Intensive Bull Fattening", de: "Intensive Bullenmast" },
    description: {
      es: "Toros enteros en feedlot (mayor potencial de crecimiento y eficiencia proteica)",
      en: "Intact bulls in feedlot (higher growth potential and protein efficiency)",
      de: "Intakte Bullen im Feedlot (höheres Wachstumspotential)"
    },
    emoji: "🐂",
    ageRange: { min: 12, max: 18 },
    weightRange: { min: 350, max: 520 },
    dailyGainRange: { min: 1.5, max: 2.0 },
    defaultValues: { weight: 450, age: 15, dailyGain: 1.7 }
  }
};

export const getCategoryById = (categoryId) => faoCategories[categoryId] || null;
export const getAllCategories = () => Object.values(faoCategories);