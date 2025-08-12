import { parseCsv, toNumber, toStringOr } from './csvParser';

// Helper to fetch CSV/JSON from public/csv with timeout
async function fetchText(relativePath, timeoutMs = 5000) {
  const url = `${process.env.PUBLIC_URL || ''}${relativePath.startsWith('/') ? relativePath : '/' + relativePath}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-cache', signal: controller.signal });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.text();
  } finally {
    clearTimeout(id);
  }
}

async function fetchCsv(relativePath) {
  const text = await fetchText(relativePath);
  return parseCsv(text);
}

async function fetchJson(relativePath) {
  const text = await fetchText(relativePath);
  return JSON.parse(text);
}

// Try to read a manifest file listing multiple CSVs; if not present, fall back to a default file
async function loadWithManifest(manifestPath, defaultCsvPath, mapCsvRows) {
  try {
    const manifest = await fetchJson(manifestPath);
    if (!Array.isArray(manifest?.files) || manifest.files.length === 0) {
      throw new Error('Empty manifest');
    }
    const arrays = await Promise.all(
      manifest.files.map((file) => fetchCsv(`/csv/${file}`))
    );
    const rows = arrays.flat();
    return mapCsvRows(rows);
  } catch (e) {
    // Fallback to single default CSV
    const rows = await fetchCsv(defaultCsvPath);
    return mapCsvRows(rows);
  }
}

export async function loadFaoCategoriesCsv() {
  const mapRows = (rows) => rows.map(r => ({
    id: toStringOr(r.id),
    name: {
      de: toStringOr(r.name_de),
      en: toStringOr(r.name_en),
      es: toStringOr(r.name_es)
    },
    description: {
      de: toStringOr(r.desc_de),
      en: toStringOr(r.desc_en),
      es: toStringOr(r.desc_es)
    },
    emoji: toStringOr(r.emoji, '🐂'),
    weightRange: { min: toNumber(r.weight_min, 0), max: toNumber(r.weight_max, 0) },
    ageRange: { min: toNumber(r.age_min, 0), max: toNumber(r.age_max, 0) },
    dailyGainRange: { min: toNumber(r.dg_min, 0), max: toNumber(r.dg_max, 0) },
    defaultValues: {
      weight: toNumber(r.def_weight, toNumber(r.weight_min, 0)),
      age: toNumber(r.def_age, toNumber(r.age_min, 0)),
      dailyGain: toNumber(r.def_dg, toNumber(r.dg_min, 0))
    }
  }));
  return loadWithManifest('/csv/fao_categories.manifest.json', '/csv/fao_categories.csv', mapRows);
}

export async function loadIngredientCategoriesCsv() {
  const mapRows = (rows) => {
    const map = {};
    rows.forEach(r => {
      const id = toStringOr(r.id);
      if (!id) return;
      map[id] = {
        id,
        name: {
          de: toStringOr(r.name_de || r.de || r.nombre_de),
          en: toStringOr(r.name_en || r.en || r.nombre_en),
          es: toStringOr(r.name_es || r.es || r.nombre_es)
        },
        emoji: toStringOr(r.emoji, '🌾')
      };
    });
    return map;
  };
  return loadWithManifest('/csv/ingredient_categories.manifest.json', '/csv/ingredient_categories.csv', mapRows);
}

export async function loadIngredientsCsv() {
  const mapRows = (rows) => rows.map(r => ({
    id: toStringOr(r.id),
    category: toStringOr(r.category_id),
    name: {
      de: toStringOr(r.name_de || r.de),
      en: toStringOr(r.name_en || r.en),
      es: toStringOr(r.name_es || r.es)
    },
    composition: {
      dryMatter: toNumber(r.dry_matter, 0),
      metabolizableEnergy: toNumber(r.me_mj_per_kg, 0),
      crudeProtein: toNumber(r.cp_pct, 0),
      fiber: toNumber(r.fiber_pct, 0),
      calcium: toNumber(r.calcium_pct, 0),
      phosphorus: toNumber(r.phosphorus_pct, 0)
    },
    costPerKg: toNumber(r.cost_per_kg, 0),
    availability: toStringOr(r.availability, 'year_round'),
    maxUsage: toNumber(r.max_usage_pct, undefined)
  }));
  return loadWithManifest('/csv/ingredients.manifest.json', '/csv/ingredients.csv', mapRows);
}

export async function loadDietData() {
  // Load categories and ingredients; any failure throws and should be handled by caller
  const [categories, ingredientCategories, ingredients] = await Promise.all([
    loadFaoCategoriesCsv(),
    loadIngredientCategoriesCsv(),
    loadIngredientsCsv()
  ]);
  return { categories, ingredientCategories, ingredients };
}
