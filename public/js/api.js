const API_BASE_URL = "";

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
    const message = data && data.error ? data.error : "Error en la peticion";
    throw new Error(message);
  }

  return data;
}
