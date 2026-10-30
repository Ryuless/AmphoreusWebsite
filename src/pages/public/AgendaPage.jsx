import { PageIntro } from '../../components/PageIntro'

export function AgendaPage({ agenda }) {
  return (
    <>
      <PageIntro number="04" eyebrow="The work in front of us" title="Agenda">
        <p>Not a roadmap. A set of promises we keep returning to, together.</p>
      </PageIntro>
      <div className="agenda-list">
        {agenda.map((item, index) => (
          <article className="agenda-row reveal" key={item.id}>
            <span className="agenda-index">0{index + 1}</span>
            <div><p className="eyebrow">{item.status} · {item.owner}</p><h2>{item.title}</h2></div>
            <p>{item.detail}</p>
            <span className="arrow">↗</span>
          </article>
        ))}
      </div>
    </>
  )
}
