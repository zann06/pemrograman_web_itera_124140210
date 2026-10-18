/**
 * App - root aplikasi: routing + provider global.
 *
 * Routing memakai HashRouter (URL berawalan /#/) dengan alasan praktis:
 * aplikasi ini bisa langsung dibuka dari hosting statis seperti GitHub Pages
 * tanpa perlu konfigurasi rewrite URL di sisi server. Exactly the same
 * komponen dan API seperti BrowserRouter, hanya implementation-nya berbeda.
 */

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookProvider } from './context/BookContext.jsx';
import useToast from './hooks/useToast.js';
import Navbar from './components/Navbar/Navbar.jsx';
import Toast from './components/Toast/Toast.jsx';
import EmptyState from './components/EmptyState/EmptyState.jsx';
import Home from './pages/Home/Home.jsx';
import Stats from './pages/Stats/Stats.jsx';
import About from './pages/About/About.jsx';
import { IDENTITAS } from './utils/constants.js';
import './App.css';

/** Definisi rute. Dipisah supaya Navbar dan <Routes> memakai sumber data sama. */
const TAUTAN = [
  { ke: '/', label: 'Koleksi', akhir: true },
  { ke: '/statistik', label: 'Statistik' },
  { ke: '/tentang', label: 'Tentang' },
];

/** Halaman 404. */
function TidakDitemukan() {
  return (
    <div className="page">
      <EmptyState
        ikon="404"
        judul="Halaman tidak ditemukan"
        pesan="Alamat yang Anda buka tidak tersedia di aplikasi ini."
      />
    </div>
  );
}

export default function App() {
  // Satu instance toast untuk seluruh aplikasi, diteruskan ke Home.
  const notif = useToast();

  return (
    <BookProvider>
      <HashRouter>
        <div className="app">
          <Navbar tautan={TAUTAN} />

          {/* <Routes> memilih satu komponen anak berdasarkan URL saat ini. */}
          <main className="app-main container">
            <Routes>
              <Route path="/" element={<Home notif={notif} />} />
              <Route path="/statistik" element={<Stats />} />
              <Route path="/tentang" element={<About />} />
              {/* Redirect rute kosong ke halaman utama. */}
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="*" element={<TidakDitemukan />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <div className="container app-footer-inner">
              <span>
                Tugas Praktikum Pertemuan 3 - {IDENTITAS.praktikum}
              </span>
              <span className="muted">
                {IDENTITAS.nama} - {IDENTITAS.nim} - Kelas {IDENTITAS.kelas}
              </span>
            </div>
          </footer>

          <Toast notifs={notif.notifs} onSelesai={notif.tutup} />
        </div>
      </HashRouter>
    </BookProvider>
  );
}