import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { DatabaseSekolah, PTKRecord } from '../../../types';
import {
  Database,
  School,
  Calendar,
  Award,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  MapPin,
  Check,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const DatabaseSekolahView: React.FC = () => {
  const {
    databaseSekolahList,
    activeDatabaseSekolah,
    addDatabaseSekolah,
    updateDatabaseSekolah,
    deleteDatabaseSekolah,
    setAktifDatabaseSekolah,
    sinkronkanKeProfilSekolah,
    profilSekolah,
    ptkList,
    setActiveTab,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahun, setFilterTahun] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncPreviewOpen, setIsSyncPreviewOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DatabaseSekolah | null>(null);
  const [targetSyncRecord, setTargetSyncRecord] = useState<DatabaseSekolah | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: Omit<DatabaseSekolah, 'id'> = {
    namaSekolah: 'UPTD SPF SDN Lanto Dg. Pasewang',
    tahunPelajaran: '2024/2025',
    semesterAktif: 'Semester Ganjil',
    npsn: '40307399',
    statusSekolah: 'Negeri',
    bentukPendidikan: 'Sekolah Dasar (SD)',
    kurikulum: 'Kurikulum Merdeka',
    ptkIdKepala: 'PTK-01',
    namaKepalaSekolah: 'Dra. Hj. Rosdiana, M.Pd.',
    nipKepalaSekolah: '19700412 199303 2 004',
    kontakTelepon: '0411-872345',
    kontakEmail: 'sdnlantodgpasewang@gmail.com',
    website: 'https://sdnlantodgpasewang.sch.id',
    alamatSekolah: 'Jl. Lanto Dg. Pasewang No. 12, Kel. Maricaya, Kec. Makassar, Kota Makassar, Sulawesi Selatan 90142',
    akreditasi: 'A (Unggul)',
    isAktif: true,
    keterangan: 'Database Induk Resmi Satuan Pendidikan'
  };

  const [formData, setFormData] = useState<Omit<DatabaseSekolah, 'id'>>(initialFormState);
  const [autoSyncChecked, setAutoSyncChecked] = useState(true);

  // Active target record
  const currentActive = useMemo(() => {
    return activeDatabaseSekolah || databaseSekolahList[0];
  }, [activeDatabaseSekolah, databaseSekolahList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return databaseSekolahList.filter((item) => {
      const matchSearch =
        item.namaSekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.npsn.includes(searchQuery) ||
        item.namaKepalaSekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tahunPelajaran.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTahun = filterTahun === 'all' || item.tahunPelajaran === filterTahun;

      return matchSearch && matchTahun;
    });
  }, [databaseSekolahList, searchQuery, filterTahun]);

  // Unique academic years for filter
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(databaseSekolahList.map((d) => d.tahunPelajaran)));
  }, [databaseSekolahList]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingRecord(null);
    // Find Kepala Sekolah in PTK if available
    const kepalaPTK = ptkList.find(
      (p) =>
        p.jabatan.toLowerCase().includes('kepala sekolah') ||
        p.tugasTambahan?.toLowerCase().includes('kepala sekolah')
    ) || ptkList[0];

    setFormData({
      ...initialFormState,
      ptkIdKepala: kepalaPTK ? kepalaPTK.id : '',
      namaKepalaSekolah: kepalaPTK ? kepalaPTK.nama : initialFormState.namaKepalaSekolah,
      nipKepalaSekolah: kepalaPTK ? kepalaPTK.nip : initialFormState.nipKepalaSekolah,
      kontakTelepon: profilSekolah?.telepon || initialFormState.kontakTelepon,
      kontakEmail: profilSekolah?.email || initialFormState.kontakEmail,
      website: profilSekolah?.website || initialFormState.website,
      alamatSekolah: profilSekolah?.alamat || initialFormState.alamatSekolah,
      isAktif: databaseSekolahList.length === 0
    });
    setAutoSyncChecked(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (record: DatabaseSekolah) => {
    setEditingRecord(record);
    setFormData({
      namaSekolah: record.namaSekolah,
      tahunPelajaran: record.tahunPelajaran,
      semesterAktif: record.semesterAktif,
      npsn: record.npsn,
      statusSekolah: record.statusSekolah,
      bentukPendidikan: record.bentukPendidikan,
      kurikulum: record.kurikulum,
      ptkIdKepala: record.ptkIdKepala || '',
      namaKepalaSekolah: record.namaKepalaSekolah,
      nipKepalaSekolah: record.nipKepalaSekolah,
      kontakTelepon: record.kontakTelepon,
      kontakEmail: record.kontakEmail,
      website: record.website,
      alamatSekolah: record.alamatSekolah,
      akreditasi: record.akreditasi,
      isAktif: record.isAktif,
      keterangan: record.keterangan || ''
    });
    setAutoSyncChecked(record.isAktif ?? false);
    setIsModalOpen(true);
  };

  // When PTK is selected in the dropdown
  const handleSelectPTK = (ptkId: string) => {
    const selectedPTK = ptkList.find((p) => p.id === ptkId);
    if (selectedPTK) {
      setFormData((prev) => ({
        ...prev,
        ptkIdKepala: selectedPTK.id,
        namaKepalaSekolah: selectedPTK.nama,
        nipKepalaSekolah: selectedPTK.nip
      }));
      showToast('info', 'Kepala Sekolah Dipilih', `Nama dan NIP otomatis diisi dari data ${selectedPTK.nama}.`);
    } else {
      setFormData((prev) => ({
        ...prev,
        ptkIdKepala: ''
      }));
    }
  };

  // Save Form Handler
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaSekolah.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama sekolah tidak boleh kosong.');
      return;
    }
    if (!formData.npsn.trim()) {
      showToast('error', 'Validasi Gagal', 'NPSN tidak boleh kosong.');
      return;
    }
    if (!formData.namaKepalaSekolah.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama Kepala Sekolah tidak boleh kosong.');
      return;
    }

    if (editingRecord) {
      updateDatabaseSekolah(editingRecord.id, formData, autoSyncChecked);
    } else {
      addDatabaseSekolah(formData, autoSyncChecked);
    }

    setIsModalOpen(false);
  };

  // Quick direct sync
  const handleDirectSync = (record?: DatabaseSekolah) => {
    const target = record || currentActive;
    if (!target) return;
    setTargetSyncRecord(target);
    setIsSyncPreviewOpen(true);
  };

  const confirmSyncToProfil = () => {
    if (!targetSyncRecord) return;
    sinkronkanKeProfilSekolah(targetSyncRecord.id);
    setIsSyncPreviewOpen(false);
    setTargetSyncRecord(null);
  };

  // Export JSON/CSV
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(databaseSekolahList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `database_sekolah_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'Ekspor Berhasil', 'File Database Sekolah berhasil diunduh.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Database className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pusat Manajemen Data Pokok Satuan Pendidikan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Database Sekolah
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Basis data master satuan pendidikan yang memuat data legalitas sekolah, tahun pelajaran, semester aktif, kurikulum, relasi kepala sekolah dari database PTK, saluran kontak, alamat, dan akreditasi. Seluruh data dapat disinkronkan langsung ke <strong>Profil Sekolah</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-sync-to-profile-hero"
              type="button"
              onClick={() => handleDirectSync(currentActive)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              title="Sinkronkan data aktif ke Profil Sekolah"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ambil / Sinkronkan ke Profil Sekolah</span>
            </button>

            <button
              id="btn-add-database-sekolah"
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Master Database</span>
            </button>

            <button
              id="btn-export-database-sekolah"
              type="button"
              onClick={handleExportData}
              className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Ekspor Data JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Ekspor Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Identitas Pokok */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identitas & NPSN</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-black text-slate-900 truncate" title={currentActive?.namaSekolah}>
              {currentActive?.namaSekolah || 'SDN Lanto Dg. Pasewang'}
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
              <span className="font-semibold text-blue-700">NPSN: {currentActive?.npsn || '40307399'}</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 text-[10px] font-bold">
                {currentActive?.statusSekolah || 'Negeri'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Periode Akademik */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun & Kurikulum</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>TP {currentActive?.tahunPelajaran || '2024/2025'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {currentActive?.semesterAktif || 'Ganjil'}
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium truncate" title={currentActive?.kurikulum}>
              {currentActive?.kurikulum || 'Kurikulum Merdeka'}
            </div>
          </div>
        </div>

        {/* Card 3: Kepala Sekolah (PTK) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kepala Sekolah (PTK)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-900 truncate" title={currentActive?.namaKepalaSekolah}>
              {currentActive?.namaKepalaSekolah || 'Dra. Hj. Rosdiana, M.Pd.'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              NIP. {currentActive?.nipKepalaSekolah || '-'}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded mt-1 border border-purple-100">
              <CheckCircle2 className="w-3 h-3 text-purple-600" />
              <span>Sinkron Database PTK</span>
            </div>
          </div>
        </div>

        {/* Card 4: Akreditasi & Sinkronisasi */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akreditasi & Sinkron</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                Akreditasi {currentActive?.akreditasi || 'A (Unggul)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 truncate">
              <RefreshCw className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">
                Sinkron: {currentActive?.terakhirDisinkronkan || 'Belum tersinkron'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Master Database Showcase Card */}
      {currentActive && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white px-6 py-4 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    {currentActive.namaSekolah}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-2xs">
                    Master Aktif
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tahun Pelajaran: <span className="font-semibold text-slate-800">{currentActive.tahunPelajaran}</span> • Semester: <span className="font-semibold text-slate-800">{currentActive.semesterAktif}</span> • Kurikulum: <span className="font-semibold text-slate-800">{currentActive.kurikulum}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDirectSync(currentActive)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                title="Terapkan data ini ke Profil Sekolah"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Terapkan ke Profil Sekolah</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenEdit(currentActive)}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Master</span>
              </button>
            </div>
          </div>

          {/* Detailed Data Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Box 1: Identitas & Legalitas */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-emerald-600" />
                <span>Identitas & Legalitas Satuan</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Nama Sekolah:</span>
                  <span className="font-bold text-slate-900 text-right">{currentActive.namaSekolah}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">NPSN:</span>
                  <span className="font-mono font-bold text-blue-700">{currentActive.npsn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Status Sekolah:</span>
                  <span className="font-semibold text-slate-800">{currentActive.statusSekolah}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Bentuk Pendidikan:</span>
                  <span className="font-semibold text-slate-800">{currentActive.bentukPendidikan}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Akreditasi:</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {currentActive.akreditasi}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Kepemimpinan & PTK */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Pimpinan Satuan (Relasi PTK)</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                    Kepala Sekolah Terhubung
                  </div>
                  <div className="text-xs font-extrabold text-purple-950">
                    {currentActive.namaKepalaSekolah}
                  </div>
                  <div className="text-[11px] text-purple-700 font-mono">
                    NIP. {currentActive.nipKepalaSekolah}
                  </div>
                  <div className="pt-1.5 mt-1 border-t border-purple-200/50 flex items-center justify-between text-[10px]">
                    <span className="text-purple-600">ID PTK: {currentActive.ptkIdKepala || 'PTK-01'}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('data-ptk')}
                      className="text-purple-700 font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Lihat Profil PTK</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tahun Pelajaran:</span>
                  <span className="font-semibold text-slate-800">{currentActive.tahunPelajaran}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Semester Aktif:</span>
                  <span className="font-semibold text-slate-800">{currentActive.semesterAktif}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Kurikulum:</span>
                  <span className="font-semibold text-slate-800">{currentActive.kurikulum}</span>
                </div>
              </div>
            </div>

            {/* Box 3: Kontak & Lokasi */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Saluran Komunikasi & Lokasi</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 py-1 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">{currentActive.kontakTelepon}</span>
                </div>
                <div className="flex items-center gap-2 py-1 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-blue-600 font-medium truncate">{currentActive.kontakEmail}</span>
                </div>
                <div className="flex items-center gap-2 py-1 text-slate-700">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a
                    href={currentActive.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-medium truncate flex items-center gap-1"
                  >
                    <span>{currentActive.website}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
                <div className="flex items-start gap-2 py-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-600 text-[11px]">
                    {currentActive.alamatSekolah}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Status Banner with Profil Sekolah */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-blue-900">
              Sinkronisasi Langsung ke Profil Sekolah Aktif
            </h2>
            <p className="text-xs text-blue-700 mt-0.5">
              Halaman <strong>Profil Sekolah</strong> dapat langsung memperbarui identitas satuan pendidikannya dari record Database Sekolah yang Anda pilih.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profil-sekolah')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs rounded-xl border border-blue-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <School className="w-3.5 h-3.5" />
            <span>Lihat Profil Sekolah</span>
          </button>

          <button
            type="button"
            onClick={() => handleDirectSync(currentActive)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tarik ke Profil Sekarang</span>
          </button>
        </div>
      </div>

      {/* Data Records Table & Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Daftar Riwayat & Arsip Database Sekolah
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola master database untuk setiap periode tahun pelajaran atau bentuk administrasi satuan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari database / tahun / kepala..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white w-56 transition-all"
              />
            </div>

            {/* Filter Tahun Pelajaran */}
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Tahun Pelajaran</option>
              {uniqueYears.map((thn) => (
                <option key={thn} value={thn}>
                  TP {thn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tahun & Semester</th>
                <th className="px-5 py-3">Nama Sekolah & NPSN</th>
                <th className="px-5 py-3">Kepala Sekolah (Dari PTK)</th>
                <th className="px-5 py-3">Kurikulum & Akreditasi</th>
                <th className="px-5 py-3">Kontak & Lokasi</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">Tidak ada data database sekolah ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Silakan sesuaikan kata kunci pencarian atau tambah master baru.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((record) => {
                  const isActive = record.isAktif;
                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isActive ? 'bg-emerald-50/30 font-medium' : ''
                      }`}
                    >
                      {/* Column 1: Status Aktif */}
                      <td className="px-5 py-3.5">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Master Aktif</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAktifDatabaseSekolah(record.id)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 text-[10px] font-bold border border-slate-200 transition-colors cursor-pointer"
                            title="Klik untuk menjadikan master aktif"
                          >
                            Set Aktif
                          </button>
                        )}
                      </td>

                      {/* Column 2: Tahun & Semester */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{record.tahunPelajaran}</div>
                        <div className="text-[11px] text-slate-500">{record.semesterAktif}</div>
                      </td>

                      {/* Column 3: Nama Sekolah & NPSN */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 leading-snug">{record.namaSekolah}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NPSN: {record.npsn} • {record.statusSekolah}
                        </div>
                      </td>

                      {/* Column 4: Kepala Sekolah (PTK) */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-purple-900 leading-snug">{record.namaKepalaSekolah}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NIP. {record.nipKepalaSekolah}
                        </div>
                        <div className="text-[10px] text-purple-600 flex items-center gap-1 mt-0.5">
                          <UserCheck className="w-3 h-3" />
                          <span>Dari Database PTK</span>
                        </div>
                      </td>

                      {/* Column 5: Kurikulum & Akreditasi */}
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{record.kurikulum}</div>
                        <div className="mt-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                            {record.akreditasi}
                          </span>
                        </div>
                      </td>

                      {/* Column 6: Kontak & Lokasi */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="text-[11px] text-slate-700 truncate" title={record.kontakEmail}>
                          {record.kontakEmail}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate" title={record.kontakTelepon}>
                          Telp: {record.kontakTelepon}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5" title={record.alamatSekolah}>
                          {record.alamatSekolah}
                        </div>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleDirectSync(record)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            title="Sinkronkan data ini ke Profil Sekolah"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(record)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data Master"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {databaseSekolahList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(record.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Database Sekolah"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah / Edit Database Sekolah */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editingRecord ? 'Edit Database Sekolah' : 'Tambah Master Database Sekolah'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Pastikan seluruh 14 parameter terisi akurat untuk sinkronisasi ke Profil Sekolah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveForm} className="overflow-y-auto p-6 space-y-5 text-xs flex-1">
              {/* Section 1: Identitas Sekolah */}
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <School className="w-4 h-4 text-emerald-600" />
                  <span>1. Identitas Satuan Pendidikan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah *</label>
                    <input
                      type="text"
                      required
                      value={formData.namaSekolah}
                      onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                      placeholder="e.g. UPTD SPF SDN Lanto Dg. Pasewang"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NPSN (Nomor Pokok Sekolah) *</label>
                    <input
                      type="text"
                      required
                      value={formData.npsn}
                      onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                      placeholder="e.g. 40307399"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status Sekolah *</label>
                    <select
                      value={formData.statusSekolah}
                      onChange={(e) => setFormData({ ...formData, statusSekolah: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Negeri">Negeri</option>
                      <option value="Swasta">Swasta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bentuk Pendidikan *</label>
                    <input
                      type="text"
                      value={formData.bentukPendidikan}
                      onChange={(e) => setFormData({ ...formData, bentukPendidikan: e.target.value })}
                      placeholder="e.g. Sekolah Dasar (SD)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Akreditasi Sekolah *</label>
                    <select
                      value={formData.akreditasi}
                      onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="A (Unggul)">A (Unggul)</option>
                      <option value="A">A</option>
                      <option value="B (Baik)">B (Baik)</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Periode Akademik & Kurikulum */}
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>2. Tahun Pelajaran, Semester & Kurikulum</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran *</label>
                    <input
                      type="text"
                      required
                      value={formData.tahunPelajaran}
                      onChange={(e) => setFormData({ ...formData, tahunPelajaran: e.target.value })}
                      placeholder="e.g. 2024/2025"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Semester Aktif *</label>
                    <select
                      value={formData.semesterAktif}
                      onChange={(e) => setFormData({ ...formData, semesterAktif: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Semester Ganjil">Semester Ganjil</option>
                      <option value="Semester Genap">Semester Genap</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kurikulum *</label>
                    <input
                      type="text"
                      required
                      value={formData.kurikulum}
                      onChange={(e) => setFormData({ ...formData, kurikulum: e.target.value })}
                      placeholder="e.g. Kurikulum Merdeka"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Relasi Kepala Sekolah dari Database PTK */}
              <div className="space-y-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-200">
                <div className="font-bold text-purple-900 text-xs flex items-center justify-between border-b border-purple-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>3. Data Kepala Sekolah (Diambil dari Database PTK)</span>
                  </div>
                  <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded">
                    Terhubung Otomatis ke PTK
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Select from PTK Dropdown */}
                  <div>
                    <label className="block font-semibold text-purple-950 mb-1">
                      Pilih dari Daftar Database PTK (Pendidik & Tenaga Kependidikan) *
                    </label>
                    <select
                      value={formData.ptkIdKepala || ''}
                      onChange={(e) => handleSelectPTK(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-xs font-semibold text-purple-900"
                    >
                      <option value="">-- Pilih PTK sebagai Kepala Sekolah --</option>
                      {ptkList.map((ptk) => (
                        <option key={ptk.id} value={ptk.id}>
                          {ptk.nama} — NIP: {ptk.nip} ({ptk.jabatan})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-purple-700 mt-1">
                      Memilih PTK di atas akan otomatis mengisi Nama Kepala Sekolah dan NIP di bawah.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah *</label>
                      <input
                        type="text"
                        required
                        value={formData.namaKepalaSekolah}
                        onChange={(e) => setFormData({ ...formData, namaKepalaSekolah: e.target.value })}
                        placeholder="e.g. Dra. Hj. Rosdiana, M.Pd."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah *</label>
                      <input
                        type="text"
                        required
                        value={formData.nipKepalaSekolah}
                        onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                        placeholder="e.g. 19700412 199303 2 004"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Kontak & Alamat */}
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>4. Kontak Telepon, Email, Website & Alamat</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kontak Telepon *</label>
                    <input
                      type="text"
                      required
                      value={formData.kontakTelepon}
                      onChange={(e) => setFormData({ ...formData, kontakTelepon: e.target.value })}
                      placeholder="e.g. 0411-872345"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kontak Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.kontakEmail}
                      onChange={(e) => setFormData({ ...formData, kontakEmail: e.target.value })}
                      placeholder="e.g. sdnlantodgpasewang@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Website Sekolah *</label>
                    <input
                      type="text"
                      required
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="e.g. https://sdnlantodgpasewang.sch.id"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah *</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.alamatSekolah}
                      onChange={(e) => setFormData({ ...formData, alamatSekolah: e.target.value })}
                      placeholder="Alamat jalan, kelurahan, kecamatan, kota, provinsi, dan kode pos"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Options: Set as Active & Auto Sync */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAktif ?? false}
                    onChange={(e) => setFormData({ ...formData, isAktif: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-800 text-xs">
                    Jadikan sebagai Basis Data Master Aktif
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncChecked}
                    onChange={(e) => setAutoSyncChecked(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-emerald-900 text-xs">
                    Langsung Sinkronkan dan Terapkan ke Profil Sekolah saat disimpan
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingRecord ? 'Simpan Perubahan' : 'Simpan ke Database'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Sync Preview & Confirmation */}
      {isSyncPreviewOpen && targetSyncRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold">
                    Konfirmasi Sinkronisasi ke Profil Sekolah
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    Data berikut dari Database Sekolah akan disalin dan menjadi data resmi Profil Sekolah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncPreviewOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed text-xs">
                Anda akan menyinkronkan data master <strong>{targetSyncRecord.namaSekolah}</strong> (Tahun Pelajaran: <strong>{targetSyncRecord.tahunPelajaran}</strong>, Semester: <strong>{targetSyncRecord.semesterAktif}</strong>) ke dalam menu <strong>Profil Sekolah</strong>.
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                <div className="flex justify-between px-4 py-2 bg-slate-50 font-bold text-slate-700">
                  <span>Parameter Data</span>
                  <span>Nilai yang Akan Diterapkan</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">Nama Sekolah:</span>
                  <span className="font-bold text-slate-900">{targetSyncRecord.namaSekolah}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">Tahun Pelajaran & Semester:</span>
                  <span className="font-semibold text-slate-800">{targetSyncRecord.tahunPelajaran} • {targetSyncRecord.semesterAktif}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">NPSN & Status:</span>
                  <span className="font-semibold text-slate-800">{targetSyncRecord.npsn} ({targetSyncRecord.statusSekolah})</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">Bentuk Pendidikan:</span>
                  <span className="font-semibold text-slate-800">{targetSyncRecord.bentukPendidikan}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">Kurikulum:</span>
                  <span className="font-semibold text-slate-800">{targetSyncRecord.kurikulum}</span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-purple-50/50">
                  <span className="text-purple-900 font-semibold">Kepala Sekolah (Dari PTK):</span>
                  <span className="font-bold text-purple-900">{targetSyncRecord.namaKepalaSekolah}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">NIP Kepala Sekolah:</span>
                  <span className="font-mono text-slate-800">{targetSyncRecord.nipKepalaSekolah}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">Kontak & Web:</span>
                  <span className="text-slate-800 truncate max-w-xs">{targetSyncRecord.kontakTelepon} • {targetSyncRecord.kontakEmail}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">Alamat Sekolah:</span>
                  <span className="text-slate-800 truncate max-w-xs">{targetSyncRecord.alamatSekolah}</span>
                </div>
                <div className="flex justify-between px-4 py-2">
                  <span className="text-slate-500">Akreditasi:</span>
                  <span className="font-bold text-emerald-700">{targetSyncRecord.akreditasi}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSyncPreviewOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmSyncToProfil}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan ke Profil Sekolah Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Hapus Arsip Database Sekolah?</h4>
                <p className="text-xs text-slate-500">Tindakan ini akan menghapus data record database sekolah yang dipilih.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteDatabaseSekolah(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
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
