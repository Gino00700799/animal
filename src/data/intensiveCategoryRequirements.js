// Perfiles de requerimientos nutricionales por categoría (sistema intensivo feedlot)
// Valores orientativos basados en FAO/NASEM adaptados a biotipos sudamericanos (machos)
// Rango expresado sobre base de materia seca de la ración total

export const intensiveCategoryProfiles = {
  ternero_destetado: {
    meDensity: { min: 10.5, max: 11.5 },      // MJ ME / kg MS
    crudeProteinPct: { min: 16, max: 18 },     // % MS
    ndfPct: { min: 30, max: 38 },              // % MS
    starchPct: { max: 30 },                    // % MS
    fatPct: { max: 5 },                        // % MS (opcional)
    notes: 'Fase de adaptación, limitar almidón para salud ruminal.'
  },
  ternero_recria: {
    meDensity: { min: 10.8, max: 11.8 },
    crudeProteinPct: { min: 15, max: 17 },
    ndfPct: { min: 30, max: 36 },
    starchPct: { max: 32 },
    fatPct: { max: 5 },
    notes: 'Objetivo: crecimiento de esqueleto y músculo con control de almidón.'
  },
  novillo_crecimiento: {
    meDensity: { min: 11.0, max: 12.0 },
    crudeProteinPct: { min: 14, max: 16 },
    ndfPct: { min: 28, max: 34 },
    starchPct: { max: 36 },
    fatPct: { max: 5.5 },
    notes: 'Incremento energía, mantener fibra efectiva.'
  },
  novillo_engorde: {
    meDensity: { min: 11.2, max: 12.2 },
    crudeProteinPct: { min: 13.5, max: 15 },
    ndfPct: { min: 26, max: 32 },
    starchPct: { max: 40 },
    fatPct: { max: 6 },
    notes: 'Transición a mayor inclusión de grano, cuidar NDF mínima.'
  },
  novillo_terminacion: {
    meDensity: { min: 11.4, max: 12.4 },
    crudeProteinPct: { min: 12.5, max: 14 },
    ndfPct: { min: 25, max: 30 },
    starchPct: { max: 42 },
    fatPct: { max: 6.5 },
    notes: 'Maximizar densidad energética manteniendo fibra mínima.'
  },
  toro_engorde: {
    meDensity: { min: 11.2, max: 12.2 },
    crudeProteinPct: { min: 13, max: 14.5 },
    ndfPct: { min: 26, max: 32 },
    starchPct: { max: 40 },
    fatPct: { max: 6 },
    notes: 'Bulls: mayor eficiencia proteica, limitar almidón extremo.'
  }
};

export const getIntensiveProfile = (category) => intensiveCategoryProfiles[category] || null;
