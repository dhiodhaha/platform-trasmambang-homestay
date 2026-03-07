# WhatsApp Cloud API Templates: Order Confirmation

Berikut adalah struktur template untuk pesan WhatsApp Cloud API. Di WhatsApp, hindari penggunaan markdown kompleks. Gunakan `*teks*` untuk tebal, `_teks_` untuk miring, dan variabel direpresentasikan dengan `{{1}}`, `{{2}}`, dst.

---

## 1. Waiting for Payment (Pending Booking)

Cocok digunakan saat pelanggan baru saja membuat pesanan dan harus segera menyelesaikan pembayaran. Didesain dengan Call-to-Action (CTA) berupa **Tombol Link**.j

* **Template Name:** `waiting_for_payment`
* **Category:** `UTILITY`
* **Language:** `id` (Indonesian)

### Komponen Template (Waiting for Payment)

* **Header (Opsional - Teks):** `Menunggu Pembayaran ⏳`
* **Body:**

```text
Halo {{1}},

Terima kasih telah melakukan pemesanan di *Trasmambang Homestay*! 
Silakan selesaikan pembayaran untuk mengamankan jadwal menginap Anda.

*Detail Pesanan:*
- Kode Booking: {{2}}
- Check-in: {{3}} (14:00 WIB)
- Check-out: {{4}} (12:00 WIB)
- Tagihan: *Rp {{5}}*

Harap selesaikan pembayaran sebelum {{6}} untuk menghindari pembatalan otomatis dari sistem.
```

* **Footer (Opsional - Teks):** `Trasmambang Homestay`
* **Buttons:**
  * **Type:** Call to Action (URL)
  * **Button Text:** `Bayar Sekarang`
  * **URL Type:** Dynamic
  * **URL:** `{{7}}` (Kirim Payment Link / Midtrans Link pada payload API)

### Mapping Variabel (Waiting for Payment)

* `{{1}}` = Nama Pemesan
* `{{2}}` = Order ID
* `{{3}}` = Tanggal Check-in
* `{{4}}` = Tanggal Check-out
* `{{5}}` = Nominal Pembayaran (contoh: 2.500.000)
* `{{6}}` = Batas Waktu Pembayaran (Waktu kedaluwarsa, misal: 10 Maret 2026 15:00 WIB)
* `{{7}}` = Akhiran link pembayaran dinamis (jika base URL disetting di WhatsApp config)

---

## 2. Order Successful (Payment Confirmed)

Digunakan saat pembayaran sudah diverifikasi. Menginformasikan bahwa pesanan sukses dan menautkan tombol untuk melihat Panduan / Terms of Service serta lokasi Gmaps.

* **Template Name:** `order_confirmed`
* **Category:** `UTILITY`
* **Language:** `id` (Indonesian)

### Komponen Template (Confirmed)

* **Header (Opsional - Teks):** `Booking Dikonfirmasi! ✅`
* **Body:**

```text
Halo {{1}},

Hore! Pembayaran Anda telah kami terima dan pemesanan Anda berhasil dikonfirmasi. Kami menantikan kedatangan Anda di *Trasmambang Homestay*.

*Detail Pesanan:*
- Kode Booking: {{2}}
- Check-in: {{3}} (14:00 WIB)
- Check-out: {{4}} (12:00 WIB)
- Status: *LUNAS / DP TERBAYAR*

*Info Penting:*
1. Mohon siapkan kartu identitas (KTP) saat proses check-in.
2. Kami memberlakukan aturan *Larangan Keras* untuk minuman keras (alkohol), pesta, dan hewan peliharaan. 

Silakan baca Syarat & Ketentuan selengkapnya pada tombol di bawah.
```

* **Footer (Opsional - Teks):** `Sampai Jumpa di Trasmambang!`
* **Buttons:**
  * **Type:** Call to Action (URL)
  * **Button 1 Text:** `Baca Peraturan Rumah`
  * **Button 1 URL:** `https://trasmambang.com/terms` *(Atau URL dinamis jika berbeda-beda)*
  * **Button 2 Text:** `Buka Google Maps`
  * **Button 2 URL:** `https://maps.app.goo.gl/xxx` *(URL Gmaps Homestay)*

### Mapping Variabel (Confirmed)

* `{{1}}` = Nama Pemesan
* `{{2}}` = Order ID
* `{{3}}` = Tanggal Check-in
* `{{4}}` = Tanggal Check-out
