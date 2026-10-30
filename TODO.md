Project Website Community

!! Warning Note !! (wajib di baca)
1. untuk struktur folder dan file buat rapi dan terstruktur

- Step 1 (kenali tentang website) — selesai
    - [x] website bernama amphoreus universe
    - [x] website bertema fantasy dengan icon identik cawan dengan sebuah ring galaksi di sekelilingnya
    - [x] staff role ada primodial sebagai role tertinggi, titan sebagai pengerak sekaligus pembuat event/acara server, titan sebagai penegak keamanan dan keadilan server terkait rules, demigod sebagai jembatan informasi tentang peringatan/event yang akan datang/informasi seputar server
    - [x] server didirikan Est. juni 2026

- Step 2 (desain website) — selesai
    - [x] desain natural dengan warna solid, tanpa gradient atau card UI
    - [x] UI/UX clean, fresh, dan bertema Amphoreus
    - [x] admin dashboard glassy, dynamic, dan masih satu tema
    - [x] animasi ringan untuk memperbagus desain
    - [x] setiap page punya hash URL terpisah
    - [x] admin dashboard berada di URL khusus `#/orbitnya`


- Step 3 (fitur website) — selesai
    - [x] profile server, profile admin, bio, event, galeri, dan agenda
    - [x] CRUD dashboard untuk agenda, event, galeri, dan profile admin
    - [x] edit bio/kata-kata admin dari dashboard
    - [x] login Firebase Email/Password dengan route khusus
    - [x] semua aset gambar memakai URL eksternal

- Step 4 (database) — selesai
    - [x] sinkronisasi Firestore dengan fallback local draft
    - [x] login dashboard menggunakan akun Firebase yang tersedia
    - [x] collection `events`, `staff`, `gallery`, `agenda`, dan `site/public`
    - [x] Firestore rules: baca publik, tulis hanya user terautentikasi

- Step 5 (finishing) — selesai
    - [x] responsive layout dan direct-link route
    - [x] lint dan production build berhasil
    - [x] dokumentasi setup Firebase diperbarui di README

- Firebase Sinkornasi
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXC7DeIm7aqgvoseep27DP3kfcZtcEVMs",
  authDomain: "amphoreusuniverse.firebaseapp.com",
  projectId: "amphoreusuniverse",
  storageBucket: "amphoreusuniverse.firebasestorage.app",
  messagingSenderId: "1030309696709",
  appId: "1:1030309696709:web:d0f33e36b1c699e94eccac",
  measurementId: "G-T7EL47LJ3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);