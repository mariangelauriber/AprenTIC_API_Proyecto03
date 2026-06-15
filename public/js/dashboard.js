const token = localStorage.getItem("aprentic_token");
const storedUser = localStorage.getItem("aprentic_user");

if (!token || !storedUser) {
  window.location.href = "./login.html";
}

const user = JSON.parse(storedUser);
const rol = user.rol || user.role;
const userId = user.id || user._id || user.accountId;

const logoutBtn = document.getElementById("logoutBtn");
const globalMessage = document.getElementById("globalMessage");

let allAlumnos = [];
let allProfesores = [];
let allCursos = [];
let allProyectos = [];
let allNotas = [];

let alumnosVisibles = [];
let profesoresVisibles = [];
let cursosVisibles = [];
let proyectosVisibles = [];
let notasVisibles = [];

function showGlobalMessage(message, type = "error") {
  if (!globalMessage) return;

  globalMessage.textContent = message;
  globalMessage.className = `message ${type}`;
}

function hideGlobalMessage() {
  if (!globalMessage) return;

  globalMessage.textContent = "";
  globalMessage.className = "message hidden";
}

/* ================================
   NAVEGACIÓN
================================ */

function showSection(sectionName) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionName);
  });

  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.toggle("active", section.id === `section-${sectionName}`);
  });
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    showSection(link.dataset.section);
  });
});

/* ================================
   LOGOUT
================================ */

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("aprentic_token");
    localStorage.removeItem("aprentic_user");

    window.location.href = "./login.html";
  });
}

/* ================================
   HELPERS DE IDS Y CAMPOS
================================ */

function normalizarId(value) {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object" && value._id) {
    return value._id;
  }

  return String(value);
}

function sameId(a, b) {
  return normalizarId(a) === normalizarId(b);
}

function getCampoId(item, nombres) {
  for (const nombre of nombres) {
    if (item && item[nombre]) {
      return normalizarId(item[nombre]);
    }
  }

  return "";
}

function getNestedValue(object, path) {
  return path.split(".").reduce((acc, key) => {
    if (!acc) return "";
    return acc[key];
  }, object);
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.slice(0, 10);
  }

  if (typeof value === "object") {
    if (value.nombre && value.apellidos) {
      return `${value.nombre} ${value.apellidos}`;
    }

    if (value.nombre) {
      return value.nombre;
    }

    if (value.email) {
      return value.email;
    }

    if (value._id) {
      return value._id;
    }

    return JSON.stringify(value);
  }

  return value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function findById(collection, id) {
  return collection.find((item) => sameId(getItemId(item), id));
}

function getItemId(item) {
  return normalizarId(item?._id || item?.id);
}

function getNombreProfesor(id) {
  const profesor = findById(allProfesores, id);

  if (!profesor) return id;

  return `${profesor.nombre || ""} ${profesor.apellidos || ""}`.trim();
}

function getNombreCurso(id) {
  const curso = findById(allCursos, id);

  if (!curso) return id;

  return curso.nombre;
}

function getNombreAlumno(id) {
  const alumno = findById(allAlumnos, id);

  if (!alumno) return id;

  return `${alumno.nombre || ""} ${alumno.apellidos || ""}`.trim();
}

function getNombreProyecto(id) {
  const proyecto = findById(allProyectos, id);

  if (!proyecto) return id;

  return proyecto.nombre;
}

/* ================================
   PERMISOS VISUALES
================================ */

function aplicarPermisosVisuales() {
  const userRoleLabel = document.getElementById("userRoleLabel");
  const welcomeText = document.getElementById("welcomeText");
  const dashboardTopbar = document.getElementById("dashboardTopbar");
  const overviewSummaryCard = document.getElementById("overviewSummaryCard");
  const mostrarBotonAccion = (buttonId) => {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.style.display = "inline-block";
    button.closest(".section-actions")?.classList.add("has-actions");
  };

  if (userRoleLabel) {
    userRoleLabel.textContent = `Sesión como ${rol}`;
  }

  if (welcomeText) {
    welcomeText.textContent =
      rol === "profesor"
        ? "Panel de profesor: solo ves tus cursos, alumnos, proyectos y notas."
        : "Panel de administrador: ves toda la información del sistema.";
  }

  if (rol === "profesor") {
    const profesoresBtn = document.querySelector('[data-section="profesores"]');
    const profesoresSection = document.getElementById("section-profesores");
    const metricProfesoresCard = document.getElementById(
      "metricProfesoresCard",
    );

    if (dashboardTopbar) dashboardTopbar.remove();
    if (overviewSummaryCard) overviewSummaryCard.remove();
    if (profesoresBtn) profesoresBtn.remove();
    if (profesoresSection) profesoresSection.remove();
    if (metricProfesoresCard) metricProfesoresCard.remove();
    mostrarBotonAccion("btnCrearProyecto");
  }

  // Mostrar botones de crear solo para admin
  if (rol === "admin") {
    mostrarBotonAccion("btnCrearAlumno");
    mostrarBotonAccion("btnCrearProfesor");
    mostrarBotonAccion("btnCrearCurso");
    mostrarBotonAccion("btnCrearProyecto");
    mostrarBotonAccion("btnCrearNota");
  }
}

