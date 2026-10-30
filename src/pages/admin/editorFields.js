export const editorFields = {
  events: [
    ['title', 'Title', 'text'],
    ['date', 'Date', 'date'],
    ['type', 'Type', 'text'],
    ['location', 'Location', 'text'],
    ['summary', 'Summary', 'textarea'],
    ['image', 'Image URL', 'url'],
  ],
  staff: [
    ['name', 'Name', 'text'],
    ['role', 'Role', 'select', ['Primordial', 'Titan', 'Olympus', 'Demigod']],
    ['focus', 'Focus', 'text'],
    ['bio', 'Bio', 'textarea'],
    ['image', 'Image URL', 'url'],
  ],
  gallery: [
    ['title', 'Title', 'text'],
    ['credit', 'Credit', 'text'],
    ['image', 'Image URL', 'url'],
  ],
  agenda: [
    ['title', 'Title', 'text'],
    ['status', 'Status', 'text'],
    ['owner', 'Owner', 'text'],
    ['detail', 'Detail', 'textarea'],
  ],
}
