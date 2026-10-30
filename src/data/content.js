export const imageBank = {
  tower:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85',
  moon:
    'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85',
  ocean:
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=85',
  night:
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85',
  forest:
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
}

export const defaultContent = {
  site: {
    name: 'Amphoreus Universe',
    eyebrow: 'Est. June 2026 · A living fantasy community',
    intro:
      'A quiet constellation for people who build, explore, and care for a world together.',
    bio:
      'Amphoreus is a small, thoughtful corner of the internet. We gather around stories, events, and the simple joy of making something worth returning to.',
  },
  events: [
    {
      id: 'solstice-assembly',
      title: 'The Solstice Assembly',
      date: '2026-07-12',
      type: 'Gathering',
      location: 'The Astral Hall',
      summary: 'A first gathering beneath the summer sky. Bring a story, a sketch, or simply your company.',
      image: imageBank.moon,
    },
    {
      id: 'wayfinder-night',
      title: 'Wayfinder Night',
      date: '2026-08-08',
      type: 'Community night',
      location: 'Voice · 20:00 GMT+7',
      summary: 'An evening for new faces, old tales, and a guided tour through the Universe.',
      image: imageBank.night,
    },
    {
      id: 'first-tide',
      title: 'The First Tide',
      date: '2026-09-05',
      type: 'Creative prompt',
      location: 'Community forum',
      summary: 'A shared prompt for world-builders: describe the shore your character calls home.',
      image: imageBank.ocean,
    },
  ],
  staff: [
    {
      id: 'seraphine',
      name: 'Seraphine',
      role: 'Primordial',
      focus: 'Direction & care',
      bio: 'Keeps the first flame lit and makes sure the Universe stays a welcoming place.',
      image: imageBank.moon,
    },
    {
      id: 'orion',
      name: 'Orion',
      role: 'Titan · Events',
      focus: 'Rituals & gatherings',
      bio: 'Turns good ideas into evenings people remember long after the lights go down.',
      image: imageBank.tower,
    },
    {
      id: 'lyra',
      name: 'Lyra',
      role: 'Titan · Safety',
      focus: 'Rules & fairness',
      bio: 'Protects the rhythm of the community with clarity, patience, and a steady hand.',
      image: imageBank.forest,
    },
    {
      id: 'cassian',
      name: 'Cassian',
      role: 'Demigod',
      focus: 'Signals & notices',
      bio: 'Carries the word from the council to every corner of the constellation.',
      image: imageBank.night,
    },
  ],
  gallery: [
    { id: 'quiet-tower', title: 'A quiet tower', credit: 'Amphoreus archive', image: imageBank.tower },
    { id: 'night-path', title: 'The night path', credit: 'Community archive', image: imageBank.night },
    { id: 'green-room', title: 'Where stories grow', credit: 'Community archive', image: imageBank.forest },
    { id: 'blue-hour', title: 'Blue hour', credit: 'Amphoreus archive', image: imageBank.ocean },
  ],
  agenda: [
    {
      id: 'open-door',
      title: 'Open the door',
      status: 'In motion',
      owner: 'Primordial',
      detail: 'Keep introductions easy, kind, and visible for every new arrival.',
    },
    {
      id: 'seasonal-program',
      title: 'Seasonal program',
      status: 'Next up',
      owner: 'Titan · Events',
      detail: 'Shape one small, memorable gathering for each season of the server.',
    },
    {
      id: 'clear-signal',
      title: 'Clear signal',
      status: 'Ongoing',
      owner: 'Demigod',
      detail: 'Make important notices calm, concise, and impossible to miss.',
    },
  ],
}

export const collectionNames = ['events', 'staff', 'gallery', 'agenda']
export const storageKey = 'amphoreus-universe-content'

export function readLocalContent() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey))
    if (!stored || stored._version !== 1) return defaultContent
    return {
      ...defaultContent,
      ...stored,
      site: { ...defaultContent.site, ...stored.site },
      ...Object.fromEntries(
        collectionNames.map((name) => [
          name,
          Array.isArray(stored[name]) ? stored[name] : defaultContent[name],
        ]),
      ),
    }
  } catch {
    return defaultContent
  }
}

export function writeLocalContent(content) {
  localStorage.setItem(storageKey, JSON.stringify({ ...content, _version: 1 }))
}
