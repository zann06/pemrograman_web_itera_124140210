/* =========================================================
   MODUL: api.js
   Seluruh komunikasi jaringan (fetch) terpusat di satu modul.

   DEMONSTRASI: Async / Await (ES2017)
   - async function  -> selalu mengembalikan Promise
   - await           -> menunggu Promise resolve tanpa ".then"
   - try / catch     -> penanganan error yang bersih
   - Promise.all     -> eksekusi paralel (lebih cepat)
   - AbortController -> timeout agar tidak menggantung selamanya
   ========================================================= */

import { API_ENDPOINTS, LOCATION, REQUEST_TIMEOUT } from "./constants.js";

/* =========================================================
   HELPER: fetch dengan timeout
   ========================================================= */

/**
 * Melakukan fetch dengan batas waktu (timeout).
 * @param {string} url
 * @param {number} [timeout=REQUEST_TIMEOUT] dalam milidetik
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, timeout = REQUEST_TIMEOUT) => {
  // AbortController adalah API modern untuk membatalkan fetch
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    // Bersihkan timer agar tidak membocorkan resource
    clearTimeout(timerId);
  }
};

/**
 * Fetch + validasi HTTP + parse JSON dalam satu langkah.
 * @param {string} url
 * @param {number} [timeout]
 * @returns {Promise<any>}
 */
const fetchJSON = async (url, timeout = REQUEST_TIMEOUT) => {
  const response = await fetchWithTimeout(url, timeout);

  // response.ok false berarti HTTP error (404, 500, dll)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} — ${response.statusText}`);
  }

  return response.json();
};

/* =========================================================
   1. CUACA REAL-TIME — Open-Meteo
   ========================================================= */

/**
 * Peta kode cuaca WMO -> { label, icon }.
 *
 * `icon` adalah NAMA IKON dari modules/icons.js (bukan emoji),
 * supaya tampilan konsisten dengan gaya Lucide/shadcn.
 *
 * Referensi kode: https://open-meteo.com/en/docs
 */
const WEATHER_CODES = {
  0:  { label: "Cerah",              icon: "sun" },
  1:  { label: "Cerah Berawan",      icon: "cloudSun" },
  2:  { label: "Berawan Sebagian",   icon: "cloudSun" },
  3:  { label: "Mendung",            icon: "cloud" },
  45: { label: "Berkabut",           icon: "cloudFog" },
  48: { label: "Kabut Beku",         icon: "cloudFog" },
  51: { label: "Gerimis Ringan",     icon: "cloudRain" },
  53: { label: "Gerimis",            icon: "cloudRain" },
  55: { label: "Gerimis Lebat",      icon: "cloudRain" },
  56: { label: "Gerimis Dingin",     icon: "cloudRain" },
  57: { label: "Gerimis Dingin Lebat", icon: "cloudRain" },
  61: { label: "Hujan Ringan",       icon: "cloudRain" },
  63: { label: "Hujan Sedang",       icon: "cloudRain" },
  65: { label: "Hujan Lebat",        icon: "cloudRain" },
  66: { label: "Hujan Dingin",       icon: "cloudRain" },
  67: { label: "Hujan Dingin Lebat", icon: "cloudRain" },
  71: { label: "Salju Ringan",       icon: "cloudSnow" },
  73: { label: "Salju",              icon: "cloudSnow" },
  75: { label: "Salju Lebat",        icon: "cloudSnow" },
  77: { label: "Beras Salju",        icon: "cloudSnow" },
  80: { label: "Hujan Lokal",        icon: "cloudRain" },
  81: { label: "Hujan Lokal Sedang", icon: "cloudRain" },
  82: { label: "Hujan Lokal Deras",  icon: "cloudRain" },
  85: { label: "Salju Lokal",        icon: "cloudSnow" },
  86: { label: "Salju Lokal Deras",  icon: "cloudSnow" },
  95: { label: "Hujan Badai",        icon: "cloudLightning" },
  96: { label: "Badai + Es",         icon: "cloudLightning" },
  99: { label: "Badai Petir Hebat",  icon: "cloudLightning" }
};

/** Fallback saat kode cuaca tidak dikenal / API gagal. */
const WEATHER_FALLBACK = { label: "Tidak diketahui", icon: "cloud" };

/**
 * Ambil cuaca terkini di lokasi yang dikonfigurasi.
 * @returns {Promise<{location:string, temperature:number, label:string, icon:string, windSpeed:number, time:string}>}
 */
