/* =========================================================
   PAW 2 — JavaScript Next Gen (ES6+)
   main.js — Entry point / DOM Controller
   =========================================================

   TUJUAN FILE INI
   1. Men-import seluruh fungsi demo dari app.js (ES Module).
   2. Menyediakan helper addOutput() untuk merender kartu hasil ke DOM.
   3. Menghubungkan tombol Run Demo / Jalankan Demo Async / Clear Output.

   CATATAN PENTING
   - File ini WAJIB dimuat dengan <script type="module">.
   - Jalankan lewat Live Server (http://), BUKAN double-click (file://)
     karena browser memblokir import modul pada protokol file://.
   ========================================================= */

import {
  demoVariables,
  demoArrowFunctions,
  demoTemplateLiterals,
  demoDestructuring,
  demoSpreadRest,
  demoDefaultParams,
  demoClasses,
  demoObjectLiterals,
  demoArrayMethods,
  demoAdvancedArrays,
  demoPromises,
  demoAsyncAwait,
  getDemoRegistry
} from "./app.js";

import { formatRupiah, capitalize, formatList } from "./modules/utils.js";
import { sampleUsers, sampleProducts } from "./modules/data.js";

/* =========================================================
   HELPER DOM
   ========================================================= */

/**
 * Render satu kartu hasil demo ke dalam elemen #output.
 * @param {string} title    - judul kartu
 * @param {string} subtitle - deskripsi singkat
 * @param {string} content  - isi (biasanya template literal)
 */
export function addOutput(title, subtitle, content) {
  const outputEl = document.getElementById("output");
  if (!outputEl) return;

  const card = document.createElement("div");
  card.className =
    "output-item bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 shadow-sm";
  card.innerHTML = `
    <h4 class="font-bold text-blue-600 text-base mb-1">${title}</h4>
    <p class="text-xs text-gray-500 mb-2">${subtitle}</p>
    <pre class="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono whitespace-pre-wrap overflow-x-auto result">${content}</pre>
  `;
  outputEl.appendChild(card);

  toggleEmptyState();
}

/**
 * Sembunyikan placeholder "belum ada output" begitu ada isi.
 */
function toggleEmptyState() {
  const emptyEl = document.getElementById("outputEmpty");
  const outputEl = document.getElementById("output");
  if (!emptyEl || !outputEl) return;
  emptyEl.hidden = outputEl.children.length > 0;
}

/**
 * Bersihkan seluruh output.
 */
export function clearOutput() {
  const outputEl = document.getElementById("output");
  if (outputEl) outputEl.innerHTML = "";
  toggleEmptyState();
}

/**
 * Ambil elemen <pre> dari kartu terakhir untuk ditumpuki node async.
 * @returns {HTMLElement|null}
 */
function getLastResultBox() {
  return document.querySelector("#output .output-item:last-child .result");
}

/* =========================================================
   DEMO 1–10 (SINKRON / INSTANT)
   ========================================================= */

