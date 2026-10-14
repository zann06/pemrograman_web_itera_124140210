/* =========================================================
   PAW 2 — JavaScript Next Gen (ES6+)
   app.js — kumpulan fungsi demonstrasi fitur ES6+
   =========================================================

   MITDAHUL: file ini TIDAK menyentuh DOM secara langsung,
   kecuali pada demoPromises() & demoAsyncAwait() yang sengaja
   membuat elemen container untuk menampilkan status async.

   Semua fungsi diekspor (export) lalu diimpor oleh js/main.js.
   ========================================================= */

import { sampleUsers, sampleProducts, apiConfig } from "./modules/data.js";
import { formatRupiah, capitalize, truncate, toTitleCase, prettyJSON } from "./modules/utils.js";

/* =========================================================
   1. LET DAN CONST
   ========================================================= */

export function demoVariables() {
  /* var: function-scoped -> bocor keluar dari blok {} */
  var oldVar = "Old variable";
  {
    var oldVar = "Changed inside block"; // <- menimpa nilai luar
  }

  /* let: block-scoped -> aman, berdiri sendiri di dalam blok */
  let newLet = "New let variable";
  {
    let newLet = "Different variable inside block";
    console.log("newLet inside block:", newLet);
  }

  /* const: referensi tidak bisa di-reassign, tapi isi objek tetap bisa diubah */
  const PI = 3.14159;
  const user = { name: "John", age: 30 };
  // PI = 3.15;   // <-- Error: Assignment to constant variable
  user.age = 31;      // <-- Valid: properti di dalam objek const boleh diubah

  /* const untuk array: isi boleh dimanipulasi, identitas array tidak */
  const tags = ["belajar", "javascript"];
  tags.push("es6");   // valid

  return {
    oldVar,            // "Changed inside block" -> membuktikan var bocor
    newLet,            // "New let variable" -> let tidak tertimpa
    PI,
    user,
    tags
  };
}

/* =========================================================
   2. ARROW FUNCTIONS
   ========================================================= */

export function demoArrowFunctions() {
  // Fungsi reguler (cara lama)
  function regularSum(a, b) {
    return a + b;
  }

  // Arrow function dengan body blok + return eksplisit
  const arrowSum = (a, b) => {
    return a + b;
  };

  // Arrow function dengan implicit return (sintaks 1 baris)
  const shortArrowSum = (a, b) => a + b;

  // Tanpa parameter -> kurung wajib
  const sayHello = () => "Hello World!";

  // Satu parameter -> kurung opsional
  const square = x => x * x;

  // Mengembalikan objek literal -> wajib dibungkus kurung
  const createUser = (name, age) => ({ name, age });

  /* Lexical this: arrow function mewarisi this dari scope pendefinisinya */
  const person = {
    name: "Budi",
    regularGreet() {
      // method reguler -> this = objek person
      return `Halo, saya ${this.name}`;
    },
    arrowGreet: () => {
      // arrow di level objek literal -> this = module scope (undefined di strict mode)
      return `Halo, saya ${this?.name ?? "(this tidak terikat)"}`;
    }
  };

  return {
    regularSum: regularSum(5, 3),
    arrowSum: arrowSum(5, 3),
    shortArrowSum: shortArrowSum(5, 3),
    sayHello: sayHello(),
    square: square(4),
    createdUser: createUser("Sinta", 20),
    lexicalThis: {
      regularMethod: person.regularGreet(),
      arrowProperty: person.arrowGreet()
    }
  };
}

/* =========================================================
   3. TEMPLATE LITERALS
   ========================================================= */

