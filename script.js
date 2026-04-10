/* ═══════════════════════════════════════════════════════════
   TUDU — script.js
   Vanilla JS, no frameworks. localStorage persistence.
═══════════════════════════════════════════════════════════ */

"use strict";

/* ══════════════════════════════════
   CONSTANTS
══════════════════════════════════ */
const PRIORITIES    = ["Low", "Medium", "High"];
const TAGS          = ["Personal","Work","Health","Finance","Learning","Social"];
const MANUAL_COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899","#0ea5e9","#a855f7","#f97316"];

const STATUS_META = {
  completed: { label:"Completed", color:"#10b981", glow:"rgba(16,185,129,.25)", pulse:false, icon:"✓" },
  pending:   { label:"Pending",   color:"#6366f1", glow:"rgba(99,102,241,.19)", pulse:false, icon:"○" },
  upcoming:  { label:"Due Today", color:"#f59e0b", glow:"rgba(245,158,11,.31)", pulse:true,  icon:"◑" },
  critical:  { label:"Due Soon",  color:"#ef4444", glow:"rgba(239,68,68,.38)", pulse:true,  icon:"◉" },
  overdue:   { label:"Overdue",   color:"#dc2626", glow:"rgba(220,38,38,.38)", pulse:true,  icon:"✕" },
};

const TAG_COLORS = {
  Personal:"#6366f1", Work:"#0ea5e9", Health:"#10b981",
  Finance:"#f59e0b",  Learning:"#a855f7", Social:"#ec4899"
};

const PRI_COLORS_DARK  = { Low:"#34d399", Medium:"#fbbf24", High:"#f87171" };
const PRI_COLORS_LIGHT = { Low:"#10b981", Medium:"#f59e0b", High:"#ef4444" };

