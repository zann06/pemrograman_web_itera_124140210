/**
 * BookForm - form terstruktur untuk menambah & mengedit buku.
 *
 * Konsep React yang dipakai:
 *   - Controlled component: setiap input punya `value` dari state dan
 *     `onChange` yang memanggil setter. Sumber kebenaran ada di satu tempat.
 *   - Conditional rendering: pesan error hanya dirender ketika field tersebut
 *     sudah pernah diisi lalu dikosongkan (pola `touched`).
 *   - Aksesibilitas: `aria-invalid`, `aria-describedby`, dan `<label htmlFor>`
 *    connecting label dengan input yang benar.
 */

import { useId, useState } from 'react';
import PropTypes from 'prop-types';
import { OPSI_STATUS } from '../../utils/constants.js';
import { FORM_KOSONG, validasiBuku } from '../../utils/validasi.js';
import './BookForm.css';

/** Menampilkan pesan error di bawah sebuah field. */
function PesanError({ id, pesan }) {
  if (!pesan) return null;
  return (
    <p className="field-error" id={id} role="alert">
      <span aria-hidden="true">!</span>
      {pesan}
    </p>
  );
}

PesanError.propTypes = {
  id: PropTypes.string.isRequired,
  pesan: PropTypes.string,
};

function BookForm({
  mode = 'tambah',
  nilaiAwal = FORM_KOSONG,
  onSubmit,
  onBatal = null,
}) {
  const idJudul = useId();
  const idPenulis = useId();
  const idStatus = useId();
  const idTahun = useId();
  const idCatatan = useId();

  const [values, setValues] = useState({ ...FORM_KOSONG, ...nilaiAwal });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const sedangEdit = mode === 'edit';

  /** Mengganti satu field + langsung menandai field tersebut sudah disentuh. */
  const ubah = (field) => (e) => {
    const nilai = e.target.value;
    setValues((v) => ({ ...v, [field]: nilai }));
    // Validasi ulang hanya field ini supaya feedback terasa responsif.
    const hasil = validasiBuku({ ...values, [field]: nilai });
    setErrors((prev) => ({ ...prev, [field]: hasil.errors[field] }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /** Menandai field sebagai disentuh saat blur (mis. fokus pindah). */
  const blur = (field) => () => {
    const hasil = validasiBuku(values);
    setErrors((prev) => ({ ...prev, [field]: hasil.errors[field] }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /** Checkbox tidak punya event `value`, jadi ditangani terpisah. */
  const ubahFavorit = (e) => {
    setValues((v) => ({ ...v, favorit: e.target.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { valid, errors: err, nilai } = validasiBuku(values);
    setErrors(err);

    if (!valid) {
      // Tandai semua field wajib supaya pengguna tahu apa yang perlu diperbaiki.
      setTouched({ judul: true, penulis: true, status: true });
      return;
    }

    onSubmit(nilai);
    // Reset ke kondisi awal supaya form siap untuk input berikutnya.
    setValues({ ...FORM_KOSONG });
    setErrors({});
    setTouched({});
  };

  const batal = () => {
    setValues({ ...FORM_KOSONG, ...nilaiAwal });
    setErrors({});
    setTouched({});
    if (onBatal) onBatal();
  };

  /** Helper: error hanya tampil bila field sudah disentuh. */
  const err = (field) => (touched[field] ? errors[field] : undefined);

  return (
    <section className="card bookform" aria-labelledby="bookform-judul">
      <div className="bookform-header">
        <h2 className="section-title" id="bookform-judul">
          {sedangEdit ? 'Edit Buku' : 'Tambah Buku'}
        </h2>
        {sedangEdit && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={batal}
          >
            Batal edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* --- Judul --- */}
        <div className="field">
          <label className="label" htmlFor={idJudul}>
            Judul Buku <span aria-hidden="true">*</span>
          </label>
          <input
            id={idJudul}
            className="input"
            type="text"
            placeholder="Contoh: Clean Code"
            value={values.judul}
            onChange={ubah('judul')}
            onBlur={blur('judul')}
            aria-invalid={Boolean(err('judul'))}
            aria-describedby={err('judul') ? `${idJudul}-err` : undefined}
            required
          />
          <span id={`${idJudul}-err`}>
            <PesanError id={`${idJudul}-err`} pesan={err('judul')} />
          </span>
        </div>

        {/* --- Penulis --- */}
        <div className="field">
          <label className="label" htmlFor={idPenulis}>
            Penulis <span aria-hidden="true">*</span>
          </label>
          <input
            id={idPenulis}
            className="input"
            type="text"
            placeholder="Contoh: Robert C. Martin"
            value={values.penulis}
            onChange={ubah('penulis')}
            onBlur={blur('penulis')}
            aria-invalid={Boolean(err('penulis'))}
            aria-describedby={err('penulis') ? `${idPenulis}-err` : undefined}
            required
          />
          <span id={`${idPenulis}-err`}>
            <PesanError id={`${idPenulis}-err`} pesan={err('penulis')} />
          </span>
        </div>

        {/* --- Status --- */}
        <div className="field">
          <label className="label" htmlFor={idStatus}>
            Status <span aria-hidden="true">*</span>
          </label>
          <select
            id={idStatus}
            className="select"
            value={values.status}
            onChange={ubah('status')}
            aria-invalid={Boolean(err('status'))}
            required
          >
            {OPSI_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label} - {s.deskripsi}
              </option>
            ))}
          </select>
          <PesanError id={`${idStatus}-err`} pesan={err('status')} />
        </div>

        {/* --- Tahun (opsional) --- */}
        <div className="field">
          <label className="label" htmlFor={idTahun}>
            Tahun Terbit <span className="label-optional">(opsional)</span>
          </label>
          <input
            id={idTahun}
            className="input"
            type="number"
            inputMode="numeric"
            placeholder="Contoh: 2008"
            value={values.tahun ?? ''}
            onChange={ubah('tahun')}
            onBlur={blur('tahun')}
            aria-invalid={Boolean(err('tahun'))}
          />
          <PesanError id={`${idTahun}-err`} pesan={err('tahun')} />
        </div>

        {/* --- Catatan (opsional) --- */}
        <div className="field">
          <label className="label" htmlFor={idCatatan}>
            Catatan <span className="label-optional">(opsional)</span>
          </label>
          <textarea
            id={idCatatan}
            className="textarea"
            rows={3}
            placeholder="Catatan singkat tentang buku ini"
            value={values.catatan}
            onChange={ubah('catatan')}
            onBlur={blur('catatan')}
            aria-invalid={Boolean(err('catatan'))}
          />
          <PesanError id={`${idCatatan}-err`} pesan={err('catatan')} />
        </div>

        {/* --- Favorit (controlled checkbox) --- */}
        <label className="bookform-check">
          <input
            type="checkbox"
            checked={values.favorit}
            onChange={ubahFavorit}
          />
          <span>Tandai sebagai favorit</span>
        </label>

        <div className="bookform-aksi">
          <button type="submit" className="btn btn-primary">
            {sedangEdit ? 'Simpan Perubahan' : 'Tambah Buku'}
          </button>
          {sedangEdit && (
            <button type="button" className="btn btn-outline" onClick={batal}>
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

BookForm.propTypes = {
  /** 'tambah' menampilkan form kosong, 'edit' mengisi data yang sedang diedit. */
  mode: PropTypes.oneOf(['tambah', 'edit']),
  nilaiAwal: PropTypes.objectOf(PropTypes.any),
  onSubmit: PropTypes.func.isRequired,
  onBatal: PropTypes.func,
};

export default BookForm;