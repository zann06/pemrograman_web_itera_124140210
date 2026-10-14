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

/* =========================================================
   1. KOMPONEN KECIL (reusable snippets)
   ========================================================= */

/** Avatar inisial mahasiswa */
export const renderAvatar = ({ name = "?", size = 44 } = {}) => `
  <div class="avatar" style="--avatar-size:${size}px" aria-hidden="true">
    ${getInitials(name)}
  </div>
`;

/** Kartu statistik */
export const renderStatCard = ({ label, value, hint = "", tone = "blue", icon = "" }) => `
  <article class="stat-card stat-card--${tone}">
    <div class="stat-card__icon">${icon}</div>
    <div class="stat-card__body">
      <span class="stat-card__value">${value}</span>
      <span class="stat-card__label">${escapeHTML(label)}</span>
      ${hint ? `<span class="stat-card__hint">${escapeHTML(hint)}` : ""}
    </div>
  </article>
`;

/** Bar progres penyelesaian */
export const renderProgressBar = (rate) => `
  <div class="progress" role="progressbar" aria-valuenow="${rate}" aria-valuemin="0" aria-valuemax="100">
    <div class="progress__fill" style="width:${Math.max(0, Math.min(100, rate))}%"></div>
    <span class="progress__text">${rate}% selesai</span>
  </div>
`;

/**
 * Lencana (badge) status tenggat.
 *
 * PENTING: `daysRemaining` adalah ANGKA (hasil hitungan TaskItem),
 * bukan objek Date. Karena itu teksnya dibuat langsung dari angka —
 * jangan pernah meneruskannya ke formatRelative() yang menerima Date.
 * (Kalau nekat, angka seperti 5 akan dibaca sebagai timestamp 1970.)
 */
const renderDueBadge = ({ isOverdue, isUrgent, daysRemaining }) => {
  // Tanpa tenggat
  if (daysRemaining === null) {
    return `<span class="badge badge--muted">Tanpa tenggat</span>`;
  }

  // Sudah lewat tenggat
  if (isOverdue) {
    return `<span class="badge badge--danger">⏰ Terlambat ${Math.abs(daysRemaining)} hari</span>`;
  }

  // Mendesak: hari ini / besok
  if (isUrgent) {
    const label = daysRemaining === 0 ? "Hari ini" : daysRemaining === 1 ? "Besok" : `${daysRemaining} hari lagi`;
    return `<span class="badge badge--warning">🔥 ${label}</span>`;
  }

  // Masih lama
  return `<span class="badge badge--info">📅 ${daysRemaining} hari lagi</span>`;
};

/** Pil filter */
export const renderCategoryFilter = (activeCategory) => `
  <div class="filter-chips" role="group" aria-label="Filter kategori">
    <button class="filter-chip ${activeCategory === "all" ? "is-active" : ""}"
            data-filter="category" data-value="all" type="button">Semua</button>
    ${TASK_CATEGORIES.map(
      ({ value, label, icon }) => `
      <button class="filter-chip ${activeCategory === value ? "is-active" : ""}"
              data-filter="category" data-value="${value}" type="button"
              style="--chip-color:${escapeHTML(value)}">
        ${icon} ${escapeHTML(label)}
      </button>`
    ).join("")}
  </div>
`;

