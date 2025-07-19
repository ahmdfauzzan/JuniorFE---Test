# Technical Test Junior FE Support Be

Backend API untuk aplikasi Technical Test Junior FE Support Be yang dibangun dengan Node.js, Express, dan SQLite.

## Persyaratan Sistem

- Node.js (versi 16 atau lebih tinggi)
- npm atau yarn
- SQLite3

## Instalasi

### Install dependencies
Gunakan salah satu perintah berikut:

```bash
# Menggunakan yarn (disarankan)
yarn install

# Atau menggunakan npm
npm install
```

## Konfigurasi Environment

Konfigurasi Environment hanya berlaku jika menjalankan be dengan Mode Development (Dengan Firebase Authentication).

Buat file `.env.dev` di root direktori project dan isi dengan konfigurasi Firebase yang diperlukan:

```env
WEB_FIREBASE_WEB_TYPE=""
WEB_FIREBASE_WEB_PROJECT_ID=""
WEB_FIREBASE_WEB_PRIVATE_KEY_ID=""
WEB_FIREBASE_WEB_PRIVATE_KEY=""
WEB_FIREBASE_WEB_CLIENT_EMAIL=""
WEB_FIREBASE_WEB_CLIENT_ID=""
WEB_FIREBASE_WEB_AUTH_URI=""
WEB_FIREBASE_WEB_TOKEN_URI=""
WEB_FIREBASE_WEB_AUTH_PROVIDER_X509_CERT_URL=""
WEB_FIREBASE_WEB_CLIENT_X509_CERT_URL=""
```

## Menjalankan Aplikasi

### Mode Development (Tanpa Firebase Authentication)
```bash
# Menggunakan yarn
yarn dev

# Atau menggunakan npm
npm run dev
```

Server akan berjalan di `http://localhost:8001`

### Mode Development (Dengan Firebase Authentication)
```bash
# Menggunakan yarn
yarn dev:firebase

# Atau menggunakan npm
npm run dev:firebase
```

**Catatan:** Pastikan file `.env.dev` sudah dikonfigurasi dengan konfigurasi Firebase yang benar sebelum menjalankan mode dengan Firebase authentication.

## Troubleshooting

### Port sudah digunakan
Jika port 8001 sudah digunakan, ubah port di `package.json` pada bagian scripts dengan mengganti nilai `PORT=8001` ke port lain yang tersedia.

### Error Firebase Authentication
Pastikan semua konfigurasi Firebase di `.env.dev` sudah benar dan lengkap.

### Database Error
Jalankan migrasi database terlebih dahulu dengan perintah `yarn migration` atau `npm run migration`.


### TEST API dari test_api.http