const SVG = {
  check:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  check11:  `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  edit:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>`,
  clock:    `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2"/></svg>`,
  bell:     `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>`,
  flag:     `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7"/></svg>`,
  paint:    `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>`,
  snooze:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 2h4M12 6v6l3 3M5.5 5.5A9 9 0 1021 12"/></svg>`,
  star:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  filter:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>`,
  chart:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
  zap:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  inbox:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`,
  upcoming: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>`,
};

/* ══════════════════════════════════
   STATE
══════════════════════════════════ */
let state = {
  user:          null,
  tasks:         [],
  dark:          true,
  page:          "home",
  toastEnabled:  true,
  modalTask:     null,   // null = new, object = edit
  modalOpen:     false,
  mobileMenu:    false,
  /* modal form state */
  mForm: {
    title:"", description:"", deadline:"", reminder:"",
    priority:"Medium", tags:[], manualColor:null
  },
};

/* ══════════════════════════════════
   STORAGE
══════════════════════════════════ */
const db = {
  get:  (k, d=null) => { try { const v=localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set:  (k, v)      => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function loadState() {
  state.user         = db.get("tudu_user");
  state.tasks        = db.get("tudu_tasks", []);
  state.dark         = db.get("tudu_dark", true);
  state.toastEnabled = db.get("tudu_toasts_enabled", true);
}

function saveUser()  { db.set("tudu_user", state.user); }
function saveTasks() { db.set("tudu_tasks", state.tasks); }
function saveDark()  { db.set("tudu_dark", state.dark); }

/* ══════════════════════════════════
   TASK STATUS ENGINE
══════════════════════════════════ */
function getTaskStatus(task) {
  if (task.completed) return "completed";
  const now = Date.now();
  if (task.deadline) {
    const dl = new Date(task.deadline).getTime();
    if (dl < now)                     return "overdue";
    if (dl - now < 3 * 3600 * 1000)  return "critical";
    if (dl - now < 24 * 3600 * 1000) return "upcoming";
  }
  return "pending";
}

function priColor(p) {
  const map = state.dark ? PRI_COLORS_DARK : PRI_COLORS_LIGHT;
  return map[p] || "var(--muted)";
}

/* ══════════════════════════════════
   NOTIFICATION ENGINE
══════════════════════════════════ */
const NotifEngine = (() => {
  const registry  = {};
  let delivered   = new Set(db.get("tudu_delivered", []));
  let missedQueue = db.get("tudu_missed", []);

  const saveDelivered = () => db.set("tudu_delivered", [...delivered].slice(-500));
  const saveMissed    = () => db.set("tudu_missed", missedQueue);

  const canNotify = () => "Notification" in window && Notification.permission === "granted";

  function fire(task, type = "reminder") {
    const key = `${task.id}-${type}`;
    if (delivered.has(key)) return false;
    const status = getTaskStatus(task);
    const dStr   = task.deadline
      ? new Date(task.deadline).toLocaleString("en-US", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })
      : "No deadline";
    const titles = {
      reminder: `⏰ Reminder: ${task.title}`,
      upcoming: `🟡 Due Today: ${task.title}`,
      critical: `🔴 Due < 3 hrs: ${task.title}`,
      overdue:  `⚠️ Overdue: ${task.title}`,
      snooze:   `🔔 Snooze ended: ${task.title}`,
    };
    const titleStr = titles[type] || titles.reminder;
    const body     = `📅 ${dStr}${task.description ? "\n" + task.description.slice(0,80) : ""}`;

    if (canNotify()) {
      try {
        const n = new Notification(titleStr, {
          body,
          icon: "https://fav.farm/✅",
          tag: key,
          requireInteraction: type === "overdue" || type === "critical",
        });
        n.onclick = () => { window.focus(); n.close(); };
      } catch {}
    }

    // Show in-app toast
    if (state.toastEnabled) showToast(key, task.id, titleStr, body, status);
    delivered.add(key);
    saveDelivered();
    return true;
  }

  function schedule(task) {
    if (!task.reminder) return;
    const ms  = new Date(task.reminder).getTime() - Date.now();
    const key = `${task.id}-reminder`;
    if (registry[task.id]) { clearTimeout(registry[task.id]); delete registry[task.id]; }
    if (delivered.has(key)) return;
    if (ms < 0 && ms > -24 * 3600 * 1000) {
      missedQueue.push({ taskId: task.id, key, type: "reminder" });
      saveMissed();
      return;
    }
    if (ms < 0 || ms > 7 * 24 * 3600 * 1000) return;
    registry[task.id] = setTimeout(() => { fire(task, "reminder"); delete registry[task.id]; }, ms);
  }

  function drainMissed() {
    const taskMap = Object.fromEntries(state.tasks.map(t => [t.id, t]));
    while (missedQueue.length) {
      const item = missedQueue.shift();
      const task = taskMap[item.taskId];
      if (task && !task.completed) fire(task, item.type);
    }
    saveMissed();
  }

  function cancel(taskId) {
    if (registry[taskId]) { clearTimeout(registry[taskId]); delete registry[taskId]; }
  }

  async function requestPermission() {
    if (!("Notification" in window)) return "unsupported";
    if (Notification.permission !== "default") return Notification.permission;
    return await Notification.requestPermission();
  }

  function snooze(task, minutes) {
    const key = `${task.id}-snooze-${Date.now()}`;
    setTimeout(() => {
      if (canNotify()) {
        try { new Notification(`🔔 Snooze ended: ${task.title}`, { body: "Your snoozed reminder has expired.", tag: key }); } catch {}
      }
      if (state.toastEnabled) showToast(key, task.id, `🔔 Snooze ended: ${task.title}`, "Your snoozed reminder has expired.", getTaskStatus(task));
    }, minutes * 60 * 1000);
  }

  function clearDeliveredFor(taskId) {
    [...delivered].filter(k => k.startsWith(taskId)).forEach(k => delivered.delete(k));
    saveDelivered();
  }

  function startWatcher() {
    function check() {
      state.tasks.forEach(task => {
        if (task.completed) return;
        const s = getTaskStatus(task);
        if (s === "overdue")  fire(task, "overdue");
        else if (s === "critical") fire(task, "critical");
        else if (s === "upcoming") fire(task, "upcoming");
      });
    }
    const onVisible = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVisible);
    return setInterval(check, 60000);
  }

  return { schedule, cancel, fire, drainMissed, requestPermission, snooze, clearDeliveredFor, startWatcher, canNotify };
})();

/* ══════════════════════════════════
   UTILS
══════════════════════════════════ */
const uid  = () => Math.random().toString(36).slice(2, 10);
const fmt  = d => d ? new Date(d).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}) : "";
const fmtT = d => d ? new Date(d).toLocaleTimeString("en-US", {hour:"2-digit", minute:"2-digit"}) : "";

function fmtRel(d) {
  if (!d) return null;
  const diff = new Date(d) - Date.now(), abs = Math.abs(diff);
  if (abs < 60000)    return diff < 0 ? "just now" : "in moments";
  if (abs < 3600000)  return `${diff < 0 ? "" : "+"}${Math.round(abs/60000)}m${diff < 0 ? " ago" : ""}`;
  if (abs < 86400000) return `${diff < 0 ? "" : "+"}${Math.round(abs/3600000)}h${diff < 0 ? " ago" : ""}`;
  return `${diff < 0 ? "" : "+"}${Math.round(abs/86400000)}d${diff < 0 ? " ago" : ""}`;
}

function hex2rgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ══════════════════════════════════
   TOAST SYSTEM
══════════════════════════════════ */
function showToast(id, taskId, title, body, status) {
  const m    = STATUS_META[status] || STATUS_META.pending;
  const wrap = document.getElementById("toast-stack");
  if (!wrap) return;

  // Limit to 5 toasts
  const existing = wrap.querySelectorAll(".toast");
  if (existing.length >= 5) existing[0].remove();

  const el = document.createElement("div");
  el.className = "toast";
  el.dataset.id = id;
  el.style.borderLeft = `3px solid ${m.color}`;
  el.innerHTML = `
    <div class="toast-icon" style="background:${hex2rgba(m.color,.13)}">${m.icon}</div>
    <div class="toast-content">
      <p class="toast-title">${title}</p>
      <p class="toast-body">${body.replace(/\n/g," · ")}</p>
      <div class="toast-actions">
        <button class="btn btn-success small" data-action="done">
          ${SVG.check11} Done
        </button>
        <button class="btn btn-warn small" data-action="snooze">
          ${SVG.snooze} 15m
        </button>
        <button class="btn btn-ghost small icon-btn" data-action="dismiss">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>`;

  el.querySelector("[data-action='done']").addEventListener("click", () => {
    toggleTask(taskId);
    dismissToast(el);
  });
  el.querySelector("[data-action='snooze']").addEventListener("click", () => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) NotifEngine.snooze(task, 15);
    dismissToast(el);
  });
  el.querySelector("[data-action='dismiss']").addEventListener("click", () => dismissToast(el));

  wrap.appendChild(el);
  setTimeout(() => dismissToast(el), 9000);
}

function dismissToast(el) {
  el.classList.add("toast-out");
  setTimeout(() => el.remove(), 240);
}

/* ══════════════════════════════════
   THEME
══════════════════════════════════ */
function applyTheme() {
  document.body.classList.toggle("dark",  state.dark);
  document.body.classList.toggle("light", !state.dark);

  // Sync settings toggle if present
  const st = document.getElementById("settings-dark-toggle");
  if (st) st.checked = state.dark;

  // Sync topbar icons
  document.querySelectorAll(".icon-moon").forEach(e => e.classList.toggle("hidden", !state.dark));
  document.querySelectorAll(".icon-sun").forEach(e  => e.classList.toggle("hidden", state.dark));
}

/* ══════════════════════════════════
   AUTH
══════════════════════════════════ */
function renderAuth() {
  document.getElementById("app").classList.add("hidden");
  const authPage = document.getElementById("auth-page");
  authPage.classList.remove("hidden");
  authPage.style.display = "flex";
}

function renderApp() {
  document.getElementById("auth-page").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  renderSidebars();
  navigateTo(state.page);
  NotifEngine.drainMissed();
  NotifEngine.startWatcher();
  // Schedule all tasks
  state.tasks.forEach(t => NotifEngine.schedule(t));
  // Notification banner
  updateNotifBanner();
  // Auto-refresh status colors every 60s
  setInterval(() => {
    updateUrgentBadges();
    if (state.page === "home")     renderHome();
    if (state.page === "tasks")    renderTasks();
    if (state.page === "upcoming") renderAlerts();
    if (state.page === "progress") renderProgress();
  }, 60000);
}

document.getElementById("auth-submit").addEventListener("click", () => {
  const name  = document.getElementById("auth-name").value.trim();
  const email = document.getElementById("auth-email").value.trim();
  const err   = document.getElementById("auth-error");
  if (!name) { showAuthError("Please enter your name."); return; }
  if (!email || !email.includes("@")) { showAuthError("Please enter a valid email."); return; }
  err.classList.add("hidden");
  state.user = { name, email };
  saveUser();
  renderApp();
});

["auth-name","auth-email"].forEach(id => {
  document.getElementById(id).addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("auth-submit").click();
  });
});

function showAuthError(msg) {
  const err = document.getElementById("auth-error");
  err.textContent = msg;
  err.classList.remove("hidden");
}

/* ══════════════════════════════════
   NAVIGATION
══════════════════════════════════ */
function navigateTo(page) {
  state.page = page;
  // Hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  const el = document.getElementById(`page-${page}`);
  if (el) { el.classList.remove("hidden"); el.classList.add("fade-in"); }
  // Sync nav items
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === page);
  });
  // Render
  const renders = { home: renderHome, tasks: renderTasks, upcoming: renderAlerts, progress: renderProgress, settings: renderSettings };
  if (renders[page]) renders[page]();
  // Close mobile menu
  if (state.mobileMenu) closeMobileMenu();
}

/* ══════════════════════════════════
   SIDEBAR
══════════════════════════════════ */
function buildSidebarHTML(mobile) {
  const urgentCount = getUrgentCount();
  const navItems = [
    { id:"home",     label:"Dashboard", icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" },
    { id:"tasks",    label:"All Tasks", icon:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
    { id:"upcoming", label:"Alerts",    icon:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0", badge: urgentCount },
    { id:"progress", label:"Progress",  icon:"M18 20V10M12 20V4M6 20v-6" },
    { id:"settings", label:"Settings",  icon:"M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
  ];
  const initial = state.user ? state.user.name.charAt(0).toUpperCase() : "U";
  return `
    <div class="sidebar-logo">
      <div class="logo-icon">✓</div>
      <span class="logo-text">Tudu</span>
    </div>
    <nav class="sidebar-nav">
      ${navItems.map(item => `
        <button class="nav-item${state.page===item.id?" active":""}" data-page="${item.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="${item.icon}"/></svg>
          ${item.label}
          ${item.badge > 0 ? `<span class="nav-badge">${item.badge}</span>` : ""}
        </button>`).join("")}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="avatar-sm">${initial}</div>
        <div class="user-info">
          <p class="user-name">${state.user ? state.user.name : ""}</p>
          <p class="user-email">${state.user ? state.user.email : ""}</p>
        </div>
      </div>
      <button class="nav-item" id="${mobile?"mob":"desk"}-logout-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        Sign Out
      </button>
    </div>`;
}

function renderSidebars() {
  const desktop = document.getElementById("sidebar-inner-desktop");
  const mobile  = document.getElementById("sidebar-inner-mobile");
  if (desktop) {
    desktop.innerHTML = buildSidebarHTML(false);
    attachSidebarEvents(desktop, false);
  }
  if (mobile) {
    mobile.innerHTML = buildSidebarHTML(true);
    attachSidebarEvents(mobile, true);
  }
}

function attachSidebarEvents(container, isMobile) {
  container.querySelectorAll(".nav-item[data-page]").forEach(btn => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.page));
  });
  const logoutBtn = container.querySelector(`#${isMobile?"mob":"desk"}-logout-btn`);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

function getUrgentCount() {
  return state.tasks.filter(t => {
    if (t.completed) return false;
    const s = getTaskStatus(t);
    return s === "overdue" || s === "critical";
  }).length;
}

function updateUrgentBadges() {
  const count = getUrgentCount();
  // Sidebar badges
  document.querySelectorAll(".nav-badge").forEach(b => {
    b.textContent = count;
    b.classList.toggle("hidden", count === 0);
  });
  // Topbar buttons
  ["mobile-urgent-btn","desktop-urgent-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.toggle("hidden", count === 0);
  });
  document.getElementById("mobile-urgent-count") && (document.getElementById("mobile-urgent-count").textContent = count);
  document.getElementById("desktop-urgent-count") && (document.getElementById("desktop-urgent-count").textContent = count);
}

