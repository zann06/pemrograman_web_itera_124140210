# ===================================================
# Berkas : kalkulator_lib.py
# Topik  : Modul kustom penyedia fungsi-fungsi aritmatika
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================


def tambah(a: float, b: float) -> float:
    """Mengembalikan hasil penjumlahan a + b."""
    return a + b


def kurang(a: float, b: float) -> float:
    """Mengembalikan hasil pengurangan a - b."""
    return a - b


def kali(a: float, b: float) -> float:
    """Mengembalikan hasil perkalian a * b."""
    return a * b


def bagi(a: float, b: float):
    """Mengembalikan hasil pembagian a / b.

    Dilengkapi guard clause untuk mencegah ZeroDivisionError
    ketika pembagi bernilai nol.
    """
    if b == 0:
        return "Error: Tidak dapat membagi dengan angka nol!"
    return a / b


# Blok idiom pengujian mandiri modul: hanya tereksekusi
# ketika berkas ini dijalankan langsung dari terminal,
# tidak ikut tereksekusi ketika di-import oleh file lain.
if __name__ == "__main__":
    print("[TEST MODUL] Menjalankan uji coba internal kalkulator_lib:")
    print("Test 10 + 5 =", tambah(10, 5))
    print("Test 10 / 0 =", bagi(10, 0))
