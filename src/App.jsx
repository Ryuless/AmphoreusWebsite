import './App.css'
import { useContentStore } from './hooks/useContentStore'
import { usePage } from './hooks/usePage'
import { AdminPanel } from './pages/admin/AdminPanel'
import { PublicSite } from './pages/public/PublicSite'

function App() {
  const page = usePage()
  const store = useContentStore()

  return page === 'celestial-control' || page.startsWith('celestial-control/')
    ? <AdminPanel {...store} section={page.split('/')[1] || 'events'} />
    : <PublicSite content={store.content} page={page} />
}

export default App
