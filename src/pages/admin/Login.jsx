import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { Arrow } from '../../components/Arrow'
import { BrandMark } from '../../components/BrandMark'
import { ThemeToggle } from '../../components/ThemeToggle'

export function Login({ onLogin }) {
  const [email, setEmail] = useState('celestial@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch {
      setError('Sign-in failed. Check the council email and password, then try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-login">
      <ThemeToggle />
      <div className="login-emblem"><BrandMark /></div>
      <p className="eyebrow">Celestial control · private route</p>
      <h1>Welcome back,<br /><i>council member.</i></h1>
      <form onSubmit={submit}>
        <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--dark" type="submit" disabled={busy}>{busy ? 'Opening the door…' : 'Enter the control room'} <Arrow /></button>
      </form>
      <a className="back-link" href="/home">← Return to the public site</a>
    </main>
  )
}
