import { Arrow } from '../../components/Arrow'
import { getImageUrl } from '../../utils/imageUrl'

export function StaffPreview({ staff }) {
  return (
    <div className="staff-preview">
      {staff.map((person, index) => (
        <article className="staff-preview__person reveal" key={person.id}>
          <div className="staff-preview__image">
            <img src={getImageUrl(person.image)} alt={`${person.name} profile`} />
            <span className="staff-preview__number">0{index + 1}</span>
          </div>
          <div className="staff-preview__details">
            <h2>{person.name}</h2>
            <p className="staff-preview__role">{person.role} <span>·</span> {person.focus}</p>
            <p className="staff-preview__bio">{person.bio}</p>
          </div>
        </article>
      ))}
      <a className="text-link staff-preview__link" href="/council">View the full council <Arrow /></a>
    </div>
  )
}
