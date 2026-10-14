/* =========================================================
   MODUL: classes.js
   Otak aplikasi: model data (TaskItem) + state management
   (DashboardApp) menggunakan Object-Oriented Programming modern.

   ARSITEKTUR
   ----------
   TaskItem      -> Model satu entitas tugas (data + behavior)
   DashboardApp  -> Aggregate: menyimpan seluruh state aplikasi,
                    menjalankan operasi CRUD, mengelola localStorage,
                    dan mengoordinasikan pemanggilan API.

   PRINSIP YANG DITERAPKAN
   --------------------
   1. ENCAPSULATION  -> state disimpan sebagai private field (#nama);
                        satu-satunya jalan mengubah data adalah method resmi.
   2. IMMUTABILITY  -> setiap perubahan membuat array/object BARU
                        memakai SPREAD operator (tidak pernah .push/.sort
                        langsung pada state).
   3. SEPARATION OF CONCERN -> model terpisah dari storage & API.
   4. SINGLE SOURCE OF TRUTH -> DashboardApp adalah satu-satunya pemilik state.
   ========================================================= */

import { STORAGE_KEYS, TASK_CATEGORIES, PRIORITIES, DEFAULT_SCHEDULE, DEFAULT_PROFILE } from "./constants.js";
import { Storage } from "./storage.js";
import { generateId, formatInputDate } from "./utils.js";

/* =========================================================
   CLASS 1 — TaskItem
   Model satu item tugas. Bertugas sebagai "domain model":
   ia tahu bentuk datanya sendiri dan melakukan validasi mandiri.
   ========================================================= */

export class TaskItem {
  /**
   * @param {object} data
   * @param {string} data.title
   * @param {string} [data.id]
   * @param {string} [data.description]
   * @param {string} [data.category]
   * @param {string} [data.priority]
   * @param {string|Date} [data.dueDate]
   * @param {boolean} [data.completed]
   */
  constructor({
    title,
    id = generateId("task"),
    description = "",
    category = "assignment",
    priority = "medium",
    dueDate = null,
    completed = false,
    createdAt = new Date().toISOString()
  } = {}) {
    // Validasi di dalam constructor: data tidak valid ditolak sejak awal
    if (!title || !String(title).trim()) {
      throw new Error("TaskItem: judul tugas wajib diisi.");
    }

    this.id = id;
    this.title = String(title).trim();
    this.description = String(description ?? "").trim();
    this.category = TASK_CATEGORIES.some((c) => c.value === category) ? category : "assignment";
    this.priority = PRIORITIES.some((p) => p.value === priority) ? priority : "medium";
    this.dueDate = dueDate ? new Date(dueDate).toISOString() : null;
    this.completed = Boolean(completed);
    this.createdAt = createdAt;
    this.updatedAt = new Date().toISOString();
  }

  /* ---------- Getter ---------- */

  /** @returns {number} bobot prioritas (3 = tinggi) */
  get priorityWeight() {
    return PRIORITIES.find((p) => p.value === this.priority)?.weight ?? 0;
  }

  /** @returns {object} metadata kategori (label, warna, ikon) */
  get categoryMeta() {
    return TASK_CATEGORIES.find((c) => c.value === this.category) ?? TASK_CATEGORIES[0];
  }

  /** @returns {object} metadata prioritas (label, warna) */
  get priorityMeta() {
    return PRIORITIES.find((p) => p.value === this.priority) ?? PRIORITIES[1];
  }

  /** @returns {number} selisih hari terhadap hari ini (negatif = lewat) */
  get daysRemaining() {
    if (!this.dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    return Math.round((due - today) / 86_400_000);
  }

  /** @returns {boolean} sudah lewat tenggat & belum selesai */
  get isOverdue() {
    const days = this.daysRemaining;
    return !this.completed && days !== null && days < 0;
  }

  /** @returns {boolean} harus diselesaikan hari ini / besok */
  get isUrgent() {
    const days = this.daysRemaining;
    return !this.completed && days !== null && days >= 0 && days <= 1;
  }

  /* ---------- Method ---------- */

  /**
   * Tandai tugas selesai / belum.
   * Mengembalikan OBJECT BARU (immutable) — bukan `this`.
   * @returns {TaskItem}
   */
  toggle() {
    return new TaskItem({ ...this, completed: !this.completed });
  }

  /**
   * Buat salinan dengan sebagian field diubah.
   * Pola spread yang sama persis dengan Immutable.js / Redux.
   * @param {object} patch
   * @returns {TaskItem}
   */
  update(patch = {}) {
    return new TaskItem({ ...this, ...patch });
  }

  /**
   * Konversi ke plain object (untuk disimpan ke localStorage).
   * JSON.stringify tidak menyimpan prototype class.
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      dueDate: this.dueDate,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Rekonstruksi instance dari object biasa (dari localStorage/API).
   * @param {object} plain
   * @returns {TaskItem}
   */
  static fromJSON(plain) {
    return new TaskItem(plain);
  }
}

/* =========================================================
   CLASS 2 — DashboardApp
   Aggregate root: pemilik seluruh state aplikasi.
   ========================================================= */

export class DashboardApp {
  /**
   * @param {object} [options]
   * @param {Array} [options.tasks]
   * @param {Array} [options.notes]
   * @param {Array} [options.schedule]
   * @param {object} [options.profile]
   */
  constructor({ tasks = [], notes = [], schedule = [], profile = {} } = {}) {
    /* ---- PRIVATE FIELDS (ES2022) ----
       Prefix # membuat variabel benar-benar privat: tidak bisa
       diakses atau diubah dari luar class, bahkan lewat notasi apa pun. */
    this.#tasks = tasks;
    this.#notes = notes;
    this.#schedule = schedule;
    this.#profile = profile;
    this.#listeners = [];
    this.#filters = { search: "", category: "all", priority: "all", status: "all", sort: "dueDate" };

    console.log("%cDashboardApp diinisialisasi", "color:#10b981;font-weight:bold", {
      tasks: tasks.length,
      notes: notes.length,
      schedule: schedule.length
    });
  }

