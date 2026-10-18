/**
 * Stats - halaman statistik koleksi.
 *
 * Seluruh angka dihitung oleh custom hook `useBookStats` dengan memoization,
 * jadi halaman ini hanya fokus pada presentasi.
 */

import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext.jsx';
import useBookStats from '../../hooks/useBookStats.js';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { formatTanggal } from '../../utils/format.js';
import './Stats.css';

/** Kartu angka besar di bagian atas. */
function StatCard({ label, nilai, keterangan = null }) {
  return (
    <div className="card statcard">
      <span className="statcard-label">{label}</span>
      <strong className="statcard-nilai">{nilai}</strong>
      {keterangan && <span className="statcard-ket">{keterangan}</span>}
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  nilai: PropTypes.node.isRequired,
  keterangan: PropTypes.string,
};

function Stats() {
  const { books } = useBooks();
  const s = useBookStats(books);

  if (books.length === 0) {
    return (
      <div className="page">
        <h1 className="page-judul">Statistik</h1>
        <EmptyState
          judul="Belum ada data untuk dianalisis"
          pesan="Tambahkan beberapa buku terlebih dahulu, lalu kembali ke halaman ini untuk melihat statistiknya."
        />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-judul">Statistik</h1>
        <p className="page-subjudul">
          Ringkasan koleksi dari {s.total} buku yang tersimpan di browser Anda.
        </p>
      </header>

      {/* --- Kartu utama --- */}
      <div className="stats-grid">
        <StatCard label="Total buku" nilai={s.total} />
        <StatCard label="Penulis berbeda" nilai={s.jumlahPenulis} />
        <StatCard
          label="Buku dimiliki"
          nilai={s.jumlahPerStatus.milik}
          keterangan={`${s.rasioDimiliki}% dari koleksi`}
        />
        <StatCard
          label="Rata-rata tahun"
          nilai={s.tahunRataRata ?? '-'}
          keterangan={s.jumlahBertahun ? `dari ${s.jumlahBertahun} buku` : 'belum ada data'}
        />
      </div>

      {/* --- Distribusi per status --- */}
      <section className="card stats-panel">
        <h2 className="section-title">Distribusi per status</h2>

        {s.ringkasanStatus.map((r) => (
          <div key={r.value} className="stats-bar-row">
            <div className="stats-bar-kepala">
              <span className={`badge ${r.className}`}>{r.label}</span>
              <span className="stats-bar-angka">
                {r.jumlah} buku <span className="muted">({r.persen}%)</span>
              </span>
            </div>
            <div
              className="stats-bar-track"
              role="progressbar"
              aria-valuenow={r.persen}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Persentase buku ${r.label}`}
            >
              <div
                className={`stats-bar-fill stats-bar-${r.value}`}
                style={{ width: `${r.persen}%` }}
              />
            </div>
            <p className="stats-bar-ket">{r.deskripsi}</p>
          </div>
        ))}
      </section>

      <div className="stats-dua-kolom">
        {/* --- Penulis paling banyak --- */}
        <section className="card stats-panel">
          <h2 className="section-title">Penulis paling banyak</h2>
          {s.penulisTerbanyak ? (
            <div className="stats-top">
              <div className="stats-top-avatar">
                {s.penulisTerbanyak[0].slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="stats-top-nama">{s.penulisTerbanyak[0]}</p>
                <p className="muted">{s.penulisTerbanyak[1]} buku dalam koleksi</p>
              </div>
            </div>
          ) : (
            <p className="muted">Belum ada data penulis.</p>
          )}
        </section>

        {/* --- Buku terlama dibaca --- */}
        <section className="card stats-panel">
          <h2 className="section-title">Sedang dibaca terlama</h2>
          {s.terlama ? (
            <>
              <p className="stats-terlama-judul">{s.terlama.judul}</p>
              <p className="muted">
                {s.terlama.penulis} - masuk daftar sejak{' '}
                {formatTanggal(s.terlama.createdAt)}
              </p>
            </>
          ) : (
            <p className="muted">Tidak ada buku berstatus "Sedang Baca".</p>
          )}
        </section>
      </div>

      <p className="muted stats-catatan">
        Catatan: seluruh perhitungan berjalan di browser, tidak ada data yang
        dikirim ke server. Saat ini {s.jumlahFavorit} buku ditandai sebagai
        favorit.
      </p>
    </div>
  );
}

export default Stats;