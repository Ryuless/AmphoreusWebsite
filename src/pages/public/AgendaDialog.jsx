import { useEffect } from 'react'

export function AgendaDialog({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined
    const closeOnEscape = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null

  const category = item.category || 'Agenda'
  const role = item.role || item.owner || 'Unassigned'

  return (
    <div className="event-dialog agenda-dialog" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose() }}>
      <article className="event-dialog__panel agenda-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="agenda-dialog-title">
        <button className="event-dialog__close" type="button" onClick={onClose} aria-label="Close agenda details">Close <span>×</span></button>
        <div className="agenda-dialog__signal"><span>04</span><i /> {category}</div>
        <div className="event-dialog__body">
          <p className="eyebrow">{role} · {item.status || 'In progress'}</p>
          <h2 id="agenda-dialog-title">{item.title}</h2>
          <div className="event-dialog__meta"><span>{category}</span><span>{role}</span><span>{item.owner || 'Ketua pelaksana belum ditentukan'}</span><span>{item.status || 'In progress'}</span></div>
          <p className="event-dialog__summary">{item.detail}</p>
        </div>
      </article>
    </div>
  )
}
