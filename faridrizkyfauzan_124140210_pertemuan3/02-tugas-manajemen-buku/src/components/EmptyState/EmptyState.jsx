/**
 * EmptyState - komponen generik untuk kondisi "tidak ada data".
 *
 * Dipakai di BookList (belum ada buku / tidak ada hasil filter) dan di halaman
 * Statistik. Karena menerima `ikon`, `judul`, `pesan`, dan `aksi` sebagai prop,
 * satu komponen ini bisa dipakai di banyak konteks berbeda.
 */

import PropTypes from 'prop-types';
import './EmptyState.css';

function EmptyState({ ikon = null, judul, pesan = null, aksi = null }) {
  return (
    <div className="empty">
      {ikon && (
        <span className="empty-ikon" aria-hidden="true">
          {ikon}
        </span>
      )}
      <p className="empty-judul">{judul}</p>
      {pesan && <p className="empty-pesan">{pesan}</p>}
      {aksi && (
        <button type="button" className="btn btn-outline btn-sm" onClick={aksi.onClick}>
          {aksi.label}
        </button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  ikon: PropTypes.string,
  judul: PropTypes.string.isRequired,
  pesan: PropTypes.string,
  aksi: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};

export default EmptyState;