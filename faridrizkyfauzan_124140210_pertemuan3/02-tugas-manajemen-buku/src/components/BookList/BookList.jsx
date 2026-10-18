/**
 * BookList - daftar hasil filter.
 *
 * Mendemonstrasikan rendering list dengan `key` yang stabil.
 * Key memakai `book.id`, bukan indeks array: bila buku dihapus di tengah
 * daftar, React tidak salah mencocokkan komponen lama dengan data baru.
 * Memakai indeks sebagai key membuat input di dalam kartu kehilangan fokus
 * setiap kali daftar berubah urutan.
 */

import PropTypes from 'prop-types';
import BookCard from '../BookCard/BookCard.jsx';
import EmptyState from '../EmptyState/EmptyState.jsx';
import './BookList.css';

function BookList({
  books,
  total,
  adaFilter,
  onEdit,
  onHapus,
  onToggleFavorit,
  onResetFilter = null,
  onIsiContoh = null,
}) {
  // Kasus 1: koleksi benar-benar kosong.
  if (total === 0) {
    return (
      <EmptyState
        judul="Koleksi masih kosong"
        pesan="Tambahkan buku pertama Anda lewat form di samping, atau isi dengan data contoh untuk menjelajah aplikasi."
        aksi={onIsiContoh ? { label: 'Isi data contoh', onClick: onIsiContoh } : null}
      />
    );
  }

  // Kasus 2: ada buku, tetapi filter/pencarian tidak menemukan yang cocok.
  if (books.length === 0) {
    return (
      <EmptyState
        judul="Tidak ada buku yang cocok"
        pesan="Coba ubah kata kunci pencarian atau pilih filter status yang lain."
        aksi={
          onResetFilter && adaFilter
            ? { label: 'Reset filter', onClick: onResetFilter }
            : null
        }
      />
    );
  }

  return (
    <div className="booklist">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onHapus={onHapus}
          onToggleFavorit={onToggleFavorit}
        />
      ))}
    </div>
  );
}

BookList.propTypes = {
  /** Buku hasil filter - bisa kosong meskipun `total` > 0. */
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Jumlah buku sebelum difilter, dipakai untuk membedakan jenis empty state. */
  total: PropTypes.number.isRequired,
  adaFilter: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onHapus: PropTypes.func.isRequired,
  onToggleFavorit: PropTypes.func.isRequired,
  onResetFilter: PropTypes.func,
  onIsiContoh: PropTypes.func,
};

export default BookList;