/* HABITIA — datos semilla del prototipo (estado en memoria) */

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function isoInDays(days) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const IMG = {
  hero: "assets/img/hero.jpg",
  room1: "assets/img/room1.jpg",
  room2: "assets/img/room2.jpg",
  room3: "assets/img/room3.jpg",
  room4: "assets/img/room4.jpg",
  room5: "assets/img/room5.jpg",
  room6: "assets/img/room6.jpg",
  room7: "assets/img/room7.jpg",
  room8: "assets/img/room8.jpg",
  living: "assets/img/living.jpg",
  kitchen: "assets/img/kitchen.jpg",
  bathroom: "assets/img/bathroom.jpg",
  chamberi: "assets/img/nbr-chamberi.jpg",
  salamanca: "assets/img/nbr-salamanca.jpg",
  malasana: "assets/img/nbr-malasana.jpg",
  arguelles: "assets/img/nbr-arguelles.jpg",
  valencia: "assets/img/valencia.jpg",
  malaga: "assets/img/malaga.jpg"
};

const IMG_ALT = {
  hero: "Dormitorio luminoso con cama, planta y luz natural de mañana",
  room1: "Habitación minimalista con cama vestida en blanco y suelo de madera",
  room2: "Dormitorio escandinavo con ventanal y luz natural",
  room3: "Habitación con escritorio junto a la ventana",
  room4: "Dormitorio cálido con lámpara encendida y textiles naturales",
  room5: "Habitación con balcón y vistas a la ciudad",
  room6: "Habitación pequeña con estantería y mesilla",
  room7: "Habitación con pared verde y cama nórdica",
  room8: "Dormitorio con butaca de lectura y luz de ambiente",
  living: "Salón de apartamento en Madrid con sofá y decoración elegante",
  kitchen: "Cocina moderna de apartamento con muebles claros",
  bathroom: "Baño contemporáneo con ducha y azulejo claro",
  chamberi: "Calle de Chamberí con arquitectura clásica madrileña",
  salamanca: "Fachada residencial del barrio de Salamanca",
  malasana: "Calle adoquinada del centro de Madrid con cafeterías",
  arguelles: "Parque arbolado junto a Argüelles en Madrid",
  valencia: "Calle del centro histórico de Valencia",
  malaga: "Vista urbana de Málaga con edificios y plaza"
};

const APARTMENTS = {
  "Apt. Velázquez 42": {
    city: "Madrid", area: "Salamanca", zone: "Goya",
    address: "Calle de Velázquez 42, 4.º B", cp: "28001",
    rooms: 5, baths: 2, floor: "4.º exterior", elevator: true, cleaning: true,
    ambience: "Piso señorial reformado en 2024, con salón amplio, cocina office y cinco habitaciones. Convivencia tranquila de profesionales entre 25 y 34 años.",
    metro: ["Metro Velázquez (L4) — 2 min", "Metro Goya (L2, L4) — 4 min", "Bus 1, 9, 19, 51 — 1 min"]
  },
  "Apt. Santa Engracia 108": {
    city: "Madrid", area: "Chamberí", zone: "Trafalgar",
    address: "Calle de Santa Engracia 108, 2.º A", cp: "28003",
    rooms: 5, baths: 2, floor: "2.º exterior", elevator: true, cleaning: true,
    ambience: "Finca clásica con techos altos y suelos hidráulicos originales. Zona de cafeterías de barrio y mercado de Chamberí a cinco minutos andando.",
    metro: ["Metro Alonso Cano (L7) — 3 min", "Metro Ríos Rosas (L1) — 6 min", "Bus 3, 37 — 1 min"]
  },
  "Apt. Fuencarral 64": {
    city: "Madrid", area: "Malasaña", zone: "Universidad",
    address: "Calle de Fuencarral 64, 3.º D", cp: "28004",
    rooms: 4, baths: 2, floor: "3.º exterior", elevator: false, cleaning: true,
    ambience: "Piso con encanto en pleno Malasaña, reformado manteniendo vigas y ladrillo visto. Ambiente joven, con terraza comunitaria para uso de los inquilinos.",
    metro: ["Metro Tribunal (L1, L10) — 3 min", "Metro Bilbao (L1, L4) — 5 min", "BiciMAD a 100 m"]
  },
  "Apt. Princesa 31": {
    city: "Madrid", area: "Argüelles", zone: "Moncloa",
    address: "Calle de la Princesa 31, 1.º C", cp: "28008",
    rooms: 4, baths: 2, floor: "1.º exterior", elevator: true, cleaning: true,
    ambience: "Vivienda funcional y muy luminosa junto a Plaza de España y Parque del Oeste. Muy bien conectada con Moncloa y Ciudad Universitaria.",
    metro: ["Metro Argüelles (L3, L4, L6) — 3 min", "Metro Ventura Rodríguez (L3) — 4 min", "Bus 1, 44, 133 — 1 min"]
  },
  "Apt. Orense 28": {
    city: "Madrid", area: "Tetuán", zone: "Cuzco · AZCA",
    address: "Calle de Orense 28, 6.º A", cp: "28020",
    rooms: 5, baths: 2, floor: "6.º exterior con terraza", elevator: true, cleaning: true,
    ambience: "Piso moderno junto al distrito financiero de AZCA y Paseo de la Castellana. Ideal para jóvenes profesionales y consultores.",
    metro: ["Metro Santiago Bernabéu (L10) — 4 min", "Metro Nuevos Ministerios (L6, L8, L10, Cercanías) — 6 min"]
  },
  "Apt. Atocha 85": {
    city: "Madrid", area: "Lavapiés", zone: "Embajadores",
    address: "Calle de Atocha 85, 2.º B", cp: "28012",
    rooms: 5, baths: 2, floor: "2.º exterior", elevator: true, cleaning: true,
    ambience: "Edificio rehabilitado con patio interior ajardinado. Cocina comunitaria amplia y salón compartido con mesa para seis personas.",
    metro: ["Metro Antón Martín (L1) — 2 min", "Metro Estación del Arte (L1) — 5 min", "Cercanías Atocha — 8 min"]
  }
};

function gallery(main, second) {
  return [
    { src: IMG[main], alt: IMG_ALT[main] },
    { src: IMG.living, alt: IMG_ALT.living },
    { src: IMG.kitchen, alt: IMG_ALT.kitchen },
    { src: IMG[second], alt: IMG_ALT[second] },
    { src: IMG.bathroom, alt: IMG_ALT.bathroom }
  ];
}

