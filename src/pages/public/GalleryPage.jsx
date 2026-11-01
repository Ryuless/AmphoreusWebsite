import { useState } from 'react'
import { PageIntro } from '../../components/PageIntro'
import { RemoteImage } from '../../components/RemoteImage'
import { GalleryDialog } from './GalleryDialog'

export function GalleryPage({ gallery }) {
  const [selectedImage, setSelectedImage] = useState(null)
  return (
    <div className="observatory-page observatory-page--gallery">
      <PageIntro number="02" eyebrow="Collected moments" title="Gallery">
        <p>A visual field note from the places, moods, and people that make this world feel like ours.</p>
      </PageIntro>
      <div className="gallery-signal-bar">
        <span><i /> Archive open</span>
        <strong>{String(gallery.length).padStart(2, '0')} collected frames</strong>
        <b>Visual memory / AM-02</b>
      </div>
      <div className="gallery-grid observatory-gallery">
        {gallery.map((image, index) => (
          <figure className={`gallery-item gallery-item--${(index % 4) + 1} reveal`} key={image.id} role="button" tabIndex="0" onClick={() => setSelectedImage(image)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedImage(image) } }}>
            <RemoteImage src={image.image} alt={image.title} />
            <figcaption><span>{image.title}</span><small>{image.credit}</small></figcaption>
          </figure>
        ))}
      </div>
      <GalleryDialog image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  )
}
