import { useState } from 'react'
import { Arrow } from '../../components/Arrow'
import { RemoteImage } from '../../components/RemoteImage'
import { formatDate } from '../../utils/formatDate'

export function HomeCarousel({ items, kind, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (!items.length) return null

  const item = items[activeIndex]
  const isGallery = kind === 'gallery'

  function move(direction) {
    setActiveIndex((current) => (current + direction + items.length) % items.length)
  }

  return (
    <section className={`home-carousel home-carousel--${kind}`}>
      <div className="home-carousel__visual">
        <RemoteImage src={isGallery ? item.image : item.image} alt={isGallery ? item.title : ''} />
        <div className="home-carousel__counter"><span>0{activeIndex + 1}</span> / 0{items.length}</div>
        <div className="home-carousel__controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous slide">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next slide">→</button>
        </div>
      </div>
      <div className="home-carousel__copy">
        <span className="section-index">{isGallery ? '02' : '03'}</span>
        <p className="eyebrow">{isGallery ? 'Selected from the archive' : `${item.type || 'Upcoming signal'} · ${formatDate(item.date)}`}</p>
        <h2>{isGallery ? item.title : item.title}</h2>
        <p>{isGallery ? item.credit : item.summary}</p>
        <div className="home-carousel__footer">
          <span>{isGallery ? 'Gallery archive' : item.location}</span>
          {isGallery
            ? <a className="text-link" href="/gallery">View gallery <Arrow /></a>
            : <button className="text-link home-carousel__open" type="button" onClick={() => onOpen?.(item)}>Open details <Arrow /></button>}
        </div>
        <div className="home-carousel__dots" aria-label={`${isGallery ? 'Gallery' : 'Event'} slides`}>
          {items.map((entry, index) => <button type="button" className={index === activeIndex ? 'is-active' : ''} key={entry.id} onClick={() => setActiveIndex(index)} aria-label={`Go to slide ${index + 1}`} />)}
        </div>
      </div>
    </section>
  )
}
