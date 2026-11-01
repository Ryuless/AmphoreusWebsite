import { useEffect, useMemo, useState } from 'react'
import { Arrow } from '../../components/Arrow'
import { RemoteImage } from '../../components/RemoteImage'
import { editorFields } from './editorFields'

export function Editor({ type, items, staff = [], onSave, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const empty = useMemo(
    () => Object.fromEntries(editorFields[type].map(([key]) => [key, ''])),
    [type],
  )
  const [form, setForm] = useState(empty)
  const [openSelect, setOpenSelect] = useState(null)

  useEffect(() => {
    if (!openSelect) return undefined
    function closeSelectMenu(event) {
      if (!event.target.closest('.role-picker')) setOpenSelect(null)
    }
    document.addEventListener('mousedown', closeSelectMenu)
    return () => document.removeEventListener('mousedown', closeSelectMenu)
  }, [openSelect])

  function edit(item) {
    const fields = editorFields[type]
    const values = Object.fromEntries(fields.map(([key]) => [key, item[key] || '']))
    fields.forEach(([key, , inputType, options]) => {
      if (inputType === 'select' && values[key] && !options.includes(values[key])) {
        const matchingOption = options.find((option) => values[key].startsWith(option))
        if (matchingOption) values[key] = matchingOption
      }
    })
    setEditingId(item.id)
    setForm(values)
    setOpenSelect(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() {
    setEditingId(null)
    setForm(empty)
    setOpenSelect(null)
  }

  async function submit(event) {
    event.preventDefault()
    const id = editingId || `${type}-${Date.now()}`
    const item = { ...form, id }
    if (await onSave(type, item)) cancel()
  }

  return (
    <div className={`editor-layout editor-layout--redesigned editor-layout--${type}`}>
      <form className="editor-form" onSubmit={submit}>
        <div className="editor-form__heading">
          <div className="editor-form__mode"><span className="editor-form__mode-dot" />{editingId ? 'Editing existing entry' : 'Ready to create'}</div>
          <p className="eyebrow">{editingId ? 'Update record' : 'New record'}</p>
          <h2>{editingId ? 'Update your entry' : 'Create something new'}</h2>
          <p className="editor-form__description">Add the details that bring your public content to life.</p>
        </div>
        <div className="editor-form__fields">
        {editorFields[type].map(([key, label, inputType, options], index) => {
          const selectOptions = type === 'agenda' && key === 'owner'
            ? [...new Set([...staff.map((person) => person.name).filter(Boolean), ...(form[key] ? [form[key]] : [])])]
            : options
          return (
          <label className={`editor-field editor-field--${inputType} editor-field--${key}`} key={key}><span><b>0{index + 1}</b>{label}</span>
            {inputType === 'select'
              ? <div className={`role-picker ${openSelect === key ? 'is-open' : ''}`}>
                <button className="role-picker__trigger" type="button" aria-haspopup="listbox" aria-expanded={openSelect === key} onClick={() => setOpenSelect((current) => current === key ? null : key)}>
                  <span className={!form[key] ? 'is-placeholder' : ''}>{form[key] || `Select ${key}`}</span><b>⌄</b>
                </button>
                {openSelect === key && <div className="role-picker__menu" role="listbox" aria-label={`Select ${key}`}>
                  {selectOptions.map((option, optionIndex) => <button className={form[key] === option ? 'is-selected' : ''} key={option} type="button" role="option" aria-selected={form[key] === option} onClick={() => { setForm({ ...form, [key]: option }); setOpenSelect(null) }}><span>0{optionIndex + 1}</span>{option}<i>{form[key] === option ? 'Selected' : 'Choose'}</i></button>)}
                </div>}
              </div>
              : inputType === 'textarea'
              ? <textarea value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />
              : <input type={inputType} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />}
          </label>
        )})}
        </div>
        <div className="form-actions"><button className="button button--dark" type="submit">{editingId ? 'Save changes' : 'Publish entry'} <Arrow /></button>{editingId && <button className="button button--quiet" type="button" onClick={cancel}>Discard changes</button>}</div>
      </form>
      <div className="editor-items editor-library">
        <div className="editor-library__header"><div><p className="eyebrow">Your collection</p><h3>{items.length} {type} {items.length === 1 ? 'entry' : 'entries'}</h3></div><span className="editor-library__sort">Recently added <b>↓</b></span></div>
        {items.length === 0 && <div className="editor-library__empty"><span>✦</span><strong>Your archive is quiet.</strong><p>Create the first entry using the form.</p></div>}
        {items.map((item, index) => (
          <div className="editor-item editor-library__item" key={item.id}>
            <span className="editor-library__index">{String(index + 1).padStart(2, '0')}</span>
            {type === 'staff' && <div className="editor-library__avatar">
              <span>{(item.name || 'Staff').slice(0, 2).toUpperCase()}</span>
              {item.image && <RemoteImage src={item.image} alt={`Foto ${item.name || 'staff'}`} onError={(event) => { event.currentTarget.style.display = 'none' }} />}
            </div>}
            <div className="editor-library__item-main"><span className="editor-library__tag">{type === 'agenda' ? `${item.category || 'Agenda'} · ${item.role || item.owner || 'Unassigned'}` : item.role || item.status || item.type || 'Entry'}</span><strong>{item.name || item.title}</strong><p>{item.summary || item.detail || item.focus || item.credit || 'No description added yet.'}</p></div>
            <div className="editor-item__actions"><button type="button" onClick={() => edit(item)}>Edit <span>↗</span></button><button type="button" onClick={() => onDelete(type, item.id)}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
