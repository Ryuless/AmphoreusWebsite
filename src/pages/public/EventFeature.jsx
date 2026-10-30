import { Arrow } from '../../components/Arrow'
import { formatDate } from '../../utils/formatDate'
import { getImageUrl } from '../../utils/imageUrl'

export function EventFeature({ event }) {
  if (!event) return <p className="empty-state">The horizon is quiet for now. Check back soon.</p>
  return (
    <div className="event-feature">
      <img src={getImageUrl(event.image)} alt="" />
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