const ROOMS = [
  {
    id: "HAB-024", name: "Habitación 24 · Individual luminosa en Velázquez",
    apt: "Apt. Velázquez 42", city: "Madrid", area: "Salamanca", zone: "Velázquez · Goya",
    price: 450, expenses: "fijos", expensesNote: "Suministros fijos 40 €/mes (luz, agua, gas, WiFi 1Gb y limpieza)",
    deposit: 450, minStay: 6, status: "available", availableFrom: isoInDays(0),
    published: true, size: 11,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room4", gallery: gallery("room4", "room1"),
    coords: { x: 64, y: 35 },
    description: "Habitación 24 en el apartamento de Velázquez 42. Dormitorio muy tranquilo y luminoso con cama de 120 cm, escritorio de estudio, armario empotrado y cerradura propia. La opción de entrada más competitiva en pleno barrio de Salamanca.",
    ambience: "Piso señorial reformado con salón amplio y convivencia tranquila de jóvenes profesionales."
  },
  {
    id: "HAB-001", name: "Doble exterior con balcón a Velázquez",
    apt: "Apt. Velázquez 42", city: "Madrid", area: "Salamanca", zone: "Goya",
    price: 720, expenses: "incluidos", expensesNote: "Suministros incluidos (luz, agua, gas y WiFi)",
    deposit: 720, minStay: 3, status: "available", availableFrom: isoInDays(0),
    published: true, size: 16,
    bath: "private", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room1", gallery: gallery("room1", "room5"),
    coords: { x: 63, y: 34 },
    description: "Habitación doble de 16 m² con balcón propio a la calle, armario empotrado de suelo a techo y escritorio junto a la ventana. Se entrega amueblada y lista para entrar.",
    ambience: "Piso reformado con salón amplio y cocina office. Ideal para profesionales que buscan un barrio tranquilo y bien conectado."
  },
  {
    id: "HAB-002", name: "Luminosa con escritorio junto a Goya",
    apt: "Apt. Velázquez 42", city: "Madrid", area: "Salamanca", zone: "Lista",
    price: 640, expenses: "fijos", expensesNote: "Suministros 45 €/mes por habitación",
    deposit: 640, minStay: 3, status: "upcoming", availableFrom: isoInDays(15),
    published: true, size: 13,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room2", gallery: gallery("room2", "room6"),
    coords: { x: 66, y: 30 },
    description: "Habitación exterior de 13 m² con ventanal al patio interior ajardinado, mesa de trabajo amplia, silla ergonómica y punto de red.",
    ambience: "Convivirás con cuatro personas en un piso silencioso, con zonas comunes limpias y bien equipadas."
  },
  {
    id: "HAB-003", name: "Suite con baño privado y vestidor",
    apt: "Apt. Velázquez 42", city: "Madrid", area: "Salamanca", zone: "Goya",
    price: 890, expenses: "incluidos", expensesNote: "Suministros incluidos y limpieza semanal de la habitación",
    deposit: 890, minStay: 6, status: "available", availableFrom: isoInDays(0),
    published: true, size: 22,
    bath: "private", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room3", gallery: gallery("room3", "room7"),
    coords: { x: 61, y: 37 },
    description: "La habitación principal del piso: 22 m², baño en suite, vestidor y orientación este. Incluye limpieza semanal del dormitorio.",
    ambience: "Compartirás zonas comunes con tres personas más, en un piso de techos altos y mucha luz natural."
  },
  {
    id: "HAB-004", name: "Interior silenciosa en Chamberí",
    apt: "Apt. Santa Engracia 108", city: "Madrid", area: "Chamberí", zone: "Trafalgar",
    price: 495, expenses: "fijos", expensesNote: "Suministros 40 €/mes por habitación",
    deposit: 495, minStay: 3, status: "occupied", availableFrom: isoInDays(90),
    published: true, size: 11,
    bath: "shared", exterior: false, desk: true, ac: false, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room6", gallery: gallery("room6", "room1"),
    coords: { x: 41, y: 26 },
    description: "Habitación interior de 11 m², muy silenciosa, equipada con cama de 135, escritorio y armario de dos puertas.",
    ambience: "Piso clásico de Chamberí con cocina amplia y salón compartido. Perfil tranquilo y estable."
  },
  {
    id: "HAB-005", name: "Exterior con vistas al patio ajardinado",
    apt: "Apt. Santa Engracia 108", city: "Madrid", area: "Chamberí", zone: "Almagro",
    price: 610, expenses: "incluidos", expensesNote: "Suministros incluidos",
    deposit: 610, minStay: 3, status: "upcoming", availableFrom: isoInDays(7),
    published: true, size: 14,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room5", gallery: gallery("room5", "room2"),
    coords: { x: 38, y: 30 },
    description: "Habitación exterior de 14 m² con dos ventanas al patio interior, cama de 150 y zona de trabajo junto a la ventana.",
    ambience: "Convivirás con otras cuatro personas en un piso con suelos hidráulicos originales y mucha luz."
  },
  {
    id: "HAB-006", name: "Doble amueblada junto a Alonso Cano",
    apt: "Apt. Santa Engracia 108", city: "Madrid", area: "Chamberí", zone: "Trafalgar",
    price: 665, expenses: "incluidos", expensesNote: "Suministros incluidos (luz, agua, gas y WiFi)",
    deposit: 665, minStay: 3, status: "available", availableFrom: isoInDays(0),
    published: true, size: 15,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room7", gallery: gallery("room7", "room3"),
    coords: { x: 36, y: 24 },
    description: "Habitación doble de 15 m² con cama de 150, armario empotrado, estantería y mesa de trabajo. Lista para entrar a vivir.",
    ambience: "Comparte piso con cuatro personas. Cocina reformada y salón con mesa para seis."
  },
  {
    id: "HAB-007", name: "Abuhardillada con encanto en Malasaña",
    apt: "Apt. Fuencarral 64", city: "Madrid", area: "Malasaña", zone: "Universidad",
    price: 590, expenses: "fijos", expensesNote: "Suministros 40 €/mes por habitación",
    deposit: 590, minStay: 1, status: "available", availableFrom: isoInDays(0),
    published: true, size: 12,
    bath: "shared", exterior: true, desk: true, ac: false, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room8", gallery: gallery("room8", "room4"),
    coords: { x: 45, y: 42 },
    description: "Habitación abuhardillada de 12 m² con vigas vistas, cama de 135 y zona de lectura. Un rincón con mucho carácter en pleno centro.",
    ambience: "Piso joven en Malasaña con terraza comunitaria. Ambiente social, respetuoso y con normas claras de convivencia."
  },
  {
    id: "HAB-008", name: "Escritorio ergonómico en Fuencarral",
    apt: "Apt. Fuencarral 64", city: "Madrid", area: "Malasaña", zone: "Universidad",
    price: 625, expenses: "fijos", expensesNote: "Suministros 40 €/mes por habitación",
    deposit: 625, minStay: 3, status: "upcoming", availableFrom: isoInDays(30),
    published: true, size: 13,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room3", gallery: gallery("room3", "room5"),
    coords: { x: 47, y: 40 },
    description: "Habitación exterior de 13 m² preparada para teletrabajo: mesa de 140 cm, silla ergonómica, lámpara de mesa y fibra de 1 Gb.",
    ambience: "Piso de cuatro habitaciones en Malasaña, con salón compartido y cocina equipada."
  },
  {
    id: "HAB-009", name: "Doble exterior con balcón en Malasaña",
    apt: "Apt. Fuencarral 64", city: "Madrid", area: "Malasaña", zone: "Universidad",
    price: 690, expenses: "incluidos", expensesNote: "Suministros incluidos",
    deposit: 690, minStay: 9, status: "occupied", availableFrom: isoInDays(120),
    published: true, size: 17,
    bath: "private", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room2", gallery: gallery("room2", "room8"),
    coords: { x: 49, y: 39 },
    description: "Habitación doble de 17 m² con baño privado y dos balcones a Fuencarral. La más solicitada del edificio.",
    ambience: "Convivencia de cuatro personas, con limpieza semanal de zonas comunes incluida."
  },
  {
    id: "HAB-010", name: "Habitación exterior junto a Plaza de España",
    apt: "Apt. Princesa 31", city: "Madrid", area: "Argüelles", zone: "Moncloa",
    price: 580, expenses: "fijos", expensesNote: "Suministros 42 €/mes por habitación",
    deposit: 580, minStay: 1, status: "available", availableFrom: isoInDays(0),
    published: true, size: 12,
    bath: "shared", exterior: true, desk: true, ac: false, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room1", gallery: gallery("room1", "room3"),
    coords: { x: 30, y: 36 },
    description: "Habitación exterior de 12 m² con cama de 135, armario y escritorio. A tres minutos de Plaza de España.",
    ambience: "Piso de cuatro habitaciones muy luminoso. Convivencia tranquila con estudiantes de posgrado y profesionales."
  },
  {
    id: "HAB-011", name: "Habitación con balcón hacia Moncloa",
    apt: "Apt. Princesa 31", city: "Madrid", area: "Argüelles", zone: "Moncloa",
    price: 615, expenses: "fijos", expensesNote: "Suministros 42 €/mes por habitación",
    deposit: 615, minStay: 9, status: "upcoming", availableFrom: isoInDays(45),
    published: true, size: 14,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room5", gallery: gallery("room5", "room7"),
    coords: { x: 28, y: 32 },
    description: "Habitación de 14 m² con balcón propio, cama de 150 y armario de cuatro puertas. Muy bien comunicada con Moncloa y el centro.",
    ambience: "Piso funcional de cuatro habitaciones, con cocina equipada y salón compartido."
  },
  {
    id: "HAB-012", name: "Ejecutiva exterior junto a Castellana / AZCA",
    apt: "Apt. Orense 28", city: "Madrid", area: "Tetuán", zone: "Cuzco · Nuevos Ministerios",
    price: 675, expenses: "incluidos", expensesNote: "Suministros incluidos y limpieza semanal",
    deposit: 675, minStay: 12, status: "available", availableFrom: isoInDays(0),
    published: true, size: 15,
    bath: "private", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room3", gallery: gallery("room3", "room2"),
    coords: { x: 52, y: 14 },
    description: "Habitación exterior de 15 m² con baño privado y vistas despejadas en Calle Orense, a cinco minutos de Nuevos Ministerios.",
    ambience: "Piso de perfil corporativo y consultoría, muy silencioso entre semana."
  },
  {
    id: "HAB-013", name: "Estudio luminoso en Cuzco · Orense",
    apt: "Apt. Orense 28", city: "Madrid", area: "Tetuán", zone: "Cuzco",
    price: 560, expenses: "fijos", expensesNote: "Suministros 40 €/mes",
    deposit: 560, minStay: 3, status: "upcoming", availableFrom: isoInDays(20),
    published: true, size: 13,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room6", gallery: gallery("room6", "room4"),
    coords: { x: 55, y: 16 },
    description: "Habitación de 13 m² con gran ventanal, escritorio de trabajo y armario empotrado en edificio con portero físico.",
    ambience: "Vivienda compartida de cinco habitaciones con terraza soleada."
  },
  {
    id: "HAB-014", name: "Habitación en piso rehabilitado de Lavapiés",
    apt: "Apt. Atocha 85", city: "Madrid", area: "Lavapiés", zone: "Embajadores · Atocha",
    price: 485, expenses: "incluidos", expensesNote: "Suministros incluidos",
    deposit: 485, minStay: 1, status: "upcoming", availableFrom: isoInDays(60),
    published: true, size: 12,
    bath: "shared", exterior: false, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room4", gallery: gallery("room4", "room6"),
    coords: { x: 54, y: 62 },
    description: "Habitación de 12 m² en edificio rehabilitado junto a Antón Martín y Estación del Arte, con cama de 135 y escritorio.",
    ambience: "Edificio con patio ajardinado, salón compartido y cocina grande."
  },
  {
    id: "HAB-015", name: "Habitación interior tranquila en Velázquez",
    apt: "Apt. Velázquez 42", city: "Madrid", area: "Salamanca", zone: "Goya",
    price: 530, expenses: "fijos", expensesNote: "Suministros 40 €/mes por habitación",
    deposit: 530, minStay: 6, status: "occupied", availableFrom: isoInDays(42),
    published: true, size: 12,
    bath: "shared", exterior: false, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room6", gallery: gallery("room6", "room4"),
    coords: { x: 65, y: 36 },
    description: "Habitación silenciosa orientada a patio de manzana amplio en Velázquez 42. Actualmente habitada con fecha de desalojo confirmada.",
    ambience: "Piso señorial reformado con salón amplio y convivencia tranquila de jóvenes profesionales."
  },
  {
    id: "HAB-016", name: "Habitación soleada con balcón en Santa Engracia",
    apt: "Apt. Santa Engracia 108", city: "Madrid", area: "Chamberí", zone: "Trafalgar",
    price: 635, expenses: "incluidos", expensesNote: "Suministros incluidos",
    deposit: 635, minStay: 3, status: "available", availableFrom: isoInDays(0),
    published: true, size: 14,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room1", gallery: gallery("room1", "room5"),
    coords: { x: 39, y: 27 },
    description: "Dormitorio exterior con balcón clásico a la calle Santa Engracia, techos altos y escritorio de roble.",
    ambience: "Finca clásica con techos altos y suelos hidráulicos originales en pleno Chamberí."
  },
  {
    id: "HAB-017", name: "Doble luminosa con zona de estudio en Fuencarral",
    apt: "Apt. Fuencarral 64", city: "Madrid", area: "Malasaña", zone: "Universidad",
    price: 645, expenses: "incluidos", expensesNote: "Suministros incluidos",
    deposit: 645, minStay: 3, status: "available", availableFrom: isoInDays(0),
    published: true, size: 15,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room5", gallery: gallery("room5", "room8"),
    coords: { x: 46, y: 41 },
    description: "Habitación doble exterior lista para entrar hoy en el apartamento de Fuencarral 64, con cama de 150 cm y balcón.",
    ambience: "Piso joven en Malasaña con terraza comunitaria y excelente ambiente."
  },
  {
    id: "HAB-018", name: "Doble exterior reformada en Princesa",
    apt: "Apt. Princesa 31", city: "Madrid", area: "Argüelles", zone: "Moncloa",
    price: 640, expenses: "fijos", expensesNote: "Suministros 42 €/mes por habitación",
    deposit: 640, minStay: 3, status: "available", availableFrom: isoInDays(0),
    published: true, size: 15,
    bath: "private", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room2", gallery: gallery("room2", "room1"),
    coords: { x: 29, y: 35 },
    description: "Habitación doble con baño privado en el piso de Princesa 31, disponible para entrada inmediata.",
    ambience: "Vivienda funcional y muy luminosa junto a Plaza de España y Parque del Oeste."
  },
  {
    id: "HAB-019", name: "Habitación individual tranquila en Princesa",
    apt: "Apt. Princesa 31", city: "Madrid", area: "Argüelles", zone: "Moncloa",
    price: 515, expenses: "fijos", expensesNote: "Suministros 42 €/mes por habitación",
    deposit: 515, minStay: 6, status: "occupied", availableFrom: isoInDays(55),
    published: true, size: 11,
    bath: "shared", exterior: false, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room4", gallery: gallery("room4", "room6"),
    coords: { x: 31, y: 34 },
    description: "Dormitorio individual con fecha de desalojo programada. Ideal para reservar con antelación para el próximo trimestre.",
    ambience: "Piso de cuatro habitaciones muy luminoso junto a Moncloa."
  },
  {
    id: "HAB-020", name: "Doble exterior con vestidor en Orense",
    apt: "Apt. Orense 28", city: "Madrid", area: "Tetuán", zone: "Cuzco · AZCA",
    price: 640, expenses: "incluidos", expensesNote: "Suministros incluidos y limpieza semanal",
    deposit: 640, minStay: 6, status: "available", availableFrom: isoInDays(0),
    published: true, size: 14,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room7", gallery: gallery("room7", "room3"),
    coords: { x: 53, y: 15 },
    description: "Habitación exterior disponible hoy en el apartamento de Calle Orense 28, junto a Castellana y Nuevos Ministerios.",
    ambience: "Piso moderno junto al distrito financiero de AZCA."
  },
  {
    id: "HAB-021", name: "Habitación con terraza compartida en Orense",
    apt: "Apt. Orense 28", city: "Madrid", area: "Tetuán", zone: "Cuzco · AZCA",
    price: 595, expenses: "fijos", expensesNote: "Suministros 40 €/mes",
    deposit: 595, minStay: 6, status: "occupied", availableFrom: isoInDays(38),
    published: true, size: 13,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room8", gallery: gallery("room8", "room2"),
    coords: { x: 54, y: 15 },
    description: "Habitación actualmente habitada con fecha de salida confirmada. Permite activar aviso automático de liberación.",
    ambience: "Piso moderno junto a AZCA y Paseo de la Castellana."
  },
  {
    id: "HAB-022", name: "Exterior con balcón en Atocha · Antón Martín",
    apt: "Apt. Atocha 85", city: "Madrid", area: "Lavapiés", zone: "Embajadores · Atocha",
    price: 540, expenses: "incluidos", expensesNote: "Suministros incluidos",
    deposit: 540, minStay: 1, status: "available", availableFrom: isoInDays(0),
    published: true, size: 14,
    bath: "shared", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room1", gallery: gallery("room1", "room4"),
    coords: { x: 53, y: 60 },
    description: "Habitación exterior disponible hoy en Atocha 85, muy soleada y con balcón a calle tranquila.",
    ambience: "Edificio rehabilitado con patio interior ajardinado."
  },
  {
    id: "HAB-023", name: "Suite amplia junto a Estación del Arte",
    apt: "Apt. Atocha 85", city: "Madrid", area: "Lavapiés", zone: "Embajadores · Atocha",
    price: 620, expenses: "incluidos", expensesNote: "Suministros incluidos",
    deposit: 620, minStay: 6, status: "available", availableFrom: isoInDays(0),
    published: true, size: 16,
    bath: "private", exterior: true, desk: true, ac: true, furnished: true,
    wifi: true, heating: true, wardrobe: true, lock: true,
    main: "room3", gallery: gallery("room3", "room5"),
    coords: { x: 55, y: 61 },
    description: "Segunda habitación disponible ahora mismo en el apartamento de Atocha 85, con baño propio y zona de escritorio.",
    ambience: "Edificio rehabilitado con patio interior ajardinado."
  }
];

