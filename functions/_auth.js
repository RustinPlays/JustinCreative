// Server-only credentials and signed sessions for Justin Creative admin.
const enc = new TextEncoder();
const COOKIE = 'jc_admin_session';
function b64(bytes) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function unb64(value) { const s=value.replace(/-/g,'+').replace(/_/g,'/'); return Uint8Array.from(atob(s+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0)); }
function equal(a,b) { if(a.length!==b.length)return false; let d=0; for(let i=0;i<a.length;i++)d|=a[i]^b[i]; return d===0; }
async function digest(value) { return new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(value))); }
async function hmac(secret,value) { const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(value))); }
function cookieValue(request) {const m=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)jc_admin_session=([^;]+)/);return m?.[1]||'';}
async function valid(request,env) {
 if(!env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) return false;
 try {
  const value=cookieValue(request);const [body,sig]=value.split('.');if(!body||!sig)return false;
  if(!equal(unb64(sig),await hmac(env.ADMIN_SESSION_SECRET,body)))return false;
  const data=JSON.parse(new TextDecoder().decode(unb64(body)));
  return data.v===1 && data.u===env.ADMIN_USERNAME && Number(data.exp)>Date.now() && Number(data.iat)<=Date.now();
 } catch {return false;}
}
async function authenticate(username,password,env) {
 if(!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length<32) return false;
 const a=await digest(String(username)); const b=await digest(env.ADMIN_USERNAME);
 const c=await digest(String(password)); const d=await digest(env.ADMIN_PASSWORD);
 return equal(a,b) && equal(c,d);
}
async function makeCookie(env) {
 const now=Date.now();const body=b64(enc.encode(JSON.stringify({v:1,u:env.ADMIN_USERNAME,iat:now,exp:now+12*60*60*1000})));
 const sig=b64(await hmac(env.ADMIN_SESSION_SECRET,body));
 return `${COOKIE}=${body}.${sig}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=43200`;
}
const clearCookie=`${COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`;
function sameOrigin(request){const u=new URL(request.url),origin=request.headers.get('Origin');return origin===u.origin;}
export {valid,authenticate,makeCookie,clearCookie,sameOrigin};
