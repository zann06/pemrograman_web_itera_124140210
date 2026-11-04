# ===================================================
# Berkas : latihan3_tebak.py
# Latihan Mandiri 3: Game Tebak Angka Rahasia Sederhana
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

# Angka rahasia yang harus ditebak (ditetapkan di awal program)
angka_rahasia = 7
tebakan_benar = False

print("=== GAME TEBAK ANGKA RAHASIA ===")
print("Saya sedang memikirkan sebuah angka antara 1 - 100.")
print("Ketik 'exit' untuk menyerah.\n")

# While loop: meminta input tebakan berulang kali hingga benar
while not tebakan_benar:
    tebakan = input("Masukkan tebakan Anda: ")

    # Fitur menyerah opsional agar program tidak harus di-kill
    if tebakan.lower() == "exit":
        print(f"Menyerah! Angka rahasianya adalah {angka_rahasia}.")
        break

    # Validasi sederhana: input wajib angka (input() selalu menghasilkan str)
    if not tebakan.isdigit():
        print("Input tidak valid! Masukkan angka saja.\n")
        continue

    tebakan_angka = int(tebakan)

    # Percabangan: bandingkan tebakan dengan angka rahasia
    if tebakan_angka < angka_rahasia:
        print("Terlalu kecil!\n")
    elif tebakan_angka > angka_rahasia:
        print("Terlalu besar!\n")
    else:
        print("Selamat, tebakan benar!")
        tebakan_benar = True
        break  # hentikan loop karena tebakan sudah tepat

print("Terima kasih sudah bermain!")
