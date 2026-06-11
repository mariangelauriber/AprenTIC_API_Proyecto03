const token = localStorage.getItem("aprentic_token");

if (!token) {
  window.location.href = "/login.html";
}

const logoutBtn = document.getElementById("logoutBtn");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");

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
    window.location.href = "/login.html";
  });
}

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

setMetric("metricAlumnos", "/alumno");
setMetric("metricProfesores", "/profesor");
setMetric("metricPromociones", "/curso");
setMetric("metricProyectos", "/proyecto");

const listadoAlumnos = document.getElementById ("alumnosTable")

const listadoProfesores = document.getElementById ("profesoresTable")

async function getAlllistadoAlumnos() {
  try {
    const data = await apiRequest("/alumno", {
      method: "GET",
    });

    // 1. Empezamos la tabla con su cabecera (los campos más importantes)
    let tabla = `
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Edad</th>
            <th>Campus</th>
          </tr>
        </thead>
        <tbody>`;

    // 2. Por cada alumno añadimos una fila con sus datos
    data.forEach(element => {
      tabla += `
          <tr>
            <td>${element.nombre}</td>
            <td>${element.apellidos}</td>
            <td>${element.email}</td>
            <td>${element.edad}</td>
            <td>${element.campus}</td>
          </tr>`;
    });

    // 3. Cerramos la tabla y la pintamos toda de una vez
    tabla += `
        </tbody>
      </table>`;

    listadoAlumnos.innerHTML = tabla;

  } catch (error) {
    showLoginMessage(error.message);
  }
}



async function getAlllistadoProfesores() {
  try {
    const data = await apiRequest("/profesor", {
      method: "GET",
    });

    // 1. Empezamos la tabla con su cabecera (los campos más importantes)
    let tabla = `
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Especialidad</th>
          </tr>
        </thead>
        <tbody>`;

    // 2. Por cada alumno añadimos una fila con sus datos
    data.forEach(element => {
      tabla += `
          <tr>
            <td>${element.nombre}</td>
            <td>${element.apellidos}</td>
            <td>${element.email}</td>
            <td>${element.especialidad}</td>
          </tr>`;
    });

    // 3. Cerramos la tabla y la pintamos toda de una vez
    tabla += `
        </tbody>
      </table>`;

    listadoProfesores.innerHTML = tabla;

  } catch (error) {
    showLoginMessage(error.message);
  }
}

getAlllistadoAlumnos()
getAlllistadoProfesores();


