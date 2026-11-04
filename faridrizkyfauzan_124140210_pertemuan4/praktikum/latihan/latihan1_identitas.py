# ===================================================
# Berkas : latihan1_identitas.py
# Latihan Mandiri 1: Identitas Diri & Eksperimen Print
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

nama = "Farid Rizky Fauzan"
nim = "124140210"
angkatan = 2024
minat_penelitian = "Web Development & Machine Learning"

# Cetak profil dengan pemisah kustom sep=' | '
print("Nama | NIM | Angkatan | Minat Penelitian")
print(nama, nim, angkatan, minat_penelitian, sep=" | ")

# Kartu identitas berbingkai karakter pagar (#) menggunakan escape character
print("\n" + "#" * 48)
print("#\t\tKARTU MAHASISWA\t\t\t#")
print("#" * 48)
print(f"# Nama            : {nama}\t#")
print(f"# NIM             : {nim}\t\t\t#")
print(f"# Angkatan        : {angkatan}\t\t\t\t#")
print(f"# Minat Penelitian: {minat_penelitian}\t#")
print("#" * 48)
