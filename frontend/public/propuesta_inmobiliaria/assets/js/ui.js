/* HABITIA — componentes, iconos y capa de interacción */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="M4 12.5 9 17.5 20 6.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1Z"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
  inbox: '<path d="M4 13h4l2 3h4l2-3h4"/><path d="M4 13 6 4h12l2 9v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  bell: '<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M18 14.8c2 .8 3 2.6 3 5.2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  bed: '<path d="M3 18v-7h13a4 4 0 0 1 4 4v3"/><path d="M3 18h18M3 11V7M7 11V9h5v2"/>',
  bath: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M6 12V6.5A2.5 2.5 0 0 1 10.5 5"/><path d="M9 19v2M15 19v2"/>',
  desk: '<path d="M3 8h18M5 8v11M19 8v11M7 8V6h10v2"/>',
  wifi: '<path d="M4 9a13 13 0 0 1 16 0M7 12.5a8.5 8.5 0 0 1 10 0M10 16a4 4 0 0 1 4 0"/><circle cx="12" cy="19" r="1"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5 4.2 16.5"/><path d="M9 5l3 2 3-2M9 19l3-2 3 2"/>',
  flame: '<path d="M12 22c4 0 6-2.6 6-6 0-4-4-6-4-10-2 1.5-3 3.5-3 5.5-1-.6-1.6-1.6-2-2.5C7 10 6 12 6 16c0 3.4 2 6 6 6Z"/>',
  wardrobe: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M10 11v2M14 11v2"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  elevator: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M12 3v18M9 8l1.5-2L12 8M12 16l1.5 2 1.5-2"/>',
  sparkles: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  phone: '<path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2c-8 0-15-7-15-15a2 2 0 0 1 2-2Z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.5l3.5 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="m4 20 4-1 10-10-3-3L5 16Z"/><path d="m14.5 5.5 3 3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  more: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
  logout: '<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M9 8l-4 4 4 4M5 12h9"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9.5" r="1.6"/><path d="m5 18 5-5 3 3 2-2 4 4"/>',
  alert: '<path d="M12 4 3 20h18Z"/><path d="M12 9v5M12 17.2v.1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/>',
  star: '<path d="m12 3.5 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.9l6.1-.8Z"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/>',
  file: '<path d="M6 3h7l5 5v13H6Z"/><path d="M13 3v5h5"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  external: '<path d="M14 4h6v6M20 4l-8 8"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  key: '<circle cx="8" cy="8" r="4"/><path d="m11 11 9 9M17 17l2-2M14 14l2-2"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-6M22 20H2"/>',
  euro: '<path d="M16 6a6 6 0 1 0 0 12M5 10h8M5 14h8"/>',
  euroCircle: '<circle cx="12" cy="12" r="9"/><path d="M15 8.5a5 5 0 0 0-7 3.5 5 5 0 0 0 7 3.5M6.5 11h6M6.5 13h6"/>',
  play: '<path d="M8 5l11 7-11 7Z"/>',
  bellOff: '<path d="M6 9a6 6 0 0 1 9.5-4.9M18 13c0 3 1 4 2 4H8"/><path d="M10 19a2 2 0 0 0 4 0M3 3l18 18"/>',
  drag: '<circle cx="9" cy="6" r="1.3"/><circle cx="15" cy="6" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="18" r="1.3"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  whatsapp: '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21Z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5m0 0h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1Z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5"/>'
};

