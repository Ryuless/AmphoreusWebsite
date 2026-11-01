import { useState } from 'react'
import { PageIntro } from '../../components/PageIntro'
import { RemoteImage } from '../../components/RemoteImage'
import { formatDate } from '../../utils/formatDate'
import { EventDialog } from './EventDialog'

export function ChroniclePage({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  return (
    <>
      <div className="observatory-page observatory-page--chronicle">
      <PageIntro number="01" eyebrow="The public record" title="Chronicle">
        <p>News, gatherings, and small invitations from the people keeping the lights on.</p>
      </PageIntro>
      <div className="event-list observatory-list">
        {events.map((event, index) => (
          <article className="event-row event-row--clickable reveal" key={event.id} onClick={() => setSelectedEvent(event)} onKeyDown={(keyboardEvent) => { if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') setSelectedEvent(event) }} role="button" tabIndex="0">
            <span className="event-index">0{index + 1}</span>
            <time dateTime={event.date}>{formatDate(event.date)}</time>
            <div className="event-row__body">
              <p className="eyebrow">{event.type}</p>
              <h2>{event.title}</h2>
              <p>{event.summary}</p>
              <span className="event-place">{event.location}</span>
            </div>
            <RemoteImage src={event.image} alt="" />
          </article>
        ))}
        </div>
      </div>
      <EventDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  )
}
