import { useState } from 'react'
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import { Button } from '../ui'

export default function RegisterForm({ agreed, setModal, setPage, setToast, setAuthenticated, setMember, setRulesOpen, close }) {
  const [googleUser, setGoogleUser] = useState(null)
  const [busy, setBusy] = useState(false)
  const registerWithGoogle = async () => {
    try {
      sessionStorage.setItem('amphoreus-google-registration', '1')
      const credential = await signInWithPopup(auth, new GoogleAuthProvider())
      setGoogleUser(credential.user)
      setToast('Google terhubung. Lengkapi data profil untuk menyelesaikan register.')
    } catch {
      sessionStorage.removeItem('amphoreus-google-registration')
      setToast('Register Google gagal atau dibatalkan.')
    }
  }
  const submit = async (event) => {
    event.preventDefault()
    if (!agreed) return setToast('Buka dan setujui aturan komunitas terlebih dahulu.')
    const form = new FormData(event.currentTarget)
    const email = googleUser?.email || form.get('email'); const password = form.get('password')
    setBusy(true)
    sessionStorage.setItem('amphoreus-registration', '1')
    try {
      const credential = googleUser ? { user: googleUser } : await createUserWithEmailAndPassword(auth, email, password)
      const member = { email, nickname: form.get('nickname'), discordNickname: form.get('discordNickname'), age: Number(form.get('age')), region: form.get('region'), role: 'member', level: 1 }
      await setDoc(doc(db, 'members', credential.user.uid), { uid: credential.user.uid, ...member, createdAt: serverTimestamp() }, { merge: true })
      sessionStorage.removeItem('amphoreus-google-registration')
      sessionStorage.removeItem('amphoreus-registration')
      setAuthenticated(true); setMember(member); setPage('profile'); setToast('Akun berhasil dibuat dan data member tersimpan.'); close()
    } catch (error) {
      const messages = {
        'auth/email-already-in-use': 'Email tersebut sudah terdaftar. Gunakan Register dengan Google atau Login.',
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/weak-password': 'Password minimal 6 karakter.',
        'permission-denied': 'Database menolak penyimpanan. Periksa Firestore Security Rules.',
        'failed-precondition': 'Firestore belum siap. Buat database Firestore terlebih dahulu.',
        unavailable: 'Firestore sedang tidak tersedia. Periksa koneksi internet lalu coba lagi.',
        unauthenticated: 'Sesi autentikasi berakhir. Hubungkan kembali akun Google lalu coba lagi.',
      }
      console.error('Member registration failed:', error)
      setToast(messages[error.code] || `Pendaftaran gagal (${error.code || 'unknown-error'}). Periksa Firebase Console.`)
      sessionStorage.removeItem('amphoreus-registration')
    } finally {
      setBusy(false)
    }
  }
  return <form onSubmit={submit}>{googleUser ? <><label>Email Google<input type="email" name="email" value={googleUser.email} readOnly /></label><p className="auth-note">Akun memakai keamanan Google. Password Google tidak dibagikan ke website.</p></> : <><label>Email<input type="email" name="email" required placeholder="nama@email.com" /></label><label>Password<input type="password" name="password" minLength="6" required placeholder="Minimal 6 karakter" /></label></>}<label>Nickname<input name="nickname" required /></label><label>Discord nickname<input name="discordNickname" required /></label><div className="form-row"><label>Umur<input type="number" name="age" min="13" required /></label><label>Provinsi dan daerah<input name="region" required /></label></div><label className="check-label"><input type="checkbox" checked={agreed} onClick={(event) => { event.preventDefault(); setRulesOpen(true) }} onChange={() => {}} /><span>Saya menyetujui <button type="button" onClick={() => setRulesOpen(true)}>aturan komunitas</button></span></label>{!googleUser && <button type="button" className="google-button" onClick={registerWithGoogle}>G <span>Register dengan Google</span></button>}<Button>{busy ? 'Memproses...' : googleUser ? 'Simpan data member' : 'Buat akun'}</Button><p className="switch-form">Sudah punya akun? <button type="button" onClick={() => setModal('login')}>Masuk di sini</button></p></form>
}
