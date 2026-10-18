/**
 * ConfirmDialog - dialog konfirmasi untuk aksi merusak (hapus / reset).
 *
 * Dua teachable React sekaligus:
 *   1. useEffect - memasang listener tombol Escape dan mengelola fokus.
 *   2. Conditional rendering - dirender hanya saat `terbuka` true.
 *
 * Catatan: body memakai <div> + role="dialog" (bukan <dialog> native) supaya
 * styling konsisten lintas browser dan mudah diuji dengan RTL.
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ConfirmDialog.css';

function ConfirmDialog({
  terbuka,
  judul,
  pesan,
  labelKonfirmasi = 'Hapus',
  onKonfirmasi,
  onBatal,
}) {
  const refDialog = useRef(null);
  const refTombol = useRef(null);

  useEffect(() => {
    if (!terbuka) return undefined;

    // 1. Escape menutup dialog.
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onBatal();
    };
    document.addEventListener('keydown', onKeyDown);

    // 2. Fokus otomatis ke tombol utama supaya keyboard user tidak "hilang".
    refTombol.current?.focus();

    // 3. Cegah halaman di belakang ikut ter-scroll.
    const overflowAwal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Cleanup: listener dan style body wajib dikembalikan saat ditutup,
    // jika tidak dialog berikutnya akan menumpuk event listener.
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflowAwal;
    };
  }, [terbuka, onBatal]);

  if (!terbuka) return null;

  return (
    <div
      className="dialog-backdrop"
      onClick={onBatal}
      role="presentation"
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-judul"
        ref={refDialog}
        // onClick di/backdrop dihentikan agar klik di dalam dialog tidak
        // ikut menutup dialog.
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="dialog-judul" id="dialog-judul">
          {judul}
        </h3>
        <p className="dialog-pesan">{pesan}</p>
        <div className="dialog-aksi">
          <button type="button" className="btn btn-outline" onClick={onBatal}>
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onKonfirmasi}
            ref={refTombol}
          >
            {labelKonfirmasi}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  terbuka: PropTypes.bool.isRequired,
  judul: PropTypes.string.isRequired,
  pesan: PropTypes.string.isRequired,
  labelKonfirmasi: PropTypes.string,
  onKonfirmasi: PropTypes.func.isRequired,
  onBatal: PropTypes.func.isRequired,
};

export default ConfirmDialog;