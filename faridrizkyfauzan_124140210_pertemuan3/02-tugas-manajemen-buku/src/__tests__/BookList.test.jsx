/**
 * Test untuk BookCard dan BookList - rendering list + callback.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookCard from '../components/BookCard/BookCard.jsx';
import BookList from '../components/BookList/BookList.jsx';

const BUKU = {
  id: 'buku-1',
  judul: 'Dune',
  penulis: 'Frank Herbert',
  status: 'baca',
  tahun: 1965,
  favorit: false,
  catatan: 'Eksperimen Kumis',
  createdAt: '2024-05-02T08:00:00.000Z',
};

const renderCard = (props = {}) =>
  render(
    <BookCard
      book={BUKU}
      onEdit={vi.fn()}
      onHapus={vi.fn()}
      onToggleFavorit={vi.fn()}
      {...props}
    />,
  );

describe('BookCard', () => {
  it('menampilkan judul, penulis, dan status buku', () => {
    renderCard();

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('Frank Herbert')).toBeInTheDocument();
    expect(screen.getByText('Sedang Baca')).toBeInTheDocument();
  });

  it('menyembunyikan tahun ketika null', () => {
    renderCard({ book: { ...BUKU, tahun: null } });

    expect(screen.queryByText('1965')).not.toBeInTheDocument();
  });

  it('memanggil onEdit dengan objek buku saat tombol Edit diklik', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderCard({ onEdit });

    await user.click(screen.getByRole('button', { name: /^edit dune$/i }));

    expect(onEdit).toHaveBeenCalledWith(BUKU);
  });

  it('memanggil onHapus saat tombol Hapus diklik', async () => {
    const user = userEvent.setup();
    const onHapus = vi.fn();
    renderCard({ onHapus });

    await user.click(screen.getByRole('button', { name: /^hapus dune$/i }));

    expect(onHapus).toHaveBeenCalledWith(BUKU);
  });

  it('menjalankan onToggleFavorit dengan id buku saat ikon favorit diklik', async () => {
    const user = userEvent.setup();
    const onToggleFavorit = vi.fn();
    renderCard({ onToggleFavorit });

    await user.click(screen.getByRole('button', { name: /tandai dune sebagai favorit/i }));

    expect(onToggleFavorit).toHaveBeenCalledWith('buku-1');
  });
});

describe('BookList', () => {
  const listProps = {
    onEdit: vi.fn(),
    onHapus: vi.fn(),
    onToggleFavorit: vi.fn(),
  };

  it('merender satu kartu untuk setiap buku', () => {
    render(
      <BookList
        books={[BUKU, { ...BUKU, id: 'buku-2', judul: 'Solaris' }]}
        total={2}
        adaFilter={false}
        {...listProps}
      />,
    );

    expect(screen.getByText('Dune')).toBeInTheDocument();
    expect(screen.getByText('Solaris')).toBeInTheDocument();
  });

  it('menampilkan empty state ketika koleksi benar-benar kosong', () => {
    render(<BookList books={[]} total={0} adaFilter={false} {...listProps} />);

    expect(screen.getByText(/koleksi masih kosong/i)).toBeInTheDocument();
  });

  it('menampilkan pesan "tidak ada yang cocok" saat filter menyaring semua buku', () => {
    render(<BookList books={[]} total={5} adaFilter {...listProps} />);

    expect(screen.getByText(/tidak ada buku yang cocok/i)).toBeInTheDocument();
    expect(screen.queryByText(/koleksi masih kosong/i)).not.toBeInTheDocument();
  });
});