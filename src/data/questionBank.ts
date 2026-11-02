import { Question } from '../types/game';

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // LEVEL 1: DUNIA EKSPLORASI (Soal 1 - 5)
  // Topik: Konsep Rasio dan Bahasa Rasio
  // ==========================================
  {
    id: 'q1',
    level: 1,
    questionNumber: 1,
    subtopic: 'Konsep Dasar Rasio Sederhana',
    question: 'Di atas meja terdapat 6 kelereng merah dan 9 kelereng biru. Berapakah rasio kelereng merah terhadap kelereng biru dalam bentuk paling sederhana?',
    options: [
      'A. 3 : 2',
      'B. 2 : 3',
      'C. 1 : 3',
      'D. 6 : 15'
    ],
    correctIndex: 1, // B
    hint: 'Bagi kedua bilangan dengan FPB (faktor persekutuan terbesar) dari 6 dan 9, yaitu 3.',
    explanation: 'Rasio kelereng merah terhadap biru adalah 6 : 9. Kedua bilangan dapat disederhanakan dengan dibagi 3: 6 ÷ 3 = 2 dan 9 ÷ 3 = 3. Jadi rasionya adalah 2 : 3.',
    feedbackCorrect: 'HEBAT! JAWABAN BENAR! Kamu paham cara menyederhanakan rasio!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Perhatikan urutan kelereng merah dahulu baru biru, lalu sederhanakan.'
  },
  {
    id: 'q2',
    level: 1,
    questionNumber: 2,
    subtopic: 'Bahasa Rasio & Hubungan Dua Besaran',
    question: 'Sebuah resep es teh manis memerlukan 3 sendok gula pasir untuk setiap 2 gelas air. Manakah kalimat bahasa rasio yang paling tepat mendeskripsikan hubungan tersebut?',
    options: [
      'A. Untuk setiap 2 gelas air, dibutuhkan 3 sendok gula pasir.',
      'B. Jumlah sendok gula selalu lebih sedikit 1 dari gelas air.',
      'C. Selisih antara gula pasir dan gelas air selalu berjumlah 5.',
      'D. Dibutuhkan 2 sendok gula pasir untuk setiap 3 gelas air.'
    ],
    correctIndex: 0, // A
    hint: 'Bahasa rasio menggunakan pola kalimat "Untuk setiap ... besaran pertama, terdapat ... besaran kedua".',
    explanation: 'Bahasa rasio menjelaskan hubungan perkalian perbandingan. Pola yang tepat adalah: "Untuk setiap 2 gelas air, dibutuhkan 3 sendok gula pasir" (rasio air : gula = 2 : 3).',
    feedbackCorrect: 'LUAR BIASA! JAWABAN BENAR! Kamu menguasai bahasa rasio dengan sempurna!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Cek kembali mana jumlah gelas air dan mana jumlah sendok gula pada soal.'
  },
  {
    id: 'q3',
    level: 1,
    questionNumber: 3,
    subtopic: 'Urutan Penulisan Rasio',
    question: 'Dalam kotak alat tulis terdapat 12 pensil dan 8 spidol. Berapakah rasio jumlah spidol terhadap jumlah pensil dalam bentuk paling sederhana?',
    options: [
      'A. 3 : 2',
      'B. 2 : 3',
      'C. 4 : 6',
      'D. 1 : 2'
    ],
    correctIndex: 1, // B
    hint: 'Perhatikan baik-baik pertanyaan meminta "spidol terhadap pensil", bukan sebaliknya.',
    explanation: 'Jumlah spidol = 8, jumlah pensil = 12. Rasio spidol : pensil = 8 : 12. Sederhanakan kedua angka dengan dibagi FPB-nya (4): 8 ÷ 4 = 2 dan 12 ÷ 4 = 3. Hasilnya adalah 2 : 3.',
    feedbackCorrect: 'TEPAT SEKALI! JAWABAN BENAR! Urutan penyebutan rasio sangat penting!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Hati-hati jangan tertukar antara jumlah spidol dan pensil.'
  },
  {
    id: 'q4',
    level: 1,
    questionNumber: 4,
    subtopic: 'Menentukan Nilai dari Rasio Diketahui',
    question: 'Di taman sekolah, rasio banyak bunga mawar terhadap melati adalah 4 : 5. Jika terdapat 20 bunga mawar, berapakah banyak bunga melati?',
    options: [
      'A. 24 bunga',
      'B. 25 bunga',
      'C. 30 bunga',
      'D. 16 bunga'
    ],
    correctIndex: 1, // B
    hint: 'Cari nilai 1 bagian terlebih dahulu: 20 mawar mewakili 4 bagian.',
    explanation: 'Rasio mawar : melati = 4 : 5. Jika 4 bagian = 20 mawar, maka 1 bagian = 20 ÷ 4 = 5 bunga. Banyak bunga melati = 5 bagian × 5 = 25 bunga.',
    feedbackCorrect: 'PINTAR SEKALI! JAWABAN BENAR! Kamu berhasil menghitung nilai per bagian!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Hitung dulu 20 dibagi 4 untuk tahu 1 bagian nilainya berapa.'
  },
  {
    id: 'q5',
    level: 1,
    questionNumber: 5,
    subtopic: 'Karakteristik & Sifat Rasio',
    question: 'Manakah pernyataan di bawah ini yang PALING BENAR mengenai konsep rasio (perbandingan)?',
    options: [
      'A. Urutan perbandingan tidak boleh ditukar (a : b maknanya berbeda dengan b : a).',
      'B. Nilai rasio hanya boleh dihitung jika dua benda memiliki berat yang sama persis.',
      'C. Penulisan rasio harus selalu menggunakan koma desimal.',
      'D. Menambah angka yang sama pada kedua bilangan tidak mengubah rasio.'
    ],
    correctIndex: 0, // A
    hint: 'Pikirkan apakah 1 anak laki-laki dibanding 2 perempuan sama dengan 2 laki-laki dibanding 1 perempuan.',
    explanation: 'Rasio adalah perbandingan multiplikatif dua besaran dengan urutan tertentu. Jika urutannya ditukar (a : b menjadi b : a), maknanya menjadi berbeda.',
    feedbackCorrect: 'SUPER! JAWABAN BENAR! Pemahaman konsep dasar rasiomu sangat kokoh!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Ingat pentingnya urutan suku pertama dan suku kedua dalam rasio.'
  },

  // ==========================================
  // LEVEL 2: JEMBATAN TANTANGAN (Soal 6 - 10)
  // Topik: Tabel Rasio, Kesamaan Rasio & Rasio Satuan
  // ==========================================
  {
    id: 'q6',
    level: 2,
    questionNumber: 6,
    subtopic: 'Tabel Rasio & Kesamaan Rasio',
    question: 'Berdasarkan tabel resep donat: 2 cangkir tepung terigu menghasilkan 8 donat. Jika Ibu ingin membuat 24 donat, berapa cangkir tepung terigu yang diperlukan?',
    options: [
      'A. 4 cangkir',
      'B. 6 cangkir',
      'C. 8 cangkir',
      'D. 12 cangkir'
    ],
    correctIndex: 1, // B
    hint: 'Gunakan kelipatan tabel rasio: dari 8 donat menjadi 24 donat dikalikan berapa?',
    explanation: '8 donat menjadi 24 donat berarti dikali 3 (24 ÷ 8 = 3). Maka jumlah tepung terigu juga dikali 3: 2 cangkir × 3 = 6 cangkir tepung terigu.',
    feedbackCorrect: 'MANTAP! JAWABAN BENAR! Kamu mahir menggunakan tabel kesamaan rasio!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Hubungkan kelipatan donat (8 ke 24) dengan kelipatan tepung terigu.'
  },
  {
    id: 'q7',
    level: 2,
    questionNumber: 7,
    subtopic: 'Rasio Satuan (Unit Rate - Kecepatan)',
    question: 'Sebuah bus pariwisata menempuh jarak 180 km dalam waktu 3 jam dengan kecepatan tetap. Berapakah rasio satuan (kecepatan per jam) bus tersebut?',
    options: [
      'A. 50 km per jam',
      'B. 60 km per jam',
      'C. 70 km per jam',
      'D. 90 km per jam'
    ],
    correctIndex: 1, // B
    hint: 'Rasio satuan diperoleh dengan membagi jarak total dengan jumlah jam (jarak ÷ waktu).',
    explanation: 'Rasio satuan adalah nilai untuk setiap 1 satuan waktu. 180 km ÷ 3 jam = 60 km per jam. Artinya dalam setiap 1 jam bus menempuh jarak 60 km.',
    feedbackCorrect: 'LUAR BIASA! JAWABAN BENAR! Konsep rasio satuan kecepatan kamu kuasai!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Bagikan 180 dengan 3 untuk mencari jarak per 1 jam.'
  },
  {
    id: 'q8',
    level: 2,
    questionNumber: 8,
    subtopic: 'Rasio Satuan (Harga per Buah)',
    question: 'Harga 1 lusin (12 buah) buku tulis di toko adalah Rp36.000,00. Berapakah rasio satuan harga per 1 buku tulis?',
    options: [
      'A. Rp2.500,00 per buku',
      'B. Rp3.000,00 per buku',
      'C. Rp3.500,00 per buku',
      'D. Rp4.000,00 per buku'
    ],
    correctIndex: 1, // B
    hint: 'Bagi total harga Rp36.000,00 dengan banyak buku (12 buah).',
    explanation: 'Rasio satuan harga per buku = Rp36.000,00 ÷ 12 buah = Rp3.000,00 per buku.',
    feedbackCorrect: 'HEBAT! JAWABAN BENAR! Perhitungan harga per satuanmu sangat teliti!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Ingat 1 lusin = 12 buah, bagi total harga dengan 12.'
  },
  {
    id: 'q9',
    level: 2,
    questionNumber: 9,
    subtopic: 'Kesamaan Rasio (Rasio Senilai)',
    question: 'Perhatikan kesamaan dua rasio berikut: 3 : 7 = 15 : n. Berapakah nilai n yang tepat agar kedua rasio tersebut senilai?',
    options: [
      'A. 21',
      'B. 28',
      'C. 35',
      'D. 42'
    ],
    correctIndex: 2, // C
    hint: 'Angka pertama berubah dari 3 menjadi 15 (dikali 5). Lakukan hal yang sama pada angka 7.',
    explanation: 'Faktor pengali rasio adalah 15 ÷ 3 = 5. Karena kedua rasio senilai, suku kedua juga dikali 5: 7 × 5 = 35. Jadi nilai n adalah 35.',
    feedbackCorrect: 'SANGAT CERDAS! JAWABAN BENAR! Kesamaan rasio senilai terbukti tepat!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Cari faktor pengali 3 ke 15, lalu kalikan 7 dengan faktor itu.'
  },
  {
    id: 'q10',
    level: 2,
    questionNumber: 10,
    subtopic: 'Aplikasi Rasio Satuan dalam Kehidupan',
    question: 'Dari catatan panen kebun, 4 keranjang mangga mempunyai berat total 60 kg. Berapakah berat mangga jika terdapat 7 keranjang yang sama?',
    options: [
      'A. 95 kg',
      'B. 100 kg',
      'C. 105 kg',
      'D. 120 kg'
    ],
    correctIndex: 2, // C
    hint: 'Cari berat 1 keranjang terlebih dahulu (60 ÷ 4), lalu kalikan dengan 7.',
    explanation: 'Rasio satuan = 60 kg ÷ 4 keranjang = 15 kg per keranjang. Berat 7 keranjang = 7 × 15 kg = 105 kg.',
    feedbackCorrect: 'GEMILANG! JAWABAN BENAR! Kamu sukses melintasi Jembatan Tantangan!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Hitung dulu berat 1 keranjang dengan membagi 60 dengan 4.'
  },

  // ==========================================
  // LEVEL 3: KASTEL JUARA (Soal 11 - 15)
  // Topik: Rasio Bagian-ke-Bagian vs Bagian-ke-Keseluruhan & Pemecahan Masalah
  // ==========================================
  {
    id: 'q11',
    level: 3,
    questionNumber: 11,
    subtopic: 'Rasio Bagian terhadap Keseluruhan',
    question: 'Rasio siswa laki-laki terhadap siswa perempuan di kelas 6 adalah 3 : 4. Berapakah rasio siswa laki-laki terhadap SELURUH siswa di kelas tersebut?',
    options: [
      'A. 3 : 4',
      'B. 3 : 7',
      'C. 4 : 7',
      'D. 7 : 3'
    ],
    correctIndex: 1, // B
    hint: 'Jumlah seluruh bagian siswa adalah bagian laki-laki ditambah bagian perempuan (3 + 4).',
    explanation: 'Bagian laki-laki = 3, bagian perempuan = 4. Jumlah seluruh siswa = 3 + 4 = 7 bagian. Maka rasio laki-laki terhadap seluruh siswa adalah 3 : 7.',
    feedbackCorrect: 'LUAR BIASA! JAWABAN BENAR! Kamu paham betul konsep bagian ke keseluruhan!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Jumlahkan kedua bagian terlebih dahulu untuk mendapat nilai keseluruhan.'
  },
  {
    id: 'q12',
    level: 3,
    questionNumber: 12,
    subtopic: 'Membagi Jumlah Berdasarkan Rasio',
    question: 'Di perpustakaan, rasio buku fiksi terhadap buku non-fiksi adalah 2 : 5. Jika total seluruh buku ada 70 buku, berapakah banyak buku non-fiksi?',
    options: [
      'A. 20 buku',
      'B. 35 buku',
      'C. 50 buku',
      'D. 25 buku'
    ],
    correctIndex: 2, // C
    hint: 'Total bagian = 2 + 5 = 7 bagian. Bagikan 70 dengan 7 untuk mendapat nilai 1 bagian.',
    explanation: 'Total bagian = 2 + 5 = 7 bagian. Nilai 1 bagian = 70 ÷ 7 = 10 buku. Banyak buku non-fiksi = 5 bagian × 10 = 50 buku.',
    feedbackCorrect: 'TEPAT DAN TANGKAS! JAWABAN BENAR! Pembagian rasio terhitung sempurna!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Hitung total bagian (2+5), lalu bagi 70 dengan total bagian itu.'
  },
  {
    id: 'q13',
    level: 3,
    questionNumber: 13,
    subtopic: 'Selisih Umur Berdasarkan Rasio',
    question: 'Rasio umur adik dan kakak adalah 2 : 3. Jika jumlah umur keduanya saat ini adalah 25 tahun, berapakah SELISIH umur adik dan kakak?',
    options: [
      'A. 3 tahun',
      'B. 5 tahun',
      'C. 7 tahun',
      'D. 10 tahun'
    ],
    correctIndex: 1, // B
    hint: 'Jumlah bagian = 2 + 3 = 5 bagian = 25 tahun. Selisih bagian = 3 - 2 = 1 bagian.',
    explanation: 'Jumlah bagian = 2 + 3 = 5 bagian. Nilai 1 bagian = 25 ÷ 5 = 5 tahun. Selisih bagian kakak dan adik = 3 - 2 = 1 bagian. Jadi selisih umur mereka adalah 1 × 5 = 5 tahun.',
    feedbackCorrect: 'HEBAT SEKALI! JAWABAN BENAR! Langkah penalaran selisih rasiomu sangat mantap!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! Cari dulu nilai 1 bagian dengan membagi 25 dengan (2 + 3).'
  },
  {
    id: 'q14',
    level: 3,
    questionNumber: 14,
    subtopic: 'Rasio Tiga Besaran & Bagian ke Keseluruhan',
    question: 'Sebuah toples berisi permen rasa stroberi, jeruk, dan anggur dengan rasio 2 : 3 : 5. Jika ada 15 permen jeruk, berapakah jumlah SELURUH permen di dalam toples?',
    options: [
      'A. 40 permen',
      'B. 50 permen',
      'C. 60 permen',
      'D. 30 permen'
    ],
    correctIndex: 1, // B
    hint: 'Permen jeruk mewakili 3 bagian = 15 buah. Hitung 1 bagian, lalu kalikan dengan total bagian (2 + 3 + 5).',
    explanation: 'Rasio jeruk = 3 bagian = 15 buah, maka 1 bagian = 15 ÷ 3 = 5 buah. Total seluruh bagian = 2 + 3 + 5 = 10 bagian. Jumlah seluruh permen = 10 × 5 = 50 permen.',
    feedbackCorrect: 'SPEKTAKULER! JAWABAN BENAR! Penalaran rasio multi-besaran terselesaikan!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! 3 bagian bernilai 15, artinya 1 bagian bernilai 5. Kalikan dengan total 10 bagian.'
  },
  {
    id: 'q15',
    level: 3,
    questionNumber: 15,
    subtopic: 'Penalaran Rasio Tingkat Lanjut (Selisih Diketahui)',
    question: 'Di sebuah penangkaran, rasio burung kenari terhadap burung parkit adalah 5 : 3. Jika burung kenari lebih banyak 6 ekor daripada burung parkit, berapa TOTAL seluruh burung di penangkaran?',
    options: [
      'A. 16 ekor',
      'B. 24 ekor',
      'C. 30 ekor',
      'D. 32 ekor'
    ],
    correctIndex: 1, // B
    hint: 'Selisih bagian kenari dan parkit adalah 5 - 3 = 2 bagian. 2 bagian bernilai 6 ekor.',
    explanation: 'Selisih perbandingan = 5 - 3 = 2 bagian. 2 bagian mewakili 6 ekor, jadi 1 bagian = 6 ÷ 2 = 3 ekor. Total seluruh bagian = 5 + 3 = 8 bagian. Total seluruh burung = 8 × 3 = 24 ekor.',
    feedbackCorrect: 'JUARA SEJATI! JAWABAN BENAR! Kamu telah menaklukkan seluruh soal Kastel Juara!',
    feedbackIncorrect: 'COBA LAGI, KAMU PASTI BISA! 2 bagian sama dengan 6 ekor, jadi 1 bagian = 3 ekor. Lalu kalikan dengan total 8 bagian.'
  }
];

export const LEVEL_CONFIG: { [level: number]: { name: string; title: string; subtitle: string; questionsRange: [number, number]; theme: string; skyColor: number } } = {
  1: {
    name: 'LEVEL 1',
    title: 'DUNIA EKSPLORASI',
    subtitle: 'Pemahaman Konsep Rasio & Bahasa Rasio',
    questionsRange: [1, 5],
    theme: 'meadow',
    skyColor: 0x64b5f6, // bright sky blue
  },
  2: {
    name: 'LEVEL 2',
    title: 'JEMBATAN TANTANGAN',
    subtitle: 'Tabel Rasio, Rasio Senilai & Rasio Satuan',
    questionsRange: [6, 10],
    theme: 'canyon',
    skyColor: 0xffb74d, // sunset golden canyon sky
  },
  3: {
    name: 'LEVEL 3',
    title: 'KASTEL JUARA',
    subtitle: 'Rasio Bagian ke Keseluruhan & Masalah Kontekstual',
    questionsRange: [11, 15],
    theme: 'castle',
    skyColor: 0x4a148c, // twilight royal purple sky
  }
};
