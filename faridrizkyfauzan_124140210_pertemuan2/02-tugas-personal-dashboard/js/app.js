/* =========================================================
   MODUL RENDERER — app.js
   =========================================================

   File ini BERISI TIDAK ADA logika bisnis.
   Tugasnya murni: mengubah state (data) menjadi HTML (tampilan).

   DEMONSTRASI:
   - TEMPLATE LITERALS  -> seluruh markup dibangun dengan backtick
   - ARROW FUNCTIONS   -> semua handler & renderer
   - DESTRUCTURING     -> di parameter & di body
   - SPREAD OPERATOR   -> menyalin array saat render
   - MAP/FILTER        -> untuk merender daftar

   GAYA VISUAL:
   Mengikuti tema shadcn/ui — netral, border tipis, tanpa warna-warna
   berani, dan tanpa emoji. Semua ikon memakai SVG dari modules/icons.js.
   ========================================================= */

import {
  TASK_CATEGORIES,
  PRIORITIES,
  LOCATION
} from "./modules/constants.js";

import {
  escapeHTML,
  formatDate,
  getInitials,
  truncate
} from "./modules/utils.js";

import { icon } from "./modules/icons.js";

/* =========================================================
   1. KOMPONEN KECIL (reusable snippets)
   ========================================================= */

/** Avatar inisial mahasiswa */
export const renderAvatar = ({ name = "?", size = 40 } = {}) => `
  <div class="avatar" style="--avatar-size:${size}px" aria-hidden="true">
    ${getInitials(name)}
  </div>
`;

/** Kartu statistik */
export const renderStatCard = ({ label, value, hint = "", tone = "default", iconName = "dashboard" }) => `
  <article class="stat-card" data-tone="${tone}">
    <div class="stat-card__icon">${icon(iconName, 16)}</div>
    <div class="stat-card__body">
      <span class="stat-card__value">${value}</span>
      <span class="stat-card__label">${escapeHTML(label)}</span>
      ${hint ? `<span class="stat-card__hint">${escapeHTML(hint)}</span>` : ""}
    </div>
  </article>
`;

/** Bar progres penyelesaian */
export const renderProgressBar = (rate) => `
  <div class="progress-wrap">
    <div class="progress" role="progressbar"
         aria-valuenow="${rate}" aria-valuemin="0" aria-valuemax="100"
         aria-label="Progres penyelesaian tugas">
      <div class="progress__fill" style="width:${Math.max(0, Math.min(100, rate))}%"></div>
    </div>
    <span class="progress__text">${rate}%</span>
  </div>
`;

/**
 * Lencana (badge) status tenggat.
 *
 * PENTING: `daysRemaining` adalah ANGKA (hasil hitungan TaskItem),
 * bukan objek Date. Karena itu teksnya dibuat langsung dari angka —
 * jangan pernah meneruskannya ke formatRelative() yang menerima Date.
 */
const renderDueBadge = ({ isOverdue, isUrgent, daysRemaining }) => {
  // Tanpa tenggat
  if (daysRemaining === null) {
    return `<span class="badge" data-tone="muted">Tanpa tenggat</span>`;
  }

  // Sudah lewat tenggat
  if (isOverdue) {
    return `<span class="badge" data-tone="danger">${icon("warning", 12)} Terlambat ${Math.abs(daysRemaining)} hari</span>`;
  }

  // Mendesak: hari ini / besok
  if (isUrgent) {
    const label = daysRemaining === 0 ? "Hari ini" : daysRemaining === 1 ? "Besok" : `${daysRemaining} hari lagi`;
    return `<span class="badge" data-tone="warning">${icon("flame", 12)} ${label}</span>`;
  }

  // Masih lama
  return `<span class="badge" data-tone="info">${icon("calendar", 12)} ${daysRemaining} hari lagi</span>`;
};

