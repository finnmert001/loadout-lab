document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      const usernameError = document.getElementById("username-error");
      const passwordError = document.getElementById("password-error");
      const confirmPasswordError = document.getElementById(
        "confirm-password-error"
      );

      usernameError.style.display = "none";
      passwordError.style.display = "none";
      confirmPasswordError.style.display = "none";

      // Frontend validation
      if (!username || username.length < 4 || username.length > 20) {
        usernameError.textContent = "Username must be 4-20 characters long.";
        usernameError.style.display = "block";
        return;
      }

      if (password.length < 8) {
        passwordError.textContent =
          "Password must be at least 8 characters long.";
        passwordError.style.display = "block";
        return;
      }

      if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        confirmPasswordError.style.display = "block";
        return;
      }

      try {
        const response = await fetch("/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, confirmPassword }),
        });

        const data = await response.json();

        if (!data.success) {
          usernameError.textContent = data.error || "Sign-up failed.";
          usernameError.style.display = "block";
          return;
        }

        window.location.href = "/login";
      } catch (error) {
        console.error("Signup error:", error);
        usernameError.textContent = "An error occurred during registration.";
        usernameError.style.display = "block";
      }
    });

    // Caps Lock warning
    document
      .getElementById("password")
      .addEventListener("keyup", function (event) {
        document.getElementById("capsLockWarning").style.display =
          event.getModifierState("CapsLock") ? "block" : "none";
      });

    document
      .getElementById("confirmPassword")
      .addEventListener("keyup", function (event) {
        document.getElementById("capsLockWarning").style.display =
          event.getModifierState("CapsLock") ? "block" : "none";
      });
  }
});
