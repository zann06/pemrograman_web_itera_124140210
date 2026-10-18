/**
 * Toast - notifikasi singkat di pojok kanan bawah.
 *
 * Anotasi list di-component: `notifs` diisi dari luar, sedangkan komponen ini
 * hanya merender + menjalankan auto-dismiss lewat timer per notifikasi.
 * Timer dibersihkan di dalam useEffect masing-masing item supaya tidak ada
 * memory leak saat notifikasi baru menimpa yang lama.
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

const WARNA = {
  sukses: { bg: 'var(--success-bg)', fg: 'var(--success-fg)' },
  info: { bg: 'var(--info-bg)', fg: 'var(--info-fg)' },
  galat: { bg: 'var(--danger-bg)', fg: 'var(--danger-fg)' },
};

/** Satu baris notifikasi, punya lifecycle timer-nya sendiri. */
function ToastItem({ notif, onSelesai }) {
  useEffect(() => {
    const timer = setTimeout(() => onSelesai(notif.id), notif.durasi ?? 2800);
    // Membersihkan timer bila notif hilang lebih dulu (mis. ditutup manual).
    return () => clearTimeout(timer);
  }, [notif.id, notif.durasi, onSelesai]);

  const warna = WARNA[notif.tipe] ?? WARNA.info;

  return (
    <div
      className="toast"
      style={{ background: warna.bg, color: warna.fg }}
      // role=status membacakan notifikasi ini ke screen reader.
      role="status"
    >
      <span className="toast-teks">{notif.pesan}</span>
      <button
        type="button"
        className="toast-tutup"
        onClick={() => onSelesai(notif.id)}
        aria-label="Tutup notifikasi"
      >
        x
      </button>
    </div>
  );
}

ToastItem.propTypes = {
  notif: PropTypes.shape({
    id: PropTypes.string.isRequired,
    pesan: PropTypes.string.isRequired,
    tipe: PropTypes.oneOf(['sukses', 'info', 'galat']),
    durasi: PropTypes.number,
  }).isRequired,
  onSelesai: PropTypes.func.isRequired,
};

function Toast({ notifs, onSelesai }) {
  if (!notifs || notifs.length === 0) return null;

  return (
    <div className="toast-wrap" aria-live="polite" aria-atomic="false">
      {notifs.map((n) => (
        <ToastItem key={n.id} notif={n} onSelesai={onSelesai} />
      ))}
    </div>
  );
}

Toast.propTypes = {
  notifs: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelesai: PropTypes.func.isRequired,
};

export default Toast;