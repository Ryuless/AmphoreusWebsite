import { useState } from 'react'
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import { Button } from '../ui'

export default function LoginForm({ setModal, setPage, setToast, setAuthenticated, close }) {
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = async (event) => {
    event.preventDefault(); setBusy(true)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const memberSnapshot = await getDoc(doc(db, 'members', credential.user.uid))
      if (!memberSnapshot.exists()) {
        await signOut(auth)
        return setToast('Email belum terdaftar sebagai member. Silakan register terlebih dahulu.')
      }
      setAuthenticated(true); setPage('profile'); close()
    }
    catch (error) { setToast(error.code === 'auth/invalid-credential' ? 'Email atau password salah.' : 'Login gagal. Periksa koneksi Firebase.') }
    finally { setBusy(false) }
  }
  const googleLogin = async () => {
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider())
      const memberSnapshot = await getDoc(doc(db, 'members', credential.user.uid))
      if (!memberSnapshot.exists()) {
        await signOut(auth)
        return setToast('Akun Google belum terdaftar sebagai member. Silakan gunakan Register Google.')
      }
      setAuthenticated(true); setPage('profile'); close()
    }
    catch { setToast('Login Google gagal atau dibatalkan.') }
  }
  const resetPassword = async () => {
    if (!email) return setToast('Masukkan email terlebih dahulu untuk reset password.')
    try { await sendPasswordResetEmail(auth, email); setToast('Link reset password sudah dikirim ke email Anda.') }
    catch { setToast('Email reset password gagal dikirim.') }
  }
  return <form onSubmit={submit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="nama@email.com" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Masukkan password" /></label><Button>{busy ? 'Memproses...' : 'Masuk'}</Button><button type="button" className="google-button" onClick={googleLogin}>G <span>Masuk dengan Google</span></button><button type="button" className="form-link" onClick={resetPassword}>Lupa email atau password?</button><p className="switch-form">Belum punya akun? <button type="button" onClick={() => setModal('register')}>Daftar sekarang</button></p></form>
}
