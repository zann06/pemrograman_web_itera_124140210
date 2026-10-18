/**
 * useToast - custom hook untuk manages notifikasi singkat.
 *
 * Menghasilkan antrean notifikasi + fungsi tampil/sembunyi. Dipisah dari
 * komponen `Toast` supaya state notifikasi tidak perlu di-lift ke App.
 *
 * Catatan: masa berlaku notifikasi ditangani di dalam komponen ToastItem
 * (setTimeout per item), bukan di hook ini, supaya tidak ada satu timer
 * global yang competes dengan render.
 */

import { useCallback, useRef, useState } from 'react';

/** Batas notifikasi yang tampil bersamaan, supaya tidak memenuhi layar. */
const MAKS = 3;

export const useToast = () => {
  const [notifs, setNotifs] = useState([]);
  // Ref dipakai untuk id urut tanpa menambah re-render.
  const urutRef = useRef(0);

  /** Menutup notifikasi berdasarkan id. */
  const tutup = useCallback((id) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /** Menampilkan notifikasi baru. Mengembalikan id-nya. */
  const tampil = useCallback(
    (pesan, tipe = 'sukses', durasi) => {
      urutRef.current += 1;
      const id = `notif-${urutRef.current}`;
      setNotifs((prev) => [...prev, { id, pesan, tipe, durasi }].slice(-MAKS));
      return id;
    },
    [],
  );

  return { notifs, tampil, tutup };
};

export default useToast;