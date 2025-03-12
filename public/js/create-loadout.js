document.addEventListener("DOMContentLoaded", function () {
  const openPrimaryWeaponModal = document.getElementById(
    "openPrimaryWeaponModal"
  );
  const removePrimaryWeaponButton = document.getElementById(
    "removePrimaryWeaponButton"
  );
  const resetPrimaryAttachmentsButton = document.getElementById(
    "resetPrimaryAttachmentsButton"
  );
  const primaryWeaponContainer = document.getElementById(
    "primaryWeaponContainer"
  );
  const primaryWeaponImage = document.getElementById("primaryWeaponImage");
  const primaryWeaponName = document.getElementById("primaryWeaponName");
  const primaryAttachments = document.getElementById("primaryAttachments");

  const openSecondaryWeaponModal = document.getElementById(
    "openSecondaryWeaponModal"
  );
  const removeSecondaryWeaponButton = document.getElementById(
    "removeSecondaryWeaponButton"
  );
  const resetSecondaryAttachmentsButton = document.getElementById(
    "resetSecondaryAttachmentsButton"
  );
  const secondaryWeaponContainer = document.getElementById(
    "secondaryWeaponContainer"
  );
  const secondaryWeaponImage = document.getElementById("secondaryWeaponImage");
  const secondaryWeaponName = document.getElementById("secondaryWeaponName");
  const secondaryAttachments = document.getElementById("secondaryAttachments");

  const saveLoadoutButton = document.getElementById("saveLoadoutButton");
  const weaponModal = document.getElementById("weaponModal");
  const closeWeaponModal = document.getElementById("closeWeaponModal");
  const weaponClassDropdown = document.getElementById("weaponClassDropdown");
  const weaponList = document.getElementById("weaponList");
  const confirmWeaponSelection = document.getElementById(
    "confirmWeaponSelection"
  );

  let selectedWeapon = null;
  let selectingPrimary = true;
  let selectedPrimaryClass = "";
  let selectedSecondaryClass = "";

  const restrictedWeaponTypes = [
    "assault-rifle",
    "smg",
    "shotgun",
    "lmg",
    "marksman-rifle",
    "sniper-rifle",
  ];
  const secondaryOnlyTypes = ["pistol", "special"];

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

  weaponModal.style.display = "none";

  openPrimaryWeaponModal.addEventListener("click", () => {
    selectingPrimary = true;
    weaponModal.style.display = "flex";
    populateWeaponDropdown(false);
  });

  openSecondaryWeaponModal.addEventListener("click", () => {
    selectingPrimary = false;
    weaponModal.style.display = "flex";
    populateWeaponDropdown(true);
  });

  closeWeaponModal.addEventListener("click", () => {
    weaponModal.style.display = "none";
  });

  function populateWeaponDropdown(allowSecondaryOnly) {
    weaponClassDropdown.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a weapon class";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    weaponClassDropdown.appendChild(defaultOption);

    for (const weaponClass in weapons) {
      if (!allowSecondaryOnly && secondaryOnlyTypes.includes(weaponClass))
        continue;
      const option = document.createElement("option");
      option.value = weaponClass;
      option.textContent = weaponClass.replace(/-/g, " ").toUpperCase();
      weaponClassDropdown.appendChild(option);
    }
  }

  weaponClassDropdown.addEventListener("change", function () {
    const selectedClass = this.value;
    weaponList.innerHTML = "";
    const otherSelectedWeapon = selectingPrimary
      ? secondaryWeaponName.textContent
      : primaryWeaponName.textContent;

    if (selectedClass && weapons[selectedClass]) {
      weapons[selectedClass].forEach((weapon) => {
        const weaponItem = document.createElement("div");
        weaponItem.classList.add("weapon-item");
        weaponItem.innerHTML = `<p>${weapon.name}</p>`;

        if (weapon.name === otherSelectedWeapon) {
          weaponItem.classList.add("disabled");
          weaponItem.style.opacity = "0.5";
          weaponItem.style.pointerEvents = "none";
        } else {
          weaponItem.addEventListener("click", () => {
            selectedWeapon = weapon;
            document
              .querySelectorAll(".weapon-item")
              .forEach((item) => item.classList.remove("selected"));
            weaponItem.classList.add("selected");
          });
        }

        weaponList.appendChild(weaponItem);
      });
    }
  });

  confirmWeaponSelection.addEventListener("click", () => {
    if (!selectedWeapon) {
      alert("Please select a weapon before confirming.");
      return;
    }

    const selectedClass = weaponClassDropdown.value;

    if (selectingPrimary) {
      if (selectedWeapon.name === secondaryWeaponName.textContent) {
        alert("This weapon is already selected as secondary!");
        return;
      }

      primaryWeaponImage.src = selectedWeapon.image;
      primaryWeaponImage.setAttribute("data-image", selectedWeapon.image);
      primaryWeaponName.textContent = selectedWeapon.name;
      primaryWeaponContainer.style.display = "block";
      openPrimaryWeaponModal.style.display = "none";
      removePrimaryWeaponButton.style.display = "block";
      resetPrimaryAttachmentsButton.style.display = "block";
      selectedPrimaryClass = selectedClass;
      resetAttachments("primary");
    } else {
      if (selectedWeapon.name === primaryWeaponName.textContent) {
        alert("This weapon is already selected as primary!");
        return;
      }

      secondaryWeaponImage.src = selectedWeapon.image;
      secondaryWeaponImage.setAttribute("data-image", selectedWeapon.image);
      secondaryWeaponName.textContent = selectedWeapon.name;
      secondaryWeaponContainer.style.display = "block";
      openSecondaryWeaponModal.style.display = "none";
      removeSecondaryWeaponButton.style.display = "block";
      resetSecondaryAttachmentsButton.style.display = "block";
      selectedSecondaryClass = selectedClass;
      resetAttachments("secondary");
      secondaryAttachments.style.display = "grid";
    }

    checkAttachmentLimit();
    weaponModal.style.display = "none";
  });

  function getAttachments(containerId) {
    return Array.from(
      document.querySelectorAll(`#${containerId} select.attachment`)
    )
      .filter((select) => select.value !== "")
      .map((select) => select.value);
  }

  saveLoadoutButton.addEventListener("click", async () => {
    const loadoutName = document.getElementById("loadoutName").value.trim();
    const primaryWeapon = primaryWeaponName.textContent.trim();
    const secondaryWeapon = secondaryWeaponName.textContent.trim();
    const primaryWeaponImageSrc =
      primaryWeaponImage.getAttribute("data-image") || "";
    const secondaryWeaponImageSrc =
      secondaryWeaponImage.getAttribute("data-image") || "";
    const primaryAttachments = getAttachments("primaryAttachments");
    const secondaryAttachments = getAttachments("secondaryAttachments");

    if (!loadoutName) {
      alert("Please enter a loadout name.");
      return;
    }

    if (!primaryWeapon) {
      alert("Please select a primary weapon.");
      return;
    }

    if (!secondaryWeapon) {
      alert("Please select a secondary weapon.");
      return;
    }

    const loadoutData = {
      loadoutName: loadoutName,
      primaryWeapon: {
        name: primaryWeapon,
        image: primaryWeaponImageSrc,
      },
      primaryAttachments: primaryAttachments,
      secondaryWeapon: {
        name: secondaryWeapon,
        image: secondaryWeaponImageSrc,
      },
      secondaryAttachments: secondaryAttachments,
    };

    try {
      const response = await fetch("/api/loadouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loadoutData),
      });

      if (response.ok) {
        window.location.href = "/my-loadouts";
      } else {
        const errorResponse = await response.json();
        alert(`Error: ${errorResponse.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("An error occurred while saving.");
    }
  });

  function checkAttachmentLimit() {
    const isPrimaryRestricted =
      restrictedWeaponTypes.includes(selectedPrimaryClass);
    const isSecondaryLimited = secondaryOnlyTypes.includes(
      selectedSecondaryClass
    );

    if (selectedSecondaryClass) {
      secondaryAttachments.style.display = "grid";
    }

    enforceAttachmentLimit("secondary", 5);
    enforceAttachmentLimit("primary", 5);

    if (isPrimaryRestricted && isSecondaryLimited) {
      resetAttachments("primary");
      enforceAttachmentLimit("primary", 8);
    } else {
      resetAttachments("primary");
    }

    enableAttachments();
  }

  function enforceAttachmentLimit(type, limit) {
    const container = document.getElementById(`${type}Attachments`);
    const attachmentDropdowns = container.querySelectorAll("select.attachment");

    attachmentDropdowns.forEach((dropdown) => {
      dropdown.addEventListener("change", function () {
        const selectedCount = Array.from(attachmentDropdowns).filter(
          (select) => select.value !== ""
        ).length;

        if (selectedCount >= limit) {
          attachmentDropdowns.forEach((select) => {
            if (select.value === "") select.disabled = true;
          });
        } else {
          attachmentDropdowns.forEach((select) => (select.disabled = false));
        }
      });
    });
  }

  function resetAttachments(type) {
    const container = document.getElementById(`${type}Attachments`);
    const attachmentDropdowns = container.querySelectorAll("select.attachment");
    attachmentDropdowns.forEach((dropdown) => {
      dropdown.value = "";
      dropdown.disabled = false;
    });
    if (type === "primary") {
      primaryAttachments.style.display = "grid";
    } else {
      secondaryAttachments.style.display = "grid";
    }
  }

  function enableAttachments() {
    if (selectedPrimaryClass) {
      primaryAttachments.style.display = "grid";
    }
    if (selectedSecondaryClass) {
      secondaryAttachments.style.display = "grid";
    }
  }

  removePrimaryWeaponButton.addEventListener("click", () => {
    primaryWeaponImage.src = "";
    primaryWeaponName.textContent = "";
    primaryWeaponContainer.style.display = "none";
    openPrimaryWeaponModal.style.display = "inline-block";
    removePrimaryWeaponButton.style.display = "none";
    resetPrimaryAttachmentsButton.style.display = "none";
    primaryAttachments.style.display = "none";
  });

  removeSecondaryWeaponButton.addEventListener("click", () => {
    secondaryWeaponImage.src = "";
    secondaryWeaponName.textContent = "";
    secondaryWeaponContainer.style.display = "none";
    openSecondaryWeaponModal.style.display = "inline-block";
    removeSecondaryWeaponButton.style.display = "none";
    resetSecondaryAttachmentsButton.style.display = "none";
    secondaryAttachments.style.display = "none";
  });

  resetPrimaryAttachmentsButton.addEventListener("click", () => {
    resetAttachments("primary");
  });

  resetSecondaryAttachmentsButton.addEventListener("click", () => {
    resetAttachments("secondary");
    secondaryAttachments.style.display = "block";
  });

  window.addEventListener("click", (event) => {
    if (event.target === weaponModal) {
      weaponModal.style.display = "none";
    }
  });
});
