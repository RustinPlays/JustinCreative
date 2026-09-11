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
- `lighting.html` — expandable lighting packages, real equipment and package enquiry links
- `booking.html` — adaptive Query / Booking form
- `merch.html` — Fourthwall-powered merch collection

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
    shopUrl: "https://rustinplays.shop",
    collection: "all"
  }
};
```

Until a tool URL is added, the homepage displays `Link coming`. The connected Fourthwall shop is `https://rustinplays.shop` and its live `all` collection populates the merch page.

The merch page reads Fourthwall's public collection JSON feed from:

```text
{shopUrl}/collections/{collection}.json
```