/* ================================
   TABLAS
================================ */

function renderTable(containerId, countId, data, columns) {
  const container = document.getElementById(containerId);
  const count = document.getElementById(countId);

  if (!container) return;

  if (!Array.isArray(data)) {
    data = [];
  }

  if (count) {
    count.textContent = `${data.length} registros`;
  }

  if (data.length === 0) {
    container.innerHTML = `<p class="muted">No hay registros para mostrar.</p>`;
    return;
  }

  const tableHead = columns
    .map((column) => `<th>${column.label}</th>`)
    .join("");

  const tableRows = data
    .map((item) => {
      const cells = columns
        .map((column) => {
          let value;

          if (typeof column.render === "function") {
            value = column.render(item);
          } else {
            value = getNestedValue(item, column.key);
          }

          if (column.html === true) {
            return `<td>${value}</td>`;
          }

          return `<td>${escapeHtml(formatValue(value))}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  container.innerHTML = `
    <table>
      <thead>
        <tr>${tableHead}</tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
}

/* ================================
   CARGAR DATOS BASE
================================ */

async function cargarDatosBase() {
  const [alumnos, profesores, cursos, proyectos, notas] = await Promise.all([
    apiRequest("/alumno"),
    apiRequest("/profesor"),
    apiRequest("/curso"),
    apiRequest("/proyecto"),
    apiRequest("/nota"),
  ]);

  console.log("alumnos:", alumnos);
  console.log("notas:", notas);

  allAlumnos = Array.isArray(alumnos) ? alumnos : [];
  allProfesores = Array.isArray(profesores) ? profesores : [];
  allCursos = Array.isArray(cursos) ? cursos : [];
  allProyectos = Array.isArray(proyectos) ? proyectos : [];
  allNotas = Array.isArray(notas) ? notas : [];
}

/* ================================
   FILTRAR SEGÚN ROL
================================ */

function filtrarDatosPorRol() {
  if (rol === "admin") {
    alumnosVisibles = allAlumnos;
    profesoresVisibles = allProfesores;
    cursosVisibles = allCursos;
    proyectosVisibles = allProyectos;
    notasVisibles = allNotas;

    return;
  }

  if (rol === "profesor") {
    const profesorLogueado = allProfesores.find((profesor) => {
      return profesor.email === user.email || sameId(profesor._id, userId);
    });

    if (!profesorLogueado) {
      throw new Error("No se ha encontrado el perfil del profesor logueado.");
    }

    const profesorId = normalizarId(profesorLogueado._id);

    cursosVisibles = allCursos.filter((curso) => {
      const idProfesorCurso = getCampoId(curso, ["profesor", "profesorId"]);
      return sameId(idProfesorCurso, profesorId);
    });

    const idsCursos = cursosVisibles.map((curso) => normalizarId(curso._id));

    alumnosVisibles = allAlumnos.filter((alumno) => {
      const idCursoAlumno = getCampoId(alumno, ["curso", "cursoId"]);
      return idsCursos.includes(idCursoAlumno);
    });

    proyectosVisibles = allProyectos.filter((proyecto) => {
      const idCursoProyecto = getCampoId(proyecto, ["curso", "cursoId"]);
      return idsCursos.includes(idCursoProyecto);
    });

    notasVisibles = allNotas.filter((nota) => {
      const idProfesorNota = getCampoId(nota, ["profesor", "profesorId"]);

      if (idProfesorNota) {
        return sameId(idProfesorNota, profesorId);
      }

      const idProyectoNota = getCampoId(nota, ["proyecto", "proyectoId"]);
      const proyecto = findById(allProyectos, idProyectoNota);

      if (!proyecto) return false;

      const idCursoProyecto = getCampoId(proyecto, ["curso", "cursoId"]);
      return idsCursos.includes(idCursoProyecto);
    });

    profesoresVisibles = [];

    return;
  }

  alumnosVisibles = [];
  profesoresVisibles = [];
  cursosVisibles = [];
  proyectosVisibles = [];
  notasVisibles = [];
}

/* ================================
   MÉTRICAS
================================ */

function pintarMetricas() {
  const metricAlumnos = document.getElementById("metricAlumnos");
  const metricProfesores = document.getElementById("metricProfesores");
  const metricCursos = document.getElementById("metricCursos");
  const metricProyectos = document.getElementById("metricProyectos");
  const metricNotas = document.getElementById("metricNotas");

  if (metricAlumnos) metricAlumnos.textContent = alumnosVisibles.length;
  if (metricProfesores)
    metricProfesores.textContent = profesoresVisibles.length;
  if (metricCursos) metricCursos.textContent = cursosVisibles.length;
  if (metricProyectos) metricProyectos.textContent = proyectosVisibles.length;
  if (metricNotas) metricNotas.textContent = notasVisibles.length;
}

/* ================================
   RENDERIZADOS
================================ */

function renderAlumnos() {
  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellidos", key: "apellidos" },
    { label: "Email", key: "email" },
    { label: "Campus", key: "campus" },
    {
      label: "Curso",
      render: (alumno) => {
        const idCurso = getCampoId(alumno, ["curso", "cursoId"]);
        return getNombreCurso(idCurso);
      },
    },
  ];

  if (rol === "admin") {
    columns.push({
      label: "Acciones",
      html: true,
      render: (alumno) => {
        return `<button class="btn btn-danger btn-sm delete-alumno" data-id="${escapeHtml(alumno._id)}">Eliminar</button>`;
      },
    });
  }

  renderTable("alumnosTable", "alumnosCount", alumnosVisibles, columns);
}

function renderProfesores() {
  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellidos", key: "apellidos" },
    { label: "Email", key: "email" },
    { label: "Especialidad", key: "especialidad" },
    { label: "Campus", key: "campus" },
  ];

  if (rol === "admin") {
    columns.push({
      label: "Acciones",
      html: true,
      render: (profesor) => {
        return `<button class="btn btn-danger btn-sm delete-profesor" data-id="${escapeHtml(profesor._id)}">Eliminar</button>`;
      },
    });
  }

  renderTable(
    "profesoresTable",
    "profesoresCount",
    profesoresVisibles,
    columns,
  );
}

function renderCursos() {
  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Campus", key: "campus" },
    { label: "Inicio", key: "fechaInicio" },
    { label: "Fin", key: "fechaFin" },
    {
      label: "Profesor",
      render: (curso) => {
        const idProfesor = getCampoId(curso, ["profesor", "profesorId"]);
        return getNombreProfesor(idProfesor);
      },
    },
  ];

  if (rol === "admin") {
    columns.push({
      label: "Acciones",
      html: true,
      render: (curso) => {
        return `<button class="btn btn-danger btn-sm delete-curso" data-id="${escapeHtml(curso._id)}">Eliminar</button>`;
      },
    });
  }

  renderTable("cursosTable", "cursosCount", cursosVisibles, columns);
}

function renderProyectos() {
  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Descripción", key: "descripcion" },
    { label: "Fecha entrega", key: "fechaEntrega" },
    {
      label: "Curso",
      render: (proyecto) => {
        const idCurso = getCampoId(proyecto, ["curso", "cursoId"]);
        return getNombreCurso(idCurso);
      },
    },
  ];

  if (rol === "admin" || rol === "profesor") {
    columns.push({
      label: "Acciones",
      html: true,
      render: (proyecto) => {
        return `<button class="btn btn-danger btn-sm delete-proyecto" data-id="${escapeHtml(getItemId(proyecto))}">Eliminar</button>`;
      },
    });
  }

  renderTable("proyectosTable", "proyectosCount", proyectosVisibles, columns);
}

