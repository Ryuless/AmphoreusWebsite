import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { Arrow } from '../../components/Arrow'
import { BrandMark } from '../../components/BrandMark'
import { ThemeToggle } from '../../components/ThemeToggle'
import { Login } from './Login'
import { Editor } from './Editor'

const adminSections = ['events', 'staff', 'gallery', 'agenda', 'site']

export function AdminPanel({ content, syncState, syncError, saveSite, saveItem, removeItem, section }) {
  const tab = adminSections.includes(section) ? section : 'events'
  const [siteDraft, setSiteDraft] = useState(null)
  const [user, setUser] = useState(auth.currentUser)
  const siteForm = siteDraft || content.site

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  if (!user) return <Login onLogin={() => setUser(auth.currentUser)} />

  async function saveSiteForm(event) {
    event.preventDefault()
    if (await saveSite(siteForm)) setSiteDraft(null)
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="brand" href="/home"><BrandMark small /><span>amphoreus<br /><em>control room</em></span></a>
        <div className="admin-header__actions">
          <ThemeToggle />
          <div className="admin-status"><span className={`status-dot status-dot--${syncState}`} /> {syncState === 'synced' ? 'Firestore synced' : syncState === 'syncing' ? 'Saving to Firestore' : syncState === 'error' ? 'Firestore error' : 'Local draft'} <button type="button" onClick={() => signOut(auth)}>Sign out</button></div>
        </div>
      </header>
      {syncError && <p className="admin-sync-error" role="alert">Sync failed: {syncError}</p>}
      <div className="admin-heading"><div><p className="eyebrow">Private route · content management</p><h1>Shape the <i>constellation.</i></h1></div><p>Changes are saved to the local draft immediately and mirrored to Firestore when the council connection is available.</p></div>
      <div className="admin-tabs" role="tablist">
        {adminSections.map((name) => <a className={tab === name ? 'is-active' : ''} href={`/celestial-control/${name}`} key={name} role="tab" aria-selected={tab === name}>{name}</a>)}
      </div>
      {tab === 'site'
        ? <form className="site-editor" onSubmit={saveSiteForm}>
          <div><p className="eyebrow">Public voice</p><h2>Site profile</h2><p>Keep the front door honest, warm, and recognisably Amphoreus.</p></div>
          <label>Eyebrow<input value={siteForm.eyebrow} onChange={(event) => setSiteDraft({ ...siteForm, eyebrow: event.target.value })} required /></label>
          <label>Intro<textarea value={siteForm.intro} onChange={(event) => setSiteDraft({ ...siteForm, intro: event.target.value })} required /></label>
          <label>Bio<textarea value={siteForm.bio} onChange={(event) => setSiteDraft({ ...siteForm, bio: event.target.value })} required /></label>
          <button className="button button--dark" type="submit">Save public profile <Arrow /></button>
        </form>
        : <Editor key={tab} type={tab} items={content[tab]} onSave={saveItem} onDelete={removeItem} />}
    </main>
  )
}
