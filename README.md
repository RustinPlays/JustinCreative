# Justin Creative — Website

This is the public `justincreative.tech` website.

## Deployment
Upload the contents of this folder into the root of `RustinPlays/JustinCreative`, on `main` (or deploy this folder as the root of the public Cloudflare Pages site).

## Main files
- `index.html`: homepage
- `styles.css`: legacy component/section styles
- `polish.css`: shared visual system, loaded last on all public pages
- `site-config.js`: tool links, merch destination and editable testimonials
- `downloads.js`: renders the central downloads catalogue
- `events.js`: event gallery and filtering
- `content/events.json`, `content/testimonials.json`: admin-managed content

## Admin
The old `/admin/` page redirects to `https://admin.justincreative.tech/`. Admin is deployed separately with its own OAuth Pages Functions. See `ADMIN_SETUP.md` supplied with the deployment bundle.

## Known requirements
Verified public web tool links are listed; Windows download links must only be added when a live downloadable file is available. Cloudflare/GitHub OAuth cannot be validated through local static checks.
