# Deployment Guide — dongshan.in

This site is hosted on **Cloudflare Pages** (project: `dongshan-construction`)
and deployed automatically via **GitHub Actions** whenever you push to `master`.

---

## Make a change and deploy

```bash
# 1. Edit files (index.html, sitemap.xml, etc.)

# 2. Review what you changed
git status
git diff

# 3. Commit
git add <files-you-changed>
git commit -m "Short message describing the change"

# 4. Push — this triggers the auto-deploy
git push origin master
```

That's it. Within ~30 seconds, a GitHub Action runs and deploys the change.

**Watch the deploy in real time:**
https://github.com/raigaurav0511/dongshan-construction/actions

**Verify it's live:** Open https://www.dongshan.in/ and hard-refresh (Cmd+Shift+R).

---

## What happens behind the scenes

When you push to `master`:

1. GitHub triggers the workflow at `.github/workflows/deploy.yml`
2. The workflow runs `wrangler pages deploy . --project-name=dongshan-construction --branch=master`
3. Cloudflare uploads the files to its edge network
4. Changes go live on `dongshan.in` within seconds of the workflow finishing

The workflow uses two repository secrets stored at
https://github.com/raigaurav0511/dongshan-construction/settings/secrets/actions:

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with `Cloudflare Pages: Edit` permission
- `CLOUDFLARE_ACCOUNT_ID` — `e07ef046838c0d3b9d452410bd61e6be`

---

## Manual deploy (fallback)

If GitHub Actions is ever broken or you need to deploy without committing:

```bash
npx wrangler pages deploy . --project-name=dongshan-construction --branch=master --commit-dirty=true
```

You must be logged in (`npx wrangler login`) and have access to the Cloudflare
account `rai.gaurav0511@gmail.com`.

---

## If the deploy fails

1. Open the failed run at https://github.com/raigaurav0511/dongshan-construction/actions
2. Click on the failed run, then on the `deploy` job to see the error
3. Common causes:
   - **Auth error** — `CLOUDFLARE_API_TOKEN` expired or was revoked. Create a new one
     at https://dash.cloudflare.com/profile/api-tokens (permissions: `Cloudflare Pages: Edit`,
     `Account Settings: Read`, `User Details: Read`) and update the GitHub secret.
   - **Build error** — usually an issue with the files in the repo. Fix locally, recommit, push.

---

## Why GitHub Actions instead of Cloudflare's native Git integration

Cloudflare Pages can normally auto-deploy by watching the GitHub repo directly,
but that webhook was deleted at some point on this project. Cloudflare's new
unified Workers/Pages dashboard hides the reconnect option, so we switched to
GitHub Actions instead. It is more visible (logs in GitHub), more reproducible,
and not dependent on Cloudflare's UI changes.

---

## Files that affect SEO — handle with care

- **`sitemap.xml`** — Lists the homepage for Google to crawl. Keep it to real
  pages (no `#hash` anchors — those are not separate pages).
- **`robots.txt`** — Tells crawlers what to allow/block. Already blocks
  `/hiring-admin.html`, `/functions/`, `/api/`.
- **`index.html` `<head>` block** — Title, meta description, Open Graph,
  Twitter Card, and JSON-LD schema. If you change page titles or descriptions,
  preview them at https://www.linkedin.com/post-inspector/ after deploy.
- **`hiring-admin.html`** — Has `<meta name="robots" content="noindex, nofollow">`.
  Do not remove this — the page must stay out of search results.

After major SEO changes, optionally request re-indexing at
https://search.google.com/search-console (URL Inspection → Request Indexing).
