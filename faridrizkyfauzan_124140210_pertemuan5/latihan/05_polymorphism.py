# ==============================================================================
# Berkas    : 05_polymorphism.py
# Topik     : Polymorphism & Overriding - Override, Duck Typing, Operator Overloading
# Nama      : Farid Rizky Fauzan
# NIM       : 124140210
# Kelas     : RA
# Deskripsi : Demonstrasi polymorphism melalui method overriding pada hierarki
#             MetodePembayaran, duck typing (CryptoPayment), operator
#             overloading (__add__, __eq__, __str__) pada class Dompet, serta
#             latihan broadcast notifikasi multi-kanal.
# ==============================================================================


class MetodePembayaran:
    """Base class metode pembayaran."""

    def __init__(self, nama_pemilik: str):
        self.nama_pemilik = nama_pemilik

    def bayar(self, jumlah: float) -> bool:
        """Method placeholder yang akan di-override oleh setiap subclass."""
        raise NotImplementedError("Subclass wajib mengimplementasikan bayar()")

    def __str__(self) -> str:
        return f"{self.__class__.__name__} milik {self.nama_pemilik}"


class TransferBank(MetodePembayaran):
    """Pembayaran melalui transfer bank."""

    def __init__(self, nama_pemilik: str, nomor_rekening: str):
        super().__init__(nama_pemilik)
        self.nomor_rekening = nomor_rekening

    def bayar(self, jumlah: float) -> bool:
        print(f"[Transfer Bank] Rp{jumlah:,.0f} ditransfer dari rek {self.nomor_rekening}")
        return True


class EWallet(MetodePembayaran):
    """Pembayaran melalui dompet digital (e-wallet)."""

    def __init__(self, nama_pemilik: str, provider: str, saldo: float):
        super().__init__(nama_pemilik)
        self.provider = provider
        self.saldo = saldo

    def bayar(self, jumlah: float) -> bool:
        """Override: e-wallet harus mengecek kecukupan saldo terlebih dahulu."""
        if jumlah > self.saldo:
            print(f"[{self.provider}] SALDO TIDAK CUKUP untuk Rp{jumlah:,.0f}")
            return False
        self.saldo -= jumlah
        print(f"[{self.provider}] Rp{jumlah:,.0f} dibayar, sisa saldo Rp{self.saldo:,.0f}")
        return True


class CryptoPayment:
    """Bukan subclass MetodePembayaran -> pembuktian DUCK TYPING.

    Asalkan objek punya method bayar(), ia bisa dipakai di tempat yang sama.
    """

    def __init__(self, wallet_address: str, jaringan: str):
        self.wallet_address = wallet_address
        self.jaringan = jaringan

    def bayar(self, jumlah: float) -> bool:
        print(f"[Crypto {self.jaringan}] Bayar Rp{jumlah:,.0f} dari {self.wallet_address}")
        return True


class VirtualAccount(MetodePembayaran):
    """Tambahan latihan: metode pembayaran virtual account."""

    def __init__(self, nama_pemilik: str, kode_va: str):
        super().__init__(nama_pemilik)
        self.kode_va = kode_va

    def bayar(self, jumlah: float) -> bool:
        print(f"[Virtual Account {self.kode_va}] Tagihan Rp{jumlah:,.0f} berhasil dibayar")
        return True


# --- POLYMORPHISM DI LEVEL FUNGSI ---
def proses_semua_pembayaran(metode_list: list, jumlah: float):
    """Satu fungsi, banyak bentuk metode pembayaran yang berbeda."""
    for metode in metode_list:
        berhasil = metode.bayar(jumlah)
        status = "BERHASIL" if berhasil else "GAGAL"
        print(f"  -> Status: {status}\n")


