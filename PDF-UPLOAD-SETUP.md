# Information Links PDF uploads

The website UI is in `forms.html`. PDFs are sent to the `uploadInformationPdf`
Firebase function, which verifies the signed-in account, validates the file, and
commits it to `assets/pdfs/<sha256>.pdf` in Xlyneve/CEP on main. The existing GitHub
Actions workflow publishes that commit to Firebase Hosting. PDF bytes never go to
Firebase Storage or Firestore; Firestore stores the saved link and its metadata.

## One-time setup on your computer

Use Node.js 22 and open Terminal in your local CEP repository. Pull the latest main:

```sh
git pull origin main
npm --prefix functions ci
npx firebase-tools@14 login
```

The Firebase project must use the Blaze plan to deploy Cloud Functions. Function
requests, build artifacts, Secret Manager, Firestore metadata and Hosting have
their own quotas/pricing, even though Firebase Storage is not used for PDFs.

1. At <https://github.com/settings/personal-access-tokens/new>, create a **fine-grained
   personal access token** owned by Xlyneve. Select **Only select repositories → CEP**.
2. Under **Repository permissions**, give **Contents → Read and write**. Metadata
   read access is automatic. No other repository permissions are needed.
3. Choose an expiration you can maintain and copy the token. Do not put it in a
   JavaScript file, commit, chat message or a shell command argument.
4. Run this command and paste the token only into Firebase's hidden secret prompt:

```sh
npx firebase-tools@14 functions:secrets:set CEP_PDF_GITHUB_TOKEN --project cepx-f9d2a
```

Deploy the function:

```sh
npx firebase-tools@14 deploy --only functions:pdfuploads --project cepx-f9d2a
```

Accept prompts to enable the required Google Cloud APIs if shown. The deploying
Google account needs permission to deploy Cloud Functions, use the runtime service
account, and create/access the secret. If deployment fails, use the exact error to
fix the missing access rather than loosening the upload function's account check.

If Firebase asks about an artifact cleanup policy, choose a short retention such
as one day. Keep the function's public invocation setting: Firebase ID-token
verification inside the handler restricts actual uploads to the approved account.

## Check it

Sign into the website as xeve06@gmail.com. Open Information Links, press **+**, then
**Upload PDF**. Choose a non-sensitive PDF up to 5 MB, enter its title and save.
The UI reports when GitHub has saved it and waits for Hosting to publish it. This
can take a minute or two. The saved card works in the browser preview and in both
search locations. If publishing takes longer, the entry remains saved; reopen it
after the existing Hosting workflow finishes.

PDF URLs are public once deployed, including PDFs uploaded into a private GitHub
repository. Do not upload patient information, passwords or other private files.
Only upload files you are entitled to publish. Deleting a saved link currently
removes the Information Links entry, not its PDF file or GitHub version history.

## Maintaining access

When the GitHub token expires or is rotated, set the secret again using the same
command above, then redeploy `functions:pdfuploads`. Existing PDF links continue
working without the upload function or token. GitHub Actions must stay enabled on
the CEP repository for new PDF commits to reach the website.

The browser stores no GitHub credential. The function accepts uploads only from
the verified approved Firebase account and only creates content-addressed files
under `assets/pdfs/`; it cannot receive an arbitrary repository or destination path.