  /* =========================================================
     PRIVATE FIELDS
     ========================================================= */
  #tasks;
  #notes;
  #schedule;
  #profile;
  #listeners;
  #filters;

  /* =========================================================
     BOOTSTRAP: muat dari localStorage
     ========================================================= */

  /**
   * Muat seluruh state awal dari localStorage.
   * Dijalankan sekali saat aplikasi dibuka.
   * @returns {DashboardApp} this (agar bisa dirantai)
   */
  init() {
    const storedTasks = Storage.get(STORAGE_KEYS.TASKS, null);
    const storedNotes = Storage.get(STORAGE_KEYS.NOTES, null);
    const storedSchedule = Storage.get(STORAGE_KEYS.SCHEDULE, null);
    const storedProfile = Storage.get(STORAGE_KEYS.PROFILE, null);

    // Rekonstruksi class TaskItem dari object biasa
    this.#tasks = Array.isArray(storedTasks)
      ? storedTasks.map((plain) => TaskItem.fromJSON(plain))
      : [];

    this.#notes = Array.isArray(storedNotes) ? storedNotes : [];
    this.#schedule = Array.isArray(storedSchedule) && storedSchedule.length
      ? storedSchedule
      : [...DEFAULT_SCHEDULE];

    this.#profile = { ...DEFAULT_PROFILE, ...(storedProfile ?? {}) };

    this.persist();
    this.#emit();

    return this;
  }

  /* =========================================================
     OBSERVER: Beri tahu UI saat state berubah
     ========================================================= */

  /**
   * Daftarkan callback yang dipanggil setiap state berubah.
   * @param {(app: DashboardApp) => void} listener
   * @returns {() => void} fungsi untuk unsubscribe
   */
  subscribe(listener) {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter((fn) => fn !== listener);
    };
  }