export function demoTemplateLiterals() {
  const name = "John";
  const age = 30;

  // Cara lama: string concatenation
  const oldWay = "Nama saya " + name + " dan umur saya " + age + " tahun.";

  // Cara modern: template literal
  const newWay = `Nama saya ${name} dan umur saya ${age} tahun.`;

  // Multi-baris tanpa escape character \n
  const multiLine = `
    Ini adalah string multi-baris.
    Sangat berguna untuk HTML template.
    Nama: ${name}
    Umur: ${age}
  `;

  // Ekspresi apa pun boleh berada di dalam ${ }
  const birthYear = new Date().getFullYear() - age;
  const expression = `Tahun lahir: ${birthYear}`;

  // Template literal untuk merender kartu HTML produk dari data modul
  const productCards = sampleProducts
    .map(
      ({ id, name: productName, price }) => `
        <article class="card">
          <span>${id}</span>
          <h5>${toTitleCase(productName)}</h5>
          <strong>${formatRupiah(price)}</strong>
        </article>`
    )
    .join("");

  return { oldWay, newWay, multiLine, expression, productCards, birthYear };
}

/* =========================================================
   4. DESTRUCTURING
   ========================================================= */

export function demoDestructuring() {
  const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john@example.com",
    address: {
      city: "Jakarta",
      postalCode: "12345",
      geo: { lat: -6.2, lng: 106.8 } // nested 3 level
    }
  };

  // Object destructuring dasar
  const { firstName, lastName } = person;

  // Ganti nama variabel
  const { firstName: fName, lastName: lName } = person;

  // Nilai default (hanya aktif jika nilainya undefined)
  const { hobby = "coding" } = person;

  // Nested destructuring 3 level
  const { address: { city, geo: { lat, lng } } } = person;

  // Array destructuring
  const colors = ["red", "green", "blue", "yellow", "purple"];
  const [firstColor, secondColor] = colors;

  // Lewati elemen dengan koma kosong
  const [, , thirdColor] = colors;

  // Rest pattern di dalam array destructuring
  const [primary, secondary, ...restColors] = colors;

  // Tukar nilai tanpa variabel sementara
  let a = 1;
  let b = 2;
  [a, b] = [b, a];

  // Destructuring dari API-like response (pola yang sangat umum di React)
  const apiResponse = {
    data: { users: sampleUsers },
    meta: { total: sampleUsers.length, page: 1 }
  };
  const {
    data: { users },
    meta: { total }
  } = apiResponse;

  return {
    objectBasic: { firstName, lastName },
    objectRenamed: { fName, lName },
    objectDefault: hobby,
    objectNested: { city, lat, lng },
    arrayBasic: { firstColor, secondColor },
    arraySkipped: thirdColor,
    arrayRest: { primary, secondary, restColors },
    swapped: { a, b },
    fromApi: { total, firstUser: capitalize(users[0].name) }
  };
}

/* =========================================================
   5. SPREAD DAN REST OPERATORS
   ========================================================= */

export function demoSpreadRest() {
  /* ---------- SPREAD pada array ---------- */
  const numbers = [1, 2, 3];
  const moreNumbers = [...numbers, 4, 5];          // salin + tambah
  const numbersCopy = [...numbers];                  // shallow copy

  const array1 = [1, 2, 3];
  const array2 = [4, 5, 6];
  const mergedArray = [...array1, ...array2];        // gabung

  const maxValue = Math.max(...numbers);            // spread sebagai argumen

  /* ---------- SPREAD pada objek ---------- */
  const person = { name: "John", age: 30 };
  const personCopy = { ...person };

  const extendedPerson = {
    ...person,
    email: "john@example.com",
    age: 31               // override properti yang sudah ada
  };

  /* ---------- Shallow copy: nested object tetap berbagi referensi ---------- */
  const original = { profile: { city: "Jakarta" } };
  const shallowClone = { ...original };
  shallowClone.profile.city = "Bandar Lampung";
  const originalCityStill = original.profile.city; // ikut berubah -> bukti shallow copy

  /* ---------- REST parameter ---------- */
  function sum(...nums) {
    return nums.reduce((total, n) => total + n, 0);
  }

  function process(first, second, ...rest) {
    return { first, second, rest };
  }

  /* ---------- Destructuring di parameter fungsi (pola props React) ---------- */
  const describeUser = ({ name, role, age }) => `${name} (${role}) - ${age} tahun`;
  const describeUserClassic = (user) => `${user.name} (${user.role}) - ${user.age} tahun`;

  return {
    spreadArray: moreNumbers,
    copyArray: numbersCopy,
    mergedArrays: mergedArray,
    maxValue,
    spreadObject: extendedPerson,
    restSum: sum(1, 2, 3, 4, 5),
    restProcess: process("a", "b", "c", "d", "e"),
    shallowCopyDemo: { originalCityStill, clonedCity: shallowClone.profile.city },
    destructuredParam: describeUser(sampleUsers[0]),
    classicParam: describeUserClassic(sampleUsers[0])
  };
}

