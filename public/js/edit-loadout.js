document.addEventListener("DOMContentLoaded", async () => {
  const loadoutId = window.location.pathname.split("/").pop(); // Get ID from URL

  try {
    const response = await fetch(`/api/loadouts/${loadoutId}`);
    if (!response.ok) throw new Error("Failed to fetch loadout");
    const loadout = await response.json();

    document.getElementById("loadoutName").value = loadout.loadoutName;

    // Set primary weapon
    document.getElementById("primaryWeaponName").textContent =
      loadout.primaryWeapon.name;
    document.getElementById("primaryWeaponImage").src =
      loadout.primaryWeapon.image;

    // Set secondary weapon
    document.getElementById("secondaryWeaponName").textContent =
      loadout.secondaryWeapon.name;
    document.getElementById("secondaryWeaponImage").src =
      loadout.secondaryWeapon.image;

    // Set primary attachments
    document
      .querySelectorAll("#primaryAttachments select")
      .forEach((select, index) => {
        if (loadout.primaryAttachments[index])
          select.value = loadout.primaryAttachments[index];
      });

    // Set secondary attachments
    document
      .querySelectorAll("#secondaryAttachments select")
      .forEach((select, index) => {
        if (loadout.secondaryAttachments[index])
          select.value = loadout.secondaryAttachments[index];
      });
  } catch (error) {
    console.error("Error loading loadout:", error);
  }

  // Handle updating the loadout
  document
    .getElementById("editLoadoutForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const updatedLoadout = {
        loadoutName: document.getElementById("loadoutName").value,
        primaryWeapon: {
          name: document.getElementById("primaryWeaponName").textContent,
          image: document.getElementById("primaryWeaponImage").src,
        },
        primaryAttachments: Array.from(
          document.querySelectorAll("#primaryAttachments select")
        ).map((select) => select.value),
        secondaryWeapon: {
          name: document.getElementById("secondaryWeaponName").textContent,
          image: document.getElementById("secondaryWeaponImage").src,
        },
        secondaryAttachments: Array.from(
          document.querySelectorAll("#secondaryAttachments select")
        ).map((select) => select.value),
      };

      try {
        const response = await fetch(`/api/loadouts/${loadoutId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLoadout),
        });

        if (response.ok) {
          window.location.href = "/my-loadouts";
        } else {
          const errorData = await response.json();
          alert(`Error updating loadout: ${errorData.message}`);
        }
      } catch (error) {
        alert("An error occurred while updating.");
      }
    });
});