function logout() {
  state.user = null;
  saveUser();
  renderAuth();
}

/* Mobile menu */
document.getElementById("mobile-menu-btn").addEventListener("click", openMobileMenu);
document.getElementById("overlay-backdrop").addEventListener("click", closeMobileMenu);
function openMobileMenu() {
  state.mobileMenu = true;
  const mob = document.getElementById("mobile-overlay");
  mob.classList.remove("hidden");
  mob.style.display = "flex";
  renderSidebars();
}
function closeMobileMenu() {
  state.mobileMenu = false;
  document.getElementById("mobile-overlay").classList.add("hidden");
}

/* Topbar buttons */
document.getElementById("mobile-theme-btn").addEventListener("click", toggleTheme);
document.getElementById("desktop-theme-btn").addEventListener("click", toggleTheme);
document.getElementById("mobile-new-btn").addEventListener("click", () => openModal(null));
document.getElementById("desktop-new-btn").addEventListener("click", () => openModal(null));
document.getElementById("mobile-urgent-btn").addEventListener("click", () => navigateTo("upcoming"));
document.getElementById("desktop-urgent-btn").addEventListener("click", () => navigateTo("upcoming"));

function toggleTheme() {
  state.dark = !state.dark;
  saveDark();
  applyTheme();
  renderSidebars();
}

