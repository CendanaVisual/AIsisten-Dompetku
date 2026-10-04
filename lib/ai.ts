import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ParsedTransactionData {
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  note: string;
  date?: string; // YYYY-MM-DD
}

const CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja",
  "Gaji & Pendapatan",
  "Investasi",
  "Hiburan",
  "Tagihan & Utilitas",
  "Kesehatan",
  "Pendidikan",
  "Lain-lain",
];

/**
 * Intelligent Indonesian NLP fallback parser if API key is not present or offline
 */
export function fallbackIndonesianParser(text: string): ParsedTransactionData {
  const lower = text.toLowerCase();

  // 1. Determine Type (INCOME vs EXPENSE)
  const incomeKeywords = [
    "gaji",
    "pendapatan",
    "pemasukan",
    "dapat",
    "terima",
    "masuk",
    "bonus",
    "hasil jual",
    "cair",
    "transferan masuk",
    "profit",
    "untung",
  ];
  let type: "INCOME" | "EXPENSE" = "EXPENSE";
  for (const kw of incomeKeywords) {
    if (lower.includes(kw)) {
      type = "INCOME";
      break;
    }
  }

  // 2. Parse Amount (Supports "5 juta", "2.5jt", "25 ribu", "25rb", "50k", "Rp 50.000", "25000")
  let amount = 0;

  // Pattern like: 5,5 juta / 5.5 jt / 5 juta
  const jutaMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:juta|jt)/);
  if (jutaMatch) {
    const num = parseFloat(jutaMatch[1].replace(",", "."));
    amount = Math.round(num * 1000000);
  } else {
    // Pattern like: 25 ribu / 25rb / 25k
    const ribuMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:ribu|rb|k\b)/);
    if (ribuMatch) {
      const num = parseFloat(ribuMatch[1].replace(",", "."));
      amount = Math.round(num * 1000);
    } else {
      // Pattern like: Rp 25.000 / Rp25000 / 25.000 / 25000
      const standardMatch = lower.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d+)/);
      if (standardMatch) {
        const raw = standardMatch[1].replace(/\./g, "");
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed > 0) {
          amount = parsed;
        }
      }
    }
  }

  // 3. Determine Category
  let category = "Lain-lain";
  if (type === "INCOME") {
    if (lower.includes("investasi") || lower.includes("dividen") || lower.includes("saham")) {
      category = "Investasi";
    } else {
      category = "Gaji & Pendapatan";
    }
  } else {
    if (
      lower.includes("makan") ||
      lower.includes("minum") ||
      lower.includes("kopi") ||
      lower.includes("sarapan") ||
      lower.includes("lunch") ||
      lower.includes("dinner") ||
      lower.includes("cafe") ||
      lower.includes("warteg") ||
      lower.includes("resto") ||
      lower.includes("snack") ||
      lower.includes("bakso") ||
      lower.includes("nasi")
    ) {
      category = "Makanan & Minuman";
    } else if (
      lower.includes("bensin") ||
      lower.includes("ojek") ||
      lower.includes("grab") ||
      lower.includes("gojek") ||
      lower.includes("maxim") ||
      lower.includes("tol") ||
      lower.includes("parkir") ||
      lower.includes("kereta") ||
      lower.includes("bus") ||
      lower.includes("tiket") ||
      lower.includes("angkot")
    ) {
      category = "Transportasi";
    } else if (
      lower.includes("listrik") ||
      lower.includes("pln") ||
      lower.includes("air") ||
      lower.includes("pdam") ||
      lower.includes("wifi") ||
      lower.includes("internet") ||
      lower.includes("pulsa") ||
      lower.includes("paket data") ||
      lower.includes("tagihan") ||
      lower.includes("sewa") ||
      lower.includes("kontrakan") ||
      lower.includes("kos")
    ) {
      category = "Tagihan & Utilitas";
    } else if (
      lower.includes("obat") ||
      lower.includes("dokter") ||
      lower.includes("klinik") ||
      lower.includes("apotek") ||
      lower.includes("rumah sakit")
    ) {
      category = "Kesehatan";
    } else if (
      lower.includes("nonton") ||
      lower.includes("bioskop") ||
      lower.includes("game") ||
      lower.includes("netflix") ||
      lower.includes("spotify") ||
      lower.includes("liburan") ||
      lower.includes("karaoke")
    ) {
      category = "Hiburan";
    } else if (
      lower.includes("buku") ||
      lower.includes("kursus") ||
      lower.includes("spp") ||
      lower.includes("kuliah") ||
      lower.includes("sekolah")
    ) {
      category = "Pendidikan";
    } else if (
      lower.includes("beli") ||
      lower.includes("baju") ||
      lower.includes("sepatu") ||
      lower.includes("tas") ||
      lower.includes("shopee") ||
      lower.includes("tokopedia") ||
      lower.includes("lazada") ||
      lower.includes("minimarket") ||
      lower.includes("indomaret") ||
      lower.includes("alfamart")
    ) {
      category = "Belanja";
    }
  }

  // 4. Note cleanup
  let note = text.trim();
  if (note.length > 100) {
    note = note.substring(0, 97) + "...";
  }

  return {
    type,
    amount: amount > 0 ? amount : 10000,
    category,
    note,
    date: new Date().toISOString().split("T")[0],
  };
}

/**
 * Parse text using Google Gemini Flash or intelligent fallback
 */
export async function parseTransactionWithAI(text: string): Promise<ParsedTransactionData> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_FLASH_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
    return fallbackIndonesianParser(text);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash or gemini-2.0-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
Anda adalah sistem ekstraksi keuangan canggih bernama "AIsisten Dompetku".
Tugas Anda adalah mengekstrak data transaksi keuangan dari teks bahasa Indonesia menjadi format JSON yang valid.

Kategori yang diperbolehkan hanya salah satu dari daftar berikut:
${CATEGORIES.map((c) => `- "${c}"`).join("\n")}

Format output HARUS selalu berupa objek JSON murni tanpa markdown/penjelasan dengan struktur:
{
  "type": "INCOME" atau "EXPENSE",
  "amount": <angka nominal bulat dalam Rupiah, misal 25000, 5000000>,
  "category": <salah satu kategori yang paling cocok dari daftar>,
  "note": "<ringkasan catatan transaksi yang rapi dan informatif>",
  "date": "<format YYYY-MM-DD, default hari ini jika tidak ada keterangan waktu spesifik>"
}

Contoh input: "Hari ini saya beli kopi harganya 25 ribu pakai uang tunai"
Output:
{"type":"EXPENSE","amount":25000,"category":"Makanan & Minuman","note":"Beli kopi uang tunai","date":"${new Date().toISOString().split("T")[0]}"}

Contoh input: "Gaji bulan ini masuk 5 juta"
Output:
{"type":"INCOME","amount":5000000,"category":"Gaji & Pendapatan","note":"Gaji bulanan","date":"${new Date().toISOString().split("T")[0]}"}
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nTeks pengguna: "${text}"\nOutput JSON:` }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const responseText = result.response.text();
    const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const type = parsed.type === "INCOME" ? "INCOME" : "EXPENSE";
    const amount = Number(parsed.amount) || 0;
    const category = CATEGORIES.includes(parsed.category) ? parsed.category : "Lain-lain";
    const note = parsed.note || text;
    const date = parsed.date || new Date().toISOString().split("T")[0];

    return {
      type,
      amount: amount > 0 ? amount : 10000,
      category,
      note,
      date,
    };
  } catch (err) {
    console.warn("AI generation failed, falling back to rule-based parser:", err);
    return fallbackIndonesianParser(text);
  }
}
