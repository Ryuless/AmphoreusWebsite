# Amphoreus Universe

The public community website for Amphoreus Universe, built with React, Vite, Firebase Authentication, and Firestore.

## Project structure

```text
src/
├── components/       # Shared visual pieces: mark, arrow, header, footer, intro
├── data/             # Default public content and local-storage persistence helpers
├── hooks/             # URL routing and Firestore/local content state
├── pages/
│   ├── public/       # One component per public page
│   └── admin/        # Private login, dashboard, and CRUD editor
└── utils/             # Small shared formatting helpers
```

`src/App.jsx` is intentionally kept as a small route boundary. Page-specific UI lives in its matching `pages/` folder.

The interface has two themes: dark is the default, and the light theme is available from the theme toggle in the public header and control room. The selected theme is remembered in the browser.

## Run locally

```bash
npm install
npm run dev
```

The production checks are:

```bash
npm run lint
npm run build
```

## Routes

The public site uses clean URL paths so every area has a direct link:

- `/home` — introduction and the next event
- `/chronicle` — events and announcements
- `/gallery` — external image gallery
- `/council` — staff profiles and the council message
- `/agenda` — administration programs
- `/celestial-control` — private admin route

Firebase Hosting rewrites these paths to the React entry point. Existing `#/...` links are migrated to their clean path automatically.

The control room always requires Firebase Email/Password Authentication. The route being non-public is only a discovery measure; Firebase Authentication is the actual access control.

## Firebase

The web configuration is kept in `src/firebase.js` and can be overridden with Vite environment variables:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Create the council account in Firebase Authentication using Email/Password, then use that account on the control-room route. Never put the Firebase Admin SDK service-account JSON in this project or in client-side code.

The configured council email is `celestial@gmail.com` and the login form pre-fills it for convenience. Set or reset its password in Firebase Console under **Authentication → Users**; the password is intentionally not stored in this repository.

Firestore collections used by the dashboard:

- `site/public` — public intro and bio
- `events` — event and announcement entries
- `staff` — council profiles and roles
- `gallery` — external image URLs and credits
- `agenda` — programs of work

Image fields accept normal image URLs and Google Drive sharing links such as
`https://drive.google.com/file/d/FILE_ID/view?usp=drive_link`. Drive files must
be shared as **Anyone with the link** so browsers can load the image. Drive
links are converted to Google's direct image host for reliable embedding.

The app also keeps a local draft in browser storage. This lets the public experience remain usable when Firestore is unavailable; dashboard writes are mirrored to Firestore when the connection and permissions are available.

Public pages and the control room use Firestore realtime listeners. A successful dashboard write is reflected in open homepage tabs without a manual refresh. If a write or listener fails, the control room shows the Firebase error instead of reporting a false success.

Deploy the rules with the Firebase CLI from this directory:

```bash
firebase deploy --only firestore:rules
```
