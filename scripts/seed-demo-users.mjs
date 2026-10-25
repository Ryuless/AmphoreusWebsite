import crypto from 'node:crypto'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const roles = [
  {
    role: 'Primodial',
    email: 'demo.primodial@amphoreus.test',
    nickname: 'Astra Primodial',
    discordNickname: 'AstraPrimodial',
    region: 'DKI Jakarta',
    permissions: ['overview', 'members', 'access', 'justice', 'social'],
  },
  {
    role: 'Titan',
    email: 'demo.titan@amphoreus.test',
    nickname: 'Kirana Titan',
    discordNickname: 'KiranaTitan',
    region: 'Jawa Barat',
    permissions: ['overview', 'members', 'social'],
  },
  {
    role: 'Olimpus',
    email: 'demo.olimpus@amphoreus.test',
    nickname: 'Raden Olimpus',
    discordNickname: 'RadenOlimpus',
    region: 'Jawa Timur',
    permissions: ['overview', 'justice'],
  },
  {
    role: 'Demigod',
    email: 'demo.demigod@amphoreus.test',
    nickname: 'Sera Demigod',
    discordNickname: 'SeraDemigod',
    region: 'Bali',
    permissions: ['overview', 'social'],
  },
]

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Environment variable ${name} belum diisi.`)
  return value
}

function createPassword() {
  return `Amphoreus-${crypto.randomBytes(9).toString('base64url')}!`
}

function getAdminApp() {
  if (getApps().length) return getApps()[0]
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (serviceAccount) {
    return initializeApp({ credential: cert(JSON.parse(serviceAccount)) })
  }
  return initializeApp({
    credential: cert({
      projectId: requiredEnv('FIREBASE_PROJECT_ID'),
      clientEmail: requiredEnv('FIREBASE_CLIENT_EMAIL'),
      privateKey: requiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    }),
  })
}

async function findOrCreateUser(auth, email, password, nickname) {
  try {
    return { user: await auth.getUserByEmail(email), password: null }
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error
    return { user: await auth.createUser({ email, password, displayName: nickname }), password }
  }
}

async function seed() {
  const app = getAdminApp()
  const auth = getAuth(app)
  const db = getFirestore(app)
  const credentials = []

  for (const profile of roles) {
    const password = createPassword()
    const { user, password: createdPassword } = await findOrCreateUser(auth, profile.email, password, profile.nickname)
    await auth.setCustomUserClaims(user.uid, { role: profile.role, permissions: profile.permissions })
    await db.collection('members').doc(user.uid).set({
      uid: user.uid,
      email: profile.email,
      nickname: profile.nickname,
      discordNickname: profile.discordNickname,
      age: 20,
      region: profile.region,
      role: profile.role,
      level: 10,
      permissions: profile.permissions,
      isDemo: true,
      updatedAt: FieldValue.serverTimestamp(),
      ...(createdPassword ? { createdAt: FieldValue.serverTimestamp() } : {}),
    }, { merge: true })
    credentials.push({ role: profile.role, email: profile.email, password: createdPassword || '(akun sudah ada; password tidak diubah)' })
  }

  console.log('\nAkun demo berhasil disiapkan:')
  console.table(credentials)
  console.log('Simpan output password dengan aman. Password hanya ditampilkan saat akun baru dibuat.\n')
}

seed().catch((error) => {
  console.error('Seed demo gagal:', error.message)
  process.exitCode = 1
})
