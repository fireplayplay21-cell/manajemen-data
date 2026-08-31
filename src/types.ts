export type UserRole = 'admin' | 'guru' | 'kepala_sekolah' | 'tata_usaha';

export type ActiveTab =
  | 'dashboard'
  | 'profil-sekolah'
  // Manajemen Data (Master Data)
  | 'manajemen-data'
  | 'data-ptk'
  | 'data-siswa'
  | 'data-kelas'
  // Manajemen Sekolah
  | 'perencanaan'
  | 'pbd'
  | 'program-unggulan'
  | 'ptk-surat'
  | 'persuratan-mou'
  | 'manajemen-perencanaan'
  | 'manajemen-pbd'
  | 'manajemen-program-unggulan'
  | 'manajemen-ptk'
  // Administrasi Guru
  | 'administrasi-guru'
  | 'manajemen-administrasi-guru'
  // Manajemen Kesiswaan
  | 'kesiswaan'
  | 'manajemen-kesiswaan'
  // Manajemen Supervisi
  | 'supervisi-akademik'
  | 'supervisi-manajerial'
  // Manajemen Keuangan
  | 'keuangan'
  | 'manajemen-keuangan'
  // Manajemen Sarpras
  | 'sarpras'
  | 'manajemen-sarpras'
  // Manajemen Kepala Sekolah
  | 'administrasi-ks'
  | 'manajemen-kepala-sekolah'
  // Pengaturan Khusus Admin & Enrol Pengguna
  | 'pengaturan'
  | 'pengaturan-admin'
  | 'settings'
  | 'enrol-pengguna'
  | 'user-management';

export interface UserAccount {
  id: string;
  nama: string;
  nip: string;
  email: string;
  password?: string; // Default login password: '123456'
  role: UserRole;
  jabatan: string;
  kelasTugas?: string;
  mataPelajaran?: string;
  status: 'Aktif' | 'Nonaktif';
  foto?: string;
  telepon: string;
  tanggalEnrol: string;
}

export interface ProfilSekolah {
  namaSekolah: string;
  npsn: string;
  nss: string;
  akreditasi: string;
  bentukPendidikan: string;
  statusSekolah: string;
  kurikulum: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  email: string;
  telepon: string;
  website: string;
  visi: string;
  misi: string[];
  tujuan: string[];
  semboyan: string;
  tahunPelajaran?: string;
  semester?: string;
  logoUrl?: string;
  logoDinasUrl?: string;
  tutWuriLogoUrl?: string;
  stempelUrl?: string;
}

// 1. Perencanaan Sekolah
export interface DokumenPerencanaan {
  id: string;
  kategori: 'KSP' | 'RKT/RKS' | 'RKAS' | 'Program Kerja KS' | 'Kalender Pendidikan' | 'Target Sekolah';
  judul: string;
  tahunAjaran: string;
  penyusun: string;
  tanggalUpload: string;
  status: 'Draft' | 'Ditinjau' | 'Disetujui KS' | 'Final';
  uraian: string;
  targetCapaian?: string;
  fileUrl?: string;
}

// 2. Perencanaan Berbasis Data (PBD)
export interface IndikatorRaporPendidikan {
  id: string;
  kode: string;
  indikator: string;
  dimensi: 'A' | 'C' | 'D' | 'E';
  skorTahunIni: number;
  skorTahunLalu: number;
  capaian: 'Baik' | 'Sedang' | 'Kurang';
  identifikasiMasalah: string;
  akarMasalah: string;
  programIntervensi: string;
  targetPerbaikan: string;
  tindakLanjut: string;
  penanggungJawab: string;
  statusTindakLanjut: 'Belum Dimulai' | 'Sedang Berjalan' | 'Selesai';
}

// 3. Program Unggulan
export interface ProgramUnggulan {
  id: string;
  jenis: 'Program Sekolah' | 'Praktik Baik' | 'Dokumentasi';
  namaProgram: string;
  bidang: string;
  deskripsi: string;
  inovator: string;
  dampak: string;
  tanggalPelaksanaan: string;
  lokasi: string;
  fotoUrl?: string;
}

// 4. PTK & Persuratan
export interface PTKRecord {
  id: string;
  nama: string;
  nip: string;
  nuptk: string;
  jenisKelamin: 'L' | 'P';
  pangkatGolongan: string;
  jabatan: string;
  tugasTambahan: string;
  pendidikanTerakhir: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT' | 'PTT';
  sertifikasi: 'Sudah Sertifikasi' | 'Belum Sertifikasi';
  email: string;
  telepon: string;
  foto?: string;
  berkasSK?: string;
}

