/* =========================================================
   ENTRY POINT — main.js
   =========================================================

   File ini adalah "otak antarmuka" (UI Controller):
   - Mendengarkan event user (click, submit, input, change)
   - Memanggil method pada DashboardApp (state)
   - Meminta render ulang dari app.js (view)
   - Mengatur pemanggilan API asinkron (async/await)

   ALUR SATU SIKLUS INTERAKSI:
     User klik -> Event Handler -> app.addTask() -> #emit()
               -> render() -> DOM berubah (feedback visual)
   ========================================================= */

import { DashboardApp, TaskItem } from "./modules/classes.js";
import { Storage } from "./modules/storage.js";
import { getAllDashboardDataSafe, refreshQuote } from "./modules/api.js";
import { TASK_CATEGORIES, DEFAULT_PROFILE } from "./modules/constants.js";
import { escapeHTML } from "./modules/utils.js";
import { icon } from "./modules/icons.js";

import {
  renderTaskList,
  renderWeather,
  renderQuote,
  renderSchedule,
  renderNotes,
  renderNoteColors,
  renderProfile,
  renderStats,
  renderStorageInfo,
  renderCategoryFilter,
  renderPriorityFilter,
  showToast
} from "./app.js";

/* =========================================================
   STATE APLIKASI (UI-level)
   ========================================================= */

const app = new DashboardApp().init();

const uiState = {
  editingTaskId: null,   // id tugas yang sedang diedit (null = mode tambah)
  editingNoteId: null,   // id catatan yang sedang diedit
  weather: null,
  weatherLoading: true,
  weatherError: null,
  quote: null,
  quoteLoading: true,
  quoteError: null
};

/* Shorthand query selector — arrow function */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/* =========================================================
   RENDER — satu fungsi untuk menggambar seluruh UI
   ========================================================= */

/**
 * Ganti setiap elemen ber-atribut [data-icon] dengan SVG asli.
 *
 * Dipakai untuk ikon di HTML statis (index.html) supaya markup-nya
 * tetap ringkas - cukup tulis data-icon="namaIkon".
 */
function hydrateIcons(root = document) {
  $$("[data-icon]", root).forEach((el) => {
    const name = el.dataset.icon;
    const size = Number(el.dataset.size) || 16;
    el.innerHTML = icon(name, size);
    el.removeAttribute("data-icon");
    el.removeAttribute("data-size");
  });
}
function render() {
  const filters = app.filters;
  const visibleTasks = app.visibleTasks;
  const hasFilterActive =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.priority !== "all" ||
    filters.status !== "all";

  // Kepala: profil + tanggal hari ini
  $("#profileBox").innerHTML = renderProfile(app.profile);
  $("#todayText").textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Statistik
  $("#statsBox").innerHTML = renderStats(app.stats);

  // Filter
  $("#categoryFilterBox").innerHTML = renderCategoryFilter(filters.category);
  $("#priorityFilterBox").innerHTML = renderPriorityFilter(filters.priority);

  // Status pills
  $$("[data-status-filter]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.statusFilter === filters.status);
  });

  // Daftar tugas
  $("#taskList").innerHTML = renderTaskList(visibleTasks, hasFilterActive);
  $("#taskCount").textContent =
    visibleTasks.length === app.tasks.length
      ? `${app.tasks.length} tugas`
      : `${visibleTasks.length} dari ${app.tasks.length} tugas`;

  // Sort select
  $("#sortSelect").value = filters.sort;

  // Jadwal & catatan
  $("#scheduleBox").innerHTML = renderSchedule(app.schedule);
  $("#notesBox").innerHTML = renderNotes(app.notes);

  // Widget async
  $("#weatherBox").innerHTML = renderWeather(uiState.weather, {
    loading: uiState.weatherLoading,
    error: uiState.weatherError
  });
  $("#quoteBox").innerHTML = renderQuote(uiState.quote, {
    loading: uiState.quoteLoading,
    error: uiState.quoteError
  });

  // Info penyimpanan
  $("#storageBox").innerHTML = renderStorageInfo(Storage.getStats());
}

/* =========================================================
   MODAL FORM (tambah / edit tugas)
   ========================================================= */

/**
 * Buka modal dalam mode "tambah" atau "edit".
 * @param {TaskItem|null} task
 */
