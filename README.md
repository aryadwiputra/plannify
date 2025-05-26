# Plannify

## Deskripsi
Plannify adalah aplikasi web untuk manajemen tugas dan perencanaan yang dirancang agar dapat digunakan oleh banyak orang secara bersama-sama. Aplikasi ini menawarkan fitur **workspaces**, yang bisa diatur sebagai public atau private, memungkinkan pengguna bekerja sama dalam tim atau secara individu.

Aplikasi ini dibuat dengan teknologi modern untuk memastikan performa tinggi serta pengalaman pengguna yang optimal:
- **Backend**: Laravel 11
- **Frontend**: InertiaJS + ReactJS
- **Database**: MySQL

---

## Fitur Utama
1. **Task Management**  
   Buat, kelola, dan prioritaskan tugas sesuai kebutuhan Anda.
   
2. **Workspaces**  
   - **Public Workspaces**: Bisa diakses oleh semua pengguna terdaftar.  
   - **Private Workspaces**: Hanya dapat diakses oleh anggota tertentu atau pemilik workspace tersebut.
   
3. **Kolaborasi Tim**  
   Ajak teman atau rekan kerja untuk bergabung dalam workspace yang sama dan bekerja sama secara real-time.

4. **Multi-Pengguna**  
   Didukung sistem autentikasi untuk memastikan data setiap pengguna tetap aman dan terpisah.

---

## Instalasi

### Persyaratan
Sebelum memulai, pastikan Anda memiliki:
- PHP >= 8.1
- Composer
- Node.js & npm/yarn
- MySQL atau database kompatibel lainnya

### Langkah-langkah Instalasi
1. **Clone Repository**
   ```bash
   git clone https://github.com/aryadwiputra/Plannify.git
   cd Plannify
   ```

2. **Install Dependencies**
   - Backend (Laravel):
     ```bash
     composer install
     ```
   - Frontend (ReactJS/InertiaJS):
     ```bash
     npm install
     # atau jika menggunakan yarn
     yarn install
     ```

3. **Salin File `.env.example`**
   ```bash
   cp .env.example .env
   ```

4. **Generate Key Aplikasi**
   ```bash
   php artisan key:generate
   ```

5. **Konfigurasikan Database**
   Edit file `.env` dan sesuaikan konfigurasi database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=plannify
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Migrasi Database**
   ```bash
   php artisan migrate
   ```

7. **Build Aset Frontend**
   ```bash
   npm run build
   # atau jika ingin mode development
   npm run dev
   ```

8. **Jalankan Server**
   ```bash
   php artisan serve
   ```

   Akses aplikasi di browser melalui alamat: `http://localhost:8000`

---

## Kontribusi
Plannify adalah proyek open-source, dan kami sangat menghargai kontribusi dari komunitas! Jika Anda ingin berkontribusi, silakan ikuti langkah-langkah berikut:

1. Fork repository ini.
2. Buat branch baru untuk fitur atau bug fix Anda:
   ```bash
   git checkout -b nama-fitur-baru
   ```
3. Lakukan commit perubahan Anda:
   ```bash
   git commit -m "Tambahkan fitur baru"
   ```
4. Push ke branch Anda:
   ```bash
   git push origin nama-fitur-baru
   ```
5. Kirim pull request ke repository utama.

---

## Lisensi
Plannify dilisensikan di bawah [MIT License](LICENSE). Anda bebas menggunakan, mengubah, dan mendistribusikan kode ini sesuai dengan ketentuan lisensi.

---

## Kontak
Jika Anda memiliki pertanyaan atau masalah terkait Plannify, jangan ragu untuk menghubungi kami melalui email: [your-email@example.com](mailto:aryadptr.deeloper@gmail.com).

Terima kasih telah menggunakan Plannify! 😊
