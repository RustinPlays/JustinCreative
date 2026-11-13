# Justin Creative — same-site admin setup

Admin address: **https://justincreative.tech/admin/**
No new subdomain or Cloudflare project required. All files go into your existing `RustinPlays/JustinCreative` repository.

## Upload
1. If your cleaned website is already uploaded, use the small `JustinCreative-Admin-Only-Update.zip` file and upload its **contents** to the repository root (preserve `admin/` and `functions/api/` folders). If not, use `JustinCreative-Website-With-Admin.zip` for the complete website.
2. Commit to `main`. Wait for the **Cloudflare Pages** project to deploy; do not confuse it with the duplicate Workers project.
3. Open `https://justincreative.tech/admin/`. The editor should load even before login works.

## GitHub OAuth app
In GitHub > Settings > Developer settings > OAuth Apps, create or edit a GitHub OAuth App:
- Homepage URL: `https://justincreative.tech/`
- Authorization callback URL: `https://justincreative.tech/api/callback`
Use the GitHub **OAuth App**, not a GitHub App. Save its Client ID and Client Secret.

## Cloudflare Pages secrets
In your EXISTING `justincreative` **Pages** project (the one hosting `justincreative.pages.dev`), configure production environment variables / encrypted secrets:
- `GITHUB_CLIENT_ID`: GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth Client Secret
- `OAUTH_STATE_SECRET`: your own securely generated random secret (at least 32 characters)

Never commit these values to GitHub. Redeploy the Pages project after setting them. If your deployment is previewed at `pages.dev`, GitHub login is restricted to the production `justincreative.tech` hostname.

## Test
1. Visit `https://justincreative.tech/admin/`; choose Log in with GitHub.
2. Sign in using the authorised GitHub account `RustinPlays`. The callback rejects other GitHub usernames.
3. Create a small test testimonial or event; Publish; verify its GitHub commit in the `main` branch.
4. Confirm the changes appear on the public website after deployment. Photo uploads go to `assets/events/`.

## Troubleshooting
- `OAuth configuration missing` (503): Pages secrets are not configured or the new deployment has not picked them up.
- GitHub callback mismatch: OAuth App callback must be exactly `https://justincreative.tech/api/callback`.
- `/api/auth` returns 404: Functions were not included in the deployed Cloudflare Pages build. Confirm the main Pages project uses Git integration and `functions/` exists at the repository root.
- Editor loads but publish fails: check the signed-in GitHub account has write access to `RustinPlays/JustinCreative`, that branch `main` exists, and that the OAuth token was granted requested repository access.
- Red GitHub `Workers Builds` check: that comes from a separate Worker and is unrelated to the Pages admin functions.

## Security
GitHub OAuth asks for legacy `repo` scope, which grants broader repository access than just this single site; do not share tokens or secrets. GitHub permissions—not the unlisted admin footer link—control who can publish. Admin login and publishing cannot be fully validated until deployed with real OAuth credentials.
