/* =========================================================
   MODUL: utils.js
   Kumpulan fungsi utilitas pembantu yang diekspor.
   Demonstrasi: Arrow Functions + const, single-responsibility.
   ========================================================= */

/**
 * Format angka menjadi Rupiah.
 * @param {number} number - angka yang akan diformat
 * @returns {string} contoh: "Rp15.000.000"
 */
export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
};

/**
 * Ubah huruf pertama teks menjadi huruf besar.
 * @param {string} text
 * @returns {string}
 */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Potong teks panjang dengan ellipsis (berguna untuk pratinjau di UI).
 * @param {string} text
 * @param {number} [limit=60]
 * @returns {string}
 */
export const truncate = (text, limit = 60) => {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

/**
 * Ubah string snake_case / spasi menjadi Title Case.
 * @param {string} text
 * @returns {string}
 */
export const toTitleCase = (text) => {
  if (!text) return "";
  return text
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Bangun string multi-baris dari array (alternatif modern dari "\n").
 * @param {Array<unknown>} items
 * @returns {string}
 */
export const formatList = (items = []) => items.join("\n");

/**
 * Bangun objek hasil serialisasi JSON yang rapi untuk ditampilkan di <pre>.
 * @param {unknown} value
 * @returns {string}
 */
export const prettyJSON = (value) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};