/* =========================================================
   6. DEFAULT PARAMETERS
   ========================================================= */

export function demoDefaultParams() {
  // Cara lama (ES5): operator || — rapuh karena menganggap 0 / "" / false sebagai "kosong"
  function greetOld(name, greeting) {
    name = name || "Guest";
    greeting = greeting || "Hello";
    return `${greeting}, ${name}!`;
  }

  // Cara modern (ES6): default hanya aktif bila argumen === undefined
  function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
  }

  // Default berisi ekspresi dinamis
  function createUser(name, role = "user", createdAt = new Date().toISOString()) {
    return { name, role, createdAt };
  }

  // Default boleh merujuk parameter sebelumnya di sebelah kanannya
  function createOrder(product, quantity = 1, price, total = price * quantity) {
    return { product, quantity, price, total };
  }

  // Default digabung dengan destructuring di parameter
  function renderCard({ title, subtitle = "Tanpa subjudul", badge = "NEW" }) {
    return `[${badge}] ${title} — ${subtitle}`;
  }

  return {
    oldWay: greetOld(),
    oldWayParams: greetOld("John", "Hi"),
    newWay: greet(),
    newWayParams: greet("John", "Hi"),
    falsyBug: {
      // greetOld(0) menghasilkan "Guest" — bug klasik operator ||
      old: greetOld(0, ""),
      fixed: greet(0, "")
    },
    withExpression: createUser("Alice"),
    usingPrevious: createOrder("Laptop", 2, 1000000),
    destructuredDefault: [
      renderCard({ title: "React" }),
      renderCard({ title: "Vue", subtitle: "Progressive", badge: "HOT" })
    ]
  };
}

/* =========================================================
   7. CLASSES (OOP)
   ========================================================= */

export function demoClasses() {
  class User {
    #secret = "rahasia";               // private field (ES2022)

    constructor(name, email) {
      this.name = name;
      this.email = email;
      this.createdAt = new Date();
    }

    getInfo() {
      return `${this.name} (${this.email})`;
    }

    getCreatedDate() {
      return this.createdAt.toLocaleDateString("id-ID");
    }

    get age() {                          // getter
      return new Date().getFullYear() - new Date(this.createdAt).getFullYear();
    }

    set name(value) {                   // setter dengan validasi
      this._name = String(value).trim() || "Anonim";
    }

    get name() {
      return this._name;
    }

    revealSecret() {
      return `#private => ${this.#secret}`;
    }

    static create(name, email) {        // static method / factory
      return new User(name, email);
    }
  }

  class Admin extends User {            // inheritance
    constructor(name, email, role = "admin") {
      super(name, email);               // WAJIB memanggil constructor parent
      this.role = role;
    }

    getInfo() {                         // override method parent
      return `${super.getInfo()} - ${this.role}`;
    }

    hasAccess(module) {
      const restricted = ["billing", "secret"];
      return !restricted.includes(module);
    }
  }

  class Guest extends User {
    constructor(name) {
      super(name, "guest@contoh.id");
      this.role = "guest";
    }
    hasAccess() {
      return false;
    }
  }

  const user = User.create("John Doe", "john@example.com");
  const admin = new Admin("Admin User", "admin@example.com");
  const guest = new Guest("Pengunjung");

  return {
    user: {
      info: user.getInfo(),
      createdDate: user.getCreatedDate(),
      age: user.age,
      privateField: user.revealSecret()
    },
    admin: {
      info: admin.getInfo(),
      accessDashboard: admin.hasAccess("dashboard"),
      accessBilling: admin.hasAccess("billing")
    },
    guest: { info: guest.getInfo(), access: guest.hasAccess() },
    instanceofChecks: {
      "user instanceof User": user instanceof User,
      "admin instanceof User": admin instanceof User,
      "admin instanceof Admin": admin instanceof Admin,
      "guest instanceof Admin": guest instanceof Admin
    }
  };
}

