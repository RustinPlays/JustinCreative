import {json,catalog,save,authorized,slug,uuid,fail} from './_lib.js';
export async function onRequestGet(context){const denial=await authorized(context);if(denial)return denial;try{return json({events:(await catalog(context.env)).events});}catch(e){return fail(e);}}
export async function onRequestPost(context){
 const denial=await authorized(context);if(denial)return denial;
 try{
  const body=await context.request.json();if(!body||typeof body!=='object')return json({error:'Invalid payload'},400);
  const id=body.id?String(body.id):uuid();const title=String(body.title||'').trim().slice(0,150);if(!title)return json({error:'Event title required'},400);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(body.date||'')))return json({error:'Date must be YYYY-MM-DD'},400);
  const {events,etag}=await catalog(context.env);let existing=events.find(e=>e.id===id);
  const validImages=new Set((existing?.photos||[]).map(p=>p.image));
  const photos=Array.isArray(body.photos)?body.photos.filter(p=>p&&typeof p.image==='string'&&validImages.has(p.image)).slice(0,1000).map(p=>({image:p.image,caption:String(p.caption||'').slice(0,300)})):(existing?.photos||[]);
  const next={id,slug:existing?.slug||slug(title)+'-'+id.slice(0,8),title,date:body.date,category:String(body.category||'Other').slice(0,60),venue:String(body.venue||'').slice(0,200),role:String(body.role||'').slice(0,200),description:String(body.description||'').slice(0,2000),published:body.published!==false,photos,cover:photos.some(p=>p.image===body.cover)?body.cover:(existing?.cover&&photos.some(p=>p.image===existing.cover)?existing.cover:photos[0]?.image||'')};
  const updated=existing?events.map(e=>e.id===id?next:e):[...events,next];await save(context.env,updated,etag);return json({event:next});
 }catch(e){return fail(e);}
}
export async function onRequestDelete(context){
 const denial=await authorized(context);if(denial)return denial;
 try{const {id}=await context.request.json();const {events,etag}=await catalog(context.env);if(!events.some(e=>e.id===id))return json({error:'Not found'},404);await save(context.env,events.filter(e=>e.id!==id),etag);return json({ok:true,note:'Images retained in R2 until manually cleaned up.'});}catch(e){return fail(e);}
}