function renderNotas() {
  const columns = [
    {
      label: "Alumno",
      render: (nota) => {
        const idAlumno = getCampoId(nota, ["alumno", "alumnoId"]);
        return getNombreAlumno(idAlumno);
      },
    },
    {
      label: "Proyecto",
      render: (nota) => {
        const idProyecto = getCampoId(nota, ["proyecto", "proyectoId"]);
        return getNombreProyecto(idProyecto);
      },
    },
    {
      label: "Profesor",
      render: (nota) => {
        const idProfesor = getCampoId(nota, ["profesor", "profesorId"]);
        return getNombreProfesor(idProfesor);
      },
    },
    { label: "Nota", key: "calificacion" },
    { label: "Estado", key: "estado" },
    { label: "Observaciones", key: "observaciones" },
  ];

  if (rol === "profesor" || rol === "admin") {
    columns.push({
      label: "Evaluar",
      html: true,
      render: (nota) => {
        const estado = nota.estado || "apto";
        const calificacion = nota.calificacion ?? "";
        const observaciones = nota.observaciones || "";

        return `
          <div class="evaluation-form" data-note-id="${escapeHtml(getItemId(nota))}">
            <input class="evaluation-grade" type="number" min="0" max="10" step="0.1" value="${escapeHtml(calificacion)}" aria-label="Calificación">
            <select class="evaluation-state" aria-label="Estado de la nota">
              <option value="apto" ${estado === "apto" ? "selected" : ""}>apto</option>
              <option value="no apto" ${estado === "no apto" ? "selected" : ""}>no apto</option>
            </select>
            <textarea class="evaluation-comment" rows="2" placeholder="Comentario">${escapeHtml(observaciones)}</textarea>
            <button class="btn btn-primary evaluation-save" type="button">Guardar</button>
          </div>
        `;
      },
    });
  }

  if (rol === "admin") {
    columns.push({
      label: "Acciones",
      html: true,
      render: (nota) => {
        return `<button class="btn btn-danger btn-sm delete-nota" data-id="${escapeHtml(getItemId(nota))}">Eliminar</button>`;
      },
    });
  }

  renderTable("notasTable", "notasCount", notasVisibles, columns);
}

