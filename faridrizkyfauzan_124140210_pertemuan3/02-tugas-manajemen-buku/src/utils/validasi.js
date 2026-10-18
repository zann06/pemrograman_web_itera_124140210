/**
 * Validasi form buku.
 *
 * Fungsi murni (tidak menyentuh state/DOM) sehingga mudah diuji secara unit
 * tanpa merender komponen apa pun. Konvensi: selalu mengembalikan objek
 * `{ valid, errors }` dengan `errors` kosong bila valid.
 */

import {
  OPSI_STATUS,
  PANJANG_MIN,
  PANJANG_MAKS,
  CATATAN_MAKS,
  TAHUN_MIN,
  TAHUN_MAX,
} from './constants.js';

/** Nilai awal form - dipakai saat tambah maupun edit agar konsisten. */
export const FORM_KOSONG = {
  judul: '',
  penulis: '',
  status: 'milik',
  tahun: '',
  favorit: false,
  catatan: '',
};

/**
 * Membersihkan input sebelum divalidasi.
 * Trim menghilangkan spasi tepi yang sering tidak sengaja terkirim.
 */
const bersihkan = (values) => ({
  ...FORM_KOSONG,
  ...values,
  judul: (values.judul ?? '').trim(),
  penulis: (values.penulis ?? '').trim(),
  catatan: (values.catatan ?? '').trim(),
  tahun: values.tahun === '' || values.tahun == null ? '' : values.tahun,
});

/**
 * Memvalidasi nilai form buku.
 *
 * @param {object} values - Nilai mentah dari form.
 * @returns {{valid: boolean, errors: object, nilai: object}}
 *   `nilai` berisi data yang sudah dibersihkan dan dinormalisasi, sehingga
 *   pemanggil bisa langsung menyimpan `nilai` ke state.
 */
export const validasiBuku = (values) => {
  const nilai = bersihkan(values);
  const errors = {};

  // --- Judul (wajib) ---
  if (!nilai.judul) {
    errors.judul = 'Judul buku wajib diisi.';
  } else if (nilai.judul.length < PANJANG_MIN) {
    errors.judul = `Judul minimal ${PANJANG_MIN} karakter.`;
  } else if (nilai.judul.length > PANJANG_MAKS) {
    errors.judul = `Judul maksimal ${PANJANG_MAKS} karakter.`;
  }

  // --- Penulis (wajib) ---
  if (!nilai.penulis) {
    errors.penulis = 'Nama penulis wajib diisi.';
  } else if (nilai.penulis.length < PANJANG_MIN) {
    errors.penulis = `Nama penulis minimal ${PANJANG_MIN} karakter.`;
  } else if (nilai.penulis.length > PANJANG_MAKS) {
    errors.penulis = `Nama penulis maksimal ${PANJANG_MAKS} karakter.`;
  }

  // --- Status (wajib, harus salah satu dari tiga nilai yang dikenal) ---
  if (!OPSI_STATUS.some((s) => s.value === nilai.status)) {
    errors.status = 'Pilih status buku yang valid.';
  }

  // --- Tahun (opsional, tapi kalau diisi harus masuk rentang wajar) ---
  if (nilai.tahun !== '') {
    const tahun = Number(nilai.tahun);
    if (!Number.isInteger(tahun)) {
      errors.tahun = 'Tahun harus berupa bilangan bulat.';
    } else if (tahun < TAHUN_MIN || tahun > TAHUN_MAX) {
      errors.tahun = `Tahun harus antara ${TAHUN_MIN} dan ${TAHUN_MAX}.`;
    }
  }

  // --- Catatan (opsional, dibatasi panjangnya) ---
  if (nilai.catatan.length > CATATAN_MAKS) {
    errors.catatan = `Catatan maksimal ${CATATAN_MAKS} karakter.`;
  }

  // Normalisasi tahun menjadi number agar konsisten saat disimpan.
  if (nilai.tahun !== '' && !errors.tahun) {
    nilai.tahun = Number(nilai.tahun);
  } else if (nilai.tahun === '') {
    nilai.tahun = null;
  }

  nilai.favorit = Boolean(nilai.favorit);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    nilai,
  };
};

/**
 * Cek apakah pengguna sudah menyentuh sebuah field.
 *
 * Pola "touched" dipakai supaya pesan error tidak langsung merah saat form baru
 * dibuka - baru muncul setelah field dipakai lalu dikosongkan.
 */
export const touched = (touchedState, field) => Boolean(touchedState[field]);