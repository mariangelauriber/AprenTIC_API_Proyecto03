const API_BASE_URL =
  window.location.port === "3000" ? window.location.origin : "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("aprentic_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con la API. Inicia el backend con npm.cmd start y comprueba http://localhost:3000/login.html.",
    );
  }

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const validationMessage =
      data && Array.isArray(data.errors) && data.errors[0]?.msg
        ? data.errors[0].msg
        : "";
    const message =
      (data && data.error) || validationMessage || "Error en la peticion";

    throw new Error(`${message} (${response.status}) en ${API_BASE_URL}${path}`);
  }

  return data;
}
