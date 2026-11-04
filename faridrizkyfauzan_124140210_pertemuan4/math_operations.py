# ===================================================
# Berkas : math_operations.py
# Soal   : 3 - Modul Matematika (Geometri & Konversi Suhu)
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# Kelas  : RA
# ===================================================
"""Modul kustom berisi fungsi geometri dan konversi temperatur.

Modul ini menyediakan:
    1. Perhitungan luas dan keliling tiga bentuk geometri:
       persegi, persegi panjang, dan lingkaran.
    2. Dua fungsi konversi temperatur:
       Celsius ke Fahrenheit, dan Celsius ke Kelvin.
    3. Satu variabel konstanta PI.
"""

# Konstanta modul
PI = 3.14159


# ---------------------------------------------------
# A. Geometri: Persegi
# ---------------------------------------------------
def luas_persegi(sisi: float) -> float:
    """Menghitung luas persegi.

    Parameter:
        sisi (float): panjang sisi persegi.

    Return:
        float: luas persegi (sisi * sisi).
    """
    return sisi * sisi


def keliling_persegi(sisi: float) -> float:
    """Menghitung keliling persegi.

    Parameter:
        sisi (float): panjang sisi persegi.

    Return:
        float: keliling persegi (4 * sisi).
    """
    return 4 * sisi


# ---------------------------------------------------
# B. Geometri: Persegi Panjang
# ---------------------------------------------------
def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung luas persegi panjang.

    Parameter:
        panjang (float): panjang sisi horizontal.
        lebar (float): panjang sisi vertikal.

    Return:
        float: luas persegi panjang (panjang * lebar).
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung keliling persegi panjang.

    Parameter:
        panjang (float): panjang sisi horizontal.
        lebar (float): panjang sisi vertikal.

    Return:
        float: keliling persegi panjang (2 * (panjang + lebar)).
    """
    return 2 * (panjang + lebar)


# ---------------------------------------------------
# C. Geometri: Lingkaran
# ---------------------------------------------------
def luas_lingkaran(jari_jari: float) -> float:
    """Menghitung luas lingkaran.

    Parameter:
        jari_jari (float): jari-jari lingkaran.

    Return:
        float: luas lingkaran (PI * r^2).
    """
    return PI * jari_jari ** 2


def keliling_lingkaran(jari_jari: float) -> float:
    """Menghitung keliling lingkaran.

    Parameter:
        jari_jari (float): jari-jari lingkaran.

    Return:
        float: keliling lingkaran (2 * PI * r).
    """
    return 2 * PI * jari_jari


# ---------------------------------------------------
# D. Konversi Temperatur
# ---------------------------------------------------
def celsius_ke_fahrenheit(celsius: float) -> float:
    """Mengonversi suhu dari Celsius ke Fahrenheit.

    Rumus: F = C * 9/5 + 32

    Parameter:
        celsius (float): suhu dalam derajat Celsius.

    Return:
        float: suhu dalam derajat Fahrenheit.
    """
    return celsius * 9 / 5 + 32


def celsius_ke_kelvin(celsius: float) -> float:
    """Mengonversi suhu dari Celsius ke Kelvin.

    Rumus: K = C + 273.15

    Parameter:
        celsius (float): suhu dalam derajat Celsius.

    Return:
        float: suhu dalam derajat Kelvin.
    """
    return celsius + 273.15


# Blok idiom pengujian mandiri modul:
# hanya tereksekusi jika berkas ini dijalankan langsung,
# tidak ikut tereksekusi ketika modul di-import.
if __name__ == "__main__":
    print("[UJI MODUL] math_operations dijalankan langsung:")
    print("Test luas_persegi(5)          =", luas_persegi(5))
    print("Test keliling_persegi(5)      =", keliling_persegi(5))
    print("Test luas_lingkaran(1)        =", luas_lingkaran(1))
    print("Test celsius_ke_fahrenheit(0) =", celsius_ke_fahrenheit(0))
