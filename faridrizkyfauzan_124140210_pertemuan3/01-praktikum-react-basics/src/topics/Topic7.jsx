/**
 * Topik 7 - Testing (Vitest & React Testing Library).
 *
 * Menampilkan contoh test nyata yang bisa disalin, beserta hasilnya. Test
 * di halaman ini sengaja ditulis dengan pola RTL: cari elemen lewat teks yang
 * dilihat pengguna, lalu simulasi interaksi.
 */

import { useState } from 'react';
import CodeBlock from '../components/CodeBlock.jsx';

/* ========================================================================
 * Komponen yang akan diuji
 * ===================================================================== */

function ValidatorNama({ onValidasi }) {
  const [nilai, setNilai] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nilai.trim() === '') {
      setError('Nama wajib diisi');
      onValidasi(false);
      return;
    }
    setError('');
    onValidasi(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        aria-label="nama"
        placeholder="ketik nama"
        value={nilai}
        onChange={(e) => setNilai(e.target.value)}
      />
      <button type="submit">Simpan</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

/* ========================================================================
 * Demo: login manual untuk membandingkan Maasoudi dengan test otomatis
 * ===================================================================== */

function Topic7() {
  const [hasil, setHasil] = useState(null);
  const [busy, setBusy] = useState(false);

  const jalankanTest = () => {
    setBusy(true);
    // Simulasi proses test berjalan beberapa saat.
    setTimeout(() => {
      setBusy(false);
      setHasil({
        total: 3,
        lulus: 3,
        gagal: 0,
        durasi: '1.4s',
        baris: [
          { nama: 'menampilkan input nama', ok: true },
          { nama: 'menampilkan pesan error saat kosong', ok: true },
          { nama: 'memanggil onValidasi(true) saat nama valid', ok: true },
        ],
      });
    }, 900);
  };

  return (
    <article>
      <header>
        <p className="topik-eyebrow">Topik 7</p>
        <h1 className="topik-judul">Testing (Vitest &amp; RTL)</h1>
        <p className="topik-deskripsi">
          Menulis test dari sudut pandang pengguna: apa yang diketik dan apa
          yang diklik - bukan memeriksa state internal komponen.
        </p>
      </header>

      <section className="card">
        <h2 className="card-judul">Pemasangan</h2>
        <CodeBlock bahasa="bash">{`npm install -D vitest @testing-library/react \\
  @testing-library/jest-dom jsdom

# di vite.config.js
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.js',
}`}</CodeBlock>

        <CodeBlock bahasa="js">{`// src/setupTests.js
import '@testing-library/jest-dom/vitest';

// jsdom tidak punya matchToElement; mock ini sekali saja.
Element.prototype.scrollIntoView = () => {};`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Struktur test yang umum
        </h2>
        <table className="tabel">
          <thead>
            <tr>
              <th>Blok</th>
              <th>Tujuan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>describe</td>
              <td>Mengelompokkan test terkait</td>
            </tr>
            <tr>
              <td>it / test</td>
              <td>Satu perilaku spesifik</td>
            </tr>
            <tr>
              <td>beforeEach</td>
              <td>Reset state sebelum tiap test</td>
            </tr>
            <tr>
              <td>render</td>
              <td>Mount komponen ke DOM</td>
            </tr>
            <tr>
              <td>userEvent</td>
              <td>Simulasikan klik dan ketik</td>
            </tr>
            <tr>
              <td>expect</td>
              <td>Memastikan hasil sesuai harapan</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="card-judul">Contoh test lengkap</h2>
        <CodeBlock>{`import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ValidatorNama from './ValidatorNama';

describe('ValidatorNama', () => {
  it('menampilkan pesan error saat nama kosong', async () => {
    const user = userEvent.setup();
    render(<ValidatorNama onValidasi={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /simpan/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Nama wajib diisi');
  });

  it('memberi tahu parent saat nama valid', async () => {
    const user = userEvent.setup();
    const onValidasi = vi.fn();
    render(<ValidatorNama onValidasi={onValidasi} />);

    await user.type(screen.getByLabelText(/nama/i), 'Budi');
    await user.click(screen.getByRole('button', { name: /simpan/i }));

    expect(onValidasi).toHaveBeenCalledWith(true);
  });
});`}</CodeBlock>

        <div className="output output-warn">
          Jangan pernah mengakses state internal komponen di dalam test.
          Test yang fragile akan ikut pecah setiap kali implementasi berubah,
          meskipun perilakunya di layar tetap sama.
        </div>
      </section>

      {/* --- Komponen live --- */}
      <section className="card">
        <h2 className="card-judul">Coba komponennya</h2>
        <p className="prose">
          Komponen di bawah persis yang diuji di atas. Coba kosongkan lalu isi,
          dan perhatikan pesan yang muncul.
        </p>

        <div className="demo-kolom" style={{ alignItems: 'stretch', marginTop: '0.7rem' }}>
          <ValidatorNama onValidasi={(ok) => setHasil({ manual: ok })} />
        </div>

        {hasil?.manual !== undefined && (
          <div className={`output ${hasil.manual ? 'output-ok' : 'output-galat'}`}>
            {hasil.manual
              ? 'onValidasi(true) dipanggil - nama dianggap valid.'
              : 'onValidasi(false) dipanggil - nama kosong.'}
          </div>
        )}
      </section>

      {/* --- Hasil test --- */}
      <section className="card">
        <h2 className="card-judul">Hasil eksekusi</h2>
        <p className="prose">
          Jalankan <code className="code-inline">npm test</code> di folder tugas
          untuk melihat hasil sebenarnya. Simulasi di bawah menggambarkan
          keluaran terminal tersebut.
        </p>

        <div className="demo">
          <button
            type="button"
            className="btn btn-primary"
            onClick={jalankanTest}
            disabled={busy}
          >
            {busy ? 'Menjalankan...' : 'Jalankan test'}
          </button>
        </div>

        {hasil?.baris ? (
          <div className="output output-ok">
            {`  ValidatorNama
${hasil.baris
  .map((b) => `    ${b.ok ? 'v' : 'x'} ${b.nama}`)
  .join('\n')}

  Test Files  1 passed (1)
       Tests  ${hasil.lulus} passed (${hasil.total})
    Duration  ${hasil.durasi}`}
          </div>
        ) : (
          <div className="output">
            Klik "Jalankan test" untuk melihat ringkasan hasil.
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="card-judul">Kontrol versi</h2>
        <table className="tabel">
          <thead>
            <tr>
              <th>Pustaka</th>
              <th>Peran</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jest</td>
              <td>Test runner</td>
              <td>Standar lama, masih banyak dipakai</td>
            </tr>
            <tr>
              <td>Vitest</td>
              <td>Test runner</td>
              <td>Lebih cepat, konfigurasi Vite</td>
            </tr>
            <tr>
              <td>React Testing Library</td>
              <td>Library test</td>
              <td>Query berbasis aksesibilitas</td>
            </tr>
            <tr>
              <td>user-event</td>
              <td>Simulasi interaksi</td>
              <td>Lebih akurat dari fireEvent</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}

export default Topic7;