import { useEffect, useMemo, useRef, useState } from 'react'
import { Arrow } from '../../components/Arrow'
import { editorFields } from './editorFields'
import { getImageUrl } from '../../utils/imageUrl'

export function Editor({ type, items, onSave, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const empty = useMemo(
    () => Object.fromEntries(editorFields[type].map(([key]) => [key, ''])),
    [type],
  )
  const [form, setForm] = useState(empty)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const roleMenuRef = useRef(null)

  useEffect(() => {
    if (!roleMenuOpen) return undefined
    function closeRoleMenu(event) {
      if (!roleMenuRef.current?.contains(event.target)) setRoleMenuOpen(false)
    }
    document.addEventListener('mousedown', closeRoleMenu)
    return () => document.removeEventListener('mousedown', closeRoleMenu)
  }, [roleMenuOpen])

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
    setRoleMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() {
    setEditingId(null)
    setForm(empty)
    setRoleMenuOpen(false)
  }

  async function submit(event) {
    event.preventDefault()
    const id = editingId || `${type}-${Date.now()}`
    if (await onSave(type, { ...form, id })) cancel()
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
        {editorFields[type].map(([key, label, inputType, options], index) => (
          <label className={`editor-field editor-field--${inputType} editor-field--${key}`} key={key}><span><b>0{index + 1}</b>{label}</span>
            {inputType === 'select'
              ? <div className={`role-picker ${roleMenuOpen ? 'is-open' : ''}`} ref={roleMenuRef}>
                <button className="role-picker__trigger" type="button" aria-haspopup="listbox" aria-expanded={roleMenuOpen} onClick={() => setRoleMenuOpen((open) => !open)}>
                  <span className={!form[key] ? 'is-placeholder' : ''}>{form[key] || 'Select a role'}</span><b>⌄</b>
                </button>
                {roleMenuOpen && <div className="role-picker__menu" role="listbox" aria-label="Staff role">
                  {options.map((option, optionIndex) => <button className={form[key] === option ? 'is-selected' : ''} key={option} type="button" role="option" aria-selected={form[key] === option} onClick={() => { setForm({ ...form, [key]: option }); setRoleMenuOpen(false) }}><span>0{optionIndex + 1}</span>{option}<i>{form[key] === option ? 'Selected' : 'Choose'}</i></button>)}
                </div>}
              </div>
              : inputType === 'textarea'
              ? <textarea value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />
              : <input type={inputType} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />}
          </label>
        ))}
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
              {item.image && <img src={getImageUrl(item.image)} alt={`Foto ${item.name || 'staff'}`} onError={(event) => { event.currentTarget.style.display = 'none' }} />}
            </div>}
            <div className="editor-library__item-main"><span className="editor-library__tag">{item.role || item.status || item.type || 'Entry'}</span><strong>{item.name || item.title}</strong><p>{item.summary || item.detail || item.focus || item.credit || 'No description added yet.'}</p></div>
            <div className="editor-item__actions"><button type="button" onClick={() => edit(item)}>Edit <span>↗</span></button><button type="button" onClick={() => onDelete(type, item.id)}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
