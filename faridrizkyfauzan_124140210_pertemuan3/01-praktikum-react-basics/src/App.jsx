/**
 * App - shell navigasi untuk 7 topik praktikum.
 *
 * Routing memakai HashRouter agar demo ini bisa dibuka langsung dari file
 * statis (GitHub Pages) maupun dari path relatif apa pun tanpa konfigurasi
 * server tambahan.
 */

import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Topic1 from './topics/Topic1.jsx';
import Topic2 from './topics/Topic2.jsx';
import Topic3 from './topics/Topic3.jsx';
import Topic4 from './topics/Topic4.jsx';
import Topic5 from './topics/Topic5.jsx';
import Topic6 from './topics/Topic6.jsx';
import Topic7 from './topics/Topic7.jsx';

/** Definisi topik - sumber data tunggal untuk sidebar dan route. */
const TOPIK = [
  { no: 1, path: '/topik/1', label: 'Setup Project React', Component: Topic1 },
  { no: 2, path: '/topik/2', label: 'Components & Props', Component: Topic2 },
  { no: 3, path: '/topik/3', label: 'State & Hooks', Component: Topic3 },
  { no: 4, path: '/topik/4', label: 'React Router', Component: Topic4 },
  { no: 5, path: '/topik/5', label: 'Custom Hook', Component: Topic5 },
  { no: 6, path: '/topik/6', label: 'Context API', Component: Topic6 },
  { no: 7, path: '/topik/7', label: 'Testing', Component: Topic7 },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo" aria-hidden="true">
          R
        </span>
        <div>
          <div className="sidebar-judul">React Basics</div>
          <div className="sidebar-sub">Praktikum Pertemuan 3</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Daftar topik">
        {TOPIK.map(({ no, path, label }) => (
          <Link
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-tautan${isActive ? ' aktif' : ''}`}
          >
            <span className="sidebar-nomor">{no}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

/** Tombol prev/next di bagian bawah tiap topik. */
function NavigasiBawah() {
  const { pathname } = useLocation();
  const aktif = TOPIK.findIndex((t) => t.path === pathname);
  const sebelum = aktif > 0 ? TOPIK[aktif - 1] : null;
  const sesudah = aktif >= 0 && aktif < TOPIK.length - 1 ? TOPIK[aktif + 1] : null;

  if (sebelum === null && sesudah === null) return null;

  return (
    <nav className="topik-nav" aria-label="Navigasi topik">
      {sebelum ? (
        <Link className="topik-nav-tautan" to={sebelum.path}>
          <span className="topik-nav-arah">Sebelumnya</span>
          <span className="topik-nav-label">{sebelum.no}. {sebelum.label}</span>
        </Link>
      ) : (
        <span />
      )}

      {sesudah ? (
        <Link className="topik-nav-tautan topik-nav-kanan" to={sesudah.path}>
          <span className="topik-nav-arah">Berikutnya</span>
          <span className="topik-nav-label">
            {sesudah.no}. {sesudah.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Halaman pembuka. */
function Beranda() {
  return (
    <article>
      <header>
        <p className="topik-eyebrow">Praktikum</p>
        <h1 className="topik-judul">React Basics</h1>
        <p className="topik-deskripsi">
          Tujuh topik materi Pertemuan 3, masing-masing dengan contoh kode dan
          demo interaktif yang bisa langsung dicoba di halaman ini.
        </p>
      </header>

      <section className="card">
        <h2 className="card-judul">Daftar topik</h2>
        <ol className="langkah">
          {TOPIK.map(({ no, path, label }) => (
            <li key={path}>
              <Link to={path}>{label}</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2 className="card-judul">Cara menjalankan</h2>
        <pre style={{ padding: '0.8rem', fontSize: '0.8rem', overflowX: 'auto' }}>
          <code>{`npm install
npm run dev`}</code>
        </pre>
        <p className="prose" style={{ marginTop: '0.6rem' }}>
          Browser akan terbuka otomatis di <code className="code-inline">http://localhost:5173</code>.
          Pilih topik lewat menu di samping.
        </p>
      </section>
    </article>
  );
}

/** 404. */
function TidakDitemukan() {
  return (
    <article>
      <h1 className="topik-judul">404</h1>
      <p className="topik-deskripsi" style={{ marginTop: '0.5rem' }}>
        Topik yang Anda cari tidak ada.{' '}
        <Link to="/">Kembali ke daftar topik</Link>.
      </p>
    </article>
  );
}

/**
 * Satu route untuk setiap topik.
 * Mapping ini membuat file App tetap pendek dan mudah ditambah topiknya.
 */
function RuteTopik() {
  return TOPIK.map(({ no, path, Component }) => (
    <Route
      key={no}
      path={path}
      element={
        <>
          <Component />
          <NavigasiBawah />
        </>
      }
    />
  ));
}

export default function App() {
  return (
    <HashRouter>
      <div className="shell">
        <Sidebar />
        <main className="konten">
          <Routes>
            <Route path="/" element={<Beranda />} />
            {RuteTopik()}
            <Route path="*" element={<TidakDitemukan />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}