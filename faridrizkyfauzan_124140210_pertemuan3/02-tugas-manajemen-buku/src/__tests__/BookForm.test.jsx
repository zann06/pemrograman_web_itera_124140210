/**
 * Test integrasi BookForm - interaksi pengguna nyata via Testing Library.
 *
 * Prinsip React Testing Library: cari elemen lewat label/teks yang dilihat
 * pengguna, laluVZ simulasi klik/ketik. Jangan pernah accessing state internal.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookForm from '../components/BookForm/BookForm.jsx';

describe('BookForm', () => {
  it('merender semua field wajib beserta labelnya', () => {
    render(<BookForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/judul buku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/penulis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tambah buku/i })).toBeInTheDocument();
  });

  it('menampilkan pesan error dan tidak memanggil onSubmit saat form kosong', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(screen.getByText(/nama penulis wajib diisi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/judul buku/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('memvalidasi judul yang terlalu pendek setelah dikosongkan', async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={vi.fn()} />);
    const input = screen.getByLabelText(/judul buku/i);

    await user.type(input, 'a');
    await user.clear(input);

    expect(await screen.findByText(/judul buku wajib diisi/i)).toBeInTheDocument();
  });

  it('mengirim data valid ke onSubmit setelah form diisi', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/judul buku/i), 'Dune');
    await user.type(screen.getByLabelText(/penulis/i), 'Frank Herbert');
    await user.selectOptions(screen.getByLabelText(/^status/i), 'baca');
    await user.type(screen.getByLabelText(/tahun terbit/i), '1965');
    await user.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        judul: 'Dune',
        penulis: 'Frank Herbert',
        status: 'baca',
        tahun: 1965,
      }),
    );
  });

  it('menyorot input dengan aria-invalid hanya setelah field dikosongkan', async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={vi.fn()} />);
    const input = screen.getByLabelText(/judul buku/i);

    // Belum disentuh -> belum ada tanda error.
    expect(input).not.toHaveAttribute('aria-invalid', 'true');

    await user.type(input, 'Dune');
    await user.clear(input);

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('berpindah ke mode edit dan mengisi form dengan data yang ada', () => {
    render(
      <BookForm
        mode="edit"
        nilaiAwal={{ judul: 'Neuromancer', penulis: 'William Gibson', status: 'milik', tahun: 1984 }}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/judul buku/i)).toHaveValue('Neuromancer');
    expect(screen.getByLabelText(/penulis/i)).toHaveValue('William Gibson');
    expect(screen.getByLabelText(/tahun terbit/i)).toHaveValue(1984);
    expect(screen.getByRole('button', { name: /simpan perubahan/i })).toBeInTheDocument();
  });

  it('memanggil onBatal ketika tombol batal diklik pada mode edit', async () => {
    const user = userEvent.setup();
    const onBatal = vi.fn();
    render(<BookForm mode="edit" nilaiAwal={{ judul: 'X' }} onSubmit={vi.fn()} onBatal={onBatal} />);

    await user.click(screen.getByRole('button', { name: /^batal$/i }));

    expect(onBatal).toHaveBeenCalledTimes(1);
  });

  it('mereset form setelah pengiriman berhasil', async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={vi.fn()} />);
    const judul = screen.getByLabelText(/judul buku/i);

    await user.type(judul, 'Solaris');
    await user.type(screen.getByLabelText(/penulis/i), 'Stanisław Lem');
    await user.click(screen.getByRole('button', { name: /tambah buku/i }));

    expect(judul).toHaveValue('');
    expect(screen.getByLabelText(/penulis/i)).toHaveValue('');
  });

  it('menampilkan tiga pilihan status sesuai spesifikasi', () => {
    render(<BookForm onSubmit={vi.fn()} />);
    const select = screen.getByLabelText(/^status/i);

    expect(select.options).toHaveLength(3);
  });
});