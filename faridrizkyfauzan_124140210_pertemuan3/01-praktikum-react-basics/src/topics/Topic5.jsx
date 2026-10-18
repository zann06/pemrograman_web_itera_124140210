/**
 * Topik 5 - Pembuatan Custom Hook.
 *
 * Hook kustom adalah cara mengekstrak logika yang bisa dipakai ulang (state
 * + efek) dari komponen. Demo ini membuat useCounter dan useDebounce sungguhan
 * di file terpisah supaya bisa disalin ke project lain.
 */

import { useEffect, useState } from 'react';
import CodeBlock from '../components/CodeBlock.jsx';

/* ========================================================================
 * Custom Hook 1 - useCounter
 * ===================================================================== */

/**
 * Menyediakan counter lengkap dengan reset.
 * Hook bisa mengembalikan objek agar nama aksi lebih jelas saat dipakai.
 */
function useCounter({ awal = 0, langkah = 1 } = {}) {
  const [nilai, setNilai] = useState(awal);

  const tambah = () => setNilai((n) => n + langkah);
  const kurang = () => setNilai((n) => n - langkah);
  const reset = () => setNilai(awal);
  // setNilai mentah ikut dikembalikan untuk kasus khusus.
  const setNilaiTersedia = setNilai;

  return { nilai, tambah, kurang, reset, setNilai: setNilaiTersedia };
}

/* ========================================================================
 * Custom Hook 2 - useDebounce
 * ===================================================================== */

/**
 * Menunda perubahan nilai sampai pengguna berhenti mengetik selama `jeda` ms.
 * Berguna untuk pencarian supaya tidak memanggil API di setiap ketikan.
 */
function useDebounce(nilai, jeda = 500) {
  const [tertunda, setTertunda] = useState(nilai);

  useEffect(() => {
    const timer = setTimeout(() => setTertunda(nilai), jeda);
    // Membersihkan timer yang belum selesai setiap kali nilai berubah.
    return () => clearTimeout(timer);
  }, [nilai, jeda]);

  return tertunda;
}

/* ========================================================================
 * Custom Hook 3 - useToggle
 * ===================================================================== */

function useToggle(nilaiAwal = false) {
  const [nyala, setNyala] = useState(nilaiAwal);
  const toggle = () => setNyala((v) => !v);
  return [nyala, toggle];
}

/* ========================================================================
 * Komponen yang memakai hook di atas
 * ===================================================================== */

