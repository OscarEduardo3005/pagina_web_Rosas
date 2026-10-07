/* =========================================================
   CONFIGURACIÓN — tu número de WhatsApp
   (código de país + número, sin + ni espacios)
   ========================================================= */
const WHATSAPP = "584125735490";

/* =========================================================
   TASA DEL DÓLAR (BCV) — ACTUALIZACIÓN AUTOMÁTICA
   La página consulta la tasa oficial del BCV en estas APIs,
   en orden. Si la primera falla, prueba la siguiente.
   Mientras el cliente tiene la página abierta, se vuelve a
   revisar cada TASA_REVISAR_MINUTOS. Si el BCV publicó una
   tasa nueva, todos los precios en bolívares (catálogo,
   carrito y total) cambian solos y aparece un aviso.
   También se revisa al volver a la pestaña o al recuperar
   la conexión a internet.
   TASA_MANUAL: si escribes un número aquí (ej. 150.25), la
   página usa SIEMPRE esa tasa y no consulta internet.
   Si lo dejas en null y fallan las APIs, se muestran solo
   los precios en dólares.
   ========================================================= */
const TASA_MANUAL = null;

/* =========================================================
   FORMA DE PAGO — porcentaje que el cliente abona por
   adelantado para apartar su pedido. El resto se cancela
   el día de la entrega. Cambia el 50 por otro número si
   quieres otro porcentaje (por ejemplo 30 o 100).
   ========================================================= */
const PORCENTAJE_ABONO = 50;

/* =========================================================
   MÉTODOS DE PAGO — se muestran en el carrito (con botones
   para copiar cada dato), en la sección de contacto y en el
   mensaje de WhatsApp.
   moneda: "Bs" muestra el monto a pagar en bolívares;
           "USD" lo muestra en dólares (para Zelle, efectivo…).
   nota:   texto que ve el cliente en el carrito con ese método.
   notaWhatsApp: frase que se agrega al mensaje del pedido.
   datos:  etiqueta y valor que ve el cliente. "copiar" es lo
           que se copia al tocar el botón (sin puntos ni
           paréntesis, para pegarlo directo en el banco).
   Para agregar otro método, copia el bloque { ... } completo,
   pégalo debajo (separado por una coma) y cambia los datos.
   Si hay más de uno, el cliente elige cuál usar.
   ========================================================= */
const METODOS_PAGO = [
  {
    id: "pagomovil",
    nombre: "Pago Móvil",
    moneda: "Bs",
    datos: [
      { etiqueta: "Banco",    valor: "Venezuela (0102)", copiar: "0102 Banco de Venezuela" },
      { etiqueta: "C.I.",     valor: "31.754.872",       copiar: "31754872" },
      { etiqueta: "Teléfono", valor: "(0412) 573.54.90", copiar: "04125735490" },
    ],
    nota: "Después de pagar, envía el pedido y adjunta la captura del pago en WhatsApp.",
    notaWhatsApp: "(Adjunto la captura del pago)",
  },
  {
    id: "divisas",
    nombre: "Divisas $",
    moneda: "USD",
    datos: [],   // sin datos: se paga en efectivo, en dólares
    nota: "Pagas en efectivo, en dólares. Envía el pedido y coordinamos por WhatsApp cómo entregar el abono.",
    notaWhatsApp: "(Pagaré en divisas)",
  },
  // Ejemplo para más adelante:
  // {
  //   id: "zelle",
  //   nombre: "Zelle",
  //   moneda: "USD",
  //   datos: [
  //     { etiqueta: "Correo",  valor: "correo@ejemplo.com", copiar: "correo@ejemplo.com" },
  //     { etiqueta: "Titular", valor: "Nombre Apellido",    copiar: "Nombre Apellido" },
  //   ],
  // },
];
const APIS_TASA = [
  "https://ve.dolarapi.com/v1/dolares/oficial",
  "https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd",
];
const TASA_REVISAR_MINUTOS = 10; // cada cuánto se revisa si el BCV cambió la tasa

/* =========================================================
   PRODUCTOS — agrega, quita o edita productos aquí.
   imagenes: lista de fotos (la primera es la principal).
             Guarda las fotos en la carpeta img/.
   opciones: cada opción con su nombre y precio EN DÓLARES.
             El precio en bolívares se calcula solo con la tasa BCV.
   etiqueta: texto opcional sobre la foto ("Nuevo", "Más vendido").
   ⚠️ Los precios son de ejemplo: cámbialos por los tuyos.
   ========================================================= */
const PRODUCTOS = [
  { id:1, nombre:"Ramo de flores amarillas con luz", categoria:"Ramos",
    imagenes:["img/ramo-flores-luz.jpg"],
    descripcion:"Ramo de flores amarillas hechas a mano, con luces cálidas, papel elegante, lazo lavanda y tarjeta.",
    etiqueta:"Más vendido",
    opciones:[{nombre:"12 flores",precio:20},{nombre:"20 flores",precio:30}] },

  { id:2, nombre:"Girasol en maceta", categoria:"Girasoles",
    imagenes:["img/girasol-maceta-2.jpg","img/girasol-maceta-1.jpg"],
    descripcion:"Girasol con hojas y maceta café, todo tejido en limpiapipas. Perfecto para el escritorio o la mesa de noche.",
    opciones:[{nombre:"1 girasol",precio:8},{nombre:"2 girasoles",precio:15}] },

  { id:3, nombre:"Girasol en bolsa de regalo", categoria:"Girasoles",
    imagenes:["img/girasol-bolsa-regalo.jpg","img/girasol-maceta-1.jpg"],
    descripcion:"Nuestro girasol en maceta, entregado en bolsa blanca con ventana y asas de cinta. Listo para regalar.",
    etiqueta:"Listo para regalar",
    extras:["flor","mariposa","lazo","tarjeta","chocolates","peluche"], // ya incluye bolsa
    opciones:[{nombre:"Con bolsa de ventana",precio:10}] },

  { id:4, nombre:"Rama de flores amarillas", categoria:"Flores sueltas",
    imagenes:["img/rama-flores-amarillas.jpg"],
    descripcion:"Rama con tres flores amarillas y botones verdes. Ideal para jarrones o para armar tu propio ramo.",
    opciones:[{nombre:"1 rama",precio:4},{nombre:"3 ramas",precio:11}] },

  { id:5, nombre:"Lirio azul", categoria:"Flores sueltas",
    imagenes:["img/lirio-azul.jpg"],
    descripcion:"Lirio de pétalos grandes con centro amarillo y hojas verdes. También lo hacemos en el color que quieras.",
    etiqueta:"Nuevo",
    opciones:[{nombre:"1 lirio",precio:5},{nombre:"3 lirios",precio:14}] },

  { id:7, nombre:"Caja de lirios azules con luz", categoria:"Ramos",
    imagenes:["img/caja-lirios-azules-1.jpg","img/caja-lirios-azules-2.jpg","img/caja-lirios-azules-3.jpg","img/caja-lirios-azules-4.jpg"],
    descripcion:"Lirios azules y blanco tejidos a mano, en caja negra con asa de cinta y luces LED que los iluminan de noche.",
    etiqueta:"Nuevo",
    extras:["hotwheels","flor","mariposa","lazo","tarjeta","chocolates","peluche"], // ya incluye caja y luces
    opciones:[{nombre:"3 lirios",precio:25},{nombre:"5 lirios",precio:38}] },

  { id:6, nombre:"Combo ramo y girasol", categoria:"Combos",
    imagenes:["img/promo-flores-amarillas.jpg","img/ramo-flores-luz.jpg","img/girasol-bolsa-regalo.jpg"],
    descripcion:"Ramo de flores amarillas con luz cálida más un girasol en maceta dentro de su bolsa de regalo.",
    etiqueta:"Combo",
    opciones:[{nombre:"Ramo 12 flores + girasol",precio:27},{nombre:"Ramo 20 flores + girasol",precio:36}] },
];

/* =========================================================
   EXTRAS — complementos que el cliente puede sumar a cualquier
   producto con el botón "Extras". Precios EN DÓLARES (cada
   unidad); el monto en bolívares se calcula solo.
   max: cuántas unidades de ese extra se pueden agregar.
   exclusivo:true → ese extra NO aparece en todos los productos,
   solo en los que lo nombren en su lista extras:[...].
   Para que un producto muestre solo algunos extras, agrégale
   extras:["flor","luces"] en la lista PRODUCTOS. Si no lo
   tiene, muestra todos.
   ⚠️ Los precios son de ejemplo: cámbialos por los tuyos.
   ========================================================= */
