const json = (data, status=200) => new Response(JSON.stringify(data), {status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const BASE = 'catalog/events.json';
const slug = s => String(s||'').toLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70);
const uuid = () => crypto.randomUUID();
function storage(env){if(!env.GALLERY_BUCKET) throw new Error('Cloudflare R2 binding GALLERY_BUCKET is not configured');return env.GALLERY_BUCKET;}
// R2's .httpEtag is quoted for HTTP headers; conditional R2 object writes
// require the unquoted .etag value instead.
async function catalog(env){
  const object=await storage(env).get(BASE);
  if(!object)return {events:[],etag:null};
  const data=await object.json();
  return {events:Array.isArray(data.events)?data.events:[],etag:object.etag};
}
async function save(env,events,etag){
  const opts={httpMetadata:{contentType:'application/json'},onlyIf:etag?{etagMatches:etag}:{etagDoesNotMatch:'*'}};
  const result=await storage(env).put(BASE,JSON.stringify({events}),opts);
  if(!result)throw new Error('Update conflict: another change was published. Refresh and retry.');
}
import {valid} from '../../_auth.js';
const authorized=async(context)=>await valid(context.request,context.env)?null:json({error:'Please sign in to the Justin Creative admin dashboard.'},401);
const fail=e=>json({error:e.message||'Unexpected error'},/conflict/i.test(e.message||'')?409:500);
export {json,slug,uuid,storage,catalog,save,authorized,fail};
