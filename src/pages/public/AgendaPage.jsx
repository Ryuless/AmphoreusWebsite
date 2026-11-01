import { useEffect, useMemo, useState } from 'react'
import { PageIntro } from '../../components/PageIntro'
import { AgendaDialog } from './AgendaDialog'

const agendaCategories = ['All', 'Agenda', 'Program Kerja']
const agendaRoles = ['All', 'Primordial', 'Titan', 'Olympus', 'Demigod']

function getAgendaCategory(item) {
  return item.category?.toLowerCase() === 'program kerja' ? 'Program Kerja' : 'Agenda'
}

function getAgendaRole(item) {
  const value = item.role || item.owner || 'Unassigned'
  return agendaRoles.find((role) => role !== 'All' && value.startsWith(role)) || value
}

export function AgendaPage({ agenda }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [openFilter, setOpenFilter] = useState(null)
  const categories = useMemo(() => [...agendaCategories, ...new Set(agenda.map((item) => item.category).filter((category) => category && !agendaCategories.includes(category)))], [agenda])
  const roles = useMemo(() => [...agendaRoles, ...new Set(agenda.map(getAgendaRole).filter((role) => role !== 'Unassigned' && !agendaRoles.includes(role)))], [agenda])
  const filteredAgenda = agenda.filter((item) => {
    const category = getAgendaCategory(item)
    const role = getAgendaRole(item)
    return (categoryFilter === 'All' || category === categoryFilter) && (roleFilter === 'All' || role === roleFilter)
  })

  function openItem(item) {
    setSelectedItem(item)
  }

  useEffect(() => {
    if (!openFilter) return undefined
    function closeFilter(event) {
      if (!event.target.closest('.agenda-filter')) setOpenFilter(null)
    }
    document.addEventListener('mousedown', closeFilter)
    return () => document.removeEventListener('mousedown', closeFilter)
  }, [openFilter])

  function chooseFilter(filter, value) {
    if (filter === 'category') setCategoryFilter(value)
    if (filter === 'role') setRoleFilter(value)
    setOpenFilter(null)
  }

  function renderFilter(filter, label, value, options, allLabel) {
    return (
      <div className={`agenda-filter ${openFilter === filter ? 'is-open' : ''}`}>
        <span>{label}</span>
        <button type="button" aria-haspopup="listbox" aria-expanded={openFilter === filter} onClick={() => setOpenFilter((current) => current === filter ? null : filter)}>
          <strong>{value === 'All' ? allLabel : value}</strong><i>⌄</i>
        </button>
        {openFilter === filter && <div className="agenda-filter__menu" role="listbox" aria-label={`${label} filter`}>
          {options.map((option, index) => <button type="button" role="option" aria-selected={value === option} className={value === option ? 'is-selected' : ''} key={option} onClick={() => chooseFilter(filter, option)}><span>0{index + 1}</span><b>{option === 'All' ? allLabel : option}</b>{value === option && <i>Active</i>}</button>)}
        </div>}
      </div>
    )
  }

  return (
    <div className="observatory-page observatory-page--agenda">
      <PageIntro number="04" eyebrow="The work in front of us" title="Agenda">
        <p>Not a roadmap. A set of promises we keep returning to, together.</p>
      </PageIntro>
      <div className="agenda-filters" aria-label="Filter agenda">
        <div className="agenda-filters__intro"><span className="agenda-filters__mark">⌁</span><div><p>Browse the work</p><span>{filteredAgenda.length} of {agenda.length} entries visible</span></div></div>
        <div className="agenda-filters__fields">
          {renderFilter('category', 'Type', categoryFilter, categories, 'All types')}
          {renderFilter('role', 'Role', roleFilter, roles, 'All roles')}
        </div>
        {(categoryFilter !== 'All' || roleFilter !== 'All') && <button className="agenda-filters__reset" type="button" onClick={() => { setCategoryFilter('All'); setRoleFilter('All') }}><span>×</span> Clear</button>}
      </div>
      <div className="agenda-list observatory-mission-list">
        {filteredAgenda.map((item, index) => (
          <article className="agenda-row reveal" key={item.id} role="button" tabIndex="0" onClick={() => openItem(item)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openItem(item) } }}>
            <span className="agenda-index">0{index + 1}</span>
            <div>
              <div className="agenda-row__meta">
                <span><b>Type</b>{getAgendaCategory(item)}</span>
                <span><b>Role</b>{getAgendaRole(item)}</span>
                <span><b>Owner</b>{item.owner || 'Unassigned'}</span>
                <span><b>Status</b>{item.status || 'Unspecified'}</span>
              </div>
              <h2>{item.title}</h2>
            </div>
            <p>{item.detail}</p>
            <span className="arrow" title={item.owner || 'Ketua pelaksana'}>↗</span>
          </article>
        ))}
        {filteredAgenda.length === 0 && <div className="agenda-empty">No entries match these filters.</div>}
      </div>
      <AgendaDialog item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
