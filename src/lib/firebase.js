import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBXC7DeIm7aqgvoseep27DP3kfcZtcEVMs',
  authDomain: 'amphoreusuniverse.firebaseapp.com',
  projectId: 'amphoreusuniverse',
  storageBucket: 'amphoreusuniverse.firebasestorage.app',
  messagingSenderId: '1030309696709',
  appId: '1:1030309696709:web:d0f33e36b1c699e94eccac',
})

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
