/**
 * main.jsx - entry point React.
 *
 * `createRoot` (bukan ReactDOM.render) adalah cara baru sejak React 18.
 * StrictMode sengaja diaktifkan: di mode ini React akan memanggil efek dua
 * kali pada development untuk membantu menemukan bug (mis. efek samping yang
 * tidak dibersihkan). Efeknya diabaikan pada production build.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Elemen #root tidak ditemukan pada index.html');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);