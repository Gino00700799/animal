import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

function isResourceErrorEvent(e) {
  if (!e) return false;
  const t = e.target;
  if (!t) return false;
  return (
    t instanceof HTMLScriptElement ||
    t instanceof HTMLLinkElement ||
    t instanceof HTMLImageElement ||
    t instanceof HTMLSourceElement
  );
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('error', (e) => {
    const info = {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      error: e.error,
      targetTag: e.target?.tagName,
      targetSrc: e.target?.src || e.target?.href || null
    };
    console.error('[GlobalError]', info);
    // Suppress GLPK wasm abort and resource load errors to keep app usable
    const msg = String(info.message || '');
    const file = String(info.filename || '');
    const src = String(info.targetSrc || '');
    const isWasmFile = src.endsWith('.wasm') || src.includes('glpk');
    const isWasmAbort = ((file.startsWith('blob:') || isWasmFile) && (msg.includes('Aborted') || msg.includes('abort') || msg.includes('wasm')));
    const isWalletInject = (
      msg.includes('ethereum') ||
      msg.includes('Cannot redefine property: ethereum') ||
      msg.includes('Cannot set property ethereum') ||
      file.startsWith('chrome-extension:') ||
      file.includes('inpage.js') ||
      file.includes('evmAsk.js')
    );
    const isResource = isResourceErrorEvent(e);
    const looksLikeAnonymousErrorEvent = (!info.message && !info.error && e instanceof ErrorEvent);
    if (isWasmAbort || isWalletInject || isResource || isWasmFile || looksLikeAnonymousErrorEvent) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.warn('[GlobalError] Suppressed dev overlay', { isWasmAbort, isWalletInject, isResource, isWasmFile, looksLikeAnonymousErrorEvent });
    }
  }, true);
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[UnhandledRejection]', e.reason);
    const r = e.reason;
    if (r && (r instanceof ErrorEvent || r instanceof Event)) {
      e.preventDefault();
      console.warn('[UnhandledRejection] Suppressed overlay for Event-like rejection');
      return;
    }
    if (r && r.message && (r.message.includes('Aborted') || r.message.includes('ASSERTIONS') || r.message.includes('wasm'))) {
      e.preventDefault();
      console.warn('[UnhandledRejection] Suppressed GLPK WASM abort overlay');
    }
  }, true);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);