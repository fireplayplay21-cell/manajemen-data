import {
  ProfilSekolah,
  UserAccount,
  DokumenPerencanaan,
  IndikatorRaporPendidikan,
  ProgramUnggulan,
  PTKRecord,
  SuratRecord,
  MOUKerjasama,
  KelasRecord,
  Siswa,
  PresensiHarian,
  PrestasiSiswa,
  ProgramKarakter,
  Ekstrakurikuler,
  MasalahSiswa,
  SupervisiAkademik,
  SupervisiManajerial,
  ItemRKAS,
  TransaksiKeuangan,
  ItemSarpras,
  PemeliharaanSarpras,
  PeminjamanSarpras,
  AgendaHarianKS,
  BukuTamu,
  JurnalKepemimpinan,
  KeputusanSK,
  RencanaPerbaikan,
  DokumenAdministrasiGuru,
  KategoriAdministrasiGuru,
  RiwayatPelatihanGuru,
  ItemObservasi5Komponen,
  FormulirSupervisiLengkap
} from '../types';
import {
  DEFAULT_LOGO_SEKOLAH,
  DEFAULT_LOGO_MAKASSAR,
  DEFAULT_LOGO_TUT_WURI
} from './brandingAssets';

export const initialProfilSekolah: ProfilSekolah = {
  namaSekolah: 'UPTD SPF SDN Lanto Dg. Pasewang',
  npsn: '40307399',
  nss: '101196007012',
  akreditasi: 'A (Unggul)',
  bentukPendidikan: 'Sekolah Dasar (SD)',
  statusSekolah: 'Negeri',
  kurikulum: 'Kurikulum Merdeka (Fase A, B, C)',
  kepalaSekolah: 'Dra. Hj. Rosdiana, M.Pd.',
  nipKepalaSekolah: '19700412 199303 2 004',
  alamat: 'Jl. Lanto Dg. Pasewang No. 34',
  kelurahan: 'Maricaya Selatan',
  kecamatan: 'Mamajang',
  kota: 'Kota Makassar',
  provinsi: 'Sulawesi Selatan',
  kodePos: '90131',
  email: 'sdnlantodgpasewang@makassarkota.go.id',
  telepon: '(0411) 872341',
  website: 'https://sdnlantodgpasewang.sch.id',
  visi: 'Terwujudnya Peserta Didik yang Beriman, Berakhlak Mulia, Cerdas, Terampil, Berkarakter Profil Pelajar Pancasila dan Berwawasan Lingkungan.',
  misi: [
    'Menanamkan keimanan dan ketakwaan melalui pengamalan nilai-nilai agama dan pembiasaan ibadah rutin.',
    'Melaksanakan proses pembelajaran berdiferensiasi dan asesmen bermakna secara aktif, inovatif, dan menyenangkan.',
    'Mengembangkan potensi, bakat, minat, serta keterampilan abad 21 melalui kegiatan kokurikuler dan ekstrakurikuler.',
    'Menerapkan budaya kearifan lokal Makassar (Sipakatau, Sipakalebbi, Sipakainge) dan 5S (Senyum, Sapa, Salam, Sopan, Santun).',
    'Mewujudkan lingkungan sekolah yang bersih, sehat, rindang, aman, nyaman, dan berbudaya adiwiyata.'
  ],
  tujuan: [
    'Meningkatkan capaian literasi dan numerasi peserta didik di atas standar kompetensi minimum nasional.',
    'Mencetak lulusan yang berkarakter tangguh, mandiri, dan berjiwa gotong royong.',
    'Mempertahankan predikat Akreditasi A dan menjadi sekolah penggerak rujukan di Kota Makassar.',
    'Mewujudkan tata kelola administrasi dan keuangan sekolah yang transparan, akuntabel, dan berbasis digital.'
  ],
  semboyan: 'Sipakatau, Sipakalebbi, Sipakainge - Unggul dalam Prestasi, Santun dalam Pekerti',
  tahunPelajaran: '2024/2025',
  semester: 'Semester Ganjil',
  logoUrl: DEFAULT_LOGO_SEKOLAH,
  logoDinasUrl: DEFAULT_LOGO_MAKASSAR,
  tutWuriLogoUrl: DEFAULT_LOGO_TUT_WURI,
  stempelUrl: ''
};

export const initialUsers: UserAccount[] = [
  {
    id: 'USR-001',
    nama: 'Administrator SIM Sekolah',
    nip: '19850615 201001 1 018',
    email: 'admin.lanto@makassar.sch.id',
    password: '123456',
    role: 'admin',
    jabatan: 'Admin Sistem & Operator Dapodik',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    telepon: '081245678901',
    tanggalEnrol: '2024-01-05'
  },
  {
    id: 'USR-002',
    nama: 'Dra. Hj. Rosdiana, M.Pd.',
    nip: '19700412 199303 2 004',
    email: 'kepsek.rosdiana@makassar.sch.id',
    password: '123456',
    role: 'kepala_sekolah',
    jabatan: 'Kepala Sekolah',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    telepon: '081342119988',
    tanggalEnrol: '2023-07-10'
  },
  {
    id: 'USR-003',
    nama: 'Andi Nurhaliza, S.Pd., Gr.',
    nip: '19920814 201903 2 011',
    email: 'nurhaliza.guru@sd.belajar.id',
    password: '123456',
    role: 'guru',
    jabatan: 'Guru Kelas 1A (Fase A)',
    kelasTugas: 'Kelas 1A',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    telepon: '085299443322',
    tanggalEnrol: '2024-07-15'
  },
  {
    id: 'USR-004',
    nama: 'Muhammad Syahrir, S.Pd.',
    nip: '19880320 201402 1 005',
    email: 'syahrir.guru@sd.belajar.id',
    password: '123456',
    role: 'guru',
    jabatan: 'Guru Kelas 4B (Fase B)',
    kelasTugas: 'Kelas 4B',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    telepon: '082188776655',
    tanggalEnrol: '2024-07-15'
  },
  {
    id: 'USR-005',
    nama: 'Sitti Fatimah, S.Pd.I',
    nip: '19871109 201101 2 014',
    email: 'fatimah.pai@sd.belajar.id',
    password: '123456',
    role: 'guru',
    jabatan: 'Guru Pendidikan Agama Islam',
    mataPelajaran: 'Pendidikan Agama Islam & BP',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    telepon: '085341223344',
    tanggalEnrol: '2024-07-15'
  },
  {
    id: 'USR-006',
    nama: 'Kurniawan Pratama, S.Pd.',
    nip: '19940502 202221 1 008',
    email: 'kurniawan.pjok@sd.belajar.id',
    password: '123456',
    role: 'guru',
    jabatan: 'Guru PJOK & Pembina Ekskul',
    mataPelajaran: 'Pendidikan Jasmani Olahraga & Kesehatan',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    telepon: '081290334455',
    tanggalEnrol: '2024-07-18'
  },
  {
    id: 'USR-007',
    nama: 'Nurul Hidayah, A.Md.Kom.',
    nip: '19960228 202321 2 015',
    email: 'tu.nurul@makassar.sch.id',
    password: '123456',
    role: 'tata_usaha',
    jabatan: 'Bendahara BOSP & Staf Tata Usaha',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    telepon: '085211998877',
    tanggalEnrol: '2024-07-20'
  }
];

export const initialPerencanaan: DokumenPerencanaan[] = [
  {
    id: 'DOC-01',
    kategori: 'KSP',
    judul: 'Kurikulum Satuan Pendidikan (KSP) Tahun Ajaran 2024/2025',
    tahunAjaran: '2024/2025',
    penyusun: 'Tim Pengembang Kurikulum SDN Lanto Dg. Pasewang',
    tanggalUpload: '2024-07-12',
    status: 'Disetujui KS',
    uraian: 'Dokumen operasional kurikulum merdeka memuat karakteristik sekolah, visi misi, pengorganisasian pembelajaran, dan rencana pendampingan evaluasi.',
    targetCapaian: 'Implementasi 100% di kelas 1, 2, 4, dan 5'
  },
  {
    id: 'DOC-02',
    kategori: 'RKT/RKS',
    judul: 'Rencana Kerja Tahunan & RKS 4 Tahunan 2024-2028',
    tahunAjaran: '2024/2025',
    penyusun: 'Kepala Sekolah & Tim Penjamin Mutu',
    tanggalUpload: '2024-07-18',
    status: 'Final',
    uraian: 'Peta jalan peningkatan mutu akademik, sarana prasarana ramah anak, dan digitalisasi pelaporan sekolah.',
    targetCapaian: 'Pencapaian 12 indikator prioritas SPM Pendidikan'
  },
  {
    id: 'DOC-03',
    kategori: 'RKAS',
    judul: 'Rencana Kegiatan dan Anggaran Sekolah (RKAS BOS Reguler)',
    tahunAjaran: '2024/2025',
    penyusun: 'Tim BOS Sekolah',
    tanggalUpload: '2024-07-25',
    status: 'Disetujui KS',
    uraian: 'Alokasi anggaran belanja operasional, pemeliharaan sarpras, pengadaan buku teks merdeka, dan kegiatan ekstrakurikuler.',
    targetCapaian: 'Total pagu Rp 328.500.000 terserap efisien'
  },
  {
    id: 'DOC-04',
    kategori: 'Program Kerja KS',
    judul: 'Program Kerja Tahunan Kepala Sekolah Bidang Manajerial & Supervisi',
    tahunAjaran: '2024/2025',
    penyusun: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUpload: '2024-08-01',
    status: 'Final',
    uraian: 'Matriks program supervisi klinis guru, pembinaan disiplin tenaga pendidik, dan kemitraan paguyuban orang tua murid.',
    targetCapaian: '100% guru tersupervisi 2 kali per semester'
  },
  {
    id: 'DOC-05',
    kategori: 'Kalender Pendidikan',
    judul: 'Kalender Akademik Sekolah Semester Ganjil & Genap 2024/2025',
    tahunAjaran: '2024/2025',
    penyusun: 'Wakasek Kurikulum',
    tanggalUpload: '2024-07-08',
    status: 'Final',
    uraian: 'Jadwal hari efektif belajar, asesmen sumatif tengah/akhir semester, ANBK, dan libur keagamaan Kota Makassar.',
    targetCapaian: '210 Hari Efektif Belajar'
  },
  {
    id: 'DOC-06',
    kategori: 'Target Sekolah',
    judul: 'Matriks Target Kinerja & Mutu Kelulusan 2024/2025',
    tahunAjaran: '2024/2025',
    penyusun: 'Dewan Guru',
    tanggalUpload: '2024-08-05',
    status: 'Disetujui KS',
    uraian: 'Target 100% kelulusan kelas 6, minimal 10 piala kejuaraan tingkat kota/provinsi, dan indeks kepuasan wali murid 95%.',
    targetCapaian: 'Kenaikan nilai Rapor Pendidikan Literasi > 85.0'
  }
];

export const initialPBD: IndikatorRaporPendidikan[] = [
  {
    id: 'PBD-01',
    kode: 'A.1',
    indikator: 'Kemampuan Literasi Membaca Peserta Didik',
    dimensi: 'A',
    skorTahunIni: 82.4,
    skorTahunLalu: 74.2,
    capaian: 'Baik',
    identifikasiMasalah: 'Sebagian siswa kelas rendah masih memerlukan penguatan kompetensi membaca pemahaman teks informasi panjang.',
    akarMasalah: 'Ketersediaan bahan bacaan non-teks yang variatif di pojok baca kelas masih terbatas.',
    programIntervensi: 'Program Pojok Baca Ramah Anak & Literasi 15 Menit Nyaring Setiap Pagi sebelum jam pertama.',
    targetPerbaikan: 'Skor Literasi mencapai minimal 88.0 di ANBK mendatang.',
    tindakLanjut: 'Pengadaan 150 judul buku cerita bergambar dan pelatihan guru dalam strategi membaca interaktif.',
    penanggungJawab: 'Koordinator Literasi & Guru Kelas 1-3',
    statusTindakLanjut: 'Sedang Berjalan'
  },
  {
    id: 'PBD-02',
    kode: 'A.2',
    indikator: 'Kemampuan Numerasi & Penalaran Logis Siswa',
    dimensi: 'A',
    skorTahunIni: 76.8,
    skorTahunLalu: 68.5,
    capaian: 'Baik',
    identifikasiMasalah: 'Kemampuan menyelesaikan soal pemecahan masalah kontekstual (soal cerita berbasis HOTS) masih bervariasi.',
    akarMasalah: 'Metode pembelajaran numerasi masih cenderung prosedural dan kurang menggunakan alat peraga konkret.',
    programIntervensi: 'Penyediaan Kit Matematika Kontekstual & Workshop Guru Desain LKPD Berbasis Masalah Nyata.',
    targetPerbaikan: 'Peningkatan daya nalar siswa dengan skor numerasi > 82.0.',
    tindakLanjut: 'Kelompok Kerja Guru (KKG) mini internal tiap hari Sabtu pekan ke-2.',
    penanggungJawab: 'Guru Kelas 4, 5, 6 & Tim Kurikulum',
    statusTindakLanjut: 'Sedang Berjalan'
  },
  {
    id: 'PBD-03',
    kode: 'A.3',
    indikator: 'Karakter & Profil Pelajar Pancasila',
    dimensi: 'A',
    skorTahunIni: 86.5,
    skorTahunLalu: 81.0,
    capaian: 'Baik',
    identifikasiMasalah: 'Penguatan kemandirian dan kesadaran membuang sampah pada tempatnya pada jam istirahat.',
    akarMasalah: 'Keteladanan dan sistem piket kebersihan kelas perlu diperkuat secara konsisten.',
    programIntervensi: 'Program "Gerakan Lanto Bersih & Berbudaya Tabik" serta Duta Karakter Cilik.',
    targetPerbaikan: 'Skor Karakter mencapai kategori Istimewa (>90).',
    tindakLanjut: 'Pemberian apresiasi pin Duta Adiwiyata & Pelajar Pancasila setiap upacara bendera hari Senin.',
    penanggungJawab: 'Pembina Kesiswaan & Guru PAI',
    statusTindakLanjut: 'Sedang Berjalan'
  },
  {
    id: 'PBD-04',
    kode: 'D.1',
    indikator: 'Kualitas Pembelajaran & Manajemen Kelas',
    dimensi: 'D',
    skorTahunIni: 79.2,
    skorTahunLalu: 72.0,
    capaian: 'Baik',
    identifikasiMasalah: 'Sebagian guru belum optimal memanfaatkan teknologi interaktif dan diferensiasi konten.',
    akarMasalah: 'Pemanfaatan platform Merdeka Mengajar (PMM) dan pelatihan mandiri belum merata di semua jenjang.',
    programIntervensi: 'Gerakan Aksi PMM Satu Pekan Satu Aksi Nyata & Supervisi Tematik.',
    targetPerbaikan: '100% guru menyelesaikan minimal 4 topik PMM berlisensi.',
    tindakLanjut: 'Coaching berkala oleh Kepala Sekolah dan Guru Penggerak sekolah.',
    penanggungJawab: 'Kepala Sekolah & Guru Penggerak',
    statusTindakLanjut: 'Sedang Berjalan'
  },
  {
    id: 'PBD-05',
    kode: 'D.4',
    indikator: 'Iklim Keamanan & Sekolah Ramah Anak',
    dimensi: 'D',
    skorTahunIni: 91.0,
    skorTahunLalu: 87.5,
    capaian: 'Baik',
    identifikasiMasalah: 'Perlunya pemantauan rutin area titik buta (sudut kantin dan lorong belakang sekolah).',
    akarMasalah: 'Penerangan dan CCTV sudut belakang belum terpasang optimal.',
    programIntervensi: 'Pemasangan 4 titik CCTV tambahan dan Tim Pencegahan & Penanganan Kekerasan (TPPK).',
    targetPerbaikan: 'Zero bullying & 100% rasa aman peserta didik.',
    tindakLanjut: 'Deklarasi Anti-Perundungan bersama Komite dan Kepolisian Babinsa Mamajang.',
    penanggungJawab: 'Tim TPPK Sekolah & Staf Sarpras',
    statusTindakLanjut: 'Selesai'
  }
];

