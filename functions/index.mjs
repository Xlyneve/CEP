import {onRequest} from 'firebase-functions/v2/https';
import {defineSecret} from 'firebase-functions/params';
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {createHandler,githubClient} from './management-server.mjs';
initializeApp();
const githubToken=defineSecret('THEME_GITHUB_TOKEN');
export const themeManagement=onRequest({
  region:'australia-southeast1',secrets:[githubToken],maxInstances:1,concurrency:1,timeoutSeconds:120,
  cors:['https://cepx-f9d2a.firebaseapp.com','https://cepx-f9d2a.web.app','https://xlyneve.github.io']
},(req,res)=>createHandler({verifyToken:token=>getAuth().verifyIdToken(token,true),github:githubClient(githubToken.value())})(req,res));
