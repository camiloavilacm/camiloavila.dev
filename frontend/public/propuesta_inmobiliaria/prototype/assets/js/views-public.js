/* HABITIA — Vistas de la Web Pública (B2C) */

const ViewsPublic = {
  header() {
    const r = Store.state.route.name;
    const mobileOpen = Store.state.mobileMenuOpen;
    return (
      '<header class="pub-header">' +
        '<div class="pub-header-inner">' +
          '<a href="#home" class="brand-logo" data-action="nav" data-route="home">' +
            '<span class="brand-mark">H</span>' +
            '<span class="brand-text">' +
              '<span class="brand-name">HABITIA</span>' +
              '<span class="brand-sub">Propuesta para Avenew Madrid</span>' +
            '</span>' +
          '</a>' +
          '<nav class="pub-nav" aria-label="Navegación principal">' +
            '<a href="#search" class="pub-nav-link ' + (r === "search" ? "is-active" : "") + '" data-action="nav" data-route="search">Habitaciones</a>' +
            '<a href="#location" class="pub-nav-link ' + (r === "location" ? "is-active" : "") + '" data-action="nav" data-route="location">Barrios (Madrid)</a>' +
            '<a href="#upcoming" class="pub-nav-link ' + (r === "upcoming" ? "is-active" : "") + '" data-action="nav" data-route="upcoming">Próximas Disponibilidades</a>' +
            '<a href="#tenant-portal" class="pub-nav-link ' + (r === "tenant-portal" || r === "login-tenant" ? "is-active" : "") + '" data-action="nav" data-route="tenant-portal">' + UI.icon("user") + 'Mi espacio HABITIA ' + UI.featureBadge("portal") + '</a>' +
            '<a href="#contact" class="pub-nav-link ' + (r === "contact" ? "is-active" : "") + '" data-action="nav" data-route="contact">Contacto</a>' +
          '</nav>' +
          '<div class="pub-header-actions">' +
            '<button class="btn btn-outline btn-sm" type="button" data-action="nav" data-route="login-tenant">' + UI.icon("sparkles") + 'Acceso Inquilino</button>' +
            '<button class="btn btn-primary btn-sm" type="button" data-action="nav" data-route="search">Encuentra tu habitación</button>' +
            '<button class="icon-btn mobile-menu-btn" type="button" data-action="toggle-mobile-menu" aria-label="Abrir menú">' + UI.icon(mobileOpen ? "close" : "menu") + '</button>' +
          '</div>' +
        '</div>' +
        (mobileOpen
          ? '<nav class="pub-mobile-nav" aria-label="Menú móvil">' +
              '<a href="#search" class="pub-nav-link" data-action="nav" data-route="search">Habitaciones</a>' +
              '<a href="#location" class="pub-nav-link" data-action="nav" data-route="location">Barrios (Madrid)</a>' +
              '<a href="#upcoming" class="pub-nav-link" data-action="nav" data-route="upcoming">Próximas Disponibilidades</a>' +
              '<a href="#login-tenant" class="pub-nav-link" data-action="nav" data-route="login-tenant">Acceso Passwordless (Enlace mágico)</a>' +
              '<a href="#tenant-portal" class="pub-nav-link" data-action="nav" data-route="tenant-portal">Mi espacio HABITIA (Portal Inquilino)</a>' +
              '<a href="#admin-inbox" class="pub-nav-link" data-action="nav" data-route="admin-inbox">Inbox Omnicanal (Panel Admin)</a>' +
              '<a href="#pricing-pitch" class="pub-nav-link" data-action="nav" data-route="pricing-pitch">Ver Propuesta Comercial</a>' +
            '</nav>'
          : "") +
      '</header>'
    );
  },

  footer() {
    return (
      '<footer class="pub-footer">' +
        '<div class="pub-footer-inner">' +
          '<div>' +
            '<div class="brand-logo" style="margin-bottom:12px">' +
              '<span class="brand-mark" style="background:#427565">H</span>' +
              '<span class="brand-text">' +
                '<span class="brand-name" style="color:#FFFFFF">HABITIA</span>' +
                '<span class="brand-sub" style="color:#B4C4BE">by Avenew Real Estate Madrid</span>' +
              '</span>' +
            '</div>' +
            '<p style="color:#C2CEC9;font-size:0.88rem;max-width:36ch;margin:0 0 16px">Alquiler de habitaciones amuebladas y coliving en los mejores barrios de Madrid. Contratos claros, suministros transparentes y atención directa.</p>' +
            '<p style="color:#9EB0AA;font-size:0.8rem;margin:0">Calle de Velázquez 42, Planta 1 · 28001 Madrid · +34 910 482 100</p>' +
          '</div>' +
          '<div>' +
            '<h4>Explorar</h4>' +
            '<ul>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="search">Catálogo de habitaciones</button></li>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="upcoming">Próximas disponibilidades</button></li>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="location">Barrios de Madrid</button></li>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="alerts">Crear alerta personalizada</button></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Zonas en Madrid</h4>' +
            '<ul>' +
              '<li><button class="link-btn" type="button" data-action="open-area" data-area="Chamberí">Chamberí (Trafalgar · Almagro)</button></li>' +
              '<li><button class="link-btn" type="button" data-action="open-area" data-area="Salamanca">Salamanca (Goya · Lista)</button></li>' +
              '<li><button class="link-btn" type="button" data-action="open-area" data-area="Malasaña">Malasaña / Universidad</button></li>' +
              '<li><button class="link-btn" type="button" data-action="open-area" data-area="Argüelles">Argüelles / Moncloa</button></li>' +
              '<li><button class="link-btn" type="button" data-action="open-area" data-area="Lavapiés">Lavapiés / Embajadores</button></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Soporte y Legal</h4>' +
            '<ul>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="contact">Contacto y preguntas frecuentes</button></li>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="legal" data-tab="privacy">Política de Privacidad</button></li>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="legal" data-tab="cookies">Política de Cookies</button></li>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="admin-login">Acceso Administración (B2B)</button></li>' +
              '<li><button class="link-btn" type="button" data-action="nav" data-route="pricing-pitch">Propuesta Comercial & Paquetes</button></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="pub-footer-bottom">' +
          '<span>© 2026 HABITIA · Marca blanca demostrativa para Avenew Real Estate S.L. (Madrid).</span>' +
          '<span>Sin registro obligatorio para inquilinos · Gestión centralizada</span>' +
        '</div>' +
      '</footer>'
    );
  },

  wrap(innerHtml) {
    return this.header() + '<main id="main">' + innerHtml + '</main>' + this.footer();
  },

  /* ========================================================================
     1. HOMEPAGE (#home)
     ======================================================================== */
  home() {
    const pub = Store.publishedRooms();
    const featured = pub.slice(0, 6);
    const upcoming = pub.filter((r) => r.status === "upcoming").slice(0, 3);
    const s = Store.state.search;
    const allAreas = ["Chamberí", "Salamanca", "Malasaña", "Argüelles", "Lavapiés", "Tetuán"];
    const selectedAreas = Array.isArray(s.areas) && s.areas.length > 0
      ? s.areas
      : (s.area ? [s.area] : []);
    const heroAreaLabel = selectedAreas.length === 0
      ? "Todos los barrios"
      : selectedAreas.length <= 2
        ? selectedAreas.join(" + ")
        : selectedAreas.length + " barrios (" + selectedAreas.slice(0, 2).join(", ") + " +" + (selectedAreas.length - 2) + ")";

    const body =
      '<section class="hero">' +
        '<div class="container">' +
          '<div class="hero-frame">' +
            '<img class="hero-bg" src="' + IMG.hero + '" alt="' + UI.esc(IMG_ALT.hero) + '" width="1800" height="1200">' +
            '<div class="hero-scrim"></div>' +
            '<div class="hero-content">' +
              '<span class="badge is-neutral" style="margin-bottom:14px">Madrid · Pisos compartidos y coliving gestionado</span>' +
              '<h1 class="hero-title">Encuentra tu próximo lugar para vivir.</h1>' +
              '<p class="hero-sub">Descubre habitaciones en alquiler listas para entrar y encuentra un espacio que se adapte a ti.</p>' +
              '<form class="search-bar-card" id="hero-search-form" onsubmit="return false">' +
                '<div class="field">' +
                  '<label for="hero-city">Ciudad</label>' +
                  '<select class="select" id="hero-city">' +
                    '<option value="">Todas las ciudades</option>' +
                    '<option value="Madrid"' + (s.city === "Madrid" ? " selected" : "") + '>Madrid (Sede principal)</option>' +
                    '<option value="Valencia"' + (s.city === "Valencia" ? " selected" : "") + '>Valencia (Próxima apertura)</option>' +
                    '<option value="Málaga"' + (s.city === "Málaga" ? " selected" : "") + '>Málaga (Próxima apertura)</option>' +
                  '</select>' +
                '</div>' +
                '<div class="field multi-area-dropdown-wrap">' +
                  '<label id="hero-area-label">Barrio / Zona (múltiple)</label>' +
                  '<button type="button" class="select multi-area-trigger' + (selectedAreas.length > 0 ? " has-selection" : "") + '" data-action="toggle-hero-area-dropdown" aria-expanded="' + (s.heroAreaOpen ? "true" : "false") + '" aria-labelledby="hero-area-label">' +
                    '<span class="od-truncate">' + UI.esc(heroAreaLabel) + '</span>' +
                    '<span class="multi-area-caret">' + (selectedAreas.length > 0 ? '<span class="multi-area-count tabular">' + selectedAreas.length + '</span>' : "") + '▾</span>' +
                  '</button>' +
                  (s.heroAreaOpen
                    ? '<div class="multi-area-popover" role="group" aria-label="Seleccionar uno o varios barrios">' +
                        '<div class="multi-area-popover-head">' +
                          '<span>Selecciona 1, 2 o más barrios</span>' +
                          '<div style="display:flex;gap:8px">' +
                            '<button type="button" class="link-btn" style="font-size:0.74rem;font-weight:700;color:var(--brand-primary);background:none;border:0;padding:0" data-action="select-all-areas">Todos</button>' +
                            '<button type="button" class="link-btn" style="font-size:0.74rem;font-weight:700;color:var(--text-muted);background:none;border:0;padding:0" data-action="clear-areas">Limpiar</button>' +
                          '</div>' +
                        '</div>' +
                        '<div class="multi-area-options">' +
                          allAreas.map((b) => {
                            const checked = selectedAreas.includes(b);
                            return (
                              '<label class="multi-area-opt' + (checked ? " is-checked" : "") + '">' +
                                '<input type="checkbox" data-filter-area="' + b + '"' + (checked ? " checked" : "") + '>' +
                                '<span>' + b + '</span>' +
                              '</label>'
                            );
                          }).join("") +
                        '</div>' +
                      '</div>'
                    : "") +
                '</div>' +
                '<div class="field">' +
                  '<label for="hero-max">Presupuesto máx. (€/mes)</label>' +
                  '<select class="select" id="hero-max">' +
                    '<option value="">Sin límite</option>' +
                    '<option value="550">Hasta 550 €</option>' +
                    '<option value="650">Hasta 650 €</option>' +
                    '<option value="750">Hasta 750 €</option>' +
                    '<option value="900">Hasta 900 €</option>' +
                  '</select>' +
                '</div>' +
                '<div class="field">' +
                  '<label for="hero-date">Fecha de entrada</label>' +
                  '<input class="input" id="hero-date" type="date" value="' + UI.esc(s.date || "") + '">' +
                '</div>' +
                '<button class="btn btn-primary btn-lg" type="button" data-action="submit-hero-search">' + UI.icon("search") + 'Buscar habitaciones</button>' +
              '</form>' +
              '<div class="hero-stats">' +
                '<div class="hero-stat-item"><strong class="tabular">100</strong><span>Habitaciones gestionadas en Madrid</span></div>' +
                '<div class="hero-stat-item"><strong class="tabular">6 pisos</strong><span>Edificios y viviendas rehabilitadas</span></div>' +
                '<div class="hero-stat-item"><strong class="tabular">100% online</strong><span>Consulta directa sin crear cuenta</span></div>' +
                '<div class="hero-stat-item"><strong class="tabular">30 / 60 / 90 días</strong><span>Visibilidad real de próximas vacantes</span></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* Habitaciones Destacadas */
      '<section class="section">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div>' +
              '<span class="eyebrow">Catálogo seleccionado</span>' +
              '<h2>Habitaciones destacadas en Madrid</h2>' +
              '<p>Dormitorios exteriores, amueblados y con suministros claros en los barrios mejor conectados.</p>' +
            '</div>' +
            '<button class="btn btn-outline" type="button" data-action="nav" data-route="search">Ver las ' + pub.length + ' habitaciones publicadas ' + UI.icon("arrowRight") + '</button>' +
          '</div>' +
          '<div class="rooms-grid">' +
            featured.map((r) => UI.roomCard(r)).join("") +
          '</div>' +
        '</div>' +
      '</section>' +

      /* Próximamente Disponibles */
      '<section class="section section-muted">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div>' +
              '<span class="eyebrow">' + UI.icon("calendar") + ' Planifica con antelación</span>' +
              '<h2>Próximamente disponibles (7, 30 y 60 días)</h2>' +
              '<p>Reserva tu habitación antes de que quede libre. Mostramos la fecha exacta de salida del inquilino actual.</p>' +
            '</div>' +
            '<button class="btn btn-outline" type="button" data-action="nav" data-route="upcoming">Ver calendario de liberaciones ' + UI.icon("arrowRight") + '</button>' +
          '</div>' +
          '<div class="rooms-grid">' +
            upcoming.map((r) => UI.roomCard(r, { packageHint: UI.relative(r.availableFrom) })).join("") +
          '</div>' +
        '</div>' +
      '</section>' +

      /* Barrios Populares */
      '<section class="section">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div>' +
              '<span class="eyebrow">Explora por ubicación ' + UI.featureBadge("seo") + '</span>' +
              '<h2>Barrios populares en Madrid y expansión</h2>' +
              '<p>Páginas específicas por zona con precio medio, perfil de convivencia y paradas de Metro cercanas.</p>' +
            '</div>' +
            '<button class="btn btn-ghost" type="button" data-action="nav" data-route="location">Abrir guía de barrios ' + UI.icon("arrowRight") + '</button>' +
          '</div>' +
          '<div class="nbr-grid">' +
            NEIGHBOURHOODS.map((n) => {
              const count = Store.state.rooms.filter((r) => r.area === n.name || (n.city === "Valencia" && r.city === "Valencia")).length;
              const labelCount = count > 0 ? count + " habitaciones" : "Próxima apertura";
              return (
                '<button class="nbr-card" type="button" data-action="open-area" data-area="' + UI.esc(n.name) + '">' +
                  '<span class="nbr-card-media"><img src="' + n.img + '" alt="' + UI.esc(n.alt) + '" width="1200" height="900" loading="lazy"></span>' +
                  '<span class="nbr-card-body">' +
                    '<span class="nbr-card-title">' + UI.esc(n.name) + '</span>' +
                    '<span class="nbr-card-zones">' + UI.esc(n.zones) + '</span>' +
                    '<span class="nbr-card-count tabular">' + labelCount + ' →</span>' +
                  '</span>' +
                '</button>'
              );
            }).join("") +
          '</div>' +
        '</div>' +
      '</section>' +

      /* Banner CTA Alertas */
      '<section class="section" style="padding-top:12px">' +
        '<div class="container">' +
          '<div class="cta-banner">' +
            '<div>' +
              '<span class="badge is-soon" style="margin-bottom:10px">Servicio de alertas de disponibilidad · Paquete COMPLETE</span>' +
              '<h3>¿No encuentras disponibilidad para tu fecha? Crea una alerta personalizada.</h3>' +
              '<p>Indícanos tu barrio preferido en Madrid, tu presupuesto mensual y cuándo quieres entrar a vivir. Te escribiremos en cuanto se libere una habitación compatible.</p>' +
            '</div>' +
            '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
              '<button class="btn btn-accent btn-lg" type="button" data-action="nav" data-route="alerts">' + UI.icon("bell") + 'Crear alerta personalizada</button>' +
              '<button class="btn btn-outline btn-lg" style="background:transparent;color:#FFF;border-color:rgba(255,255,255,0.4)" type="button" data-action="nav" data-route="contact">Hablar con el equipo</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    return this.wrap(body);
  },

  /* ========================================================================
     2. BÚSQUEDA Y RESULTADOS CON MAPA (#search)
     ======================================================================== */
  selectedAreas() {
    const s = Store.state.search;
    if (Array.isArray(s.areas) && s.areas.length > 0) return s.areas.slice();
    if (s.area) return [s.area];
    return [];
  },

  filterRooms() {
    const s = Store.state.search;
    const areas = this.selectedAreas();
    let list = Store.publishedRooms().slice();

    if (s.city) {
      list = list.filter((r) => r.city === s.city);
    }
    if (areas.length > 0) {
      list = list.filter((r) => areas.includes(r.area));
    }
    if (s.min !== "" && !isNaN(Number(s.min))) {
      list = list.filter((r) => r.price >= Number(s.min));
    }
    if (s.max !== "" && !isNaN(Number(s.max))) {
      list = list.filter((r) => r.price <= Number(s.max));
    }
    if (s.date) {
      list = list.filter((r) => r.availableFrom <= s.date && r.status !== "occupied");
    }
    if (s.stay !== "" && s.stay != null && !isNaN(Number(s.stay))) {
      const desiredMonths = Number(s.stay);
      list = list.filter((r) => (Number(r.minStay) || 1) <= desiredMonths);
    }
    if (s.status && s.status.length > 0) {
      list = list.filter((r) => s.status.includes(r.status));
    }
    if (s.amenities && s.amenities.length > 0) {
      list = list.filter((r) =>
        s.amenities.every((a) => {
          if (a === "bath") return r.bath === "private";
          return Boolean(r[a]);
        })
      );
    }

    if (s.sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (s.sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (s.sort === "date-asc") {
      list.sort((a, b) => String(a.availableFrom).localeCompare(String(b.availableFrom)));
    } else if (s.stay !== "" && s.stay != null && !isNaN(Number(s.stay))) {
      list.sort((a, b) => (b.minStay || 1) - (a.minStay || 1));
    }
    return list;
  },

  search() {
    const s = Store.state.search;
    const allAreas = ["Chamberí", "Salamanca", "Malasaña", "Argüelles", "Lavapiés", "Tetuán"];
    const selectedAreas = this.selectedAreas();
    const pubRooms = Store.publishedRooms();
    const filtered = this.filterRooms();
    const mapEnabled = Boolean(s.map);
    const activePinRoom = filtered.find((r) => r.id === s.openPin) || filtered[0] || null;

    const mapColumn = mapEnabled
      ? '<aside class="map-panel" aria-label="Mapa interactivo de habitaciones en Madrid">' +
          '<div style="padding:12px 16px;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;gap:8px">' +
            '<span style="font-weight:700;font-size:0.85rem">' + UI.icon("pin") + ' Mapa de Madrid (' + filtered.length + ' pines)</span>' +
            UI.featureBadge("map") +
          '</div>' +
          '<div class="map-canvas">' +
            '<svg class="map-svg-bg" viewBox="0 0 400 400" preserveAspectRatio="none" aria-hidden="true">' +
              '<rect width="400" height="400" fill="#E4EBE7"/>' +
              '<path d="M0 90 Q 180 110 400 75" stroke="#D2DDD8" stroke-width="14" fill="none"/>' +
              '<path d="M60 0 Q 95 200 70 400" stroke="#C5D9E2" stroke-width="18" fill="none"/>' +
              '<path d="M210 0 L 195 400" stroke="#F4F6F4" stroke-width="10" fill="none"/>' +
              '<path d="M0 220 L 400 205" stroke="#F4F6F4" stroke-width="9" fill="none"/>' +
              '<path d="M110 0 L 310 400" stroke="#ECEFE9" stroke-width="6" fill="none"/>' +
              '<circle cx="200" cy="195" r="110" stroke="#CAD6D0" stroke-width="1.5" stroke-dasharray="5 5" fill="none"/>' +
              '<text x="148" y="95" fill="#6D7C76" font-size="11" font-weight="700">CHAMBERÍ</text>' +
              '<text x="235" y="135" fill="#6D7C76" font-size="11" font-weight="700">SALAMANCA</text>' +
              '<text x="155" y="175" fill="#6D7C76" font-size="11" font-weight="700">MALASAÑA</text>' +
              '<text x="85" y="150" fill="#6D7C76" font-size="11" font-weight="700">ARGÜELLES</text>' +
              '<text x="185" y="265" fill="#6D7C76" font-size="11" font-weight="700">LAVAPIÉS</text>' +
            '</svg>' +
            filtered.map((r) => {
              const isSelected = activePinRoom && activePinRoom.id === r.id;
              const statusCls = r.status === "upcoming" ? " is-soon" : r.status === "occupied" ? " is-off" : "";
              return (
                '<button type="button" class="pin-btn' + statusCls + (isSelected ? " is-active" : "") + '" ' +
                  'style="left:' + r.coords.x + '%;top:' + r.coords.y + '%" ' +
                  'data-action="select-pin" data-id="' + r.id + '" ' +
                  'aria-label="' + UI.esc(r.name) + ' · ' + r.price + ' €">' +
                  r.price + ' €' +
                '</button>'
              );
            }).join("") +
            (activePinRoom
              ? '<div class="map-popover">' +
                  '<img src="' + IMG[activePinRoom.main] + '" alt="' + UI.esc(activePinRoom.name) + '" width="96" height="72">' +
                  '<div style="min-width:0">' +
                    '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">' +
                      UI.statusCompact(activePinRoom.status) +
                      '<span style="font-size:0.75rem;color:var(--text-muted)">' + UI.esc(activePinRoom.area) + '</span>' +
                    '</div>' +
                    '<strong class="od-truncate" style="font-size:0.9rem">' + UI.esc(activePinRoom.name) + '</strong>' +
                    '<span class="tabular" style="font-size:0.9rem;font-weight:800;color:var(--brand-primary)">' + activePinRoom.price + ' €/mes</span>' +
                  '</div>' +
                  '<button class="btn btn-primary btn-sm" type="button" data-action="open-room" data-id="' + activePinRoom.id + '">Ver ficha</button>' +
                '</div>'
              : "") +
          '</div>' +
        '</aside>'
      : "";

    const body =
      '<div class="container">' +
        '<div style="padding-top:28px">' +
          '<span class="eyebrow">Buscador de habitaciones</span>' +
          '<h1 style="margin:0;font-size:clamp(1.6rem,2.5vw,2.2rem)">Habitaciones en alquiler en Madrid</h1>' +
        '</div>' +
        '<div class="search-layout">' +
          /* Columna Lateral de Filtros Reactivos */
          '<aside class="filter-panel" aria-label="Filtros de búsqueda">' +
            '<div style="display:flex;align-items:center;justify-content:space-between">' +
              '<strong style="font-size:0.95rem">' + UI.icon("filter") + ' Filtros</strong>' +
              '<button class="btn btn-ghost btn-sm" type="button" data-action="reset-filters">Limpiar filtros</button>' +
            '</div>' +

            '<div class="filter-group">' +
              '<p class="filter-group-title">Ubicación</p>' +
              '<div class="field">' +
                '<label for="flt-city">Ciudad</label>' +
                '<select class="select" id="flt-city" data-filter="city">' +
                  '<option value="">Todas las ciudades</option>' +
                  '<option value="Madrid"' + (s.city === "Madrid" ? " selected" : "") + '>Madrid (Sede principal)</option>' +
                  '<option value="Valencia"' + (s.city === "Valencia" ? " selected" : "") + '>Valencia (0)</option>' +
                  '<option value="Málaga"' + (s.city === "Málaga" ? " selected" : "") + '>Málaga (0)</option>' +
                '</select>' +
              '</div>' +
              '<div class="field" style="margin-top:4px">' +
                '<div class="area-filter-head">' +
                  '<label style="margin:0">Barrio <span class="area-multi-hint">(selección múltiple)</span></label>' +
                  '<div class="area-filter-actions">' +
                    '<button type="button" class="area-action-link" data-action="select-all-areas">Todos</button>' +
                    (selectedAreas.length > 0
                      ? '<button type="button" class="area-action-link is-clear" data-action="clear-areas">Limpiar (' + selectedAreas.length + ')</button>'
                      : "") +
                  '</div>' +
                '</div>' +
                '<div class="area-multi-grid" role="group" aria-label="Filtro de barrios con selección múltiple">' +
                  allAreas.map((b) => {
                    const isChecked = selectedAreas.includes(b);
                    const count = pubRooms.filter((r) => r.area === b).length;
                    return (
                      '<label class="area-check-chip' + (isChecked ? " is-active" : "") + '">' +
                        '<input type="checkbox" data-filter-area="' + b + '"' + (isChecked ? " checked" : "") + '>' +
                        '<span class="area-check-box" aria-hidden="true">' + (isChecked ? "✓" : "") + '</span>' +
                        '<span class="area-check-name od-truncate">' + b + '</span>' +
                        '<span class="area-check-count tabular">' + count + '</span>' +
                      '</label>'
                    );
                  }).join("") +
                '</div>' +
                '<p class="field-hint">' +
                  (selectedAreas.length === 0
                    ? "Mostrando todos los barrios. Marca 2 o más opciones para combinar zonas."
                    : selectedAreas.length + (selectedAreas.length === 1 ? " barrio seleccionado: " : " barrios seleccionados: ") + selectedAreas.join(", ")) +
                '</p>' +
              '</div>' +
            '</div>' +

            '<div class="filter-group">' +
              '<p class="filter-group-title">Precio mensual (€)</p>' +
              '<div class="grid-2" style="gap:10px">' +
                '<div class="field">' +
                  '<label for="flt-min">Mínimo</label>' +
                  '<input class="input tabular" id="flt-min" type="number" step="25" min="350" max="1200" placeholder="450" value="' + UI.esc(s.min) + '" data-filter="min">' +
                '</div>' +
                '<div class="field">' +
                  '<label for="flt-max">Máximo</label>' +
                  '<input class="input tabular" id="flt-max" type="number" step="25" min="350" max="1200" placeholder="900" value="' + UI.esc(s.max) + '" data-filter="max">' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div class="filter-group">' +
              '<p class="filter-group-title">Fecha de entrada</p>' +
              '<div class="field">' +
                '<label for="flt-date">Disponible antes de</label>' +
                '<input class="input" id="flt-date" type="date" value="' + UI.esc(s.date) + '" data-filter="date">' +
              '</div>' +
            '</div>' +

            '<div class="filter-group">' +
              '<p class="filter-group-title">Tiempo de estadía deseado</p>' +
              '<div class="field">' +
                '<span id="flt-stay-label" style="font-size:0.84rem;font-weight:600;color:var(--text-primary);display:block">Duración prevista por el inquilino</span>' +
                '<div class="stay-chips" role="group" aria-labelledby="flt-stay-label">' +
                  STAY_OPTIONS.map((opt) => {
                    const active = String(s.stay || "") === opt.value;
                    return (
                      '<button type="button" class="stay-chip' + (active ? " is-active" : "") + '" data-action="set-stay-filter" data-stay="' + opt.value + '" aria-pressed="' + (active ? "true" : "false") + '">' +
                        UI.esc(opt.short) +
                      '</button>'
                    );
                  }).join("") +
                '</div>' +
              '</div>' +
              '<p class="field-hint">Filtra habitaciones cuya estancia mínima admita tu duración deseada.</p>' +
            '</div>' +

            '<div class="filter-group">' +
              '<p class="filter-group-title">Estado de disponibilidad</p>' +
              '<label class="check-row"><input type="checkbox" data-filter-status="available"' + (s.status.includes("available") ? " checked" : "") + '> Disponible ahora</label>' +
              '<label class="check-row"><input type="checkbox" data-filter-status="upcoming"' + (s.status.includes("upcoming") ? " checked" : "") + '> Próxima disponibilidad</label>' +
              '<label class="check-row"><input type="checkbox" data-filter-status="occupied"' + (s.status.includes("occupied") ? " checked" : "") + '> Habitada (con fecha de desalojo)</label>' +
            '</div>' +

            '<div class="filter-group">' +
              '<p class="filter-group-title">Equipamiento</p>' +
              '<label class="check-row"><input type="checkbox" data-filter-amenity="bath"' + (s.amenities.includes("bath") ? " checked" : "") + '> Baño privado</label>' +
              '<label class="check-row"><input type="checkbox" data-filter-amenity="exterior"' + (s.amenities.includes("exterior") ? " checked" : "") + '> Habitación exterior</label>' +
              '<label class="check-row"><input type="checkbox" data-filter-amenity="desk"' + (s.amenities.includes("desk") ? " checked" : "") + '> Escritorio ergonómico</label>' +
              '<label class="check-row"><input type="checkbox" data-filter-amenity="ac"' + (s.amenities.includes("ac") ? " checked" : "") + '> Aire acondicionado</label>' +
            '</div>' +

            '<div class="filter-panel-foot">' +
              '<span class="filter-foot-count tabular"><strong>' + filtered.length + '</strong> ' + (filtered.length === 1 ? 'habitación compatible' : 'habitaciones compatibles') + '</span>' +
              '<button class="btn btn-outline btn-sm" style="width:100%" type="button" data-action="reset-filters">Restablecer todos los filtros</button>' +
            '</div>' +
          '</aside>' +

          /* Resultados y Conmutador de Mapa */
          '<div>' +
            '<div class="search-toolbar">' +
              '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                '<strong class="tabular">' + filtered.length + (filtered.length === 1 ? " habitación encontrada" : " habitaciones encontradas") + '</strong>' +
                selectedAreas.map((areaName) =>
                  '<button type="button" class="badge is-ok area-filter-tag" data-action="remove-area-filter" data-area="' + UI.esc(areaName) + '" title="Quitar ' + UI.esc(areaName) + ' del filtro">' +
                    'Barrio: ' + UI.esc(areaName) + ' <span aria-hidden="true">×</span>' +
                  '</button>'
                ).join("") +
                (s.city ? '<span class="badge is-neutral">Ciudad: ' + UI.esc(s.city) + '</span>' : "") +
                (s.stay
                  ? '<span class="badge is-ok">Estadía deseada: ' +
                      UI.esc((STAY_OPTIONS.find((o) => o.value === String(s.stay)) || {}).short || (s.stay + " meses")) +
                    '</span>'
                  : "") +
              '</div>' +
              '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
                '<div style="display:flex;align-items:center;gap:8px">' +
                  UI.switchControl("toggle-map-switch", mapEnabled, "Mostrar Mapa") +
                  UI.featureBadge("map") +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px">' +
                  '<label for="flt-sort" style="font-size:0.82rem;font-weight:600;color:var(--text-secondary)">Ordenar:</label>' +
                  '<select class="select" id="flt-sort" style="width:auto;min-height:36px;padding:4px 10px" data-filter="sort">' +
                    '<option value="relevance"' + (s.sort === "relevance" ? " selected" : "") + '>Relevancia</option>' +
                    '<option value="price-asc"' + (s.sort === "price-asc" ? " selected" : "") + '>Precio más bajo</option>' +
                    '<option value="price-desc"' + (s.sort === "price-desc" ? " selected" : "") + '>Precio más alto</option>' +
                    '<option value="date-asc"' + (s.sort === "date-asc" ? " selected" : "") + '>Disponibilidad más próxima</option>' +
                  '</select>' +
                '</div>' +
              '</div>' +
            '</div>' +

            (filtered.length === 0
              ? UI.emptyState({
                  icon: "search",
                  title: "No hemos encontrado habitaciones con estos filtros",
                  body: "Prueba a ampliar el rango de presupuesto, cambiar de barrio en Madrid o crea una alerta personalizada para recibir un aviso en cuanto quede libre una habitación compatible.",
                  action:
                    '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
                      '<button class="btn btn-outline" type="button" data-action="reset-filters">Limpiar filtros</button>' +
                      '<button class="btn btn-primary" type="button" data-action="open-alert">' + UI.icon("bell") + 'Crear alerta de disponibilidad</button>' +
                    '</div>'
                })
              : '<div class="search-split' + (mapEnabled ? " has-map" : "") + '">' +
                  '<div class="rooms-grid">' +
                    filtered.map((r) => UI.roomCard(r)).join("") +
                  '</div>' +
                  mapColumn +
                '</div>') +
          '</div>' +
        '</div>' +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     3. DETALLE DE HABITACIÓN (#room-detail)
     ======================================================================== */
  roomDetail() {
    const id = Store.state.route.params.id || "HAB-001";
    const room = Store.room(id) || Store.state.rooms[0];
    const apt = APARTMENTS[room.apt] || APARTMENTS["Apt. Velázquez 42"];
    const activeIdx = Store.state.route.params.photoIndex || 0;
    const photos = room.gallery && room.gallery.length ? room.gallery : gallery(room.main, "room2");
    const activePhoto = photos[activeIdx] || photos[0];

    const amenitiesList = [
      { key: "furnished", icon: "bed", label: "Amueblada completa" },
      { key: "wifi", icon: "wifi", label: "WiFi Fibra 1 Gb" },
      { key: "ac", icon: "snow", label: "Aire acondicionado" },
      { key: "heating", icon: "flame", label: "Calefacción individual" },
      { key: "desk", icon: "desk", label: "Escritorio ergonómico" },
      { key: "wardrobe", icon: "wardrobe", label: "Armario empotrado" },
      { key: "lock", icon: "lock", label: "Cerradura propia" },
      { key: "bath", icon: "bath", label: room.bath === "private" ? "Baño privado en suite" : "Baño compartido (2 baños)" }
    ];

    const body =
      '<div class="container" style="padding-top:24px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
          '<button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-route="search">' + UI.icon("arrowLeft") + 'Volver al listado de habitaciones</button>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<span class="badge is-neutral tabular">Ref. ' + UI.esc(room.id) + '</span>' +
            UI.statusBadge(room.status) +
          '</div>' +
        '</div>' +

        /* Galería Fotográfica + Lightbox Trigger */
        '<div class="detail-gallery">' +
          '<button type="button" class="detail-main-photo" data-action="open-lightbox" data-id="' + room.id + '" data-idx="' + activeIdx + '" aria-label="Ampliar fotografía principal a pantalla completa">' +
            '<img src="' + activePhoto.src + '" alt="' + UI.esc(activePhoto.alt) + '" width="1400" height="933">' +
            '<span class="room-card-flag" style="bottom:14px;top:auto;right:14px">' + UI.icon("image") + ' Ver galería a pantalla completa (' + photos.length + ' fotos)</span>' +
          '</button>' +
          '<div class="detail-thumbs">' +
            photos.slice(1, 5).map((p, idx) => {
              const realIdx = idx + 1;
              return (
                '<button type="button" class="detail-thumb-btn' + (realIdx === activeIdx ? " is-active" : "") + '" data-action="select-photo" data-id="' + room.id + '" data-idx="' + realIdx + '" aria-label="Ver foto ' + (realIdx + 1) + '">' +
                  '<img src="' + p.src + '" alt="' + UI.esc(p.alt) + '" width="700" height="525">' +
                '</button>'
              );
            }).join("") +
          '</div>' +
        '</div>' +

        /* Ficha Principal + Sidebar Sticky */
        '<div class="detail-layout">' +
          '<div class="od-stack" style="--od-gap:28px">' +
            '<div style="border-bottom:1px solid var(--border-subtle);padding-bottom:22px">' +
              '<p style="margin:0 0 6px;color:var(--brand-secondary);font-weight:700;font-size:0.9rem">' +
                UI.icon("pin") + ' ' + UI.esc(room.city) + ' · Barrio de ' + UI.esc(room.area) + ' (' + UI.esc(room.zone) + ') · ' + UI.esc(room.apt) +
              '</p>' +
              '<h1 style="margin:0 0 12px;font-size:clamp(1.65rem,2.6vw,2.25rem);line-height:1.2">' + UI.esc(room.name) + '</h1>' +
              '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">' +
                '<span class="badge is-neutral tabular">' + room.size + ' m² privados</span>' +
                '<span class="badge is-neutral">' + (room.exterior ? "Exterior con luz natural" : "Interior silenciosa") + '</span>' +
                '<span class="badge is-neutral tabular">Estancia mínima: ' + room.minStay + ' meses</span>' +
                '<span class="badge is-neutral tabular">Fianza: 1 mes (' + room.deposit + ' €)</span>' +
              '</div>' +
              '<p style="margin:18px 0 0;font-size:1rem;color:var(--text-secondary);line-height:1.65">' + UI.esc(room.description) + '</p>' +
            '</div>' +

            /* Atributos de la habitación (Icon Grid) */
            '<div>' +
              '<h2 style="margin:0 0 14px;font-size:1.2rem">Equipamiento de la habitación</h2>' +
              '<div class="amenity-grid">' +
                amenitiesList.map((a) => {
                  const enabled = a.key === "bath" ? true : Boolean(room[a.key]);
                  return (
                    '<div class="amenity-item' + (enabled ? "" : " is-off") + '">' +
                      UI.icon(a.icon) +
                      '<span>' + UI.esc(a.label) + '</span>' +
                    '</div>'
                  );
                }).join("") +
              '</div>' +
            '</div>' +

            /* Información del Apartamento + Habitaciones del mismo piso */
            (() => {
              const aptRooms = Store.publishedRooms().filter((r) => r.apt === room.apt);
              const availableAptRooms = aptRooms.filter((r) => r.status === "available");
              const otherAvailable = availableAptRooms.filter((r) => r.id !== room.id);
              const inhabitedAptRooms = aptRooms.filter((r) => r.status !== "available" && r.availableFrom);

              return (
                '<div class="apt-box" id="apt-rooms-section">' +
                  '<div class="apt-box-head">' +
                    '<div>' +
                      '<span class="eyebrow">Vivienda compartida · ' + UI.esc(room.area) + '</span>' +
                      '<h2 style="margin:0;font-size:1.25rem">Sobre el apartamento: ' + UI.esc(room.apt) + '</h2>' +
                    '</div>' +
                    '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
                      '<span class="badge is-ok tabular"><span class="dot" aria-hidden="true"></span>' + availableAptRooms.length + (availableAptRooms.length === 1 ? " habitación disponible ahora" : " habitaciones disponibles ahora") + '</span>' +
                      (inhabitedAptRooms.length > 0
                        ? '<span class="badge is-soon tabular"><span class="dot" aria-hidden="true"></span>' + inhabitedAptRooms.length + (inhabitedAptRooms.length === 1 ? " habitada con fecha de desalojo" : " habitadas con fecha de desalojo") + '</span>'
                        : "") +
                    '</div>' +
                  '</div>' +

                  '<div class="apt-specs">' +
                    '<div class="apt-spec"><strong class="tabular">' + apt.rooms + ' habitaciones</strong><span>Total en la vivienda (' + aptRooms.length + ' en catálogo)</span></div>' +
                    '<div class="apt-spec"><strong class="tabular">' + apt.baths + ' baños</strong><span>Completos compartidos/suite</span></div>' +
                    '<div class="apt-spec"><strong>' + UI.esc(apt.floor) + '</strong><span>' + (apt.elevator ? "Con ascensor" : "Sin ascensor") + '</span></div>' +
                    '<div class="apt-spec"><strong>Incluida</strong><span>Limpieza zonas comunes</span></div>' +
                  '</div>' +
                  '<p style="margin:0;color:var(--text-secondary)">' + UI.esc(apt.ambience) + '</p>' +

                  /* Bloque de Habitaciones en Alquiler dentro del mismo Apartamento */
                  '<div class="apt-rooms-panel">' +
                    '<div class="apt-rooms-panel-head">' +
                      '<div>' +
                        '<h3 style="margin:0;font-size:1.05rem;font-weight:800;color:var(--text-primary)">' +
                          UI.icon("bed") + ' Habitaciones en alquiler en ' + UI.esc(room.apt) +
                        '</h3>' +
                        '<p style="margin:4px 0 0;font-size:0.84rem;color:var(--text-secondary)">' +
                          (availableAptRooms.length >= 2
                            ? "Este piso cuenta con <strong>" + availableAptRooms.length + " habitaciones disponibles para entrar ya</strong>. Puedes abrir cualquiera de las otras habitaciones en un enlace directo para compararlas o alquilar juntas."
                            : "Consulta el estado de todas las habitaciones de este apartamento, sus precios y próximas fechas de desalojo.") +
                        '</p>' +
                      '</div>' +
                      (otherAvailable.length > 0
                        ? '<span class="apt-multi-highlight">' + UI.icon("sparkles") + ' +' + otherAvailable.length + (otherAvailable.length === 1 ? " otra disponible hoy" : " otras disponibles hoy") + '</span>'
                        : "") +
                    '</div>' +

                    /* Subgrupo 1: Habitaciones disponibles ahora (2 o más) */
                    '<div class="apt-rooms-subgroup">' +
                      '<div class="apt-rooms-subtitle">' +
                        '<span class="dot is-ok"></span>' +
                        '<strong>Disponibles para entrada inmediata (' + availableAptRooms.length + ')</strong>' +
                      '</div>' +
                      '<div class="apt-rooms-list">' +
                        availableAptRooms.map((r) => {
                          const isCurrent = r.id === room.id;
                          return (
                            '<div class="apt-room-item' + (isCurrent ? " is-current" : "") + '">' +
                              '<img class="apt-room-thumb" src="' + IMG[r.main] + '" alt="' + UI.esc(r.name) + '" width="88" height="66">' +
                              '<div class="apt-room-info">' +
                                '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                                  '<span class="badge is-neutral tabular" style="font-size:0.7rem;padding:2px 7px">' + UI.esc(r.id) + '</span>' +
                                  (isCurrent
                                    ? '<span class="badge is-current-room">Estás viendo esta habitación</span>'
                                    : '<span class="badge is-ok"><span class="dot"></span>Disponible ahora</span>') +
                                '</div>' +
                                '<strong class="apt-room-name">' + UI.esc(r.name) + '</strong>' +
                                '<span class="apt-room-meta tabular">' +
                                  r.size + ' m² · ' + (r.bath === "private" ? "Baño privado en suite" : "Baño compartido") + ' · ' + (r.exterior ? "Exterior" : "Interior") + ' · Entrada hoy' +
                                '</span>' +
                              '</div>' +
                              '<div class="apt-room-cta">' +
                                '<div class="apt-room-price tabular"><strong>' + UI.num(r.price) + ' €</strong><span>/mes</span></div>' +
                                (isCurrent
                                  ? '<span class="apt-current-pill">' + UI.icon("check") + ' Ficha actual</span>'
                                  : '<a class="btn btn-primary btn-sm apt-ext-link" href="?room=' + r.id + '#room-detail" target="_blank" rel="noopener" data-action="open-room-external" data-id="' + r.id + '">' +
                                      'Ir a esta habitación ' + UI.icon("external") +
                                    '</a>') +
                              '</div>' +
                            '</div>'
                          );
                        }).join("") +
                      '</div>' +
                    '</div>' +

                    /* Subgrupo 2: Habitaciones ya habitadas con fecha de desalojo disponible */
                    (inhabitedAptRooms.length > 0
                      ? '<div class="apt-rooms-subgroup is-inhabited-group">' +
                          '<div class="apt-rooms-subtitle">' +
                            '<span class="dot is-soon"></span>' +
                            '<strong>Habitaciones ya habitadas con fecha de desalojo prevista (' + inhabitedAptRooms.length + ')</strong>' +
                          '</div>' +
                          '<div class="apt-rooms-list">' +
                            inhabitedAptRooms.map((r) => {
                              const isCurrent = r.id === room.id;
                              const daysLeft = UI.daysUntil(r.availableFrom);
                              return (
                                '<div class="apt-room-item is-inhabited' + (isCurrent ? " is-current" : "") + '">' +
                                  '<img class="apt-room-thumb" src="' + IMG[r.main] + '" alt="' + UI.esc(r.name) + '" width="88" height="66">' +
                                  '<div class="apt-room-info">' +
                                    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                                      '<span class="badge is-neutral tabular" style="font-size:0.7rem;padding:2px 7px">' + UI.esc(r.id) + '</span>' +
                                      '<span class="badge ' + (r.status === "upcoming" ? "is-soon" : "is-off") + '">' +
                                        '<span class="dot"></span>' +
                                        (r.status === "upcoming" ? "Habitada · Próximo desalojo" : "Habitada actualmente") +
                                      '</span>' +
                                      (isCurrent ? '<span class="badge is-current-room">Estás viendo esta habitación</span>' : "") +
                                    '</div>' +
                                    '<strong class="apt-room-name">' + UI.esc(r.name) + '</strong>' +
                                    '<div class="apt-eviction-banner tabular">' +
                                      UI.icon("calendar") +
                                      '<span>Fecha de desalojo confirmada: <strong>' + UI.dateShort(r.availableFrom) + '</strong>' +
                                        (daysLeft != null && daysLeft > 0 ? " (queda libre en " + daysLeft + " días)" : "") +
                                      '</span>' +
                                    '</div>' +
                                    '<span class="apt-room-meta tabular">' +
                                      r.size + ' m² · ' + (r.bath === "private" ? "Baño privado" : "Baño compartido") + ' · Estancia mín. ' + r.minStay + ' meses' +
                                    '</span>' +
                                  '</div>' +
                                  '<div class="apt-room-cta">' +
                                    '<div class="apt-room-price tabular"><strong>' + UI.num(r.price) + ' €</strong><span>/mes</span></div>' +
                                    '<div class="apt-room-cta-btns">' +
                                      '<button class="btn btn-accent btn-sm" type="button" data-action="open-alert" data-id="' + r.id + '">' +
                                        UI.icon("bell") + 'Avísame al desalojar' +
                                      '</button>' +
                                      (!isCurrent
                                        ? '<a class="btn btn-outline btn-sm apt-ext-link" href="?room=' + r.id + '#room-detail" target="_blank" rel="noopener" data-action="open-room-external" data-id="' + r.id + '" title="Abrir ficha de ' + UI.esc(r.name) + '">' +
                                            'Ver ficha ' + UI.icon("external") +
                                          '</a>'
                                        : "") +
                                    '</div>' +
                                  '</div>' +
                                '</div>'
                              );
                            }).join("") +
                          '</div>' +
                        '</div>'
                      : "") +
                  '</div>' +
                '</div>'
              );
            })() +

            /* Ubicación Aproximada y Metro */
            '<div class="apt-box">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">' +
                '<div>' +
                  '<span class="eyebrow">Entorno y transporte</span>' +
                  '<h2 style="margin:0;font-size:1.25rem">Ubicación aproximada en ' + UI.esc(room.area) + ' (' + UI.esc(room.zone) + ')</h2>' +
                '</div>' +
                '<span class="badge is-neutral">' + UI.icon("shield") + ' Círculo de privacidad activo</span>' +
              '</div>' +
              '<p style="margin:0;font-size:0.88rem;color:var(--text-muted)">Por privacidad de los inquilinos actuales mostramos un radio aproximado de 250 m. Facilitamos el portal y piso exacto al confirmar la visita.</p>' +
              '<div style="height:210px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--border-subtle);position:relative;background:#E5ECE8">' +
                '<svg viewBox="0 0 600 210" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">' +
                  '<rect width="600" height="210" fill="#E4ECE8"/>' +
                  '<path d="M0 60 L600 140 M120 0 L180 210 M380 0 L340 210 M0 165 L600 40" stroke="#F6F7F4" stroke-width="10" fill="none"/>' +
                  '<circle cx="300" cy="105" r="56" fill="rgba(35, 75, 64, 0.16)" stroke="#234B40" stroke-width="2" stroke-dasharray="6 4"/>' +
                  '<circle cx="300" cy="105" r="7" fill="#234B40"/>' +
                '</svg>' +
              '</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:10px">' +
                apt.metro.map((m) => '<span class="badge is-neutral">' + UI.icon("pin") + ' ' + UI.esc(m) + '</span>').join("") +
              '</div>' +
            '</div>' +
          '</div>' +

          /* Columna Derecha Sticky: Formulario de Solicitud de Información */
          '<aside class="sticky-lead-card" aria-label="Solicitud de información y visita">' +
            '<div style="display:flex;align-items:baseline;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid var(--border-subtle)">' +
              '<div>' +
                '<p class="price"><strong style="font-size:1.75rem" class="tabular">' + UI.num(room.price) + ' €</strong><span>/mes</span></p>' +
                '<span style="font-size:0.78rem;color:var(--text-muted)">' + UI.esc(room.expensesNote) + '</span>' +
              '</div>' +
              UI.statusCompact(room.status) +
            '</div>' +

            '<div style="background:var(--bg-primary);padding:10px 12px;border-radius:var(--radius-sm);font-size:0.84rem;display:flex;justify-content:space-between">' +
              '<span>Fecha de entrada:</span>' +
              '<strong class="tabular">' + (room.status === "available" ? "Disponible hoy (" + UI.dateShort(room.availableFrom) + ")" : UI.dateShort(room.availableFrom)) + '</strong>' +
            '</div>' +

            '<button type="button" class="btn btn-outline" style="width:100%;justify-content:center;border-radius:999px;font-weight:700" data-action="open-tenant-req-modal" data-id="' + room.id + '">' +
              UI.icon("shield") + ' Requisitos para el inquilino' +
            '</button>' +

            '<form id="room-lead-form" class="od-stack" style="--od-gap:12px" onsubmit="return false">' +
              '<input type="hidden" id="lead-room-id" value="' + UI.esc(room.id) + '">' +
              UI.field({ id: "lead-name", label: "Nombre y apellidos", required: true, placeholder: "Ej. Sofía Martín" }) +
              UI.field({ id: "lead-email", label: "Correo electrónico", type: "email", required: true, placeholder: "sofia@ejemplo.es" }) +
              UI.field({ id: "lead-phone", label: "Teléfono (opcional)", type: "tel", placeholder: "+34 600 000 000" }) +
              UI.field({ id: "lead-date", label: "Fecha prevista de entrada", type: "date", required: true, value: room.availableFrom }) +
              UI.field({
                id: "lead-msg",
                label: "Mensaje para el equipo de HABITIA",
                type: "textarea",
                rows: 3,
                required: true,
                placeholder: "Cuéntanos brevemente a qué te dedicas y cuándo te vendría bien ver la habitación..."
              }) +
              '<label class="check-row" style="align-items:flex-start">' +
                '<input type="checkbox" id="lead-rgpd">' +
                '<span style="font-size:0.78rem;color:var(--text-secondary)">Acepto la <button type="button" class="link-btn" style="color:var(--brand-primary);font-weight:700;border:0;background:none;padding:0;text-decoration:underline" data-action="nav" data-route="legal">Política de Privacidad</button> y el tratamiento de mis datos para gestionar esta solicitud.</span>' +
              '</label>' +
              '<p class="field-error" id="lead-rgpd-error" hidden></p>' +
              '<button class="btn btn-primary btn-lg" type="button" data-action="submit-room-lead">Solicitar visita o información</button>' +
              '<p style="margin:0;font-size:0.76rem;color:var(--text-muted);text-align:center">Sin comisiones sorpresa · La consulta pasa al instante al CRM del Panel Admin</p>' +
            '</form>' +
          '</aside>' +
        '</div>' +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     4. VISTA PRÓXIMAS DISPONIBILIDADES (#upcoming)
     ======================================================================== */
  upcoming() {
    const horizon = Store.state.upcomingFilter || "all";
    const rooms = Store.publishedRooms().filter((r) => r.status !== "occupied");
    const filtered = rooms.filter((r) => {
      const days = UI.daysUntil(r.availableFrom) || 0;
      if (horizon === "now") return r.status === "available" || days <= 0;
      if (horizon === "7") return days > 0 && days <= 7;
      if (horizon === "30") return days > 0 && days <= 30;
      if (horizon === "60") return days > 0 && days <= 60;
      if (horizon === "later") return days > 60;
      return true;
    });

    const tabs = [
      { id: "all", label: "Todas (" + rooms.length + ")" },
      { id: "now", label: "Disponible ahora" },
      { id: "7", label: "Próximos 7 días" },
      { id: "30", label: "Próximos 30 días" },
      { id: "60", label: "Próximos 60 días" },
      { id: "later", label: "Más adelante" }
    ];

    const body =
      '<div class="container" style="padding:36px 24px 64px">' +
        '<div class="section-head">' +
          '<div>' +
            '<span class="eyebrow">' + UI.icon("clock") + ' Calendario público de vacantes</span>' +
            '<h1 style="margin:0;font-size:clamp(1.6rem,2.6vw,2.25rem)">Próximas disponibilidades en Madrid</h1>' +
            '<p>Consulta qué habitaciones están listas hoy y cuáles se liberan en las próximas semanas con cuenta atrás exacta.</p>' +
          '</div>' +
          '<button class="btn btn-accent" type="button" data-action="nav" data-route="alerts">' + UI.icon("bell") + 'Crear alerta por fecha</button>' +
        '</div>' +

        '<div class="tabs-bar" style="margin-bottom:28px">' +
          tabs.map((t) =>
            '<button type="button" class="tab-pill' + (horizon === t.id ? " is-active" : "") + '" data-action="set-upcoming-filter" data-horizon="' + t.id + '">' +
              UI.esc(t.label) +
            '</button>'
          ).join("") +
        '</div>' +

        (filtered.length === 0
          ? UI.emptyState({
              icon: "calendar",
              title: "No hay liberaciones en este tramo temporal",
              body: "Puedes seleccionar otro horizonte o activar una alerta automática para tu fecha de entrada.",
              action: '<button class="btn btn-outline" type="button" data-action="set-upcoming-filter" data-horizon="all">Ver todas las fechas</button>'
            })
          : '<div class="rooms-grid">' +
              filtered.map((r) => {
                const days = UI.daysUntil(r.availableFrom);
                const pill = days <= 0
                  ? "Entrada inmediata · Hoy"
                  : "Queda libre en " + days + " días — " + UI.dateMonth(r.availableFrom);
                return UI.roomCard(r, { packageHint: pill });
              }).join("") +
            '</div>') +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     5. LANDINGS SEO DE CIUDAD Y BARRIO (#location)
     ======================================================================== */
  location() {
    const selectedArea = Store.state.selectedLocation || "Chamberí";
    const nbr = NEIGHBOURHOODS.find((n) => n.name === selectedArea) || NEIGHBOURHOODS[0];
    const areaRooms = Store.publishedRooms().filter((r) => r.area === nbr.name || (nbr.city === "Valencia" && r.city === "Valencia"));
    const avgPrice = areaRooms.length
      ? Math.round(areaRooms.reduce((acc, r) => acc + r.price, 0) / areaRooms.length)
      : 645;

    const body =
      '<div class="container" style="padding:32px 24px 64px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:20px">' +
          '<div>' +
            '<span class="eyebrow">Guía residencial & Landings SEO ' + UI.featureBadge("seo") + '</span>' +
            '<h1 style="margin:0;font-size:clamp(1.6rem,2.6vw,2.2rem)">Vivir en ' + UI.esc(nbr.city) + ' · Barrio de ' + UI.esc(nbr.name) + '</h1>' +
          '</div>' +
          '<div class="tabs-bar" style="border:0;padding:0">' +
            NEIGHBOURHOODS.map((n) =>
              '<button type="button" class="tab-pill' + (n.name === nbr.name ? " is-active" : "") + '" data-action="select-location" data-area="' + UI.esc(n.name) + '">' +
                UI.esc(n.name) +
              '</button>'
            ).join("") +
          '</div>' +
        '</div>' +

        '<div class="panel-card" style="margin-bottom:32px">' +
          '<div class="grid-2" style="gap:0;align-items:stretch">' +
            '<div style="aspect-ratio:16/10;background:var(--bg-muted)">' +
              '<img src="' + nbr.img + '" alt="' + UI.esc(nbr.alt) + '" width="1200" height="800" style="width:100%;height:100%;object-fit:cover">' +
            '</div>' +
            '<div class="location-hero-body">' +
              '<span class="badge is-neutral" style="width:fit-content">Zonas: ' + UI.esc(nbr.zones) + '</span>' +
              '<h2 style="margin:0;font-size:1.6rem">Alquiler de habitaciones en ' + UI.esc(nbr.name) + '</h2>' +
              '<p style="margin:0;color:var(--text-secondary)">' + UI.esc(nbr.desc) + '</p>' +
              '<div class="grid-3" style="gap:12px;padding-top:8px">' +
                '<div class="apt-spec"><strong class="tabular">' + avgPrice + ' €/mes</strong><span>Precio medio zona</span></div>' +
                '<div class="apt-spec"><strong>26 – 35 años</strong><span>Perfil convivencia</span></div>' +
                '<div class="apt-spec"><strong>L1 · L4 · L7 · L10</strong><span>Conexión Metro</span></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="section-head">' +
          '<h2>Habitaciones disponibles y próximas en ' + UI.esc(nbr.name) + ' (' + areaRooms.length + ')</h2>' +
          '<button class="btn btn-outline btn-sm" type="button" data-action="nav" data-route="search">Ver todo el catálogo de Madrid</button>' +
        '</div>' +

        (areaRooms.length === 0
          ? UI.emptyState({
              icon: "pin",
              title: "Expansión prevista en " + nbr.name,
              body: "Estamos incorporando nuevos pisos en esta zona. Déjanos una alerta y te avisaremos antes de la publicación oficial.",
              action: '<button class="btn btn-primary" type="button" data-action="nav" data-route="alerts">Crear alerta para ' + UI.esc(nbr.name) + '</button>'
            })
          : '<div class="rooms-grid">' + areaRooms.map((r) => UI.roomCard(r)).join("") + '</div>') +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     6. SUSCRIPCIÓN A ALERTAS DE DISPONIBILIDAD (#alerts)
     ======================================================================== */
  alerts() {
    const body =
      '<div class="container" style="padding:40px 24px 64px;max-width:960px">' +
        '<div class="panel-card">' +
          '<div class="panel-card-head">' +
            '<div>' +
              '<span class="eyebrow">Captación recurrente de inquilinos</span>' +
              '<h1 style="margin:0;font-size:1.5rem">Servicio de alertas de disponibilidad</h1>' +
            '</div>' +
            UI.featureBadge("alerts") +
          '</div>' +
          '<div class="panel-card-body">' +
            '<p style="margin:0 0 24px;color:var(--text-secondary)">Configura tus preferencias de barrio, presupuesto y fecha de entrada. Cuando una habitación de nuestro inventario pase a estado <strong>Disponible</strong> o <strong>Próxima disponibilidad (15 días antes)</strong>, recibirás un aviso automático en tu correo.</p>' +
            '<form id="public-alert-form" class="od-stack" style="--od-gap:16px" onsubmit="return false">' +
              '<div class="grid-2">' +
                UI.field({ id: "al-email", label: "Correo electrónico", type: "email", required: true, placeholder: "tu.correo@ejemplo.es" }) +
                UI.field({
                  id: "al-city",
                  label: "Ciudad preferida",
                  type: "select",
                  required: true,
                  options: '<option value="Madrid">Madrid</option><option value="Valencia">Valencia</option><option value="Málaga">Málaga</option>'
                }) +
              '</div>' +
              '<div class="grid-3">' +
                UI.field({
                  id: "al-area",
                  label: "Barrio o zona",
                  type: "select",
                  options:
                    '<option value="Chamberí">Chamberí (Trafalgar / Almagro)</option>' +
                    '<option value="Salamanca">Salamanca (Goya / Lista)</option>' +
                    '<option value="Malasaña">Malasaña / Universidad</option>' +
                    '<option value="Argüelles">Argüelles / Moncloa</option>' +
                    '<option value="Lavapiés">Lavapiés / Embajadores</option>' +
                    '<option value="Cualquier barrio">Cualquier barrio céntrico</option>'
                }) +
                UI.field({ id: "al-budget", label: "Presupuesto máximo (€/mes)", type: "number", required: true, value: "700", min: 400, max: 1200, step: 25 }) +
                UI.field({ id: "al-date", label: "Fecha de entrada deseada", type: "date", required: true, value: isoInDays(15) }) +
              '</div>' +
              '<label class="check-row">' +
                '<input type="checkbox" id="al-rgpd" checked>' +
                '<span style="font-size:0.84rem;color:var(--text-secondary)">Acepto recibir notificaciones automáticas de disponibilidad según la Política de Privacidad de HABITIA.</span>' +
              '</label>' +
              '<div style="display:flex;justify-content:flex-end;gap:12px">' +
                '<button class="btn btn-primary btn-lg" type="button" data-action="submit-public-alert">' + UI.icon("bell") + 'Activar alerta de disponibilidad</button>' +
              '</div>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     7. CONTACTO Y PREGUNTAS FRECUENTES (#contact)
     ======================================================================== */
  contact() {
    const faqs = [
      { q: "¿Qué incluyen los gastos mensuales?", a: "Dependiendo del apartamento, los suministros (luz, agua, gas, WiFi fibra 1 Gb y limpieza semanal de zonas comunes) están incluidos en el precio cerrado o tienen una cuota fija mensual de entre 40 € y 45 € sin sorpresas." },
      { q: "¿Cuál es la estancia mínima y la fianza?", a: "La estancia mínima habitual es de 3 a 6 meses según la habitación, y la fianza legal es de 1 mensualidad que se devuelve al finalizar el contrato tras revisar la habitación." },
      { q: "¿Necesito registrarme en la web para reservar o visitar?", a: "No. Puedes enviar tu consulta directamente desde la ficha de cada habitación y nuestro equipo comercial de Madrid te contactará en menos de 24 horas laborables." },
      { q: "¿Se puede visitar el piso antes de reservar?", a: "Sí, organizamos visitas presenciales de lunes a viernes y videollamadas en directo para quienes se trasladan a Madrid desde otra ciudad." }
    ];

    const body =
      '<div class="container" style="padding:36px 24px 64px">' +
        '<div class="grid-2" style="gap:32px;align-items:start">' +
          '<div class="od-stack" style="--od-gap:20px">' +
            '<div>' +
              '<span class="eyebrow">Atención al inquilino y propietarios</span>' +
              '<h1 style="margin:0 0 8px;font-size:2rem">Contacta con HABITIA Madrid</h1>' +
              '<p style="margin:0;color:var(--text-secondary)">Nuestro equipo gestiona directamente cada edificio y piso compartido en Madrid.</p>' +
            '</div>' +
            '<div class="panel-card"><div class="panel-card-body od-stack" style="--od-gap:10px">' +
              '<strong>' + UI.icon("pin") + ' Oficina Central (Barrio de Salamanca)</strong>' +
              '<span style="color:var(--text-secondary)">Calle de Velázquez 42, Planta 1 · 28001 Madrid</span>' +
              '<strong>' + UI.icon("clock") + ' Horario de atención y visitas</strong>' +
              '<span style="color:var(--text-secondary)">Lunes a Viernes de 09:30 a 19:30 · Sábados con cita previa</span>' +
              '<strong>' + UI.icon("mail") + ' Contacto directo</strong>' +
              '<span style="color:var(--text-secondary)">hola@habitia.es · +34 910 482 100</span>' +
            '</div></div>' +

            '<h2 style="margin:12px 0 0;font-size:1.35rem">Preguntas frecuentes (FAQ)</h2>' +
            faqs.map((f) =>
              '<div class="panel-card"><div class="panel-card-body">' +
                '<h3 style="margin:0 0 6px;font-size:1rem">' + UI.esc(f.q) + '</h3>' +
                '<p style="margin:0;color:var(--text-secondary);font-size:0.9rem">' + UI.esc(f.a) + '</p>' +
              '</div></div>'
            ).join("") +
          '</div>' +

          '<div class="panel-card">' +
            '<div class="panel-card-head"><h3>Envíanos una consulta general</h3></div>' +
            '<div class="panel-card-body">' +
              '<form id="contact-general-form" class="od-stack" style="--od-gap:14px" onsubmit="return false">' +
                UI.field({ id: "ct-name", label: "Nombre completo", required: true, placeholder: "Tu nombre" }) +
                UI.field({ id: "ct-email", label: "Correo electrónico", type: "email", required: true, placeholder: "nombre@correo.es" }) +
                UI.field({ id: "ct-phone", label: "Teléfono", type: "tel", placeholder: "+34 600 000 000" }) +
                UI.field({ id: "ct-msg", label: "¿En qué podemos ayudarte?", type: "textarea", rows: 4, required: true, placeholder: "Indícanos qué zona de Madrid buscas o para qué fecha..." }) +
                '<button class="btn btn-primary btn-lg" type="button" data-action="submit-contact-form">Enviar mensaje</button>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     8. TEXTOS LEGALES (#legal)
     ======================================================================== */
  legal() {
    const tab = Store.state.route.params.tab || "privacy";
    const body =
      '<div class="container" style="padding:36px 24px 64px;max-width:900px">' +
        '<div class="tabs-bar" style="margin-bottom:24px">' +
          '<button type="button" class="tab-pill' + (tab === "privacy" ? " is-active" : "") + '" data-action="nav" data-route="legal" data-tab="privacy">Política de Privacidad y RGPD</button>' +
          '<button type="button" class="tab-pill' + (tab === "cookies" ? " is-active" : "") + '" data-action="nav" data-route="legal" data-tab="cookies">Política de Cookies</button>' +
        '</div>' +
        '<div class="panel-card"><div class="panel-card-body od-stack" style="--od-gap:14px">' +
          (tab === "privacy"
            ? '<h1 style="margin:0;font-size:1.6rem">Política de Privacidad (RGPD)</h1>' +
              '<p><strong>Responsable del tratamiento:</strong> Avenew Real Estate S.L. (operando bajo la marca comercial HABITIA Madrid), con domicilio en Calle de Velázquez 42, 28001 Madrid.</p>' +
              '<p><strong>Finalidad:</strong> Gestionar las solicitudes de información sobre habitaciones en alquiler, programar visitas comerciales y, en caso de suscripción expresa, remitir avisos automatizados de disponibilidad.</p>' +
              '<p><strong>Legitimación:</strong> Consentimiento expreso del interesado al marcar la casilla correspondiente en los formularios de consulta o alerta.</p>' +
              '<p><strong>Derechos:</strong> Acceso, rectificación, supresión, oposición y portabilidad escribiendo a privacidad@habitia.es.</p>'
            : '<h1 style="margin:0;font-size:1.6rem">Política de Cookies</h1>' +
              '<p>Esta plataforma web utiliza cookies técnicas estrictamente necesarias para el funcionamiento del buscador de habitaciones, el mantenimiento de filtros de sesión y el acceso seguro al panel administrativo.</p>' +
              '<p>No se instalan cookies publicitarias de terceros sin el consentimiento previo del usuario.</p>') +
        '</div></div>' +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     9. ACCESO A PORTAL DEL INQUILINO — PASSWORDLESS (#login-tenant)
     ======================================================================== */
  loginTenant() {
    const email = Store.state.tenantEmail || "laura.gomez@gmail.com";
    const sent = Boolean(Store.state.magicLinkSent);

    const body =
      '<div class="container" style="padding:48px 24px 72px;max-width:620px">' +
        '<div class="panel-card" style="box-shadow:var(--shadow-md)">' +
          '<div class="panel-card-head" style="background:var(--bg-primary)">' +
            '<div style="display:flex;align-items:center;gap:10px">' +
              '<span class="brand-mark">H</span>' +
              '<div>' +
                '<strong style="display:block;font-size:0.95rem">Mi espacio HABITIA</strong>' +
                '<span style="font-size:0.76rem;color:var(--text-muted)">Portal Privado del Inquilino · Acceso sin contraseña</span>' +
              '</div>' +
            '</div>' +
            UI.featureBadge("portal") +
          '</div>' +
          '<div class="panel-card-body od-stack" style="--od-gap:18px">' +
            '<div>' +
              '<span class="eyebrow">' + UI.icon("sparkles") + ' Autenticación Passwordless</span>' +
              '<h1 style="margin:0 0 8px;font-size:1.55rem">Accede con un enlace mágico en tu correo</h1>' +
              '<p style="margin:0;color:var(--text-secondary);font-size:0.92rem">Sin contraseñas que recordar ni registros complejos. Introduce el correo electrónico con el que enviaste tu solicitud de habitación y te enviaremos un enlace directo a tu espacio privado.</p>' +
            '</div>' +

            '<form id="tenant-magic-form" class="od-stack" style="--od-gap:14px" onsubmit="return false">' +
              UI.field({
                id: "magic-email",
                label: "Correo electrónico de tu solicitud",
                type: "email",
                required: true,
                value: email,
                placeholder: "laura.gomez@gmail.com",
                hint: "Demo precargada con el perfil de Laura Gómez (Solicitante de Habitación 24 · Velázquez 42)."
              }) +
              '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
                '<button class="btn btn-primary btn-lg" style="flex:1" type="button" data-action="send-magic-link">' +
                  UI.icon("mail") + 'Enviar enlace mágico de acceso' +
                '</button>' +
                '<button class="btn btn-outline btn-lg" type="button" data-action="enter-tenant-portal">' +
                  'Entrar directo (Demo) →' +
                '</button>' +
              '</div>' +
            '</form>' +

            (sent
              ? '<div class="magic-link-preview" role="region" aria-label="Simulación de correo recibido">' +
                  '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">' +
                    '<span class="badge is-ok">' + UI.icon("check") + ' Enlace mágico enviado a ' + UI.esc(email) + '</span>' +
                    '<span style="font-size:0.75rem;color:var(--text-muted)">Validez: 24 horas</span>' +
                  '</div>' +
                  '<p style="margin:0 0 12px;font-size:0.86rem;color:var(--text-secondary)"><strong>Simulación de bandeja de entrada:</strong> Haz clic en el botón del correo simulado para abrir tu sesión sin contraseña en <em>Mi espacio HABITIA</em>.</p>' +
                  '<button class="btn btn-accent" style="width:100%" type="button" data-action="enter-tenant-portal">' +
                    UI.icon("sparkles") + 'Abrir enlace mágico → Entrar a Mi espacio HABITIA como Laura' +
                  '</button>' +
                '</div>'
              : "") +

            '<div style="padding-top:12px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:0.82rem;color:var(--text-muted)">' +
              '<span>¿Aún no has solicitado habitación?</span>' +
              '<button class="link-btn" style="background:none;border:0;color:var(--brand-primary);font-weight:700;padding:0" type="button" data-action="nav" data-route="search">Explorar catálogo de Madrid →</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    return this.wrap(body);
  },

  /* ========================================================================
     10. PORTAL PRIVADO DEL INQUILINO ("Mi espacio HABITIA" — #tenant-portal)
     ======================================================================== */
  tenantPortal() {
    const lead = Store.tenantLead();
    const room = Store.room(lead.roomId) || Store.room("HAB-024") || Store.state.rooms[0];
    const firstName = (lead.name || "Laura").split(" ")[0];
    const alternatives = Store.publishedRooms()
      .filter((r) => r.id !== room.id && r.status !== "occupied")
      .slice(0, 3);
    const messages = Array.isArray(lead.messages) ? lead.messages : [];
    const pkgLocked = !Store.included("portal");

    const pkgNotice = pkgLocked
      ? '<div style="background:var(--brand-accent-soft);border:1px solid var(--brand-accent);border-radius:var(--radius-md);padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            UI.icon("sparkles") +
            '<span><strong>«Mi espacio HABITIA» (Portal Privado del Inquilino Passwordless)</strong> pertenece al paquete <strong>COMPLETE (9.000 €)</strong>. Actualmente estás simulando el paquete <strong>' + Store.pkgName().toUpperCase() + '</strong>.</span>' +
          '</div>' +
          '<button class="btn btn-accent btn-sm" type="button" data-action="set-pkg" data-pkg="complete">Simular paquete COMPLETE (9.000 €)</button>' +
        '</div>'
      : "";

    const statusBadgeCls = lead.status === "visita"
      ? "is-ok"
      : lead.status === "cerrada"
        ? "is-ok"
        : lead.status === "nueva"
          ? "is-soon"
          : "is-neutral";

    const body =
      '<div class="container" style="padding:32px 24px 72px">' +
        pkgNotice +

        /* Cabecera de Bienvenida del Portal */
        '<div class="tenant-hero-bar">' +
          '<div>' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">' +
              '<span class="badge is-neutral">' + UI.icon("shield") + ' Sesión Passwordless activa · ' + UI.esc(lead.email) + '</span>' +
              UI.featureBadge("portal") +
            '</div>' +
            '<h1 style="margin:0;font-size:clamp(1.55rem,2.5vw,2.15rem)">Hola, ' + UI.esc(firstName) + '. Aquí puedes consultar el estado de tus solicitudes.</h1>' +
            '<p style="margin:4px 0 0;color:var(--text-secondary)">Espacio sincronizado en tiempo real con el equipo comercial y el Inbox Omnicanal de HABITIA Madrid.</p>' +
          '</div>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
            '<button class="btn btn-outline btn-sm" type="button" data-action="open-lead-in-inbox" data-id="' + lead.id + '">' +
              UI.icon("inbox") + 'Ver este hilo en el Inbox del Gestor →' +
            '</button>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-route="login-tenant">Cambiar correo</button>' +
          '</div>' +
        '</div>' +

        '<div class="tenant-grid">' +
          /* Columna Izquierda: Tarjeta de Estado de Solicitud + Cita + Acciones */
          '<div class="od-stack" style="--od-gap:24px">' +
            '<section class="panel-card" aria-label="Estado de tu solicitud actual">' +
              '<div class="panel-card-head">' +
                '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
                  '<h3>Estado de tu solicitud</h3>' +
                  '<span class="badge is-neutral tabular">Expediente ' + UI.esc(lead.id) + '</span>' +
                '</div>' +
                '<span class="badge ' + statusBadgeCls + '"><span class="dot"></span>' + UI.esc(LEAD_STATUS[lead.status] || "Visita programada") + '</span>' +
              '</div>' +

              '<div class="panel-card-body od-stack" style="--od-gap:20px">' +
                /* Habitación solicitada */
                '<div class="tenant-room-summary">' +
                  '<img src="' + IMG[room.main] + '" alt="' + UI.esc(room.name) + '" width="180" height="135">' +
                  '<div class="od-stack" style="--od-gap:6px;flex:1;min-width:0">' +
                    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                      '<span class="badge is-neutral tabular">Ref. ' + UI.esc(room.id) + '</span>' +
                      '<span style="font-size:0.82rem;font-weight:700;color:var(--brand-secondary)">' + UI.icon("pin") + ' ' + UI.esc(room.apt) + ' · ' + UI.esc(room.area) + '</span>' +
                    '</div>' +
                    '<h2 style="margin:0;font-size:1.25rem">Habitación 24, Velázquez · ' + UI.num(room.price) + ' €/mes</h2>' +
                    '<p style="margin:0;font-size:0.86rem;color:var(--text-secondary)">' + UI.esc(room.name) + ' · ' + room.size + ' m² · ' + UI.esc(room.expensesNote) + '</p>' +
                    '<div style="padding-top:4px">' +
                      '<button class="btn btn-ghost btn-sm" style="padding-left:0" type="button" data-action="open-room" data-id="' + room.id + '">Ver ficha completa de la habitación →</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +

                /* Stepper de progreso de la solicitud */
                '<div class="tenant-steps" role="list" aria-label="Progreso de la solicitud">' +
                  '<div class="tenant-step is-done" role="listitem"><span class="step-dot">' + UI.icon("check") + '</span><div><strong>1. Solicitud recibida</strong><span>Formulario web validado</span></div></div>' +
                  '<div class="tenant-step is-done" role="listitem"><span class="step-dot">' + UI.icon("check") + '</span><div><strong>2. Revisión comercial</strong><span>Canal WhatsApp/Email activo</span></div></div>' +
                  '<div class="tenant-step is-current" role="listitem"><span class="step-dot">' + UI.icon("calendar") + '</span><div><strong>3. Visita programada</strong><span class="tabular">' + UI.esc(lead.appointment || "12 de noviembre · 17:30") + '</span></div></div>' +
                  '<div class="tenant-step" role="listitem"><span class="step-dot">4</span><div><strong>4. Reserva y firma</strong><span>Contrato digital</span></div></div>' +
                '</div>' +

                /* Recuadro de Cita Programada */
                '<div class="tenant-appointment-box">' +
                  '<div style="display:flex;align-items:flex-start;gap:14px">' +
                    '<span class="appointment-icon">' + UI.icon("calendar") + '</span>' +
                    '<div class="od-stack" style="--od-gap:4px">' +
                      '<span style="font-size:0.76rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:var(--brand-primary)">Cita presencial confirmada</span>' +
                      '<strong class="tabular" style="font-size:1.15rem;color:var(--text-primary)">Próxima visita: ' + UI.esc(lead.appointment || "12 de noviembre · 17:30") + '</strong>' +
                      '<span style="font-size:0.85rem;color:var(--text-secondary)">Dirección: Calle de Velázquez 42, 4.º B (Barrio de Salamanca, Madrid) · Gestor asignado: Diego Ruiz</span>' +
                    '</div>' +
                  '</div>' +
                  '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
                    '<button class="btn btn-outline btn-sm" type="button" data-action="open-tenant-reschedule" data-id="' + lead.id + '">' +
                      UI.icon("clock") + 'Solicitar cambio de cita' +
                    '</button>' +
                    '<button class="btn btn-primary btn-sm" type="button" data-action="open-tenant-contact" data-id="' + lead.id + '">' +
                      UI.icon("chat") + 'Contactar con el administrador' +
                    '</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</section>' +

            /* Sugerencia de habitaciones alternativas (Paquete COMPLETE) */
            '<section class="panel-card" aria-label="Habitaciones alternativas sugeridas">' +
              '<div class="panel-card-head">' +
                '<div>' +
                  '<h3>Habitaciones alternativas sugeridas para tu búsqueda</h3>' +
                  '<p style="margin:2px 0 0;font-size:0.82rem;color:var(--text-secondary)">Otras opciones disponibles en Madrid por si deseas visitarlas el mismo día.</p>' +
                '</div>' +
                UI.featureBadge("portal") +
              '</div>' +
              '<div class="panel-card-body">' +
                '<div class="grid-3" style="gap:14px">' +
                  alternatives.map((alt) =>
                    '<div class="alt-room-mini">' +
                      '<img src="' + IMG[alt.main] + '" alt="' + UI.esc(alt.name) + '" width="320" height="240">' +
                      '<div style="padding:12px;display:grid;gap:6px">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                          '<span style="font-size:0.75rem;font-weight:700;color:var(--brand-secondary)">' + UI.esc(alt.area) + '</span>' +
                          '<strong class="tabular" style="font-size:0.92rem;color:var(--brand-primary)">' + alt.price + ' €/mes</strong>' +
                        '</div>' +
                        '<strong class="od-truncate" style="font-size:0.86rem">' + UI.esc(alt.name) + '</strong>' +
                        '<button class="btn btn-outline btn-sm" type="button" data-action="open-room" data-id="' + alt.id + '">Ver ficha</button>' +
                      '</div>' +
                    '</div>'
                  ).join("") +
                '</div>' +
              '</div>' +
            '</section>' +
          '</div>' +

          /* Columna Derecha: Historial de Comunicaciones sincronizado con el Inbox del Administrador */
          '<aside class="panel-card" aria-label="Historial de comunicaciones con el administrador">' +
            '<div class="panel-card-head">' +
              '<div>' +
                '<h3>Historial de comunicaciones</h3>' +
                '<p style="margin:2px 0 0;font-size:0.8rem;color:var(--text-secondary)">Sincronizado con el Inbox Omnicanal (WhatsApp + Email)</p>' +
              '</div>' +
              '<span class="badge is-ok"><span class="dot"></span>En línea</span>' +
            '</div>' +

            '<div class="tenant-timeline-feed">' +
              messages.map((m) => {
                if (m.sender === "system") {
                  return (
                    '<div class="chat-sys-pill">' +
                      UI.icon("calendar") + ' <span>' + UI.esc(m.text) + '</span> · <span class="tabular">' + UI.esc(m.time) + '</span>' +
                    '</div>'
                  );
                }
                const isTenant = m.sender === "tenant";
                const chBadge = m.channel === "whatsapp"
                  ? '<span class="ch-tag is-wa">' + UI.icon("whatsapp") + ' WhatsApp</span>'
                  : '<span class="ch-tag is-mail">' + UI.icon("mail") + ' Email</span>';
                return (
                  '<div class="timeline-msg' + (isTenant ? " is-self" : " is-manager") + '">' +
                    '<div class="timeline-msg-head">' +
                      '<strong>' + (isTenant ? "Tú (" + UI.esc(firstName) + ")" : "Equipo HABITIA Madrid") + '</strong>' +
                      '<div style="display:flex;align-items:center;gap:6px">' +
                        chBadge +
                        '<span class="tabular" style="font-size:0.72rem;color:var(--text-muted)">' + UI.esc(m.time) + '</span>' +
                      '</div>' +
                    '</div>' +
                    '<p style="margin:6px 0 0;font-size:0.88rem;line-height:1.5">' + UI.esc(m.text) + '</p>' +
                  '</div>'
                );
              }).join("") +
            '</div>' +

            '<form class="tenant-quick-reply" onsubmit="return false">' +
              '<label for="tenant-reply-input" style="font-size:0.8rem;font-weight:700;color:var(--text-secondary)">Enviar mensaje rápido al administrador (se recibe en el Inbox Omnicanal):</label>' +
              '<div style="display:flex;gap:8px">' +
                '<input class="input" id="tenant-reply-input" type="text" placeholder="Escribe una consulta sobre tu visita o contrato...">' +
                '<button class="btn btn-primary" type="button" data-action="send-tenant-portal-msg" data-id="' + lead.id + '">' +
                  UI.icon("send") + 'Enviar' +
                '</button>' +
              '</div>' +
            '</form>' +
          '</aside>' +
        '</div>' +
      '</div>';

    return this.wrap(body);
  }
};
