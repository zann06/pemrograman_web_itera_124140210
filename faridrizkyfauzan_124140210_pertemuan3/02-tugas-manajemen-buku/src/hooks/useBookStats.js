/**
 * useBookStats - custom hook untuk menghitung statistik koleksi buku.
 *
 * Seluruh perhitungan berat (reduce, filter, sort) dibungkus `useMemo` agar
 * tidak dihitung ulang pada setiap render. Hook ini murni terhadap `books`,
 * sehingga mudah diuji tanpa merender halaman apa pun.
 */

import { useMemo } from 'react';
import { OPSI_STATUS, STATUS } from '../utils/constants.js';
import { persen } from '../utils/format.js';

/**
 * @param {Array} books - Daftar buku lengkap.
 * @returns {object} Ringkasan statistik.
 */
export const useBookStats = (books) => useMemo(() => {
  const daftar = Array.isArray(books) ? books : [];

  // --- Jumlah per status -------------------------------------------------
  // Menghitung ketiganya sekaligus agar hanya satu kali iterasi.
  const jumlahPerStatus = daftar.reduce(
    (acc, b) => {
      if (b.status === STATUS.MILIK) acc.milik += 1;
      else if (b.status === STATUS.BACA) acc.baca += 1;
      else if (b.status === STATUS.BELI) acc.beli += 1;
      return acc;
    },
    { milik: 0, baca: 0, beli: 0 },
  );

  const total = daftar.length;

  // --- Penulis unik & penulis paling banyak ------------------------------
  // Map dipakai agar O(n), bukan O(n^2) dengan filter di dalam filter.
  const perPenulis = new Map();
  for (const b of daftar) {
    const nama = (b.penulis || '').trim();
    if (!nama) continue;
    perPenulis.set(nama, (perPenulis.get(nama) ?? 0) + 1);
  }

  // Pair [nama, jumlah] dengan jumlah terbesar; null jika belum ada data.
  const penulisTerbanyak =
    [...perPenulis.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;

  // --- Rata-rata tahun terbit --------------------------------------------
  const tahunValid = daftar
    .map((b) => b.tahun)
    .filter((t) => Number.isInteger(t) && t > 0);

  const tahunRataRata = tahunValid.length
    ? Math.round(tahunValid.reduce((a, t) => a + t, 0) / tahunValid.length)
    : null;

  // --- Buku terlama -------------------------------------------------------
  const terlama = [...daftar]
    .filter((b) => b.status === STATUS.BACA)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0] ?? null;

  return {
    total,
    jumlahPerStatus,
    // Persentase siap pakai untuk progress bar (0 ketika belum ada data).
    persenPerStatus: {
      milik: persen(jumlahPerStatus.milik, total),
      baca: persen(jumlahPerStatus.baca, total),
      beli: persen(jumlahPerStatus.beli, total),
    },
    jumlahPenulis: perPenulis.size,
    penulisTerbanyak,
    jumlahFavorit: daftar.filter((b) => b.favorit).length,
    jumlahBertahun: tahunValid.length,
    tahunRataRata,
    terlama,
    // Rasio buku yang sudah dimiliki dibanding total - metrik "collection health".
    rasioDimiliki: persen(jumlahPerStatus.milik, total),
    // Daftar status siap render, digabung dengan jumlahnya.
    ringkasanStatus: OPSI_STATUS.map((s) => ({
      ...s,
      jumlah: jumlahPerStatus[s.value],
      persen: persen(jumlahPerStatus[s.value], total),
    })),
  };
}, [books]);

export default useBookStats;