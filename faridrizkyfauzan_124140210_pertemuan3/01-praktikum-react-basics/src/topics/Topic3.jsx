/**
 * Topik 3 - State Management & Hooks (useState, useEffect).
 *
 * Demo: counter dengan primitive vs object state, efek yang berjalan saat
 * mount / saat dependensi berubah, dan cleanup.
 */

import { useEffect, useState } from 'react';
import CodeBlock from '../components/CodeBlock.jsx';

function Topic3() {
  // --- State primitive ---
  const [hitung, setHitung] = useState(0);
  const [nama, setNama] = useState('');

  // --- State objek: perlu update satu per satu, jangan mutate langsung ---
  const [form, setForm] = useState({ judul: '', penulis: '', tahun: '' });

  // --- Derived state: dihitung langsung, TIDAK perlu useState ---
  const karakter = nama.length;
  const kata = nama.trim() === '' ? 0 : nama.trim().split(/\s+/).length;

  // --- Log useEffect ---
  const [log, setLog] = useState([]);

  // Efek 1: hanya berjalan sekali setelah komponen pertama kali dirender.
  useEffect(() => {
    setLog((l) => [{ id: l.length + 1, teks: 'useEffect berjalan (mount)' }, ...l]);
  }, []);

  // Efek 2: berjalan setiap kali `hitung` berubah.
  useEffect(() => {
    setLog((l) => [
      { id: l.length + 1, teks: `useEffect: nilai berubah -> ${hitung}` },
      ...l,
    ]);
  }, [hitung]);

  // Efek 3: cleanup - menghentikan timer saat komponen dilepas.
  const [detak, setDetak] = useState(true);
  const [detakan, setDetakan] = useState(0);
  useEffect(() => {
    if (!detak) return undefined;
    const timer = setInterval(() => setDetakan((n) => n + 1), 1000);
    // Fungsi cleanup: React memanggilnya sebelum efek dijalankan ulang
    // dan saat komponen dilepas dari layar.
    return () => clearInterval(timer);
  }, [detak]);

  /** Update satu field dari state objek tanpa kehilangan field lain. */
  const ubahField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const kosongkanLog = () => setLog([]);

  return (
    <article>
      <header>
        <p className="topik-eyebrow">Topik 3</p>
        <h1 className="topik-judul">State Management &amp; Hooks</h1>
        <p className="topik-deskripsi">
          State adalah data yang berubah seiring waktu dan membuat komponen
          renders ulang. Hooks adalah fungsi yang menempelkan perilaku React
          ke function component.
        </p>
      </header>

      {/* --- useState --- */}
      <section className="card">
        <h2 className="card-judul">useState</h2>
        <CodeBlock>{`const [nilai, setNilai] = useState(nilaiAwal);

// Mengganti nilai biasa
setNilai(10);

// Untuk nilai yang bergantung nilai sebelumnya, pakai fungsi updater.
// Ini penting kalau beberapa pembaruan terjadi dalam satu batch.
setNilai((n) => n + 1);

// Kalau mengoper objek/array, buat salinan baru (immutable).
setForm((f) => ({ ...f, judul: 'Dune' }));`}</CodeBlock>

        <div className="output output-warn">
          Jangan pernah mengubah state secara langsung: arr.push(x) atau
          obj.nilai = x. React tidak mendeteksi perubahan itu. Selalu buat
          objek/array baru.
        </div>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Demo counter
        </h2>
        <div className="demo">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setHitung((n) => n + 1)}
          >
            +1
          </button>
          <button
            type="button"
            className="btn btn-aksen"
            onClick={() => setHitung((n) => n + 10)}
          >
            +10
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setHitung((n) => n - 1)}
            disabled={hitung <= 0}
          >
            -1
          </button>
          <button type="button" className="btn" onClick={() => setHitung(0)}>
            Reset
          </button>
        </div>
        <div className="output output-ok">hitung = {hitung}</div>
      </section>

      {/* --- Derived state --- */}
      <section className="card">
        <h2 className="card-judul">State vs derived state</h2>
        <p className="prose">
          Nilai yang bisa dihitung dari state lain tidak perlu disimpan sendiri
          sebagai state. Menyimpannya secara manual berisiko membuat data
          tidak sinkron (bukti klasik: dua sumber kebenaran untuk satu angka).
        </p>

        <label className="label" htmlFor="t3-nama">
          Ketik sesuatu
        </label>
        <input
          id="t3-nama"
          className="input"
          style={{ maxWidth: 320, marginTop: '0.3rem' }}
          placeholder="contoh: Practical React Basics"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <div className="grid2">
          <div className="stat">
            <div className="stat-label">jumlah karakter</div>
            <div className="stat-nilai">{karakter}</div>
          </div>
          <div className="stat">
            <div className="stat-label">jumlah kata</div>
            <div className="stat-nilai">{kata}</div>
          </div>
        </div>

        <div className="output">
          {nama.trim() === ''
            ? 'Ketik untuk melihat nilai turunan dihitung otomatis.'
            : `${nama.trim().toUpperCase()}  |  ${karakter} karakter, ${kata} kata`}
        </div>
      </section>

      {/* --- Object state --- */}
      <section className="card">
        <h2 className="card-judul">State berbentuk objek</h2>
        <CodeBlock>{`const [form, setForm] = useState({ judul: '', penulis: '' });

// SALAH: setForm({ ...form, judul: x }) tanpa updater bisa kehilangan
//        perubahan lain pada event yang sama.
// BENAR:
const ubah = (e) =>
  setForm((f) => ({ ...f, [e.target.name]: e.target.value }));`}</CodeBlock>

        <div className="demo-kolom" style={{ marginTop: '0.7rem', width: 320 }}>
          <input
            className="input"
            placeholder="judul"
            name="judul"
            value={form.judul}
            onChange={ubahField('judul')}
          />
          <input
            className="input"
            placeholder="penulis"
            name="penulis"
            value={form.penulis}
            onChange={ubahField('penulis')}
          />
          <input
            className="input"
            placeholder="tahun"
            name="tahun"
            value={form.tahun}
            onChange={ubahField('tahun')}
          />
        </div>
        <div className="output output-ok">
          {`judul   : "${form.judul}"\npenulis : "${form.penulis}"\ntahun   : "${form.tahun}"`}
        </div>
      </section>

      {/* --- useEffect --- */}
      <section className="card">
        <h2 className="card-judul">useEffect</h2>
        <p className="prose">
          <code className="code-inline">useEffect(fn, deps)</code> menjalankan{' '}
          <code className="code-inline">fn</code> setelah komponen dirender.
          Parameter kedua menentukan kapan efek dijalankan ulang:
        </p>
        <ul className="prose">
          <li>
            <code className="code-inline">[]</code> - hanya sekali setelah mount.
          </li>
          <li>
            <code className="code-inline">[a, b]</code> - setiap kali a atau b
            berubah.
          </li>
          <li>
            Tidak diisi - setiap render (hampir selalu tidak desirable).
          </li>
        </ul>

        <CodeBlock>{`useEffect(() => {
  document.title = \`Buku: \${total}\`;
}, [total]);

// Dengan cleanup - untuk timer, listener, atau subscription
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}, [aktif]);`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Demo: efek berjalan saat nilai berubah
        </h2>
        <div className="demo">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setHitung((n) => n + 1)}
          >
            Tambah hitung
          </button>
          <button type="button" className="btn" onClick={kosongkanLog}>
            Bersihkan log
          </button>
        </div>

        <div className="output">
          {log.length === 0 ? '(log kosong)' : log.slice(0, 6).map((l) => l.teks).join('\n')}
        </div>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Demo: efek dengan cleanup (timer)
        </h2>
        <p className="prose">
          Matikan lalu hidupkan timer beberapa kali. Detikan angka akan
          terus berjalan tanpa meloncat - karena cleanup berhasil membatalkan
          timer lama.
        </p>
        <div className="demo">
          <button
            type="button"
            className={`btn ${detak ? 'btn-primary' : ''}`}
            onClick={() => setDetak((d) => !d)}
          >
            {detak ? 'Matikan timer' : 'Nyalakan timer'}
          </button>
          <span className="badge">{detak ? 'timer aktif' : 'timer mati'}</span>
        </div>
        <div className="output output-ok">
          Detak: selama {detakan} detik
        </div>
      </section>
    </article>
  );
}

export default Topic3;