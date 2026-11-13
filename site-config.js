window.JUSTIN_SITE = {
  tools: [
    { name: "AV Timer", description: "Run fullscreen timers, warnings and queued countdowns.", url: "https://timer.justincreative.tech/" },
    { name: "CueTime", description: "Build Follow and Hang Time cues for shows where timecode isn’t available or practical. Work out cue timing, running totals and EOS-ready follow times.", url: "https://rustinplays.github.io/CueTime/" },
    { name: "AV Planner", description: "Plan rooms, devices and signal flow.", url: "https://rustinplays.github.io/AV-Planner/" },
    { name: "Stage Deck Calculator", description: "Estimate deck layouts and materials.", url: "https://rustinplays.github.io/Stage-Deck-Calculator/" }
  ],
  merch: { shopUrl: "https://justincreative-shop.fourthwall.com/en-nzd", collection: "all" }
};

// Testimonials remain editable in the backstage CMS.
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.testimonials-grid');
  if (!grid) return;
  fetch('/content/testimonials.json', {cache: 'no-cache'})
    .then(r => { if (!r.ok) throw new Error('Testimonials unavailable'); return r.json(); })
    .then(data => {
      if (!Array.isArray(data.testimonials)) return;
      const published = data.testimonials.filter(item => item.published !== false);
      if (!published.length) return;
      grid.replaceChildren();
      for (const item of published) {
        const card = document.createElement('blockquote'); card.className = 'testimonial';
        const quote = document.createElement('p'); quote.textContent = `“${item.quote || ''}”`;
        const attribution = document.createElement('footer');
        attribution.textContent = `— ${item.name || 'Client'}${item.role ? ', ' + item.role : ''}`;
        card.append(quote, attribution); grid.append(card);
      }
    }).catch(() => { /* Retain HTML testimonials if the feed is unavailable. */ });
});