export interface SuratRecord {
  id: string;
  jenis: 'Surat Masuk' | 'Surat Keluar';
  nomorSurat: string;
  tanggalSurat: string;
  tanggalDiterimaKirim: string;
  pengirimPenerima: string;
  perihal: string;
  kategori: 'Undangan' | 'Dinas' | 'Pemberitahuan' | 'Permohonan' | 'Lainnya';
  disposisi?: string;
  status: 'Diterima' | 'Diproses' | 'Selesai' | 'Terkirim';
  fileLampiran?: string;
}

export interface MOUKerjasama {
  id: string;
  mitra: string;
  bidang: string;
  nomorMOU: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  status: 'Aktif' | 'Kedaluwarsa' | 'Proses Perpanjangan';
  programKerja: string;
  penanggungJawab: string;
}

// 4.5. Data Kelas & Rombongan Belajar
export interface KelasRecord {
  id: string;
  namaKelas: string; // e.g. 'Kelas 1A'
  tingkat: string; // e.g. '1'
  fase: 'Fase A' | 'Fase B' | 'Fase C';
  kurikulum: 'Kurikulum Merdeka' | 'Kurikulum 2013';
  waliKelas: string;
  nipWaliKelas: string;
  ruangan: string;
  kapasitas: number;
  tahunAjaran: string;
  semester: string;
  keterangan?: string;
}

// 5. Kesiswaan
export interface Siswa {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  kelas: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  namaOrtu: string;
  teleponOrtu: string;
  alamat: string;
  status: 'Aktif' | 'Pindah' | 'Lulus';
}

export interface PresensiHarian {
  id: string;
  tanggal: string;
  kelas: string;
  totalSiswa: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  catatanGuru: string;
}

export interface PrestasiSiswa {
  id: string;
  namaSiswa: string;
  kelas: string;
  namaLomba: string;
  kategori: 'Akademik' | 'Olahraga' | 'Seni Budaya' | 'Keagamaan' | 'Lainnya';
  tingkat: 'Kecamatan' | 'Kota Makassar' | 'Provinsi Sulawesi Selatan' | 'Nasional';
  peringkat: string;
  tahun: string;
  penyelenggara: string;
  pembimbing: string;
}

export interface ProgramKarakter {
  id: string;
  dimensi: 'Beriman & Bertakwa' | 'Berkebinekaan Global' | 'Gotong Royong' | 'Mandiri' | 'Bernalar Kritis' | 'Kreatif';
  namaKegiatan: string;
  jadwalRutin: string;
  sasaran: string;
  deskripsi: string;
  evaluasiCapaian: string;
}

export interface Ekstrakurikuler {
  id: string;
  namaEkskul: string;
  pembina: string;
  hariLatihan: string;
  tempat: string;
  jumlahAnggota: number;
  prestasiTerbaru: string;
}

export interface MasalahSiswa {
  id: string;
  tanggal: string;
  namaSiswa: string;
  kelas: string;
  jenisKasus: string;
  deskripsiMasalah: string;
  tindakanPenanganan: string;
  guruPendamping: string;
  keterlibatanOrtu: boolean;
  status: 'Dalam Pemantauan' | 'Selesai' | 'Butuh Rujukan';
  hasilTindakLanjut: string;
}

// 6. Supervisi Akademik & Manajerial
export interface SupervisiAkademik {
  id: string;
  namaGuru: string;
  nip: string;
  mataPelajaran: string;
  kelas: string;
  jadwalTanggal: string;
  jamKe: string;
  supervisor: string;
  
  // Pra Observasi
  kesiapanModulAjar: number; // 1-100
  kesiapanMedia: number;
  kesiapanAsesmen: number;
  catatanPraObservasi: string;
  
  // Hasil Observasi
  skorApersepsi: number;
  skorPenguasaanMateri: number;
  skorPendekatanBerdiferensiasi: number;
  skorInteraksiSiswa: number;
  skorPemanfaatanTeknologi: number;
  skorAsesmenFormatif: number;
  totalSkor: number;
  kategoriNilai: 'Amat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  
  // Pasca Observasi
  umpanBalik: string;
  kelebihan: string;
  areaPeningkatan: string;
  tindakLanjut: string;
  status: 'Terjadwal' | 'Pra-Observasi' | 'Observasi Selesai' | 'Tuntas Ditindaklanjuti';
  // Link to 3-stage supervision document
  formulirSupervisiId?: string;
  sinkronDariFormulir?: boolean;
}

export interface SupervisiManajerial {
  id: string;
  aspekStandar: 'Standar Isi' | 'Standar Proses' | 'Standar Kelulusan' | 'Standar PTK' | 'Standar Sarpras' | 'Standar Pengelolaan' | 'Standar Pembiayaan' | 'Standar Penilaian';
  instrumen: string;
  tanggalPemantauan: string;
  petugasPemantau: string;
  hasilTemuan: string;
  evaluasiProgram: string;
  rekomendasiTindakLanjut: string;
  status: 'Sesuai Standar' | 'Perlu Perbaikan' | 'Kritis';
  // Optional link to 3-stage supervision document
  formulirSupervisiId?: string;
}

