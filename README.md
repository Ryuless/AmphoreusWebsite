# Amphoreus Universe

Website komunitas Amphoreus Universe dengan visual observatory/celestial. Project ini memiliki website publik dan dashboard admin untuk mengelola event, staff/council, gallery, agenda, profil website, serta carousel Homepage.

## Fitur

### Website publik

- Homepage observatory dengan starfield, statistik, council preview, carousel event, carousel gallery, dan field log.
- Chronicle untuk daftar event.
- Gallery dengan grid gambar dan popup detail.
- Council untuk profil staff.
- Agenda untuk Agenda dan Program Kerja.
- Filter Agenda berdasarkan Type dan Role.
- Popup detail untuk event, agenda, dan gambar gallery.
- Zoom gambar pada popup event.
- Keyboard support: `Enter`, `Space`, dan `Escape`.
- Dark/light theme yang disimpan di browser.
- Dukungan URL gambar langsung, Google Drive, Pinterest, dan `pin.it`.

### Homepage carousel

Menu **Carousel** pada dashboard mengatur dua carousel secara terpisah:

- Event Carousel: maksimal 5 event.
- Gallery Carousel: maksimal 5 gambar.
- Urutan mengikuti urutan pilihan yang disimpan.
- Jika pengaturan belum tersedia pada data lama, item default digunakan hingga maksimal 5.
- Jika pengaturan sudah tersedia tetapi tidak ada item yang dicentang, carousel kosong.
- Field Log tetap menampilkan maksimal 3 event terbaru dari seluruh koleksi event, terpisah dari Event Carousel.

### Dashboard admin

Dashboard tersedia pada `/celestial-control` dan membutuhkan Firebase Email/Password Authentication.

| Menu | Fungsi |
| --- | --- |
| Events | CRUD event dan pengumuman |
| Staff | CRUD profil council/staff |
| Gallery | CRUD gambar dan kredit |
| Agenda | CRUD Agenda dan Program Kerja |
| Carousel | Memilih maksimal 5 event dan 5 gallery untuk Homepage |
| Site profile | Mengatur eyebrow, intro, dan bio website |

Fitur admin:

- Status koneksi Firestore: local, syncing, synced, atau error.
- Fallback/cache konten melalui localStorage.
- Notifikasi kecil setelah pengaturan carousel berhasil disimpan.
- Owner Agenda berupa dropdown dinamis dari nama Staff.
- Logout otomatis saat meninggalkan dashboard.

## Teknologi

- React 19
- React DOM 19
- Vite 8
- Firebase 13
  - Firebase Authentication
  - Cloud Firestore
- Oxlint
- CSS custom responsive

## Menjalankan project

Persyaratan: Node.js modern dan npm.

```bash
git clone <repository-url>
cd AmphoreusWebsite
npm install
npm run dev
```

Command lain:

```bash
npm run lint       # Menjalankan Oxlint
npm run build      # Membuat production build
npm run preview    # Preview production build
git diff --check   # Memeriksa whitespace pada perubahan
```

## Konfigurasi Firebase

Konfigurasi client berada di [src/firebase.js](./src/firebase.js). Gunakan environment variable Vite berikut jika ingin mengganti konfigurasi default:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

File [`.env.example`](./.env.example) berisi contoh konfigurasi Firebase Admin SDK untuk proses server-side/seed. Jangan commit `.env`, private key, atau service-account JSON.

Aktifkan Email/Password Authentication pada Firebase Console dan buat akun admin. Route admin bukan pengganti authentication; akses sebenarnya tetap dikontrol Firebase Authentication.

Rules Firestore berada di [firestore.rules](./firestore.rules):

- Read konten publik diizinkan.
- Write membutuhkan user Firebase yang terautentikasi.

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

### Vercel

Project ini menggunakan Vite dan dapat dideploy langsung ke Vercel. Konfigurasi [vercel.json](./vercel.json) menyediakan fallback SPA agar route seperti `/gallery`, `/council`, dan `/agenda` tidak menghasilkan 404 saat dibuka langsung.

Gunakan pengaturan berikut jika Vercel meminta konfigurasi manual:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Route

Routing ringan memakai pathname melalui [src/hooks/usePage.js](./src/hooks/usePage.js), tanpa React Router.

### Public

```text
/home
/chronicle
/gallery
/council
/agenda
```

### Admin

```text
/celestial-control/events
/celestial-control/staff
/celestial-control/gallery
/celestial-control/agenda
/celestial-control/carousel
/celestial-control/site
```

Hash route lama (`#/...`) otomatis dinormalisasi ke clean URL.