/** Pil filter prioritas */
export const renderPriorityFilter = (activePriority) => `
  <div class="filter-chips" role="group" aria-label="Filter prioritas">
    <button class="filter-chip ${activePriority === "all" ? "is-active" : ""}"
            data-filter="priority" data-value="all" type="button">Semua Prioritas</button>
    ${PRIORITIES.map(
      ({ value, label, color }) => `
      <button class="filter-chip ${activePriority === value ? "is-active" : ""}"
              data-filter="priority" data-value="${value}" type="button"
              style="--chip-color:${color}">
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
          <span class="task-check__box" aria-hidden="true"></span>
        </label>
        <div class="task-card__heading">
          <h4 class="task-card__title">${escapeHTML(title)}</h4>
          <div class="task-card__meta">
            <span class="badge" style="--badge-color:${categoryMeta.color}">
              ${categoryMeta.icon} ${escapeHTML(categoryMeta.label)}
            </span>
            <span class="badge" style="--badge-color:${priorityMeta.color}">
              ⬆ ${escapeHTML(priorityMeta.label)}
            </span>
            ${renderDueBadge({ isOverdue, isUrgent, daysRemaining })}
          </div>
        </div>
        <div class="task-card__actions">
          <button class="icon-btn" data-action="edit" type="button" title="Edit tugas">✏️</button>
          <button class="icon-btn icon-btn--danger" data-action="delete" type="button" title="Hapus tugas">🗑️</button>
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
        <div class="empty-state__icon">${isFiltered ? "🔍" : "📝"}</div>
        <h3>${isFiltered ? "Tidak ada tugas yang cocok" : "Belum ada tugas"}</h3>
        <p>${
          isFiltered
            ? "Coba ubah kata kunci atau reset filter."
            : 'Tambahkan tugas pertama Anda lewat form di atas, atau klik "Isi dari API".'
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
        <div class="widget__header">
          <h3>🌤️ Cuaca di ${escapeHTML(LOCATION.name)}</h3>
          <button class="icon-btn" data-action="reload-weather" type="button" title="Muat ulang">🔄</button>
        </div>
        <div class="widget__loading"><span class="spinner"></span> Mengambil data cuaca…</div>
      </article>
    `;
  }

  if (error || weather?.temperature === null) {
    return `
      <article class="widget widget--weather widget--error">
        <div class="widget__header">
          <h3>🌤️ Cuaca di ${escapeHTML(LOCATION.name)}</h3>
          <button class="icon-btn" data-action="reload-weather" type="button" title="Coba lagi">🔄</button>
        </div>
        <div class="widget__empty">
          <p>⚠️ ${escapeHTML(error ?? "Data cuaca tidak dapat dimuat.")}</p>
          <small>Pastikan ada koneksi internet, lalu klik 🔄.</small>
        </div>
      </article>
    `;
  }

  const { icon, label, temperature, windSpeed, time } = weather;

  return `
    <article class="widget widget--weather">
      <div class="widget__header">
        <h3>🌤️ Cuaca di ${escapeHTML(weather.location)}</h3>
        <button class="icon-btn" data-action="reload-weather" type="button" title="Muat ulang">🔄</button>
      </div>
      <div class="weather">
        <div class="weather__main">
          <span class="weather__icon">${icon}</span>
          <div>
            <strong class="weather__temp">${temperature}°C</strong>
            <span class="weather__label">${escapeHTML(label)}</span>
          </div>
        </div>
        <ul class="weather__details">
          <li><span>💨 Angin</span><strong>${windSpeed} km/h</strong></li>
          <li><span>🕒 Update</span><strong>${escapeHTML(time ?? "—")}</strong></li>
        </ul>
      </div>
      <small class="widget__source">Sumber: Open-Meteo API (gratis, tanpa API key)</small>
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
        <div class="widget__loading"><span class="spinner"></span> Mengambil kutipan…</div>
      </article>
    `;
  }

  if (error || !quote?.quote) {
    return `
      <article class="widget widget--quote widget--error">
        <blockquote>⚠️ ${escapeHTML(error ?? "Kutipan tidak dapat dimuat.")}</blockquote>
        <cite>— offline —</cite>
      </article>
    `;
  }

  return `
    <article class="widget widget--quote">
      <blockquote>“${escapeHTML(truncate(quote.quote, 180))}”</blockquote>
      <cite>— ${escapeHTML(quote.author)}</cite>
      <button class="btn btn--tiny" data-action="refresh-quote" type="button">🔄 Kutipan lain</button>
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
    return `<p class="widget__empty">Belum ada jadwalkuliah. Tambahkan melalui form jadwal.</p>`;
  }

  return `
    <ul class="schedule-list">
      ${schedule
        .map(
          (entry) => `
          <li class="schedule-item ${entry.day === todayName ? "is-today" : ""}" data-id="${escapeHTML(entry.id)}">
            <div class="schedule-item__day">
              <strong>${escapeHTML(entry.day.slice(0, 3))}</strong>
              <span>${escapeHTML(entry.time)}</span>
            </div>
            <div class="schedule-item__info">
              <h4>${escapeHTML(entry.course)}</h4>
              <p>🚪 ${escapeHTML(entry.room)} · 👤 ${escapeHTML(entry.lecturer)}</p>
            </div>
            ${entry.day === todayName ? '<span class="badge badge--info">Hari ini</span>' : ""}
            <button class="icon-btn icon-btn--danger" data-action="delete-schedule"
                    data-id="${escapeHTML(entry.id)}" type="button" title="Hapus">🗑️</button>
          </li>`
        )
        .join("")}
    </ul>
  `;
};

/* =========================================================
   6. WIDGET CATATAN
   ========================================================= */

const NOTE_COLORS = ["yellow", "blue", "green", "pink", "purple"];

