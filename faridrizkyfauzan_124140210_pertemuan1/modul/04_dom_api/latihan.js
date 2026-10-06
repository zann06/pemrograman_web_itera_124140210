const LT = document.getElementById("latihan");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
LT.innerHTML = `
<section class="p-3 mb-4 border rounded"><b>1 & 2. Form mahasiswa + localStorage</b>
  <div class="grid gap-1 my-2">
    <input id="m-nama" placeholder="Nama (min 3 huruf)" class="border p-1 rounded">
    <input id="m-nim" placeholder="NIM (9 digit)" class="border p-1 rounded">
    <input id="m-nilai" placeholder="Nilai (0-100)" class="border p-1 rounded">
    <p id="m-err" class="text-red-500 text-sm"></p>
    <button id="m-add" class="bg-blue-500 text-white p-1 rounded">Tambah</button>
  </div><ul id="m-list" class="list-disc ml-5"></ul></section>

<section class="p-3 mb-4 border rounded"><b>3 & 5. Search + pagination post API</b>
  <div class="flex gap-2 my-2"><input id="p-cari" placeholder="Cari title..." class="border p-1 rounded flex-1">
  <button id="p-load" class="bg-blue-500 text-white px-3 rounded">Muat</button></div>
  <div id="p-list"></div>
  <div class="flex gap-2 items-center mt-2"><button id="p-prev" class="border px-3 rounded">Previous</button>
  <span id="p-info"></span><button id="p-next" class="border px-3 rounded">Next</button></div></section>

<section class="p-3 mb-4 border rounded"><b>4. Dark mode</b>
  <button id="dm" class="ml-2 border px-3 rounded">Toggle dark mode</button></section>

<section class="p-3 mb-4 border rounded"><b>6. Todo list (localStorage)</b>
  <div class="flex gap-2 my-2"><input id="t-in" placeholder="Tugas baru" class="border p-1 rounded flex-1">
  <button id="t-add" class="bg-green-600 text-white px-3 rounded">Tambah</button></div><ul id="t-list"></ul></section>`;

const $ = id => document.getElementById(id);
const simpan = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const muat = k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };

// 1 & 2
let mhs = muat("mhs");
const renderMhs = () => $("m-list").innerHTML = mhs.map(m => `<li>${esc(m.nama)} - ${esc(m.nim)} - ${m.nilai}</li>`).join("");
$("m-add").addEventListener("click", () => {
  const nama = $("m-nama").value.trim(), nim = $("m-nim").value.trim(), nilai = Number($("m-nilai").value);
  let err = "";
  if (nama.length < 3) err = "Nama minimal 3 karakter.";
  else if (!/^\d{9}$/.test(nim)) err = "NIM harus 9 digit angka.";
  else if ($("m-nilai").value.trim() === "" || isNaN(nilai) || nilai < 0 || nilai > 100) err = "Nilai harus 0-100.";
  $("m-err").textContent = err;
  if (err) return;
  mhs.push({ nama, nim, nilai }); simpan("mhs", mhs); renderMhs();
  ["m-nama", "m-nim", "m-nilai"].forEach(i => $(i).value = "");
});
renderMhs();

// 3 & 5
let posts = [], hal = 1;
const PER = 5;
const renderPosts = () => {
  const q = $("p-cari").value.toLowerCase();
  const hasil = posts.filter(p => p.title.toLowerCase().includes(q));
  const maks = Math.max(1, Math.ceil(hasil.length / PER));
  hal = Math.min(hal, maks);
  $("p-list").innerHTML = hasil.slice((hal - 1) * PER, hal * PER).map(p => `<div class="p-2 mb-1 bg-gray-100 rounded text-sm"><b>${esc(p.title)}</b></div>`).join("") || "Tidak ada data.";
  $("p-info").textContent = `Hal ${hal}/${maks}`;
  $("p-prev").disabled = hal <= 1; $("p-next").disabled = hal >= maks;
};
$("p-load").addEventListener("click", async () => {
  try {
    const r = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!r.ok) throw new Error("HTTP " + r.status);
    posts = await r.json(); hal = 1; renderPosts();
  } catch (e) { $("p-list").innerHTML = `<span class="text-red-500">Gagal: ${esc(e.message)}</span>`; }
});
$("p-cari").addEventListener("input", () => { hal = 1; renderPosts(); });
$("p-prev").addEventListener("click", () => { hal--; renderPosts(); });
$("p-next").addEventListener("click", () => { hal++; renderPosts(); });

// 4
document.head.insertAdjacentHTML("beforeend", "<style>.dark-mode{background:#111827;color:#f3f4f6}.dark-mode .bg-gray-100{background:#1f2937}</style>");
$("dm").addEventListener("click", () => document.body.classList.toggle("dark-mode"));

// 6
let todos = muat("todos");
const renderTodo = () => {
  $("t-list").innerHTML = todos.map((t, i) => `<li class="flex justify-between border-b py-1">
    <label><input type="checkbox" data-i="${i}" ${t.selesai ? "checked" : ""}> <span class="${t.selesai ? "line-through text-gray-400" : ""}">${esc(t.teks)}</span></label>
    <button data-d="${i}" class="text-red-600">Hapus</button></li>`).join("");
};
$("t-add").addEventListener("click", () => {
  const teks = $("t-in").value.trim(); if (!teks) return;
  todos.push({ teks, selesai: false }); simpan("todos", todos); $("t-in").value = ""; renderTodo();
});
$("t-list").addEventListener("click", e => {
  if (e.target.dataset.d !== undefined) todos.splice(+e.target.dataset.d, 1);
  else if (e.target.dataset.i !== undefined) todos[+e.target.dataset.i].selesai = e.target.checked;
  else return;
  simpan("todos", todos); renderTodo();
});
renderTodo();
