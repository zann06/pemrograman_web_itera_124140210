/* =========================================================
   MODUL: data.js
   Sumber data awal yang diekspor untuk dipakai modul lain.
   Demonstrasi: ES6 Module -> export const
   ========================================================= */

/** Daftar pengguna contoh (dipakai demo Classes & Array Methods) */
export const sampleUsers = [
  { id: 1, name: "John Doe", role: "admin", active: true, age: 28 },
  { id: 2, name: "Jane Smith", role: "user", active: false, age: 24 },
  { id: 3, name: "Alice Johnson", role: "user", active: true, age: 31 },
  { id: 4, name: "Bob Martin", role: "admin", active: true, age: 22 }
];

/** Daftar produk contoh (dipakai demo formatRupiah) */
export const sampleProducts = [
  { id: "P01", name: "Laptop Gaming", price: 15000000, category: "tech" },
  { id: "P02", name: "Mechanical Keyboard", price: 850000, category: "tech" },
  { id: "P03", name: "Ergonomic Chair", price: 2200000, category: "furniture" }
];

/** Konfigurasi API publik gratis (tanpa API key) untuk demo Async */
export const apiConfig = {
  weather: {
    label: "Cuaca (Open-Meteo)",
    // Bandar Lampung / ITERA
    url: "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true"
  },
  quote: {
    label: "Kutipan (DummyJSON)",
    url: "https://dummyjson.com/quotes/random"
  },
  todos: {
    label: "Tugas (JSONPlaceholder)",
    url: "https://jsonplaceholder.typicode.com/todos?_limit=5"
  }
};