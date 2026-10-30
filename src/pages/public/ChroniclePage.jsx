import { PageIntro } from '../../components/PageIntro'
import { formatDate } from '../../utils/formatDate'
import { getImageUrl } from '../../utils/imageUrl'

export function ChroniclePage({ events }) {
  return (
    <>
      <PageIntro number="01" eyebrow="The public record" title="Chronicle">
        <p>News, gatherings, and small invitations from the people keeping the lights on.</p>
      </PageIntro>
      <div className="event-list">
        {events.map((event, index) => (
          <article className="event-row reveal" key={event.id}>
            <span className="event-index">0{index + 1}</span>
            <time dateTime={event.date}>{formatDate(event.date)}</time>
            <div className="event-row__body">
              <p className="eyebrow">{event.type}</p>
              <h2>{event.title}</h2>
              <p>{event.summary}</p>
              <span className="event-place">{event.location}</span>
            </div>
            <img src={getImageUrl(event.image)} alt="" />
          </article>
        ))}
      </div>
    </>
  )
}
