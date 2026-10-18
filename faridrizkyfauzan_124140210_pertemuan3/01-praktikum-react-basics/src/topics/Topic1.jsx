/**
 * Topik 1 - Setup Project React.
 *
 * Menampilkan ringkasan setup Vite dan JSX dasar, plus demo kecil untuk
 *secara langsung melihat apa itu JSX: teks, ekspresi, dan daftar (map).
 */

import { useState } from 'react';
import CodeBlock from '../components/CodeBlock.jsx';

const LANG = ['JavaScript', 'TypeScript'];

function Topic1() {
  const [nilai, setNilai] = useState(0);
  const [untuk, setUntuk] = useState('JavaScript');

  return (
    <article>
      <header>
        <p className="topik-eyebrow">Topik 1</p>
        <h1 className="topik-judul">Setup Project React</h1>
        <p className="topik-deskripsi">
          Membuat, menjalankan, dan memahami struktur project React modern
          memakai Vite.
        </p>
      </header>

      {/* --- Perintah terminal --- */}
      <section className="card">
        <h2 className="card-judul">Membuat project baru</h2>
        <p className="prose">
          Dua tool yang umum dipakai adalah <code className="code-inline">Vite</code>{' '}
          (direkomendasikan) dan <code className="code-inline">Create React App</code>.
          Praktikum ini memakai Vite karena proses start-nya jauh lebih cepat.
        </p>
        <CodeBlock bahasa="bash">{`# Opsi A - Vite (dipakai di praktikum ini)
npm create vite@latest DAKIM_122140001_pertemuan3 -- --template react

# Opsi B - Create React App
npx create-react-app DAKIM_122140001_pertemuan3`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Dependensi wajib
        </h2>
        <CodeBlock bahasa="bash">{`cd DAKIM_122140001_pertemuan3
npm install
npm install react-router-dom prop-types
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Menjalankan
        </h2>
        <CodeBlock bahasa="bash">{`npm run dev     # server pengembangan
npm run build   # build produksi ke folder dist/
npm run preview # cek hasil build`}</CodeBlock>

        <div className="output">
          {`node_modules/   -> paket yang diunduh, jangan di-commit
dist/           -> hasil build, otomatis di-ignore
src/            -> seluruh kode aplikasi
  main.jsx      -> entry point, tempat createRoot()
  App.jsx       -> komponen root
public/         -> aset statis (gambar, favicon)`}
        </div>
      </section>

      {/* --- JSX --- */}
      <section className="card">
        <h2 className="card-judul">Mengenal JSX</h2>
        <p className="prose">
          JSX adalah perluasan sintaks JavaScript yang memungkinkan menulis
          markup HTML di dalam file <code className="code-inline">.js</code>/
          <code className="code-inline">.jsx</code>. Babel atau plugin Vite
          mengubahnya menjadi fungsi <code className="code-inline">React.createElement</code>.
        </p>

        <CodeBlock>{`// Ekspresi di dalam kurung kurawal {}
const Judul = () => <h1>Halo, {nama.toUpperCase()}!</h1>;

// Ekspresi berarti objek ATAU array bisa ditulis langsung
const Kartu = () => (
  <div className="kartu">
    <h2>{buku.judul}</h2>
    <p>{buku.penulis}</p>
  </div>
);

// Fragment <>...</> dipakai saat butuh banyak elemen
// tapi tidak boleh menambah pembungkus DOM
const Daftar = () => (
  <>
    <h2>Daftar</h2>
    <ul>{buku.map((b) => <li key={b.id}>{b.judul}</li>)}</ul>
  </>
);`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Aturan JSX yang sering terlewat
        </h2>
        <ul className="prose">
          <li>
            Hanya satu elemen teratas yang dikembalikan - pakai{' '}
            <code className="code-inline">&lt;&gt;...&lt;/&gt;</code> untuk
            multi level.
          </li>
          <li>
            Semua tag harus ditutup, termasuk tag yang satu seperti{' '}
            <code className="code-inline">&lt;br /&gt;</code> dan{' '}
            <code className="code-inline">&lt;img /&gt;</code>.
          </li>
          <li>
            Atribut <code className="code-inline">class</code> menjadi{' '}
            <code className="code-inline">className</code> di JSX.
          </li>
          <li>
            Persamaan bukan assignment, jadi ditulis{' '}
            <code className="code-inline">{'{nilai === 1}'}</code> bukan{' '}
            <code className="code-inline">{'{nilai = 1}'}</code>.
          </li>
        </ul>
      </section>

      {/* --- Demo interaktif --- */}
      <section className="card">
        <h2 className="card-judul">Coba sendiri</h2>
        <p className="prose">
          Pilih bahasa yang dipakai Vite, lalu klik tombol untuk melihat state
          berubah di layar.
        </p>

        <div className="demo">
          {LANG.map((l) => (
            <button
              key={l}
              type="button"
              className={`btn ${untuk === l ? 'btn-aksen' : ''}`}
              onClick={() => setUntuk(l)}
            >
              {l}
            </button>
          ))}
        </div>

        <div className={`output ${untuk === 'TypeScript' ? 'output-warn' : ''}`}>
          {untuk === 'JavaScript'
            ? 'File sumber: src/App.jsx  (ekstensi .jsx)'
            : 'File sumber: src/App.tsx  (ekstensi .tsx + tipe data)'}
        </div>

        <div className="demo" style={{ marginTop: '0.8rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setNilai((n) => n + 1)}
          >
            Tambah nilai
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setNilai((n) => n - 1)}
            disabled={nilai <= 0}
          >
            Kurangi
          </button>
          <button type="button" className="btn" onClick={() => setNilai(0)}>
            Reset
          </button>
        </div>

        <div className="output output-ok">nilai sekarang: {nilai}</div>
      </section>
    </article>
  );
}

export default Topic1;