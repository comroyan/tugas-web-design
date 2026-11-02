# BERKAS PENGUMPULAN TUGAS WEB DESIGN
## SMKN 2 PEKALONGAN

- **Judul Proyek**: Inventaris Perangkat Laboratorium TKJ
- **Nama Siswa**: Muhamad Zainurroyan
- **Kelas**: 12 TKJ 1
- **No. Absen**: 19
- **Guru Pengampu**: Pak Andi Darmayanto
- **Jurusan**: Teknik Komputer dan Jaringan (TKJ)
- **Tahun Pelajaran**: 2026/2027

---

### Fitur Baru yang Ditambahkan:
1. **Spesifikasi IP Jaringan (Network IP)**:
   - Field input "Alamat IP / Spesifikasi Jaringan" pada formulir tambah & edit perangkat (misal: `192.168.1.1`, `10.10.1.254`, atau `DHCP`).
   - Tampil pada kolom tabel utama, tampilan kartu/grid, dan tabel rekapitulasi laporan.
   - Kotak pencarian otomatis dapat mencari perangkat berdasarkan Alamat IP.
2. **Ekspor Excel (CSV)**:
   - Tombol **Export Excel (CSV)** pada halaman Laporan & Ekspor.
   - Format file `.csv` dengan penanda UTF-8 BOM (`\uFEFF`) sehingga langsung terbuka rapi dan presisi di Microsoft Excel.

---

### Link Unduh Berkas ZIP Proyek:
[Klik Di Sini untuk Mengunduh inventaris-lab-tkj-muhamad-zainurroyan.zip](https://ais-dev-naifs5tsstfunuqfauyuzz-705381100555.asia-southeast1.run.app/inventaris-lab-tkj-muhamad-zainurroyan.zip)

---

### Struktur Berkas di Dalam Proyek:
1. `index.html` — Halaman web utama (Header Navbar, Statistik, Tabel Inventaris + Kolom IP, Form Tambah/Edit Modal + IP, Ekspor JSON/Excel, Halaman Profil Siswa).
2. `css/style.css` — Seluruh stylesheet responsif (Mobile First, Desktop, Desain Modern tanpa framework rumit).
3. `js/script.js` — Logika JavaScript murni (CRUD DOM, Filter & Search IP, Statistik Realtime, LocalStorage, Fetch data JSON, Ekspor CSV Excel & JSON).
4. `data/perangkat.json` — Database awal inventaris perangkat lab TKJ (kondisi awal kosong `[]`).
5. `README.txt` — Identitas lengkap dan petunjuk menjalankan aplikasi untuk pengujian tugas.
