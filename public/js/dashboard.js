// ============================================================
// dashboard.js — Panel que expone el 100% de la API
// - GET listar (tablas) y GET por email/ID (buscadores)
// - POST crear (formularios)
// - PUT actualizar (botón Editar: el formulario pasa a modo edición)
// - DELETE eliminar (botón Eliminar)
// - POST /auth/register y Analytics
// ============================================================

const token = localStorage.getItem("aprentic_token");

if (!token) {
  window.location.href = "./login.html"; // sin token no hay dashboard
}

// Usuario logueado: lo guardó auth.js al hacer login. Nos sirve para saber el rol.
const usuario = JSON.parse(localStorage.getItem("aprentic_user") || "{}");
const rolUsuario = usuario.rol || usuario.role || "desconocido";

const logoutBtn = document.getElementById("logoutBtn");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
const globalMessage = document.getElementById("globalMessage");

// Mostramos el rol en la píldora de la cabecera
const usuarioPill = document.getElementById("usuarioPill");
if (usuarioPill) usuarioPill.textContent = `Rol: ${rolUsuario}`;

// ---------- Mensajes globales ----------
function showMessage(texto, esError = true) {
  globalMessage.textContent = texto;
  globalMessage.classList.remove("hidden");
  globalMessage.style.color = esError ? "var(--danger)" : "var(--green)";
  setTimeout(() => globalMessage.classList.add("hidden"), 4000);
}

// ---------- Navegación entre secciones ----------
function showSection(sectionName) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionName);
  });

  sections.forEach((section) => {
    section.classList.toggle("active", section.id === `section-${sectionName}`);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => showSection(link.dataset.section));
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("aprentic_token");
    localStorage.removeItem("aprentic_user");
    window.location.href = "./login.html";
  });
}

// ---------- Métricas del resumen ----------
async function setMetric(id, path) {
  const element = document.getElementById(id);
  if (!element) return;

  try {
    const data = await apiRequest(path);
    element.textContent = Array.isArray(data) ? data.length : 0;
  } catch {
    element.textContent = "-";
  }
}

function cargarMetricas() {
  setMetric("metricAlumnos", "/alumno");
  setMetric("metricProfesores", "/profesor");
  setMetric("metricPromociones", "/curso");
  setMetric("metricProyectos", "/proyecto");
}

// ============================================================
// CONFIGURACIÓN DE CADA RECURSO
// Un solo objeto describe cada recurso: así las funciones genéricas
// (listar, buscar, crear, editar, eliminar) sirven para todos.
// ============================================================
const recursos = {
  alumno: {
    formId: "alumnoForm",
    tablaId: "alumnosTable",
    countId: "alumnosCount",
    tituloId: "alumnoFormTitulo",
    bannerId: "alumnoEditBanner",
    submitId: "alumnoSubmit",
    buscarFormId: "alumnoBuscarForm",
    buscarResultadoId: "alumnoBuscarResultado",
    tituloCrear: "Nuevo alumno",
    tituloEditar: "Editar alumno",
    textoCrear: "Crear alumno",
    listable: true, // tiene GET de listado
    columnas: [
      { titulo: "Nombre", campo: "nombre" },
      { titulo: "Apellidos", campo: "apellidos" },
      { titulo: "Email", campo: "email" },
      { titulo: "Edad", campo: "edad" },
      { titulo: "Campus", campo: "campus" },
    ],
  },
  profesor: {
    formId: "profesorForm",
    tablaId: "profesoresTable",
    countId: "profesoresCount",
    tituloId: "profesorFormTitulo",
    bannerId: "profesorEditBanner",
    submitId: "profesorSubmit",
    buscarFormId: "profesorBuscarForm",
    buscarResultadoId: "profesorBuscarResultado",
    tituloCrear: "Nuevo profesor",
    tituloEditar: "Editar profesor",
    textoCrear: "Crear profesor",
    listable: true,
    columnas: [
      { titulo: "Nombre", campo: "nombre" },
      { titulo: "Apellidos", campo: "apellidos" },
      { titulo: "Email", campo: "email" },
      { titulo: "Especialidad", campo: "especialidad" },
      { titulo: "Campus", campo: "campus" },
    ],
  },
  curso: {
    formId: "promocionForm",
    tablaId: "promocionesTable",
    countId: "promocionesCount",
    tituloId: "cursoFormTitulo",
    bannerId: "cursoEditBanner",
    submitId: "cursoSubmit",
    buscarFormId: "cursoBuscarForm",
    buscarResultadoId: "cursoBuscarResultado",
    tituloCrear: "Nueva promoción",
    tituloEditar: "Editar promoción",
    textoCrear: "Crear promoción",
    listable: true,
    columnas: [
      { titulo: "Nombre", campo: "nombre" },
      { titulo: "Campus", campo: "campus" },
      { titulo: "Inicio", campo: "fechaInicio", esFecha: true },
      { titulo: "Fin", campo: "fechaFin", esFecha: true },
    ],
  },
  proyecto: {
    formId: "proyectoForm",
    tablaId: "proyectosTable",
    countId: "proyectosCount",
    tituloId: "proyectoFormTitulo",
    bannerId: "proyectoEditBanner",
    submitId: "proyectoSubmit",
    buscarFormId: "proyectoBuscarForm",
    buscarResultadoId: "proyectoBuscarResultado",
    tituloCrear: "Nuevo proyecto",
    tituloEditar: "Editar proyecto",
    textoCrear: "Crear proyecto",
    listable: true,
    columnas: [
      { titulo: "Nombre", campo: "nombre" },
      { titulo: "Descripción", campo: "descripcion" },
      { titulo: "Entrega", campo: "fechaEntrega", esFecha: true },
    ],
  },
  nota: {
    formId: "notaForm",
    tablaId: "notasTable",
    countId: "notasCount",
    tituloId: "notaFormTitulo",
    bannerId: "notaEditBanner",
    submitId: "notaSubmit",
    buscarFormId: "notaBuscarForm",
    buscarResultadoId: "notaBuscarResultado",
    tituloCrear: "Nueva nota",
    tituloEditar: "Editar nota",
    textoCrear: "Crear nota",
    listable: true,
    columnas: [
      { titulo: "Alumno", campo: "alumnoNombre" },
      { titulo: "Proyecto", campo: "proyectoNombre" },
      { titulo: "Calificación", campo: "calificacion" },
      { titulo: "Estado", campo: "estado" },
    ],
  },
  admin: {
    formId: "adminForm",
    tablaId: null, // la API no tiene GET de listado de admins, solo búsqueda por email
    countId: null,
    tituloId: "adminFormTitulo",
    bannerId: "adminEditBanner",
    submitId: "adminSubmit",
    buscarFormId: "adminBuscarForm",
    buscarResultadoId: "adminBuscarResultado",
    tituloCrear: "Nuevo admin",
    tituloEditar: "Editar admin",
    textoCrear: "Crear admin",
    listable: false,
    columnas: [
      { titulo: "Nombre", campo: "nombre" },
      { titulo: "Apellidos", campo: "apellidos" },
      { titulo: "Email", campo: "email" },
    ],
  },
};