/* =========================================================
   8. ENHANCED OBJECT LITERALS
   ========================================================= */

export function demoObjectLiterals() {
  const name = "John";
  const age = 30;

  // Cara lama
  const oldPerson = {
    name: name,
    age: age,
    sayHello: function () {
      return "Hello!";
    }
  };

  // Cara modern (ES6)
  const newPerson = {
    name,                                  // property shorthand
    age,
    sayHello() {                           // method shorthand
      return "Hello!";
    },
    ["skill_" + 1]: "JavaScript",          // computed property names
    ["skill_" + 2]: "React"
  };

  // Computed property dinamis
  const prefix = "user";
  const timestamp = Date.now();
  const userData = {
    [`${prefix}_id`]: 123,
    [`${prefix}_name`]: "john_doe",
    [`created_${timestamp}`]: "timestamp"
  };

  return {
    oldWay: { ...oldPerson, sayHello: undefined }, // sayHello dihilangkan agar tidak ikut ter-serialize
    oldWayLength: Object.keys(oldPerson).length,
    newWay: newPerson,
    methods: {
      old: oldPerson.sayHello(),
      new: newPerson.sayHello()
    },
    computedProps: {
      skill1: newPerson.skill_1,
      skill2: newPerson.skill_2
    },
    dynamicProps: userData,
    dynamicKeyNames: Object.keys(userData)
  };
}

/* =========================================================
   9. MODERN ARRAY METHODS (Higher-Order Functions)
   ========================================================= */

export function demoArrayMethods() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const users = [
    { id: 1, name: "John", age: 25, active: true, role: "admin" },
    { id: 2, name: "Jane", age: 30, active: false, role: "user" },
    { id: 3, name: "Bob", age: 22, active: true, role: "user" },
    { id: 4, name: "Alice", age: 28, active: true, role: "admin" },
    { id: 5, name: "Charlie", age: 35, active: false, role: "user" }
  ];

  // map -> transformasi 1:1
  const doubled = numbers.map((num) => num * 2);
  const names = users.map((user) => user.name);

  // filter -> menyaring elemen
  const evenNumbers = numbers.filter((num) => num % 2 === 0);
  const activeUsers = users.filter((user) => user.active);

  // find / findIndex -> satu elemen pertama yang cocok
  const userJane = users.find((user) => user.name === "Jane");
  const janeIndex = users.findIndex((user) => user.name === "Jane");

  // some / every -> predicate_bool
  const hasAdult = users.some((user) => user.age >= 18);
  const allAdults = users.every((user) => user.age >= 18);

  // reduce -> agregasi menjadi satu nilai
  const sum = numbers.reduce((total, num) => total + num, 0);
  const product = numbers.reduce((acc, num) => acc * num, 1);
  const max = numbers.reduce((m, num) => (num > m ? num : m), numbers[0]);
  const min = numbers.reduce((m, num) => (num < m ? num : m), numbers[0]);
  const oldest = users.reduce(
    (acc, user) => (user.age > acc.age ? user : acc),
    users[0]
  );

  // groupBy dengan reduce
  const groupedByRole = users.reduce((acc, user) => {
    const group = user.role;
    acc[group] = acc[group] || [];
    acc[group].push(user.name);
    return acc;
  }, {});

  // method chaining
  const activeUsersNames = users
    .filter((user) => user.active)
    .map((user) => user.name);

  const totalActiveAge = users
    .filter((user) => user.active)
    .reduce((sumUser, user) => sumUser + user.age, 0);

  const expensiveProducts = sampleProducts
    .filter(({ price }) => price > 1000000)
    .map(({ name: pName, price }) => `${pName} (${formatRupiah(price)})`);

  // flat untuk array bersarang
  const nested = [[1, 2], [3, 4], [5]];
  const flattened = nested.reduce((acc, arr) => acc.concat(arr), []);

  return {
    map: { doubled, names },
    filter: { evenNumbers, activeUsersCount: activeUsers.length },
    find: { userJane, janeIndex },
    some: hasAdult,
    every: allAdults,
    reduce: { sum, product, max, min, oldest: oldest.name },
    groupBy: groupedByRole,
    chaining: { activeUsersNames, totalActiveAge },
    realistic: { expensiveProducts, flattened }
  };
}

