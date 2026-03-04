import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
	{
		id: "q1",
		question: "Apakah fasilitas yang disediakan di homestay?",
		answer:
			"Homestay kami menyediakan fasilitas seperti AC, kolam renang, gym corner, mini indoor playground, empat kamar sejuk dengan twin bed/king size dan empat kamar mandi (dua di dalam kamar), area merokok, dua televisi, dua dapur, meja makan luas, dan garasi mobil.",
	},
	{
		id: "q2",
		question: "Apakah tersedia sarapan atau layanan makan?",
		answer:
			"Saat ini, homestay kami tidak menyediakan sarapan atau layanan makan. Namun, dapur kami lengkap dengan peralatan memasak untuk kebutuhan Anda.",
	},
	{
		id: "q3",
		question: "Bagaimana kebijakan pembatalan pemesanan?",
		answer:
			"Mohon maaf, untuk saat ini kami tidak melakukan kebijakan pengembalian dana jika membatalkan pemesanan.",
	},
	{
		id: "q4",
		question: "Apakah homestay ramah anak?",
		answer:
			"Ya, homestay kami ramah anak dengan fasilitas seperti mini indoor playground yang aman dan menyenangkan untuk anak-anak.",
	},
	{
		id: "q5",
		question: "Apakah saya bisa membawa hewan peliharaan?",
		answer:
			"Maaf, untuk menjaga kenyamanan semua tamu, homestay kami tidak memperbolehkan hewan peliharaan.",
	},
];

export default function FAQSection() {
	return (
		<div
			id="faq"
			className="w-full max-w-3xl mx-auto p-4 py-12 space-y-4 flex justify-center flex-col scroll-mt-16"
		>
			<h1 className="text-3xl font-medium text-center pb-12">
				Pertanyaan yang Sering Ditanyakan
			</h1>
			<Accordion type="single" collapsible className="w-full">
				{faqItems.map(({ id, question, answer }) => (
					<AccordionItem
						key={id}
						value={id}
						className="border rounded-lg bg-gray-50 px-6 mb-4"
					>
						<AccordionTrigger className="text-lg font-medium hover:no-underline">
							{question}
						</AccordionTrigger>
						<AccordionContent className="text-gray-500">
							{answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
