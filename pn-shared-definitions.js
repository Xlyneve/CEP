import { initializeApp,getApps } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore,collection,onSnapshot,doc,setDoc,serverTimestamp,runTransaction } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage,ref,uploadBytes,getDownloadURL,deleteObject } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';
await window.CEP_AUTH_READY;
const app=getApps().find(app=>app.name==='notes-chat')||initializeApp({apiKey:'AIzaSyDtv3x9PAMzZUW6yVuUSLgLzA0ejcDidF4',authDomain:'notes-chat-c5ff3.firebaseapp.com',projectId:'notes-chat-c5ff3',appId:'1:597780727252:web:8407eb4096dbe301d74241'},'notes-chat');
const db=getFirestore(app);
const storage=getStorage(app,'gs://notes-chat-c5ff3.firebasestorage.app');let unsubscribe, unsubscribeMedia;
onAuthStateChanged(getAuth(app),user=>{
  unsubscribe?.();unsubscribeMedia?.();window.CEPSharedDefinitions.update([]);window.CEPSharedDefinitions.updateMedia([]);
  window.CEPSharedDefinitions.connect(null);
  const adapter = {
    uploadPhotos:async (concept,files)=>{
      if (!user || getAuth(app).currentUser?.uid !== user.uid) throw new Error('Please sign in again before uploading photos.');
      const uploaded=[],paths=[];
      try {
        for (const file of files) {
          const blob=await compressConceptPhoto(file);
          const folder=concept.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'concept';
          const path='concept_media/'+folder+'/'+crypto.randomUUID()+'.jpg';
          const object=ref(storage,path);paths.push(object);
          await uploadBytes(object,blob,{contentType:'image/jpeg'});
          uploaded.push({imageUrl:await getDownloadURL(object),storagePath:path});
        }
        const key=window.CEPSharedDefinitions.normalize(concept);
        const target=doc(db,'concept_media',key);
        const record=await runTransaction(db,async transaction=>{
          const snapshot=await transaction.get(target);
          const previous=snapshot.data() || {};
          const existing=Array.isArray(previous.images)&&previous.images.length ? previous.images : previous.imageUrl ? [{imageUrl:previous.imageUrl,storagePath:previous.storagePath || ''}] : [];
          const images=[...existing,...uploaded];
          const value={concept,images,imageUrl:images[0].imageUrl,storagePath:images[0].storagePath || '',updatedAt:serverTimestamp()};
          transaction.set(target,value,{merge:true});
          return {...previous,...value,id:key};
        });
        window.invalidateCepSearchCache?.('xgpt:media');
        return record;
      } catch(error) {
        await Promise.allSettled(paths.map(object=>deleteObject(object)));
        throw error;
      }
    },
    save:(id,data)=>setDoc(doc(db,'concept_defs',id),{...data,updatedAt:serverTimestamp()},{merge:true}),
    remove:id=>setDoc(doc(db,'concept_defs',id),{disabled:true,updatedAt:serverTimestamp()},{merge:true})
  };
  if(user)unsubscribeMedia=onSnapshot(collection(db,'concept_media'),snapshot=>{
    window.CEPSharedDefinitions.updateMedia(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})));
  },error=>console.error('Shared concept photos:',error));
  if(user)unsubscribe=onSnapshot(collection(db,'concept_defs'),snapshot=>{
    window.CEPSharedDefinitions.update(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})));
    window.CEPSharedDefinitions.connect(adapter);
  },error=>console.error('Shared definitions:',error));
});

// Match the existing ChatGPTX concept-photo format and compression.
async function compressConceptPhoto(file) {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
  if (file.size > 20*1024*1024) throw new Error('Choose a photo smaller than 20 MB.');
  const url=URL.createObjectURL(file);
  try {
    const image=await new Promise((resolve,reject)=>{
      const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('This photo could not be read. Try JPEG or PNG.'));img.src=url;
    });
    const scale=Math.min(1,900/image.naturalWidth,900/image.naturalHeight);
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
    const context=canvas.getContext('2d',{alpha:false});context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.72));
    if (!blob || blob.size > 2*1024*1024) throw new Error('This photo could not be compressed enough. Try a smaller image.');
    return blob;
  } finally { URL.revokeObjectURL(url); }
}
