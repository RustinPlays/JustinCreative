import {authenticate,makeCookie,valid,sameOrigin} from '../_auth.js';
const h={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
export async function onRequestGet({request,env}){return new Response(JSON.stringify({authenticated:await valid(request,env)}),{headers:h});}
export async function onRequestPost({request,env}){
 if(!sameOrigin(request))return new Response(JSON.stringify({error:'Invalid origin'}),{status:403,headers:h});
 const type=request.headers.get('content-type')||'';
 if(!type.startsWith('application/json'))return new Response(JSON.stringify({error:'JSON required'}),{status:415,headers:h});
 let body;try{body=await request.json();}catch{return new Response(JSON.stringify({error:'Invalid JSON'}),{status:400,headers:h});}
 if(typeof body.username!=='string'||typeof body.password!=='string'||body.username.length>120||body.password.length>300)
  return new Response(JSON.stringify({error:'Invalid credentials'}),{status:400,headers:h});
 if(!await authenticate(body.username,body.password,env))return new Response(JSON.stringify({error:'Incorrect username or password'}),{status:401,headers:h});
 return new Response(JSON.stringify({ok:true}),{headers:{...h,'Set-Cookie':await makeCookie(env)}});
}
