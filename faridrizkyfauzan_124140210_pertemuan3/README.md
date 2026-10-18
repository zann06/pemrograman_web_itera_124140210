# Pertemuan 3 - React Basics

Topik pertemuan ini adalah **React** - perpindahan dari JavaScript murni
ke framework berbasis komponen. Pengumpulan ini berisi dua bagian, mengikuti
pola Pertemuan 1 dan 2: materi praktikum (tujuh topik interaktif) dan tugas
(aplikasi Manajemen Buku).

| | |
|---|---|
| Nama | Farid Rizky Fauzan |
| NIM | 124140210 |
| Kelas | RA |
| Praktikum | Pemrograman Web - Teknik Informatika ITERA |

---

## Struktur Folder

```
faridrizkyfauzan_124140210_pertemuan3/
├── README.md
├── LICENSE
├── .gitignore
│
├── 01-praktikum-react-basics/        # Materi: 7 topik + demo interaktif
│   ├── README.md
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/CodeBlock.jsx
│       ├── topics/Topic1.jsx ... Topic7.jsx
│       ├── __tests__/App.test.jsx
│       └── styles/global.css
│
└── 02-tugas-manajemen-buku/           # Tugas: Aplikasi Manajemen Buku
    ├── README.md
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── context/BookContext.jsx
        ├── hooks/ (4 custom hook)
        ├── components/ (8 komponen reusable)
        ├── pages/ (Home, Stats, About)
        ├── utils/ (constants, validasi, format)
        ├── styles/global.css
        └── __tests__/ (73 unit test)
```

Kedua folder adalah project Vite terpisah, masing-masing dengan
`node_modules` dan `package.json` sendiri.

---

## Cara Menjalankan

```bash
# Praktikum - http://localhost:5173
cd 01-praktikum-react-basics
npm install
npm run dev

# Tugas - http://localhost:5174
cd ../02-tugas-manajemen-buku
npm install
npm run dev
```

Rincian lengkap ada di README masing-masing folder.

---

## Ringkasan Isi

| Bagian | Isi | Pengujian |
|---|---|---|
| Praktikum | 7 topik React, tiap topik punya penjelasan, kode contoh, dan demo yang bisa diklik | 15 smoke test |
| Tugas | Aplikasi manajemen buku pribadi dengan CRUD, filter, pencarian, dan statistik | 73 unit test |

**Total 88 pengujian otomatis, semuanya lulus.**

---

## Dependensi yang Digunakan

| Paket | Versi | Dipakai di |
|---|---|---|
| react / react-dom | 19.1 | keduanya |
| react-router-dom | 7.9 | keduanya |
| prop-types | 15.8 | keduanya |
| vite | 7.3 | keduanya |
| vitest | 3.2 / 4.1 | keduanya |
| @testing-library/react | 16.3 | keduanya |
| jsdom | 27 / 29 | keduanya |

---

## Lisensi

MIT - lihat file [`LICENSE`](LICENSE).