const EXTRAS = [
  { id:"flor",       nombre:"Flor adicional",        detalle:"Del mismo estilo del producto",      precio:1.5, max:20 },
  { id:"luces",      nombre:"Luces LED cálidas",     detalle:"Tira de luces que brillan de noche", precio:2,   max:3 },
  { id:"mariposa",   nombre:"Mariposa decorativa",   detalle:"Se coloca entre las flores",         precio:1,   max:5 },
  { id:"lazo",       nombre:"Lazo de otro color",    detalle:"Dinos el color por WhatsApp",        precio:1,   max:1 },
  { id:"tarjeta",    nombre:"Tarjeta decorada",      detalle:"Con tu mensaje escrito a mano",      precio:1.5, max:1 },
  { id:"chocolates", nombre:"Chocolates",            detalle:"Cajita de bombones",                 precio:4,   max:3 },
  { id:"peluche",    nombre:"Peluche pequeño",       detalle:"Osito de unos 15 cm",                precio:6,   max:2 },
  { id:"bolsa",      nombre:"Bolsa de regalo",       detalle:"Bolsa blanca con ventana",           precio:2,   max:2 },
  // exclusivo:true → solo aparece en los productos que lo incluyan en su lista extras:[...]
  { id:"hotwheels",  nombre:"Carrito Hot Wheels",    detalle:"Carrito de colección en su empaque", precio:4,   max:5, exclusivo:true },
];

/* =========================================================
   CREA TU RAMO — opciones del creador personalizado.
   Todos los precios EN DÓLARES. ⚠️ Son de ejemplo.
   tipos:   qué puede crear el cliente. precioBase es lo que
            cuesta la presentación (papel, maceta, tallo…).
            minFlores / maxFlores: límites de flores.
   flores:  precio por cada flor.
   colores: colores disponibles para las flores (hex = color
            que se dibuja en la vista previa).
   extras:  cuáles de la lista EXTRAS se ofrecen aquí.
   ========================================================= */
const CREADOR = {
  tipos: [
    { id:"ramo",   nombre:"Ramo",             carrito:"Ramo personalizado",    detalle:"Envuelto en papel con lazo",   precioBase:5, minFlores:3, maxFlores:40 },
    { id:"maceta", nombre:"Flores en maceta", carrito:"Maceta personalizada",  detalle:"Maceta tejida en limpiapipas", precioBase:4, minFlores:1, maxFlores:5 },
    { id:"suelta", nombre:"Flor individual",  carrito:"Flor personalizada",    detalle:"Con tallo y hojas",            precioBase:1, minFlores:1, maxFlores:1 },
  ],
  flores: [
    // genero: "m" (el girasol) o "f" (la rosa), para escribir bien el color: "rosa roja", "lirio rojo"
    { id:"girasol",   nombre:"Girasol",      plural:"Girasoles",       genero:"m", precio:3 },
    { id:"pequena",   nombre:"Flor pequeña", plural:"Flores pequeñas", genero:"f", precio:1.5 },
    { id:"rosa",      nombre:"Rosa",         plural:"Rosas",           genero:"f", precio:3 },
    { id:"lirio",     nombre:"Lirio",        plural:"Lirios",          genero:"m", precio:4 },
    { id:"tulipan",   nombre:"Tulipán",      plural:"Tulipanes",       genero:"m", precio:2.5 },
  ],
  colores: [
    { id:"amarillo", nombre:"amarillo", hex:"#F6C21C" },
    { id:"naranja",  nombre:"naranja",  hex:"#F28C28" },
    { id:"rojo",     nombre:"rojo",     hex:"#D7263D" },
    { id:"rosado",   nombre:"rosado",   hex:"#F48FB1" },
    { id:"morado",   nombre:"morado",   hex:"#7B4FC9" },
    { id:"azul",     nombre:"azul",     hex:"#1E5BD8" },
    { id:"blanco",   nombre:"blanco",   hex:"#F7F4EC" },
  ],
  papeles: [
    { id:"blanco",   nombre:"Blanco",   hex:"#F4F1EA" },
    { id:"kraft",    nombre:"Marrón",   hex:"#C9A27A" },
    { id:"negro",    nombre:"Negro",    hex:"#2B2730" },
    { id:"rosado",   nombre:"Rosado",   hex:"#F6C9D6" },
    { id:"lavanda",  nombre:"Lavanda",  hex:"#CFC3F2" },
  ],
  // elegirLazo: false → el cliente NO elige color de lazo (se usa el lavanda).
  // Cámbialo a true para volver a mostrar los colores de lazo.
  elegirLazo: false,
  lazos: [
    { id:"lavanda",  nombre:"Lavanda",  hex:"#A99BE6" },
    { id:"blanco",   nombre:"Blanco",   hex:"#FFFFFF" },
    { id:"rojo",     nombre:"Rojo",     hex:"#C8102E" },
    { id:"dorado",   nombre:"Dorado",   hex:"#D4AF37" },
    { id:"rosado",   nombre:"Rosado",   hex:"#F48FB1" },
  ],
  macetas: [
    { id:"cafe",       nombre:"Café",       hex:"#6B4A32" },
    { id:"blanco",     nombre:"Blanca",     hex:"#F2EFE8" },
    { id:"negro",      nombre:"Negra",      hex:"#2B2B2B" },
    { id:"terracota",  nombre:"Terracota",  hex:"#C0643C" },
  ],
  extras: ["luces","mariposa","tarjeta","chocolates","peluche","bolsa"],
};

/* =========================================================
   LÓGICA DE LA PÁGINA — normalmente no necesitas tocar esto
   ========================================================= */
const $ = s => document.querySelector(s);
/* Formato de precios: $ 20,00 y Bs. 3.650,00 */
const fmt = n => n.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let tasa = null, tasaFecha = null;
const usd = n => "$ " + fmt(n);
const bs = n => tasa ? "Bs. " + fmt(n * tasa) : "";
const precioHTML = (n, desde = false) =>
  `${desde ? "<small>Desde</small>" : ""}${usd(n)}${tasa ? `<span class="precio-bs">${bs(n)}</span>` : ""}`;
const precioTexto = n => tasa ? `${usd(n)} (${bs(n)})` : usd(n);
/* Divide un monto en abono (hoy) y resto (al entregar) */
const dividirPago = total => {
  const abono = Math.round(total * PORCENTAJE_ABONO) / 100;
  return { abono, resto: Math.round((total - abono) * 100) / 100 };
};
const montoHTML = n => `<strong>${usd(n)}</strong>${tasa ? ` <span class="monto-bs">(${bs(n)})</span>` : ""}`;

/* Obtener la tasa: manual → guardada (si es reciente) → APIs */
function leerTasa(d) {
  const v = d?.promedio ?? d?.price ?? d?.monitors?.usd?.price ?? d?.precio ?? d?.valor;
  const n = typeof v === "string" ? parseFloat(v.replace(",", ".")) : v;
  return n > 0 ? n : null;
}
let tasaRevisada = 0;      // momento de la última consulta
let consultando = false;

function guardarTasa() {
  try { localStorage.setItem("tasa-bcv", JSON.stringify({ tasa, fecha: tasaFecha, guardada: tasaRevisada })); } catch (e) {}
}

/* Consulta las APIs. Devuelve true si obtuvo una tasa. */
async function consultarTasa() {
  if (TASA_MANUAL || consultando || !navigator.onLine) return false;
  consultando = true;
  try {
    for (const url of APIS_TASA) {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) continue;
        const d = await r.json();
        const nueva = leerTasa(d);
        if (!nueva) continue;
        const anterior = tasa;
        const fechaNueva = d.fechaActualizacion || d.last_update || d.fecha || tasaFecha || new Date().toISOString();
        const cambio = anterior !== null && Math.abs(nueva - anterior) > 0.0001;
        const fechaCambio = fechaNueva !== tasaFecha;
        tasa = nueva; tasaFecha = fechaNueva; tasaRevisada = Date.now();
        guardarTasa();
        if (anterior === null || cambio || fechaCambio) pintarTasa(cambio);
        if (cambio) aviso(`La tasa BCV se actualizó: Bs. ${fmt(nueva)}`);
        return true;
      } catch (e) { /* prueba la siguiente API */ }
    }
    return false;
  } finally { consultando = false; }
}

