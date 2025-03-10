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
      loadoutsContainer.innerHTML = `<p>No loadouts found. Create one using the button below!</p>`;
      return;
    }

    loadoutsContainer.innerHTML = ""; // Clear placeholder text

    loadouts.forEach((loadout) => {
      // Ensure `primaryWeapon` exists and has `name` and `image`
      const primaryWeapon = loadout.primaryWeapon?.name || "Unknown Primary";
      const primaryWeaponImage = loadout.primaryWeapon?.image;

      // Ensure `secondaryWeapon` exists and has `name` and `image`
      const secondaryWeapon =
        loadout.secondaryWeapon?.name || "Unknown Secondary";
      const secondaryWeaponImage = loadout.secondaryWeapon?.image;

      const loadoutElement = document.createElement("div");
      loadoutElement.classList.add("loadout-item");

      loadoutElement.innerHTML = `
        <div class="loadout">
          <h2 class="loadout-title">${loadout.loadoutName}</h2>
        
          <div>
            <img src="${primaryWeaponImage}" alt="${primaryWeapon}" class="weapon-image">
            <p class="weapon-class">${primaryWeapon}</p>
          </div>

          <div>
            <img src="${secondaryWeaponImage}" alt="${secondaryWeapon}" class="weapon-image">
            <p class="weapon-class">${secondaryWeapon}</p>
          </div>

          <div>
            <button class="view-loadout" data-id="${loadout._id}">View Loadout</button>
            <button class="delete-loadout" data-id="${loadout._id}">Delete</button>
          </div>
        </div>
      `;

      loadoutsContainer.appendChild(loadoutElement);
    });

    // Attach event listeners to buttons
    document.querySelectorAll(".view-loadout").forEach((button) => {
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
