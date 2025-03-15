document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("update-password-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const passwordError = document.getElementById("password-error");

      // Reset error display
      passwordError.style.display = "none";
      passwordError.textContent = "";

      if (newPassword !== confirmPassword) {
        passwordError.textContent = "Passwords do not match.";
        passwordError.style.display = "block";
        return;
      }

      // Retrieve JWT token from cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Send API request
        const response = await fetch("/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

        // Notify success and redirect
        alert("Password updated successfully! Please log in again.");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login"; // Redirect to login after logout
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