export const getWeather = async () => {
  const data = await fetchJSON(API_ENDPOINTS.weather);
  const w = data.current_weather;
  const meta = WEATHER_CODES[w.weathercode] ?? WEATHER_FALLBACK;

  /* Open-Meteo mengembalikan current_weather.time sebagai STRING ISO
     (contoh: "2026-10-14T23:15"), BUKAN Unix timestamp.
     Jadi JANGAN dikali 1000 — cukup new Date(w.time).
     Kalau dikali 1000 hasilnya NaN dan muncul "Invalid Date". */
  const updatedAt = new Date(w.time);
  const time = Number.isNaN(updatedAt.getTime())
    ? "—"
    : updatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return {
    location: LOCATION.name,
    temperature: Math.round(w.temperature),
    label: meta.label,
    icon: meta.icon,
    windSpeed: w.windspeed,
    time
  };
};

/* =========================================================
   2. KUTIPAN MOTIVASI — DummyJSON
   ========================================================= */

/**
 * Ambil satu kutipan motivasi acak.
 * @returns {Promise<{quote:string, author:string}>}
 */
export const getQuote = async () => {
  const data = await fetchJSON(API_ENDPOINTS.quote);
  return { quote: data.quote, author: data.author };
};

/* =========================================================
   3. TUGAS AWAL — JSONPlaceholder
   ========================================================= */

/**
 * Ambil daftar tugas dari JSONPlaceholder untuk seeding awal.
 * @returns {Promise<Array<{title:string, completed:boolean}>>}
 */
export const getSeedTasks = async () => {
  const data = await fetchJSON(API_ENDPOINTS.todos);

  // Mapping API response -> struktur internal aplikasi
  // setiap item diberi tanggal tenggat bertahap agar terlihat realistis
  return data.map((item, index) => ({
    title: item.title,
    completed: item.completed,
    dueDate: new Date(Date.now() + (index + 1) * 86_400_000).toISOString()
  }));
};

/* =========================================================
   4. FUNGSI TINGKAT TINGGI — SEMUA DATA SEKALIGUS
   ========================================================= */

/**
 * Ambil cuaca, kutipan, dan tugas awal secara PARALEL.
 *
 * Perbandingan waktu:
 *   Sekuential  : 600 + 600 + 600 = ±1800ms  (satu per satu)
 *   Paralel     : max(600,600,600) = ±600ms (bersamaan)
 *
 * @returns {Promise<{weather:object, quote:object, tasks:Array}>}
 */
export const getAllDashboardData = async () => {
  // Destructure hasil Promise.all — setiap elemen dipetakan ke nama variabel
  const [weather, quote, tasks] = await Promise.all([
    getWeather(),
    getQuote(),
    getSeedTasks()
  ]);

  return { weather, quote, tasks };
};

/**
 * Versi "aman" yang tidak melempar error.
 * Setiap sumber di-backup nilai fallback sehingga UI tetap tampil utuh
 * meskipun hanya sebagian API yang gagal.
 *
 * @returns {Promise<{weather:object, quote:object, tasks:Array, errors:string[]}>}
 */
export const getAllDashboardDataSafe = async () => {
  const fallbackWeather = {
    location: LOCATION.name,
    temperature: null,
    label: "Data tidak tersedia",
    icon: "cloudFog",
    windSpeed: null,
    time: null
  };

  const fallbackQuote = { quote: "Gagal memuat kutipan. Periksa koneksi internet.", author: "— offline —" };
  const fallbackTasks = [];

  // allSettled: menunggu SEMUA promise selesai, sukses maupun gagal
  const [weatherResult, quoteResult, tasksResult] = await Promise.allSettled([
    getWeather(),
    getQuote(),
    getSeedTasks()
  ]);

  // Ringkasan setiap hasil ke bentuk seragam
  const errors = [];

  const readResult = (result, fallback, label) => {
    if (result.status === "fulfilled") return result.value;
    errors.push(label);
    return fallback;
  };

  return {
    weather: readResult(weatherResult, fallbackWeather, "cuaca"),
    quote: readResult(quoteResult, fallbackQuote, "kutipan"),
    tasks: readResult(tasksResult, fallbackTasks, "tugas awal"),
    errors
  };
};

/**
 * Ambil kutipan baru (tombol "kutipan lain").
 * @returns {Promise<{quote:string, author:string}>}
 */
export const refreshQuote = async () => getQuote();