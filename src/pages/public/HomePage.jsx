import { useState } from 'react'
import { Arrow } from '../../components/Arrow'
import { BrandMark } from '../../components/BrandMark'
import { EventDialog } from './EventDialog'
import { HomeCarousel } from './HomeCarousel'
import { StaffPreview } from './StaffPreview'

export function HomePage({ content }) {
  const selectedGalleryIds = content.site.featuredGalleryIds
  const selectedEventIds = content.site.featuredEventIds
  const galleries = (Array.isArray(selectedGalleryIds) ? selectedGalleryIds.map((id) => content.gallery.find((item) => item.id === id)).filter(Boolean) : content.gallery).slice(0, 5)
  const events = (Array.isArray(selectedEventIds) ? selectedEventIds.map((id) => content.events.find((item) => item.id === id)).filter(Boolean) : content.events).slice(0, 5)
  const latestEvents = content.events.slice(0, 3)
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <>
      <section className="observatory-hero">
        <div className="observatory-hero__sky">
          <div className="star-field">
            <i className="twinkle-star twinkle-star--one" />
            <i className="twinkle-star twinkle-star--two" />
            <i className="twinkle-star twinkle-star--three" />
            <i className="twinkle-star twinkle-star--four" />
            <i className="twinkle-star twinkle-star--five" />
            <i className="comet comet--one" />
            <i className="comet comet--two" />
            <i className="comet comet--three" />
          </div>
          <span className="sky-coordinate sky-coordinate--one">07° 14′ 26″ N</span>
          <span className="sky-coordinate sky-coordinate--two">032° 51′ 09″ E</span>
          <span className="sky-label">Amphoreus / Field notes</span>
          <div className="hero-constellation">
            <span className="constellation-dot constellation-dot--a" />
            <span className="constellation-dot constellation-dot--b" />
            <span className="constellation-dot constellation-dot--c" />
            <span className="constellation-dot constellation-dot--d" />
            <i className="constellation-line constellation-line--one" />
            <i className="constellation-line constellation-line--two" />
            <i className="constellation-line constellation-line--three" />
          </div>
          <div className="hero-emblem">
            <BrandMark />
            <span>AM-01</span>
          </div>
        </div>
        <div className="observatory-hero__copy reveal">
          <div className="hero-status"><span className="pulse" /> {content.site.eyebrow}</div>
          <h1>There is<br /><em>more</em> out there.</h1>
          <p>{content.site.intro}</p>
          <a className="hero-cta" href="/chronicle">
            <span>Enter the chronicle</span><Arrow />
          </a>
        </div>
        <div className="hero-side-note">A quiet constellation<br />for curious people</div>
      </section>

      <section className="orbit-facts">
        <div className="orbit-facts__intro">
          <span className="eyebrow">The universe, at a glance</span>
          <span className="orbit-facts__symbol">✦</span>
        </div>
        <div className="orbit-fact"><strong>{String(content.staff.length).padStart(2, '0')}</strong><span>keepers<br />of the flame</span></div>
        <div className="orbit-fact"><strong>{String(events.length).padStart(2, '0')}</strong><span>signals<br />on the horizon</span></div>
        <div className="orbit-fact"><strong>∞</strong><span>stories waiting<br />to be made</span></div>
      </section>

      <HomeCarousel items={events} kind="events" onOpen={setSelectedEvent} />

      <section className="observatory-section observatory-section--council">
        <div className="observatory-section__heading">
          <span className="section-index">01</span>
          <div>
            <span className="eyebrow">The people behind the signal</span>
            <h2>Meet the<br /><em>council.</em></h2>
          </div>
          <a className="quiet-link" href="/council">View council <Arrow /></a>
        </div>
        <StaffPreview staff={content.staff} />
      </section>

      <HomeCarousel items={galleries} kind="gallery" />

      <section className="signal-strip">
        <div>
          <span className="eyebrow">Field log / 2026</span>
          <p>{content.site.bio}</p>
        </div>
        {latestEvents.length > 0 && <div className="signal-strip__list">
          {latestEvents.map((item, index) => (
            <a href="/chronicle" className="signal-item" key={item.id}>
              <span>0{index + 1}</span><strong>{item.title}</strong><Arrow />
            </a>
          ))}
        </div>}
      </section>
      <EventDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  )
}
