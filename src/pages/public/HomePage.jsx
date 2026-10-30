import { Arrow } from '../../components/Arrow'
import { BrandMark } from '../../components/BrandMark'
import { EventFeature } from './EventFeature'
import { StaffPreview } from './StaffPreview'

export function HomePage({ content }) {
  const event = content.events[0]
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span className="eyebrow-dot" /> {content.site.eyebrow}</p>
          <h1>Find your place<br /><i>in the universe.</i></h1>
          <p className="hero-lede">{content.site.intro}</p>
          <a className="text-link" href="/chronicle">Read the chronicle <Arrow /></a>
        </div>
        <div className="hero-orbit reveal" aria-label="Amphoreus emblem">
          <div className="orbit orbit--a" />
          <div className="orbit orbit--b" />
          <BrandMark />
          <span className="orbit-label orbit-label--top">A small world<br />with room to grow</span>
          <span className="orbit-label orbit-label--bottom">01 / 04<br /><b>the constellation</b></span>
        </div>
      </section>
      <section className="home-signal ruled-section">
        <div className="section-kicker">01 <span>Signal from the council</span></div>
        <StaffPreview staff={content.staff} />
      </section>
      <section className="home-feature ruled-section">
        <div className="section-kicker">02 <span>Next on the horizon</span></div>
        <EventFeature event={event} />
      </section>
    </>
  )
}
