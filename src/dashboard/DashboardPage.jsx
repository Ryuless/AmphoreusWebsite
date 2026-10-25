import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { defaultSiteData, subscribeToSiteData } from '../lib/realtime'

const roleAccess = {
  Primodial: ['overview', 'members', 'access', 'justice', 'social'],
  Titan: ['overview', 'members', 'social'],
  Olimpus: ['overview', 'justice'],
  Demigod: ['overview', 'social'],
}

const modules = [
  ['overview', 'Ringkasan komunitas', 'Insight member, aktivitas, dan statistik server.'],
  ['members', 'Data member', 'Lihat member website dan ubah jabatan sesuai kewenangan.'],
  ['access', 'Kontrol akses staff', 'Atur akses modul dashboard berdasarkan jabatan.'],
  ['justice', 'Keadilan & hukum', 'Kelola laporan, status jail, dan informasi pengadilan.'],
  ['social', 'Sosial & informasi', 'Kelola event dan announcement yang tampil di halaman utama.'],
]

function Field({ label, value, onChange, type = 'text' }) {
  return <label className="dashboard-field">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} required /></label>
}

function SocialModule({ type, role }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  useEffect(() => onSnapshot(collection(db, type), (snapshot) => setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))), (snapshotError) => setError(snapshotError.message)), [type])
  const create = async (event) => {
    event.preventDefault()
    try {
      await addDoc(collection(db, type), { title, description, date, createdBy: role, createdAt: serverTimestamp() })
      setTitle(''); setDescription(''); setDate('')
    } catch (saveError) { setError(saveError.message) }
  }
  return <section className="dashboard-module"><h2>{type === 'events' ? 'Kelola event' : 'Kelola announcement'}</h2><form className="dashboard-form" onSubmit={create}><Field label="Judul" value={title} onChange={setTitle} /><Field label="Deskripsi" value={description} onChange={setDescription} />{type === 'events' && <Field label="Tanggal" value={date} onChange={setDate} />}<button className="dashboard-action" type="submit">Publikasikan <span>↗</span></button></form>{error && <p className="form-error">{error}</p>}<div className="dashboard-list">{items.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.description}</p></div><button className="cancel-button" onClick={() => deleteDoc(doc(db, type, item.id))}>Hapus</button></article>)}</div></section>
}

function JusticeModule({ role }) {
  const [reports, setReports] = useState([])
  const [target, setTarget] = useState('')
  const [reason, setReason] = useState('')
  useEffect(() => onSnapshot(collection(db, 'justiceReports'), (snapshot) => setReports(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))), [])
  const addReport = async (event) => { event.preventDefault(); await addDoc(collection(db, 'justiceReports'), { target, reason, status: 'open', createdBy: role, createdAt: serverTimestamp() }); setTarget(''); setReason('') }
  return <section className="dashboard-module"><h2>Penanganan laporan</h2><form className="dashboard-form" onSubmit={addReport}><Field label="Nama member" value={target} onChange={setTarget} /><Field label="Ringkasan pelanggaran" value={reason} onChange={setReason} /><button className="dashboard-action" type="submit">Buat laporan <span>↗</span></button></form><div className="dashboard-list">{reports.map((report) => <article key={report.id}><div><strong>{report.target}</strong><p>{report.reason} · {report.status}</p></div><button className="cancel-button" onClick={() => updateDoc(doc(db, 'justiceReports', report.id), { status: report.status === 'open' ? 'resolved' : 'open' })}>{report.status === 'open' ? 'Selesaikan' : 'Buka kembali'}</button></article>)}</div></section>
}

function MembersModule({ role }) {
  const [members, setMembers] = useState([])
  useEffect(() => onSnapshot(collection(db, 'members'), (snapshot) => setMembers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))), [])
  const changeRole = async (member, nextRole) => updateDoc(doc(db, 'members', member.id), { role: nextRole, roleUpdatedBy: role, roleUpdatedAt: serverTimestamp() })
  return <section className="dashboard-module"><h2>Member terdaftar</h2><div className="dashboard-list">{members.map((item) => <article key={item.id}><div><strong>{item.nickname || item.email || item.id}</strong><p>{item.email || 'Email tidak tersedia'} · {item.role || 'Member'}</p></div>{role === 'Primodial' && <select value={item.role || 'Member'} onChange={(event) => changeRole(item, event.target.value)}><option>Member</option><option>Demigod</option><option>Olimpus</option><option>Titan</option><option>Primodial</option></select>}</article>)}</div></section>
}

