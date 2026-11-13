# Justin Creative website

Static Cloudflare Pages website deployed from `RustinPlays/JustinCreative` on `main`.

- Admin editor: `https://justincreative.tech/admin/`
- Admin configuration: `admin/config.yml`
- GitHub OAuth server functions: `functions/api/auth.js` and `functions/api/callback.js`
- See `ADMIN-SETUP.md` for GitHub OAuth and Cloudflare configuration.

Use Cloudflare **Pages** for the main site; Workers Builds is a separate project. Cloudflare Pages Functions need a Git-connected Pages deployment (or compatible Wrangler deployment) to work.
