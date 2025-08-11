import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('error', (e) => {
    const info = {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      error: e.error
    };
    console.error('[GlobalError]', info);
    // Suppress GLPK wasm abort overlay in dev to keep app usable
    const msg = String(info.message || '');
    const file = String(info.filename || '');
    const isWasmAbort = (file.startsWith('blob:') && msg.includes('Aborted'));
    const isWalletInject = (
      msg.includes('ethereum') ||
      msg.includes('Cannot redefine property: ethereum') ||
      msg.includes('Cannot set property ethereum') ||
      file.startsWith('chrome-extension:') ||
      file.includes('inpage.js') ||
      file.includes('evmAsk.js')
    );
    if (isWasmAbort || isWalletInject) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.warn('[GlobalError] Suppressed known external error overlay', { isWasmAbort, isWalletInject, file, msg });
    }
  }, true);
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[UnhandledRejection]', e.reason);
    const r = e.reason;
    if (r && r instanceof ErrorEvent) {
      const msg = r.message || '';
      if (msg.includes('Aborted') || msg.includes('ASSERTIONS')) {
        e.preventDefault();
        console.warn('[UnhandledRejection] Suppressed GLPK WASM abort overlay');
      }
    }
  }, true);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);