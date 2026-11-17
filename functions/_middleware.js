import {valid, sameOrigin} from './_auth.js';

// Cloudflare Pages automatically canonicalises /admin/login.html to /admin/login.
// The public login route MUST be exempt from authentication under every form,
// otherwise unauthenticated users are redirected in an endless loop.
export async function onRequest(context) {
  const {request, env} = context;
  const url = new URL(request.url);
  const path = url.pathname;

  const isAdmin = path === '/admin' || path.startsWith('/admin/');
  const isGalleryAPI = path.startsWith('/api/gallery/');
  const isGitHubLogin = path === '/api/auth';

  if (!isAdmin && !isGalleryAPI && !isGitHubLogin) return context.next();

  if (path === '/admin/login' || path === '/admin/login/' || path === '/admin/login.html') {
    const response = await context.next();
    const out = new Response(response.body, response);
    out.headers.set('Cache-Control', 'no-store');
    return out;
  }

  if (!await valid(request, env)) {
    if (isAdmin) return Response.redirect(`${url.origin}/admin/login`, 302);
    return new Response(
      JSON.stringify({error:'Please sign in at /admin/login'}),
      {status:401, headers:{'content-type':'application/json', 'cache-control':'no-store'}}
    );
  }
  if (isGalleryAPI && !['GET','HEAD','OPTIONS'].includes(request.method) && !sameOrigin(request)) {
    return new Response(
      JSON.stringify({error:'Invalid request origin'}),
      {status:403, headers:{'content-type':'application/json', 'cache-control':'no-store'}}
    );
  }
  const response = await context.next();
  if (isAdmin) {
    const out = new Response(response.body,response);
    out.headers.set('Cache-Control','private, no-store');
    return out;
  }
  return response;
}
