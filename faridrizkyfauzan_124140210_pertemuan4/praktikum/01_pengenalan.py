# ===================================================
# Berkas : 01_pengenalan.py
# Topik  : Pengenalan & Eksekusi Python - sintaks dasar dan print()
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

# 1. Output string sederhana
print("Hello, World!")
print("Selamat datang di Praktikum Pemrograman Web ITERA!")

# 2. Mencetak beberapa argumen sekaligus (dipisahkan spasi secara default)
nama_praktikan = "Farid Rizky Fauzan"
nim_praktikan = 124140210
print("Nama:", nama_praktikan, "| NIM:", nim_praktikan)

# 3. Kustomisasi pemisah (separator) dengan parameter sep
print("Teknik", "Informatika", "ITERA", sep=" -> ")

# 4. Kustomisasi karakter akhir baris dengan parameter end
print("Memuat data", end="... ")
print("Selesai!")

# 5. Karakter escape: \n baris baru, \t tabulasi
print("\nDaftar Mata Kuliah:\n\t1. Pemrograman Web\n\t2. Basis Data")
