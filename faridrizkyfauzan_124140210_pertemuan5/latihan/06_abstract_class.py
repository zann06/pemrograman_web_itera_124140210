# ==============================================================================
# Berkas    : 06_abstract_class.py
# Topik     : Abstract Class & Interface - ABC, @abstractmethod, Enforcement
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Implementasi abstract class Shape (luas, keliling) dan interface
#             DatabaseConnector (connect, execute_query, disconnect) dengan
#             modul abc, pembuktian TypeError saat instansiasi langsung,
#             serta latihan hierarki storage.
# ==============================================================================

from abc import ABC, abstractmethod


# ------------------------------------------------------------------------------
# 1. ABSTRACT CLASS: SHAPE
# ------------------------------------------------------------------------------
class Shape(ABC):
    """Abstract class: tidak bisa diinstansiasi secara langsung."""

    def __init__(self, nama: str):
        self.nama = nama

    @abstractmethod
    def luas(self) -> float:
        """Wajib diimplementasikan oleh setiap subclass."""
        pass

    @abstractmethod
    def keliling(self) -> float:
        """Wajib diimplementasikan oleh setiap subclass."""
        pass

    # Concrete method: sudah punya implementasi, bisa dipakai semua subclass
    def cetak_laporan(self):
        print(f"[{self.nama}] Luas: {self.luas():.2f} | Keliling: {self.keliling():.2f}")


class PersegiPanjang(Shape):
    def __init__(self, panjang: float, lebar: float):
        super().__init__("Persegi Panjang")
        self.panjang = panjang
        self.lebar = lebar

    def luas(self) -> float:
        return self.panjang * self.lebar

    def keliling(self) -> float:
        return 2 * (self.panjang + self.lebar)


class Lingkaran(Shape):
    def __init__(self, radius: float):
        super().__init__("Lingkaran")
        self.radius = radius

    def luas(self) -> float:
        return 3.14159 * self.radius ** 2

    def keliling(self) -> float:
        return 2 * 3.14159 * self.radius


class Segitiga(Shape):
    """Tambahan: segitiga sama sisi agar bentuk polymorphism makin terlihat."""

    def __init__(self, sisi: float):
        super().__init__("Segitiga Sama Sisi")
        self.sisi = sisi

    def luas(self) -> float:
        return (3 ** 0.5 / 4) * self.sisi ** 2

    def keliling(self) -> float:
        return 3 * self.sisi


# ------------------------------------------------------------------------------
# 2. INTERFACE-LIKE ABSTRACT CLASS: DATABASE CONNECTOR
# ------------------------------------------------------------------------------
class DatabaseConnector(ABC):
    """Kontrak koneksi database: semua driver wajib punya 3 method ini."""

    @property
    @abstractmethod
    def driver_name(self) -> str:
        """Nama driver yang digunakan."""
        pass

    @abstractmethod
    def connect(self, host: str, port: int, database: str) -> bool:
        pass

    @abstractmethod
    def execute_query(self, sql: str) -> list:
        pass

    @abstractmethod
    def disconnect(self):
        pass


class PostgreSQLConnector(DatabaseConnector):
    @property
    def driver_name(self) -> str:
        return "PostgreSQL (psycopg2)"

    def connect(self, host: str, port: int, database: str) -> bool:
        print(f"[{self.driver_name}] Terhubung ke postgresql://{host}:{port}/{database} [OK]")
        return True

    def execute_query(self, sql: str) -> list:
        print(f"[{self.driver_name}] Menjalankan SQL: '{sql}'")
        return [{"id": 1, "nama": "Ahmad"}, {"id": 2, "nama": "Nabila"}]

    def disconnect(self):
        print(f"[{self.driver_name}] Koneksi database ditutup dengan aman.")


