document.addEventListener("DOMContentLoaded", function () {
  const cookieModal = document.getElementById("cookieModal");
  const acceptButton = document.getElementById("acceptCookies");
  const declineButton = document.getElementById("declineCookies");

  // Check if the user has already accepted/declined cookies
  if (!localStorage.getItem("cookiesAccepted")) {
    cookieModal.classList.add("show");
  }

  // User accepts cookies
  acceptButton.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    cookieModal.classList.remove("show");
    setTimeout(() => (cookieModal.style.display = "none"), 500);
  });

  // User declines cookies
  declineButton.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "false");
    cookieModal.classList.remove("show");
    setTimeout(() => (cookieModal.style.display = "none"), 500);
  });
});
