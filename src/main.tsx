import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch is writable and has a setter to prevent "Cannot set property fetch of #<Window> which has only a getter"
try {
  let _fetchRef = window.fetch;
  let canSetFetch = true;
  try {
    window.fetch = _fetchRef;
  } catch (_) {
    canSetFetch = false;
  }

  if (!canSetFetch) {
    Object.defineProperty(window, 'fetch', {
      get: () => _fetchRef,
      set: (val) => {
        _fetchRef = val;
      },
      configurable: true,
      enumerable: true
    });
  }
} catch (_) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