/**
 * Tombol ikon-only (dipakai di header widget, kartu tugas, catatan, jadwal).
 * @param {object} o
 * @param {string} o.action    nilai untuk data-action
 * @param {string} o.iconName  nama ikon dari modules/icons.js
 * @param {string} o.label     teks untuk title & aria-label
 * @param {string} [o.variant] class tambahan
 * @param {string} [o.dataId]  nilai untuk data-id (opsional)
 */
export const renderIconButton = ({ action, iconName, label, variant = "", dataId = "" }) => `
  <button class="icon-btn ${variant}" type="button"
          data-action="${action}"
          ${dataId ? `data-id="${escapeHTML(dataId)}"` : ""}
          title="${escapeHTML(label)}" aria-label="${escapeHTML(label)}">
    ${icon(iconName, 15)}
  </button>
`;

/** Pil filter */
export const renderCategoryFilter = (activeCategory) => `
  <div class="filter-chips" role="group" aria-label="Filter kategori">
    <button class="filter-chip ${activeCategory === "all" ? "is-active" : ""}"
            data-filter="category" data-value="all" type="button">Semua</button>
    ${TASK_CATEGORIES.map(
      ({ value, label, icon: iconName }) => `
      <button class="filter-chip ${activeCategory === value ? "is-active" : ""}"
              data-filter="category" data-value="${value}" type="button">
        ${icon(iconName, 13)} ${escapeHTML(label)}
      </button>`
    ).join("")}
  </div>
`;

/** Pil filter prioritas */
export const renderPriorityFilter = (activePriority) => `
  <div class="filter-chips" role="group" aria-label="Filter prioritas">
    <button class="filter-chip ${activePriority === "all" ? "is-active" : ""}"
            data-filter="priority" data-value="all" type="button">Semua prioritas</button>
    ${PRIORITIES.map(
      ({ value, label }) => `
      <button class="filter-chip ${activePriority === value ? "is-active" : ""}"
              data-filter="priority" data-value="${value}" type="button">
        ${escapeHTML(label)}
      </button>`
    ).join("")}
  </div>
`;

/* =========================================================
   2. KARTU TUGAS
   ========================================================= */

/**
 * Render satu kartu tugas.
 * SEMUA markup dibangun dengan template literal.
 * @param {import("./modules/classes.js").TaskItem} task
 */
export const renderTaskCard = (task) => {
  // DESTRUCTURING instance class + getter-nya
  const {
    id,
    title,
    description,
    completed,
    dueDate,
    categoryMeta,
    priorityMeta,
    isOverdue,
    isUrgent,
    daysRemaining
  } = task;

  return `
    <article class="task-card ${completed ? "is-done" : ""} ${isOverdue ? "is-overdue" : ""}"
             data-id="${escapeHTML(id)}">
      <div class="task-card__head">
        <label class="task-check" title="Tandai selesai / belum">
          <input type="checkbox" data-action="toggle" ${completed ? "checked" : ""}
                 aria-label="Tandai '${escapeHTML(title)}' selesai" />
          <span class="task-check__box" aria-hidden="true">
            ${icon("check", 13)}
          </span>
        </label>

        <div class="task-card__heading">
          <h4 class="task-card__title">${escapeHTML(title)}</h4>
          <div class="task-card__meta">
            <span class="badge" data-tone="${categoryMeta.tone}">
              ${icon(categoryMeta.icon, 12)} ${escapeHTML(categoryMeta.label)}
            </span>
            <span class="badge" data-tone="${priorityMeta.tone}">
              ${icon(priorityMeta.icon, 12)} ${escapeHTML(priorityMeta.label)}
            </span>
            ${renderDueBadge({ isOverdue, isUrgent, daysRemaining })}
          </div>
        </div>

        <div class="task-card__actions">
          ${renderIconButton({ action: "edit", iconName: "pencil", label: "Edit tugas" })}
          ${renderIconButton({ action: "delete", iconName: "trash", label: "Hapus tugas", variant: "icon-btn--danger" })}
        </div>
      </div>

      ${description ? `<p class="task-card__desc">${escapeHTML(truncate(description, 180))}</p>` : ""}

      <footer class="task-card__footer">
        <span>Dibuat ${escapeHTML(formatDate(task.createdAt))}</span>
        ${dueDate ? `<span>Tenggat ${escapeHTML(formatDate(dueDate))}</span>` : "<span>Tanpa tenggat</span>"}
      </footer>
    </article>
  `;
};