async function cargarTasa() {
  if (TASA_MANUAL) { tasa = TASA_MANUAL; tasaFecha = null; return pintarTasa(); }
  // 1. Muestra al instante la última tasa guardada (si hay)
  try {
    const g = JSON.parse(localStorage.getItem("tasa-bcv"));
    if (g && g.tasa > 0) { tasa = g.tasa; tasaFecha = g.fecha; tasaRevisada = g.guardada || 0; pintarTasa(); }
  } catch (e) {}
  // 2. Si la guardada no es reciente, consulta la tasa actual
  if (Date.now() - tasaRevisada >= TASA_REVISAR_MINUTOS * 60000) {
    const ok = await consultarTasa();
    if (!ok && tasa === null) pintarTasa();
  }
  // 3. Sigue revisando mientras la página esté abierta
  setInterval(() => { if (!document.hidden) consultarTasa(); }, TASA_REVISAR_MINUTOS * 60000);
  // 4. Revisa al volver a la pestaña (si pasó el tiempo) o al recuperar internet
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - tasaRevisada >= TASA_REVISAR_MINUTOS * 60000) consultarTasa();
  });
  window.addEventListener("online", consultarTasa);
  // 5. Si el cliente tiene la página abierta en varias pestañas, se sincronizan
  window.addEventListener("storage", e => {
    if (e.key !== "tasa-bcv" || !e.newValue) return;
    try {
      const g = JSON.parse(e.newValue);
      if (g.tasa > 0 && g.tasa !== tasa) { tasa = g.tasa; tasaFecha = g.fecha; tasaRevisada = g.guardada; pintarTasa(true); }
    } catch (err) {}
  });
}
function pintarTasa(resaltar = false) {
  const el = document.querySelectorAll(".tasa-bcv");
  let texto;
  if (tasa) {
    const f = tasaFecha ? new Date(tasaFecha) : null;
    const fecha = f && !isNaN(f) ? " · " + f.toLocaleDateString("es-VE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";
    texto = `Tasa BCV: Bs. ${fmt(tasa)} por dólar${fecha}`;
  } else {
    texto = "Precios en dólares. Consulta el monto en bolívares por WhatsApp.";
  }
  el.forEach(e => e.textContent = texto);
  pintarProductos(); pintarCarrito();
  if (actual && $("#modal").classList.contains("visible")) pintarExtras();
  if (typeof pintarCreador === "function" && $("#crTipos")) conFoco(pintarCreador);
  // Destaca brevemente los montos en bolívares cuando la tasa cambia
  if (resaltar) document.querySelectorAll(".precio-bs, .total-bs, .item small, .chip-tasa").forEach(e => {
    e.classList.remove("tasa-cambio"); void e.offsetWidth; e.classList.add("tasa-cambio");
  });
}
const foto = (src, alt, lazy = true) =>
  `<img class="img-cubrir" src="${src}" alt="${alt}"${lazy ? ' loading="lazy"' : ""}>`;

let categoria = "Todos", busqueda = "", carrito = [];
try { carrito = JSON.parse(localStorage.getItem("carrito-amara")) || []; } catch (e) { carrito = []; }
const guardar = () => { try { localStorage.setItem("carrito-amara", JSON.stringify(carrito)); } catch (e) {} };

/* Filtros */
const categorias = ["Todos", ...new Set(PRODUCTOS.map(p => p.categoria))];
$("#filtros").innerHTML = categorias.map(c =>
  `<button class="filtro" aria-pressed="${c === categoria}" data-cat="${c}">${c}</button>`).join("");
$("#filtros").addEventListener("click", e => {
  const b = e.target.closest(".filtro"); if (!b) return;
  categoria = b.dataset.cat;
  document.querySelectorAll(".filtro").forEach(f => f.setAttribute("aria-pressed", f === b));
  pintarProductos();
});
$("#buscador").addEventListener("input", e => { busqueda = e.target.value.toLowerCase().trim(); pintarProductos(); });

/* Catálogo */
function pintarProductos() {
  const lista = PRODUCTOS.filter(p =>
    (categoria === "Todos" || p.categoria === categoria) &&
    (p.nombre + " " + p.descripcion + " " + p.categoria).toLowerCase().includes(busqueda));
  const cta = categoria === "Todos" && !busqueda ? `
    <article class="producto cta-creador">
      <a href="#crea-tu-ramo" class="cta-creador-enlace">
        <span class="cta-creador-arte" aria-hidden="true">${svgCreacion(EJEMPLO_CREACION)}</span>
        <span class="cta-creador-texto">
          <span class="nota-mano">¿No encuentras lo que buscas?</span>
          <strong>Crea tu propio ramo</strong>
          <span>Elige flores, colores, papel y extras. Te mostramos cómo queda y cuánto cuesta.</span>
          <span class="btn btn-principal">Empezar a crear</span>
        </span>
      </a>
    </article>` : "";
  $("#grilla").innerHTML = cta + (lista.length ? lista.map(p => `
    <article class="producto">
      <button class="producto-img" data-ver="${p.id}" aria-label="Ver detalles de ${p.nombre}">
        ${foto(p.imagenes[0], p.nombre)}
        ${p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : ""}
      </button>
      <div class="producto-info">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <div class="producto-pie">
          <span class="precio">${precioHTML(p.opciones[0].precio, p.opciones.length > 1)}</span>
          <div class="botones-card">
            <button class="btn-extras-card" data-ver="${p.id}" data-extras>Extras</button>
            <button class="btn-agregar" data-ver="${p.id}">Agregar</button>
          </div>
        </div>
      </div>
    </article>`).join("")
    : `<p class="sin-resultados">No encontramos productos con esa palabra. Prueba con “girasol” o elige “Todos”.</p>`);
}

/* Cualquier botón con data-ver abre el producto (catálogo y promoción) */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-ver]");
  if (b) abrirModal(+b.dataset.ver, b.hasAttribute("data-extras"));
});

/* Modal */
let actual = null, opcionSel = 0, ultimoFoco = null, extrasSel = {};

/* Extras disponibles para un producto */
/* Si el producto tiene su lista extras:[...], se muestran en ese mismo orden */
const extrasDe = p => p.extras ? p.extras.map(id => EXTRAS.find(e => e.id === id)).filter(Boolean) : EXTRAS.filter(e => !e.exclusivo);
/* Costo de un conjunto de extras { id: cantidad } */
const costoExtras = sel => Object.entries(sel || {}).reduce((s, [id, n]) => {
  const e = EXTRAS.find(x => x.id === id); return s + (e ? e.precio * n : 0);
}, 0);
/* Texto: "2 x Flor adicional, 1 x Chocolates" */
const textoExtras = sel => Object.entries(sel || {}).filter(([, n]) => n > 0)
  .map(([id, n]) => { const e = EXTRAS.find(x => x.id === id); return e ? `${n} x ${e.nombre}` : ""; })
  .filter(Boolean).join(", ");

