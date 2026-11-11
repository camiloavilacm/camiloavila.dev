/* HABITIA — Vistas del Panel Administrativo (B2B SaaS) */

const ViewsAdmin = {
  /* ========================================================================
     1. PANTALLA DE LOGIN (#admin-login)
     ======================================================================== */
  login() {
    return (
      '<main id="main" style="min-height:calc(100vh - 45px);display:grid;place-items:center;padding:32px 16px;background:var(--bg-admin)">' +
        '<div class="panel-card" style="width:min(440px,100%);padding:32px;box-shadow:var(--shadow-md)">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">' +
            '<div class="brand-logo">' +
              '<span class="brand-mark">H</span>' +
              '<span class="brand-text">' +
                '<span class="brand-name">HABITIA Admin</span>' +
                '<span class="brand-sub">Panel de Gestión · Avenew Madrid</span>' +
              '</span>' +
            '</div>' +
            '<span class="badge is-neutral">B2B SaaS</span>' +
          '</div>' +
          '<h1 style="margin:0 0 6px;font-size:1.35rem">Acceso al panel de inventario</h1>' +
          '<p style="margin:0 0 22px;font-size:0.88rem;color:var(--text-secondary)">Acceso privado para gestores de activos. Sin registro público.</p>' +
          '<form id="admin-login-form" class="od-stack" style="--od-gap:14px" onsubmit="return false">' +
            UI.field({ id: "login-email", label: "Correo corporativo", type: "email", required: true, value: "admin@habitia.es" }) +
            UI.field({ id: "login-pass", label: "Contraseña", type: "password", required: true, value: "habitia2026" }) +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">' +
              '<label class="check-row"><input type="checkbox" checked> Recordarme en este equipo</label>' +
              '<button type="button" class="link-btn" style="background:none;border:0;color:var(--brand-primary);font-weight:700;font-size:0.84rem;padding:0" data-action="open-recover-modal">¿Olvidaste tu contraseña?</button>' +
            '</div>' +
            '<button class="btn btn-primary btn-lg" type="button" data-action="submit-login">Acceder al Panel ' + UI.icon("arrowRight") + '</button>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-route="home">← Volver a la web pública</button>' +
          '</form>' +
        '</div>' +
      '</main>'
    );
  },

  /* ========================================================================
     2. LAYOUT DEL PANEL CON BARRA LATERAL PERSISTENTE
     ======================================================================== */
  shell(title, subtitle, innerHtml, actionsHtml) {
    const r = Store.state.route.name;
    const unreadCount = Store.state.leads.filter((l) => l.unread || l.status === "nueva").length;

    const menu = [
      { route: "admin-dashboard", icon: "grid", label: "Dashboard", feature: null },
      { route: "admin-rooms", icon: "bed", label: "Habitaciones (Inventario)", feature: null },
      { route: "admin-inventory-map", icon: "map", label: "Mapa de Ocupación (100)", feature: "inventoryMap", tier: "COMPLETE" },
      { route: "admin-inbox", icon: "whatsapp", label: "Inbox Omnicanal (" + unreadCount + ")", feature: "inbox", tier: "IMPROVED+" },
      { route: "admin-inquiries", icon: "inbox", label: "Tabla CRM Leads", feature: "crm", tier: "IMPROVED" },
      { route: "admin-calendar", icon: "calendar", label: "Calendario 30/60/90d", feature: "calendar", tier: "IMPROVED" },
      { route: "admin-subscribers", icon: "users", label: "Inquilinos y Alertas", feature: "subscribers", tier: "COMPLETE" },
      { route: "admin-import", icon: "upload", label: "Importación Excel", feature: "import", tier: "COMPLETE" },
      { route: "admin-users", icon: "key", label: "Usuarios y Roles", feature: "users", tier: "IMPROVED+" },
      { route: "admin-settings", icon: "settings", label: "Configuración", feature: null }
    ];

    return (
      '<div class="admin-shell">' +
        '<aside class="admin-sidebar" aria-label="Menú de administración">' +
          '<div class="admin-sidebar-brand">' +
            '<a href="#admin-dashboard" class="brand-logo" data-action="nav" data-route="admin-dashboard">' +
              '<span class="brand-mark" style="background:#427565">H</span>' +
              '<span class="brand-text">' +
                '<span class="brand-name">HABITIA</span>' +
                '<span class="brand-sub">Avenew Asset Mgmt</span>' +
              '</span>' +
            '</a>' +
          '</div>' +
          '<nav class="admin-nav">' +
            menu.map((m) => {
              const active = r === m.route || (m.route === "admin-rooms" && r === "admin-room-form");
              const locked = m.feature && !Store.included(m.feature);
              return (
                '<button type="button" class="admin-nav-btn' + (active ? " is-active" : "") + '" data-action="nav" data-route="' + m.route + '">' +
                  '<span class="admin-nav-left">' +
                    UI.icon(m.icon) +
                    '<span class="od-truncate">' + UI.esc(m.label) + '</span>' +
                  '</span>' +
                  (m.tier ? '<span class="admin-tier-pill' + (locked ? " is-locked" : "") + '">' + m.tier + '</span>' : "") +
                '</button>'
              );
            }).join("") +
          '</nav>' +
          '<div class="admin-sidebar-foot">' +
            '<div style="background:rgba(255,255,255,0.06);padding:10px 12px;border-radius:var(--radius-sm);font-size:0.78rem">' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:4px">' +
                '<span style="color:#A9BDB6">Paquete simulado:</span>' +
                '<strong style="color:#FFF;text-transform:uppercase">' + UI.esc(Store.state.pkg) + '</strong>' +
              '</div>' +
              '<span style="color:#C2D2CC">Límite admins: ' + Store.state.users.length + ' / ' + Store.adminLimit() + ' activos</span>' +
            '</div>' +
            '<div class="admin-user-chip">' +
              '<span class="admin-avatar">LM</span>' +
              '<div style="min-width:0;flex:1">' +
                '<strong class="od-truncate" style="font-size:0.84rem;color:#FFF">Laura Martín</strong>' +
                '<span class="od-truncate" style="font-size:0.74rem;color:#9BB0A9">admin@habitia.es</span>' +
              '</div>' +
              '<button type="button" class="icon-btn" style="background:transparent;border-color:rgba(255,255,255,0.2);color:#FFF;width:32px;height:32px" data-action="logout" aria-label="Cerrar sesión">' + UI.icon("logout") + '</button>' +
            '</div>' +
          '</div>' +
        '</aside>' +

        '<div class="admin-main">' +
          '<header class="admin-topbar">' +
            '<div>' +
              '<h1 class="admin-topbar-title">' + UI.esc(title) + '</h1>' +
              (subtitle ? '<p style="margin:2px 0 0;font-size:0.84rem;color:var(--text-secondary)">' + subtitle + '</p>' : "") +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
              (actionsHtml || "") +
              '<button class="btn btn-outline btn-sm" type="button" data-action="nav" data-route="home">' + UI.icon("external") + 'Ver Web Pública</button>' +
              '<button class="btn btn-primary btn-sm" type="button" data-action="open-room-form">+ Añadir habitación</button>' +
            '</div>' +
          '</header>' +
          '<main id="main" class="admin-content">' +
            innerHtml +
          '</main>' +
        '</div>' +
        this.renderDrawer() +
      '</div>'
    );
  },

  packageBanner(feature) {
    if (Store.included(feature)) return "";
    const needed = MIN_PACKAGE_LABEL(feature);
    return (
      '<div style="background:var(--brand-accent-soft);border:1px solid var(--brand-accent);border-radius:var(--radius-md);padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          UI.icon("sparkles") +
          '<span>Estás previsualizando <strong>' + UI.esc(FEATURE_LABEL[feature] || "este módulo") + '</strong>. En el paquete actual (<strong>' + Store.pkgName().toUpperCase() + '</strong>) aparece marcado como función de <strong>' + needed + '</strong>.</span>' +
        '</div>' +
        '<button class="btn btn-accent btn-sm" type="button" data-action="set-pkg" data-pkg="' + Store.minPackage(feature) + '">Activar paquete ' + Store.pkgName(Store.minPackage(feature)) + ' en barra superior</button>' +
      '</div>'
    );
  },

  /* ========================================================================
     3. DASHBOARD PRINCIPAL (#admin-dashboard)
     ======================================================================== */
  dashboard() {
    const kpis = Store.operationalKpis();
    const extraLeads = Math.max(0, Store.state.leads.length - SEED.leads.length);
    const totalInquiries = 14 + extraLeads;
    const criticalRooms = Store.state.rooms
      .filter((r) => r.status === "upcoming" || r.status === "available")
      .slice(0, 6);

    const circumference = 352;
    const occArc = Math.round((kpis.occupied / kpis.total) * circumference);
    const okArc = Math.round((kpis.available / kpis.total) * circumference);
    const soonArc = Math.max(0, circumference - occArc - okArc);

    const content =
      /* 6 KPI Cards */
      '<div class="kpi-grid">' +
        '<div class="kpi-card"><span class="kpi-label">Total habitaciones</span><strong class="kpi-value tabular">' + kpis.total + '</strong><span class="kpi-sub">12 pisos en 4 distritos</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Publicadas en web</span><strong class="kpi-value tabular">' + kpis.published + '</strong><span class="kpi-sub">15 en revisión / rotación</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Libres ahora (Verde)</span><strong class="kpi-value tabular" style="color:var(--status-ok-fg)">' + kpis.available + '</strong><span class="kpi-sub">Entrada inmediata</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Próximas vacantes (Naranja)</span><strong class="kpi-value tabular" style="color:var(--status-soon-fg)">' + kpis.upcoming + '</strong><span class="kpi-sub">Liberación a 7/15/30 días</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Ocupadas (Rojo)</span><strong class="kpi-value tabular" style="color:var(--status-off-fg)">' + kpis.occupied + '</strong><span class="kpi-sub">Ocupación activa del ' + kpis.occupied + '%</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Consultas activas</span><strong class="kpi-value tabular" style="color:var(--brand-accent-dark)">' + totalInquiries + '</strong><span class="kpi-sub">Sincronizadas en Inbox</span></div>' +
      '</div>' +

      /* Banner de acceso rápido al Mapa Operativo de Ocupación Geográfica */
      '<div class="panel-card" style="background:linear-gradient(90deg,#1B332C 0%,#234B40 100%);color:#FFF;border:0">' +
        '<div class="panel-card-body" style="padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
          '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
            '<span class="badge" style="background:rgba(255,255,255,0.14);color:#FFF">' + UI.icon("map") + ' MAPA OPERATIVO 100 HABS.</span>' +
            '<div>' +
              '<strong style="display:block;font-size:0.98rem">Control geográfico en tiempo real con Semáforo de Ocupación (Chamberí 34 · Salamanca 28 · Malasaña 22 · Moncloa 16)</strong>' +
              '<span style="font-size:0.82rem;color:#C2D2CC">Inspecciona clusters por edificio y edita fechas de fin de contrato o disponibilidad sin salir del mapa.</span>' +
            '</div>' +
          '</div>' +
          '<button class="btn btn-accent btn-sm" type="button" data-action="nav" data-route="admin-inventory-map">' + UI.icon("map") + 'Abrir Mapa de Ocupación →</button>' +
        '</div>' +
      '</div>' +

      /* 2 Gráficos Visuales SVG */
      '<div class="grid-2">' +
        '<div class="panel-card">' +
          '<div class="panel-card-head">' +
            '<h3>Evolución y Proyección de Vacantes (Próximos 6 meses)</h3>' +
            '<span class="badge is-neutral">Rotación proyectada</span>' +
          '</div>' +
          '<div class="panel-card-body">' +
            '<svg viewBox="0 0 540 210" width="100%" height="210" role="img" aria-label="Gráfico de evolución de disponibilidad en 6 meses">' +
              '<line x1="40" y1="25" x2="510" y2="25" stroke="#E7E6E0" stroke-dasharray="4 4"/>' +
              '<line x1="40" y1="80" x2="510" y2="80" stroke="#E7E6E0" stroke-dasharray="4 4"/>' +
              '<line x1="40" y1="135" x2="510" y2="135" stroke="#E7E6E0" stroke-dasharray="4 4"/>' +
              '<line x1="40" y1="175" x2="510" y2="175" stroke="#D2D0C8"/>' +
              '<text x="8" y="30" fill="#747B77" font-size="11">30</text>' +
              '<text x="8" y="84" fill="#747B77" font-size="11">20</text>' +
              '<text x="8" y="139" fill="#747B77" font-size="11">10</text>' +
              '<text x="14" y="178" fill="#747B77" font-size="11">0</text>' +
              '<path d="M65 110 L150 92 L235 120 L320 74 L405 88 L490 62 L490 175 L65 175 Z" fill="rgba(35, 75, 64, 0.12)"/>' +
              '<polyline fill="none" stroke="#234B40" stroke-width="3" points="65,110 150,92 235,120 320,74 405,88 490,62"/>' +
              '<polyline fill="none" stroke="#C47B61" stroke-width="2.5" stroke-dasharray="5 4" points="65,138 150,122 235,142 320,104 405,115 490,95"/>' +
              '<circle cx="65" cy="110" r="4.5" fill="#234B40"/><text x="58" y="100" fill="#252B29" font-size="11" font-weight="700">' + kpis.available + '</text>' +
              '<circle cx="150" cy="92" r="4.5" fill="#234B40"/><text x="143" y="82" fill="#252B29" font-size="11" font-weight="700">22</text>' +
              '<circle cx="235" cy="120" r="4.5" fill="#234B40"/><text x="228" y="110" fill="#252B29" font-size="11" font-weight="700">15</text>' +
              '<circle cx="320" cy="74" r="4.5" fill="#234B40"/><text x="313" y="64" fill="#252B29" font-size="11" font-weight="700">25</text>' +
              '<circle cx="405" cy="88" r="4.5" fill="#234B40"/><text x="398" y="78" fill="#252B29" font-size="11" font-weight="700">21</text>' +
              '<circle cx="490" cy="62" r="4.5" fill="#234B40"/><text x="482" y="52" fill="#252B29" font-size="11" font-weight="700">27</text>' +
              '<text x="52" y="196" fill="#58605C" font-size="11" font-weight="600">Mes 1</text>' +
              '<text x="136" y="196" fill="#58605C" font-size="11" font-weight="600">Mes 2</text>' +
              '<text x="221" y="196" fill="#58605C" font-size="11" font-weight="600">Mes 3</text>' +
              '<text x="306" y="196" fill="#58605C" font-size="11" font-weight="600">Mes 4</text>' +
              '<text x="391" y="196" fill="#58605C" font-size="11" font-weight="600">Mes 5</text>' +
              '<text x="474" y="196" fill="#58605C" font-size="11" font-weight="600">Mes 6</text>' +
            '</svg>' +
          '</div>' +
        '</div>' +

        '<div class="panel-card">' +
          '<div class="panel-card-head">' +
            '<h3>Semáforo Operativo del Inventario (100 habs.)</h3>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-route="admin-inventory-map">Ver en mapa →</button>' +
          '</div>' +
          '<div class="panel-card-body donut-card-grid">' +
            '<svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="Gráfico de anillo del semáforo de inventario">' +
              '<circle cx="80" cy="80" r="56" fill="none" stroke="#E9ECEF" stroke-width="20"/>' +
              '<circle cx="80" cy="80" r="56" fill="none" stroke="#DC2626" stroke-width="20" stroke-dasharray="' + occArc + ' 352" stroke-dashoffset="0" transform="rotate(-90 80 80)"/>' +
              '<circle cx="80" cy="80" r="56" fill="none" stroke="#28A745" stroke-width="20" stroke-dasharray="' + okArc + ' 352" stroke-dashoffset="-' + occArc + '" transform="rotate(-90 80 80)"/>' +
              '<circle cx="80" cy="80" r="56" fill="none" stroke="#F59E0B" stroke-width="20" stroke-dasharray="' + soonArc + ' 352" stroke-dashoffset="-' + (occArc + okArc) + '" transform="rotate(-90 80 80)"/>' +
              '<text x="80" y="76" text-anchor="middle" fill="#252B29" font-size="22" font-weight="800">' + kpis.total + '</text>' +
              '<text x="80" y="95" text-anchor="middle" fill="#747B77" font-size="10" font-weight="600">HABITACIONES</text>' +
            '</svg>' +
            '<div class="od-stack" style="--od-gap:12px">' +
              '<div class="donut-legend-row">' +
                '<span class="badge is-ok"><span class="dot"></span>Disponible ahora (Verde)</span>' +
                '<strong class="tabular">' + kpis.available + ' (' + kpis.available + '%)</strong>' +
              '</div>' +
              '<div class="donut-legend-row">' +
                '<span class="badge is-soon"><span class="dot"></span>Próxima disponibilidad (Naranja)</span>' +
                '<strong class="tabular">' + kpis.upcoming + ' (' + kpis.upcoming + '%)</strong>' +
              '</div>' +
              '<div class="donut-legend-row">' +
                '<span class="badge is-off"><span class="dot"></span>Ocupada / No disponible (Rojo)</span>' +
                '<strong class="tabular">' + kpis.occupied + ' (' + kpis.occupied + '%)</strong>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* Tabla de Próximas Liberaciones Críticas + Feed de Actividad Reciente */
      '<div class="grid-2 grid-2-asym">' +
        '<div class="panel-card">' +
          '<div class="panel-card-head">' +
            '<h3>Próximas liberaciones críticas y vacantes</h3>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-route="admin-calendar">Abrir calendario Gantt →</button>' +
          '</div>' +
          '<div class="table-wrap">' +
            '<table class="data-table">' +
              '<thead><tr><th>Ref.</th><th>Habitación / Piso</th><th>Barrio</th><th>Precio</th><th>Disponible desde</th><th>Estado</th><th>Acción</th></tr></thead>' +
              '<tbody>' +
                criticalRooms.map((r) =>
                  '<tr>' +
                    '<td class="tabular"><strong>' + UI.esc(r.id) + '</strong></td>' +
                    '<td><strong class="od-truncate" style="max-width:200px">' + UI.esc(r.name) + '</strong><span style="font-size:0.75rem;color:var(--text-muted)">' + UI.esc(r.apt) + '</span></td>' +
                    '<td>' + UI.esc(r.area) + '</td>' +
                    '<td class="tabular"><strong>' + r.price + ' €</strong></td>' +
                    '<td class="tabular">' + UI.dateShort(r.availableFrom) + '</td>' +
                    '<td>' + UI.statusCompact(r.status) + '</td>' +
                    '<td><button class="btn btn-outline btn-sm" type="button" data-action="open-room-form" data-id="' + r.id + '">Editar</button></td>' +
                  '</tr>'
                ).join("") +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +

        '<div class="panel-card">' +
          '<div class="panel-card-head">' +
            '<h3>Actividad reciente del equipo</h3>' +
            '<span class="badge is-neutral">En vivo</span>' +
          '</div>' +
          '<div class="panel-card-body od-stack" style="--od-gap:14px">' +
            Store.state.activity.slice(0, 6).map((ev) =>
              '<div style="display:flex;align-items:flex-start;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--border-subtle)">' +
                '<span class="badge ' + (ev.tone === "ok" ? "is-ok" : ev.tone === "accent" ? "is-soon" : "is-neutral") + '" style="padding:4px;border-radius:50%"><span class="dot"></span></span>' +
                '<div style="min-width:0">' +
                  '<p style="margin:0;font-size:0.86rem;font-weight:600">' + UI.esc(ev.text) + '</p>' +
                  '<span style="font-size:0.75rem;color:var(--text-muted)">' + UI.esc(ev.meta) + '</span>' +
                '</div>' +
              '</div>'
            ).join("") +
          '</div>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Dashboard Operativo",
      "Resumen en tiempo real de las 100 habitaciones gestionadas en Madrid.",
      content
    );
  },

  /* ========================================================================
     3B. MAPA OPERATIVO DE OCUPACIÓN GEOGRÁFICA (#admin-inventory-map)
     ======================================================================== */
  inventoryMap() {
    const mapState = Store.state.inventoryMap || {
      district: "Todos",
      status: "all",
      mode: "clusters",
      selectedBuildingId: "BLD-CHA-1",
      selectedUnitId: null,
      editingUnitId: null
    };
    const dCounts = Store.districtCounts();
    const kpis = Store.operationalKpis();
    const clusters = Store.buildingClusters();
    const filteredUnits = Store.filteredInventoryUnits();

    const activeBuilding =
      clusters.find((c) => c.id === mapState.selectedBuildingId) ||
      clusters[0] ||
      Store.buildingClusters()[0];

    const districts = [
      { key: "Todos", label: "Todos", count: dCounts.Todos },
      { key: "Chamberí", label: "Chamberí", count: dCounts.Chamberí },
      { key: "Salamanca", label: "Salamanca", count: dCounts.Salamanca },
      { key: "Malasaña", label: "Malasaña", count: dCounts.Malasaña },
      { key: "Moncloa", label: "Moncloa", count: dCounts.Moncloa }
    ];

    const statusChips = [
      { key: "all", label: "Todos los estados (" + filteredUnits.length + ")", cls: "" },
      { key: "available", label: "Disponible ahora (" + kpis.available + ")", cls: "is-ok" },
      { key: "upcoming", label: "Próxima 7/15/30d (" + kpis.upcoming + ")", cls: "is-soon" },
      { key: "occupied", label: "Ocupada (" + kpis.occupied + ")", cls: "is-off" }
    ];

    const renderClusterRing = (c, isSelected) => {
      const r = 21;
      const circ = +(2 * Math.PI * r).toFixed(2); // ~131.95
      const tot = Math.max(1, c.total);
      const okLen = +((c.available / tot) * circ).toFixed(2);
      const soonLen = +((c.upcoming / tot) * circ).toFixed(2);
      const occLen = Math.max(0, +(circ - okLen - soonLen).toFixed(2));

      return (
        '<button type="button" class="inv-cluster-marker' + (isSelected ? " is-selected" : "") + '" style="left:' + c.x + '%;top:' + c.y + '%" data-action="select-map-building" data-id="' + c.id + '" aria-label="Edificio ' + UI.esc(c.name) + ': ' + c.available + ' disponibles, ' + c.upcoming + ' próximas, ' + c.occupied + ' ocupadas">' +
          '<div class="inv-cluster-ring-wrap">' +
            '<svg viewBox="0 0 54 54" width="54" height="54" aria-hidden="true">' +
              '<circle cx="27" cy="27" r="21" fill="#172A24" stroke="#FFFFFF" stroke-width="2"/>' +
              '<circle cx="27" cy="27" r="21" fill="none" stroke="#DC2626" stroke-width="6" stroke-dasharray="' + occLen + " " + circ + '" stroke-dashoffset="0" transform="rotate(-90 27 27)"/>' +
              '<circle cx="27" cy="27" r="21" fill="none" stroke="#28A745" stroke-width="6" stroke-dasharray="' + okLen + " " + circ + '" stroke-dashoffset="-' + occLen + '" transform="rotate(-90 27 27)"/>' +
              '<circle cx="27" cy="27" r="21" fill="none" stroke="#F59E0B" stroke-width="6" stroke-dasharray="' + soonLen + " " + circ + '" stroke-dashoffset="-' + +(occLen + okLen).toFixed(2) + '" transform="rotate(-90 27 27)"/>' +
              '<text x="27" y="25" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="800">' + c.total + '</text>' +
              '<text x="27" y="35" text-anchor="middle" fill="#BFD2CB" font-size="7.5" font-weight="700">HABS</text>' +
            '</svg>' +
          '</div>' +
          '<div class="inv-cluster-caption">' +
            '<strong class="inv-cluster-title">' + UI.esc(c.name.replace("Apt. ", "").replace("Edificio ", "")) + '</strong>' +
            '<span class="inv-cluster-dots tabular">' +
              '<span class="c-dot is-ok">' + c.available + '</span>' +
              '<span class="c-dot is-soon">' + c.upcoming + '</span>' +
              '<span class="c-dot is-off">' + c.occupied + '</span>' +
            '</span>' +
          '</div>' +
        '</button>'
      );
    };

    const renderUnitPin = (u) => {
      const isSel = mapState.selectedUnitId === u.uid;
      const toneCls = u.status === "available" ? "is-ok" : u.status === "upcoming" ? "is-soon" : "is-off";
      return (
        '<button type="button" class="inv-unit-pin ' + toneCls + (isSel ? " is-selected" : "") + '" style="left:' + u.px + '%;top:' + u.py + '%" data-action="select-map-unit" data-uid="' + u.uid + '" data-building="' + u.buildingId + '" title="' + UI.esc(u.roomId + " · " + u.buildingName + " · " + u.price + " €") + '">' +
          '<span class="tabular">' + u.price + '€</span>' +
        '</button>'
      );
    };

    const bldUnits = activeBuilding
      ? activeBuilding.units.filter((u) => mapState.status === "all" || u.status === mapState.status)
      : [];

    const content =
      this.packageBanner("inventoryMap") +

      /* Cabecera de Semáforo Operativo y Conmutador de Vista */
      '<div class="panel-card">' +
        '<div class="panel-card-body" style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
          '<div class="inv-semaphore-strip">' +
            '<div class="inv-sem-item is-ok">' +
              '<span class="inv-sem-dot"></span>' +
              '<div>' +
                '<strong class="tabular">' + kpis.available + ' habs.</strong>' +
                '<span>Disponible ahora (Verde)</span>' +
              '</div>' +
            '</div>' +
            '<div class="inv-sem-item is-soon">' +
              '<span class="inv-sem-dot"></span>' +
              '<div>' +
                '<strong class="tabular">' + kpis.upcoming + ' habs.</strong>' +
                '<span>Próxima disponibilidad 7/15/30d (Naranja)</span>' +
              '</div>' +
            '</div>' +
            '<div class="inv-sem-item is-off">' +
              '<span class="inv-sem-dot"></span>' +
              '<div>' +
                '<strong class="tabular">' + kpis.occupied + ' habs.</strong>' +
                '<span>Ocupada con contrato (Rojo)</span>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
            '<span style="font-size:0.78rem;font-weight:700;color:var(--text-secondary)">Modo de visualización:</span>' +
            '<div class="seg-control" style="background:var(--bg-primary);border:1px solid var(--border-subtle)">' +
              '<button type="button" class="seg-btn' + (mapState.mode === "clusters" ? " is-active" : "") + '" style="' + (mapState.mode === "clusters" ? "background:var(--brand-primary);color:#FFF" : "color:var(--text-primary)") + '" data-action="set-inv-map-mode" data-mode="clusters">' +
                'Clusters por Piso (' + clusters.length + ')' +
              '</button>' +
              '<button type="button" class="seg-btn' + (mapState.mode === "pins" ? " is-active" : "") + '" style="' + (mapState.mode === "pins" ? "background:var(--brand-primary);color:#FFF" : "color:var(--text-primary)") + '" data-action="set-inv-map-mode" data-mode="pins">' +
                'Pines Habitaciones (' + filteredUnits.length + ')' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* Barra de Filtros Rápidos (Chips de Zona + Filtro Semáforo) */
      '<div class="inv-filter-bar">' +
        '<div class="inv-chip-group" role="group" aria-label="Filtrar por distrito de Madrid">' +
          '<span class="inv-chip-label">' + UI.icon("pin") + ' Distrito:</span>' +
          districts.map((d) => {
            const active = mapState.district === d.key;
            return (
              '<button type="button" class="chip tabular' + (active ? " is-active" : "") + '" data-action="set-inv-district" data-district="' + d.key + '">' +
                UI.esc(d.label) + ' (' + d.count + ')' +
              '</button>'
            );
          }).join("") +
        '</div>' +

        '<div class="inv-chip-group" role="group" aria-label="Filtrar por color del semáforo">' +
          '<span class="inv-chip-label">Semáforo:</span>' +
          statusChips.map((s) => {
            const active = mapState.status === s.key;
            return (
              '<button type="button" class="chip tabular ' + s.cls + (active ? " is-active" : "") + '" data-action="set-inv-status" data-status="' + s.key + '">' +
                (s.cls ? '<span class="dot"></span>' : '') +
                UI.esc(s.label) +
              '</button>'
            );
          }).join("") +
        '</div>' +
      '</div>' +

      /* Layout Principal: Mapa Geográfico de Madrid + Cajón Lateral Operativo */
      '<div class="inv-map-workspace">' +
        /* Columna Izquierda: Lienzo Cartográfico de Madrid con Clusters / Pines */
        '<div class="inv-map-canvas" role="region" aria-label="Mapa Operativo de Ocupación en Madrid">' +
          '<svg class="inv-map-svg" viewBox="0 0 900 620" preserveAspectRatio="none" aria-hidden="true">' +
            '<defs>' +
              '<pattern id="madridGrid" width="45" height="45" patternUnits="userSpaceOnUse">' +
                '<path d="M 45 0 L 0 0 0 45" fill="none" stroke="rgba(35,75,64,0.06)" stroke-width="1"/>' +
              '</pattern>' +
            '</defs>' +
            '<rect width="900" height="620" fill="#ECEAE2"/>' +
            '<rect width="900" height="620" fill="url(#madridGrid)"/>' +
            /* Zonas verdes (Parque del Oeste / Casa de Campo / El Retiro) */
            '<path d="M 0,110 Q 150,150 175,320 L 0,390 Z" fill="#DCE8D6" opacity="0.85"/>' +
            '<rect x="575" y="340" width="185" height="175" rx="18" fill="#DCE8D6" opacity="0.85"/>' +
            /* Río Manzanares */
            '<path d="M 40,0 Q 125,210 140,420 T 240,620" fill="none" stroke="#B9D6E2" stroke-width="14" stroke-linecap="round"/>' +
            /* Delimitación suave de los 4 distritos operativos */
            '<rect x="145" y="180" width="165" height="150" rx="14" fill="rgba(35,75,64,0.04)" stroke="rgba(35,75,64,0.18)" stroke-dasharray="5 5"/>' +
            '<rect x="315" y="85" width="215" height="165" rx="14" fill="rgba(35,75,64,0.05)" stroke="rgba(35,75,64,0.2)" stroke-dasharray="5 5"/>' +
            '<rect x="545" y="120" width="250" height="195" rx="14" fill="rgba(196,123,97,0.06)" stroke="rgba(196,123,97,0.24)" stroke-dasharray="5 5"/>' +
            '<rect x="295" y="255" width="235" height="190" rx="14" fill="rgba(35,75,64,0.04)" stroke="rgba(35,75,64,0.18)" stroke-dasharray="5 5"/>' +
            /* Arterias principales de Madrid (Castellana, Gran Vía, Serrano, Velázquez, Princesa) */
            '<path d="M 520,0 L 505,620" stroke="#FFFFFF" stroke-width="9"/>' +
            '<path d="M 520,0 L 505,620" stroke="#D5D1C5" stroke-width="2" stroke-dasharray="8 6"/>' +
            '<path d="M 120,220 L 840,210" stroke="#FFFFFF" stroke-width="6.5"/>' +
            '<path d="M 160,340 Q 370,315 510,335 L 830,330" stroke="#FFFFFF" stroke-width="6.5"/>' +
            '<path d="M 600,60 L 595,540" stroke="#FFFFFF" stroke-width="5"/>' +
            '<path d="M 675,70 L 670,520" stroke="#FFFFFF" stroke-width="4.5"/>' +
            '<path d="M 395,70 L 405,530" stroke="#FFFFFF" stroke-width="4.5"/>' +
            /* Etiquetas cartográficas de distritos y vías */
            '<text x="360" y="112" fill="#234B40" font-size="13" font-weight="800" letter-spacing="1.5">CHAMBERÍ (34 HABS.)</text>' +
            '<text x="580" y="146" fill="#234B40" font-size="13" font-weight="800" letter-spacing="1.5">SALAMANCA (28 HABS.)</text>' +
            '<text x="330" y="280" fill="#234B40" font-size="13" font-weight="800" letter-spacing="1.5">MALASAÑA · CENTRO (22 HABS.)</text>' +
            '<text x="165" y="206" fill="#234B40" font-size="12" font-weight="800" letter-spacing="1.2">MONCLOA · ARGÜELLES (16 HABS.)</text>' +
            '<text x="615" y="425" fill="#4C6B50" font-size="12" font-weight="700">PARQUE DEL RETIRO</text>' +
            '<text x="32" y="245" fill="#4C6B50" font-size="11" font-weight="700">PARQUE DEL OESTE</text>' +
            '<text x="515" y="55" fill="#6E7470" font-size="10" font-weight="700">PASEO DE LA CASTELLANA</text>' +
          '</svg>' +

          /* Capa Interactiva de Marcadores (Clusters Dinámicos o 100 Pines) */
          '<div class="inv-map-markers">' +
            (mapState.mode === "clusters"
              ? clusters.map((c) => renderClusterRing(c, activeBuilding && activeBuilding.id === c.id)).join("")
              : filteredUnits.map((u) => renderUnitPin(u)).join("")) +
          '</div>' +

          /* Leyenda Flotante Inferior del Mapa */
          '<div class="inv-map-legend">' +
            '<span style="font-weight:800;color:var(--text-primary)">Semáforo Operativo:</span>' +
            '<span class="inv-leg-item"><span class="inv-leg-dot is-ok"></span>Libre ya (#28A745)</span>' +
            '<span class="inv-leg-item"><span class="inv-leg-dot is-soon"></span>Próxima 7/15/30d (#F59E0B)</span>' +
            '<span class="inv-leg-item"><span class="inv-leg-dot is-off"></span>Ocupada (#DC2626)</span>' +
            '<span style="margin-left:auto;color:var(--text-muted)">Haz clic en cualquier piso para gestionar sus habitaciones →</span>' +
          '</div>' +
        '</div>' +

        /* Columna Derecha: Cajón Lateral / Pop-up del Edificio Seleccionado */
        '<aside class="inv-building-drawer" aria-label="Detalle operativo del edificio seleccionado">' +
          (activeBuilding
            ? '<div class="inv-drawer-head">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
                  '<span class="badge is-neutral">' + UI.icon("pin") + ' ' + UI.esc(activeBuilding.district) + ' · ' + UI.esc(activeBuilding.subzone) + '</span>' +
                  '<span class="badge is-ok tabular">' + activeBuilding.total + ' habs. en el edificio</span>' +
                '</div>' +
                '<h2 style="margin:6px 0 2px;font-size:1.18rem">' + UI.esc(activeBuilding.name) + '</h2>' +
                '<p style="margin:0;font-size:0.8rem;color:var(--text-secondary)">' + UI.esc(activeBuilding.address) + ' · ' + UI.esc(activeBuilding.metro) + '</p>' +

                /* Barra de proporción del semáforo en este edificio */
                '<div class="inv-bld-bar" role="img" aria-label="Proporción de estados del edificio">' +
                  '<span style="width:' + ((activeBuilding.available / activeBuilding.total) * 100) + '%;background:#28A745"></span>' +
                  '<span style="width:' + ((activeBuilding.upcoming / activeBuilding.total) * 100) + '%;background:#F59E0B"></span>' +
                  '<span style="width:' + ((activeBuilding.occupied / activeBuilding.total) * 100) + '%;background:#DC2626"></span>' +
                '</div>' +
                '<div class="inv-bld-counts tabular">' +
                  '<span class="badge is-ok"><span class="dot"></span>' + activeBuilding.available + ' libres</span>' +
                  '<span class="badge is-soon"><span class="dot"></span>' + activeBuilding.upcoming + ' próximas</span>' +
                  '<span class="badge is-off"><span class="dot"></span>' + activeBuilding.occupied + ' ocupadas</span>' +
                '</div>' +
              '</div>' +

              '<div class="inv-drawer-list">' +
                (bldUnits.length === 0
                  ? '<div class="empty-state" style="padding:28px 16px"><p style="margin:0 0 10px">No hay habitaciones con ese estado del semáforo en este edificio.</p><button class="btn btn-outline btn-sm" type="button" data-action="set-inv-status" data-status="all">Ver todas las habitaciones del piso</button></div>'
                  : bldUnits.map((u) => {
                      const isEditing = mapState.editingUnitId === u.uid;
                      const isHighlighted = mapState.selectedUnitId === u.uid;
                      return (
                        '<div class="inv-unit-card' + (isHighlighted ? " is-highlighted" : "") + '">' +
                          '<div class="inv-unit-card-top">' +
                            '<div style="min-width:0;flex:1">' +
                              '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px">' +
                                '<strong class="tabular" style="font-size:0.84rem;color:var(--brand-primary)">' + UI.esc(u.roomId) + '</strong>' +
                                UI.statusBadge(u.status, u.contractEnd) +
                              '</div>' +
                              '<strong class="od-truncate" style="font-size:0.9rem;display:block">' + UI.esc(u.unitLabel) + '</strong>' +
                              '<span style="font-size:0.76rem;color:var(--text-muted)">' + u.size + ' m² · ' + (u.bath === "private" ? "Baño privado" : "Baño compartido") + ' · ' + UI.esc(u.tenantName) + '</span>' +
                            '</div>' +
                            '<div style="text-align:right;flex-shrink:0">' +
                              '<strong class="tabular" style="font-size:1.05rem;color:var(--brand-primary);display:block">' + u.price + ' €/mes</strong>' +
                              '<span class="tabular" style="font-size:0.73rem;color:var(--text-secondary)">Fin contrato: <strong>' + UI.dateShort(u.contractEnd) + '</strong></span>' +
                            '</div>' +
                          '</div>' +

                          '<div class="inv-unit-card-actions">' +
                            '<button type="button" class="btn btn-outline btn-sm" data-action="toggle-edit-map-unit" data-uid="' + u.uid + '">' +
                              UI.icon("edit") + (isEditing ? "Cerrar edición rápida" : "Editar disponibilidad / contrato") +
                            '</button>' +
                            (u.catalogRoomId
                              ? '<button type="button" class="btn btn-ghost btn-sm" data-action="open-room-form" data-id="' + u.catalogRoomId + '">Ficha completa →</button>'
                              : '') +
                          '</div>' +

                          (isEditing
                            ? '<div class="inv-unit-inline-editor">' +
                                '<div class="grid-3" style="gap:8px">' +
                                  '<div class="field">' +
                                    '<label for="map-edit-status-' + u.uid + '">Estado semáforo</label>' +
                                    '<select class="select" id="map-edit-status-' + u.uid + '">' +
                                      '<option value="available"' + (u.status === "available" ? " selected" : "") + '>🟢 Disponible ahora</option>' +
                                      '<option value="upcoming"' + (u.status === "upcoming" ? " selected" : "") + '>🟠 Próxima disponibilidad</option>' +
                                      '<option value="occupied"' + (u.status === "occupied" ? " selected" : "") + '>🔴 Ocupada</option>' +
                                    '</select>' +
                                  '</div>' +
                                  '<div class="field">' +
                                    '<label for="map-edit-date-' + u.uid + '">Fin contrato / Libre</label>' +
                                    '<input class="input tabular" id="map-edit-date-' + u.uid + '" type="date" value="' + UI.esc(u.contractEnd) + '">' +
                                  '</div>' +
                                  '<div class="field">' +
                                    '<label for="map-edit-price-' + u.uid + '">Precio (€/mes)</label>' +
                                    '<input class="input tabular" id="map-edit-price-' + u.uid + '" type="number" value="' + u.price + '">' +
                                  '</div>' +
                                '</div>' +
                                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">' +
                                  '<button type="button" class="btn btn-primary btn-sm" data-action="save-map-unit" data-uid="' + u.uid + '">' + UI.icon("check") + 'Guardar y actualizar semáforo</button>' +
                                '</div>' +
                              '</div>'
                            : '') +
                        '</div>'
                      );
                    }).join("")) +
              '</div>'
            : '') +
        '</aside>' +
      '</div>';

    return this.shell(
      "Mapa Operativo de Ocupación Geográfica (100 habs.)",
      "Control geográfico en tiempo real por edificio y semáforo de contratos en Madrid (Exclusivo paquete COMPLETE).",
      content,
      '<button class="btn btn-outline btn-sm" type="button" data-action="nav" data-route="admin-calendar">' + UI.icon("calendar") + 'Ver Gantt 90d</button>'
    );
  },

  /* ========================================================================
     4. GESTIÓN DE HABITACIONES E INVENTARIO (#admin-rooms)
     ======================================================================== */
  rooms() {
    const f = Store.state.adminRooms;
    const selected = Store.state.selected || [];
    let list = Store.state.rooms.slice();

    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter((r) =>
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.apt.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q)
      );
    }
    if (f.status) {
      list = list.filter((r) => r.status === f.status);
    }
    if (f.area) {
      list = list.filter((r) => r.area === f.area);
    }
    if (f.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") list.sort((a, b) => b.price - a.price);

    const perPage = 8;
    const totalPages = Math.max(1, Math.ceil(list.length / perPage));
    const page = Math.min(f.page || 1, totalPages);
    const pageItems = list.slice((page - 1) * perPage, page * perPage);

    const bulkBanner = selected.length >= 2
      ? '<div class="bulk-bar">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span class="badge is-soon tabular">' + selected.length + ' seleccionadas</span>' +
            '<strong>Edición masiva de inventario</strong>' +
            UI.featureBadge("bulk") +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
            '<button class="btn btn-outline btn-sm" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.25)" type="button" data-action="bulk-modal" data-op="price">Cambiar precios (€ / %)</button>' +
            '<button class="btn btn-outline btn-sm" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.25)" type="button" data-action="bulk-modal" data-op="status">Actualizar disponibilidad</button>' +
            '<button class="btn btn-outline btn-sm" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.25)" type="button" data-action="bulk-modal" data-op="publish">Publicar</button>' +
            '<button class="btn btn-outline btn-sm" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.25)" type="button" data-action="bulk-modal" data-op="unpublish">Despublicar</button>' +
            '<button class="btn btn-ghost btn-sm" style="color:#F5C3B0" type="button" data-action="clear-selection">Cancelar</button>' +
          '</div>' +
        '</div>'
      : "";

    const content =
      (selected.length >= 2 ? this.packageBanner("bulk") : "") +
      bulkBanner +
      '<div class="panel-card">' +
        '<div class="panel-card-head">' +
          '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;flex:1">' +
            '<input class="input" style="max-width:260px;min-height:38px" type="search" placeholder="Buscar por ref. HAB-001, calle o nombre..." value="' + UI.esc(f.q) + '" data-admin-filter="q">' +
            '<select class="select" style="width:auto;min-height:38px" data-admin-filter="status">' +
              '<option value="">Todos los estados</option>' +
              '<option value="available"' + (f.status === "available" ? " selected" : "") + '>Disponible ahora</option>' +
              '<option value="upcoming"' + (f.status === "upcoming" ? " selected" : "") + '>Próxima disponibilidad</option>' +
              '<option value="occupied"' + (f.status === "occupied" ? " selected" : "") + '>Ocupada</option>' +
            '</select>' +
            '<select class="select" style="width:auto;min-height:38px" data-admin-filter="area">' +
              '<option value="">Todos los barrios</option>' +
              ['Chamberí', 'Salamanca', 'Malasaña', 'Argüelles', 'Lavapiés'].map((b) =>
                '<option value="' + b + '"' + (f.area === b ? " selected" : "") + '>' + b + '</option>'
              ).join("") +
            '</select>' +
            '<select class="select" style="width:auto;min-height:38px" data-admin-filter="sort">' +
              '<option value="recent"' + (f.sort === "recent" ? " selected" : "") + '>Orden por referencia</option>' +
              '<option value="price-asc"' + (f.sort === "price-asc" ? " selected" : "") + '>Precio: menor a mayor</option>' +
              '<option value="price-desc"' + (f.sort === "price-desc" ? " selected" : "") + '>Precio: mayor a menor</option>' +
            '</select>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="select-demo-bulk">Seleccionar 3 para probar edición masiva</button>' +
          '</div>' +
        '</div>' +

        '<div class="table-wrap">' +
          '<table class="data-table">' +
            '<thead>' +
              '<tr>' +
                '<th style="width:36px"><input type="checkbox" data-action="toggle-select-all"' + (selected.length >= pageItems.length && pageItems.length > 0 ? " checked" : "") + ' aria-label="Seleccionar todas"></th>' +
                '<th>Foto</th>' +
                '<th>Referencia</th>' +
                '<th>Nombre comercial</th>' +
                '<th>Apartamento / Barrio</th>' +
                '<th>Precio/mes</th>' +
                '<th>Disponibilidad</th>' +
                '<th>Fecha libre</th>' +
                '<th>Publicación</th>' +
                '<th>Acciones</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              pageItems.map((r) => {
                const isChecked = selected.includes(r.id);
                return (
                  '<tr>' +
                    '<td><input type="checkbox" data-action="toggle-select-room" data-id="' + r.id + '"' + (isChecked ? " checked" : "") + ' aria-label="Seleccionar ' + r.id + '"></td>' +
                    '<td><img class="table-thumb" src="' + IMG[r.main] + '" alt="' + UI.esc(r.name) + '" width="48" height="36"></td>' +
                    '<td class="tabular"><strong>' + UI.esc(r.id) + '</strong></td>' +
                    '<td><strong class="od-truncate" style="max-width:220px">' + UI.esc(r.name) + '</strong></td>' +
                    '<td><span>' + UI.esc(r.apt) + '</span><span style="font-size:0.75rem;color:var(--text-muted);display:block">' + UI.esc(r.city) + ' · ' + UI.esc(r.area) + '</span></td>' +
                    '<td class="tabular"><strong>' + r.price + ' €</strong></td>' +
                    '<td>' + UI.statusBadge(r.status) + '</td>' +
                    '<td class="tabular">' + UI.dateShort(r.availableFrom) + '</td>' +
                    '<td>' + UI.publishBadge(r.published) + '</td>' +
                    '<td>' +
                      '<div style="display:flex;gap:6px">' +
                        '<button class="btn btn-outline btn-sm" type="button" data-action="open-room-form" data-id="' + r.id + '" title="Editar">' + UI.icon("edit") + 'Editar</button>' +
                        '<button class="icon-btn" type="button" data-action="duplicate-room" data-id="' + r.id + '" title="Duplicar habitación" aria-label="Duplicar">' + UI.icon("copy") + '</button>' +
                        '<button class="icon-btn" type="button" data-action="open-room" data-id="' + r.id + '" title="Ver en web pública" aria-label="Ver en web">' + UI.icon("eye") + '</button>' +
                      '</div>' +
                    '</td>' +
                  '</tr>'
                );
              }).join("") +
            '</tbody>' +
          '</table>' +
        '</div>' +

        '<div class="panel-card-head" style="border-top:1px solid var(--border-subtle);border-bottom:0">' +
          '<span style="font-size:0.84rem;color:var(--text-secondary)" class="tabular">Mostrando ' + pageItems.length + ' de ' + list.length + ' habitaciones precargadas (100 totales en cartera Avenew)</span>' +
          '<div style="display:flex;gap:6px">' +
            Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
              '<button type="button" class="btn ' + (p === page ? "btn-primary" : "btn-outline") + ' btn-sm tabular" data-action="admin-page" data-page="' + p + '">Pág. ' + p + '</button>'
            ).join("") +
          '</div>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Gestión de Habitaciones e Inventario",
      "Administra precios, fechas de salida, estado de publicación y acciones en lote.",
      content
    );
  },

  /* ========================================================================
     5. FORMULARIO CREAR / EDITAR HABITACIÓN (#admin-room-form)
     ======================================================================== */
  roomForm() {
    const id = Store.state.route.params.id;
    const existing = id ? Store.room(id) : null;
    const r = existing || {
      id: "HAB-0" + (Store.state.rooms.length + 1),
      name: "",
      apt: "Apt. Velázquez 42",
      city: "Madrid",
      area: "Salamanca",
      zone: "Goya",
      price: 650,
      deposit: 650,
      expenses: "incluidos",
      expensesNote: "Suministros incluidos (luz, agua, gas y WiFi)",
      minStay: 3,
      status: "available",
      availableFrom: isoInDays(0),
      published: true,
      size: 14,
      bath: "shared",
      exterior: true,
      desk: true,
      ac: true,
      furnished: true,
      wifi: true,
      heating: true,
      wardrobe: true,
      lock: true,
      main: "room1",
      description: "Habitación exterior completamente equipada, con cama doble, armario empotrado y zona de estudio."
    };

    const content =
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
        '<button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-route="admin-rooms">' + UI.icon("arrowLeft") + 'Volver al inventario</button>' +
        '<span class="badge is-neutral tabular">' + (existing ? "Editando " + r.id : "Nueva ficha · " + r.id) + '</span>' +
      '</div>' +

      '<form id="admin-room-editor" class="od-stack" style="--od-gap:20px" onsubmit="return false">' +
        '<input type="hidden" id="rf-id" value="' + UI.esc(r.id) + '">' +

        /* Bloque 1: Información General */
        '<div class="panel-card">' +
          '<div class="panel-card-head"><h3>1. Información General</h3><span class="badge is-neutral">Datos públicos</span></div>' +
          '<div class="panel-card-body od-stack" style="--od-gap:14px">' +
            '<div class="grid-3">' +
              UI.field({ id: "rf-name", label: "Nombre comercial de la habitación", required: true, value: r.name, placeholder: "Ej. Doble exterior con balcón a Velázquez" }) +
              UI.field({ id: "rf-ref", label: "Referencia interna", required: true, value: r.id }) +
              UI.field({
                id: "rf-apt",
                label: "Apartamento asociado",
                type: "select",
                options: Object.keys(APARTMENTS).map((k) => '<option value="' + UI.esc(k) + '"' + (r.apt === k ? " selected" : "") + '>' + UI.esc(k) + '</option>').join("")
              }) +
            '</div>' +
            '<div class="field">' +
              '<label for="rf-desc">Descripción comercial</label>' +
              '<textarea class="input" id="rf-desc" rows="3">' + UI.esc(r.description) + '</textarea>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* Bloque 2 & 3: Condiciones Económicas y Localización */
        '<div class="grid-2">' +
          '<div class="panel-card">' +
            '<div class="panel-card-head"><h3>2. Condiciones Económicas</h3></div>' +
            '<div class="panel-card-body grid-2">' +
              UI.field({ id: "rf-price", label: "Precio mensual (€)", type: "number", required: true, value: r.price }) +
              UI.field({ id: "rf-deposit", label: "Fianza (€)", type: "number", required: true, value: r.deposit }) +
              UI.field({
                id: "rf-expenses",
                label: "Gastos / Suministros",
                type: "select",
                options:
                  '<option value="incluidos"' + (r.expenses === "incluidos" ? " selected" : "") + '>Incluidos en el precio</option>' +
                  '<option value="fijos"' + (r.expenses === "fijos" ? " selected" : "") + '>Cuota fija mensual (45 €)</option>' +
                  '<option value="no"' + (r.expenses === "no" ? " selected" : "") + '>Segun consumo</option>'
              }) +
              UI.field({ id: "rf-minstay", label: "Estancia mínima (meses)", type: "number", value: r.minStay }) +
            '</div>' +
          '</div>' +

          '<div class="panel-card">' +
            '<div class="panel-card-head"><h3>3. Localización y Privacidad</h3></div>' +
            '<div class="panel-card-body grid-2">' +
              UI.field({
                id: "rf-city",
                label: "Ciudad",
                type: "select",
                options: '<option value="Madrid">Madrid</option><option value="Valencia">Valencia</option><option value="Málaga">Málaga</option>'
              }) +
              UI.field({
                id: "rf-area",
                label: "Barrio",
                type: "select",
                options: ['Chamberí', 'Salamanca', 'Malasaña', 'Argüelles', 'Lavapiés', 'Tetuán'].map((b) =>
                  '<option value="' + b + '"' + (r.area === b ? " selected" : "") + '>' + b + '</option>'
                ).join("")
              }) +
              UI.field({ id: "rf-zone", label: "Subzona / Metro", value: r.zone || "Goya" }) +
              UI.field({ id: "rf-size", label: "Superficie privada (m²)", type: "number", value: r.size || 14 }) +
            '</div>' +
          '</div>' +
        '</div>' +

        /* Bloque 4 & 5: Disponibilidad y Fotografías */
        '<div class="grid-2">' +
          '<div class="panel-card">' +
            '<div class="panel-card-head"><h3>4. Estado de Disponibilidad</h3></div>' +
            '<div class="panel-card-body grid-2">' +
              UI.field({
                id: "rf-status",
                label: "Estado actual",
                type: "select",
                options:
                  '<option value="available"' + (r.status === "available" ? " selected" : "") + '>Disponible ahora (Verde)</option>' +
                  '<option value="upcoming"' + (r.status === "upcoming" ? " selected" : "") + '>Próxima disponibilidad (Naranja)</option>' +
                  '<option value="occupied"' + (r.status === "occupied" ? " selected" : "") + '>Ocupada (Gris)</option>'
              }) +
              UI.field({ id: "rf-date", label: "Disponible desde fecha", type: "date", value: r.availableFrom }) +
            '</div>' +
          '</div>' +

          '<div class="panel-card">' +
            '<div class="panel-card-head"><h3>5. Fotografías y Portada</h3></div>' +
            '<div class="panel-card-body">' +
              '<div class="photo-picker-grid">' +
                ['room1', 'room2', 'room3', 'room5'].map((imgKey) =>
                  '<label style="cursor:pointer;border:2px solid ' + (r.main === imgKey ? "var(--brand-primary)" : "var(--border-subtle)") + ';border-radius:var(--radius-sm);overflow:hidden;padding:4px;display:grid;gap:4px">' +
                    '<img src="' + IMG[imgKey] + '" alt="Miniatura" style="aspect-ratio:4/3;object-fit:cover;border-radius:4px">' +
                    '<span style="font-size:0.72rem;display:flex;align-items:center;gap:4px"><input type="radio" name="rf-main" value="' + imgKey + '"' + (r.main === imgKey ? " checked" : "") + '> Portada</span>' +
                  '</label>'
                ).join("") +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* Bloque 6 & 7: Equipamiento y Publicación */
        '<div class="panel-card">' +
          '<div class="panel-card-head"><h3>6. Equipamiento de la Habitación y Piso</h3></div>' +
          '<div class="panel-card-body" style="display:flex;flex-wrap:wrap;gap:18px">' +
            '<label class="check-row"><input type="checkbox" id="rf-exterior"' + (r.exterior ? " checked" : "") + '> Exterior a calle/patio manzana</label>' +
            '<label class="check-row"><input type="checkbox" id="rf-bath"' + (r.bath === "private" ? " checked" : "") + '> Baño privado en suite</label>' +
            '<label class="check-row"><input type="checkbox" id="rf-desk"' + (r.desk ? " checked" : "") + '> Escritorio ergonómico</label>' +
            '<label class="check-row"><input type="checkbox" id="rf-ac"' + (r.ac ? " checked" : "") + '> Aire acondicionado</label>' +
            '<label class="check-row"><input type="checkbox" checked disabled> WiFi Fibra 1 Gb</label>' +
            '<label class="check-row"><input type="checkbox" checked disabled> Cerradura propia</label>' +
          '</div>' +
        '</div>' +

        '<div class="panel-card">' +
          '<div class="panel-card-head">' +
            '<div>' +
              '<h3>7. Estado de Publicación</h3>' +
              '<p style="margin:2px 0 0;font-size:0.82rem;color:var(--text-secondary)">Al guardar se actualiza al instante el catálogo público y el calendario.</p>' +
            '</div>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
              '<button class="btn btn-outline" type="button" data-action="save-room-form" data-publish="false">Guardar como Borrador</button>' +
              '<button class="btn btn-primary" type="button" data-action="save-room-form" data-publish="true">' + UI.icon("check") + 'Guardar y Publicar en Web</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</form>';

    return this.shell(
      existing ? "Editar Habitación · " + r.id : "Crear Nueva Habitación",
      "Ficha completa conectada en tiempo real con la web pública.",
      content
    );
  },

  /* ========================================================================
     6. CALENDARIO Y TIMELINE DE DISPONIBILIDAD (#admin-calendar)
     ======================================================================== */
  calendar() {
    const horizon = Store.state.calendarHorizon || 30;
    const aptNames = Store.apartmentNames();

    const content =
      '<div class="panel-card">' +
        '<div class="panel-card-head">' +
          '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
            '<h3>Timeline / Gantt de Ocupación y Próximas Vacantes</h3>' +
            UI.featureBadge("calendar") +
          '</div>' +
          '<div class="tabs-bar" style="border:0;padding:0">' +
            [
              { h: 7, label: "Próximos 7 días" },
              { h: 30, label: "30 días" },
              { h: 60, label: "60 días" },
              { h: 90, label: "90 días" }
            ].map((item) =>
              '<button type="button" class="tab-pill' + (horizon === item.h ? " is-active" : "") + '" data-action="set-calendar-horizon" data-h="' + item.h + '">' +
                item.label +
              '</button>'
            ).join("") +
          '</div>' +
        '</div>' +

        '<div style="padding:12px 20px;background:#F9F9F6;border-bottom:1px solid var(--border-subtle);display:flex;gap:20px;flex-wrap:wrap;font-size:0.8rem">' +
          '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:var(--status-ok-bg);border:1px solid var(--status-ok-fg)"></span> Libre hoy (Verde)</span>' +
          '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:var(--status-soon-bg);border:1px solid var(--status-soon-fg)"></span> Se libera en el horizonte seleccionado (Naranja)</span>' +
          '<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:#E2E6E9"></span> Contrato vigente / Ocupada (Gris)</span>' +
          '<span style="margin-left:auto;color:var(--text-muted)">Haz clic en cualquier habitación para ajustar su fecha de liberación</span>' +
        '</div>' +

        '<div>' +
          aptNames.map((apt) => {
            const aptRooms = Store.state.rooms.filter((r) => r.apt === apt);
            return (
              '<div>' +
                '<div style="padding:10px 16px;background:var(--bg-muted);font-weight:800;font-size:0.84rem;color:var(--brand-primary);border-bottom:1px solid var(--border-subtle)">' +
                  UI.icon("building") + ' ' + UI.esc(apt) + ' (' + aptRooms.length + ' habitaciones)' +
                '</div>' +
                aptRooms.map((r) => {
                  const days = Math.max(0, UI.daysUntil(r.availableFrom) || 0);
                  let barHtml = "";
                  if (r.status === "available") {
                    barHtml = '<div class="gantt-seg is-ok" style="width:100%">Disponible ahora · Entrada inmediata</div>';
                  } else if (r.status === "upcoming") {
                    const occPct = Math.min(82, Math.max(18, Math.round((days / horizon) * 100)));
                    barHtml =
                      '<div class="gantt-seg is-off" style="width:' + occPct + '%">Ocupada (' + days + 'd)</div>' +
                      '<div class="gantt-seg is-soon" style="width:' + (100 - occPct) + '%">Libre desde ' + UI.dateShort(r.availableFrom) + '</div>';
                  } else {
                    barHtml = '<div class="gantt-seg is-off" style="width:100%">Contrato activo hasta ' + UI.dateShort(r.availableFrom) + '</div>';
                  }
                  return (
                    '<div class="gantt-row">' +
                      '<div style="min-width:0">' +
                        '<strong style="font-size:0.86rem" class="tabular">' + UI.esc(r.id) + ' · ' + r.price + ' €</strong>' +
                        '<span class="od-truncate" style="font-size:0.78rem;color:var(--text-secondary)">' + UI.esc(r.name) + '</span>' +
                      '</div>' +
                      '<div class="gantt-track">' + barHtml + '</div>' +
                      '<div style="text-align:right">' +
                        '<button class="btn btn-outline btn-sm" type="button" data-action="open-calendar-drawer" data-id="' + r.id + '">Ajustar fecha</button>' +
                      '</div>' +
                    '</div>'
                  );
                }).join("") +
              '</div>'
            );
          }).join("") +
        '</div>' +
      '</div>';

    return this.shell(
      "Calendario y Timeline de Disponibilidad",
      "Control visual de rotación de habitaciones a 7, 30, 60 y 90 días.",
      content
    );
  },

  /* ========================================================================
     6B. INBOX OMNICANAL Y CRM (#admin-inbox — Paquete IMPROVED+)
     ======================================================================== */
  inbox() {
    const filter = Store.state.inboxFilter || "all";
    const q = (Store.state.inboxSearch || "").toLowerCase();
    const channel = Store.state.inboxChannel || "whatsapp";
    const mobileView = Store.state.inboxMobileView || "chat";

    const filteredLeads = Store.state.leads.filter((l) => {
      if (filter === "whatsapp" && l.lastChannel !== "whatsapp") return false;
      if (filter === "email" && l.lastChannel !== "email") return false;
      if (filter === "visita" && l.status !== "visita") return false;
      if (q) {
        const room = Store.room(l.roomId);
        const hay = (l.name + " " + l.email + " " + (l.roomId || "") + " " + (room ? room.name + " " + room.area : "")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const active = Store.activeLead() || filteredLeads[0] || Store.state.leads[0];
    const activeRoom = active ? Store.room(active.roomId) : null;
    const messages = active && Array.isArray(active.messages) ? active.messages : [];

    const content =
      this.packageBanner("inbox") +

      /* Layout de 3 paneles del Inbox Omnicanal */
      '<div class="inbox-workspace' + (mobileView === "chat" ? " is-mobile-chat" : " is-mobile-list") + '">' +

        /* PANEL IZQUIERDO: Lista de Leads / Conversaciones activas */
        '<aside class="inbox-left-panel" aria-label="Lista de conversaciones activas">' +
          '<div class="inbox-left-head">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
              '<strong>Conversaciones (' + filteredLeads.length + ')</strong>' +
              UI.featureBadge("inbox") +
            '</div>' +
            '<input class="input" type="search" id="inbox-search-input" placeholder="Buscar por inquilino o habitación..." value="' + UI.esc(Store.state.inboxSearch || "") + '" data-action="inbox-search">' +
            '<div class="inbox-filter-pills" role="tablist" aria-label="Filtrar por canal">' +
              '<button type="button" class="inbox-pill' + (filter === "all" ? " is-active" : "") + '" data-action="set-inbox-filter" data-filter="all">Todos</button>' +
              '<button type="button" class="inbox-pill' + (filter === "whatsapp" ? " is-active" : "") + '" data-action="set-inbox-filter" data-filter="whatsapp"><span class="wa-dot" aria-hidden="true"></span>WhatsApp</button>' +
              '<button type="button" class="inbox-pill' + (filter === "email" ? " is-active" : "") + '" data-action="set-inbox-filter" data-filter="email">' + UI.icon("mail") + 'Email</button>' +
              '<button type="button" class="inbox-pill' + (filter === "visita" ? " is-active" : "") + '" data-action="set-inbox-filter" data-filter="visita">Con cita</button>' +
            '</div>' +
          '</div>' +

          '<div class="inbox-thread-list" role="list">' +
            (filteredLeads.length === 0
              ? '<div style="padding:28px 16px;text-align:center;color:var(--text-muted);font-size:0.86rem">No hay conversaciones con este filtro.</div>'
              : filteredLeads.map((l) => {
                  const rm = Store.room(l.roomId);
                  const isCurrent = active && active.id === l.id;
                  const lastMsg = Array.isArray(l.messages) && l.messages.length
                    ? l.messages[l.messages.length - 1]
                    : { text: l.message, time: "Reciente" };
                  const isWa = l.lastChannel === "whatsapp";
                  const chIndicator = isWa
                    ? '<span class="ch-tag is-wa" title="Último mensaje por WhatsApp"><span class="wa-dot" aria-hidden="true"></span>WhatsApp</span>'
                    : '<span class="ch-tag is-mail" title="Último mensaje por Email">' + UI.icon("mail") + ' Email</span>';
                  return (
                    '<button type="button" class="inbox-thread-item' + (isCurrent ? " is-active" : "") + (l.unread ? " is-unread" : "") + '" data-action="select-inbox-lead" data-id="' + l.id + '" role="listitem">' +
                      '<div class="inbox-thread-top">' +
                        '<div style="display:flex;align-items:center;gap:6px;min-width:0">' +
                          (l.unread ? '<span class="unread-dot" aria-label="No leído"></span>' : "") +
                          '<strong class="od-truncate" style="font-size:0.9rem">' + UI.esc(l.name) + '</strong>' +
                        '</div>' +
                        chIndicator +
                      '</div>' +
                      '<div class="inbox-thread-room tabular">' +
                        UI.icon("bed") + ' ' + (rm ? UI.esc(rm.id + " · " + rm.area + " (" + rm.price + " €)") : "Consulta general") +
                      '</div>' +
                      '<p class="od-clamp-2 inbox-thread-preview">' + UI.esc(lastMsg.text) + '</p>' +
                      '<div class="inbox-thread-foot">' +
                        '<span class="badge ' + (l.status === "visita" ? "is-ok" : l.status === "nueva" ? "is-soon" : "is-neutral") + '" style="font-size:0.68rem;padding:2px 7px">' + UI.esc(LEAD_STATUS[l.status] || l.status) + '</span>' +
                        '<span class="tabular" style="font-size:0.72rem;color:var(--text-muted)">' + UI.esc(lastMsg.time || "") + '</span>' +
                      '</div>' +
                    '</button>'
                  );
                }).join("")) +
          '</div>' +
        '</aside>' +

        /* PANEL CENTRAL: Historial Unificado (WhatsApp + Email + Logs) y Compositor */
        (active
          ? '<section class="inbox-center-panel" aria-label="Conversación unificada con ' + UI.esc(active.name) + '">' +
              '<header class="inbox-chat-head">' +
                '<div style="display:flex;align-items:center;gap:10px;min-width:0">' +
                  '<button type="button" class="btn btn-outline btn-sm inbox-mobile-back" data-action="inbox-back-to-list">' +
                    UI.icon("arrowLeft") + 'Conversaciones' +
                  '</button>' +
                  '<span class="admin-avatar" style="background:var(--brand-primary)">' + UI.esc(active.name.slice(0, 2).toUpperCase()) + '</span>' +
                  '<div style="min-width:0">' +
                    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                      '<strong style="font-size:0.98rem">' + UI.esc(active.name) + '</strong>' +
                      '<span class="badge is-ok" style="font-size:0.7rem"><span class="dot"></span>Ventana 24h Meta Cloud API activa</span>' +
                    '</div>' +
                    '<span class="od-truncate" style="font-size:0.78rem;color:var(--text-secondary)">' + UI.esc(active.phone || "Sin teléfono") + ' · ' + UI.esc(active.email) + '</span>' +
                  '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                  '<button type="button" class="btn btn-outline btn-sm" data-action="open-tenant-as-lead" data-id="' + active.id + '">' +
                    UI.icon("user") + 'Ver su portal «Mi espacio»' +
                  '</button>' +
                  '<button type="button" class="btn btn-accent btn-sm" data-action="open-admin-schedule" data-id="' + active.id + '">' +
                    UI.icon("calendar") + 'Agendar cita' +
                  '</button>' +
                '</div>' +
              '</header>' +

              /* Mensajes del Hilo Unificado */
              '<div class="inbox-messages-scroll" id="inbox-messages-scroll">' +
                '<div class="inbox-date-divider"><span>Historial unificado multicanal (Email + WhatsApp Business)</span></div>' +
                messages.map((m) => {
                  if (m.sender === "system") {
                    return (
                      '<div class="chat-sys-pill">' +
                        UI.icon("calendar") + ' <span>' + UI.esc(m.text) + '</span> · <span class="tabular">' + UI.esc(m.time) + '</span>' +
                      '</div>'
                    );
                  }
                  const isAdmin = m.sender === "admin";
                  const isWa = m.channel === "whatsapp";
                  const channelPill = isWa
                    ? '<span class="ch-tag is-wa"><span class="wa-dot" aria-hidden="true"></span>' + (isAdmin ? "Enviado por WhatsApp" : "Recibido por WhatsApp") + '</span>'
                    : '<span class="ch-tag is-mail">' + UI.icon("mail") + ' ' + (isAdmin ? "Enviado por Email" : "Recibido por Email") + '</span>';

                  return (
                    '<div class="chat-row ' + (isAdmin ? "is-outgoing" : "is-incoming") + '">' +
                      '<div class="chat-bubble ' + (isAdmin ? "is-admin" : isWa ? "is-tenant-wa" : "is-tenant-mail") + '">' +
                        '<div class="chat-bubble-meta">' +
                          '<strong>' + (isAdmin ? "Gestor HABITIA" : UI.esc(active.name)) + '</strong>' +
                          channelPill +
                        '</div>' +
                        '<p class="chat-bubble-text">' + UI.esc(m.text) + '</p>' +
                        '<span class="chat-bubble-time tabular">' + UI.esc(m.time) + (isAdmin ? " · ✓✓ Entregado" : "") + '</span>' +
                      '</div>' +
                    '</div>'
                  );
                }).join("") +
              '</div>' +

              /* Compositor Inferior con Toggle de Canal (WhatsApp / Email) */
              '<footer class="inbox-composer">' +
                '<div class="inbox-composer-bar">' +
                  '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                    '<span style="font-size:0.76rem;font-weight:700;color:var(--text-secondary)">Canal de respuesta:</span>' +
                    '<div class="channel-toggle-group" role="group" aria-label="Seleccionar canal de envío">' +
                      '<button type="button" class="channel-toggle-btn' + (channel === "whatsapp" ? " is-active-wa" : "") + '" data-action="set-inbox-channel" data-channel="whatsapp">' +
                        '<span class="wa-dot" aria-hidden="true"></span>Responder por WhatsApp' +
                      '</button>' +
                      '<button type="button" class="channel-toggle-btn' + (channel === "email" ? " is-active-mail" : "") + '" data-action="set-inbox-channel" data-channel="email">' +
                        UI.icon("mail") + 'Responder por Email' +
                      '</button>' +
                    '</div>' +
                  '</div>' +
                  '<div class="inbox-quick-chips">' +
                    '<button type="button" class="quick-chip" data-action="insert-quick-reply" data-text="¡Hola ' + UI.esc(active.name.split(" ")[0]) + '! Te confirmamos la visita en ' + UI.esc(activeRoom ? activeRoom.apt : "el apartamento") + '. Te hemos actualizado la cita en Mi espacio HABITIA.">Plantilla: Confirmar visita</button>' +
                    '<button type="button" class="quick-chip" data-action="insert-quick-reply" data-text="Te acabamos de enviar tu enlace mágico a Mi espacio HABITIA para que consultes el estado de tu solicitud y documentación.">Plantilla: Enviar enlace mágico</button>' +
                  '</div>' +
                '</div>' +
                '<form class="inbox-composer-form" onsubmit="return false">' +
                  '<input class="input" id="inbox-composer-input" type="text" placeholder="' + (channel === "whatsapp" ? "Escribe un mensaje de WhatsApp para " + active.name + "..." : "Escribe un correo electrónico para " + active.name + "...") + '">' +
                  '<button class="btn ' + (channel === "whatsapp" ? "btn-wa" : "btn-primary") + '" type="button" data-action="send-inbox-message" data-id="' + active.id + '">' +
                    UI.icon("send") + (channel === "whatsapp" ? "Enviar WhatsApp" : "Enviar Email") +
                  '</button>' +
                '</form>' +
              '</footer>' +
            '</section>'
          : "") +

        /* PANEL DERECHO: Contexto del Lead, Estado, Habitación y Cita */
        (active
          ? '<aside class="inbox-right-panel" aria-label="Contexto y ficha CRM del candidato">' +
              '<div class="inbox-context-section">' +
                '<span class="eyebrow" style="margin-bottom:4px">Perfil del interesado</span>' +
                '<h3 style="margin:0 0 8px;font-size:1.05rem">' + UI.esc(active.name) + '</h3>' +
                '<div style="font-size:0.82rem;color:var(--text-secondary);display:grid;gap:5px">' +
                  '<span>' + UI.icon("mail") + ' ' + UI.esc(active.email) + '</span>' +
                  '<span>' + UI.icon("phone") + ' ' + UI.esc(active.phone || "+34 600 000 000") + '</span>' +
                  '<span>' + UI.icon("calendar") + ' Entrada deseada: <strong class="tabular">' + UI.dateShort(active.date) + '</strong></span>' +
                '</div>' +
              '</div>' +

              '<div class="inbox-context-section">' +
                '<div class="field">' +
                  '<label for="inbox-lead-status">Estado comercial del lead</label>' +
                  '<select class="select" id="inbox-lead-status" data-action="change-lead-status" data-id="' + active.id + '">' +
                    Object.keys(LEAD_STATUS).map((k) =>
                      '<option value="' + k + '"' + (active.status === k ? " selected" : "") + '>' + LEAD_STATUS[k] + '</option>'
                    ).join("") +
                  '</select>' +
                '</div>' +
              '</div>' +

              (activeRoom
                ? '<div class="inbox-context-section">' +
                    '<span class="eyebrow" style="margin-bottom:6px">Habitación consultada</span>' +
                    '<div class="inbox-room-box">' +
                      '<img src="' + IMG[activeRoom.main] + '" alt="' + UI.esc(activeRoom.name) + '" width="88" height="66">' +
                      '<div style="min-width:0;flex:1">' +
                        '<div style="display:flex;align-items:center;justify-content:space-between;gap:4px">' +
                          '<strong class="tabular" style="font-size:0.82rem;color:var(--brand-primary)">' + UI.esc(activeRoom.id) + '</strong>' +
                          '<strong class="tabular" style="font-size:0.9rem">' + activeRoom.price + ' €/mes</strong>' +
                        '</div>' +
                        '<strong class="od-truncate" style="font-size:0.84rem">' + UI.esc(activeRoom.name) + '</strong>' +
                        '<span style="font-size:0.75rem;color:var(--text-muted)">' + UI.esc(activeRoom.apt) + ' · ' + UI.esc(activeRoom.area) + '</span>' +
                      '</div>' +
                    '</div>' +
                    '<button class="btn btn-outline btn-sm" style="width:100%;margin-top:8px" type="button" data-action="open-room" data-id="' + activeRoom.id + '">' +
                      UI.icon("eye") + 'Ver ficha pública de ' + UI.esc(activeRoom.id) +
                    '</button>' +
                  '</div>'
                : "") +

              '<div class="inbox-context-section">' +
                '<span class="eyebrow" style="margin-bottom:6px">Gestión de visita</span>' +
                '<div style="background:var(--bg-primary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:10px 12px;margin-bottom:10px">' +
                  '<span style="font-size:0.74rem;color:var(--text-muted);display:block">Cita programada:</span>' +
                  '<strong class="tabular" style="font-size:0.9rem;color:var(--brand-primary)">' + UI.esc(active.appointment || "Sin cita agendada") + '</strong>' +
                '</div>' +
                '<button class="btn btn-primary btn-sm" style="width:100%" type="button" data-action="open-admin-schedule" data-id="' + active.id + '">' +
                  UI.icon("calendar") + 'Agendar o modificar cita' +
                '</button>' +
              '</div>' +

              '<div class="inbox-context-section" style="border-bottom:0">' +
                '<div class="field">' +
                  '<label for="inbox-lead-notes">Notas internas del gestor</label>' +
                  '<textarea class="input" id="inbox-lead-notes" rows="3" placeholder="Añade notas sobre solvencia, estancia o preferencias...">' + UI.esc(active.notes || "") + '</textarea>' +
                  '<button class="btn btn-outline btn-sm" type="button" data-action="save-inbox-notes" data-id="' + active.id + '">Guardar nota</button>' +
                '</div>' +
              '</div>' +
            '</aside>'
          : "") +
      '</div>' +

      /* Caja informativa técnica de integración Meta Cloud API */
      '<div class="tech-note-box">' +
        '<span class="tech-note-icon">' + UI.icon("info") + '</span>' +
        '<div>' +
          '<strong>Nota Técnica de Integración (WhatsApp Business Cloud API):</strong> ' +
          '<span>' + UI.esc(WHATSAPP_TECH_NOTE) + '</span>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Inbox Omnicanal Unificado (WhatsApp + Email)",
      "Centraliza las consultas de la web, responde por WhatsApp Business o Email y sincroniza citas con Mi espacio HABITIA.",
      content,
      '<button class="btn btn-outline btn-sm" type="button" data-action="nav" data-route="tenant-portal">' + UI.icon("user") + 'Abrir Portal de Laura («Mi espacio»)</button>'
    );
  },

  /* ========================================================================
     7. GESTIÓN DE CONSULTAS / LEADS (#admin-inquiries)
     ======================================================================== */
  inquiries() {
    const filter = Store.state.leadFilter || "all";
    const leads = Store.state.leads.filter((l) => filter === "all" || l.status === filter);

    const content =
      '<div class="panel-card">' +
        '<div class="panel-card-head">' +
          '<div class="tabs-bar" style="border:0;padding:0">' +
            [
              { id: "all", label: "Todas (" + Store.state.leads.length + ")" },
              { id: "nueva", label: "Nuevas" },
              { id: "contactada", label: "Contactadas" },
              { id: "visita", label: "Visita programada" },
              { id: "cerrada", label: "Cerradas" },
              { id: "descartada", label: "No interesado" }
            ].map((t) =>
              '<button type="button" class="tab-pill' + (filter === t.id ? " is-active" : "") + '" data-action="set-lead-filter" data-status="' + t.id + '">' +
                t.label +
              '</button>'
            ).join("") +
          '</div>' +
          UI.featureBadge("crm") +
        '</div>' +

        '<div class="table-wrap">' +
          '<table class="data-table">' +
            '<thead><tr><th>ID</th><th>Interesado</th><th>Habitación solicitada</th><th>Entrada deseada</th><th>Mensaje</th><th>Estado</th><th>Acción</th></tr></thead>' +
            '<tbody>' +
              leads.map((l) => {
                const room = Store.room(l.roomId);
                const badgeCls = l.status === "nueva" ? "is-soon" : l.status === "cerrada" ? "is-ok" : l.status === "descartada" ? "is-off" : "is-neutral";
                return (
                  '<tr>' +
                    '<td class="tabular"><strong>' + UI.esc(l.id) + '</strong></td>' +
                    '<td><strong>' + UI.esc(l.name) + '</strong><span style="display:block;font-size:0.76rem;color:var(--text-muted)">' + UI.esc(l.email) + '</span></td>' +
                    '<td>' + (room ? '<strong class="tabular">' + UI.esc(room.id) + '</strong> · ' + UI.esc(room.area) : "Consulta general") + '</td>' +
                    '<td class="tabular">' + UI.dateShort(l.date) + '</td>' +
                    '<td><span class="od-clamp-2" style="max-width:280px;font-size:0.82rem;color:var(--text-secondary)">' + UI.esc(l.message) + '</span></td>' +
                    '<td><span class="badge ' + badgeCls + '">' + UI.esc(LEAD_STATUS[l.status] || l.status) + '</span></td>' +
                    '<td><button class="btn btn-outline btn-sm" type="button" data-action="open-lead-drawer" data-id="' + l.id + '">Abrir ficha CRM</button></td>' +
                  '</tr>'
                );
              }).join("") +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Gestión de Consultas (CRM Leads)",
      "Solicitudes recibidas en tiempo real desde las fichas públicas de habitación.",
      content
    );
  },

  /* ========================================================================
     8. IMPORTADOR DE EXCEL CON VALIDACIÓN (#admin-import)
     ======================================================================== */
  importExcel() {
    const run = Store.state.importRun;
    const sampleRows = [
      { row: 2, ref: "HAB-001", apt: "Apt. Velázquez 42", price: "720 €", date: isoInDays(0), state: "ok", msg: "Válido · Listo para actualizar precio y estado" },
      { row: 5, ref: "HAB-005", apt: "Apt. Santa Engracia 108", price: "610 €", date: isoInDays(7), state: "ok", msg: "Válido · Fecha de próxima liberación verificada" },
      { row: 9, ref: "HAB-042", apt: "Apt. Fuencarral 64", price: "495 €", date: isoInDays(15), state: "warn", msg: "Advertencia: Precio 15% inferior a la media del piso — revisar" },
      { row: 14, ref: "HAB-089", apt: "Apt. Colón 18", price: "—", date: "32/13/2026", state: "err", msg: "Error en Fila 14 (HAB-089): Fecha de disponibilidad inválida y precio vacío" },
      { row: 19, ref: "HAB-094", apt: "Apt. Atocha 85", price: "680 €", date: isoInDays(30), state: "ok", msg: "Válido · Nueva habitación lista para publicar" }
    ];

    const content =
      /* Paso 1: Carga */
      '<div class="panel-card">' +
        '<div class="panel-card-head">' +
          '<div>' +
            '<h3>Paso 1 · Carga de archivo maestro Excel (.xlsx)</h3>' +
            '<p style="margin:2px 0 0;font-size:0.82rem;color:var(--text-secondary)">Sincroniza las 100 habitaciones de Avenew desde la plantilla oficial sin editar una por una.</p>' +
          '</div>' +
          '<button class="btn btn-outline btn-sm" type="button" data-action="download-template">' + UI.icon("download") + 'Descargar plantilla oficial (.xlsx)</button>' +
        '</div>' +
        '<div class="panel-card-body">' +
          '<div style="border:2px dashed var(--border-strong);border-radius:var(--radius-lg);padding:32px;text-align:center;background:var(--bg-primary);display:grid;justify-items:center;gap:12px">' +
            '<span class="empty-icon">' + UI.icon("upload") + '</span>' +
            '<div>' +
              '<strong style="font-size:1rem;display:block">Arrastra y suelta tu archivo .xlsx aquí</strong>' +
              '<span style="font-size:0.84rem;color:var(--text-muted)">Columnas validadas: Referencia, Apartamento, Precio, Suministros, Estado y Fecha de liberación</span>' +
            '</div>' +
            '<button class="btn btn-primary" type="button" data-action="simulate-excel-upload">' + UI.icon("file") + 'Simular subida de archivo Excel con 100 habitaciones</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* Paso 2 y Paso 3 (visibles al simular o por defecto para demostración inmediata) */
      '<div class="panel-card">' +
        '<div class="panel-card-head">' +
          '<h3>Paso 2 · Previsualización y Semáforo de Validación (' + (run ? "inventario_noviembre_avenew.xlsx" : "Vista previa lista") + ')</h3>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<span class="badge is-ok tabular">88 Válidos</span>' +
            '<span class="badge is-soon tabular">9 Advertencias</span>' +
            '<span class="badge is-err tabular">3 Errores omitidos</span>' +
          '</div>' +
        '</div>' +
        '<div class="table-wrap">' +
          '<table class="data-table">' +
            '<thead><tr><th>Fila</th><th>Referencia</th><th>Apartamento</th><th>Precio leído</th><th>Fecha leída</th><th>Validación</th><th>Diagnóstico del validador</th></tr></thead>' +
            '<tbody>' +
              sampleRows.map((row) => {
                const badge = row.state === "ok"
                  ? '<span class="badge is-ok"><span class="dot"></span>Válido</span>'
                  : row.state === "warn"
                    ? '<span class="badge is-soon"><span class="dot"></span>Advertencia</span>'
                    : '<span class="badge is-err">Error</span>';
                return (
                  '<tr>' +
                    '<td class="tabular">#' + row.row + '</td>' +
                    '<td class="tabular"><strong>' + row.ref + '</strong></td>' +
                    '<td>' + row.apt + '</td>' +
                    '<td class="tabular">' + row.price + '</td>' +
                    '<td class="tabular">' + row.date + '</td>' +
                    '<td>' + badge + '</td>' +
                    '<td style="font-size:0.82rem">' + UI.esc(row.msg) + '</td>' +
                  '</tr>'
                );
              }).join("") +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="panel-card-body" style="border-top:1px solid var(--border-subtle);background:#F9F9F6;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
          '<div style="display:flex;gap:20px;flex-wrap:wrap;font-size:0.86rem">' +
            '<span><strong>88</strong> registros válidos</span>' +
            '<span><strong>72</strong> actualizaciones de precio/fecha</span>' +
            '<span><strong>16</strong> nuevas habitaciones</span>' +
            '<span style="color:var(--status-err-fg)"><strong>3</strong> errores omitidos con log</span>' +
          '</div>' +
          '<button class="btn btn-primary" type="button" data-action="confirm-excel-import">' + UI.icon("check") + 'Confirmar e importar inventario</button>' +
        '</div>' +
      '</div>' +

      /* Historial de Importaciones */
      '<div class="panel-card">' +
        '<div class="panel-card-head"><h3>Historial de Importaciones</h3></div>' +
        '<div class="table-wrap">' +
          '<table class="data-table">' +
            '<thead><tr><th>ID</th><th>Fecha y hora</th><th>Archivo</th><th>Usuario</th><th>Procesados</th><th>Válidos / Errores</th><th>Estado</th><th>Log</th></tr></thead>' +
            '<tbody>' +
              Store.state.imports.map((imp) =>
                '<tr>' +
                  '<td class="tabular"><strong>' + UI.esc(imp.id) + '</strong></td>' +
                  '<td class="tabular">' + UI.esc(imp.date) + '</td>' +
                  '<td><strong>' + UI.esc(imp.file) + '</strong></td>' +
                  '<td>' + UI.esc(imp.user) + '</td>' +
                  '<td class="tabular">' + imp.processed + ' habs.</td>' +
                  '<td class="tabular">' + imp.ok + ' ok · ' + imp.errors + ' err.</td>' +
                  '<td><span class="badge is-ok">' + UI.esc(imp.status) + '</span></td>' +
                  '<td><button class="btn btn-ghost btn-sm" type="button" data-action="download-log" data-id="' + imp.id + '">' + UI.icon("download") + 'Descargar log</button></td>' +
                '</tr>'
              ).join("") +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Importador de Inventario Excel",
      "Validador automático con previsualización, semáforo de errores e historial auditable.",
      content
    );
  },

  /* ========================================================================
     9. SUSCRIPTORES Y CONFIGURACIÓN DE NOTIFICACIONES (#admin-subscribers)
     ======================================================================== */
  subscribers() {
    const subs = Store.state.subscribers;
    const activeCount = subs.filter((s) => s.active).length;

    const content =
      '<div class="grid-3">' +
        '<div class="kpi-card"><span class="kpi-label">Suscriptores activos</span><strong class="kpi-value tabular">' + activeCount + '</strong><span class="kpi-sub">Buscando habitación en Madrid</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Bajas / Inactivos</span><strong class="kpi-value tabular">' + (subs.length - activeCount) + '</strong><span class="kpi-sub">Ya alquilaron habitación</span></div>' +
        '<div class="kpi-card"><span class="kpi-label">Altas de este mes</span><strong class="kpi-value tabular">+19</strong><span class="kpi-sub">Captación orgánica sin portales</span></div>' +
      '</div>' +

      '<div class="grid-2 grid-2-asym" style="align-items:start">' +
        '<div class="panel-card">' +
          '<div class="panel-card-head"><h3>Base de datos de alertas de disponibilidad</h3>' + UI.featureBadge("subscribers") + '</div>' +
          '<div class="table-wrap">' +
            '<table class="data-table">' +
              '<thead><tr><th>ID</th><th>Correo electrónico</th><th>Ciudad / Barrio</th><th>Presupuesto máx.</th><th>Fecha alta</th><th>Estado</th></tr></thead>' +
              '<tbody>' +
                subs.map((s) =>
                  '<tr>' +
                    '<td class="tabular"><strong>' + UI.esc(s.id) + '</strong></td>' +
                    '<td><strong>' + UI.esc(s.email) + '</strong></td>' +
                    '<td>' + UI.esc(s.city) + ' · ' + UI.esc(s.area) + '</td>' +
                    '<td class="tabular"><strong>' + s.budget + ' €/mes</strong></td>' +
                    '<td class="tabular">' + UI.dateShort(s.date) + '</td>' +
                    '<td>' + (s.active ? '<span class="badge is-ok">Activo</span>' : '<span class="badge is-off">Inactivo</span>') + '</td>' +
                  '</tr>'
                ).join("") +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +

        '<div class="panel-card">' +
          '<div class="panel-card-head"><h3>Reglas de Envío Automático</h3></div>' +
          '<div class="panel-card-body od-stack" style="--od-gap:16px">' +
            UI.switchControl("rule-instant", true, "Aviso inmediato cuando una habitación pasa a Disponible") +
            UI.switchControl("rule-15days", true, "Aviso de próxima disponibilidad (15 días antes de liberación)") +
            UI.switchControl("rule-daily-admin", true, "Resumen diario de nuevas consultas para administración") +
            UI.switchControl("rule-weekly-subs", false, "Resumen semanal de habitaciones destacadas para suscriptores") +
            '<div style="padding-top:10px;border-top:1px solid var(--border-subtle)">' +
              '<button class="btn btn-primary btn-sm" type="button" data-action="save-notification-rules">Guardar reglas de notificación</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Suscriptores y Alertas Automáticas",
      "Inquilinos registrados esperando disponibilidad por barrio y presupuesto.",
      content
    );
  },

  /* ========================================================================
     10. GESTIÓN DE USUARIOS, ROLES Y CONFIGURACIÓN (#admin-users, #admin-settings)
     ======================================================================== */
  users() {
    const limit = Store.adminLimit();
    const users = Store.state.users;

    const content =
      '<div class="panel-card">' +
        '<div class="panel-card-head">' +
          '<div>' +
            '<h3>Equipo de Administración (' + users.length + ' de ' + limit + ' licencias en paquete ' + Store.pkgName() + ')</h3>' +
            '<p style="margin:2px 0 0;font-size:0.82rem;color:var(--text-secondary)">Límite por paquete: 1 en Essential · 3 en Improved · 5 en Complete.</p>' +
          '</div>' +
          '<button class="btn btn-primary btn-sm" type="button" data-action="open-user-modal"' + (users.length >= limit ? " disabled" : "") + '>+ Invitar usuario</button>' +
        '</div>' +
        '<div class="table-wrap">' +
          '<table class="data-table">' +
            '<thead><tr><th>Nombre</th><th>Email</th><th>Rol asignado</th><th>Último acceso</th><th>Estado</th></tr></thead>' +
            '<tbody>' +
              users.map((u) =>
                '<tr>' +
                  '<td><strong>' + UI.esc(u.name) + '</strong></td>' +
                  '<td>' + UI.esc(u.email) + '</td>' +
                  '<td><span class="badge is-neutral">' + UI.esc(u.role) + '</span></td>' +
                  '<td class="tabular">' + UI.esc(u.lastAccess) + '</td>' +
                  '<td><span class="badge is-ok">Activo</span></td>' +
                '</tr>'
              ).join("") +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +

      '<div class="panel-card">' +
        '<div class="panel-card-head"><h3>Matriz de Permisos por Rol</h3></div>' +
        '<div class="table-wrap">' +
          '<table class="data-table">' +
            '<thead><tr><th>Módulo / Acción</th><th>Superadministrador</th><th>Administrador Comercial</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>Crear, editar y publicar habitaciones</td><td>✓ Completo</td><td>✓ Completo</td></tr>' +
              '<tr><td>Edición masiva de precios y estados</td><td>✓ Completo</td><td>✓ Completo</td></tr>' +
              '<tr><td>Gestión de consultas (CRM Leads)</td><td>✓ Completo</td><td>✓ Completo</td></tr>' +
              '<tr><td>Importación masiva vía Excel (.xlsx)</td><td>✓ Completo</td><td>Solo previsualización</td></tr>' +
              '<tr><td>Gestión de usuarios, roles y configuración legal</td><td>✓ Exclusivo</td><td>— Sin acceso</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Usuarios, Roles y Permisos",
      "Control de acceso para el equipo operativo de Avenew Real Estate.",
      content
    );
  },

  settings() {
    const content =
      '<div class="grid-2">' +
        '<div class="panel-card">' +
          '<div class="panel-card-head"><h3>Identidad de Marca Blanca y Empresa</h3></div>' +
          '<div class="panel-card-body od-stack" style="--od-gap:14px">' +
            UI.field({ id: "set-brand", label: "Nombre comercial en cabecera", value: "HABITIA (by Avenew Madrid)" }) +
            UI.field({ id: "set-company", label: "Razón social para textos legales", value: "Avenew Real Estate S.L." }) +
            UI.field({ id: "set-email", label: "Correo receptor de consultas y alertas", value: "hola@habitia.es" }) +
            UI.field({ id: "set-phone", label: "Teléfono comercial público", value: "+34 910 482 100" }) +
            '<button class="btn btn-primary btn-sm" type="button" data-action="save-settings">Guardar configuración general</button>' +
          '</div>' +
        '</div>' +

        '<div class="panel-card">' +
          '<div class="panel-card-head"><h3>Preferencias del Sistema e Inventario</h3></div>' +
          '<div class="panel-card-body od-stack" style="--od-gap:14px">' +
            UI.field({ id: "set-currency", label: "Moneda predeterminada", value: "EUR (€) — Euro" }) +
            UI.field({ id: "set-privacy-radius", label: "Radio del círculo de privacidad en mapas públicos", value: "250 metros (Ocultar número de portal exacto)" }) +
            UI.switchControl("set-auto-unpublish", true, "Marcar automáticamente como Próxima disponibilidad 30 días antes del fin de contrato") +
            UI.switchControl("set-rgpd-double", true, "Exigir casilla RGPD verificada en todos los formularios públicos") +
          '</div>' +
        '</div>' +
      '</div>';

    return this.shell(
      "Configuración General del Sistema",
      "Parámetros de marca blanca, privacidad en mapas y reglas globales.",
      content
    );
  },

  /* ========================================================================
     DRAWER LATERAL (Detalle de Consulta CRM / Ajuste rápido de Calendario)
     ======================================================================== */
  renderDrawer() {
    const d = Store.state.drawer;
    if (!d) return "";

    if (d.type === "lead") {
      const lead = Store.lead(d.id);
      if (!lead) return "";
      const room = Store.room(lead.roomId);
      return (
        '<div class="drawer-backdrop" data-action="close-drawer-backdrop">' +
          '<aside class="drawer-panel" aria-label="Detalle de consulta">' +
            '<div class="drawer-head">' +
              '<div>' +
                '<span class="badge is-neutral tabular">' + UI.esc(lead.id) + '</span>' +
                '<h2 style="margin:4px 0 0;font-size:1.15rem">' + UI.esc(lead.name) + '</h2>' +
              '</div>' +
              '<button class="icon-btn" type="button" data-action="close-drawer" aria-label="Cerrar panel">' + UI.icon("close") + '</button>' +
            '</div>' +
            '<div class="drawer-body">' +
              '<div class="apt-box" style="padding:14px">' +
                '<div style="font-size:0.84rem;display:grid;gap:4px">' +
                  '<span><strong>Email:</strong> ' + UI.esc(lead.email) + '</span>' +
                  '<span><strong>Teléfono:</strong> ' + UI.esc(lead.phone || "No indicado") + '</span>' +
                  '<span><strong>Entrada solicitada:</strong> ' + UI.dateShort(lead.date) + '</span>' +
                '</div>' +
              '</div>' +

              (room
                ? '<div class="panel-card"><div class="panel-card-body" style="display:flex;gap:12px;align-items:center">' +
                    '<img src="' + IMG[room.main] + '" alt="" style="width:72px;height:54px;object-fit:cover;border-radius:6px">' +
                    '<div style="min-width:0;flex:1">' +
                      '<strong class="tabular">' + UI.esc(room.id) + ' · ' + room.price + ' €/mes</strong>' +
                      '<span class="od-truncate" style="font-size:0.82rem;color:var(--text-secondary)">' + UI.esc(room.name) + '</span>' +
                    '</div>' +
                    '<button class="btn btn-outline btn-sm" type="button" data-action="open-room" data-id="' + room.id + '">Ver</button>' +
                  '</div></div>'
                : "") +

              '<div>' +
                '<strong style="font-size:0.84rem;display:block;margin-bottom:6px">Mensaje del interesado</strong>' +
                '<div style="background:var(--bg-primary);padding:12px;border-radius:var(--radius-sm);font-size:0.88rem">' + UI.esc(lead.message) + '</div>' +
              '</div>' +

              '<div class="field">' +
                '<label for="drawer-lead-status">Actualizar estado comercial en vivo</label>' +
                '<select class="select" id="drawer-lead-status" data-action="change-lead-status" data-id="' + lead.id + '">' +
                  Object.keys(LEAD_STATUS).map((k) =>
                    '<option value="' + k + '"' + (lead.status === k ? " selected" : "") + '>' + LEAD_STATUS[k] + '</option>'
                  ).join("") +
                '</select>' +
              '</div>' +

              '<div class="field">' +
                '<label for="drawer-lead-notes">Notas internas del gestor</label>' +
                '<textarea class="input" id="drawer-lead-notes" rows="3" placeholder="Añade notas sobre la llamada o visita...">' + UI.esc(lead.notes || "") + '</textarea>' +
                '<button class="btn btn-outline btn-sm" type="button" data-action="save-lead-notes" data-id="' + lead.id + '">Guardar nota interna</button>' +
              '</div>' +

              '<div>' +
                '<strong style="font-size:0.84rem;display:block;margin-bottom:8px">Línea de tiempo (Historial)</strong>' +
                '<div class="od-stack" style="--od-gap:8px">' +
                  lead.history.map((h) =>
                    '<div style="font-size:0.8rem;display:flex;justify-content:space-between;padding:8px 10px;background:var(--bg-primary);border-radius:var(--radius-sm)">' +
                      '<span>' + UI.esc(h.label) + '</span>' +
                      '<strong class="tabular">' + UI.dateShort(h.at) + '</strong>' +
                    '</div>'
                  ).join("") +
                '</div>' +
              '</div>' +

              '<a class="btn btn-primary" href="mailto:' + UI.esc(lead.email) + '?subject=Solicitud%20HABITIA%20' + UI.esc(lead.roomId || "") + '">' + UI.icon("mail") + 'Responder por correo</a>' +
            '</div>' +
          '</aside>' +
        '</div>'
      );
    }

    if (d.type === "calendar") {
      const room = Store.room(d.id);
      if (!room) return "";
      return (
        '<div class="drawer-backdrop" data-action="close-drawer-backdrop">' +
          '<aside class="drawer-panel" aria-label="Ajustar fecha de liberación">' +
            '<div class="drawer-head">' +
              '<div>' +
                '<span class="badge is-neutral tabular">' + UI.esc(room.id) + '</span>' +
                '<h2 style="margin:4px 0 0;font-size:1.1rem">' + UI.esc(room.name) + '</h2>' +
              '</div>' +
              '<button class="icon-btn" type="button" data-action="close-drawer" aria-label="Cerrar">' + UI.icon("close") + '</button>' +
            '</div>' +
            '<div class="drawer-body">' +
              '<p style="margin:0;font-size:0.88rem;color:var(--text-secondary)">Ajusta el estado y la fecha exacta en que esta habitación quedará libre. El cambio se refleja al instante en el Timeline y en la web pública.</p>' +
              '<div class="field">' +
                '<label for="cal-room-status">Estado de disponibilidad</label>' +
                '<select class="select" id="cal-room-status">' +
                  '<option value="available"' + (room.status === "available" ? " selected" : "") + '>Disponible ahora</option>' +
                  '<option value="upcoming"' + (room.status === "upcoming" ? " selected" : "") + '>Próxima disponibilidad</option>' +
                  '<option value="occupied"' + (room.status === "occupied" ? " selected" : "") + '>Ocupada</option>' +
                '</select>' +
              '</div>' +
              '<div class="field">' +
                '<label for="cal-room-date">Fecha de liberación / entrada</label>' +
                '<input class="input" id="cal-room-date" type="date" value="' + UI.esc(room.availableFrom) + '">' +
              '</div>' +
              '<div class="field">' +
                '<label for="cal-room-price">Precio mensual (€)</label>' +
                '<input class="input tabular" id="cal-room-price" type="number" value="' + room.price + '">' +
              '</div>' +
              '<button class="btn btn-primary" type="button" data-action="save-calendar-drawer" data-id="' + room.id + '">Guardar cambios en el calendario</button>' +
            '</div>' +
          '</aside>' +
        '</div>'
      );
    }

    return "";
  }
};