/**
 * Render daftar tugas (atau pesan kosong).
 * @param {Array} tasks
 * @param {boolean} [isFiltered]
 */
export const renderTaskList = (tasks, isFiltered = false) => {
  if (!tasks || tasks.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">${icon(isFiltered ? "search" : "clipboard", 22)}</div>
        <h3>${isFiltered ? "Tidak ada tugas yang cocok" : "Belum ada tugas"}</h3>
        <p>${
          isFiltered
            ? "Coba ubah kata kunci atau atur ulang filter."
            : 'Tambahkan tugas pertama lewat tombol "Tambah tugas" di atas.'
        }</p>
      </div>
    `;
  }

  // SPREAD: render dari salinan agar aman bila array berubah saat render
  return [...tasks].map(renderTaskCard).join("");
};

/* =========================================================
   3. WIDGET CUACA
   ========================================================= */

export const renderWeather = (weather, { loading = false, error = null } = {}) => {
  if (loading) {
    return `
      <article class="widget widget--weather">
        <header class="widget__header">
          <h3>Cuaca di ${escapeHTML(LOCATION.name)}</h3>
          ${renderIconButton({ action: "reload-weather", iconName: "refresh", label: "Muat ulang cuaca" })}
        </header>
        <div class="widget__loading"><span class="spinner"></span> Mengambil data cuaca</div>
      </article>
    `;
  }

  if (error || weather?.temperature === null) {
    return `
      <article class="widget widget--weather" data-tone="muted">
        <header class="widget__header">
          <h3>Cuaca di ${escapeHTML(LOCATION.name)}</h3>
          ${renderIconButton({ action: "reload-weather", iconName: "refresh", label: "Coba lagi" })}
        </header>
        <div class="widget__empty">
          <p class="widget__empty-title">${icon("warning", 14)} Gagal memuat cuaca</p>
          <small>${escapeHTML(error ?? "Data tidak dapat diakses.")}</small>
        </div>
      </article>
    `;
  }

  const { icon: iconName, label, temperature, windSpeed, time } = weather;

  return `
    <article class="widget widget--weather">
      <header class="widget__header">
        <h3>Cuaca di ${escapeHTML(weather.location)}</h3>
        ${renderIconButton({ action: "reload-weather", iconName: "refresh", label: "Muat ulang cuaca" })}
      </header>

      <div class="weather">
        <div class="weather__main">
          <span class="weather__icon">${icon(iconName, 30)}</span>
          <div>
            <strong class="weather__temp">${temperature}&deg;C</strong>
            <span class="weather__label">${escapeHTML(label)}</span>
          </div>
        </div>

        <ul class="weather__details">
          <li>
            <span>${icon("wind", 13)} Angin</span>
            <strong>${windSpeed} km/h</strong>
          </li>
          <li>
            <span>${icon("clock", 13)} Diperbarui</span>
            <strong>${escapeHTML(time ?? "-")}</strong>
          </li>
        </ul>
      </div>

      <small class="widget__source">Sumber: Open-Meteo (gratis, tanpa API key)</small>
    </article>
  `;
};

/* =========================================================
   4. WIDGET KUTIPAN
   ========================================================= */

export const renderQuote = (quote, { loading = false, error = null } = {}) => {
  if (loading) {
    return `
      <article class="widget widget--quote">
        <div class="widget__loading"><span class="spinner"></span> Mengambil kutipan</div>
      </article>
    `;
  }

  if (error || !quote?.quote) {
    return `
      <article class="widget widget--quote" data-tone="muted">
        <p class="widget__empty-title">${icon("warning", 14)} Kutipan tidak dapat dimuat</p>
        <small>${escapeHTML(error ?? "Periksa koneksi internet Anda.")}</small>
      </article>
    `;
  }

  return `
    <article class="widget widget--quote">
      <blockquote>${escapeHTML(truncate(quote.quote, 180))}</blockquote>
      <div class="widget__quote-foot">
        <cite>${escapeHTML(quote.author)}</cite>
        <button class="btn btn--tiny" data-action="refresh-quote" type="button">
          ${icon("refresh", 13)} Kutipan lain
        </button>
      </div>
    </article>
  `;
};

/* =========================================================
   5. WIDGET JADWAL KULIAH
   ========================================================= */

export const renderSchedule = (schedule = []) => {
  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const todayName = DAYS[(new Date().getDay() + 6) % 7];

  if (schedule.length === 0) {
    return `
      <p class="widget__empty">
        ${icon("graduation", 14)} Belum ada jadwal kuliah.
      </p>
    `;
  }

  return `
    <ul class="schedule-list">
      ${schedule
        .map(
          (entry) => `
          <li class="schedule-item ${entry.day === todayName ? "is-today" : ""}"
              data-id="${escapeHTML(entry.id)}">
            <div class="schedule-item__day">
              <strong>${escapeHTML(entry.day.slice(0, 3))}</strong>
              <span>${escapeHTML(entry.time)}</span>
            </div>

            <div class="schedule-item__info">
              <h4>${escapeHTML(entry.course)}</h4>
              <p>
                <span>${icon("doorOpen", 11)} ${escapeHTML(entry.room)}</span>
                <span>${icon("user", 11)} ${escapeHTML(entry.lecturer)}</span>
              </p>
            </div>

            ${entry.day === todayName ? `<span class="badge" data-tone="info">Hari ini</span>` : ""}

            ${renderIconButton({
              action: "delete-schedule",
              iconName: "trash",
              label: "Hapus slot jadwal",
              variant: "icon-btn--danger",
              dataId: entry.id
            })}
          </li>`
        )
        .join("")}
    </ul>
  `;
};

/* =========================================================
   6. WIDGET CATATAN
   ========================================================= */

const NOTE_TONES = ["yellow", "blue", "green", "pink", "purple"];

export const renderNotes = (notes = []) => {
  if (notes.length === 0) {
    return `
      <p class="widget__empty">
        ${icon("pencil", 14)} Belum ada catatan.
      </p>
    `;
  }

  return `
    <div class="notes-grid">
      ${notes
        .map(
          (note) => `
          <article class="note" data-tone="${NOTE_TONES.includes(note.color) ? note.color : "yellow"}"
                   data-id="${escapeHTML(note.id)}">
            <header class="note__head">
              <h4>${escapeHTML(note.title)}</h4>
              <div class="note__actions">
                ${renderIconButton({
                  action: "edit-note",
                  iconName: "pencil",
                  label: "Edit catatan",
                  dataId: note.id
                })}
                ${renderIconButton({
                  action: "delete-note",
                  iconName: "trash",
                  label: "Hapus catatan",
                  variant: "icon-btn--danger",
                  dataId: note.id
                })}
              </div>
            </header>
            <p class="note__body">${escapeHTML(note.body) || "<em>(kosong)</em>"}</p>
            <footer class="note__meta">${escapeHTML(formatDate(note.createdAt))}</footer>
          </article>`
        )
        .join("")}
    </div>
  `;
};

/** Opsi warna untuk form catatan */
export const renderNoteColors = () =>
  NOTE_TONES.map(
    (tone, index) => `
      <label class="color-option">
        <input type="radio" name="noteColor" value="${tone}" ${index === 0 ? "checked" : ""} />
        <span class="color-swatch" data-tone="${tone}"></span>
      </label>`
  ).join("");

/* =========================================================
   7. KEPALA DASHBOARD
   ========================================================= */

export const renderProfile = ({ name, nim, major, semester }) => `
  <div class="profile">
    ${renderAvatar({ name, size: 44 })}
    <div class="profile__info">
      <h2>${escapeHTML(name)}</h2>
      <p>
        <span class="profile__nim">${escapeHTML(nim)}</span>
        <span>${escapeHTML(major)}</span>
        <span>Semester ${escapeHTML(String(semester))}</span>
      </p>
    </div>
    <button class="btn btn--outline btn--sm" data-action="edit-profile" type="button">
      ${icon("pencil", 13)} Edit profil
    </button>
  </div>
`;

/* =========================================================
   8. RINGKASAN STATISTIK
   ========================================================= */

export const renderStats = ({ total, done, undone, overdue, completionRate, byCategory }) => {
  const categoryRows = TASK_CATEGORIES
    .map(({ value, label, icon: iconName }) => {
      const count = byCategory?.[value] ?? 0;
      const percent = total === 0 ? 0 : Math.round((count / total) * 100);
      return `
        <li class="cat-row">
          <span class="cat-row__label">${icon(iconName, 13)} ${escapeHTML(label)}</span>
          <div class="cat-row__bar"><span style="width:${percent}%" data-tone="${value}"></span></div>
          <span class="cat-row__count">${count}</span>
        </li>`;
    })
    .join("");

  return `
    <section class="stats-grid">
      ${renderStatCard({ label: "Total tugas",     value: total,   iconName: "clipboard",  tone: "default" })}
      ${renderStatCard({ label: "Selesai",         value: done,    iconName: "circleCheck", tone: "success" })}
      ${renderStatCard({ label: "Belum selesai",   value: undone,  iconName: "clock",      tone: "warning" })}
      ${renderStatCard({ label: "Terlambat",       value: overdue, iconName: "warning",    tone: "danger" })}
    </section>

    <section class="card card--progress">
      <header class="card__header">
        <h3>Progres tugas</h3>
        <span class="card__meta">${done} dari ${total} selesai</span>
      </header>
      ${renderProgressBar(completionRate)}
      <ul class="cat-list">${categoryRows}</ul>
    </section>
  `;
};

/* =========================================================
   9. INFO STORAGE
   ========================================================= */

export const renderStorageInfo = (stats) => `
  <div class="storage-info ${stats.available ? "" : "is-offline"}">
    <strong>${icon("hardDrive", 14)} Penyimpanan lokal</strong>
    <ul>
      <li>
        Status
        <code>${stats.available ? "localStorage aktif" : "fallback in-memory"}</code>
      </li>
      <li>Item tersimpan <strong>${stats.items}</strong> (tugas, catatan, jadwal)</li>
      <li>Jumlah key <strong>${stats.keys}</strong> &middot; Ukuran <strong>${(stats.bytes / 1024).toFixed(2)} KB</strong></li>
      ${stats.error ? `<li class="text-danger">${icon("warning", 12)} ${escapeHTML(stats.error)}</li>` : ""}
    </ul>
    <div class="storage-info__actions">
      <button class="btn btn--outline btn--sm" data-action="export" type="button">
        ${icon("download", 13)} Ekspor JSON
      </button>
      <button class="btn btn--outline btn--sm btn--danger" data-action="reset-all" type="button">
        ${icon("trash", 13)} Reset semua data
      </button>
    </div>
  </div>
`;

/* =========================================================
   10. TOAST NOTIFICATION
   ========================================================= */

let toastTimerId = null;

/**
 * Tampilkan notifikasi singkat di pojok kanan bawah.
 * @param {string} message
 * @param {"success"|"error"|"info"} [type]
 */
export const showToast = (message, type = "success") => {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  clearTimeout(toastTimerId);

  const iconName = type === "error" ? "warning" : type === "info" ? "info" : "check";
  container.innerHTML = `
    <div class="toast" data-tone="${type}" role="status">
      ${icon(iconName, 15)}
      <span>${escapeHTML(message)}</span>
    </div>
  `;

  toastTimerId = setTimeout(() => {
    container.innerHTML = "";
  }, 3200);
};

/* Catatan: file ini sengaja TIDAK melakukan re-export.
   Semua consumer mengimpor langsung dari modul asalnya. */