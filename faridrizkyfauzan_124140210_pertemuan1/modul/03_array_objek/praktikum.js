const $ = id => document.getElementById(id);
const buah = ["Apel", "Jeruk", "Mangga", "Pisang", "Anggur"];
$("result").innerHTML += `<h3 class="font-bold">Manipulasi Array:</h3><div id="array-demo"></div>`;
const tulis = (label, isi) => $("array-demo").innerHTML += `<p><strong>${label}:</strong> ${isi}</p>`;

tulis("Array buah", buah.join(", "));
buah.push("Durian");
tulis("Setelah push Durian", buah.join(", "));
const itemDihapus = buah.pop();
tulis("Setelah pop", `${buah.join(", ")} (item dihapus: ${itemDihapus})`);
buah.sort();
tulis("Setelah sort", buah.join(", "));

const hargaBuah = [10000, 8000, 15000, 5000, 20000];
const daftarBuah = buah.map((item, i) => `${item} (Rp${hargaBuah[i].toLocaleString("id-ID")})`);
tulis("Array dengan harga", daftarBuah.join(", "));
const buahMahal = buah.filter((item, i) => hargaBuah[i] > 10000);
tulis("Buah dengan harga > 10.000", buahMahal.join(", "));

// ===== Objek =====
const mahasiswa = {
  nama: "Budi Santoso", nim: "20210001", jurusan: "Teknik Informatika",
  nilai: { algoritma: 85, basis_data: 90, web: 88 },
  hobi: ["Coding", "Membaca", "Futsal"],
  tampilkanInfo() { return `${this.nama} (${this.nim}) - ${this.jurusan}`; },
  hitungRataRata() {
    const arr = Object.values(this.nilai);
    return (arr.reduce((s, n) => s + n, 0) / arr.length).toFixed(2);
  }
};
$("result").innerHTML += `<hr><h3 class="font-bold">Manipulasi Objek:</h3><div id="objek-demo"></div>`;
const objTulis = (label, isi) => $("objek-demo").innerHTML += `<p><strong>${label}:</strong> ${isi}</p>`;
objTulis("Info Mahasiswa", mahasiswa.tampilkanInfo());
objTulis("Rata-rata Nilai", mahasiswa.hitungRataRata());
objTulis("Hobi", mahasiswa.hobi.join(", "));
mahasiswa.email = "budi.santoso@example.com";
objTulis("Email", mahasiswa.email);
mahasiswa.nilai.web = 92;
objTulis("Nilai Web setelah diubah", mahasiswa.nilai.web);
delete mahasiswa.hobi;
objTulis("Hobi setelah dihapus", mahasiswa.hobi ? mahasiswa.hobi.join(", ") : "Tidak ada data hobi");
