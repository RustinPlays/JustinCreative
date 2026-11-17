import {json,catalog,fail} from './gallery/_lib.js';
export async function onRequestGet({env}){
 try{const {events}=await catalog(env);return json({events:events.filter(e=>e.published!==false)});}catch(e){return fail(e);}
}