# --- OPERATOR OVERLOADING ---
class Dompet:
    """Dompet berisi saldo dengan dukungan operasi +, ==, dan str()."""

    def __init__(self, nama: str, saldo: float = 0):
        self.nama = nama
        self.saldo = saldo

    def __add__(self, jumlah):
        """Overload operator + : menambah saldo dompet atau menggabung dompet."""
        if isinstance(jumlah, Dompet):
            return Dompet(f"{self.nama} + {jumlah.nama}", self.saldo + jumlah.saldo)
        return Dompet(self.nama, self.saldo + jumlah)

    def __eq__(self, other) -> bool:
        """Overload operator == : dua dompet sama jika saldo sama."""
        if isinstance(other, Dompet):
            return self.saldo == other.saldo
        return NotImplemented

    def __lt__(self, other) -> bool:
        """Overload operator < : membandingkan saldo dompet."""
        return self.saldo < other.saldo

    def __str__(self) -> str:
        return f"Dompet {self.nama}: Rp{self.saldo:,.0f}"


# --- PROGRAM UTAMA ---
if __name__ == "__main__":
    print("--- 1. Polymorphism: Satu Interface, Banyak Bentuk ---")
    metode = [
        TransferBank("Farid Rizky Fauzan", "124140210-01"),
        EWallet("Farid Rizky Fauzan", "DANA", 150_000),
        CryptoPayment("0xABC123", "Ethereum"),
        VirtualAccount("Farid Rizky Fauzan", "8899001"),
    ]
    proses_semua_pembayaran(metode, 200_000)

    print("--- 2. Duck Typing: CryptoPayment Bukan Subclass ---")
    crypto = CryptoPayment("0xDEF456", "Polygon")
    print("isinstance(crypto, MetodePembayaran):", isinstance(crypto, MetodePembayaran))
    print("Namun tetap bisa dipanggil karena punya bayar():")
    crypto.bayar(75_000)

    print("\n--- 3. Operator Overloading pada Class Dompet ---")
    dompet_a = Dompet("Farid", 300_000)
    dompet_b = Dompet("Nabila", 300_000)
    dompet_c = Dompet("Tabungan", 1_000_000)

    print(dompet_a)
    print(dompet_b)
    print("dompet_a + 50_000      :", dompet_a + 50_000)
    print("dompet_a + dompet_c    :", dompet_a + dompet_c)
    print("dompet_a == dompet_b   :", dompet_a == dompet_b)
    print("dompet_a == dompet_c   :", dompet_a == dompet_c)
    print("dompet_a < dompet_c    :", dompet_a < dompet_c)

    print("\n--- 4. Latihan Mandiri: Broadcast Pengumuman Multi-Kanal ---")
    class KanalNotifikasi:
        """Base class kanal notifikasi."""

        def kirim(self, pesan: str):
            raise NotImplementedError

    class EmailNotifikasi(KanalNotifikasi):
        def __init__(self, alamat: str):
            self.alamat = alamat

        def kirim(self, pesan: str):
            print(f"[EMAIL ke {self.alamat}] {pesan}")

    class SMSNotifikasi(KanalNotifikasi):
        def __init__(self, nomor: str):
            self.nomor = nomor

        def kirim(self, pesan: str):
            print(f"[SMS ke {self.nomor}] {pesan}")

    class WhatsAppNotifikasi(KanalNotifikasi):
        def __init__(self, nomor: str):
            self.nomor = nomor

        def kirim(self, pesan: str):
            print(f"[WHATSAPP ke {self.nomor}] {pesan}")

    def broadcast_pengumuman(kanal_list, pesan):
        print(f"Mengirim pengumuman: \"{pesan}\"")
        for kanal in kanal_list:
            kanal.kirim(pesan)

    broadcast_pengumuman(
        [
            EmailNotifikasi("farid.124140210@student.itera.ac.id"),
            SMSNotifikasi("0812-3456-7890"),
            WhatsAppNotifikasi("0812-3456-7890"),
        ],
        "Praktikum PAW Pertemuan 5 dimulai pukul 08.00 WIB.",
    )
