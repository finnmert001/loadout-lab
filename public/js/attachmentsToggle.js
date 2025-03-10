function toggleAttachments(event, button) {
  event.preventDefault();

  const attachmentGrid = button.parentElement.nextElementSibling;

  // Close any other open dropdowns first
  document.querySelectorAll(".loadout-attachment-grid.show").forEach((grid) => {
    if (grid !== attachmentGrid) {
      grid.classList.remove("show");
      grid.previousElementSibling.querySelector("button").textContent =
        "Attachments";
    }
  });

  // Toggle visibility
  if (attachmentGrid.classList.contains("show")) {
    attachmentGrid.classList.remove("show");
    button.textContent = "View Attachments";
  } else {
    attachmentGrid.classList.add("show");
    button.textContent = "Hide Attachments";
  }
}

// Close attachments when clicking outside
document.addEventListener("click", function (event) {
  document.querySelectorAll(".loadout-attachment-grid.show").forEach((grid) => {
    if (
      !grid.contains(event.target) &&
      !grid.previousElementSibling.contains(event.target)
    ) {
      grid.classList.remove("show");
      grid.previousElementSibling.querySelector("button").textContent =
        "View Attachments";
    }
  });
});