const STAY_OPTIONS = [
  { value: "", label: "Cualquier duración", short: "Todas" },
  { value: "1", label: "1 a 2 meses (Estancia corta)", short: "1–2 meses" },
  { value: "3", label: "3 a 5 meses (Trimestral)", short: "3–5 meses" },
  { value: "6", label: "6 a 8 meses (Semestral)", short: "6–8 meses" },
  { value: "9", label: "9 a 11 meses (Curso académico)", short: "9–11 meses" },
  { value: "12", label: "12 meses o más (Larga estancia)", short: "12+ meses" }
];

const LEADS = [
  {
    id: "CON-015",
    name: "Laura Gómez",
    email: "laura.gomez@gmail.com",
    phone: "+34 628 914 205",
    roomId: "HAB-024",
    date: "2026-11-15",
    appointment: "12 de noviembre · 17:30",
    lastChannel: "whatsapp",
    unread: true,
    message: "Hola, me interesa mucho la Habitación 24 de Velázquez (450 €). ¿Podría visitarla esta semana por la tarde?",
    status: "visita",
    createdAt: isoInDays(2),
    notes: "Candidata con contrato indefinido en consultora de Castellana. Busca estancia de 12 meses. Muy interesada en HAB-024.",
    history: [
      { status: "nueva", at: isoInDays(2), label: "Solicitud enviada desde formulario web (HAB-024)" },
      { status: "contactada", at: isoInDays(1), label: "Plantilla WhatsApp Business enviada por el gestor" },
      { status: "visita", at: isoInDays(0), label: "Cita confirmada: 12 de noviembre · 17:30" }
    ],
    messages: [
      {
        id: "MSG-1",
        sender: "tenant",
        channel: "email",
        time: "Hace 2 días · 11:20",
        text: "Hola equipo de HABITIA, acabo de solicitar información en la web sobre la Habitación 24 en Calle Velázquez 42 (450 €/mes). Me incorporo a mi oficina en Goya este mes y me encantaría verla."
      },
      {
        id: "MSG-2",
        sender: "admin",
        channel: "email",
        time: "Hace 2 días · 12:05",
        text: "¡Hola Laura! Gracias por escribirnos. La Habitación 24 está disponible para entrada inmediata. Te escribimos también por WhatsApp para coordinar la hora de visita más rápido."
      },
      {
        id: "MSG-3",
        sender: "tenant",
        channel: "whatsapp",
        time: "Ayer · 16:40",
        text: "¡Genial! Por WhatsApp me resulta mucho más cómodo. ¿Tendríais hueco el jueves 12 de noviembre sobre las 17:30?"
      },
      {
        id: "MSG-4",
        sender: "admin",
        channel: "whatsapp",
        time: "Ayer · 16:48",
        text: "Perfecto Laura, te dejamos reservado el jueves 12 de noviembre a las 17:30 en Velázquez 42. Te hemos activado además tu enlace mágico a «Mi espacio HABITIA» para que consultes los detalles de la cita."
      },
      {
        id: "MSG-5",
        sender: "system",
        channel: "system",
        time: "Ayer · 16:49",
        text: "Cita confirmada para el jueves 17:30 (12 de noviembre · 17:30) · Sincronizada con Mi espacio HABITIA"
      }
    ]
  },
  {
    id: "CON-014",
    name: "Lucía Moreno",
    email: "lucia.moreno@gmail.com",
    phone: "+34 612 448 903",
    roomId: "HAB-001",
    date: isoInDays(8),
    appointment: "Pendiente de confirmar hora",
    lastChannel: "whatsapp",
    unread: true,
    message: "Hola, me interesa la habitación doble con balcón a Velázquez. ¿Los suministros incluyen calefacción central?",
    status: "nueva",
    createdAt: isoInDays(0),
    notes: "Trabaja en despacho de abogados en Serrano.",
    history: [
      { status: "nueva", at: isoInDays(0), label: "Consulta recibida desde la ficha HAB-001" }
    ],
    messages: [
      {
        id: "MSG-201",
        sender: "tenant",
        channel: "email",
        time: "Hoy · 09:15",
        text: "Hola, me interesa la habitación doble con balcón en Velázquez 42 (720 €). ¿Los suministros incluyen calefacción y limpieza?"
      },
      {
        id: "MSG-202",
        sender: "tenant",
        channel: "whatsapp",
        time: "Hoy · 10:02",
        text: "Hola! Os escribo también por WhatsApp. Podría pasarme mañana a partir de las 18:00 si os viene bien."
      }
    ]
  },
  {
    id: "CON-013",
    name: "Andrés Villalba",
    email: "andres.villalba@outlook.es",
    phone: "+34 655 210 774",
    roomId: "HAB-006",
    date: isoInDays(14),
    appointment: "Sin cita agendada",
    lastChannel: "email",
    unread: false,
    message: "Busco habitación en Chamberí para incorporarme el mes que viene. ¿Se puede reservar firmando contrato digital?",
    status: "contactada",
    createdAt: isoInDays(1),
    notes: "Se traslada desde Valencia. Prefiere videollamada inicial.",
    history: [
      { status: "nueva", at: isoInDays(1), label: "Consulta recibida por web" },
      { status: "contactada", at: isoInDays(0), label: "Respondido por Email desde el Inbox" }
    ],
    messages: [
      {
        id: "MSG-301",
        sender: "tenant",
        channel: "email",
        time: "Ayer · 14:12",
        text: "Buenas tardes, busco habitación en Chamberí (HAB-006 en Santa Engracia 108). Vivo actualmente en Valencia, ¿hacéis videovisita?"
      },
      {
        id: "MSG-302",
        sender: "admin",
        channel: "email",
        time: "Ayer · 15:30",
        text: "Hola Andrés, sí, realizamos videollamada en directo desde el piso y firma digital de contrato. ¿Qué día te viene mejor?"
      }
    ]
  },
  {
    id: "CON-012",
    name: "Marta Ibáñez",
    email: "marta.ibanez@proton.me",
    phone: "+34 699 034 512",
    roomId: "HAB-003",
    date: isoInDays(5),
    appointment: "14 de noviembre · 18:00",
    lastChannel: "whatsapp",
    unread: false,
    message: "Me interesa la suite con baño privado y vestidor en Velázquez. ¿Está disponible para seis meses?",
    status: "visita",
    createdAt: isoInDays(2),
    notes: "Directora de proyectos. Muy buen perfil.",
    history: [
      { status: "nueva", at: isoInDays(2), label: "Consulta recibida desde la web" },
      { status: "contactada", at: isoInDays(1), label: "Contactada por WhatsApp" },
      { status: "visita", at: isoInDays(1), label: "Cita agendada para el 14 de noviembre · 18:00" }
    ],
    messages: [
      {
        id: "MSG-401",
        sender: "tenant",
        channel: "whatsapp",
        time: "Hace 2 días · 18:10",
        text: "Hola! Vi la Suite HAB-003 (890 €). ¿Sigue libre para entrar este mismo mes?"
      },
      {
        id: "MSG-402",
        sender: "admin",
        channel: "whatsapp",
        time: "Hace 2 días · 18:22",
        text: "Hola Marta, sí, está libre para entrada inmediata. ¿La vemos este viernes a las 18:00?"
      },
      {
        id: "MSG-403",
        sender: "system",
        channel: "system",
        time: "Hace 2 días · 18:25",
        text: "Cita confirmada para el viernes 18:00 (14 de noviembre · 18:00)"
      }
    ]
  },
  {
    id: "CON-011",
    name: "Pablo Serrano",
    email: "pablo.serrano@gmail.com",
    phone: "+34 610 882 145",
    roomId: "HAB-010",
    date: isoInDays(10),
    appointment: "13 de noviembre · 19:00",
    lastChannel: "email",
    unread: false,
    message: "Estudio un máster en Moncloa y busco algo en Princesa 31. ¿Cuál es la estancia mínima?",
    status: "contactada",
    createdAt: isoInDays(3),
    notes: "Aval bancario o familiar disponible.",
    history: [
      { status: "nueva", at: isoInDays(3), label: "Consulta recibida desde la web" },
      { status: "contactada", at: isoInDays(2), label: "Ficha enviada por Email" }
    ],
    messages: [
      {
        id: "MSG-501",
        sender: "tenant",
        channel: "email",
        time: "Hace 3 días · 11:00",
        text: "Hola, estudio un máster en Moncloa y me interesa la habitación HAB-010 en Princesa 31. ¿Aceptáis estancia de 9 meses (curso académico)?"
      },
      {
        id: "MSG-502",
        sender: "admin",
        channel: "email",
        time: "Hace 3 días · 12:40",
        text: "Hola Pablo, por supuesto, el contrato de temporada de 9 meses encaja perfectamente. Te hemos enviado los requisitos por correo."
      }
    ]
  },
  {
    id: "CON-009",
    name: "Hugo Palacios",
    email: "hugo.palacios@gmail.com",
    phone: "+34 677 991 023",
    roomId: "HAB-012",
    date: isoInDays(1),
    appointment: "Visita realizada · Contrato firmado",
    lastChannel: "whatsapp",
    unread: false,
    message: "Todo claro con el contrato de Orense 28. Ya he realizado la transferencia de la fianza.",
    status: "cerrada",
    createdAt: isoInDays(6),
    notes: "Contrato firmado y fianza recibida.",
    history: [
      { status: "nueva", at: isoInDays(6), label: "Consulta recibida desde la web" },
      { status: "visita", at: isoInDays(4), label: "Visita realizada" },
      { status: "cerrada", at: isoInDays(1), label: "Reserva y contrato cerrados" }
    ],
    messages: [
      {
        id: "MSG-601",
        sender: "tenant",
        channel: "whatsapp",
        time: "Hace 2 días · 13:15",
        text: "¡Hola! Ya he firmado el contrato de la habitación en Orense 28 y adjuntado el justificante de la fianza."
      },
      {
        id: "MSG-602",
        sender: "admin",
        channel: "whatsapp",
        time: "Hace 2 días · 13:30",
        text: "Recibido Hugo. ¡Bienvenido a HABITIA! El lunes a las 11:00 te entregamos las llaves."
      },
      {
        id: "MSG-603",
        sender: "system",
        channel: "system",
        time: "Hace 2 días · 13:31",
        text: "Estado del lead actualizado a Cerrado · Habitación reservada"
      }
    ]
  }
];