function pintarExtras() {
  $("#listaExtras").innerHTML = extrasDe(actual).map(e => {
    const n = extrasSel[e.id] || 0;
    return `<li class="extra${n ? " activo" : ""}">
      <div class="extra-info">
        <strong>${e.nombre}</strong>
        ${e.detalle ? `<small>${e.detalle}</small>` : ""}
        <span class="extra-precio">+ ${usd(e.precio)}${tasa ? ` · ${bs(e.precio)}` : ""}</span>
      </div>
      <div class="cantidad" role="group" aria-label="Cantidad de ${e.nombre}">
        <button data-extra-menos="${e.id}" aria-label="Quitar ${e.nombre}" ${n ? "" : "disabled"}>−</button>
        <span aria-live="polite">${n}</span>
        <button data-extra-mas="${e.id}" aria-label="Agregar ${e.nombre}" ${n >= e.max ? "disabled" : ""}>+</button>
      </div>
    </li>`;
  }).join("");
  actualizarPrecioModal();
}
function actualizarPrecioModal() {
  const base = actual.opciones[opcionSel].precio, extra = costoExtras(extrasSel);
  const cant = Object.values(extrasSel).reduce((a, b) => a + b, 0);
  $("#modalPrecio").innerHTML = precioHTML(base + extra);
  const { abono, resto } = dividirPago(base + extra);
  $("#modalAbonoCorto").innerHTML = PORCENTAJE_ABONO >= 100 ? "Pago completo por adelantado"
    : `Abonas hoy <strong>${usd(abono)}</strong> (${PORCENTAJE_ABONO}%) · el resto al recibir`;
  $("#modalPago").innerHTML = PORCENTAJE_ABONO >= 100
    ? `Este producto se cancela <strong>completo por adelantado</strong>: ${montoHTML(abono)}.`
    : `Para apartar tu pedido abonas el <strong>${PORCENTAJE_ABONO}%</strong> por adelantado: ${montoHTML(abono)}.<br>
       El <strong>${100 - PORCENTAJE_ABONO}% restante</strong> se cancela el día de la entrega: ${montoHTML(resto)}.`;
  $("#modalDesglose").textContent = extra ? `Incluye ${usd(extra)} en extras` : "";
  $("#resumenExtras").textContent = cant ? `${cant} ${cant === 1 ? "extra" : "extras"} · + ${usd(extra)}` : "Personaliza tu pedido";
}
function abrirExtras(abrir) {
  $("#panelExtras").hidden = !abrir;
  $("#botonExtras").setAttribute("aria-expanded", abrir);
}
$("#botonExtras").addEventListener("click", () => abrirExtras($("#panelExtras").hidden));
$("#listaExtras").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b || b.disabled) return;
  const id = b.dataset.extraMas || b.dataset.extraMenos;
  const ex = EXTRAS.find(x => x.id === id); if (!ex) return;
  const n = (extrasSel[id] || 0) + (b.dataset.extraMas ? 1 : -1);
  if (n <= 0) delete extrasSel[id]; else extrasSel[id] = Math.min(n, ex.max);
  pintarExtras();
  const mismo = $(`#listaExtras [${b.dataset.extraMas ? "data-extra-mas" : "data-extra-menos"}="${id}"]`);
  (mismo && !mismo.disabled ? mismo : $(`#listaExtras [data-extra-mas="${id}"]`))?.focus({ preventScroll: true });
});
function mostrarFoto(i) {
  $("#modalImg").innerHTML = foto(actual.imagenes[i], actual.nombre, false);
  document.querySelectorAll(".miniaturas button").forEach((b, j) => b.setAttribute("aria-pressed", j === i));
}
function abrirModal(id, conExtras = false) {
  actual = PRODUCTOS.find(p => p.id === id); if (!actual) return;
  opcionSel = 0; extrasSel = {}; ultimoFoco = document.activeElement;
  $("#modalMiniaturas").innerHTML = actual.imagenes.length > 1
    ? actual.imagenes.map((src, i) => `<button data-foto="${i}" aria-label="Ver foto ${i + 1}">${foto(src, "")}</button>`).join("")
    : "";
  mostrarFoto(0);
  $("#modalTitulo").textContent = actual.nombre;
  $("#modalDesc").textContent = actual.descripcion;
  $("#modalOpciones").innerHTML = actual.opciones.map((o, i) =>
    `<button class="opcion" data-i="${i}" aria-pressed="${i === 0}">${o.nombre}</button>`).join("");
  pintarExtras();
  abrirExtras(conExtras);
  $(".modal-caja").scrollTop = 0;
  $("#modal").classList.add("visible"); $("#capa").classList.add("visible");
  $("#cerrarModal").focus({ preventScroll: true });
}
function cerrarModal() {
  if (!$("#modal").classList.contains("visible")) return;
  $("#modal").classList.remove("visible");
  if (!$("#carrito").classList.contains("abierto")) $("#capa").classList.remove("visible");
  if (ultimoFoco) ultimoFoco.focus({ preventScroll: true });
}
$("#modalMiniaturas").addEventListener("click", e => {
  const b = e.target.closest("[data-foto]"); if (b) mostrarFoto(+b.dataset.foto);
});
$("#modalOpciones").addEventListener("click", e => {
  const b = e.target.closest(".opcion"); if (!b) return;
  opcionSel = +b.dataset.i;
  document.querySelectorAll(".opcion").forEach(o => o.setAttribute("aria-pressed", o === b));
  actualizarPrecioModal();
});
$("#modalAgregar").addEventListener("click", () => { agregar(actual, opcionSel, extrasSel); cerrarModal(); });
$("#cerrarModal").addEventListener("click", cerrarModal);
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") cerrarModal(); });

/* Carrito */
function agregar(p, i, extras = {}) {
  const ex = Object.fromEntries(Object.entries(extras).filter(([, n]) => n > 0).sort());
  const firma = Object.entries(ex).map(([id, n]) => id + n).join("_");
  const clave = p.id + "-" + i + (firma ? "-" + firma : "");
  const existe = carrito.find(x => x.clave === clave);
  if (existe) existe.cantidad++;
  else carrito.push({ clave, id: p.id, opcion: i, extras: ex, cantidad: 1 });
  guardar(); pintarCarrito();
  aviso(firma ? `Agregado: ${p.nombre} con extras` : `Agregado: ${p.nombre}`);
}
/* Precio de una unidad (producto + sus extras, o creación personalizada) */
const precioUnidad = x => {
  if (x.creacion) return precioCreacion(x.creacion);
  const p = PRODUCTOS.find(q => q.id === x.id);
  return p.opciones[x.opcion].precio + costoExtras(x.extras);
};
/* Datos para mostrar cada línea del carrito */
function infoItem(x) {
  if (x.creacion) {
    const d = describirCreacion(x.creacion), t = crBuscar("tipos", x.creacion.tipo);
    return { nombre: t.carrito, detalle: d.flores, detalle2: d.presentacion,
      ext: textoExtras(x.creacion.extras), costoExt: costoExtras(x.creacion.extras),
      img: `<span class="item-svg">${svgCreacion(x.creacion)}</span>`, idea: x.creacion.idea };
  }
  const p = PRODUCTOS.find(q => q.id === x.id), o = p.opciones[x.opcion];
  return { nombre: p.nombre, detalle: o.nombre, ext: textoExtras(x.extras), costoExt: costoExtras(x.extras),
    img: foto(p.imagenes[0], "") };
}
const itemValido = x => x.creacion ? creacionValida(x.creacion)
  : (() => { const p = PRODUCTOS.find(q => q.id === x.id); return p && p.opciones[x.opcion]; })();
const ICONO_PAPELERA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
function pintarCarrito() {
  let total = 0, unidades = 0;
  carrito = carrito.filter(itemValido);
  $("#carritoLista").innerHTML = carrito.length ? carrito.map(x => {
    const i = infoItem(x), sub = precioUnidad(x) * x.cantidad;
    total += sub; unidades += x.cantidad;
    return `<li class="item">
      <div class="item-img">${i.img}</div>
      <div class="item-cuerpo">
        <div class="item-cab">
          <h3>${i.nombre}</h3>
          <button class="item-quitar" data-quitar="${x.clave}" aria-label="Quitar ${i.nombre} del pedido">${ICONO_PAPELERA}</button>
        </div>
        <p class="item-detalle">${i.detalle}${i.detalle2 ? `<br>${i.detalle2}` : ""}</p>
        ${i.ext ? `<p class="item-extras">+ ${i.ext} <span>(${usd(i.costoExt)} c/u)</span></p>` : ""}
        ${i.idea ? `<p class="item-idea">“${esc(i.idea)}”</p>` : ""}
        <div class="item-pie">
          <div class="cantidad" role="group" aria-label="Cantidad">
            <button data-menos="${x.clave}" aria-label="Quitar uno">−</button>
            <span aria-live="polite">${x.cantidad}</span>
            <button data-mas="${x.clave}" aria-label="Agregar uno">+</button>
          </div>
          <div class="item-precio"><strong>${usd(sub)}</strong>${tasa ? `<small>${bs(sub)}</small>` : ""}</div>
        </div>
      </div>
    </li>`;
  }).join("") : `<li class="carrito-vacio">
      <span class="vacio-icono" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span>
      <strong>Tu carrito está vacío</strong>
      <span>Agrega unas flores o arma un ramo a tu gusto.</span>
      <div class="vacio-acciones">
        <a href="#productos" class="btn btn-principal" data-cerrar-carrito>Ver productos</a>
        <a href="#crea-tu-ramo" class="btn btn-borde" data-cerrar-carrito>Crea tu ramo</a>
      </div>
    </li>`;
  $("#carritoPie").hidden = !carrito.length;
  $("#carritoConteo").textContent = unidades ? `${unidades} ${unidades === 1 ? "producto" : "productos"}` : "";
  $("#total").textContent = usd(total);
  $("#totalBs").textContent = tasa ? bs(total) : "";
  const pago = dividirPago(total);
  $("#pagoCarrito").hidden = !carrito.length || PORCENTAJE_ABONO >= 100;
  document.querySelectorAll(".pct-abono").forEach(e => e.textContent = PORCENTAJE_ABONO);
  $("#abonoCarrito").innerHTML = montoHTML(pago.abono);
  $("#restoCarrito").innerHTML = montoHTML(pago.resto);
  if (typeof pintarMetodos === "function" && $("#metodosCarrito")) pintarMetodos(pago.abono);
  $("#contador").textContent = unidades;
  $("#contador").classList.toggle("vacio", unidades === 0);
  $("#enviarPedido").disabled = !carrito.length;
  $("#enviarPedido").style.opacity = carrito.length ? 1 : .5;
}
$("#carritoLista").addEventListener("click", e => {
  if (e.target.closest("[data-cerrar-carrito]")) return cerrarCarrito();
  const b = e.target.closest("button"); if (!b) return;
  const c = b.dataset;
  const x = carrito.find(i => i.clave === (c.mas || c.menos || c.quitar)); if (!x) return;
  if (c.mas) x.cantidad++;
  if (c.menos) x.cantidad--;
  if (c.quitar || x.cantidad < 1) carrito = carrito.filter(i => i !== x);
  guardar(); pintarCarrito();
});
/* En PC, la ventana flotante se ubica justo debajo del ícono de la bolsa */
function ubicarCarrito() {
  const c = $("#carrito");
  if (window.innerWidth <= 600) { c.style.top = c.style.right = ""; return; }
  const r = $("#abrirCarrito").getBoundingClientRect();
  const top = Math.max(12, r.bottom + 10);
  c.style.top = top + "px";
  c.style.setProperty("--carrito-top", top + "px");
  c.style.right = Math.max(12, window.innerWidth - r.right - 8) + "px";
}
window.addEventListener("resize", () => { if ($("#carrito").classList.contains("abierto")) ubicarCarrito(); });
function abrirCarrito() { ubicarCarrito(); $("#carrito").classList.add("abierto"); $("#carrito").setAttribute("aria-hidden", "false"); $("#capa").classList.add("visible"); $("#cerrarCarrito").focus({ preventScroll: true }); }
function cerrarCarrito() { $("#carrito").classList.remove("abierto"); $("#carrito").setAttribute("aria-hidden", "true"); if (!$("#modal").classList.contains("visible")) $("#capa").classList.remove("visible"); }
$("#abrirCarrito").addEventListener("click", abrirCarrito);
$("#cerrarCarrito").addEventListener("click", cerrarCarrito);
$("#capa").addEventListener("click", () => { cerrarCarrito(); cerrarModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { cerrarModal(); cerrarCarrito(); } });