export default function DashboardPage({ member, module = 'overview', onNavigate }) {
  const role = member?.role
  const [siteData, setSiteData] = useState(defaultSiteData)
  const [error, setError] = useState('')
  useEffect(() => subscribeToSiteData(setSiteData, (snapshotError) => setError(snapshotError.message)), [])

  if (!roleAccess[role]) return <main className="inner-page"><p className="eyebrow">Akses dashboard</p><h1>Akses ditolak.</h1><p className="page-intro">Halaman ini hanya dapat diakses oleh staff yang terdaftar di Firestore.</p><div className="notice-card"><h3>Role staff belum ditemukan</h3><p>Akun Anda memiliki role member atau belum memiliki role yang valid.</p></div></main>
  const allowedModules = roleAccess[role].filter((module) => module !== 'overview' || true).filter((module) => module === 'overview' || role === 'Primodial' || siteData.access[role] !== false)
  const saveAccess = async (staffRole) => setDoc(doc(db, 'site', 'config'), { access: { ...siteData.access, [staffRole]: !siteData.access[staffRole] } }, { merge: true })
  const selected = module === 'overview' ? null : module
  const currentModule = modules.find(([id]) => id === module)
  if (module !== 'overview' && !allowedModules.includes(module)) return <main className="inner-page dashboard-page"><button className="dashboard-back" onClick={() => onNavigate('dashboard')}>← Kembali ke dashboard</button><h1>Akses modul ditolak.</h1><p className="page-intro">Role {role} tidak memiliki akses ke modul ini.</p></main>
  return <main className="inner-page dashboard-page"><div className="dashboard-header"><div><button className="dashboard-back" onClick={() => onNavigate('dashboard')}>← Dashboard utama</button><p className="eyebrow">Staff dashboard · {role}</p><h1>{module === 'overview' ? 'Ruang kendali.' : currentModule?.[1]}</h1><p className="page-intro">Perubahan disimpan ke Firebase dan tampil realtime.</p></div><span className={`role-badge role-${role.toLowerCase()}`}>{role}</span></div>{error && <div className="notice-card"><strong>Sinkronisasi terbatas</strong><p>{error}</p></div>}{module === 'overview' && <div className="dashboard-grid">{modules.filter(([id]) => allowedModules.includes(id)).map(([id, title, description]) => <article className="dashboard-card" key={id}><span className="access-toggle">AKTIF</span><h3>{title}</h3><p>{description}</p><button className="dashboard-action" onClick={() => onNavigate(`dashboard-${id}`)}>Buka modul <span>↗</span></button></article>)}</div>}{module === 'overview' && <section className="dashboard-overview"><div><strong>{siteData.stats.totalMembers}</strong><span>Total member</span></div><div><strong>{siteData.stats.onlineMembers}</strong><span>Member online</span></div><div><strong>{siteData.stats.onlineBots}</strong><span>Bot online</span></div><div><strong>{siteData.stats.staffCount}</strong><span>Staff</span></div></section>}{selected === 'members' && <MembersModule role={role} />}{selected === 'social' && <><SocialModule type="events" role={role} /><SocialModule type="announcements" role={role} /></>}{selected === 'justice' && <JusticeModule role={role} />}{selected === 'access' && role === 'Primodial' && <section className="access-panel"><div><p className="eyebrow">Primodial control</p><h2>Atur akses jabatan</h2><p>Toggle ini tersimpan realtime dan memengaruhi dashboard staff.</p></div><div className="role-switches">{Object.keys(siteData.access).map((staffRole) => <label key={staffRole}><span>{staffRole}</span><button className={`switch ${siteData.access[staffRole] ? 'is-on' : ''}`} onClick={() => saveAccess(staffRole)} aria-label={`Ubah akses ${staffRole}`}><i /></button></label>)}</div></section>}</main>
}