function openTaskModal(task = null) {
  const modal = $("#taskModal");
  const form = $("#taskForm");

  uiState.editingTaskId = task?.id ?? null;

  $("#taskModalTitle").innerHTML = task ? "Edit tugas" : "Tambah tugas baru";
  $("#taskSubmitBtn").innerHTML = task ? `${icon("check", 14)} Simpan perubahan` : `${icon("plus", 14)} Tambah tugas`;

  // Reset form lalu isi dengan data tugas bila mode edit
  form.reset();
  $("#taskSubmitBtn").classList.remove("is-loading");

  if (task) {
    form.title.value = task.title;
    form.description.value = task.description;
    form.category.value = task.category;
    form.priority.value = task.priority;
    form.dueDate.value = task.dueDate ? task.dueDate.slice(0, 10) : "";
    form.completed.checked = task.completed;
  }

  modal.hidden = false;
  document.body.classList.add("modal-open");
  form.title.focus();
}

/** Tutup modal. */
function closeTaskModal() {
  $("#taskModal").hidden = true;
  document.body.classList.remove("modal-open");
  uiState.editingTaskId = null;
}

/* =========================================================
   MODAL CATATAN
   ========================================================= */

function openNoteModal(note = null) {
  const modal = $("#noteModal");
  const form = $("#noteForm");

  uiState.editingNoteId = note?.id ?? null;

  $("#noteModalTitle").innerHTML = note ? "Edit catatan" : "Tulis catatan";
  form.reset();

  if (note) {
    form.title.value = note.title;
    form.body.value = note.body;
    form.color.value = note.color;
  }

  modal.hidden = false;
  document.body.classList.add("modal-open");
  form.title.focus();
}

function closeNoteModal() {
  $("#noteModal").hidden = true;
  document.body.classList.remove("modal-open");
  uiState.editingNoteId = null;
}

/* =========================================================
   MODAL PROFIL
   ========================================================= */

function openProfileModal() {
  const form = $("#profileForm");
  const { name, nim, major, semester } = app.profile;

  form.name.value = name;
  form.nim.value = nim;
  form.major.value = major;
  form.semester.value = semester;

  $("#profileModal").hidden = false;
  document.body.classList.add("modal-open");
  form.name.focus();
}

function closeProfileModal() {
  $("#profileModal").hidden = true;
  document.body.classList.remove("modal-open");
}

/* =========================================================
   ASYNC — pemanggilan API publik
   ========================================================= */

/**
 * Muat seluruh data eksternal secara paralel.
 * Dijalankan saat aplikasi pertama kali dibuka.
 */
async function loadRemoteData() {
  uiState.weatherLoading = true;
  uiState.quoteLoading = true;
  render();

  const startedAt = performance.now();

  try {
    // Async/Await + Promise.allSettled di dalam modul api.js
    const { weather, quote, tasks, errors } = await getAllDashboardDataSafe();
    const elapsed = Math.round(performance.now() - startedAt);

    uiState.weather = weather;
    uiState.quote = quote;
    uiState.weatherLoading = false;
    uiState.quoteLoading = false;
    uiState.weatherError = errors.includes("cuaca") ? "Gagal memuat data cuaca." : null;
    uiState.quoteError = errors.includes("kutipan") ? "Gagal memuat kutipan." : null;

    // Seeding tugas HANYA pada kunjungan pertama (belum pernah diisi)
    const alreadySeeded = Storage.get("seeded", false);
    if (!alreadySeeded && tasks.length > 0) {
      const added = app.seedTasksFromAPI(tasks);
      showToast(`${added} tugas contoh diimpor dari JSONPlaceholder API`, "info");
    }

    if (errors.length > 0) {
      showToast(`Sebagian data gagal dimuat: ${errors.join(", ")}`, "error");
    } else {
      console.log(`%c[API] Semua data dimuat paralel dalam ${elapsed}ms`, "color:#10b981");
    }
  } catch (error) {
    // Jaring pengaman terakhir: app TIDAK boleh crash karena jaringan
    uiState.weatherLoading = false;
    uiState.quoteLoading = false;
    uiState.weatherError = error.message;
    uiState.quoteError = error.message;
    console.error("[API] Error tak terduga:", error);
  } finally {
    render();
  }
}

/** Muat ulang satu widget cuaca saja. */
async function reloadWeather() {
  uiState.weatherLoading = true;
  uiState.weatherError = null;
  render();

  try {
    const { getWeather } = await import("./modules/api.js");
    uiState.weather = await getWeather();
  } catch (error) {
    uiState.weatherError = error.message;
  } finally {
    uiState.weatherLoading = false;
    render();
  }
}

/** Ambil kutipan baru. */
async function reloadQuote() {
  uiState.quoteLoading = true;
  uiState.quoteError = null;
  render();

  try {
    uiState.quote = await refreshQuote();
  } catch (error) {
    uiState.quoteError = error.message;
  } finally {
    uiState.quoteLoading = false;
    render();
  }
}

/* =========================================================
   EVENT HANDLER
   ========================================================= */

function handleTaskSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const button = $("#taskSubmitBtn");

  // Cegah klik ganda saat proses berjalan
  if (button.classList.contains("is-loading")) return;

  // Validasi: judul wajib diisi
  if (!form.title.value.trim()) {
    showToast("Judul tugas tidak boleh kosong.", "error");
    form.title.focus();
    return;
  }

  button.classList.add("is-loading");
  button.innerHTML = `<span class="spinner spinner--xs"></span> Menyimpan`;

  /* Kumpulkan nilai form menjadi satu objek.
     PENTING: ambil .value/.checked SEBELUM masuk setTimeout,
     karena element form bisa di-reset atau ditutup sewaktu-waktu. */
  const { title, description, category, priority, dueDate, completed } = form.elements;

  const payload = {
    title: title.value.trim(),
    description: description.value,
    category: category.value,
    priority: priority.value,
    dueDate: dueDate.value || null,
    completed: completed.checked
  };

  // Tunda sedikit supaya efek "menyimpan" terlihat
  setTimeout(() => {
    try {
      if (uiState.editingTaskId) {
        app.updateTask(uiState.editingTaskId, payload);
        showToast(`Tugas "${payload.title}" diperbarui.`);
      } else {
        app.addTask(payload);
        showToast(`Tugas "${payload.title}" ditambahkan.`);
      }

      form.reset();
      closeTaskModal();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      button.classList.remove("is-loading");
    }
  }, 280);
}

function handleNoteSubmit(event) {
  event.preventDefault();

  const form = event.target;

  // PENTING: nama elemen input di HTML adalah "noteColor" (radio group),
  // BUKAN "color". Destructure harus mengikuti nama tersebut.
  const { title, body, noteColor } = form.elements;

  const payload = {
    title: title.value.trim() || "Tanpa judul",
    body: body.value,
    // RadioNodeList -> ambil nilai yang sedang ter-check
    color: noteColor?.value ?? "yellow"
  };

  if (uiState.editingNoteId) {
    app.updateNote(uiState.editingNoteId, payload);
    showToast("Catatan diperbarui.");
  } else {
    app.addNote(payload);
    showToast("Catatan disimpan.");
  }

  form.reset();
  closeNoteModal();
}

function handleProfileSubmit(event) {
  event.preventDefault();

  const { name, nim, major, semester } = event.target.elements;
  app.updateProfile({
    name: name.value.trim() || DEFAULT_PROFILE.name,
    nim: nim.value.trim() || DEFAULT_PROFILE.nim,
    major: major.value.trim() || DEFAULT_PROFILE.major,
    semester: Number(semester.value) || DEFAULT_PROFILE.semester
  });

  closeProfileModal();
  showToast("Profil diperbarui.");
}

function handleScheduleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const { day, time, course, room, lecturer } = form.elements;

  app.addSchedule({
    day: day.value,
    time: time.value,
    course: course.value,
    room: room.value,
    lecturer: lecturer.value
  });

  form.reset();
  showToast("Slot jadwal ditambahkan.");
}

function handleTaskListClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const card = button.closest(".task-card");
  const taskId = card?.dataset.id;
  if (!taskId) return;

  const { action } = button.dataset;
  const task = app.getTaskById(taskId);

  switch (action) {
    case "toggle":
      app.toggleTask(taskId);
      if (task?.completed) {
        showToast(`"${task.title}" ditandai selesai.`);
      }
      break;

    case "edit":
      openTaskModal(task);
      break;

    case "delete":
      if (confirm(`Hapus tugas "${task?.title}"?\nTindakan ini tidak bisa dibatalkan.`)) {
        app.removeTask(taskId);
        showToast("Tugas dihapus.", "info");
      }
      break;

    default:
      break;
  }
}

function handleNotesClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === "delete-note") {
    if (confirm("Hapus catatan ini?")) {
      app.removeNote(id);
      showToast("Catatan dihapus.", "info");
    }
  }

  if (action === "edit-note") {
    const note = app.notes.find((n) => n.id === id);
    openNoteModal(note);
  }
}