const UI = {
  icon(name, cls) {
    const body = ICONS[name] || ICONS.info;
    return '<svg class="od-icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + "</svg>";
  },

  esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  eur(value) {
    return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value) + " €";
  },

  num(value) {
    return new Intl.NumberFormat("es-ES").format(value);
  },

  dateShort(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  },

  dateMonth(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  },

  daysUntil(iso) {
    if (!iso) return null;
    const d = new Date(iso + "T00:00:00");
    const diff = Math.round((d - TODAY) / 86400000);
    return isNaN(diff) ? null : diff;
  },

  relative(iso) {
    const days = this.daysUntil(iso);
    if (days == null) return "—";
    if (days <= 0) return "Disponible ahora";
    if (days === 1) return "Queda libre mañana";
    return "Queda libre en " + days + " días";
  },

  statusBadge(status) {
    const meta = STATUS_META[status] || STATUS_META.occupied;
    return '<span class="badge ' + meta.cls + '"><span class="dot" aria-hidden="true"></span>' + meta.label + "</span>";
  },

  statusCompact(status) {
    const meta = STATUS_META[status] || STATUS_META.occupied;
    return '<span class="badge ' + meta.cls + '"><span class="dot" aria-hidden="true"></span>' + meta.short + "</span>";
  },

  publishBadge(published) {
    return published
      ? '<span class="badge is-neutral">Publicado</span>'
      : '<span class="badge is-draft">Borrador</span>';
  },

  featureBadge(feature) {
    const min = MIN_PACKAGE_LABEL(feature);
    const ok = Store.included(feature);
    return '<span class="badge feature-badge ' + (ok ? "is-ok" : "is-lock") + '">' +
      (ok ? UI.icon("check") + "Incluido" : UI.icon("lock") + min) +
      "</span>";
  },

  roomCard(room, options) {
    const opts = options || {};
    const main = IMG[room.main] || IMG.room1;
    const alt = IMG_ALT[room.main] || IMG_ALT.room1;
    const days = this.daysUntil(room.availableFrom);
    const when = room.status === "available"
      ? "Entrada inmediata"
      : room.status === "upcoming"
        ? "Desalojo: " + this.dateShort(room.availableFrom)
        : "Habitada · Desalojo: " + this.dateShort(room.availableFrom);

    const aptRooms = (typeof Store !== "undefined" && Store.publishedRooms)
      ? Store.publishedRooms().filter((r) => r.apt === room.apt)
      : [];
    const availInApt = aptRooms.filter((r) => r.status === "available");
    const otherAvail = availInApt.filter((r) => r.id !== room.id);
    const inhabitedWithDate = aptRooms.filter((r) => r.status !== "available" && r.availableFrom);

    return (
      '<article class="room-card">' +
        '<a class="room-card-media" href="#room-detail?id=' + room.id + '" data-action="open-room" data-id="' + room.id + '" aria-label="Ver ' + this.esc(room.name) + '">' +
          '<img src="' + main + '" alt="' + this.esc(alt) + '" width="1200" height="900" loading="lazy">' +
          '<span class="room-card-badge">' + this.statusCompact(room.status) + "</span>" +
          (opts.packageHint ? '<span class="room-card-flag">' + opts.packageHint + "</span>" : "") +
        "</a>" +
        '<div class="room-card-body">' +
          '<p class="room-card-area">' + this.icon("pin") + this.esc(room.area) + " · " + this.esc(room.zone) + "</p>" +
          '<h3 class="room-card-title"><a href="#room-detail?id=' + room.id + '" data-action="open-room" data-id="' + room.id + '">' + this.esc(room.name) + "</a></h3>" +
          '<div class="room-card-apt-wrap">' +
            '<p class="room-card-apt">' + this.esc(room.apt) + " · " + room.size + " m² · Estancia mín. " + room.minStay + (room.minStay === 1 ? " mes" : " meses") + "</p>" +
            (availInApt.length >= 2
              ? '<button type="button" class="apt-multi-pill" data-action="open-room-apt" data-id="' + room.id + '">' +
                  this.icon("building") +
                  '<span>' + availInApt.length + ' habs. disponibles en este piso</span>' +
                '</button>'
              : inhabitedWithDate.length > 0
                ? '<button type="button" class="apt-multi-pill is-soon" data-action="open-room-apt" data-id="' + room.id + '">' +
                    this.icon("calendar") +
                    '<span>Ver ' + aptRooms.length + ' habs. del piso</span>' +
                  '</button>'
                : "") +
          "</div>" +
          '<div class="room-card-foot">' +
            '<p class="price"><strong>' + this.num(room.price) + " €</strong><span>/mes</span></p>" +
            '<p class="room-card-when">' + this.esc(when) + "</p>" +
          "</div>" +
          '<div class="room-card-actions">' +
            '<a class="btn btn-outline btn-sm" href="#room-detail?id=' + room.id + '" data-action="open-room" data-id="' + room.id + '">Ver habitación</a>' +
            (room.status !== "available" && room.availableFrom
              ? '<button class="btn btn-accent btn-sm" type="button" data-action="open-alert" data-id="' + room.id + '">' + this.icon("bell") + "Avísame</button>"
              : '<button class="btn btn-ghost btn-sm" type="button" data-action="open-alert" data-id="' + room.id + '">Avísame</button>') +
            (otherAvail.length >= 1
              ? '<a class="btn btn-ghost btn-sm apt-ext-mini" href="?room=' + otherAvail[0].id + '#room-detail" target="_blank" rel="noopener" data-action="open-room-external" data-id="' + otherAvail[0].id + '" title="Ir a otra habitación disponible en ' + this.esc(room.apt) + '">' +
                  'Otra disponible (' + otherAvail[0].price + ' €) ' + this.icon("external") +
                "</a>"
              : "") +
          "</div>" +
        "</div>" +
      "</article>"
    );
  },

  field(opts) {
    const id = opts.id;
    const req = opts.required ? ' required' : "";
    const hint = opts.hint ? '<p class="field-hint">' + opts.hint + "</p>" : "";
    const error = '<p class="field-error" id="' + id + '-error" hidden></p>';
    let control = "";
    if (opts.type === "textarea") {
      control = '<textarea class="input" id="' + id + '" name="' + (opts.name || id) + '" rows="' + (opts.rows || 4) + '"' + req + ' placeholder="' + this.esc(opts.placeholder || "") + '"></textarea>';
    } else if (opts.type === "select") {
      control = '<select class="input select" id="' + id + '" name="' + (opts.name || id) + '"' + req + ">" + opts.options + "</select>";
    } else {
      control = '<input class="input" id="' + id + '" name="' + (opts.name || id) + '" type="' + (opts.type || "text") + '"' + (opts.min != null ? ' min="' + opts.min + '"' : "") + (opts.max != null ? ' max="' + opts.max + '"' : "") + (opts.step ? ' step="' + opts.step + '"' : "") + (opts.value != null ? ' value="' + this.esc(opts.value) + '"' : "") + (opts.placeholder ? ' placeholder="' + this.esc(opts.placeholder) + '"' : "") + req + ">";
    }
    return (
      '<div class="field">' +
        '<label for="' + id + '">' + this.esc(opts.label) + (opts.required ? '<span class="req" aria-hidden="true">*</span>' : "") + "</label>" +
        control + hint + error +
      "</div>"
    );
  },

  emptyState(opts) {
    return (
      '<div class="empty-state">' +
        '<span class="empty-icon">' + this.icon(opts.icon || "search") + "</span>" +
        "<h3>" + this.esc(opts.title) + "</h3>" +
        "<p>" + this.esc(opts.body) + "</p>" +
        (opts.action || "") +
      "</div>"
    );
  },

  modal(options) {
    UI._lastFocus = document.activeElement;
    const root = document.getElementById("overlay-root");
    const size = options.size ? " modal-" + options.size : "";
    root.innerHTML =
      '<dialog class="modal' + size + '" id="od-modal" aria-labelledby="od-modal-title">' +
        '<div class="modal-head">' +
          '<h2 id="od-modal-title">' + this.esc(options.title || "") + "</h2>" +
          '<button class="icon-btn" type="button" data-action="close-overlay" aria-label="Cerrar">' + this.icon("close") + "</button>" +
        "</div>" +
        '<div class="modal-body">' + (options.body || "") + "</div>" +
        (options.footer ? '<div class="modal-foot">' + options.footer + "</div>" : "") +
      "</dialog>";
    const dialog = document.getElementById("od-modal");
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
      const first = dialog.querySelector("input, select, textarea, button:not(.icon-btn)");
      if (first) first.focus();
    }
  },

  closeOverlay() {
    const dialog = document.getElementById("od-modal");
    if (dialog) {
      if (dialog.open && typeof dialog.close === "function") dialog.close();
      dialog.remove();
    }
    const root = document.getElementById("overlay-root");
    if (root) root.innerHTML = "";
    if (UI._lastFocus && document.contains(UI._lastFocus)) {
      try { UI._lastFocus.focus(); } catch (e) { /* noop */ }
    }
  },

  toast(message, type) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const el = document.createElement("div");
    el.className = "toast toast-" + (type || "ok");
    el.innerHTML = '<span class="toast-icon">' + this.icon(type === "error" ? "alert" : type === "info" ? "info" : "check") + "</span><p>" + this.esc(message) + "</p>";
    root.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 320);
    }, 3800);
  },

  switchControl(id, checked, label) {
    return (
      '<label class="switch">' +
        '<input type="checkbox" id="' + id + '" data-switch="' + id + '"' + (checked ? " checked" : "") + ">" +
        '<span class="switch-track" aria-hidden="true"></span>' +
        '<span class="switch-label">' + this.esc(label) + "</span>" +
      "</label>"
    );
  },

  stat(value, label, hint) {
    return (
      '<div class="stat">' +
        '<span class="stat-value">' + value + "</span>" +
        '<span class="stat-label">' + this.esc(label) + "</span>" +
        (hint ? '<span class="stat-hint">' + this.esc(hint) + "</span>" : "") +
      "</div>"
    );
  }
};

function MIN_PACKAGE_LABEL(feature) {
  const min = FEATURE_MIN[feature] || "essential";
  return Store.pkgName(min).toUpperCase() + "+";
}

document.addEventListener("click", (event) => {
  const dialog = document.getElementById("od-modal");
  if (dialog && event.target === dialog) UI.closeOverlay();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const dialog = document.getElementById("od-modal");
    if (dialog && dialog.open) UI.closeOverlay();
  }
});
