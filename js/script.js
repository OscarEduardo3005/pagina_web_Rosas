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

  { id:6, nombre:"Combo ramo y girasol", categoria:"Combos",
    imagenes:["img/promo-flores-amarillas.jpg","img/ramo-flores-luz.jpg","img/girasol-bolsa-regalo.jpg"],
    descripcion:"Ramo de flores amarillas con luz cálida más un girasol en maceta dentro de su bolsa de regalo.",
    etiqueta:"Combo",
    opciones:[{nombre:"Ramo 12 flores + girasol",precio:27},{nombre:"Ramo 20 flores + girasol",precio:36}] },
];

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
  if (actual && $("#modal").classList.contains("visible")) $("#modalPrecio").innerHTML = precioHTML(actual.opciones[opcionSel].precio);
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
  $("#grilla").innerHTML = lista.length ? lista.map(p => `
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
          <button class="btn-agregar" data-ver="${p.id}">Agregar</button>
        </div>
      </div>
    </article>`).join("")
    : `<p class="sin-resultados">No encontramos productos con esa palabra. Prueba con “girasol” o elige “Todos”.</p>`;
}

/* Cualquier botón con data-ver abre el producto (catálogo y promoción) */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-ver]");
  if (b) abrirModal(+b.dataset.ver);
});

/* Modal */
let actual = null, opcionSel = 0, ultimoFoco = null;
function mostrarFoto(i) {
  $("#modalImg").innerHTML = foto(actual.imagenes[i], actual.nombre, false);
  document.querySelectorAll(".miniaturas button").forEach((b, j) => b.setAttribute("aria-pressed", j === i));
}
function abrirModal(id) {
  actual = PRODUCTOS.find(p => p.id === id); if (!actual) return;
  opcionSel = 0; ultimoFoco = document.activeElement;
  $("#modalMiniaturas").innerHTML = actual.imagenes.length > 1
    ? actual.imagenes.map((src, i) => `<button data-foto="${i}" aria-label="Ver foto ${i + 1}">${foto(src, "")}</button>`).join("")
    : "";
  mostrarFoto(0);
  $("#modalTitulo").textContent = actual.nombre;
  $("#modalDesc").textContent = actual.descripcion;
  $("#modalOpciones").innerHTML = actual.opciones.map((o, i) =>
    `<button class="opcion" data-i="${i}" aria-pressed="${i === 0}">${o.nombre}</button>`).join("");
  $("#modalPrecio").innerHTML = precioHTML(actual.opciones[0].precio);
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
  $("#modalPrecio").innerHTML = precioHTML(actual.opciones[opcionSel].precio);
});
$("#modalAgregar").addEventListener("click", () => { agregar(actual, opcionSel); cerrarModal(); });
$("#cerrarModal").addEventListener("click", cerrarModal);
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") cerrarModal(); });

/* Carrito */
function agregar(p, i) {
  const clave = p.id + "-" + i;
  const existe = carrito.find(x => x.clave === clave);
  if (existe) existe.cantidad++;
  else carrito.push({ clave, id: p.id, opcion: i, cantidad: 1 });
  guardar(); pintarCarrito(); aviso(`Agregado: ${p.nombre}`);
}
function pintarCarrito() {
  let total = 0, unidades = 0;
  carrito = carrito.filter(x => {
    const p = PRODUCTOS.find(q => q.id === x.id);
    return p && p.opciones[x.opcion];
  });
  $("#carritoLista").innerHTML = carrito.length ? carrito.map(x => {
    const p = PRODUCTOS.find(q => q.id === x.id), o = p.opciones[x.opcion];
    total += o.precio * x.cantidad; unidades += x.cantidad;
    return `<li class="item">
      <div class="item-img">${foto(p.imagenes[0], "")}</div>
      <div><h3>${p.nombre}</h3><small>${o.nombre}</small>
        <div class="cantidad">
          <button data-menos="${x.clave}" aria-label="Quitar uno">−</button>
          <span>${x.cantidad}</span>
          <button data-mas="${x.clave}" aria-label="Agregar uno">+</button>
        </div></div>
      <div style="text-align:right"><strong>${usd(o.precio * x.cantidad)}</strong>${tasa ? `<br><small>${bs(o.precio * x.cantidad)}</small>` : ""}<br>
        <button class="quitar" data-quitar="${x.clave}">Quitar</button></div>
    </li>`;
  }).join("") : `<li class="carrito-vacio">Tu carrito está vacío.<br>Agrega unas flores para empezar tu pedido.</li>`;
  $("#total").textContent = usd(total);
  $("#totalBs").textContent = tasa ? bs(total) : "";
  $("#contador").textContent = unidades;
  $("#contador").classList.toggle("vacio", unidades === 0);
  $("#enviarPedido").disabled = !carrito.length;
  $("#enviarPedido").style.opacity = carrito.length ? 1 : .5;
}
$("#carritoLista").addEventListener("click", e => {
  const c = e.target.dataset;
  const x = carrito.find(i => i.clave === (c.mas || c.menos || c.quitar)); if (!x) return;
  if (c.mas) x.cantidad++;
  if (c.menos) x.cantidad--;
  if (c.quitar || x.cantidad < 1) carrito = carrito.filter(i => i !== x);
  guardar(); pintarCarrito();
});
function abrirCarrito() { $("#carrito").classList.add("abierto"); $("#carrito").setAttribute("aria-hidden", "false"); $("#capa").classList.add("visible"); $("#cerrarCarrito").focus({ preventScroll: true }); }
function cerrarCarrito() { $("#carrito").classList.remove("abierto"); $("#carrito").setAttribute("aria-hidden", "true"); if (!$("#modal").classList.contains("visible")) $("#capa").classList.remove("visible"); }
$("#abrirCarrito").addEventListener("click", abrirCarrito);
$("#cerrarCarrito").addEventListener("click", cerrarCarrito);
$("#capa").addEventListener("click", () => { cerrarCarrito(); cerrarModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { cerrarModal(); cerrarCarrito(); } });

/* Enviar pedido por WhatsApp */
$("#enviarPedido").addEventListener("click", () => {
  let total = 0;
  const lineas = carrito.map(x => {
    const p = PRODUCTOS.find(q => q.id === x.id), o = p.opciones[x.opcion];
    total += o.precio * x.cantidad;
    return `• ${x.cantidad} x ${p.nombre} (${o.nombre}) – ${precioTexto(o.precio * x.cantidad)}`;
  });
  const tarjeta = $("#mensajeTarjeta").value.trim();
  const mensaje = `Hola Amara, quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${precioTexto(total)}` +
    (tasa ? `\nTasa BCV usada: Bs. ${fmt(tasa)}` : "") +
    (tarjeta ? `\n\nMensaje para la tarjeta: "${tarjeta}"` : "") +
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
pintarProductos(); pintarCarrito(); cargarTasa();
