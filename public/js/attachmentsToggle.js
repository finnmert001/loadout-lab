function toggleAttachments(event, button) {
  event.preventDefault(); // Prevent page refresh

  const attachmentGrid = button.parentElement.nextElementSibling; // Find the correct dropdown

  // Close any other open dropdowns first
  document.querySelectorAll(".loadout-attachment-grid.show").forEach((grid) => {
    if (grid !== attachmentGrid) {
      grid.classList.remove("show");
      grid.previousElementSibling.querySelector("button").textContent =
        "Attachments"; // Reset button text
    }
  });

  // Toggle visibility
  if (attachmentGrid.classList.contains("show")) {
    attachmentGrid.classList.remove("show"); // Hide attachments
    button.textContent = "View Attachments";
  } else {
    attachmentGrid.classList.add("show"); // Show attachments
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
      grid.classList.remove("show"); // Hide dropdown
      grid.previousElementSibling.querySelector("button").textContent =
        "View Attachments"; // Reset button text
    }
  });
});
