# Justin Creative website

A dependency-free creative portfolio, production hub, tool directory and merch storefront for Justin Creative. It is built with plain HTML, CSS and JavaScript, so it can be hosted directly on GitHub Pages.

## Preview locally

From this folder, run:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173`.

## Pages

- `index.html` — creative services, lighting hire and the AV tool directory
- `creative.html` — Creative Work hub for photography, video, editing and graphic design
- `photography.html` — photography services, portfolio link and client FAQs
- `videography.html` — video production, editing and client FAQs
- `av.html` — AV support, published project credits, tools and event FAQs
- `lighting.html` — expandable lighting packages, real equipment and package enquiry links
- `booking.html` — adaptive Query / Booking form
- `merch.html` — Fourthwall-powered merch collection
- `404.html` — custom missing-page screen with links back into the site

Home and Creative Work have separate navigation entries. Creative Work also has a keyboard-accessible dropdown for Photography, Video & Editing and Graphic Design (the `creative.html#design` section). Merch remains in the footer, including on mobile.

The Selected Work cards on Home use the six supplied illustrations in `assets/branding`: `concert-photography.png`, `event-lighting.png`, `poster-design.png`, `video-production.png`, `brand-design.png` and `av-technical.png`. They link to the matching service pages. The Creative Work hub reuses the photography, video and design illustrations. Keep these decorative service illustrations distinct from photographs of completed client work.

## Search and link previews

Every page includes static Open Graph and Twitter metadata plus JSON-LD for Justin Creative. The shared preview is `assets/branding/social-card.png` (1200 × 630). Metadata is in the HTML so crawlers can read it without JavaScript.

`sitemap.xml` and `robots.txt` use the production domain `https://justincreative.tech`. Canonicals use its existing extensionless routes (for example `/av`, where `/av.html` redirects on the current host). Keep the canonical URL, `og:url`, JSON-LD page URL and sitemap entry together when adding or renaming a page. A host using only `.html` URLs needs these values updated or matching extensionless routes configured.

The 404 page is excluded from the sitemap and marked `noindex`. Its asset and navigation paths start at the site root so they work for missing nested paths; the skip link stays on the error page. Configure any replacement host to return this file with HTTP status 404. Python's basic preview server shows its own error document for missing paths; open `/404.html` to preview the custom screen locally.

The AV credibility section uses existing public credits for Rockstok Live and United Against Cancer Gala. Add other client or venue names only when their public use is confirmed. FAQ deadlines, revision counts, usage, raw files and overtime are confirmed per quote rather than advertised as fixed package terms.

## Formspree

The booking form uses the Vanilla JS/AJAX integration for form ID `xaeyjbve`, with a normal HTML `POST` action as a no-JavaScript fallback. The form changes between project-booking and general-query fields without sending hidden fields.

## Connect tools and merch

Edit `site-config.js` when the destination links are ready:

```js
window.JUSTIN_SITE = {
  tools: [
    { name: "AV Planner", description: "Plan rooms, devices and signal flow.", url: "https://..." }
  ],
  merch: {
    shopUrl: "https://justincreative-shop.fourthwall.com/en-nzd",
    collection: "all"
  }
};
```

Until a tool URL is added, the homepage displays `Link coming`. The connected Fourthwall shop is `https://justincreative-shop.fourthwall.com/en-nzd` and its live `all` collection populates the merch page.

The merch page reads Fourthwall's public collection JSON feed from:

```text
{shopUrl}/collections/{collection}.json
```