export const renderNotes = (notes = []) => {
  if (notes.length === 0) {
    return `<p class="widget__empty">Belum ada catatan. Tulis ide atau pengingat di form catatan.</p>`;
  }

  return `
    <div class="notes-grid">
      ${notes
        .map(
          (note) => `
          <article class="note note--${escapeHTML(note.color)}" data-id="${escapeHTML(note.id)}">
            <header class="note__head">
              <h4>${escapeHTML(note.title)}</h4>
              <div class="note__actions">
                <button class="icon-btn" data-action="edit-note" data-id="${escapeHTML(note.id)}"
                        type="button" title="Edit">✏️</button>
                <button class="icon-btn icon-btn--danger" data-action="delete-note"
                        data-id="${escapeHTML(note.id)}" type="button" title="Hapus">🗑️</button>
              </div>
            </header>
            <p class="note__body">${escapeHTML(note.body) || "<i>(kosong)</i>"}</p>
            <footer class="note__meta">${escapeHTML(formatDate(note.createdAt))}</footer>
          </article>`
        )
        .join("")}
    </div>
  `;
};

/** Opsi warna untuk form catatan */
export const renderNoteColors = () =>
  NOTE_COLORS.map(
    (color, index) => `
      <label class="color-option">
        <input type="radio" name="noteColor" value="${color}" ${index === 0 ? "checked" : ""} />
        <span class="color-swatch color-swatch--${color}"></span>
      </label>`
  ).join("");

/* =========================================================
   7. KEPALA DASHBOARD
   ========================================================= */

export const renderProfile = ({ name, nim, major, semester }) => `
  <div class="profile">
    ${renderAvatar({ name, size: 56 })}
    <div class="profile__info">
      <h2>${escapeHTML(name)}</h2>
      <p>
        <span class="profile__nim">${escapeHTML(nim)}</span>
        <span>${escapeHTML(major)}</span>
        <span>Semester ${escapeHTML(String(semester))}</span>
      </p>
    </div>
    <button class="btn btn--tiny" data-action="edit-profile" type="button">✏️ Edit Profil</button>
  </div>
`;

/* =========================================================
   8. RINGKASAN STATISTIK
   ========================================================= */

export const renderStats = ({ total, done, undone, overdue, completionRate, byCategory }) => {
  const categoryRows = TASK_CATEGORIES
    .map(({ value, label, icon, color }) => {
      const count = byCategory?.[value] ?? 0;
      const percent = total === 0 ? 0 : Math.round((count / total) * 100);
      return `
        <li class="cat-row">
          <span class="cat-row__label">${icon} ${escapeHTML(label)}</span>
          <div class="cat-row__bar"><span style="width:${percent}%; background:${color}"></span></div>
          <span class="cat-row__count">${count}</span>
        </li>`;
    })
    .join("");

  return `
    <section class="stats-grid">
      ${renderStatCard({ label: "Total Tugas", value: total, icon: "📋", tone: "blue", hint: "terdaftar" })}
      ${renderStatCard({ label: "Selesai", value: done, icon: "✅", tone: "green", hint: "tuntas" })}
      ${renderStatCard({ label: "Belum Selesai", value: undone, icon: "⏳", tone: "amber", hint: "dikerjakan" })}
      ${renderStatCard({ label: "Terlambat", value: overdue, icon: "⏰", tone: "red", hint: "lewat tenggat" })}
    </section>

    <section class="card card--progress">
      <header class="card__header">
        <h3>📈 Progres Tugas</h3>
        <span class="card__meta">${done} dari ${total} tugas selesai</span>
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
    <strong>💾 Penyimpanan Lokal</strong>
    <ul>
      <li>Status: <code>${stats.available ? "localStorage aktif" : "fallback in-memory (browser memblokir storage)"}</code></li>
      <li>Item tersimpan: <strong>${stats.items}</strong> (tugas + catatan + jadwal)</li>
      <li>Jumlah key: <strong>${stats.keys}</strong> · Ukuran: <strong>${(stats.bytes / 1024).toFixed(2)} KB</strong></li>
      ${stats.error ? `<li class="text-danger">⚠️ Error terakhir: ${escapeHTML(stats.error)}</li>` : ""}
    </ul>
    <div class="storage-info__actions">
      <button class="btn btn--tiny" data-action="export" type="button">⬇️ Ekspor JSON</button>
      <button class="btn btn--tiny btn--danger" data-action="reset-all" type="button">🗑️ Reset Semua Data</button>
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
  container.innerHTML = `<div class="toast toast--${type}">${escapeHTML(message)}</div>`;

  toastTimerId = setTimeout(() => {
    container.innerHTML = "";
  }, 3200);
};

/* Catatan: file ini sengaja TIDAK melakukan re-export.
   Semua consumer mengimpor langsung dari modul asalnya
   (modules/constants.js atau modules/utils.js), bukan dari app.js. */