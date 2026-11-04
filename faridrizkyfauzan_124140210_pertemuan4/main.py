# ===================================================
# Berkas : main.py
# Soal   : 3 - Program Utama Pengguna Modul math_operations
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# Kelas  : RA
# ===================================================
"""Program utama yang mengimpor dan menguji seluruh fungsi
dari modul math_operations menggunakan dua cara impor berbeda.
"""

# --- Cara impor 1: mengimpor seluruh modul dengan alias ---
import math_operations as matops

# --- Cara impor 2: mengimpor fungsi spesifik langsung ke namespace ---
from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin


def main() -> None:
    """Menjalankan pengujian seluruh fungsi modul math_operations."""
    print("=" * 60)
    print("   PROGRAM UTAMA PENGUJIAN MODUL math_operations")
    print("=" * 60)

    # -------------------------------------------------
    # 1. Konstanta PI (akses lewat alias modul)
    # -------------------------------------------------
    print("\n--- 1. KONSTANTA ---")
    print(f"Nilai PI dari modul matops.PI: {matops.PI}")

    # -------------------------------------------------
    # 2. Persegi
    # -------------------------------------------------
    sisi = 7
    print(f"\n--- 2. PERSEGI (sisi = {sisi}) ---")
    print(f"Luas     : {matops.luas_persegi(sisi):.2f}")
    print(f"Keliling : {matops.keliling_persegi(sisi):.2f}")

    # -------------------------------------------------
    # 3. Persegi Panjang
    # -------------------------------------------------
    panjang, lebar = 10, 4.5
    print(f"\n--- 3. PERSEGI PANJANG (panjang = {panjang}, lebar = {lebar}) ---")
    print(f"Luas     : {matops.luas_persegi_panjang(panjang, lebar):.2f}")
    print(f"Keliling : {matops.keliling_persegi_panjang(panjang, lebar):.2f}")

    # -------------------------------------------------
    # 4. Lingkaran
    # -------------------------------------------------
    r = 14
    print(f"\n--- 4. LINGKARAN (r = {r}) ---")
    print(f"Luas     : {matops.luas_lingkaran(r):.2f}")
    print(f"Keliling : {matops.keliling_lingkaran(r):.2f}")

    # -------------------------------------------------
    # 5. Konversi Temperatur (fungsi impor langsung)
    # -------------------------------------------------
    suhu = 100
    print(f"\n--- 5. KONVERSI TEMPERATUR (celsius = {suhu}) ---")
    print(f"Fahrenheit          : {celsius_ke_fahrenheit(suhu):.2f}")
    print(f"Kelvin              : {celsius_ke_kelvin(suhu):.2f}")

    # Pengujian tambahan dengan nilai berbeda
    suhu_lain = 37.5
    print(f"\n[Uji tambahan] celsius = {suhu_lain}")
    print(f"Fahrenheit          : {celsius_ke_fahrenheit(suhu_lain):.2f}")
    print(f"Kelvin              : {celsius_ke_kelvin(suhu_lain):.2f}")

    print("\n" + "=" * 60)
    print("   SELESAI - Seluruh fungsi modul berhasil diuji")
    print("=" * 60)


if __name__ == "__main__":
    main()
