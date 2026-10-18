/**
 * Test navigasi React Router.
 *
 * Membungkus App dengan MemoryRouter tidak diperlukan karena App sudah memakai
 * HashRouter - tapi agar test tidak bergantung pada history browser, di sini
 * dirender provider + komponen rute secara terpisah dengan MemoryRouter.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { BookProvider } from '../context/BookContext.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';
import Home from '../pages/Home/Home.jsx';
import Stats from '../pages/Stats/Stats.jsx';
import useToast from '../hooks/useToast.js';

const TAUTAN = [
  { ke: '/', label: 'Koleksi', akhir: true },
  { ke: '/statistik', label: 'Statistik' },
];

function TestApp() {
  const notif = useToast();

  return (
    <BookProvider>
      <MemoryRouter initialEntries={['/']}>
        <Navbar tautan={TAUTAN} />
        <Routes>
          <Route path="/" element={<Home notif={notif} />} />
          <Route path="/statistik" element={<Stats />} />
        </Routes>
      </MemoryRouter>
    </BookProvider>
  );
}

describe('Navigasi React Router', () => {
  it('menampilkan halaman Koleksi sebagai rute default', () => {
    render(<TestApp />);

    expect(screen.getByRole('button', { name: /tambah buku/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/cari buku/i)).toBeInTheDocument();
  });

  it('berpindah ke halaman Statistik saat tautan diklik', async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    await user.click(screen.getByRole('link', { name: 'Statistik' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: /statistik/i }),
    ).toBeInTheDocument();
  });

  it('memberi penanda tautan aktif lewat NavLink', async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    const tautanStatistik = screen.getByRole('link', { name: 'Statistik' });
    expect(tautanStatistik).not.toHaveClass('aktif');

    await user.click(tautanStatistik);

    expect(await screen.findByRole('link', { name: 'Statistik' })).toHaveClass('aktif');
  });

  it('kembali ke halaman Koleksi', async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    await user.click(screen.getByRole('link', { name: 'Statistik' }));
    await user.click(screen.getByRole('link', { name: 'Koleksi' }));

    expect(await screen.findByLabelText(/cari buku/i)).toBeInTheDocument();
  });

  it('menampilkan empty state statistik saat belum ada buku', async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    await user.click(screen.getByRole('link', { name: 'Statistik' }));

    expect(await screen.findByText(/belum ada data untuk dianalisis/i)).toBeInTheDocument();
  });

  it('menampilkan statistik setelah buku ditambahkan lewat form', async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    await user.type(screen.getByLabelText(/judul buku/i), 'Dune');
    await user.type(screen.getByLabelText(/^penulis/i), 'Frank Herbert');
    await user.click(screen.getByRole('button', { name: /tambah buku/i }));

    await user.click(screen.getByRole('link', { name: 'Statistik' }));

    expect(await screen.findByText('Frank Herbert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /distribusi per status/i })).toBeInTheDocument();
  });
});