function renderTodo() {
  pintarMetricas();
  renderAlumnos();
  renderProfesores();
  renderCursos();
  renderProyectos();
  renderNotas();
}

/* ================================
   CREAR Y ELIMINAR REGISTROS
================================ */

function toggleFormulario(formId, show) {
  const form = document.getElementById(formId);
  if (form) {
    form.style.display = show ? "block" : "none";
    if (show) {
      form.querySelector("form").reset();
    }
  }
}

function llenarSelectsCursos(selectSelector) {
  document.querySelectorAll(selectSelector).forEach((select) => {
    select.innerHTML = '<option value="">Seleccionar curso</option>';
    const cursos = rol === "profesor" ? cursosVisibles : allCursos;
    cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = normalizarId(curso._id);
      option.textContent = curso.nombre;
      select.appendChild(option);
    });
  });
}

function llenarSelectsProfesores(selectSelector) {
  document.querySelectorAll(selectSelector).forEach((select) => {
    select.innerHTML = '<option value="">Seleccionar profesor</option>';
    allProfesores.forEach((profesor) => {
      const option = document.createElement("option");
      option.value = normalizarId(profesor._id);
      option.textContent = `${profesor.nombre} ${profesor.apellidos}`;
      select.appendChild(option);
    });
  });
}

function llenarSelectsAlumnos(selectSelector) {
  document.querySelectorAll(selectSelector).forEach((select) => {
    select.innerHTML = '<option value="">Seleccionar alumno</option>';
    allAlumnos.forEach((alumno) => {
      const option = document.createElement("option");
      option.value = normalizarId(alumno._id);
      option.textContent = `${alumno.nombre} ${alumno.apellidos}`;
      select.appendChild(option);
    });
  });
}

function llenarSelectsProyectos(selectSelector) {
  document.querySelectorAll(selectSelector).forEach((select) => {
    select.innerHTML = '<option value="">Seleccionar proyecto</option>';
    allProyectos.forEach((proyecto) => {
      const option = document.createElement("option");
      option.value = normalizarId(proyecto._id);
      option.textContent = proyecto.nombre;
      select.appendChild(option);
    });
  });
}

