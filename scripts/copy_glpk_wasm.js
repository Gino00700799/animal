#!/usr/bin/env node
/*
 Copies glpk.wasm from node_modules to public/glpk/glpk.wasm (Option B)
 This runs on postinstall so the dev server and build can find the WASM.
*/
const fs = require('fs');
const path = require('path');

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

(function main() {
  try {
    const projectRoot = process.cwd();
    const src = path.join(projectRoot, 'node_modules', 'glpk.js', 'dist', 'glpk.wasm');
    const destDir = path.join(projectRoot, 'public', 'glpk');
    const dest = path.join(destDir, 'glpk.wasm');

    if (!fs.existsSync(src)) {
      console.warn('[copy_glpk_wasm] Source not found:', src);
      console.warn('[copy_glpk_wasm] If you are in a fresh repo without node_modules, install deps first (npm i).');
      console.warn('[copy_glpk_wasm] You can also place glpk.wasm manually at public/glpk/glpk.wasm');
      process.exit(0);
    }

    ensureDirSync(destDir);
    fs.copyFileSync(src, dest);
    console.log('[copy_glpk_wasm] Copied glpk.wasm to', dest);
  } catch (e) {
    console.warn('[copy_glpk_wasm] Copy failed:', e && e.message ? e.message : e);
    process.exit(0);
  }
})();
