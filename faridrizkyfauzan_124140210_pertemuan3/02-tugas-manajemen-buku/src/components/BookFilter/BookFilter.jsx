/**
 * BookFilter - panel pencarian, filter status, dan pengurutan.
 *
 * Komponen reusable: seluruh state filter datang lewat props (diRaise dari
 * `useBookFilter`) sehingga komponen ini tidak tahu-menahu soal penyimpanan.
 */

import PropTypes from 'prop-types';
import {
  OPSI_STATUS,
  OPSI_URUT,
  SEMUA_STATUS,
} from '../../utils/constants.js';
import './BookFilter.css';

function BookFilter({
  cari,
  onCari,
  status,
  onStatus,
  urut,
  onUrut,
  onReset,
  adaFilter,
  jumlahTersaring,
  total,
}) {
  return (
    <section className="card bookfilter" aria-label="Pencarian dan filter buku">
      <div className="bookfilter-baris">
        {/* Pencarian: realtime, mencocokkan judul maupun penulis */}
        <div className="bookfilter-cari">
          <label className="visually-hidden" htmlFor="bookfilter-cari">
            Cari buku berdasarkan judul atau penulis
          </label>
          <span className="bookfilter-ikon" aria-hidden="true">
            /
          </span>
          <input
            id="bookfilter-cari"
            className="input bookfilter-input"
            type="search"
            placeholder="Cari judul atau penulis..."
            value={cari}
            onChange={(e) => onCari(e.target.value)}
          />
          {cari !== '' && (
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-icon bookfilter-bersih"
              onClick={() => onCari('')}
              aria-label="Bersihkan pencarian"
            >
              x
            </button>
          )}
        </div>

        <div className="bookfilter-urut">
          <label className="visually-hidden" htmlFor="bookfilter-urut">
            Urutkan daftar
          </label>
          <select
            id="bookfilter-urut"
            className="select"
            value={urut}
            onChange={(e) => onUrut(e.target.value)}
          >
            {OPSI_URUT.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter status: group of buttons, hanya satu aktif pada satu waktu */}
      <div className="bookfilter-status" role="group" aria-label="Filter status">
        <button
          type="button"
          className={`chip ${status === SEMUA_STATUS ? 'chip-aktif' : ''}`}
          onClick={() => onStatus(SEMUA_STATUS)}
          aria-pressed={status === SEMUA_STATUS}
        >
          Semua
          <span className="chip-count">{total}</span>
        </button>
        {OPSI_STATUS.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`chip ${status === s.value ? 'chip-aktif' : ''}`}
            onClick={() => onStatus(s.value)}
            aria-pressed={status === s.value}
            title={s.deskripsi}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="bookfilter-info" role="status" aria-live="polite">
        Menampilkan <strong>{jumlahTersaring}</strong> dari {total} buku
        {adaFilter && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
            Reset filter
          </button>
        )}
      </p>
    </section>
  );
}

BookFilter.propTypes = {
  cari: PropTypes.string.isRequired,
  onCari: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatus: PropTypes.func.isRequired,
  urut: PropTypes.string.isRequired,
  onUrut: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  adaFilter: PropTypes.bool.isRequired,
  jumlahTersaring: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default BookFilter;