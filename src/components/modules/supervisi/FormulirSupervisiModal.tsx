import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FormulirSupervisiLengkap,
  ItemObservasi5Komponen,
  FormulirPraObservasiData,
  FormulirObservasiData,
  FormulirPascaObservasiData
} from '../../../types';
import { Modal } from '../../common/Modal';
import { DEFAULT_5_KOMPONEN_OBSERVASI, DEFAULT_CATATAN_TAMBAHAN_OBSERVASI } from '../../../data/initialData';
import {
  FileText,
  CheckCircle2,
  ListChecks,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Info,
  CheckSquare,
  Square,
  BookOpen,
  User,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FormulirSupervisiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FormulirSupervisiLengkap | null;
  onSave: (data: Omit<FormulirSupervisiLengkap, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const FormulirSupervisiModal: React.FC<FormulirSupervisiModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave
}) => {
  const { profilSekolah, ptkList, currentUser } = useApp();

  const [activeStageTab, setActiveStageTab] = useState<'pra' | 'observasi' | 'pasca'>('pra');

  // Metadata
  const [sekolah, setSekolah] = useState(profilSekolah?.nama || 'UPTD SPF SDN Lanto Dg. Pasewang');
  const [namaGuru, setNamaGuru] = useState('');
  const [nipGuru, setNipGuru] = useState('');
  const [mataPelajaran, setMataPelajaran] = useState('Pendidikan Pancasila & Kewarganegaraan (PPKn)');
  const [kelas, setKelas] = useState('2 ( Dua )');
  const [hariTanggal, setHariTanggal] = useState('Selasa, 26 September 2023');
  const [waktuPercakapan, setWaktuPercakapan] = useState('10.00 – 10.15 ( 15 menit )');
  const [namaSupervisor, setNamaSupervisor] = useState(profilSekolah?.kepalaSekolah || 'Dra. Hj. Rosdiana, M.Pd.');
  const [nipSupervisor, setNipSupervisor] = useState(profilSekolah?.nipKepalaSekolah || '19700412 199303 2 004');
  const [statusDokumen, setStatusDokumen] = useState<FormulirSupervisiLengkap['statusDokumen']>('Pasca-Observasi Tuntas');
  const [sinkronKeManajerial, setSinkronKeManajerial] = useState(true);
  const [sinkronKeAkademik, setSinkronKeAkademik] = useState(true);

  // Pra-Observasi State
  const [praObservasi, setPraObservasi] = useState<FormulirPraObservasiData>({
    tujuanPembelajaran: '',
    aspekPengembangan: '',
    strategiPembelajaran: '',
    kesiapanModulAjar: true,
    kesiapanMediaAjar: true,
    kesiapanInstrumenAsesmen: true,
    catatanPraObservasi: '',
    catatanReferensiDefault: ''
  });

  // Observasi 5 Komponen State
  const [areaObservasi, setAreaObservasi] = useState<ItemObservasi5Komponen[]>(DEFAULT_5_KOMPONEN_OBSERVASI);
  const [catatanTambahan, setCatatanTambahan] = useState(DEFAULT_CATATAN_TAMBAHAN_OBSERVASI);
  const [kategoriHasil, setKategoriHasil] = useState<'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan'>('Sangat Baik');

  // Pasca-Observasi State
  const [pascaObservasi, setPascaObservasi] = useState<FormulirPascaObservasiData>({
    refleksiGuru: '',
    ketercapaianTujuan: '',
    umpanBalikSupervisor: '',
    sasaranPerbaikan: '',
    rencanaTindakLanjut: '',
    komitmenWaktu: '',
    rekomendasiAkhir: ''
  });

  // Populate initialData if editing
  useEffect(() => {
    if (initialData) {
      setSekolah(initialData.sekolah || profilSekolah?.nama || 'UPTD SPF SDN Lanto Dg. Pasewang');
      setNamaGuru(initialData.namaGuru);
      setNipGuru(initialData.nipGuru || '');
      setMataPelajaran(initialData.mataPelajaran);
      setKelas(initialData.kelas);
      setHariTanggal(initialData.hariTanggal);
      setWaktuPercakapan(initialData.waktuPercakapan || '10.00 – 10.15 ( 15 menit )');
      setNamaSupervisor(initialData.namaSupervisor);
      setNipSupervisor(initialData.nipSupervisor || '');
      setStatusDokumen(initialData.statusDokumen);
      setSinkronKeManajerial(initialData.sinkronKeManajerial !== false);
      setSinkronKeAkademik(initialData.sinkronKeAkademik !== false);
      setPraObservasi(initialData.praObservasi);
      setAreaObservasi(initialData.observasi.areaObservasi);
      setCatatanTambahan(initialData.observasi.catatanTambahan || '');
      setKategoriHasil(initialData.observasi.kategoriHasil);
      setPascaObservasi(initialData.pascaObservasi);
    } else {
      // Default with first available teacher
      const firstGuru = ptkList.find(p => p.jabatan.toLowerCase().includes('guru')) || ptkList[1] || ptkList[0];
      if (firstGuru) {
        setNamaGuru(firstGuru.nama);
        setNipGuru(firstGuru.nip);
      }
      setSekolah(profilSekolah?.nama || 'UPTD SPF SDN Lanto Dg. Pasewang');
      setNamaSupervisor(profilSekolah?.kepalaSekolah || 'Dra. Hj. Rosdiana, M.Pd.');
      setNipSupervisor(profilSekolah?.nipKepalaSekolah || '19700412 199303 2 004');
      setHariTanggal(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setAreaObservasi(DEFAULT_5_KOMPONEN_OBSERVASI);
      setCatatanTambahan(DEFAULT_CATATAN_TAMBAHAN_OBSERVASI);

      setPraObservasi({
        tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi serta menceritakan tugas dan peran anggota keluarga dalam kegiatan bersama di rumah dan di sekolah.',
        aspekPengembangan: 'Penerapan pembelajaran berdiferensiasi (konten, proses, produk) dan penguatan media visual interaktif.',
        strategiPembelajaran: 'Pendekatan saintifik berpusat pada murid melalui diskusi kelompok kecil, tayangan video studi kasus, dan kartu peran.',
        kesiapanModulAjar: true,
        kesiapanMediaAjar: true,
        kesiapanInstrumenAsesmen: true,
        catatanPraObservasi: 'Guru telah menyusun modul ajar lengkap dengan asesmen diagnostik dan formatif. Media kartu peran dan proyektor siap digunakan.'
      });

      setPascaObservasi({
        refleksiGuru: 'Sebagian besar peserta didik sangat antusias dan mampu mengidentifikasi tugas keluarga melalui bermain peran.',
        ketercapaianTujuan: 'Tujuan pembelajaran tercapai dengan baik (90% peserta didik tuntas memahami materi peran keluarga).',
        umpanBalikSupervisor: 'Guru telah menerapkan pembelajaran diferensiasi yang kontekstual dan suasana kelas sangat interaktif.',
        sasaranPerbaikan: 'Manajemen waktu pada saat transisi dari tayangan video ke diskusi kelompok perlu dipercepat 5 menit.',
        rencanaTindakLanjut: 'Mengikuti sesi refleksi di Komunitas Belajar (Kombel) sekolah untuk memperkaya variasi ice breaking dan manajemen kelas.',
        komitmenWaktu: 'Siklus supervisi berikutnya (Semester Genap)',
        rekomendasiAkhir: 'Pertahankan dan tularkan praktik baik pembelajaran berdiferensiasi ini ke rekan sejawat di KKG Gugus.'
      });
    }
  }, [initialData, isOpen, profilSekolah, ptkList, currentUser]);

  // Recalculate auto score based on checked components
  const checkedCount = areaObservasi.filter(a => a.ada).length;
  useEffect(() => {
    if (checkedCount === 5) setKategoriHasil('Sangat Baik');
    else if (checkedCount >= 4) setKategoriHasil('Baik');
    else if (checkedCount >= 3) setKategoriHasil('Cukup');
    else setKategoriHasil('Perlu Pembinaan');
  }, [checkedCount]);

  const handleToggleAda = (id: number) => {
    setAreaObservasi(prev =>
      prev.map(item => (item.id === id ? { ...item, ada: !item.ada } : item))
    );
  };

  const handleUpdateCatatan = (id: number, text: string) => {
    setAreaObservasi(prev =>
      prev.map(item => (item.id === id ? { ...item, catatanPengamatan: text } : item))
    );
  };

  const handleApplyReference = (id: number) => {
    const template = DEFAULT_5_KOMPONEN_OBSERVASI.find(t => t.id === id);
    if (template) {
      setAreaObservasi(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ada: true, catatanPengamatan: template.catatanPengamatan }
            : item
        )
      );
    }
  };

  const handleApplyAllReferences = () => {
    setAreaObservasi(DEFAULT_5_KOMPONEN_OBSERVASI);
    setCatatanTambahan(DEFAULT_CATATAN_TAMBAHAN_OBSERVASI);
  };

  const handleSelectGuru = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNama = e.target.value;
    setNamaGuru(selectedNama);
    const found = ptkList.find(p => p.nama === selectedNama);
    if (found) {
      setNipGuru(found.nip);
      if (found.tugasTambahan) {
        setKelas(found.tugasTambahan);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<FormulirSupervisiLengkap, 'id' | 'createdAt' | 'updatedAt'> = {
      hariTanggal,
      sekolah,
      namaGuru,
      nipGuru,
      mataPelajaran,
      kelas,
      waktuPercakapan,
      namaSupervisor,
      nipSupervisor,
      praObservasi,
      observasi: {
        areaObservasi,
        catatanTambahan,
        skorKelayakanPersen: Math.round((checkedCount / 5) * 100),
        kategoriHasil
      },
      pascaObservasi,
      statusDokumen,
      sinkronKeManajerial,
      sinkronKeAkademik
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Formulir Supervisi 3 Tahap' : 'Instrumen 3 Formulir Supervisi Pembelajaran'}
      subtitle="Formulir Pra-Observasi, Lembar Observasi 5 Komponen Inti, dan Pasca-Observasi Terintegrasi"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
        {/* Header Metadata Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Identitas Supervisi Kelas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                <input
                  type="checkbox"
                  checked={sinkronKeManajerial}
                  onChange={e => setSinkronKeManajerial(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Sinkronkan ke Matriks Supervisi Manajerial (Standar Proses)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guru yang Disupervisi (Observee)</label>
              <select
                value={namaGuru}
                onChange={handleSelectGuru}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                required
              >
                <option value="">-- Pilih Guru --</option>
                {ptkList.map(p => (
                  <option key={p.id} value={p.nama}>
                    {p.nama} ({p.jabatan})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Guru</label>
              <input
                type="text"
                value={nipGuru}
                onChange={e => setNipGuru(e.target.value)}
                placeholder="19870101..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran / Tema</label>
              <input
                type="text"
                value={mataPelajaran}
                onChange={e => setMataPelajaran(e.target.value)}
                placeholder="PPKn, Matematika, IPAS..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
              <input
                type="text"
                value={kelas}
                onChange={e => setKelas(e.target.value)}
                placeholder="2 ( Dua )"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hari & Tanggal</label>
              <input
                type="text"
                value={hariTanggal}
                onChange={e => setHariTanggal(e.target.value)}
                placeholder="Selasa, 26 September 2023"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Waktu Percakapan / Jam</label>
              <input
                type="text"
                value={waktuPercakapan}
                onChange={e => setWaktuPercakapan(e.target.value)}
                placeholder="10.00 – 10.15 ( 15 menit )"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Supervisor (Kepala Sekolah / Observer)</label>
                {profilSekolah?.kepalaSekolah && (
                  <button
                    type="button"
                    onClick={() => {
                      setNamaSupervisor(profilSekolah.kepalaSekolah);
                      setNipSupervisor(profilSekolah.nipKepalaSekolah || '19700412 199303 2 004');
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                  >
                    Gunakan Kepala Sekolah
                  </button>
                )}
              </div>
              <input
                type="text"
                value={namaSupervisor}
                onChange={e => setNamaSupervisor(e.target.value)}
                placeholder="Nama Kepala Sekolah / Supervisor"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Dokumen</label>
              <select
                value={statusDokumen}
                onChange={e => setStatusDokumen(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="Pasca-Observasi Tuntas">Pasca-Observasi Tuntas</option>
                <option value="Observasi Berjalan">Observasi Berjalan</option>
                <option value="Pra-Observasi Selesai">Pra-Observasi Selesai</option>
                <option value="Disahkan">Disahkan</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3 Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveStageTab('pra')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
              activeStageTab === 'pra'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-black">
              1
            </span>
            <span>Formulir Pra-Observasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStageTab('observasi')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
              activeStageTab === 'observasi'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span>Lembar Observasi (5 Komponen)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
              {checkedCount}/5
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStageTab('pasca')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
              activeStageTab === 'pasca'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-black">
              3
            </span>
            <span>Formulir Pasca-Observasi</span>
          </button>
        </div>

        {/* Tab 1: Pra-Observasi */}
        {activeStageTab === 'pra' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-start gap-2.5 text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Tahap Pra-Observasi:</strong> Percakapan awal antara supervisor dan guru mengenai kesiapan modul ajar, tujuan pembelajaran, aspek pengembangan, dan strategi diferensiasi yang akan dipraktikkan di kelas.
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  1. Tujuan Pembelajaran yang Ingin Dicapai
                </label>
                <textarea
                  rows={2}
                  value={praObservasi.tujuanPembelajaran}
                  onChange={e => setPraObservasi({ ...praObservasi, tujuanPembelajaran: e.target.value })}
                  placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  2. Area / Aspek Pengembangan yang Hendak Dicapai
                </label>
                <textarea
                  rows={2}
                  value={praObservasi.aspekPengembangan}
                  onChange={e => setPraObservasi({ ...praObservasi, aspekPengembangan: e.target.value })}
                  placeholder="Penerapan pembelajaran berdiferensiasi (konten, proses, produk) dan media interaktif..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  3. Strategi Pembelajaran yang Dipersiapkan
                </label>
                <textarea
                  rows={2}
                  value={praObservasi.strategiPembelajaran}
                  onChange={e => setPraObservasi({ ...praObservasi, strategiPembelajaran: e.target.value })}
                  placeholder="Pendekatan saintifik, diskusi kelompok kecil, tayangan video, dan kartu peran..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  4. Catatan Pra-Observasi / Kesiapan Guru
                </label>
                <textarea
                  rows={2}
                  value={praObservasi.catatanPraObservasi}
                  onChange={e => setPraObservasi({ ...praObservasi, catatanPraObservasi: e.target.value })}
                  placeholder="Guru telah menyusun modul ajar lengkap dengan asesmen diagnostik dan formatif..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveStageTab('observasi')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                <span>Lanjut ke Lembar Observasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Lembar Observasi 5 Komponen */}
        {activeStageTab === 'observasi' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Lembar Observasi 5 Komponen Inti:</strong> Berisi 5 aspek pembelajaran berdiferensiasi, alat peraga, pembagian kelompok, pendampingan, dan pendekatan saintifik. Teks referensi tetap dipertahankan dan dapat diedit secara manual.
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyAllReferences}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shrink-0 transition-colors cursor-pointer text-[11px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Referensi Standar</span>
              </button>
            </div>

            {/* Score and Category Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 items-center">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Komponen Terlaksana</span>
                <span className="text-lg font-black text-slate-900">
                  {checkedCount} / 5 Komponen ({Math.round((checkedCount / 5) * 100)}%)
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Kategori Hasil Observasi</span>
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-black ${
                    kategoriHasil === 'Sangat Baik'
                      ? 'bg-emerald-600 text-white'
                      : kategoriHasil === 'Baik'
                      ? 'bg-blue-600 text-white'
                      : kategoriHasil === 'Cukup'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {kategoriHasil}
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Override Kategori</label>
                <select
                  value={kategoriHasil}
                  onChange={e => setKategoriHasil(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white outline-none"
                >
                  <option value="Sangat Baik">Sangat Baik (100%)</option>
                  <option value="Baik">Baik (80%)</option>
                  <option value="Cukup">Cukup (60%)</option>
                  <option value="Perlu Pembinaan">Perlu Pembinaan (&lt;60%)</option>
                </select>
              </div>
            </div>

            {/* 5 Components Table / Cards */}
            <div className="space-y-3">
              {areaObservasi.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.ada
                      ? 'bg-white border-blue-200 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          {item.aspekDanStrategi}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleApplyReference(item.id)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline px-2 py-1 cursor-pointer"
                        title="Gunakan teks deskripsi referensi standar"
                      >
                        Reset Teks Referensi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAda(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          item.ada
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {item.ada ? (
                          <>
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                            <span>Ada / Terlaksana</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4 h-4 text-slate-400" />
                            <span>Tidak Ada</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Catatan Pengamatan:
                    </label>
                    <textarea
                      rows={2}
                      value={item.catatanPengamatan}
                      onChange={e => handleUpdateCatatan(item.id, e.target.value)}
                      placeholder="Catatan pengamatan pelaksanaan..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed text-slate-800 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Catatan Tambahan */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Catatan Tambahan Observasi
              </label>
              <textarea
                rows={3}
                value={catatanTambahan}
                onChange={e => setCatatanTambahan(e.target.value)}
                placeholder="Tuliskan catatan tambahan mengenai jalannya pembelajaran, keaktifan murid, dan suasana kelas..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveStageTab('pra')}
                className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
              >
                Kembali ke Pra-Observasi
              </button>
              <button
                type="button"
                onClick={() => setActiveStageTab('pasca')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                <span>Lanjut ke Pasca-Observasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Pasca-Observasi */}
        {activeStageTab === 'pasca' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 flex items-start gap-2.5 text-purple-950">
              <MessageSquare className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Tahap Pasca-Observasi:</strong> Refleksi pembelajaran, umpan balik apresiatif, identifikasi sasaran perbaikan, dan perumusan rencana tindak lanjut pengembangan diri guru.
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  1. Refleksi Guru terhadap Pembelajaran
                </label>
                <textarea
                  rows={2}
                  value={pascaObservasi.refleksiGuru}
                  onChange={e => setPascaObservasi({ ...pascaObservasi, refleksiGuru: e.target.value })}
                  placeholder="Pendapat guru mengenai jalannya pembelajaran dan pemahaman siswa..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  2. Ketercapaian Tujuan Pembelajaran
                </label>
                <textarea
                  rows={2}
                  value={pascaObservasi.ketercapaianTujuan}
                  onChange={e => setPascaObservasi({ ...pascaObservasi, ketercapaianTujuan: e.target.value })}
                  placeholder="Persentase atau uraian ketuntasan tujuan belajar siswa..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  3. Umpan Balik & Catatan Supervisor
                </label>
                <textarea
                  rows={2}
                  value={pascaObservasi.umpanBalikSupervisor}
                  onChange={e => setPascaObservasi({ ...pascaObservasi, umpanBalikSupervisor: e.target.value })}
                  placeholder="Apresiasi atas keunggulan, kreativitas, dan respon positif..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  4. Sasaran Perbaikan
                </label>
                <textarea
                  rows={2}
                  value={pascaObservasi.sasaranPerbaikan}
                  onChange={e => setPascaObservasi({ ...pascaObservasi, sasaranPerbaikan: e.target.value })}
                  placeholder="Kendala alokasi waktu, manajemen kelompok, dsb..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    5. Rencana Tindak Lanjut
                  </label>
                  <textarea
                    rows={2}
                    value={pascaObservasi.rencanaTindakLanjut}
                    onChange={e => setPascaObservasi({ ...pascaObservasi, rencanaTindakLanjut: e.target.value })}
                    placeholder="Pelatihan di Kombel, KKG, Coaching rekan sejawat..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    6. Komitmen Waktu
                  </label>
                  <textarea
                    rows={2}
                    value={pascaObservasi.komitmenWaktu}
                    onChange={e => setPascaObservasi({ ...pascaObservasi, komitmenWaktu: e.target.value })}
                    placeholder="Siklus supervisi berikutnya / 2 pekan ke depan..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  7. Rekomendasi Akhir Supervisor
                </label>
                <textarea
                  rows={2}
                  value={pascaObservasi.rekomendasiAkhir}
                  onChange={e => setPascaObservasi({ ...pascaObservasi, rekomendasiAkhir: e.target.value })}
                  placeholder="Rekomendasi penutup dan motivasi pengembangan profesional..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveStageTab('observasi')}
                className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
              >
                Kembali ke Lembar Observasi
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="text-[11px] text-slate-500">
            Hasil penilaian 5 komponen otomatis direkap dan disinkronkan ke Matriks Penilaian Supervisi Akademik & Supervisi Manajerial.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan Formulir' : 'Simpan & Sinkronkan Formulir'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
