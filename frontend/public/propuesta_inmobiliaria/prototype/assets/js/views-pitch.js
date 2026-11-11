/* HABITIA — Modo Presentación Comercial y Comparador de Paquetes (#pricing-pitch) */

const ViewsPitch = {
  demoBar() {
    const area = Store.state.area;
    const pkg = Store.state.pkg;
    const collapsed = Boolean(Store.state.pkgCollapsed);
    const pkgMeta = {
      essential: { label: "ESSENTIAL", price: "(3.500 €)" },
      improved: { label: "IMPROVED", price: "(4.900 €)" },
      complete: { label: "COMPLETE", price: "(9.000 €)" }
    };
    const currentMeta = pkgMeta[pkg] || pkgMeta.complete;

    const renderPkgBtn = (id) => {
      const active = pkg === id;
      const meta = pkgMeta[id];
      return (
        '<button type="button" class="seg-btn is-pkg tabular' + (active ? " is-active" : "") + '" aria-pressed="' + (active ? "true" : "false") + '" data-action="set-pkg" data-pkg="' + id + '">' +
          (active ? '<span class="pkg-indicator is-on">' + UI.icon("check") + '</span>' : '<span class="pkg-indicator" aria-hidden="true"></span>') +
          '<span>' + meta.label + ' ' + meta.price + '</span>' +
          (active ? '<span class="pkg-active-tag">ACTIVO</span>' : '') +
        '</button>'
      );
    };

    return (
      '<div class="demo-bar-inner">' +
        '<div class="demo-brand">' +
          '<span class="demo-tag">PROPUESTA AVENEW MADRID</span>' +
          '<span>HABITIA · Control Comercial</span>' +
        '</div>' +

        '<div class="demo-group">' +
          '<span class="demo-group-label">Rol / Vista:</span>' +
          '<div class="seg-control" role="group" aria-label="Navegación de roles y vistas">' +
            '<button type="button" class="seg-btn' + (area === "public" ? " is-active" : "") + '" data-action="switch-area" data-area="public">' +
              UI.icon("home") + 'Web Pública (B2C)' +
            '</button>' +
            '<button type="button" class="seg-btn' + (area === "tenant" ? " is-active" : "") + '" data-action="switch-area" data-area="tenant">' +
              UI.icon("user") + 'Portal Inquilino (Mi Espacio)' +
            '</button>' +
            '<button type="button" class="seg-btn' + (area === "admin" ? " is-active" : "") + '" data-action="switch-area" data-area="admin">' +
              UI.icon("grid") + 'Panel Administrativo (B2B)' +
            '</button>' +
            '<button type="button" class="seg-btn' + (area === "pitch" ? " is-active" : "") + '" data-action="switch-area" data-area="pitch">' +
              UI.icon("sparkles") + 'Propuesta y Paquetes (Pricing)' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="demo-group pkg-sim-group">' +
          '<span class="demo-group-label">Simulador Paquete:</span>' +
          (collapsed
            ? '<button type="button" class="pkg-collapsed-pill tabular" data-action="toggle-pkg-sim" title="Desplegar selector de paquetes">' +
                '<span class="pkg-indicator is-on">' + UI.icon("check") + '</span>' +
                '<span>Activo: <strong>' + currentMeta.label + ' ' + currentMeta.price + '</strong></span>' +
                '<span class="pkg-collapsed-action">Cambiar paquete ▾</span>' +
              '</button>'
            : '<div class="seg-control is-pkg-group" role="group" aria-label="Simulador de paquete en vivo">' +
                renderPkgBtn("essential") +
                renderPkgBtn("improved") +
                renderPkgBtn("complete") +
                '<button type="button" class="pkg-collapse-btn" data-action="toggle-pkg-sim" title="Plegar y dejar solo el paquete activo" aria-label="Plegar selector de paquetes">' +
                  UI.icon("close") + '<span>Plegar</span>' +
                '</button>' +
              '</div>') +
        '</div>' +
      '</div>'
    );
  },

  pricingPitch() {
    const activePkg = Store.state.pkg;

    const body =
      '<div class="container" style="padding:40px 24px 72px">' +
        /* 1. Resumen Ejecutivo de la Solución */
        '<div class="panel-card" style="margin-bottom:36px;background:#1B332C;color:#FFFFFF;border:0">' +
          '<div class="panel-card-body pitch-hero-grid">' +
            '<div class="od-stack" style="--od-gap:12px">' +
              '<span class="demo-tag" style="width:fit-content">PROPUESTA COMERCIAL Y ARQUITECTURA POR NIVELES</span>' +
              '<h1 style="margin:0;font-size:clamp(1.75rem,3vw,2.45rem);line-height:1.15">Plataforma de Alquiler, Inbox Omnicanal, Portal del Inquilino y Mapa Operativo para Avenew Madrid</h1>' +
              '<p style="margin:0;color:#D0DDD8;font-size:0.98rem">Transformamos la operativa de 100 habitaciones en Madrid con tres niveles evolutivos: desde el catálogo digital con alertas por correo (Essential), pasando por el Inbox Unificado con WhatsApp Business API (Improved), hasta el Mapa Operativo de Ocupación con Semáforo (Verde/Naranja/Rojo) y el portal Passwordless «Mi espacio HABITIA» (Complete).</p>' +
              '<div style="display:flex;gap:12px;flex-wrap:wrap;padding-top:8px">' +
                '<button class="btn btn-accent" type="button" data-action="nav" data-route="admin-inventory-map">' + UI.icon("map") + 'Abrir Mapa Operativo 100 habs. (Complete)</button>' +
                '<button class="btn btn-outline" style="background:rgba(255,255,255,0.1);color:#FFF;border-color:rgba(255,255,255,0.35)" type="button" data-action="nav" data-route="admin-inbox">' + UI.icon("whatsapp") + 'Probar Inbox Omnicanal (Improved)</button>' +
                '<button class="btn btn-outline" style="background:transparent;color:#FFF;border-color:rgba(255,255,255,0.28)" type="button" data-action="nav" data-route="tenant-portal">' + UI.icon("user") + 'Abrir Portal Inquilino</button>' +
              '</div>' +
            '</div>' +
            '<div class="grid-2" style="gap:14px">' +
              '<div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:var(--radius-md)">' +
                '<strong class="tabular" style="font-size:1.65rem;display:block">100 habs.</strong>' +
                '<span style="font-size:0.82rem;color:#C2D2CC">Mapa Operativo con semáforo Verde / Naranja / Rojo</span>' +
              '</div>' +
              '<div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:var(--radius-md)">' +
                '<strong class="tabular" style="font-size:1.65rem;display:block">WA + Email</strong>' +
                '<span style="font-size:0.82rem;color:#C2D2CC">Inbox unificado en el panel sin cambiar de app</span>' +
              '</div>' +
              '<div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:var(--radius-md)">' +
                '<strong class="tabular" style="font-size:1.65rem;display:block">Passwordless</strong>' +
                '<span style="font-size:0.82rem;color:#C2D2CC">Magic Link para seguimiento de citas y estado</span>' +
              '</div>' +
              '<div style="background:rgba(255,255,255,0.08);padding:18px;border-radius:var(--radius-md)">' +
                '<strong class="tabular" style="font-size:1.65rem;display:block">3 niveles</strong>' +
                '<span style="font-size:0.82rem;color:#C2D2CC">Conmutador en vivo: 3.500 € · 4.900 € · 9.000 €</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* 2. Tarjetas Comparativas de los 3 Paquetes */
        '<div class="section-head">' +
          '<div>' +
            '<span class="eyebrow">Propuesta de valor por paquetes (Precios sin IVA)</span>' +
            '<h2>Niveles de producto para Avenew Real Estate</h2>' +
            '<p>Pulsa sobre cualquier paquete para activar su simulación en todo el prototipo y comprobar el alcance de cada nivel.</p>' +
          '</div>' +
        '</div>' +

        '<div class="pricing-grid" style="margin-bottom:28px">' +
          PACKAGES.map((p) => {
            const isRec = p.id === "improved";
            const isCurrent = activePkg === p.id;
            return (
              '<article class="pricing-card' + (isRec ? " is-recommended" : "") + (isCurrent ? " is-active-pkg" : "") + '">' +
                (isCurrent
                  ? '<span class="pricing-ribbon is-active-ribbon">' + UI.icon("check") + ' PAQUETE ACTIVO EN SIMULADOR</span>'
                  : isRec
                    ? '<span class="pricing-ribbon">Opción Recomendada</span>'
                    : "") +
                '<div>' +
                  '<span class="eyebrow" style="margin-bottom:4px">' + UI.esc(p.tagline) + '</span>' +
                  '<h3 style="margin:0;font-size:1.5rem;font-weight:800">' + UI.esc(p.name.toUpperCase()) + '</h3>' +
                '</div>' +
                '<div class="pricing-price tabular">' +
                  UI.num(p.price) + ' € <span>· implantación (sin IVA)</span>' +
                '</div>' +
                '<p style="margin:0;font-size:0.9rem;color:var(--text-secondary)">' + UI.esc(p.summary) + '</p>' +
                '<ul class="pricing-list">' +
                  p.features.map((f) => '<li>' + UI.icon("check") + '<span>' + UI.esc(f) + '</span></li>').join("") +
                '</ul>' +
                '<button type="button" class="btn ' + (isCurrent ? "btn-accent" : "btn-outline") + ' btn-lg" data-action="set-pkg" data-pkg="' + p.id + '">' +
                  (isCurrent ? UI.icon("check") + "ACTIVO: " + p.name.toUpperCase() + " (" + UI.num(p.price) + " €)" : "Activar paquete " + p.name.toUpperCase()) +
                '</button>' +
              '</article>'
            );
          }).join("") +
        '</div>' +

        /* 3. Nota Técnica de Integración (Caja informativa visual destacada) */
        '<div class="tech-note-box" style="margin-bottom:40px">' +
          '<span class="tech-note-icon">' + UI.icon("info") + '</span>' +
          '<div>' +
            '<strong style="display:block;margin-bottom:3px;font-size:0.95rem">Nota Técnica de Integración (WhatsApp Business Cloud API — Meta)</strong>' +
            '<p style="margin:0;font-size:0.9rem;line-height:1.55">' + UI.esc(WHATSAPP_TECH_NOTE) + '</p>' +
          '</div>' +
        '</div>' +

        /* 4. Matriz Comparativa Interactiva Funcionalidad por Funcionalidad */
        '<div class="panel-card">' +
          '<div class="panel-card-head">' +
            '<div>' +
              '<h3>Tabla comparativa de paquetes y acceso rápido a cada pantalla</h3>' +
              '<p style="margin:2px 0 0;font-size:0.84rem;color:var(--text-secondary)">Haz clic en los botones de acción para probar en directo cada flujo dentro del prototipo.</p>' +
            '</div>' +
          '</div>' +
          '<div class="table-wrap">' +
            '<table class="data-table">' +
              '<thead>' +
                '<tr>' +
                  '<th>Módulo / Funcionalidad</th>' +
                  '<th>ESSENTIAL (3.500 €)</th>' +
                  '<th>IMPROVED (4.900 €)</th>' +
                  '<th>COMPLETE (9.000 €)</th>' +
                  '<th>Probar en el prototipo</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' +
                COMPARISON.map((row) => {
                  const cell = (val) => val
                    ? '<span class="badge is-ok">' + UI.icon("check") + ' Incluido</span>'
                    : '<span style="color:var(--text-muted)">No incluido</span>';
                  return (
                    '<tr>' +
                      '<td><strong>' + UI.esc(row.module) + '</strong></td>' +
                      '<td>' + cell(row.essential) + '</td>' +
                      '<td>' + cell(row.improved) + '</td>' +
                      '<td>' + cell(row.complete) + '</td>' +
                      '<td>' +
                        '<button type="button" class="btn btn-outline btn-sm" data-action="try-feature" data-target="' + row.route + '">' +
                          UI.icon("play") + UI.esc(row.label || "Probar función") +
                        '</button>' +
                      '</td>' +
                    '</tr>'
                  );
                }).join("") +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
      '</div>';

    return ViewsPublic.header() + '<main id="main">' + body + '</main>' + ViewsPublic.footer();
  }
};
