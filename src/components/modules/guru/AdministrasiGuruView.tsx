import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  DokumenAdministrasiGuru,
  KategoriAdministrasiGuru
} from '../../../types';
import {
  MASTER_JENIS_DOKUMEN_GURU
} from '../../../data/initialData';
import { DriveFileUpload } from '../../common/DriveFileUpload';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  FolderCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  MessageSquareHeart,
  Star,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Send,
  Eye,
  ExternalLink,
  Download,
  AlertCircle,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  User,
  Layers,
  ChevronRight,
  Info,
  Check,
  X,
  Printer,
  CheckSquare,
  GraduationCap
} from 'lucide-react';
import { LaporanCeklisGuruView } from './LaporanCeklisGuruView';
import { RiwayatPelatihanGuruView } from './RiwayatPelatihanGuruView';

const KATEGORI_OPTIONS: KategoriAdministrasiGuru[] = [
  'Perencanaan Pembelajaran',
  'Pelaksanaan Pembelajaran',
  'Administrasi Penilaian',
  'Administrasi Kesiswaan',
  'Administrasi Pendukung'
];

const ASPEK_APRESIASI_PRESETS = [
  'Sesuai Capaian Pembelajaran',
  'Berdiferensiasi',
  'Kreatif & Inovatif',
  'Rapi & Tepat Waktu',
  'Reflektif & Bermakna',
  'Kolaborasi Orang Tua',
  'Asesmen Komprehensif',
  'Kontekstual Kearifan Lokal'
];

const CONTOH_UMPAN_BALIK_POSITIF = [
  'Luar biasa! Dokumen administrasi disusun sangat runtut, sistematis, dan selaras dengan prinsip Kurikulum Merdeka.',
  'Apresiasi tinggi atas dedikasi dan kerapian penyusunan perangkat ajar ini. Langkah pembelajaran diferensiasi terlihat sangat nyata.',
  'Sangat komprehensif dan tepat waktu. Instrumen asesmen yang dirancang memfasilitasi pemetaan kompetensi murid secara akurat.',
  'Refleksi mengajar yang sangat mendalam dan berpihak pada murid. Teruskan inovasi dan semangat mendidik generasi penerus!'
];

