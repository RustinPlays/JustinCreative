// Cloudflare Pages Function: /api/callback
const ORIGIN = 'https://justincreative.tech';
async function mac(secret,value){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(value))),x=>x.toString(16).padStart(2,'0')).join('');}
const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",'Referrer-Policy':'no-referrer'};
function finish(payload,ok){
 const message=`authorization:github:${ok?'success':'error'}:${JSON.stringify(payload)}`;
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>Justin Creative Login</title></head><body><p>${ok?'Login complete — this window will close.':'Login failed. Close this window and try again.'}</p><script>if(window.opener){window.opener.postMessage('authorizing:github',${JSON.stringify(ORIGIN)});window.opener.postMessage(${JSON.stringify(message)},${JSON.stringify(ORIGIN)});if(${ok})setTimeout(()=>window.close(),500);}</script></body></html>`;
 return new Response(html,{status:200,headers:{...headers,'Set-Cookie':'jc_oauth_nonce=; Max-Age=0; Path=/api; HttpOnly; Secure; SameSite=Lax'}});
}
export async function onRequestGet({request,env}){
 try{
  const u=new URL(request.url);const code=u.searchParams.get('code');const state=u.searchParams.get('state');
  const nonce=decodeURIComponent((request.headers.get('Cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('jc_oauth_nonce='))?.split('=').slice(1).join('=')||'');
  if(!code||!state||!nonce||!env.OAUTH_STATE_SECRET||!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET)return finish({error:'Missing OAuth information'},false);
  const expected=`${nonce}.${await mac(env.OAUTH_STATE_SECRET,nonce)}`;
  if(state!==expected)return finish({error:'OAuth security check failed'},false);
  const tokenResponse=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri:`${ORIGIN}/api/callback`})});
  const data=await tokenResponse.json();if(!tokenResponse.ok||!data.access_token)return finish({error:'GitHub did not issue a login token'},false);
  const userResponse=await fetch('https://api.github.com/user',{headers:{Authorization:`Bearer ${data.access_token}`,Accept:'application/vnd.github+json','User-Agent':'JustinCreativeCMS'}});
  const user=await userResponse.json();
  if(!userResponse.ok||String(user.login).toLowerCase()!=='rustinplays')return finish({error:'This GitHub user is not allowed to edit Justin Creative'},false);
  return finish({token:data.access_token,provider:'github'},true);
 }catch(err){return finish({error:'Unable to complete GitHub login'},false);}
}
