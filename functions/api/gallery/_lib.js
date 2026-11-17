const json = (data, status=200) => new Response(JSON.stringify(data), {status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const BASE = 'catalog/events.json';
const slug = s => String(s||'').toLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70);
const uuid = () => crypto.randomUUID();
function storage(env){if(!env.GALLERY_BUCKET) throw new Error('Cloudflare R2 binding GALLERY_BUCKET is not configured');return env.GALLERY_BUCKET;}
async function catalog(env){let object=await storage(env).get(BASE); if(!object)return {events:[],etag:null};let data=await object.json();return {events:Array.isArray(data.events)?data.events:[],etag:object.httpEtag};}
async function save(env,events,etag){const opts={httpMetadata:{contentType:'application/json'},onlyIf:etag?{etagMatches:etag}:{etagDoesNotMatch:'*'}};let result=await storage(env).put(BASE,JSON.stringify({events}),opts);if(!result)throw new Error('Update conflict: another change was published. Refresh and retry.');}
async function access(request,env){
  const token=request.headers.get('Cf-Access-Jwt-Assertion');
  if(!token||!env.CF_ACCESS_TEAM_DOMAIN||!env.CF_ACCESS_AUD||!env.ADMIN_EMAIL)return false;
  try{
    const chunks=token.split('.');if(chunks.length!==3)return false;
    const parse=s=>JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0))));
    const header=parse(chunks[0]),payload=parse(chunks[1]);
    const domain=String(env.CF_ACCESS_TEAM_DOMAIN).replace(/^https?:\/\//,'').replace(/\/$/,'');
    if(!/^[a-z0-9.-]+\.cloudflareaccess\.com$/i.test(domain))return false;
    if(header.alg!=='RS256'||!header.kid||payload.iss!==`https://${domain}`||!Array.isArray(payload.aud)||!payload.aud.includes(env.CF_ACCESS_AUD)||Number(payload.exp)<=Date.now()/1000||Number(payload.nbf||0)>Date.now()/1000||String(payload.email||'').toLowerCase()!==String(env.ADMIN_EMAIL).toLowerCase())return false;
    const keys=await fetch(`https://${domain}/cdn-cgi/access/certs`).then(r=>r.json());
    const jwk=(keys.keys||[]).find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)return false;
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    const sig=Uint8Array.from(atob(chunks[2].replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-chunks[2].length%4)%4)),c=>c.charCodeAt(0));
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,sig,new TextEncoder().encode(`${chunks[0]}.${chunks[1]}`));
  }catch{return false;}
}
const authorized=async(context)=>await access(context.request,context.env)?null:json({error:'Not authorized. Configure Cloudflare Access and ADMIN_EMAIL.'},403);
const fail=e=>json({error:e.message||'Unexpected error'},/conflict/i.test(e.message||'')?409:500);
export {json,slug,uuid,storage,catalog,save,authorized,fail};
