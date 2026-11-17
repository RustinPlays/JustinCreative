import {valid,sameOrigin} from '../_auth.js';
const API='https://api.github.com/repos/RustinPlays/JustinCreative/contents/content/testimonials.json';
const HEAD={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const output=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:HEAD});
const decode64=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),x=>x.charCodeAt(0)));
const encode64=s=>{const b=new TextEncoder().encode(s);let binary='';for(let i=0;i<b.length;i+=8192)binary+=String.fromCharCode(...b.subarray(i,i+8192));return btoa(binary);};
function config(env){if(!env.GITHUB_CONTENT_TOKEN)return null;return {'authorization':`Bearer ${env.GITHUB_CONTENT_TOKEN}`,'accept':'application/vnd.github+json','user-agent':'JustinCreativeBackstage','x-github-api-version':'2022-11-28'};}
async function read(headers){const r=await fetch(API,{headers});if(!r.ok)throw new Error(`GitHub read failed (${r.status})`);const f=await r.json();const data=JSON.parse(decode64(f.content));return {sha:f.sha,testimonials:Array.isArray(data.testimonials)?data.testimonials:[]};}
const normalize=t=>({name:String(t.name||'').trim().slice(0,130),role:String(t.role||'').trim().slice(0,180),quote:String(t.quote||'').trim().slice(0,4000),published:t.published!==false});
export async function onRequest(context){
 const {request,env}=context;
 if(!await valid(request,env))return output({error:'Not signed in'},401);
 const headers=config(env);
 if(!headers)return output({error:'GITHUB_CONTENT_TOKEN is not configured in Cloudflare Pages secrets.'},503);
 try{
  if(request.method==='GET')return output(await read(headers));
  if(request.method!=='PUT')return output({error:'Method not allowed'},405);
  if(!sameOrigin(request))return output({error:'Invalid request origin'},403);
  if(Number(request.headers.get('content-length')||0)>1024*1024)return output({error:'Request too large'},413);
  const body=await request.json();
  if(!body||!Array.isArray(body.testimonials)||body.testimonials.length>300||typeof body.sha!=='string')return output({error:'Invalid content'},400);
  const testimonials=body.testimonials.map(normalize);
  if(testimonials.some(t=>!t.name||!t.quote))return output({error:'Every testimonial needs a name and quote'},400);
  const current=await read(headers);
  if(body.sha!==current.sha)return output({error:'Testimonials were updated elsewhere. Refresh before saving to avoid overwriting changes.'},409);
  const content=encode64(JSON.stringify({testimonials},null,2)+'\n');
  const res=await fetch(API,{method:'PUT',headers:{...headers,'content-type':'application/json'},body:JSON.stringify({message:'Update testimonials via Justin Creative Backstage',content,sha:current.sha,branch:'main'})});
  if(!res.ok){let err=await res.json().catch(()=>({}));return output({error:`GitHub publish failed (${res.status}): ${err.message||'Check token permissions'}`},res.status===409?409:502)}
  const saved=await res.json();return output({ok:true,sha:saved.content.sha,testimonials});
 }catch(err){return output({error:String(err.message||'Unexpected error')},500)}
}
