import {valid,sameOrigin} from './_auth.js';
export async function onRequest(context) {
 const {request,env}=context, url=new URL(request.url), path=url.pathname;
 const isAdmin=path==='/admin'||path.startsWith('/admin/');
 const isGalleryAPI=path.startsWith('/api/gallery/');
 const isGitHubLogin=path==='/api/auth';
 if(!isAdmin && !isGalleryAPI && !isGitHubLogin)return context.next();
 if(path==='/admin/login.html')return context.next();
 if(!await valid(request,env)){
  if(isAdmin)return Response.redirect(`${url.origin}/admin/login.html`,302);
  return new Response(JSON.stringify({error:'Please sign in at /admin/login.html'}),{status:401,headers:{'content-type':'application/json','cache-control':'no-store'}});
 }
 if(isGalleryAPI && !['GET','HEAD','OPTIONS'].includes(request.method) && !sameOrigin(request))
  return new Response(JSON.stringify({error:'Invalid request origin'}),{status:403,headers:{'content-type':'application/json'}});
 const result=await context.next();
 if(isAdmin){const out=new Response(result.body,result);out.headers.set('Cache-Control','private, no-store');return out;}
 return result;
}
