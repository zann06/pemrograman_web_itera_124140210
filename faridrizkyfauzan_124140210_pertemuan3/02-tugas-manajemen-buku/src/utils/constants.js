/**
 * Konstanta aplikasi.
 *
 * Semua nilai yang dipakai lebih dari satu file dikumpulkan di sini supaya
 * mudah diubah (mis. menambah status baru) tanpa menyentuh banyak komponen.
 */

/** Key localStorage. Prefix-versioning agar data tugas sebelumnya tidak bentrok. */
export const STORAGE_KEY = 'paw3.manajemenBuku.books';

/** Tiga status buku sesuai spesifikasi tugas. */
export const STATUS = {
  MILIK: 'milik',
  BACA: 'baca',
  BELI: 'beli',
};

/**
 * Definisi status buku beserta metadata tampilan.
 * `label` = teks untuk pengguna, `deskripsi` = penjelasan singkat.
 */
export const OPSI_STATUS = [
  {
    value: STATUS.MILIK,
    label: 'Milik',
    deskripsi: 'Buku sudah dimiliki dan bisa dibaca kapan saja',
    className: 'badge-milik',
  },
  {
    value: STATUS.BACA,
    label: 'Sedang Baca',
    deskripsi: 'Buku yang sedang dibaca sekarang',
    className: 'badge-baca',
  },
  {
    value: STATUS.BELI,
    label: 'Ingin Beli',
    deskripsi: 'Buku yang masuk daftar purchase',
    className: 'badge-beli',
  },
];

export const SEMUA_STATUS = 'semua';

/** Mengambil label status dari nilai status (aman untuk data tak dikenal). */
export const labelStatus = (value) =>
  OPSI_STATUS.find((s) => s.value === value)?.label ?? value;

/** Mengambil className badge dari nilai status. */
export const classStatus = (value) =>
  OPSI_STATUS.find((s) => s.value === value)?.className ?? 'badge-beli';

/** Opsi pengurutan daftar buku. */
export const OPSI_URUT = [
  { value: 'terbaru', label: 'Terbaru ditambahkan' },
  { value: 'judul-asc', label: 'Judul (A-Z)' },
  { value: 'judul-desc', label: 'Judul (Z-A)' },
  { value: 'penulis-asc', label: 'Penulis (A-Z)' },
  { value: 'tahun-desc', label: 'Tahun terbaru' },
];

/** Batas validasi tahun terbit. */
export const TAHUN_MIN = 1450;
export const TAHUN_MAX = new Date().getFullYear() + 1;

/** Panjang minimum judul/penulis sebelum dianggap tidak valid. */
export const PANJANG_MIN = 2;
export const PANJANG_MAKS = 120;
export const CATATAN_MAKS = 500;

/** Identitas mahasiswa - dipakai di halaman About. */
export const IDENTITAS = {
  nama: 'Farid Rizky Fauzan',
  nim: '124140210',
  kelas: 'RA',
  praktikum: 'Pemrograman Web',
  kampus: 'Teknik Informatika - ITERA',
};

/** Buku contoh yang dipakai tombol "Isi data contoh". */
export const BUKU_CONTOH = [
  {
    judul: 'Clean Code',
    penulis: 'Robert C. Martin',
    status: STATUS.MILIK,
    tahun: 2008,
    favorit: true,
    catatan: 'Bab tentang coupling dan naming masih relevan buat review kode.',
  },
  {
    judul: 'Belajar React',
    penulis: 'Eleanor Griff',
    status: STATUS.BACA,
    tahun: 2024,
    favorit: false,
    catatan: 'Lanjut ke bagian hooks.',
  },
  {
    judul: 'Refactoring',
    penulis: 'Martin Fowler',
    status: STATUS.BELI,
    tahun: 2018,
    favorit: false,
    catatan: '',
  },
];