/* =========================================================
   10. ADVANCED ARRAYS
   ========================================================= */

export function demoAdvancedArrays() {
  const numbers = [1, 2, 3, 4, 5];

  // Clone & gabung dengan spread
  const numbersCopy = [...numbers];
  const moreNumbers = [...numbers, 6, 7, 8];
  const combinedArrays = [...numbers, ...[6, 7, 8, 9]];

  // Array.from — iterable / array-like -> array asli
  const fromIterable = Array.from("hello");
  const withMapFn = Array.from(numbers, (n) => n * n);
  const withMapFnIndex = Array.from(numbers, (n, i) => `${i}:${n}`);

  // Array.of — membuat array dari daftar argumen
  const arrayOf = Array.of(1, "two", { three: 3 });

  // flat / flatMap
  const nestedArrays = [1, [2, 3], [[4, 5], 6]];
  const flattened = nestedArrays.flat();
  const deepFlattened = nestedArrays.flat(2);
  const flatMapped = numbers.flatMap((n) => [n, n * 2]);

  // includes & indexOf
  const hasThree = numbers.includes(3);
  const hasTen = numbers.includes(10);

  // at() — indeks dari ujung (ES2022)
  const lastItem = numbers.at(-1);
  const secondItem = numbers.at(-2);

  // findLast (ES2023)
  const lastEven = [1, 3, 4, 6, 7].findLast((n) => n % 2 === 0);

  // structuredClone — deep copy modern
  const deepCopy = structuredClone({ nested: { list: [1, 2, 3] } });

  // Iterasi modern lain
  const forOfResult = [];
  for (const user of usersLoopSource()) {
    forOfResult.push(`${user.name} (${user.role})`);
  }

  return {
    clone: numbersCopy,
    concat: { moreNumbers, combinedArrays },
    arrayFrom: { fromIterable, withMapFn, withMapFnIndex },
    arrayOf,
    flatAndFlatMap: { flattened, deepFlattened, flatMapped },
    includes: { hasThree, hasTen },
    at: { lastItem, secondItem },
    findLast: lastEven,
    deepCopy,
    forOf: forOfResult
  };
}

// Helper kecil khusus demoAdvancedArrays
function usersLoopSource() {
  return sampleUsers.slice(0, 3);
}

/* =========================================================
   11. PROMISES
   ========================================================= */

/**
 * Fungsi simulasi API: mengembalikan Promise.
 * @param {number} id
 * @param {number} [delay=600]
 */
function fetchData(id, delay = 600) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: `User ${id}`, success: true });
      } else {
        reject(new Error("ID tidak valid"));
      }
    }, delay);
  });
}

