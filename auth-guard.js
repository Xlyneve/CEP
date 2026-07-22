(function () {
  "use strict";

  const ALLOWED_EMAIL = "xeve06@gmail.com";
  const LOGIN_PAGE = "index.html";
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAgYsVQNEOyQa41NkXXT2VuKClqXAxfG1Q",
    authDomain: "cepx-f9d2a.firebaseapp.com",
    projectId: "cepx-f9d2a",
    storageBucket: "cepx-f9d2a.firebasestorage.app",
    messagingSenderId: "840696526325",
    appId: "1:840696526325:web:b9bcb4669fbfad066a1cbc"
  };

  // Keep protected content hidden while showing a lightweight loading state.
  const loadingStyle = document.createElement("style");
  loadingStyle.textContent = `
    html.cep-auth-pending body { visibility: hidden !important; }
    html.cep-auth-pending::before {
      content: "Loading secure data…";
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      visibility: visible;
      background: #f7f7f8;
      color: #3f4650;
      font: 600 14px/1.4 system-ui, sans-serif;
    }
  `;
  document.head.appendChild(loadingStyle);
  document.documentElement.classList.add("cep-auth-pending");

  window.CEP_AUTH_READY = (async () => {
    const [{ initializeApp, getApps }, authSdk] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
    ]);

    const app = getApps().find(candidate => candidate.name === "[DEFAULT]") ||
      initializeApp(FIREBASE_CONFIG);
    const auth = authSdk.getAuth(app);

    // The login page already establishes durable persistence. Rewriting the
    // persistence setting on every navigation adds an unnecessary IndexedDB wait.
    window.CEP_FIREBASE_APP = app;
    window.CEP_FIREBASE_AUTH = auth;

    const user = await new Promise(resolve => {
      const unsubscribe = authSdk.onAuthStateChanged(auth, currentUser => {
        unsubscribe();
        resolve(currentUser);
      });
    });

    const authorized =
      user &&
      user.emailVerified === true &&
      String(user.email || "").toLowerCase() === ALLOWED_EMAIL;

    if (!authorized) {
      if (user) await authSdk.signOut(auth);
      const returnTo = encodeURIComponent(location.pathname.split("/").pop() || "home.html");
      location.replace(`${LOGIN_PAGE}?returnTo=${returnTo}`);
      return false;
    }

    document.documentElement.classList.remove("cep-auth-pending");
    loadingStyle.remove();
    window.CEP_CURRENT_USER = user;
    return true;
  })().catch(error => {
    console.error("Authentication check failed.", error);
    location.replace(`${LOGIN_PAGE}?error=auth`);
    return false;
  });
})();
