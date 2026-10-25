import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './lib/firebase'
import { defaultSiteData, subscribeToSiteData } from './lib/realtime'
import { staff } from './data/mockData'
import Home from './pages/Home'
import InnerPages from './pages/InnerPages'
import DashboardPage from './dashboard/DashboardPage'
import { StaffList } from './components/ui'
import { AuthModal, RulesModal } from './components/auth/AuthModal'
import './App.css'

const pagePaths = { home: '/', events: '/events', community: '/community', album: '/album', leaderboard: '/leaderboard', staff: '/staff', profile: '/profile', dashboard: '/dashboard', 'dashboard-overview': '/dashboard/overview', 'dashboard-members': '/dashboard/members', 'dashboard-access': '/dashboard/access', 'dashboard-justice': '/dashboard/justice', 'dashboard-social': '/dashboard/social' }
const pageFromPath = () => Object.keys(pagePaths).find((key) => pagePaths[key] === window.location.pathname) || 'home'

function App() {
  const [page, setCurrentPage] = useState(pageFromPath); const [authenticated, setAuthenticated] = useState(false); const [authReady, setAuthReady] = useState(false); const [member, setMember] = useState(null); const [currentUser, setCurrentUser] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('amphoreus-theme') || 'dark'); const [modal, setModal] = useState(null); const [rulesOpen, setRulesOpen] = useState(false); const [agreed, setAgreed] = useState(false); const [toast, setToast] = useState(''); const [siteData, setSiteData] = useState(defaultSiteData)
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('amphoreus-theme', theme) }, [theme])
  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  useEffect(() => onAuthStateChanged(auth, async (user) => {
    try {
      if (!user) {
        setAuthenticated(false)
        setMember(null)
        setCurrentUser(null)
        return
      }
      setCurrentUser(user)
      const snapshot = await getDoc(doc(db, 'members', user.uid))
      if (!snapshot.exists()) {
        const registrationInProgress = sessionStorage.getItem('amphoreus-google-registration') === '1' || sessionStorage.getItem('amphoreus-registration') === '1'
        if (!registrationInProgress) {
          await signOut(auth)
          setAuthenticated(false)
          setMember(null)
          setCurrentUser(null)
          setToast('Akun belum terdaftar sebagai member. Silakan register terlebih dahulu.')
        }
        return
      }
      setMember(snapshot.data())
      setAuthenticated(true)
    } catch (error) {
      console.error('Firebase session check failed:', error)
      setAuthenticated(false)
      setMember(null)
      setCurrentUser(null)
      setToast('Sesi Firebase tidak dapat diperiksa. Anda dapat mencoba lagi nanti.')
    } finally {
      setAuthReady(true)
    }
  }), [])
  useEffect(() => subscribeToSiteData(setSiteData, (error) => {
    console.error('Public realtime data subscription failed:', error)
    setToast('Data realtime belum dapat dimuat. Menampilkan data default.')
  }), [])
  const close = () => { sessionStorage.removeItem('amphoreus-google-registration'); sessionStorage.removeItem('amphoreus-registration'); setModal(null); setRulesOpen(false); setAgreed(false) }
  const navigate = (nextPage) => {
    const path = pagePaths[nextPage] || pagePaths.home
    if (window.location.pathname !== path) window.history.pushState({ page: nextPage }, '', path)
    setCurrentPage(nextPage)
  }
  const openPage = (nextPage) => authenticated ? navigate(nextPage) : setModal('login')
  const updateMemberNickname = (nickname) => setMember((current) => ({ ...current, nickname }))
  if (!authReady) return <div className="site-shell loading-screen"><span className="modal-mark">A</span><p>Menyiapkan Amphoreus Universe...</p></div>
  const visiblePage = !authenticated && page !== 'home' ? 'home' : page
  const dashboardPage = visiblePage.startsWith('dashboard-') ? visiblePage.replace('dashboard-', '') : null
  const profileName = member?.nickname || currentUser?.displayName || currentUser?.email || 'Member'
  const profileInitials = profileName.slice(0, 2).toUpperCase()
  return <div className="site-shell"><header className="topbar"><button className="brand brand-button" onClick={() => navigate('home')}><span className="brand-mark">A</span><span>Amphoreus <b>Universe</b></span></button><nav className="desktop-nav"><button onClick={() => navigate('home')}>Beranda</button><button onClick={() => openPage('events')}>Event</button><button onClick={() => openPage('community')}>Komunitas</button><button onClick={() => openPage('album')}>Album</button><button onClick={() => openPage('staff')}>Staff</button></nav><div className="header-actions"><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☼ Light' : '◐ Dark'}</button>{authenticated ? <button className="profile-button" onClick={() => navigate('profile')} aria-label={`Buka profil ${profileName}`} title={profileName}>{currentUser?.photoURL ? <img src={currentUser.photoURL} alt="" /> : profileInitials}</button> : <button className="button button-dark" onClick={() => setModal('login')}>Masuk <span>↗</span></button>}</div></header>
    {visiblePage === 'home' ? <Home setModal={setModal} setPage={openPage} siteData={siteData} /> : visiblePage === 'staff' ? <main className="inner-page"><p className="eyebrow">Amphoreus Universe</p><h1>Staff Amphoreus</h1><p className="page-intro">Kenali pengurus dan jabatan mereka di Discord.</p><StaffList staff={staff}/></main> : (visiblePage === 'dashboard' || dashboardPage) ? <DashboardPage member={member} module={dashboardPage || 'overview'} onNavigate={navigate} /> : <InnerPages page={visiblePage} member={member} currentUser={currentUser} siteData={siteData} onMemberUpdate={updateMemberNickname} onLogout={() => signOut(auth)} onOpenDashboard={() => navigate('dashboard')} />}
    <footer><div className="footer-main"><button className="brand brand-button" onClick={() => navigate('home')}><span className="brand-mark">A</span><span>Amphoreus <b>Universe</b></span></button><p>Ruang bermain, berbagi, dan bertumbuh<br />untuk gamer Indonesia.</p></div><div className="footer-links"><span className="footer-label">Jelajahi</span><button onClick={() => navigate('home')}>Beranda</button><button onClick={() => openPage('events')}>Event</button><button onClick={() => openPage('community')}>Komunitas</button><button onClick={() => openPage('album')}>Album</button></div><div className="footer-links"><span className="footer-label">Akun</span><button onClick={() => openPage('profile')}>Profil saya</button>{authenticated ? <button onClick={() => signOut(auth)}>Keluar</button> : <button onClick={() => setModal('login')}>Masuk</button>}</div><div className="footer-status"><span className="live-dot" /> <span>Amphoreus online</span><small>© 2026 Amphoreus Universe</small></div></footer>
    {modal && <AuthModal modal={modal} close={close} setModal={setModal} setPage={navigate} setToast={setToast} setAuthenticated={setAuthenticated} agreed={agreed} setMember={setMember} setRulesOpen={setRulesOpen} />}
    {rulesOpen && <RulesModal setRulesOpen={setRulesOpen} setAgreed={setAgreed} />}{toast && <button className="toast" onClick={() => setToast('')}>{toast} <span>×</span></button>}
  </div>
}
export default App
