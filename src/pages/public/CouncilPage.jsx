import { PageIntro } from '../../components/PageIntro'
import { getImageUrl } from '../../utils/imageUrl'

export function CouncilPage({ site, staff }) {
  return (
    <>
      <PageIntro number="03" eyebrow="The people who keep watch" title="Council">
        <p>{site.bio}</p>
      </PageIntro>
      <section className="staff-list">
        {staff.map((person, index) => (
          <article className="staff-row reveal" key={person.id}>
            <span className="staff-number">0{index + 1}</span>
            <img src={getImageUrl(person.image)} alt="" />
            <div className="staff-info">
              <p className="eyebrow">{person.role}</p>
              <h2>{person.name}</h2>
              <p>{person.bio}</p>
            </div>
            <span className="staff-focus">{person.focus}</span>
          </article>
        ))}
      </section>
    </>
  )
}
