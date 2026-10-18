/**
 * Test untuk custom hook useLocalStorage - dirender lewat renderHook.
 *
 * install: timer asli dipakai, tetapi nilai localStorage bisa diperiksa
 * langsung karena jsdom menyediakan implementasi localStorage.
 */

import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { STORAGE_KEY } from '../utils/constants.js';

describe('useLocalStorage', () => {
  it('mengembalikan nilai awal saat key belum ada', () => {
    const { result } = renderHook(() => useLocalStorage('kunci-kosong', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('menyimpan nilai ke localStorage saat state berubah', () => {
    const { result } = renderHook(() => useLocalStorage('uji-simpan', 0));

    act(() => result.current[1](42));

    expect(result.current[0]).toBe(42);
    expect(window.localStorage.getItem('uji-simpan')).toBe('42');
  });

  it('membaca nilai yang sudah tersimpan dari langkah sebelumnya', () => {
    window.localStorage.setItem('uji-baca', JSON.stringify(['a', 'b']));

    const { result } = renderHook(() => useLocalStorage('uji-baca', []));

    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('memulihkan nilai awal saat JSON rusak (tidak melempar error)', () => {
    window.localStorage.setItem('uji-rusak', '{ ini bukan json');

    const { result } = renderHook(() => useLocalStorage('uji-rusak', ['fallback']));

    expect(result.current[0]).toEqual(['fallback']);
  });

  it('mendukung nilai falsy yang valid seperti 0 dan false', () => {
    window.localStorage.setItem('uji-falsy', '0');

    const { result } = renderHook(() => useLocalStorage('uji-falsy', 99));

    // Kalau memakai `|| default`, nilai 0 akan tertimpa jadi 99.
    expect(result.current[0]).toBe(0);
  });

  it('menerima fungsi updater seperti useState', () => {
    const { result } = renderHook(() => useLocalStorage('uji-updater', { n: 1 }));

    act(() => result.current[1]((prev) => ({ n: prev.n + 1 })));

    expect(result.current[0]).toEqual({ n: 2 });
  });

  it('hapus() mengembalikan state dan/key ke nilai awal', () => {
    const { result } = renderHook(() => useLocalStorage('uji-hapus', []));

    act(() => result.current[1]([1, 2, 3]));
    expect(window.localStorage.getItem('uji-hapus')).not.toBeNull();

    act(() => result.current[2]());

    expect(result.current[0]).toEqual([]);
    expect(window.localStorage.getItem('uji-hapus')).toBeNull();
  });

  it('menyimpan objek array buku dengan benar', () => {
    const buku = [{ id: '1', judul: 'Dune', status: 'baca' }];
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY, []));

    act(() => result.current[1](buku));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual(buku);
  });
});