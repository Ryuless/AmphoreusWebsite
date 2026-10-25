import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { events, leaderboard } from '../data/mockData'
import { EventCard, Leaderboard } from '../components/ui'

function Page({ title, intro, children }) {
  return <main className="inner-page"><p className="eyebrow">Amphoreus Universe · Data mock tahap frontend</p><h1>{title}</h1><p className="page-intro">{intro}</p>{children}</main>
}

function NicknameEditor({ member, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(member?.nickname || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const save = async (event) => {
    event.preventDefault()
    const value = nickname.trim()
    if (value.length < 2 || value.length > 30) return setError('Nickname harus terdiri dari 2 sampai 30 karakter.')
    setSaving(true)
    setError('')
    try {
      await updateDoc(doc(db, 'members', auth.currentUser.uid), { nickname: value })
      await updateProfile(auth.currentUser, { displayName: value })
      onSaved(value)
      setEditing(false)
    } catch (saveError) {
      console.error('Nickname update failed:', saveError)
      setError('Nickname gagal diperbarui. Periksa koneksi dan Firestore Rules.')
    } finally {
      setSaving(false)
    }
  }
  if (!editing) return <button className="change-button" onClick={() => setEditing(true)}>Ubah nickname <span>↗</span></button>
  return <form className="nickname-form" onSubmit={save}><label>Nickname baru<input value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength="30" autoFocus /></label>{error && <small>{error}</small>}<div><button className="change-button" type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button><button className="cancel-button" type="button" onClick={() => { setNickname(member?.nickname || ''); setError(''); setEditing(false) }}>Batal</button></div></form>
}

export default function InnerPages({ page, member, currentUser, siteData, onLogout, onMemberUpdate, onOpenDashboard }) {
  const liveEvents = siteData?.events?.length ? siteData.events : events
  if (page === 'events') return <Page title="Event komunitas" intro="Agenda kegiatan yang sedang dan akan berlangsung."><div className="event-grid">{liveEvents.map((event) => <EventCard key={event.id || event[2]} event={event} />)}</div>{siteData.announcements?.map((announcement) => <div className="notice-card" key={announcement.id}><h3>{announcement.title}</h3><p>{announcement.description}</p></div>)}</Page>
  if (page === 'community') return <Page title="Komunitas" intro="Ruang untuk gamer berbagai game."><div className="stats-bar inner-stats"><div><strong>{siteData.stats.totalMembers.toLocaleString('id-ID')}</strong><span>Member terdaftar <i>(realtime)</i></span></div><div><strong className="green-text">{siteData.stats.onlineMembers}</strong><span>Member online <i>(realtime)</i></span></div><div><strong>{siteData.stats.onlineBots}</strong><span>Bot online <i>(realtime)</i></span></div></div><div className="notice-card"><h3>Data komunitas realtime</h3><p>Statistik ini diperbarui langsung dari Firebase dan dapat diisi oleh integrasi Discord.</p></div></Page>
  if (page === 'album') return <Page title="Album server" intro="Kumpulan momen Amphoreus Universe."><div className="album-grid">{['Game Night', 'Build Battle', 'Community Talk', 'Tournament', 'Meet the Staff', 'Daily Hangout'].map((name, i) => <div className={`album-item album-${i + 1}`} key={name}><span>{name}</span></div>)}</div></Page>
  if (page === 'leaderboard') return <Page title="Leaderboard" intro="Member teraktif berdasarkan XP komunitas."><Leaderboard users={leaderboard} /></Page>
  if (page === 'profile') return <Page title="Profil saya" intro="Kelola informasi akun dan progres komunitasmu."><div className="profile-card"><div className="profile-avatar">{currentUser?.photoURL ? <img src={currentUser.photoURL} alt={`Foto profil ${member?.nickname || 'member'}`} /> : (member?.nickname || 'Member').slice(0, 2).toUpperCase()}</div><h3>{member?.nickname || 'Member'}</h3><p>{member?.email || 'Email tidak tersedia'} · Level {member?.level || 1}</p><p>Discord: {member?.discordNickname || 'Belum diisi'}<br />Wilayah: {member?.region || 'Belum diisi'}</p>{['Primodial', 'Titan', 'Olimpus', 'Demigod'].includes(member?.role) && <button className="dashboard-link" onClick={onOpenDashboard}>Buka dashboard staff <span>↗</span></button>}<NicknameEditor member={member} onSaved={onMemberUpdate} /><button className="logout-button" onClick={onLogout}>Keluar dari akun <span>↗</span></button></div></Page>
  return <Page title="Dashboard staff" intro="Panel akses mengikuti jabatan Discord."><div className="dashboard-grid">{['Primodial · Semua akses', 'Titan · Operasional', 'Olimpus · Keadilan & hukum', 'Demigod · Sosial & informasi'].map((name, i) => <article className={`dashboard-card access-${i}`} key={name}><span className="access-toggle">{i === 0 ? 'ON' : 'MOCK'}</span><h3>{name}</h3><p>{i === 0 ? 'Mengelola role, member, insight, dan semua konten.' : 'Kontrol akses akan dihubungkan ke Firebase Rules.'}</p></article>)}</div></Page>
}