export const AdministrasiGuruView: React.FC = () => {
  const {
    currentUser,
    users,
    administrasiGuruList,
    riwayatPelatihanList,
    addAdministrasiGuru,
    updateAdministrasiGuru,
    deleteAdministrasiGuru,
    kirimAdministrasiGuru,
    berikanUmpanBalikPositif,
    showToast
  } = useApp();

  const isGuru = currentUser.role === 'guru';
  const isKS = currentUser.role === 'kepala_sekolah';
  const isAdmin = currentUser.role === 'admin';

  // Sub-Navigation Tab: 'ceklis' (Laporan Ceklis Supervisi Guru), 'daftar' (Arsip & Unggah Dokumen), or 'pelatihan' (Riwayat Pelatihan Guru)
  const [activeViewTab, setActiveViewTab] = useState<'ceklis' | 'daftar' | 'pelatihan'>('daftar');

  // Filters
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedGuruFilter, setSelectedGuruFilter] = useState<string>('Semua');
  const [onlyMyDocs, setOnlyMyDocs] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingDoc, setEditingDoc] = useState<DokumenAdministrasiGuru | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DokumenAdministrasiGuru | null>(null);
  const [feedbackDoc, setFeedbackDoc] = useState<DokumenAdministrasiGuru | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    guruId: string;
    namaGuru: string;
    nipGuru: string;
    kategori: KategoriAdministrasiGuru;
    jenisDokumen: string;
    judul: string;
    tahunAjaran: string;
    semester: string;
    kelas: string;
    mataPelajaran: string;
    tanggalUpload: string;
    fileUrl: string;
    fileName: string;
    fileSize: string;
    catatanGuru: string;
  }>({
    guruId: currentUser.id,
    namaGuru: currentUser.nama,
    nipGuru: currentUser.nip || '-',
    kategori: 'Perencanaan Pembelajaran',
    jenisDokumen: 'Modul Ajar (pengganti RPP, berisi tujuan, langkah kegiatan, asesmen)',
    judul: '',
    tahunAjaran: '2024/2025',
    semester: 'Semester 1 (Ganjil)',
    kelas: 'Kelas 1A',
    mataPelajaran: 'Bahasa Indonesia',
    tanggalUpload: new Date().toISOString().split('T')[0],
    fileUrl: '',
    fileName: '',
    fileSize: '',
    catatanGuru: ''
  });

  // Feedback Form State
  const [feedbackData, setFeedbackData] = useState<{
    umpanBalikPositif: string;
    penilaiKS: string;
    bintangApresiasi: number;
    aspekApresiasi: string[];
    status: DokumenAdministrasiGuru['status'];
  }>({
    umpanBalikPositif: '',
    penilaiKS: currentUser.nama || 'Dra. Hj. Rosdiana, M.Pd.',
    bintangApresiasi: 5,
    aspekApresiasi: ['Sesuai Capaian Pembelajaran', 'Kreatif & Inovatif'],
    status: 'Disetujui Penuh'
  });

  // Available document types based on selected kategori in form
  const currentCategoryObj = MASTER_JENIS_DOKUMEN_GURU.find(
    k => k.kategori === formData.kategori
  );
  const availableDocTypes = currentCategoryObj ? currentCategoryObj.items : [];

  // Filtered List
  const filteredList = useMemo(() => {
    return administrasiGuruList.filter(item => {
      // If onlyMyDocs is active
      if (onlyMyDocs) {
        const isMine =
          item.guruId === currentUser.id ||
          (item.namaGuru && currentUser.nama && item.namaGuru.toLowerCase().includes(currentUser.nama.toLowerCase())) ||
          (currentUser.nip && item.nipGuru && item.nipGuru.replace(/\s+/g, '') === currentUser.nip.replace(/\s+/g, ''));
        if (!isMine) return false;
      }
      const matchesGuru = selectedGuruFilter === 'Semua' || item.guruId === selectedGuruFilter;
      const matchesKategori = selectedKategori === 'Semua' || item.kategori === selectedKategori;
      const matchesStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaGuru.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jenisDokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mataPelajaran && item.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesGuru && matchesKategori && matchesStatus && matchesSearch;
    });
  }, [administrasiGuruList, selectedGuruFilter, selectedKategori, selectedStatus, searchQuery, onlyMyDocs, currentUser]);

  // Statistics
  const stats = useMemo(() => {
    const total = administrasiGuruList.length;
    const disetujui = administrasiGuruList.filter(d => d.status === 'Disetujui Penuh').length;
    const menunggu = administrasiGuruList.filter(d => d.status === 'Terkirim' || d.status === 'Ditinjau KS').length;
    const draft = administrasiGuruList.filter(d => d.status === 'Draft').length;
    return { total, disetujui, menunggu, draft };
  }, [administrasiGuruList]);

  // Handle open add modal
  const handleOpenAddModal = () => {
    setEditingDoc(null);
    setFormData({
      guruId: currentUser.id,
      namaGuru: currentUser.nama,
      nipGuru: currentUser.nip || '-',
      kategori: 'Perencanaan Pembelajaran',
      jenisDokumen: 'Modul Ajar (pengganti RPP, berisi tujuan, langkah kegiatan, asesmen)',
      judul: '',
      tahunAjaran: '2024/2025',
      semester: 'Semester 1 (Ganjil)',
      kelas: 'Kelas 1A',
      mataPelajaran: 'Tematik Terpadu / Guru Kelas',
      tanggalUpload: new Date().toISOString().split('T')[0],
      fileUrl: '',
      fileName: '',
      fileSize: '',
      catatanGuru: ''
    });
    setIsFormModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (docItem: DokumenAdministrasiGuru) => {
    setEditingDoc(docItem);
    setFormData({
      guruId: docItem.guruId,
      namaGuru: docItem.namaGuru,
      nipGuru: docItem.nipGuru || '',
      kategori: docItem.kategori,
      jenisDokumen: docItem.jenisDokumen,
      judul: docItem.judul,
      tahunAjaran: docItem.tahunAjaran,
      semester: docItem.semester,
      kelas: docItem.kelas,
      mataPelajaran: docItem.mataPelajaran || '',
      tanggalUpload: docItem.tanggalUpload,
      fileUrl: docItem.fileUrl || '',
      fileName: docItem.fileName || '',
      fileSize: docItem.fileSize || '',
      catatanGuru: docItem.catatanGuru || ''
    });
    setIsFormModalOpen(true);
  };

  // Handle form submit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      showToast('warning', 'Judul Wajib Diisi', 'Mohon lengkapi judul dokumen administrasi guru.');
      return;
    }

    if (editingDoc) {
      updateAdministrasiGuru(editingDoc.id, {
        ...formData,
        status: editingDoc.status === 'Disetujui Penuh' ? 'Ditinjau KS' : editingDoc.status
      });
      showToast('success', 'Dokumen Diperbarui', 'Data dokumen administrasi guru berhasil diperbarui.');
    } else {
      addAdministrasiGuru({
        ...formData,
        status: 'Draft'
      });
      showToast('success', 'Dokumen Disimpan', 'Dokumen administrasi berhasil disimpan sebagai Draft. Jangan lupa klik Kirim jika siap dinilai.');
    }

    setIsFormModalOpen(false);
    setEditingDoc(null);
  };

  // Handle open feedback modal (for Kepala Sekolah / Admin)
  const handleOpenFeedbackModal = (docItem: DokumenAdministrasiGuru) => {
    setFeedbackDoc(docItem);
    setFeedbackData({
      umpanBalikPositif: docItem.umpanBalikPositif || '',
      penilaiKS: currentUser.nama || 'Dra. Hj. Rosdiana, M.Pd.',
      bintangApresiasi: docItem.bintangApresiasi || 5,
      aspekApresiasi: docItem.aspekApresiasi && docItem.aspekApresiasi.length > 0 ? docItem.aspekApresiasi : ['Sesuai Capaian Pembelajaran', 'Kreatif & Inovatif'],
      status: docItem.status === 'Disetujui Penuh' ? 'Disetujui Penuh' : 'Disetujui Penuh'
    });
  };

  // Handle submit feedback
  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackDoc) return;
    if (!feedbackData.umpanBalikPositif.trim()) {
      showToast('warning', 'Umpan Balik Wajib Diisi', 'Silakan tuliskan catatan apresiasi atau umpan balik positif untuk guru.');
      return;
    }

    berikanUmpanBalikPositif(feedbackDoc.id, feedbackData);
    setFeedbackDoc(null);
  };

  // Quick preset feedback filler
  const handleSelectPresetFeedback = (text: string) => {
    setFeedbackData(prev => ({
      ...prev,
      umpanBalikPositif: prev.umpanBalikPositif ? `${prev.umpanBalikPositif} ${text}` : text
    }));
  };

  // Toggle feedback tag
  const handleToggleAspect = (tag: string) => {
    setFeedbackData(prev => {
      const exists = prev.aspekApresiasi.includes(tag);
      return {
        ...prev,
        aspekApresiasi: exists
          ? prev.aspekApresiasi.filter(t => t !== tag)
          : [...prev.aspekApresiasi, tag]
      };
    });
  };

  // Handle Delete
  const handleDeleteDoc = (id: string) => {
    deleteAdministrasiGuru(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold tracking-wide border border-emerald-400/30 flex items-center gap-1.5">
                <FolderCheck className="w-3.5 h-3.5" />
                MODUL ADMINISTRASI GURU
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-400/20">
                TA 2024/2025
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Administrasi & Perangkat Ajar Guru
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
              Platform pengelolaan dokumen perangkat pembelajaran guru (Perencanaan, Pelaksanaan, Penilaian, Kesiswaan, Pendukung), terintegrasi langsung dengan Google Drive dan fitur Umpan Balik Positif Kepala Sekolah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              id="btn-drive-folder-guru"
              href={TARGET_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Buka Google Drive</span>
            </a>

            <button
              id="btn-tambah-dokumen-guru"
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Dokumen Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Mode Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-administrasi-ceklis"
            type="button"
            onClick={() => setActiveViewTab('ceklis')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeViewTab === 'ceklis'
                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-200'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Laporan Ceklis Supervisi Guru (Kepala Sekolah)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeViewTab === 'ceklis' ? 'bg-emerald-800/70 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
            }`}>
              18 Dokumen
            </span>
          </button>

          <button
            id="tab-administrasi-daftar"
            type="button"
            onClick={() => setActiveViewTab('daftar')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeViewTab === 'daftar'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-200'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FolderCheck className="w-4 h-4" />
            <span>Arsip & Unggah Berkas Guru</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeViewTab === 'daftar' ? 'bg-blue-800/70 text-blue-100' : 'bg-blue-100 text-blue-800'
            }`}>
              {administrasiGuruList.length} Berkas
            </span>
          </button>

          <button
            id="tab-administrasi-pelatihan"
            type="button"
            onClick={() => setActiveViewTab('pelatihan')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeViewTab === 'pelatihan'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-200'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Riwayat Pelatihan Guru</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeViewTab === 'pelatihan' ? 'bg-indigo-800/70 text-indigo-100' : 'bg-indigo-100 text-indigo-800'
            }`}>
              {riwayatPelatihanList.length} Kegiatan
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sinkronisasi Google Drive Aktif</span>
        </div>
      </div>

      {/* TAB CONTENT 1: LAPORAN CEKLIS SUPERVISI ADMINISTRASI GURU (KEPALA SEKOLAH) */}
      {activeViewTab === 'ceklis' && (
        <LaporanCeklisGuruView
          onOpenFeedbackModal={handleOpenFeedbackModal}
          onOpenPreviewModal={setPreviewDoc}
        />
      )}

      {/* TAB CONTENT 2: ARSIP & DAFTAR BERKAS DOKUMEN GURU */}
      {activeViewTab === 'daftar' && (
        <div className="space-y-6">
          {/* Overview Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Dokumen Guru</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
                <span className="text-[11px] text-slate-500 font-medium">berkas</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">Disetujui & Diapresiasi</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">{stats.disetujui}</span>
                <span className="text-[11px] text-emerald-600 font-medium">dokumen</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600">Menunggu Umpan Balik</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-700">{stats.menunggu}</span>
                <span className="text-[11px] text-amber-600 font-medium">perlu review</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Draft Belum Dikirim</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-700">{stats.draft}</span>
                <span className="text-[11px] text-slate-500 font-medium">draf guru</span>
              </div>
            </div>
          </div>

      {/* Categories Guide Tab Quick Reference */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              5 Pilar Standar Administrasi Guru SDN Lanto Dg. Pasewang
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">Klik kategori untuk memfilter</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {MASTER_JENIS_DOKUMEN_GURU.map(kat => {
            const count = administrasiGuruList.filter(d => d.kategori === kat.kategori).length;
            const isSelected = selectedKategori === kat.kategori;
            return (
              <button
                key={kat.kategori}
                type="button"
                onClick={() => setSelectedKategori(isSelected ? 'Semua' : kat.kategori)}
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-200'
                    : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    Pilar {kat.nomor}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">{count}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1.5 leading-snug line-clamp-1">
                  {kat.kategori}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  {kat.items.length} jenis instrumen
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-administrasi-guru"
              type="text"
              placeholder="Cari judul dokumen, nama guru, mata pelajaran, jenis dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Kategori Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="filter-kategori-administrasi-guru"
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Semua">Semua Kategori (5 Pilar)</option>
              {KATEGORI_OPTIONS.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              id="filter-status-administrasi-guru"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Terkirim">Terkirim</option>
              <option value="Ditinjau KS">Ditinjau KS</option>
              <option value="Disetujui Penuh">Disetujui Penuh (Diapresiasi)</option>
              <option value="Perlu Revisi">Perlu Revisi</option>
            </select>

            {/* Filter by Guru */}
            <select
              id="filter-guru-administrasi-guru"
              value={selectedGuruFilter}
              onChange={(e) => {
                setSelectedGuruFilter(e.target.value);
                if (e.target.value !== 'Semua') setOnlyMyDocs(false);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:border-blue-500 max-w-[180px]"
            >
              <option value="Semua">Semua Guru</option>
              {users.filter(u => u.role === 'guru').map(g => (
                <option key={g.id} value={g.id}>{g.nama}</option>
              ))}
            </select>

            {/* Quick Toggle: Dokumen Saya */}
            <button
              type="button"
              onClick={() => {
                setOnlyMyDocs(!onlyMyDocs);
                if (!onlyMyDocs) setSelectedGuruFilter('Semua');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                onlyMyDocs
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Filter dokumen milik akun saya saat ini"
            >
              <User className="w-3.5 h-3.5" />
              <span>Dokumen Saya</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedKategori !== 'Semua' || selectedStatus !== 'Semua' || selectedGuruFilter !== 'Semua' || onlyMyDocs || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex-wrap">
            <span>Filter Aktif:</span>
            {onlyMyDocs && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Dokumen Saya ({currentUser.nama})
                <button type="button" onClick={() => setOnlyMyDocs(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedKategori !== 'Semua' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {selectedKategori}
                <button type="button" onClick={() => setSelectedKategori('Semua')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedStatus !== 'Semua' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Status: {selectedStatus}
                <button type="button" onClick={() => setSelectedStatus('Semua')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGuruFilter !== 'Semua' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                Guru: {users.find(u => u.id === selectedGuruFilter)?.nama || selectedGuruFilter}
                <button type="button" onClick={() => setSelectedGuruFilter('Semua')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedKategori('Semua');
                setSelectedStatus('Semua');
                setSelectedGuruFilter('Semua');
                setOnlyMyDocs(false);
                setSearchQuery('');
              }}
              className="text-blue-600 font-bold hover:underline ml-auto"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Document Table & Cards */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Dokumen Administrasi Guru ({filteredList.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Dokumen tersinkronisasi otomatis dengan Google Drive dan arsip data sekolah
            </p>
          </div>

          <div className="text-[11px] font-medium text-slate-500">
            Peran Anda: <span className="font-bold text-slate-800">{currentUser.nama} ({currentUser.role.toUpperCase()})</span>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FolderCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">Tidak ada dokumen yang ditemukan</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Belum ada berkas administrasi guru untuk filter yang dipilih atau kata kunci pencarian.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Dokumen Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Guru & Identitas</th>
                  <th className="py-3 px-4">Pilar & Jenis Dokumen</th>
                  <th className="py-3 px-4">Judul Dokumen & Berkas</th>
                  <th className="py-3 px-4">Tgl Upload / Kirim</th>
                  <th className="py-3 px-4">Status & Apresiasi KS</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredList.map((docItem) => {
                  const isOwner =
                    currentUser.id === docItem.guruId ||
                    currentUser.nama === docItem.namaGuru ||
                    (currentUser.nip && docItem.nipGuru && currentUser.nip.replace(/\s+/g, '') === docItem.nipGuru.replace(/\s+/g, '')) ||
                    isGuru ||
                    isAdmin;
                  const canEditOrDelete = isOwner || isGuru || isAdmin;
                  const canFeedback = isKS || isAdmin;

                  return (
                    <tr key={docItem.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Guru & Identitas */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-slate-900 leading-snug">
                          {docItem.namaGuru}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          NIP: {docItem.nipGuru || '-'}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {docItem.kelas}
                          </span>
                          {docItem.mataPelajaran && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium truncate max-w-[130px]" title={docItem.mataPelajaran}>
                              {docItem.mataPelajaran}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Pilar & Jenis Dokumen */}
                      <td className="py-3.5 px-4 align-top max-w-[220px]">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-1">
                          {docItem.kategori}
                        </span>
                        <div className="text-xs font-semibold text-slate-800 leading-snug">
                          {docItem.jenisDokumen}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {docItem.tahunAjaran} • {docItem.semester}
                        </div>
                      </td>

                      {/* Judul Dokumen & Berkas */}
                      <td className="py-3.5 px-4 align-top max-w-[260px]">
                        <div className="font-bold text-slate-900 leading-snug">
                          {docItem.judul}
                        </div>
                        {docItem.catatanGuru && (
                          <div className="text-[11px] text-slate-500 mt-1 italic line-clamp-2">
                            "{docItem.catatanGuru}"
                          </div>
                        )}

                        {/* File badge */}
                        <div className="mt-2 flex items-center gap-2">
                          <a
                            href={docItem.fileUrl || TARGET_DRIVE_FOLDER_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-semibold border border-blue-200 transition-colors"
                          >
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span className="truncate max-w-[160px]">{docItem.fileName || 'Lihat di Google Drive'}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                          {docItem.fileSize && (
                            <span className="text-[10px] text-slate-400 font-mono">{docItem.fileSize}</span>
                          )}
                        </div>
                      </td>

                      {/* Tgl Upload / Kirim */}
                      <td className="py-3.5 px-4 align-top text-[11px] space-y-1">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Upload: {docItem.tanggalUpload}</span>
                        </div>
                        {docItem.tanggalKirim && (
                          <div className="flex items-center gap-1 text-blue-600 font-medium">
                            <Send className="w-3 h-3 text-blue-500" />
                            <span>Kirim: {docItem.tanggalKirim}</span>
                          </div>
                        )}
                      </td>

                      {/* Status & Apresiasi KS */}
                      <td className="py-3.5 px-4 align-top max-w-[240px]">
                        {/* Status badge */}
                        <div className="mb-1.5">
                          {docItem.status === 'Disetujui Penuh' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Disetujui Penuh
                            </span>
                          )}
                          {docItem.status === 'Terkirim' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              <Clock className="w-3 h-3" />
                              Menunggu Review KS
                            </span>
                          )}
                          {docItem.status === 'Ditinjau KS' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                              <Sparkles className="w-3 h-3" />
                              Sedang Ditinjau KS
                            </span>
                          )}
                          {docItem.status === 'Draft' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                              <Edit2 className="w-3 h-3" />
                              Draft Belum Dikirim
                            </span>
                          )}
                          {docItem.status === 'Perlu Revisi' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <AlertCircle className="w-3 h-3" />
                              Perlu Revisi
                            </span>
                          )}
                        </div>

                        {/* Positive feedback snippet if available */}
                        {docItem.umpanBalikPositif ? (
                          <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px]">
                            <div className="flex items-center gap-1 text-emerald-800 font-bold">
                              <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Apresiasi KS:</span>
                              <div className="flex items-center ml-auto text-amber-500">
                                {[...Array(docItem.bintangApresiasi || 5)].map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-700 mt-1 italic text-[10.5px] leading-relaxed line-clamp-3">
                              "{docItem.umpanBalikPositif}"
                            </p>
                            <div className="text-[9.5px] text-emerald-700 mt-1 font-medium">
                              — {docItem.penilaiKS || 'Kepala Sekolah'}
                            </div>

                            {docItem.aspekApresiasi && docItem.aspekApresiasi.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {docItem.aspekApresiasi.map(tag => (
                                  <span key={tag} className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-semibold">
                                    ✓ {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic">
                            {docItem.status === 'Draft' ? 'Kirimkan dokumen agar dapat dinilai KS' : 'Belum ada catatan umpan balik'}
                          </div>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 align-top text-right space-y-1.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview / Detail */}
                          <button
                            id={`btn-preview-${docItem.id}`}
                            type="button"
                            onClick={() => setPreviewDoc(docItem)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Lihat Detail & Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Send to KS (for Guru) */}
                          {docItem.status === 'Draft' && (isOwner || isAdmin) && (
                            <button
                              id={`btn-kirim-${docItem.id}`}
                              type="button"
                              onClick={() => kirimAdministrasiGuru(docItem.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                              title="Kirim dokumen ke Kepala Sekolah"
                            >
                              <Send className="w-3 h-3" />
                              <span>Kirim</span>
                            </button>
                          )}

                          {/* Feedback button (for Kepala Sekolah / Admin) */}
                          {canFeedback && (
                            <button
                              id={`btn-feedback-${docItem.id}`}
                              type="button"
                              onClick={() => handleOpenFeedbackModal(docItem)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                              title="Berikan Umpan Balik Positif"
                            >
                              <MessageSquareHeart className="w-3 h-3" />
                              <span>{docItem.umpanBalikPositif ? 'Edit Umpan Balik' : 'Beri Umpan Balik'}</span>
                            </button>
                          )}

                          {/* Edit button */}
                          {canEditOrDelete && (
                            <button
                              id={`btn-edit-${docItem.id}`}
                              type="button"
                              onClick={() => handleOpenEditModal(docItem)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Edit Dokumen"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete button */}
                          {canEditOrDelete && (
                            <button
                              id={`btn-delete-${docItem.id}`}
                              type="button"
                              onClick={() => setDeleteConfirmId(docItem.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Hapus Dokumen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )}

      {/* TAB CONTENT 3: RIWAYAT PELATIHAN GURU */}
      {activeViewTab === 'pelatihan' && (
        <RiwayatPelatihanGuruView />
      )}

      {/* MODAL: FORM TAMBAH / EDIT DOKUMEN */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingDoc ? 'Edit Dokumen Administrasi Guru' : 'Formulir Upload Dokumen Administrasi Guru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih kategori (5 Pilar), jenis instrumen, dan lampirkan file ke Google Drive sekolah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-5 space-y-4">
              {/* Guru / Pemilik */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guru Pendidik / Pemilik Dokumen
                  </label>
                  {isAdmin ? (
                    <select
                      value={formData.guruId}
                      onChange={(e) => {
                        const selectedUser = users.find(u => u.id === e.target.value);
                        if (selectedUser) {
                          setFormData(prev => ({
                            ...prev,
                            guruId: selectedUser.id,
                            namaGuru: selectedUser.nama,
                            nipGuru: selectedUser.nip || '-'
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      {users.filter(u => u.role === 'guru').map(g => (
                        <option key={g.id} value={g.id}>{g.nama} ({g.nip || 'Guru'})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
                      {formData.namaGuru}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP / Identitas Pegawai
                  </label>
                  <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-mono">
                    {formData.nipGuru || '-'}
                  </div>
                </div>
              </div>

              {/* Kategori 5 Pilar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Kategori Pilar Administrasi Guru <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => {
                    const newKat = e.target.value as KategoriAdministrasiGuru;
                    const catObj = MASTER_JENIS_DOKUMEN_GURU.find(k => k.kategori === newKat);
                    const firstItemName = catObj?.items[0]?.nama || '';
                    setFormData(prev => ({
                      ...prev,
                      kategori: newKat,
                      jenisDokumen: firstItemName
                    }));
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  {KATEGORI_OPTIONS.map((k, idx) => (
                    <option key={k} value={k}>
                      Pilar {idx + 1}: {k}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  {currentCategoryObj?.deskripsi}
                </p>
              </div>

              {/* Jenis Dokumen Cascading Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Jenis Dokumen / Instrumen Spesifik <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.jenisDokumen}
                  onChange={(e) => setFormData(prev => ({ ...prev, jenisDokumen: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  {availableDocTypes.map(item => (
                    <option key={item.nama} value={item.nama}>
                      {item.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Judul Dokumen */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Judul Lengkap Dokumen <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Modul Ajar IPAS Fase B Kelas 4B - Bagian Tumbuhan & Fungsinya"
                  value={formData.judul}
                  onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Academic Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData(prev => ({ ...prev, tahunAjaran: e.target.value }))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Semester 1 (Ganjil)">Semester 1 (Ganjil)</option>
                    <option value="Semester 2 (Genap)">Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kelas / Rombel
                  </label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData(prev => ({ ...prev, kelas: e.target.value }))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Kelas 1A">Kelas 1A</option>
                    <option value="Kelas 1B">Kelas 1B</option>
                    <option value="Kelas 2A">Kelas 2A</option>
                    <option value="Kelas 2B">Kelas 2B</option>
                    <option value="Kelas 3A">Kelas 3A</option>
                    <option value="Kelas 3B">Kelas 3B</option>
                    <option value="Kelas 4A">Kelas 4A</option>
                    <option value="Kelas 4B">Kelas 4B</option>
                    <option value="Kelas 5A">Kelas 5A</option>
                    <option value="Kelas 5B">Kelas 5B</option>
                    <option value="Kelas 6A">Kelas 6A</option>
                    <option value="Kelas 6B">Kelas 6B</option>
                    <option value="Semua Kelas">Semua Kelas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    placeholder="Bahasa Indonesia / IPAS / PAI"
                    value={formData.mataPelajaran}
                    onChange={(e) => setFormData(prev => ({ ...prev, mataPelajaran: e.target.value }))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Tanggal Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Upload
                </label>
                <input
                  type="date"
                  value={formData.tanggalUpload}
                  onChange={(e) => setFormData(prev => ({ ...prev, tanggalUpload: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Drive Upload Component */}
              <DriveFileUpload
                label="4. Lampiran Dokumen (Simpan ke Google Drive Sekolah)"
                category={`Administrasi Guru - ${formData.kategori}`}
                initialUrl={formData.fileUrl}
                onUploadSuccess={(url, driveFile) => {
                  setFormData(prev => ({
                    ...prev,
                    fileUrl: url,
                    fileName: driveFile?.name || prev.fileName || 'Dokumen_Administrasi_Guru.pdf',
                    fileSize: 'Google Drive Asset'
                  }));
                }}
                helperText="File yang diunggah akan tersimpan rapi di Folder Google Drive UPTD SPF SDN Lanto Dg. Pasewang."
              />

              {/* Catatan / Ringkasan Guru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5. Catatan / Deskripsi Singkat Guru
                </label>
                <textarea
                  rows={2}
                  placeholder="Tambahkan catatan khusus, tujuan asesmen, atau poin pembeda perangkat ajar ini..."
                  value={formData.catatanGuru}
                  onChange={(e) => setFormData(prev => ({ ...prev, catatanGuru: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingDoc ? 'Simpan Perubahan' : 'Simpan Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL & PREVIEW DOKUMEN */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FolderCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                    {previewDoc.kategori}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                    {previewDoc.judul}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Guru Pendidik</div>
                  <div className="font-bold text-slate-800 mt-0.5">{previewDoc.namaGuru}</div>
                  <div className="text-[10px] text-slate-500 font-mono">NIP: {previewDoc.nipGuru || '-'}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Jenis Instrumen</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{previewDoc.jenisDokumen}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Kelas & Mapel</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{previewDoc.kelas} • {previewDoc.mataPelajaran || 'Umum'}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Tahun & Semester</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{previewDoc.tahunAjaran} ({previewDoc.semester})</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Tanggal Upload</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{previewDoc.tanggalUpload}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Status Penilaian</div>
                  <div className="font-bold text-emerald-700 mt-0.5">{previewDoc.status}</div>
                </div>
              </div>

              {/* Catatan Guru */}
              {previewDoc.catatanGuru && (
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="text-[11px] font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    Catatan Guru:
                  </div>
                  <p className="text-slate-700 leading-relaxed italic text-xs">
                    "{previewDoc.catatanGuru}"
                  </p>
                </div>
              )}

              {/* Umpan Balik Positif Kepala Sekolah */}
              {previewDoc.umpanBalikPositif && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <MessageSquareHeart className="w-4 h-4 text-emerald-600" />
                      Umpan Balik Positif Kepala Sekolah
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(previewDoc.bintangApresiasi || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-800 italic leading-relaxed text-xs">
                    "{previewDoc.umpanBalikPositif}"
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-200/60 text-[11px]">
                    <span className="font-semibold text-emerald-800">
                      Penilai: {previewDoc.penilaiKS || 'Kepala Sekolah'}
                    </span>
                    <span className="text-slate-500">
                      Tgl Umpan Balik: {previewDoc.tanggalUmpanBalik || '-'}
                    </span>
                  </div>

                  {previewDoc.aspekApresiasi && previewDoc.aspekApresiasi.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {previewDoc.aspekApresiasi.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Google Drive Link Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate">
                      {previewDoc.fileName || 'Dokumen Google Drive'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Tersimpan di Cloud SDN Lanto Dg. Pasewang
                    </div>
                  </div>
                </div>

                <a
                  href={previewDoc.fileUrl || TARGET_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shrink-0"
                >
                  <span>Buka Dokumen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {previewDoc.status === 'Draft' && (
                  <button
                    type="button"
                    onClick={() => {
                      kirimAdministrasiGuru(previewDoc.id);
                      setPreviewDoc(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim ke KS</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const docToEdit = previewDoc;
                    setPreviewDoc(null);
                    handleOpenEditModal(docToEdit);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Dokumen</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const docId = previewDoc.id;
                    setPreviewDoc(null);
                    setDeleteConfirmId(docId);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UMPAN BALIK POSITIF KEPALA SEKOLAH */}
      {feedbackDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Beri Umpan Balik Positif & Apresiasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Umpan balik pembinaan yang menguatkan motivasi dan mutu perangkat ajar guru
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackDoc(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="mt-5 space-y-4">
              {/* Dokumen Info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Target Dokumen Guru
                </div>
                <div className="font-bold text-slate-900 mt-0.5">{feedbackDoc.judul}</div>
                <div className="text-slate-600 mt-0.5">
                  Guru: <span className="font-semibold text-blue-700">{feedbackDoc.namaGuru}</span> ({feedbackDoc.kelas} • {feedbackDoc.jenisDokumen})
                </div>
              </div>

              {/* Rating Bintang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bintang Apresiasi Kualitas
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData(prev => ({ ...prev, bintangApresiasi: star }))}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackData.bintangApresiasi
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {feedbackData.bintangApresiasi} dari 5 Bintang
                  </span>
                </div>
              </div>

              {/* Aspek Keunggulan / Apresiasi Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Aspek Keunggulan Dokumen (Pilih satu atau lebih)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ASPEK_APRESIASI_PRESETS.map(aspect => {
                    const isSelected = feedbackData.aspekApresiasi.includes(aspect);
                    return (
                      <button
                        key={aspect}
                        type="button"
                        onClick={() => handleToggleAspect(aspect)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {aspect}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Preset Feedback Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Template Kalimat Umpan Balik Positif
                  </label>
                  <span className="text-[10px] text-slate-400">Klik untuk menyalin</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar p-1">
                  {CONTOH_UMPAN_BALIK_POSITIF.map((contoh, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetFeedback(contoh)}
                      className="w-full text-left p-2 rounded-lg bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100 text-[11px] text-slate-700 transition-colors leading-relaxed cursor-pointer"
                    >
                      "{contoh}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Umpan Balik Positif Kepala Sekolah <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan catatan apresiasi, kalimat penguatan, dan rekomendasi positif untuk guru..."
                  value={feedbackData.umpanBalikPositif}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, umpanBalikPositif: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                  required
                />
              </div>

              {/* Status Persetujuan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Status Dokumen
                  </label>
                  <select
                    value={feedbackData.status}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, status: e.target.value as DokumenAdministrasiGuru['status'] }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value="Disetujui Penuh">Disetujui Penuh (Apresiasi)</option>
                    <option value="Ditinjau KS">Sedang Ditinjau</option>
                    <option value="Perlu Revisi">Perlu Revisi Ringan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Penilai (Kepala Sekolah)
                  </label>
                  <input
                    type="text"
                    value={feedbackData.penilaiKS}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, penilaiKS: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFeedbackDoc(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Kirim Umpan Balik Positif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Hapus Dokumen Administrasi?</h4>
            <p className="text-xs text-slate-500 mt-1">
              Dokumen ini akan dihapus dari daftar administrasi sekolah. Berkas yang sudah tersimpan di Google Drive tetap aman di cloud.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteDoc(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
