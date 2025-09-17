# BYE STUNTING (React + Vite)

Prototipe aplikasi edukasi pencegahan stunting. Warna hijau pastel, judul berfont **Rubik Bubbles**, dan logo diambil dari gambar yang Anda unggah.

## Menjalankan Lokal
```bash
npm install
npm run dev
# buka URL yang ditampilkan (mis. http://localhost:5173)
```

## Build Production
```bash
npm run build
npm run preview
```

## Deploy Cepat

### Opsi 1 — Netlify (disarankan untuk static site)
1. Buat akun di https://app.netlify.com/ dan hubungkan ke repo GitHub Anda **atau** seret hasil `dist/` ke fitur **Drag & drop**.
2. Jika lewat repo: klik **New site from Git**, pilih repo, `Build command: npm run build`, `Publish directory: dist`.
3. Tambahkan file `netlify.toml` (sudah disertakan) bila perlu.

### Opsi 2 — Vercel
1. `npm i -g vercel` (opsional) lalu `vercel` di folder proyek, atau impor repo di https://vercel.com/new
2. Framework **Vite**, `Build Command: vite build` (atau `npm run build`), `Output: dist`.
3. File `vercel.json` disertakan untuk mempermudah.

### Opsi 3 — GitHub Pages
1. Push proyek ke GitHub.
2. Tambah action `pages`: Settings → Pages → Build and deployment → GitHub Actions → *Deploy static site*.
3. Pastikan workflow membangun `dist` dari perintah `npm run build` dan mem-publish hasilnya.

---

> Catatan medis: Grafik pertumbuhan di aplikasi ini **ilustratif** untuk edukasi dan bukan alat diagnosis. Gunakan kurva WHO dan konsultasikan ke tenaga kesehatan untuk penilaian akurat.
