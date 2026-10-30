import { useEffect, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { collectionNames, defaultContent, readLocalContent, writeLocalContent } from '../data/content'

export function useContentStore() {
  const [content, setContent] = useState(readLocalContent)
  const [syncState, setSyncState] = useState('local')
  const [syncError, setSyncError] = useState('')

  useEffect(() => {
    let active = true
    const readyListeners = new Set()
    const receivedCollections = new Set()
    const listenerCount = collectionNames.length + 1
    const reportError = (error) => {
      if (!active) return
      setSyncState('error')
      setSyncError(error?.code ? `${error.code}: ${error.message}` : 'Firestore connection failed.')
    }
    const reportSnapshot = (listenerKey, update) => {
      if (!active) return
      setContent((currentContent) => {
        const nextContent = update(currentContent)
        writeLocalContent(nextContent)
        return nextContent
      })
      readyListeners.add(listenerKey)
      if (readyListeners.size >= listenerCount) {
        setSyncState('synced')
        setSyncError('')
      }
    }

    const unsubscribers = [
      onSnapshot(
        doc(db, 'site', 'public'),
        (snapshot) => {
          reportSnapshot('site', (currentContent) => ({
            ...currentContent,
            site: snapshot.exists()
              ? { ...defaultContent.site, ...snapshot.data() }
              : currentContent.site,
          }))
        },
        reportError,
      ),
      ...collectionNames.map((name) =>
        onSnapshot(
          collection(db, name),
          (snapshot) => {
            if (snapshot.empty) {
              const isInitialSnapshot = !receivedCollections.has(name)
              receivedCollections.add(name)
              reportSnapshot(name, (currentContent) =>
                isInitialSnapshot ? currentContent : { ...currentContent, [name]: [] },
              )
              return
            }
            receivedCollections.add(name)
            reportSnapshot(name, (currentContent) => ({
              ...currentContent,
              [name]: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
            }))
          },
          reportError,
        ),
      ),
    ]

    return () => {
      active = false
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  async function saveSite(site) {
    const next = { ...content, site }
    setContent(next)
    writeLocalContent(next)
    setSyncState('syncing')
    setSyncError('')
    try {
      await setDoc(doc(db, 'site', 'public'), site)
      setSyncState('synced')
    } catch (error) {
      setSyncState('error')
      setSyncError(error?.code ? `${error.code}: ${error.message}` : 'Could not save the public profile.')
      return false
    }
    return true
  }

  async function saveItem(type, item) {
    const items = content[type].some((entry) => entry.id === item.id)
      ? content[type].map((entry) => (entry.id === item.id ? item : entry))
      : [item, ...content[type]]
    const next = { ...content, [type]: items }
    setContent(next)
    writeLocalContent(next)
    setSyncState('syncing')
    setSyncError('')
    try {
      await setDoc(doc(db, type, item.id), item)
      setSyncState('synced')
    } catch (error) {
      setSyncState('error')
      setSyncError(error?.code ? `${error.code}: ${error.message}` : 'Could not save this entry.')
      return false
    }
    return true
  }

  async function removeItem(type, id) {
    const next = { ...content, [type]: content[type].filter((item) => item.id !== id) }
    setContent(next)
    writeLocalContent(next)
    setSyncState('syncing')
    setSyncError('')
    try {
      await deleteDoc(doc(db, type, id))
      setSyncState('synced')
    } catch (error) {
      setSyncState('error')
      setSyncError(error?.code ? `${error.code}: ${error.message}` : 'Could not delete this entry.')
      return false
    }
    return true
  }

  return { content, syncState, syncError, saveSite, saveItem, removeItem }
}
