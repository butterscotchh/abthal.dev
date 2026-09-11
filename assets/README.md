# Portofolio — Frutiger Aero

Website portofolio satu halaman (single page) dengan navigasi tab di kiri,
tema Frutiger Aero (glossy, biru-hijau, kaca), plus widget paintboard dan
mini mp3 player. Dibuat murni dengan HTML, CSS, dan JavaScript vanilla —
tidak butuh build step, jadi langsung kompatibel dengan GitHub Pages.

## Struktur file

```
portfolio/
├── index.html                     ← semua konten & section ada di sini
├── css/
│   └── style.css                  ← semua styling (warna, layout, glossy effect)
├── js/
│   ├── main.js                    ← logic tab nav + visitor counter
│   ├── paintboard.js              ← logic widget paintboard
│   └── player.js                  ← logic widget mp3 player + daftar lagu
├── assets/
│   ├── img/
│   │   ├── avatar-placeholder.svg ← ganti dengan foto kamu
│   │   └── favicon.svg
│   └── music/
│       └── PUT_YOUR_MP3_FILES_HERE.txt
├── .nojekyll                      ← wajib ada, jangan dihapus (lihat bawah)
└── README.md
```

## Cara edit konten

Semua teks (about me, skills, experience, project, competition,
certification, link kontak) ada langsung di `index.html`, ditandai dengan
komentar/placeholder yang jelas. Cari section dengan `id="about"`,
`id="skills"`, dst., lalu ganti teksnya.

- **Foto profil**: ganti file `assets/img/avatar-placeholder.svg` dengan
  fotomu (boleh `.jpg`/`.png`), lalu update `src` di tag `<img class="avatar">`
  pada `index.html`.
- **Kontak**: edit link di dalam `<ul class="contact-list">`.
- **Warna tema**: semua warna diatur lewat CSS variable di bagian atas
  `css/style.css` (`:root { --sky-light: ...; --aqua: ...; }`), jadi bisa
  ganti nuansa tanpa cari-cari di seluruh file.

## Cara isi widget

### 🎧 MP3 player
1. Taruh file `.mp3` di `assets/music/`.
2. Buka `js/player.js`, isi array `PLAYLIST`:
   ```js
   const PLAYLIST = [
     { title: "Nama Lagu — Artis", src: "assets/music/lagu-1.mp3" },
     { title: "Lagu Kedua — Artis", src: "assets/music/lagu-2.mp3" },
   ];
   ```
3. Player otomatis mengenali jumlah lagu, tombol prev/next akan looping.

### 🖌 Paintboard
Sudah jalan otomatis, tidak perlu setup — pengunjung bisa langsung gambar,
ganti warna, ganti ukuran brush, clear, atau save hasil gambar sebagai PNG.

### Visitor counter
Counter ini kosmetik dan disimpan per-browser lewat `localStorage` (setiap
browser punya hitungannya sendiri, bukan hitungan global semua pengunjung).
Kalau kamu mau hitungan **global** yang sama untuk semua pengunjung (kayak
counter jadul di Neocities), ganti logic di `js/main.js` bagian visitor
counter dengan layanan counter eksternal, misalnya:
- https://www.freevisitorcounters.com/
- https://visitorbadge.io/

## Cara jalankan di lokal

Karena tidak ada build step, cukup buka `index.html` langsung di browser,
atau jalankan local server sederhana (disarankan supaya path relatif
konsisten):

```bash
cd portfolio
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Cara deploy ke GitHub Pages

1. Buat repository baru di GitHub, misal `portfolio` atau
   `username.github.io` (kalau pakai nama ini, situsnya akan langsung
   jadi domain utama kamu tanpa sub-path).
2. Push semua isi folder `portfolio/` ini (termasuk file `.nojekyll`) ke
   branch `main`:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
3. Di GitHub: buka repo → **Settings** → **Pages** → pada **Source** pilih
   branch `main` dan folder `/ (root)` → **Save**.
4. Tunggu 1–2 menit, situs akan tersedia di:
   - `https://USERNAME.github.io/REPO/` (repo biasa), atau
   - `https://USERNAME.github.io/` (kalau nama repo `username.github.io`)

### Kenapa ada file `.nojekyll`?
GitHub Pages secara default memproses situs dengan Jekyll, yang bisa
mengabaikan folder/file yang namanya diawali underscore dan menambah waktu
build. File `.nojekyll` (kosong) memberi tahu GitHub Pages untuk melewati
proses itu dan menyajikan file kita apa adanya — lebih cepat dan aman untuk
situs statis murni seperti ini.

## Custom domain (opsional)
Kalau nanti punya domain sendiri (misal `namakamu.dev`), tinggal tambah
file `CNAME` di root folder ini berisi domain tersebut, lalu atur DNS
domain ke GitHub Pages sesuai panduan resmi GitHub.
