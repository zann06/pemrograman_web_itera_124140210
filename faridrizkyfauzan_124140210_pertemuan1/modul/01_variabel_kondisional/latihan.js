const L = document.getElementById("latihan");
const tampil = (judul, isi) => L.innerHTML += `<div class="p-3 mb-2 border rounded"><b>${judul}</b><p>${isi}</p></div>`;

// 1. Data diri (const & let)
const namaDiri = "Farid Rizky Fauzan";
let umur = 20;
const kotaAsal = "Lampung";
tampil("1. Data diri", `${namaDiri}, ${umur} tahun, dari ${kotaAsal}`);

// 2. Cek kelulusan (nilai >= 70)
const nilaiUjian = 75;
tampil("2. Kelulusan", `Nilai ${nilaiUjian}: ${nilaiUjian >= 70 ? "LULUS" : "TIDAK LULUS"}`);

// 3. Kategori umur
function kategoriUmur(u) {
  if (u < 12) return "Anak";
  else if (u <= 17) return "Remaja";
  else if (u <= 59) return "Dewasa";
  return "Lansia";
}
tampil("3. Kategori umur", [5, 15, 30, 65].map(u => `${u} → ${kategoriUmur(u)}`).join(" | "));

// 4. Switch-case angka hari → nama hari (Inggris)
function namaHariInggris(n) {
  switch (n) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    case 7: return "Sunday";
    default: return "Invalid day";
  }
}
tampil("4. Hari (Inggris)", [1, 4, 7, 9].map(n => `${n} → ${namaHariInggris(n)}`).join(" | "));

// 5. Kalkulator grade dengan ternary
const gradeTernary = n => n >= 90 ? "A" : n >= 80 ? "B" : n >= 70 ? "C" : n >= 60 ? "D" : "E";
tampil("5. Grade (ternary)", [95, 85, 72, 61, 40].map(n => `${n} → ${gradeTernary(n)}`).join(" | "));
