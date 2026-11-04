# ===================================================
# Berkas : password_gen.py
# Latihan Mandiri 6: Modul Generator Password Acak
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

"""
Modul kustom untuk membangkitkan password acak.
Manfaatkan modul bawaan `random` dan `string`
(string.ascii_letters, string.digits, string.punctuation).
"""

import random
import string

# Pool karakter yang digunakan: huruf besar + huruf kecil + angka
KARAKTER = string.ascii_letters + string.digits


def buat_password_acak(panjang: int = 8) -> str:
    """Membangkitkan password acak dari huruf dan angka.

    Parameter:
        panjang (int): panjang password yang diinginkan
                       (default 8 karakter)

    Kembalian:
        str: password acak sepanjang `panjang` karakter
             yang terdiri dari huruf (besar/kecil) dan angka.
    """
    # random.choice memilih satu karakter acak dari pool,
    # diulang sebanyak `panjang` kali lalu digabung dengan join
    password = "".join(random.choice(KARAKTER) for _ in range(panjang))
    return password


def buat_password_kuat(panjang: int = 12) -> str:
    """Membangkitkan password acak yang dijamin mengandung
    huruf besar, huruf kecil, angka, dan karakter spesial.

    Parameter:
        panjang (int): panjang password minimal 4
                       (default 12 karakter)

    Kembalian:
        str: password acak yang kuat sepanjang `panjang` karakter.
    """
    if panjang < 4:
        panjang = 4  # minimal agar semua kategori karakter terpenuhi

    # Pastikan minimal satu karakter dari setiap kategori
    wajib = [
        random.choice(string.ascii_uppercase),
        random.choice(string.ascii_lowercase),
        random.choice(string.digits),
        random.choice(string.punctuation),
    ]

    # Sisa karakter diambil acak dari gabungan seluruh kategori
    pool = string.ascii_letters + string.digits + string.punctuation
    sisa = [random.choice(pool) for _ in range(panjang - len(wajib))]

    password = wajib + sisa
    random.shuffle(password)  # acak posisi agar wajib tidak selalu di depan
    return "".join(password)


# Blok uji mandiri modul: hanya tereksekusi saat dijalankan langsung
if __name__ == "__main__":
    print("[TEST MODUL] Uji coba password_gen:")
    print("Password acak 8 karakter :", buat_password_acak())
    print("Password acak 16 karakter:", buat_password_acak(16))
    print("Password kuat 12 karakter:", buat_password_kuat())
