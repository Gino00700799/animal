// Lightweight CSV parser that handles quoted fields and commas inside quotes
// Returns: Array of objects using the first row as header keys
export function parseCsv(text) {
  if (!text || typeof text !== 'string') return [];
  // Normalize line endings and trim BOM
  const content = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];

  const splitLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        // If next char is also a quote, it's an escaped quote
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip next
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result.map(v => v.trim());
  };

  const headers = splitLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitLine(lines[i]).map(v => v.replace(/^"|"$/g, ''));
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] !== undefined ? values[j] : '';
    }
    rows.push(row);
  }
  return rows;
}

export function toNumber(val, fallback = null) {
  if (val === undefined || val === null || val === '') return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export function toStringOr(val, fallback = '') {
  if (val === undefined || val === null) return fallback;
  return String(val);
}
