/**
 * Test pencarian & filter:Bookmark - alur pengguna mengetik lalu memfilter.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookFilter from '../components/BookFilter/BookFilter.jsx';
import BookList from '../components/BookList/BookList.jsx';
import { useBookFilter } from '../hooks/useBookFilter.js';

const BUKU = [
  { id: '1', judul: 'Dune', penulis: 'Frank Herbert', status: 'milik', tahun: 1965, createdAt: '2024-03-01T00:00:00.000Z' },
  { id: '2', judul: 'Solaris', penulis: 'Stanisław Lem', status: 'baca', tahun: 1961, createdAt: '2024-02-01T00:00:00.000Z' },
  { id: '3', judul: 'Neuromancer', penulis: 'William Gibson', status: 'beli', tahun: 1984, createdAt: '2024-01-01T00:00:00.000Z' },
];

/** Menggabungkan hook filter dengan daftar agar bisa diuji sebagai satu unit. */
function FilterDemo({ books = BUKU }) {
  const f = useBookFilter(books);

  return (
    <div>
      <BookFilter
        cari={f.cari}
        onCari={f.setCari}
        status={f.status}
        onStatus={f.setStatus}
        urut={f.urut}
        onUrut={f.setUrut}
        onReset={f.reset}
        adaFilter={f.adaFilter}
        jumlahTersaring={f.jumlahTersaring}
        total={f.total}
      />
      <BookList
        books={f.hasil}
        total={f.total}
        adaFilter={f.adaFilter}
        onEdit={vi.fn()}
        onHapus={vi.fn()}
        onToggleFavorit={vi.fn()}
        onResetFilter={f.reset}
      />
    </div>
  );
}

describe('useBookFilter + BookFilter + BookList', () => {
  it('menampilkan seluruh buku saat belum ada filter', () => {
    render(<FilterDemo />);

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('Solaris')).toBeInTheDocument();
    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
  });

  it('mencari buku berdasarkan judul', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.type(screen.getByLabelText(/cari buku/i), 'dune');

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.queryByText('Solaris')).not.toBeInTheDocument();
  });

  it('mencari buku berdasarkan nama penulis', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.type(screen.getByLabelText(/cari buku/i), 'gibson');

    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
  });

  it('mengabaikan huruf besar/kecil saat mencari', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.type(screen.getByLabelText(/cari buku/i), 'NEUROMANCER');

    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
  });

  it('memfilter buku berdasarkan status', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.click(screen.getByRole('button', { name: /^sedang baca$/i }));

    expect(screen.getByText('Solaris')).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
  });

  it('menampilkan pesan saat pencarian tidak menemukan hasil', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.type(screen.getByLabelText(/cari buku/i), 'zzzz');

    expect(screen.getByText(/tidak ada buku yang cocok/i)).toBeInTheDocument();
  });

  it('mengembalikan semua hasil saat filter di-reset', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.type(screen.getByLabelText(/cari buku/i), 'dune');
    await user.click(screen.getByRole('button', { name: /reset filter/i }));

    expect(screen.getByText('Solaris')).toBeInTheDocument();
    expect(screen.getByText('Neuromancer')).toBeInTheDocument();
  });

  it('mengurutkan judul secara menaik (A-Z)', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.selectOptions(screen.getByLabelText(/urutkan daftar/i), 'judul-asc');

    const judul = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);
    expect(judul).toEqual(['Dune', 'Neuromancer', 'Solaris']);
  });

  it('memperbarui teks jumlah buku yang ditampilkan', async () => {
    const user = userEvent.setup();
    render(<FilterDemo />);

    await user.click(screen.getByRole('button', { name: /^sedang baca$/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Menampilkan 1 dari 3 buku');
  });
});