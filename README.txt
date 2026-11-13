JUSTIN CREATIVE - AV TOOLS HOMEPAGE BUTTON (NO PYTHON)

<!-- Trigger Cloudflare Pages deployment -->

====================================================
This update modifies ONLY the main homepage index.html file.
It comes directly from the GitHub main branch as checked on 13 November 2026.

CHANGES
- The existing What I do and Start a project buttons are kept.
- AV Tools sits directly beside them in the hero row on desktop.
- AV Tools opens downloads.html (justincreative.tech/downloads).
- Smaller screens stack the three hero buttons cleanly.
- Does not require any edits to site-config.js or styles.css.

INSTALL
1. Open https://github.com/RustinPlays/JustinCreative
2. Click the index.html file (in the repository root).
3. Click the pencil/edit icon.
4. Easier alternative: delete the old index.html in your GitHub file editor,
   then add/upload the new index.html at the root of main.
   Be sure to use the same filename, not a nested folder.
5. Commit the change to main.
6. Cloudflare Pages > your website project > Deployments: check the latest
   production deployment has finished successfully for the new commit.
7. Reload https://justincreative.tech/ with Ctrl+Shift+R.

IMPORTANT
- Upload index.html to the top level beside styles.css, not to /admin/ or /assets/.
- If GitHub shows the new AV Tools link but the live site still does not,
  check which Cloudflare Pages project/repo/branch the custom domain is using.
- No changes are needed in Cloudflare DNS for /downloads.
