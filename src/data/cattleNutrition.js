// Professional cattle nutrition data based on weight and growth phases
export const cattleNutritionData = [
  { 
    gewichtKg: 200, 
    tmKg: 5.0, 
    tdnKg: 2.8, 
    dcpKg: 0.24, 
    phase: "Kalb / Jungtier",
    description: "Wachstumsphase mit hohem Proteinbedarf",
    ageMonths: "6-10 Monate"
  },
  { 
    gewichtKg: 300, 
    tmKg: 7.5, 
    tdnKg: 4.2, 
    dcpKg: 0.36, 
    phase: "Jungrind / frühe Mast",
    description: "Intensive Wachstumsphase",
    ageMonths: "10-14 Monate"
  },
  { 
    gewichtKg: 400, 
    tmKg: 10.0, 
    tdnKg: 5.6, 
    dcpKg: 0.48, 
    phase: "Fortgeschrittene Mast",
    description: "Kontinuierliche Gewichtszunahme",
    ageMonths: "14-18 Monate"
  },
  { 
    gewichtKg: 500, 
    tmKg: 12.5, 
    tdnKg: 7.0, 
    dcpKg: 0.60, 
    phase: "Mastbulle mittlere Endphase",
    description: "Optimale Fleischqualität entwickeln",
    ageMonths: "18-22 Monate"
  },
  { 
    gewichtKg: 600, 
    tmKg: 15.0, 
    tdnKg: 8.4, 
    dcpKg: 0.72, 
    phase: "Hochleistungs-Mastbulle",
    description: "Maximale Gewichtszunahme",
    ageMonths: "22-26 Monate"
  },
  { 
    gewichtKg: 700, 
    tmKg: 17.5, 
    tdnKg: 9.8, 
    dcpKg: 0.84, 
    phase: "Schlachtreife Bullen / Charolais",
    description: "Endmast für optimale Schlachtqualität",
    ageMonths: "26+ Monate"
  }
];

// Function to get nutrition data for specific weight
export const getCattleNutritionForWeight = (weight) => {
  // Find the closest weight match
  let closest = cattleNutritionData[0];
  let minDiff = Math.abs(weight - closest.gewichtKg);
  
  for (const data of cattleNutritionData) {
    const diff = Math.abs(weight - data.gewichtKg);
    if (diff < minDiff) {
      minDiff = diff;
      closest = data;
    }
  }
  
  // If weight is between two values, interpolate
  if (weight !== closest.gewichtKg) {
    const sortedData = [...cattleNutritionData].sort((a, b) => a.gewichtKg - b.gewichtKg);
    
    for (let i = 0; i < sortedData.length - 1; i++) {
      const lower = sortedData[i];
      const upper = sortedData[i + 1];
      
      if (weight >= lower.gewichtKg && weight <= upper.gewichtKg) {
        const ratio = (weight - lower.gewichtKg) / (upper.gewichtKg - lower.gewichtKg);
        
        return {
          gewichtKg: weight,
          tmKg: Math.round((lower.tmKg + (upper.tmKg - lower.tmKg) * ratio) * 10) / 10,
          tdnKg: Math.round((lower.tdnKg + (upper.tdnKg - lower.tdnKg) * ratio) * 10) / 10,
          dcpKg: Math.round((lower.dcpKg + (upper.dcpKg - lower.dcpKg) * ratio) * 100) / 100,
          phase: weight <= 350 ? lower.phase : upper.phase,
          description: weight <= 350 ? lower.description : upper.description,
          ageMonths: weight <= 350 ? lower.ageMonths : upper.ageMonths,
          interpolated: true
        };
      }
    }
  }
  
  return closest;
};

// Function to calculate feed requirements
export const calculateCattleFeedRequirements = (weight, nutritionData) => {
  const { tmKg, tdnKg, dcpKg } = nutritionData;
  
  // Convert to different feed types
  const feedRequirements = {
    // Trockenmasse gesamt
    totalDryMatter: tmKg,
    
    // Heu (ca. 85% TM, 50% TDN, 8% Rohprotein)
    hayKg: Math.round((tmKg * 0.6) * 10) / 10,
    
    // Kraftfutter (ca. 88% TM, 75% TDN, 16% Rohprotein)
    concentrateKg: Math.round((tmKg * 0.4) * 10) / 10,
    
    // Silage (ca. 35% TM, 65% TDN, 12% Rohprotein)
    silageKg: Math.round((tmKg / 0.35) * 10) / 10,
    
    // Wasser (ca. 3-4 Liter pro kg TM)
    waterLiters: Math.round(tmKg * 3.5),
    
    // Energiebedarf in MJ ME (Metabolizable Energy)
    energyMJ: Math.round(tdnKg * 18.4), // 1 kg TDN ≈ 18.4 MJ ME
    
    // Proteinbedarf
    proteinKg: dcpKg,
    
    // Tägliche Kosten (grobe Schätzung)
    dailyCostEuro: Math.round((tmKg * 0.25 + dcpKg * 2.5) * 100) / 100
  };
  
  return feedRequirements;
};

// Nutrition explanations
export const nutritionExplanations = {
  tm: {
    name: "Trockenmasse (TM)",
    description: "Gesamtmenge an Futter ohne Wassergehalt",
    unit: "kg/Tag",
    importance: "Basis für alle Futterberechnungen"
  },
  tdn: {
    name: "Total Digestible Nutrients (TDN)",
    description: "Verdauliche Nährstoffe für Energieversorgung",
    unit: "kg/Tag",
    importance: "Energiequelle für Wachstum und Erhaltung"
  },
  dcp: {
    name: "Digestible Crude Protein (DCP)",
    description: "Verdauliches Rohprotein für Muskelaufbau",
    unit: "kg/Tag",
    importance: "Essentiell für Wachstum und Fleischqualität"
  }
};