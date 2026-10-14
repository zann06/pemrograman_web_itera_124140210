/* =========================================================
   MODUL: storage.js
   Wrapper (encapsulation) di atas localStorage.

   Kenapa tidak langsung pakai localStorage di mana-mana?
   1.localStorage bisa penuh (QuotaExceededError).
   2. Data bisa rusak / bukan JSON valid.
   3. console spam "Uncaught SyntaxError" kalau JSON.parse gagal.
   4. Mode private browsing sebagian browser memblokir localStorage.

   Dengan wrapper ini, semua masalah di atas ditangani di SATU tempat.

   DEMONSTRASI: class (OOP) untuk mengenkapsulasi &
                 arrow function sebagai method.
   ========================================================= */

/** Prefix untuk semua key — mencegah bentrok dengan app lain di origin yg sama */
const NAMESPACE = "paw2.dashboard";

/**
 * Menentukan apakah localStorage bisa diakses.
 * @returns {boolean}
 */
const isAvailable = () => {
  try {
    const probe = `${NAMESPACE}.__probe__`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};

/* Fallback in-memory: aplikasi tetap berjalan walau localStorage diblokir */
const memoryStore = new Map();

/**
 * Class Storage — manage persistence dengan aman.
 */
export class Storage {
  /**localStorage bisa diakses di environment ini? */
  static available = isAvailable();

  /** Cache status cuota terakhir (untuk ditampilkan di UI) */
  static lastError = null;

  /**
   * Baca data dari storage.
   * @param {string} key
   * @param {*} defaultValue nilai bila belum ada / rusak
   * @returns {*}
   */
  static get(key, defaultValue = null) {
    try {
      const fullKey = `${NAMESPACE}.${key}`;
      const raw = Storage.available ? window.localStorage.getItem(fullKey) : memoryStore.get(fullKey);

      if (raw === null || raw === undefined) return defaultValue;

      // JSON.parse bisa melempar error bila data rusak -> tangkannya
      const parsed = JSON.parse(raw);
      return parsed ?? defaultValue;
    } catch (error) {
      Storage.lastError = error.message;
      console.warn(`[Storage] Gagal membaca "${key}":`, error.message);
      return defaultValue;
    }
  }

  /**
   * Simpan data ke storage.
   * @param {string} key
   * @param {*} value
   * @returns {boolean} true bila berhasil
   */
  static set(key, value) {
    try {
      const fullKey = `${NAMESPACE}.${key}`;
      const serialized = JSON.stringify(value);

      if (Storage.available) {
        window.localStorage.setItem(fullKey, serialized);
      } else {
        memoryStore.set(fullKey, serialized);
      }

      Storage.lastError = null;
      return true;
    } catch (error) {
      // QuotaExceededError paling sering terjadi
      Storage.lastError = error.message;
      console.error(`[Storage] Gagal menyimpan "${key}":`, error.message);
      return false;
    }
  }

  /**
   * Hapus satu key.
   * @param {string} key
   * @returns {boolean}
   */
  static remove(key) {
    try {
      const fullKey = `${NAMESPACE}.${key}`;
      if (Storage.available) {
        window.localStorage.removeItem(fullKey);
      } else {
        memoryStore.delete(fullKey);
      }
      return true;
    } catch (error) {
      Storage.lastError = error.message;
      return false;
    }
  }

  /**
   * Kosongkan seluruh data milik namespace aplikasi ini saja.
   * @returns {number} jumlah key yang dihapus
   */
  static clearAll() {
    let removed = 0;

    try {
      if (Storage.available) {
        // Kumpulkan key milik kita (prefix cocok) agar data app lain tidak ikut terhapus
        const keysToRemove = Object.keys(window.localStorage).filter((key) =>
          key.startsWith(`${NAMESPACE}.`)
        );

        keysToRemove.forEach((key) => {
          window.localStorage.removeItem(key);
          removed += 1;
        });
      } else {
        removed = memoryStore.size;
        memoryStore.clear();
      }
    } catch (error) {
      Storage.lastError = error.message;
    }

    return removed;
  }

  /**
   * Hitung jumlah item di dalam array yang tersimpan.
   * @param {string} key
   * @returns {number}
   */
  static count(key) {
    const value = Storage.get(key, []);
    return Array.isArray(value) ? value.length : 0;
  }

  /**
   * Ringkasan pemakaian storage untuk ditampilkan di UI.
   * @returns {{keys:number, items:number, available:boolean, bytes:number, error:string|null}}
   */
  static getStats() {
    let keys = 0;
    let bytes = 0;

    try {
      if (Storage.available) {
        const ourKeys = Object.keys(window.localStorage).filter((k) => k.startsWith(`${NAMESPACE}.`));
        keys = ourKeys.length;
        bytes = ourKeys.reduce((total, key) => total + (window.localStorage.getItem(key)?.length ?? 0), 0);
      } else {
        keys = memoryStore.size;
        bytes = Array.from(memoryStore.values()).reduce((total, v) => total + v.length, 0);
      }
    } catch {
      /* abaikan — stats bersifat non-kritis */
    }

    return {
      keys,
      bytes,
      items: ["tasks", "notes", "schedule"].reduce((total, key) => total + Storage.count(key), 0),
      available: Storage.available,
      error: Storage.lastError
    };
  }

  /**
   * Ekspor seluruh data sebagai string JSON (untuk fitur backup).
   * @returns {string}
   */
  static exportAll() {
    const dump = {};

    try {
      if (Storage.available) {
        Object.keys(window.localStorage)
          .filter((key) => key.startsWith(`${NAMESPACE}.`))
          .forEach((key) => {
            dump[key.replace(`${NAMESPACE}.`, "")] = JSON.parse(window.localStorage.getItem(key));
          });
      } else {
        memoryStore.forEach((value, key) => {
          dump[key.replace(`${NAMESPACE}.`, "")] = JSON.parse(value);
        });
      }
    } catch (error) {
      console.error("[Storage] Gagal export:", error.message);
    }

    return JSON.stringify(dump, null, 2);
  }
}

/* =========================================================
   Shortcut arrow function agar call-site lebih ringkas
   ========================================================= */

/** Baca data */
export const readData = (key, fallback) => Storage.get(key, fallback);

/** Tulis data */
export const writeData = (key, value) => Storage.set(key, value);

/** Hapus data */
export const deleteData = (key) => Storage.remove(key);