  /** Panggil semua listener. Dipanggil setiap kali ada mutasi. */
  #emit() {
    this.#listeners.forEach((fn) => fn(this));
  }

  /** Simpan state ke localStorage, lalu beri tahu listener. */
  persist() {
    Storage.set(STORAGE_KEYS.TASKS, this.#tasks.map((task) => task.toJSON()));
    Storage.set(STORAGE_KEYS.NOTES, this.#notes);
    Storage.set(STORAGE_KEYS.SCHEDULE, this.#schedule);
    Storage.set(STORAGE_KEYS.PROFILE, this.#profile);
  }

  /** Shorthand: persist + emit (dipanggil setiap operasi CRUD). */
  #commit() {
    this.persist();
    this.#emit();
  }

  /* =========================================================
     READER — getter untuk UI
     ========================================================= */

  /** @returns {Array} seluruh tugas (salinan aman) */
  get tasks() {
    return [...this.#tasks];
  }

  /** @returns {Array} seluruh catatan */
  get notes() {
    return [...this.#notes];
  }

  /** @returns {Array} jadwal kuliah */
  get schedule() {
    return [...this.#schedule];
  }

  /** @returns {object} profil mahasiswa */
  get profile() {
    return { ...this.#profile };
  }

  /** @returns {object} filter aktif saat ini */
  get filters() {
    return { ...this.#filters };
  }

  /**
   * Tugas setelah melewati seluruh filter & sorting aktif.
   * Ini yang dirender oleh UI.
   * @returns {Array<TaskItem>}
   */
  get visibleTasks() {
    const { search, category, priority, status, sort } = this.#filters;
    const keyword = search.trim().toLowerCase();

    // FILTER — setiap syarat mengembalikan array baru
    return this.#tasks
      .filter((task) => {
        const matchSearch =
          !keyword ||
          task.title.toLowerCase().includes(keyword) ||
          task.description.toLowerCase().includes(keyword);

        const matchCategory = category === "all" || task.category === category;
        const matchPriority = priority === "all" || task.priority === priority;

        const matchStatus =
          status === "all" ||
          (status === "done" && task.completed) ||
          (status === "undone" && !task.completed) ||
          (status === "overdue" && task.isOverdue);

        return matchSearch && matchCategory && matchPriority && matchStatus;
      })
      // SORTING — TIDAK boleh memakai .sort() langsung pada state!
      .sort((a, b) => {
        switch (sort) {
          case "title":
            return a.title.localeCompare(b.title);
          case "priority":
            return b.priorityWeight - a.priorityWeight;
          case "createdAt":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "dueDate":
          default: {
            // Item tanpa tenggat selalu di akhir
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          }
        }
      });
  }

  /**
   * Statistik ringkasan untuk kartu dashboard.
   * @returns {{total:number, done:number, undone:number, overdue:number, completionRate:number, byCategory:object}}
   */
  get stats() {
    const total = this.#tasks.length;
    const done = this.#tasks.filter((t) => t.completed).length;
    const undone = this.#tasks.filter((t) => !t.completed).length;
    const overdue = this.#tasks.filter((t) => t.isOverdue).length;

    // GROUP BY kategori dengan reduce
    const byCategory = this.#tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] ?? 0) + 1;
      return acc;
    }, {});

    return {
      total,
      done,
      undone,
      overdue,
      byCategory,
      completionRate: total === 0 ? 0 : Math.round((done / total) * 100)
    };
  }

  /**
   * Satu tugas berdasarkan id.
   * @param {string} id
   * @returns {TaskItem|undefined}
   */
  getTaskById(id) {
    return this.#tasks.find((task) => task.id === id);
  }

  /* =========================================================
     MUTATOR — WRITE OPERATIONS
     ========================================================= */

  /**
   * TAMBAHKAN tugas baru.
   * @param {object} data
   * @returns {TaskItem} tugas yang baru dibuat
   */
  addTask(data) {
    let task;

    try {
      task = new TaskItem(data);
    } catch (error) {
      throw new Error(`Gagal menambah tugas — ${error.message}`);
    }

    // IMMUTABLE: array BARU, state lama tidak berubah
    this.#tasks = [...this.#tasks, task];
    this.#commit();

    return task;
  }

  /**
   * Perbarui tugas yang ada.
   * @param {string} id
   * @param {object} patch
   * @returns {TaskItem|null}
   */
  updateTask(id, patch) {
    const index = this.#tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const updated = this.#tasks[index].update(patch);

    // Ubah SALINAN array & elemen pada indeks terkait
    this.#tasks = this.#tasks.map((task, i) => (i === index ? updated : task));
    this.#commit();

    return updated;
  }

  /**
   * Hapus tugas.
   * @param {string} id
   * @returns {boolean} true bila berhasil dihapus
   */
  removeTask(id) {
    const before = this.#tasks.length;
    this.#tasks = this.#tasks.filter((task) => task.id !== id);

    if (this.#tasks.length === before) return false;

    this.#commit();
    return true;
  }

  /**
   * Tandai selesai / belum (toggle).
   * @param {string} id
   * @returns {TaskItem|null}
   */
  toggleTask(id) {
    const target = this.getTaskById(id);
    if (!target) return null;

    return this.updateTask(id, { completed: !target.completed });
  }

  /**
   * Hapus SEMUA tugas yang sudah selesai.
   * @returns {number} jumlah tugas yang dihapus
   */
  clearCompleted() {
    const before = this.#tasks.length;
    this.#tasks = this.#tasks.filter((task) => !task.completed);

    const removed = before - this.#tasks.length;
    if (removed > 0) this.#commit();

    return removed;
  }

  /**
   * Hapus seluruh tugas (dengan konfirmasi di sisi pemanggil).
   * @returns {number}
   */
  clearAllTasks() {
    const removed = this.#tasks.length;
    this.#tasks = [];
    this.#commit();
    return removed;
  }

  /**
   * Isi daftar tugas dari data API (seeding pertama kali).
   * @param {Array} rawItems
   * @returns {number} jumlah tugas yang ditambahkan
   */
  seedTasksFromAPI(rawItems = []) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) return 0;

    const created = rawItems
      // Filter data invalid sebelum membuat object
      .filter((item) => item && item.title)
      .map((item, index) =>
        new TaskItem({
          title: capitalizeFirst(item.title),
          description: item.description ?? "Diimpor dari JSONPlaceholder API.",
          category: index % 2 === 0 ? "assignment" : "reading",
          priority: index % 3 === 0 ? "high" : "medium",
          dueDate: item.dueDate ?? null,
          completed: Boolean(item.completed)
        })
      );

    // Gabungkan dengan data lama memakai SPREAD (tidak menimpa)
    this.#tasks = [...this.#tasks, ...created];
    Storage.set(STORAGE_KEYS.SEEDED, true);
    this.#commit();

    return created.length;
  }

  /* ---------- CATATAN ---------- */

  /**
   * Tambah catatan.
   * @param {{title:string, body:string, color?:string}} data
   * @returns {object} catatan baru
   */
  addNote({ title, body, color = "yellow" }) {
    const note = {
      id: generateId("note"),
      title: String(title ?? "").trim() || "Tanpa judul",
      body: String(body ?? "").trim(),
      color,
      createdAt: new Date().toISOString()
    };

    // Catatan baru selalu di paling atas
    this.#notes = [note, ...this.#notes];
    this.#commit();

    return note;
  }

  /**
   * Perbarui catatan.
   * @param {string} id
   * @param {object} patch
   * @returns {object|null}
   */
  updateNote(id, patch) {
    const exists = this.#notes.some((note) => note.id === id);
    if (!exists) return null;

    this.#notes = this.#notes.map((note) =>
      note.id === id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note
    );
    this.#commit();

    return this.#notes.find((note) => note.id === id);
  }

  /**
   * Hapus catatan.
   * @param {string} id
   * @returns {boolean}
   */
  removeNote(id) {
    const before = this.#notes.length;
    this.#notes = this.#notes.filter((note) => note.id !== id);

    if (this.#notes.length === before) return false;

    this.#commit();
    return true;
  }

  /* ---------- JADWAL ---------- */

  /**
   * Tambah slot jadwal.
   * @param {object} data
   * @returns {object}
   */
  addSchedule(data) {
    const entry = {
      id: generateId("sched"),
      day: data.day ?? "Senin",
      time: data.time ?? "08:00",
      course: String(data.course ?? "").trim() || "Mata Kuliah",
      room: String(data.room ?? "").trim() || "-",
      lecturer: String(data.lecturer ?? "").trim() || "-"
    };

    // Urutkan berdasarkan hari lalu jam — gunakan copy, bukan sort in-place
    this.#schedule = [...this.#schedule, entry].sort(compareSchedule);
    this.#commit();

    return entry;
  }

  /**
   * Hapus slot jadwal.
   * @param {string} id
   * @returns {boolean}
   */
  removeSchedule(id) {
    const before = this.#schedule.length;
    this.#schedule = this.#schedule.filter((entry) => entry.id !== id);

    if (this.#schedule.length === before) return false;

    this.#commit();
    return true;
  }

  /* ---------- PROFIL ---------- */

  /**
   * Perbarui profil mahasiswa.
   * @param {object} patch
   * @returns {object}
   */
  updateProfile(patch) {
    this.#profile = { ...this.#profile, ...patch };
    this.#commit();
    return this.#profile;
  }

  /* ---------- FILTER ---------- */

  /**
   * Ubah filter aktif.
   * @param {object} patch - contoh: { search: "tugas", status: "undone" }
   * @returns {object} filter terbaru
   */
  setFilter(patch) {
    this.#filters = { ...this.#filters, ...patch };
    this.#emit(); // filter berubah -> UI perlu render ulang, TAPI tanpa menulis storage
    return this.filters;
  }

  /** Reset semua filter ke default. */
  resetFilters() {
    this.#filters = { search: "", category: "all", priority: "all", status: "all", sort: "dueDate" };
    this.#emit();
    return this.filters;
  }

  /* ---------- BACKUP / RESET ---------- */

  /**
   * Ekspor data ke file JSON (fitur bonus).
   * @returns {void}
   */
  exportJSON() {
    const blob = new Blob([Storage.exportAll()], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-backup-${formatInputDate(new Date())}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Reset total: hapus semua data dan kembali ke kondisi awal.
   * @returns {void}
   */
  resetAll() {
    Storage.clearAll();
    this.#tasks = [];
    this.#notes = [];
    this.#schedule = [...DEFAULT_SCHEDULE];
    this.#profile = { ...DEFAULT_PROFILE };
    this.#filters = { search: "", category: "all", priority: "all", status: "all", sort: "dueDate" };
    this.#commit();
  }
}

/* =========================================================
   HELPER PRIVAT (di luar class agar tidak ikut jadi member)
   ========================================================= */

/** Huruf pertama kapital */
const capitalizeFirst = (text = "") =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

/** Urutan hari dalam seminggu */
const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

/** Fungsi pembanding untuk sorting jadwal */
const compareSchedule = (a, b) => {
  const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
  return dayDiff !== 0 ? dayDiff : a.time.localeCompare(b.time);
};
