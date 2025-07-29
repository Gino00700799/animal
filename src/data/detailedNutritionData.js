// Detaillierte Nährstoffdaten basierend auf wissenschaftlichen Analysen
// Erweiterte Datenbank mit Aminosäuren, Mineralien und Verdaulichkeitswerten

export const detailedNutritionData = {
  // HENO DE ALFALFA - Erweiterte Daten
  heno_alfalfa: {
    mainAnalysis: {
      dryMatter: { avg: 89.4, sd: 2.9, min: 76.1, max: 94.8, unit: "% as fed" },
      crudeProtein: { avg: 18.2, sd: 2.6, min: 11.3, max: 25.3, unit: "% DM" },
      crudeFibre: { avg: 28.9, sd: 3.8, min: 19.4, max: 38.2, unit: "% DM" },
      ndf: { avg: 44.8, sd: 5.7, min: 31.3, max: 59.4, unit: "% DM" },
      adf: { avg: 33.4, sd: 4.3, min: 22.5, max: 44.5, unit: "% DM" },
      lignin: { avg: 7.6, sd: 1.3, min: 4.8, max: 11.1, unit: "% DM" },
      etherExtract: { avg: 2.1, sd: 0.4, min: 1.2, max: 3.2, unit: "% DM" },
      ash: { avg: 10.7, sd: 1.6, min: 7.2, max: 16.0, unit: "% DM" },
      grossEnergy: { avg: 18.2, sd: 0.4, min: 17.2, max: 18.8, unit: "MJ/kg DM" }
    },
    minerals: {
      calcium: { avg: 16.8, sd: 3.3, min: 8.4, max: 24.5, unit: "g/kg DM" },
      phosphorus: { avg: 2.6, sd: 0.5, min: 1.6, max: 4.0, unit: "g/kg DM" },
      potassium: { avg: 24.6, sd: 6.0, min: 13.2, max: 36.3, unit: "g/kg DM" },
      sodium: { avg: 0.3, sd: 0.3, min: 0.1, max: 0.7, unit: "g/kg DM" },
      magnesium: { avg: 2.3, sd: 0.5, min: 1.4, max: 3.6, unit: "g/kg DM" },
      manganese: { avg: 43, unit: "mg/kg DM" },
      zinc: { avg: 27, sd: 4, min: 20, max: 30, unit: "mg/kg DM" },
      copper: { avg: 9, sd: 2, min: 6, max: 12, unit: "mg/kg DM" },
      iron: { avg: 587, unit: "mg/kg DM" }
    },
    aminoAcids: {
      alanine: { avg: 4.6, sd: 0.9, min: 3.1, max: 5.2, unit: "% protein" },
      arginine: { avg: 4.5, sd: 0.8, min: 3.6, max: 5.8, unit: "% protein" },
      asparticAcid: { avg: 10.0, sd: 0.9, min: 8.4, max: 10.6, unit: "% protein" },
      cystine: { avg: 1.2, sd: 0.1, min: 1.1, max: 1.3, unit: "% protein" },
      glutamicAcid: { avg: 7.8, sd: 4.0, min: 0.6, max: 10.5, unit: "% protein" },
      glycine: { avg: 4.3, sd: 0.5, min: 3.4, max: 4.6, unit: "% protein" },
      histidine: { avg: 2.1, sd: 0.4, min: 1.7, max: 2.5, unit: "% protein" },
      isoleucine: { avg: 3.6, sd: 0.6, min: 2.3, max: 4.1, unit: "% protein" },
      leucine: { avg: 6.3, sd: 1.1, min: 4.0, max: 7.3, unit: "% protein" },
      lysine: { avg: 4.3, sd: 0.7, min: 3.1, max: 5.1, unit: "% protein" },
      methionine: { avg: 1.3, sd: 0.2, min: 0.9, max: 1.6, unit: "% protein" },
      phenylalanine: { avg: 4.2, sd: 0.5, min: 3.1, max: 4.7, unit: "% protein" },
      proline: { avg: 7.1, sd: 0.6, min: 6.5, max: 7.9, unit: "% protein" },
      serine: { avg: 4.3, sd: 0.5, min: 3.4, max: 4.7, unit: "% protein" },
      threonine: { avg: 3.8, sd: 0.5, min: 2.8, max: 4.3, unit: "% protein" },
      tryptophan: { avg: 1.4, min: 1.3, max: 1.4, unit: "% protein" },
      tyrosine: { avg: 2.6, sd: 0.6, min: 1.9, max: 3.5, unit: "% protein" },
      valine: { avg: 4.7, sd: 0.7, min: 3.3, max: 5.2, unit: "% protein" }
    },
    ruminantNutritiveValues: {
      omDigestibility: { avg: 61.8, sd: 3.3, min: 53.3, max: 66.4, unit: "%" },
      energyDigestibility: { avg: 58.4, sd: 1.8, min: 57.7, max: 62.3, unit: "%" },
      deRuminants: { avg: 10.6, unit: "MJ/kg DM" },
      meRuminants: { avg: 8.4, unit: "MJ/kg DM" },
      nitrogenDigestibility: { avg: 72.0, sd: 4.2, min: 58.2, max: 79.6, unit: "%" },
      nitrogenDegradabilityK4: { avg: 82, unit: "%" },
      nitrogenDegradabilityK6: { avg: 79, sd: 7, min: 53, max: 81, unit: "%" }
    }
  },

  // HARINA DE SOYA - Datos detallados
  harina_soya: {
    mainAnalysis: {
      dryMatter: { avg: 89.3, sd: 1.2, min: 87.5, max: 91.8, unit: "% as fed" },
      crudeProtein: { avg: 48.0, sd: 2.1, min: 44.5, max: 52.0, unit: "% DM" },
      crudeFibre: { avg: 3.0, sd: 0.8, min: 2.0, max: 4.5, unit: "% DM" },
      ndf: { avg: 9.2, sd: 1.5, min: 7.0, max: 12.0, unit: "% DM" },
      adf: { avg: 4.1, sd: 0.9, min: 2.8, max: 6.0, unit: "% DM" },
      lignin: { avg: 0.8, sd: 0.2, min: 0.5, max: 1.2, unit: "% DM" },
      etherExtract: { avg: 1.0, sd: 0.3, min: 0.5, max: 1.8, unit: "% DM" },
      ash: { avg: 6.0, sd: 0.5, min: 5.2, max: 7.1, unit: "% DM" },
      grossEnergy: { avg: 18.8, sd: 0.3, min: 18.2, max: 19.2, unit: "MJ/kg DM" }
    },
    minerals: {
      calcium: { avg: 2.5, sd: 0.3, min: 2.0, max: 3.2, unit: "g/kg DM" },
      phosphorus: { avg: 6.5, sd: 0.4, min: 5.8, max: 7.2, unit: "g/kg DM" },
      potassium: { avg: 20.1, sd: 1.8, min: 17.5, max: 23.0, unit: "g/kg DM" },
      sodium: { avg: 0.1, sd: 0.05, min: 0.05, max: 0.2, unit: "g/kg DM" },
      magnesium: { avg: 2.8, sd: 0.2, min: 2.4, max: 3.2, unit: "g/kg DM" },
      manganese: { avg: 28, sd: 5, min: 20, max: 38, unit: "mg/kg DM" },
      zinc: { avg: 45, sd: 8, min: 32, max: 58, unit: "mg/kg DM" },
      copper: { avg: 18, sd: 3, min: 12, max: 24, unit: "mg/kg DM" },
      iron: { avg: 120, sd: 25, min: 85, max: 165, unit: "mg/kg DM" }
    },
    aminoAcids: {
      alanine: { avg: 4.2, sd: 0.2, min: 3.8, max: 4.6, unit: "% protein" },
      arginine: { avg: 7.4, sd: 0.3, min: 6.9, max: 7.9, unit: "% protein" },
      asparticAcid: { avg: 11.5, sd: 0.4, min: 10.8, max: 12.2, unit: "% protein" },
      cystine: { avg: 1.4, sd: 0.1, min: 1.2, max: 1.6, unit: "% protein" },
      glutamicAcid: { avg: 18.8, sd: 0.8, min: 17.2, max: 20.1, unit: "% protein" },
      glycine: { avg: 4.1, sd: 0.2, min: 3.7, max: 4.5, unit: "% protein" },
      histidine: { avg: 2.6, sd: 0.1, min: 2.4, max: 2.8, unit: "% protein" },
      isoleucine: { avg: 4.5, sd: 0.2, min: 4.1, max: 4.9, unit: "% protein" },
      leucine: { avg: 7.8, sd: 0.3, min: 7.2, max: 8.4, unit: "% protein" },
      lysine: { avg: 6.4, sd: 0.3, min: 5.9, max: 6.9, unit: "% protein" },
      methionine: { avg: 1.3, sd: 0.1, min: 1.1, max: 1.5, unit: "% protein" },
      phenylalanine: { avg: 5.1, sd: 0.2, min: 4.7, max: 5.5, unit: "% protein" },
      proline: { avg: 5.2, sd: 0.3, min: 4.6, max: 5.8, unit: "% protein" },
      serine: { avg: 5.1, sd: 0.2, min: 4.7, max: 5.5, unit: "% protein" },
      threonine: { avg: 3.9, sd: 0.2, min: 3.5, max: 4.3, unit: "% protein" },
      tryptophan: { avg: 1.4, sd: 0.1, min: 1.2, max: 1.6, unit: "% protein" },
      tyrosine: { avg: 3.7, sd: 0.2, min: 3.3, max: 4.1, unit: "% protein" },
      valine: { avg: 4.8, sd: 0.2, min: 4.4, max: 5.2, unit: "% protein" }
    },
    ruminantNutritiveValues: {
      omDigestibility: { avg: 85.2, sd: 2.1, min: 81.5, max: 88.9, unit: "%" },
      energyDigestibility: { avg: 82.1, sd: 1.8, min: 78.9, max: 85.2, unit: "%" },
      deRuminants: { avg: 15.4, unit: "MJ/kg DM" },
      meRuminants: { avg: 12.6, unit: "MJ/kg DM" },
      nitrogenDigestibility: { avg: 91.5, sd: 1.2, min: 88.8, max: 94.1, unit: "%" },
      nitrogenDegradabilityK4: { avg: 68, unit: "%" },
      nitrogenDegradabilityK6: { avg: 62, sd: 4, min: 55, max: 69, unit: "%" }
    }
  },

  // MAÍZ EN GRANO - Datos detallados
  maiz_grano: {
    mainAnalysis: {
      dryMatter: { avg: 88.0, sd: 1.5, min: 85.2, max: 91.8, unit: "% as fed" },
      crudeProtein: { avg: 8.5, sd: 0.8, min: 7.2, max: 10.1, unit: "% DM" },
      crudeFibre: { avg: 2.5, sd: 0.4, min: 1.8, max: 3.5, unit: "% DM" },
      ndf: { avg: 9.8, sd: 1.2, min: 7.5, max: 12.8, unit: "% DM" },
      adf: { avg: 3.1, sd: 0.6, min: 2.2, max: 4.5, unit: "% DM" },
      lignin: { avg: 1.1, sd: 0.3, min: 0.6, max: 1.8, unit: "% DM" },
      etherExtract: { avg: 3.8, sd: 0.5, min: 2.9, max: 4.8, unit: "% DM" },
      ash: { avg: 1.3, sd: 0.2, min: 0.9, max: 1.8, unit: "% DM" },
      grossEnergy: { avg: 18.7, sd: 0.2, min: 18.3, max: 19.1, unit: "MJ/kg DM" }
    },
    minerals: {
      calcium: { avg: 0.3, sd: 0.1, min: 0.2, max: 0.5, unit: "g/kg DM" },
      phosphorus: { avg: 2.8, sd: 0.3, min: 2.2, max: 3.5, unit: "g/kg DM" },
      potassium: { avg: 3.6, sd: 0.4, min: 2.9, max: 4.5, unit: "g/kg DM" },
      sodium: { avg: 0.02, sd: 0.01, min: 0.01, max: 0.05, unit: "g/kg DM" },
      magnesium: { avg: 1.2, sd: 0.2, min: 0.9, max: 1.6, unit: "g/kg DM" },
      manganese: { avg: 5, sd: 1, min: 3, max: 8, unit: "mg/kg DM" },
      zinc: { avg: 22, sd: 4, min: 16, max: 30, unit: "mg/kg DM" },
      copper: { avg: 3, sd: 1, min: 2, max: 5, unit: "mg/kg DM" },
      iron: { avg: 25, sd: 8, min: 15, max: 42, unit: "mg/kg DM" }
    },
    ruminantNutritiveValues: {
      omDigestibility: { avg: 88.5, sd: 1.8, min: 85.2, max: 91.8, unit: "%" },
      energyDigestibility: { avg: 86.2, sd: 1.5, min: 83.1, max: 89.1, unit: "%" },
      deRuminants: { avg: 16.1, unit: "MJ/kg DM" },
      meRuminants: { avg: 13.2, unit: "MJ/kg DM" },
      nitrogenDigestibility: { avg: 78.5, sd: 3.2, min: 72.1, max: 84.8, unit: "%" },
      nitrogenDegradabilityK4: { avg: 72, unit: "%" },
      nitrogenDegradabilityK6: { avg: 68, sd: 5, min: 58, max: 76, unit: "%" }
    }
  }
};

