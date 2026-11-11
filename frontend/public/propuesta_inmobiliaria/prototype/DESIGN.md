# HABITIA (by Avenew Madrid) — Sistema de Diseño (`DESIGN.md`)

Documento de referencia visual y arquitectura de tokens para la plataforma de gestión y alquiler de habitaciones **HABITIA**, concebida como marca blanca adaptable para **Avenew Real Estate (Madrid)**.

---

## 1. Principios de Dirección Visual

1. **Web Pública (B2C — Residencial Editorial):**
   - Superficies cálidas en alabastro (`#F7F6F2`) y blanco puro (`#FFFFFF`), inspiradas en interiorismo mediterráneo-urbano.
   - Fotografía luminosa de dormitorios y zonas comunes reales con proporciones estables (`4:3` en tarjetas de catálogo y `16:10` en portada de ficha).
   - Transparencia total en condiciones económicas (fianza, suministros, estancia mínima) y fechas exactas de liberación.
2. **Panel Administrativo (B2B SaaS — Productividad Silenciosa):**
   - Alta densidad informativa organizada con tipografía tabular (`font-variant-numeric: tabular-nums`), bordes sutiles (`#E7E6E0`) y barra lateral oscura (`#172B25`) para separar claramente el entorno operativo del escaparate público.
   - Cero adornos innecesarios: los colores vivos se reservan exclusivamente para estados de disponibilidad, validación de datos de Excel y alertas operativas.
3. **Presentación Comercial Integrada (Interactive Pitch Bar):**
   - Barra superior fija que permite durante la reunión comercial alternar en tiempo real entre **Web Pública (B2C)**, **Mi espacio HABITIA (Portal del Inquilino)**, **Panel Admin & Inbox Omnicanal** y **Propuesta & Paquetes**, así como simular los paquetes **ESSENTIAL (3.500 €)**, **IMPROVED (4.900 €)** y **COMPLETE (9.000 €)**.
4. **Inbox Omnicanal (`#admin-inbox`), Mapa Operativo (`#admin-inventory-map`) y Portal Passwordless (`#tenant-portal`):**
   - El Inbox Omnicanal en 3 paneles diferencia visualmente los mensajes entrantes de **WhatsApp Business** (`#E6F7ED`), los correos **Email** (`#EDF2F7`), las respuestas del administrador (`#1E4339`) y los eventos de cita del sistema (`#FEF3E2`).
   - El **Mapa Operativo de Ocupación Geográfica (`#admin-inventory-map`)** representa las 100 habitaciones de Madrid mediante clusters dinámicos con anillos SVG segmentados y pines individuales gobernados por el **Semáforo Operativo de Ocupación** (Verde `#28A745`, Naranja `#F59E0B`, Rojo `#DC2626`).
   - En resoluciones móviles (`<= 860px`), la lista de chats se contrae automáticamente al abrir una conversación y el mapa operativo reorganiza su cajón lateral en flujo vertical.

---

## 2. Paleta de Colores (CSS Custom Properties)

Para personalizar la marca final del cliente basta con editar el bloque `:root` en `assets/css/styles.css`:

| Token | Valor Hex | Uso principal |
| :--- | :--- | :--- |
| `--bg-primary` | `#F7F6F2` | Fondo general de la web pública (Alabastro cálido) |
| `--bg-surface` | `#FFFFFF` | Tarjetas, tablas, modales y paneles laterales |
| `--brand-primary` | `#234B40` | Verde bosque profundo — cabeceras, acción primaria, foco |
| `--brand-secondary` | `#427565` | Verde salvia oscuro — estados hover y elementos activos |
| `--brand-accent` | `#C47B61` | Terracota cálido — CTAs destacados y paquete recomendado |
| `--text-primary` | `#252B29` | Carbón suave para titulares y cuerpo de lectura (contraste > 12:1) |
| `--text-secondary` | `#58605C` | Gris piedra oscuro para subtítulos y metadatos |
| `--border-subtle` | `#E7E6E0` | Divisorias de tablas, tarjetas y contenedores |

### Semáforo Operativo de Ocupación
- 🟢 **Disponible ahora (`is-ok`):** Fondo `#E6F4EA` · Texto `#1E6F43` · Pin `#28A745`
- 🟠 **Próxima disponibilidad (`is-soon`):** Fondo `#FEF3E2` · Texto `#B45309` · Pin `#F59E0B`
- 🔴 **Ocupada / No disponible (`is-off`):** Fondo `#FEE2E2` · Texto `#991B1B` · Pin `#DC2626`
- **Error / Alerta (`is-err`):** Fondo `#FEE2E2` · Texto `#B91C1C`

---

## 3. Tipografía y Escala

- **Familia tipográfica:** `Manrope` (pesos 400, 500, 600, 700, 800).
- **Números tabulares:** Aplicados mediante `font-variant-numeric: tabular-nums` en precios mensuales, KPIs, cuentas atrás de liberación, pines del mapa y tablas de inventario.
- **Geometría y radios:** Bordes contenidos de `6px` (`--radius-sm`), `8px` (`--radius-md`) y `10px` (`--radius-lg`), evitando redondeos excesivos.
- **Iconografía:** Familia única de iconos vectoriales en línea con `.od-icon` (`stroke-width: 1.8`, esquinas redondeadas).
