# ===================================================
# Berkas : main.py
# Latihan Mandiri 6: Program Penguji Modul password_gen
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

"""
Program utama untuk menguji modul password_gen.
Dijalankan dari folder latihan/ dengan:

    python main.py
"""

# Mengimpor seluruh modul kustom
import password_gen

# Mengimpor fungsi spesifik langsung dari modul
from password_gen import buat_password_acak

print("=== GENERATOR PASSWORD ACAK ===")
print()

# 1. Password default 8 karakter
pw1 = buat_password_acak()
print(f"Password default (8 karakter) : {pw1}")

# 2. Password dengan panjang kustom
pw2 = buat_password_acak(16)
print(f"Password kustom (16 karakter) : {pw2}")

# 3. Password kuat dari fungsi kedua modul
pw3 = password_gen.buat_password_kuat()
print(f"Password kuat  (12 karakter)  : {pw3}")

# 4. Demo batch: 5 password sekaligus
print("\nBatch 5 password acak (10 karakter):")
for nomor in range(1, 6):
    print(f"  {nomor}. {buat_password_acak(10)}")

# 5. Info kekuatan sederhana berdasarkan panjang
print("\nKategori kekuatan (berdasarkan panjang):")
pw4 = password_gen.buat_password_acak(6)
pw5 = password_gen.buat_password_acak(12)
for password in (pw4, pw5):
    if len(password) < 8:
        kategori = "Lemah"
    elif len(password) < 12:
        kategori = "Sedang"
    else:
        kategori = "Kuat"
    print(f"  {password} (panjang {len(password)}) -> {kategori}")
