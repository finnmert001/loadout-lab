document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("update-password-form");

  const csrfToken = document.querySelector("input[name='_csrf']").value;

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const passwordError = document.getElementById("password-error");

      passwordError.style.display = "none";
      passwordError.textContent = "";

      // Frontend validation
      if (newPassword !== confirmPassword) {
        passwordError.textContent = "Passwords do not match.";
        passwordError.style.display = "block";
        return;
      }

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          passwordError.textContent =
            data.error || "Failed to update password.";
          passwordError.style.display = "block";
          return;
        }

        alert("Password updated successfully! Please log in again.");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
      } catch (error) {
        console.error("Error updating password:", error);
        passwordError.textContent = "An error occurred.";
        passwordError.style.display = "block";
      }
    });

    // Caps Lock warning
    ["currentPassword", "newPassword", "confirmPassword"].forEach((id) => {
      document.getElementById(id).addEventListener("keyup", function (event) {
        document.getElementById("capsLockWarning").style.display =
          event.getModifierState("CapsLock") ? "block" : "none";
      });
    });
  }
});