export const initialProgramUnggulan: ProgramUnggulan[] = [
  {
    id: 'PRG-01',
    jenis: 'Program Sekolah',
    namaProgram: 'Gerakan Lanto Berbudaya Makassar (Sipakatau, Sipakalebbi, Sipakainge)',
    bidang: 'Penguatan Karakter & Kearifan Lokal',
    deskripsi: 'Pembiasaan harian mengucapkan "Tabik", saling menghargai, menghormati guru dan teman sebaya, serta penggunaan busana adat Baju Bodo/Jas Tutu setiap tanggal 1.',
    inovator: 'Dra. Hj. Rosdiana, M.Pd.',
    dampak: 'Meningkatkan kesantunan siswa, menurunkan konflik antarmurid hingga 0%, dan memperkuat kebanggaan budaya daerah.',
    tanggalPelaksanaan: '2024-07-22',
    lokasi: 'Seluruh Lingkungan SDN Lanto Dg. Pasewang'
  },
  {
    id: 'PRG-02',
    jenis: 'Praktik Baik',
    namaProgram: 'Pojok Baca Digital & Mading Baruga Pintar',
    bidang: 'Literasi & Numerasi',
    deskripsi: 'Pengembangan media mading interaktif dan QR Code akses buku digital gratis di selasar kelas untuk memfasilitasi minat baca siswa saat istirahat.',
    inovator: 'Andi Nurhaliza, S.Pd., Gr.',
    dampak: 'Peningkatan durasi membaca siswa rata-rata 35 menit per hari dan peminjaman buku perpustakaan naik 60%.',
    tanggalPelaksanaan: '2024-08-10',
    lokasi: 'Perpustakaan & Selasar Kelas 1-6'
  },
  {
    id: 'PRG-03',
    jenis: 'Dokumentasi',
    namaProgram: 'Senam Sehat Bugis-Makassar & Sarapan Bergizi Bersama (Jumat Berkah)',
    bidang: 'Kesehatan & Gizi Anak',
    deskripsi: 'Kegiatan rutin Jumat pagi berupa senam kesegaran jasmani, doa bersama lintas agama, dilanjutkan sarapan bersama menu 4 sehat 5 sempurna bebas plastik sekali pakai.',
    inovator: 'Kurniawan Pratama, S.Pd. & Tim UKS',
    dampak: 'Kebugaran fisik siswa meningkat, ketidakhadiran karena sakit turun sebesar 40%.',
    tanggalPelaksanaan: '2024-08-16',
    lokasi: 'Lapangan Utama SDN Lanto Dg. Pasewang'
  },
  {
    id: 'PRG-04',
    jenis: 'Program Sekolah',
    namaProgram: 'Lanto Green Eco-School (Bank Sampah Cilik & Komposter Organik)',
    bidang: 'Lingkungan Hidup & Adiwiyata',
    deskripsi: 'Edukasi pemilahan sampah organik dan anorganik. Sampah plastik ditukar poin tabungan siswa dan daun kering diolah menjadi pupuk kompos tanaman hias sekolah.',
    inovator: 'Tim Adiwiyata Sekolah',
    dampak: 'Sekolah bersih bebas sampah berserakan, menghasilkan 25 kg pupuk kompos per bulan untuk taman sekolah.',
    tanggalPelaksanaan: '2024-08-01',
    lokasi: 'Rumah Kompos & Bank Sampah Sekolah'
  }
];

export const initialPTK: PTKRecord[] = [
  {
    id: 'PTK-01',
    nama: 'Dra. Hj. Rosdiana, M.Pd.',
    nip: '19700412 199303 2 004',
    nuptk: '4544748650300022',
    jenisKelamin: 'P',
    pangkatGolongan: 'Pembina Utama Muda / IV-c',
    jabatan: 'Kepala Sekolah',
    tugasTambahan: 'Manajerial, Supervisi & Kewirausahaan',
    pendidikanTerakhir: 'S2 Manajemen Pendidikan (UNM)',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi',
    email: 'rosdiana.sdn@makassar.sch.id',
    telepon: '081342119988',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PTK-02',
    nama: 'Andi Nurhaliza, S.Pd., Gr.',
    nip: '19920814 201903 2 011',
    nuptk: '1244770671230043',
    jenisKelamin: 'P',
    pangkatGolongan: 'Penata Muda Tk.I / III-b',
    jabatan: 'Guru Kelas 1A',
    tugasTambahan: 'Koordinator Literasi Sekolah',
    pendidikanTerakhir: 'S1 PGSD Universitas Negeri Makassar',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi',
    email: 'nurhaliza.guru@sd.belajar.id',
    telepon: '085299443322',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PTK-03',
    nama: 'Muhammad Syahrir, S.Pd.',
    nip: '19880320 201402 1 005',
    nuptk: '8844766668130092',
    jenisKelamin: 'L',
    pangkatGolongan: 'Penata / III-c',
    jabatan: 'Guru Kelas 4B',
    tugasTambahan: 'Ketua Tim Penjamin Mutu Pendidikan Sekolah',
    pendidikanTerakhir: 'S1 PGSD Universitas Muhammadiyah Makassar',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi',
    email: 'syahrir.guru@sd.belajar.id',
    telepon: '082188776655',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PTK-04',
    nama: 'Sitti Fatimah, S.Pd.I',
    nip: '19871109 201101 2 014',
    nuptk: '3456765667230081',
    jenisKelamin: 'P',
    pangkatGolongan: 'Penata / III-c',
    jabatan: 'Guru PAI & Budi Pekerti',
    tugasTambahan: 'Koordinator Pembiasaan Sholat & Keagamaan',
    pendidikanTerakhir: 'S1 Tarbiyah UIN Alauddin Makassar',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi',
    email: 'fatimah.pai@sd.belajar.id',
    telepon: '085341223344',
    foto: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PTK-05',
    nama: 'Kurniawan Pratama, S.Pd.',
    nip: '19940502 202221 1 008',
    nuptk: '9044772674130053',
    jenisKelamin: 'L',
    pangkatGolongan: 'Ahli Pertama / IX (PPPK)',
    jabatan: 'Guru PJOK',
    tugasTambahan: 'Koordinator UKS & Pembina Ekstrakurikuler',
    pendidikanTerakhir: 'S1 Pendidikan Jasmani UNM',
    statusKepegawaian: 'PPPK',
    sertifikasi: 'Sudah Sertifikasi',
    email: 'kurniawan.pjok@sd.belajar.id',
    telepon: '081290334455',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'PTK-06',
    nama: 'Nurul Hidayah, A.Md.Kom.',
    nip: '19960228 202321 2 015',
    nuptk: '-',
    jenisKelamin: 'P',
    pangkatGolongan: 'Pengatur / VII (PPPK)',
    jabatan: 'Tenaga Administrasi Sekolah',
    tugasTambahan: 'Bendahara Pembantu BOSP & Pengelola Sarpras',
    pendidikanTerakhir: 'D3 Manajemen Informatika Poltek Makassar',
    statusKepegawaian: 'PPPK',
    sertifikasi: 'Belum Sertifikasi',
    email: 'tu.nurul@makassar.sch.id',
    telepon: '085211998877',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  }
];

export const initialSurat: SuratRecord[] = [
  {
    id: 'SRT-01',
    jenis: 'Surat Masuk',
    nomorSurat: '421.2/1842/DISDIK/VIII/2024',
    tanggalSurat: '2024-08-12',
    tanggalDiterimaKirim: '2024-08-14',
    pengirimPenerima: 'Dinas Pendidikan Kota Makassar',
    perihal: 'Undangan Rapat Koordinasi ANBK dan Pemanfaatan Rapor Pendidikan',
    kategori: 'Undangan',
    disposisi: 'Hadiri bersama Tim Kurikulum dan Operator Dapodik. Siapkan data.',
    status: 'Selesai'
  },
  {
    id: 'SRT-02',
    jenis: 'Surat Masuk',
    nomorSurat: '005/PKM-MMJ/VIII/2024',
    tanggalSurat: '2024-08-18',
    tanggalDiterimaKirim: '2024-08-19',
    pengirimPenerima: 'Puskesmas Mamajang',
    perihal: 'Pemberitahuan Pelaksanaan Bulan Imunisasi Anak Sekolah (BIAS)',
    kategori: 'Pemberitahuan',
    disposisi: 'Kordinasikan dengan guru kelas 1, 2, dan 5 serta kirim surat ke wali murid.',
    status: 'Diproses'
  },
  {
    id: 'SRT-03',
    jenis: 'Surat Keluar',
    nomorSurat: '421.1/089/UPTD-SDN.LDP/VIII/2024',
    tanggalSurat: '2024-08-20',
    tanggalDiterimaKirim: '2024-08-20',
    pengirimPenerima: 'Orang Tua / Wali Murid Kelas 1, 2, dan 5',
    perihal: 'Pemberitahuan & Persetujuan Imunisasi BIAS Tahun 2024',
    kategori: 'Pemberitahuan',
    disposisi: 'Telah didistribusikan via wali kelas.',
    status: 'Terkirim'
  },
  {
    id: 'SRT-04',
    jenis: 'Surat Keluar',
    nomorSurat: '421.1/095/UPTD-SDN.LDP/VIII/2024',
    tanggalSurat: '2024-08-24',
    tanggalDiterimaKirim: '2024-08-25',
    pengirimPenerima: 'Camat Mamajang Kota Makassar',
    perihal: 'Permohonan Peminjaman Lapangan untuk Seleksi O2SN & Karnaval',
    kategori: 'Permohonan',
    disposisi: 'Disetujui pihak kecamatan.',
    status: 'Selesai'
  }
];

export const initialMOU: MOUKerjasama[] = [
  {
    id: 'MOU-01',
    mitra: 'Puskesmas Mamajang Kota Makassar',
    bidang: 'Kesehatan Sekolah, Penjaringan UKS, dan Program BIAS',
    nomorMOU: '440/012/MOU/PKM-MMJ/2024',
    tanggalMulai: '2024-01-10',
    tanggalBerakhir: '2026-01-10',
    status: 'Aktif',
    programKerja: 'Pemeriksaan gigi berkala, imunisasi, penyuluhan gizi seimbang, dan pembinaan Dokter Kecil.',
    penanggungJawab: 'Kurniawan Pratama, S.Pd. (Pembina UKS)'
  },
  {
    id: 'MOU-02',
    mitra: 'Polsek Mamajang & Babinsa Maricaya Selatan',
    bidang: 'Keamanan, Ketertiban, dan Penyuluhan Anti-Bullying / Tertib Lalu Lintas',
    nomorMOU: '05/MOU-PLK/MMJ/VII/2024',
    tanggalMulai: '2024-07-15',
    tanggalBerakhir: '2025-07-15',
    status: 'Aktif',
    programKerja: 'Inspektur upacara bulanan, penyuluhan pencegahan kekerasan anak, dan patroli lingkungan aman.',
    penanggungJawab: 'Tim TPPK Sekolah & Kepala Sekolah'
  },
  {
    id: 'MOU-03',
    mitra: 'Bank Sampah Peduli Lingkungan Makassar',
    bidang: 'Pengelolaan Sampah Berkelanjutan & Sekolah Adiwiyata',
    nomorMOU: '18/BS-MKS/V/2024',
    tanggalMulai: '2024-05-02',
    tanggalBerakhir: '2026-05-02',
    status: 'Aktif',
    programKerja: 'Penimbangan sampah anorganik sekolah per pekan dan pelatihan daur ulang bagi siswa.',
    penanggungJawab: 'Koordinator Adiwiyata Sekolah'
  }
];

