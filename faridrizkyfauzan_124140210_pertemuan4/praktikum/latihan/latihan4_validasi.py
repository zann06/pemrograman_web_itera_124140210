# ===================================================
# Berkas : latihan4_validasi.py
# Latihan Mandiri 4: Fungsi Validator Password
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================


def validasi_password(password: str) -> bool:
    """Memvalidasi kekuatan sebuah password.

    Aturan yang dicek:
      1. Panjang minimal 8 karakter.
      2. Mengandung setidaknya satu angka.

    Parameter:
        password (str): password yang akan diuji

    Kembalian:
        bool: True jika password memenuhi seluruh aturan,
              False jika tidak.
    """
    # Cek panjang minimal 8 karakter
    if len(password) < 8:
        return False

    # Cek minimal satu angka menggunakan operator keanggotaan `in`
    ada_angka = any(karakter.isdigit() for karakter in password)
    if not ada_angka:
        return False

    return True


# ---------------------------------------------------
# Uji fungsi dengan beberapa password valid dan tidak valid
# ---------------------------------------------------
daftar_uji = [
    "rahasia123",   # valid: 11 karakter, ada angka
    "Password99",   # valid: 10 karakter, ada angka
    "abc123",       # tidak valid: hanya 6 karakter
    "helloworld",   # tidak valid: tidak ada angka
    "pass1",        # tidak valid: terlalu pendek dan sebenarnya ada angka
    "12345678",     # valid: 8 karakter dan terdiri dari angka
]

print("=== PENGUJIAN VALIDASI PASSWORD ===")
for password in daftar_uji:
    hasil = validasi_password(password)
    status = "VALID" if hasil else "TIDAK VALID"
    print(f"Password '{password}' (panjang {len(password)}) -> {status}")

# Uji lewat input pengguna juga
print()
password_pengguna = input("Coba masukkan password Anda sendiri: ")
if validasi_password(password_pengguna):
    print("Password Anda VALID (>= 8 karakter dan mengandung angka).")
else:
    print("Password Anda TIDAK VALID (wajib >= 8 karakter dan mengandung minimal 1 angka).")
