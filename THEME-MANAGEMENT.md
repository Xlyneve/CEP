# Website-wide theme deletion

The Home theme manager's Delete button uses a Firebase HTTPS function. It verifies the signed-in account (`xeve06@gmail.com`, verified email), removes the selected theme's catalog entry, palette, header colour and CSS branches from GitHub `Xlyneve/CEP` on `main`, and lets the existing push workflow deploy Hosting. Aurora's dedicated background asset is also removed. Original cannot be deleted. Git history remains available for recovery.

Deletion starts immediately; deployment takes the normal GitHub/Firebase build time. The UI reports GitHub removal separately from deployment completion, and reloads only after a successful deployment. Other devices use Original if their selected theme no longer exists. There are no background polls while idle and no Firestore reads or writes.

## Required server setup

Firebase project `cepx-f9d2a` needs the Blaze plan for Cloud Functions. The existing Hosting service account is not sufficient evidence that Functions deployment and Secret Manager permissions are granted.

Create a fine-grained GitHub personal access token scoped only to `Xlyneve/CEP`, with Contents: read/write and Actions: read. Store it only in Firebase Secret Manager under `THEME_GITHUB_TOKEN`:

```
firebase functions:secrets:set THEME_GITHUB_TOKEN --project cepx-f9d2a
```

Enter the token at the CLI's secret prompt; do not put it in this repository, browser code or chat. Configure an expiration and rotate the secret before expiry.

Then deploy from a trusted checkout with an authenticated Firebase CLI:

```
npm ci --prefix functions
firebase deploy --only functions:themeManagement,hosting --project cepx-f9d2a
```

Deploy the function before enabling the new button/Hosting rewrite. Routine theme deletions only change `page-theme.js` and optional Aurora artwork; the existing Hosting workflow handles them. No new credential is stored in the browser.

## Verification

Run `npm test --prefix functions` for removal and authorization tests. Verify authenticated access to the live endpoint with an invalid theme (`original`); it must return 400 and must not create any commits. An unauthenticated POST must return 401. A real deletion is destructive to the current source, so do not delete a user's theme as a test.
