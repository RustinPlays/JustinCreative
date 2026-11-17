import {json,catalog,fail} from './_lib.js';
export async function onRequestGet({env}){
 try {let {events}=await catalog(env);return json({events:events.filter(e=>e.published!==false)});} catch(e){return fail(e);}
}
