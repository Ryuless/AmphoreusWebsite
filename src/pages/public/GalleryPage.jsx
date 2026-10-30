import { PageIntro } from '../../components/PageIntro'
import { getImageUrl } from '../../utils/imageUrl'

export function GalleryPage({ gallery }) {
  return (
    <>
      <PageIntro number="02" eyebrow="Collected moments" title="Gallery">
        <p>A visual field note from the places, moods, and people that make this world feel like ours.</p>
      </PageIntro>
      <div className="gallery-grid">
        {gallery.map((image, index) => (
          <figure className={`gallery-item gallery-item--${(index % 4) + 1} reveal`} key={image.id}>
            <img src={getImageUrl(image.image)} alt={image.title} />
            <figcaption><span>{image.title}</span><small>{image.credit}</small></figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}