function runSyncDemos() {
  /* ---- 1. Let dan Const ---- */
  const varResults = demoVariables();
  addOutput(
    "1. Let dan Const",
    "var (function scope) vs let/const (block scope)",
    `var di luar blok : "${varResults.oldVar}"   <-- TERTIMPA, bocor keluar dari {}
let di luar blok : "${varResults.newLet}"   <-- AMAN, blok punya variabel sendiri
const PI        : ${varResults.PI}
const objek     : ${JSON.stringify(varResults.user)}   <-- isi boleh diubah (user.age = 31)
const array     : ${JSON.stringify(varResults.tags)}   <-- .push() berhasil

CATATAN: const = referensi immutable, BUKAN nilai immutable.
Uncomment "PI = 3.15" di app.js -> ReferenceError.`
  );

  /* ---- 2. Arrow Functions ---- */
  const arrowResults = demoArrowFunctions();
  addOutput(
    "2. Arrow Functions",
    "Perbandingan fungsi reguler dan arrow function",
    `function sum(a,b){return a+b}  -> ${arrowResults.regularSum}
(a,b) => { return a+b }         -> ${arrowResults.arrowSum}
(a,b) => a+b  (implicit return)  -> ${arrowResults.shortArrowSum}
() => "Hello World!"             -> ${arrowResults.sayHello}
x => x * x                      -> ${arrowResults.square}
(name,age) => ({name,age})       -> ${JSON.stringify(arrowResults.createdUser)}

LEXICAL THIS:
  method reguler (this = objek) -> ${arrowResults.lexicalThis.regularMethod}
  arrow property (this = module)-> ${arrowResults.lexicalThis.arrowProperty}`
  );

  /* ---- 3. Template Literals ---- */
  const templateResults = demoTemplateLiterals();
  addOutput(
    "3. Template Literals",
    "String concatenation vs template literals",
    `Cara lama  ("Nama saya " + nama + " ..."):
  ${templateResults.oldWay}

Cara modern (\`Nama saya \${nama} ...\`):
  ${templateResults.newWay}

Ekspresi di dalam \${}:
  ${templateResults.expression}

Multi-baris tanpa escape \\n:
${templateResults.multiLine}

Template literal untuk merender HTML kartu produk:`
  );

  // Kartu produk dari template literal
  const productBox = document.createElement("div");
  productBox.className = "product-grid";
  productBox.innerHTML = templateResults.productCards;
  getLastResultBox().appendChild(productBox);

  /* ---- 4. Destructuring ---- */
  const destructuringResults = demoDestructuring();
  addOutput(
    "4. Destructuring",
    "Ekstraksi nilai dari objek dan array",
    `Object basic      : ${JSON.stringify(destructuringResults.objectBasic)}
Object renamed    : ${JSON.stringify(destructuringResults.objectRenamed)}
Object default    : ${destructuringResults.objectDefault}   <-- fallback hobby
Object nested     : ${JSON.stringify(destructuringResults.objectNested)}
Array basic       : ${JSON.stringify(destructuringResults.arrayBasic)}
Array skipped     : ${destructuringResults.arraySkipped}   <-- lewati indeks 0 & 1
Array rest        : ${JSON.stringify(destructuringResults.arrayRest)}
Swap tanpa temp   : ${JSON.stringify(destructuringResults.swapped)}
Dari API response : ${JSON.stringify(destructuringResults.fromApi)}`
  );

  /* ---- 5. Spread dan Rest ---- */
  const spreadRestResults = demoSpreadRest();
  addOutput(
    "5. Spread dan Rest Operators",
    "Tiga titik dalam dua konteks berbeda",
    `SPREAD - array:
  [...numbers, 4, 5]           -> ${JSON.stringify(spreadRestResults.spreadArray)}
  [...array1, ...array2]       -> ${JSON.stringify(spreadRestResults.mergedArrays)}
  Math.max(...numbers)         -> ${spreadRestResults.maxValue}

SPREAD - objek:
  {...person, email, age:31}   -> ${JSON.stringify(spreadRestResults.spreadObject)}

REST - parameter fungsi:
  sum(1,2,3,4,5)               -> ${spreadRestResults.restSum}
  process("a","b","c","d","e")  -> ${JSON.stringify(spreadRestResults.restProcess)}

SHALLOW COPY (nested object dibagi referensi):
  setelah clone diubah, asli     -> ${JSON.stringify(spreadRestResults.shallowCopyDemo)}

DESTRUCTURING DI PARAMETER (pola props React):
  deskripsi                      -> ${spreadRestResults.destructuredParam}
  versi klasik                  -> ${spreadRestResults.classicParam}`
  );

  /* ---- 6. Default Parameters ---- */
  const defaultParamsResults = demoDefaultParams();
  addOutput(
    "6. Default Parameters",
    "Nilai cadangan untuk parameter fungsi",
    `ES5 (name = name || "Guest") :
  tanpa argumen   -> ${defaultParamsResults.oldWay}
  dengan argumen  -> ${defaultParamsResults.oldWayParams}

ES6 (name = "Guest") :
  tanpa argumen   -> ${defaultParamsResults.newWay}
  dengan argumen  -> ${defaultParamsResults.newWayParams}

BUG OPERATOR || dengan nilai falsy:
  greetOld(0, "")  -> ${defaultParamsResults.falsyBug.old}      <-- 0 & "" dianggap kosong
  greet(0, "")     -> ${defaultParamsResults.falsyBug.fixed}     <-- 0 & "" dipertahankan

Default = ekspresi dinamis : ${JSON.stringify(defaultParamsResults.withExpression)}
Default merujuk parameter lain: ${JSON.stringify(defaultParamsResults.usingPrevious)}
Default + destructuring    : ${JSON.stringify(defaultParamsResults.destructuredDefault)}`
  );

  /* ---- 7. Classes ---- */
  const classesResults = demoClasses();
  addOutput(
    "7. Classes",
    "Object-Oriented Programming modern: class, extends, super",
    `class User  : ${classesResults.user.info}
  dibuat pada  : ${classesResults.user.createdDate}
  getter age   : ${classesResults.user.age}   <-- getter dihitung otomatis

class Admin : ${classesResults.admin.info}
  override method memakai super()
  akses dashboard : ${classesResults.admin.accessDashboard}
  akses billing   : ${classesResults.admin.accessBilling}   <-- dibatasi

class Guest : ${classesResults.guest.info} | akses: ${classesResults.guest.access}

PRIVATE FIELD (#secret) : ${classesResults.user.privateField}

instanceof:
  user instanceof User   : ${classesResults.instanceofChecks["user instanceof User"]}
  admin instanceof User  : ${classesResults.instanceofChecks["admin instanceof User"]}   <-- true, ini inheritance
  admin instanceof Admin : ${classesResults.instanceofChecks["admin instanceof Admin"]}
  guest instanceof Admin : ${classesResults.instanceofChecks["guest instanceof Admin"]}`
  );

  /* ---- 8. Enhanced Object Literals ---- */
  const objectLiteralsResults = demoObjectLiterals();
  addOutput(
    "8. Enhanced Object Literals",
    "Penulisan objek yang jauh lebih ringkas",
    `Property shorthand  {name, age}       -> ${JSON.stringify({
      name: objectLiteralsResults.newWay.name,
      age: objectLiteralsResults.newWay.age
    })}
Method shorthand     sayHello() {}      -> ${objectLiteralsResults.methods.new}
Computed property    ["skill_1"]        -> ${JSON.stringify(objectLiteralsResults.computedProps)}
Dynamic key          [\`user_id\`]        -> ${JSON.stringify(objectLiteralsResults.dynamicKeyNames)}

Cara lama vs modern:
  kunci objek cara lama : ${objectLiteralsResults.oldWayLength} (termasuk sayHello)
  kunci objek modern    : ${Object.keys(objectLiteralsResults.newWay).length}
  objek lama            : ${JSON.stringify(objectLiteralsResults.oldWay)}`
  );

  /* ---- 9. Modern Array Methods ---- */
  const arrayMethodsResults = demoArrayMethods();
  addOutput(
    "9. Modern Array Methods",
    "Higher-Order Functions pada array",
    `map       x2                 -> ${JSON.stringify(arrayMethodsResults.map.doubled)}
map       nama user           -> ${JSON.stringify(arrayMethodsResults.map.names)}
filter    bilangan genap      -> ${JSON.stringify(arrayMethodsResults.filter.evenNumbers)}
filter    user aktif (jumlah) -> ${arrayMethodsResults.filter.activeUsersCount}
find      "Jane"              -> ${JSON.stringify(arrayMethodsResults.find.userJane)}
findIndex "Jane"              -> ${arrayMethodsResults.find.janeIndex}
some      ada dewasa (>=18)   -> ${arrayMethodsResults.some}
every     semua dewasa        -> ${arrayMethodsResults.every}
reduce    sum                 -> ${arrayMethodsResults.reduce.sum}
reduce    product             -> ${arrayMethodsResults.reduce.product}
reduce    max / min           -> ${arrayMethodsResults.reduce.max} / ${arrayMethodsResults.reduce.min}
reduce    user tertua         -> ${arrayMethodsResults.reduce.oldest}
reduce    groupBy role        -> ${JSON.stringify(arrayMethodsResults.groupBy)}

CHAINING (filter -> map / reduce):
  user aktif        -> ${JSON.stringify(arrayMethodsResults.chaining.activeUsersNames)}
  total umur aktif  -> ${arrayMethodsResults.chaining.totalActiveAge}

KASUS NYATA:
  produk > 1 juta   -> ${JSON.stringify(arrayMethodsResults.realistic.expensiveProducts, null, 2)}
  flatten nested    -> ${JSON.stringify(arrayMethodsResults.realistic.flattened)}`
  );

  /* ---- 10. Advanced Arrays ---- */
  const advArraysResults = demoAdvancedArrays();
  addOutput(
    "10. Advanced Arrays",
    "Fitur array lanjutan (ES2015 – ES2023)",
    `Array.from("hello")           -> ${JSON.stringify(advArraysResults.arrayFrom.fromIterable)}
Array.from(nums, n => n*n)       -> ${JSON.stringify(advArraysResults.arrayFrom.withMapFn)}
Array.from(nums, (n,i) => ...)    -> ${JSON.stringify(advArraysResults.arrayFrom.withMapFnIndex)}
Array.of(1,"two",{three:3})      -> ${JSON.stringify(advArraysResults.arrayOf)}
flat()   1 level                 -> ${JSON.stringify(advArraysResults.flatAndFlatMap.flattened)}
flat(2)  2 level                 -> ${JSON.stringify(advArraysResults.flatAndFlatMap.deepFlattened)}
flatMap(n => [n, n*2])           -> ${JSON.stringify(advArraysResults.flatAndFlatMap.flatMapped)}
includes(3) / includes(10)       -> ${advArraysResults.includes.hasThree} / ${advArraysResults.includes.hasTen}
at(-1) nilai terakhir            -> ${JSON.stringify(advArraysResults.at)}
findLast(cari genap terakhir)    -> ${advArraysResults.findLast}
structuredClone (deep copy)      -> ${JSON.stringify(advArraysResults.deepCopy)}
for...of + destructuring         -> ${JSON.stringify(advArraysResults.forOf, null, 2)}`
  );
}

