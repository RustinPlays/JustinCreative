JUSTIN CREATIVE — AV TOOLS HERO BUTTON
Ready-to-upload website update. NO PYTHON REQUIRED.

Source: Current main branch of https://github.com/RustinPlays/JustinCreative

WHAT THIS DOES
Adds an AV Tools button directly beside the existing "What I do" and
"Start a project" buttons in the home page hero. It has exactly the same
outline button styling as "Start a project" and links to downloads.html
(https://justincreative.tech/downloads).

FILES TO REPLACE AT THE GITHUB REPOSITORY ROOT
  index.html       - updated homepage with AV Tools button in HTML
  site-config.js   - same existing tool listings; removes old JS button
                     insertion so the homepage does not rely on it

Nothing else needs to be replaced. The existing downloads.html and
admin/index.html pages were already present in the repository when this
package was made. These files and the shared site styles remain unchanged.

TO UPLOAD
1. Extract this ZIP on your computer.
2. Open https://github.com/RustinPlays/JustinCreative
3. Replace index.html and site-config.js in the main/root folder with
   the two files in this ZIP, and commit the changes.
   You can use GitHub's Add file > Upload files if it accepts replacement
   files, or open each existing file and use Edit (pencil) to replace
   its contents before committing.
4. If Cloudflare Pages auto-deploys from GitHub, wait for its deployment
   to complete. Otherwise deploy the latest main branch.
5. Visit https://justincreative.tech and hard-refresh (Ctrl+F5).
6. Click AV Tools, which should open your Tools & Downloads page.

NOTE
This package does not add a working secure admin login. The existing
/admin page remains a placeholder. Windows application downloads are
not added until the actual build files are available.

Changes limited to the two files above; no Python scripts or installs.