function handleGlobalClick(event) {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;

  const { action } = actionEl.dataset;

  // Aksi global (tidak milik kartu tugas/catatan tertentu)
  const globalActions = {
    "open-task-modal": () => openTaskModal(),
    "close-task-modal": closeTaskModal,
    "open-note-modal": () => openNoteModal(),
    "close-note-modal": closeNoteModal,
    "edit-profile": openProfileModal,
    "close-profile-modal": closeProfileModal,
    "reload-weather": reloadWeather,
    "refresh-quote": reloadQuote,
    "clear-completed": () => {
      const removed = app.clearCompleted();
      showToast(
        removed > 0 ? `${removed} tugas selesai dihapus.` : "Tidak ada tugas selesai.",
        removed > 0 ? "success" : "info"
      );
    },
    "delete-schedule": () => {
      const { id } = actionEl.dataset;
      if (confirm("Hapus slot jadwal ini?")) {
        app.removeSchedule(id);
        showToast("Slot jadwal dihapus.", "info");
      }
    },
    export: () => {
      app.exportJSON();
      showToast("Data diekspor sebagai file JSON.");
    },
    "reset-all": () => {
      if (confirm("Reset TOTAL?\n\nSemua tugas, catatan, jadwal, dan profil akan dihapus permanen dari localStorage.")) {
        app.resetAll();
        uiState.editingTaskId = null;
        showToast("Semua data telah direset.", "info");
      }
    },
    "seed-from-api": () => {
      import("./modules/api.js")
        .then((api) => api.getSeedTasks())
        .then((items) => {
          const added = app.seedTasksFromAPI(items);
          showToast(
            added > 0 ? `${added} tugas diimpor dari API.` : "Tidak ada data untuk diimpor.",
            added > 0 ? "success" : "info"
          );
        })
        .catch(() => showToast("Gagal menghubungi API.", "error"));
    }
  };

  if (globalActions[action]) {
    globalActions[action]();
    return;
  }

  // Aksi yang sudah ditangani handler khusus
  if (["edit", "toggle", "delete", "delete-note", "edit-note"].includes(action)) return;
}

function handleFilterClick(event) {
  const chip = event.target.closest("[data-filter]");
  if (!chip) return;

  const { filter, value } = chip.dataset;
  app.setFilter({ [filter]: value });
}

function handleStatusFilter(event) {
  const btn = event.target.closest("[data-status-filter]");
  if (!btn) return;

  app.setFilter({ status: btn.dataset.statusFilter });
}

function handleSearch(event) {
  app.setFilter({ search: event.target.value });
}

function handleSortChange(event) {
  app.setFilter({ sort: event.target.value });
}

/* =========================================================
   INIT — pasang semua listener
   ========================================================= */

function init() {
  /* Isi dropdown kategori.
     Catatan: elemen <option> hanya bisa menampilkan TEKS, bukan SVG,
     jadi di sini sengaja tidak dipakai ikon (seperti shadcn Select). */
  const categoryOptions = TASK_CATEGORIES.map(
    ({ value, label }) => `<option value="${value}">${escapeHTML(label)}</option>`
  ).join("");

  // Tempelkan opsi kategori ke dropdown form tugas
  $("[name='category']").innerHTML = categoryOptions;

  // Opsi warna catatan
  $("#noteColorBox").innerHTML = renderNoteColors();

  /* ---- OBSERVER PATTERN (WAJIB) ----
     Daftarkan render() sebagai listener. Setiap kali state berubah
     (addTask / toggleTask / setFilter / dst.), DashboardApp memanggil
     #emit() yang otomatis memanggil render() ini.

     TANPA baris ini, UI tidak pernah diperbarui setelah state berubah. */
  app.subscribe(render);

  // Render pertama + hidrasi ikon pada HTML statis
  render();
  hydrateIcons();

  // ---- Listener form ----
  $("#taskForm").addEventListener("submit", handleTaskSubmit);
  $("#noteForm").addEventListener("submit", handleNoteSubmit);
  $("#profileForm").addEventListener("submit", handleProfileSubmit);
  $("#scheduleForm").addEventListener("submit", handleScheduleSubmit);

  // ---- Listener klik global (delegation) ----
  document.addEventListener("click", handleGlobalClick);
  $("#taskList").addEventListener("click", handleTaskListClick);
  $("#notesBox").addEventListener("click", handleNotesClick);
  $("#categoryFilterBox").addEventListener("click", handleFilterClick);
  $("#priorityFilterBox").addEventListener("click", handleFilterClick);
  $("#statusFilterBox").addEventListener("click", handleStatusFilter);

  // ---- Listener input ----
  $("#searchInput").addEventListener("input", handleSearch);
  $("#sortSelect").addEventListener("change", handleSortChange);

  // ---- Tutup modal dengan tombol ESC ----
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeTaskModal();
    closeNoteModal();
    closeProfileModal();
  });

  // ---- Klik area gelap menutup modal ----
  $$(".modal__backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", () => {
      closeTaskModal();
      closeNoteModal();
      closeProfileModal();
    });
  });

  // ---- Muat data eksternal (async) ----
  loadRemoteData();

  console.log(
    "%cDashboard siap!%c Semua state dikelola oleh DashboardApp.",
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

/* Ekspor instance untuk keperluan debugging di Console */
export { app, TaskItem, uiState };