// Guardamos en memoria lo último que cargó cada recurso.
// Así, al pulsar "Editar" recuperamos el documento sin otra llamada a la API.
const datosCache = {};

// Si un recurso está en modo edición, aquí guardamos el _id que se edita.
const modoEdicion = {};

// ---------- Utilidad: aplanar notas "populadas" ----------
// El backend hace populate(): alumno y proyecto llegan como OBJETOS.
// Para la tabla creamos un texto legible, y para editar nos quedamos con el _id.
function normalizarNota(n) {
  const alumnoEsObjeto = n.alumno && typeof n.alumno === "object";
  const proyectoEsObjeto = n.proyecto && typeof n.proyecto === "object";

  return {
    ...n,
    alumnoNombre: alumnoEsObjeto ? `${n.alumno.nombre} ${n.alumno.apellidos || ""}`.trim() : n.alumno,
    proyectoNombre: proyectoEsObjeto ? (n.proyecto.nombre || n.proyecto.descripcion) : n.proyecto,
    alumno: alumnoEsObjeto ? n.alumno._id : n.alumno,       // el form de edición necesita el id
    proyecto: proyectoEsObjeto ? n.proyecto._id : n.proyecto,
  };
}

// ---------- Utilidad: fechas ISO -> formato corto YYYY-MM-DD ----------
function fechaCorta(valor) {
  return valor ? String(valor).slice(0, 10) : "-";
}

// ============================================================
// PINTAR TABLAS (genérico para todos los recursos)
// ============================================================
function pintarTabla(contenedor, recurso, data) {
  const config = recursos[recurso];

  let tabla = `
    <table>
      <thead>
        <tr>
          ${config.columnas.map((c) => `<th>${c.titulo}</th>`).join("")}
          <th>ID</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>`;

  data.forEach((element) => {
    tabla += `
        <tr>
          ${config.columnas
            .map((c) => {
              const valor = c.esFecha ? fechaCorta(element[c.campo]) : element[c.campo] ?? "-";
              return `<td>${valor}</td>`;
            })
            .join("")}
          <td><small>${element._id}</small></td>
          <td class="acciones">
            <div class="menu-acciones">
              <button class="btn-menu" onclick="toggleMenu(this)" aria-label="Acciones">&#8943;</button>
              <div class="menu-opciones hidden">
                <button onclick="editarRegistro('${recurso}', '${element._id}')">Editar</button>
                <button class="opcion-eliminar" onclick="eliminarRegistro('${recurso}', '${element._id}')">Eliminar</button>
              </div>
            </div>
          </td>
        </tr>`;
  });

  tabla += `
      </tbody>
    </table>`;

  contenedor.innerHTML = tabla;
}

