/* =========================================================
   MODUL: constants.js
   Seluruh konfigurasi & konstanta aplikasi terkumpul di satu
   tempat agar mudah diubah tanpa menyentuh logika bisnis.

   Demonstrasi: export const untuk immutable config object.
   ========================================================= */

/**
 * Kunci localStorage (NAMA PENDEK).
 *
 * PENTING: jangan tulis prefix "paw2.dashboard" di sini.
 * Prefix/namespacing sudah otomatis ditambahkan oleh class Storage
 * (lihat NAMESPACE di modules/storage.js). Jika ditulis dua kali,
 * kunci menjadi "paw2.dashboard.paw2.dashboard.tasks".
 */
export const STORAGE_KEYS = {
  TASKS: "tasks",
  NOTES: "notes",
  SCHEDULE: "schedule",
  PROFILE: "profile",
  SEEDED: "seeded"
};

/** Konfigurasi lokasi untuk widget cuaca */
export const LOCATION = {
  name: "Bandar Lampung (ITERA)",
  latitude: -5.36,
  longitude: 105.31,
  timezone: "Asia/Jakarta"
};

/** Daftar kategori tugas (dropdown + filter) */
export const TASK_CATEGORIES = [
  { value: "assignment", label: "Tugas", color: "#3b82f6", icon: "📝" },
  { value: "exam", label: "Ujian", color: "#ef4444", icon: "📝" },
  { value: "project", label: "Proyek", color: "#8b5cf6", icon: "🗂️" },
  { value: "reading", label: "Bacaan", color: "#0ea5e9", icon: "📚" },
  { value: "personal", label: "Pribadi", color: "#10b981", icon: "⭐" }
];

/** Prioritas tugas */
export const PRIORITIES = [
  { value: "high", label: "Tinggi", color: "#ef4444", weight: 3 },
  { value: "medium", label: "Sedang", color: "#f59e0b", weight: 2 },
  { value: "low", label: "Rendah", color: "#10b981", weight: 1 }
];

/** Jadwal kuliah default (bisa diedit lewat UI) */
export const DEFAULT_SCHEDULE = [
  { id: "S-1", day: "Senin", time: "08:00", course: "PAW 2", room: "Lab Komputasi", lecturer: "Dosen Pengampu" },
  { id: "S-2", day: "Rabu", time: "10:00", course: "Struktur Data", room: "Ruang 204", lecturer: "Dosen Pengampu" },
  { id: "S-3", day: "Jumat", time: "13:00", course: "Basis Data", room: "Ruang 301", lecturer: "Dosen Pengampu" }
];

/** API publik gratis (tanpa API key) */
export const API_ENDPOINTS = {
  weather: `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&current_weather=true&timezone=Asia%2FJakarta`,
  quote: "https://dummyjson.com/quotes/random",
  todos: "https://jsonplaceholder.typicode.com/todos?_limit=6"
};

/** Konfigurasi timeout untuk fetch (ms) */
export const REQUEST_TIMEOUT = 6000;

/**
 * Data profil mahasiswa default.
 * Bisa diganti kapan saja lewat tombol "Edit Profil" di header —
 * hasil perubahan disimpan ke localStorage dan menimpa nilai ini.
 */
export const DEFAULT_PROFILE = {
  name: "Farid Rizky Fauzan",
  nim: "124140210",
  major: "Teknik Informatika",
  semester: 4
};