/* ══════════════════════════════════
   TASK OPERATIONS
══════════════════════════════════ */
function addTask(data) {
  const task = { id: uid(), createdAt: new Date().toISOString(), completed: false, completedAt: null, ...data };
  state.tasks.unshift(task);
  saveTasks();
  NotifEngine.schedule(task);
  refreshCurrentPage();
  updateUrgentBadges();
}

function editTask(id, data) {
  const idx = state.tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const prev = state.tasks[idx];
  state.tasks[idx] = { ...prev, ...data };
  saveTasks();
  NotifEngine.cancel(id);
  NotifEngine.clearDeliveredFor(id);
  NotifEngine.schedule(state.tasks[idx]);
  refreshCurrentPage();
  updateUrgentBadges();
}

function deleteTask(id) {
  NotifEngine.cancel(id);
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveTasks();
  refreshCurrentPage();
  updateUrgentBadges();
}

function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.completed   = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;
  saveTasks();
  refreshCurrentPage();
  updateUrgentBadges();
}

function refreshCurrentPage() {
  const renders = { home: renderHome, tasks: renderTasks, upcoming: renderAlerts, progress: renderProgress, settings: renderSettings };
  if (renders[state.page]) renders[state.page]();
  renderSidebars();
}

/* ══════════════════════════════════
   TASK CARD HTML
══════════════════════════════════ */
function buildTaskCard(task) {
  const status    = getTaskStatus(task);
  const m         = STATUS_META[status];
  const cardColor = task.manualColor || m.color;
  const pulseClass = { upcoming:"pulse-upcoming", critical:"pulse-critical", overdue:"pulse-overdue" }[status] || "";

  const deadlineHTML = task.deadline ? `
    <span class="task-deadline" style="color:${cardColor}">
      ${SVG.clock} ${fmt(task.deadline)} ${fmtT(task.deadline)}
      ${fmtRel(task.deadline) ? `<span style="opacity:.7">(${fmtRel(task.deadline)})</span>` : ""}
    </span>` : "";

  const reminderHTML = (task.reminder && !task.completed) ? `
    <span class="task-reminder">${SVG.bell} ${fmtT(task.reminder)}</span>` : "";

  const priC     = priColor(task.priority);
  const priorityHTML = `
    <span class="tag-pill" style="background:${hex2rgba(priC,.12)};color:${priC}">
      ${SVG.flag} ${task.priority}
    </span>`;

  const manualHTML = task.manualColor ? `
    <span class="tag-pill" style="background:${hex2rgba(task.manualColor,.14)};color:${task.manualColor}">
      ${SVG.paint} Custom
    </span>` : "";

  const tagsHTML = (task.tags||[]).map(tag => {
    const tc = TAG_COLORS[tag] || "#6366f1";
    return `<span class="tag-pill" style="background:${hex2rgba(tc,.12)};color:${tc}">${tag}</span>`;
  }).join("");

  const snoozeBtn = (status==="upcoming"||status==="critical"||status==="overdue") && !task.completed
    ? `<button class="btn btn-warn small icon-btn task-snooze-btn" data-id="${task.id}" title="Snooze 15 min">${SVG.snooze}</button>`
    : "";

  return `
    <div class="card task-card slide-in ${pulseClass} ${status==="completed"?"task-completed":""} status-${status}"
      draggable="true"
      data-id="${task.id}"
      style="border-left-color:${cardColor}">
      <button class="chk${task.completed?" done":""}" style="border-color:${task.completed?"":cardColor}" data-toggle="${task.id}">
        ${task.completed ? SVG.check11 : ""}
      </button>
      <div class="task-body">
        <div class="task-top">
          <div class="task-title-row">
            <span class="task-title${task.completed?" done":""}">${escapeHtml(task.title)}</span>
            <span class="status-badge" style="background:${hex2rgba(m.color,.12)};color:${m.color}">
              ${m.icon} ${m.label.toUpperCase()}
            </span>
          </div>
          <div class="task-actions">
            ${snoozeBtn}
            <button class="btn btn-ghost small icon-btn task-edit-btn" data-id="${task.id}">${SVG.edit}</button>
            <button class="btn btn-ghost small icon-btn task-delete-btn" data-id="${task.id}" style="color:var(--danger)">${SVG.trash}</button>
          </div>
        </div>
        ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ""}
        <div class="task-meta">
          ${deadlineHTML}${reminderHTML}${priorityHTML}${manualHTML}${tagsHTML}
        </div>
      </div>
    </div>`;
}

