import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { mountHomeLinks } from './home-links-ui.js?v=1';

if (await window.CEP_AUTH_READY) {
  const ref = doc(getFirestore(window.CEP_FIREBASE_APP), 'homePreferences', window.CEP_CURRENT_USER.uid);
  mountHomeLinks({
    load: async () => { const snapshot = await getDoc(ref); return snapshot.exists() ? snapshot.data().links : null; },
    save: links => setDoc(ref, { links }, { merge: true }),
    signOut: () => window.CEP_SIGN_OUT()
  });
}
