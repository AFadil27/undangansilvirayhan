UNDANGAN PERNIKAHAN SILVI & RAYHAN

File yang diperbarui:
- index.html: struktur hero dirapikan.
- style.css: semua area foto menggunakan assets/foto-pengantin.jpg agar tidak mencari hero.jpg/groom.jpg/bride.jpg/gallery-*.jpg yang belum tersedia.
- script.js: countdown menggunakan satu konfigurasi tanggal yang konsisten, 15 November 2026 pukul 11.00 WIB.
- apps-script.gs: backend RSVP Google Sheets (perlu dipasang sendiri di Google Apps Script).

PENTING — FOTO:
1. Salin foto milik Anda ke folder assets.
2. Pastikan nama filenya persis: foto-pengantin.jpg
3. Struktur folder:
   wedding-invitation/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── apps-script.gs
   └── assets/
       └── foto-pengantin.jpg
4. Jalankan index.html dengan ekstensi Live Server di VS Code.

Foto yang sama digunakan sementara untuk cover, hero, profil, galeri, dan penutup. Jika nanti ingin foto berbeda, siapkan file groom.jpg, bride.jpg, gallery-1.jpg sampai gallery-5.jpg, lalu sesuaikan CSS.

RSVP:
- Buka Google Sheets > Extensions > Apps Script.
- Tempel isi apps-script.gs, deploy sebagai Web app, lalu masukkan URL /exec ke CONFIG.googleScriptUrl di script.js.
- Jangan bagikan file Apps Script atau spreadsheet jika berisi data pribadi tamu.

Tanggal/jam acara saat ini disetel ke 15 November 2026 pukul 11.00 WIB. Silakan ubah CONFIG.weddingDate jika waktu acara berbeda.
