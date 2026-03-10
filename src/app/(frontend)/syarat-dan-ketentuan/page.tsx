import React from 'react'

export const metadata = {
  title: 'Syarat & Ketentuan | Trasmambang Homestay',
  description: 'Syarat dan Ketentuan Rental Trasmambang Homestay',
}

export default function TermsAndServicePage() {
  return (
    <main className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="space-y-8 bg-white p-6 md:p-12 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-black/5">
        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight text-[#122023] mb-8"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Syarat dan Ketentuan
        </h1>

        <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-[#122023] prose-p:text-[#6B6B6B] prose-li:text-[#6B6B6B]">
          <p className="lead text-lg text-[#122023] font-medium mb-8">
            Selamat datang di Trasmambang Homestay. Dengan melakukan pemesanan dan menginap di
            properti kami, Anda setuju untuk mematuhi seluruh Syarat dan Ketentuan berikut ini:
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#122023] mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-bold">
                  1
                </span>
                Waktu Check-in & Check-out
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[#6B6B6B]">
                <li>
                  <strong>Check-in:</strong> Mulai pukul 14:00 WIB.
                </li>
                <li>
                  <strong>Check-out:</strong> Maksimal pukul 12:00 WIB.
                </li>
                <li>
                  Keterlambatan check-out tanpa persetujuan sebelumnya dapat dikenakan biaya
                  tambahan.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#122023] mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-bold">
                  2
                </span>
                Peraturan Rumah (House Rules) & Larangan Keras
              </h2>
              <p className="mb-4">
                Demi kenyamanan bersama masyarakat sekitar dan menjaga kebersihan serta ketertiban
                homestay, tamu <strong>DIWAJIBKAN</strong> mematuhi tata tertib berikut:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#6B6B6B]">
                <li>
                  <strong>Dilarang keras membawa dan mengonsumsi minuman keras (alkohol)</strong>,
                  narkoba, atau barang terlarang lainnya di area properti.
                </li>
                <li>
                  <strong>Dilarang mengadakan pesta</strong> atau acara yang menimbulkan keributan.
                </li>
                <li>
                  <strong>Harap tenang setelah pukul 22:00 WIB</strong> untuk menghormati jam
                  istirahat warga sekitar.
                </li>
                <li>
                  <strong>Merokok hanya diperbolehkan di area outdoor</strong> atau tempat yang
                  telah disediakan (dilarang merokok di dalam kamar dan ruangan tertutup).
                </li>
                <li>
                  <strong>Tidak diperbolehkan membawa hewan peliharaan</strong> (No pets allowed) ke
                  dalam properti.
                </li>
                <li>
                  Segala bentuk tindakan asusila dan pelanggaran hukum di dalam properti dilarang
                  keras.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#122023] mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-bold">
                  3
                </span>
                Pembayaran dan Kebijakan Pembatalan
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[#6B6B6B]">
                <li>
                  Booking baru dianggap sah dan jadwal diamankan apabila tamu sudah mentransfer DP
                  (Down Payment) atau membayar lunas sesuai kesepakatan.
                </li>
                <li>
                  Jika terjadi pembatalan sepihak dari tamu, kebijakan pengembalian dana (refund)
                  mengikuti aturan pembatalan yang telah disampaikan saat konfirmasi pembayaran.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#122023] mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-bold">
                  4
                </span>
                Keamanan dan Kerusakan
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[#6B6B6B]">
                <li>
                  Tamu bertanggung jawab penuh atas barang berharga milik pribadi. Pengelola
                  homestay tidak bertanggung jawab atas kehilangan barang berharga tamu.
                </li>
                <li>
                  Jika terjadi kerusakan pada properti, perabotan, atau kehilangan fasilitas
                  homestay akibat kelalaian tamu, maka tamu wajib mengganti rugi sesuai dengan
                  nominal kerusakan/kehilangan tersebut.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#122023] mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8C4A0] text-[#122023] text-sm font-bold">
                  5
                </span>
                Kapasitas Tamu
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-[#6B6B6B]">
                <li>
                  Jumlah tamu yang menginap tidak boleh melebihi kapasitas maksimal yang telah
                  disepakati saat pemesanan tanpa sepengetahuan pihak pengelola.
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-12 p-6 bg-[#FAFAFA] rounded-2xl border border-black/5 italic text-[#6B6B6B]">
            <p className="mb-4">
              Syarat dan Ketentuan ini dibuat demi kenyamanan, keamanan, dan ketenangan Anda beserta
              lingkungan sekitar. Pelanggaran terhadap poin-poin di atas, terutama terkait larangan
              minuman keras dan pesta, dapat mengakibatkan pembatalan sepihak oleh pengelola tanpa
              pengembalian dana.
            </p>
            <p className="font-semibold text-[#122023] not-italic">
              Terima kasih atas kerja samanya dan selamat menikmati waktu menginap Anda di
              Trasmambang Homestay!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
