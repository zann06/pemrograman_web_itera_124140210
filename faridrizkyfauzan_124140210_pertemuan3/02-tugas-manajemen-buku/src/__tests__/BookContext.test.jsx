/**
 * Test integrasi BookContext - CRUD buku melalui provider.
 *
 * Hook `useBooks`Consumer diuji lewat komponen kecil agar yang diuji benar
 * - benar interaksi antara provider dan consumer.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookProvider, useBooks } from '../context/BookContext.jsx';
import { STORAGE_KEY } from '../utils/constants.js';

/** Probe kecil: membaca context lalu memamerkan isinya lewat UI. */
function Probe() {
  const { books, tambahBuku, hapusBuku, toggleFavorit, kosongkan, isiContoh } = useBooks();

  return (
    <div>
      <p data-testid="jumlah">{books.length}</p>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            {b.judul} - {b.status}
            {b.favorit ? ' (favorit)' : ''}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          tambahBuku({ judul: 'Neuromancer', penulis: 'William Gibson', status: 'milik' })
        }
      >
        Tambah
      </button>
      <button type="button" onClick={() => books[0] && hapusBuku(books[0].id)}>
        Hapus pertama
      </button>
      <button type="button" onClick={() => books[0] && toggleFavorit(books[0].id)}>
        Toggle favorit
      </button>
      <button type="button" onClick={isiContoh}>
        Isi contoh
      </button>
      <button type="button" onClick={kosongkan}>
        Kosongkan
      </button>
    </div>
  );
}

const renderProbe = () =>
  render(
    <BookProvider>
      <Probe />
    </BookProvider>,
  );

describe('BookContext', () => {
  it('memulai dengan koleksi kosong', () => {
    renderProbe();

    expect(screen.getByTestId('jumlah')).toHaveTextContent('0');
  });

  it('menambah buku baru', async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'Tambah' }));

    expect(screen.getByTestId('jumlah')).toHaveTextContent('1');
    expect(screen.getByText(/Neuromancer/)).toBeInTheDocument();
  });

  it('menyimpan buku ke localStorage setelah ditambah', async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'Tambah' }));

    const tersimpan = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(tersimpan).toHaveLength(1);
    expect(tersimpan[0].judul).toBe('Neuromancer');
  });

  it('memuat data yang sudah tersimpan saat aplikasi dibuka kembali', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'lama', judul: 'Buku Lama', penulis: 'A', status: 'baca' }]),
    );

    renderProbe();

    expect(screen.getByTestId('jumlah')).toHaveTextContent('1');
    expect(screen.getByText(/Buku Lama/)).toBeInTheDocument();
  });

  it('menghapus buku berdasarkan id', async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'Tambah' }));
    await user.click(screen.getByRole('button', { name: 'Hapus pertama' }));

    expect(screen.getByTestId('jumlah')).toHaveTextContent('0');
  });

  it('menyalakan dan mematikan favorit', async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'Tambah' }));
    await user.click(screen.getByRole('button', { name: 'Toggle favorit' }));
    expect(screen.getByText(/\(favorit\)/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle favorit' }));
    expect(screen.queryByText(/\(favorit\)/)).not.toBeInTheDocument();
  });

  it('mengisi koleksi dengan data contoh', async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'Isi contoh' }));

    expect(Number(screen.getByTestId('jumlah').textContent)).toBeGreaterThan(0);
  });

  it('mengosongkan koleksi sekaligus menghapus key storage', async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole('button', { name: 'Isi contoh' }));
    await user.click(screen.getByRole('button', { name: 'Kosongkan' }));

    expect(screen.getByTestId('jumlah')).toHaveTextContent('0');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('menormalisasi buku yang field-nya tidak lengkap (data lama)', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'x', judul: 'Lama', status: 'entah' }]),
    );

    renderProbe();

    // Status tak dikenal harus jatuh ke default, bukan membuat crash.
    expect(screen.getByText(/Lama - milik/)).toBeInTheDocument();
  });
});