/* =========================================================
   MÉTODOS DE PAGO (carrito y contacto)
   ========================================================= */
let metodoSel = METODOS_PAGO[0]?.id || null;
try { const m = localStorage.getItem("metodo-amara"); if (METODOS_PAGO.some(x => x.id === m)) metodoSel = m; } catch (e) {}
const metodoActual = () => METODOS_PAGO.find(m => m.id === metodoSel);
/* Monto en la moneda del método: "Bs. 8.665,60" o "$ 10,00" */
const montoMetodo = (m, n) => m.moneda === "Bs" && tasa ? bs(n) : usd(n);
/* Lo que se copia: "8665,60" (sin puntos de miles, como lo piden los bancos) */
const montoCopiar = (m, n) => (m.moneda === "Bs" && tasa ? n * tasa : n).toFixed(2).replace(".", ",");
const ICONO_COPIAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

const datosHTML = m => !m.datos.length ? "" : `<dl class="datos-pago">${m.datos.map(d => `
  <div><dt>${d.etiqueta}</dt><dd>${d.valor}</dd>
    <button class="btn-copiar" data-copiar="${d.copiar ?? d.valor}" aria-label="Copiar ${d.etiqueta}">${ICONO_COPIAR}<span>Copiar</span></button></div>`).join("")}</dl>`;

/* Texto que se copia con "Copiar todos los datos" */
const textoCopiarTodo = (m, monto) =>
  [m.nombre, ...m.datos.map(d => `${d.etiqueta}: ${d.copiar ?? d.valor}`)]
    .concat(monto !== undefined ? [`Monto: ${montoCopiar(m, monto)}`] : [])
    .join("\n");
const botonCopiarTodo = (m, monto) => !m.datos.length ? "" : `
  <button class="btn-copiar-todo" data-copiar="${textoCopiarTodo(m, monto).replace(/"/g, "&quot;")}">
    ${ICONO_COPIAR}<span>${monto !== undefined ? "Copiar todo con el monto" : "Copiar todos los datos"}</span>
  </button>`;

function pintarMetodos(abono) {
  const caja = $("#metodosCarrito");
  if (!METODOS_PAGO.length) { caja.hidden = true; return; }
  caja.hidden = !carrito.length;
  const m = metodoActual() || METODOS_PAGO[0];
  caja.innerHTML = `
    <span class="metodos-titulo">Método de pago</span>
    ${METODOS_PAGO.length > 1 ? `<div class="metodos-opciones" role="radiogroup" aria-label="Elige cómo pagar">
      ${METODOS_PAGO.map(x => `<button role="radio" aria-checked="${x.id === m.id}" data-metodo="${x.id}">${x.nombre}</button>`).join("")}
    </div>` : `<strong class="metodo-unico">${m.nombre}</strong>`}
    ${datosHTML(m)}
    <div class="monto-pagar">
      <span>Monto del abono${PORCENTAJE_ABONO >= 100 ? "" : ` (${PORCENTAJE_ABONO}%)`}<strong>${montoMetodo(m, abono)}</strong></span>
      ${m.datos.length ? `<button class="btn-copiar" data-copiar="${montoCopiar(m, abono)}" aria-label="Copiar monto">${ICONO_COPIAR}<span>Copiar</span></button>` : ""}
    </div>
    ${botonCopiarTodo(m, abono)}
    ${m.nota ? `<p class="metodos-nota">${m.nota}</p>` : ""}`;
}
function pintarMetodosContacto() {
  const c = $("#metodosContacto"); if (!c) return;
  c.innerHTML = `<ul class="metodos-lista">${METODOS_PAGO.map(m => `<li>${m.nombre}</li>`).join("")}</ul>`;
  c.closest(".dato").hidden = !METODOS_PAGO.length;
}
$("#metodosCarrito").addEventListener("click", e => {
  const b = e.target.closest("[data-metodo]"); if (!b) return;
  metodoSel = b.dataset.metodo;
  try { localStorage.setItem("metodo-amara", metodoSel); } catch (err) {}
  pintarCarrito();
  $(`[data-metodo="${metodoSel}"]`)?.focus({ preventScroll: true });
});

/* Copiar al portapapeles (cualquier botón con data-copiar) */
async function copiarTexto(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch (e) {
    const a = document.createElement("textarea"); a.value = t; a.setAttribute("readonly", "");
    a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch (err) {}
    a.remove(); return ok;
  }
}
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-copiar]"); if (!b) return;
  const ok = await copiarTexto(b.dataset.copiar);
  const s = b.querySelector("span"); const antes = s.textContent;
  s.textContent = ok ? "¡Copiado!" : "No se pudo";
  b.classList.toggle("copiado", ok);
  if (ok && b.classList.contains("btn-copiar-todo")) aviso("Datos copiados. Pégalos en la app de tu banco.");
  setTimeout(() => { s.textContent = antes; b.classList.remove("copiado"); }, 1600);
});

/* =========================================================
   CREA TU RAMO
   ========================================================= */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const crBuscar = (lista, id) => CREADOR[lista].find(x => x.id === id);
/* "Rosa roja", "3 girasoles amarillos", "2 lirios azules" */
function nombreFlor(florId, colorId, n = 1) {
  const f = crBuscar("flores", florId), c = crBuscar("colores", colorId), plural = n > 1;
  let col = c.nombre;
  if (col.endsWith("o")) { if (f.genero === "f") col = col.slice(0, -1) + "a"; if (plural) col += "s"; }
  else if (!col.endsWith("a") && plural) col += "es";
  return `${plural ? (f.plural || f.nombre) : f.nombre} ${col}`;
}
const totalFlores = cfg => Object.values(cfg.flores || {}).reduce((a, b) => a + b, 0);
const costoFlores = cfg => Object.entries(cfg.flores || {}).reduce((s, [k, n]) => s + (crBuscar("flores", k.split("|")[0])?.precio || 0) * n, 0);
const precioCreacion = cfg => (crBuscar("tipos", cfg.tipo)?.precioBase || 0) + costoFlores(cfg) + costoExtras(cfg.extras);
function creacionValida(cfg) {
  const t = crBuscar("tipos", cfg?.tipo); if (!t) return false;
  const n = totalFlores(cfg);
  return n >= t.minFlores && n <= t.maxFlores &&
    Object.keys(cfg.flores).every(k => { const [f, c] = k.split("|"); return crBuscar("flores", f) && crBuscar("colores", c); });
}
function describirCreacion(cfg) {
  const flores = Object.entries(cfg.flores).map(([k, n]) => {
    const [f, c] = k.split("|"); return `${n} ${nombreFlor(f, c, n).toLowerCase()}`;
  }).join(", ");
  const partes = [];
  if (cfg.tipo === "ramo") partes.push(`Papel ${crBuscar("papeles", cfg.papel)?.nombre.toLowerCase()}`);
  if (cfg.lazo && cfg.tipo !== "maceta") partes.push(`${partes.length ? "lazo" : "Lazo"} ${crBuscar("lazos", cfg.lazo)?.nombre.toLowerCase()}`);
  if (cfg.tipo === "maceta") partes.push(`Maceta ${crBuscar("macetas", cfg.maceta)?.nombre.toLowerCase()}`);
  if (cfg.tipo === "suelta" && !partes.length) partes.push("Con tallo y hojas");
  return { flores, presentacion: partes.join(", ") };
}