// ---------- Menú desplegable de acciones (botón ⋯) ----------
function toggleMenu(boton) {
  const menu = boton.nextElementSibling;
  const estabaAbierto = !menu.classList.contains("hidden");

  // Cerramos cualquier otro menú que esté abierto
  document.querySelectorAll(".menu-opciones").forEach((m) => m.classList.add("hidden"));

  // Si este estaba cerrado, lo abrimos (si estaba abierto, queda cerrado)
  if (!estabaAbierto) menu.classList.remove("hidden");
}

// Clic en cualquier otra parte de la página -> se cierran los menús
document.addEventListener("click", (event) => {
  if (!event.target.closest(".menu-acciones")) {
    document.querySelectorAll(".menu-opciones").forEach((m) => m.classList.add("hidden"));
  }
});

// ============================================================
// GET listado de un recurso
// ============================================================
async function cargarRecurso(recurso) {
  const config = recursos[recurso];
  if (!config.listable) return; // admin no tiene listado en la API

  try {
    let data = await apiRequest(`/${recurso}`);
    if (recurso === "nota") data = data.map(normalizarNota); // aplanamos el populate
    datosCache[recurso] = data; // guardamos para el botón Editar

    document.getElementById(config.countId).textContent = `${data.length} registros`;
    pintarTabla(document.getElementById(config.tablaId), recurso, data);
  } catch (error) {
    showMessage(error.message);
  }
}

// Botones "Actualizar" de cada sección
document.querySelectorAll("[data-reload]").forEach((boton) => {
  boton.addEventListener("click", () => cargarRecurso(boton.dataset.reload));
});

// ============================================================
// GET por email / ID (buscadores)
// alumno, profesor y admin buscan por email; curso, proyecto y nota por ID
// ============================================================
function conectarBuscador(recurso) {
  const config = recursos[recurso];
  const form = document.getElementById(config.buscarFormId);
  const resultado = document.getElementById(config.buscarResultadoId);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const clave = new FormData(form).get("clave").trim();

    try {
      const data = await apiRequest(`/${recurso}/${clave}`);
      // El backend puede devolver un objeto o un array: lo normalizamos
      let doc = Array.isArray(data) ? data[0] : data;
      if (recurso === "nota" && doc) doc = normalizarNota(doc); // aplanamos el populate

      if (!doc || !doc._id) {
        resultado.innerHTML = `<p class="muted">No se encontró ningún resultado.</p>`;
        return;
      }

      // Guardamos el resultado en caché para poder editarlo después
      datosCache[recurso] = [doc];
      pintarTabla(resultado, recurso, [doc]);
    } catch (error) {
      resultado.innerHTML = `<p class="muted">${error.message}</p>`;
    }
  });
}

// Botones "Limpiar" de los buscadores
document.querySelectorAll("[data-clear]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const recurso = boton.dataset.clear;
    const config = recursos[recurso];
    document.getElementById(config.buscarResultadoId).innerHTML = "";
    document.getElementById(config.buscarFormId).reset();
  });
});

// ============================================================
// MODO EDICIÓN (PUT)
// Al pulsar "Editar": rellenamos el formulario con los datos del
// documento y el submit pasa de POST (crear) a PUT (actualizar).
// ============================================================
function editarRegistro(recurso, id) {
  const config = recursos[recurso];
  // Buscamos el documento en lo último que cargamos
  const doc = (datosCache[recurso] || []).find((d) => d._id === id);
  if (!doc) return showMessage("Pulsa Actualizar y vuelve a intentarlo");

  const form = document.getElementById(config.formId);

  // Rellenamos cada input del formulario que coincida con un campo del documento
  Object.keys(doc).forEach((campo) => {
    const input = form.elements[campo];
    if (!input || campo === "password") return; // el password nunca se rellena
    const c = config.columnas.find((col) => col.campo === campo);
    input.value = c && c.esFecha ? fechaCorta(doc[campo]) : doc[campo] ?? "";
  });

  // Activamos el modo edición
  modoEdicion[recurso] = id;
  document.getElementById(config.tituloId).textContent = config.tituloEditar;
  document.getElementById(config.submitId).textContent = "Guardar cambios";

  const banner = document.getElementById(config.bannerId);
  banner.textContent = `Editando el registro ${id}`;
  banner.classList.remove("hidden");

  form.querySelector("[data-cancelar]").classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth" }); // llevamos la vista al formulario
}

