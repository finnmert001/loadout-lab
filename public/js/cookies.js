document.addEventListener("DOMContentLoaded", function () {
  const cookieModal = document.getElementById("cookieModal");
  const acceptButton = document.getElementById("acceptCookies");
  const declineButton = document.getElementById("declineCookies");

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + "; path=/" + expires;
  }

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  if (!getCookie("cookiesAccepted")) {
    cookieModal.classList.add("show");
  }

  // User accepts cookies
  acceptButton.addEventListener("click", function () {
    setCookie("cookiesAccepted", "true", 365); // Save choice for 1 year
    cookieModal.classList.remove("show");
    setTimeout(() => (cookieModal.style.display = "none"), 500);
  });

  // User declines cookies
  declineButton.addEventListener("click", function () {
    setCookie("cookiesAccepted", "false", 365); // Save choice for 1 year
    cookieModal.classList.remove("show");
    setTimeout(() => (cookieModal.style.display = "none"), 500);

    disableTracking();
  });
});