/* ---------- Dibujo de la vista previa (SVG) ---------- */
function svgFlor(tipo, hex, x, y, r) {
  const borde = hex.toUpperCase() === "#F7F4EC" ? ' stroke="#CFC6B4" stroke-width="1"' : "";
  const petalos = (n, rx, ry, off) => Array.from({ length: n }, (_, i) =>
    `<ellipse cx="${x}" cy="${y - off}" rx="${rx}" ry="${ry}" fill="${hex}"${borde} transform="rotate(${i * 360 / n} ${x} ${y})"/>`).join("");
  switch (tipo) {
    case "girasol": return petalos(14, r * .22, r * .5, r * .55) + `<circle cx="${x}" cy="${y}" r="${r * .45}" fill="#5A3A22"/><circle cx="${x}" cy="${y}" r="${r * .25}" fill="none" stroke="#3E2716" stroke-width="${r * .08}"/>`;
    case "pequena": return petalos(6, r * .32, r * .42, r * .45) + `<circle cx="${x}" cy="${y}" r="${r * .3}" fill="#5A3A22"/>`;
    case "rosa": return `<circle cx="${x}" cy="${y}" r="${r * .85}" fill="${hex}"${borde}/>` +
      `<path d="M${x - r * .5} ${y}a${r * .5} ${r * .5} 0 1 1 ${r * .5} ${r * .5}M${x - r * .25} ${y}a${r * .25} ${r * .25} 0 1 1 ${r * .25} ${r * .25}" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="${r * .1}" stroke-linecap="round"/>`;
    case "lirio": return petalos(6, r * .26, r * .62, r * .5) + `<circle cx="${x}" cy="${y}" r="${r * .18}" fill="${hex.toUpperCase() === "#F6C21C" ? "#E07B00" : "#F6C21C"}"/>`;
    case "tulipan": return `<path d="M${x - r * .6} ${y - r * .45}Q${x - r * .7} ${y + r * .6} ${x} ${y + r * .6}Q${x + r * .7} ${y + r * .6} ${x + r * .6} ${y - r * .45}L${x + r * .3} ${y - r * .1}L${x} ${y - r * .65}L${x - r * .3} ${y - r * .1}Z" fill="${hex}"${borde}/><path d="M${x} ${y - r * .65}L${x} ${y + r * .5}" stroke="rgba(0,0,0,.15)" stroke-width="${r * .08}"/>`;
  }
  return "";
}
/* Reparte los colores para que se vean mezclados */
function floresMezcladas(cfg, max) {
  const grupos = Object.entries(cfg.flores || {}).map(([k, n]) => { const [f, c] = k.split("|"); return { f, hex: crBuscar("colores", c)?.hex || "#ccc", n }; });
  const out = [];
  while (out.length < max && grupos.some(g => g.n > 0)) grupos.forEach(g => { if (g.n > 0 && out.length < max) { out.push(g); g.n--; } });
  return out;
}
function svgCreacion(cfg) {
  const verde = "#4E8B3A", verdeOsc = "#3A6B2B";
  let s = "";
  if (cfg.tipo === "ramo") {
    const papel = crBuscar("papeles", cfg.papel)?.hex || "#F4F1EA", lazo = crBuscar("lazos", cfg.lazo)?.hex || "#A99BE6";
    const P = [[120,96],[94,86],[146,86],[108,64],[132,64],[76,106],[164,106],[120,52],[66,80],[174,80],[96,112],[144,112],[120,122],[84,56],[156,56],[54,102],[186,102],[104,34],[136,34]];
    const fl = floresMezcladas(cfg, P.length), n = fl.length, r = n <= 3 ? 27 : n <= 8 ? 22 : 18;
    s += `<path d="M58 112L120 226L182 112Z" fill="${papel}" stroke="rgba(0,0,0,.12)"/>`;
    s += [[70,70],[170,70],[60,110],[180,110],[120,40]].map(([a, b], i) => `<ellipse cx="${a}" cy="${b}" rx="10" ry="26" fill="${i % 2 ? verde : verdeOsc}" transform="rotate(${(a - 120) / 2} ${a} ${b})"/>`).join("");
    s += fl.map((g, i) => ({ g, p: P[i] })).reverse().map(({ g, p }) => svgFlor(g.f, g.hex, p[0], p[1], r)).join("");
    s += `<path d="M40 104L120 140L200 104L182 112L120 226L58 112Z" fill="${papel}" stroke="rgba(0,0,0,.15)"/><path d="M58 112L120 226" stroke="rgba(0,0,0,.1)"/><path d="M182 112L120 226" stroke="rgba(0,0,0,.1)"/>`;
    s += `<path d="M120 176l-26-12v24zM120 176l26-12v24z" fill="${lazo}" stroke="rgba(0,0,0,.18)"/><path d="M120 176l-10 30M120 176l10 30" stroke="${lazo}" stroke-width="6" stroke-linecap="round"/><circle cx="120" cy="176" r="6" fill="${lazo}" stroke="rgba(0,0,0,.2)"/>`;
  } else if (cfg.tipo === "maceta") {
    const mac = crBuscar("macetas", cfg.maceta)?.hex || "#6B4A32";
    const P = [[120,70],[86,96],[154,96],[102,46],[138,46]];
    const fl = floresMezcladas(cfg, P.length);
    s += fl.map((g, i) => `<path d="M120 165Q${(P[i][0] + 120) / 2} 130 ${P[i][0]} ${P[i][1]}" stroke="${verde}" stroke-width="5" fill="none"/>`).join("");
    s += `<ellipse cx="96" cy="140" rx="9" ry="20" fill="${verdeOsc}" transform="rotate(-40 96 140)"/><ellipse cx="144" cy="140" rx="9" ry="20" fill="${verde}" transform="rotate(40 144 140)"/>`;
    s += fl.map((g, i) => ({ g, p: P[i] })).reverse().map(({ g, p }) => svgFlor(g.f, g.hex, p[0], p[1], 24)).join("");
    s += `<path d="M78 160H162L152 224H88Z" fill="${mac}" stroke="rgba(0,0,0,.18)"/>` + [92,104,116,128,140,152].map(x => `<path d="M${x} 162L${x + (x - 120) * -.08} 222" stroke="rgba(0,0,0,.15)" stroke-width="2"/>`).join("") + `<rect x="74" y="154" width="92" height="12" rx="4" fill="${mac}" stroke="rgba(0,0,0,.2)"/>`;
  } else {
    const lazo = crBuscar("lazos", cfg.lazo)?.hex || "#A99BE6", g = floresMezcladas(cfg, 1)[0];
    s += `<path d="M120 226V90" stroke="${verde}" stroke-width="6"/><ellipse cx="102" cy="168" rx="10" ry="28" fill="${verdeOsc}" transform="rotate(-45 102 168)"/><ellipse cx="138" cy="150" rx="10" ry="28" fill="${verde}" transform="rotate(45 138 150)"/>`;
    s += `<path d="M120 196l-18-9v18zM120 196l18-9v18z" fill="${lazo}" stroke="rgba(0,0,0,.18)"/><circle cx="120" cy="196" r="5" fill="${lazo}"/>`;
    s += g ? svgFlor(g.f, g.hex, 120, 76, 40) : `<circle cx="120" cy="76" r="30" fill="none" stroke="#bbb" stroke-dasharray="6 6"/>`;
  }
  return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista previa">${s}</svg>`;
}
const EJEMPLO_CREACION = { tipo:"ramo", papel:"lavanda", lazo:"blanco", flores:{ "girasol|amarillo":3, "rosa|rojo":3, "pequena|blanco":3, "tulipan|rosado":2 }, extras:{} };

/* ---------- Estado e interfaz del creador ---------- */
let cr = { tipo:"ramo", flor:"girasol", color:"amarillo", flores:{}, papel:"blanco", lazo:"lavanda", maceta:"cafe", extras:{} };

