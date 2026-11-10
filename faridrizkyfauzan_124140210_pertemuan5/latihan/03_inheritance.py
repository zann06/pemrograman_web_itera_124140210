# ==============================================================================
# Berkas    : 03_inheritance.py
# Topik     : Inheritance (Pewarisan) - super(), Override, MRO, Multiple Inheritance
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Implementasi hierarki class Kendaraan -> Mobil / Motor dengan
#             method overriding, pemanggilan super(), pengujian Method
#             Resolution Order (MRO), serta multiple inheritance
#             (KomponenBaterai) pada MobilListrik.
# ==============================================================================


class Kendaraan:
    """Class induk (base class) untuk seluruh jenis kendaraan."""

    def __init__(self, merek: str, tahun: int, kecepatan_maks: int):
        """Constructor class induk: menyimpan identitas dasar kendaraan."""
        self.merek = merek
        self.tahun = tahun
        self.kecepatan_maks = kecepatan_maks

    def info(self) -> str:
        """Menampilkan informasi umum kendaraan."""
        return f"{self.merek} ({self.tahun}) | Kecepatan: {self.kecepatan_maks} km/jam"

    def bergerak(self):
        """Method perilaku dasar yang dapat di-override oleh class anak."""
        print(f"{self.merek} mulai bergerak...")

    def energi(self):
        """Method energi default (di-override pada MobilListrik)."""
        return "Bahan Bakar Minyak"


class Mobil(Kendaraan):
    """Class anak (subclass): mewarisi seluruh atribut & method Kendaraan."""

    def __init__(self, merek: str, tahun: int, kecepatan_maks: int, jumlah_pintu: int):
        # super() memanggil constructor class induk (Kendaraan)
        super().__init__(merek, tahun, kecepatan_maks)
        self.jumlah_pintu = jumlah_pintu  # atribut khusus class anak

    def info(self) -> str:
        """Method overriding: menambahkan informasi jumlah pintu."""
        return f"{super().info()} | Pintu: {self.jumlah_pintu} | 4 Roda"

    def bergerak(self):
        """Override perilaku bergerak khusus mobil."""
        print(f"Mobil {self.merek} melaju di jalan raya dengan 4 roda.")


class Motor(Kendaraan):
    """Class anak lainnya yang juga mewarisi Kendaraan."""

    def __init__(self, merek: str, tahun: int, kecepatan_maks: int, tipe: str):
        super().__init__(merek, tahun, kecepatan_maks)
        self.tipe = tipe  # matic / bebek / sport

    def info(self) -> str:
        """Override info untuk menampilkan tipe motor."""
        return f"{super().info()} | Tipe: {self.tipe} | 2 Roda"

    def bergerak(self):
        print(f"Motor {self.merek} melaju dengan lincah di antara kendaraan.")


class KomponenBaterai:
    """Mixin tambahan: kemampuan baterai yang bisa diwariskan ke kelas lain."""

    def kapasitas_baterai(self) -> int:
        return 75  # kapasitas kWh default

    def isi_ulang(self):
        print(f"Mengisi ulang baterai ({self.kapasitas_baterai()} kWh)...")
        print("Pengisian daya selesai.")


class MobilListrik(Mobil, KomponenBaterai):
    """Multiple inheritance: Mobil + kemampuan baterai."""

    def __init__(self, merek: str, tahun: int, kecepatan_maks: int,
                 jumlah_pintu: int, daya_kwh: int):
        super().__init__(merek, tahun, kecepatan_maks, jumlah_pintu)
        self._daya_kwh = daya_kwh

    def energi(self):
        """Override: mobil listrik tidak memakai BBM."""
        return "Energi Listrik"

    def kapasitas_baterai(self) -> int:
        return self._daya_kwh

    def info(self) -> str:
        return f"{super().info()} | Energi: {self.energi()} ({self._daya_kwh} kWh)"


# --- PROGRAM UTAMA ---
if __name__ == "__main__":
    print("--- 1. Pewarisan & Method Overriding ---")
    kendaraan = Kendaraan("Generik", 2020, 120)
    avanza = Mobil("Toyota Avanza", 2022, 180, 5)
    beat = Motor("Honda Beat", 2023, 110, "Matic")

    print(kendaraan.info())
    print(avanza.info())
    print(beat.info())

    kendaraan.bergerak()
    avanza.bergerak()
    beat.bergerak()

    print("\n--- 2. Pengujian isinstance() & issubclass() ---")
    print("avanza adalah Mobil     :", isinstance(avanza, Mobil))
    print("avanza adalah Kendaraan :", isinstance(avanza, Kendaraan))
    print("beat adalah Mobil       :", isinstance(beat, Mobil))
    print("Mobil subclass Kendaraan:", issubclass(Mobil, Kendaraan))
    print("Motor subclass Kendaraan:", issubclass(Motor, Kendaraan))

    print("\n--- 3. Multiple Inheritance & MRO ---")
    tesla = MobilListrik("Tesla Model 3", 2024, 250, 4, 82)
    print(tesla.info())
    tesla.isi_ulang()
    print("MRO MobilListrik:", [c.__name__ for c in MobilListrik.__mro__])

    print("\n--- 4. Latihan Mandiri: Subclass Truk ---")
    class Truk(Mobil):
        """Subclass mobil khusus untuk angkutan barang."""

        def __init__(self, merek, tahun, kecepatan_maks, jumlah_pintu, kapasitas_ton):
            super().__init__(merek, tahun, kecepatan_maks, jumlah_pintu)
            self.kapasitas_ton = kapasitas_ton

        def info(self):
            return f"{super().info()} | Kapasitas: {self.kapasitas_ton} ton"

        def muat_barang(self):
            print(f"Truk {self.merek} memuat barang max {self.kapasitas_ton} ton.")

    tronton = Truk("Hino Ranger", 2021, 90, 2, 10)
    print(tronton.info())
    tronton.muat_barang()
    print("tronton tetap turunan Kendaraan:", isinstance(tronton, Kendaraan))
