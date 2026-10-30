import { Footer, Header } from '../../components/SiteChrome'
import { AgendaPage } from './AgendaPage'
import { ChroniclePage } from './ChroniclePage'
import { CouncilPage } from './CouncilPage'
import { GalleryPage } from './GalleryPage'
import { HomePage } from './HomePage'

export function PublicSite({ content, page }) {
  const pages = {
    home: <HomePage content={content} />,
    chronicle: <ChroniclePage events={content.events} />,
    gallery: <GalleryPage gallery={content.gallery} />,
    council: <CouncilPage site={content.site} staff={content.staff} />,
    agenda: <AgendaPage agenda={content.agenda} />,
  }
  return (
    <div className="public-shell">
      <Header page={page} />
      <main className="page-content">{pages[page] || pages.home}</main>
      <Footer />
    </div>
  )
}
