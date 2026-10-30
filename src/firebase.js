import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBXC7DeIm7aqgvoseep27DP3kfcZtcEVMs',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'amphoreusuniverse.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'amphoreusuniverse',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'amphoreusuniverse.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1030309696709',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || '1:1030309696709:web:d0f33e36b1c699e94eccac',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