export const initialKelas: KelasRecord[] = [
  {
    id: 'KLS-01',
    namaKelas: 'Kelas 1A',
    tingkat: '1',
    fase: 'Fase A',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Andi Nurhaliza, S.Pd., Gr.',
    nipWaliKelas: '19920814 201903 2 011',
    ruangan: 'Ruang 1.1 (Gedung A Lt. 1)',
    kapasitas: 28,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 1 Pagi'
  },
  {
    id: 'KLS-02',
    namaKelas: 'Kelas 1B',
    tingkat: '1',
    fase: 'Fase A',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Fitriani Basri, S.Pd.',
    nipWaliKelas: '19950312 202221 2 009',
    ruangan: 'Ruang 1.2 (Gedung A Lt. 1)',
    kapasitas: 28,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 1 Pagi'
  },
  {
    id: 'KLS-03',
    namaKelas: 'Kelas 2A',
    tingkat: '2',
    fase: 'Fase A',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Rina Wahyuni, S.Pd.',
    nipWaliKelas: '19910405 201701 2 006',
    ruangan: 'Ruang 2.1 (Gedung A Lt. 1)',
    kapasitas: 30,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 2'
  },
  {
    id: 'KLS-04',
    namaKelas: 'Kelas 2B',
    tingkat: '2',
    fase: 'Fase A',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Ahmad Fauzi, S.Pd.',
    nipWaliKelas: '19930718 202012 1 003',
    ruangan: 'Ruang 2.2 (Gedung A Lt. 1)',
    kapasitas: 30,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 2'
  },
  {
    id: 'KLS-05',
    namaKelas: 'Kelas 3A',
    tingkat: '3',
    fase: 'Fase B',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Dewi Sartika, S.Pd.',
    nipWaliKelas: '19890925 201503 2 007',
    ruangan: 'Ruang 3.1 (Gedung B Lt. 1)',
    kapasitas: 32,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 3'
  },
  {
    id: 'KLS-06',
    namaKelas: 'Kelas 3B',
    tingkat: '3',
    fase: 'Fase B',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Rustam Effendi, S.Pd.',
    nipWaliKelas: '19880110 201202 1 004',
    ruangan: 'Ruang 3.2 (Gedung B Lt. 1)',
    kapasitas: 32,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 3'
  },
  {
    id: 'KLS-07',
    namaKelas: 'Kelas 4A',
    tingkat: '4',
    fase: 'Fase B',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Hasnah, S.Pd.',
    nipWaliKelas: '19860614 201001 2 018',
    ruangan: 'Ruang 4.1 (Gedung B Lt. 2)',
    kapasitas: 32,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 4'
  },
  {
    id: 'KLS-08',
    namaKelas: 'Kelas 4B',
    tingkat: '4',
    fase: 'Fase B',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Muhammad Syahrir, S.Pd.',
    nipWaliKelas: '19880320 201402 1 005',
    ruangan: 'Ruang 4.2 (Gedung B Lt. 2)',
    kapasitas: 32,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 4'
  },
  {
    id: 'KLS-09',
    namaKelas: 'Kelas 5A',
    tingkat: '5',
    fase: 'Fase C',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Ratna Juwita, S.Pd.',
    nipWaliKelas: '19870519 201101 2 013',
    ruangan: 'Ruang 5.1 (Gedung C Lt. 2)',
    kapasitas: 32,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 5'
  },
  {
    id: 'KLS-10',
    namaKelas: 'Kelas 5B',
    tingkat: '5',
    fase: 'Fase C',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Budi Santoso, S.Pd.',
    nipWaliKelas: '19901112 201804 1 002',
    ruangan: 'Ruang 5.2 (Gedung C Lt. 2)',
    kapasitas: 32,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 5'
  },
  {
    id: 'KLS-11',
    namaKelas: 'Kelas 6A',
    tingkat: '6',
    fase: 'Fase C',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Dra. Nurhayati',
    nipWaliKelas: '19681205 199103 2 003',
    ruangan: 'Ruang 6.1 (Gedung C Lt. 2)',
    kapasitas: 30,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 6'
  },
  {
    id: 'KLS-12',
    namaKelas: 'Kelas 6B',
    tingkat: '6',
    fase: 'Fase C',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: 'Mansyur, S.Pd.',
    nipWaliKelas: '19850216 200902 1 003',
    ruangan: 'Ruang 6.2 (Gedung C Lt. 2)',
    kapasitas: 30,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: 'Rombel Kelas 6'
  }
];

export const initialSiswa: Siswa[] = [];

export const initialPresensi: PresensiHarian[] = [
  {
    id: 'PRS-01',
    tanggal: '2024-08-26',
    kelas: 'Kelas 1A',
    totalSiswa: 28,
    hadir: 27,
    sakit: 1,
    izin: 0,
    alpa: 0,
    catatanGuru: '1 siswa izin sakit demam (Aisyah Putri Azzahra).'
  },
  {
    id: 'PRS-02',
    tanggal: '2024-08-26',
    kelas: 'Kelas 4B',
    totalSiswa: 30,
    hadir: 29,
    sakit: 0,
    izin: 1,
    alpa: 0,
    catatanGuru: '1 siswa izin acara keluarga (Andi Muh. Raihan).'
  },
  {
    id: 'PRS-03',
    tanggal: '2024-08-26',
    kelas: 'Kelas 5A',
    totalSiswa: 29,
    hadir: 29,
    sakit: 0,
    izin: 0,
    alpa: 0,
    catatanGuru: 'Hadir lengkap 100%, pembelajaran proyek P5 berjalan lancar.'
  },
  {
    id: 'PRS-04',
    tanggal: '2024-08-26',
    kelas: 'Kelas 6A',
    totalSiswa: 31,
    hadir: 30,
    sakit: 1,
    izin: 0,
    alpa: 0,
    catatanGuru: 'Pelaksanaan asesmen diagnostik numerasi berlangsung tertib.'
  }
];

export const initialPrestasi: PrestasiSiswa[] = [
  {
    id: 'PRS-01',
    namaSiswa: 'Nabila Nur Syakira',
    kelas: 'Kelas 4B',
    namaLomba: 'Olimpiade Sains Nasional (OSN) Tingkat SD Bidang IPA',
    kategori: 'Akademik',
    tingkat: 'Kota Makassar',
    peringkat: 'Juara 1',
    tahun: '2024',
    penyelenggara: 'Dinas Pendidikan Kota Makassar',
    pembimbing: 'Muhammad Syahrir, S.Pd.'
  },
  {
    id: 'PRS-02',
    namaSiswa: 'Farel Azka Al-Ghifari',
    kelas: 'Kelas 5A',
    namaLomba: 'Festival Lomba Seni Siswa Nasional (FLS2N) - Tari Kreasi Tradisional Bugis-Makassar',
    kategori: 'Seni Budaya',
    tingkat: 'Provinsi Sulawesi Selatan',
    peringkat: 'Juara 2',
    tahun: '2024',
    penyelenggara: 'Balai Penjaminan Mutu Pendidikan (BPMP) Sulsel',
    pembimbing: 'Andi Nurhaliza, S.Pd., Gr.'
  },
  {
    id: 'PRS-03',
    namaSiswa: 'Muhammad Fadil Ramadhan & Tim',
    kelas: 'Kelas 1-3',
    namaLomba: 'Kejuaraan Futsal Usia Dini Pelajar Antar-SD Se-Kecamatan Mamajang',
    kategori: 'Olahraga',
    tingkat: 'Kecamatan',
    peringkat: 'Juara 1',
    tahun: '2024',
    penyelenggara: 'K3S Kecamatan Mamajang',
    pembimbing: 'Kurniawan Pratama, S.Pd.'
  },
  {
    id: 'PRS-04',
    namaSiswa: 'Zaskia Aurelia Maharani',
    kelas: 'Kelas 6A',
    namaLomba: 'Lomba Cerdas Cermat Keagamaan & Tahfidz Juz 30',
    kategori: 'Keagamaan',
    tingkat: 'Kota Makassar',
    peringkat: 'Juara Harapan 1',
    tahun: '2024',
    penyelenggara: 'Kemenag Kota Makassar',
    pembimbing: 'Sitti Fatimah, S.Pd.I'
  }
];

export const initialProgramKarakter: ProgramKarakter[] = [
  {
    id: 'PK-01',
    dimensi: 'Beriman & Bertakwa',
    namaKegiatan: 'Sholat Dhuha Berjamaah, Tadarrus Al-Quran & Kultum Pagi Jumat',
    jadwalRutin: 'Setiap Hari Jumat Pukul 07.00 - 08.00',
    sasaran: 'Seluruh Siswa Muslim (Siswa Non-Muslim pendalaman kitab bersama guru pendamping)',
    deskripsi: 'Membiasakan ibadah rutin, memupuk keheningan batin, doa bersama, dan pembentukan adab sopan santun.',
    evaluasiCapaian: 'Tercapai 98% kehadiran siswa tepat waktu dan terbiasa berwudhu mandiri.'
  },
  {
    id: 'PK-02',
    dimensi: 'Gotong Royong',
    namaKegiatan: 'Jumat Bersih & Peduli Lingkungan Kelas (Sipakainge Maspul)',
    jadwalRutin: 'Setiap Hari Jumat Pekan ke-2 & ke-4',
    sasaran: 'Kelas 1 sampai Kelas 6',
    deskripsi: 'Kerja bakti bersama membersihkan ruang kelas, menata pot bunga hias, dan membersihkan saluran air sekolah.',
    evaluasiCapaian: 'Tercipta rasa tanggung jawab bersama terhadap kebersihan fasilitas umum.'
  },
  {
    id: 'PK-03',
    dimensi: 'Berkebinekaan Global',
    namaKegiatan: 'Pentas Seni Budaya Nusantara & Hari Busana Adat',
    jadwalRutin: 'Setiap Peringatan Hari Besar Nasional & Akhir Semester',
    sasaran: 'Seluruh Warga Sekolah & Paguyuban Orang Tua',
    deskripsi: 'Menampilkan tari, musik daerah sulawesi selatan dan daerah nusantara, serta pameran kuliner tradisional khas Makassar.',
    evaluasiCapaian: 'Siswa saling menghargai perbedaan latar belakang suku, agama, dan budaya.'
  }
];

export const initialEkstrakurikuler: Ekstrakurikuler[] = [
  {
    id: 'EKS-01',
    namaEkskul: 'Gerakan Pramuka Gugus Depan Lanto',
    pembina: 'Kurniawan Pratama, S.Pd. & Muhammad Syahrir, S.Pd.',
    hariLatihan: 'Sabtu, Pukul 08.00 - 10.30 Wita',
    tempat: 'Lapangan Sekolah & Ruang Aula',
    jumlahAnggota: 120,
    prestasiTerbaru: 'Regu Teladan Lomba Tingkat II (LT-II) Kwarran Mamajang 2024'
  },
  {
    id: 'EKS-02',
    namaEkskul: 'Sanggar Seni Tari & Musik Tradisional Paduppa',
    pembina: 'Andi Nurhaliza, S.Pd., Gr.',
    hariLatihan: 'Kamis, Pukul 14.00 - 16.00 Wita',
    tempat: 'Panggung Terbuka Seni',
    jumlahAnggota: 35,
    prestasiTerbaru: 'Penyaji Tari Terbaik Pembukaan Festival Pelajar Kota Makassar'
  },
  {
    id: 'EKS-03',
    namaEkskul: 'Klub Olahraga Prestasi (Futsal, Bulutangkis, Atletik)',
    pembina: 'Kurniawan Pratama, S.Pd.',
    hariLatihan: 'Selasa & Kamis, Pukul 15.30 - 17.00 Wita',
    tempat: 'Lapangan Serbaguna',
    jumlahAnggota: 48,
    prestasiTerbaru: 'Juara 1 Futsal Mini Tingkat Pelajar Se-Kecamatan Mamajang'
  },
  {
    id: 'EKS-04',
    namaEkskul: 'Dokter Kecil & Palang Merah Remaja (PMR Mula)',
    pembina: 'Nurul Hidayah & Tim UKS Puskesmas Mamajang',
    hariLatihan: 'Rabu, Pukul 14.30 - 16.00 Wita',
    tempat: 'Ruang UKS Terpadu',
    jumlahAnggota: 28,
    prestasiTerbaru: 'UKS Teladan & Standar Higiene Sekolah Sehat Kota Makassar'
  }
];

export const initialMasalahSiswa: MasalahSiswa[] = [
  {
    id: 'MSH-01',
    tanggal: '2024-08-15',
    namaSiswa: 'Ahmad Raihan (Kelas 4B)',
    kelas: 'Kelas 4B',
    jenisKasus: 'Keterlambatan Berulang & Mengantuk di Jam Pertama',
    deskripsiMasalah: 'Siswa sering terlambat lebih dari 15 menit dan tampak mengantuk saat pelajaran matematika pagi.',
    tindakanPenanganan: 'Konseling pribadi wali kelas, wawancara santai mengenai pola tidur di rumah, dan koordinasi dengan orang tua murid.',
    guruPendamping: 'Muhammad Syahrir, S.Pd. (Wali Kelas)',
    keterlibatanOrtu: true,
    status: 'Selesai',
    hasilTindakLanjut: 'Orang tua menyepakati pembatasan gawai maksimal pukul 20.30 malam. Selama seminggu terakhir siswa hadir tepat pukul 06.50 Wita.'
  },
  {
    id: 'MSH-02',
    tanggal: '2024-08-22',
    namaSiswa: 'Daffa Rizky (Kelas 2A)',
    kelas: 'Kelas 2A',
    jenisKasus: 'Pertengkaran Berebut Alat Mewarnai saat Jam Seni',
    deskripsiMasalah: 'Terjadi perselisihan kecil saat meminjam krayon pewarna dengan teman sebangku.',
    tindakanPenanganan: 'Mediasi dengan metode Restitusi Pembelajaran Sosial Emosional (PSE). Mengajak siswa merefleksikan nilai berbagi dan meminta maaf secara tulus.',
    guruPendamping: 'Andi Nurhaliza, S.Pd., Gr.',
    keterlibatanOrtu: false,
    status: 'Selesai',
    hasilTindakLanjut: 'Kedua siswa kembali rukun dan saling meminjamkan alat tulis dengan tertib.'
  }
];

