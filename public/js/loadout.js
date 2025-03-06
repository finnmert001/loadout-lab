document.addEventListener("DOMContentLoaded", function () {
  // Primary and Secondary Weapon Elements
  const openPrimaryWeaponModal = document.getElementById(
    "openPrimaryWeaponModal"
  );
  const removePrimaryWeaponButton = document.getElementById(
    "removePrimaryWeaponButton"
  );
  const primaryWeaponContainer = document.getElementById(
    "primaryWeaponContainer"
  );
  const primaryWeaponImage = document.getElementById("primaryWeaponImage");
  const primaryWeaponName = document.getElementById("primaryWeaponName");

  const openSecondaryWeaponModal = document.getElementById(
    "openSecondaryWeaponModal"
  );
  const removeSecondaryWeaponButton = document.getElementById(
    "removeSecondaryWeaponButton"
  );
  const secondaryWeaponContainer = document.getElementById(
    "secondaryWeaponContainer"
  );
  const secondaryWeaponImage = document.getElementById("secondaryWeaponImage");
  const secondaryWeaponName = document.getElementById("secondaryWeaponName");

  // General Modal Elements
  const weaponModal = document.getElementById("weaponModal");
  const closeWeaponModal = document.getElementById("closeWeaponModal");
  const weaponClassDropdown = document.getElementById("weaponClassDropdown");
  const weaponList = document.getElementById("weaponList");
  const confirmWeaponSelection = document.getElementById(
    "confirmWeaponSelection"
  );

  let selectedWeapon = null;
  let selectingPrimary = true; // Track which weapon slot is being selected

  // Sample weapon data
  const weapons = {
    "assault-rifle": [
      { name: "XM4", image: "/images/weapons/AR/xm4DS.png" },
      { name: "AK-74", image: "/images/weapons/AR/ak74DS.png" },
      { name: "Ames 85", image: "/images/weapons/AR/ames85DS.png" },
      { name: "GPR 91", image: "/images/weapons/AR/gpr91DS.png" },
    ],
    smg: [
      { name: "C9", image: "/images/weapons/SMG/c9DS.png" },
      { name: "KSV", image: "/images/weapons/SMG/ksvDS.png" },
      { name: "Tanto .22", image: "/images/weapons/SMG/tanto22DS.png" },
      { name: "PP-919", image: "/images/weapons/SMG/pp919DS.png" },
    ],
    shotgun: [
      { name: "Marine SP", image: "/images/weapons/shotgun/marineSPDS.png" },
      { name: "ASG-89", image: "/images/weapons/shotgun/asg89DS.png" },
      { name: "Maelstrom", image: "/images/weapons/shotgun/maelstromDS.png" },
    ],
    lmg: [
      { name: "PU-21", image: "/images/weapons/LMG/pu21DS.png" },
      { name: "XMG", image: "/images/weapons/LMG/xmgDS.png" },
      { name: "GPMG-7", image: "/images/weapons/LMG/gpmg7DS.png" },
      { name: "Feng 82", image: "/images/weapons/LMG/feng82DS.png" },
    ],
    "marksman-rifle": [
      { name: "SWAT 5.56", image: "/images/weapons/MR/swat556DS.png" },
      { name: "Tsarkov 7.62", image: "/images/weapons/MR/tsarkov762DS.png" },
      { name: "AEK-973", image: "/images/weapons/MR/aek973DS.png" },
      { name: "DM-10", image: "/images/weapons/MR/dm10DS.png" },
    ],
    "sniper-rifle": [
      { name: "LW3A1 Frostline", image: "/images/weapons/SR/lw3a1DS.png" },
      { name: "SVD", image: "/images/weapons/SR/svdDS.png" },
      { name: "LR 7.62", image: "/images/weapons/SR/lr762DS.png" },
      { name: "AMR Mod 4", image: "/images/weapons/SR/amrMod4DS.png" },
    ],
    pistol: [
      { name: "9mm PM", image: "/images/weapons/pistol/9mmPMDS.png" },
      { name: "Grekhova", image: "/images/weapons/pistol/grekhovaDS.png" },
      { name: "GS45", image: "/images/weapons/pistol/gs45DS.png" },
      { name: "Stryder .22", image: "/images/weapons/pistol/stryder22DS.png" },
    ],
    special: [
      { name: "Sirin 9mm", image: "/images/weapons/special/sirin9mmDS.png" },
      { name: "D1.3 Sector", image: "/images/weapons/special/d13SectorDS.png" },
    ],
  };

  // Hide the modal when the page loads
  weaponModal.style.display = "none";

  openPrimaryWeaponModal.addEventListener("click", () => {
    selectingPrimary = true;
    weaponModal.style.display = "flex";
  });

  openSecondaryWeaponModal.addEventListener("click", () => {
    selectingPrimary = false;
    weaponModal.style.display = "flex";
  });

  closeWeaponModal.addEventListener("click", () => {
    weaponModal.style.display = "none";
  });

  weaponClassDropdown.addEventListener("change", function () {
    const selectedClass = this.value;
    weaponList.innerHTML = "";

    if (selectedClass && weapons[selectedClass]) {
      weapons[selectedClass].forEach((weapon) => {
        const weaponItem = document.createElement("div");
        weaponItem.classList.add("weapon-item");
        weaponItem.innerHTML = `<p>${weapon.name}</p>`;

        weaponItem.addEventListener("click", () => {
          selectedWeapon = weapon;
          document
            .querySelectorAll(".weapon-item")
            .forEach((item) => item.classList.remove("selected"));
          weaponItem.classList.add("selected");
        });

        weaponList.appendChild(weaponItem);
      });
    }
  });

  confirmWeaponSelection.addEventListener("click", () => {
    if (selectedWeapon) {
      if (selectingPrimary) {
        primaryWeaponImage.src = selectedWeapon.image;
        primaryWeaponName.textContent = selectedWeapon.name;
        primaryWeaponContainer.style.display = "block";
        openPrimaryWeaponModal.style.display = "none";
        removePrimaryWeaponButton.style.display = "block";
      } else {
        secondaryWeaponImage.src = selectedWeapon.image;
        secondaryWeaponName.textContent = selectedWeapon.name;
        secondaryWeaponContainer.style.display = "block";
        openSecondaryWeaponModal.style.display = "none";
        removeSecondaryWeaponButton.style.display = "block";
      }
      weaponModal.style.display = "none";
    }
  });

  removePrimaryWeaponButton.addEventListener("click", () => {
    primaryWeaponImage.src = "";
    primaryWeaponName.textContent = "";
    primaryWeaponContainer.style.display = "none";
    openPrimaryWeaponModal.style.display = "inline-block";
    removePrimaryWeaponButton.style.display = "none";
  });

  removeSecondaryWeaponButton.addEventListener("click", () => {
    secondaryWeaponImage.src = "";
    secondaryWeaponName.textContent = "";
    secondaryWeaponContainer.style.display = "none";
    openSecondaryWeaponModal.style.display = "inline-block";
    removeSecondaryWeaponButton.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === weaponModal) {
      weaponModal.style.display = "none";
    }
  });
});