const SUBSCRIBERS = [
  { id: "SUB-022", email: "laura.gomez@gmail.com", city: "Madrid", area: "Salamanca", budget: 550, date: isoInDays(1), active: true },
  { id: "SUB-021", email: "irene.cano@gmail.com", city: "Madrid", area: "Chamberí", budget: 700, date: isoInDays(2), active: true },
  { id: "SUB-020", email: "javier.otero@outlook.es", city: "Madrid", area: "Salamanca", budget: 850, date: isoInDays(4), active: true },
  { id: "SUB-019", email: "laura.prieto@proton.me", city: "Madrid", area: "Malasaña", budget: 650, date: isoInDays(9), active: true },
  { id: "SUB-018", email: "sergio.dominguez@gmail.com", city: "Madrid", area: "Argüelles", budget: 600, date: isoInDays(14), active: true },
  { id: "SUB-017", email: "carlos.mendoza@gmail.com", city: "Madrid", area: "Tetuán", budget: 700, date: isoInDays(18), active: true }
];

const USERS = [
  { id: "USR-01", name: "Laura Martín", email: "admin@habitia.es", role: "Superadministrador", active: true, lastAccess: "Hoy, 09:12" },
  { id: "USR-02", name: "Diego Ruiz", email: "diego@habitia.es", role: "Administrador Comercial", active: true, lastAccess: "Hoy, 08:45" }
];

