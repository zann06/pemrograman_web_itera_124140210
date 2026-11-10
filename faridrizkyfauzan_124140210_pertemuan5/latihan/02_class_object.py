# ==============================================================================
# Berkas    : 02_class_object.py
# Topik     : Class & Object - Atribut Class, Instance, self, Dunder Method
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Implementasi class Mahasiswa lengkap dengan atribut class,
#             atribut instance, constructor, instance method, serta dunder
#             method __str__ dan __repr__.
# ==============================================================================


class Mahasiswa:
    """Class mahasiswa dengan atribut class (shared) & atribut instance (unik)."""

    # 1. ATRIBUT CLASS (milik bersama seluruh instance)
    universitas = "Institut Teknologi Sumatera"
    prodi = "Teknik Informatika"
    total_mahasiswa_terdaftar = 0

    # 2. CONSTRUCTOR / INITIALIZER
    def __init__(self, nama: str, nim: str, ipk: float = 0.0):
        # ATRIBUT INSTANCE (unik milik setiap objek masing-masing)
        self.nama = nama
        self.nim = nim
        self.ipk = ipk
        self.daftar_matkul = []

        # Setiap objek baru diciptakan, counter class bertambah
        Mahasiswa.total_mahasiswa_terdaftar += 1

    # 3. INSTANCE METHODS
    def tambah_matkul(self, mata_kuliah: str):
        """Menambahkan mata kuliah ke daftar matkul milik instance ini."""
        self.daftar_matkul.append(mata_kuliah)
        print(f"[{self.nama}] Berhasil mengambil mata kuliah: {mata_kuliah}")

    def update_ipk(self, ipk_baru: float):
        """Memperbarui IPK dengan validasi rentang 0.0 sampai 4.0."""
        if 0.0 <= ipk_baru <= 4.0:
            self.ipk = ipk_baru
        else:
            print(f"Nilai IPK {ipk_baru} tidak valid!")

    def evaluasi_status(self) -> str:
        """Mengembalikan predikat akademik berdasarkan nilai IPK."""
        if self.ipk >= 3.50:
            return "Cumlaude / Sangat Memuaskan"
        elif self.ipk >= 3.00:
            return "Memuaskan"
        elif self.ipk >= 2.00:
            return "Cukup"
        else:
            return "Perlu Bimbingan Khusus"

    # 4. SPECIAL (DUNDER) METHODS
    def __str__(self) -> str:
        """Representasi string ramah pengguna, dipanggil oleh print(objek)."""
        return (
            f"Mahasiswa: {self.nama} (NIM: {self.nim}) | "
            f"IPK: {self.ipk:.2f} | Kampus: {self.universitas}"
        )

    def __repr__(self) -> str:
        """Representasi teknis untuk logging dan debugging developer."""
        return f"Mahasiswa(nama='{self.nama}', nim='{self.nim}', ipk={self.ipk})"


# --- PROGRAM UTAMA (INSTANSIASI & UJI COBA) ---
if __name__ == "__main__":
    print("Total mahasiswa awal:", Mahasiswa.total_mahasiswa_terdaftar)

    # Instansiasi 2 objek mahasiswa berbeda
    mhs1 = Mahasiswa("Ahmad Fadhil", "121140001", 3.72)
    mhs2 = Mahasiswa("Nabila Putri", "121140002", 3.40)

    print("Total mahasiswa sekarang:", Mahasiswa.total_mahasiswa_terdaftar)

    # Uji coba penambahan mata kuliah (instance attribute terisolasi)
    mhs1.tambah_matkul("Pemrograman Web")
    mhs1.tambah_matkul("Basis Data")
    mhs2.tambah_matkul("Kecerdasan Buatan")

    print(f"\nMatkul {mhs1.nama}: {mhs1.daftar_matkul}")
    print(f"Matkul {mhs2.nama}: {mhs2.daftar_matkul}")

    # Uji evaluasi status akademik
    print(f"Predikat {mhs1.nama}: {mhs1.evaluasi_status()}")
    print(f"Predikat {mhs2.nama}: {mhs2.evaluasi_status()}")

    # Uji representasi dunder method __str__ dan __repr__
    print("\nCetak objek mhs1 langsung (memanggil __str__):")
    print(mhs1)

    print("Representasi teknis mhs2 (memanggil __repr__):")
    print(repr(mhs2))

    # Bukti perubahan atribut class berdampak ke seluruh instance
    print("\n--- Modifikasi Atribut Class ---")
    Mahasiswa.universitas = "ITERA Kampus Mandiri"
    print("Kampus mhs1 setelah modifikasi:", mhs1.universitas)
    print("Kampus mhs2 setelah modifikasi:", mhs2.universitas)
