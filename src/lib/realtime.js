import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export const defaultSiteData = {
  stats: { totalMembers: 2487, onlineMembers: 186, onlineBots: 12, staffCount: 24 },
  access: { Titan: true, Olimpus: true, Demigod: true },
  events: [],
  announcements: [],
}

export function subscribeToSiteData(onChange, onError) {
  const state = { ...defaultSiteData, events: [], announcements: [] }
  const emit = () => onChange({
    ...state,
    stats: { ...defaultSiteData.stats, ...state.stats },
    access: { ...defaultSiteData.access, ...state.access },
  })
  const unsubscribers = [
    onSnapshot(doc(db, 'site', 'config'), (snapshot) => { if (snapshot.exists()) Object.assign(state, snapshot.data()); emit() }, onError),
    onSnapshot(query(collection(db, 'events'), orderBy('createdAt', 'desc')), (snapshot) => { state.events = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })); emit() }, onError),
    onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')), (snapshot) => { state.announcements = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })); emit() }, onError),
  ]
  emit()
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
}