async function deleteResource(path) {
  const paths = [path, `${path}/delete`];

  if (!path.startsWith("/api/")) {
    paths.push(`/api${path}`, `/api${path}/delete`);
  }

  const errors = [];

  for (const candidatePath of paths) {
    const method = candidatePath.endsWith("/delete") ? "POST" : "DELETE";

    try {
      return await apiRequest(candidatePath, { method });
    } catch (error) {
      errors.push(`${method} ${candidatePath}: ${error.message}`);

      if (!error.message.startsWith("Ruta no encontrada")) {
        throw error;
      }
    }
  }

  throw new Error(`Ruta no encontrada. Rutas probadas: ${errors.join(" | ")}`);
}

// Alumnos
document.getElementById("btnCrearAlumno")?.addEventListener("click", () => {
  toggleFormulario("formCrearAlumno", true);
  llenarSelectsCursos("#formCrearAlumno .input-curso");
});

document.getElementById("btnCancelarAlumno")?.addEventListener("click", () => {
  toggleFormulario("formCrearAlumno", false);
});

document
  .getElementById("btnGuardarAlumno")
  ?.addEventListener("click", async (event) => {
    const form = document.querySelector("#formCrearAlumno form");
    const nombre = form.querySelector(".input-nombre").value;
    const apellidos = form.querySelector(".input-apellidos").value;
    const email = form.querySelector(".input-email").value;
    const password = form.querySelector(".input-password").value;
    const edad = form.querySelector(".input-edad").value;
    const campus = form.querySelector(".input-campus").value;
    const curso = form.querySelector(".input-curso").value;

    if (!nombre || !apellidos || !email || !password) {
      showGlobalMessage("Por favor completa los campos requeridos");
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "Guardando...";

    try {
      await apiRequest("/alumno", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          password,
          edad: edad ? parseInt(edad) : undefined,
          campus,
          curso: curso || undefined,
        }),
      });

      showGlobalMessage("Alumno creado correctamente", "success");
      toggleFormulario("formCrearAlumno", false);
      await cargarDatosBase();
      filtrarDatosPorRol();
      renderTodo();
    } catch (error) {
      showGlobalMessage(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Guardar";
    }
  });

// Profesores
document.getElementById("btnCrearProfesor")?.addEventListener("click", () => {
  toggleFormulario("formCrearProfesor", true);
});

document
  .getElementById("btnCancelarProfesor")
  ?.addEventListener("click", () => {
    toggleFormulario("formCrearProfesor", false);
  });

document
  .getElementById("btnGuardarProfesor")
  ?.addEventListener("click", async (event) => {
    const form = document.querySelector("#formCrearProfesor form");
    const nombre = form.querySelector(".input-nombre").value;
    const apellidos = form.querySelector(".input-apellidos").value;
    const email = form.querySelector(".input-email").value;
    const password = form.querySelector(".input-password").value;
    const especialidad = form.querySelector(".input-especialidad").value;
    const campus = form.querySelector(".input-campus").value;

    if (
      !nombre ||
      !apellidos ||
      !email ||
      !password ||
      !especialidad ||
      !campus
    ) {
      showGlobalMessage("Por favor completa los campos requeridos");
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "Guardando...";

    try {
      await apiRequest("/profesor", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          password,
          especialidad,
          campus,
        }),
      });

      showGlobalMessage("Profesor creado correctamente", "success");
      toggleFormulario("formCrearProfesor", false);
      await cargarDatosBase();
      filtrarDatosPorRol();
      renderTodo();
    } catch (error) {
      showGlobalMessage(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Guardar";
    }
  });

// Cursos
document.getElementById("btnCrearCurso")?.addEventListener("click", () => {
  toggleFormulario("formCrearCurso", true);
  llenarSelectsProfesores("#formCrearCurso .input-profesor");
});

document.getElementById("btnCancelarCurso")?.addEventListener("click", () => {
  toggleFormulario("formCrearCurso", false);
});

