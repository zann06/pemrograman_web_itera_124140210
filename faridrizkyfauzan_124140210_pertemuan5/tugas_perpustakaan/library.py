# ==============================================================================
# Berkas    : library.py
# Topik     : Tugas Praktikum - Sistem Manajemen Perpustakaan (Class Library)
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Class pengelola perpustakaan dengan koleksi private, penambahan
#             item, penampilan item tersedia, serta pencarian berdasarkan
#             judul maupun ID (polymorphism via LibraryItem).
# ==============================================================================

from library_item import LibraryItem, Book, Magazine


class Library:
    """Mengelola koleksi item perpustakaan beserta proses pencariannya."""

    def __init__(self, nama: str):
        self.nama = nama
        self.__koleksi = []  # PRIVATE: hanya bisa diubah lewat method resmi

    # ---------------------------- PROPERTIES ----------------------------
    @property
    def koleksi(self) -> tuple:
        """Getter read-only: mencegah koleksi diubah langsung dari luar."""
        return tuple(self.__koleksi)

    @property
    def jumlah_koleksi(self) -> int:
        return len(self.__koleksi)

    # ---------------------------- CRUD ITEM ----------------------------
    def tambah_item(self, item: LibraryItem):
        """Menambahkan item baru ke koleksi dengan validasi ID unik."""
        if not isinstance(item, LibraryItem):
            print("  ! Gagal menambah: objek bukan turunan LibraryItem.")
            return False
        if self.cari_by_id(item.item_id) is not None:
            print(f"  ! Gagal menambah: ID '{item.item_id}' sudah dipakai.")
            return False
        self.__koleksi.append(item)
        print(f"  + Item ditambahkan: {item}")
        return True

    def hapus_item(self, item_id: str) -> bool:
        """Menghapus item berdasarkan ID (item yang dipinjam tidak boleh dihapus)."""
        item = self.cari_by_id(item_id)
        if item is None:
            print(f"  ! Item dengan ID '{item_id}' tidak ditemukan.")
            return False
        if item.is_dipinjam:
            print(f"  ! '{item.judul}' sedang dipinjam, tidak bisa dihapus.")
            return False
        self.__koleksi.remove(item)
        print(f"  - Item '{item.judul}' dihapus dari koleksi.")
        return True

    # ---------------------------- TAMPILAN ----------------------------
    def tampilkan_semua(self):
        """Menampilkan seluruh koleksi apa adanya."""
        print(f"\n=== Seluruh Koleksi {self.nama} ({self.jumlah_koleksi} item) ===")
        if not self.__koleksi:
            print("  (koleksi masih kosong)")
            return
        for nomor, item in enumerate(self.__koleksi, start=1):
            print(f"  {nomor}. {item.get_detail()}")

    def tampilkan_tersedia(self):
        """Menampilkan hanya item yang statusnya masih tersedia (tidak dipinjam)."""
        item_tersedia = [item for item in self.__koleksi if not item.is_dipinjam]
        print(f"\n=== Katalog Item Tersedia ({len(item_tersedia)} dari "
              f"{self.jumlah_koleksi} item) ===")
        if not item_tersedia:
            print("  (semua item sedang dipinjam)")
            return
        for nomor, item in enumerate(item_tersedia, start=1):
            print(f"  {nomor}. {item} | Batas pinjam {item.durasi_pinjam()} hari")

    def tampilkan_dipinjam(self):
        """Menampilkan item yang sedang dipinjam beserta denda maksimalnya."""
        item_dipinjam = [item for item in self.__koleksi if item.is_dipinjam]
        print(f"\n=== Item Sedang Dipinjam ({len(item_dipinjam)} item) ===")
        if not item_dipinjam:
            print("  (tidak ada item yang dipinjam)")
            return
        for nomor, item in enumerate(item_dipinjam, start=1):
            print(f"  {nomor}. {item}")

    # ---------------------------- PENCARIAN ----------------------------
    def cari_by_id(self, item_id: str):
        """Mencari item berdasarkan ID (pencarian eksak, case-insensitive)."""
        for item in self.__koleksi:
            if item.item_id.lower() == item_id.lower():
                return item
        return None

    def cari_item(self, kata_kunci: str) -> list:
        """Mencari item berdasarkan judul (partial match, case-insensitive)."""
        kata = kata_kunci.lower().strip()
        return [item for item in self.__koleksi if kata in item.judul.lower()]

    def cari(self, kata_kunci: str):
        """Pencarian pintar: cocokkan sebagai ID terlebih dahulu, lalu judul.

        Jika kata kunci persis sama dengan sebuah ID, hasil ID diutamakan.
        Jika tidak, dilakukan pencarian sebagian pada judul (bisa >1 hasil).
        """
        print(f"\n>>> Mencari item dengan kata kunci: '{kata_kunci}'")
        item_by_id = self.cari_by_id(kata_kunci)
        if item_by_id is not None:
            print("  [Hasil - cocok ID]")
            print(f"    {item_by_id.get_detail()}")
            return [item_by_id]

        hasil_judul = self.cari_item(kata_kunci)
        if not hasil_judul:
            print("  Tidak ada item yang cocok dengan kata kunci tersebut.")
            return []
        print(f"  [Hasil - cocok judul: {len(hasil_judul)} item]")
        for nomor, item in enumerate(hasil_judul, start=1):
            print(f"    {nomor}. {item}")
        return hasil_judul

    # ---------------------------- OPERASI PEMINJAMAN ----------------------------
    def pinjam_untuk(self, member, item_id: str) -> bool:
        """Helper: proses peminjaman item untuk seorang anggota."""
        item = self.cari_by_id(item_id)
        if item is None:
            print(f"  ! Item dengan ID '{item_id}' tidak ditemukan.")
            return False
        print(f"Proses pinjam ID '{item_id}' oleh {member.nama}:")
        return member.pinjam_item(item)

    def laporan_denda(self, items_terlambat: dict):
        """Menghitung denda massal: dict {item_id: hari_terlambat}."""
        print("\n=== Laporan Denda Keterlambatan ===")
        total = 0.0
        for item_id, hari in items_terlambat.items():
            item = self.cari_by_id(item_id)
            if item is None:
                print(f"  ! ID '{item_id}' tidak ditemukan.")
                continue
            denda = item.hitung_denda(hari)
            total += denda
            print(f"  {item.judul:<38} | {type(item).__name__:<8} | "
                  f"Terlambat {hari} hari | Denda Rp{denda:,.0f}")
        print(f"  Total denda keseluruhan: Rp{total:,.0f}")

    def __str__(self) -> str:
        return f"Library('{self.nama}') - {self.jumlah_koleksi} item"

    def __len__(self) -> int:
        return self.jumlah_koleksi


# --- PROGRAM DEMO SINGKAT (jika library.py dijalankan langsung) ---
if __name__ == "__main__":
    demo = Library("Perpustakaan ITERA")
    demo.tambah_item(Book("B-001", "Clean Code", 2008, "Robert C. Martin", 464))
    demo.tambah_item(Magazine("M-001", "National Geographic", 2024, "Vol. 245", "NatGeo"))
    demo.tampilkan_tersedia()
    print(demo)
