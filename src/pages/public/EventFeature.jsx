import { Arrow } from '../../components/Arrow'
import { RemoteImage } from '../../components/RemoteImage'
import { formatDate } from '../../utils/formatDate'

export function EventFeature({ event, onOpen }) {
  if (!event) return <p className="empty-state">The horizon is quiet for now. Check back soon.</p>
  return (
    <div className="event-feature event-feature--clickable" onClick={() => onOpen?.(event)} onKeyDown={(keyboardEvent) => { if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') onOpen?.(event) }} role={onOpen ? 'button' : undefined} tabIndex={onOpen ? 0 : undefined}>
      <RemoteImage src={event.image} alt="" />
      <div className="event-feature__copy">
        <p className="eyebrow">{event.type} · {formatDate(event.date)}</p>
        <h2>{event.title}</h2>
        <p>{event.summary}</p>
        <span className="event-place">{event.location}</span>
        <a className="text-link" href="/chronicle">View all signals <Arrow /></a>
      </div>
    </div>
  )
}
