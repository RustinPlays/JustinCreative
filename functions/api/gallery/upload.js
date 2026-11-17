import {json,catalog,save,authorized,storage,fail} from './_lib.js';
const ALLOWED=new Set(['image/jpeg','image/png','image/webp','image/avif']);
export async function onRequestPost(context){
 const denial=await authorized(context);if(denial)return denial;
 try{
  const form=await context.request.formData();const id=String(form.get('eventId')||'');const file=form.get('file');
  if(!id||!file||typeof file.arrayBuffer!=='function')return json({error:'Select an event and image'},400);
  if(!ALLOWED.has(file.type))return json({error:'Use JPEG, PNG, WebP or AVIF'},415);
  if(file.size>10*1024*1024)return json({error:'Maximum image size is 10 MB'},413);
  const {events,etag}=await catalog(context.env);const event=events.find(e=>e.id===id);if(!event)return json({error:'Event not found'},404);
  if((event.photos||[]).length>=1000)return json({error:'Event is at 1000-photo limit'},400);
  const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'}[file.type];
  const key=`events/${id}/${crypto.randomUUID()}.${ext}`;
  await storage(context.env).put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type,cacheControl:'public, max-age=31536000, immutable'}});
  if(!context.env.PHOTOS_BASE_URL)return json({error:'Configure PHOTOS_BASE_URL in Pages environment variables. Image was stored in R2 but not added to album.'},503);
  const base=String(context.env.PHOTOS_BASE_URL).replace(/\/$/,'');if(!/^https:\/\/[a-z0-9.-]+$/i.test(base))return json({error:'Invalid PHOTOS_BASE_URL'},503);
  const url=`${base}/${key}`;event.photos=[...(event.photos||[]),{image:url,caption:''}];if(!event.cover)event.cover=url;
  try{await save(context.env,events,etag);}catch(e){return json({error:'Upload succeeded but catalog update conflicted. Retry or clean up the unlisted object in R2.',key},409);}
  return json({event,image:url});
 }catch(e){return fail(e);}
}