// 6b. Formulir 3 Tahap Supervisi Pembelajaran (Pra-Observasi, Observasi Kelas 5 Komponen, Pasca-Observasi)
export interface ItemObservasi5Komponen {
  id: number;
  nomor: number;
  aspekDanStrategi: string;
  ada: boolean; // Ada (✓) atau Tidak
  catatanPengamatan: string;
  catatanReferensiDefault?: string; // Teks bahan referensi permanen
}

export interface FormulirPraObservasiData {
  tujuanPembelajaran: string;
  aspekPengembangan: string;
  strategiPembelajaran: string;
  kesiapanModulAjar: boolean;
  kesiapanMediaAjar: boolean;
  kesiapanInstrumenAsesmen: boolean;
  catatanPraObservasi: string;
  catatanReferensiDefault?: string;
}

export interface FormulirObservasiData {
  areaObservasi: ItemObservasi5Komponen[];
  catatanTambahan: string;
  catatanTambahanReferensiDefault?: string;
  skorKelayakanPersen: number; // e.g. 100%
  kategoriHasil: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan';
}

export interface FormulirPascaObservasiData {
  refleksiGuru: string;
  ketercapaianTujuan: string;
  umpanBalikSupervisor: string;
  rencanaTindakLanjut: string;
  komitmenWaktu: string;
  sasaranPerbaikan: string;
  rekomendasiAkhir: string;
  catatanReferensiDefault?: string;
}

export interface FormulirSupervisiLengkap {
  id: string;
  hariTanggal: string; // e.g. 'Selasa, 26 September 2023'
  sekolah: string; // e.g. 'UPTD SPF SDN Lanto Dg. Pasewang'
  namaGuru: string; // Observee
  nipGuru: string;
  mataPelajaran: string;
  kelas: string; // e.g. '2 ( Dua )'
  waktuPercakapan: string; // e.g. '10.00 – 10.15 ( 15 menit )'
  namaSupervisor: string; // Observer
  nipSupervisor?: string;
  
  tahapAktif?: 'pra' | 'observasi' | 'pasca' | 'ringkasan';
  praObservasi: FormulirPraObservasiData;
  observasi: FormulirObservasiData;
  pascaObservasi: FormulirPascaObservasiData;
  
  sinkronKeManajerial: boolean;
  manajerialRefId?: string;
  sinkronKeAkademik?: boolean;
  akademikRefId?: string;
  statusDokumen: 'Draft' | 'Pra-Observasi Selesai' | 'Observasi Berjalan' | 'Pasca-Observasi Tuntas' | 'Disahkan';
  tandaTanganSupervisor?: string;
  tandaTanganGuru?: string;
  createdAt: string;
  updatedAt: string;
}

// 7. Keuangan
export interface ItemRKAS {
  id: string;
  kodeRekening: string;
  uraianKegiatan: string;
  komponenBOS: string;
  sumberDana: 'BOS Reguler' | 'BOS Kinerja' | 'BOP Daerah' | 'Lainnya';
  anggaranTotal: number;
  realisasiTotal: number;
  sisaAnggaran: number;
  status: 'Direncanakan' | 'Dalam Proses' | 'Terealisasi 100%';
  triwulan: 'Triwulan 1' | 'Triwulan 2' | 'Triwulan 3' | 'Triwulan 4';
}

export interface TransaksiKeuangan {
  id: string;
  tanggal: string;
  noBukti: string;
  jenis: 'Pemasukan' | 'Pengeluaran';
  uraian: string;
  kategori: 'Operasional' | 'Gaji/Honor' | 'Sarpras' | 'Perpustakaan' | 'Kegiatan Kesiswaan' | 'Penerimaan Dana';
  nominal: number;
  penerimaPenyetor: string;
  penanggungJawab: string;
  buktiNotaUrl?: string;
  statusVerifikasi: 'Terverifikasi Bendahara' | 'Menunggu Verifikasi';
}

// 8. Sarpras
export interface ItemSarpras {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: 'Ruang/Gedung' | 'Mebelair' | 'Elektronik & IT' | 'Alat Peraga Edukatif' | 'Sarana Olahraga' | 'Buku & Literasi';
  lokasi: string;
  jumlah: number;
  satuan: 'Unit' | 'Buah' | 'Set' | 'Ruang' | 'Paket';
  kondisiBaik: number;
  kondisiRusakRingan: number;
  kondisiRusakBerat: number;
  tahunPerolehan: number;
  sumberDana: string;
  nilaiAsetPerolehan: number;
  keterangan: string;
}