function attachTaskListEvents(container) {
  container.querySelectorAll("[data-toggle]").forEach(btn => {
    btn.addEventListener("click", () => toggleTask(btn.dataset.toggle));
  });
  container.querySelectorAll(".task-edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const task = state.tasks.find(t => t.id === btn.dataset.id);
      if (task) openModal(task);
    });
  });
  container.querySelectorAll(".task-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteTask(btn.dataset.id));
  });
  container.querySelectorAll(".task-snooze-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const task = state.tasks.find(t => t.id === btn.dataset.id);
      if (task) NotifEngine.snooze(task, 15);
    });
  });
  // Drag-and-drop
  let dragId = null;
  container.querySelectorAll(".task-card").forEach(card => {
    card.addEventListener("dragstart", () => { dragId = card.dataset.id; });
    card.addEventListener("dragover",  e => { e.preventDefault(); card.classList.add("drag-over"); });
    card.addEventListener("dragleave", () => card.classList.remove("drag-over"));
    card.addEventListener("drop", () => {
      card.classList.remove("drag-over");
      if (!dragId || dragId === card.dataset.id) return;
      const arr   = [...state.tasks];
      const from  = arr.findIndex(t => t.id === dragId);
      const to    = arr.findIndex(t => t.id === card.dataset.id);
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      state.tasks = arr;
      saveTasks();
      refreshCurrentPage();
    });
    card.addEventListener("dragend", () => {
      dragId = null;
      container.querySelectorAll(".task-card").forEach(c => c.classList.remove("drag-over"));
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ══════════════════════════════════
   LEGEND HTML
══════════════════════════════════ */
function buildLegendHTML() {
  return Object.entries(STATUS_META).map(([, m]) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${m.color};box-shadow:0 0 5px ${m.glow}"></div>
      <span class="legend-name">${m.label}</span>
    </div>`).join("");
}

/* ══════════════════════════════════
   PAGE: HOME (DASHBOARD)
══════════════════════════════════ */
function renderHome() {
  const hr = new Date().getHours();
  const greeting = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  const firstName = state.user ? state.user.name.split(" ")[0] : "";
  document.getElementById("greeting-text").textContent = `${greeting}, ${firstName} 👋`;

  const tasks     = state.tasks;
  const overdue   = tasks.filter(t => !t.completed && getTaskStatus(t) === "overdue");
  const critical  = tasks.filter(t => !t.completed && getTaskStatus(t) === "critical");
  const upcoming  = tasks.filter(t => !t.completed && (getTaskStatus(t) === "upcoming" || getTaskStatus(t) === "critical"));

  // Stats
  const statsEl = document.getElementById("home-stats");
  const stats = [
    { label:"Total",  value: tasks.length,                         icon: SVG.inbox,   color:"var(--accent)"  },
    { label:"Done",   value: tasks.filter(t=>t.completed).length,  icon: SVG.check,   color:"var(--success)" },
    { label:"Urgent", value: overdue.length + critical.length,      icon: SVG.zap,     color:"var(--danger)"  },
    { label:"Today",  value: upcoming.length,                       icon: SVG.upcoming,color:"var(--warn)"    },
  ];
  statsEl.innerHTML = stats.map(s => `
    <div class="card stat-card">
      <div class="stat-icon" style="background:color-mix(in srgb,${s.color} 15%,transparent);color:${s.color}">
        ${s.icon}
      </div>
      <div>
        <p class="stat-value">${s.value}</p>
        <p class="stat-label">${s.label}</p>
      </div>
    </div>`).join("");

  // Urgent section
  const urgentSection = document.getElementById("home-urgent");
  const urgentList    = document.getElementById("home-urgent-list");
  const urgentTasks   = [...critical, ...overdue].slice(0, 4);
  if (urgentTasks.length > 0) {
    urgentSection.classList.remove("hidden");
    urgentSection.querySelector(".section-title").innerHTML =
      `${SVG.zap} Needs Attention (${urgentTasks.length})`;
    urgentList.innerHTML = urgentTasks.map(buildTaskCard).join("");
    attachTaskListEvents(urgentList);
  } else {
    urgentSection.classList.add("hidden");
  }

  // Legend
  document.getElementById("home-legend").innerHTML = buildLegendHTML();

  // Charts
  renderCharts("home-charts", tasks);

  // Notification banner
  updateNotifBanner();
}

/* ══════════════════════════════════
   PAGE: ALL TASKS
══════════════════════════════════ */
function renderTasks() {
  const search   = (document.getElementById("task-search")?.value || "").toLowerCase();
  const fStatus  = document.getElementById("filter-status")?.value || "All";
  const fPri     = document.getElementById("filter-priority")?.value || "All";
  const fTag     = document.getElementById("filter-tag")?.value || "All";

  let filtered = state.tasks.filter(task => {
    if (search && !task.title.toLowerCase().includes(search) && !(task.description||"").toLowerCase().includes(search)) return false;
    if (fTag !== "All" && !(task.tags||[]).includes(fTag)) return false;
    if (fPri !== "All" && task.priority !== fPri) return false;
    if (fStatus !== "All") {
      const s = getTaskStatus(task);
      if (fStatus === "Active"    && task.completed)                    return false;
      if (fStatus === "Completed" && !task.completed)                   return false;
      if (fStatus === "Overdue"   && s !== "overdue")                   return false;
      if (fStatus === "Upcoming"  && s !== "upcoming" && s !== "critical") return false;
    }
    return true;
  });

  const countEl = document.getElementById("tasks-count");
  if (countEl) countEl.textContent = `${filtered.length} task${filtered.length !== 1 ? "s" : ""}`;

  const legendEl = document.getElementById("tasks-legend");
  if (legendEl) legendEl.innerHTML = buildLegendHTML();

  const listEl = document.getElementById("task-list");
  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-title">No tasks found</p>
        <p class="empty-sub">Adjust filters or add a new task</p>
      </div>`;
  } else {
    listEl.innerHTML = filtered.map(buildTaskCard).join("");
    attachTaskListEvents(listEl);
  }
}

// Wire up filter inputs
function wireFilters() {
  ["task-search","filter-status","filter-priority","filter-tag"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => { if (state.page === "tasks") renderTasks(); });
  });
  document.getElementById("tasks-new-btn")?.addEventListener("click", () => openModal(null));
}

/* ══════════════════════════════════
   PAGE: ALERTS
══════════════════════════════════ */
function renderAlerts() {
  const tasks    = state.tasks.filter(t => !t.completed);
  const overdue  = tasks.filter(t => getTaskStatus(t) === "overdue");
  const critical = tasks.filter(t => getTaskStatus(t) === "critical");
  const upcoming = tasks.filter(t => getTaskStatus(t) === "upcoming");

  const empty = overdue.length + critical.length + upcoming.length === 0;
  document.getElementById("alerts-empty").classList.toggle("hidden", !empty);

  function setSection(id, listId, items) {
    const sec  = document.getElementById(id);
    const list = document.getElementById(listId);
    sec.classList.toggle("hidden", items.length === 0);
    list.innerHTML = items.map(buildTaskCard).join("");
    attachTaskListEvents(list);
  }
  setSection("alerts-critical", "alerts-critical-list", critical);
  setSection("alerts-upcoming", "alerts-upcoming-list", upcoming);
  setSection("alerts-overdue",  "alerts-overdue-list",  overdue);

  // Update count labels
  if (critical.length) document.querySelector("#alerts-critical .section-title").innerHTML =
    `◉ Due in &lt; 3 Hours (${critical.length})`;
  if (upcoming.length) document.querySelector("#alerts-upcoming .section-title").innerHTML =
    `◑ Due Today (${upcoming.length})`;
  if (overdue.length)  document.querySelector("#alerts-overdue .section-title").innerHTML =
    `✕ Overdue (${overdue.length})`;
}

/* ══════════════════════════════════
   PAGE: PROGRESS
══════════════════════════════════ */
function renderProgress() {
  renderCharts("progress-charts", state.tasks);

  const tasks    = state.tasks;
  const total    = tasks.length;
  const done     = tasks.filter(t => t.completed).length;
  const rate     = total ? Math.round(done/total*100) : 0;
  const highDone = tasks.filter(t => t.priority==="High" && t.completed).length;
  const tagsUsed = new Set(tasks.flatMap(t => t.tags||[])).size;
  const week7    = tasks.filter(t => t.completed && t.completedAt && Date.now()-new Date(t.completedAt) < 7*86400000).length;

  const insights = [
    { label:"Completion Rate",   value: total ? `${rate}%` : "—",  icon: SVG.star,   color:"var(--accent)"  },
    { label:"High Priority Done",value: highDone,                    icon: SVG.filter, color:"var(--danger)"  },
    { label:"Tags Used",         value: tagsUsed,                    icon: SVG.filter, color:"var(--success)" },
    { label:"7-day Completed",   value: week7,                       icon: SVG.chart,  color:"var(--warn)"    },
  ];
  document.getElementById("progress-insights").innerHTML = insights.map(s => `
    <div class="card stat-card">
      <div class="stat-icon" style="background:color-mix(in srgb,${s.color} 15%,transparent);color:${s.color}">${s.icon}</div>
      <div>
        <p class="stat-value">${s.value}</p>
        <p class="stat-label">${s.label}</p>
      </div>
    </div>`).join("");
}

/* ══════════════════════════════════
   CHARTS (Chart.js)
══════════════════════════════════ */
let chartInstances = {};

function renderCharts(containerId, tasks) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const total = tasks.length;
  const done  = tasks.filter(t => t.completed).length;
  const pct   = total ? Math.round(done/total*100) : 0;

  // Build by-status data for pie
  const byStatus = Object.entries(STATUS_META)
    .map(([k, m]) => ({ name: m.label, value: tasks.filter(t => getTaskStatus(t)===k).length, color: m.color }))
    .filter(x => x.value > 0);

  // Last 7 days bar
  const last7 = Array.from({length:7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6-i));
    return {
      label: d.toLocaleDateString("en-US", { weekday:"short" }),
      count: tasks.filter(t => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === d.toDateString()).length,
    };
  });

  // Destroy old chart instances from this container
  ["progress-ring","pie-chart","bar-chart"].forEach(k => {
    const key = `${containerId}-${k}`;
    if (chartInstances[key]) { chartInstances[key].destroy(); delete chartInstances[key]; }
  });

  const textColor  = getComputedStyle(document.body).getPropertyValue("--muted").trim() || "#5e5d6e";
  const borderColor = getComputedStyle(document.body).getPropertyValue("--border").trim() || "#24242f";

  container.innerHTML = `
    <div class="card chart-card">
      <h3>Overall Progress</h3>
      <div class="progress-ring-wrap">
        <div class="progress-ring-inner">
          <svg class="progress-ring-svg" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${borderColor}" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent)" stroke-width="3"
              stroke-dasharray="${pct} ${100-pct}" stroke-linecap="round"
              style="transition:stroke-dasharray .5s ease"/>
          </svg>
          <div class="progress-ring-pct">${pct}%</div>
        </div>
        <div class="progress-ring-info">
          <p>${done}<span style="font-size:13px;color:var(--muted);font-weight:400">/${total}</span></p>
          <p>tasks completed</p>
        </div>
      </div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="card chart-card">
      <h3>By Status</h3>
      <div class="chart-wrap"><canvas id="${containerId}-pie"></canvas></div>
      <div class="chart-legend" id="${containerId}-pie-legend"></div>
    </div>
    <div class="card chart-card">
      <h3>Weekly Activity</h3>
      <div class="chart-wrap"><canvas id="${containerId}-bar"></canvas></div>
    </div>`;

  // Pie chart
  const pieCtx = document.getElementById(`${containerId}-pie`);
  if (pieCtx && byStatus.length > 0) {
    chartInstances[`${containerId}-pie-chart`] = new Chart(pieCtx, {
      type: "doughnut",
      data: {
        labels: byStatus.map(d => d.name),
        datasets: [{ data: byStatus.map(d => d.value), backgroundColor: byStatus.map(d => d.color), borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: getComputedStyle(document.body).getPropertyValue("--card").trim() || "#18181f",
            titleColor: getComputedStyle(document.body).getPropertyValue("--text").trim() || "#f0eff4",
            bodyColor:  textColor,
            borderColor: borderColor,
            borderWidth: 1,
          }
        }
      }
    });
    document.getElementById(`${containerId}-pie-legend`).innerHTML =
      byStatus.map(d => `<div class="chart-legend-item"><span class="chart-dot" style="background:${d.color}"></span>${d.name} (${d.value})</div>`).join("");
  } else if (pieCtx) {
    pieCtx.parentElement.innerHTML = `<p style="text-align:center;color:var(--muted);font-size:13px;padding:40px 0">No data yet</p>`;
  }

  // Bar chart
  const barCtx = document.getElementById(`${containerId}-bar`);
  if (barCtx) {
    chartInstances[`${containerId}-bar-chart`] = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: last7.map(d => d.label),
        datasets: [{
          label: "Completed",
          data: last7.map(d => d.count),
          backgroundColor: "var(--accent)",
          borderRadius: 5,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { display:false }, ticks: { color: textColor, font:{size:10} }, border:{display:false} },
          y: { display: false, ticks: { precision:0 } },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: getComputedStyle(document.body).getPropertyValue("--card").trim() || "#18181f",
            titleColor: getComputedStyle(document.body).getPropertyValue("--text").trim() || "#f0eff4",
            bodyColor:  textColor,
            borderColor: borderColor,
            borderWidth: 1,
          }
        }
      }
    });
  }
}