export function demoPromises() {
  const container = document.createElement("div");
  container.className = "promise-outputs";

  const createPromiseElement = (id, label) => {
    const el = document.createElement("div");
    el.className = "promise-result";
    el.innerHTML = `<strong>${label}:</strong> <span id="${id}">Memuat...</span>`;
    container.appendChild(el);
  };

  createPromiseElement("promise-basic", "11a. Promise Dasar (.then/.catch)");
  createPromiseElement("promise-chain", "11b. Promise Chaining");
  createPromiseElement("promise-all", "11c. Promise.all (paralel)");
  createPromiseElement("promise-race", "11d. Promise.race (balapan)");
  createPromiseElement("promise-allsettled", "11e. Promise.allSettled");

  /* (a) Promise dasar */
  fetchData(1)
    .then((data) => {
      document.getElementById("promise-basic").textContent =
        `Sukses: ${prettyJSON(data)}`;
    })
    .catch((err) => {
      document.getElementById("promise-basic").textContent = `Error: ${err.message}`;
    });

  /* (b) Chaining: kembalikan Promise baru dari dalam .then() */
  fetchData(2)
    .then((user) => {
      document.getElementById("promise-chain").textContent = `Dapat ${user.name}, mengambil posts...`;
      return fetchData(3, 400); // <- Promise berikutnya
    })
    .then((secondUser) => {
      document.getElementById("promise-chain").textContent += ` dan ${secondUser.name}`;
    })
    .catch((err) => {
      document.getElementById("promise-chain").textContent = `Error: ${err.message}`;
    })
    .finally(() => console.log("[Promise] chaining selesai"));

  /* (c) Promise.all — semua paralel, gagal jika ada satu gagal */
  Promise.all([fetchData(4, 500), fetchData(5, 500), fetchData(6, 500)])
    .then((results) => {
      document.getElementById("promise-all").textContent =
        `Semua selesai (paralel ±500ms): ${results.map((r) => r.name).join(", ")}`;
    })
    .catch((err) => {
      document.getElementById("promise-all").textContent = `Error di salah satu: ${err.message}`;
    });

  /* (d) Promise.race — menang yang selesai paling cepat */
  Promise.race([
    fetchData(7, 300),
    fetchData(8, 900),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout 500ms")), 500)
    )
  ])
    .then((winner) => {
      document.getElementById("promise-race").textContent = `Pemenang: ${winner.name} (300ms)`;
    })
    .catch((err) => {
      document.getElementById("promise-race").textContent = `Error race: ${err.message}`;
    });

  /* (e) Promise.allSettled — menunggu semuanya, tidak AggregateError */
  Promise.allSettled([fetchData(9, 300), Promise.reject(new Error("Gagal total")), fetchData(10, 600)])
    .then((results) => {
      const summary = results
        .map((r) =>
          r.status === "fulfilled"
            ? `OK(${r.value.id})`
            : `GAGAL(${r.reason.message})`
        )
        .join(", ");
      document.getElementById("promise-allsettled").textContent = summary;
    });

  return container;
}

/* =========================================================
   12. ASYNC / AWAIT (+ integrasi API publik nyata)
   ========================================================= */

/** Simulasi API pengguna */
function fetchUser(id, delay = 700) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
      } else {
        reject(new Error("ID user tidak valid"));
      }
    }, delay);
  });
}

/** Simulasi API post milik user */
function fetchUserPosts(userId, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, userId, title: `Post 1 oleh ${userId}`, body: "Konten post pertama" },
        { id: 2, userId, title: `Post 2 oleh ${userId}`, body: "Konten post kedua" }
      ]);
    }, delay);
  });
}