export const initialSupervisiAkademik: SupervisiAkademik[] = [
  {
    id: 'SUP-AKD-01',
    namaGuru: 'Andi Nurhaliza, S.Pd., Gr.',
    nip: '19920814 201903 2 011',
    mataPelajaran: 'Bahasa Indonesia (Fase A)',
    kelas: 'Kelas 1A',
    jadwalTanggal: '2024-08-20',
    jamKe: 'Jam ke 2 - 3 (08.00 - 09.20)',
    supervisor: 'Dra. Hj. Rosdiana, M.Pd.',
    kesiapanModulAjar: 95,
    kesiapanMedia: 92,
    kesiapanAsesmen: 90,
    catatanPraObservasi: 'Modul ajar lengkap berbasis pembelajaran berdiferensiasi visual dan kinestetik. Media kartu kata dan papan pintar sangat siap.',
    skorApersepsi: 95,
    skorPenguasaanMateri: 94,
    skorPendekatanBerdiferensiasi: 92,
    skorInteraksiSiswa: 96,
    skorPemanfaatanTeknologi: 88,
    skorAsesmenFormatif: 93,
    totalSkor: 93,
    kategoriNilai: 'Amat Baik',
    umpanBalik: 'Pengelolaan kelas sangat hidup dan hangat. Guru sangat sabar membimbing anak yang belum lancar mengeja suku kata.',
    kelebihan: 'Penggunaan media konkret kartu bergambar sangat menarik perhatian anak.',
    areaPeningkatan: 'Bisa ditambahkan ice-breaking pendek di pertengahan sesi untuk menjaga stamina konsentrasi anak kelas 1.',
    tindakLanjut: 'Berbagi praktik baik dalam forum KKG Gugus Mamajang tentang strategi membaca permulaan menyenangkan.',
    status: 'Tuntas Ditindaklanjuti'
  },
  {
    id: 'SUP-AKD-02',
    namaGuru: 'Muhammad Syahrir, S.Pd.',
    nip: '19880320 201402 1 005',
    mataPelajaran: 'Matematika - Pengukuran Luas (Fase B)',
    kelas: 'Kelas 4B',
    jadwalTanggal: '2024-08-22',
    jamKe: 'Jam ke 4 - 5 (09.45 - 11.05)',
    supervisor: 'Dra. Hj. Rosdiana, M.Pd.',
    kesiapanModulAjar: 90,
    kesiapanMedia: 88,
    kesiapanAsesmen: 86,
    catatanPraObservasi: 'LKPD kelompok terstruktur, alat peraga ubin persegi satuan disiapkan.',
    skorApersepsi: 90,
    skorPenguasaanMateri: 92,
    skorPendekatanBerdiferensiasi: 88,
    skorInteraksiSiswa: 90,
    skorPemanfaatanTeknologi: 85,
    skorAsesmenFormatif: 89,
    totalSkor: 89,
    kategoriNilai: 'Baik',
    umpanBalik: 'Pembelajaran kontekstual menghubungkan luas meja dengan bangun datar.',
    kelebihan: 'Instruksi tugas kelompok jelas dan mendorong kolaborasi antaranggota.',
    areaPeningkatan: 'Tindak lanjut asesmen formatif bagi siswa berkemampuan tinggi perlu pengayaan soal kontekstual lebih menantang.',
    tindakLanjut: 'Mengembangkan bank soal HOTS numerasi dan berbagi di komunitas belajar sekolah.',
    status: 'Observasi Selesai'
  }
];

export const DEFAULT_5_KOMPONEN_OBSERVASI: ItemObservasi5Komponen[] = [
  {
    id: 1,
    nomor: 1,
    aspekDanStrategi: 'Menerapkan pembelajaran diferensiasi untuk memenuhi kebutuhan belajar siswa yang beragam, yang meliputi diferensiasi konten,proses dan produk',
    ada: true,
    catatanPengamatan: 'Observee terlihat sudah menerapkan pembelajaran diferensiasi yang meliputi diferensiasi konten,proses, dan produk untuk memenuhi kebutuhan belajar murid yang beraneka ragam.',
    catatanReferensiDefault: 'Observee terlihat sudah menerapkan pembelajaran diferensiasi yang meliputi diferensiasi konten,proses, dan produk untuk memenuhi kebutuhan belajar murid yang beraneka ragam.'
  },
  {
    id: 2,
    nomor: 2,
    aspekDanStrategi: 'Menggunakan alat peraga gambar kegiatan,video,kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.',
    ada: true,
    catatanPengamatan: 'Observee menggunakan alat peraga gambar,video, kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.',
    catatanReferensiDefault: 'Observee menggunakan alat peraga gambar,video, kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.'
  },
  {
    id: 3,
    nomor: 3,
    aspekDanStrategi: 'Memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa',
    ada: true,
    catatanPengamatan: 'Observee terlihat memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa tentang kegiatan peran dan tugas anak dan orang tua',
    catatanReferensiDefault: 'Observee terlihat memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa tentang kegiatan peran dan tugas anak dan orang tua'
  },
  {
    id: 4,
    nomor: 4,
    aspekDanStrategi: 'Mendampingi dan memberikan bimbingan kepada setiap kelompok untuk menghasilkan produk ( gambar,bermain peran )',
    ada: true,
    catatanPengamatan: 'Saat penugasan kelompok terlihat observe mendampingi dan memberikan masukan/bimbingan kepada setiap kelompok',
    catatanReferensiDefault: 'Saat penugasan kelompok terlihat observe mendampingi dan memberikan masukan/bimbingan kepada setiap kelompok'
  },
  {
    id: 5,
    nomor: 5,
    aspekDanStrategi: 'Metode yang digunakan ceramah,Tanya jawab, demonstrasi, diskusi, mengamati video/gambar,menggunakan pendekatan saintifik ( mengamati video/gambar,menanya,mengumpulkan informasi ( diskusi kelompok ), mengasosiasi data ( mengolah data ) dan mengkomunikasikan ( mempresentasikan hasil diskusi di depan kelas ).',
    ada: true,
    catatanPengamatan: 'Observee menggunakan metode yang bervariasi dan menggunakan pendekatan saintifik saat sedang melaksanakan KBM',
    catatanReferensiDefault: 'Observee menggunakan metode yang bervariasi dan menggunakan pendekatan saintifik saat sedang melaksanakan KBM'
  }
];

export const DEFAULT_CATATAN_TAMBAHAN_OBSERVASI = `Kegiatan pembelajaran tentang materi Tugas dan Peran dalam Kegiatan Bersama yang telah diterapkan observe sudah menerapkan pembelajaran berdiferensiasi yaitu diferensiasi konten,proses dan produk sehingga terlihat pembelajaran yang berpihak pada murid,dan menyenangkan. Dengan penerapan pembelajaran berdiferensiasi ini murid bias menemukan konsepnya dan lebih bersemangat serta aktif sesuai dengan minat dan potensinya.`;

export const initialFormulirSupervisi: FormulirSupervisiLengkap[] = [
  {
    id: 'FORM-SUP-01',
    hariTanggal: 'Selasa, 26 September 2023',
    sekolah: 'UPTD SPF SDN Lanto Dg. Pasewang',
    namaGuru: 'Salafi Artika Dini, S.Pd',
    nipGuru: '198805142019032008',
    mataPelajaran: 'PKN',
    kelas: '2 ( Dua )',
    waktuPercakapan: '10.00 – 10.15 ( 15 menit )',
    namaSupervisor: 'Dra. Hj. Rosdiana, M.Pd.',
    nipSupervisor: '19700412 199303 2 004',
    tahapAktif: 'observasi',
    praObservasi: {
      tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi serta menceritakan tugas dan peran anggota keluarga dalam kegiatan bersama di rumah dan di sekolah.',
      aspekPengembangan: 'Penerapan pembelajaran berdiferensiasi (konten, proses, produk) dan penguatan media visual interaktif.',
      strategiPembelajaran: 'Pendekatan saintifik berpusat pada murid melalui diskusi kelompok kecil, tayangan video studi kasus, dan kartu peran.',
      kesiapanModulAjar: true,
      kesiapanMediaAjar: true,
      kesiapanInstrumenAsesmen: true,
      catatanPraObservasi: 'Guru telah menyusun modul ajar lengkap dengan asesmen diagnostik dan formatif. Media kartu peran dan proyektor siap digunakan.',
      catatanReferensiDefault: 'Guru telah menyusun modul ajar lengkap dengan asesmen diagnostik dan formatif. Media kartu peran dan proyektor siap digunakan.'
    },
    observasi: {
      areaObservasi: [
        {
          id: 1,
          nomor: 1,
          aspekDanStrategi: 'Menerapkan pembelajaran diferensiasi untuk memenuhi kebutuhan belajar siswa yang beragam, yang meliputi diferensiasi konten,proses dan produk',
          ada: true,
          catatanPengamatan: 'Observee terlihat sudah menerapkan pembelajaran diferensiasi yang meliputi diferensiasi konten,proses, dan produk untuk memenuhi kebutuhan belajar murid yang beraneka ragam.',
          catatanReferensiDefault: 'Observee terlihat sudah menerapkan pembelajaran diferensiasi yang meliputi diferensiasi konten,proses, dan produk untuk memenuhi kebutuhan belajar murid yang beraneka ragam.'
        },
        {
          id: 2,
          nomor: 2,
          aspekDanStrategi: 'Menggunakan alat peraga gambar kegiatan,video,kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.',
          ada: true,
          catatanPengamatan: 'Observee menggunakan alat peraga gambar,video, kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.',
          catatanReferensiDefault: 'Observee menggunakan alat peraga gambar,video, kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.'
        },
        {
          id: 3,
          nomor: 3,
          aspekDanStrategi: 'Memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa',
          ada: true,
          catatanPengamatan: 'Observee terlihat memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa tentang kegiatan peran dan tugas anak dan orang tua',
          catatanReferensiDefault: 'Observee terlihat memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa tentang kegiatan peran dan tugas anak dan orang tua'
        },
        {
          id: 4,
          nomor: 4,
          aspekDanStrategi: 'Mendampingi dan memberikan bimbingan kepada setiap kelompok untuk menghasilkan produk ( gambar,bermain peran )',
          ada: true,
          catatanPengamatan: 'Saat penugasan kelompok terlihat observe mendampingi dan memberikan masukan/bimbingan kepada setiap kelompok',
          catatanReferensiDefault: 'Saat penugasan kelompok terlihat observe mendampingi dan memberikan masukan/bimbingan kepada setiap kelompok'
        },
        {
          id: 5,
          nomor: 5,
          aspekDanStrategi: 'Metode yang digunakan ceramah,Tanya jawab, demonstrasi, diskusi, mengamati video/gambar,menggunakan pendekatan saintifik ( mengamati video/gambar,menanya,mengumpulkan informasi ( diskusi kelompok ), mengasosiasi data ( mengolah data ) dan mengkomunikasikan ( mempresentasikan hasil diskusi di depan kelas ).',
          ada: true,
          catatanPengamatan: 'Observee menggunakan metode yang bervariasi dan menggunakan pendekatan saintifik saat sedang melaksanakan KBM',
          catatanReferensiDefault: 'Observee menggunakan metode yang bervariasi dan menggunakan pendekatan saintifik saat sedang melaksanakan KBM'
        }
      ],
      catatanTambahan: 'Kegiatan pembelajaran tentang materi Tugas dan Peran dalam Kegiatan Bersama yang telah diterapkan observe sudah menerapkan pembelajaran berdiferensiasi yaitu diferensiasi konten,proses dan produk sehingga terlihat pembelajaran yang berpihak pada murid,dan menyenangkan. Dengan penerapan pembelajaran berdiferensiasi ini murid bias menemukan konsepnya dan lebih bersemangat serta aktif sesuai dengan minat dan potensinya.',
      catatanTambahanReferensiDefault: 'Kegiatan pembelajaran tentang materi Tugas dan Peran dalam Kegiatan Bersama yang telah diterapkan observe sudah menerapkan pembelajaran berdiferensiasi yaitu diferensiasi konten,proses dan produk sehingga terlihat pembelajaran yang berpihak pada murid,dan menyenangkan. Dengan penerapan pembelajaran berdiferensiasi ini murid bias menemukan konsepnya dan lebih bersemangat serta aktif sesuai dengan minat dan potensinya.',
      skorKelayakanPersen: 100,
      kategoriHasil: 'Sangat Baik'
    },
    pascaObservasi: {
      refleksiGuru: 'Saya merasa sangat senang karena siswa antusias bermain peran. Sebagian kecil siswa pemalu membutuhkan dorongan ekstra saat presentasi kelompok.',
      ketercapaianTujuan: 'Sebesar 92% peserta didik telah mencapai kriteria ketercapaian tujuan pembelajaran (KKTP) dengan mampu mengelompokkan peran keluarga dan sekolah.',
      umpanBalikSupervisor: 'Apresiasi tinggi atas pelaksanaan pembelajaran diferensiasi yang kontekstual dan interaktif. Penguasaan kelas sangat prima.',
      rencanaTindakLanjut: 'Pengembangan variasi lembar kerja siswa (LKS) bergambar untuk memperkaya asesmen formatif berkelanjutan.',
      komitmenWaktu: 'Pekan ke-2 Oktober 2023',
      sasaranPerbaikan: 'Meningkatkan kepercayaan diri seluruh peserta didik saat unjuk kerja presentasi di depan kelas.',
      rekomendasiAkhir: 'Pertahankan praktik baik pembelajaran berdiferensiasi dan bagikan pengalaman ini di Komunitas Belajar (Kombel) Guru.',
      catatanReferensiDefault: 'Pertahankan praktik baik pembelajaran berdiferensiasi dan bagikan pengalaman ini di Komunitas Belajar (Kombel) Guru.'
    },
    sinkronKeManajerial: true,
    manajerialRefId: 'SUP-MAN-03',
    statusDokumen: 'Disahkan',
    createdAt: '2023-09-26',
    updatedAt: '2023-09-26'
  },
  {
    id: 'FORM-SUP-02',
    hariTanggal: 'Kamis, 15 Agustus 2024',
    sekolah: 'UPTD SPF SDN Lanto Dg. Pasewang',
    namaGuru: 'H. Muhammad Idris, S.Pd., M.Pd.',
    nipGuru: '197806152005021003',
    mataPelajaran: 'IPAS (Fase C)',
    kelas: 'Kelas 5A',
    waktuPercakapan: '08.00 – 09.30 (90 menit)',
    namaSupervisor: 'Dra. Hj. Rosdiana, M.Pd.',
    nipSupervisor: '197004121993032004',
    tahapAktif: 'ringkasan',
    praObservasi: {
      tujuanPembelajaran: 'Siswa dapat menganalisis organ pencernaan manusia dan fungsinya melalui simulasi interaktif digital.',
      aspekPengembangan: 'Integrasi teknologi interaktif (Chromebook & Canva) dan diferensiasi produk tugas kelompok.',
      strategiPembelajaran: 'Model Problem-Based Learning (PBL) berbantuan media interaktif dan diskusi kelompok kolaboratif.',
      kesiapanModulAjar: true,
      kesiapanMediaAjar: true,
      kesiapanInstrumenAsesmen: true,
      catatanPraObservasi: 'Perangkat ajar dan sarana Chromebook laboratorium siap 100%. Rubrik penilaian kolaborasi kelompok telah tersedia.',
      catatanReferensiDefault: 'Perangkat ajar dan sarana Chromebook laboratorium siap 100%. Rubrik penilaian kolaborasi kelompok telah tersedia.'
    },
    observasi: {
      areaObservasi: [
        {
          id: 1,
          nomor: 1,
          aspekDanStrategi: 'Menerapkan pembelajaran diferensiasi untuk memenuhi kebutuhan belajar siswa yang beragam, yang meliputi diferensiasi konten,proses dan produk',
          ada: true,
          catatanPengamatan: 'Observee menyajikan variasi konten berupa infografis, video simulasi 3D, dan kartu tugas fisik untuk memfasilitasi ragam gaya belajar.',
          catatanReferensiDefault: 'Observee terlihat sudah menerapkan pembelajaran diferensiasi yang meliputi diferensiasi konten,proses, dan produk untuk memenuhi kebutuhan belajar murid yang beraneka ragam.'
        },
        {
          id: 2,
          nomor: 2,
          aspekDanStrategi: 'Menggunakan alat peraga gambar kegiatan,video,kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.',
          ada: true,
          catatanPengamatan: 'Observee menggunakan Chromebook interaktif, poster anatomi tubuh manusia, dan video organ pencernaan.',
          catatanReferensiDefault: 'Observee menggunakan alat peraga gambar,video, kartu kegiatan peran dan tugas anak dan orang tua di sekolah dan di rumah.'
        },
        {
          id: 3,
          nomor: 3,
          aspekDanStrategi: 'Memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa',
          ada: true,
          catatanPengamatan: 'Observee memfasilitasi pembentukan kelompok berdasarkan minat minat pembuatan produk (poster digital, mind map, atau rekaman presentasi).',
          catatanReferensiDefault: 'Observee terlihat memberikan kebebasan kepada siswa dalam membentuk kelompoknya sesuai minat dan pemahaman siswa tentang kegiatan peran dan tugas anak dan orang tua'
        },
        {
          id: 4,
          nomor: 4,
          aspekDanStrategi: 'Mendampingi dan memberikan bimbingan kepada setiap kelompok untuk menghasilkan produk ( gambar,bermain peran )',
          ada: true,
          catatanPengamatan: 'Observee berkeliling aktif memberikan bimbingan scaffolding secara terarah pada kelompok yang mengalami kesulitan analisis fungsi enzim.',
          catatanReferensiDefault: 'Saat penugasan kelompok terlihat observe mendampingi dan memberikan masukan/bimbingan kepada setiap kelompok'
        },
        {
          id: 5,
          nomor: 5,
          aspekDanStrategi: 'Metode yang digunakan ceramah,Tanya jawab, demonstrasi, diskusi, mengamati video/gambar,menggunakan pendekatan saintifik ( mengamati video/gambar,menanya,mengumpulkan informasi ( diskusi kelompok ), mengasosiasi data ( mengolah data ) dan mengkomunikasikan ( mempresentasikan hasil diskusi di depan kelas ).',
          ada: true,
          catatanPengamatan: 'Observee mengelola tahapan 5M (mengamati, menanya, mencoba, menalar, mengomunikasikan) secara dinamis dan antusias.',
          catatanReferensiDefault: 'Observee menggunakan metode yang bervariasi dan menggunakan pendekatan saintifik saat sedang melaksanakan KBM'
        }
      ],
      catatanTambahan: 'Pembelajaran di kelas 5A berlangsung sangat kondusif, interaktif, dan menggembirakan. Murid sangat antusias menggunakan media digital untuk mempresentasikan hasil karya kelompok.',
      catatanTambahanReferensiDefault: 'Kegiatan pembelajaran tentang materi Tugas dan Peran dalam Kegiatan Bersama yang telah diterapkan observe sudah menerapkan pembelajaran berdiferensiasi yaitu diferensiasi konten,proses dan produk sehingga terlihat pembelajaran yang berpihak pada murid,dan menyenangkan. Dengan penerapan pembelajaran berdiferensiasi ini murid bias menemukan konsepnya dan lebih bersemangat serta aktif sesuai dengan minat dan potensinya.',
      skorKelayakanPersen: 100,
      kategoriHasil: 'Sangat Baik'
    },
    pascaObservasi: {
      refleksiGuru: 'Penggunaan media digital membuat siswa lebih fokus dan aktif bereksplorasi. Waktu presentasi kelompok sedikit melebihi estimasi awal.',
      ketercapaianTujuan: '95% siswa memperoleh nilai asesmen formatif di atas KKTP (Kriteria Ketercapaian Tujuan Pembelajaran).',
      umpanBalikSupervisor: 'Sangat mengapresiasi inovasi pembelajaran berbasis digitalisasi dan diferensiasi. Terus pertahankan budaya pembelajaran positif.',
      rencanaTindakLanjut: 'Diseminasi praktik baik pemanfaatan Canva Education untuk pembelajaran IPA di KKG Gugus.',
      komitmenWaktu: 'Bulan September 2024',
      sasaranPerbaikan: 'Manajemen alokasi waktu presentasi kelompok agar lebih presisi.',
      rekomendasiAkhir: 'Direkomendasikan sebagai fasilitator praktik baik pembelajaran berdiferensiasi tingkat gugus sekolah.',
      catatanReferensiDefault: 'Pertahankan praktik baik pembelajaran berdiferensiasi dan bagikan pengalaman ini di Komunitas Belajar (Kombel) Guru.'
    },
    sinkronKeManajerial: true,
    manajerialRefId: 'SUP-MAN-04',
    statusDokumen: 'Disahkan',
    createdAt: '2024-08-15',
    updatedAt: '2024-08-15'
  }
];

