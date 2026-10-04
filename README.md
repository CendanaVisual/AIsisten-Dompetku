# 💰 AIsisten Dompetku

Aplikasi web pengelolaan keuangan mandiri yang canggih, cerdas, dan aman dengan integrasi **AI Flash NLP (Natural Language Processing)**, **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, dan **PostgreSQL Neon Database**.

---

## 🌟 Fitur Utama

1. **AI Chat Assistant (Fitur Unggulan)**
   - Widget chat melayang (*floating chat*) yang selalu siap menemani.
   - Ketik kalimat santai dalam Bahasa Indonesia, contoh:
     - *"Hari ini saya beli kopi harganya 25 ribu pakai uang tunai"*
     - *"Gaji bulan ini masuk 5 juta"*
     - *"Bayar tagihan listrik 150rb"*
     - *"Makan siang bakso 20000"*
   - AI otomatis mengekstrak **Jenis (Pemasukan/Pengeluaran)**, **Nominal**, **Kategori**, dan **Catatan**, lalu langsung menyimpannya ke database PostgreSQL Neon milik pengguna.
   - Otomatis memperbarui ringkasan saldo dan daftar riwayat transaksi tanpa perlu me-refresh halaman.

2. **Keamanan & Isolasi Data Akun (Strict Data Isolation)**
   - Autentikasi berbasis **NextAuth.js (Credentials Provider)**.
   - Enkripsi password menggunakan `bcryptjs`.
   - **Zero-Trust Data Isolation**: Setiap transaksi di database difilter secara ketat berdasarkan `userId` pengguna yang sedang login. Pengguna lain tidak dapat melihat atau memodifikasi data Anda.

3. **Dashboard Interaktif & Analitik Visual**
   - Ringkasan kartu metrik: **Total Saldo Bersih**, **Pemasukan Bulan Ini**, **Pengeluaran Bulan Ini**, dan **Aktivitas Transaksi**.
   - **Grafik Arus Kas 6 Bulan**: Visualisasi perbandingan pemasukan vs pengeluaran menggunakan Recharts.
   - **Distribusi Kategori**: Grafik lingkaran (*donut chart*) pembagian pos pengeluaran bulan berjalan.
   - Transaksi terbaru dengan indikator badge warna dan nominal format Rupiah (IDR).

4. **Manajemen Transaksi Penuh (CRUD)**
   - Halaman khusus riwayat transaksi lengkap.
   - Pencarian real-time berdasarkan kata kunci catatan atau kategori.
   - Filter cepat berdasarkan jenis (*Semua / Pemasukan / Pengeluaran*) dan kategori.
   - Tambah manual, edit transaksi, dan hapus transaksi dengan dialog konfirmasi aman.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling & UI:** Tailwind CSS, Lucide Icons, Recharts
- **Database:** PostgreSQL Neon Cloud
- **ORM:** Prisma Client
- **Autentikasi:** NextAuth.js + Bcryptjs
- **AI NLP:** Google Gemini Flash (`@google/generative-ai`) dengan Fallback Parser Bahasa Indonesia Heuristik Cerdas

---

## 🗄️ Skema Database (Prisma)

```prisma
model User {
  id           String        @id @default(cuid())
  username     String        @unique
  email        String        @unique
  password     String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  transactions Transaction[]

  @@map("users")
}

enum TransactionType {
  INCOME
  EXPENSE
}

model Transaction {
  id        String          @id @default(cuid())
  userId    String
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      TransactionType
  amount    Float
  category  String
  note      String?
  date      DateTime        @default(now())
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  @@index([userId, date])
  @@map("transactions")
}
```

---

## ⚙️ Panduan Menjalankan Proyek Secara Lokal

### 1. Salin Repositori & Install Dependencies
```bash
git clone https://github.com/CendanaVisual/AIsisten-Dompetku.git
cd AIsisten-Dompetku
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root direktori dengan menyalin dari `.env.example`:
```env
# Database Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_5igDtO3ybTrh@ep-broad-sky-b30rwjbl-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth Secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-aisisten-dompetku-2026-generate-random"

# Google AI Flash API Key (Dapatkan di https://aistudio.google.com/)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 3. Sinkronkan Database Neon
```bash
npx prisma db push
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🚀 Panduan Deploy ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com).
2. Klik **Add New...** > **Project**.
3. Import repositori `CendanaVisual/AIsisten-Dompetku`.
4. Pada bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL`: Connection string PostgreSQL Neon Anda.
   - `NEXTAUTH_SECRET`: String acak aman untuk sesi auth.
   - `NEXTAUTH_URL`: URL domain aplikasi Vercel Anda (misal `https://aisisten-dompetku.vercel.app`).
   - `GEMINI_API_KEY`: API Key Google AI Studio.
5. Klik **Deploy**! Vercel akan otomatis menjalankan `prisma generate && next build`.

---

## 📄 Lisensi
Hak Cipta © 2026 **AIsisten Dompetku** - CendanaVisual.