/* ══════════════════════════════════
   PAGE: SETTINGS
══════════════════════════════════ */
function renderSettings() {
  if (!state.user) return;
  const nameEl  = document.getElementById("settings-name");
  const emailEl = document.getElementById("settings-email");
  const avatarEl = document.getElementById("settings-avatar");
  if (nameEl)  nameEl.value  = state.user.name;
  if (emailEl) emailEl.value = state.user.email;
  if (avatarEl) avatarEl.textContent = state.user.name.charAt(0).toUpperCase();

  // Dark toggle
  const darkToggle = document.getElementById("settings-dark-toggle");
  if (darkToggle) { darkToggle.checked = state.dark; }

  // Toast toggle
  const toastToggle = document.getElementById("settings-toast-toggle");
  if (toastToggle) { toastToggle.checked = state.toastEnabled; }

  // Notif permission badge
  updatePermBadge();

  // Color guide
  const guideEl = document.getElementById("color-guide");
  if (guideEl) {
    const descs = {
      completed: "Task marked as done — green accent",
      pending:   "Active task with no imminent deadline — blue",
      upcoming:  "Due within 24 hours — amber pulsing glow",
      critical:  "Due within 3 hours — red pulsing alert",
      overdue:   "Deadline passed — urgent red, fast pulse",
    };
    guideEl.innerHTML = Object.entries(STATUS_META).map(([key, m]) => `
      <div class="color-guide-item" style="background:${hex2rgba(m.color,.04)};border:1px solid ${hex2rgba(m.color,.14)}">
        <div class="color-guide-icon" style="background:${hex2rgba(m.color,.16)}">${m.icon}</div>
        <div>
          <p class="color-guide-name">${m.label}</p>
          <p class="color-guide-desc">${descs[key]}</p>
        </div>
      </div>`).join("");
  }
}