export const initialSupervisiManajerial: SupervisiManajerial[] = [
  {
    id: 'SUP-MAN-01',
    aspekStandar: 'Standar Pengelolaan',
    instrumen: 'Instrumen Kelengkapan Dokumen KSP, RKT, dan RKAS Tahun 2024/2025',
    tanggalPemantauan: '2024-07-29',
    petugasPemantau: 'Drs. H. Mappanyukki, M.Pd. (Pengawas Pembina Disdik Kota Makassar)',
    hasilTemuan: 'Seluruh dokumen perencanaan sekolah telah disusun lengkap melalui musyawarah dewan guru, komite sekolah, dan berbasis Rapor Pendidikan.',
    evaluasiProgram: 'Keterlibatan komite sekolah sangat aktif dan mendukung penuh program adiwiyata serta digitalisasi data sekolah.',
    rekomendasiTindakLanjut: 'Lanjutkan implementasi monitoring berkala tiap triwulan.',
    status: 'Sesuai Standar'
  },
  {
    id: 'SUP-MAN-02',
    aspekStandar: 'Standar Sarpras',
    instrumen: 'Pemantauan Kelayakan Sanitasi, Toilet Ramah Anak, dan Ruang Perpustakaan',
    tanggalPemantauan: '2024-08-08',
    petugasPemantau: 'Tim Monitoring Sarpras Dinas Pendidikan Kota Makassar',
    hasilTemuan: 'Toilet terpisah laki-laki/perempuan dalam kondisi bersih dan air mengalir lancar. Terdapat 2 kran wastafel yang butuh penggantian seal karet.',
    evaluasiProgram: 'Kebersihan terjaga dengan baik berkat piket bergilir dan kesadaran warga sekolah.',
    rekomendasiTindakLanjut: 'Perbaikan 2 kran wastafel telah dialokasikan melalui dana pemeliharaan BOSP.',
    status: 'Perlu Perbaikan'
  },
  {
    id: 'SUP-MAN-03',
    aspekStandar: 'Standar Proses',
    instrumen: 'Instrumen 3 Formulir Observasi Kelas 5 Komponen (Salafi Artika Dini, S.Pd - PKN)',
    tanggalPemantauan: '2023-09-26',
    petugasPemantau: 'Dra. Hj. Rosdiana, M.Pd. (Kepala Sekolah)',
    hasilTemuan: '[Observasi Sangat Baik] 5/5 Komponen Terpenuhi. Menerapkan pembelajaran berdiferensiasi (konten, proses, produk) yang berpihak pada murid dan menyenangkan.',
    evaluasiProgram: 'Pra-Observasi: Peserta didik mengidentifikasi tugas peran | Pasca: 92% siswa mencapai KKTP.',
    rekomendasiTindakLanjut: 'Pertahankan praktik baik pembelajaran berdiferensiasi dan bagikan di Komunitas Belajar Kombel Guru.',
    status: 'Sesuai Standar',
    formulirSupervisiId: 'FORM-SUP-01'
  },
  {
    id: 'SUP-MAN-04',
    aspekStandar: 'Standar Proses',
    instrumen: 'Instrumen 3 Formulir Observasi Kelas 5 Komponen (H. Muhammad Idris, S.Pd., M.Pd. - IPAS)',
    tanggalPemantauan: '2024-08-15',
    petugasPemantau: 'Dra. Hj. Rosdiana, M.Pd. (Kepala Sekolah)',
    hasilTemuan: '[Observasi Sangat Baik] 5/5 Komponen Terpenuhi. Pemanfaatan Chromebook dan video 3D dalam pembelajaran berdiferensiasi sangat efektif.',
    evaluasiProgram: 'Pra-Observasi: Simulasi organ pencernaan | Pasca: 95% siswa di atas KKTP.',
    rekomendasiTindakLanjut: 'Diseminasi praktik baik pemanfaatan Canva Education untuk pembelajaran IPA di KKG Gugus.',
    status: 'Sesuai Standar',
    formulirSupervisiId: 'FORM-SUP-02'
  }
];

export const initialRKAS: ItemRKAS[] = [
  {
    id: 'RKAS-01',
    kodeRekening: '5.1.02.01.01.0024',
    uraianKegiatan: 'Pengadaan Buku Teks Utama & Pendukung Kurikulum Merdeka Fase A & B',
    komponenBOS: 'Pengembangan Perpustakaan',
    sumberDana: 'BOS Reguler',
    anggaranTotal: 42000000,
    realisasiTotal: 38500000,
    sisaAnggaran: 3500000,
    status: 'Dalam Proses',
    triwulan: 'Triwulan 3'
  },
  {
    id: 'RKAS-02',
    kodeRekening: '5.1.02.02.01.0003',
    uraianKegiatan: 'Honorarium Guru Tidak Tetap (GTT) & Tenaga Kependidikan Honorer',
    komponenBOS: 'Pembayaran Honor',
    sumberDana: 'BOS Reguler',
    anggaranTotal: 84000000,
    realisasiTotal: 56000000,
    sisaAnggaran: 28000000,
    status: 'Dalam Proses',
    triwulan: 'Triwulan 3'
  },
  {
    id: 'RKAS-03',
    kodeRekening: '5.1.02.03.01.0010',
    uraianKegiatan: 'Pemeliharaan Sarana Gedung, Sanitasi Toilet, dan Instalasi Listrik/Air',
    komponenBOS: 'Pemeliharaan Sarpras',
    sumberDana: 'BOS Reguler',
    anggaranTotal: 35000000,
    realisasiTotal: 22400000,
    sisaAnggaran: 12600000,
    status: 'Dalam Proses',
    triwulan: 'Triwulan 2'
  },
  {
    id: 'RKAS-04',
    kodeRekening: '5.1.02.01.01.0055',
    uraianKegiatan: 'Kegiatan Pembelajaran & Ekstrakurikuler Siswa (Pramuka, UKS, Seni, Olahraga)',
    komponenBOS: 'Kegiatan Kesiswaan',
    sumberDana: 'BOS Reguler',
    anggaranTotal: 28000000,
    realisasiTotal: 19500000,
    sisaAnggaran: 8500000,
    status: 'Dalam Proses',
    triwulan: 'Triwulan 3'
  },
  {
    id: 'RKAS-05',
    kodeRekening: '5.1.02.02.08.0012',
    uraianKegiatan: 'Langganan Daya & Jasa Internet Dedicated Sekolah 100 Mbps',
    komponenBOS: 'Langganan Daya & Jasa',
    sumberDana: 'BOS Reguler',
    anggaranTotal: 18000000,
    realisasiTotal: 12000000,
    sisaAnggaran: 6000000,
    status: 'Dalam Proses',
    triwulan: 'Triwulan 3'
  }
];

export const initialTransaksi: TransaksiKeuangan[] = [
  {
    id: 'TRX-01',
    tanggal: '2024-07-15',
    noBukti: 'BOS-REG/IN-01/VII/2024',
    jenis: 'Pemasukan',
    uraian: 'Penyaluran Dana BOSP Reguler Tahap II Gelombang 1 Tahun 2024 dari Kasda',
    kategori: 'Penerimaan Dana',
    nominal: 164250000,
    penerimaPenyetor: 'Kemendikbudristek / BPKAD Kota Makassar',
    penanggungJawab: 'Dra. Hj. Rosdiana, M.Pd. / Nurul Hidayah',
    statusVerifikasi: 'Terverifikasi Bendahara'
  },
  {
    id: 'TRX-02',
    tanggal: '2024-08-05',
    noBukti: 'BOS-REG/OUT-12/VIII/2024',
    jenis: 'Pengeluaran',
    uraian: 'Pembayaran Pemesanan Buku Teks Kurikulum Merdeka Penerbit Erlangga (SIPLah)',
    kategori: 'Perpustakaan',
    nominal: 18750000,
    penerimaPenyetor: 'PT Penerbit Erlangga Makassar',
    penanggungJawab: 'Nurul Hidayah (Bendahara BOS)',
    statusVerifikasi: 'Terverifikasi Bendahara'
  },
  {
    id: 'TRX-03',
    tanggal: '2024-08-10',
    noBukti: 'BOS-REG/OUT-13/VIII/2024',
    jenis: 'Pengeluaran',
    uraian: 'Biaya Konsumsi & Fasilitasi Lomba Seleksi O2SN & FLS2N Tingkat Gugus',
    kategori: 'Kegiatan Kesiswaan',
    nominal: 3450000,
    penerimaPenyetor: 'Catering Mawar Makassar',
    penanggungJawab: 'Kurniawan Pratama, S.Pd.',
    statusVerifikasi: 'Terverifikasi Bendahara'
  },
  {
    id: 'TRX-04',
    tanggal: '2024-08-18',
    noBukti: 'BOS-REG/OUT-14/VIII/2024',
    jenis: 'Pengeluaran',
    uraian: 'Pembelian Cat Tembok, Kuas, dan Perbaikan Kran Wastafel Lingkungan Sekolah',
    kategori: 'Sarpras',
    nominal: 2850000,
    penerimaPenyetor: 'Toko Bangunan Rezky Mamajang',
    penanggungJawab: 'Nurul Hidayah',
    statusVerifikasi: 'Terverifikasi Bendahara'
  }
];

