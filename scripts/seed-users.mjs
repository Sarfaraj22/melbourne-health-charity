// Seed script: creates RBAC test users in Firebase Authentication and sets
// their `role` custom claim. Run with a service account key (never committed).
//
// Usage:
//   export FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json
//   node scripts/seed-users.mjs
//
// See scripts/seed-users.README.md for full instructions and test credentials.

/* eslint-disable no-console -- dev-time seed script, console output is intentional */

import { readFileSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const serviceAccountPath = process.env['FIREBASE_SERVICE_ACCOUNT_PATH']
if (!serviceAccountPath) {
  console.error(
    'Missing FIREBASE_SERVICE_ACCOUNT_PATH environment variable. ' +
      'Set it to the absolute path of your Firebase service account JSON.',
  )
  process.exit(1)
}

let serviceAccount
try {
  const raw = readFileSync(serviceAccountPath, 'utf8')
  serviceAccount = JSON.parse(raw)
} catch (error) {
  console.error(`Unable to read service account JSON at "${serviceAccountPath}":`, error)
  process.exit(1)
}

initializeApp({
  credential: cert(serviceAccount),
})

const auth = getAuth()

const seedUsers = [
  {
    email: 'user@melbournehealthcharity.org.au',
    password: 'TestUser2026!',
    displayName: 'Emily Dawson',
    role: 'user',
  },
  {
    email: 'volunteer@melbournehealthcharity.org.au',
    password: 'TestVolunteer2026!',
    displayName: 'Sam Rivera',
    role: 'volunteer',
  },
  {
    email: 'admin@melbournehealthcharity.org.au',
    password: 'TestAdmin2026!',
    displayName: 'Admin User',
    role: 'admin',
  },
]

async function getOrCreateUser({ email, password, displayName }) {
  try {
    return await auth.getUserByEmail(email)
  } catch {
    return await auth.createUser({ email, password, displayName })
  }
}

async function main() {
  for (const seed of seedUsers) {
    const user = await getOrCreateUser(seed)
    await auth.setCustomUserClaims(user.uid, { role: seed.role })
    console.log(
      `Seeded ${seed.email} -> uid=${user.uid} role=${seed.role} displayName="${seed.displayName}"`,
    )
  }
  console.log('Seed complete.')
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
