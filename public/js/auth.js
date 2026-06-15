const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showLoginMessage(message, type = "error") {
  if (!loginMessage) return;

  loginMessage.textContent = message;
  loginMessage.className = `message ${type}`;
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    showLoginMessage("Iniciando sesión...", "info");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const token = data.token;
      const tokenPayload = decodeJwtPayload(token);

      const user = data.user || {
        email,
        rol: tokenPayload?.role || tokenPayload?.rol || "user",
        _id: tokenPayload?.sub || tokenPayload?._id || null,
      };

      localStorage.setItem("aprentic_token", token);
      localStorage.setItem("aprentic_user", JSON.stringify(user));

      window.location.href = "./dashboard.html";
    } catch (error) {
      showLoginMessage(error.message, "error");
    }
  });
}