export const initialSarpras: ItemSarpras[] = [
  {
    id: 'SAR-01',
    kodeBarang: 'INV-RNG-01',
    namaBarang: 'Ruang Kelas Pembelajaran (Kelas 1A s/d 6B)',
    kategori: 'Ruang/Gedung',
    lokasi: 'Gedung Utama Lt. 1 & Lt. 2',
    jumlah: 12,
    satuan: 'Ruang',
    kondisiBaik: 10,
    kondisiRusakRingan: 2,
    kondisiRusakBerat: 0,
    tahunPerolehan: 2018,
    sumberDana: 'APBD / DAK Fisik',
    nilaiAsetPerolehan: 720000000,
    keterangan: '2 ruang kelas butuh pengecatan ulang plafon.'
  },
  {
    id: 'SAR-02',
    kodeBarang: 'INV-IT-02',
    namaBarang: 'Laptop Chromebook Bantuan Kemendikbudristek',
    kategori: 'Elektronik & IT',
    lokasi: 'Laboratorium Komputer & ANBK',
    jumlah: 30,
    satuan: 'Unit',
    kondisiBaik: 28,
    kondisiRusakRingan: 2,
    kondisiRusakBerat: 0,
    tahunPerolehan: 2022,
    sumberDana: 'DAK Fisik Kemendikbud',
    nilaiAsetPerolehan: 150000000,
    keterangan: 'Digunakan untuk simulasi ANBK, pembelajaran coding dasar, dan PBD.'
  },
  {
    id: 'SAR-03',
    kodeBarang: 'INV-IT-03',
    namaBarang: 'Proyektor LCD Epson EB-X500 & Layar Tripod',
    kategori: 'Elektronik & IT',
    lokasi: 'Ruang Media & Kelas Digital',
    jumlah: 6,
    satuan: 'Unit',
    kondisiBaik: 5,
    kondisiRusakRingan: 1,
    kondisiRusakBerat: 0,
    tahunPerolehan: 2021,
    sumberDana: 'BOS Reguler',
    nilaiAsetPerolehan: 36000000,
    keterangan: '1 unit butuh penggantian lampu proyektor.'
  },
  {
    id: 'SAR-04',
    kodeBarang: 'INV-MBL-04',
    namaBarang: 'Meja dan Kursi Siswa Kayu Solid Ramah Anak',
    kategori: 'Mebelair',
    lokasi: 'Seluruh Ruang Kelas',
    jumlah: 360,
    satuan: 'Set',
    kondisiBaik: 330,
    kondisiRusakRingan: 30,
    kondisiRusakBerat: 0,
    tahunPerolehan: 2020,
    sumberDana: 'BOS Reguler & APBD',
    nilaiAsetPerolehan: 180000000,
    keterangan: 'Pemeriksaan baut dan pernis berkala tiap semester.'
  },
  {
    id: 'SAR-05',
    kodeBarang: 'INV-LIB-05',
    namaBarang: 'Koleksi Buku Perpustakaan & Rak Buku Kayu Jati',
    kategori: 'Buku & Literasi',
    lokasi: 'Perpustakaan Lanto Pintar',
    jumlah: 1850,
    satuan: 'Buah',
    kondisiBaik: 1780,
    kondisiRusakRingan: 70,
    kondisiRusakBerat: 0,
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    nilaiAsetPerolehan: 55000000,
    keterangan: 'Tersedia pojok baca digital dan buku cerita fiksi anak.'
  }
];

export const initialPemeliharaan: PemeliharaanSarpras[] = [
  {
    id: 'MNT-01',
    namaBarang: 'Perbaikan Instalasi Air & Sanitasi Wastafel Murid',
    lokasi: 'Selasar Depan Kelas 1-3',
    jenisKerusakan: 'Kran bocor dan sambungan pipa pipa PVC aus',
    usulanPerbaikan: 'Penggantian 4 unit kran kuningan putar awet & lem pipa',
    biayaEstimasi: 650000,
    tanggalMulai: '2024-08-19',
    tanggalSelesai: '2024-08-20',
    pelaksana: 'Tukang Servis Mandiri / Staf Sarpras',
    status: 'Selesai'
  },
  {
    id: 'MNT-02',
    namaBarang: 'Servis Berkala & Cuci AC Ruang Guru dan Lab Komputer',
    lokasi: 'Ruang Guru & Lab Komputer',
    jenisKerusakan: 'Pendinginan kurang maksimal karena filter berdebu',
    usulanPerbaikan: 'Pembersihan evaporator, filter, dan cek freon',
    biayaEstimasi: 1200000,
    tanggalMulai: '2024-08-28',
    tanggalSelesai: '2024-08-29',
    pelaksana: 'CV Berkah Teknik Makassar',
    status: 'Disetujui'
  }
];

export const initialPeminjaman: PeminjamanSarpras[] = [
  {
    id: 'PINJ-01',
    namaPeminjam: 'Andi Nurhaliza, S.Pd., Gr.',
    kontak: '085299443322',
    namaBarang: 'Proyektor LCD Epson + Sound Portable',
    jumlah: 1,
    tanggalPinjam: '2024-08-26',
    tanggalKembaliEstimasi: '2024-08-26',
    tanggalKembaliRealisasi: '2024-08-26',
    keperluan: 'Presentasi Proyek Penguatan Profil Pelajar Pancasila (P5) Kelas 1',
    status: 'Dikembalikan'
  },
  {
    id: 'PINJ-02',
    namaPeminjam: 'Muhammad Syahrir, S.Pd.',
    kontak: '082188776655',
    namaBarang: 'Laptop Chromebook Murid',
    jumlah: 15,
    tanggalPinjam: '2024-08-27',
    tanggalKembaliEstimasi: '2024-08-27',
    keperluan: 'Simulasi Mandiri Asesmen Literasi Numerasi Kelas 4B',
    status: 'Dipinjam'
  }
];

export const initialAgendaKS: AgendaHarianKS[] = [
  {
    id: 'AGD-01',
    tanggal: '2024-08-27',
    waktu: '07.00 - 08.00 Wita',
    kegiatan: 'Menyambut kehadiran peserta didik di gerbang sekolah (Program 5S Budaya Tabik)',
    lokasi: 'Gerbang Utama Sekolah',
    pihakTerlibat: 'Guru Piket Harian & Satpam Sekolah',
    outputHasil: 'Kedisiplinan siswa terpantau prima, 99% tiba sebelum pukul 07.10.',
    status: 'Terlaksana'
  },
  {
    id: 'AGD-02',
    tanggal: '2024-08-27',
    waktu: '09.00 - 11.30 Wita',
    kegiatan: 'Supervisi Akademik Pembelajaran Berdiferensiasi di Kelas 5A',
    lokasi: 'Ruang Kelas 5A',
    pihakTerlibat: 'Guru Kelas 5A & Kepala Sekolah',
    outputHasil: 'Instrumen observasi terisi lengkap, refleksi pedagogik tersampaikan.',
    status: 'Terlaksana'
  },
  {
    id: 'AGD-03',
    tanggal: '2024-08-28',
    waktu: '13.30 - 16.00 Wita',
    kegiatan: 'Rapat Koordinasi Kelompok Kerja Kepala Sekolah (K3S) Kecamatan Mamajang',
    lokasi: 'Aula SDN Mamajang 1',
    pihakTerlibat: 'Seluruh Kepala SD Se-Kecamatan Mamajang & Pengawas Pembina',
    outputHasil: 'Penyamaan persepsi petunjuk teknis pelaksanaan ANBK dan BOSP 2024.',
    status: 'Rencana'
  }
];

export const initialBukuTamu: BukuTamu[] = [
  {
    id: 'TMU-01',
    tanggal: '2024-08-22',
    namaTamu: 'Drs. H. Mappanyukki, M.Pd.',
    instansi: 'Dinas Pendidikan Kota Makassar',
    jabatan: 'Pengawas Pembina Sekolah Dasar',
    noHp: '081144002233',
    keperluan: 'Monitoring Kesiapan ANBK dan Verifikasi Dokumen KSP Kurikulum Merdeka',
    diterimaOleh: 'Dra. Hj. Rosdiana, M.Pd.',
    kesanPesan: 'Administrasi sekolah tertata sangat rapi, lingkungan bersih dan guru-guru sangat antusias.'
  },
  {
    id: 'TMU-02',
    tanggal: '2024-08-25',
    namaTamu: 'drg. Hj. St. Aisyah, M.Kes.',
    instansi: 'Puskesmas Mamajang',
    jabatan: 'Kepala Tim Kesehatan UKS',
    noHp: '081241558899',
    keperluan: 'Koordinasi Jadwal Imunisasi BIAS dan Skrining Kesehatan Berkala Siswa',
    diterimaOleh: 'Kepala Sekolah & Pembina UKS',
    kesanPesan: 'Respon sekolah sangat cepat dan data siswa siap lengkap.'
  }
];

export const initialJurnalKepemimpinan: JurnalKepemimpinan[] = [
  {
    id: 'JRN-01',
    tanggal: '2024-08-23',
    fokusKepemimpinan: 'Instruksional/Pembelajaran',
    refleksiKondisi: 'Melihat antusiasme guru dalam memanfaatkan media ajar digital masih perlu didukung pendampingan sejawat.',
    tindakanInovasi: 'Membentuk "Komunitas Belajar Sipakatau Lanto" yang mengadakan sharing session 45 menit setiap hari Sabtu.',
    dampakPerubahan: 'Guru saling membantu dalam menyusun modul ajar interaktif Canva for Education dan Google Workspace.',
    catatanRencanaLanjutan: 'Akan mengundang narasumber praktisi Guru Penggerak Kota Makassar pada bulan depan.'
  },
  {
    id: 'JRN-02',
    tanggal: '2024-08-16',
    fokusKepemimpinan: 'Sosial & Komunitas',
    refleksiKondisi: 'Peran orang tua murid dalam mendukung program literasi rumah perlu diselaraskan dengan program sekolah.',
    tindakanInovasi: 'Mengadakan Temu Paguyuban Orang Tua Kelas secara berkala bertema "Mendampingi Anak Belajar Tanpa Stres".',
    dampakPerubahan: 'Kemitraan orang tua dan guru semakin solid, dukungan kegiatan sekolah meningkat drastis.',
    catatanRencanaLanjutan: 'Mempersiapkan buku panduan literasi keluarga sederhana.'
  }
];

export const initialKeputusanSK: KeputusanSK[] = [
  {
    id: 'SK-01',
    nomorSK: '800/01/SK-LDP/VII/2024',
    tentang: 'Pembagian Tugas Mengajar dan Tugas Tambahan Guru dan Tenaga Kependidikan Tahun Ajaran 2024/2025',
    tanggalDitetapkan: '2024-07-08',
    tahunAjaran: '2024/2025',
    status: 'Berlaku',
    kategori: 'Pembagian Tugas',
    ringkasanKeputusan: 'Menetapkan pembagian beban mengajar minimal 24 jam tatap muka, penugasan wali kelas, koordinator literasi, dan pembina ekstrakurikuler.'
  },
  {
    id: 'SK-02',
    nomorSK: '800/04/SK-LDP/VII/2024',
    tentang: 'Pembentukan Tim Pencegahan dan Penanganan Kekerasan (TPPK) di Lingkungan Satuan Pendidikan',
    tanggalDitetapkan: '2024-07-15',
    tahunAjaran: '2024/2025',
    status: 'Berlaku',
    kategori: 'Tata Tertib',
    ringkasanKeputusan: 'Membentuk struktur tim terpadu beranggotakan perwakilan guru, komite, dan tokoh masyarakat untuk menjamin sekolah ramah anak bebas perundungan.'
  },
  {
    id: 'SK-03',
    nomorSK: '800/07/SK-LDP/VII/2024',
    tentang: 'Penetapan Tim Pengelola Bantuan Operasional Satuan Pendidikan (BOSP) Tahun Anggaran 2024',
    tanggalDitetapkan: '2024-07-10',
    tahunAjaran: '2024/2025',
    status: 'Berlaku',
    kategori: 'Pengelolaan Keuangan',
    ringkasanKeputusan: 'Menunjuk Penanggung Jawab Kepala Sekolah, Bendahara BOSP, dan Anggota Tim Verifikasi RKAS.'
  }
];

export const initialRencanaPerbaikan: RencanaPerbaikan[] = [
  {
    id: 'RPB-01',
    bidang: 'Peningkatan Kemampuan Numerasi Siswa (PBD)',
    kondisiSaatIni: 'Skor capaian numerasi pada rapor pendidikan berada di angka 76.8 (Kategori Baik tapi butuh akselerasi penalaran HOTS).',
    targetKondisi: 'Mencapai skor numerasi minimal 85.0 dan 100% siswa mencapai batas kompetensi minimum.',
    strategiPerbaikan: 'Penerapan pembelajaran matematika berbasis permainan tradisional daerah (Dakon/Congklak Matematika) dan pengayaan LKPD kontekstual.',
    indikatorKeberhasilan: 'Kenaikan nilai rata-rata asesmen sumatif harian siswa di atas 80.',
    penanggungJawab: 'Ketua Tim Kurikulum & Seluruh Guru Kelas',
    timeline: 'Semester Ganjil 2024/2025 (Juli - Desember 2024)',
    status: 'Implementasi'
  },
  {
    id: 'RPB-02',
    bidang: 'Digitalisasi Arsip dan Manajemen Data Sekolah Terpadu',
    kondisiSaatIni: 'Sebagian dokumen persuratan dan catatan supervisi masih dicatat dalam buku fisik manual.',
    targetKondisi: '100% data sekolah, presensi, keuangan, sarpras, dan supervisi terintegrasi dalam sistem informasi web modern.',
    strategiPerbaikan: 'Pelatihan operasional sistem web manajemen data bagi guru dan tenaga administrasi sekolah.',
    indikatorKeberhasilan: 'Semua berkas tersimpan rapi, mudah dicari, dan dapat diekspor seketika.',
    penanggungJawab: 'Operator SIM Sekolah & Staf TU',
    timeline: 'Agustus - Oktober 2024',
    status: 'Implementasi'
  }
];

export interface MasterKategoriDokumenGuru {
  kategori: KategoriAdministrasiGuru;
  nomor: number;
  deskripsi: string;
  items: {
    nama: string;
    deskripsi: string;
    contoh: string;
  }[];
}

