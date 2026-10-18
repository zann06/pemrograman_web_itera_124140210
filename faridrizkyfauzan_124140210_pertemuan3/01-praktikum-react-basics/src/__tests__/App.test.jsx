/**
 * Smoke test untuk 7 topik praktikum.
 *
 * Tujuannya bukan menguji logika tiap topik, melainkan memastikan setiap
 * halaman benar-benar bisa di-render tanpa error runtime. Ini menangkap
 * kesalahan yang tidak akan terlihat oleh build, misalnya nama variabel yang
 * salah ketik atau hook yang dipanggil di tempat yang tidak valid.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import Topic1 from '../topics/Topic1.jsx';
import Topic2 from '../topics/Topic2.jsx';
import Topic3 from '../topics/Topic3.jsx';
import Topic4 from '../topics/Topic4.jsx';
import Topic5 from '../topics/Topic5.jsx';
import Topic6 from '../topics/Topic6.jsx';
import Topic7 from '../topics/Topic7.jsx';

const SEMUA_TOPIK = [
  ['Setup Project React', Topic1],
  ['Components & Props', Topic2],
  ['State Management & Hooks', Topic3],
  ['Routing dengan React Router', Topic4],
  ['Pembuatan Custom Hook', Topic5],
  ['Global State', Topic6],
  ['Testing', Topic7],
];

/** Topik 4 memakai useNavigate/useParams, jadi harus berada di dalam Router. */
const renderTopik = (Komponen) =>
  render(
    <MemoryRouter>
      <Komponen />
    </MemoryRouter>,
  );

describe('Smoke test halaman topik', () => {
  it.each(SEMUA_TOPIK)('%s merender tanpa error', (_nama, Komponen) => {
    renderTopik(Komponen);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('Topic 1: tombol tambah mengubah nilai', async () => {
    const user = userEvent.setup();
    renderTopik(Topic1);

    await user.click(screen.getByRole('button', { name: /tambah nilai/i }));

    expect(screen.getByText(/nilai sekarang: 1/i)).toBeInTheDocument();
  });

  it('Topic 2: memilih buku menampilkan detail', async () => {
    const user = userEvent.setup();
    renderTopik(Topic2);

    await user.click(screen.getByRole('button', { name: /Dune/ }));

    expect(screen.getByText(/key: 1/)).toBeInTheDocument();
  });

  it('Topic 3: tombol counter mengubah state', async () => {
    const user = userEvent.setup();
    renderTopik(Topic3);

    await user.click(screen.getByRole('button', { name: '+1' }));

    expect(screen.getByText('hitung = 1')).toBeInTheDocument();
  });

  it('Topic 4: route param menampilkan detail buku', async () => {
    render(
      <MemoryRouter initialEntries={['/routing/buku/solaris']}>
        <Topic4 />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Stanislaw Lem/)).toBeInTheDocument();
  });

  it('Topic 5: debounce tertahan lalu ikut berubah', async () => {
    const user = userEvent.setup();
    renderTopik(Topic5);

    await user.type(screen.getByPlaceholderText(/ketik cepat/i), 'ab');

    expect(screen.getByText(/menunggu 700 ms/i)).toBeInTheDocument();
  });

  it('Topic 6: context terbaca 3 level di bawah provider', async () => {
    const user = userEvent.setup();
    renderTopik(Topic6);

    expect(screen.getByText(/Total buku di keranjang: 3/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tambah neuromancer/i }));

    expect(screen.getByText(/Total buku di keranjang: 4/i)).toBeInTheDocument();
  });

  it('Topic 7: form validasi menampilkan pesan error', async () => {
    const user = userEvent.setup();
    renderTopik(Topic7);

    await user.click(screen.getAllByRole('button', { name: /simpan/i })[0]);

    expect(screen.getByRole('alert')).toHaveTextContent('Nama wajib diisi');
  });

  it('App menampilkan 7 tautan topik di sidebar', () => {
    render(<App />);

    const sidebar = screen.getByRole('navigation', { name: /daftar topik/i });

    expect(within(sidebar).getAllByRole('link')).toHaveLength(7);
  });
});