/* Mini POS - logika utama
 * Alur: validasi form -> simpan ke array keranjang -> simpan ke localStorage -> render ulang tabel & kalkulasi */

const STORAGE_KEY = "mini_pos_keranjang";
const MIN_DISKON = 50000;
const PERSEN_DISKON = 0.1;
const KODE_PROMO = "HEMAT10";

let keranjang = muatKeranjang();

const el = id => document.getElementById(id);
const rupiah = n => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ===== LocalStorage ===== */
function simpanKeranjang() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));      // serialisasi array -> string
}
function muatKeranjang() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));      // deserialisasi string -> array
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];                                                       // data rusak -> mulai kosong
  }
}

/* ===== Validasi ===== */
function tampilkanError(field, pesan) {
  el("err-" + field).textContent = pesan;
  el(field).classList.toggle("invalid", Boolean(pesan));
}
function validasiForm(nama, hargaStr, qtyStr) {
  const err = { nama: "", harga: "", qty: "" };
  const harga = Number(hargaStr);
  const qty = Number(qtyStr);

  if (nama.length === 0) err.nama = "Nama barang wajib diisi.";
  else if (nama.length < 3) err.nama = "Nama barang minimal 3 karakter.";

  if (hargaStr.trim() === "") err.harga = "Harga wajib diisi.";
  else if (isNaN(harga) || harga < 500) err.harga = "Harga harus angka dan minimal Rp 500.";

  if (qtyStr.trim() === "") err.qty = "Jumlah wajib diisi.";
  else if (!Number.isInteger(qty) || qty < 1) err.qty = "Jumlah harus bilangan bulat minimal 1.";

  return { err, valid: !err.nama && !err.harga && !err.qty, harga, qty };
}

/* ===== Kalkulasi ===== */
function hitungTotal() {
  return keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0);
}
function hitungDiskon(total) {
  const kode = el("kode").value.trim().toUpperCase();
  const dapatDiskon = total >= MIN_DISKON || (kode === KODE_PROMO && total > 0);
  return dapatDiskon ? Math.round(total * PERSEN_DISKON) : 0;
}

/* ===== Render ===== */
function renderTabel() {
  const tbody = el("tbody-keranjang");
  if (keranjang.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">Keranjang masih kosong. Tambahkan barang lewat form.</td></tr>`;
    return;
  }
  tbody.innerHTML = keranjang.map((item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(item.nama)}</td>
      <td class="num">${rupiah(item.harga)}</td>
      <td class="num">${item.qty}</td>
      <td class="num">${rupiah(item.harga * item.qty)}</td>
      <td><button class="btn small" data-hapus="${i}" type="button">Hapus</button></td>
    </tr>`).join("");
}
function renderKalkulasi() {
  const total = hitungTotal();
  const diskon = hitungDiskon(total);
  const akhir = total - diskon;
  el("total").textContent = rupiah(total);
  el("diskon").textContent = "- " + rupiah(diskon);
  el("total-akhir").textContent = rupiah(akhir);

  const kode = el("kode").value.trim();
  if (kode && kode.toUpperCase() !== KODE_PROMO) el("info-diskon").textContent = "Kode promo tidak dikenal.";
  else if (diskon > 0) el("info-diskon").textContent = "Diskon 10% diterapkan.";
  else el("info-diskon").textContent = "Diskon 10% otomatis untuk belanja minimal Rp 50.000, atau pakai kode HEMAT10.";

  renderKembalian(akhir);
}
function renderKembalian(totalAkhir) {
  const out = el("kembalian");
  const bayarStr = el("bayar").value.trim();
  out.className = "kembalian";
  if (bayarStr === "") { out.textContent = ""; return; }
  if (totalAkhir === 0) { out.textContent = "Keranjang kosong."; return; }
  const bayar = Number(bayarStr);
  if (isNaN(bayar) || bayar < 0) { out.textContent = "Nominal uang bayar tidak valid."; out.classList.add("kurang"); return; }
  if (bayar < totalAkhir) {
    out.textContent = `Uang belum mencukupi, kurang ${rupiah(totalAkhir - bayar)}.`;
    out.classList.add("kurang");
  } else {
    out.textContent = `Kembalian: ${rupiah(bayar - totalAkhir)}`;
    out.classList.add("ok");
  }
}
function renderSemua() { renderTabel(); renderKalkulasi(); }

/* ===== Event ===== */
el("form-barang").addEventListener("submit", e => {
  e.preventDefault();
  const nama = el("nama").value.trim();
  const { err, valid, harga, qty } = validasiForm(nama, el("harga").value, el("qty").value);
  tampilkanError("nama", err.nama);
  tampilkanError("harga", err.harga);
  tampilkanError("qty", err.qty);
  if (!valid) return;                       // data salah -> tidak masuk keranjang

  keranjang.push({ nama, harga, qty });
  simpanKeranjang();
  e.target.reset();                         // form otomatis di-reset
  renderSemua();
  el("nama").focus();
});

el("tbody-keranjang").addEventListener("click", e => {
  const idx = e.target.dataset.hapus;
  if (idx === undefined) return;
  keranjang.splice(Number(idx), 1);
  simpanKeranjang();
  renderSemua();                            // total & diskon terhitung ulang
});

el("kode").addEventListener("input", renderKalkulasi);
el("bayar").addEventListener("input", renderKalkulasi);

el("btn-reset").addEventListener("click", () => {
  keranjang = [];
  localStorage.removeItem(STORAGE_KEY);
  el("kode").value = "";
  el("bayar").value = "";
  ["nama", "harga", "qty"].forEach(f => tampilkanError(f, ""));
  renderSemua();
});

renderSemua();