const ACTIVITY = [
  { text: "Cita confirmada con Laura Gómez (Habitación 24 · Velázquez 42)", meta: "Inbox WhatsApp · hace 10 min", tone: "ok" },
  { text: "Nuevo WhatsApp entrante de Lucía Moreno sobre HAB-001", meta: "Meta Cloud API · hace 25 min", tone: "accent" },
  { text: "Laura Gómez accedió a «Mi espacio HABITIA» mediante enlace mágico", meta: "Portal Inquilino · hace 42 min", tone: "ok" },
  { text: "Precio actualizado en Apt. Velázquez 42 (HAB-002)", meta: "Diego Ruiz · hace 1 h", tone: "neutral" },
  { text: "Importación completada: inventario_octubre.xlsx", meta: "Laura Martín · ayer, 17:20", tone: "ok" },
  { text: "Contrato cerrado con Hugo Palacios (HAB-012 · Orense 28)", meta: "Diego Ruiz · hace 2 días", tone: "ok" }
];

const IMPORTS = [
  { id: "IMP-02", file: "inventario_octubre.xlsx", user: "Laura Martín", date: "28/10/2026 · 17:20", processed: 100, ok: 97, errors: 3, status: "Completada" },
  { id: "IMP-01", file: "migracion_inicial.xlsx", user: "Diego Ruiz", date: "12/09/2026 · 10:04", processed: 100, ok: 100, errors: 0, status: "Completada" }
];

