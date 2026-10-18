/**
 * useBookFilter - custom hook untuk pencarian, filter, dan pengurutan daftar.
 *
 * Logika yang tadinya akan memblokir render `BookList` dipindah ke sini.
 * `useMemo` memastikan daftar hanya difilter ulang saat dependensinya berubah.
 */

import { useCallback, useMemo, useState } from 'react';
import { SEMUA_STATUS } from '../utils/constants.js';

/** Normalisasi teks agar pencocokan tidak terpengaruh spasi/kapital. */
const normalisasi = (teks = '') => teks.trim().toLowerCase();

/**
 * @param {Array} books - Daftar buku sumber.
 * @returns {object} State filter, hasil filter, dan aksi untuk mengubahnya.
 */
export const useBookFilter = (books) => {
  const [cari, setCari] = useState('');
  const [status, setStatus] = useState(SEMUA_STATUS);
  const [urut, setUrut] = useState('terbaru');

  /** Pencarian gabungan judul DAN penulis, tampil realtime saat mengetik. */
  const hasil = useMemo(() => {
    const daftar = Array.isArray(books) ? books : [];
    const q = normalisasi(cari);

    const tersaring = daftar.filter((b) => {
      // Filter status
      if (status !== SEMUA_STATUS && b.status !== status) return false;
      // Pencarian: judul atau penulis harus mengandung kata kunci
      if (!q) return true;
      return (
        normalisasi(b.judul).includes(q) ||
        normalisasi(b.penulis).includes(q)
      );
    });

    // Salin array sebelum sort agar array sumber tidak ikut termutasi.
    const hasilAkhir = [...tersaring];

    switch (urut) {
      case 'judul-asc':
        hasilAkhir.sort((a, b) => a.judul.localeCompare(b.judul, 'id'));
        break;
      case 'judul-desc':
        hasilAkhir.sort((a, b) => b.judul.localeCompare(a.judul, 'id'));
        break;
      case 'penulis-asc':
        hasilAkhir.sort((a, b) => a.penulis.localeCompare(b.penulis, 'id'));
        break;
      case 'tahun-desc':
        // Buku tanpa tahun selalu di urutan akhir.
        hasilAkhir.sort((a, b) => (b.tahun ?? -1) - (a.tahun ?? -1));
        break;
      case 'terbaru':
      default:
        hasilAkhir.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return hasilAkhir;
  }, [books, cari, status, urut]);

  /** Mengembalikan semua filter ke kondisi semula. */
  const reset = useCallback(() => {
    setCari('');
    setStatus(SEMUA_STATUS);
    setUrut('terbaru');
  }, []);

  /** True jika ada filter aktif - dipakai untuk menyembunyikan tombol Reset. */
  const adaFilter = cari !== '' || status !== SEMUA_STATUS || urut !== 'terbaru';

  return {
    // state
    cari,
    setCari,
    status,
    setStatus,
    urut,
    setUrut,
    // hasil & util
    hasil,
    reset,
    adaFilter,
    total: Array.isArray(books) ? books.length : 0,
    jumlahTersaring: hasil.length,
  };
};

export default useBookFilter;