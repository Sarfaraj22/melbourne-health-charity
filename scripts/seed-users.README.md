# Seed RBAC test users

This script creates three Firebase Authentication test users and sets their
`role` custom claim, which the app reads for Role-Based Access Control (RBAC).

The script uses the Firebase Admin SDK. It never runs in the browser and the
service account key is **never committed** to the repository.

## Prerequisites

1. Install dev dependencies (already listed in `package.json`):

   ```sh
   npm install
   ```

2. Download a Firebase service account JSON:
   - Firebase Console → Project settings → Service accounts → Generate new
     private key.
   - Save it somewhere **outside** this repository (e.g. `~/keys/mhc-sa.json`).
   - The path pattern `service-account*.json` is gitignored, so a key placed
     inside the repo will not be committed either.

## Running

```sh
export FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json
npm run seed:users
```

The script is idempotent for users: if a user already exists it reuses the
existing account and only re-applies the `role` custom claim. It does **not**
reset passwords for existing accounts — to change a password, delete the user
in the Firebase Console and re-run the script.

## Test accounts

| Role      | Email                                   | Password           | Display name | Lands on            |
| --------- | --------------------------------------- | ------------------ | ------------ | ------------------- |
| user      | user@melbournehealthcharity.org.au      | TestUser2026!      | Emily Dawson | `/dashboard`        |
| volunteer | volunteer@melbournehealthcharity.org.au | TestVolunteer2026! | Sam Rivera   | `/volunteer/portal` |
| admin     | admin@melbournehealthcharity.org.au     | TestAdmin2026!     | Admin User   | `/admin/dashboard`  |

> These are demo credentials for local QA only. Do not reuse them in
> production. Rotate or delete them before any production deploy.
