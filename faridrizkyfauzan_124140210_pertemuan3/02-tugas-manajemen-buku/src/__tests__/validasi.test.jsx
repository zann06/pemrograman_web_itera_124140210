/**
 * Test untuk utils/validasi.js - fungsi murni, tanpa perlu render.
 *
 * Ini contoh paling sederhana dari unit test: input -> output.
 */

import { describe, it, expect } from 'vitest';
import { validasiBuku, FORM_KOSONG } from '../utils/validasi.js';

describe('validasiBuku', () => {
  it('menolak judul kosong dengan pesan yang jelas', () => {
    const { valid, errors } = validasiBuku({ ...FORM_KOSONG, judul: '' });

    expect(valid).toBe(false);
    expect(errors.judul).toMatch(/wajib diisi/i);
  });

  it('menolak penulis kosong', () => {
    const { valid, errors } = validasiBuku({
      judul: 'Clean Code',
      penulis: '   ',
    });

    expect(valid).toBe(false);
    expect(errors.penulis).toMatch(/wajib diisi/i);
  });

  it('menolak judul yang hanya berisi spasi', () => {
    const { valid, errors } = validasiBuku({
      judul: '     ',
      penulis: 'Robert C. Martin',
    });

    expect(valid).toBe(false);
    expect(errors.judul).toBeDefined();
  });

  it('menerima data valid dan mengembalikan nilai ternormalisasi', () => {
    const { valid, errors, nilai } = validasiBuku({
      judul: '  Clean Code  ',
      penulis: '  Robert C. Martin ',
      status: 'baca',
      tahun: '2008',
      favorit: 'ya',
    });

    expect(valid).toBe(true);
    expect(errors).toEqual({});
    // Spasi tepi dibuang.
    expect(nilai.judul).toBe('Clean Code');
    expect(nilai.penulis).toBe('Robert C. Martin');
    // String tahun dinormalisasi menjadi number.
    expect(nilai.tahun).toBe(2008);
    expect(nilai.favorit).toBe(true);
  });

  it('menolak tahun di luar rentang wajar', () => {
    const { valid, errors } = validasiBuku({
      judul: 'Buku Lama',
      penulis: 'Anonim',
      tahun: '100',
    });

    expect(valid).toBe(false);
    expect(errors.tahun).toMatch(/tahun harus antara/i);
  });

  it('menganggap tahun kosong sebagai null (opsional)', () => {
    const { valid, nilai } = validasiBuku({
      judul: 'Tanpa Tahun',
      penulis: 'Anonim',
      tahun: '',
    });

    expect(valid).toBe(true);
    expect(nilai.tahun).toBeNull();
  });

  it('menolak status yang tidak dikenal', () => {
    const { valid, errors } = validasiBuku({
      judul: 'Buku',
      penulis: 'Anonim',
      status: 'rusak',
    });

    expect(valid).toBe(false);
    expect(errors.status).toBeDefined();
  });

  it('mengembalikan seluruh error sekaligus, bukan berhenti di error pertama', () => {
    const { valid, errors } = validasiBuku({ ...FORM_KOSONG, status: '' });

    expect(valid).toBe(false);
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(2);
  });
});