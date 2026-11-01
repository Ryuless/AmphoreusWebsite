import { useEffect } from 'react'
import { RemoteImage } from '../../components/RemoteImage'

export function GalleryDialog({ image, onClose }) {
  useEffect(() => {
    if (!image) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [image, onClose])

  if (!image) return null

  return (
    <div className="event-dialog gallery-dialog" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <article className="event-dialog__panel gallery-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="gallery-dialog-title">
        <button className="event-dialog__close" type="button" onClick={onClose} aria-label="Close image details">Close <span>×</span></button>
        <div className="gallery-dialog__image"><RemoteImage src={image.image} alt={image.title} /></div>
        <div className="event-dialog__body">
          <p className="eyebrow">Archive frame</p>
          <h2 id="gallery-dialog-title">{image.title}</h2>
          <div className="event-dialog__meta"><span>{image.credit || 'Amphoreus archive'}</span><span>Visual memory / AM-02</span></div>
        </div>
      </article>
    </div>
  )
}
