import { PageIntro } from '../../components/PageIntro'
import { RemoteImage } from '../../components/RemoteImage'

export function CouncilPage({ site, staff }) {
  return (
    <div className="observatory-page observatory-page--council">
      <PageIntro number="03" eyebrow="The people who keep watch" title="Council">
        <p>{site.bio}</p>
      </PageIntro>
      <section className="council-grid">
        {staff.map((person, index) => (
          <article className="council-card reveal" key={person.id}>
            <div className="council-card__image">
              <RemoteImage src={person.image} alt={`${person.name} profile`} />
              <span>0{index + 1}</span>
            </div>
            <div className="council-card__body">
              <p className="eyebrow">{person.role}</p>
              <h2>{person.name}</h2>
              <span className="council-card__focus">{person.focus}</span>
              <p>{person.bio}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
