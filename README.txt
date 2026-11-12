JustinCreative website update — 12 November 2026

1. Copy downloads.html and the admin/ folder into the ROOT of RustinPlays/JustinCreative.
2. Copy apply_homepage_changes.py into that same root.
3. Run: python apply_homepage_changes.py (requires Python 3).
4. Commit/push the resulting index.html, sitemap.xml, downloads.html, and admin/index.html to main.
5. Open https://justincreative.tech/downloads and https://justincreative.tech/admin/ after GitHub Pages deploys.

IMPORTANT: /admin is currently a PUBLIC PLACEHOLDER PAGE, not a secure admin interface.
It stores no passwords, data or photos, and should not be treated as private.
Before adding uploading or editing, set up authenticated server-side access and protect any files/data at the origin.
The site's GitHub Pages source remains public; a Cloudflare Access gate alone does not make public GitHub repo content private.

The GitHub app connection in this conversation has read permission but returns HTTP 403 on write; no live changes were made.

To activate downloads later, replace the pending span elements in downloads.html with verified <a href="..."> download links.