const PACKAGES = [
  {
    id: "essential",
    name: "Essential",
    price: 3500,
    tagline: "Web pública + Panel de inventario básico",
    summary: "Catálogo web B2C completo, panel de inventario CRUD y notificaciones básicas de leads por correo electrónico estándar.",
    features: [
      "Catálogo web público B2C con buscador y filtros reactivos",
      "Fichas de habitación con galería, atributos y mapa de privacidad",
      "Formulario de solicitud de visita y alertas básicas por email",
      "Panel Admin: Dashboard de KPIs e inventario CRUD de habitaciones",
      "Gestión de estados de publicación (Publicado / Borrador)",
      "1 licencia de administrador e importación inicial"
    ],
    admins: 1
  },
  {
    id: "improved",
    name: "Improved",
    price: 4900,
    tagline: "Inbox Unificado (Email + WhatsApp) y Calendario 90d",
    summary: "Opción destacada: centraliza toda la comunicación comercial con Inbox Omnicanal (WhatsApp Business API + Email), CRM de estados y calendario Gantt.",
    features: [
      "Todo lo incluido en el paquete Essential",
      "Inbox Omnicanal Unificado (Email + WhatsApp Business API Cloud)",
      "Envío y recepción de WhatsApps y correos desde el panel con historial combinado",
      "Gestión de estados del lead y programación de citas de visita",
      "Calendario visual Timeline Gantt a 30, 60 y 90 días",
      "Edición masiva en lote y hasta 3 administradores con roles/permisos"
    ],
    admins: 3
  },
  {
    id: "complete",
    name: "Complete",
    price: 9000,
    tagline: "Mapa Operativo 100 habs. + Portal Inquilino + Excel",
    summary: "Control operativo total con Mapa Geográfico de Ocupación en semáforo (Verde/Naranja/Rojo), Portal Privado del Inquilino Passwordless e Importador Excel con validador.",
    features: [
      "Todo lo incluido en el paquete Improved",
      "Mapa Operativo de Ocupación Geográfica (100 habs.) con semáforo Verde/Naranja/Rojo",
      "Clusters dinámicos por edificio y edición rápida de contratos desde el mapa",
      "«Mi espacio HABITIA»: Portal Privado del Inquilino (Passwordless / Magic Link)",
      "Importador y validador masivo de Excel (.xlsx) con semáforo de errores",
      "Alertas automáticas de vacantes y hasta 5 administradores"
    ],
    admins: 5
  }
];

const WHATSAPP_TECH_NOTE = "La integración WhatsApp requiere una cuenta Business de Meta (Cloud API), plantillas aprobadas para inicio de conversación y ventana de servicio de 24h. Los costes por consumo de mensajes de Meta no están incluidos.";

