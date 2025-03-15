document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`, // Ensure getAuthToken() exists
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data.");
    }

    const user = await response.json();

    // ✅ Update the UI with user data
    document.getElementById("username").textContent = user.username || "N/A";
    document.getElementById("firstName").textContent =
      user.firstName || "Your account doesn't have a first name yet.";
    document.getElementById("lastName").textContent =
      user.lastName || "Your account doesn't have a last name yet.";
    document.getElementById("email").textContent =
      user.email || "Your account doesn't have an email yet.";
  } catch (error) {
    console.error("Error loading profile:", error);
  }
});
