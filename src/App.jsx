import './App.css'
import { useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { useContentStore } from './hooks/useContentStore'
import { usePage } from './hooks/usePage'
import { auth } from './firebase'
import { AdminPanel } from './pages/admin/AdminPanel'
import { PublicSite } from './pages/public/PublicSite'

function App() {
  const page = usePage()
  const store = useContentStore()
  const previousPage = useRef(page)
  const isAdminPage = page === 'celestial-control' || page.startsWith('celestial-control/')

  useEffect(() => {
    const wasAdminPage = previousPage.current === 'celestial-control' || previousPage.current.startsWith('celestial-control/')
    if (wasAdminPage && !isAdminPage) {
      sessionStorage.removeItem('amphoreus-admin-active')
      signOut(auth).catch((error) => console.error('Unable to sign out after leaving the admin dashboard.', error))
    }
    previousPage.current = page
  }, [isAdminPage, page])

  useEffect(() => {
    if (isAdminPage || sessionStorage.getItem('amphoreus-admin-active') !== '1') return
    sessionStorage.removeItem('amphoreus-admin-active')
    signOut(auth).catch((error) => console.error('Unable to clear the previous admin session.', error))
  }, [isAdminPage])

  return isAdminPage
    ? <AdminPanel {...store} section={page.split('/')[1] || 'events'} />
    : <PublicSite content={store.content} page={page} />
}

export default App