const COMPARISON = [
  { module: "Catálogo web B2C, buscador reactivo y fichas de habitación", essential: true, improved: true, complete: true, route: "home", label: "Probar Web Pública" },
  { module: "Formulario de solicitud y notificaciones básicas por email", essential: true, improved: true, complete: true, route: "room-detail", label: "Ver ficha Habitación 24" },
  { module: "Panel Admin: Dashboard de KPIs e Inventario CRUD", essential: true, improved: true, complete: true, route: "admin-dashboard", label: "Abrir Dashboard" },
  { module: "Inbox Omnicanal Unificado (Email + WhatsApp Business API)", essential: false, improved: true, complete: true, route: "admin-inbox", label: "Probar Inbox Omnicanal" },
  { module: "Calendario visual Timeline Gantt (30/60/90 días) y Edición en lote", essential: false, improved: true, complete: true, route: "admin-calendar", label: "Abrir Calendario Gantt" },
  { module: "Mapa Operativo de Ocupación con Semáforo (100 habs. Verde/Naranja/Rojo)", essential: false, improved: false, complete: true, route: "admin-inventory-map", label: "Abrir Mapa Operativo" },
  { module: "«Mi espacio HABITIA»: Portal Privado del Inquilino (Passwordless)", essential: false, improved: false, complete: true, route: "tenant-portal", label: "Abrir Portal Inquilino" },
  { module: "Acceso sin contraseña mediante Magic Link por email", essential: false, improved: false, complete: true, route: "login-tenant", label: "Probar Magic Link" },
  { module: "Importador y validador masivo de Excel (.xlsx) con semáforo", essential: false, improved: false, complete: true, route: "admin-import", label: "Probar Importador Excel" },
  { module: "Alertas automáticas de vacantes y reglas de notificación", essential: false, improved: false, complete: true, route: "admin-subscribers", label: "Ver Suscriptores y Alertas" }
];

/* ==========================================================================
   MAPA OPERATIVO DE OCUPACIÓN GEOGRÁFICA (100 HABITACIONES EN MADRID)
   Distribución exacta por zona operativa:
   - Chamberí: 34 habitaciones (6 libres, 4 próximas, 24 ocupadas)
   - Salamanca: 28 habitaciones (5 libres, 3 próximas, 20 ocupadas)
   - Malasaña: 22 habitaciones (4 libres, 3 próximas, 15 ocupadas)
   - Moncloa:  16 habitaciones (3 libres, 2 próximas, 11 ocupadas)
   Total = 100 habitaciones (18 libres ahora, 12 próximas vacantes, 70 ocupadas)
   ========================================================================== */
const INVENTORY_BUILDINGS_SPEC = [
  {
    id: "BLD-CHA-1",
    name: "Apt. Santa Engracia 108",
    district: "Chamberí",
    subzone: "Trafalgar · Alonso Cano",
    address: "Calle de Santa Engracia 108, 2.º A",
    metro: "Alonso Cano (L7)",
    x: 42, y: 24,
    linkedApt: "Apt. Santa Engracia 108",
    counts: { available: 2, upcoming: 2, occupied: 6 }, // 10 habs
    basePrice: 615
  },
  {
    id: "BLD-CHA-2",
    name: "Edificio Almagro 24",
    district: "Chamberí",
    subzone: "Almagro · Rubén Darío",
    address: "Calle de Almagro 24, 3.º Izq.",
    metro: "Rubén Darío (L5)",
    x: 49, y: 29,
    linkedApt: null,
    counts: { available: 2, upcoming: 1, occupied: 6 }, // 9 habs
    basePrice: 690
  },
  {
    id: "BLD-CHA-3",
    name: "Apt. Trafalgar 19",
    district: "Chamberí",
    subzone: "Plaza de Olavide",
    address: "Calle de Trafalgar 19, 4.º B",
    metro: "Quevedo (L2) / Bilbao (L1, L4)",
    x: 37, y: 31,
    linkedApt: null,
    counts: { available: 1, upcoming: 1, occupied: 6 }, // 8 habs
    basePrice: 595
  },
  {
    id: "BLD-CHA-4",
    name: "Apt. Ríos Rosas 44",
    district: "Chamberí",
    subzone: "Ríos Rosas · Ponzano",
    address: "Calle de Ríos Rosas 44, 5.º C",
    metro: "Ríos Rosas (L1)",
    x: 45, y: 17,
    linkedApt: null,
    counts: { available: 1, upcoming: 0, occupied: 6 }, // 7 habs
    basePrice: 575
  },
  {
    id: "BLD-SAL-1",
    name: "Apt. Velázquez 42",
    district: "Salamanca",
    subzone: "Goya · Castellana",
    address: "Calle de Velázquez 42, 4.º B",
    metro: "Velázquez (L4)",
    x: 66, y: 35,
    linkedApt: "Apt. Velázquez 42",
    counts: { available: 3, upcoming: 1, occupied: 6 }, // 10 habs
    basePrice: 710
  },
  {
    id: "BLD-SAL-2",
    name: "Apt. Goya 75",
    district: "Salamanca",
    subzone: "Goya · Príncipe de Vergara",
    address: "Calle de Goya 75, 2.º D",
    metro: "Goya (L2, L4)",
    x: 74, y: 33,
    linkedApt: null,
    counts: { available: 1, upcoming: 1, occupied: 8 }, // 10 habs
    basePrice: 740
  },
  {
    id: "BLD-SAL-3",
    name: "Apt. Castelló 52",
    district: "Salamanca",
    subzone: "Lista · Diego de León",
    address: "Calle de Castelló 52, 5.º A",
    metro: "Lista (L4) / Núñez de Balboa (L5, L9)",
    x: 70, y: 24,
    linkedApt: null,
    counts: { available: 1, upcoming: 1, occupied: 6 }, // 8 habs
    basePrice: 685
  },
  {
    id: "BLD-MAL-1",
    name: "Apt. Fuencarral 64",
    district: "Malasaña",
    subzone: "Tribunal · Universidad",
    address: "Calle de Fuencarral 64, 3.º D",
    metro: "Tribunal (L1, L10)",
    x: 45, y: 44,
    linkedApt: "Apt. Fuencarral 64",
    counts: { available: 2, upcoming: 1, occupied: 5 }, // 8 habs
    basePrice: 625
  },
  {
    id: "BLD-MAL-2",
    name: "Apt. San Bernardo 38",
    district: "Malasaña",
    subzone: "Noviciado · Conde Duque",
    address: "Calle de San Bernardo 38, 2.º Izq.",
    metro: "Noviciado (L2)",
    x: 36, y: 47,
    linkedApt: null,
    counts: { available: 1, upcoming: 1, occupied: 5 }, // 7 habs
    basePrice: 590
  },
  {
    id: "BLD-MAL-3",
    name: "Apt. Atocha 85 · Centro",
    district: "Malasaña",
    subzone: "Cortes · Antón Martín",
    address: "Calle de Atocha 85, 2.º B",
    metro: "Antón Martín (L1)",
    x: 53, y: 58,
    linkedApt: "Apt. Atocha 85",
    counts: { available: 1, upcoming: 1, occupied: 5 }, // 7 habs
    basePrice: 545
  },
  {
    id: "BLD-MON-1",
    name: "Apt. Princesa 31",
    district: "Moncloa",
    subzone: "Argüelles · Ventura Rodríguez",
    address: "Calle de la Princesa 31, 1.º C",
    metro: "Argüelles (L3, L4, L6)",
    x: 24, y: 38,
    linkedApt: "Apt. Princesa 31",
    counts: { available: 2, upcoming: 1, occupied: 5 }, // 8 habs
    basePrice: 595
  },
  {
    id: "BLD-MON-2",
    name: "Apt. Orense 28 · Castellana",
    district: "Moncloa",
    subzone: "Cuatro Caminos · Nuevos Ministerios",
    address: "Calle de Orense 28, 6.º A",
    metro: "Nuevos Ministerios (L6, L8, L10)",
    x: 54, y: 12,
    linkedApt: "Apt. Orense 28",
    counts: { available: 1, upcoming: 1, occupied: 6 }, // 8 habs
    basePrice: 645
  }
];

