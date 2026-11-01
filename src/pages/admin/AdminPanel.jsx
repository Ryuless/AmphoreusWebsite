import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { Arrow } from '../../components/Arrow'
import { BrandMark } from '../../components/BrandMark'
import { ThemeToggle } from '../../components/ThemeToggle'
import { Login } from './Login'
import { Editor } from './Editor'

const adminSections = ['events', 'staff', 'gallery', 'agenda', 'carousel', 'site']

export function AdminPanel({ content, syncState, syncError, saveSite, saveItem, removeItem, section }) {
  const tab = adminSections.includes(section) ? section : 'events'
  const [siteDraft, setSiteDraft] = useState(null)
  const [user, setUser] = useState(auth.currentUser)
  const [authLoading, setAuthLoading] = useState(!auth.currentUser)
  const [saveNotice, setSaveNotice] = useState('')
  const siteForm = siteDraft || content.site

  useEffect(() => {
    sessionStorage.setItem('amphoreus-admin-active', '1')
  }, [])

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser)
    setAuthLoading(false)
  }), [])

  useEffect(() => {
    if (!saveNotice) return undefined
    const timeout = window.setTimeout(() => setSaveNotice(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [saveNotice])

  if (authLoading) return (
    <main className="admin-shell admin-loading" aria-busy="true" aria-live="polite">
      <aside className="admin-sidebar admin-loading__sidebar">
        <div className="admin-loading__brand"><BrandMark small /><span>amphoreus<em>control room</em></span></div>
        <div className="admin-loading__label">Workspace</div>
        <div className="admin-loading__nav">{[1, 2, 3, 4, 5].map((item) => <span key={item} />)}</div>
        <div className="admin-loading__footer"><span /><span /></div>
      </aside>
      <section className="admin-workspace">
        <header className="admin-topbar admin-loading__topbar"><span /><div><span /><span /><span /></div></header>
        <div className="admin-content admin-loading__content">
          <div className="admin-loading__intro"><span /><span /><span /><i /></div>
          <div className="admin-loading__overview"><span /><span /><span /></div>
          <div className="admin-loading__section"><span /><i /></div>
          <div className="admin-loading__panels"><div /><div /></div>
          <div className="admin-loading__message">Opening the control room<span className="admin-loading__dots" aria-hidden="true">...</span></div>
        </div>
      </section>
    </main>
  )
  if (!user) return <Login onLogin={() => setUser(auth.currentUser)} />

  async function leaveAdmin(event) {
    event.preventDefault()
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Unable to sign out from the admin dashboard.', error)
    } finally {
      sessionStorage.removeItem('amphoreus-admin-active')
      window.location.assign('/home')
    }
  }

  async function saveSiteForm(event) {
    event.preventDefault()
    if (await saveSite(siteForm)) {
      setSiteDraft(null)
      setSaveNotice(tab === 'carousel' ? 'Carousel settings saved successfully.' : 'Public profile saved successfully.')
    }
  }

  function toggleFeatured(key, id) {
    const current = Array.isArray(siteForm[key]) ? siteForm[key] : []
    const next = current.includes(id)
      ? current.filter((entry) => entry !== id)
      : current.length < 5 ? [...current, id] : current
    setSiteDraft({ ...siteForm, [key]: next })
  }

  function renderCarouselChoices(key, label, entries) {
    const selectedEntries = Array.isArray(siteForm[key]) ? siteForm[key] : []
    return (
      <fieldset className="carousel-choice-card" key={key}>
        <legend><span>{label}</span><small>{selectedEntries.length} / 5 selected</small></legend>
        <p className="carousel-choice-card__hint">{key === 'featuredEventIds' ? 'Signals shown before the council.' : 'Visual notes from the archive.'}</p>
        <div className="site-editor__choices">
          {entries.map((entry) => {
            const selected = selectedEntries.includes(entry.id)
            return <label className={selected ? 'is-selected' : ''} key={entry.id}><input type="checkbox" checked={selected} onChange={() => toggleFeatured(key, entry.id)} /><span>{entry.title}</span><b>{selected ? 'Selected' : 'Add'}</b></label>
          })}
        </div>
      </fieldset>
    )
  }

  const sectionLabels = {
    events: 'Events',
    staff: 'Staff',
    gallery: 'Gallery',
    agenda: 'Agenda',
    carousel: 'Carousel',
    site: 'Site profile',
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/home" onClick={leaveAdmin}><BrandMark small /><span>amphoreus<em>control room</em></span></a>
        <div className="admin-sidebar__label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin sections">
          {adminSections.map((name, index) => <a className={tab === name ? 'is-active' : ''} href={`/celestial-control/${name}`} key={name}><span className="admin-nav__number">0{index + 1}</span><span>{sectionLabels[name]}</span>{tab === name && <span className="admin-nav__arrow">↗</span>}</a>)}
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/home" onClick={leaveAdmin}>← View public site</a>
          <span>Amphoreus Universe<br />Content system v1.0</span>
        </div>
      </aside>
      <section className="admin-workspace">
        <header className="admin-topbar">
          <div><span className="admin-topbar__crumb">Control room /</span><strong>{sectionLabels[tab]}</strong></div>
          <div className="admin-topbar__actions">
            <ThemeToggle />
            <div className="admin-status"><span className={`status-dot status-dot--${syncState}`} /> {syncState === 'synced' ? 'Synced' : syncState === 'syncing' ? 'Saving' : syncState === 'error' ? 'Error' : 'Local draft'}</div>
            <button className="admin-signout" type="button" onClick={leaveAdmin}>Sign out</button>
          </div>
        </header>
        <div className="admin-content">
          {syncError && <p className="admin-sync-error" role="alert">Sync failed: {syncError}</p>}
          <div className="admin-heading">
            <div><p className="eyebrow"><span className="eyebrow-dot" /> Private workspace</p><h1>Shape the <i>constellation.</i></h1></div>
            <p>Keep the public world aligned with the latest stories, people, and moments of Amphoreus.</p>
          </div>
          <div className="admin-overview" aria-label="Workspace overview">
            <div><span>Current section</span><strong>{sectionLabels[tab]}</strong></div>
            <div><span>Published entries</span><strong>{tab === 'site' ? '01' : String(content[tab]?.length || 0).padStart(2, '0')}</strong></div>
            <div><span>Connection</span><strong className="admin-overview__status"><i className={`status-dot status-dot--${syncState}`} />{syncState === 'synced' ? 'Live' : 'Pending'}</strong></div>
          </div>
          <div className="admin-section-heading"><div><span className="admin-section-heading__index">01</span><div><p className="eyebrow">{tab === 'site' ? 'Public voice' : 'Content library'}</p><h2>{sectionLabels[tab]}</h2></div></div><span className="admin-section-heading__hint">Edit with care · Changes sync automatically</span></div>
          {tab === 'carousel'
            ? <form className="site-editor carousel-editor" onSubmit={saveSiteForm}>
              <div><p className="eyebrow">Home presentation</p><h2>Carousel control</h2><p>Choose the signals and images that appear on the public homepage. Select up to five entries in each carousel.</p></div>
              <div className="carousel-editor__panels">
                {renderCarouselChoices('featuredEventIds', 'Event carousel', content.events)}
                {renderCarouselChoices('featuredGalleryIds', 'Gallery carousel', content.gallery)}
              </div>
              <div className="carousel-editor__actions">
                <button className="button button--dark" type="submit">Save carousel settings <Arrow /></button>
                {saveNotice && <p className="admin-save-notice" role="status" aria-live="polite"><span>✓</span>{saveNotice}</p>}
              </div>
            </form>
            : tab === 'site'
            ? <form className="site-editor" onSubmit={saveSiteForm}>
              <div><p className="eyebrow">Public voice</p><h2>Site profile</h2><p>Keep the front door honest, warm, and recognisably Amphoreus.</p></div>
              <label>Eyebrow<input value={siteForm.eyebrow} onChange={(event) => setSiteDraft({ ...siteForm, eyebrow: event.target.value })} required /></label>
              <label>Intro<textarea value={siteForm.intro} onChange={(event) => setSiteDraft({ ...siteForm, intro: event.target.value })} required /></label>
              <label>Bio<textarea value={siteForm.bio} onChange={(event) => setSiteDraft({ ...siteForm, bio: event.target.value })} required /></label>
              <button className="button button--dark" type="submit">Save public profile <Arrow /></button>
            </form>
            : <Editor key={tab} type={tab} items={content[tab]} staff={content.staff} onSave={saveItem} onDelete={removeItem} />}
        </div>
      </section>
    </main>
  )
}
