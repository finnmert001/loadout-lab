document.addEventListener("DOMContentLoaded", async () => {
  const loadoutsContainer = document.getElementById("loadoutsContainer");

  const csrfTokenElement = document.querySelector("input[name='_csrf']");
  const csrfToken = csrfTokenElement ? csrfTokenElement.value : null;

  if (!csrfToken) {
    console.error(
      "🚨 CSRF token not found. Ensure it is being passed from the server."
    );
    return;
  }

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    loadoutsContainer.innerHTML = `<p>You must be logged in to view your loadouts.</p>`;
    return;
  }

  try {
    const response = await fetch("/api/my-loadouts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const loadouts = await response.json();

    if (!response.ok) {
      throw new Error(loadouts.error || "Failed to load loadouts.");
    }

    if (!loadouts || loadouts.length === 0) {
      loadoutsContainer.innerHTML = `<p>No loadouts found. Create one using the button below!</p>`;
      return;
    }

    loadoutsContainer.innerHTML = "";

    loadouts.forEach((loadout) => {
      const primaryWeapon = loadout.primaryWeapon?.name || "Unknown Primary";
      const primaryWeaponImage =
        loadout.primaryWeapon?.image || "/images/default-primary.png";

      const secondaryWeapon =
        loadout.secondaryWeapon?.name || "Unknown Secondary";
      const secondaryWeaponImage =
        loadout.secondaryWeapon?.image || "/images/default-secondary.png";

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

    // View Loadout button
    document.querySelectorAll(".view-loadout").forEach((button) => {
      button.addEventListener("click", (event) => {
        const loadoutId = event.target.dataset.id;
        window.location.href = `/loadout/${loadoutId}`;
      });
    });

    // Delete Loadout button
    document.querySelectorAll(".delete-loadout").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const loadoutId = event.target.dataset.id;
        if (confirm("Are you sure you want to delete this loadout?")) {
          try {
            const deleteResponse = await fetch(`/api/loadouts/${loadoutId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
              },
            });

            const deleteData = await deleteResponse.json();

            if (!deleteResponse.ok) {
              throw new Error(deleteData.error || "Failed to delete loadout.");
            }

            window.location.reload();
          } catch (error) {
            alert("Error deleting loadout: " + error.message);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error fetching loadouts:", error);
    loadoutsContainer.innerHTML =
      "<p>Error loading loadouts. Please try again later.</p>";
  }
});