export const MASTER_JENIS_DOKUMEN_GURU: MasterKategoriDokumenGuru[] = [
  {
    nomor: 1,
    kategori: 'Perencanaan Pembelajaran',
    deskripsi: 'Dokumen perencanaan perangkat ajar kurikulum merdeka',
    items: [
      {
        nama: 'Modul Ajar (pengganti RPP, berisi tujuan, langkah kegiatan, asesmen)',
        deskripsi: 'Perangkat ajar lengkap memuat identitas, tujuan pembelajaran, langkah berdiferensiasi, dan instrumen asesmen.',
        contoh: 'Modul Ajar IPAS Bab 1 Tumbuhan Sumber Kehidupan di Bumi - Kelas 4A'
      },
      {
        nama: 'Program Tahunan (Prota)',
        deskripsi: 'Rencana penetapan alokasi waktu satu tahun ajaran untuk mencapai Capaian Pembelajaran (CP).',
        contoh: 'Program Tahunan Kurikulum Merdeka Tahun Ajaran 2024/2025'
      },
      {
        nama: 'Program Semester (Promes)',
        deskripsi: 'Penjabaran alokasi waktu setiap tujuan pembelajaran dan lingkup materi per minggu efektif.',
        contoh: 'Program Semester Ganjil TA 2024/2025 - Mata Pelajaran Matematika'
      },
      {
        nama: 'Silabus / Pemetaan CP (Capaian Pembelajaran)',
        deskripsi: 'Peta alur tujuan pembelajaran (ATP) dan penurunan elemen CP ke tujuan pembelajaran.',
        contoh: 'Pemetaan Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) Fase B'
      },
      {
        nama: 'Kalender Pendidikan',
        deskripsi: 'Jadwal operasional akademik dan alokasi pekan efektif belajar sekolah.',
        contoh: 'Kalender Pendidikan dan Jadwal Efektif Belajar Kelas 1A TA 2024/2025'
      },
      {
        nama: 'Dokumen Kokurikuler',
        deskripsi: 'Modul dan perencanaan Projek Penguatan Profil Pelajar Pancasila (P5) dan kegiatan kokurikuler.',
        contoh: 'Modul Projek P5 Tema Gaya Hidup Berkelanjutan: Pengelolaan Sampah Sekolah'
      }
    ]
  },
  {
    nomor: 2,
    kategori: 'Pelaksanaan Pembelajaran',
    deskripsi: 'Dokumen harian pelaksanaan dan administrasi kegiatan belajar mengajar',
    items: [
      {
        nama: 'Jurnal Mengajar Harian (catatan kegiatan tiap pertemuan)',
        deskripsi: 'Catatan kemajuan materi, refleksi kegiatan, metode yang dipakai, dan catatan keaktifan siswa.',
        contoh: 'Jurnal Harian Mengajar Guru Kelas 1A - Bulan Agustus 2024'
      },
      {
        nama: 'Agenda Guru (rencana mingguan/bulanan)',
        deskripsi: 'Rencana kerja operasional dan target penyelesaian materi ajar per pekan.',
        contoh: 'Agenda Kegiatan Mingguan Guru Kelas 4B Periode Semester Ganjil'
      },
      {
        nama: 'Daftar Hadir Siswa',
        deskripsi: 'Presensi kehadiran harian siswa per mata pelajaran / rombel kelas.',
        contoh: 'Rekapitulasi Daftar Hadir Siswa Kelas 1A Bulan Juli - Agustus 2024'
      },
      {
        nama: 'Daftar Kelas & Data Siswa (identitas, orang tua, riwayat akademik)',
        deskripsi: 'Buku denah kelas, profil data siswa, nomor kontak darurat orang tua, dan riwayat belajar.',
        contoh: 'Buku Biodata dan Kontak Orang Tua Siswa Rombel 4B'
      }
    ]
  },
  {
    nomor: 3,
    kategori: 'Administrasi Penilaian',
    deskripsi: 'Instrumen evaluasi, rekapitulasi, dan analisis capaian hasil belajar siswa',
    items: [
      {
        nama: 'Instrumen Asesmen (formatif, sumatif, proyek, portofolio)',
        deskripsi: 'Rubrik asesmen, kisi-kisi soal, lembar observasi proses, dan lembar asesmen diri/antar-teman.',
        contoh: 'Kisi-kisi dan Rubrik Penilaian Asesmen Sumatif Lingkup Materi 1'
      },
      {
        nama: 'Analisis Hasil Penilaian (diagnosis capaian siswa)',
        deskripsi: 'Analisis ketuntasan tujuan pembelajaran, daya serap materi, serta program remedial dan pengayaan.',
        contoh: 'Format Analisis Hasil Asesmen Sumatif Bab 2 & Rencana Tindak Remedial'
      },
      {
        nama: 'Buku Nilai / Rekap Penilaian',
        deskripsi: 'Buku rekap skor nilai formatif dan sumatif seluruh siswa per lingkup materi.',
        contoh: 'Buku Rekap Nilai Harian Siswa Kelas 1A TA 2024/2025'
      },
      {
        nama: 'Nilai Leger Siswa',
        deskripsi: 'Daftar rekapitulasi nilai seluruh mata pelajaran untuk penulisan rapor hasil belajar.',
        contoh: 'Draft Nilai Leger Rapor Tengah Semester Ganjil Kelas 4B'
      }
    ]
  },
  {
    nomor: 4,
    kategori: 'Administrasi Kesiswaan',
    deskripsi: 'Data riwayat individual, perkembangan karakter, dan bimbingan siswa',
    items: [
      {
        nama: 'Buku Induk Siswa (data lengkap sejak masuk hingga lulus)',
        deskripsi: 'Salinan rekam jejak identitas, mutasi, dan perkembangan murid.',
        contoh: 'Buku Klapper dan Catatan Nomor Induk Siswa Kelas 1A'
      },
      {
        nama: 'Catatan Perkembangan Siswa (akademik, sosial, emosional)',
        deskripsi: 'Jurnal anekdot bimbingan wali kelas terhadap karakter, minat, bakat, dan interaksi sosial anak.',
        contoh: 'Buku Catatan Anekdotal Perkembangan Sikap dan Karakter Siswa Kelas 4B'
      },
      {
        nama: 'Dokumen Layanan Khusus (misalnya intervensi untuk siswa dengan kebutuhan khusus)',
        deskripsi: 'Program akomodasi pembelajaran, konseling individual, atau intervensi bimbingan khusus.',
        contoh: 'Program Layanan Intervensi Bimbingan Membaca Terbimbing untuk Siswa Teridentifikasi Slow Learner'
      }
    ]
  },
  {
    nomor: 5,
    kategori: 'Administrasi Pendukung',
    deskripsi: 'Dokumentasi kemitraan wali murid, komunitas belajar, dan persuratan pendukung',
    items: [
      {
        nama: 'Dokumen Komunikasi dengan Orang Tua (notulen pertemuan, surat edaran)',
        deskripsi: 'Notulen paguyuban kelas, rekam komunikasi buku penghubung, berita acara konsultasi orang tua.',
        contoh: 'Notulen Pertemuan Parenting Paguyuban Kelas 1A dan Rekap Buku Penghubung Ortu'
      }
    ]
  }
];

