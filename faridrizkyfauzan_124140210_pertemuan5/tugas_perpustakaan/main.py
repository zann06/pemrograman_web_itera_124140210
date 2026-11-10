# ==============================================================================
# Berkas    : main.py
# Topik     : Tugas Praktikum - Sistem Manajemen Perpustakaan (Program Utama)
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Program utama yang mendemonstrasikan seluruh fungsionalitas
#             perpustakaan: tambah item, tampilkan katalog tersedia,
#             pencarian judul/ID, peminjaman, pengembalian, serta denda.
#             Jalankan dengan: python main.py
# ==============================================================================

from library_item import Book, Magazine
from member import Member
from library import Library


def cetak_judul(teks: str):
    """Helper untuk mencetak judul bagian agar output mudah dibaca."""
    print("\n" + "=" * 78)
    print(f" {teks}")
    print("=" * 78)


def main():
    """Menjalankan skenario demo sistem manajemen perpustakaan."""
    print("=" * 78)
    print(" SISTEM MANAJEMEN PERPUSTAKAAN - PAW PERTEMUAN 5")
    print(" Farid Rizky Fauzan | 124140210 | Kelas RA")
    print("=" * 78)

    # ------------------------------------------------------------------
    # 1. INISIALISASI PERPUSTAKAAN & DATA AWAL
    # ------------------------------------------------------------------
    cetak_judul("1. MENAMBAHKAN ITEM KE KOLEKSI")
    perpustakaan = Library("Perpustakaan ITERA")

    daftar_item = [
        Book("B-001", "Clean Code", 2008, "Robert C. Martin", 464),
        Book("B-002", "Python Crash Course", 2019, "Eric Matthes", 544),
        Book("B-003", "Filosofi Teras", 2018, "Henry Manampiring", 320),
        Book("B-004", "Algoritma dan Pemrograman", 2020, "Rinaldi Munir", 412),
        Magazine("M-001", "National Geographic", 2024, "Vol. 245", "NatGeo"),
        Magazine("M-002", "Tempo", 2025, "Edisi 12", "Tempo Media"),
    ]
    for item in daftar_item:
        perpustakaan.tambah_item(item)

    # Pembuktian validasi: ID duplikat dan objek bukan LibraryItem
    print("\nUji validasi penambahan item:")
    perpustakaan.tambah_item(Book("B-001", "Data Duplikat", 2024, "Anon", 100))
    perpustakaan.tambah_item({"judul": "Dictionary bukan item"})

    # ------------------------------------------------------------------
    # 2. MENAMPILKAN KATALOG
    # ------------------------------------------------------------------
    cetak_judul("2. KATALOG BUKU & MAJALAH YANG TERSEDIA")
    perpustakaan.tampilkan_semua()
    perpustakaan.tampilkan_tersedia()

    # ------------------------------------------------------------------
    # 3. PEMINJAMAN OLEH ANGGOTA
    # ------------------------------------------------------------------
    cetak_judul("3. PROSES PEMINJAMAN")
    farid = Member("A-001", "Farid Rizky Fauzan")
    nabila = Member("A-002", "Nabila Putri")

    perpustakaan.pinjam_untuk(farid, "B-001")
    perpustakaan.pinjam_untuk(farid, "M-001")
    perpustakaan.pinjam_untuk(farid, "B-003")

    # Nabila mencoba meminjam item yang sudah dipegang Farid -> harus gagal
    perpustakaan.pinjam_untuk(nabila, "B-001")
    perpustakaan.pinjam_untuk(nabila, "B-002")

    print()
    farid.tampilkan_pinjaman()
    print()
    nabila.tampilkan_pinjaman()

    # ------------------------------------------------------------------
    # 4. KATALOG SETELAH ADA PEMINJAMAN
    # ------------------------------------------------------------------
    cetak_judul("4. STATUS KETERSEDIAAN SETELAH PEMINJAMAN")
    perpustakaan.tampilkan_tersedia()
    perpustakaan.tampilkan_dipinjam()

    # ------------------------------------------------------------------
    # 5. PENCARIAN (JUDUL & ID)
    # ------------------------------------------------------------------
    cetak_judul("5. PENCARIAN ITEM (BERDASARKAN JUDUL ATAU ID)")
    perpustakaan.cari("python")     # pencarian judul, case-insensitive
    perpustakaan.cari("B-001")      # pencarian berdasarkan ID
    perpustakaan.cari("tempo")      # pencarian judul majalah
    perpustakaan.cari("buku fiksi") # tidak ditemukan

    # ------------------------------------------------------------------
    # 6. PENGEMBALIAN & PERHITUNGAN DENDA
    # ------------------------------------------------------------------
    cetak_judul("6. PENGEMBALIAN ITEM & PERHITUNGAN DENDA")
    farid.kembalikan_item(perpustakaan.cari_by_id("B-001"), hari_terlambat=5)
    farid.kembalikan_item(perpustakaan.cari_by_id("M-001"), hari_terlambat=3)
    farid.kembalikan_item(perpustakaan.cari_by_id("B-003"), hari_terlambat=0)

    print()
    farid.tampilkan_pinjaman()

    print("\nMelihat laporan denda massal (simulasi keterlambatan beberapa item):")
    perpustakaan.laporan_denda({"B-002": 10, "M-002": 4, "B-004": 25})

    print()
    farid.bayar_denda(10_000)  # melunasi sebagian

    # ------------------------------------------------------------------
    # 7. PENGUJIAN ABSTRACT CLASS & POLYMORPHISM
    # ------------------------------------------------------------------
    cetak_judul("7. ABSTRACT CLASS ENFORCEMENT & POLYMORPHISM")
    from library_item import LibraryItem
    try:
        LibraryItem("X-999", "Item Abstrak", 2024)
    except TypeError as error:
        print(f"TypeError: {error}")
        print("-> LibraryItem adalah abstract class dan tidak bisa diinstansiasi.")

    print("\nPolymorphism: satu loop, dua class turunan berbeda:")
    for item in perpustakaan.koleksi:
        print(f"  {type(item).__name__:<8} | denda 7 hari terlambat: "
              f"Rp{item.hitung_denda(7):,.0f} | batas pinjam: {item.durasi_pinjam()} hari")

    # ------------------------------------------------------------------
    # 8. PENUTUP
    # ------------------------------------------------------------------
    cetak_judul("8. RINGKASAN AKHIR")
    print(f"  {perpustakaan}")
    print(f"  Total item tersedia : "
          f"{sum(1 for i in perpustakaan.koleksi if not i.is_dipinjam)} item")
    print(f"  Total item dipinjam : "
          f"{sum(1 for i in perpustakaan.koleksi if i.is_dipinjam)} item")
    print(f"  Total denda Farid   : Rp{farid.total_denda:,.0f}")
    print("\nProgram selesai - semua fungsionalitas berjalan normal.")


if __name__ == "__main__":
    main()
