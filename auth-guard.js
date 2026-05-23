(function () {
  const isAuthenticated = sessionStorage.getItem("authenticated") === "true";

  if (!isAuthenticated) {
    window.location.replace("index.html");
  }
})();
