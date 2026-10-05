const endpoint='/api/theme-management';
async function request(body) {
  await window.CEP_AUTH_READY;
  const user=window.CEP_FIREBASE_AUTH?.currentUser;
  if(!user)throw new Error('Sign in before deleting a theme.');
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${await user.getIdToken()}`},body:JSON.stringify(body),cache:'no-store'});
  let result;
  try{result=await response.json();}catch{throw new Error('Theme deletion service is unavailable. Try again shortly.');}
  if(!response.ok)throw new Error(result.error||'Theme deletion failed.');
  return result;
}
export async function deleteTheme(theme,onProgress=()=>{}) {
  const result=await request({action:'delete',theme});
  if(!/^[a-f0-9]{40}$/.test(result.sha||''))throw new Error('The deletion service did not confirm the GitHub update.');
  onProgress('Theme removed from GitHub. Deploying the website…');
  for(let attempt=0;attempt<60;attempt++) {
    await new Promise(resolve=>setTimeout(resolve,3000));
    const status=await request({action:'status',sha:result.sha});
    if(status.status==='deployed'){onProgress('Theme deleted from the website.');return;}
    if(status.status==='failed')throw new Error('Theme removed from GitHub, but deployment failed. The live site still needs deployment.');
  }
  throw new Error('Theme removed from GitHub. Deployment is still pending; refresh once it finishes.');
}
