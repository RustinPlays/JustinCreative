// Justin Creative downloads catalogue
// Existing tool definitions are sourced from site-config.js.
(() => {
  const grid = document.getElementById('downloads-catalogue');
  if (!grid) return;
  const tools = [...(window.JUSTIN_SITE?.tools || [])];
  tools.push({name:'JC Internet Clicker',description:'Internet-based remote clicker control for PowerPoint, Resolume and Companion. Download is not yet published on this site.',url:null});

  const fragment = document.createDocumentFragment();
  for (const tool of tools) {
    const card=document.createElement('article');card.className='download-card';
    const label=document.createElement('span');label.className='download-badge';label.textContent=tool.url?'WEB TOOL':'IN DEVELOPMENT';
    const name=document.createElement('h2');name.textContent=tool.name;
    const description=document.createElement('p');description.textContent=tool.description||'';
    const actions=document.createElement('div');actions.className='download-buttons';
    if (tool.url) {
      const link=document.createElement('a');link.className='download-link';link.href=tool.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open web tool ↗';actions.append(link);

      // Use the same Companion package and version as the AV Timer site.
      if (tool.name === 'AV Timer') {
        const companion=document.createElement('a');
        companion.className='download-link';
        companion.href='https://timer.justincreative.tech/downloads/JC-AV-Timer-Companion-v0.9.5.tgz?v=0.9.5';
        companion.textContent='Download Companion v0.9.5';
        companion.title='Download JC - AV Timer Companion v0.9.5';
        actions.append(companion);
      }
    } else {
      const note=document.createElement('span');note.className='download-link pending';note.textContent='Coming soon';actions.append(note);
    }
    card.append(label,name,description,actions);fragment.append(card);
  }
  grid.replaceChildren(fragment);
})();