export interface PemeliharaanSarpras {
  id: string;
  namaBarang: string;
  lokasi: string;
  jenisKerusakan: string;
  usulanPerbaikan: string;
  biayaEstimasi: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  pelaksana: string;
  status: 'Diajukan' | 'Disetujui' | 'Sedang Dikerjakan' | 'Selesai';
}

export interface PeminjamanSarpras {
  id: string;
  namaPeminjam: string;
  kontak: string;
  namaBarang: string;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembaliEstimasi: string;
  tanggalKembaliRealisasi?: string;
  keperluan: string;
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat';
}

// 9. Administrasi Kepala Sekolah
export interface AgendaHarianKS {
  id: string;
  tanggal: string;
  waktu: string;
  kegiatan: string;
  lokasi: string;
  pihakTerlibat: string;
  outputHasil: string;
  status: 'Rencana' | 'Terlaksana' | 'Ditunda';
  fileUrl?: string;
}

export interface BukuTamu {
  id: string;
  tanggal: string;
  waktu?: string;
  namaTamu: string;
  instansi: string;
  jabatan: string;
  noHp: string;
  keperluan: string;
  diterimaOleh: string;
  kesanPesan: string;
  fileUrl?: string;
}

export interface JurnalKepemimpinan {
  id: string;
  tanggal: string;
  fokusKepemimpinan: 'Instruksional/Pembelajaran' | 'Manajerial' | 'Kewirausahaan' | 'Supervisi' | 'Sosial & Komunitas';
  refleksiKondisi: string;
  tindakanInovasi: string;
  dampakPerubahan: string;
  catatanRencanaLanjutan: string;
  fileUrl?: string;
}

export interface KeputusanSK {
  id: string;
  nomorSK: string;
  tentang: string;
  tanggalDitetapkan: string;
  tahunAjaran: string;
  status: 'Berlaku' | 'Direvisi' | 'Kedaluwarsa';
  kategori: 'Pembagian Tugas' | 'Kepanitiaan' | 'Pengelolaan Keuangan' | 'Tata Tertib' | 'Ekstrakurikuler' | 'Lainnya';
  ringkasanKeputusan: string;
  penanggungJawab?: string;
  fileUrl?: string;
}

export interface RencanaPerbaikan {
  id: string;
  bidang: string;
  kondisiSaatIni: string;
  targetKondisi: string;
  strategiPerbaikan: string;
  indikatorKeberhasilan: string;
  penanggungJawab: string;
  timeline: string;
  status: 'Inisiasi' | 'Implementasi' | 'Evaluasi' | 'Tercapai';
  fileUrl?: string;
}

// 10. Administrasi Guru
export type KategoriAdministrasiGuru =
  | 'Perencanaan Pembelajaran'
  | 'Pelaksanaan Pembelajaran'
  | 'Administrasi Penilaian'
  | 'Administrasi Kesiswaan'
  | 'Administrasi Pendukung';

export interface RiwayatPelatihanGuru {
  id: string;
  guruId: string;
  namaGuru: string;
  nipGuru?: string;
  namaPelatihan: string;
  tanggalPelaksanaan: string; // YYYY-MM-DD atau rentang tanggal
  tanggalSelesai?: string;
  pelaksana: string; // Lembaga / Instansi Penyelenggara
  linkDrive: string; // Link URL Google Drive (Sertifikat / Laporan / Materi)
  tempat?: string; // Daring / Luring / Hybrid / Lokasi
  jumlahJam?: number; // Jam Pelajaran (JP), misal 32 JP
  nomorSertifikat?: string;
  tahunAjaran?: string;
  keterangan?: string;
  createdAt?: string;
}

export interface DokumenAdministrasiGuru {
  id: string;
  guruId: string;
  namaGuru: string;
  nipGuru: string;
  kategori: KategoriAdministrasiGuru;
  jenisDokumen: string;
  judul: string;
  tahunAjaran: string;
  semester: 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)' | string;
  kelas: string;
  mataPelajaran: string;
  tanggalUpload: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  catatanGuru?: string;
  status: 'Draft' | 'Terkirim' | 'Ditinjau KS' | 'Disetujui dengan Catatan' | 'Disetujui Penuh' | 'Perlu Revisi';
  tanggalKirim?: string;
  catatanKSReview?: string;
  // Umpan Balik Positif dari Kepala Sekolah
  umpanBalikPositif?: string;
  penilaiKS?: string;
  tanggalUmpanBalik?: string;
  bintangApresiasi?: number; // 1 - 5
  aspekApresiasi?: string[]; // Tag keunggulan / apresiasi
}
