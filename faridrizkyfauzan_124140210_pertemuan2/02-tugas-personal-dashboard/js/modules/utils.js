/* =========================================================
   MODUL: utils.js
   Fungsi-fungsi utilitas pembantu.

   SEMUA fungsi ditulis dengan arrow function.
   Demonstrasi: modularitas, reusability, dan arrow function.
   ========================================================= */

/** Generate id unik sederhana (tanpa dependency) */
export const generateId = (prefix = "id") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** Format tanggal menjadi string lokal Indonesia */
export const formatDate = (input) => {
  if (!input) return "—";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

/**
 * Format tanggal menjadi "relative" (misal: "3 hari lagi").
 *
 * Menerima objek Date / string / timestamp.
 * Angka bulat (misal `5`) diperlakukan sebagai JUMLAH HARI,
 * bukan timestamp — supaya `formatRelative(5)` tidak terbaca sebagai 1970.
 *
 * @param {Date|string|number} input
 * @returns {string}
 */
export const formatRelative = (input) => {
  if (input === null || input === undefined || input === "") return "Tanpa tenggat";

  // Angka bulat = jumlah hari (bukan milidetik sejak epoch)
  const diffDays =
    typeof input === "number" && Number.isInteger(input)
      ? input
      : (() => {
          const date = input instanceof Date ? input : new Date(input);
          if (Number.isNaN(date.getTime())) return null;
          return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
        })();

  if (diffDays === null) return "—";

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  if (diffDays === -1) return "Kemarin";
  if (diffDays > 0) return `${diffDays} hari lagi`;
  return `Terlambat ${Math.abs(diffDays)} hari`;
};

/** Format angka menjadi Rupiah */
export const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number ?? 0);

/** Ubah huruf pertama menjadi kapital */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** Escape HTML agar aman dari XSS saat menyisipkan ke innerHTML */
export const escapeHTML = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

/** Potong teks panjang */
export const truncate = (text, limit = 80) => {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

/** Ubah string YYYY-MM-DD menjadi format Indonesia */
export const formatInputDate = (input) => {
  if (!input) return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

/** Hitung inisial untuk avatar (maks 2 huruf) */
export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => capitalize(word.charAt(0)))
    .join("")
    .toUpperCase() || "?";

/** Delay helper untuk simulasi proses (digunakan pada demo) */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Bangun string multi-baris dari array */
export const joinLines = (items = []) => items.join("\n");

/* --- Arrow function tambahan: Higher-Order Function --- */

/** Buat fungsi yang menambahkan prefix ke setiap string */
export const withPrefix = (prefix) => (text) => `${prefix}${text}`;

/** Buat predicate function dari threshold (currying sederhana) */
export const isAbove = (threshold) => (value) => value > threshold;