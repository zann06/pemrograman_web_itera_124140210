# ==============================================================================
# Berkas    : 04_encapsulation.py
# Topik     : Encapsulation & Properties - Public, Protected, Private, @property
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Implementasi enkapsulasi pada class RekeningBank dengan atribut
#             public (pemilik, nomor_rekening), protected (_pin), private
#             (__saldo, __riwayat), getter/setter @property untuk validasi
#             saldo, serta pembuktian name mangling.
# ==============================================================================


class RekeningBank:
    """Rekening bank dengan enkapsulasi atribut dan validasi transaksi."""

    def __init__(self, pemilik: str, nomor_rekening: str, saldo_awal: float = 0):
        self.pemilik = pemilik                # PUBLIC: bisa diakses bebas
        self.nomor_rekening = nomor_rekening  # PUBLIC
        self._pin = "1234"                    # PROTECTED: konvensi internal
        self.__saldo = saldo_awal             # PRIVATE: name mangling
        self.__riwayat = []                   # PRIVATE
        if saldo_awal > 0:
            self.__riwayat.append(("SETOR AWAL", saldo_awal))

    # ---------------- GETTER & SETTER DENGAN @property ----------------
    @property
    def saldo(self) -> float:
        """Getter saldo: hanya baca, tidak bisa diubah langsung dari luar."""
        return self.__saldo

    @saldo.setter
    def saldo(self, nilai: float):
        """Setter saldo: menolak nilai negatif sebelum disimpan."""
        if nilai < 0:
            raise ValueError("Saldo tidak boleh negatif!")
        self.__saldo = nilai

    @property
    def riwayat(self) -> tuple:
        """Getter read-only: mengembalikan salinan riwayat transaksi."""
        return tuple(self.__riwayat)

    # ---------------- METHOD BISNIS ----------------
    def setor(self, jumlah: float):
        """Menambah saldo dan mencatat riwayat transaksi."""
        if jumlah <= 0:
            print("Jumlah setor harus lebih dari 0.")
            return
        self.__saldo += jumlah
        self.__riwayat.append(("SETOR", jumlah))
        print(f"Setor Rp{jumlah:,.0f} berhasil. Saldo: Rp{self.__saldo:,.0f}")

    def tarik(self, jumlah: float):
        """Menarik saldo dengan validasi jumlah dan kecukupan saldo."""
        if jumlah <= 0:
            print("Jumlah tarik harus lebih dari 0.")
            return
        if jumlah > self.__saldo:
            print("Saldo tidak mencukupi!")
            return
        self.__saldo -= jumlah
        self.__riwayat.append(("TARIK", jumlah))
        print(f"Tarik Rp{jumlah:,.0f} berhasil. Saldo: Rp{self.__saldo:,.0f}")

    def cek_pin(self, pin: str) -> bool:
        """Memverifikasi PIN (protected) melalui method publik."""
        return pin == self._pin

    def __info_rahasia(self) -> str:
        """Method private (name mangling): hanya dipakai internal class."""
        return f"Saldo rahasia {self.pemilik}: Rp{self.__saldo:,.0f}"

    def cetak_info(self):
        """Menampilkan ringkasan rekening untuk publik."""
        print(f"Pemilik: {self.pemilik} | No. Rek: {self.nomor_rekening} "
              f"| Saldo: Rp{self.__saldo:,.0f}")
        print("Riwayat transaksi:", self.__riwayat)

    def tampilkan_rahasia(self):
        """Membungkus pemanggilan method private agar bisa diuji dari luar."""
        print(self.__info_rahasia())


# --- PROGRAM UTAMA ---
if __name__ == "__main__":
    print("--- 1. Akses Atribut Public, Protected, Private ---")
    rek = RekeningBank("Farid Rizky Fauzan", "124140210-01", 500_000)
    rek.cetak_info()

    print("\nAkses public   -> pemilik:", rek.pemilik)
    print("Akses protected-> _pin   :", rek._pin, "(konvensi, masih bisa diakses)")
    print("Akses private  -> saldo  :", rek.saldo, "(via @property getter)")

    print("\n--- 2. Validasi Melalui Setter @property ---")
    try:
        rek.saldo = -1000
    except ValueError as error:
        print("ValueError:", error)
    rek.saldo = 750_000
    print("Saldo setelah setter valid:", f"Rp{rek.saldo:,.0f}")

    print("\n--- 3. Transaksi dengan Validasi ---")
    rek.setor(250_000)
    rek.tarik(100_000)
    rek.tarik(5_000_000)  # gagal: saldo tidak cukup
    rek.setor(-50_000)    # gagal: nominal tidak valid

    print("\n--- 4. Pembuktian Name Mangling ---")
    print("Atribut privat asli: tidak ada 'rek.__saldo' dari luar -> AttributeError")
    try:
        print(rek.__saldo)
    except AttributeError as error:
        print("AttributeError:", error)
    print("Bentuk mangling    :", rek._RekeningBank__saldo)
    rek.tampilkan_rahasia()

    print("\n--- 5. Latihan Mandiri: Class Karyawan ---")
    class Karyawan:
        """Karyawan dengan validasi gaji minimal Rp 3.200.000."""

        GAJI_MINIMAL = 3_200_000

        def __init__(self, nama: str, gaji: float):
            self.nama = nama
            self.gaji = gaji  # memakai setter di bawah

        @property
        def gaji(self) -> float:
            return self.__gaji

        @gaji.setter
        def gaji(self, nilai: float):
            if nilai < Karyawan.GAJI_MINIMAL:
                raise ValueError(
                    f"Gaji tidak boleh di bawah Rp{Karyawan.GAJI_MINIMAL:,.0f}!"
                )
            self.__gaji = nilai

    budi = Karyawan("Budi Santoso", 4_500_000)
    print(f"{budi.nama} bergaji Rp{budi.gaji:,.0f}")
    try:
        budi.gaji = 2_000_000
    except ValueError as error:
        print("ValueError:", error)
    budi.gaji = 5_000_000
    print(f"Gaji baru {budi.nama}: Rp{budi.gaji:,.0f}")
