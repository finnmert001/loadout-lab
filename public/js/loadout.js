document.addEventListener("DOMContentLoaded", function () {
  const openWeaponModal = document.getElementById("openWeaponModal");
  const closeWeaponModal = document.getElementById("closeWeaponModal");
  const weaponModal = document.getElementById("weaponModal");
  const weaponClassDropdown = document.getElementById("weaponClassDropdown");
  const weaponList = document.getElementById("weaponList");
  const confirmWeaponSelection = document.getElementById(
    "confirmWeaponSelection"
  );

  const selectedWeaponContainer = document.getElementById(
    "selectedWeaponContainer"
  );
  const weaponImage = document.getElementById("weaponImage");
  const weaponName = document.getElementById("weaponName");

  const removeWeaponButton = document.getElementById("removeWeaponButton");

  let selectedWeapon = null;

  // Sample weapon data
  const weapons = {
    "assault-rifle": [
      { name: "AK-74", image: "/images/weapons/ak74.png" },
      { name: "Ames 85", image: "/images/weapons/ames85.png" },
      { name: "XM4", image: "/images/weapons/xm4.png" },
      { name: "Cypher 091", image: "/images/weapons/cypher091.png" },
    ],
    smg: [
      { name: "C9", image: "/images/weapons/c9.png" },
      { name: "PP-19", image: "/images/weapons/pp19.png" },
      { name: "Jackal PDW", image: "/images/weapons/jackalpdw.png" },
      { name: "Kompakt 98", image: "/images/weapons/kompakt98.png" },
    ],
    // Add more weapon classes as needed
  };

  // Hide the modal when the page loads
  weaponModal.style.display = "none";

  // Open modal
  openWeaponModal.addEventListener("click", () => {
    weaponModal.style.display = "flex";
  });

  // Close modal
  closeWeaponModal.addEventListener("click", () => {
    weaponModal.style.display = "none";
  });

  // Populate weapon list based on selected class
  weaponClassDropdown.addEventListener("change", function () {
    const selectedClass = this.value;
    weaponList.innerHTML = ""; // Clear previous options

    if (selectedClass && weapons[selectedClass]) {
      weapons[selectedClass].forEach((weapon) => {
        const weaponItem = document.createElement("div");
        weaponItem.classList.add("weapon-item");
        weaponItem.innerHTML = `
                    <p>${weapon.name}</p>
                `;
        weaponItem.addEventListener("click", () => {
          selectedWeapon = weapon;
          document
            .querySelectorAll(".weapon-item")
            .forEach((item) => item.classList.remove("selected"));
          weaponItem.classList.add("selected");

          // Show selected weapon image and name
          weaponImage.src = weapon.image;
          weaponName.textContent = weapon.name;
          selectedWeaponContainer.style.display = "block";

          // Hide the plus button and show the remove button
          openWeaponModal.style.display = "none";
          removeWeaponButton.style.display = "block";
        });
        weaponList.appendChild(weaponItem);
      });
    }
  });

  // Confirm weapon selection
  confirmWeaponSelection.addEventListener("click", () => {
    if (selectedWeapon) {
      weaponImage.src = selectedWeapon.image;
      weaponName.textContent = selectedWeapon.name;
      selectedWeaponContainer.style.display = "block";
      weaponModal.style.display = "none";
    }
  });

  // Remove selected weapon
  removeWeaponButton.addEventListener("click", () => {
    selectedWeapon = null;
    weaponImage.src = "";
    weaponName.textContent = "";

    selectedWeaponContainer.style.display = "none";

    // Show the plus button again and hide the remove button
    openWeaponModal.style.display = "inline-block";
    removeWeaponButton.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (event) => {
    if (event.target === weaponModal) {
      weaponModal.style.display = "none";
    }
  });
});
