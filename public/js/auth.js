// Function to retrieve JWT token from cookies
function getAuthToken() {
  const tokenMatch = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

// Function to update the navbar based on authentication status
function updateNavbar() {
  const token = getAuthToken();

  if (token) {
    document.getElementById("navBar").style.display = "block";
  }
}

// Run updateNavbar on page load
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const username = formData.get("username");
      const password = formData.get("password");

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!data.success) {
          updateNavbar(); // Update navbar when logged in
          window.location.href = "/index"; // Redirect user to index page
        } else {
          alert("Login failed: " + data.error);
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login.");
      }
    });
  }
});
