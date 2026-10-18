/**
 * Helper format tampilan.
 * Semua fungsi murni, aman dipanggil saat render.
 */

import { labelStatus } from './constants.js';

const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/** "2024-03-08T10:20:00.000Z" -> "8 Maret 2024" */
export const formatTanggal = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
};

/** Persentase aman dari pembagian dengan nol. */
export const persen = (bagian, total) =>
  total === 0 ? 0 : Math.round((bagian / total) * 100);

/** Inisial untuk avatar penulis, mis. "Robert C. Martin" -> "RM". */
export const inisial = (nama = '') => {
  const kata = nama.trim().split(/\s+/).filter(Boolean);
  if (kata.length === 0) return '?';
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
};

/**
 * Menentukan warna avatar dari nama penulis.
 * Hash string sederhana -> memilih satu dari palet yang sudah ditentukan,
 * sehingga warna stabil untuk penulis yang sama.
 */
const PALET = [
  { bg: 'var(--info-bg)', fg: 'var(--info-fg)' },
  { bg: 'var(--success-bg)', fg: 'var(--success-fg)' },
  { bg: 'var(--warning-bg)', fg: 'var(--warning-fg)' },
  { bg: 'var(--danger-bg)', fg: 'var(--danger-fg)' },
  { bg: 'var(--muted)', fg: 'var(--muted-fg)' },
];

export const warnaAvatar = (nama = '') => {
  let hash = 0;
  for (let i = 0; i < nama.length; i += 1) {
    hash = (hash * 31 + nama.charCodeAt(i)) % 100000;
  }
  return PALET[hash % PALET.length];
};

/** Mengubah "Ingin Beli" menjadi "Ingin Beli" yang siap ditampilkan. */
export const judulStatus = (value) => labelStatus(value);

/** Pluralisasi sederhana berbahasa Indonesia. */
export const plural = (n, kata) => `${n} ${kata}`;

/** Memotong teks panjang dengan elipsis. */
export const potong = (teks, panjang = 120) =>
  teks && teks.length > panjang ? `${teks.slice(0, panjang).trim()}...` : teks;