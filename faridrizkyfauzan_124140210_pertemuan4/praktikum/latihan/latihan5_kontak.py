# ===================================================
# Berkas : latihan5_kontak.py
# Latihan Mandiri 5: Katalog Kontak Sederhana
# Nama   : Farid Rizky Fauzan
# NIM    : 124140210
# ===================================================

# Dictionary kontak: key = nama, value = nomor telepon
daftar_kontak = {
    "Budi Santoso": "081234567890",
    "Siti Rahma": "082198765432",
    "Rian Pratama": "081377712345",
}


def tampilkan_menu() -> None:
    """Mencetak daftar menu program kontak."""
    print("\n=== KATALOG KONTAK SEDERHANA ===")
    print("1. Tampilkan semua kontak")
    print("2. Tambah kontak baru")
    print("3. Cari kontak berdasarkan nama")
    print("4. Keluar")


def tampilkan_semua_kontak(kontak: dict) -> None:
    """Menampilkan seluruh kontak yang tersimpan dalam tabel sederhana.

    Parameter:
        kontak (dict): dictionary berisi pasangan (nama, nomor telepon)
    """
    print(f"\nDaftar Kontak ({len(kontak)} orang):")
    print("-" * 40)
    print(f"{'No':<4}{'Nama':<22}{'Nomor Telepon':<14}")
    print("-" * 40)
    for nomor, (nama, telepon) in enumerate(kontak.items(), start=1):
        print(f"{nomor:<4}{nama:<22}{telepon:<14}")
    print("-" * 40)


def tambah_kontak(kontak: dict, nama: str, telepon: str) -> None:
    """Menambahkan kontak baru ke dictionary kontak.

    Parameter:
        kontak (dict): dictionary kontak yang akan diperbarui
        nama   (str) : nama kontak baru
        telepon(str) : nomor telepon kontak baru
    """
    if nama in kontak:
        print(f"Kontak '{nama}' sudah ada! Nomor lama: {kontak[nama]}")
        konfirmasi = input("Perbarui nomornya? (y/t): ").lower()
        if konfirmasi == "y":
            kontak[nama] = telepon
            print("Kontak berhasil diperbarui.")
        else:
            print("Penambahan dibatalkan.")
    else:
        kontak[nama] = telepon
        print(f"Kontak '{nama}' berhasil ditambahkan.")


def cari_kontak(kontak: dict, nama: str) -> None:
    """Mencari nomor telepon berdasarkan nama kontak menggunakan .get().

    Parameter:
        kontak (dict): dictionary kontak yang akan dicari
        nama   (str) : nama kontak yang dicari
    """
    # .get() lebih aman daripada kontak[nama] karena tidak memicu KeyError
    nomor = kontak.get(nama, None)
    if nomor is not None:
        print(f"Nomor telepon {nama}: {nomor}")
    else:
        print(f"Kontak dengan nama '{nama}' tidak ditemukan.")


# ---------------------------------------------------
# Program utama: loop menu sederhana
# ---------------------------------------------------
print("Selamat datang di program katalog kontak!")

while True:
    tampilkan_menu()
    pilihan = input("Pilih menu (1-4): ")

    if pilihan == "1":
        tampilkan_semua_kontak(daftar_kontak)
    elif pilihan == "2":
        nama_baru = input("Nama kontak baru : ")
        nomor_baru = input("Nomor telepon    : ")
        tambah_kontak(daftar_kontak, nama_baru, nomor_baru)
    elif pilihan == "3":
        nama_cari = input("Masukkan nama yang dicari: ")
        cari_kontak(daftar_kontak, nama_cari)
    elif pilihan == "4":
        print("Sampai jumpa!")
        break
    else:
        print("Pilihan tidak valid, silakan pilih 1-4.")
