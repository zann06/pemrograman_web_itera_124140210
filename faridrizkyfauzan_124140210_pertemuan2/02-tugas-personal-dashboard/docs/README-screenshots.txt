Folder ini berisi screenshot aplikasi untuk laporan tugas.

== Isi folder ==

  01-dashboard-utama.png               Dashboard lengkap (desktop 1440x900)
  02-form-tambah-tugas.png             Modal form tambah tugas
  03-filter-dan-pencarian.png          Pencarian + filter kategori aktif
  04-widget-cuaca-kutipan-jadwal.png   Sidebar: cuaca, kutipan, jadwal, storage
  05-panel-penyimpanan-lokal.png       Panel status localStorage
  06-daftar-fitur-es6.png              Ringkasan fitur ES6+ yang dipakai
  07-tampilan-mobile.png               Tampilan mobile (390x844)

== Cara kerja screenshot ==

Semua gambar diambil dengan Chrome headless (puppeteer-core) pada viewport
1440x900 (desktop) dan 390x844 (mobile) dengan deviceScaleFactor 2.

Data yang tampil di dalam screenshot diambil dari API PUBLIK SUNGGUHAN:

  Cuaca   -> Open-Meteo     (https://api.open-meteo.com)
  Kutipan -> DummyJSON      (https://dummyjson.com)
  Tugas   -> JSONPlaceholder(https://jsonplaceholder.typicode.com)

Karena itu isi screenshot (suhu, kutipan, tanggal) bisa berbeda setiap kali
diambil ulang - itu normal, bukan kesalahan.

== Mengambil ulang secara manual ==

1. Jalankan aplikasi lewat Live Server (WAJIB, jangan file://)
2. Tunggu API selesai termuat (kurang lebih 2 detik)
3. Tekan Win + Shift + S  (Windows)
   atau Cmd + Shift + 4   (macOS)
4. Simpan ke folder docs/screenshots/ dengan nama yang sama
5. Ctrl + F5 untuk memuat ulang halaman (hard refresh)

== Catatan ==

- Ukuran total folder sekitar 4.6 MB
- Format PNG, rasio 2x ( retina ) sehingga teks tetap tajam di layar DPI tinggi
- Gambar sudah tertaut dari README.md pada bagian "Screenshot"