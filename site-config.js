window.JUSTIN_SITE = {
  tools: [
    { name: "AV Timer", description: "Run fullscreen timers, warnings and queued countdowns.", url: "https://timer.justincreative.tech/" },
    { name: "CueTime", description: "Build Follow and Hang Time cues for shows where timecode isn’t available or practical. Work out cue timing, running totals and EOS-ready follow times.", url: "https://rustinplays.github.io/CueTime/" },
    { name: "AV Planner", description: "Plan rooms, devices and signal flow.", url: "https://rustinplays.github.io/AV-Planner/" },
    { name: "Stage Deck Calculator", description: "Estimate deck layouts and materials.", url: "https://rustinplays.github.io/Stage-Deck-Calculator/" }
  ],
  merch: { shopUrl: "https://justincreative-shop.fourthwall.com/en-nzd", collection: "all" }
};

// Small additive enhancement shared by all existing pages.
// Adds the Events tab and loads editable homepage testimonials without touching layout files.
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.site-nav').forEach(nav => {
    if (nav.querySelector('a[href="events.html"], a[href="/events.html"]')) return;
    const link = document.createElement('a');
    link.href = '/events.html';
    link.textContent = 'Events';
    if (path.endsWith('/events.html')) { link.className = 'is-active'; link.setAttribute('aria-current', 'page'); }
    const booking = nav.querySelector('.nav-booking');
    nav.insertBefore(link, booking || null);
  });
  document.querySelectorAll('footer nav[aria-label="Footer navigation"]').forEach(nav => {
    if (nav.querySelector('a[href="/events.html"]')) return;
    const link = document.createElement('a'); link.href = '/events.html'; link.textContent = 'Events';
    const booking = nav.querySelector('a[href*="booking"]'); nav.insertBefore(link, booking || null);
  });
  const grid = document.querySelector('.testimonials-grid');
  if (!grid) return;
  fetch('/content/testimonials.json', {cache: 'no-cache'})
    .then(r => { if (!r.ok) throw Error('Testimonials unavailable'); return r.json(); })
    .then(data => {
      if (!Array.isArray(data.testimonials)) return;
      grid.replaceChildren();
      for (const quote of data.testimonials.filter(q => q.published !== false)) {
        const card = document.createElement('blockquote'); card.className = 'testimonial';
        const p = document.createElement('p'); p.textContent = `“${quote.quote || ''}”`;
        const author = document.createElement('footer'); author.textContent = `— ${quote.name || 'Client'}${quote.role ? ', ' + quote.role : ''}`;
        card.append(p, author); grid.appendChild(card);
      }
      if (!grid.children.length) grid.textContent = 'Feedback coming soon.';
    }).catch(err => console.warn('Showing the original testimonials:', err));
});
