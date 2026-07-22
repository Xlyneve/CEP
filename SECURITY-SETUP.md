# CEP security setup

The code now uses Firebase Authentication and permits only `xeve06@gmail.com`.
The live Firebase projects must be configured before these changes are published:

- `cepx-f9d2a`
- `notes-chat-c5ff3`
- `notes-bcba6`
- `nurse-prescribing-notes`
- `krissa-d5a9c`

## Firebase Console steps

1. Open each Firebase project listed above.
2. Go to **Build → Authentication → Sign-in method**.
3. Enable **Google** and set the support email. `notes-bcba6` currently also
   uses email/password sign-in; it may remain enabled during migration.
4. Go to **Authentication → Settings → Authorized domains** and confirm
   `xlyneve.github.io` is present.
5. Deploy `firestore.rules` separately to every project. Review the rules before
   deploying and repeat the final two commands for each project ID:

   ```powershell
   firebase login
   firebase use cepx-f9d2a
   firebase deploy --only firestore:rules

   firebase use notes-chat-c5ff3
   firebase deploy --only firestore:rules

   firebase use notes-bcba6
   firebase deploy --only firestore:rules

   firebase use nurse-prescribing-notes
   firebase deploy --only firestore:rules

   firebase use krissa-d5a9c
   firebase deploy --only firestore:rules
   ```
6. The `notes-chat-c5ff3` project also uses Firebase Storage. Deploy its storage
   rules after reviewing them:

   ```powershell
   firebase use notes-chat-c5ff3
   firebase deploy --only storage
   ```

## Safe rollout order

Use a short maintenance window. Enable Google sign-in first, deploy the
Firestore rules, and then publish the website code immediately. Deploying the
rules first may briefly prevent the old site from loading data, but it avoids
leaving anonymous database access available during the transition. Do not
delete the old `settings/password` document until the new sign-in has been
verified; the new code no longer reads it.

## Recovery

If sign-in fails, restore the previous GitHub Pages deployment while diagnosing
the Firebase Authentication configuration. Do not weaken the Firestore rules to
anonymous access as a workaround.