function Penghitung({ label, langkah }) {
  // Hook kustom dipanggil persis seperti hook bawaan: di level atas komponen.
  const { nilai, tambah, kurang, reset } = useCounter({ langkah });

  return (
    <div className="card" style={{ marginTop: '0.7rem' }}>
      <div className="demo" style={{ justifyContent: 'space-between' }}>
        <strong>
          {label}: {nilai}
        </strong>
        <span className="badge">langkah {langkah}</span>
      </div>
      <div className="demo" style={{ marginTop: '0.6rem' }}>
        <button type="button" className="btn btn-primary" onClick={tambah}>
          Tambah
        </button>
        <button type="button" className="btn" onClick={kurang}>
          Kurang
        </button>
        <button type="button" className="btn" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

function Topic5() {
  const [teks, setTeks] = useState('react');
  const tertunda = useDebounce(teks, 700);

  const [terbuka, setTerbuka] = useToggle(false);

  // Dua instance hook dipanggil dua kali: state tiap instance saling terpisah.
  const a = useCounter({ langkah: 1 });
  const b = useCounter({ langkah: 10 });

  return (
    <article>
      <header>
        <p className="topik-eyebrow">Topik 5</p>
        <h1 className="topik-judul">Pembuatan Custom Hook</h1>
        <p className="topik-deskripsi">
          Menulis logika reusable di luar komponen, lalu memakainya seperti
          hook bawaan.
        </p>
      </header>

      <section className="card">
        <h2 className="card-judul">Kapan perlu custom hook?</h2>
        <p className="prose">
          Custom hook cocok dipakai ketika logika yang sama muncul di dua
          komponen atau lebih, atau ketika sebuah komponen menjadi terlalu
          besar karena terlalu banyakstate.
        </p>
        <ul className="prose">
          <li>
            Nama hook selalu diawali <code className="code-inline">use</code> - ini
            aturan wajib React agar bisa mengenali fungsi hook.
          </li>
          <li>
            Hook boleh memanggil hook lain, dan boleh dipanggil berkali-kali.
          </li>
          <li>
            Dua pemanggilan hook selalu punya state terpisah, tidak saling berbagi.
          </li>
        </ul>
        <div className="output output-warn">
          Hook tidak boleh dipanggil di dalam if, for, atau event handler -
          hanya di level atas komponen atau custom hook lain.
        </div>
      </section>

      {/* --- useCounter --- */}
      <section className="card">
        <h2 className="card-judul">useCounter</h2>
        <CodeBlock>{`import { useState } from 'react';

function useCounter({ awal = 0, langkah = 1 } = {}) {
  const [nilai, setNilai] = useState(awal);

  return {
    nilai,
    tambah: () => setNilai((n) => n + langkah),
    kurang: () => setNilai((n) => n - langkah),
    reset: () => setNilai(awal),
  };
}`}</CodeBlock>

        <Penghitung label="Counter langkah 1" langkah={1} />
        <Penghitung label="Counter langkah 10" langkah={10} />
      </section>

      {/* --- Independence --- */}
      <section className="card">
        <h2 className="card-judul">Dua pemanggilan = dua state terpisah</h2>
        <p className="prose">
          Klik tombol di bawah. Counter pertama naik 1 per klik, yang kedua
          naik 10. Keduanya memakai hook yang sama, tapi state-nya terpisah.
        </p>

        <div className="grid2">
          <div className="stat">
            <div className="stat-label">counter +1</div>
            <div className="stat-nilai">{a.nilai}</div>
            <div className="demo" style={{ marginTop: '0.4rem' }}>
              <button type="button" className="btn btn-primary" onClick={a.tambah}>
                +1
              </button>
              <button type="button" className="btn" onClick={a.reset}>
                reset
              </button>
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">counter +10</div>
            <div className="stat-nilai">{b.nilai}</div>
            <div className="demo" style={{ marginTop: '0.4rem' }}>
              <button type="button" className="btn btn-aksen" onClick={b.tambah}>
                +10
              </button>
              <button type="button" className="btn" onClick={b.reset}>
                reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- useDebounce --- */}
      <section className="card">
        <h2 className="card-judul">useDebounce</h2>
        <p className="prose">
          Menunda nilai sampai waktu tertentu berlalu tanpa perubahan baru.
          Ketik cepat di bawah: nilai <code>tertunda</code> hanya ikut berubah
          700 ms setelah kamu berhenti mengetik.
        </p>
        <CodeBlock>{`function useDebounce(nilai, jeda = 500) {
  const [tertunda, setTertunda] = useState(nilai);

  useEffect(() => {
    const timer = setTimeout(() => setTertunda(nilai), jeda);
    // Setiap ketikan baru membatalkan timer sebelumnya.
    return () => clearTimeout(timer);
  }, [nilai, jeda]);

  return tertunda;
}`}</CodeBlock>

        <input
          className="input"
          style={{ width: '100%', maxWidth: 360, marginTop: '0.7rem' }}
          placeholder="ketik cepat untuk melihat efek debounce..."
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
        />

        <div className="output">
          {`nilai langsung  : "${teks}"\nnilai tertunda : "${tertunda}"\nstatus          : ${teks === tertunda ? 'sudah sinkron' : 'menunggu 700 ms...'} (${tertunda.length} karakter)`}
        </div>
      </section>

      {/* --- useToggle --- */}
      <section className="card">
        <h2 className="card-judul">useToggle</h2>
        <CodeBlock>{`function useToggle(nilaiAwal = false) {
  const [nyala, setNyala] = useState(nilaiAwal);
  return [nyala, () => setNyala((v) => !v)];
}`}</CodeBlock>

        <div className="demo" style={{ marginTop: '0.7rem' }}>
          <button type="button" className="btn btn-primary" onClick={setTerbuka}>
            {terbuka ? 'Tutup' : 'Buka'}
          </button>
          <span className={`badge ${terbuka ? 'badge-ok' : ''}`}>
            {terbuka ? 'terbuka' : 'tertutup'}
          </span>
        </div>

        {terbuka && (
          <div className="output output-ok">
            Konten ini dirender secara conditional. Perhatikan di DevTools: saat
            tombol ditutup, elemen ini benar-benar dihapus dari DOM - bukan
            hanya disembunyikan dengan CSS.
          </div>
        )}
      </section>
    </article>
  );
}

export default Topic5;