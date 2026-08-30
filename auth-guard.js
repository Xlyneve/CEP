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

  window.addEventListener("pageshow", event => {
    if (event.persisted) location.reload();
  });

  window.CEP_AUTH_READY = (async () => {
    const [{ initializeApp, getApps }, authSdk] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
    ]);

    const app = getApps().find(candidate => candidate.name === "[DEFAULT]") ||
      initializeApp(FIREBASE_CONFIG);
    const auth = authSdk.getAuth(app);
    // The login page establishes durable LOCAL persistence. Protected pages,
    // including search-preview iframes, must only read that state; rewriting
    // persistence concurrently can create transient signed-out auth events.
    window.CEP_FIREBASE_APP = app;
    window.CEP_FIREBASE_AUTH = auth;

    let user = await new Promise(resolve => {
      const unsubscribe = authSdk.onAuthStateChanged(auth, currentUser => {
        unsubscribe();
        resolve(currentUser);
      });
    });

    // Same-origin Universal Search opens Home in an iframe. Firebase can emit
    // a transient null in that new context before its persisted session has
    // hydrated, even though the authenticated parent is already ready.
    const embeddedSearch = new URLSearchParams(location.search).get("cepSearchEmbed") === "1" &&
      window.parent !== window;
    if (!user && embeddedSearch) {
      await new Promise(resolve => setTimeout(resolve, 1800));
      if (typeof auth.authStateReady === "function") await auth.authStateReady();
      user = auth.currentUser;
    }

    const authorized =
      user &&
      user.emailVerified === true &&
      String(user.email || "").toLowerCase() === ALLOWED_EMAIL;

    if (!authorized) {
      if (user) await authSdk.signOut(auth);
      const requestedPage = location.pathname.split("/").pop() || "home.html";
      localStorage.setItem("cep-auth-return-to", requestedPage);
      const returnTo = encodeURIComponent(requestedPage);
      location.replace(`${LOGIN_PAGE}?returnTo=${returnTo}`);
      return false;
    }

    document.documentElement.classList.remove("cep-auth-pending");
    loadingStyle.remove();
    window.CEP_CURRENT_USER = user;

    if (!/(?:^|\/)(?:homecal|RNCNP)\.html$/i.test(location.pathname)) {
      const editImageTools = document.createElement("script");
      editImageTools.type = "module";
      editImageTools.src = "edit-card-images.js?v=20260826-34";
      document.head.appendChild(editImageTools);
    }

    let signingOut = false;

    async function performSignOut() {
      if (signingOut) return;
      signingOut = true;
      document.documentElement.classList.add("cep-auth-pending");
      sessionStorage.removeItem("cep-auth-device-mode");
      localStorage.removeItem("cep-auth-device-mode");
      localStorage.removeItem("cep-auth-return-to");
      localStorage.setItem("cep-explicit-sign-out", String(Date.now()));
      await authSdk.signOut(auth);
      location.replace(`${LOGIN_PAGE}?signedOut=1`);
    }

    const signOutStyle = document.createElement("style");
    signOutStyle.textContent = `
      .cep-sign-out-light {
        position: fixed;
        left: max(4px, env(safe-area-inset-left));
        bottom: max(12px, env(safe-area-inset-bottom));
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        z-index: 2147483646;
      }
      .cep-sign-out-light::before {
        content: "";
        position: absolute;
        inset: 8px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #ffffff 0 20%, #e1e2c3 46%, #e5cbcc 100%);
        box-shadow:
          0 0 5px rgba(255, 255, 255, 1),
          0 0 11px rgba(225, 226, 195, 0.98),
          0 0 19px rgba(229, 203, 204, 0.92),
          0 0 28px rgba(211, 224, 223, 0.84),
          0 0 38px rgba(219, 158, 131, 0.48);
        transition: transform 140ms ease, box-shadow 140ms ease;
        animation: cep-sign-out-glow 2.8s ease-in-out infinite;
      }
      .cep-sign-out-light:hover::before,
      .cep-sign-out-light:focus-visible::before {
        transform: scale(1.28);
        box-shadow:
          0 0 7px rgba(255, 255, 255, 1),
          0 0 15px rgba(225, 226, 195, 1),
          0 0 24px rgba(229, 203, 204, 0.98),
          0 0 34px rgba(211, 224, 223, 0.94),
          0 0 44px rgba(219, 158, 131, 0.62);
      }
      @keyframes cep-sign-out-glow {
        0%, 100% { filter: brightness(0.96); transform: scale(0.94); }
        50% { filter: brightness(1.08); transform: scale(1.1); }
      }
      @media (prefers-reduced-motion: reduce) {
        .cep-sign-out-light::before { animation: none; }
      }
      .cep-sign-out-light:focus-visible {
        outline: 1px solid rgba(57, 25, 15, 0.42);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(signOutStyle);

    const signOutButton = document.createElement("button");
    signOutButton.type = "button";
    signOutButton.className = "cep-sign-out-light";
    signOutButton.setAttribute("aria-label", "Sign out of XlynEve");
    signOutButton.title = "Sign out";
    signOutButton.addEventListener("click", performSignOut);
    document.body.appendChild(signOutButton);
    window.CEP_SIGN_OUT = performSignOut;

    window.addEventListener("storage", event => {
      if (event.key !== "cep-explicit-sign-out" || signingOut) return;
      document.documentElement.classList.add("cep-auth-pending");
      location.replace(`${LOGIN_PAGE}?signedOut=1`);
    });

    let authLossTimer = 0;
    authSdk.onAuthStateChanged(auth, currentUser => {
      clearTimeout(authLossTimer);
      const stillAuthorized = currentUser
        && currentUser.emailVerified === true
        && String(currentUser.email || "").toLowerCase() === ALLOWED_EMAIL;
      if (stillAuthorized || signingOut) return;

      // Search loads several protected pages in preview iframes. Firebase can
      // briefly emit null while those contexts initialise. Recheck after the
      // transient window before enforcing the redirect.
      authLossTimer = window.setTimeout(async () => {
        if (signingOut) return;
        if (typeof auth.authStateReady === "function") await auth.authStateReady();
        const verifiedUser = auth.currentUser;
        const verifiedAuthorized = verifiedUser
          && verifiedUser.emailVerified === true
          && String(verifiedUser.email || "").toLowerCase() === ALLOWED_EMAIL;
        if (verifiedAuthorized) return;
        const requestedPage = location.pathname.split("/").pop() || "home.html";
        localStorage.setItem("cep-auth-return-to", requestedPage);
        document.documentElement.classList.add("cep-auth-pending");
        location.replace(`${LOGIN_PAGE}?returnTo=${encodeURIComponent(requestedPage)}`);
      }, 2000);
    });

    return true;
  })().catch(error => {
    console.error("Authentication check failed.", error);
    location.replace(`${LOGIN_PAGE}?error=auth`);
    return false;
  });
})();
