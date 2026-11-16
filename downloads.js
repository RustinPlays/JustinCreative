// Tools catalogue uses the same data source as the rest of the site.
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
      // Look up the highest versioned Companion package in the AV Timer repository.
      if (tool.name === 'AV Timer') {
        const companion = document.createElement('a');
        companion.className = 'download-link';
        companion.href = 'https://timer.justincreative.tech/';
        companion.textContent = 'Finding latest Companion…';
        companion.setAttribute('aria-label', 'Finding latest AV Timer Companion download');
        actions.append(companion);

        const directory = 'https://api.github.com/repos/RustinPlays/AV-Timer/contents/downloads';
        const versionFromName = (filename) => {
          const match = /^JC-AV-Timer-Companion-v(\d+(?:\.\d+)*)\.tgz$/i.exec(filename);
          return match ? match[1].split('.').map(Number) : null;
        };
        const compareVersions = (a, b) => {
          const va = versionFromName(a.name) || [];
          const vb = versionFromName(b.name) || [];
          for (let i = 0; i < Math.max(va.length, vb.length); i++) {
            if ((va[i] || 0) !== (vb[i] || 0)) return (vb[i] || 0) - (va[i] || 0);
          }
          return 0;
        };
        fetch(directory, { headers: { Accept: 'application/vnd.github+json' } })
          .then((response) => {
            if (!response.ok) throw new Error('GitHub returned ' + response.status);
            return response.json();
          })
          .then((files) => {
            if (!Array.isArray(files)) throw new Error('No downloads directory');
            const candidates = files
              .filter((file) => file.type === 'file' && versionFromName(file.name))
              .sort(compareVersions);
            if (!candidates.length) throw new Error('No versioned Companion packages found');
            const latest = candidates[0];
            const version = latest.name.match(/-v(\d+(?:\.\d+)*)/i)[1];
            companion.href = latest.download_url ||
              'https://raw.githubusercontent.com/RustinPlays/AV-Timer/main/downloads/' + encodeURIComponent(latest.name);
            companion.textContent = 'Download Companion v' + version;
            companion.title = 'Download latest JC - AV Timer Companion (' + latest.name + ')';
            companion.setAttribute('download', latest.name);
            companion.setAttribute('aria-label', 'Download AV Timer Companion version ' + version);
          })
          .catch((error) => {
            console.warn('Latest Companion lookup unavailable:', error);
            companion.textContent = 'Companion download (AV Timer site) ↗';
            companion.title = 'Open AV Timer to download its published Companion package';
            companion.setAttribute('aria-label', 'Open AV Timer for Companion download');
          });
      }
    } else {
      const note=document.createElement('span');note.className='download-link pending';note.textContent='Coming soon';actions.append(note);
    }
    card.append(label,name,description,actions);fragment.append(card);
  }
  grid.replaceChildren(fragment);
})();
