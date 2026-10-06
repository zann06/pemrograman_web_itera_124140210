const LT = document.getElementById("latihan");
const box = (judul, isi) => LT.insertAdjacentHTML("beforeend", `<div class="p-3 mb-2 border rounded"><b>${judul}</b><div>${isi}</div></div>`);

// 1. Tabel perkalian
function tabelPerkalian(n) {
  let hasil = "";
  for (let i = 1; i <= 10; i++) hasil += `${n} × ${i} = ${n * i}<br>`;
  return hasil;
}
box("1. Tabel perkalian 7", tabelPerkalian(7));

// 2. Faktorial
function faktorial(n) {
  if (n < 0) return "Tidak terdefinisi";
  let h = 1;
  for (let i = 2; i <= n; i++) h *= i;
  return h;
}
box("2. Faktorial", [0, 5, 10].map(n => `${n}! = ${faktorial(n)}`).join(" | "));

// 3. Bilangan prima
function isPrima(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
box("3. Bilangan prima", [1, 2, 9, 13, 97].map(n => `${n}: ${isPrima(n) ? "prima" : "bukan"}`).join(" | "));

// 4. Kalkulator BMI (fungsi + event handler)
function hitungBMI(berat, tinggiCm) {
  const m = tinggiCm / 100;
  const bmi = berat / (m * m);
  const kategori = bmi < 18.5 ? "Kurus" : bmi < 25 ? "Normal" : bmi < 30 ? "Gemuk" : "Obesitas";
  return { bmi: bmi.toFixed(1), kategori };
}
box("4. Kalkulator BMI", `
  <input id="bmi-berat" type="number" placeholder="Berat (kg)" class="border p-1 rounded">
  <input id="bmi-tinggi" type="number" placeholder="Tinggi (cm)" class="border p-1 rounded">
  <button id="bmi-btn" class="bg-blue-500 text-white px-3 py-1 rounded">Hitung</button>
  <p id="bmi-out" class="mt-2"></p>`);
document.getElementById("bmi-btn").addEventListener("click", () => {
  const b = parseFloat(document.getElementById("bmi-berat").value);
  const t = parseFloat(document.getElementById("bmi-tinggi").value);
  const out = document.getElementById("bmi-out");
  if (!(b > 0) || !(t > 0)) { out.innerHTML = `<span class="text-red-500">Isi berat & tinggi dengan angka positif.</span>`; return; }
  const r = hitungBMI(b, t);
  out.textContent = `BMI: ${r.bmi} (${r.kategori})`;
});

// 5. FizzBuzz
const fb = [];
for (let i = 1; i <= 100; i++) fb.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : i);
box("5. FizzBuzz 1-100", fb.join(", "));
