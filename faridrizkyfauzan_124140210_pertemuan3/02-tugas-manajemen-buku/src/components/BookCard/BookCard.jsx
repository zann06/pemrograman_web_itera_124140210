/**
 * BookCard - satu kartu buku di dalam daftar.
 *
 * purely presentational: seluruh data masuk lewat props dan seluruh aksi
 * dikembalikan lewat callback, sehingga komponen ini tidak memiliki state
 * sendiri (kecuali `editing` disorot dari luar bila diperlukan).
 */

import PropTypes from 'prop-types';
import { classStatus, labelStatus } from '../../utils/constants.js';
import { inisial, potong, warnaAvatar, formatTanggal } from '../../utils/format.js';
import './BookCard.css';

function BookCard({ book, onEdit, onHapus, onToggleFavorit }) {
  const avatar = warnaAvatar(book.penulis);

  return (
    <article className={`bookcard ${book.favorit ? 'bookcard-favorit' : ''}`}>
      <div className="bookcard-avatar" style={{ background: avatar.bg, color: avatar.fg }}>
        {inisial(book.penulis)}
      </div>

      <div className="bookcard-body">
        <div className="bookcard-judulbaris">
          <h3 className="bookcard-judul" title={book.judul}>
            {book.judul}
          </h3>
          <button
            type="button"
            className={`bookcard-favorit ${book.favorit ? 'nyala' : ''}`}
            onClick={() => onToggleFavorit(book.id)}
            aria-pressed={Boolean(book.favorit)}
            aria-label={
              book.favorit
                ? `Hapus ${book.judul} dari favorit`
                : `Tandai ${book.judul} sebagai favorit`
            }
            title={book.favorit ? 'Hapus dari favorit' : 'Tandai favorit'}
          >
            {book.favorit ? '*' : '+'}
          </button>
        </div>

        <p className="bookcard-penulis">{book.penulis}</p>

        <div className="bookcard-meta">
          <span className={`badge ${classStatus(book.status)}`}>
            {labelStatus(book.status)}
          </span>
          {book.tahun && <span className="bookcard-tahun">{book.tahun}</span>}
          <span className="bookcard-tanggal" title={book.createdAt}>
            {formatTanggal(book.createdAt)}
          </span>
        </div>

        {book.catatan && (
          <p className="bookcard-catatan">{potong(book.catatan, 110)}</p>
        )}
      </div>

      <div className="bookcard-aksi">
        {/* aria-label dipakai, bukan teks tambahan yang disembunyikan, supaya
            accessible name setiap tombol unik dan tidak mengulang teks judul
            yang sudah tampil di kartu. */}
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onEdit(book)}
          aria-label={`Edit ${book.judul}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm bookcard-hapus"
          onClick={() => onHapus(book)}
          aria-label={`Hapus ${book.judul}`}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    judul: PropTypes.string.isRequired,
    penulis: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    tahun: PropTypes.number,
    favorit: PropTypes.bool,
    catatan: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onHapus: PropTypes.func.isRequired,
  onToggleFavorit: PropTypes.func.isRequired,
};

export default BookCard;