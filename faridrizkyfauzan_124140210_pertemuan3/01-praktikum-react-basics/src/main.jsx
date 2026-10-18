/**
 * main.jsx - entry point Praktikum React Basics.
 *
 * createRoot + StrictMode adalah cara sejak React 18. StrictMode aktif di
 * development untuk membantu menemukan efek samping yang tidak dibersihkan.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);