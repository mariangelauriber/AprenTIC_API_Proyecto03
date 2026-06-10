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
