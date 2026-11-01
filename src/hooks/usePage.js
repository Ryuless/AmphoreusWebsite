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
    const handleInternalNavigation = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return
      const link = event.target.closest('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, window.location.origin)
      if (url.origin !== window.location.origin) return
      event.preventDefault()
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
      updatePage()
    }
    window.addEventListener('popstate', updatePage)
    window.addEventListener('hashchange', updatePage)
    document.addEventListener('click', handleInternalNavigation)
    return () => {
      window.removeEventListener('popstate', updatePage)
      window.removeEventListener('hashchange', updatePage)
      document.removeEventListener('click', handleInternalNavigation)
    }
  }, [])

  return page
}
