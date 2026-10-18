# Praktikum Pertemuan 3 - React Basics

Tujuh topik materi Pertemuan 3 dalam satu aplikasi. Setiap topik punya
penjelasan singkat, potongan kode, dan demo interaktif yang bisa langsung
diklik di halaman.

| | |
|---|---|
| Nama | Farid Rizky Fauzan |
| NIM | 124140210 |
| Kelas | RA |
| Praktikum | Pemrograman Web - Teknik Informatika ITERA |

---

## Cara Menjalankan

Prasyarat: **Node.js 18 atau lebih baru** (diuji pada Node 25).

```bash
cd faridrizkyfauzan_124140210_pertemuan3/01-praktikum-react-basics

npm install
npm run dev
```

Browser terbuka otomatis di `http://localhost:5173`.

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan dengan hot reload |
| `npm run build` | Build produksi ke folder `dist/` |
| `npm run preview` | Menjalankan hasil build |
| `npm test` | Menjalankan smoke test seluruh halaman |

---

## Daftar Topik

| # | Topik | Yang Didemokan |
|---|---|---|
| 1 | Setup Project React | Perintah Vite, struktur folder, sintaks JSX, aturan yang sering terlewat |
| 2 | Components & Props | Props, `children`, komposisi komponen, `key` pada list |
| 3 | State & Hooks | `useState`, primitive vs objek, derived state, `useEffect` dan cleanup |
| 4 | React Router | `Routes`/`Route`, nested route + `Outlet`, `useParams`, `useNavigate`, HashRouter vs BrowserRouter |
| 5 | Custom Hook | `useCounter`, `useDebounce`, `useToggle`, aturan pemanggilan hook |
| 6 | Context API | Props drilling, provider, consumer, optimasi dengan `useMemo` |
| 7 | Testing | Vitest + RTL, pola `describe`/`it`, query berbasis aksesibilitas |

### Yang bisa dicoba langsung

- **Topik 1** - pilih bahasa template, klik tombol untuk melihat state berubah
- **Topik 2** - satu komponen `Tombol` dipakai berulang dengan props berbeda; klik buku untuk melihat `key`
- **Topik 3** - log `useEffect` yang diperbarui setiap nilai berubah, dan timer dengan cleanup
- **Topik 4** - klik tautan buku untuk berpindah route tanpa reload halaman
- **Topik 5** - ketik cepat pada input untuk melihat debounce menahan perubahan
- **Topik 6** - klik tombol di level 1, lihat angka total berubah di level 3
- **Topik 7** - kosongkan form untuk melihat pesan error muncul

---

## Struktur Folder

```
01-praktikum-react-basics/
├── index.html
├── package.json
├── vite.config.js              # Vite + konfigurasi Vitest
└── src/
    ├── main.jsx                # Entry point
    ├── App.jsx                 # Sidebar + routing 7 topik
    ├── setupTests.js           # Setup environment test
    ├── components/
    │   └── CodeBlock.jsx       # Penampil potongan kode
    ├── topics/
    │   ├── Topic1.jsx          # Setup Project React
    │   ├── Topic2.jsx          # Components & Props
    │   ├── Topic3.jsx          # State & Hooks
    │   ├── Topic4.jsx          # React Router
    │   ├── Topic5.jsx          # Custom Hook
    │   ├── Topic6.jsx          # Context API
    │   └── Topic7.jsx          # Testing
    ├── __tests__/
    │   └── App.test.jsx        # 15 smoke test
    └── styles/
        └── global.css          # Token warna + kelas utilitas
```

Satu file per topik, tanpa subfolder, karena setiap topik cukup satu halaman.
Menambah topik baru cukup membuat `Topic8.jsx` dan menambah satu baris di
daftar `TOPIK` pada `App.jsx` - route dan menu sidebar ikut terbentuk.

---

## Testing

Project ini memakai Vitest dengan 15 smoke test. Tujuannya bukan menguji
setiap logika, melainkan memastikan **setiap halaman benar-benar bisa dirender
tanpa error runtime** - kesalahan yang tidak akan terlihat oleh build, seperti
nama variabel salah ketik atau hook yang dipanggil di tempat tidak valid.

```bash
npm test
```

> **Catatan:** Topik 4 memakai `useNavigate`, `useParams`, dan `<Outlet />`,
> jadi test merendernya di dalam `MemoryRouter`.

---

## Catatan Teknis

**Mengapa `HashRouter`?** API-nya sama dengan `BrowserRouter`, tetapi URL-nya
berawalan `/#/` sehingga tidak butuh konfigurasi rewrite di server. Aplikasi
tetap bisa dibuka dari hosting statis maupun langsung dari folder `dist/`.

**Mengapa satu file CSS global?** Praktikum ini butuh dasar yang konsisten,
bukan sistem desain. Token warna disimpan sebagai custom property sehingga
tema gelap cukup menimpa nilainya, dan utility class seperti `.btn`, `.input`,
`.badge` dipakai ulang di seluruh halaman.

---

## Lisensi

MIT - lihat file [`LICENSE`](LICENSE).