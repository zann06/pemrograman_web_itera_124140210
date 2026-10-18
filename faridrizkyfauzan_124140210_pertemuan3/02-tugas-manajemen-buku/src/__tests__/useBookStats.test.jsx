/**
 * Test untuk custom hook useBookStats - murni perhitungan, tanpa render DOM.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useBookStats from '../hooks/useBookStats.js';

const BUKU = [
  { id: '1', judul: 'A', penulis: 'Pengarang X', status: 'milik', tahun: 2000, favorit: true, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '2', judul: 'B', penulis: 'Pengarang X', status: 'baca', tahun: 2010, favorit: false, createdAt: '2023-01-01T00:00:00.000Z' },
  { id: '3', judul: 'C', penulis: 'Pengarang Y', status: 'baca', tahun: null, favorit: true, createdAt: '2022-01-01T00:00:00.000Z' },
  { id: '4', judul: 'D', penulis: 'Pengarang Z', status: 'beli', tahun: 2020, favorit: false, createdAt: '2021-01-01T00:00:00.000Z' },
];

describe('useBookStats', () => {
  it('menghitung total dan jumlah per status dengan benar', () => {
    const { result } = renderHook(() => useBookStats(BUKU));

    expect(result.current.total).toBe(4);
    expect(result.current.jumlahPerStatus).toEqual({ milik: 1, baca: 2, beli: 1 });
  });

  it('tidak menghasilkan NaN saat koleksi kosong', () => {
    const { result } = renderHook(() => useBookStats([]));

    expect(result.current.total).toBe(0);
    expect(result.current.persenPerStatus).toEqual({ milik: 0, baca: 0, beli: 0 });
    expect(result.current.rasioDimiliki).toBe(0);
    expect(result.current.tahunRataRata).toBeNull();
  });

  it('toleransi terhadap input null / bukan array', () => {
    const { result } = renderHook(() => useBookStats(undefined));

    expect(result.current.total).toBe(0);
  });

  it('menghitung persentase per status', () => {
    const { result } = renderHook(() => useBookStats(BUKU));

    // 2 dari 4 buku berstatus baca = 50%
    expect(result.current.persenPerStatus.baca).toBe(50);
    // 1 dari 4 = 25%
    expect(result.current.persenPerStatus.milik).toBe(25);
  });

  it('menemukan penulis paling banyak', () => {
    const { result } = renderHook(() => useBookStats(BUKU));

    expect(result.current.jumlahPenulis).toBe(3);
    expect(result.current.penulisTerbanyak[0]).toBe('Pengarang X');
    expect(result.current.penulisTerbanyak[1]).toBe(2);
  });

  it('mengabaikan buku tanpa tahun saat menghitung rata-rata', () => {
    const { result } = renderHook(() => useBookStats(BUKU));

    // (2000 + 2010 + 2020) / 3 = 2010
    expect(result.current.jumlahBertahun).toBe(3);
    expect(result.current.tahunRataRata).toBe(2010);
  });

  it('menemukan buku yang paling lama berstatus sedang baca', () => {
    const { result } = renderHook(() => useBookStats(BUKU));

    expect(result.current.terlama.judul).toBe('C');
  });

  it('menyediakan ringkasan per status siap render', () => {
    const { result } = renderHook(() => useBookStats(BUKU));

    const baca = result.current.ringkasanStatus.find((s) => s.value === 'baca');
    expect(baca).toMatchObject({ label: 'Sedang Baca', jumlah: 2, persen: 50 });
  });
});