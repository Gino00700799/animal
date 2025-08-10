CSV format guide for FAO Diet Calculator

Place CSV files under public/csv. You can provide multiple files per type using a manifest JSON file (see below), or a single default file.

1) FAO Categories
- Default file: fao_categories.csv
- Optional manifest: fao_categories.manifest.json with structure: { "files": ["fao_categories_part1.csv", "more_categories.csv"] }
- Headers:
  id,name_de,name_en,name_es,desc_de,desc_en,desc_es,emoji,weight_min,weight_max,age_min,age_max,dg_min,dg_max,def_weight,def_age,def_dg

2) Ingredient Categories
- Default file: ingredient_categories.csv
- Optional manifest: ingredient_categories.manifest.json
- Headers:
  id,name_de,name_en,name_es,emoji

3) Ingredients
- Default file: ingredients.csv
- Optional manifest: ingredients.manifest.json
- Headers:
  id,category_id,name_de,name_en,name_es,dry_matter,me_mj_per_kg,cp_pct,fiber_pct,calcium_pct,phosphorus_pct,cost_per_kg,availability,max_usage_pct

Notes:
- Decimal separator must be dot (.)
- Strings may be quoted; quotes inside values must be doubled (CSV standard)
- availability is a free text field used for display; allowed max_usage_pct controls selection constraints