function updatePermBadge() {
  const badge = document.getElementById("perm-badge");
  const btn   = document.getElementById("settings-notif-btn");
  if (!badge) return;
  const perm = "Notification" in window ? Notification.permission : "unsupported";
  if (perm === "granted") {
    badge.textContent = "Enabled";
    badge.classList.add("granted");
    if (btn) btn.classList.add("hidden");
  } else if (perm === "denied") {
    badge.textContent = "Blocked";
    if (btn) btn.classList.add("hidden");
  } else {
    badge.textContent = "Not set";
  }
}

function wireSettings() {
  document.getElementById("settings-save-btn")?.addEventListener("click", () => {
    const name  = document.getElementById("settings-name")?.value.trim();
    const email = document.getElementById("settings-email")?.value.trim();
    if (!name || !email) return;
    state.user = { ...state.user, name, email };
    saveUser();
    renderSidebars();
    const btn = document.getElementById("settings-save-btn");
    if (btn) { btn.textContent = "✓ Saved!"; setTimeout(() => { btn.textContent = "Save Changes"; }, 2000); }
    document.getElementById("settings-avatar").textContent = name.charAt(0).toUpperCase();
  });

  document.getElementById("settings-dark-toggle")?.addEventListener("change", e => {
    state.dark = e.target.checked;
    saveDark();
    applyTheme();
    renderSidebars();
  });

  document.getElementById("settings-toast-toggle")?.addEventListener("change", e => {
    state.toastEnabled = e.target.checked;
    db.set("tudu_toasts_enabled", state.toastEnabled);
  });

  document.getElementById("settings-notif-btn")?.addEventListener("click", async () => {
    const perm = await NotifEngine.requestPermission();
    updatePermBadge();
    if (perm === "granted") state.toastEnabled = true;
  });
}

/* ══════════════════════════════════
   NOTIFICATION BANNER
══════════════════════════════════ */
function updateNotifBanner() {
  const banner    = document.getElementById("notif-banner");
  if (!banner) return;
  const dismissed = db.get("tudu_banner_dismissed", false);
  const perm      = "Notification" in window ? Notification.permission : "granted";
  const show      = !dismissed && perm !== "granted" && perm !== "unsupported";
  banner.classList.toggle("hidden", !show);
  if (perm === "denied") {
    const btn = document.getElementById("notif-enable-btn");
    if (btn) btn.outerHTML = `<span style="font-size:11px;color:var(--danger)">Blocked in browser</span>`;
  }
}

document.getElementById("notif-enable-btn")?.addEventListener("click", async () => {
  await NotifEngine.requestPermission();
  updateNotifBanner();
  updatePermBadge();
});

document.getElementById("notif-dismiss-btn")?.addEventListener("click", () => {
  db.set("tudu_banner_dismissed", true);
  document.getElementById("notif-banner").classList.add("hidden");
});

