/**
 * Topik 6 - Global State dengan Context API.
 *
 * Props drilling: data harus dioper manual dari komponen paling atas sampai
 * ke komponen yang membutuhkannya. Context API memutus rantai itu.
 */

import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from '../components/CodeBlock.jsx';

/* ========================================================================
 * Provider
 * ===================================================================== */

// 1. Buat context. Nilai default hanya dipakai kalau ada komponen yang
//    memakai useContext TANPA dibungkus provider - yaitu tanda bug.
const KeranjangContext = createContext(null);

/** Provider membungkus subtree dan menyediakan state + aksi. */
function KeranjangProvider({ children }) {
  const [items, setItems] = useState([
    { id: 1, judul: 'Dune', jumlah: 1 },
    { id: 2, judul: 'Neuromancer', jumlah: 2 },
  ]);

  // useMemo menjaga objek value tetap stabil antar render supaya consumer
  // tidak dirender ulang tanpa alasan.
  const value = useMemo(
    () => ({
      items,
      total: items.reduce((n, i) => n + i.jumlah, 0),
      tambah: (id) =>
        setItems((prev) => {
          const ada = prev.some((i) => i.id === id);
          return ada
            ? prev.map((i) => (i.id === id ? { ...i, jumlah: i.jumlah + 1 } : i))
            : [...prev, { id, jumlah: 1 }];
        }),
      hapus: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      reset: () => setItems([]),
    }),
    [items],
  );

  return <KeranjangContext.Provider value={value}>{children}</KeranjangContext.Provider>;
}

/* ========================================================================
 * Consumer
 * ===================================================================== */

/** Hook pembungkus createContext, supaya consumer tidak perlu import context. */
function useKeranjang() {
  const ctx = useContext(KeranjangContext);
  if (!ctx) {
    throw new Error('useKeranjang() harus dipakai di dalam KeranjangProvider');
  }
  return ctx;
}

/**
 * Komponen ini berada TIGA level di bawah provider, tapi tetap bisa membaca
 * data tanpa menerima satu pun props dari komponen yang di tengah.
 */
function RingkasanKeranjang() {
  const { total, reset } = useKeranjang();

  return (
    <div className="output output-ok">
      {`Total buku di keranjang: ${total}\n(Component ini 3 level di bawah provider, tanpa props)`}
      <div className="demo" style={{ marginTop: '0.6rem' }}>
        <button type="button" className="btn btn-aksen" onClick={reset}>
          Kosongkan
        </button>
      </div>
    </div>
  );
}

/** Level 3: paling jauh dari provider, nol props. */
function PanelBawah() {
  return (
    <div className="card" style={{ marginTop: '0.7rem' }}>
      <h3 className="card-judul">Level 3 - PanelBawah</h3>
      <RingkasanKeranjang />
    </div>
  );
}

/** Level 2: meneruskan children, bukan data. */
function PanelTengah({ children }) {
  return (
    <div className="card" style={{ marginTop: '0.7rem' }}>
      <h3 className="card-judul">Level 2 - PanelTengah</h3>
      <p className="prose">
        Komponen ini tidak tahu apa pun soal keranjang. Ia hanya meneruskan{' '}
        <code className="code-inline">children</code>.
      </p>
      {children}
    </div>
  );
}

PanelTengah.propTypes = {
  children: PropTypes.node,
};

/** Level 1: paling dekat dengan provider. */
function PanelAtas() {
  const { items, tambah, hapus } = useKeranjang();

  return (
    <div className="card" style={{ marginTop: '0.7rem' }}>
      <h3 className="card-judul">Level 1 - PanelAtas</h3>
      <div className="demo-kolom">
        {items.map((i) => (
          <div key={i.id} className="demo" style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>
              {i.judul} <span className="badge">x{i.jumlah}</span>
            </span>
            <span className="demo">
              <button
                type="button"
                className="btn"
                onClick={() => tambah(i.id)}
                aria-label={`tambah ${i.judul}`}
              >
                +
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => hapus(i.id)}
                aria-label={`hapus ${i.judul}`}
              >
                -
              </button>
            </span>
          </div>
        ))}
      </div>
      <div className="demo" style={{ marginTop: '0.7rem' }}>
        <button type="button" className="btn btn-primary" onClick={() => tambah(3)}>
          Tambah Refactoring
        </button>
        <button type="button" className="btn" onClick={() => tambah(4)}>
          Tambah The Pragmatic Programmer
        </button>
      </div>
    </div>
  );
}

function Topic6() {
  return (
    <article>
      <header>
        <p className="topik-eyebrow">Topik 6</p>
        <h1 className="topik-judul">Global State - Context API</h1>
        <p className="topik-deskripsi">
          Menyimpan state di satu titik sehingga bisa diakses komponen mana pun
          tanpa mengoper props secara beruntun.
        </p>
      </header>

      <section className="card">
        <h2 className="card-judul">Masalah: props drilling</h2>
        <p className="prose">
          Pada struktur yang dalam, satu nilai harus melewati beberapa komponen
          yang tidak memakainya. Makin dalam, makin banyak boilerplate - dan
          mudah lupa meneruskan satu props.
        </p>
        <CodeBlock>{`// Sebelum Context: semua level harus mengoper props
<App>
  <Layout user={user}>
    <Sidebar user={user}>
      <Panel user={user}>      // satu-satunya pemakai sebenarnya
        <Isi user={user} />
      </Panel>
    </Sidebar>
  </Layout>
</App>`}</CodeBlock>
      </section>

      <section className="card">
        <h2 className="card-judul">Solusi: Context API</h2>
        <CodeBlock>{`const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() harus di dalam AuthProvider');
  return ctx;
}

// Pakai di komponen mana pun di bawah provider
function Profil() {
  const { user } = useAuth();   // tanpa props sama sekali
  return <p>{user ? user.nama : 'Belum login'}</p>;
}`}</CodeBlock>

        <ul className="prose">
          <li>
            <code className="code-inline">createContext</code> membuat context
            bersama value default-nya.
          </li>
          <li>
            <code className="code-inline">.Provider</code> menyimpan state dan
            membagikannya ke subtree.
          </li>
          <li>
            <code className="code-inline">useContext</code> membacanya di sisi
            consumer.
          </li>
          <li>
            Bungkus <code className="code-inline">value</code> dengan{' '}
            <code className="code-inline">useMemo</code> agar referensinya tidak
            berubah setiap render.
          </li>
        </ul>

        <div className="output output-warn">
          Context bukan pengganti state management library untuk aplikasi besar.
          Perubahan nilai context membuat semua consumer render ulang. Untuk
          state yang sering berubah pada tree besar, lebih baik simpan state
          sedekat mungkin dengan tempat dipakai.
        </div>
      </section>

      <section className="card">
        <h2 className="card-judul">Demo langsung</h2>
        <p className="prose">
          Tombol <strong>Tambah ...</strong> ada di PanelAtas (level 1),
          sedangkan angka total tampil di RingkasanKeranjang (level 3). Keduanya
          berbagi satu state tanpa props apa pun.
        </p>

        <KeranjangProvider>
          <PanelAtas />
          <PanelTengah>
            <PanelBawah />
          </PanelTengah>
        </KeranjangProvider>
      </section>
    </article>
  );
}

export default Topic6;