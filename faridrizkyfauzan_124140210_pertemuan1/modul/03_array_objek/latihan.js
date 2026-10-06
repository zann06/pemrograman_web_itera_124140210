const LT = document.getElementById("latihan");
const box = (judul, isi) => LT.insertAdjacentHTML("beforeend", `<div class="p-3 mb-3 border rounded overflow-x-auto"><b>${judul}</b><div>${isi}</div></div>`);

let daftarMhs = [
  { nama: "Andi", nim: "124140001", jurusan: "Teknik Informatika", nilai: 82 },
  { nama: "Budi", nim: "124140002", jurusan: "Teknik Informatika", nilai: 91 },
  { nama: "Citra", nim: "124140003", jurusan: "Sistem Informasi", nilai: 67 },
  { nama: "Dewi", nim: "124140004", jurusan: "Teknik Elektro", nilai: 78 },
  { nama: "Eko", nim: "124140005", jurusan: "Teknik Informatika", nilai: 55 },
];
const tabel = arr => `<table class="w-full text-sm border mt-2"><tr class="bg-gray-100">
  <th class="border p-1">Nama</th><th class="border p-1">NIM</th><th class="border p-1">Jurusan</th><th class="border p-1">Nilai</th></tr>` +
  arr.map(m => `<tr><td class="border p-1">${m.nama}</td><td class="border p-1">${m.nim}</td><td class="border p-1">${m.jurusan}</td><td class="border p-1">${m.nilai}</td></tr>`).join("") + `</table>`;

// 1. Tabel HTML
box("1. Tabel mahasiswa", tabel(daftarMhs));

// 2. Nilai tertinggi (reduce)
const tertinggi = daftarMhs.reduce((max, m) => m.nilai > max.nilai ? m : max);
box("2. Nilai tertinggi", `${tertinggi.nama} (${tertinggi.nilai})`);

// 3. Di atas rata-rata (filter)
const rata = daftarMhs.reduce((s, m) => s + m.nilai, 0) / daftarMhs.length;
box(`3. Di atas rata-rata (${rata.toFixed(2)})`, tabel(daftarMhs.filter(m => m.nilai > rata)));

// 4. Urutkan berdasarkan nama
function urutkanNama(arr, arah = "asc") {
  return [...arr].sort((a, b) => arah === "asc" ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama));
}
box("4. Urut nama", `<b>ASC:</b> ${urutkanNama(daftarMhs).map(m => m.nama).join(", ")}<br><b>DESC:</b> ${urutkanNama(daftarMhs, "desc").map(m => m.nama).join(", ")}`);

// 5. CRUD sederhana
LT.insertAdjacentHTML("beforeend", `<div class="p-3 mb-3 border rounded"><b>5. CRUD Mahasiswa</b>
  <div class="flex flex-wrap gap-2 my-2">
    <input id="c-nama" placeholder="Nama" class="border p-1 rounded">
    <input id="c-nim" placeholder="NIM" class="border p-1 rounded">
    <input id="c-nilai" type="number" placeholder="Nilai" class="border p-1 rounded w-24">
    <button id="c-simpan" class="bg-blue-500 text-white px-3 rounded">Simpan</button>
  </div><div id="c-list"></div></div>`);
let editIdx = -1;
const renderCrud = () => {                                                                           // Read
  document.getElementById("c-list").innerHTML = daftarMhs.map((m, i) =>
    `<div class="flex justify-between border-b py-1"><span>${m.nama} - ${m.nim} - ${m.nilai}</span>
     <span><button data-edit="${i}" class="text-blue-600 mr-2">Edit</button><button data-del="${i}" class="text-red-600">Hapus</button></span></div>`).join("");
};
document.getElementById("c-simpan").addEventListener("click", () => {
  const nama = document.getElementById("c-nama").value.trim();
  const nim = document.getElementById("c-nim").value.trim();
  const nilai = parseFloat(document.getElementById("c-nilai").value);
  if (!nama || !nim || isNaN(nilai)) return alert("Lengkapi nama, NIM, dan nilai!");
  const data = { nama, nim, nilai };
  if (editIdx >= 0) { daftarMhs[editIdx] = { ...daftarMhs[editIdx], ...data }; editIdx = -1; }      // Update
  else daftarMhs.push({ ...data, jurusan: "Teknik Informatika" });                                    // Create
  ["c-nama", "c-nim", "c-nilai"].forEach(id => document.getElementById(id).value = "");
  renderCrud();
});
document.getElementById("c-list").addEventListener("click", e => {
  if (e.target.dataset.del !== undefined) { daftarMhs.splice(+e.target.dataset.del, 1); renderCrud(); } // Delete
  if (e.target.dataset.edit !== undefined) {
    editIdx = +e.target.dataset.edit; const m = daftarMhs[editIdx];
    document.getElementById("c-nama").value = m.nama; document.getElementById("c-nim").value = m.nim; document.getElementById("c-nilai").value = m.nilai;
  }
});
renderCrud();
