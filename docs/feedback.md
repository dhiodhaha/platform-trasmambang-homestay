1. Optimasi Konfirmasi Manual

Terapkan kode unik 3 digit di akhir nominal transfer untuk mempermudah owner mengecek mutasi bank.

Gunakan tautan WhatsApp dinamis dengan pesan yang sudah terisi otomatis berisi Booking ID, nama, dan nominal transfer.

Batasi waktu pembayaran (misalnya 1 jam) agar kalender homestay tidak tersandera oleh booking yang menggantung.

2. Penanganan Sesi Tanpa Login (Sistem "Cart")

Manfaatkan cookies pada browser untuk menyimpan data booking yang berstatus pending.

Tampilkan penanda visual atau banner di landing page jika user kembali dan masih memiliki transaksi yang belum diselesaikan.

Hapus data di cookies secara otomatis jika batas waktu pembayaran telah habis atau user sudah melakukan konfirmasi.

3. Tambahkan langkah Review atau konfirmasi data sebelum user masuk ke halaman pembayaran.

Sediakan tombol "Batalkan Booking" di halaman pembayaran agar user bisa mengulang alur dari awal jika menyadari ada kesalahan tanggal.


USING COOKIES (suggestion)

1. Menyimpan Data (Saat Klik Booking)
Ketika user klik tombol "Lanjut Pembayaran", sistem akan membuat cookie berisi informasi esensial.(maybe the book number and status)

2. Fitur Auto-Hapus (Expired Time)
Ini adalah keuntungan terbesar cookies. Kamu bisa langsung mengatur parameter max-age atau expires. Jika kamu memberi batas waktu pembayaran 1 jam, atur cookie agar kedaluwarsa dalam 3600 detik. Setelah 1 jam, browser user akan otomatis membuang cookie tersebut. Kamu tidak perlu menulis logika tambahan untuk menghapusnya.

3. Membaca Data di Landing Page (Server-Side)
Saat user kembali ke landing page, komponen Next.js kamu bisa langsung mengecek cookies.

Jika cookie pending_booking terdeteksi: Render UI banner "Selesaikan Pembayaran Anda".

Jika cookie kosong (karena belum booking atau sudah expired): Render UI widget availability kalender yang biasa.

4. Menghapus Saat Selesai
Jika user sudah msudah berhasil membayar, sistem wajib menghapus cookie tersebut secara manual agar landing page kembali normal. Begitu cookie terhapus, sistem langsung melempar user ke aplikasi WhatsApp (wa.me).

Teks yang terisi otomatis di WA memuat rincian transfer dan menyertakan URL dinamis halaman pembayaran tersebut (MISALNYA: homestay.com/payment/abc-123).

Mulai titik ini, state aplikasi tidak lagi bergantung pada browser. Jika user ingin mengecek rincian pesanan lagi, mereka cukup mengklik link yang sudah tersimpan rapi di riwayat chat WhatsApp mereka dengan owner.