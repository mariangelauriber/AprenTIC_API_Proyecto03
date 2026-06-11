const API_BASE_URL = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("aprentic_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    // data.error -> errores normales del backend (ej: "Credenciales inválidas")
    // data.errors -> array que devuelve express-validator (ej: "Email no válido")
    let message = "Error en la peticion";
    if (data && data.error) {
      message = data.error;
    } else if (data && data.errors && data.errors.length > 0) {
      message = data.errors[0].msg;
    }
    throw new Error(message);
  }

  return data;
}
