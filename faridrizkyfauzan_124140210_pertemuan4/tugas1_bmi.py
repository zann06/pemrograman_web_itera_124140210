# ===================================================
# Berkas : tugas1_bmi.py
# Soal   : 1 - Program Penghitung BMI (Body Mass Index)
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# Kelas  : RA
# ===================================================


def hitung_bmi(berat: float, tinggi: float) -> float:
    """Menghitung nilai BMI dari berat dan tinggi badan.

    Rumus: BMI = berat / (tinggi * tinggi)

    Parameter:
        berat (float): berat badan dalam kilogram (kg).
        tinggi (float): tinggi badan dalam meter (m).

    Return:
        float: nilai BMI hasil perhitungan.
    """
    return berat / (tinggi * tinggi)


def tentukan_kategori(bmi: float) -> str:
    """Menentukan kategori status berat badan berdasarkan nilai BMI.

    Kategori:
        - BMI < 18.5          : Berat badan kurang
        - 18.5 <= BMI < 25    : Berat badan normal
        - 25   <= BMI < 30    : Berat badan berlebih
        - BMI >= 30           : Obesitas

    Parameter:
        bmi (float): nilai BMI hasil perhitungan.

    Return:
        str: kategori status berat badan.
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def baca_angka_positif(prompt: str) -> float:
    """Meminta input angka positif dari pengguna sampai valid.

    Parameter:
        prompt (str): teks perintah yang ditampilkan kepada pengguna.

    Return:
        float: angka positif hasil input pengguna.
    """
    while True:
        try:
            nilai = float(input(prompt))
        except ValueError:
            print("  >> Input harus berupa angka!")
            continue
        if nilai <= 0:
            print("  >> Nilai harus lebih besar dari 0!")
            continue
        return nilai


def main() -> None:
    """Fungsi utama program penghitung BMI."""
    print("=" * 44)
    print("   PROGRAM PENGHITUNG BMI (BODY MASS INDEX)")
    print("=" * 44)

    # Input berat (kg) dan tinggi (m) melalui fungsi input()
    berat = baca_angka_positif("Masukkan berat badan (kg) : ")
    tinggi = baca_angka_positif("Masukkan tinggi badan (m)  : ")

    bmi = hitung_bmi(berat, tinggi)
    kategori = tentukan_kategori(bmi)

    print("\n------ HASIL PERHITUNGAN ------")
    print(f"Berat badan : {berat:.1f} kg")
    print(f"Tinggi badan: {tinggi:.2f} m")
    print(f"Nilai BMI   : {bmi:.2f}")
    print(f"Kategori    : {kategori}")
    print("-" * 44)


if __name__ == "__main__":
    main()
