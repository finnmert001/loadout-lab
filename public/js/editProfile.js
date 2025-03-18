document.addEventListener("DOMContentLoaded", async () => {
  const token = getAuthToken();

  const csrfToken = document.querySelector("input[name='_csrf']").value;

  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data.");
    }

    const user = await response.json();

    document.getElementById("username").value = user.username || "";
    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";
  } catch (error) {
    console.error("Error loading profile:", error);
  }

  // Handle profile update form submission
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const updatedData = {
        username: document.getElementById("username").value.trim(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
      };

      try {
        const response = await fetch("/api/edit-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify(updatedData),
        });

        const data = await response.json();

        if (!data.success) {
          document.getElementById("username-error").textContent =
            data.error || "Error updating profile.";
          document.getElementById("username-error").style.display = "block";
          return;
        }

        window.location.href = "/profile";
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    });

  // Handle account deletion
  document
    .getElementById("deleteAccountBtn")
    .addEventListener("click", function () {
      document.getElementById("confirmationModal").style.display = "flex";
    });

  window.confirmDeleteAccount = async function () {
    try {
      const response = await fetch("/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("Your account has been deleted.");
        window.location.href = "/login";
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }

    cancelDeleteAccount();
  };

  window.cancelDeleteAccount = function () {
    document.getElementById("confirmationModal").style.display = "none";
  };
});

function getAuthToken() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token;
}