const chip = (attr, item, activo, extra = "") =>
  `<button class="cr-chip${item.hex ? " cr-chip-color" : ""}" role="radio" aria-checked="${activo}" data-${attr}="${item.id}">${item.hex ? `<i style="background:${item.hex}"></i>` : ""}${item.nombre}${extra}</button>`;

function pintarCreador() {
  if (!$("#crTipos")) return;
  const t = crBuscar("tipos", cr.tipo), n = totalFlores(cr);
  // 1. Tipo
  $("#crTipos").innerHTML = CREADOR.tipos.map(x => `
    <button class="cr-tipo" role="radio" aria-checked="${x.id === cr.tipo}" data-cr-tipo="${x.id}">
      <span class="cr-tipo-arte" aria-hidden="true">${svgCreacion({ ...EJEMPLO_CREACION, tipo: x.id, maceta: "cafe", flores: x.id === "ramo" ? { "girasol|amarillo": 5 } : x.id === "maceta" ? { "girasol|amarillo": 3 } : { "lirio|azul": 1 } })}</span>
      <strong>${x.nombre}</strong><small>${x.detalle}</small>
      <small class="cr-desde">${x.precioBase ? `Base ${usd(x.precioBase)}` : "Sin costo base"}</small>
    </button>`).join("");
  // 2. Flores
  $("#crFlorTipo").innerHTML = CREADOR.flores.map(f => chip("cr-flor", f, f.id === cr.flor, ` <small>${usd(f.precio)}</small>`)).join("");
  $("#crFlorColor").innerHTML = CREADOR.colores.map(c => chip("cr-color", c, c.id === cr.color)).join("");
  const fSel = crBuscar("flores", cr.flor), cSel = crBuscar("colores", cr.color);
  const lleno = n >= t.maxFlores;
  $("#crAnadir").disabled = lleno;
  $("#crAnadir").innerHTML = `<span class="cr-muestra">${`<svg viewBox="0 0 60 60">${svgFlor(cr.flor, cSel.hex, 30, 30, 26)}</svg>`}</span> Agregar ${nombreFlor(cr.flor, cr.color)}`;
  const claves = Object.keys(cr.flores);
  $("#crLista").innerHTML = claves.length ? claves.map(k => {
    const [f, c] = k.split("|"), fl = crBuscar("flores", f), co = crBuscar("colores", c), q = cr.flores[k];
    return `<li class="cr-linea">
      <span class="cr-muestra"><svg viewBox="0 0 60 60">${svgFlor(f, co.hex, 30, 30, 26)}</svg></span>
      <span class="cr-linea-txt"><strong>${nombreFlor(f, c)}</strong><small>${usd(fl.precio)} c/u · ${usd(fl.precio * q)}</small></span>
      <span class="cantidad">
        <button data-cr-menos="${k}" aria-label="Quitar ${nombreFlor(f, c)}">−</button><span>${q}</span>
        <button data-cr-mas="${k}" aria-label="Agregar ${nombreFlor(f, c)}" ${lleno ? "disabled" : ""}>+</button>
      </span></li>`;
  }).join("") : `<li class="cr-vacio">Aún no has agregado flores. Elige una flor y un color, y toca “Agregar”.</li>`;
  $("#crContador").textContent = t.maxFlores === 1 ? `${n} de 1 flor` : `${n} de ${t.maxFlores} flores máximo`;
  // 3. Presentación
  let pres = "";
  if (cr.tipo === "ramo") pres += `<span class="cr-sub">Papel</span><div class="cr-chips" role="radiogroup" aria-label="Papel">${CREADOR.papeles.map(x => chip("cr-papel", x, x.id === cr.papel)).join("")}</div>`;
  if (cr.tipo === "maceta") pres += `<span class="cr-sub">Color de la maceta</span><div class="cr-chips" role="radiogroup" aria-label="Maceta">${CREADOR.macetas.map(x => chip("cr-maceta", x, x.id === cr.maceta)).join("")}</div>`;
  if (CREADOR.elegirLazo && cr.tipo !== "maceta") pres += `<span class="cr-sub">Lazo</span><div class="cr-chips" role="radiogroup" aria-label="Lazo">${CREADOR.lazos.map(x => chip("cr-lazo", x, x.id === cr.lazo)).join("")}</div>`;
  if (!pres) pres = `<p class="cr-sin-opciones">La flor individual va con su tallo y hojas. No necesitas elegir presentación.</p>`;
  $("#crPresentacion").innerHTML = pres;
  // 4. Extras
  $("#crExtras").innerHTML = EXTRAS.filter(e => CREADOR.extras.includes(e.id)).map(e => {
    const q = cr.extras[e.id] || 0;
    return `<li class="extra${q ? " activo" : ""}"><div class="extra-info"><strong>${e.nombre}</strong>${e.detalle ? `<small>${e.detalle}</small>` : ""}
      <span class="extra-precio">+ ${usd(e.precio)}${tasa ? ` · ${bs(e.precio)}` : ""}</span></div>
      <div class="cantidad"><button data-cr-extra-menos="${e.id}" aria-label="Quitar ${e.nombre}" ${q ? "" : "disabled"}>−</button><span>${q}</span>
      <button data-cr-extra-mas="${e.id}" aria-label="Agregar ${e.nombre}" ${q >= e.max ? "disabled" : ""}>+</button></div></li>`;
  }).join("");
  pintarResumenCreador();
}
function pintarResumenCreador() {
  const t = crBuscar("tipos", cr.tipo), n = totalFlores(cr), total = precioCreacion(cr), ext = costoExtras(cr.extras);
  $("#crPreview").innerHTML = svgCreacion(cr);
  $("#crTitulo").textContent = t.carrito;
  const filas = [[`Base (${t.nombre.toLowerCase()})`, t.precioBase], [`Flores (${n})`, costoFlores(cr)]];
  if (ext) filas.push(["Extras", ext]);
  $("#crDesglose").innerHTML = filas.map(([a, b]) => `<div><span>${a}</span><span>${usd(b)}</span></div>`).join("");
  $("#crTotal").innerHTML = precioHTML(total);
  const { abono } = dividirPago(total);
  $("#crAbono").innerHTML = n && PORCENTAJE_ABONO < 100 ? `Abonas hoy <strong>${usd(abono)}</strong>${tasa ? ` (${bs(abono)})` : ""} y el resto al recibir.` : "";
  let msg = "";
  if (n < t.minFlores) msg = t.minFlores === 1 ? "Agrega una flor para continuar." : `Agrega al menos ${t.minFlores} flores (llevas ${n}).`;
  else if (n > t.maxFlores) msg = t.maxFlores === 1 ? `Para “${t.nombre}” elige solo 1 flor (llevas ${n}). Quita las demás.` : `Para “${t.nombre}” el máximo es ${t.maxFlores} flores (llevas ${n}).`;
  $("#crMensaje").textContent = msg;
  $("#crAgregar").disabled = !!msg;
  // Barra fija en celular
  $("#crBarraMini").innerHTML = svgCreacion(cr);
  $("#crBarraFlores").textContent = `${n} ${n === 1 ? "flor" : "flores"}${tasa ? " · " + bs(total) : ""}`;
  $("#crBarraTotal").textContent = usd(total);
}
$("#crBarraVer")?.addEventListener("click", () => {
  document.querySelector(".creador-resumen").scrollIntoView({ behavior: "smooth", block: "start" });
});
/* La barra aparece mientras se recorren los pasos y se oculta al llegar al resumen */
if ("IntersectionObserver" in window && $("#crBarra")) {
  let enPasos = false, enResumen = false;
  const actualizarBarra = () => {
    const ver = enPasos && !enResumen;
    $("#crBarra").classList.toggle("visible", ver);
    $("#crBarra").setAttribute("aria-hidden", !ver);
    $("#crBarraVer").tabIndex = ver ? 0 : -1;
    document.body.classList.toggle("con-barra-creador", ver);
  };
  new IntersectionObserver(e => { enPasos = e[0].isIntersecting; actualizarBarra(); }).observe(document.querySelector(".creador-pasos"));
  new IntersectionObserver(e => { enResumen = e[0].isIntersecting; actualizarBarra(); }, { threshold: .25 }).observe(document.querySelector(".creador-resumen"));
}
/* Mantener el foco en el mismo botón después de redibujar */
function conFoco(fn) {
  const a = document.activeElement, attr = a && [...a.attributes].find(x => x.name.startsWith("data-cr"));
  fn();
  if (attr) { const b = document.querySelector(`[${attr.name}="${attr.value}"]`); if (b && !b.disabled) b.focus({ preventScroll: true }); else if (b) $("#crAnadir")?.focus({ preventScroll: true }); }
}
document.addEventListener("click", e => {
  const b = e.target.closest("#crea-tu-ramo button"); if (!b || b.disabled) return;
  const d = b.dataset, t = crBuscar("tipos", cr.tipo);
  conFoco(() => {
    if (d.crTipo) cr.tipo = d.crTipo;
    else if (d.crFlor) cr.flor = d.crFlor;
    else if (d.crColor) cr.color = d.crColor;
    else if (b.id === "crAnadir") { const k = cr.flor + "|" + cr.color; if (totalFlores(cr) < t.maxFlores) cr.flores[k] = (cr.flores[k] || 0) + 1; }
    else if (d.crMas) { if (totalFlores(cr) < t.maxFlores) cr.flores[d.crMas]++; }
    else if (d.crMenos) { if (--cr.flores[d.crMenos] <= 0) delete cr.flores[d.crMenos]; }
    else if (d.crPapel) cr.papel = d.crPapel;
    else if (d.crLazo) cr.lazo = d.crLazo;
    else if (d.crMaceta) cr.maceta = d.crMaceta;
    else if (d.crExtraMas) { const ex = EXTRAS.find(x => x.id === d.crExtraMas); cr.extras[ex.id] = Math.min((cr.extras[ex.id] || 0) + 1, ex.max); }
    else if (d.crExtraMenos) { if (--cr.extras[d.crExtraMenos] <= 0) delete cr.extras[d.crExtraMenos]; }
    else if (b.id === "crAgregar") return agregarCreacion();
    else if (b.id === "crReiniciar") { cr = { ...cr, flores: {}, extras: {} }; $("#crIdea").value = ""; }
    else return;
    pintarCreador();
  });
});
function agregarCreacion() {
  if (!creacionValida(cr)) return pintarResumenCreador();
  const c = { tipo: cr.tipo, flores: { ...cr.flores }, extras: { ...cr.extras }, idea: $("#crIdea").value.trim().slice(0, 300) };
  if (cr.tipo === "ramo") c.papel = cr.papel;
  if (CREADOR.elegirLazo && cr.tipo !== "maceta") c.lazo = cr.lazo;
  if (cr.tipo === "maceta") c.maceta = cr.maceta;
  carrito.push({ clave: "cr-" + Date.now(), creacion: c, cantidad: 1 });
  guardar(); pintarCarrito();
  aviso("¡Tu creación se agregó al carrito!");
  $("#crVerCarrito").hidden = false;
}
$("#crVerCarrito")?.addEventListener("click", abrirCarrito);

