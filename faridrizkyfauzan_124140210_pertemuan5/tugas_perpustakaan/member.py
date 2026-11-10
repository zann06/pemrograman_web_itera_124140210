# ==============================================================================
# Berkas    : member.py
# Topik     : Tugas Praktikum - Sistem Manajemen Perpustakaan (Class Member)
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Class anggota perpustakaan beserta enkapsulasi daftar pinjaman,
#             batas maksimal pinjaman, serta perhitungan total denda.
# ==============================================================================

from library_item import LibraryItem


class Member:
    """Anggota perpustakaan yang dapat meminjam item."""

    BATAS_PINJAM = 3  # maksimal 3 item yang boleh dipinjam bersamaan

    def __init__(self, member_id: str, nama: str):
        self._member_id = member_id
        self._nama = nama
        self.__pinjaman = []    # PRIVATE: daftar LibraryItem yang sedang dipinjam
        self.__total_denda = 0.0

    # ---------------------------- PROPERTIES ----------------------------
    @property
    def member_id(self) -> str:
        return self._member_id

    @property
    def nama(self) -> str:
        return self._nama

    @property
    def pinjaman(self) -> tuple:
        """Getter read-only berisi salinan daftar pinjaman."""
        return tuple(self.__pinjaman)

    @property
    def total_denda(self) -> float:
        """Akumulasi denda yang belum dibayar anggota."""
        return self.__total_denda

    # ---------------------------- METHOD ----------------------------
    def pinjam_item(self, item: LibraryItem) -> bool:
        """Meminjam item bila kuota belum penuh dan item masih tersedia."""
        if len(self.__pinjaman) >= self.BATAS_PINJAM:
            print(f"  ! {self._nama} sudah mencapai batas {self.BATAS_PINJAM} item.")
            return False
        if item.is_dipinjam:
            print(f"  ! '{item.judul}' sudah dipinjam anggota lain.")
            return False
        if not item.pinjam():
            return False
        self.__pinjaman.append(item)
        print(f"  > {self._nama} meminjam '{item.judul}' "
              f"({len(self.__pinjaman)}/{self.BATAS_PINJAM}). "
              f"Batas kembali: {item.durasi_pinjam()} hari.")
        return True

    def kembalikan_item(self, item: LibraryItem, hari_terlambat: int = 0) -> float:
        """Mengembalikan item, menghitung denda, lalu mencatat ke total denda."""
        if item not in self.__pinjaman:
            print(f"  ! '{item.judul}' tidak tercatat sebagai pinjaman {self._nama}.")
            return 0.0
        denda = item.hitung_denda(hari_terlambat)
        item.kembalikan()
        self.__pinjaman.remove(item)
        self.__total_denda += denda
        if hari_terlambat > 0:
            print(f"  > Terlambat {hari_terlambat} hari. Denda Rp{denda:,.0f} "
                  f"dibebankan ke {self._nama}.")
        else:
            print("  > Dikembalikan tepat waktu, tanpa denda.")
        return denda

    def bayar_denda(self, jumlah: float):
        """Melunasi denda anggota."""
        if jumlah <= 0:
            print("  ! Nominal pembayaran tidak valid.")
            return
        dibayar = min(jumlah, self.__total_denda)
        self.__total_denda -= dibayar
        print(f"  > {self._nama} membayar denda Rp{dibayar:,.0f}. "
              f"Sisa denda: Rp{self.__total_denda:,.0f}")

    def tampilkan_pinjaman(self):
        """Menampilkan seluruh item yang sedang dipinjam anggota."""
        print(f"Pinjaman {self._nama} ({self._member_id}) "
              f"- {len(self.__pinjaman)}/{self.BATAS_PINJAM} item:")
        if not self.__pinjaman:
            print("  (belum ada item yang dipinjam)")
        for nomor, item in enumerate(self.__pinjaman, start=1):
            print(f"  {nomor}. {item}")
        print(f"  Total denda tertunggak: Rp{self.__total_denda:,.0f}")

    def __str__(self) -> str:
        return (f"Member({self._member_id}) {self._nama} - "
                f"{len(self.__pinjaman)} item dipinjam")
