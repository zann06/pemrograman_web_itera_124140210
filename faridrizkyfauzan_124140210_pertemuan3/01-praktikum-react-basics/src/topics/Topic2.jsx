/**
 * Topik 2 - Components & Props.
 *
 * Demo interaktif: komponen Tombol menerima props, Komponen Kartu memakai
 * children, dan spread props dipakai untuk set default.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import CodeBlock from '../components/CodeBlock.jsx';

/** Komponen paling sederhana: menerima props dan merendernya. */
function Tombol({ label, warna, onKlik }) {
  return (
    <button type="button" className={`btn ${warna}`} onClick={onKlik}>
      {label}
    </button>
  );
}

Tombol.propTypes = {
  label: PropTypes.string.isRequired,
  warna: PropTypes.string,
  onKlik: PropTypes.func,
};

const WARNA_BTN = {
  primer: 'btn-primary',
  aksen: 'btn-aksen',
  netral: '',
};

/** Komponen dengan children: isi konten sendiri dari luar. */
function Kartu({ judul, children, badge = 'baru' }) {
  return (
    <div className="card" style={{ marginTop: '0.7rem' }}>
      <div className="demo" style={{ marginBottom: '0.4rem' }}>
        <span className="badge">{badge}</span>
        <h2 className="card-judul" style={{ margin: 0 }}>
          {judul}
        </h2>
      </div>
      {children}
    </div>
  );
}

Kartu.propTypes = {
  judul: PropTypes.string.isRequired,
  children: PropTypes.node,
  badge: PropTypes.string,
};

const DAFTAR_BUKU = [
  { id: 1, judul: 'Dune', penulis: 'Frank Herbert', tahun: 1965 },
  { id: 2, judul: 'Solaris', penulis: 'Stanislaw Lem', tahun: 1961 },
  { id: 3, judul: 'Neuromancer', penulis: 'William Gibson', tahun: 1984 },
];

/** Komponen yang me-mapping data dan membuat kartu per item. */
function DaftarBuku({ buku, klik }) {
  return (
    <div className="demo-kolom" style={{ marginTop: '0.7rem' }}>
      {buku.map((b) => (
        <button
          key={b.id}
          type="button"
          className="btn"
          style={{ width: '100%', justifyContent: 'space-between' }}
          onClick={() => klik(b)}
        >
          <span>
            {b.judul} <span className="muted">- {b.penulis}</span>
          </span>
          <span className="badge">{b.tahun}</span>
        </button>
      ))}
    </div>
  );
}

DaftarBuku.propTypes = {
  buku: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      judul: PropTypes.string.isRequired,
      penulis: PropTypes.string.isRequired,
      tahun: PropTypes.number.isRequired,
    }),
  ).isRequired,
  klik: PropTypes.func.isRequired,
};

function Topic2() {
  const [dipilih, setDipilih] = useState(null);
  const [jumlah, setJumlah] = useState(0);

  return (
    <article>
      <header>
        <p className="topik-eyebrow">Topik 2</p>
        <h1 className="topik-judul">Components &amp; Props</h1>
        <p className="topik-deskripsi">
          Komponen adalah unit yang bisa dipakai ulang. Props adalah cara
          orang tua mengirim data ke bawah ke komponen anak.
        </p>
      </header>

      <section className="card">
        <h2 className="card-judul">Komponen dan props</h2>
        <p className="prose">
          Komponen pada React adalah fungsi yang mengembalikan JSX. Props
          diperlakukan seperti argumen fungsi: dikirim dari atas, hanya bisa
          dibaca oleh komponen anak (immutable).
        </p>
        <CodeBlock>{`// Komponen anak menerima props
function Tombol({ label, warna, onKlik }) {
  return <button className={\`btn \${warna}\`} onClick={onKlik}>{label}</button>;
}

// Parent mengirim props ke anak
function Aplikasi() {
  return <Tombol label="Kirim" warna="btn-primary" onKlik={() => alert('halo')} />;
}`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          children
        </h2>
        <p className="prose">
          Props khusus bernama <code className="code-inline">children</code>{' '}
          dipakai untuk menyisipkan konten di dalam komponen, membuat
          komponen menjadi "wadah" yang bisa diisi bebas.
        </p>
        <CodeBlock>{`function Kartu({ judul, children }) {
  return (
    <div className="card">
      <h2>{judul}</h2>
      {children}   {/* isi dari parent masuk di sini */}
    </div>
  );
}

// Pemakaian
<Kartu judul="Statistik">
  <p>Isi apa pun: teks, elemen, atau komponen lain.</p>
</Kartu>`}</CodeBlock>

        <h2 className="card-judul" style={{ marginTop: '1rem' }}>
          Merender list dengan key
        </h2>
        <CodeBlock>{`{buku.map((b) => (
  <li key={b.id}>{b.judul}</li>
))}`}</CodeBlock>
        <div className="output output-warn">
          key wajib diisi dan harus unik di antara saudara. Jangan pakai index
          array sebagai key kalau urutan list bisa berubah - React akan salah
          mencocokkan komponen lama dengan data baru.
        </div>
      </section>

      {/* --- Demo --- */}
      <section className="card">
        <h2 className="card-judul">Demo: kirim props ke bawah</h2>
        <p className="prose">
          Tombol di bawah adalah komponen <code className="code-inline">Tombol</code> yang
          sama, dipakai berulang kali dengan props berbeda.
        </p>

        <div className="demo">
          <Tombol
            label="Tambah 1"
            warna={WARNA_BTN.primer}
            onKlik={() => setJumlah((n) => n + 1)}
          />
          <Tombol
            label="Tambah 10"
            warna={WARNA_BTN.aksen}
            onKlik={() => setJumlah((n) => n + 10)}
          />
          <Tombol label="Reset" onKlik={() => setJumlah(0)} />
        </div>

        <div className="output output-ok">
          {`state "jumlah" di parent  : ${jumlah}\nprops yang dikirim           : label + warna + onKlik`}
        </div>

        <Kartu judul="props.children" badge="children">
          <p className="prose">
            Teks di paragraf ini bukan bagian dari komponen <code>Kartu</code>. Teks ini
            dikirim sebagai <code>children</code> dan dirender tepat di antara{' '}
            <code>{'{children}'}</code>.
          </p>
        </Kartu>
      </section>

      <section className="card">
        <h2 className="card-judul">Demo: list dengan key</h2>
        <DaftarBuku buku={DAFTAR_BUKU} klik={setDipilih} />

        {dipilih ? (
          <div className="output output-ok">
            {`Dipilih -> key: ${dipilih.id}\n  ${dipilih.judul} oleh ${dipilih.penulis} (${dipilih.tahun})`}
          </div>
        ) : (
          <div className="output">Klik salah satu buku di atas...</div>
        )}
      </section>
    </article>
  );
}

export default Topic2;