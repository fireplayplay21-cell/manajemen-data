import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  DokumenAdministrasiGuru,
  KategoriAdministrasiGuru,
  UserAccount
} from '../../../types';
import {
  MASTER_JENIS_DOKUMEN_GURU
} from '../../../data/initialData';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquareHeart,
  Star,
  Search,
  Filter,
  Eye,
  ExternalLink,
  Printer,
  Sparkles,
  Award,
  Calendar,
  User,
  Layers,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Share2,
  FileCheck,
  Building2,
  Check,
  X,
  FileText,
  ShieldCheck,
  Send
} from 'lucide-react';

interface LaporanCeklisGuruViewProps {
  onOpenFeedbackModal: (docItem: DokumenAdministrasiGuru) => void;
  onOpenPreviewModal: (docItem: DokumenAdministrasiGuru) => void;
}

export const LaporanCeklisGuruView: React.FC<LaporanCeklisGuruViewProps> = ({
  onOpenFeedbackModal,
  onOpenPreviewModal
}) => {
  const {
    currentUser,
    users,
    administrasiGuruList,
    profilSekolah,
    showToast
  } = useApp();

  const isKS = currentUser.role === 'kepala_sekolah';
  const isAdmin = currentUser.role === 'admin';

  // View Mode: 'matriks' | 'kartu' | 'cetak'
  const [viewMode, setViewMode] = useState<'matriks' | 'kartu' | 'cetak'>('matriks');

  // Filters
  const [selectedGuru, setSelectedGuru] = useState<string>('Semua');
  const [selectedPilar, setSelectedPilar] = useState<string>('Semua');
  const [selectedStatusKelengkapan, setSelectedStatusKelengkapan] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTeacherId, setExpandedTeacherId] = useState<string | null>(null);

  // List of all active teachers
  const guruList = useMemo(() => {
    return users.filter(u => u.role === 'guru');
  }, [users]);

  // Flattened all 18 standard items across the 5 pillars
  const allMasterItems = useMemo(() => {
    const list: {
      pilarNomor: number;
      kategori: KategoriAdministrasiGuru;
      namaItem: string;
      deskripsi: string;
      idKey: string;
    }[] = [];

    MASTER_JENIS_DOKUMEN_GURU.forEach(kat => {
      kat.items.forEach((item, idx) => {
        list.push({
          pilarNomor: kat.nomor,
          kategori: kat.kategori,
          namaItem: item.nama,
          deskripsi: item.deskripsi,
          idKey: `P${kat.nomor}-${idx}-${item.nama.substring(0, 15)}`
        });
      });
    });

    return list;
  }, []);

  // Filtered master items if pilar filter is active
  const displayedMasterItems = useMemo(() => {
    if (selectedPilar === 'Semua') return allMasterItems;
    return allMasterItems.filter(item => item.kategori === selectedPilar);
  }, [allMasterItems, selectedPilar]);

  // Process checklist data for each teacher
  const teacherChecklistData = useMemo(() => {
    return guruList.map(guru => {
      // Find all documents uploaded by this teacher
      const teacherDocs = administrasiGuruList.filter(doc => doc.guruId === guru.id);

      // Check each master document item
      const itemStatusList = allMasterItems.map(masterItem => {
        // Match document by guruId and fuzzy/exact match on jenisDokumen or kategori
        const matchingDoc = teacherDocs.find(doc => {
          if (doc.kategori !== masterItem.kategori) return false;
          // Clean strings for comparison
          const docType = doc.jenisDokumen.toLowerCase().trim();
          const masterType = masterItem.namaItem.toLowerCase().trim();
          return docType === masterType || docType.includes(masterType.substring(0, 15)) || masterType.includes(docType.substring(0, 15));
        });

        return {
          masterItem,
          isUploaded: !!matchingDoc,
          document: matchingDoc || null
        };
      });

      const totalStandard = allMasterItems.length; // 18 items
      const totalUploaded = itemStatusList.filter(i => i.isUploaded).length;
      const totalApproved = itemStatusList.filter(i => i.document?.status === 'Disetujui Penuh').length;
      const totalPending = itemStatusList.filter(i => i.document && (i.document.status === 'Terkirim' || i.document.status === 'Ditinjau KS')).length;
      const totalDraft = itemStatusList.filter(i => i.document?.status === 'Draft').length;
      const percentage = Math.round((totalUploaded / totalStandard) * 100);

      // Total Stars
      const totalStars = teacherDocs.reduce((acc, curr) => acc + (curr.bintangApresiasi || 0), 0);

      // Per Pilar Breakdown
      const pilarBreakdown = MASTER_JENIS_DOKUMEN_GURU.map(kat => {
        const katMasterItems = allMasterItems.filter(m => m.kategori === kat.kategori);
        const katUploaded = itemStatusList.filter(i => i.masterItem.kategori === kat.kategori && i.isUploaded).length;
        return {
          pilarNomor: kat.nomor,
          kategori: kat.kategori,
          uploaded: katUploaded,
          total: katMasterItems.length,
          percentage: Math.round((katUploaded / katMasterItems.length) * 100)
        };
      });

      return {
        guru,
        teacherDocs,
        itemStatusList,
        totalStandard,
        totalUploaded,
        totalApproved,
        totalPending,
        totalDraft,
        percentage,
        totalStars,
        pilarBreakdown
      };
    });
  }, [guruList, administrasiGuruList, allMasterItems]);

  // Filtered Teacher Checklist Data
  const filteredTeacherData = useMemo(() => {
    return teacherChecklistData.filter(item => {
      const matchesGuru = selectedGuru === 'Semua' || item.guru.id === selectedGuru;

      let matchesKelengkapan = true;
      if (selectedStatusKelengkapan === 'Lengkap') {
        matchesKelengkapan = item.percentage >= 80;
      } else if (selectedStatusKelengkapan === 'Sedang') {
        matchesKelengkapan = item.percentage >= 40 && item.percentage < 80;
      } else if (selectedStatusKelengkapan === 'PerluPerhatian') {
        matchesKelengkapan = item.percentage < 40;
      }

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.guru.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.guru.nip && item.guru.nip.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.guru.jabatan && item.guru.jabatan.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.guru.kelasTugas && item.guru.kelasTugas.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.guru.mataPelajaran && item.guru.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesGuru && matchesKelengkapan && matchesSearch;
    });
  }, [teacherChecklistData, selectedGuru, selectedStatusKelengkapan, searchQuery]);

  // Overall Statistics for Kepala Sekolah
  const overallStats = useMemo(() => {
    const totalTeachers = teacherChecklistData.length;
    if (totalTeachers === 0) return { avgPercentage: 0, fullyComplete: 0, pendingReview: 0, totalDocs: 0 };

    const sumPercentage = teacherChecklistData.reduce((acc, curr) => acc + curr.percentage, 0);
    const avgPercentage = Math.round(sumPercentage / totalTeachers);
    const fullyComplete = teacherChecklistData.filter(t => t.percentage === 100).length;
    const highComplete = teacherChecklistData.filter(t => t.percentage >= 80).length;
    const pendingReview = administrasiGuruList.filter(d => d.status === 'Terkirim' || d.status === 'Ditinjau KS').length;
    const totalApproved = administrasiGuruList.filter(d => d.status === 'Disetujui Penuh').length;

    return {
      totalTeachers,
      avgPercentage,
      fullyComplete,
      highComplete,
      pendingReview,
      totalApproved,
      totalDocs: administrasiGuruList.length
    };
  }, [teacherChecklistData, administrasiGuruList]);

  // Handle print
  const handlePrint = () => {
    setViewMode('cetak');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Quick reminder action
  const handleSendReminder = (guruNama: string) => {
    showToast('info', 'Notifikasi Pengingat Dikirim', `Pengingat kelengkapan dokumen administrasi telah dikirimkan ke ${guruNama}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 rounded-2xl p-5 text-white border border-emerald-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider border border-emerald-400/30 flex items-center gap-1.5 uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                SUPERVISI & KONTROL KEPALA SEKOLAH
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold border border-blue-400/20">
                Tahun Ajaran 2024/2025
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Laporan & Matriks Ceklis Administrasi Guru</span>
              <span className="text-xs font-normal text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700">
                18 Standar Dokumen (5 Pilar)
              </span>
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
              Monitoring langsung rekapitulasi kelengkapan berkas pembelajaran seluruh pendidik SDN Lanto Dg. Pasewang, memvalidasi dokumen terunggah, dan memberikan apresiasi/umpan balik positif pembinaan.
            </p>
          </div>

          {/* Action Buttons & View Mode */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
              <button
                id="btn-mode-matriks"
                type="button"
                onClick={() => setViewMode('matriks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'matriks'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Tabel Matriks
              </button>
              <button
                id="btn-mode-kartu"
                type="button"
                onClick={() => setViewMode('kartu')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'kartu'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Kartu Guru
              </button>
              <button
                id="btn-mode-cetak"
                type="button"
                onClick={() => setViewMode('cetak')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cetak'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Format Cetak
              </button>
            </div>

            {/* Print Button */}
            <button
              id="btn-cetak-laporan-ceklis"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards for Kepala Sekolah */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rata-rata Ketercapaian Sekolah</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{overallStats.avgPercentage}%</span>
            <span className="text-[11px] text-emerald-600 font-semibold">18 Instrumen Standar</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallStats.avgPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Guru Terdata & Aktif</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{overallStats.totalTeachers}</span>
            <span className="text-[11px] text-slate-500 font-medium">Guru Pendidik</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {overallStats.highComplete} guru mencapai kelengkapan &gt;80%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600">Perlu Review Kepala Sekolah</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{overallStats.pendingReview}</span>
            <span className="text-[11px] text-amber-600 font-medium">dokumen terkirim</span>
          </div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">
            Menunggu verifikasi & umpan balik
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">Dokumen Disetujui & Diapresiasi</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{overallStats.totalApproved}</span>
            <span className="text-[11px] text-emerald-600 font-medium">dari {overallStats.totalDocs} berkas</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-1">
            Tersinkron dengan Google Drive Sekolah
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-ceklis-guru"
              type="text"
              placeholder="Cari nama guru, NIP, kelas tugas, atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
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

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />

            {/* Filter by Guru */}
            <select
              id="filter-guru-ceklis"
              value={selectedGuru}
              onChange={(e) => setSelectedGuru(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500 max-w-[170px]"
            >
              <option value="Semua">Semua Guru ({guruList.length})</option>
              {guruList.map(g => (
                <option key={g.id} value={g.id}>{g.nama}</option>
              ))}
            </select>

            {/* Filter by Pilar */}
            <select
              id="filter-pilar-ceklis"
              value={selectedPilar}
              onChange={(e) => setSelectedPilar(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Semua">Semua 5 Pilar (18 Dokumen)</option>
              {MASTER_JENIS_DOKUMEN_GURU.map(kat => (
                <option key={kat.kategori} value={kat.kategori}>
                  Pilar {kat.nomor}: {kat.kategori}
                </option>
              ))}
            </select>

            {/* Filter by Kelengkapan */}
            <select
              id="filter-kelengkapan-ceklis"
              value={selectedStatusKelengkapan}
              onChange={(e) => setSelectedStatusKelengkapan(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Semua">Semua Kelengkapan</option>
              <option value="Lengkap">Sangat Lengkap (≥80%)</option>
              <option value="Sedang">Sedang Berproses (40-79%)</option>
              <option value="PerluPerhatian">Perlu Perhatian (&lt;40%)</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
          <span className="font-bold text-slate-700">Keterangan Status Ceklis:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Disetujui Penuh (Apresiasi KS)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Terkirim (Menunggu Review)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Draft</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Belum Diunggah</span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: TABEL MATRIKS CEKLIS LENGKAP */}
      {viewMode === 'matriks' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Matriks Supervisi Administrasi Guru ({filteredTeacherData.length} Pendidik)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Peta kelengkapan dokumen per guru berdasarkan 5 Pilar Standar Administrasi Sekolah Dasar
              </p>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{displayedMasterItems.length}</span> jenis instrumen standar
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-72 min-w-[280px] sticky left-0 bg-slate-100 z-10 shadow-xs">
                    Identitas Guru Pendidik
                  </th>
                  <th className="py-3 px-3 w-40 min-w-[150px] text-center">
                    Progress Kelengkapan
                  </th>
                  {displayedMasterItems.map((masterItem) => (
                    <th
                      key={masterItem.idKey}
                      className="py-3 px-3 min-w-[170px] max-w-[210px] text-center border-l border-slate-200"
                      title={masterItem.deskripsi}
                    >
                      <div className="text-[9px] text-indigo-700 font-bold">
                        Pilar {masterItem.pilarNomor}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-800 leading-tight line-clamp-2 mt-0.5">
                        {masterItem.namaItem}
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right sticky right-0 bg-slate-100 z-10">
                    Aksi Supervisi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTeacherData.map((tData) => {
                  const isExpanded = expandedTeacherId === tData.guru.id;

                  return (
                    <tr key={tData.guru.id} className="hover:bg-slate-50/90 transition-colors group">
                      {/* Identitas Guru Sticky Left */}
                      <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-slate-50/90 z-10 shadow-xs align-top">
                        <div className="font-bold text-slate-900 leading-snug">
                          {tData.guru.nama}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          NIP: {tData.guru.nip || '-'}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1 text-[9.5px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {tData.guru.kelasTugas || tData.guru.jabatan || 'Guru Kelas'}
                          </span>
                          {tData.guru.mataPelajaran && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium truncate max-w-[130px]" title={tData.guru.mataPelajaran}>
                              {tData.guru.mataPelajaran}
                            </span>
                          )}
                        </div>

                        {/* Stars badge if any */}
                        {tData.totalStars > 0 && (
                          <div className="flex items-center gap-1 text-amber-500 mt-1.5 text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{tData.totalStars} Bintang Apresiasi</span>
                          </div>
                        )}
                      </td>

                      {/* Progress Kelengkapan */}
                      <td className="py-3 px-3 align-top text-center">
                        <div className="inline-flex items-center justify-center font-bold text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${
                            tData.percentage >= 80
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : tData.percentage >= 40
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {tData.percentage}% ({tData.totalUploaded}/{tData.totalStandard})
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden max-w-[120px] mx-auto">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              tData.percentage >= 80
                                ? 'bg-emerald-500'
                                : tData.percentage >= 40
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${tData.percentage}%` }}
                          />
                        </div>
                        <div className="text-[9.5px] text-slate-400 mt-1">
                          {tData.totalApproved} disetujui • {tData.totalPending} pending
                        </div>
                      </td>

                      {/* Dynamic Columns for each master item */}
                      {displayedMasterItems.map((masterItem) => {
                        const itemMatch = tData.itemStatusList.find(
                          i => i.masterItem.idKey === masterItem.idKey
                        );
                        const doc = itemMatch?.document;
                        const isUploaded = itemMatch?.isUploaded;

                        return (
                          <td
                            key={masterItem.idKey}
                            className="py-3 px-3 text-center align-top border-l border-slate-100"
                          >
                            {isUploaded && doc ? (
                              <div className="flex flex-col items-center justify-center gap-1">
                                {/* Status Chip */}
                                {doc.status === 'Disetujui Penuh' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Lengkap</span>
                                  </span>
                                )}
                                {doc.status === 'Terkirim' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                    <Clock className="w-3 h-3 text-blue-600" />
                                    <span>Terkirim</span>
                                  </span>
                                )}
                                {doc.status === 'Ditinjau KS' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                                    <Sparkles className="w-3 h-3 text-purple-600" />
                                    <span>Ditinjau</span>
                                  </span>
                                )}
                                {doc.status === 'Draft' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                    <span>Draft</span>
                                  </span>
                                )}

                                {/* Document Title Snippet */}
                                <div className="text-[10px] text-slate-700 font-semibold line-clamp-1 max-w-[150px] text-center" title={doc.judul}>
                                  {doc.judul}
                                </div>

                                <div className="text-[9px] text-slate-400">
                                  {doc.tanggalUpload}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => onOpenPreviewModal(doc)}
                                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                                    title="Pratinjau Dokumen"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>

                                  <a
                                    href={doc.fileUrl || TARGET_DRIVE_FOLDER_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px]"
                                    title="Buka di Google Drive"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>

                                  {(isKS || isAdmin) && (
                                    <button
                                      type="button"
                                      onClick={() => onOpenFeedbackModal(doc)}
                                      className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px]"
                                      title="Berikan Apresiasi / Umpan Balik Positif"
                                    >
                                      <MessageSquareHeart className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-2 text-slate-300">
                                <XCircle className="w-4 h-4 text-rose-300" />
                                <span className="text-[9px] text-slate-400 mt-0.5">Belum Upload</span>
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {/* Sticky Right Action */}
                      <td className="py-3 px-4 text-right sticky right-0 bg-white group-hover:bg-slate-50/90 z-10 align-top shadow-xs">
                        <div className="flex flex-col items-end gap-1.5">
                          {tData.percentage < 100 && (isKS || isAdmin) && (
                            <button
                              type="button"
                              onClick={() => handleSendReminder(tData.guru.nama)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[10.5px] font-semibold transition-colors"
                              title="Kirim pengingat kelengkapan dokumen"
                            >
                              <Send className="w-3 h-3" />
                              <span>Ingatkan Guru</span>
                            </button>
                          )}
                          <div className="text-[9.5px] text-slate-400 font-medium">
                            {tData.teacherDocs.length} Berkas Diunggah
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: KARTU REKAPITULASI PER GURU */}
      {viewMode === 'kartu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeacherData.map((tData) => (
            <div
              key={tData.guru.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-300 transition-all space-y-4"
            >
              {/* Teacher Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {tData.guru.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {tData.guru.nama}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      NIP: {tData.guru.nip || '-'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {tData.guru.kelasTugas || tData.guru.jabatan || 'Guru Kelas'}
                      </span>
                      {tData.guru.mataPelajaran && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          {tData.guru.mataPelajaran}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    tData.percentage >= 80
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : tData.percentage >= 40
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {tData.percentage}%
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {tData.totalUploaded}/{tData.totalStandard} Instrumen
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    tData.percentage >= 80
                      ? 'bg-emerald-500'
                      : tData.percentage >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${tData.percentage}%` }}
                />
              </div>

              {/* 5 Pillars Summary Pill Grid */}
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {tData.pilarBreakdown.map(p => (
                  <div
                    key={p.pilarNomor}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px]"
                  >
                    <div className="text-slate-500 font-bold">P{p.pilarNomor}</div>
                    <div className={`font-black ${p.uploaded === p.total ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {p.uploaded}/{p.total}
                    </div>
                  </div>
                ))}
              </div>

              {/* Checklist Items Accordion / Detailed List */}
              <div className="space-y-2 pt-2 border-t border-slate-100 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Daftar Ceklis Dokumen:</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {tData.totalApproved} Disetujui KS
                  </span>
                </div>

                {tData.itemStatusList.map((item, idx) => {
                  const doc = item.document;
                  return (
                    <div
                      key={item.masterItem.idKey}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition-colors ${
                        item.isUploaded
                          ? 'bg-emerald-50/50 border-emerald-200/80 text-slate-800'
                          : 'bg-slate-50/60 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {item.isUploaded ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[11px] truncate" title={item.masterItem.namaItem}>
                            P{item.masterItem.pilarNomor}: {item.masterItem.namaItem}
                          </div>
                          {doc && (
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {doc.judul} ({doc.tanggalUpload})
                            </div>
                          )}
                        </div>
                      </div>

                      {doc && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onOpenPreviewModal(doc)}
                            className="p-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                            title="Lihat Detail Dokumen"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <a
                            href={doc.fileUrl || TARGET_DRIVE_FOLDER_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                            title="Buka di Drive"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {(isKS || isAdmin) && (
                            <button
                              type="button"
                              onClick={() => onOpenFeedbackModal(doc)}
                              className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                              title="Beri Umpan Balik Positif"
                            >
                              <MessageSquareHeart className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                {tData.totalStars > 0 ? (
                  <div className="flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Telah Diapresiasi KS ({tData.totalStars} Bintang)</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Belum ada rating</span>
                )}

                {(isKS || isAdmin) && tData.percentage < 100 && (
                  <button
                    type="button"
                    onClick={() => handleSendReminder(tData.guru.nama)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Kirim Pengingat</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 3: FORMAT RESMI CETAK LAPORAN SUPERVISI GURU */}
      {viewMode === 'cetak' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-md space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
          {/* Header Kop Surat Resmi */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-lg">
                <Building2 className="w-8 h-8 text-blue-700" />
              </div>
              <div className="text-center">
                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-600">
                  PEMERINTAH KOTA MAKASSAR • DINAS PENDIDIKAN
                </h4>
                <h2 className="text-lg font-black tracking-tight uppercase text-slate-900">
                  {profilSekolah.namaSekolah}
                </h2>
                <p className="text-[11px] text-slate-600">
                  NPSN: {profilSekolah.npsn} • NSS: {profilSekolah.nss} • Akreditasi: {profilSekolah.akreditasi}
                </p>
                <p className="text-[10px] text-slate-500">
                  {profilSekolah.alamat}, Kec. {profilSekolah.kecamatan}, {profilSekolah.kota} | Email: {profilSekolah.email}
                </p>
              </div>
            </div>
          </div>

          {/* Title of Document */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider underline">
              REKAPITULASI LAPORAN CEKLIS SUPERVISI ADMINISTRASI GURU
            </h3>
            <p className="text-xs text-slate-600">
              Tahun Ajaran 2024/2025 • Semester 1 (Ganjil)
            </p>
          </div>

          {/* Report Summary Data */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 font-medium">Total Guru Pendidik:</span>
              <span className="font-bold text-slate-800 ml-1">{overallStats.totalTeachers} Orang</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Rata-rata Kelengkapan:</span>
              <span className="font-bold text-emerald-700 ml-1">{overallStats.avgPercentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Instrumen Standar:</span>
              <span className="font-bold text-slate-800 ml-1">18 Dokumen (5 Pilar)</span>
            </div>
          </div>

          {/* Table for Print */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
                  <th className="p-2 border border-slate-300 w-8 text-center">No</th>
                  <th className="p-2 border border-slate-300 min-w-[160px]">Nama Guru & NIP</th>
                  <th className="p-2 border border-slate-300">Tugas Mengajar</th>
                  <th className="p-2 border border-slate-300 text-center">P1 (6)</th>
                  <th className="p-2 border border-slate-300 text-center">P2 (4)</th>
                  <th className="p-2 border border-slate-300 text-center">P3 (4)</th>
                  <th className="p-2 border border-slate-300 text-center">P4 (3)</th>
                  <th className="p-2 border border-slate-300 text-center">P5 (1)</th>
                  <th className="p-2 border border-slate-300 text-center">Total Terkumpul</th>
                  <th className="p-2 border border-slate-300 text-center">% Kelengkapan</th>
                  <th className="p-2 border border-slate-300 min-w-[140px]">Catatan / Apresiasi KS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeacherData.map((tData, idx) => {
                  const p1 = tData.pilarBreakdown[0]?.uploaded || 0;
                  const p2 = tData.pilarBreakdown[1]?.uploaded || 0;
                  const p3 = tData.pilarBreakdown[2]?.uploaded || 0;
                  const p4 = tData.pilarBreakdown[3]?.uploaded || 0;
                  const p5 = tData.pilarBreakdown[4]?.uploaded || 0;

                  return (
                    <tr key={tData.guru.id} className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 text-center font-medium">{idx + 1}</td>
                      <td className="p-2 border border-slate-300">
                        <div className="font-bold text-slate-900">{tData.guru.nama}</div>
                        <div className="text-[10px] text-slate-500 font-mono">NIP: {tData.guru.nip || '-'}</div>
                      </td>
                      <td className="p-2 border border-slate-300 font-medium">
                        {tData.guru.kelasTugas || tData.guru.jabatan || 'Guru Kelas'}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold">{p1}/6</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">{p2}/4</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">{p3}/4</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">{p4}/3</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">{p5}/1</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800">
                        {tData.totalUploaded}/18
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        {tData.percentage}%
                      </td>
                      <td className="p-2 border border-slate-300 text-[10px] text-slate-700 italic">
                        {tData.totalApproved > 0
                          ? `Telah disetujui & diapresiasi ${tData.totalApproved} dokumen (Rating ⭐${tData.totalStars > 0 ? (tData.totalStars / tData.totalApproved).toFixed(1) : '5.0'})`
                          : 'Dalam proses verifikasi berkas'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signature Block */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-semibold text-slate-700">Pengawas Pembina Gugus Mamajang</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">Drs. H. Muhammad Yunus, M.Pd.</p>
              <p className="text-slate-500 font-mono text-[11px]">NIP. 19680512 199403 1 007</p>
            </div>

            <div>
              <p className="text-slate-500">Makassar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold text-slate-700">Kepala {profilSekolah.namaSekolah}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-900">{profilSekolah.kepalaSekolah}</p>
              <p className="text-slate-500 font-mono text-[11px]">NIP. {profilSekolah.nipKepalaSekolah}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