// Proteinfuttermittel mit detaillierten Daten
export const proteinFeedstuffs = [
  {
    name: "Blood meal",
    dryMatter: 89.00,
    crudeProtein: 76.70,
    crudeFat: 1.10,
    crudeFiber: 1.20,
    ash: 4.00,
    nfe: 5.96,
    calcium: 0.28,
    phosphorus: 0.28
  },
  {
    name: "Bone meal",
    dryMatter: 91.63,
    crudeProtein: 26.03,
    crudeFat: 2.66,
    crudeFiber: 2.30,
    ash: 53.05,
    nfe: 9.33,
    calcium: 19.54,
    phosphorus: 8.32
  },
  {
    name: "Cassava leaf meal, soaked",
    dryMatter: 96.17,
    crudeProtein: 27.56,
    crudeFat: 7.66,
    crudeFiber: 11.73,
    ash: 7.40,
    nfe: 45.70
  },
  {
    name: "Copra meal, solvent process",
    dryMatter: 89.25,
    crudeProtein: 20.57,
    crudeFat: 3.95,
    crudeFiber: 12.46,
    ash: 7.14,
    nfe: 45.13,
    calcium: 0.20,
    phosphorus: 0.60
  },
  {
    name: "Corn gluten meal",
    dryMatter: 92.90,
    crudeProtein: 63.10,
    crudeFat: 7.90,
    crudeFiber: 1.90,
    ash: 1.70,
    nfe: 25.40
  },
  {
    name: "Feather meal, hydrolyzed",
    dryMatter: 89.80,
    crudeProtein: 67.48,
    crudeFat: 2.45,
    crudeFiber: 1.80,
    ash: 2.46,
    nfe: 15.61,
    calcium: 0.20,
    phosphorus: 0.75
  },
  {
    name: "Fish meal, Peruvian",
    dryMatter: 92.83,
    crudeProtein: 67.39,
    crudeFat: 6.97,
    crudeFiber: 0.89,
    ash: 18.84,
    nfe: 5.65
  },
  {
    name: "Fish meal, tuna",
    dryMatter: 93.24,
    crudeProtein: 52.04,
    crudeFat: 10.37,
    crudeFiber: 1.56,
    ash: 24.15,
    nfe: 7.81,
    calcium: 3.30,
    phosphorus: 2.44
  },
  {
    name: "Meat and bone meal",
    dryMatter: 94.64,
    crudeProtein: 48.40,
    crudeFat: 9.67,
    crudeFiber: 1.78,
    ash: 33.56,
    nfe: 7.36,
    calcium: 10.23,
    phosphorus: 3.39
  },
  {
    name: "Soybean meal, full fat",
    dryMatter: 93.69,
    crudeProtein: 37.51,
    crudeFat: 20.45,
    crudeFiber: 2.27,
    ash: 5.67,
    nfe: 31.33,
    calcium: 0.25,
    phosphorus: 0.59
  },
  {
    name: "Soybean meal, defatted, dehulled",
    dryMatter: 89.30,
    crudeProtein: 48.00,
    crudeFat: 1.00,
    crudeFiber: 3.00,
    ash: 6.00,
    nfe: 30.80,
    calcium: 0.25,
    phosphorus: 0.65
  },
  {
    name: "Wheat gluten",
    dryMatter: 97.73,
    crudeProtein: 79.52,
    crudeFat: 1.94,
    crudeFiber: 0.40,
    ash: 1.08,
    nfe: 16.93,
    calcium: 0.30,
    phosphorus: 0.14
  },
  {
    name: "Yeast, brewer's",
    dryMatter: 94.70,
    crudeProtein: 48.47,
    crudeFat: 1.25,
    crudeFiber: 1.94,
    ash: 9.15,
    nfe: 34.35,
    calcium: 0.80,
    phosphorus: 1.50
  }
];

