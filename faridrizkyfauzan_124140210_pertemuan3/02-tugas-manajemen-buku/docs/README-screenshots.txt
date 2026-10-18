Dokumentasi screenshot - Tugas Pertemuan 3 (Manajemen Buku)
=======================================================

Folder ini menyimpan tangkapan layar untuk laporan praktikum.
Nama file dan isi yang disarankan:


01-koleksi-utama.png
    Halaman Koleksi setelah menekan tombol "Isi data contoh".
    Pastikan kartu ringkasan (Total, Milik, Sedang Baca, Ingin Beli,
    Favorit) dan daftar buku terlihat sekaligus.

02-tambah-buku.png
    Form Tambah Buku terisi sebagian - judul dan penulis sudah terisi,
    kolom tahun diisi. Cursor diarahkan ke dropdown status untuk memperlihatkan daftar pilihannya.

03-validasi-error.png
    Kondisi error: tekan "Tambah Buku" dengan form kosong.
    Dua pesan merah ("Judul buku wajib diisi", "Nama penulis wajib diisi")
    dan border merah pada kedua input harus terlihat.

04-filter-pencarian.png
    Halaman Koleksi dengan kata kunci "react" pada kolom pencarian
    dan filter status "Sedang Baca" aktif.
    Teks "Menampilkan X dari Y buku" juga terlihat.

05-dialog-hapus.png
    Dialog konfirmasi hapus terbuka di tengah layar,
    klik tombol Hapus pada salah satu kartu.

06-halaman-statistik.png
    Halaman Statistik: empat kartu angka, tiga progress bar distribusi
    per status, panel "Penulis paling banyak" dan "Sedang dibaca terlama".

07-tampilan-mobile.png
    Tampilan yang sama dalam ukuran layar sekitar 390 px
    (Chrome DevTools > Toggle device toolbar > iPhone 14).
    Layout berubah menjadi satu kolom.


Cara membuat screenshot
-----------------------

1. Jalankan aplikasi:
       cd faridrizkyfauzan_124140210_pertemuan3/02-tugas-manajemen-buku
       npm run dev

2. Buka http://localhost:5174

3. Untuk screenshot tampilan mobile, buka DevTools (F12),
   klik ikon Toggle device toolbar, lalu pilih iPhone 14.

4. Simpan hasil ke folder ini dengan nama file di atas.


Laporan testing
---------------

Screenshot hasil eksekusi unit test diambil dari terminal:

    npm test

Keluarannya berbentuk:

     Test Files  9 passed (9)
          Tests  73 passed (73)
       Duration  12.12s

Simpan tangkapan layar terminal tersebut sebagai:
    08-laporan-testing.png