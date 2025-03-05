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
      { name: "XM4", image: "/images/weapons/AR/xm4.png" },
      { name: "AK-74", image: "/images/weapons/AR/ak74.png" },
      { name: "Ames 85", image: "/images/weapons/AR/ames85.png" },
      { name: "GPR 91", image: "/images/weapons/AR/gpr91.png" },
    ],
    smg: [
      { name: "C9", image: "/images/weapons/SMG/c9.png" },
      { name: "KSV", image: "/images/weapons/SMG/ksv.png" },
      { name: "Tanto .22", image: "/images/weapons/SMG/tanto22DS.png" },
      { name: "PP-919", image: "/images/weapons/SMG/pp919.png" },
    ],
    shotgun: [
      { name: "Marine SP", image: "/images/weapons/shotgun/marineSP.png" },
      { name: "ASG-89", image: "/images/weapons/shotgun/asg89.png" },
      { name: "Maelstrom", image: "/images/weapons/shotgun/maelstrom.png" },
    ],
    lmg: [
      { name: "PU-21", image: "/images/weapons/LMG/pu21.png" },
      { name: "XMG", image: "/images/weapons/LMG/xmg.png" },
      { name: "GPMG-7", image: "/images/weapons/LMG/gpmg7.png" },
      { name: "Feng 82", image: "/images/weapons/LMG/feng82.png" },
    ],
    "marksman-rifle": [
      { name: "SWAT 5.56", image: "/images/weapons/MR/swat556.png" },
      { name: "Tsarkov 7.62", image: "/images/weapons/MR/tsarkov762.png" },
      { name: "AEK-973", image: "/images/weapons/MR/aek973.png" },
      { name: "DM-10", image: "/images/weapons/MR/dm10.png" },
    ],
    "sniper-rifle": [
      { name: "LW3A1 Frostline", image: "/images/weapons/SR/lw3a1.png" },
      { name: "SVD", image: "/images/weapons/SR/svd.png" },
      { name: "LR 7.62", image: "/images/weapons/SR/lr762.png" },
      { name: "AMR Mod 4", image: "/images/weapons/SR/amrMod4.png" },
    ],
    pistol: [
      { name: "9mm PM", image: "/images/weapons/pistol/9mmPM.png" },
      { name: "Grekhova", image: "/images/weapons/pistol/grekhova.png" },
      { name: "GS45", image: "/images/weapons/pistol/gs45.png" },
      { name: "Stryder .22", image: "/images/weapons/pistol/stryder22.png" },
    ],
    special: [
      { name: "Sirin 9mm", image: "/images/weapons/special/sirin9mm.png" },
      { name: "D1.3 Sector", image: "/images/weapons/special/d13Sector.png" },
    ],
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
