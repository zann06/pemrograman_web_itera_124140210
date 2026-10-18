/**
 * Home - halaman utama: form, filter, dan daftar buku.
 *
 * Komposisi:
 *   BookForm   (kiri)  - tambah & edit
 *   BookFilter (kanan) - pencarian + filter status + sorting
 *   BookList             - hasil filter
 *
 * State form "edit" (buku yang sedang diedit) disimpan di halaman ini,
 * bukan di context, karena hanya Home yang membutuhkannya.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext.jsx';
import useBookFilter from '../../hooks/useBookFilter.js';
import useBookStats from '../../hooks/useBookStats.js';
import BookForm from '../../components/BookForm/BookForm.jsx';
import BookFilter from '../../components/BookFilter/BookFilter.jsx';
import BookList from '../../components/BookList/BookList.jsx';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx';
import './Home.css';

function Home({ notif }) {
  const { books, tambahBuku, perbaruiBuku, hapusBuku, toggleFavorit, kosongkan, isiContoh } =
    useBooks();

  const filter = useBookFilter(books);
  const stats = useBookStats(books);

  // Buku yang sedang diedit, null berarti mode tambah.
  const [editing, setEditing] = useState(null);
  // Buku yang menunggu konfirmasi hapus.
  const [kandidatHapus, setKandidatHapus] = useState(null);
  // Menyetel ulang koleksi juga butuh konfirmasi, karena affects seluruh data tersimpan.
  const [konfirmasiReset, setKonfirmasiReset] = useState(false);

  /** Membuka mode edit: isi form dengan data buku terpilih. */
  const mulaiEdit = (book) => {
    setEditing(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (nilai) => {
    if (editing) {
      perbaruiBuku(editing.id, nilai);
      notif.tampil(`Buku "${nilai.judul}" diperbarui.`, 'sukses');
      setEditing(null);
    } else {
      tambahBuku(nilai);
      notif.tampil(`Buku "${nilai.judul}" ditambahkan.`, 'sukses');
    }
  };

  const konfirmasiHapus = () => {
    if (kandidatHapus) {
      hapusBuku(kandidatHapus.id);
      notif.tampil(`Buku "${kandidatHapus.judul}" dihapus.`, 'info');
      // Kalau buku yang sedang diedit ikut terhapus, tutup mode edit.
      if (editing?.id === kandidatHapus.id) setEditing(null);
    }
    setKandidatHapus(null);
  };

  const konfirmasiKosongkan = () => {
    kosongkan();
    setEditing(null);
    setKonfirmasiReset(false);
    notif.tampil('Seluruh koleksi dihapus.', 'info');
  };

  return (
    <div className="home">
      {/* Ringkasan singkat - dihitung sekali oleh hook useBookStats */}
      <div className="home-ringkas">
        <div className="home-ringkas-item">
          <span className="home-ringkas-label">Total buku</span>
          <strong className="home-ringkas-nilai">{stats.total}</strong>
        </div>
        {stats.ringkasanStatus.map((s) => (
          <div key={s.value} className="home-ringkas-item">
            <span className="home-ringkas-label">{s.label}</span>
            <strong className="home-ringkas-nilai">{s.jumlah}</strong>
          </div>
        ))}
        <div className="home-ringkas-item">
          <span className="home-ringkas-label">Favorit</span>
          <strong className="home-ringkas-nilai">{stats.jumlahFavorit}</strong>
        </div>
      </div>

      {editing && (
        <p className="home-edit-banner" role="status">
          Sedang mengedit <strong>{editing.judul}</strong>
        </p>
      )}

      <div className="home-grid">
        <div className="home-kiri">
          <BookForm
            key={editing ? editing.id : 'tambah'}
            mode={editing ? 'edit' : 'tambah'}
            nilaiAwal={editing ?? undefined}
            onSubmit={handleSubmit}
            onBatal={() => setEditing(null)}
          />
          {stats.total > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm home-reset"
              onClick={() => setKonfirmasiReset(true)}
            >
              Kosongkan koleksi
            </button>
          )}
        </div>

        <div className="home-kanan">
          <BookFilter
            cari={filter.cari}
            onCari={filter.setCari}
            status={filter.status}
            onStatus={filter.setStatus}
            urut={filter.urut}
            onUrut={filter.setUrut}
            onReset={filter.reset}
            adaFilter={filter.adaFilter}
            jumlahTersaring={filter.jumlahTersaring}
            total={filter.total}
          />

          <BookList
            books={filter.hasil}
            total={filter.total}
            adaFilter={filter.adaFilter}
            onEdit={mulaiEdit}
            onHapus={setKandidatHapus}
            onToggleFavorit={(id) => {
              toggleFavorit(id);
              notif.tampil('Status favorit diperbarui.', 'info');
            }}
            onResetFilter={filter.reset}
            onIsiContoh={() => {
              isiContoh();
              notif.tampil('Data contoh dimuat.', 'sukses');
            }}
          />
        </div>
      </div>

      <ConfirmDialog
        terbuka={Boolean(kandidatHapus)}
        judul="Hapus buku?"
        pesan={`Buku "${kandidatHapus?.judul ?? ''}" akan dihapus permanen dari koleksi.`}
        labelKonfirmasi="Hapus"
        onKonfirmasi={konfirmasiHapus}
        onBatal={() => setKandidatHapus(null)}
      />

      <ConfirmDialog
        terbuka={konfirmasiReset}
        judul="Kosongkan koleksi?"
        pesan={`Seluruh ${stats.total} buku akan dihapus dari penyimpanan lokal. Tindakan ini tidak bisa dibatalkan.`}
        labelKonfirmasi="Kosongkan"
        onKonfirmasi={konfirmasiKosongkan}
        onBatal={() => setKonfirmasiReset(false)}
      />
    </div>
  );
}

Home.propTypes = {
  /** Objek dari useToast, diteruskan agar notifikasi bisa muncul dari Home. */
  notif: PropTypes.shape({
    tampil: PropTypes.func.isRequired,
    tutup: PropTypes.func.isRequired,
    notifs: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Home;