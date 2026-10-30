export function PageIntro({ number, eyebrow, title, children }) {
  return (
    <div className="page-intro reveal">
      <span className="section-number">{number}</span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children && <div className="intro-copy">{children}</div>}
      </div>
    </div>
  )
}
