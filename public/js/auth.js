const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showLoginMessage(message, type = "error") {
  loginMessage.textContent = message;
  loginMessage.className = `message ${type}`;
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showLoginMessage("Iniciando sesion...", "info");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("aprentic_token", data.token);
      localStorage.setItem("aprentic_user", JSON.stringify(data.user));
      window.location.href = "/dashboard.html";
    } catch (error) {
      showLoginMessage(error.message);
    }
  });
}
