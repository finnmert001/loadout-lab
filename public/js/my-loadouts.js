document.addEventListener("DOMContentLoaded", async () => {
  const loadoutsContainer = document.getElementById("loadoutsContainer");

  try {
    const response = await fetch("/api/my-loadouts"); // Fetch user loadouts
    const loadouts = await response.json();

    if (!response.ok) {
      throw new Error(loadouts.error || "Failed to load loadouts.");
    }

    console.log("🔍 Loadouts API Response:", loadouts);

    if (loadouts.length === 0) {
      loadoutsContainer.innerHTML = "<p>No loadouts found. Create one now!</p>";
      return;
    }

    loadoutsContainer.innerHTML = ""; // Clear placeholder text

    loadouts.forEach((loadout) => {
      // Ensure `primaryWeapon` exists and has `name` and `image`
      const primaryWeapon = loadout.primaryWeapon?.name || "Unknown Primary";
      const primaryWeaponImage =
        loadout.primaryWeapon?.image || "/images/default.png"; // ✅ Safe fallback

      // Ensure `secondaryWeapon` exists and has `name` and `image`
      const secondaryWeapon =
        loadout.secondaryWeapon?.name || "Unknown Secondary";
      const secondaryWeaponImage =
        loadout.secondaryWeapon?.image || "/images/default.png"; // ✅ Safe fallback

      const loadoutElement = document.createElement("div");
      loadoutElement.classList.add("loadout-item");

      loadoutElement.innerHTML = `
              <div class="loadout">
                <h2>${loadout.loadoutName}</h2>
                <div class="loadout-details">
                  <img src="${primaryWeaponImage}" alt="${primaryWeapon}" class="weapon-image">
                  <img src="${secondaryWeaponImage}" alt="${secondaryWeapon}" class="weapon-image">
                </div>
                <p><strong>Primary:</strong> ${primaryWeapon}</p>
                <p><strong>Secondary:</strong> ${secondaryWeapon}</p>
                <button class="view-attachments" data-id="${loadout._id}">View Attachments</button>
                <button class="delete-loadout" data-id="${loadout._id}">Delete</button>
              </div>
            `;

      loadoutsContainer.appendChild(loadoutElement);
    });

    // Attach event listeners to buttons
    document.querySelectorAll(".view-attachments").forEach((button) => {
      button.addEventListener("click", (event) => {
        const loadoutId = event.target.dataset.id;
        window.location.href = `/loadout/${loadoutId}`; // Navigate to detailed view
      });
    });

    document.querySelectorAll(".delete-loadout").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const loadoutId = event.target.dataset.id;
        if (confirm("Are you sure you want to delete this loadout?")) {
          await fetch(`/api/loadouts/${loadoutId}`, { method: "DELETE" });
          window.location.reload(); // Refresh the page after deletion
        }
      });
    });
  } catch (error) {
    console.error("Error fetching loadouts:", error);
    loadoutsContainer.innerHTML = "<p>Error loading loadouts.</p>";
  }
});