/* =========================================================
   DEMO 11–12 (ASINKRON)
   ========================================================= */

function runAsyncDemos() {
  addOutput(
    "11. Promises",
    "Penanganan operasi asinkron dengan Promise (.then/.catch/.finally)",
    ""
  );
  getLastResultBox().appendChild(demoPromises());

  addOutput(
    "12. Async / Await",
    "Sintaks yang membuat kode asinkron terbaca seperti kode sinkron",
    ""
  );
  getLastResultBox().appendChild(demoAsyncAwait());
}

/* =========================================================
   KARTU RINGKASAN (12 topik)
   ========================================================= */

function renderSummaryCard() {
  const registry = getDemoRegistry();
  const totalUsers = sampleUsers.length;
  const adminNames = sampleUsers
    .filter(({ role }) => role === "admin")
    .map(({ name }) => capitalize(name));

  /* Demonstrasi: chaining array methods + reduce untuk agregasi */
  const rows = registry
    .map(
      (item) =>
        `  ${String(item.no).padStart(2, " ")}. ${item.title.padEnd(26, " ")} | ${item.feature}`
    )
    .join("\n");

  /* Demonstrasi: formatRupiah() dari modul utils.js */
  const productLines = formatList(
    sampleProducts.map(({ id, name, price }) => `  ${id}  ${name.padEnd(22, " ")} ${formatRupiah(price)}`)
  );

  /* Demonstrasi: reduce() menjumlahkan nilai seluruh produk */
  const totalHarga = sampleProducts.reduce((total, { price }) => total + price, 0);

  addOutput(
    "Ringkasan 12 Topik Demo",
    "Daftar fitur ES6+ yang dijalankan di halaman ini",
    `${rows}

TOTAL: ${registry.length} demo · ${totalUsers} data user contoh
Admin terdeteksi: ${adminNames.join(", ")}

CONTOH DATA MODUL (formatRupiah + reduce dari modules/utils.js):
${productLines}
  ${"TOTAL".padEnd(26, " ")} ${formatRupiah(totalHarga)}

Semua fungsi diekspor dari js/app.js dan diimpor di js/main.js
lewat ES Module (import ... from).`
  );
}