/* ══════════════════════════════════
   MODAL
══════════════════════════════════ */
const MODAL_COLORS = MANUAL_COLORS;

function openModal(task) {
  state.modalTask = task;
  state.mForm = task
    ? { title: task.title, description: task.description||"", deadline: task.deadline||"", reminder: task.reminder||"", priority: task.priority||"Medium", tags: [...(task.tags||[])], manualColor: task.manualColor||null }
    : { title:"", description:"", deadline:"", reminder:"", priority:"Medium", tags:[], manualColor:null };

  document.getElementById("modal-title").textContent = task ? "Edit Task" : "New Task";
  document.getElementById("modal-save").innerHTML = `${SVG.check} ${task ? "Save" : "Add Task"}`;
  document.getElementById("modal-error").classList.add("hidden");

  syncModalForm();
  document.getElementById("task-modal").classList.remove("hidden");
  document.getElementById("m-title").focus();
}

function closeModal() {
  document.getElementById("task-modal").classList.add("hidden");
}

function syncModalForm() {
  document.getElementById("m-title").value       = state.mForm.title;
  document.getElementById("m-desc").value        = state.mForm.description;
  document.getElementById("m-deadline").value    = state.mForm.deadline;
  document.getElementById("m-reminder").value    = state.mForm.reminder;

  // Priority pills
  document.querySelectorAll("#priority-group .pill-btn").forEach(btn => {
    const active = btn.dataset.value === state.mForm.priority;
    const c = priColor(btn.dataset.value);
    btn.style.background = active ? hex2rgba(c,.12) : "";
    btn.style.color      = active ? c : "";
    btn.style.borderColor = active ? c : "";
  });

  // Tag pills
  document.querySelectorAll(".tag-pill-btn").forEach(btn => {
    const active = state.mForm.tags.includes(btn.dataset.value);
    const c = TAG_COLORS[btn.dataset.value] || "#6366f1";
    btn.style.background  = active ? hex2rgba(c,.12) : "";
    btn.style.color       = active ? c : "";
    btn.style.borderColor = active ? c : "";
  });

  // Color swatches
  const swatchEl = document.getElementById("color-swatches");
  swatchEl.innerHTML = MODAL_COLORS.map(c => `
    <div class="color-swatch${state.mForm.manualColor===c?" sel":""}"
      style="background:${c};${state.mForm.manualColor===c?`box-shadow:0 0 0 3px ${hex2rgba(c,.35)}`:""};"
      data-color="${c}"></div>`).join("");
  if (state.mForm.manualColor) {
    swatchEl.innerHTML += `<button class="btn btn-ghost small" id="clear-color-btn">Clear</button>`;
    document.getElementById("clear-color-btn")?.addEventListener("click", () => { state.mForm.manualColor = null; syncModalForm(); });
  }
  swatchEl.querySelectorAll(".color-swatch").forEach(sw => {
    sw.addEventListener("click", () => {
      state.mForm.manualColor = state.mForm.manualColor === sw.dataset.color ? null : sw.dataset.color;
      syncModalForm();
    });
  });
}

function wireModal() {
  // Close
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("task-modal").addEventListener("click", e => {
    if (e.target === document.getElementById("task-modal")) closeModal();
  });

  // Title / desc inputs
  document.getElementById("m-title").addEventListener("input", e => { state.mForm.title = e.target.value; });
  document.getElementById("m-desc").addEventListener("input",  e => { state.mForm.description = e.target.value; });

  // Datetime
  document.getElementById("m-deadline").addEventListener("change", e => { state.mForm.deadline = e.target.value; });
  document.getElementById("m-reminder").addEventListener("change", e => { state.mForm.reminder = e.target.value; });

  // Suggest reminder
  document.getElementById("m-remind-suggest").addEventListener("click", () => {
    if (!state.mForm.deadline) return;
    const d = new Date(state.mForm.deadline);
    d.setHours(d.getHours() - 1);
    state.mForm.reminder = d.toISOString().slice(0, 16);
    document.getElementById("m-reminder").value = state.mForm.reminder;
  });

  // Priority
  document.getElementById("priority-group").addEventListener("click", e => {
    const btn = e.target.closest(".pill-btn");
    if (!btn) return;
    state.mForm.priority = btn.dataset.value;
    syncModalForm();
  });

  // Tags
  document.getElementById("tags-group").addEventListener("click", e => {
    const btn = e.target.closest(".tag-pill-btn");
    if (!btn) return;
    const tag = btn.dataset.value;
    if (state.mForm.tags.includes(tag)) {
      state.mForm.tags = state.mForm.tags.filter(t => t !== tag);
    } else {
      state.mForm.tags = [...state.mForm.tags, tag];
    }
    syncModalForm();
  });

  // Save
  document.getElementById("modal-save").addEventListener("click", () => {
    const errEl = document.getElementById("modal-error");
    if (!state.mForm.title.trim()) {
      errEl.textContent = "Title is required."; errEl.classList.remove("hidden"); return;
    }
    if (state.mForm.reminder && state.mForm.deadline && new Date(state.mForm.reminder) > new Date(state.mForm.deadline)) {
      errEl.textContent = "Reminder must be before the deadline."; errEl.classList.remove("hidden"); return;
    }
    errEl.classList.add("hidden");
    const data = { ...state.mForm, title: state.mForm.title.trim() };
    if (state.modalTask) {
      editTask(state.modalTask.id, data);
    } else {
      addTask(data);
    }
    closeModal();
  });

  // Enter key in title
  document.getElementById("m-title").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("modal-save").click();
  });
}

/* ══════════════════════════════════
   BOOT
══════════════════════════════════ */
(function boot() {
  loadState();
  applyTheme();

  if (state.user) {
    renderApp();
  } else {
    renderAuth();
  }

  wireModal();
  wireFilters();
  wireSettings();
})();
