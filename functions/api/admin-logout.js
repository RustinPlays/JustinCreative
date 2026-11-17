import {clearCookie,sameOrigin} from '../_auth.js';
export async function onRequestPost({request}){
 if(!sameOrigin(request))return new Response('Forbidden',{status:403});
 return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store','Set-Cookie':clearCookie}});
}
