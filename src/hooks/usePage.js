import { useEffect, useState } from 'react'

function getCurrentPage() {
  const legacyHash = window.location.hash.replace(/^#\/?/, '')
  if (legacyHash) {
    window.history.replaceState({}, '', `/${legacyHash}`)
    return legacyHash
  }
  return window.location.pathname.replace(/^\/+|\/+$/g, '') || 'home'
}

export function usePage() {
  const [page, setPage] = useState(getCurrentPage)

  useEffect(() => {
    const updatePage = () => setPage(getCurrentPage())
    window.addEventListener('popstate', updatePage)
    window.addEventListener('hashchange', updatePage)
    return () => {
      window.removeEventListener('popstate', updatePage)
      window.removeEventListener('hashchange', updatePage)
    }
  }, [])

  return page
}
