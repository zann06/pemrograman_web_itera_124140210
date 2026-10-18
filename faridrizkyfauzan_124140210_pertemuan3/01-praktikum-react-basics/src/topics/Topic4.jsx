/**
 * Topik 4 - Routing dengan React Router.
 *
 * Aplikasi SPA: mengganti halaman tanpa reload. Praktikum ini memakai
 * HashRouter agar route bisa dibuka langsung dari file statis apa pun.
 */

import { Link, NavLink, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock.jsx';

const BUKU = [
  { id: '1', slug: 'dune', judul: 'Dune', penulis: 'Frank Herbert', tahun: 1965 },
  { id: '2', slug: 'solaris', judul: 'Solaris', penulis: 'Stanislaw Lem', tahun: 1961 },
  { id: '3', slug: 'neuromancer', judul: 'Neuromancer', penulis: 'William Gibson', tahun: 1984 },
];

/**
 * Layout bersarang: path /routing/buku/:slug mewarisi elemen ini.
 *
 * PENTING: route anak di-render lewat <Outlet />, bukan lewat props.children.
 * React Router v6+ menaruh hasil render route anak ke Outlet; jika props
 * children tetap dipakai, area ini akan selalu kosong.
 */
function LayoutBuku() {
  return (
    <div
      style={{
        marginTop: '0.7rem',
        paddingLeft: '0.8rem',
        borderLeft: '3px solid var(--border)',
      }}
    >
      <Outlet />
    </div>
  );
}

/** Route dinamis - :slug diisi dari useParams(). */
function DetailBuku() {
  // useParams() membaca nilai parameter dari URL.
  const { slug } = useParams();
  const buku = BUKU.find((b) => b.slug === slug);

  if (!buku) {
    return <div className="output output-galat">Buku dengan slug "{slug}" tidak ditemukan.</div>;
  }

  return (
    <>
      <div className="output output-ok">
        {`Judul    : ${buku.judul}\nPenulis  : ${buku.penulis}\nTahun    : ${buku.tahun}\nSlug     : ${buku.slug}   (dari useParams)`}
      </div>
      <p className="prose" style={{ marginTop: '0.6rem' }}>
        Parameter dinamis memungkinkan satu komponen melayani banyak URL.
        Tidak perlu membuat komponen terpisah untuk setiap buku.
      </p>
    </>
  );
}

/** Route index: otomatis mewarisi parent tanpa menulis path lagi. */
function IndexBuku() {
  return <div className="output">Route index - ini yang tampil saat path persis "/routing/buku".</div>;
}

/** Navigasi programatik. */
function TombolNavigasi() {
  const navigate = useNavigate();

  return (
    <div className="demo">
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate('/routing/buku/neuromancer')}
      >
        Pergi ke Neuromancer
      </button>
      <button
        type="button"
        className="btn"
        onClick={() => navigate('/routing/buku', { replace: true })}
      >
        Kembali ke daftar
      </button>
      <button type="button" className="btn" onClick={() => navigate(-1)}>
        Kembali (history)
      </button>
    </div>
  );
}

function Topic4() {
  return (
    <article>
      <header>
        <p className="topik-eyebrow">Topik 4</p>
        <h1 className="topik-judul">Routing dengan React Router</h1>
        <p className="topik-deskripsi">
          React Router mengubah URL di browser menjadi tampilan halaman yang
          berbeda, tanpa memuat ulang halaman.
        </p>
      </header>

      <section className="card">
        <h2 className="card-judul">Konsep dasar</h2>
        <CodeBlock>{`import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

<HashRouter>                    {/* atau BrowserRouter */}
  <Routes>
    <Route path="/" element={<Beranda />} />
    <Route path="/buku" element={<DaftarBuku />} />

    {/* Route bersarang dengan layout bersama.
        Layout memakai <Outlet /> sebagai tempat route anak dirender. */}
    <Route path="/buku" element={<LayoutBuku />}>
      <Route index element={<IndexBuku />} />
      <Route path=":slug" element={<DetailBuku />} />
    </Route>

    {/* Route yang tidak cocok apa pun */}
    <Route path="*" element={<Halaman404 />} />
  </Routes>
</HashRouter>`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          HashRouter vs BrowserRouter
        </h2>
        <table className="tabel">
          <thead>
            <tr>
              <th>Aspek</th>
              <th>BrowserRouter</th>
              <th>HashRouter</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bentuk URL</td>
              <td>/buku/dune</td>
              <td>/#/buku/dune</td>
            </tr>
            <tr>
              <td>Perlu konfigurasi server</td>
              <td>Ya (rewrite ke index.html)</td>
              <td>Tidak</td>
            </tr>
            <tr>
              <td>Cocok untuk</td>
              <td>Aplikasi dengan backend</td>
              <td>GitHub Pages, file statis</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* --- Demo route langsung --- */}
      <section className="card">
        <h2 className="card-judul">Demo route langsung</h2>
        <p className="prose">
          Tiga tautan di bawah memakai <code className="code-inline">Link</code> dan{' '}
          <code className="code-inline">NavLink</code>. Perhatikan URL di address
          bar berubah, tapi halaman tidak pernah dimuat ulang.
        </p>

        <div className="demo" style={{ marginTop: '0.7rem' }}>
          <NavLink
            to="/routing/buku"
            end
            className={({ isActive }) => `btn ${isActive ? 'btn-aksen' : ''}`}
          >
            Daftar buku
          </NavLink>
          {BUKU.map((b) => (
            <NavLink
              key={b.id}
              to={`/routing/buku/${b.slug}`}
              className={({ isActive }) => `btn ${isActive ? 'btn-aksen' : ''}`}
            >
              {b.judul}
            </NavLink>
          ))}
        </div>

        <div style={{ marginTop: '0.9rem' }}>
          <TombolNavigasi />
        </div>

        <div style={{ marginTop: '0.9rem' }}>
          <Routes>
            <Route path="routing/buku" element={<LayoutBuku />}>
              <Route index element={<IndexBuku />} />
              <Route path=":slug" element={<DetailBuku />} />
            </Route>
          </Routes>
        </div>
      </section>

      {/* --- useNavigate --- */}
      <section className="card">
        <h2 className="card-judul">Navigasi programatik</h2>
        <p className="prose">
          <code className="code-inline">Link</code> dipakai untuk tautan yang
          dilihat pengguna. Setelah aksi selesai - misalnya data tersimpan -
          biasanya kita melakukan perpindahan halaman lewat{' '}
          <code className="code-inline">useNavigate()</code>.
        </p>
        <CodeBlock>{`const navigate = useNavigate();

navigate('/buku');                    // tambah riwayat
navigate('/buku', { replace: true }); // ganti entri saat ini
navigate(-1);                         // seperti tombol "back" browser`}</CodeBlock>

        <p className="prose">
          Contoh dari daftar buku di atas, <Link to="/routing/buku/solaris">Solaris</Link>{' '}
          juga bisa dibuka dengan menuliskan path-nya langsung.
        </p>
      </section>
    </article>
  );
}

export default Topic4;