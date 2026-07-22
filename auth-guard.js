(function () {
  "use strict";

  const ALLOWED_EMAIL = "xeve06@gmail.com";
  const LOGIN_PAGE = "index.html";
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAgYsVQNEOyQa41NkXXT2VuKClqXAxfG1Q",
    authDomain: "cepx-f9d2a.firebaseapp.com",
    projectId: "cepx-f9d2a",
    storageBucket: "cepx-f9d2a.appspot.com",
    messagingSenderId: "840696526325",
    appId: "1:840696526325:web:b9bcb4669fbfad066a1cbc"
  };

  // Do not reveal protected content while Firebase restores the signed-in user.
  document.documentElement.style.visibility = "hidden";

  window.CEP_AUTH_READY = (async () => {
    const [{ initializeApp, getApp, getApps }, authSdk] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
    ]);

    const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
    const auth = authSdk.getAuth(app);
    await authSdk.setPersistence(auth, authSdk.browserLocalPersistence);

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

    document.documentElement.style.visibility = "";
    window.CEP_CURRENT_USER = user;
    return true;
  })().catch(error => {
    console.error("Authentication check failed.", error);
    location.replace(`${LOGIN_PAGE}?error=auth`);
    return false;
  });
})();
