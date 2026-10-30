import { useMemo, useState } from 'react'
import { Arrow } from '../../components/Arrow'
import { editorFields } from './editorFields'

export function Editor({ type, items, onSave, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const empty = useMemo(
    () => Object.fromEntries(editorFields[type].map(([key]) => [key, ''])),
    [type],
  )
  const [form, setForm] = useState(empty)

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel() {
    setEditingId(null)
    setForm(empty)
  }

  async function submit(event) {
    event.preventDefault()
    const id = editingId || `${type}-${Date.now()}`
    if (await onSave(type, { ...form, id })) cancel()
  }

  return (
    <div className="editor-layout">
      <form className="editor-form" onSubmit={submit}>
        <div className="editor-form__heading"><p className="eyebrow">{editingId ? 'Edit entry' : 'New entry'}</p><h2>{type}</h2></div>
        {editorFields[type].map(([key, label, inputType, options]) => (
          <label key={key}>{label}
            {inputType === 'select'
              ? <select value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required>
                <option value="" disabled>Select a role</option>
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              : inputType === 'textarea'
              ? <textarea value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />
              : <input type={inputType} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />}
          </label>
        ))}
        <div className="form-actions"><button className="button button--dark" type="submit">{editingId ? 'Save changes' : 'Add entry'} <Arrow /></button>{editingId && <button className="button button--quiet" type="button" onClick={cancel}>Cancel</button>}</div>
      </form>
      <div className="editor-items">
        {items.map((item) => (
          <div className="editor-item" key={item.id}>
            <div><span className="eyebrow">{item.role || item.status || item.type || 'Entry'}</span><strong>{item.name || item.title}</strong></div>
            <div className="editor-item__actions"><button type="button" onClick={() => edit(item)}>Edit</button><button type="button" onClick={() => onDelete(type, item.id)}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
