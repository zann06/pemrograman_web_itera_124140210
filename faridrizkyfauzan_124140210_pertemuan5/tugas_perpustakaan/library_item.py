# ==============================================================================
# Berkas    : library_item.py
# Topik     : Tugas Praktikum - Sistem Manajemen Perpustakaan (Abstract Class)
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Berisi abstract class LibraryItem sebagai kontrak seluruh koleksi
#             perpustakaan, beserta dua turunannya yaitu Book dan Magazine.
# ==============================================================================

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Abstract class untuk semua item yang dapat dipinjam di perpustakaan.

    Setiap turunan WAJIB mengimplementasikan get_detail(), hitung_denda(),
    dan durasi_pinjam agar bisa dipakai oleh class Library.
    """

    def __init__(self, item_id: str, judul: str, tahun_terbit: int):
        """Menyimpan data identitas item yang dimiliki semua jenis koleksi."""
        self._item_id = item_id
        self._judul = judul
        self._tahun_terbit = tahun_terbit
        self._dipinjam = False  # status ketersediaan item

    # ---------------------------- PROPERTIES ----------------------------
    @property
    def item_id(self) -> str:
        """Getter ID item (read-only dari luar)."""
        return self._item_id

    @property
    def judul(self) -> str:
        """Getter judul item."""
        return self._judul

    @property
    def tahun_terbit(self) -> int:
        """Getter tahun terbit item."""
        return self._tahun_terbit

    @property
    def is_dipinjam(self) -> bool:
        """Getter status peminjaman; hanya bisa diubah via method pinjam/kembalikan."""
        return self._dipinjam

    # ------------------------ METHOD KONKRET ------------------------
    def pinjam(self) -> bool:
        """Menandai item sedang dipinjam. Gagal jika item sudah dipinjam."""
        if self._dipinjam:
            print(f"  ! '{self._judul}' sedang dipinjam anggota lain.")
            return False
        self._dipinjam = True
        print(f"  > '{self._judul}' berhasil dipinjam.")
        return True

    def kembalikan(self) -> bool:
        """Mengembalikan item ke perpustakaan."""
        if not self._dipinjam:
            print(f"  ! '{self._judul}' tidak sedang dipinjam.")
            return False
        self._dipinjam = False
        print(f"  > '{self._judul}' telah dikembalikan.")
        return True

    # --------------------- ABSTRACT METHODS ---------------------
    @abstractmethod
    def get_detail(self) -> str:
        """Mengembalikan deskripsi lengkap item."""
        pass

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> float:
        """Menghitung denda keterlambatan pengembalian (rupiah)."""
        pass

    @abstractmethod
    def durasi_pinjam(self) -> int:
        """Batas maksimal lama peminjaman (dalam hari)."""
        pass

    # --------------------------- DUNDER ---------------------------
    def __str__(self) -> str:
        status = "DIPINJAM" if self._dipinjam else "TERSEDIA"
        return f"[{self._item_id}] {self._judul} ({self._tahun_terbit}) - {status}"

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(item_id='{self._item_id}', judul='{self._judul}')"


class Book(LibraryItem):
    """Buku cetak: durasi pinjam 14 hari, denda Rp1.000 per hari terlambat."""

    DENDA_PER_HARI = 1_000
    DURASI_PINJAM = 14

    def __init__(self, item_id: str, judul: str, tahun_terbit: int,
                 penulis: str, jumlah_halaman: int):
        super().__init__(item_id, judul, tahun_terbit)
        self._penulis = penulis
        self._jumlah_halaman = jumlah_halaman

    @property
    def penulis(self) -> str:
        return self._penulis

    def get_detail(self) -> str:
        """Detail buku: penulis, halaman, dan status ketersediaan."""
        status = "DIPINJAM" if self.is_dipinjam else "TERSEDIA"
        return (f"Buku      | ID: {self._item_id} | '{self._judul}' | "
                f"Penulis: {self._penulis} | {self._jumlah_halaman} hlm | "
                f"Tahun: {self._tahun_terbit} | {status}")

    def hitung_denda(self, hari_terlambat: int) -> float:
        """Denda buku Rp1.000/hari, maksimal Rp20.000."""
        if hari_terlambat <= 0:
            return 0.0
        return min(hari_terlambat * self.DENDA_PER_HARI, 20_000)

    def durasi_pinjam(self) -> int:
        return self.DURASI_PINJAM


class Magazine(LibraryItem):
    """Majalah: durasi pinjam 7 hari, denda Rp2.000 per hari terlambat."""

    DENDA_PER_HARI = 2_000
    DURASI_PINJAM = 7

    def __init__(self, item_id: str, judul: str, tahun_terbit: int,
                 edisi: str, penerbit: str):
        super().__init__(item_id, judul, tahun_terbit)
        self._edisi = edisi
        self._penerbit = penerbit

    @property
    def edisi(self) -> str:
        return self._edisi

    def get_detail(self) -> str:
        """Detail majalah: edisi, penerbit, dan status ketersediaan."""
        status = "DIPINJAM" if self.is_dipinjam else "TERSEDIA"
        return (f"Majalah   | ID: {self._item_id} | '{self._judul}' | "
                f"Edisi: {self._edisi} | Penerbit: {self._penerbit} | "
                f"Tahun: {self._tahun_terbit} | {status}")

    def hitung_denda(self, hari_terlambat: int) -> float:
        """Denda majalah Rp2.000/hari, maksimal Rp20.000."""
        if hari_terlambat <= 0:
            return 0.0
        return min(hari_terlambat * self.DENDA_PER_HARI, 20_000)

    def durasi_pinjam(self) -> int:
        return self.DURASI_PINJAM
