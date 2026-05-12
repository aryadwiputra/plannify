# Rekomendasi Revamp UI/UX Plannify

Dokumen ini berisi analisis menyeluruh terhadap frontend Plannify (React + Inertia + Tailwind + shadcn/ui) beserta rekomendasi perbaikan (revamp) UI/UX untuk menciptakan pengalaman pengguna yang lebih intuitif, modern, dan setara dengan aplikasi industri seperti Trello, Asana, atau Linear.

---

## 1. Analisis Frontend Saat Ini
Berdasarkan *package.json* dan struktur *Components*, Plannify telah menggunakan *tech-stack* modern yang sangat solid:
- **UI Framework**: React.js 18 + Inertia.js (SPA Experience).
- **Styling & Komponen**: Tailwind CSS, class-variance-authority, dan komponen **shadcn/ui** (Radix UI).
- **Interaksi**: `@dnd-kit` untuk Kanban drag-and-drop.
- **Visualisasi**: `chart.js` untuk Dashboard.

Meskipun stack-nya sangat bagus, aplikasi *Task Management* seringkali terkendala pada **Layouting Navigasi** dan **Context-Switching** (berpindah halaman saat melihat detail).

---

## 2. Rekomendasi Layout Global (Global Application Shell)

Saat ini, aplikasi manajemen tugas modern sangat mengandalkan struktur **Sidebar Kiri (Persistent)** daripada Top Navigation Bar klasik.

### A. Persistent Collapsible Sidebar
- **Navigasi Utama**: Gunakan *sidebar* di sisi kiri untuk menampung menu utama (`Dashboard`, `My Tasks`, `Members`).
- **Daftar Workspace**: Tampilkan daftar *Workspaces* langsung di sidebar (bisa di-expand/collapse). Ini mengurangi jumlah klik (pengguna tidak perlu ke halaman `/workspaces` lalu memilih workspace).
- **Toggle Collapse**: Berikan opsi untuk mengecilkan sidebar (hanya menampilkan ikon) untuk memberi ruang maksimal pada Kanban Board.

### B. Top Navbar (Header)
- **Breadcrumbs**: Tampilkan *breadcrumb* di *header* (Misal: `Dashboard / Workspace / Marketing Team / Kanban`).
- **Global Search (Command Palette)**: Implementasikan *Command Palette* (bisa menggunakan `cmdk` atau shadcn `Command`) di tengah *navbar* (Shortcut: `Ctrl + K` / `Cmd + K`).
- **Notifikasi & Profil**: Taruh di pojok kanan atas.

---

## 3. Rekomendasi Halaman Spesifik

### A. Dashboard (Overview)
- **Bento Grid Layout**: Gunakan gaya kotak grid bergaya "Bento" untuk metrik (Jumlah Task, Done, dll).
- **Grafik Lebih Bersih**: Kurangi garis-garis *grid* yang terlalu mencolok pada Chart.js. Gunakan *Tooltip* melayang yang modern.
- **Tugas Terdekat**: Tampilkan *widget* "Tugas Mendesak" (*Deadline* terdekat) di samping chart, sehingga Dashboard bukan hanya sekadar data, tapi langsung *actionable*.

### B. Workspace (Kanban Board)
Kanban Board adalah inti dari Plannify. UI/UX di area ini harus sempurna.
- **Horizontal & Vertical Scroll**: Pastikan Kanban Board mengambil sisa tinggi layar (`h-[calc(100vh-header)]`) dan bisa di-scroll secara horizontal, tanpa harus men-scroll seluruh halaman.
- **Inline Task Creation**: Daripada membuka form/modal besar untuk membuat task ("To Do" baru), gunakan **Inline Input**. Pengguna cukup klik tombol `+ Add Card` di paling bawah kolom, lalu ketik judul, dan tekan *Enter* (cepat tanpa *interrupt*).
- **Visual Hierarki Kartu**:
  - Avatar kecil untuk *Member* (gunakan shadcn `Avatar`).
  - *Badge* warna untuk Prioritas (High = Merah, Medium = Kuning).
  - Indikator kecil (Ikon `lucide-react`) untuk menunjukkan adanya Lampiran atau Checklist (misal: `3/5` checklist selesai).

### C. Card Detail & Edit (Crucial UX Improvement)
**Masalah**: Saat ini, rute mengarah ke halaman penuh (`/cards/detail/{card}` atau `/cards/edit/{card}`). Hal ini merusak *konteks* pengguna (mereka kehilangan pandangan dari Board).
**Rekomendasi (Pilih salah satu)**:
1. **Side Sheet / Side Drawer**: Gunakan komponen `Sheet` dari shadcn/ui. Saat kartu diklik, sebuah panel meluncur dari sisi kanan layar berisi detail kartu, komentar, lampiran, dan checklist. Pengguna masih bisa melihat Board di latar belakang.
2. **Large Modal (Dialog)**: Gunakan modal lebar di tengah layar (Gaya Trello).

---

## 4. Peningkatan UX Tambahan (Micro-interactions)

### A. Drag and Drop Experience
Karena sudah memakai `@dnd-kit`, pastikan interaksi *Drag* memiliki animasi transisi.
- Berikan efek *tilt* (miring sedikit) pada kartu saat di-*drag*.
- Tampilkan visual *placeholder* (bayangan tempat kartu akan dijatuhkan).

### B. Dark Mode Support
Aplikasi sudah memiliki pustaka `next-themes`. Pastikan untuk:
- Memasang toggle *Dark/Light/System mode*.
- Tema gelap sangat disukai oleh pengguna aplikasi produktivitas (developer/kreator).

### C. Optimistic UI & Skeleton Loading
- Saat melakukan perpindahan *Card* atau mencentang *Checklist*, perbarui UI seketika (Optimistic Update) sambil menunggu *backend* selesai (Inertia bisa menangani ini dengan responsibilitas yang cepat).
- Gunakan komponen `Skeleton` (dari shadcn) untuk menampilkan efek *loading* saat memuat halaman Dashboard atau Workspace agar layar tidak terlihat "kosong".

---

## 5. Rencana Eksekusi (Langkah Selanjutnya)
1. **Layouting**: Buat komponen `Layout/AppLayout.jsx` baru yang memiliki Sidebar persisten.
2. **Ubah Navigation Flow**: Ganti navigasi detail kartu (`CardController@show`) agar membalikkan respon dalam bentuk Modal/Sheet via parameter *State* Inertia, atau render sebagai `Dialog` bawaan.
3. **Refactor Kanban**: Rombak `Cards/Show` menjadi grid kolom dengan komponen Kanban mandiri.
