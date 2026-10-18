/**
 * File setup global untuk seluruh test.
 *
 * 1. Shim localStorage.
 *    Node 22+ menyediakan global `localStorage` bawaan (Web Storage native).
 *    Saat Vitest menyalin global Node ke `window` jsdom, versi Node inilah
 *    yang menang - dan tanpa `--localstorage-file` objek itu tidak memiliki
 *    metode `clear()`, sehingga setiap test gagal dengan
 *    "window.localStorage.clear is not a function".
 *    Di bawah ini kita pasang implementasi Storage in-memory yang memenuhi
 *    spesifikasi WHATWG, sehingga test berjalan sama di semua versi Node.
 *
 * 2. Matcher DOM dari @testing-library/jest-dom. Versi modern (v6+) tidak
 *    perlu `extend()` lagi - cukup diimpor.
 *
 * 3. Pembersihan antar test supaya state satu test tidak bocor ke test lain.
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

/** Storage in-memory yang mengikuti spesifikasi Web Storage API. */
const buatStorage = () => {
  const map = new Map();

  return {
    get length() {
      return map.size;
    },
    key: (indeks) => [...map.keys()][indeks] ?? null,
    getItem: (kunci) => (map.has(String(kunci)) ? map.get(String(kunci)) : null),
    setItem: (kunci, nilai) => {
      map.set(String(kunci), String(nilai));
    },
    removeItem: (kunci) => {
      map.delete(String(kunci));
    },
    clear: () => map.clear(),
  };
};

/** Hanya ganti bila implementasi bawaan memang tidak lengkap. */
const pasangStorage = (target) => {
  if (!target) return;
  if (typeof target.localStorage?.clear === 'function') return;

  Object.defineProperty(target, 'localStorage', {
    value: buatStorage(),
    configurable: true,
    writable: true,
  });
};

pasangStorage(typeof window !== 'undefined' ? window : null);
pasangStorage(typeof globalThis !== 'undefined' ? globalThis : null);

beforeEach(() => {
  window.localStorage.clear();
  document.title = '';
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});