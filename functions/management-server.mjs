import {removeTheme,themeCatalog} from './remove-theme.mjs';
const REPO='Xlyneve/CEP';
const OWNER='xeve06@gmail.com';
export function createHandler({verifyToken,github}) {
  return async (req,res)=>{
    res.set('Cache-Control','no-store');
    if(req.method!=='POST')return res.status(405).json({error:'Use POST.'});
    try {
      const token=/^Bearer (\S+)$/.exec(req.get('Authorization')||'')?.[1];
      if(!token)return res.status(401).json({error:'Sign in before managing themes.'});
      let user;
      try {user=await verifyToken(token);}catch{return res.status(401).json({error:'Your sign-in expired. Sign in again.'});}
      if(user.email!==OWNER||user.email_verified!==true)return res.status(403).json({error:'This account cannot manage themes.'});
      const {action,theme,sha}=req.body||{};
      if(action==='status') {
        if(!/^[a-f0-9]{40}$/.test(sha||''))return res.status(400).json({error:'Invalid deployment reference.'});
        const runs=await github(`/actions/workflows/firebase-hosting-merge.yml/runs?head_sha=${sha}&per_page=5`);
        const run=runs.workflow_runs[0];
        return res.json({status:!run?'pending':run.status==='completed'?(run.conclusion==='success'?'deployed':'failed'):'deploying'});
      }
      if(action!=='delete'||typeof theme!=='string'||theme==='original')return res.status(400).json({error:'Choose a deletable theme.'});
      const head=await github('/git/ref/heads/main');
      const parent=await github('/git/commits/'+head.object.sha);
      const file=await github('/contents/page-theme.js?ref='+head.object.sha);
      const source=Buffer.from(file.content,'base64').toString('utf8');
      if(!themeCatalog(source).some(t=>t.value===theme))return res.status(409).json({error:'This theme is already removed. Refresh the page.'});
      const result=removeTheme(source,theme);
      const blob=await github('/git/blobs','POST',{content:result.source,encoding:'utf-8'});
      const entries=[{path:'page-theme.js',mode:'100644',type:'blob',sha:blob.sha}];
      if(theme==='aurora')entries.push({path:'aurora-background.svg',mode:'100644',type:'blob',sha:null});
      const tree=await github('/git/trees','POST',{base_tree:parent.tree.sha,tree:entries});
      const commit=await github('/git/commits','POST',{message:`Delete ${theme} theme from website`,tree:tree.sha,parents:[head.object.sha]});
      // Never force: concurrent edits or deletions must not overwrite each other.
      await github('/git/refs/heads/main','PATCH',{sha:commit.sha,force:false});
      return res.json({sha:commit.sha,status:'deploying'});
    } catch(error) {
      console.error('Theme management failed:',error.status||error.name);
      return res.status(error.status===422?409:503).json({error:error.status===422?'The website changed during deletion. Try again.':'Theme deletion could not complete. No success has been reported; try again shortly.'});
    }
  };
}
export function githubClient(secret) {
  return async (path,method='GET',body)=>{
    const response=await fetch(`https://api.github.com/repos/${REPO}${path}`,{
      method,headers:{Authorization:`Bearer ${secret}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},
      ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)
    });
    if(!response.ok){const error=new Error('GitHub request failed');error.status=response.status;throw error;}
    return response.json();
  };
}
