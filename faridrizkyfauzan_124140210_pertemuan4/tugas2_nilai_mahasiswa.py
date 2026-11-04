# ===================================================
# Berkas : tugas2_nilai_mahasiswa.py
# Soal   : 2 - Program Pengelolaan Data Nilai Mahasiswa
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# Kelas  : RA
# ===================================================

# Konstanta bobot komponen penilaian
BOBOT_UTS = 0.30
BOBOT_UAS = 0.40
BOBOT_TUGAS = 0.30


def hitung_nilai_akhir(mahasiswa: dict) -> float:
    """Menghitung nilai akhir satu mahasiswa berdasarkan bobot.

    Rumus: Nilai Akhir = (30% * UTS) + (40% * UAS) + (30% * Tugas)

    Parameter:
        mahasiswa (dict): dictionary berisi kunci nilai_uts,
            nilai_uas, dan nilai_tugas.

    Return:
        float: nilai akhir hasil perhitungan berbobot.
    """
    return (
        BOBOT_UTS * mahasiswa["nilai_uts"]
        + BOBOT_UAS * mahasiswa["nilai_uas"]
        + BOBOT_TUGAS * mahasiswa["nilai_tugas"]
    )


def tentukan_grade(nilai_akhir: float) -> str:
    """Menentukan grade huruf A-E dari nilai akhir.

    Kriteria:
        A : nilai akhir >= 80
        B : 70 <= nilai akhir < 80
        C : 60 <= nilai akhir < 70
        D : 50 <= nilai akhir < 60
        E : nilai akhir < 50

    Parameter:
        nilai_akhir (float): nilai akhir hasil perhitungan bobot.

    Return:
        str: grade huruf ('A', 'B', 'C', 'D', atau 'E').
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def cetak_tabel(daftar_mahasiswa: list) -> None:
    """Mencetak daftar mahasiswa dalam format tabel yang rapi.

    Parameter:
        daftar_mahasiswa (list): list berisi dictionary data mahasiswa
            dengan kunci nama, nim, nilai_uts, nilai_uas, nilai_tugas.

    Return:
        None
    """
    garis = "-" * 66
    print(garis)
    print(
        f"{'No':<4}{'Nama':<22}{'NIM':<14}"
        f"{'UTS':>5}{'UAS':>5}{'Tugas':>7}{'Akhir':>8}  {'Grade':^5}"
    )
    print(garis)
    for nomor, mhs in enumerate(daftar_mahasiswa, start=1):
        nilai = hitung_nilai_akhir(mhs)
        grade = tentukan_grade(nilai)
        print(
            f"{nomor:<4}{mhs['nama']:<22}{mhs['nim']:<14}"
            f"{mhs['nilai_uts']:>5}{mhs['nilai_uas']:>5}"
            f"{mhs['nilai_tugas']:>7}{nilai:>8.2f}  {grade:^5}"
        )
    print(garis)


def cari_ekstrem(daftar_mahasiswa: list) -> tuple:
    """Mencari mahasiswa dengan nilai akhir tertinggi dan terendah.

    Parameter:
        daftar_mahasiswa (list): list berisi dictionary data mahasiswa.

    Return:
        tuple: (mahasiswa_tertinggi, nilai_tertinggi,
                mahasiswa_terendah, nilai_terendah).
    """
    nilai_semua = [hitung_nilai_akhir(mhs) for mhs in daftar_mahasiswa]
    nilai_tertinggi = max(nilai_semua)
    nilai_terendah = min(nilai_semua)
    idx_tinggi = nilai_semua.index(nilai_tertinggi)
    idx_rendah = nilai_semua.index(nilai_terendah)
    return (
        daftar_mahasiswa[idx_tinggi],
        nilai_tertinggi,
        daftar_mahasiswa[idx_rendah],
        nilai_terendah,
    )


def main() -> None:
    """Fungsi utama program pengelolaan data nilai mahasiswa."""
    # List berisi minimal 5 dictionary data mahasiswa
    daftar_mahasiswa = [
        {"nama": "Farid Rizky Fauzan", "nim": "124140210",
         "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
        {"nama": "Ahmad Fadhilah", "nim": "121140001",
         "nilai_uts": 75, "nilai_uas": 80, "nilai_tugas": 82},
        {"nama": "Budi Santoso", "nim": "121140002",
         "nilai_uts": 60, "nilai_uas": 65, "nilai_tugas": 70},
        {"nama": "Siti Aminah", "nim": "121140003",
         "nilai_uts": 90, "nilai_uas": 95, "nilai_tugas": 93},
        {"nama": "Dewi Lestari", "nim": "121140004",
         "nilai_uts": 40, "nilai_uas": 55, "nilai_tugas": 60},
        {"nama": "Rian Hidayat", "nim": "121140005",
         "nilai_uts": 55, "nilai_uas": 48, "nilai_tugas": 65},
    ]

    print("=" * 66)
    print("           PROGRAM PENGELOLAAN DATA NILAI MAHASISWA")
    print("      Bobot: 30% UTS + 40% UAS + 30% Tugas")
    print("=" * 66)

    cetak_tabel(daftar_mahasiswa)

    terbaik, nilai_terbaik, terburuk, nilai_terburuk = cari_ekstrem(daftar_mahasiswa)

    print("\nREKAPITULASI:")
    print(
        f"Nilai TERTINGGI : {terbaik['nama']} (NIM {terbaik['nim']}) "
        f"-> {nilai_terbaik:.2f} (Grade {tentukan_grade(nilai_terbaik)})"
    )
    print(
        f"Nilai TERENDAH  : {terburuk['nama']} (NIM {terburuk['nim']}) "
        f"-> {nilai_terburuk:.2f} (Grade {tentukan_grade(nilai_terburuk)})"
    )


if __name__ == "__main__":
    main()
