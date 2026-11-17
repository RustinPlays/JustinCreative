import {json,catalog,save,authorized,storage,fail} from './_lib.js';
export async function onRequestPost(context){
 const denial=await authorized(context);if(denial)return denial;
 try{
  const {id,image}=await context.request.json();const {events,etag}=await catalog(context.env);const event=events.find(e=>e.id===id);
  if(!event||!event.photos?.some(p=>p.image===image))return json({error:'Image not found on event'},404);
  const base=String(context.env.PHOTOS_BASE_URL||'').replace(/\/$/,'');const prefix=`${base}/events/${id}/`;
  if(!base||!String(image).startsWith(prefix))return json({error:'Image does not belong to configured R2 storage'},400);
  const key=decodeURIComponent(String(image).slice(base.length+1));if(!/^events\/[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp|avif)$/.test(key))return json({error:'Unsafe image key'},400);
  event.photos=event.photos.filter(p=>p.image!==image);if(event.cover===image)event.cover=event.photos[0]?.image||'';
  await save(context.env,events,etag);await storage(context.env).delete(key);return json({event});
 }catch(e){return fail(e);}
}
