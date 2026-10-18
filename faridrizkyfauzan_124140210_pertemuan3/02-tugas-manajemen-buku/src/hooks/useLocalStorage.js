/**
 * useLocalStorage - custom hook untuk state yang disinkronkan ke localStorage.
 *
 * Menggantikan tiga useState + useEffect manual yang biasanya ditulis ulang
 * di setiap proyek. Hook ini menangani:
 *   1. Pembacaan nilai awal secara lazy (hanya sekali saat mount).
 *   2. Serialisasi/deserialisasi JSON dengan error handling.
 *   3. Penulisan otomatis setiap nilai berubah.
 *   4. Fallback ke memory ketika localStorage tidak tersedia (mode privat,
 *      kuota penuh, atau lingkungan test/SSR).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** Cek apakah localStorage benar-benar bisa dipakai. */
const storageTersedia = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const uji = '__paw3_uji__';
    window.localStorage.setItem(uji, '1');
    window.localStorage.removeItem(uji);
    return true;
  } catch {
    // Kuota penuh atau browser memblokir penyimpanan.
    return false;
  }
};

/**
 * Membaca nilai dari localStorage.
 *
 * Sengaja tidak memakai `|| nilaiAwal` karena itu akan menimpa nilai falsy
 * yang valid (0, false, "", null). Perbandingan dilakukan eksplisit.
 */
const baca = (key, nilaiAwal) => {
  if (!storageTersedia()) return nilaiAwal;

  try {
    const mentah = window.localStorage.getItem(key);
    if (mentah === null) return nilaiAwal;

    const hasil = JSON.parse(mentah);

    // Hanya tolak nilai yang jelas tidak bisa dipakai. Nilai primitif
    // seperti 0 / false / "" tetap dihormati karena bisa jadi data yang sah.
    if (hasil === undefined) return nilaiAwal;
    if (hasil === null && nilaiAwal !== null) return nilaiAwal;

    return hasil;
  } catch {
    // JSON rusak -> mulai dari nilai awal, jangan matikan aplikasi.
    return nilaiAwal;
  }
};

/**
 * @param {string} key - Kunci localStorage.
 * @param {*} nilaiAwal - Nilai fallback saat key belum ada / JSON rusak.
 * @returns {[*, Function, Function, boolean]} tuple berisi:
 *   - nilai saat ini
 *   - setter (mendukung fungsi updater seperti useState)
 *   - hapus() untuk menghapus key dan mengembalikan ke nilai awal
 *   - apakah penyimpanan persisten aktif (false = mode fallback memory)
 */
export const useLocalStorage = (key, nilaiAwal) => {
  const [nilai, setNilai] = useState(() => baca(key, nilaiAwal));

  // Nilai awal disimpan di ref agar `hapus` tetap stabil tanpa re-render.
  const nilaiAwalRef = useRef(nilaiAwal);

  // Persisten status dipertahankan di ref: menilai ulang localStorage pada
  // setiap render itu mahal dan nilainya praktis tidak pernah berubah.
  const persistenRef = useRef(storageTersedia());

  // Cermin nilai saat ini, dipakai `hapus` untuk menentukan apakah state akan
  // benar-benar berubah (React melewati render kalau nilainya identik).
  const nilaiSekarangRef = useRef(nilai);
  nilaiSekarangRef.current = nilai;

  // Bendera: efek penyimpanan berikutnya harus dilewati sekali saja.
  const lewatiTulisRef = useRef(false);

  // Otomatis menulis setiap perubahan nilai ke storage.
  useEffect(() => {
    if (lewatiTulisRef.current) {
      lewatiTulisRef.current = false;
      return;
    }
    if (!persistenRef.current) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(nilai));
    } catch {
      // Kuota penuh: aplikasi tetap jalan dengan state di memory.
    }
  }, [key, nilai]);

  /**
   * Menghapus key dari storage dan mengembalikan state ke nilai awal.
   *
   * Perhatikan `lewatiTulisRef`: setelah key dihapus, efek di atas akan tetap
   * berjalan karena state berubah, dan tanpa bendera ini nilai awal akan
   * segera ditulis ulang sehingga key "berhidup" lagi.
   */
  const hapus = useCallback(() => {
    if (persistenRef.current) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // diabaikan - tidak ada yang bisa dilakukan
      }
    }

    // Hanya tandai lewati bila state benar-benar akan berubah. Kalau tidak,
    // React tidak menjalankan efek dan benderanya akan menggantung serta
    // membuat penulisan yang sah berikutnya ikut terlewat.
    const akanBerubah =
      JSON.stringify(nilaiAwalRef.current) !== JSON.stringify(nilaiSekarangRef.current);

    lewatiTulisRef.current = akanBerubah;
    setNilai(nilaiAwalRef.current);
  }, [key]);

  return [nilai, setNilai, hapus, persistenRef.current];
};

export default useLocalStorage;