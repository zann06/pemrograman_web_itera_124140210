/**
 * Test ConfirmDialog - conditional rendering + event listener Escape.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog.jsx';

const props = {
  judul: 'Hapus buku?',
  pesan: 'Buku ini akan dihapus permanen.',
  onKonfirmasi: vi.fn(),
  onBatal: vi.fn(),
};

describe('ConfirmDialog', () => {
  it('tidak merender apa pun saat tertutup (conditional rendering)', () => {
    render(<ConfirmDialog {...props} terbuka={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('merender dialog dengan role dan aria-modal yang benar saat terbuka', () => {
    render(<ConfirmDialog {...props} terbuka />);

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Hapus buku?')).toBeInTheDocument();
  });

  it('memanggil onKonfirmasi saat tombol konfirmasi diklik', async () => {
    const user = userEvent.setup();
    const onKonfirmasi = vi.fn();
    render(<ConfirmDialog {...props} onKonfirmasi={onKonfirmasi} terbuka />);

    await user.click(screen.getByRole('button', { name: /hapus/i }));

    expect(onKonfirmasi).toHaveBeenCalledTimes(1);
  });

  it('memanggil onBatal saat tombol batal diklik', async () => {
    const user = userEvent.setup();
    const onBatal = vi.fn();
    render(<ConfirmDialog {...props} onBatal={onBatal} terbuka />);

    await user.click(screen.getByRole('button', { name: /batal/i }));

    expect(onBatal).toHaveBeenCalledTimes(1);
  });

  it('menutup dialog saat tombol Escape ditekan (useEffect listener)', async () => {
    const user = userEvent.setup();
    const onBatal = vi.fn();
    render(<ConfirmDialog {...props} onBatal={onBatal} terbuka />);

    await user.keyboard('{Escape}');

    expect(onBatal).toHaveBeenCalledTimes(1);
  });

  it('menutup dialog saat backdrop diklik', async () => {
    const user = userEvent.setup();
    const onBatal = vi.fn();
    render(<ConfirmDialog {...props} onBatal={onBatal} terbuka />);

    await user.click(screen.getByRole('presentation'));

    expect(onBatal).toHaveBeenCalled();
  });

  it('tidak menutup dialog saat area di dalam dialog diklik', async () => {
    const user = userEvent.setup();
    const onBatal = vi.fn();
    render(<ConfirmDialog {...props} onBatal={onBatal} terbuka />);

    await user.click(screen.getByText('Hapus buku?'));

    expect(onBatal).not.toHaveBeenCalled();
  });

  it('memfokuskan tombol konfirmasi otomatis', () => {
    render(<ConfirmDialog {...props} terbuka />);

    expect(screen.getByRole('button', { name: /hapus/i })).toHaveFocus();
  });
});