export const initialAdministrasiGuru: DokumenAdministrasiGuru[] = [
  {
    id: 'ADM-GURU-001',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhaliza, S.Pd., Gr.',
    nipGuru: '19920814 201903 2 011',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Modul Ajar (pengganti RPP, berisi tujuan, langkah kegiatan, asesmen)',
    judul: 'Modul Ajar Bahasa Indonesia Fase A - Bunyi Apa? (Membaca Permulaan & Fonik)',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 1A',
    mataPelajaran: 'Bahasa Indonesia',
    tanggalUpload: '2024-07-22',
    tanggalKirim: '2024-07-22',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Modul_Ajar_Bahasa_Indonesia_Kelas_1A_FaseA_Nurhaliza.pdf',
    fileSize: '2.4 MB',
    catatanGuru: 'Modul ajar dilengkapi dengan media kartu kata bergambar kearifan lokal Makassar dan lembar asesmen formatif awal.',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Luar biasa Ibu Nurhaliza! Modul ajar disusun sangat runtut dengan langkah pembelajaran diferensiasi yang jelas dan media berbasis kearifan lokal yang menarik untuk anak Fase A. Pertahankan kreativitas ini!',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-07-25',
    bintangApresiasi: 5,
    aspekApresiasi: ['Berdiferensiasi', 'Kreatif & Inovatif', 'Sesuai Capaian Pembelajaran', 'Rapi & Tepat Waktu']
  },
  {
    id: 'ADM-GURU-002',
    guruId: 'USR-004',
    namaGuru: 'Muhammad Syahrir, S.Pd.',
    nipGuru: '19880320 201402 1 005',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Program Tahunan (Prota)',
    judul: 'Program Tahunan IPAS & Matematika Fase B Kelas 4B TA 2024/2025',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 4B',
    mataPelajaran: 'IPAS & Matematika',
    tanggalUpload: '2024-07-20',
    tanggalKirim: '2024-07-21',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'PROTA_IPAS_Matematika_Kelas4B_2024.xlsx',
    fileSize: '850 KB',
    catatanGuru: 'Pemetaan minggu efektif telah disesuaikan dengan kalender pendidikan Dinas Pendidikan Kota Makassar.',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Sangat rapi dan sistematis Pak Syahrir. Alokasi jam pelajaran untuk tiap lingkup materi terdistribusi secara proporsional. Siap dijadikan panduan tim kurikulum.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-07-24',
    bintangApresiasi: 5,
    aspekApresiasi: ['Sesuai Capaian Pembelajaran', 'Rapi & Tepat Waktu']
  },
  {
    id: 'ADM-GURU-003',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhaliza, S.Pd., Gr.',
    nipGuru: '19920814 201903 2 011',
    kategori: 'Pelaksanaan Pembelajaran',
    jenisDokumen: 'Jurnal Mengajar Harian (catatan kegiatan tiap pertemuan)',
    judul: 'Jurnal Mengajar Harian & Refleksi Pembelajaran Kelas 1A (Bulan Juli - Agustus 2024)',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 1A',
    mataPelajaran: 'Tematik Terpadu / Guru Kelas',
    tanggalUpload: '2024-08-15',
    tanggalKirim: '2024-08-16',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Jurnal_Harian_Kelas1A_Agustus2024.pdf',
    fileSize: '1.8 MB',
    catatanGuru: 'Tercatat seluruh refleksi harian beserta catatan observasi keaktifan 28 siswa Kelas 1A.',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Catatan reflektif yang sangat kaya dan mendalam. Terlihat ketelatenan Ibu Nurhaliza dalam mengamati transisi anak-anak TK ke SD. Pendekatan Sipakatau terasa sangat hidup.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-18',
    bintangApresiasi: 5,
    aspekApresiasi: ['Reflektif & Bermakna', 'Kreatif & Inovatif', 'Rapi & Tepat Waktu']
  },
  {
    id: 'ADM-GURU-004',
    guruId: 'USR-005',
    namaGuru: 'Sitti Fatimah, S.Pd.I',
    nipGuru: '19871109 201101 2 014',
    kategori: 'Administrasi Penilaian',
    jenisDokumen: 'Instrumen Asesmen (formatif, sumatif, proyek, portofolio)',
    judul: 'Instrumen Asesmen Praktik Ibadah Shalat & Baca Tulis Al-Quran Fase A, B, C',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Semua Kelas',
    mataPelajaran: 'Pendidikan Agama Islam & BP',
    tanggalUpload: '2024-08-10',
    tanggalKirim: '2024-08-11',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Rubrik_Penilaian_PAI_Praktik_Shalat_2024.pdf',
    fileSize: '1.2 MB',
    catatanGuru: 'Rubrik asesmen autentik menggunakan gradasi deskriptor 4 level ketercapaian dan kartu amaliyah.',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Rubrik penilaian kinerja yang sangat komprehensif dan mudah dipahami siswa maupun orang tua. Pembiasaan nilai akhlak mulia terpantau dengan sangat baik.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-14',
    bintangApresiasi: 5,
    aspekApresiasi: ['Asesmen Komprehensif', 'Sesuai Capaian Pembelajaran']
  },
  {
    id: 'ADM-GURU-005',
    guruId: 'USR-004',
    namaGuru: 'Muhammad Syahrir, S.Pd.',
    nipGuru: '19880320 201402 1 005',
    kategori: 'Administrasi Kesiswaan',
    jenisDokumen: 'Catatan Perkembangan Siswa (akademik, sosial, emosional)',
    judul: 'Buku Catatan Anekdotal dan Bimbingan Sosial Emosional Siswa Kelas 4B',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 4B',
    mataPelajaran: 'Wali Kelas 4B',
    tanggalUpload: '2024-08-20',
    tanggalKirim: '2024-08-20',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Catatan_Perkembangan_Siswa_4B_Ganjil.pdf',
    fileSize: '1.5 MB',
    catatanGuru: 'Berisi catatan kemajuan interaksi pertemanan dan perkembangan konsentrasi belajar siswa.',
    status: 'Ditinjau KS',
    catatanKSReview: 'Sedang diverifikasi Kepala Sekolah untuk penguatan program bimbingan wali kelas.'
  },
  {
    id: 'ADM-GURU-006',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhaliza, S.Pd., Gr.',
    nipGuru: '19920814 201903 2 011',
    kategori: 'Administrasi Pendukung',
    jenisDokumen: 'Dokumen Komunikasi dengan Orang Tua (notulen pertemuan, surat edaran)',
    judul: 'Notulen Musyawarah Paguyuban Kelas 1A & Format Buku Penghubung Digital',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 1A',
    mataPelajaran: 'Paguyuban Orang Tua Kelas 1A',
    tanggalUpload: '2024-07-28',
    tanggalKirim: '2024-07-29',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Notulen_Paguyuban_Ortu_Kelas1A_Juli2024.pdf',
    fileSize: '920 KB',
    catatanGuru: 'Notulensi kesepakatan bersama orang tua murid mengenai gerakan literasi 15 menit dan sarapan sehat.',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Kolaborasi yang sangat harmonis antara pihak sekolah dan orang tua murid. Komunikasi aktif seperti ini adalah kunci keberhasilan anak di sekolah dasar.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-01',
    bintangApresiasi: 5,
    aspekApresiasi: ['Kolaborasi Orang Tua', 'Kreatif & Inovatif', 'Rapi & Tepat Waktu']
  },
  {
    id: 'ADM-GURU-007',
    guruId: 'USR-006',
    namaGuru: 'Kurniawan Pratama, S.Pd.',
    nipGuru: '19940502 202221 1 008',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Silabus / Pemetaan CP (Capaian Pembelajaran)',
    judul: 'Pemetaan Capaian Pembelajaran & Alur Tujuan Pembelajaran (ATP) PJOK Fase A, B, C',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Semua Kelas',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
    tanggalUpload: '2024-08-25',
    tanggalKirim: '2024-08-25',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Pemetaan_CP_ATP_PJOK_2024_Kurniawan.docx',
    fileSize: '620 KB',
    catatanGuru: 'Draf pemetaan materi kebugaran jasmani dan permainan bola kecil tradisional.',
    status: 'Terkirim'
  },
  {
    id: 'ADM-GURU-008',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhaliza, S.Pd., Gr.',
    nipGuru: '19920814 201903 2 011',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Program Semester (Promes)',
    judul: 'Program Semester Ganjil TA 2024/2025 Kelas 1A (Fase A)',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 1A',
    mataPelajaran: 'Tematik Terpadu / Guru Kelas',
    tanggalUpload: '2024-07-25',
    tanggalKirim: '2024-07-26',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Promes_Ganjil_Kelas1A_Nurhaliza.xlsx',
    fileSize: '780 KB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Penyusunan alokasi waktu per pekan sangat cermat dan mengakomodasi hari libur nasional serta asesmen berkala.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-07-28',
    bintangApresiasi: 5,
    aspekApresiasi: ['Rapi & Tepat Waktu', 'Sesuai Capaian Pembelajaran']
  },
  {
    id: 'ADM-GURU-009',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhaliza, S.Pd., Gr.',
    nipGuru: '19920814 201903 2 011',
    kategori: 'Pelaksanaan Pembelajaran',
    jenisDokumen: 'Daftar Hadir Siswa',
    judul: 'Daftar Hadir Siswa & Rekapitulasi Presensi Kelas 1A (Bulan Juli - Agustus 2024)',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 1A',
    mataPelajaran: 'Guru Kelas 1A',
    tanggalUpload: '2024-08-28',
    tanggalKirim: '2024-08-28',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Presensi_Siswa_1A_Juli_Agustus.pdf',
    fileSize: '540 KB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Tingkat kehadiran siswa 1A sangat tinggi (98,2%). Tertibnya rekap absensi memudahkan tindak lanjut komunikasi dengan wali murid.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-29',
    bintangApresiasi: 5,
    aspekApresiasi: ['Rapi & Tepat Waktu']
  },
  {
    id: 'ADM-GURU-010',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhaliza, S.Pd., Gr.',
    nipGuru: '19920814 201903 2 011',
    kategori: 'Administrasi Penilaian',
    jenisDokumen: 'Buku Nilai / Rekap Penilaian',
    judul: 'Buku Rekapitulasi Nilai Formatif & Asesmen Sumatif Lingkup Materi 1 & 2 Kelas 1A',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 1A',
    mataPelajaran: 'Bahasa Indonesia, Matematika, PPKn',
    tanggalUpload: '2024-08-29',
    tanggalKirim: '2024-08-29',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Buku_Nilai_Harian_Kelas1A_Ganjil.xlsx',
    fileSize: '1.1 MB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Format penilaian sangat informatif, dilengkapi pemetaan capaian per anak sehingga anak yang perlu penguatan langsung teridentifikasi.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-30',
    bintangApresiasi: 5,
    aspekApresiasi: ['Asesmen Komprehensif', 'Berdiferensiasi']
  },
  {
    id: 'ADM-GURU-011',
    guruId: 'USR-004',
    namaGuru: 'Muhammad Syahrir, S.Pd.',
    nipGuru: '19880320 201402 1 005',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Modul Ajar (pengganti RPP, berisi tujuan, langkah kegiatan, asesmen)',
    judul: 'Modul Ajar IPAS Fase B - Fotosintesis Proses Terpenting di Bumi (Pendekatan Saintifik)',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 4B',
    mataPelajaran: 'Ilmu Pengetahuan Alam & Sosial (IPAS)',
    tanggalUpload: '2024-07-28',
    tanggalKirim: '2024-07-29',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Modul_Ajar_IPAS_Kelas4B_Syahrir.pdf',
    fileSize: '3.2 MB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Eksperimen sains sederhana yang dirancang sangat mudah dipraktikkan murid di halaman sekolah. Pembelajaran kontekstual yang sangat baik.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-02',
    bintangApresiasi: 5,
    aspekApresiasi: ['Kreatif & Inovatif', 'Sesuai Capaian Pembelajaran']
  },
  {
    id: 'ADM-GURU-012',
    guruId: 'USR-004',
    namaGuru: 'Muhammad Syahrir, S.Pd.',
    nipGuru: '19880320 201402 1 005',
    kategori: 'Pelaksanaan Pembelajaran',
    jenisDokumen: 'Jurnal Mengajar Harian (catatan kegiatan tiap pertemuan)',
    judul: 'Jurnal Harian Mengajar & Presensi Terintegrasi Kelas 4B Periode Juli - Agustus 2024',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 4B',
    mataPelajaran: 'Wali Kelas 4B',
    tanggalUpload: '2024-08-22',
    tanggalKirim: '2024-08-23',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Jurnal_Harian_Kelas4B_2024.pdf',
    fileSize: '1.6 MB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Catatan kegiatan terperinci dan disiplin diisi setiap hari. Dokumentasi yang patut dicontoh oleh rekan sejawat.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-25',
    bintangApresiasi: 5,
    aspekApresiasi: ['Reflektif & Bermakna', 'Rapi & Tepat Waktu']
  },
  {
    id: 'ADM-GURU-013',
    guruId: 'USR-005',
    namaGuru: 'Sitti Fatimah, S.Pd.I',
    nipGuru: '19871109 201101 2 014',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Modul Ajar (pengganti RPP, berisi tujuan, langkah kegiatan, asesmen)',
    judul: 'Modul Ajar PAI & BP Fase B - Mari Mengenal Asmaul Husna (Al-Malik, Al-Quddus, As-Salam)',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 4A, 4B',
    mataPelajaran: 'Pendidikan Agama Islam & BP',
    tanggalUpload: '2024-07-24',
    tanggalKirim: '2024-07-25',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Modul_Ajar_PAI_AsmaulHusna_FaseB.pdf',
    fileSize: '1.9 MB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Media pembelajaran kartu tebak Asmaul Husna sangat interaktif. Penanaman nilai akhlak mulia terpapar dengan sangat jelas.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-07-27',
    bintangApresiasi: 5,
    aspekApresiasi: ['Kreatif & Inovatif', 'Sesuai Capaian Pembelajaran']
  },
  {
    id: 'ADM-GURU-014',
    guruId: 'USR-005',
    namaGuru: 'Sitti Fatimah, S.Pd.I',
    nipGuru: '19871109 201101 2 014',
    kategori: 'Pelaksanaan Pembelajaran',
    jenisDokumen: 'Jurnal Mengajar Harian (catatan kegiatan tiap pertemuan)',
    judul: 'Jurnal Harian Guru PAI & Catatan Amaliyah Shalat Berjamaah Siswa',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Semua Kelas',
    mataPelajaran: 'Pendidikan Agama Islam & BP',
    tanggalUpload: '2024-08-18',
    tanggalKirim: '2024-08-19',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Jurnal_Mengajar_PAI_Agustus2024.pdf',
    fileSize: '1.4 MB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Pembiasaan shalat dhuha dan dhuhur berjamaah tercatat rapi. Sangat mendukung visi sekolah dalam mencetak generasi bertakwa.',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-21',
    bintangApresiasi: 5,
    aspekApresiasi: ['Reflektif & Bermakna']
  },
  {
    id: 'ADM-GURU-015',
    guruId: 'USR-006',
    namaGuru: 'Kurniawan Pratama, S.Pd.',
    nipGuru: '19940502 202221 1 008',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Modul Ajar (pengganti RPP, berisi tujuan, langkah kegiatan, asesmen)',
    judul: 'Modul Ajar PJOK Fase B - Pola Gerak Dasar Lokomotor & Manipulatif Permainan Tradisional',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 4A, 4B',
    mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
    tanggalUpload: '2024-08-12',
    tanggalKirim: '2024-08-13',
    fileUrl: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    fileName: 'Modul_Ajar_PJOK_PermainanTradisional.pdf',
    fileSize: '2.1 MB',
    status: 'Disetujui Penuh',
    umpanBalikPositif: 'Integrasi kearifan lokal permainan tradisional Makassar (Dende-dende & Santo) dalam pembelajaran olahraga sangat kreatif dan menggembirakan murid!',
    penilaiKS: 'Dra. Hj. Rosdiana, M.Pd.',
    tanggalUmpanBalik: '2024-08-16',
    bintangApresiasi: 5,
    aspekApresiasi: ['Kontekstual Kearifan Lokal', 'Kreatif & Inovatif']
  }
];

export const initialRiwayatPelatihanGuru: RiwayatPelatihanGuru[] = [
  {
    id: 'TRN-001',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhalizah, S.Pd.',
    nipGuru: '19880315 201402 2 003',
    namaPelatihan: 'Bimbingan Teknis Implementasi Kurikulum Merdeka (IKM) & Penyusunan Modul Ajar Berdiferensiasi',
    tanggalPelaksanaan: '2024-06-10',
    tanggalSelesai: '2024-06-14',
    pelaksana: 'Balai Guru Penggerak (BGP) Provinsi Sulawesi Selatan',
    linkDrive: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    tempat: 'Luring (LPMP / BGP Sulsel, Jl. AP Pettarani Makassar)',
    jumlahJam: 32,
    nomorSertifikat: 'BGP-SS/IKM/0452/VI/2024',
    tahunAjaran: '2024/2025',
    keterangan: 'Sertifikat kelulusan predikat Sangat Memuaskan. Materi mencakup pemetaan diagnostik dan asesmen formatif.',
    createdAt: '2024-06-15'
  },
  {
    id: 'TRN-002',
    guruId: 'USR-004',
    namaGuru: 'Muhammad Fadli, S.Pd.Gr.',
    nipGuru: '19910820 201903 1 005',
    namaPelatihan: 'Pelatihan Pemanfaatan Akun Belajar.id & Google Workspace for Education Tingkat Lanjut',
    tanggalPelaksanaan: '2024-05-15',
    tanggalSelesai: '2024-05-17',
    pelaksana: 'Kemendikbudristek & Google for Education Indonesia',
    linkDrive: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    tempat: 'Daring (Google Meet & Google Classroom)',
    jumlahJam: 32,
    nomorSertifikat: 'GWE-ID/KEMDIKBUD/8821/V/2024',
    tahunAjaran: '2023/2024',
    keterangan: 'Kompetensi Google Classroom, Drive Kolaborasi, Google Sites Portofolio, dan Google Forms Kuis.',
    createdAt: '2024-05-18'
  },
  {
    id: 'TRN-003',
    guruId: 'USR-003',
    namaGuru: 'Andi Nurhalizah, S.Pd.',
    nipGuru: '19880315 201402 2 003',
    namaPelatihan: 'Workshop Penguatan Literasi & Numerasi Berbasis Rekomendasi Rapor Pendidikan Sekolah',
    tanggalPelaksanaan: '2024-07-22',
    tanggalSelesai: '2024-07-24',
    pelaksana: 'Dinas Pendidikan Kota Makassar',
    linkDrive: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    tempat: 'Hotel Claro Makassar (Dinas Pendidikan)',
    jumlahJam: 24,
    nomorSertifikat: '421.2/DISDIK-MKS/LITNUM/072/2024',
    tahunAjaran: '2024/2025',
    keterangan: 'Penyusunan modul pengayaan membaca terbimbing dan permainan numerasi kreatif kelas awal.',
    createdAt: '2024-07-25'
  },
  {
    id: 'TRN-004',
    guruId: 'USR-005',
    namaGuru: 'Sitti Fatimah, S.Pd.I',
    nipGuru: '19871109 201101 2 014',
    namaPelatihan: 'Pelatihan Mandiri Platform Merdeka Mengajar (PMM): Topik Disiplin Positif & Restitusi Siswa',
    tanggalPelaksanaan: '2024-08-01',
    tanggalSelesai: '2024-08-10',
    pelaksana: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (PMM)',
    linkDrive: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    tempat: 'Daring (Aplikasi PMM Kemendikbudristek)',
    jumlahJam: 30,
    nomorSertifikat: 'PMM/SERT/2024/08/99120',
    tahunAjaran: '2024/2025',
    keterangan: 'Aksi Nyata tervalidasi dan telah dibagikan kepada rekan sejawat di komunitas belajar sekolah.',
    createdAt: '2024-08-12'
  },
  {
    id: 'TRN-005',
    guruId: 'USR-006',
    namaGuru: 'Kurniawan Pratama, S.Pd.',
    nipGuru: '19940502 202221 1 008',
    namaPelatihan: 'Workshop Integrasi Kearifan Lokal Budaya Makassar dalam Projek Penguatan Profil Pelajar Pancasila (P5)',
    tanggalPelaksanaan: '2024-03-11',
    tanggalSelesai: '2024-03-13',
    pelaksana: 'KKG Gugus 1 Wilayah Mamajang Kota Makassar',
    linkDrive: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    tempat: 'SDN Kompleks Sambung Jawa / Gugus Mamajang',
    jumlahJam: 16,
    nomorSertifikat: '012/KKG-GUGUS1/MMJ/III/2024',
    tahunAjaran: '2023/2024',
    keterangan: 'Perancangan modul tema Bhinneka Tunggal Ika dengan fokus pelestarian tradisi dan permainan daerah.',
    createdAt: '2024-03-15'
  },
  {
    id: 'TRN-006',
    guruId: 'USR-004',
    namaGuru: 'Muhammad Fadli, S.Pd.Gr.',
    nipGuru: '19910820 201903 1 005',
    namaPelatihan: 'Bimbingan Teknis Pendidikan Inklusif & Layanan Diferensiasi Pembelajaran Ramah Anak',
    tanggalPelaksanaan: '2024-04-18',
    tanggalSelesai: '2024-04-20',
    pelaksana: 'Balai Besar Penjaminan Mutu Pendidikan (BBPMP) Sulawesi Selatan',
    linkDrive: 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing',
    tempat: 'Auditorium BBPMP Sulsel, Makassar',
    jumlahJam: 32,
    nomorSertifikat: 'BBPMP-SS/INLK/341/IV/2024',
    tahunAjaran: '2023/2024',
    keterangan: 'Strategi identifikasi dan asesmen kemampuan awal anak berkebutuhan khusus di kelas reguler.',
    createdAt: '2024-04-22'
  }
];