## Struktur data Firestore

### `site/public`

```js
{
  name: 'Amphoreus Universe',
  eyebrow: '...',
  intro: '...',
  bio: '...',
  featuredGalleryIds: ['gallery-id-1'],
  featuredEventIds: ['event-id-1']
}
```

`featuredGalleryIds` dan `featuredEventIds` masing-masing dibatasi maksimal 5 melalui dashboard.

### `events`

```js
{
  id: 'event-id',
  title: 'Event title',
  date: '2026-07-12',
  type: 'Gathering',
  location: 'The Astral Hall',
  summary: 'Event summary',
  image: 'https://...'
}
```

### `staff`

```js
{
  id: 'staff-id',
  name: 'Staff name',
  role: 'Primordial',
  focus: 'Direction & care',
  bio: 'Staff biography',
  image: 'https://...'
}
```

Role bawaan: `Primordial`, `Titan`, `Olympus`, dan `Demigod`.

### `gallery`

```js
{
  id: 'gallery-id',
  title: 'Image title',
  credit: 'Image credit',
  image: 'https://...'
}
```

### `agenda`

```js
{
  id: 'agenda-id',
  title: 'Agenda title',
  category: 'Agenda',
  status: 'In motion',
  role: 'Primordial',
  owner: 'Staff name',
  detail: 'Agenda detail'
}
```

Category bawaan: `Agenda` dan `Program Kerja`.

## Sinkronisasi dan penyimpanan

[src/hooks/useContentStore.js](./src/hooks/useContentStore.js) melakukan hal berikut:

1. Membaca initial state dari localStorage.
2. Mendengarkan update realtime Firestore.
3. Menulis perubahan ke localStorage.
4. Menyimpan item ke koleksi Firestore.
5. Menghapus item dari Firestore dan state lokal.
6. Menampilkan status sinkronisasi dan error secara eksplisit.

Key localStorage:

```text
amphoreus-universe-content
amphoreus-universe-theme
```

Default content dan nama koleksi berada di [src/data/content.js](./src/data/content.js).

## Gambar eksternal

[src/components/RemoteImage.jsx](./src/components/RemoteImage.jsx) mendukung:

- URL file gambar langsung.
- URL sharing Google Drive.
- URL halaman Pinterest melalui oEmbed.
- Domain `pin.it`.

Pastikan file atau halaman gambar dapat diakses publik. Pinterest page URL tidak selalu merupakan URL file gambar langsung, sehingga komponen menggunakan resolver oEmbed.

## Struktur kode

- [src/App.jsx](./src/App.jsx): route boundary dan admin logout guard.
- [src/App.css](./src/App.css): sistem visual publik dan admin.
- [src/pages/admin/AdminPanel.jsx](./src/pages/admin/AdminPanel.jsx): shell dashboard.
- [src/pages/admin/Editor.jsx](./src/pages/admin/Editor.jsx): form CRUD.
- [src/pages/admin/editorFields.js](./src/pages/admin/editorFields.js): definisi field tiap koleksi.
- [src/pages/public/HomePage.jsx](./src/pages/public/HomePage.jsx): Homepage.
- [src/pages/public/HomeCarousel.jsx](./src/pages/public/HomeCarousel.jsx): carousel event/gallery.
- [src/pages/public/AgendaPage.jsx](./src/pages/public/AgendaPage.jsx): Agenda dan filter.
- [src/pages/public/EventDialog.jsx](./src/pages/public/EventDialog.jsx): popup event dan zoom.
- [src/pages/public/AgendaDialog.jsx](./src/pages/public/AgendaDialog.jsx): popup Agenda.
- [src/pages/public/GalleryDialog.jsx](./src/pages/public/GalleryDialog.jsx): popup gallery.
- [src/pages/public/PublicSite.jsx](./src/pages/public/PublicSite.jsx): pemetaan halaman publik.
- [src/data/content.js](./src/data/content.js): default content dan local persistence.

## Validasi sebelum deploy

```bash
npm run lint
npm run build
git diff --check
```

Vite dapat menampilkan warning ukuran JavaScript chunk lebih dari 500 kB. Warning tersebut tidak menggagalkan build apabila proses berakhir sukses.

## Keamanan

- Jangan commit `.env` atau service-account JSON.
- Jangan menaruh Firebase private key pada kode client.
- Batasi akun Firebase yang memiliki akses admin.
- Review [firestore.rules](./firestore.rules) sebelum production.
- Gunakan gambar dan materi eksternal yang memiliki izin penggunaan.
