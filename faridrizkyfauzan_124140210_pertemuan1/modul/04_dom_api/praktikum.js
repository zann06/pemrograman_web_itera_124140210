const domOutput = document.getElementById("dom-output");
let itemCount = 0;
document.getElementById("btn-tambah-item").addEventListener("click", () => {
  itemCount++;
  const el = document.createElement("div");
  el.className = "p-2 mb-2 bg-gray-100 rounded";
  el.innerText = `Item ${itemCount}`;
  domOutput.appendChild(el);
});
document.getElementById("btn-hapus-item").addEventListener("click", () => {
  if (domOutput.lastChild) { domOutput.removeChild(domOutput.lastChild); itemCount--; }
});
document.getElementById("btn-ubah-warna").addEventListener("click", () => {
  const colors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100"];
  domOutput.className = `p-4 mb-3 ${colors[Math.floor(Math.random() * colors.length)]} rounded`;
});

// Fetch API + async/await
document.getElementById("btn-fetch").addEventListener("click", async () => {
  const out = document.getElementById("api-output");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    out.innerHTML = "<h3 class='font-bold mb-2'>Daftar Post:</h3>";
    data.slice(0, 5).forEach(p => out.innerHTML += `
      <div class="p-3 mb-2 bg-gray-100 rounded"><h4 class="font-semibold">${p.title}</h4><p class="text-sm">${p.body}</p></div>`);
  } catch (error) {
    console.error("Error fetching data:", error);
    out.innerHTML = `<div class="p-3 bg-red-100 text-red-800 rounded">Gagal mengambil data: ${error.message}</div>`;
  }
});