class MySQLConnector(DatabaseConnector):
    @property
    def driver_name(self) -> str:
        return "MySQL (mysql-connector)"

    def connect(self, host: str, port: int, database: str) -> bool:
        print(f"[{self.driver_name}] Terhubung ke mysql://{host}:{port}/{database} [OK]")
        return True

    def execute_query(self, sql: str) -> list:
        print(f"[{self.driver_name}] Menjalankan SQL: '{sql}'")
        return [{"id": 1, "nama": "Budi"}]

    def disconnect(self):
        print(f"[{self.driver_name}] Koneksi database ditutup dengan aman.")


# --- PROGRAM UTAMA ---
if __name__ == "__main__":
    print("--- 1. Uji Coba Kepatuhan Implementasi Shape ---")
    pp = PersegiPanjang(10, 5)
    ling = Lingkaran(7)
    seg = Segitiga(6)

    pp.cetak_laporan()
    ling.cetak_laporan()
    seg.cetak_laporan()

    print("\n--- 2. Pembuktian Enforcement Abstract Class ---")
    try:
        shape = Shape("Bentuk Abstrak")
        print(shape)
    except TypeError as error:
        print(f"TypeError: {error}")

    print("\n--- 3. Interface DatabaseConnector ---")
    for konektor in (PostgreSQLConnector(), MySQLConnector()):
        konektor.connect("localhost", 5432, "paw_itera")
        hasil = konektor.execute_query("SELECT * FROM mahasiswa")
        print(f"  Jumlah baris: {len(hasil)} -> {hasil}")
        konektor.disconnect()
        print()

    print("--- 4. Latihan Mandiri: Abstract Class Storage ---")
    class FileStorage(ABC):
        """Kontrak penyimpanan file."""

        @abstractmethod
        def simpan(self, nama_file: str, isi: str) -> bool:
            pass

        @abstractmethod
        def baca(self, nama_file: str) -> str:
            pass

        @abstractmethod
        def hapus(self, nama_file: str) -> bool:
            pass

    class LocalDiskStorage(FileStorage):
        """Simulasi penyimpanan di disk lokal."""

        def __init__(self):
            self._data = {}

        def simpan(self, nama_file: str, isi: str) -> bool:
            self._data[nama_file] = isi
            print(f"[LocalDisk] '{nama_file}' disimpan ({len(isi)} byte) di /var/www/storage")
            return True

        def baca(self, nama_file: str) -> str:
            isi = self._data.get(nama_file, "")
            print(f"[LocalDisk] Membaca '{nama_file}' -> \"{isi}\"")
            return isi

        def hapus(self, nama_file: str) -> bool:
            self._data.pop(nama_file, None)
            print(f"[LocalDisk] '{nama_file}' dihapus")
            return True

    class CloudStorage(FileStorage):
        """Simulasi penyimpanan di cloud object storage."""

        def __init__(self, bucket: str):
            self.bucket = bucket
            self._data = {}

        def simpan(self, nama_file: str, isi: str) -> bool:
            self._data[nama_file] = isi
            print(f"[Cloud s3://{self.bucket}] '{nama_file}' diunggah ({len(isi)} byte)")
            return True

        def baca(self, nama_file: str) -> str:
            isi = self._data.get(nama_file, "")
            print(f"[Cloud s3://{self.bucket}] Mengunduh '{nama_file}' -> \"{isi}\"")
            return isi

        def hapus(self, nama_file: str) -> bool:
            self._data.pop(nama_file, None)
            print(f"[Cloud s3://{self.bucket}] '{nama_file}' dihapus permanen")
            return True

    penyimpanan = [LocalDiskStorage(), CloudStorage("paw-itera-backup")]
    for storage in penyimpanan:
        storage.simpan("catatan_praktikum.txt", "Pertemuan 5 - Python OOP")
        storage.baca("catatan_praktikum.txt")
        storage.hapus("catatan_praktikum.txt")
        print()

    try:
        FileStorage()
    except TypeError as error:
        print(f"TypeError: {error}")