/* =========================================================
   EVENT HANDLER
   ========================================================= */

function init() {
  const runBtn = document.getElementById("runBtn");
  const runAsyncBtn = document.getElementById("runAsyncBtn");
  const clearBtn = document.getElementById("clearBtn");

  // Jalankan demo sinkron 1–10 + ringkasan
  runBtn?.addEventListener("click", () => {
    clearOutput();
    runSyncDemos();
    renderSummaryCard();
    console.log("%cDemo 1–10 selesai (sinkron)", "color:#2563eb;font-weight:bold");
  });

  // Jalankan demo asinkron 11–12 (tidak menghapus output yang sudah ada)
  runAsyncBtn?.addEventListener("click", () => {
    runAsyncDemos();
    console.log("%cDemo 11–12 dijalankan (asinkron, ±1 detik)", "color:#f59e0b;font-weight:bold");
  });

  // Bersihkan layar
  clearBtn?.addEventListener("click", clearOutput);

  console.log(
    "%cPAW 2 — JavaScript Next Gen siap!%c Klik 'Run Demo'.",
    "color:#2563eb;font-weight:bold;font-size:14px",
    "color:inherit"
  );
}

// Jalankan setelah DOM siap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* Ekspor bonus: dipakai di console browser untuk eksplorasi mandiri */
export { runSyncDemos, runAsyncDemos, formatRupiah };