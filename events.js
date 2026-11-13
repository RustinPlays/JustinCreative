(() => {
  const grid = document.getElementById('events-grid');
  if (!grid) return;
  const status = document.getElementById('events-status');
  const filter = document.getElementById('event-filter');
  const viewer = document.getElementById('events-viewer');
  const viewerImage = document.getElementById('viewer-image');
  const viewerCaption = document.getElementById('viewer-caption');
  let events = [], currentPhotos = [], currentIndex = 0, previousFocus = null;
  const text = (node, value) => { node.textContent = value == null ? '' : String(value); return node; };
  const el = (tag, className, value) => { const n = document.createElement(tag); if(className)n.className=className;if(value!==undefined)text(n,value);return n;};
  const safeImage = src => typeof src === 'string' && (/^\/(?!\/)/.test(src) || /^https:\/\//.test(src)) ? src : '';
  function updateViewer() {
    const p = currentPhotos[currentIndex]; if(!p)return;
    viewerImage.src = p.src; viewerImage.alt = p.alt || 'Event photo';
    text(viewerCaption, `${p.alt || 'Event photo'} · ${currentIndex + 1} / ${currentPhotos.length}`);
  }
  function openViewer(photos, index) {
    if (!photos.length) return;
    previousFocus = document.activeElement; currentPhotos = photos; currentIndex = index;
    updateViewer(); viewer.hidden=false; document.body.style.overflow='hidden'; document.getElementById('viewer-close').focus();
  }
  function closeViewer() { viewer.hidden=true; viewerImage.removeAttribute('src'); document.body.style.overflow=''; previousFocus?.focus(); }
  document.getElementById('viewer-close').addEventListener('click',closeViewer);
  document.getElementById('viewer-prev').addEventListener('click',()=>{currentIndex=(currentIndex-1+currentPhotos.length)%currentPhotos.length;updateViewer();});
  document.getElementById('viewer-next').addEventListener('click',()=>{currentIndex=(currentIndex+1)%currentPhotos.length;updateViewer();});
  viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer();});
  document.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape')closeViewer();if(e.key==='ArrowLeft')document.getElementById('viewer-prev').click();if(e.key==='ArrowRight')document.getElementById('viewer-next').click();if(e.key==='Tab'){const controls=[document.getElementById('viewer-close'),document.getElementById('viewer-prev'),document.getElementById('viewer-next')];const i=controls.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();controls[2].focus();}else if(!e.shiftKey&&i===2){e.preventDefault();controls[0].focus();}}});
  function render() {
    grid.replaceChildren();
    const selected = filter.value;
    const visible = events.filter(e=>e.published!==false&&(selected==='all'||e.category===selected));
    if(!visible.length){text(status,selected==='all'?'No events published yet. Check back soon.':'No events in this category yet.');return;}
    status.textContent='';
    for(const event of visible){
      const card=el('article','event-card');
      const cover=safeImage(event.cover);
      if(cover){const img=el('img','event-cover');img.src=cover;img.alt=event.title||'Event';img.loading='lazy';card.append(img);} else card.append(el('div','event-empty-cover','JC / EVENTS'));
      const details=el('div','event-details');
      const date=event.date?new Date(`${event.date}T12:00:00`).toLocaleDateString('en-NZ',{day:'numeric',month:'long',year:'numeric'}):'';
      details.append(el('small','', [date,event.category].filter(Boolean).join(' · ')),el('h3','',event.title||'Event'));
      if(event.venue)details.append(el('p','',event.venue));
      if(event.role)details.append(el('p','event-role',event.role));
      if(event.description)details.append(el('p','',event.description));
      const photos = (Array.isArray(event.photos)?event.photos:[]).map(p=>({src:safeImage(p.image),alt:p.caption||event.title||'Event photo'})).filter(p=>p.src);
      if(cover&&!photos.some(p=>p.src===cover)) photos.unshift({src:cover,alt:event.title||'Event photo'});
      if(photos.length){
        const thumbnails=el('div','event-images');
        photos.slice(0,5).forEach((p,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Open photo ${i+1} of ${event.title}`);const img=el('img');img.src=p.src;img.alt='';img.loading='lazy';button.append(img);button.addEventListener('click',()=>openViewer(photos,i));thumbnails.append(button);});
        details.append(thumbnails);
        const btn=el('button','event-open',`View ${photos.length} photo${photos.length===1?'':'s'} ↗`);btn.type='button';btn.addEventListener('click',()=>openViewer(photos,0));details.append(btn);
      }
      card.append(details);grid.append(card);
    }
  }
  filter.addEventListener('change',render);
  fetch('/content/events.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(data=>{events=Array.isArray(data.events)?data.events:[];events.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));render();}).catch(()=>text(status,'Events could not be loaded. Please try again later.'));
})();
