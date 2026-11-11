/* HABITIA — Controlador SPA, Router en cliente y Delegación de Eventos */

const App = {
  init() {
    this.bindEvents();
    this.syncFromHash();
    window.addEventListener("hashchange", () => this.syncFromHash());
    this.render();
  },

  syncFromHash() {
    const searchParams = new URLSearchParams(window.location.search || "");
    const queryRoom = searchParams.get("room");
    const rawHash = (window.location.hash || "#home").replace(/^#/, "");
    const [raw, hashQuery] = rawHash.split("?");
    const hashParams = new URLSearchParams(hashQuery || "");
    const targetRoomId = hashParams.get("id") || queryRoom;

    if (targetRoomId && Store.room(targetRoomId)) {
      this.navigate("room-detail", { id: targetRoomId, photoIndex: 0 }, { skipHash: true });
      return;
    }
    if (!raw) return;
    const validRoutes = [
      "home", "search", "room-detail", "upcoming", "location", "alerts", "contact", "legal",
      "login-tenant", "tenant-portal",
      "admin-login", "admin-dashboard", "admin-rooms", "admin-room-form", "admin-inventory-map", "admin-calendar",
      "admin-inbox", "admin-inquiries", "admin-import", "admin-subscribers", "admin-users", "admin-settings",
      "pricing-pitch"
    ];
    if (validRoutes.includes(raw) && Store.state.route.name !== raw) {
      this.navigate(raw, Store.state.route.params, { skipHash: true });
    }
  },

  navigate(name, params, opts) {
    const options = opts || {};
    let area = "public";
    if (name.startsWith("admin-")) {
      area = "admin";
    } else if (name === "tenant-portal" || name === "login-tenant") {
      area = "tenant";
    } else if (name === "pricing-pitch") {
      area = "pitch";
    }

    Store.state.route = { name, params: params || {} };
    Store.state.area = area;
    Store.state.mobileMenuOpen = false;
    Store.state.drawer = null;

    if (!options.skipHash) {
      try {
        history.replaceState(null, "", "#" + name);
      } catch (e) {
        /* Entornos sandbox sin acceso a history */
      }
    }

    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  render() {
    const demoEl = document.getElementById("demo-bar");
    const shellEl = document.getElementById("shell");
    if (!demoEl || !shellEl) return;

    const prevFilterEl = shellEl.querySelector(".filter-panel");
    const prevFilterScroll = prevFilterEl ? prevFilterEl.scrollTop : 0;

    demoEl.innerHTML = ViewsPitch.demoBar();

    const r = Store.state.route.name;
    let html = "";

    switch (r) {
      case "home":
        html = ViewsPublic.home();
        break;
      case "search":
        html = ViewsPublic.search();
        break;
      case "room-detail":
        html = ViewsPublic.roomDetail();
        break;
      case "upcoming":
        html = ViewsPublic.upcoming();
        break;
      case "location":
        html = ViewsPublic.location();
        break;
      case "alerts":
        html = ViewsPublic.alerts();
        break;
      case "contact":
        html = ViewsPublic.contact();
        break;
      case "legal":
        html = ViewsPublic.legal();
        break;
      case "login-tenant":
        html = ViewsPublic.loginTenant();
        break;
      case "tenant-portal":
        html = ViewsPublic.tenantPortal();
        break;
      case "admin-login":
        html = ViewsAdmin.login();
        break;
      case "admin-dashboard":
        html = ViewsAdmin.dashboard();
        break;
      case "admin-rooms":
        html = ViewsAdmin.rooms();
        break;
      case "admin-room-form":
        html = ViewsAdmin.roomForm();
        break;
      case "admin-inventory-map":
        html = ViewsAdmin.inventoryMap();
        break;
      case "admin-calendar":
        html = ViewsAdmin.calendar();
        break;
      case "admin-inbox":
        html = ViewsAdmin.inbox();
        break;
      case "admin-inquiries":
        html = ViewsAdmin.inquiries();
        break;
      case "admin-import":
        html = ViewsAdmin.importExcel();
        break;
      case "admin-subscribers":
        html = ViewsAdmin.subscribers();
        break;
      case "admin-users":
        html = ViewsAdmin.users();
        break;
      case "admin-settings":
        html = ViewsAdmin.settings();
        break;
      case "pricing-pitch":
        html = ViewsPitch.pricingPitch();
        break;
      default:
        html = ViewsPublic.home();
    }

    shellEl.innerHTML = html;

    if (r === "search" && prevFilterScroll > 0) {
      const nextFilterEl = shellEl.querySelector(".filter-panel");
      if (nextFilterEl) nextFilterEl.scrollTop = prevFilterScroll;
    }

    if (r === "admin-inbox") {
      const chatScroll = document.getElementById("inbox-messages-scroll");
      if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight;
    }
  },

  /* ========================================================================
     DELEGACIÓN GLOBAL DE EVENTOS
     ======================================================================== */
  bindEvents() {
    this._lastWinScrollY = window.scrollY || 0;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY || 0;
        const dy = y - (this._lastWinScrollY || 0);
        this._lastWinScrollY = y;
        if (Store.state.route.name === "search" && dy !== 0) {
          const panel = document.querySelector(".filter-panel");
          if (panel && panel.scrollHeight > panel.clientHeight) {
            panel.scrollTop = Math.max(0, Math.min(panel.scrollHeight - panel.clientHeight, panel.scrollTop + dy));
          }
        }
      },
      { passive: true }
    );

    document.addEventListener("click", (e) => {
      if (Store.state.search.heroAreaOpen && !e.target.closest(".multi-area-dropdown-wrap")) {
        Store.state.search.heroAreaOpen = false;
        this.render();
      }
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (btn.tagName === "A") e.preventDefault();

      switch (action) {
        case "nav": {
          const route = btn.getAttribute("data-route") || "home";
          const tab = btn.getAttribute("data-tab");
          this.navigate(route, tab ? { tab } : {});
          break;
        }

        case "switch-area": {
          const area = btn.getAttribute("data-area");
          if (area === "public") this.navigate("home");
          if (area === "tenant") this.navigate("tenant-portal");
          if (area === "admin") this.navigate("admin-dashboard");
          if (area === "pitch") this.navigate("pricing-pitch");
          break;
        }

        case "set-inv-district": {
          const district = btn.getAttribute("data-district") || "Todos";
          Store.state.inventoryMap.district = district;
          const matchingClusters = Store.buildingClusters();
          if (matchingClusters.length) {
            Store.state.inventoryMap.selectedBuildingId = matchingClusters[0].id;
          }
          Store.state.inventoryMap.selectedUnitId = null;
          Store.state.inventoryMap.editingUnitId = null;
          this.render();
          break;
        }

        case "set-inv-status": {
          const st = btn.getAttribute("data-status") || "all";
          Store.state.inventoryMap.status = st;
          const matchingClusters = Store.buildingClusters();
          if (
            matchingClusters.length &&
            !matchingClusters.some((c) => c.id === Store.state.inventoryMap.selectedBuildingId)
          ) {
            Store.state.inventoryMap.selectedBuildingId = matchingClusters[0].id;
          }
          this.render();
          break;
        }

        case "set-inv-map-mode": {
          const mode = btn.getAttribute("data-mode") || "clusters";
          Store.state.inventoryMap.mode = mode;
          this.render();
          break;
        }

        case "select-map-building": {
          const bldId = btn.getAttribute("data-id");
          Store.state.inventoryMap.selectedBuildingId = bldId;
          Store.state.inventoryMap.selectedUnitId = null;
          Store.state.inventoryMap.editingUnitId = null;
          this.render();
          break;
        }

        case "select-map-unit": {
          const uid = btn.getAttribute("data-uid");
          const bldId = btn.getAttribute("data-building");
          if (bldId) Store.state.inventoryMap.selectedBuildingId = bldId;
          Store.state.inventoryMap.selectedUnitId = uid;
          Store.state.inventoryMap.editingUnitId = uid;
          this.render();
          break;
        }

        case "toggle-edit-map-unit": {
          const uid = btn.getAttribute("data-uid");
          Store.state.inventoryMap.editingUnitId =
            Store.state.inventoryMap.editingUnitId === uid ? null : uid;
          Store.state.inventoryMap.selectedUnitId = uid;
          this.render();
          break;
        }

        case "save-map-unit": {
          const uid = btn.getAttribute("data-uid");
          const stEl = document.getElementById("map-edit-status-" + uid);
          const dateEl = document.getElementById("map-edit-date-" + uid);
          const priceEl = document.getElementById("map-edit-price-" + uid);
          const status = stEl ? stEl.value : "available";
          const contractEnd = dateEl ? dateEl.value : isoInDays(0);
          const price = priceEl ? Number(priceEl.value) : 600;

          const updated = Store.updateInventoryUnit(uid, { status, contractEnd, price });
          Store.state.inventoryMap.editingUnitId = null;
          this.render();
          if (updated) {
            UI.toast(
              updated.roomId + " (" + updated.buildingName + ") actualizado en el semáforo y sincronizado con inventario",
              "ok"
            );
          }
          break;
        }

        case "send-magic-link": {
          const email = ((document.getElementById("magic-email") || {}).value || "").trim();
          if (!this.validateField("magic-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Introduce un correo electrónico válido.")) return;
          Store.set({ tenantEmail: email, magicLinkSent: true });
          UI.toast("Enlace mágico enviado a " + email + " (válido por 24h)", "ok");
          break;
        }

        case "enter-tenant-portal": {
          const inputEl = document.getElementById("magic-email");
          const email = inputEl && inputEl.value ? inputEl.value.trim() : Store.state.tenantEmail;
          Store.state.tenantEmail = email || "laura.gomez@gmail.com";
          Store.state.tenantLoggedIn = true;
          this.navigate("tenant-portal");
          UI.toast("Sesión Passwordless iniciada en Mi espacio HABITIA", "ok");
          break;
        }

        case "open-lead-in-inbox": {
          const id = btn.getAttribute("data-id") || "CON-015";
          Store.state.activeLeadId = id;
          Store.state.inboxMobileView = "chat";
          this.navigate("admin-inbox");
          break;
        }

        case "open-tenant-as-lead": {
          const id = btn.getAttribute("data-id") || "CON-015";
          const lead = Store.lead(id);
          if (lead) Store.state.tenantEmail = lead.email;
          this.navigate("tenant-portal");
          UI.toast("Viendo Mi espacio HABITIA como " + (lead ? lead.name : "Laura"), "info");
          break;
        }

        case "open-tenant-reschedule": {
          const id = btn.getAttribute("data-id") || "CON-015";
          this.openTenantRescheduleModal(id);
          break;
        }

        case "confirm-tenant-reschedule": {
          const id = btn.getAttribute("data-id") || "CON-015";
          this.handleTenantReschedule(id);
          break;
        }

        case "open-tenant-contact": {
          const id = btn.getAttribute("data-id") || "CON-015";
          this.openTenantContactModal(id);
          break;
        }

        case "confirm-tenant-contact": {
          const id = btn.getAttribute("data-id") || "CON-015";
          this.handleTenantContactModal(id);
          break;
        }

        case "send-tenant-portal-msg": {
          const id = btn.getAttribute("data-id") || "CON-015";
          const input = document.getElementById("tenant-reply-input");
          const text = input ? input.value.trim() : "";
          if (!text) {
            UI.toast("Escribe un mensaje antes de enviar", "error");
            return;
          }
          Store.sendTenantMessage(id, text, "whatsapp");
          this.render();
          UI.toast("Mensaje enviado al administrador y sincronizado en el Inbox Omnicanal", "ok");
          break;
        }

        case "select-inbox-lead": {
          const id = btn.getAttribute("data-id");
          const lead = Store.lead(id);
          if (lead) lead.unread = false;
          Store.set({ activeLeadId: id, inboxMobileView: "chat" });
          break;
        }

        case "inbox-back-to-list": {
          Store.set({ inboxMobileView: "list" });
          break;
        }

        case "set-inbox-filter": {
          const filter = btn.getAttribute("data-filter") || "all";
          Store.set({ inboxFilter: filter });
          break;
        }

        case "set-inbox-channel": {
          const ch = btn.getAttribute("data-channel") || "whatsapp";
          Store.set({ inboxChannel: ch });
          break;
        }

        case "insert-quick-reply": {
          const text = btn.getAttribute("data-text") || "";
          const input = document.getElementById("inbox-composer-input");
          if (input) {
            input.value = text;
            input.focus();
          }
          break;
        }

        case "send-inbox-message": {
          const id = btn.getAttribute("data-id") || Store.state.activeLeadId;
          this.handleSendInboxMessage(id);
          break;
        }

        case "open-admin-schedule": {
          const id = btn.getAttribute("data-id") || Store.state.activeLeadId;
          this.openAdminScheduleModal(id);
          break;
        }

        case "confirm-admin-schedule": {
          const id = btn.getAttribute("data-id") || Store.state.activeLeadId;
          this.handleAdminSchedule(id);
          break;
        }

        case "save-inbox-notes": {
          const id = btn.getAttribute("data-id") || Store.state.activeLeadId;
          const lead = Store.lead(id);
          const notes = (document.getElementById("inbox-lead-notes") || {}).value || "";
          if (lead) {
            lead.notes = notes;
            UI.toast("Nota CRM guardada en el expediente " + id, "ok");
          }
          break;
        }

        case "set-pkg": {
          const pkg = btn.getAttribute("data-pkg") || "complete";
          Store.state.pkg = pkg;
          this.render();
          UI.toast("Simulador activo: paquete " + Store.pkgName(pkg).toUpperCase(), "info");
          break;
        }

        case "toggle-pkg-sim": {
          Store.state.pkgCollapsed = !Store.state.pkgCollapsed;
          this.render();
          break;
        }

        case "toggle-mobile-menu": {
          Store.set({ mobileMenuOpen: !Store.state.mobileMenuOpen });
          break;
        }

        case "toggle-hero-area-dropdown": {
          Store.state.search.heroAreaOpen = !Store.state.search.heroAreaOpen;
          this.render();
          break;
        }

        case "select-all-areas": {
          const allAreas = ["Chamberí", "Salamanca", "Malasaña", "Argüelles", "Lavapiés", "Tetuán"];
          Store.state.search.areas = allAreas.slice();
          Store.state.search.area = allAreas.join(", ");
          this.render();
          break;
        }

        case "clear-areas": {
          Store.state.search.areas = [];
          Store.state.search.area = "";
          this.render();
          break;
        }

        case "remove-area-filter": {
          const targetArea = btn.getAttribute("data-area") || "";
          const current = Array.isArray(Store.state.search.areas) && Store.state.search.areas.length > 0
            ? Store.state.search.areas.slice()
            : (Store.state.search.area ? [Store.state.search.area] : []);
          const next = current.filter((a) => a !== targetArea);
          Store.state.search.areas = next;
          Store.state.search.area = next.join(", ");
          this.render();
          break;
        }

        case "submit-hero-search": {
          const city = (document.getElementById("hero-city") || {}).value || "";
          const max = (document.getElementById("hero-max") || {}).value || "";
          const date = (document.getElementById("hero-date") || {}).value || "";
          Store.state.search.heroAreaOpen = false;
          Object.assign(Store.state.search, { city, max, date });
          this.navigate("search");
          break;
        }

        case "open-room": {
          const id = btn.getAttribute("data-id") || "HAB-001";
          UI.closeOverlay();
          this.navigate("room-detail", { id, photoIndex: 0 });
          break;
        }

        case "open-room-external": {
          const id = btn.getAttribute("data-id") || "HAB-001";
          const targetRoom = Store.room(id);
          UI.closeOverlay();
          try {
            const extUrl = window.location.pathname + "?room=" + encodeURIComponent(id) + "#room-detail";
            window.open(extUrl, "_blank", "noopener");
          } catch (err) {
            /* En preview sandbox sin popups, navegamos directamente en la vista */
          }
          this.navigate("room-detail", { id, photoIndex: 0 });
          if (targetRoom) {
            UI.toast("Abriendo habitación del mismo piso: " + targetRoom.name + " (" + targetRoom.price + " €/mes)", "info");
          }
          break;
        }

        case "open-room-apt": {
          const id = btn.getAttribute("data-id") || "HAB-001";
          UI.closeOverlay();
          this.navigate("room-detail", { id, photoIndex: 0 });
          setTimeout(() => {
            const sec = document.getElementById("apt-rooms-section");
            if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
          break;
        }

        case "open-area": {
          const area = btn.getAttribute("data-area") || "Chamberí";
          Store.state.selectedLocation = area;
          this.navigate("location", { area });
          break;
        }

        case "select-location": {
          const area = btn.getAttribute("data-area") || "Chamberí";
          Store.set({ selectedLocation: area });
          break;
        }

        case "reset-filters": {
          Store.set({
            search: { city: "", area: "", areas: [], heroAreaOpen: false, min: "", max: "", date: "", stay: "", status: [], amenities: [], sort: "relevance", map: Store.state.search.map, openPin: null }
          });
          UI.toast("Filtros de búsqueda restablecidos", "info");
          break;
        }

        case "set-stay-filter": {
          const stay = btn.getAttribute("data-stay") || "";
          Store.state.search.stay = stay;
          this.render();
          break;
        }

        case "select-pin": {
          const id = btn.getAttribute("data-id");
          Store.state.search.openPin = id;
          this.render();
          break;
        }

        case "select-photo": {
          const id = btn.getAttribute("data-id");
          const idx = Number(btn.getAttribute("data-idx") || 0);
          Store.state.route.params = { id, photoIndex: idx };
          this.render();
          break;
        }

        case "open-lightbox": {
          const id = btn.getAttribute("data-id");
          const idx = Number(btn.getAttribute("data-idx") || 0);
          this.openLightboxModal(id, idx);
          break;
        }

        case "set-upcoming-filter": {
          const horizon = btn.getAttribute("data-horizon") || "all";
          Store.set({ upcomingFilter: horizon });
          break;
        }

        case "open-alert": {
          const roomId = btn.getAttribute("data-id") || null;
          this.openAlertModal(roomId);
          break;
        }

        case "submit-modal-alert": {
          this.handleModalAlertSubmit();
          break;
        }

        case "submit-public-alert": {
          this.handlePublicAlertSubmit();
          break;
        }

        case "submit-room-lead": {
          this.handleRoomLeadSubmit();
          break;
        }

        case "submit-contact-form": {
          this.handleContactSubmit();
          break;
        }

        case "submit-login": {
          Store.state.loggedIn = true;
          UI.toast("Sesión iniciada como Laura Martín (Superadministradora)", "ok");
          this.navigate("admin-dashboard");
          break;
        }

        case "logout": {
          Store.state.loggedIn = false;
          UI.toast("Sesión administrativa cerrada", "info");
          this.navigate("admin-login");
          break;
        }

        case "open-recover-modal": {
          UI.modal({
            title: "Recuperar contraseña de gestor",
            body:
              '<p style="margin:0 0 14px;color:var(--text-secondary)">Introduce tu correo corporativo de Avenew / HABITIA y te enviaremos un enlace temporal de restablecimiento.</p>' +
              UI.field({ id: "rec-email", label: "Correo electrónico", type: "email", value: "admin@habitia.es" }),
            footer:
              '<button class="btn btn-outline" type="button" data-action="close-overlay">Cancelar</button>' +
              '<button class="btn btn-primary" type="button" data-action="confirm-recover">Enviar enlace seguro</button>'
          });
          break;
        }

        case "confirm-recover": {
          UI.closeOverlay();
          UI.toast("Enlace de recuperación enviado a admin@habitia.es", "ok");
          break;
        }

        case "open-room-form": {
          const id = btn.getAttribute("data-id") || null;
          this.navigate("admin-room-form", { id });
          break;
        }

        case "save-room-form": {
          const publish = btn.getAttribute("data-publish") === "true";
          this.handleSaveRoomForm(publish);
          break;
        }

        case "duplicate-room": {
          const id = btn.getAttribute("data-id");
          const orig = Store.room(id);
          if (orig) {
            const copy = clone(orig);
            copy.id = "HAB-0" + (Store.state.rooms.length + 1);
            copy.name = orig.name + " (Copia)";
            copy.published = false;
            Store.state.rooms.unshift(copy);
            Store.addActivity("Habitación " + id + " duplicada como " + copy.id, "neutral");
            this.render();
            UI.toast("Habitación duplicada como borrador (" + copy.id + ")", "ok");
          }
          break;
        }

        case "admin-page": {
          const page = Number(btn.getAttribute("data-page") || 1);
          Store.state.adminRooms.page = page;
          this.render();
          break;
        }

        case "toggle-select-room": {
          const id = btn.getAttribute("data-id");
          const sel = Store.state.selected.slice();
          const idx = sel.indexOf(id);
          if (idx >= 0) sel.splice(idx, 1);
          else sel.push(id);
          Store.set({ selected: sel });
          break;
        }

        case "toggle-select-all": {
          if (Store.state.selected.length > 0) {
            Store.set({ selected: [] });
          } else {
            Store.set({ selected: Store.state.rooms.slice(0, 8).map((r) => r.id) });
          }
          break;
        }

        case "select-demo-bulk": {
          Store.set({ selected: ["HAB-001", "HAB-002", "HAB-005"] });
          UI.toast("3 habitaciones seleccionadas: usa la barra oscura para editar en bloque", "info");
          break;
        }

        case "clear-selection": {
          Store.set({ selected: [] });
          break;
        }

        case "bulk-modal": {
          const op = btn.getAttribute("data-op");
          this.openBulkModal(op);
          break;
        }

        case "confirm-bulk": {
          const op = btn.getAttribute("data-op");
          this.executeBulkAction(op);
          break;
        }

        case "set-calendar-horizon": {
          const h = Number(btn.getAttribute("data-h") || 30);
          Store.set({ calendarHorizon: h });
          break;
        }

        case "open-calendar-drawer": {
          const id = btn.getAttribute("data-id");
          Store.set({ drawer: { type: "calendar", id } });
          break;
        }

        case "save-calendar-drawer": {
          const id = btn.getAttribute("data-id");
          const status = (document.getElementById("cal-room-status") || {}).value || "available";
          const availableFrom = (document.getElementById("cal-room-date") || {}).value || isoInDays(0);
          const price = Number((document.getElementById("cal-room-price") || {}).value || 650);
          Store.updateRoom(id, { status, availableFrom, price });
          Store.set({ drawer: null });
          UI.toast("Calendario actualizado para " + id, "ok");
          break;
        }

        case "set-lead-filter": {
          const status = btn.getAttribute("data-status") || "all";
          Store.set({ leadFilter: status });
          break;
        }

        case "open-lead-drawer": {
          const id = btn.getAttribute("data-id");
          Store.set({ drawer: { type: "lead", id } });
          break;
        }

        case "save-lead-notes": {
          const id = btn.getAttribute("data-id");
          const lead = Store.lead(id);
          const notes = (document.getElementById("drawer-lead-notes") || {}).value || "";
          if (lead) {
            lead.notes = notes;
            UI.toast("Nota interna guardada en " + id, "ok");
            this.render();
          }
          break;
        }

        case "close-drawer": {
          Store.set({ drawer: null });
          break;
        }

        case "close-drawer-backdrop": {
          if (e.target.classList.contains("drawer-backdrop")) {
            Store.set({ drawer: null });
          }
          break;
        }

        case "download-template": {
          UI.toast("Descargando plantilla_oficial_habitia_100habs.xlsx", "info");
          break;
        }

        case "simulate-excel-upload": {
          Store.set({ importRun: true });
          UI.toast("Archivo leído: 88 registros válidos, 9 advertencias y 3 errores detectados", "info");
          break;
        }

        case "confirm-excel-import": {
          const newImp = {
            id: "IMP-0" + (Store.state.imports.length + 1),
            file: "inventario_noviembre_avenew.xlsx",
            user: "Laura Martín",
            date: "Hoy · " + new Date().toTimeString().slice(0, 5),
            processed: 100,
            ok: 97,
            errors: 3,
            status: "Completada"
          };
          Store.state.imports.unshift(newImp);
          Store.addActivity("Importación Excel completada (97 actualizadas, 3 omitidas)", "ok");
          this.render();
          UI.toast("Inventario importado con éxito (88 válidos aplicados)", "ok");
          break;
        }

        case "download-log": {
          const id = btn.getAttribute("data-id");
          UI.toast("Informe de validación " + id + " descargado (.csv)", "info");
          break;
        }

        case "save-notification-rules": {
          UI.toast("Reglas de envío automático actualizadas", "ok");
          break;
        }

        case "open-user-modal": {
          this.openCreateUserModal();
          break;
        }

        case "confirm-create-user": {
          this.handleCreateUser();
          break;
        }

        case "save-settings": {
          UI.toast("Configuración general de HABITIA guardada", "ok");
          break;
        }

        case "try-feature": {
          const target = btn.getAttribute("data-target");
          if (target === "search-map") {
            Store.state.search.map = true;
            this.navigate("search");
            UI.toast("Mapa interactivo activado en el buscador", "info");
          } else if (target === "admin-rooms-bulk") {
            Store.state.selected = ["HAB-001", "HAB-002", "HAB-003"];
            this.navigate("admin-rooms");
            UI.toast("3 habitaciones seleccionadas para probar la edición masiva", "info");
          } else {
            this.navigate(target || "home");
          }
          break;
        }

        case "open-tenant-req-modal": {
          const roomId = btn.getAttribute("data-id") || (Store.state.route.params && Store.state.route.params.id) || "HAB-001";
          this.openTenantRequirementsModal(roomId);
          break;
        }

        case "toggle-guarantor-info": {
          Store.state.showGuarantorInfo = !Store.state.showGuarantorInfo;
          this.render();
          break;
        }

        case "close-overlay": {
          UI.closeOverlay();
          break;
        }
      }
    });

    /* Eventos Change / Input para filtros reactivos */
    document.addEventListener("change", (e) => {
      const t = e.target;

      if (t.matches("[data-filter]")) {
        const key = t.getAttribute("data-filter");
        Store.state.search[key] = t.value;
        this.render();
      }

      if (t.matches("[data-filter-area]")) {
        const areaName = t.getAttribute("data-filter-area");
        const arr = Array.isArray(Store.state.search.areas) && Store.state.search.areas.length > 0
          ? Store.state.search.areas.slice()
          : (Store.state.search.area ? [Store.state.search.area] : []);
        const i = arr.indexOf(areaName);
        if (t.checked && i === -1) arr.push(areaName);
        if (!t.checked && i >= 0) arr.splice(i, 1);
        Store.state.search.areas = arr;
        Store.state.search.area = arr.join(", ");
        this.render();
      }

      if (t.matches("[data-filter-status]")) {
        const st = t.getAttribute("data-filter-status");
        const arr = Store.state.search.status.slice();
        const i = arr.indexOf(st);
        if (t.checked && i === -1) arr.push(st);
        if (!t.checked && i >= 0) arr.splice(i, 1);
        Store.state.search.status = arr;
        this.render();
      }

      if (t.matches("[data-filter-amenity]")) {
        const am = t.getAttribute("data-filter-amenity");
        const arr = Store.state.search.amenities.slice();
        const i = arr.indexOf(am);
        if (t.checked && i === -1) arr.push(am);
        if (!t.checked && i >= 0) arr.splice(i, 1);
        Store.state.search.amenities = arr;
        this.render();
      }

      if (t.id === "toggle-map-switch") {
        Store.state.search.map = t.checked;
        this.render();
      }

      if (t.matches("[data-admin-filter]")) {
        const key = t.getAttribute("data-admin-filter");
        Store.state.adminRooms[key] = t.value;
        Store.state.adminRooms.page = 1;
        this.render();
      }

      if (t.matches('[data-action="change-lead-status"]')) {
        const id = t.getAttribute("data-id");
        Store.updateLeadStatus(id, t.value);
        this.render();
        UI.toast("Estado de consulta " + id + " actualizado a " + (LEAD_STATUS[t.value] || t.value), "ok");
      }
    });

    document.addEventListener("input", (e) => {
      const t = e.target;
      if (t.matches('[data-admin-filter="q"]')) {
        Store.state.adminRooms.q = t.value;
        Store.state.adminRooms.page = 1;
        this.render();
        const input = document.querySelector('[data-admin-filter="q"]');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
      if (t.id === "inbox-search-input") {
        Store.state.inboxSearch = t.value;
        this.render();
        const input = document.getElementById("inbox-search-input");
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const t = e.target;
        if (t && t.id === "inbox-composer-input") {
          e.preventDefault();
          this.handleSendInboxMessage(Store.state.activeLeadId);
        } else if (t && t.id === "tenant-reply-input") {
          e.preventDefault();
          const lead = Store.tenantLead();
          const val = t.value.trim();
          if (val && lead) {
            Store.sendTenantMessage(lead.id, val, "whatsapp");
            this.render();
            UI.toast("Mensaje enviado al administrador y sincronizado en el Inbox Omnicanal", "ok");
          }
        }
      }
    });
  },

  /* ========================================================================
     MODALES Y VALIDACIONES DE FLUJO
     ======================================================================== */
  handleSendInboxMessage(leadId) {
    const input = document.getElementById("inbox-composer-input");
    const text = input ? input.value.trim() : "";
    if (!text) {
      UI.toast("Escribe un mensaje antes de enviar", "error");
      return;
    }
    const ch = Store.state.inboxChannel || "whatsapp";
    const lead = Store.lead(leadId) || Store.activeLead();
    if (!lead) return;

    Store.sendAdminMessage(lead.id, ch, text);
    this.render();
    UI.toast(
      (ch === "whatsapp" ? "WhatsApp enviado a " : "Email enviado a ") + lead.name + " · Sincronizado con Mi espacio HABITIA",
      "ok"
    );
  },

  openAdminScheduleModal(leadId) {
    const lead = Store.lead(leadId) || Store.activeLead();
    if (!lead) return;
    const room = Store.room(lead.roomId);
    UI.modal({
      title: "Agendar o modificar cita de visita (" + lead.name + ")",
      body:
        '<p style="margin:0 0 14px;color:var(--text-secondary)">Al confirmar la cita, se registrará automáticamente en el historial unificado del Inbox y en el portal <strong>«Mi espacio HABITIA»</strong> del inquilino.</p>' +
        '<div class="od-stack" style="--od-gap:12px">' +
          UI.field({
            id: "adm-sched-slot",
            label: "Fecha y hora de la visita",
            value: lead.appointment && lead.appointment !== "Sin cita agendada" ? lead.appointment : "12 de noviembre · 17:30",
            placeholder: "Ej. 14 de noviembre · 18:00"
          }) +
          UI.field({
            id: "adm-sched-note",
            label: "Mensaje automático de confirmación para el candidato",
            type: "textarea",
            rows: 3,
            value: "Hola " + lead.name.split(" ")[0] + ", te confirmamos la cita para visitar " + (room ? room.name + " (" + room.apt + ")" : "la habitación") + ". Ya puedes ver los detalles en Mi espacio HABITIA."
          }) +
        '</div>',
      footer:
        '<button class="btn btn-outline" type="button" data-action="close-overlay">Cancelar</button>' +
        '<button class="btn btn-primary" type="button" data-action="confirm-admin-schedule" data-id="' + lead.id + '">' + UI.icon("calendar") + 'Confirmar cita y notificar</button>'
    });
  },

  handleAdminSchedule(leadId) {
    const slot = ((document.getElementById("adm-sched-slot") || {}).value || "12 de noviembre · 17:30").trim();
    const note = ((document.getElementById("adm-sched-note") || {}).value || "").trim();
    Store.updateAppointment(leadId, slot, note, "admin");
    UI.closeOverlay();
    this.render();
    UI.toast("Cita confirmada (" + slot + ") y actualizada en Mi espacio HABITIA", "ok");
  },

  openTenantRescheduleModal(leadId) {
    const lead = Store.lead(leadId) || Store.tenantLead();
    UI.modal({
      title: "Solicitar cambio de cita de visita",
      body:
        '<p style="margin:0 0 14px;color:var(--text-secondary)">Selecciona el nuevo horario que mejor te venga para visitar <strong>Habitación 24, Velázquez</strong>. El gestor recibirá el aviso al instante en su Inbox Omnicanal.</p>' +
        '<div class="od-stack" style="--od-gap:12px">' +
          UI.field({
            id: "ten-sched-slot",
            label: "Nueva fecha y franja horaria propuesta",
            type: "select",
            options:
              '<option value="13 de noviembre · 18:00">Viernes 13 de noviembre · 18:00</option>' +
              '<option value="14 de noviembre · 11:30">Sábado 14 de noviembre · 11:30</option>' +
              '<option value="16 de noviembre · 17:30">Lunes 16 de noviembre · 17:30</option>' +
              '<option value="12 de noviembre · 19:00">Jueves 12 de noviembre · 19:00 (retrasar 1,5h)</option>'
          }) +
          UI.field({
            id: "ten-sched-note",
            label: "Comentario para el administrador (opcional)",
            type: "textarea",
            rows: 2,
            value: "Hola, salgo un poco más tarde de la oficina. ¿Podríamos cambiar la visita a este nuevo horario?"
          }) +
        '</div>',
      footer:
        '<button class="btn btn-outline" type="button" data-action="close-overlay">Cancelar</button>' +
        '<button class="btn btn-primary" type="button" data-action="confirm-tenant-reschedule" data-id="' + lead.id + '">' + UI.icon("check") + 'Confirmar cambio de cita</button>'
    });
  },

  handleTenantReschedule(leadId) {
    const slot = (document.getElementById("ten-sched-slot") || {}).value || "13 de noviembre · 18:00";
    const note = ((document.getElementById("ten-sched-note") || {}).value || "").trim();
    Store.updateAppointment(leadId, slot, note, "tenant");
    UI.closeOverlay();
    this.render();
    UI.toast("Nueva cita (" + slot + ") actualizada y enviada al Inbox del administrador", "ok");
  },

  openTenantContactModal(leadId) {
    const lead = Store.lead(leadId) || Store.tenantLead();
    UI.modal({
      title: "Contactar con el administrador de HABITIA",
      body:
        '<p style="margin:0 0 14px;color:var(--text-secondary)">Tu mensaje llegará de inmediato al <strong>Inbox Omnicanal</strong> del gestor asignado a tu expediente (' + lead.id + ').</p>' +
        UI.field({
          id: "ten-modal-msg",
          label: "Tu mensaje",
          type: "textarea",
          rows: 3,
          required: true,
          value: "Hola Diego, quería confirmar si puedo llevar ya la documentación para reservar la Habitación 24 el mismo día de la visita."
        }),
      footer:
        '<button class="btn btn-outline" type="button" data-action="close-overlay">Cancelar</button>' +
        '<button class="btn btn-primary" type="button" data-action="confirm-tenant-contact" data-id="' + lead.id + '">' + UI.icon("send") + 'Enviar mensaje al gestor</button>'
    });
  },

  handleTenantContactModal(leadId) {
    const msg = ((document.getElementById("ten-modal-msg") || {}).value || "").trim();
    if (!msg) return;
    Store.sendTenantMessage(leadId, msg, "whatsapp");
    UI.closeOverlay();
    this.render();
    UI.toast("Mensaje enviado y visible en el Inbox Omnicanal (#admin-inbox)", "ok");
  },
  openLightboxModal(roomId, photoIdx) {
    const room = Store.room(roomId) || Store.state.rooms[0];
    const photos = room.gallery || [];
    const current = photos[photoIdx] || photos[0];
    const nextIdx = (photoIdx + 1) % photos.length;
    const prevIdx = (photoIdx - 1 + photos.length) % photos.length;

    UI.modal({
      size: "lg",
      title: room.name + " · Galería (" + (photoIdx + 1) + "/" + photos.length + ")",
      body:
        '<div style="display:grid;gap:14px">' +
          '<div style="aspect-ratio:16/10;background:#111;border-radius:var(--radius-md);overflow:hidden">' +
            '<img src="' + current.src + '" alt="' + UI.esc(current.alt) + '" style="width:100%;height:100%;object-fit:contain">' +
          '</div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">' +
            '<button class="btn btn-outline btn-sm" type="button" data-action="open-lightbox" data-id="' + room.id + '" data-idx="' + prevIdx + '">' + UI.icon("arrowLeft") + 'Anterior</button>' +
            '<span style="font-size:0.86rem;color:var(--text-secondary)">' + UI.esc(current.alt) + '</span>' +
            '<button class="btn btn-outline btn-sm" type="button" data-action="open-lightbox" data-id="' + room.id + '" data-idx="' + nextIdx + '">Siguiente ' + UI.icon("arrowRight") + '</button>' +
          '</div>' +
        '</div>'
    });
  },

  validateField(id, condition, message) {
    const input = document.getElementById(id);
    const err = document.getElementById(id + "-error");
    if (!condition) {
      if (input) input.classList.add("is-invalid");
      if (err) {
        err.textContent = message;
        err.hidden = false;
      }
      return false;
    }
    if (input) input.classList.remove("is-invalid");
    if (err) {
      err.textContent = "";
      err.hidden = true;
    }
    return true;
  },

  handleRoomLeadSubmit() {
    const roomId = (document.getElementById("lead-room-id") || {}).value || "HAB-001";
    const name = ((document.getElementById("lead-name") || {}).value || "").trim();
    const email = ((document.getElementById("lead-email") || {}).value || "").trim();
    const phone = ((document.getElementById("lead-phone") || {}).value || "").trim();
    const date = (document.getElementById("lead-date") || {}).value || "";
    const message = ((document.getElementById("lead-msg") || {}).value || "").trim();
    const rgpd = Boolean((document.getElementById("lead-rgpd") || {}).checked);

    const v1 = this.validateField("lead-name", name.length >= 2, "Indica tu nombre y apellidos para que podamos dirigirnos a ti.");
    const v2 = this.validateField("lead-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Introduce un correo electrónico válido (ej. nombre@dominio.es).");
    const v3 = this.validateField("lead-msg", message.length >= 6, "Escribe un breve mensaje indicando tu disponibilidad o consulta.");
    const rgpdErr = document.getElementById("lead-rgpd-error");
    if (!rgpd) {
      if (rgpdErr) {
        rgpdErr.textContent = "Debes aceptar la Política de Privacidad para enviar la consulta.";
        rgpdErr.hidden = false;
      }
      return;
    } else if (rgpdErr) {
      rgpdErr.hidden = true;
    }

    if (!v1 || !v2 || !v3) return;

    const created = Store.addLead({ name, email, phone, roomId, date, message });
    const room = Store.room(roomId);

    UI.modal({
      title: "Solicitud registrada con éxito (" + created.id + ")",
      body:
        '<div class="od-stack" style="--od-gap:12px">' +
          '<span class="badge is-ok" style="width:fit-content">' + UI.icon("check") + ' Sincronizada con el Inbox Omnicanal y Mi espacio HABITIA</span>' +
          '<p style="margin:0">Gracias, <strong>' + UI.esc(name) + '</strong>. Hemos registrado tu interés en <strong>' + UI.esc(room ? room.name : roomId) + '</strong> con fecha prevista de entrada el <strong>' + UI.dateShort(date) + '</strong>.</p>' +
          '<p style="margin:0;font-size:0.86rem;color:var(--text-secondary)">En esta demostración puedes abrir ahora mismo el <strong>Inbox Omnicanal del Gestor</strong> para responderte por WhatsApp/Email, o entrar a tu portal privado <strong>Mi espacio HABITIA</strong>.</p>' +
        '</div>',
      footer:
        '<button class="btn btn-outline" type="button" data-action="nav" data-route="tenant-portal">' + UI.icon("user") + 'Ir a Mi espacio HABITIA</button>' +
        '<button class="btn btn-primary" type="button" data-action="nav" data-route="admin-inbox">' + UI.icon("whatsapp") + 'Ver en Inbox Omnicanal →</button>'
    });
  },

  openAlertModal(roomId) {
    const room = roomId ? Store.room(roomId) : null;
    const isInhabited = room && room.status !== "available";
    const daysLeft = room ? UI.daysUntil(room.availableFrom) : null;

    UI.modal({
      title: isInhabited
        ? "Avísame cuando se desaloje esta habitación"
        : "Crear alerta de disponibilidad",
      body:
        (room
          ? '<div class="alert-room-summary">' +
              '<img src="' + IMG[room.main] + '" alt="' + UI.esc(room.name) + '" width="76" height="58">' +
              '<div style="min-width:0">' +
                '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' +
                  '<span class="badge is-neutral tabular">' + UI.esc(room.id) + '</span>' +
                  '<span class="badge is-soon"><span class="dot"></span>' +
                    (isInhabited
                      ? "Desalojo previsto: " + UI.dateShort(room.availableFrom)
                      : "Disponible ahora") +
                  '</span>' +
                '</div>' +
                '<strong style="display:block;margin-top:4px;font-size:0.94rem">' + UI.esc(room.name) + '</strong>' +
                '<span style="font-size:0.8rem;color:var(--text-secondary)">' + UI.esc(room.apt) + ' · ' + UI.num(room.price) + ' €/mes' +
                  (daysLeft != null && daysLeft > 0 ? " · Queda libre en " + daysLeft + " días" : "") +
                '</span>' +
              '</div>' +
            '</div>'
          : "") +
        '<p style="margin:0 0 14px;color:var(--text-secondary)">' +
          (room
            ? "Te enviaremos un aviso prioritario en cuanto se confirme la liberación de <strong>" + UI.esc(room.name) + "</strong> en <strong>" + UI.esc(room.apt) + "</strong> (fecha de desalojo: <strong>" + UI.dateShort(room.availableFrom) + "</strong>) para que puedas agendar visita o reservar antes de su publicación general."
            : "Recibe un aviso automático en cuanto se publique una habitación compatible con tu búsqueda.") +
        '</p>' +
        '<div class="od-stack" style="--od-gap:12px">' +
          '<input type="hidden" id="mod-al-room-id" value="' + (room ? UI.esc(room.id) : "") + '">' +
          UI.field({ id: "mod-al-email", label: "Tu correo electrónico", type: "email", required: true, placeholder: "nombre@ejemplo.es" }) +
          UI.field({ id: "mod-al-phone", label: "Teléfono / WhatsApp (opcional para aviso inmediato)", type: "tel", placeholder: "+34 600 000 000" }) +
          '<div class="grid-2" style="gap:10px">' +
            UI.field({ id: "mod-al-area", label: "Barrio / Apartamento", value: room ? room.area + " (" + room.apt + ")" : (Store.state.search.area || "Chamberí") }) +
            UI.field({ id: "mod-al-date", label: "Fecha de desalojo / entrada", type: "date", value: room ? room.availableFrom : isoInDays(15) }) +
          '</div>' +
          UI.field({ id: "mod-al-budget", label: "Presupuesto mensual máximo (€)", type: "number", value: room ? room.price : 700 }) +
        '</div>',
      footer:
        '<button class="btn btn-outline" type="button" data-action="close-overlay">Cancelar</button>' +
        '<button class="btn btn-accent" type="button" data-action="submit-modal-alert">' + UI.icon("bell") + 'Activar aviso de desalojo</button>'
    });
  },

  handleModalAlertSubmit() {
    const roomId = ((document.getElementById("mod-al-room-id") || {}).value || "").trim();
    const room = roomId ? Store.room(roomId) : null;
    const email = ((document.getElementById("mod-al-email") || {}).value || "").trim();
    const area = ((document.getElementById("mod-al-area") || {}).value || "Chamberí").trim();
    const budget = Number((document.getElementById("mod-al-budget") || {}).value || 700);
    if (!this.validateField("mod-al-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Introduce un correo válido.")) return;

    Store.addSubscriber({ email, city: "Madrid", area, budget });
    UI.closeOverlay();
    if (room) {
      UI.toast("Aviso activado para " + room.id + " (" + room.apt + ") · Fecha de desalojo: " + UI.dateShort(room.availableFrom), "ok");
    } else {
      UI.toast("Alerta creada para " + area + " (hasta " + budget + " €). Añadida a Suscriptores del Panel Admin.", "ok");
    }
  },

  handlePublicAlertSubmit() {
    const email = ((document.getElementById("al-email") || {}).value || "").trim();
    const city = (document.getElementById("al-city") || {}).value || "Madrid";
    const area = (document.getElementById("al-area") || {}).value || "Chamberí";
    const budget = Number((document.getElementById("al-budget") || {}).value || 700);

    if (!this.validateField("al-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Introduce un correo electrónico válido.")) return;

    Store.addSubscriber({ email, city, area, budget });
    UI.toast("Suscripción registrada en la tabla de Suscriptores del Panel Admin", "ok");
    this.navigate("admin-subscribers");
  },

  handleContactSubmit() {
    const name = ((document.getElementById("ct-name") || {}).value || "").trim();
    const email = ((document.getElementById("ct-email") || {}).value || "").trim();
    const phone = ((document.getElementById("ct-phone") || {}).value || "").trim();
    const message = ((document.getElementById("ct-msg") || {}).value || "").trim();

    const v1 = this.validateField("ct-name", name.length >= 2, "Indica tu nombre.");
    const v2 = this.validateField("ct-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Indica un email válido.");
    const v3 = this.validateField("ct-msg", message.length >= 5, "Escribe tu consulta.");
    if (!v1 || !v2 || !v3) return;

    Store.addLead({ name, email, phone, roomId: null, date: isoInDays(15), message });
    UI.toast("Consulta general recibida. Disponible en el CRM del Panel Admin.", "ok");
    const form = document.getElementById("contact-general-form");
    if (form) form.reset();
  },

  handleSaveRoomForm(publish) {
    const id = (document.getElementById("rf-id") || {}).value || "HAB-016";
    const name = ((document.getElementById("rf-name") || {}).value || "").trim();
    if (!this.validateField("rf-name", name.length >= 4, "Escribe un nombre comercial descriptivo para la habitación.")) return;

    const apt = (document.getElementById("rf-apt") || {}).value || "Apt. Velázquez 42";
    const city = (document.getElementById("rf-city") || {}).value || "Madrid";
    const area = (document.getElementById("rf-area") || {}).value || "Salamanca";
    const zone = (document.getElementById("rf-zone") || {}).value || "Goya";
    const price = Number((document.getElementById("rf-price") || {}).value || 650);
    const deposit = Number((document.getElementById("rf-deposit") || {}).value || price);
    const expenses = (document.getElementById("rf-expenses") || {}).value || "incluidos";
    const minStay = Number((document.getElementById("rf-minstay") || {}).value || 3);
    const size = Number((document.getElementById("rf-size") || {}).value || 14);
    const status = (document.getElementById("rf-status") || {}).value || "available";
    const availableFrom = (document.getElementById("rf-date") || {}).value || isoInDays(0);
    const description = (document.getElementById("rf-desc") || {}).value || "";
    const exterior = Boolean((document.getElementById("rf-exterior") || {}).checked);
    const bath = Boolean((document.getElementById("rf-bath") || {}).checked) ? "private" : "shared";
    const desk = Boolean((document.getElementById("rf-desk") || {}).checked);
    const ac = Boolean((document.getElementById("rf-ac") || {}).checked);
    const checkedMain = document.querySelector('input[name="rf-main"]:checked');
    const main = checkedMain ? checkedMain.value : "room1";

    const patch = {
      id, name, apt, city, area, zone, price, deposit, expenses,
      expensesNote: expenses === "incluidos" ? "Suministros incluidos" : "Suministros 45 €/mes",
      minStay, size, status, availableFrom, description,
      exterior, bath, desk, ac, main,
      gallery: gallery(main, "room2"),
      published: publish
    };

    const existing = Store.room(id);
    if (existing) {
      Store.updateRoom(id, patch);
    } else {
      patch.coords = { x: 48, y: 32 };
      patch.furnished = true;
      patch.wifi = true;
      patch.heating = true;
      patch.wardrobe = true;
      patch.lock = true;
      Store.state.rooms.unshift(patch);
      Store.addActivity("Nueva habitación " + id + " creada", "ok");
    }

    UI.toast("Habitación " + id + (publish ? " guardada y publicada" : " guardada como borrador"), "ok");
    this.navigate("admin-rooms");
  },

  openBulkModal(op) {
    const count = Store.state.selected.length;
    let body = "";
    let title = "Confirmar edición masiva (" + count + " habitaciones)";

    if (op === "price") {
      title = "Actualizar precio en bloque (" + count + " habitaciones)";
      body =
        '<p style="margin:0 0 12px;color:var(--text-secondary)">Aplica un nuevo precio mensual fijo o un ajuste a las habitaciones seleccionadas (' + Store.state.selected.join(", ") + ').</p>' +
        UI.field({ id: "bulk-price-val", label: "Nuevo precio mensual (€/mes)", type: "number", value: 685 });
    } else if (op === "status") {
      title = "Actualizar disponibilidad en bloque";
      body =
        '<div class="od-stack" style="--od-gap:12px">' +
          UI.field({
            id: "bulk-status-val",
            label: "Nuevo estado",
            type: "select",
            options:
              '<option value="available">Disponible ahora</option>' +
              '<option value="upcoming">Próxima disponibilidad</option>' +
              '<option value="occupied">Ocupada</option>'
          }) +
          UI.field({ id: "bulk-date-val", label: "Fecha de disponibilidad", type: "date", value: isoInDays(15) }) +
        '</div>';
    } else {
      body = '<p style="margin:0">¿Confirmas que deseas <strong>' + (op === "publish" ? "publicar en la web" : "pasar a borrador") + '</strong> las ' + count + ' habitaciones seleccionadas?</p>';
    }

    UI.modal({
      title,
      body,
      footer:
        '<button class="btn btn-outline" type="button" data-action="close-overlay">Cancelar</button>' +
        '<button class="btn btn-primary" type="button" data-action="confirm-bulk" data-op="' + op + '">Aplicar a ' + count + ' habitaciones</button>'
    });
  },

  executeBulkAction(op) {
    const ids = Store.state.selected.slice();
    if (op === "price") {
      const price = Number((document.getElementById("bulk-price-val") || {}).value || 685);
      Store.updateRooms(ids, { price });
    } else if (op === "status") {
      const status = (document.getElementById("bulk-status-val") || {}).value || "available";
      const availableFrom = (document.getElementById("bulk-date-val") || {}).value || isoInDays(15);
      Store.updateRooms(ids, { status, availableFrom });
    } else if (op === "publish") {
      Store.updateRooms(ids, { published: true });
    } else if (op === "unpublish") {
      Store.updateRooms(ids, { published: false });
    }
    UI.closeOverlay();
    Store.set({ selected: [] });
    UI.toast("Acción en lote aplicada a " + ids.length + " habitaciones", "ok");
  },

  openCreateUserModal() {
    UI.modal({
      title: "Invitar miembro al equipo de administración",
      body:
        '<div class="od-stack" style="--od-gap:12px">' +
          UI.field({ id: "usr-name", label: "Nombre y apellidos", required: true, placeholder: "Ej. Carlos Mendoza" }) +
          UI.field({ id: "usr-email", label: "Correo corporativo", type: "email", required: true, placeholder: "carlos@habitia.es" }) +
          UI.field({
            id: "usr-role",
            label: "Rol en el sistema",
            type: "select",
            options: '<option value="Administrador">Administrador Comercial</option><option value="Superadministrador">Superadministrador</option>'
          }) +
        '</div>',
      footer:
        '<button class="btn btn-outline" type="button" data-action="close-overlay">Cancelar</button>' +
        '<button class="btn btn-primary" type="button" data-action="confirm-create-user">Añadir usuario</button>'
    });
  },

  handleCreateUser() {
    const name = ((document.getElementById("usr-name") || {}).value || "").trim();
    const email = ((document.getElementById("usr-email") || {}).value || "").trim();
    const role = (document.getElementById("usr-role") || {}).value || "Administrador";
    if (!this.validateField("usr-name", name.length >= 2, "Indica el nombre del usuario.")) return;
    if (!this.validateField("usr-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Indica un email corporativo válido.")) return;

    Store.state.users.push({
      id: "USR-0" + (Store.state.users.length + 1),
      name,
      email,
      role,
      active: true,
      lastAccess: "Invitación enviada"
    });
    Store.addActivity("Nuevo usuario administrador creado: " + name, "ok");
    UI.closeOverlay();
    this.render();
    UI.toast("Usuario " + name + " añadido al equipo", "ok");
  },

  openTenantRequirementsModal(roomId) {
    const room = Store.room(roomId) || Store.state.rooms[0];
    const income3x = room.price * 3;
    const assets36x = room.price * 36;

    UI.modal({
      title: "Requisitos para el inquilino · " + room.apt,
      body:
        '<div class="tenant-req-modal-content">' +
          '<div style="text-align:center;margin-bottom:18px">' +
            '<span class="badge is-ok" style="margin-bottom:8px">Habitación ' + UI.esc(room.id) + ' · ' + UI.num(room.price) + ' €/mes</span>' +
            '<h3 style="margin:0 0 6px;font-size:1.5rem;font-weight:800;color:var(--text-primary)">Requisitos para el inquilino</h3>' +
            '<p style="margin:0;color:var(--text-secondary);font-size:0.95rem">Esto es lo que necesitarás para cumplir con los requisitos como residente:</p>' +
          '</div>' +

          '<div class="tenant-req-stack">' +
            '<div class="tenant-req-pill">' +
              '<div class="tenant-req-pill-label">' +
                '<strong>Ingresos brutos mensuales</strong>' +
                '<span>Nóminas o ingresos demostrables</span>' +
              '</div>' +
              '<div class="tenant-req-pill-value tabular">' +
                '<strong>3× alquiler</strong>' +
                '<small>' + UI.num(income3x) + ' €/mes</small>' +
              '</div>' +
            '</div>' +

            '<div class="tenant-req-divider" aria-hidden="true"><span>O BIEN</span></div>' +

            '<div class="tenant-req-pill">' +
              '<div class="tenant-req-pill-label">' +
                '<strong>Liquidez o ahorros demostrables</strong>' +
                '<span>Saldo bancario o fondos disponibles</span>' +
              '</div>' +
              '<div class="tenant-req-pill-value tabular">' +
                '<strong>36×</strong>' +
                '<small>' + UI.num(assets36x) + ' €</small>' +
              '</div>' +
            '</div>' +

            '<div class="tenant-req-divider is-plus" aria-hidden="true"><span>+</span></div>' +

            '<div class="tenant-req-pill">' +
              '<div class="tenant-req-pill-label">' +
                '<strong>Puntuación de solvencia / Historial crediticio</strong>' +
                '<span>Sin incidencias en ficheros de morosidad</span>' +
              '</div>' +
              '<div class="tenant-req-pill-value tabular">' +
                '<strong>650+</strong>' +
                '<small>Solvencia verificada</small>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="tenant-req-guarantor" style="margin-top:20px">' +
            '<p class="tenant-req-guarantor-lead">' +
              '<strong>Si no cumples los requisitos de residente por tu cuenta para alquilar una habitación, tenemos opciones para ti:</strong>' +
            '</p>' +
            '<p class="tenant-req-guarantor-body" style="margin-bottom:10px">' +
              'Solicita tu habitación con un <strong>avalista solidario</strong> que co-firme tu contrato de arrendamiento. ' +
              'El avalista puede ser un familiar o tutor que acredite ingresos ≥ <strong>' + UI.num(income3x) + ' €/mes</strong> o solvencia equivalente.' +
            '</p>' +
            '<div class="tenant-guarantor-drawer">' +
              '<strong style="display:block;font-size:0.86rem;color:var(--brand-primary);margin-bottom:4px">' + UI.icon("shield") + ' ¿Qué es un avalista y cómo funciona?</strong>' +
              '<p style="margin:0;font-size:0.82rem;color:var(--text-secondary)">El avalista respalda el pago mensual del alquiler durante tu estancia (' + room.minStay + ' a 11 meses). El proceso es 100% digital mediante firma electrónica en menos de 24 horas.</p>' +
            '</div>' +
          '</div>' +
        '</div>',
      footer:
        '<button class="btn btn-outline" type="button" data-action="close-overlay">Cerrar</button>' +
        '<button class="btn btn-primary" type="button" data-action="close-overlay">Entendido, continuar solicitud</button>'
    });
  }
};

window.App = App;
document.addEventListener("DOMContentLoaded", () => App.init());