// Funktion zur Berechnung der Energiewerte basierend auf Zusammensetzung
export const calculateEnergyFromComposition = (feedstuff) => {
  // Vereinfachte Berechnung der metabolisierbaren Energie
  // ME (MJ/kg DM) = 0.012 × CP + 0.031 × EE + 0.005 × CF + 0.014 × NFE
  const cp = feedstuff.crudeProtein || 0;
  const ee = feedstuff.crudeFat || 0;
  const cf = feedstuff.crudeFiber || 0;
  const nfe = feedstuff.nfe || 0;
  
  const me = (0.012 * cp) + (0.031 * ee) + (0.005 * cf) + (0.014 * nfe);
  return Math.round(me * 10) / 10;
};

// Funktion zur Bewertung der Proteinqualität basierend auf Aminosäureprofil
export const evaluateProteinQuality = (aminoAcids) => {
  if (!aminoAcids) return null;
  
  // Essenzielle Aminosäuren für Wiederkäuer
  const essential = ['lysine', 'methionine', 'threonine', 'tryptophan'];
  const scores = essential.map(aa => {
    const value = aminoAcids[aa]?.avg || 0;
    // Bewertung basierend auf idealen Werten für Wiederkäuer
    const ideal = { lysine: 5.5, methionine: 1.8, threonine: 4.0, tryptophan: 1.1 };
    return Math.min(100, (value / ideal[aa]) * 100);
  });
  
  return {
    overallScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    limitingAminoAcid: essential[scores.indexOf(Math.min(...scores))],
    scores: Object.fromEntries(essential.map((aa, i) => [aa, Math.round(scores[i])]))
  };
};

// Funktion zur Schätzung der Verdaulichkeit basierend auf Fasergehalt
export const estimateDigestibility = (feedstuff) => {
  const adf = feedstuff.adf || feedstuff.crudeFiber * 1.2; // Schätzung wenn ADF nicht verfügbar
  
  // Verdaulichkeit der organischen Substanz (%)
  const omDigestibility = Math.max(40, 88.9 - (0.779 * adf));
  
  // Energieverdaulichkeit (%)
  const energyDigestibility = Math.max(35, omDigestibility - 5);
  
  return {
    omDigestibility: Math.round(omDigestibility * 10) / 10,
    energyDigestibility: Math.round(energyDigestibility * 10) / 10,
    estimatedME: Math.round((18.4 * energyDigestibility / 100) * 10) / 10
  };
};