# Justin Creative — Hybrid Admin + R2 Gallery (GitHub-ready)

These are replacement/addition files for your existing `RustinPlays/JustinCreative` **Cloudflare Pages** site. We inspected the repository's `admin/index.html`, `admin/config.yml`, `events.js`, `events.html`, and existing Pages GitHub OAuth endpoints. **Do not delete your existing website files.**

## 1. Upload to GitHub

Download the ZIP and extract it. Upload **the contents** into the repository root, keeping folders exactly as in the ZIP. Commit on `main`:

- `admin/index.html` — replaces the existing admin landing page; Decap CMS for GitHub edits stays.
- `admin/config.yml` — replaces config, preserving events/testimonials for GitHub.
- `admin/gallery.html`, `gallery-admin.js`, `gallery-admin.css` — new gallery manager.
- `functions/api/gallery/` — Cloudflare Pages Functions for public catalog, secure R2 upload/edit.
- `events.js` — replaces old Events JS; combines existing GitHub event feed with Cloudflare R2 galleries.
- `gallery/index.html` and `gallery/gallery.js` — public full-photo-album page.

Existing `functions/api/auth.js` and `functions/api/callback.js` **remain in place** and are still needed for GitHub CMS login.

## 2. Create Cloudflare R2 bucket

In Cloudflare dashboard > R2 Object Storage, create bucket `justincreative-gallery` (Standard). In bucket Settings > Custom Domains add `photos.justincreative.tech` and enable public access. Allow the domain to become active. This domain serves **photos**, not album HTML. Cloudflare may require billing details to activate R2, even when staying within its free tier.

## 3. Cloudflare Pages binding and variables

In the existing **Cloudflare Pages** project for `justincreative.tech` (not a separate Worker), go to Settings > Bindings > Add > R2 bucket, using variable name **`GALLERY_BUCKET`**, and select the bucket `justincreative-gallery`.

In Pages Settings > Variables and Secrets configure Production:

| Name | Example/value |
|---|---|
| `PHOTOS_BASE_URL` | `https://photos.justincreative.tech` |
| `CF_ACCESS_TEAM_DOMAIN` | `yourteam.cloudflareaccess.com` (exact Access team domain, no scheme) |
| `CF_ACCESS_AUD` | Audience (AUD) tag from the Access application protecting the admin/API |
| `ADMIN_EMAIL` | your email address which you use to sign in to Cloudflare Access |

Existing GitHub OAuth variables must remain: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `OAUTH_STATE_SECRET`.

**Never put credentials into JavaScript, GitHub files, or public browser settings.** Redeploy Pages after adding bindings/variables.

## 4. Secure admin with Cloudflare Zero Trust Access

Cloudflare Zero Trust > Access > Applications > Add application > Self-hosted. Set your public hostname to `justincreative.tech`. Create **two self-hosted Access applications** (or two application policies), using your admin email as the only allowed identity:

1. Hostname `justincreative.tech`, path `/admin/*` — protects the visual admin dashboard. The existing Decap CMS remains available after Access login.
2. Hostname `justincreative.tech`, path `/api/gallery/*` — protects **all** editing endpoints. Copy **this application's AUD** to `CF_ACCESS_AUD`. All API requests require an authenticated user and are additionally JWT-verified by the Pages Functions.

The public gallery catalog is instead deliberately on `/api/public-gallery`, **outside** the protected `/api/gallery/*` route, so visitors can browse event albums without signing in.

## 5. Verify

- `https://justincreative.tech/admin/` — existing GitHub CMS, with a new link to R2 gallery manager.
- `https://justincreative.tech/admin/gallery.html` — create an event and upload photos.
- `https://justincreative.tech/events.html` — existing cards plus R2 galleries.
- `https://justincreative.tech/gallery/` — all full albums.
- `https://justincreative.tech/api/public-gallery` — public JSON of published albums (should load without login).
- `https://justincreative.tech/gallery/?event=EVENT-SLUG` — a particular album.

Initially the full album is on your main domain. Later, to use `gallery.justincreative.tech`, create a separate Pages project or domain routing for the same gallery interface. Do not simply attach that hostname to R2 because R2 serves objects, not the album viewer.

## How publishing routes automatically

- **Testimonials and legacy website events**: `/admin/` Decap CMS > GitHub commit > Cloudflare Pages deploy.
- **New gallery events and photos**: `/admin/gallery.html` > authenticated Pages Functions > R2 catalog and image objects > instantly visible on Events page.

Changes in the two repositories of content are separate by design. New R2 galleries do not also create GitHub commits (avoiding duplicate entries and deploys).

## Known constraints

- Bulk upload uses sequential requests, up to 500 files at once. Images must be <=10 MB; photos should ideally be resized before upload. Browser tab must stay open during uploads.
- No automatic resizing or thumbnail generation in this version. Large images will increase bandwidth and page load times. Cloudflare R2 usage above the free-tier thresholds is billable.
- Deleting an **event** doesn't delete its R2 image objects automatically (safety to avoid accidental loss); remove images first or clean up R2 objects manually.
- GitHub CMS login still depends on existing OAuth setup; no assumption has been made that the live callback currently works.
- Gallery management is functional **after** you configure R2 binding, custom domain, Access and deploy. It cannot be validated end-to-end without those live resources.
