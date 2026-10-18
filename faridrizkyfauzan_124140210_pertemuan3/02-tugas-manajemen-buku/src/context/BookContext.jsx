/**
 * BookContext - global state management memakai Context API.
 *
 * Menggantikan pola "props drilling" (mengoper books & handler turun ke setiap
 * anak komponen). Dengan satu provider, komponen mana pun yang berada di
 * dalam <BookProvider> bisa memakai `useBooks()` tanpa menerima props.
 *
 * Optimasi yang dipakai:
 *   - Semua action dibungkus useCallback -> referensinya stabil.
 *   - Objek `value` dibungkus useMemo -> provider tidak memicu render ulang
 *     semua consumer kecuali saat data benar-benar berubah.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { BUKU_CONTOH, STORAGE_KEY, STATUS } from '../utils/constants.js';
import { FORM_KOSONG } from '../utils/validasi.js';

const BookContext = createContext(null);

/** Membuat id unik tanpa bergantung pada package tambahan. */
const buatId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `buku-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Menjamin bentuk data konsisten.
 * Data lama dari localStorage bisa jadi tidak punya field baru, jadi setiap
 * buku dinormalisasi saat dibaca.
 */
const normalisasiBuku = (buku) => ({
  id: buku.id ?? buatId(),
  judul: String(buku.judul ?? '').trim(),
  penulis: String(buku.penulis ?? '').trim(),
  status: Object.values(STATUS).includes(buku.status) ? buku.status : STATUS.MILIK,
  tahun: Number.isInteger(buku.tahun) ? buku.tahun : null,
  favorit: Boolean(buku.favorit),
  catatan: String(buku.catatan ?? ''),
  createdAt: buku.createdAt ?? new Date().toISOString(),
  updatedAt: buku.updatedAt ?? buku.createdAt ?? new Date().toISOString(),
});

export function BookProvider({ children }) {
  // Sumber kebenaran mentah, otomatis persist ke localStorage lewat hook.
  const [booksmentah, setBooks, hapusStorage, persisten] = useLocalStorage(
    STORAGE_KEY,
    [],
  );

  /**
   * Data dari localStorage tidak selalu dipercaya: bisa berasal dari versi
   * aplikasi sebelumnya, bisa juga diedit manual dari DevTools. Tiap buku
   * dinormalisasi agar bentuk field selalu konsisten sebelum dipakai.
   *
   * Normalisasi cukup sekali lewat useMemo - bukan di dalam loop render.
   */
  const books = useMemo(
    () => (Array.isArray(booksmentah) ? booksmentah.map(normalisasiBuku) : []),
    [booksmentah],
  );

  /**
   * useEffect demonstrasi: menjaga judul tab selalu sinkron dengan jumlah buku.
   * Efek ini hanya bergantung pada books.length sehingga tidak berjalan
   * berlebihan saat title/penulis buku diedit.
   */
  useEffect(() => {
    document.title = `Manajemen Buku (${books.length}) - PAW ITERA`;
  }, [books.length]);

  /** Menambah buku baru ke collection. */
  const tambahBuku = useCallback((data) => {
    const sekarang = new Date().toISOString();
    const bukuBaru = normalisasiBuku({
      ...FORM_KOSONG,
      ...data,
      id: buatId(),
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    // Update immutable: array baru, bukan books.push().
    setBooks((prev) => [bukuBaru, ...prev]);
    return bukuBaru;
  }, [setBooks]);

  /** Memperbarui buku berdasarkan id. Field tidak berubah dipertahankan. */
  const perbaruiBuku = useCallback(
    (id, data) => {
      let hasil = null;
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          hasil = normalisasiBuku({
            ...b,
            ...data,
            id: b.id, // id tidak boleh berubah
            createdAt: b.createdAt,
            updatedAt: new Date().toISOString(),
          });
          return hasil;
        }),
      );
      return hasil;
    },
    [setBooks],
  );

  /** Menghapus satu buku berdasarkan id. */
  const hapusBuku = useCallback(
    (id) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    },
    [setBooks],
  );

  /** Menyalakan/mematikan penanda favorit. */
  const toggleFavorit = useCallback(
    (id) => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, favorit: !b.favorit, updatedAt: new Date().toISOString() }
            : b,
        ),
      );
    },
    [setBooks],
  );

  /** Menghapus seluruh koleksi dan key storage. */
  const kosongkan = useCallback(() => {
    hapusStorage();
  }, [hapusStorage]);

  /** Mengisi koleksi dengan data contoh (berguna untuk demo/presentasi). */
  const isiContoh = useCallback(() => {
    const sekarang = new Date().toISOString();
    setBooks(
      BUKU_CONTOH.map((b, i) =>
        normalisasiBuku({
          ...b,
          id: buatId(),
          createdAt: new Date(Date.now() - i * 60_000).toISOString(),
          updatedAt: sekarang,
        }),
      ),
    );
  }, [setBooks]);

  /** Mencari satu buku berdasarkan id (dikembalikan sebagai objek). */
  const cariBuku = useCallback(
    (id) => books.find((b) => b.id === id) ?? null,
    [books],
  );

  // useMemo prevents semua consumer dari re-render kecuali nilai-nilai ini berubah.
  const value = useMemo(
    () => ({
      books,
      tambahBuku,
      perbaruiBuku,
      hapusBuku,
      toggleFavorit,
      kosongkan,
      isiContoh,
      cariBuku,
      persisten,
    }),
    [
      books,
      tambahBuku,
      perbaruiBuku,
      hapusBuku,
      toggleFavorit,
      kosongkan,
      isiContoh,
      cariBuku,
      persisten,
    ],
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook konsumsi. Sengaja melempar error bila dipakai di luar provider agar
 * bug ini terdeteksi saat development, bukan muncul diam-diam sebagai data undefined.
 */
export const useBooks = () => {
  const ctx = useContext(BookContext);
  if (!ctx) {
    throw new Error(
      'useBooks() harus dipakai di dalam <BookProvider>. Bungkus aplikasi dengan BookProvider.',
    );
  }
  return ctx;
};

export default BookContext;