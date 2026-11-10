# ==============================================================================
# Berkas    : 01_procedural_vs_oop.py
# Topik     : Pengenalan Konsep OOP - Perbandingan Prosedural vs OOP
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Perbandingan praktis penanganan data mahasiswa menggunakan
#             pendekatan prosedural (data & fungsi terpisah) dengan
#             pendekatan OOP (data & perilaku terbungkus dalam class).
# ==============================================================================

# ------------------------------------------------------------------------------
# PENDEKATAN 1: PROSEDURAL (Data dan Fungsi Terpisah)
# Masalah: Jika struktur dictionary berubah, semua fungsi yang bergantung rusak.
# ------------------------------------------------------------------------------
mahasiswa_proc = {
    "nama": "Budi Santoso",
    "nim": "121140001",
    "jurusan": "Teknik Informatika",
    "ipk": 3.45,
}


def cetak_profil_prosedural(mhs):
    """Mencetak profil mahasiswa dari dictionary prosedural."""
    print(f"[Prosedural] {mhs['nama']} ({mhs['nim']}) - {mhs['jurusan']} | IPK: {mhs['ipk']}")


def perbarui_ipk_prosedural(mhs, ipk_baru):
    """Memperbarui IPK dengan validasi rentang 0.0 - 4.0."""
    if 0.0 <= ipk_baru <= 4.0:
        mhs["ipk"] = ipk_baru
    else:
        print("Nilai IPK tidak valid!")


cetak_profil_prosedural(mahasiswa_proc)
perbarui_ipk_prosedural(mahasiswa_proc, 3.75)
cetak_profil_prosedural(mahasiswa_proc)


# ------------------------------------------------------------------------------
# PENDEKATAN 2: OBJECT-ORIENTED (Data dan Perilaku Terbungkus Rapi dalam Class)
# Keunggulan: Validasi state dan fungsionalitas terlindungi di dalam entitas.
# ------------------------------------------------------------------------------
class Mahasiswa:
    """Class mahasiswa dengan state dan perilaku yang menyatu."""

    def __init__(self, nama: str, nim: str, jurusan: str, ipk: float):
        """Constructor: menginisialisasi seluruh atribut instance."""
        self.nama = nama
        self.nim = nim
        self.jurusan = jurusan
        self.ipk = ipk

    def cetak_profil(self):
        """Mencetak profil mahasiswa dari atribut objek."""
        print(f"[OOP] {self.nama} ({self.nim}) - {self.jurusan} | IPK: {self.ipk}")

    def update_ipk(self, ipk_baru: float):
        """Memperbarui IPK dengan validasi rentang 0.0 - 4.0."""
        if 0.0 <= ipk_baru <= 4.0:
            self.ipk = ipk_baru
            print(f"IPK {self.nama} berhasil diperbarui menjadi {self.ipk}")
        else:
            print("Peringatan: Nilai IPK harus berada pada rentang 0.0 s.d 4.0!")


print("\n--- Eksekusi Paradigma OOP ---")
mhs_oop = Mahasiswa("Siti Rahma", "121140002", "Teknik Informatika", 3.80)
mhs_oop.cetak_profil()
mhs_oop.update_ipk(3.92)
mhs_oop.cetak_profil()


# ------------------------------------------------------------------------------
# LATIHAN MANDIRI: Pemodelan Entitas Sistem Kasir Toko
# ------------------------------------------------------------------------------
# Entitas 1: Produk (barang yang dijual di toko)
#   Atribut : id_produk, nama_produk, harga, stok
#   Metode  : cek_ketersediaan(), kurangi_stok(jumlah)
#
# Entitas 2: Keranjang (wadah belanjaan pengguna)
#   Atribut : daftar_item, total_harga, jumlah_item
#   Metode  : tambah_item(produk, qty), hitung_total()
#
# Entitas 3: Pengguna (pembeli / pelanggan toko)
#   Atribut : id_pengguna, nama, saldo_dompet, alamat_kirim
#   Metode  : login(password), bayar(total_belanja)
# ------------------------------------------------------------------------------
print("\n--- Latihan Mandiri: Rancangan Entitas Sistem Kasir Toko ---")
print("Produk   : id_produk, nama_produk, harga, stok | cek_ketersediaan(), kurangi_stok()")
print("Keranjang: daftar_item, total_harga, jumlah_item | tambah_item(), hitung_total()")
print("Pengguna : id_pengguna, nama, saldo_dompet, alamat | login(), bayar()")
