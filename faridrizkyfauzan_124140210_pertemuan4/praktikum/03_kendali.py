# ===================================================
# Berkas : 03_kendali.py
# Topik  : Struktur Kendali - if/elif/else, ternary, for, while
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

# 1. Percabangan nilai akademik (if - elif - else)
nilai_ujian = 82
kehadiran_persen = 85

print("--- EVALUASI AKADEMIK ---")
if nilai_ujian >= 80 and kehadiran_persen >= 75:
    grade = "A"
    keterangan = "Lulus dengan Pujian (Sangat Memuaskan)"
elif nilai_ujian >= 70 and kehadiran_persen >= 70:
    grade = "B"
    keterangan = "Lulus Memuaskan"
elif nilai_ujian >= 60 and kehadiran_persen >= 65:
    grade = "C"
    keterangan = "Lulus Cukup"
else:
    grade = "E / D"
    keterangan = "Tidak Memenuhi Syarat Kelulusan"

print(f"Skor: {nilai_ujian} | Presensi: {kehadiran_persen}%")
print(f"Hasil Akhir: Grade {grade} ({keterangan})")

# 2. Ternary operator (conditional expression ringkas)
status_registrasi = "Aktif" if kehadiran_persen >= 75 else "Nonaktif"
print(f"Status Mahasiswa: {status_registrasi}")

# 3. For loop: deret bilangan ganjil dengan continue
print("\n--- DERET BILANGAN GANJIL (1 - 15) DENGAN CONTINUE ---")
for angka in range(1, 16):
    if angka % 2 == 0:
        continue  # lewati bilangan genap
    print(angka, end=" ")
print()  # ganti baris

# 4. For loop dengan enumerate pada daftar framework
frameworks = ["Pyramid", "FastAPI", "Django", "Flask"]
print("\n--- DAFTAR FRAMEWORK PYTHON POPULER ---")
for urutan, item in enumerate(frameworks, start=1):
    print(f"{urutan}. {item}")

# 5. While loop interaktif dengan break dan klausa else
print("\n--- PENCARIAN TARGET ANGKA (WHILE + BREAK + ELSE) ---")
target = 7
hitung = 1
while hitung <= 10:
    print(f"Memeriksa nilai: {hitung}...")
    if hitung == target:
        print(f"--> Target {target} BERHASIL DITEMUKAN pada langkah ke-{hitung}!")
        break
    hitung += 1
else:
    print("Pencarian selesai: Target tidak ditemukan.")

# 6. Nested loop: pola segitiga siku-siku
print("\n--- GENERATOR POLA SEGITIGA SIKU-SIKU ---")
tinggi_segitiga = 5
for baris in range(1, tinggi_segitiga + 1):
    for bintang in range(baris):
        print("* ", end="")
    print()  # newline untuk baris berikutnya