function cancelarEdicion(recurso) {
  const config = recursos[recurso];
  const form = document.getElementById(config.formId);

  modoEdicion[recurso] = null;
  form.reset();
  document.getElementById(config.tituloId).textContent = config.tituloCrear;
  document.getElementById(config.submitId).textContent = config.textoCrear;
  document.getElementById(config.bannerId).classList.add("hidden");
  form.querySelector("[data-cancelar]").classList.add("hidden");
}

// Botones "Cancelar edición"
document.querySelectorAll("[data-cancelar]").forEach((boton) => {
  boton.addEventListener("click", () => cancelarEdicion(boton.dataset.cancelar));
});

// ============================================================
// DELETE
// ============================================================
async function eliminarRegistro(recurso, id) {
  const seguro = confirm("¿Seguro que quieres eliminar este registro?");
  if (!seguro) return;

  try {
    await apiRequest(`/${recurso}/${id}`, { method: "DELETE" });
    showMessage("Registro eliminado correctamente", false);
    cargarRecurso(recurso);
    cargarMetricas();
  } catch (error) {
    // Si eres profesor verás aquí el 403 "No tienes permisos"
    showMessage(error.message);
  }
}

// ============================================================
// POST (crear) y PUT (guardar cambios) con el mismo formulario
// ============================================================
function conectarFormulario(recurso) {
  const config = recursos[recurso];
  const form = document.getElementById(config.formId);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // FormData lee todos los inputs por su atributo name
    const datos = Object.fromEntries(new FormData(form));

    // Quitamos los campos vacíos (ej: ObjectIds opcionales sin rellenar)
    Object.keys(datos).forEach((campo) => {
      if (datos[campo] === "") delete datos[campo];
    });

    try {
      const idEnEdicion = modoEdicion[recurso];

      if (idEnEdicion) {
        // Modo edición -> PUT /recurso/:id
        await apiRequest(`/${recurso}/${idEnEdicion}`, {
          method: "PUT",
          body: JSON.stringify(datos),
        });
        showMessage("Actualizado correctamente", false);
        cancelarEdicion(recurso);
      } else {
        // Modo normal -> POST /recurso
        await apiRequest(`/${recurso}`, {
          method: "POST",
          body: JSON.stringify(datos),
        });
        showMessage("Creado correctamente", false);
        form.reset();
      }

      cargarRecurso(recurso);
      cargarMetricas();
    } catch (error) {
      showMessage(error.message);
    }
  });
}

// ============================================================
// POST /auth/register (endpoint público de la API)
// ============================================================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(registerForm));

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(datos),
      });
      showMessage("Usuario registrado correctamente", false);
      registerForm.reset();
    } catch (error) {
      showMessage(error.message);
    }
  });
}

// ============================================================
// ANALYTICS (agregaciones del backend)
// ============================================================
async function cargarAnalytics() {
  try {
    const aptos = await apiRequest("/analytics/aptos-campus");
    document.getElementById("analyticsAptos").innerHTML = aptos
      .map((a) => `<p><strong>${a.campus}</strong>: ${a.tasaAptos}% aptos (${a.aptos}/${a.totalNotas} notas)</p>`)
      .join("");
  } catch (error) {
    document.getElementById("analyticsAptos").innerHTML = `<p>${error.message}</p>`;
  }

  try {
    const ranking = await apiRequest("/analytics/ranking-no-aptos");
    document.getElementById("analyticsRanking").innerHTML = ranking.length
      ? ranking.map((r) => `<p><strong>${r.proyecto}</strong>: ${r.noAptos} no aptos</p>`).join("")
      : "<p>No hay notas suspensas 🎉</p>";
  } catch (error) {
    document.getElementById("analyticsRanking").innerHTML = `<p>${error.message}</p>`;
  }

  try {
    const riesgo = await apiRequest("/analytics/alumnos-riesgo");
    document.getElementById("analyticsRiesgo").innerHTML = riesgo.length
      ? riesgo
          .map((a) => `<p><strong>${a.nombre} ${a.apellidos}</strong> (${a.campus}): media ${a.media}, ${a.noAptos} no aptos</p>`)
          .join("")
      : "<p>Ningún alumno en riesgo 🎉</p>";
  } catch (error) {
    document.getElementById("analyticsRiesgo").innerHTML = `<p>${error.message}</p>`;
  }
}

const reloadAnalyticsBtn = document.getElementById("reloadAnalyticsBtn");
if (reloadAnalyticsBtn) {
  reloadAnalyticsBtn.addEventListener("click", cargarAnalytics);
}

// ============================================================
// ARRANQUE: conectamos todo y cargamos los datos iniciales
// ============================================================
Object.keys(recursos).forEach((recurso) => {
  conectarFormulario(recurso);
  conectarBuscador(recurso);
  cargarRecurso(recurso);
});

cargarMetricas();
cargarAnalytics();