/* Mensaje de tarjeta: muestra "Escrito" cuando hay texto */
const estadoTarjeta = () => {
  const t = $("#mensajeTarjeta").value.trim();
  $("#tarjetaEstado").textContent = t ? `“${t.length > 34 ? t.slice(0, 34) + "…" : t}”` : "Opcional";
  $("#carritoTarjeta").classList.toggle("con-texto", !!t);
};
$("#mensajeTarjeta").addEventListener("input", estadoTarjeta);
$("#carritoTarjeta").addEventListener("toggle", () => { if ($("#carritoTarjeta").open) $("#mensajeTarjeta").focus({ preventScroll: true }); });

/* Enviar pedido por WhatsApp */
$("#enviarPedido").addEventListener("click", () => {
  let total = 0;
  const lineas = carrito.map(x => {
    const i = infoItem(x), sub = precioUnidad(x) * x.cantidad;
    total += sub;
    if (x.creacion) return `• ${x.cantidad} x ${i.nombre} – ${precioTexto(sub)}` +
      `\n   Flores: ${i.detalle}\n   Presentación: ${i.detalle2}` +
      (i.ext ? `\n   Extras por unidad: ${i.ext} (+ ${usd(i.costoExt)})` : "") +
      (i.idea ? `\n   Idea: ${i.idea}` : "");
    return `• ${x.cantidad} x ${i.nombre} (${i.detalle}) – ${precioTexto(sub)}` +
      (i.ext ? `\n   Extras por unidad: ${i.ext} (+ ${usd(i.costoExt)})` : "");
  });
  const tarjeta = $("#mensajeTarjeta").value.trim();
  const mensaje = `Hola Amara, quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${precioTexto(total)}` +
    (tasa ? `\nTasa BCV usada: Bs. ${fmt(tasa)}` : "") +
    (PORCENTAJE_ABONO < 100
      ? `\n\nForma de pago:\n• Abono por adelantado (${PORCENTAJE_ABONO}%): ${precioTexto(dividirPago(total).abono)}` +
        `\n• Restante el día de la entrega (${100 - PORCENTAJE_ABONO}%): ${precioTexto(dividirPago(total).resto)}`
      : "") +
    (tarjeta ? `\n\nMensaje para la tarjeta: "${tarjeta}"` : "") +
    (metodoActual() ? `\n\nMétodo de pago: ${metodoActual().nombre}` +
      `\nMonto del abono: ${montoMetodo(metodoActual(), PORCENTAJE_ABONO < 100 ? dividirPago(total).abono : total)}` +
      (metodoActual().notaWhatsApp ? `\n${metodoActual().notaWhatsApp}` : "") : "") +
    `\n\nMi nombre:\nDirección de entrega:\nFecha de entrega:`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank");
});

/* Menú móvil */
$("#botonMenu").addEventListener("click", () => {
  const abierto = $("#menu").classList.toggle("abierto");
  $("#botonMenu").setAttribute("aria-expanded", abierto);
});
document.querySelectorAll(".menu a").forEach(a => a.addEventListener("click", () => {
  $("#menu").classList.remove("abierto"); $("#botonMenu").setAttribute("aria-expanded", false);
}));

/* Aviso flotante */
let temporizador;
function aviso(texto) {
  $("#toast").textContent = texto; $("#toast").classList.add("visible");
  clearTimeout(temporizador); temporizador = setTimeout(() => $("#toast").classList.remove("visible"), 2200);
}

/* =========================================================
   TEMA: Claro / Oscuro / Automático
   ========================================================= */
const ICONOS_TEMA = {
  light: document.querySelector('[data-tema="light"] svg').outerHTML,
  dark:  document.querySelector('[data-tema="dark"] svg').outerHTML,
  auto:  document.querySelector('[data-tema="auto"] svg').outerHTML,
};
const sistemaOscuro = window.matchMedia("(prefers-color-scheme: dark)");
function temaActual() {
  try { const t = localStorage.getItem("tema-amara"); return t === "light" || t === "dark" ? t : "auto"; }
  catch (e) { return "auto"; }
}
function aplicarTema(t) {
  const raiz = document.documentElement;
  // Cambia todos los colores a la vez, sin transiciones a medias ni saltos
  raiz.classList.add("cambiando-tema");
  if (t === "auto") raiz.removeAttribute("data-theme"); else raiz.setAttribute("data-theme", t);
  try { t === "auto" ? localStorage.removeItem("tema-amara") : localStorage.setItem("tema-amara", t); } catch (e) {}
  const oscuro = t === "dark" || (t === "auto" && sistemaOscuro.matches);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", oscuro ? "#15111E" : "#6A51B8");
  $("#iconoTema").innerHTML = ICONOS_TEMA[t];
  document.querySelectorAll("[data-tema]").forEach(b => b.setAttribute("aria-checked", b.dataset.tema === t));
  $("#botonTema").setAttribute("aria-label", "Cambiar apariencia (actual: " + { light: "claro", dark: "oscuro", auto: "automático" }[t] + ")");
  requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.remove("cambiando-tema")));
}
function cerrarMenuTema() { $("#menuTema").classList.remove("abierto"); $("#botonTema").setAttribute("aria-expanded", "false"); }
$("#botonTema").addEventListener("click", e => {
  e.stopPropagation();
  const abierto = $("#menuTema").classList.toggle("abierto");
  $("#botonTema").setAttribute("aria-expanded", abierto);
  if (abierto) $('#menuTema [aria-checked="true"]').focus({ preventScroll: true });
});
$("#menuTema").addEventListener("click", e => {
  const b = e.target.closest("[data-tema]"); if (!b) return;
  aplicarTema(b.dataset.tema); cerrarMenuTema(); $("#botonTema").focus({ preventScroll: true });
});
document.addEventListener("click", e => { if (!e.target.closest(".tema")) cerrarMenuTema(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarMenuTema(); });
sistemaOscuro.addEventListener("change", () => { if (temaActual() === "auto") aplicarTema("auto"); });
aplicarTema(temaActual());

$("#anio").textContent = new Date().getFullYear();
pintarMetodosContacto();
pintarCreador();
pintarProductos(); pintarCarrito(); cargarTasa();