document
  .getElementById("btnGuardarCurso")
  ?.addEventListener("click", async (event) => {
    const form = document.querySelector("#formCrearCurso form");
    const nombre = form.querySelector(".input-nombre").value;
    const campus = form.querySelector(".input-campus").value;
    const fechaInicio = form.querySelector(".input-fechaInicio").value;
    const fechaFin = form.querySelector(".input-fechaFin").value;
    const profesor = form.querySelector(".input-profesor").value;
    const descripcion = form.querySelector(".input-descripcion").value;

    if (!nombre || !campus) {
      showGlobalMessage("Por favor completa los campos requeridos");
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "Guardando...";

    try {
      await apiRequest("/curso", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          campus,
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined,
          profesor: profesor || undefined,
          descripcion: descripcion || undefined,
        }),
      });

      showGlobalMessage("Curso creado correctamente", "success");
      toggleFormulario("formCrearCurso", false);
      await cargarDatosBase();
      filtrarDatosPorRol();
      renderTodo();
    } catch (error) {
      showGlobalMessage(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Guardar";
    }
  });

// Proyectos
document.getElementById("btnCrearProyecto")?.addEventListener("click", () => {
  toggleFormulario("formCrearProyecto", true);
  llenarSelectsCursos("#formCrearProyecto .input-curso");
});

document
  .getElementById("btnCancelarProyecto")
  ?.addEventListener("click", () => {
    toggleFormulario("formCrearProyecto", false);
  });

document
  .getElementById("btnGuardarProyecto")
  ?.addEventListener("click", async (event) => {
    const form = document.querySelector("#formCrearProyecto form");
    const nombre = form.querySelector(".input-nombre").value.trim();
    const descripcion = form.querySelector(".input-descripcion").value.trim();
    const fechaEntrega = form.querySelector(".input-fechaEntrega").value;
    const curso = form.querySelector(".input-curso").value;

    if (!nombre || !curso) {
      showGlobalMessage("Por favor completa los campos requeridos");
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "Guardando...";

    try {
      const nuevoProyecto = await apiRequest("/proyecto", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          descripcion: descripcion || undefined,
          fechaEntrega: fechaEntrega || undefined,
          curso,
        }),
      });

      showGlobalMessage("Proyecto creado correctamente", "success");
      toggleFormulario("formCrearProyecto", false);
      allProyectos = [...allProyectos, nuevoProyecto];
      filtrarDatosPorRol();
      renderTodo();
    } catch (error) {
      showGlobalMessage(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Guardar";
    }
  });

// Notas
document.getElementById("btnCrearNota")?.addEventListener("click", () => {
  toggleFormulario("formCrearNota", true);
  llenarSelectsAlumnos("#formCrearNota .input-alumno");
  llenarSelectsProyectos("#formCrearNota .input-proyecto");
  llenarSelectsProfesores("#formCrearNota .input-profesor");
});

document.getElementById("btnCancelarNota")?.addEventListener("click", () => {
  toggleFormulario("formCrearNota", false);
});