export function demoAsyncAwait() {
  const container = document.createElement("div");
  container.className = "async-outputs";

  const makeRow = (label) => {
    const row = document.createElement("div");
    row.className = "async-result";
    row.innerHTML = `<strong>${label}:</strong> <span>Memuat...</span>`;
    container.appendChild(row);
    return row.querySelector("span");
  };

  const basicSlot = makeRow("12a. Async/Await berurutan");
  const parallelSlot = makeRow("12b. Paralel (Promise.all)");
  const errorSlot = makeRow("12c. Penanganan error (try/catch)");
  const weatherSlot = makeRow("12d. API nyata — cuaca Open-Meteo");
  const quoteSlot = makeRow("12e. API nyata — kutipan DummyJSON");

  /* (a) async/await berurutan (sequential) */
  async function getUserData(id) {
    try {
      const user = await fetchUser(id);
      const posts = await fetchUserPosts(user.id);
      return { user, posts, success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  }

  getUserData(42).then((result) => {
    basicSlot.textContent = result.success
      ? `${result.user.name} <${result.user.email}> | posts: ${result.posts.length} | total ±1200ms`
      : `Error: ${result.error}`;
  });

  /* (b) Eksekusi paralel dengan async/await + Promise.all */
  async function getMultipleUsers(ids) {
    try {
      const users = await Promise.all(ids.map((id) => fetchUser(id, 600)));
      const allPosts = await Promise.all(users.map((user) => fetchUserPosts(user.id, 400)));
      return users.map((user, i) => ({ user, posts: allPosts[i] }));
    } catch (error) {
      return { error: error.message };
    }
  }

  getMultipleUsers([101, 102, 103]).then((results) => {
    parallelSlot.textContent = results.error
      ? `Error: ${results.error}`
      : `${results.map((r) => r.user.name).join(", ")} | total posts: ${
          results.reduce((sum, r) => sum + r.posts.length, 0)
        } | ±1000ms (bukan 3000ms)`;
  });

  /* (c) Penanganan error dengan try/catch */
  async function safeFetch(id) {
    try {
      const user = await fetchUser(id);
      return `Berhasil: ${user.name}`;
    } catch (error) {
      return `Ditangkap: ${error.message}`;
    }
  }

  Promise.all([safeFetch(-1), safeFetch(7, 300)]).then(([bad, good]) => {
    errorSlot.textContent = `${bad} | ${good}`;
  });

  /* (d) & (e) Integrasi API publik nyata — butuh koneksi internet */
  async function loadWeather() {
    const res = await fetch(apiConfig.weather.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const w = data.current_weather;
    return `${w.weathercode === 0 ? "Cerah" : "Berawan/berhujan"} | suhu ${w.temperature}°C | angin ${w.windspeed} km/h`;
  }

  async function loadQuote() {
    const res = await fetch(apiConfig.quote.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `"${truncate(data.quote, 70)}" — ${data.author}`;
  }

  loadWeather()
    .then((text) => (weatherSlot.textContent = text))
    .catch(() => (weatherSlot.textContent = "Gagal/offline — jalankan lewat Live Server dengan koneksi internet"));

  loadQuote()
    .then((text) => (quoteSlot.textContent = text))
    .catch(() => (quoteSlot.textContent = "Gagal/offline — jalankan lewat Live Server dengan koneksi internet"));

  return container;
}

/* =========================================================
   RINGKASAN SEMUA DEMO (untuk laporan)
   ========================================================= */

export function getDemoRegistry() {
  return [
    { no: 1, title: "Let dan Const", topic: "Block scope vs function scope", feature: "let / const" },
    { no: 2, title: "Arrow Functions", topic: "Sintaks ringkas + lexical this", feature: "Arrow Function" },
    { no: 3, title: "Template Literals", topic: "Interpolasi string & multi-baris", feature: "Template Literals" },
    { no: 4, title: "Destructuring", topic: "Ekstraksi objek & array", feature: "Destructuring" },
    { no: 5, title: "Spread dan Rest", topic: "Operator ... dalam 2 konteks", feature: "Spread / Rest" },
    { no: 6, title: "Default Parameters", topic: "Nilai cadangan parameter", feature: "Default Parameter" },
    { no: 7, title: "Classes", topic: "OOP modern & inheritance", feature: "class / extends / super" },
    { no: 8, title: "Enhanced Object Literals", topic: "Shorthand & computed property", feature: "Object Literal" },
    { no: 9, title: "Modern Array Methods", topic: "Higher-order functions", feature: "map/filter/find/reduce" },
    { no: 10, title: "Advanced Arrays", topic: "Array.from / flat / at / findLast", feature: "ES2019–ES2023" },
    { no: 11, title: "Promises", topic: "then / catch / all / race / allSettled", feature: "Promise" },
    { no: 12, title: "Async / Await", topic: "Await, try/catch, paralel", feature: "Async/Await" }
  ];
}