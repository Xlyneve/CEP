import { initializeApp,getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore,collection,onSnapshot,doc,setDoc,serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
await window.CEP_AUTH_READY;
const app=getApps().find(app=>app.name==='notes-chat')||initializeApp({apiKey:'AIzaSyDtv3x9PAMzZUW6yVuUSLgLzA0ejcDidF4',authDomain:'notes-chat-c5ff3.firebaseapp.com',projectId:'notes-chat-c5ff3',appId:'1:597780727252:web:8407eb4096dbe301d74241'},'notes-chat');
const db=getFirestore(app);let unsubscribe;
onAuthStateChanged(getAuth(app),user=>{
  unsubscribe?.();window.CEPSharedDefinitions.update([]);
  window.CEPSharedDefinitions.connect(null);
  const adapter = {
    save:(id,data)=>setDoc(doc(db,'concept_defs',id),{...data,updatedAt:serverTimestamp()},{merge:true}),
    remove:id=>setDoc(doc(db,'concept_defs',id),{disabled:true,updatedAt:serverTimestamp()},{merge:true})
  };
  if(user)unsubscribe=onSnapshot(collection(db,'concept_defs'),snapshot=>{
    window.CEPSharedDefinitions.update(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})));
    window.CEPSharedDefinitions.connect(adapter);
  },error=>console.error('Shared definitions:',error));
});
