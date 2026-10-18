/**
 * Setup test untuk project praktikum.
 *
 * Catatan: Node 22+ menyediakan global `localStorage` bawaan yang bisa
 * menggantikan implementasi jsdom saat test runner menyalin global.
 * Shim di bawah memastikan lingkungan test selalu punya Storage lengkap.
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

const pasangStorage = (target) => {
  if (!target) return;
  if (typeof target.localStorage?.clear === 'function') return;

  const map = new Map();
  Object.defineProperty(target, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      get length() {
        return map.size;
      },
      key: (i) => [...map.keys()][i] ?? null,
      getItem: (k) => (map.has(String(k)) ? map.get(String(k)) : null),
      setItem: (k, v) => map.set(String(k), String(v)),
      removeItem: (k) => map.delete(String(k)),
      clear: () => map.clear(),
    },
  });
};

pasangStorage(typeof window !== 'undefined' ? window : null);
pasangStorage(typeof globalThis !== 'undefined' ? globalThis : null);

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});