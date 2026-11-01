import { useEffect, useState } from 'react'
import { RemoteImage } from '../../components/RemoteImage'
import { formatDate } from '../../utils/formatDate'

export function EventDialog({ event, onClose }) {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!event) return undefined
    setZoom(1)
    const closeOnEscape = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [event, onClose])

  if (!event) return null

  function changeZoom(amount) {
    setZoom((currentZoom) => Math.min(3, Math.max(1, Number((currentZoom + amount).toFixed(1)))))
  }

  return (
    <div className="event-dialog" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose() }}>
      <article className="event-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="event-dialog-title">
        <button className="event-dialog__close" type="button" onClick={onClose} aria-label="Close event details">Close <span>×</span></button>
        <div className="event-dialog__image" onWheel={(wheelEvent) => { wheelEvent.preventDefault(); changeZoom(wheelEvent.deltaY < 0 ? .2 : -.2) }}>
          <div className="event-dialog__zoom-controls" aria-label="Image zoom controls">
            <button type="button" onClick={() => changeZoom(-.2)} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
            <button type="button" onClick={() => changeZoom(.2)} aria-label="Zoom in">+</button>
          </div>
          <RemoteImage src={event.image} alt="" style={{ transform: `scale(${zoom})` }} />
        </div>
        <div className="event-dialog__body">
          <p className="eyebrow">{event.type}</p>
          <h2 id="event-dialog-title">{event.title}</h2>
          <div className="event-dialog__meta"><time dateTime={event.date}>{formatDate(event.date)}</time><span>{event.location}</span></div>
          <p className="event-dialog__summary">{event.summary}</p>
        </div>
      </article>
    </div>
  )
}