document
  .getElementById("btnGuardarNota")
  ?.addEventListener("click", async (event) => {
    const form = document.querySelector("#formCrearNota form");
    const alumno = form.querySelector(".input-alumno").value;
    const proyecto = form.querySelector(".input-proyecto").value;
    const profesor = form.querySelector(".input-profesor").value;
    const calificacion = form.querySelector(".input-calificacion").value;
    const estado = form.querySelector(".input-estado").value;
    const observaciones = form.querySelector(".input-observaciones").value;

    if (!alumno || !proyecto || calificacion === "" || !estado) {
      showGlobalMessage("Por favor completa los campos requeridos");
      return;
    }

    const button = event.target;
    button.disabled = true;
    button.textContent = "Guardando...";

    try {
      await apiRequest("/nota", {
        method: "POST",
        body: JSON.stringify({
          alumno,
          proyecto,
          profesor: profesor || undefined,
          calificacion: Number(calificacion),
          estado,
          observaciones: observaciones || undefined,
        }),
      });

      showGlobalMessage("Nota creada correctamente", "success");
      toggleFormulario("formCrearNota", false);
      await cargarDatosBase();
      filtrarDatosPorRol();
      renderTodo();
    } catch (error) {
      showGlobalMessage(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Guardar";
    }
  });

// Eliminar registros
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-alumno")) {
    const id = e.target.dataset.id;
    if (confirm("¿Estás seguro de que deseas eliminar este alumno?")) {
      try {
        await apiRequest(`/alumno/${id}`, { method: "DELETE" });
        showGlobalMessage("Alumno eliminado correctamente", "success");
        await cargarDatosBase();
        filtrarDatosPorRol();
        renderTodo();
      } catch (error) {
        showGlobalMessage(error.message);
      }
    }
  }

  if (e.target.classList.contains("delete-profesor")) {
    const id = e.target.dataset.id;
    if (confirm("¿Estás seguro de que deseas eliminar este profesor?")) {
      try {
        await apiRequest(`/profesor/${id}`, { method: "DELETE" });
        showGlobalMessage("Profesor eliminado correctamente", "success");
        await cargarDatosBase();
        filtrarDatosPorRol();
        renderTodo();
      } catch (error) {
        showGlobalMessage(error.message);
      }
    }
  }

  if (e.target.classList.contains("delete-curso")) {
    const id = e.target.dataset.id;
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      try {
        await apiRequest(`/curso/${id}`, { method: "DELETE" });
        showGlobalMessage("Curso eliminado correctamente", "success");
        await cargarDatosBase();
        filtrarDatosPorRol();
        renderTodo();
      } catch (error) {
        showGlobalMessage(error.message);
      }
    }
  }

  const deleteProyectoButton = e.target.closest(".delete-proyecto");

  if (deleteProyectoButton) {
    const id = deleteProyectoButton.dataset.id;
    if (!id) {
      showGlobalMessage("No se ha encontrado el ID de este proyecto.");
      return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        await deleteResource(`/proyecto/${id}`);
        showGlobalMessage("Proyecto eliminado correctamente", "success");
        await cargarDatosBase();
        filtrarDatosPorRol();
        renderTodo();
      } catch (error) {
        showGlobalMessage(error.message);
      }
    }
  }

  const deleteNotaButton = e.target.closest(".delete-nota");

  if (deleteNotaButton) {
    const id = deleteNotaButton.dataset.id;
    if (!id) {
      showGlobalMessage("No se ha encontrado el ID de esta nota.");
      return;
    }
    if (confirm("¿Estás seguro de que deseas eliminar esta nota?")) {
      try {
        await deleteResource(`/nota/${id}`);
        showGlobalMessage("Nota eliminada correctamente", "success");
        allNotas = allNotas.filter((nota) => !sameId(getItemId(nota), id));
        filtrarDatosPorRol();
        renderTodo();
        await cargarDatosBase();
        filtrarDatosPorRol();
        renderTodo();
      } catch (error) {
        showGlobalMessage(error.message);
      }
    }
  }
});

const notasTable = document.getElementById("notasTable");

if (notasTable) {
  notasTable.addEventListener("click", async (event) => {
    const button = event.target.closest(".evaluation-save");

    if (!button) return;

    const form = button.closest(".evaluation-form");
    const noteId = form?.dataset.noteId;

    if (!noteId) {
      showGlobalMessage("No se ha encontrado el ID de esta nota.");
      return;
    }

    const calificacion = form
      .querySelector(".evaluation-grade")
      .value.replace(",", ".");

    const estado = form.querySelector(".evaluation-state").value;

    const observaciones = form
      .querySelector(".evaluation-comment")
      .value.trim();

    if (calificacion === "") {
      showGlobalMessage("La calificación es obligatoria para guardar la nota.");
      return;
    }

    const calificacionNumerica = Number(calificacion);

    if (
      Number.isNaN(calificacionNumerica) ||
      calificacionNumerica < 0 ||
      calificacionNumerica > 10
    ) {
      showGlobalMessage("La calificación debe ser un número entre 0 y 10.");
      return;
    }

    button.disabled = true;
    button.textContent = "Guardando...";
    hideGlobalMessage();

    try {
      await apiRequest(`/nota/${noteId}/evaluacion`, {
        method: "PATCH",
        body: JSON.stringify({
          calificacion: calificacionNumerica,
          estado,
          observaciones,
        }),
      });

      allNotas = allNotas.map((nota) => {
        if (!sameId(getItemId(nota), noteId)) return nota;

        return {
          ...nota,
          calificacion: calificacionNumerica,
          estado,
          observaciones,
        };
      });

      filtrarDatosPorRol();
      renderTodo();

      showGlobalMessage("Evaluación guardada correctamente.", "success");
    } catch (error) {
      showGlobalMessage(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Guardar";
    }
  });
}

/* ================================
   INICIO
================================ */

async function initDashboard() {
  hideGlobalMessage();
  aplicarPermisosVisuales();

  try {
    await cargarDatosBase();
    filtrarDatosPorRol();
    renderTodo();
  } catch (error) {
    showGlobalMessage(error.message);
  }
}

initDashboard();
