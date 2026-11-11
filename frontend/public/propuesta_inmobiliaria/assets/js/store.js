/* HABITIA — estado centralizado en memoria */

const PKG_RANK = { essential: 0, improved: 1, complete: 2 };

const FEATURE_MIN = {
  inbox: "improved",
  map: "improved",
  seo: "improved",
  calendar: "improved",
  bulk: "improved",
  crm: "improved",
  users: "improved",
  inventoryMap: "complete",
  portal: "complete",
  import: "complete",
  subscribers: "complete",
  alerts: "complete"
};

const FEATURE_LABEL = {
  inbox: "Inbox Omnicanal (Email + WhatsApp)",
  map: "Mapa interactivo",
  seo: "Landings SEO",
  calendar: "Calendario de disponibilidad",
  bulk: "Edición masiva",
  crm: "CRM de consultas",
  users: "Usuarios y roles",
  inventoryMap: "Mapa Operativo de Ocupación Geográfica (100 habs.)",
  portal: "Mi espacio HABITIA (Portal del Inquilino)",
  import: "Importación Excel",
  subscribers: "Suscriptores y alertas",
  alerts: "Alertas automáticas"
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const Store = {
  state: {
    route: { name: "home", params: {} },
    area: "public",
    pkg: "complete",
    pkgCollapsed: false,
    loggedIn: false,
    tenantLoggedIn: true,
    tenantEmail: "laura.gomez@gmail.com",
    magicLinkSent: false,
    rooms: clone(SEED.rooms),
    buildings: clone(SEED.buildings),
    inventoryUnits: clone(SEED.inventoryUnits),
    leads: clone(SEED.leads),
    subscribers: clone(SEED.subscribers),
    users: clone(SEED.users),
    activity: clone(SEED.activity),
    imports: clone(SEED.imports),
    search: { city: "", area: "", areas: [], heroAreaOpen: false, min: "", max: "", date: "", stay: "", status: [], amenities: [], sort: "relevance", map: false, openPin: null },
    adminRooms: { q: "", status: "", area: "", sort: "recent", page: 1 },
    inventoryMap: {
      district: "Todos",
      status: "all",
      mode: "clusters", // "clusters" | "pins"
      selectedBuildingId: "BLD-CHA-1",
      selectedUnitId: null,
      editingUnitId: null
    },
    selected: [],
    calendarHorizon: 30,
    importRun: null,
    alertContext: null,
    drawer: null,
    activeLeadId: "CON-015",
    inboxChannel: "whatsapp",
    inboxFilter: "all",
    inboxSearch: "",
    inboxMobileView: "chat" // "list" | "chat" en pantallas móviles
  },

  emit() {
    if (typeof App !== "undefined" && App && typeof App.render === "function") {
      App.render();
    } else if (window.App && typeof window.App.render === "function") {
      window.App.render();
    }
  },

  set(patch) {
    Object.assign(this.state, patch);
    this.emit();
  },

  navigate(name, params) {
    if (typeof App !== "undefined" && App && typeof App.navigate === "function") {
      App.navigate(name, params || {});
    } else if (window.App && typeof window.App.navigate === "function") {
      window.App.navigate(name, params || {});
    }
  },

  // ---- Paquetes -----------------------------------------------------------
  included(feature) {
    const min = FEATURE_MIN[feature];
    if (!min) return true;
    return PKG_RANK[this.state.pkg] >= PKG_RANK[min];
  },

  minPackage(feature) {
    return FEATURE_MIN[feature] || "essential";
  },

  pkgName(pkg) {
    const found = PACKAGES.find((p) => p.id === (pkg || this.state.pkg));
    return found ? found.name : "Essential";
  },

  adminLimit() {
    return { essential: 1, improved: 3, complete: 5 }[this.state.pkg] || 1;
  },

  // ---- Consultas e Inbox Omnicanal ----------------------------------------
  room(id) {
    return this.state.rooms.find((r) => r.id === id) || null;
  },

  lead(id) {
    return this.state.leads.find((l) => l.id === id) || null;
  },

  activeLead() {
    return this.lead(this.state.activeLeadId) || this.state.leads[0] || null;
  },

  tenantLead() {
    const byEmail = this.state.leads.find(
      (l) => l.email.toLowerCase() === String(this.state.tenantEmail || "").toLowerCase()
    );
    return byEmail || this.lead("CON-015") || this.state.leads[0];
  },

  publishedRooms() {
    return this.state.rooms.filter((r) => r.published);
  },

  countByStatus(status) {
    return this.state.rooms.filter((r) => r.status === status).length;
  },

  apartmentNames() {
    return [...new Set(this.state.rooms.map((r) => r.apt))];
  },

  nextLeadId() {
    const nums = this.state.leads
      .map((l) => parseInt(String(l.id).replace(/\D/g, ""), 10))
      .filter((n) => !isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return "CON-" + String(next).padStart(3, "0");
  },

  nextSubscriberId() {
    const nums = this.state.subscribers
      .map((s) => parseInt(String(s.id).replace(/\D/g, ""), 10))
      .filter((n) => !isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return "SUB-" + String(next).padStart(3, "0");
  },

  addLead(payload) {
    const nowTime = "Ahora mismo · " + new Date().toTimeString().slice(0, 5);
    const id = this.nextLeadId();
    const lead = {
      id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "+34 600 123 456",
      roomId: payload.roomId || "HAB-024",
      date: payload.date || isoInDays(10),
      appointment: "Pendiente de agendar visita",
      lastChannel: "email",
      unread: true,
      message: payload.message || "",
      status: "nueva",
      createdAt: new Date().toISOString().slice(0, 10),
      notes: "Solicitud recibida desde formulario web público.",
      history: [
        { status: "nueva", at: new Date().toISOString().slice(0, 10), label: "Consulta recibida desde la web pública" }
      ],
      messages: [
        {
          id: "MSG-" + Date.now(),
          sender: "tenant",
          channel: "email",
          time: nowTime,
          text: payload.message || "Hola, solicito información y disponibilidad para visitar esta habitación."
        }
      ]
    };
    this.state.leads.unshift(lead);
    this.state.activeLeadId = id;
    this.state.tenantEmail = lead.email;
    const room = this.room(lead.roomId);
    this.addActivity(
      "Nueva consulta de " + lead.name + (room ? " sobre " + room.id : " desde la web"),
      "accent"
    );
    return lead;
  },

  sendAdminMessage(leadId, channel, text) {
    const lead = this.lead(leadId);
    if (!lead || !text) return null;
    const ch = channel || this.state.inboxChannel || "whatsapp";
    const msg = {
      id: "MSG-" + Date.now(),
      sender: "admin",
      channel: ch,
      time: "Ahora mismo · " + new Date().toTimeString().slice(0, 5),
      text
    };
    if (!Array.isArray(lead.messages)) lead.messages = [];
    lead.messages.push(msg);
    lead.lastChannel = ch;
    lead.unread = false;
    lead.message = text;
    if (lead.status === "nueva") {
      lead.status = "contactada";
      lead.history.push({
        status: "contactada",
        at: new Date().toISOString().slice(0, 10),
        label: "Respondido por " + (ch === "whatsapp" ? "WhatsApp Business" : "Email")
      });
    }
    this.addActivity(
      "Respuesta enviada a " + lead.name + " por " + (ch === "whatsapp" ? "WhatsApp" : "Email"),
      "ok"
    );
    return msg;
  },

  sendTenantMessage(leadId, text, channel) {
    const lead = this.lead(leadId);
    if (!lead || !text) return null;
    const ch = channel || "whatsapp";
    const msg = {
      id: "MSG-" + Date.now(),
      sender: "tenant",
      channel: ch,
      time: "Ahora mismo · " + new Date().toTimeString().slice(0, 5),
      text
    };
    if (!Array.isArray(lead.messages)) lead.messages = [];
    lead.messages.push(msg);
    lead.lastChannel = ch;
    lead.unread = true;
    lead.message = text;
    this.addActivity(
      "Nuevo mensaje de " + lead.name + " desde Mi espacio HABITIA",
      "accent"
    );
    return msg;
  },

  updateAppointment(leadId, appointmentText, noteText, origin) {
    const lead = this.lead(leadId);
    if (!lead || !appointmentText) return;
    lead.appointment = appointmentText;
    lead.status = "visita";
    const logLabel = origin === "tenant"
      ? "Solicitud de cambio de cita por el inquilino: " + appointmentText
      : "Cita confirmada para " + appointmentText;
    if (!Array.isArray(lead.messages)) lead.messages = [];
    if (noteText) {
      lead.messages.push({
        id: "MSG-" + Date.now() + "-a",
        sender: origin === "tenant" ? "tenant" : "admin",
        channel: lead.lastChannel || "whatsapp",
        time: "Ahora mismo · " + new Date().toTimeString().slice(0, 5),
        text: noteText
      });
    }
    lead.messages.push({
      id: "MSG-" + Date.now() + "-sys",
      sender: "system",
      channel: "system",
      time: "Ahora mismo",
      text: logLabel
    });
    lead.history.push({
      status: "visita",
      at: new Date().toISOString().slice(0, 10),
      label: logLabel
    });
    this.addActivity(logLabel + " (" + lead.name + ")", "ok");
  },

  addSubscriber(payload) {
    const sub = {
      id: this.nextSubscriberId(),
      email: payload.email,
      city: payload.city || "Madrid",
      area: payload.area || "Cualquier barrio",
      budget: Number(payload.budget) || 0,
      date: new Date().toISOString().slice(0, 10),
      active: true
    };
    this.state.subscribers.unshift(sub);
    this.addActivity("Nueva alerta de disponibilidad: " + sub.email, "accent");
    return sub;
  },

  updateLeadStatus(id, status) {
    const lead = this.lead(id);
    if (!lead) return;
    lead.status = status;
    const statusLabel = LEAD_STATUS[status] || status;
    lead.history.push({
      status,
      at: new Date().toISOString().slice(0, 10),
      label: "Estado actualizado a " + statusLabel
    });
    if (!Array.isArray(lead.messages)) lead.messages = [];
    lead.messages.push({
      id: "MSG-" + Date.now(),
      sender: "system",
      channel: "system",
      time: "Ahora mismo",
      text: "Estado del lead actualizado a «" + statusLabel + "»"
    });
    this.addActivity("Consulta " + id + " actualizada a " + statusLabel, "neutral");
  },

  updateRoom(id, patch) {
    const room = this.room(id);
    if (!room) return;
    Object.assign(room, patch);
    const linkedUnit = (this.state.inventoryUnits || []).find((u) => u.catalogRoomId === id || u.roomId === id);
    if (linkedUnit) {
      if (patch.status) linkedUnit.status = patch.status;
      if (patch.availableFrom) linkedUnit.contractEnd = patch.availableFrom;
      if (patch.price != null) linkedUnit.price = patch.price;
      if (patch.name) linkedUnit.unitLabel = patch.name;
    }
    this.addActivity("Habitación " + id + " actualizada", "neutral");
  },

  updateRooms(ids, patch) {
    ids.forEach((id) => {
      const room = this.room(id);
      if (room) Object.assign(room, patch);
      const linkedUnit = (this.state.inventoryUnits || []).find((u) => u.catalogRoomId === id || u.roomId === id);
      if (linkedUnit) {
        if (patch.status) linkedUnit.status = patch.status;
        if (patch.availableFrom) linkedUnit.contractEnd = patch.availableFrom;
        if (patch.price != null) linkedUnit.price = patch.price;
      }
    });
    this.addActivity(
      ids.length + (ids.length === 1 ? " habitación actualizada" : " habitaciones actualizadas") + " en bloque",
      "ok"
    );
  },

  // ---- Mapa Operativo de Ocupación Geográfica (100 habs.) -----------------
  inventoryUnit(uid) {
    return (this.state.inventoryUnits || []).find((u) => u.uid === uid || u.roomId === uid) || null;
  },

  operationalKpis() {
    const units = this.state.inventoryUnits || [];
    let available = 0;
    let upcoming = 0;
    let occupied = 0;
    units.forEach((u) => {
      if (u.status === "available") available++;
      else if (u.status === "upcoming") upcoming++;
      else occupied++;
    });
    return {
      total: units.length || 100,
      published: 85,
      available,
      upcoming,
      occupied
    };
  },

  districtCounts() {
    const units = this.state.inventoryUnits || [];
    const res = {
      Todos: units.length,
      Chamberí: 0,
      Salamanca: 0,
      Malasaña: 0,
      Moncloa: 0
    };
    units.forEach((u) => {
      if (res[u.district] != null) res[u.district]++;
    });
    return res;
  },

  filteredInventoryUnits() {
    const f = this.state.inventoryMap || {};
    return (this.state.inventoryUnits || []).filter((u) => {
      if (f.district && f.district !== "Todos" && u.district !== f.district) return false;
      if (f.status && f.status !== "all" && u.status !== f.status) return false;
      return true;
    });
  },

  buildingClusters() {
    const f = this.state.inventoryMap || {};
    const allUnits = this.state.inventoryUnits || [];
    return (this.state.buildings || [])
      .filter((b) => !f.district || f.district === "Todos" || b.district === f.district)
      .map((b) => {
        const bldUnits = allUnits.filter((u) => u.buildingId === b.id);
        const visibleUnits = bldUnits.filter((u) => !f.status || f.status === "all" || u.status === f.status);
        const available = bldUnits.filter((u) => u.status === "available").length;
        const upcoming = bldUnits.filter((u) => u.status === "upcoming").length;
        const occupied = bldUnits.filter((u) => u.status === "occupied").length;
        return {
          ...b,
          total: bldUnits.length,
          available,
          upcoming,
          occupied,
          units: bldUnits,
          visibleUnits
        };
      })
      .filter((b) => b.visibleUnits.length > 0);
  },

  updateInventoryUnit(uid, patch) {
    const unit = this.inventoryUnit(uid);
    if (!unit) return null;
    Object.assign(unit, patch);
    if (unit.status === "available") {
      unit.tenantName = "Sin inquilino (Vacante)";
      unit.releaseWindow = "Entrada inmediata";
    } else if (unit.status === "upcoming") {
      const days = Math.max(1, UI.daysUntil(unit.contractEnd));
      unit.releaseWindow = "Liberación en " + days + " días";
      if (unit.tenantName === "Sin inquilino (Vacante)") unit.tenantName = "Contrato en preaviso de salida";
    } else {
      unit.releaseWindow = "Contrato vigente";
      if (unit.tenantName === "Sin inquilino (Vacante)") unit.tenantName = "Inquilino con contrato activo";
    }
    if (unit.catalogRoomId) {
      const room = this.room(unit.catalogRoomId);
      if (room) {
        if (patch.status) room.status = patch.status;
        if (patch.contractEnd) room.availableFrom = patch.contractEnd;
        if (patch.price != null) room.price = Number(patch.price) || room.price;
      }
    }
    const statusLabel = STATUS_META[unit.status] ? STATUS_META[unit.status].label : unit.status;
    this.addActivity(
      "Mapa Operativo: " + unit.roomId + " (" + unit.buildingName + ") → " + statusLabel + " · " + unit.price + " €",
      unit.status === "available" ? "ok" : "accent"
    );
    return unit;
  },

  addActivity(text, tone) {
    this.state.activity.unshift({
      text,
      meta: "Laura Martín · ahora mismo",
      tone: tone || "neutral"
    });
    this.state.activity = this.state.activity.slice(0, 12);
  },

  capacityLeft() {
    return Math.max(0, this.adminLimit() - this.state.users.length);
  }
};
