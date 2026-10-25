export function Button({ children, onClick, dark = false }) {
  return <button className={`button ${dark ? 'button-dark' : 'button-primary'}`} onClick={onClick}>{children} <span>↗</span></button>
}

export function Heading({ eyebrow, title, action, onAction }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action && <button className="text-link" onClick={onAction}>{action}</button>}</div>
}

export function EventCard({ event }) {
  const normalized = Array.isArray(event) ? { day: event[0], month: event[1], title: event[2], description: event[3], tag: event[4] } : { day: event.date?.slice(-2) || '—', month: event.date?.slice(5, 7) || 'LIVE', title: event.title, description: event.description, tag: 'Community' }
  return <article className="event-card"><div className="event-date"><strong>{normalized.day}</strong><span>{normalized.month}</span></div><div className="event-body"><span className="tag">{normalized.tag}</span><h3>{normalized.title}</h3><p>{normalized.description}</p><button className="arrow-button">↗</button></div></article>
}

export function StaffList({ staff }) {
  return <div className="staff-grid">{staff.map((person) => <article className="staff-card" key={person.name}><div className={`staff-avatar ${person.color}`}>{person.initials}</div><h3>{person.name}</h3><p>{person.role}</p><span className="online-indicator" /></article>)}</div>
}

export function Leaderboard({ users }) {
  return <div className="leaderboard-panel"><Heading eyebrow="Papan peringkat" title={<>Member <em>teraktif.</em></>} /><div className="leaderboard">{users.map((user, i) => <div className="leader-row" key={user[0]}><span className={`rank rank-${i + 1}`}>{i + 1}</span><span className="mini-avatar">{user[0].slice(0, 2)}</span><strong>{user[0]}</strong><span className="level">Lv. {user[2]}</span><b>{user[1]} <small>XP</small></b></div>)}</div></div>
}
