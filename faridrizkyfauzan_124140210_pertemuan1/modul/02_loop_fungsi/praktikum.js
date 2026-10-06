const $ = id => document.getElementById(id);

// ===== Loop =====
let nilaiSiswa = [85, 92, 78, 90, 88];
let total = 0;
$("result").innerHTML += `
  <h3 class="font-bold">Daftar Nilai Siswa:</h3>
  <ul id="daftar-nilai" class="list-disc ml-5"></ul>
  <p id="rata-rata"></p>`;
for (let i = 0; i < nilaiSiswa.length; i++) {          // for
  total += nilaiSiswa[i];
  $("daftar-nilai").innerHTML += `<li>Siswa ${i + 1}: ${nilaiSiswa[i]}</li>`;
}
$("rata-rata").innerHTML = `Rata-rata nilai: <strong>${(total / nilaiSiswa.length).toFixed(2)}</strong>`;

$("result").innerHTML += `<h3 class="font-bold mt-3">Countdown:</h3><div id="countdown"></div>`;
let hitungMundur = 5;
while (hitungMundur > 0) {                              // while
  $("countdown").innerHTML += `<span class="inline-block bg-blue-100 px-2 py-1 m-1 rounded">${hitungMundur}</span>`;
  hitungMundur--;
}

$("result").innerHTML += `<h3 class="font-bold mt-3">Nilai dengan for...of:</h3><div id="nilai-of" class="flex flex-wrap gap-2"></div>`;
for (let nilai of nilaiSiswa) {                         // for...of
  const warna = nilai >= 80 ? "text-green-600" : "text-red-600";
  $("nilai-of").innerHTML += `<span class="inline-block bg-gray-100 px-3 py-1 rounded ${warna}">${nilai}</span>`;
}

// ===== Fungsi & event =====
function sapaNama(nama) { return `Halo, ${nama}! Selamat belajar JavaScript!`; }
$("sapa-button").addEventListener("click", function () {
  const nama = $("nama-input").value;
  $("sapa-output").innerHTML = nama.trim() === ""
    ? `<p class="text-red-500">Silakan masukkan nama Kalian terlebih dahulu!</p>`
    : `<p class="text-green-500">${sapaNama(nama)}</p>`;
});

function hitungKalkulator(a, b, operasi) {
  switch (operasi) {
    case "tambah": return a + b;
    case "kurang": return a - b;
    case "kali": return a * b;
    case "bagi":
      if (b === 0) return "Error: Pembagian dengan nol tidak diperbolehkan";
      return a / b;
    default: return "Operasi tidak valid";
  }
}
const simbol = { tambah: "+", kurang: "-", kali: "×", bagi: "÷" };
for (const op of Object.keys(simbol)) {                 // 1 handler dipakai 4 tombol
  $("btn-" + op).addEventListener("click", function () {
    const a = parseFloat($("angka1").value);
    const b = parseFloat($("angka2").value);
    $("hasil-kalkulator").innerHTML = (isNaN(a) || isNaN(b))
      ? `<p class="text-red-500">Masukkan angka yang valid!</p>`
      : `<p>Hasil: ${a} ${simbol[op]} ${b} = ${hitungKalkulator(a, b, op)}</p>`;
  });
}
