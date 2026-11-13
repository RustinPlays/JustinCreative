// Cloudflare Pages Function: /api/auth
// GitHub OAuth start; secrets are server-side only.
const cookie = (name, value, ttl) => `${name}=${value}; Max-Age=${ttl}; Path=/api; HttpOnly; Secure; SameSite=Lax`;
async function mac(secret, value) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'},false,['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value))),x=>x.toString(16).padStart(2,'0')).join('');
}
export async function onRequestGet({request, env}) {
  if(!env.GITHUB_CLIENT_ID || !env.OAUTH_STATE_SECRET) return new Response('OAuth configuration missing. See ADMIN_SETUP.md.',{status:503});
  const url = new URL(request.url);
  if(url.hostname !== 'justincreative.tech') return new Response('Use https://justincreative.tech/admin/',{status:400});
  const nonce = crypto.randomUUID(); const state = `${nonce}.${await mac(env.OAUTH_STATE_SECRET,nonce)}`;
  const github = new URL('https://github.com/login/oauth/authorize');
  github.searchParams.set('client_id',env.GITHUB_CLIENT_ID);
  github.searchParams.set('redirect_uri','https://justincreative.tech/api/callback');
  github.searchParams.set('scope','repo');
  github.searchParams.set('state',state);
  return new Response(null,{status:302,headers:{Location:github.toString(),'Set-Cookie':cookie('jc_oauth_nonce',nonce,600),'Cache-Control':'no-store'}});
}
