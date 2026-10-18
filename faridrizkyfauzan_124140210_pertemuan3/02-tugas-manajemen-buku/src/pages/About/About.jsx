/**
 * About - halaman identitas & penjelasan fitur React yang dipakai.
 *
 * Halaman ini sengaja dibuat statis: datanya berasal dari konstanta
 * `IDENTITAS` sehingga tidak perlu fetch dan bisa langsung di-cache browser.
 */

import { Link } from 'react-router-dom';
import { IDENTITAS, STORAGE_KEY } from '../../utils/constants.js';
import { useBooks } from '../../context/BookContext.jsx';
import './About.css';

/** Satu baris daftar fitur: judul + penjelasan singkat. */
const FITUR_REACT = [
  {
    nama: 'Functional Components & Hooks',
    detail:
      'Seluruh komponen ditulis sebagai function. useState untuk state lokal, useEffect untuk efek samping, useMemo untuk optimasi perhitungan.',
  },
  {
    nama: 'Context API',
    detail:
      'Koleksi buku disimpan di satu provider (BookContext) agar tidak perlu mengoper data secara manual ke setiap anak komponen.',
  },
  {
    nama: 'Custom Hooks',
    detail:
      'Tiga hook dibuat sendiri: useLocalStorage (persistensi), useBookStats (agregasi statistik), useBookFilter (pencarian + sorting).',
  },
  {
    nama: 'React Router',
    detail:
      'Navigasi tiga halaman menggunakan HashRouter supaya aplikasi tetap bisa dibuka langsung dari hosting statis seperti GitHub Pages.',
  },
  {
    nama: 'Controlled Components',
    detail:
      'Semua input form controlled oleh state. Ini membuat validasi dan reset form jauh lebih mudah diprediksi.',
  },
  {
    nama: 'PropTypes',
    detail:
      'Setiap komponen punya kontrak props sebagai dokumentasi sekaligus type checking saat development.',
  },
  {
    nama: 'Testing Library',
    detail:
      'Test ditulis dari sudut pandang pengguna (cari teks, klik tombol), bukan dengan mengakses internal state komponen.',
  },
];

function About() {
  const { books, persisten } = useBooks();

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-judul">Tentang Aplikasi</h1>
        <p className="page-subjudul">
          Aplikasi manajemen buku pribadi - Tugas Praktikum Pertemuan 3.
        </p>
      </header>

      {/* --- Identitas mahasiswa --- */}
      <section className="card about-identitas">
        <h2 className="section-title">Identitas</h2>
        <dl className="about-dl">
          <div className="about-dl-row">
            <dt>Nama</dt>
            <dd>{IDENTITAS.nama}</dd>
          </div>
          <div className="about-dl-row">
            <dt>NIM</dt>
            <dd>{IDENTITAS.nim}</dd>
          </div>
          <div className="about-dl-row">
            <dt>Kelas</dt>
            <dd>{IDENTITAS.kelas}</dd>
          </div>
          <div className="about-dl-row">
            <dt>Praktikum</dt>
            <dd>
              {IDENTITAS.praktikum} - {IDENTITAS.kampus}
            </dd>
          </div>
        </dl>
      </section>

      {/* --- Fitur React --- */}
      <section className="about-fitur">
        <h2 className="section-title">Fitur React yang Digunakan</h2>
        <div className="about-fitur-grid">
          {FITUR_REACT.map((f) => (
            <article key={f.nama} className="card about-fitur-item">
              <h3 className="about-fitur-nama">{f.nama}</h3>
              <p className="about-fitur-detail">{f.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* --- Penyimpanan --- */}
      <section className="card about-storage">
        <h2 className="section-title">Penyimpanan</h2>
        <p>
          Seluruh data buku disimpan di <code>localStorage</code> browser dengan
          kunci <code>{STORAGE_KEY}</code>. Tidak ada server, tidak ada akun -
          data hanya ada di perangkat Anda dan hilang bila cache browser
          dibersihkan.
        </p>
        <p className="muted">
          Saat ini tersimpan {books.length} buku. Status penyimpanan persisten:{' '}
          <strong>{persisten ? 'aktif' : 'tidak tersedia (mode sementara)'}</strong>.
        </p>
        <Link to="/" className="btn btn-outline btn-sm">
          Kembali ke daftar buku
        </Link>
      </section>
    </div>
  );
}

export default About;