function buildOperationalInventory(catalogRooms) {
  const units = [];
  const tenantsPool = [
    "Sofía Jiménez", "Alejandro Vega", "Clara Montes", "Daniel Ortega",
    "Elena Navarro", "Mateo Romero", "Valeria Gil", "Nicolás Prieto",
    "Paula Domínguez", "Gonzalo Torres", "Adriana Blanco", "Marcos Castro"
  ];
  const upcomingHorizonDays = [7, 12, 15, 19, 24, 28, 30, 14, 21, 9, 18, 27];
  const occupiedContractEndDays = [75, 95, 110, 125, 140, 165, 180, 210, 240, 150];
  let globalIdx = 1;
  let upIdx = 0;

  INVENTORY_BUILDINGS_SPEC.forEach((bld) => {
    const linkedRooms = bld.linkedApt
      ? catalogRooms.filter((r) => r.apt === bld.linkedApt)
      : [];
    const totalInBld = bld.counts.available + bld.counts.upcoming + bld.counts.occupied;
    const statusQueue = [];
    for (let i = 0; i < bld.counts.available; i++) statusQueue.push("available");
    for (let i = 0; i < bld.counts.upcoming; i++) statusQueue.push("upcoming");
    for (let i = 0; i < bld.counts.occupied; i++) statusQueue.push("occupied");

    for (let i = 0; i < totalInBld; i++) {
      const st = statusQueue[i] || "occupied";
      const linked = linkedRooms[i] || null;
      const unitCode = linked ? linked.id : "HAB-" + String(100 + globalIdx).slice(-3);
      const roomNumber = i + 1;
      const price = linked ? linked.price : bld.basePrice + ((i % 4) - 1) * 35;

      let contractEnd = isoInDays(0);
      let releaseWindow = "Entrada inmediata";
      if (st === "upcoming") {
        const d = upcomingHorizonDays[upIdx % upcomingHorizonDays.length];
        upIdx++;
        contractEnd = linked && linked.status === "upcoming" ? linked.availableFrom : isoInDays(d);
        releaseWindow = "Liberación en " + d + " días";
      } else if (st === "occupied") {
        const d = occupiedContractEndDays[(globalIdx + i) % occupiedContractEndDays.length];
        contractEnd = linked && linked.status === "occupied" ? linked.availableFrom : isoInDays(d);
        releaseWindow = "Contrato vigente";
      }

      const angle = (i / totalInBld) * Math.PI * 2;
      const radius = 2.6 + (i % 2) * 1.3;
      const pinX = Math.max(8, Math.min(92, +(bld.x + Math.cos(angle) * radius).toFixed(1)));
      const pinY = Math.max(10, Math.min(88, +(bld.y + Math.sin(angle) * radius).toFixed(1)));

      units.push({
        uid: "UNIT-" + String(globalIdx).padStart(3, "0"),
        roomId: unitCode,
        catalogRoomId: linked ? linked.id : null,
        buildingId: bld.id,
        buildingName: bld.name,
        district: bld.district,
        subzone: bld.subzone,
        address: bld.address,
        metro: bld.metro,
        unitLabel: linked ? linked.name : "Habitación " + roomNumber + " · " + (i % 2 === 0 ? "Exterior luminosa" : "Individual estudio"),
        price,
        size: linked ? linked.size : 12 + (i % 5),
        bath: linked ? linked.bath : (i % 3 === 0 ? "private" : "shared"),
        status: st,
        contractEnd,
        releaseWindow,
        tenantName: st === "available" ? "Sin inquilino (Vacante)" : tenantsPool[(globalIdx + i) % tenantsPool.length],
        bx: bld.x,
        by: bld.y,
        px: pinX,
        py: pinY
      });
      globalIdx++;
    }
  });

  return units;
}

const NEIGHBOURHOODS = [
  { city: "Madrid", name: "Salamanca", zones: "Velázquez · Goya · Lista", img: IMG.salamanca, alt: IMG_ALT.salamanca, desc: "Elegancia clásica, calles arboladas y conexión directa con el eje Castellana y Serrano." },
  { city: "Madrid", name: "Chamberí", zones: "Trafalgar · Almagro", img: IMG.chamberi, alt: IMG_ALT.chamberi, desc: "Señorial, tranquilo y con vida de barrio. Techos altos, mercados tradicionales y excelente red de Metro." },
  { city: "Madrid", name: "Malasaña", zones: "Universidad · Fuencarral", img: IMG.malasana, alt: IMG_ALT.malasana, desc: "Ambiente joven, cafeterías de especialidad y plazas con terraza en pleno centro de Madrid." },
  { city: "Madrid", name: "Argüelles", zones: "Moncloa · Princesa", img: IMG.arguelles, alt: IMG_ALT.arguelles, desc: "Verde, universitario y bien conectado junto a Plaza de España y Parque del Oeste." },
  { city: "Madrid", name: "Tetuán", zones: "Cuzco · Orense · AZCA", img: IMG.valencia, alt: IMG_ALT.valencia, desc: "A un paso del distrito financiero de AZCA y Nuevos Ministerios, ideal para perfiles corporativos." }
];

const AMENITY_LABELS = {
  bath: "Baño privado",
  exterior: "Exterior",
  desk: "Escritorio",
  ac: "Aire acondicionado",
  wifi: "WiFi Fibra 1 Gb",
  heating: "Calefacción individual",
  wardrobe: "Armario empotrado",
  lock: "Cerradura propia",
  furnished: "Amueblada"
};

const STATUS_META = {
  available: { label: "Disponible ahora", short: "Disponible", cls: "is-ok" },
  upcoming: { label: "Próxima disponibilidad", short: "Próxima", cls: "is-soon" },
  occupied: { label: "Ocupada", short: "Ocupada", cls: "is-off" }
};

const LEAD_STATUS = {
  nueva: "Nuevo",
  contactada: "Contactado",
  visita: "Visita Programada",
  cerrada: "Cerrado",
  descartada: "No interesado"
};

const SEED = {
  rooms: ROOMS,
  buildings: INVENTORY_BUILDINGS_SPEC,
  inventoryUnits: buildOperationalInventory(ROOMS),
  leads: LEADS,
  subscribers: SUBSCRIBERS,
  users: USERS,
  activity: ACTIVITY,
  imports: IMPORTS
};
