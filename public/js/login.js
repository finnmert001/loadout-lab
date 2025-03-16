document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const loginError = document.getElementById("login-error");

      loginError.style.display = "none";

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!data.success) {
          loginError.textContent =
            data.error || "Invalid credentials. Please try again.";
          loginError.style.display = "block";
          return;
        }

        if (data.token) {
          document.cookie = `token=${data.token}; path=/; Secure; SameSite=Strict`;
        }

        window.location.href = "/index";
      } catch (error) {
        console.error("Login error:", error);
        loginError.textContent = "An error occurred during login.";
        loginError.style.display = "block";
      }
    });

    // Caps Lock warning
    document
      .getElementById("password")
      .addEventListener("keyup", function (event) {
        document.getElementById("capsLockWarning").style.display =
          event.getModifierState("CapsLock") ? "block" : "none";
      });
  }
});
