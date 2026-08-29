import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  AgendaHarianKS,
  BukuTamu,
  JurnalKepemimpinan,
  KeputusanSK,
  RencanaPerbaikan
} from '../../../types';
import { Modal } from '../../common/Modal';
import { DriveFileUpload } from '../../common/DriveFileUpload';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  FileSignature,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Check,
  HardDrive,
  ExternalLink,
  Filter,
  FileText,
  TrendingUp,
  Target,
  ShieldCheck,
  Award,
  Download,
  Printer,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const KepalaSekolahView: React.FC = () => {
  const {
    agendaKSList,
    addAgendaKS,
    updateAgendaKS,
    deleteAgendaKS,
    bukuTamuList,
    addBukuTamu,
    updateBukuTamu,
    deleteBukuTamu,
    jurnalKSList,
    addJurnalKS,
    updateJurnalKS,
    deleteJurnalKS,
    keputusanSKList,
    addKeputusanSK,
    updateKeputusanSK,
    deleteKeputusanSK,
    rencanaPerbaikanList,
    addRencanaPerbaikan,
    updateRencanaPerbaikan,
    deleteRencanaPerbaikan,
    currentUser,
    profilSekolah
  } = useApp();

  const [activeTab, setActiveTab] = useState<'agenda' | 'tamu' | 'jurnal' | 'sk' | 'perbaikan'>('agenda');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // --- Modal States & Handlers ---

  // 1. Agenda Harian KS
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<AgendaHarianKS | null>(null);
  const [agendaForm, setAgendaForm] = useState<Omit<AgendaHarianKS, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '08.00 - 10.00 WITA',
    kegiatan: '',
    lokasi: 'SDN Lanto Dg. Pasewang',
    pihakTerlibat: 'Dewan Guru & Staf',
    outputHasil: '',
    status: 'Rencana',
    fileUrl: ''
  });

  // 2. Buku Tamu
  const [isTamuModalOpen, setIsTamuModalOpen] = useState(false);
  const [editingTamu, setEditingTamu] = useState<BukuTamu | null>(null);
  const [tamuForm, setTamuForm] = useState<Omit<BukuTamu, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    waktu: '09.30 WITA',
    namaTamu: '',
    instansi: '',
    jabatan: '',
    noHp: '',
    keperluan: '',
    diterimaOleh: currentUser.nama || 'Dra. Hj. Rosdiana, M.Pd.',
    kesanPesan: '',
    fileUrl: ''
  });

  // 3. Jurnal Kepemimpinan
  const [isJurnalModalOpen, setIsJurnalModalOpen] = useState(false);
  const [editingJurnal, setEditingJurnal] = useState<JurnalKepemimpinan | null>(null);
  const [jurnalForm, setJurnalForm] = useState<Omit<JurnalKepemimpinan, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    fokusKepemimpinan: 'Instruksional/Pembelajaran',
    refleksiKondisi: '',
    tindakanInovasi: '',
    dampakPerubahan: '',
    catatanRencanaLanjutan: '',
    fileUrl: ''
  });

  // 4. Keputusan & SK
  const [isSkModalOpen, setIsSkModalOpen] = useState(false);
  const [editingSk, setEditingSk] = useState<KeputusanSK | null>(null);
  const [skForm, setSkForm] = useState<Omit<KeputusanSK, 'id'>>({
    nomorSK: `800/0${keputusanSKList.length + 1}/SK-LDP/VIII/2024`,
    tentang: '',
    tanggalDitetapkan: new Date().toISOString().split('T')[0],
    tahunAjaran: '2024/2025',
    status: 'Berlaku',
    kategori: 'Pembagian Tugas',
    ringkasanKeputusan: '',
    penanggungJawab: currentUser.nama || 'Dra. Hj. Rosdiana, M.Pd.',
    fileUrl: ''
  });

  // 5. Rencana Perbaikan
  const [isPerbaikanModalOpen, setIsPerbaikanModalOpen] = useState(false);
  const [editingPerbaikan, setEditingPerbaikan] = useState<RencanaPerbaikan | null>(null);
  const [perbaikanForm, setPerbaikanForm] = useState<Omit<RencanaPerbaikan, 'id'>>({
    bidang: '',
    kondisiSaatIni: '',
    targetKondisi: '',
    strategiPerbaikan: '',
    indikatorKeberhasilan: '',
    penanggungJawab: 'Tim Pengembang Kurikulum & Kepala Sekolah',
    timeline: 'Semester Ganjil 2024/2025',
    status: 'Inisiasi',
    fileUrl: ''
  });

  // Detail Modal State
  const [viewDetailModal, setViewDetailModal] = useState<{
    type: 'agenda' | 'tamu' | 'jurnal' | 'sk' | 'perbaikan';
    data: any;
  } | null>(null);

  // Helper opens
  const openAddAgenda = () => {
    setAgendaForm({
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '08.00 - 10.00 WITA',
      kegiatan: '',
      lokasi: 'SDN Lanto Dg. Pasewang',
      pihakTerlibat: 'Dewan Guru & Staf',
      outputHasil: '',
      status: 'Rencana',
      fileUrl: ''
    });
    setEditingAgenda(null);
    setIsAgendaModalOpen(true);
  };

  const openEditAgenda = (item: AgendaHarianKS) => {
    setAgendaForm({
      tanggal: item.tanggal,
      waktu: item.waktu,
      kegiatan: item.kegiatan,
      lokasi: item.lokasi,
      pihakTerlibat: item.pihakTerlibat,
      outputHasil: item.outputHasil,
      status: item.status,
      fileUrl: item.fileUrl || ''
    });
    setEditingAgenda(item);
    setIsAgendaModalOpen(true);
  };

  const openAddTamu = () => {
    setTamuForm({
      tanggal: new Date().toISOString().split('T')[0],
      waktu: '09.30 WITA',
      namaTamu: '',
      instansi: '',
      jabatan: '',
      noHp: '',
      keperluan: '',
      diterimaOleh: currentUser.nama || 'Dra. Hj. Rosdiana, M.Pd.',
      kesanPesan: '',
      fileUrl: ''
    });
    setEditingTamu(null);
    setIsTamuModalOpen(true);
  };

  const openEditTamu = (item: BukuTamu) => {
    setTamuForm({
      tanggal: item.tanggal,
      waktu: item.waktu || '09.30 WITA',
      namaTamu: item.namaTamu,
      instansi: item.instansi,
      jabatan: item.jabatan,
      noHp: item.noHp,
      keperluan: item.keperluan,
      diterimaOleh: item.diterimaOleh,
      kesanPesan: item.kesanPesan,
      fileUrl: item.fileUrl || ''
    });
    setEditingTamu(item);
    setIsTamuModalOpen(true);
  };

  const openAddJurnal = () => {
    setJurnalForm({
      tanggal: new Date().toISOString().split('T')[0],
      fokusKepemimpinan: 'Instruksional/Pembelajaran',
      refleksiKondisi: '',
      tindakanInovasi: '',
      dampakPerubahan: '',
      catatanRencanaLanjutan: '',
      fileUrl: ''
    });
    setEditingJurnal(null);
    setIsJurnalModalOpen(true);
  };

  const openEditJurnal = (item: JurnalKepemimpinan) => {
    setJurnalForm({
      tanggal: item.tanggal,
      fokusKepemimpinan: item.fokusKepemimpinan,
      refleksiKondisi: item.refleksiKondisi,
      tindakanInovasi: item.tindakanInovasi,
      dampakPerubahan: item.dampakPerubahan,
      catatanRencanaLanjutan: item.catatanRencanaLanjutan,
      fileUrl: item.fileUrl || ''
    });
    setEditingJurnal(item);
    setIsJurnalModalOpen(true);
  };

  const openAddSk = () => {
    setSkForm({
      nomorSK: `800/0${keputusanSKList.length + 1}/SK-LDP/VIII/2024`,
      tentang: '',
      tanggalDitetapkan: new Date().toISOString().split('T')[0],
      tahunAjaran: '2024/2025',
      status: 'Berlaku',
      kategori: 'Pembagian Tugas',
      ringkasanKeputusan: '',
      penanggungJawab: currentUser.nama || 'Dra. Hj. Rosdiana, M.Pd.',
      fileUrl: ''
    });
    setEditingSk(null);
    setIsSkModalOpen(true);
  };

  const openEditSk = (item: KeputusanSK) => {
    setSkForm({
      nomorSK: item.nomorSK,
      tentang: item.tentang,
      tanggalDitetapkan: item.tanggalDitetapkan,
      tahunAjaran: item.tahunAjaran,
      status: item.status,
      kategori: item.kategori,
      ringkasanKeputusan: item.ringkasanKeputusan,
      penanggungJawab: item.penanggungJawab || currentUser.nama || 'Dra. Hj. Rosdiana, M.Pd.',
      fileUrl: item.fileUrl || ''
    });
    setEditingSk(item);
    setIsSkModalOpen(true);
  };

  const openAddPerbaikan = () => {
    setPerbaikanForm({
      bidang: '',
      kondisiSaatIni: '',
      targetKondisi: '',
      strategiPerbaikan: '',
      indikatorKeberhasilan: '',
      penanggungJawab: 'Tim Pengembang Kurikulum & Kepala Sekolah',
      timeline: 'Semester Ganjil 2024/2025',
      status: 'Inisiasi',
      fileUrl: ''
    });
    setEditingPerbaikan(null);
    setIsPerbaikanModalOpen(true);
  };

  const openEditPerbaikan = (item: RencanaPerbaikan) => {
    setPerbaikanForm({
      bidang: item.bidang,
      kondisiSaatIni: item.kondisiSaatIni,
      targetKondisi: item.targetKondisi,
      strategiPerbaikan: item.strategiPerbaikan,
      indikatorKeberhasilan: item.indikatorKeberhasilan,
      penanggungJawab: item.penanggungJawab,
      timeline: item.timeline,
      status: item.status,
      fileUrl: item.fileUrl || ''
    });
    setEditingPerbaikan(item);
    setIsPerbaikanModalOpen(true);
  };

  // Filtered lists
  const safeAgendaKS = agendaKSList || [];
  const safeBukuTamu = bukuTamuList || [];
  const safeJurnalKS = jurnalKSList || [];
  const safeKeputusanSK = keputusanSKList || [];
  const safeRencanaPerbaikan = rencanaPerbaikanList || [];

  const filteredAgenda = safeAgendaKS.filter(item => {
    const matchesSearch = (item.kegiatan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.lokasi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.pihakTerlibat || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBukuTamu = safeBukuTamu.filter(item => {
    const matchesSearch = (item.namaTamu || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.instansi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.keperluan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.jabatan || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredJurnal = safeJurnalKS.filter(item => {
    const matchesSearch = (item.fokusKepemimpinan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.refleksiKondisi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tindakanInovasi || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || item.fokusKepemimpinan === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSK = safeKeputusanSK.filter(item => {
    const matchesSearch = (item.nomorSK || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tentang || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kategori || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter || item.kategori === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPerbaikan = safeRencanaPerbaikan.filter(item => {
    const matchesSearch = (item.bidang || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.strategiPerbaikan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.penanggungJawab || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    agendaTotal: safeAgendaKS.length,
    agendaTerlaksana: safeAgendaKS.filter(a => a.status === 'Terlaksana').length,
    agendaRencana: safeAgendaKS.filter(a => a.status === 'Rencana').length,
    tamuTotal: safeBukuTamu.length,
    jurnalTotal: safeJurnalKS.length,
    skBerlaku: safeKeputusanSK.filter(s => s.status === 'Berlaku').length,
    skTotal: safeKeputusanSK.length,
    perbaikanTercapai: safeRencanaPerbaikan.filter(p => p.status === 'Tercapai').length,
    perbaikanTotal: safeRencanaPerbaikan.length
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 mb-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Administrasi & Kepemimpinan Kepala Sekolah</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Dashboard Administrasi Kepala Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pencatatan 5 pilar manajerial KS: Agenda Kerja Harian, Buku Tamu Kedinasan, Jurnal Refleksi Kepemimpinan, Arsip Keputusan (SK), dan Rencana Perbaikan Mutu Sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={TARGET_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>Folder Drive KS</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {activeTab === 'agenda' && (
            <button
              type="button"
              onClick={openAddAgenda}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda KS</span>
            </button>
          )}

          {activeTab === 'tamu' && (
            <button
              type="button"
              onClick={openAddTamu}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Entri Buku Tamu</span>
            </button>
          )}

          {activeTab === 'jurnal' && (
            <button
              type="button"
              onClick={openAddJurnal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Jurnal Refleksi</span>
            </button>
          )}

          {activeTab === 'sk' && (
            <button
              type="button"
              onClick={openAddSk}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Arsipkan SK Baru</span>
            </button>
          )}

          {activeTab === 'perbaikan' && (
            <button
              type="button"
              onClick={openAddPerbaikan}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rencana Perbaikan</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => { setActiveTab('agenda'); setStatusFilter('Semua'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'agenda' ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Agenda KS</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-slate-900">{stats.agendaTotal}</div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-emerald-600 font-bold">{stats.agendaTerlaksana} Terlaksana</span>
            <span className="text-amber-600 font-bold">{stats.agendaRencana} Rencana</span>
          </div>
        </div>

        <div
          onClick={() => { setActiveTab('tamu'); setStatusFilter('Semua'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'tamu' ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Buku Tamu</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-slate-900">{stats.tamuTotal}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Kunjungan resmi & dinas
          </div>
        </div>

        <div
          onClick={() => { setActiveTab('jurnal'); setStatusFilter('Semua'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'jurnal' ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Jurnal Refleksi</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-black text-slate-900">{stats.jurnalTotal}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Catatan aksi transformatif
          </div>
        </div>

        <div
          onClick={() => { setActiveTab('sk'); setStatusFilter('Semua'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'sk' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Surat Keputusan</span>
            <FileSignature className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-black text-slate-900">{stats.skTotal}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            {stats.skBerlaku} SK Aktif Berlaku
          </div>
        </div>

        <div
          onClick={() => { setActiveTab('perbaikan'); setStatusFilter('Semua'); }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'perbaikan' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Rencana Perbaikan</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-slate-900">{stats.perbaikanTotal}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            {stats.perbaikanTercapai} Target Tercapai
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => { setActiveTab('agenda'); setStatusFilter('Semua'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'agenda'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>1. Agenda Harian ({agendaKSList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('tamu'); setStatusFilter('Semua'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'tamu'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Buku Tamu ({bukuTamuList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('jurnal'); setStatusFilter('Semua'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'jurnal'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Jurnal Kepemimpinan ({jurnalKSList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('sk'); setStatusFilter('Semua'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'sk'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>4. Keputusan & SK ({keputusanSKList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('perbaikan'); setStatusFilter('Semua'); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'perbaikan'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>5. Rencana Perbaikan ({rencanaPerbaikanList.length})</span>
        </button>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'agenda' ? 'Cari kegiatan, lokasi, pihak...' :
              activeTab === 'tamu' ? 'Cari nama tamu, instansi, keperluan...' :
              activeTab === 'jurnal' ? 'Cari fokus, refleksi, inovasi...' :
              activeTab === 'sk' ? 'Cari nomor SK, perihal, kategori...' :
              'Cari bidang, strategi, penanggung jawab...'
            }
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {activeTab === 'agenda' && (
            <div className="flex items-center gap-1">
              {['Semua', 'Rencana', 'Terlaksana', 'Ditunda'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'jurnal' && (
            <div className="flex items-center gap-1">
              {['Semua', 'Instruksional/Pembelajaran', 'Manajerial', 'Sosial & Komunitas'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'sk' && (
            <div className="flex items-center gap-1">
              {['Semua', 'Berlaku', 'Pembagian Tugas', 'Tata Tertib', 'Pengelolaan Keuangan'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'perbaikan' && (
            <div className="flex items-center gap-1">
              {['Semua', 'Inisiasi', 'Implementasi', 'Evaluasi', 'Tercapai'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- 1. TAB AGENDA HARIAN KS ---------------- */}
      {activeTab === 'agenda' && (
        <div className="space-y-4">
          {filteredAgenda.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Tidak ada data agenda kegiatan yang sesuai filter pencarian.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgenda.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                        {item.tanggal}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === 'Terlaksana'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Ditunda'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.kegiatan}
                    </h3>

                    <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.waktu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Peserta: {item.pihakTerlibat}</span>
                      </div>
                    </div>

                    {item.outputHasil && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Hasil/Notula:</strong> {item.outputHasil}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka Dokumen/Notula di Google Drive"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lampiran Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setViewDetailModal({ type: 'agenda', data: item })}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Lihat Rincian"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditAgenda(item)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Agenda"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAgendaKS(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- 2. TAB BUKU TAMU KEDINASAN ---------------- */}
      {activeTab === 'tamu' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {filteredBukuTamu.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Belum ada catatan buku tamu kedinasan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Tanggal & Waktu</th>
                    <th className="px-4 py-3">Nama Tamu & Jabatan</th>
                    <th className="px-4 py-3">Instansi / Asal Lembaga</th>
                    <th className="px-4 py-3">Maksud & Tujuan Kunjungan</th>
                    <th className="px-4 py-3">Penerima</th>
                    <th className="px-4 py-3">Lampiran Drive</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBukuTamu.map(tamu => (
                    <tr key={tamu.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{tamu.tanggal}</div>
                        <div className="text-[10px] text-slate-400">{tamu.waktu || '09.30 WITA'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{tamu.namaTamu}</div>
                        <div className="text-[10px] text-slate-500">{tamu.jabatan} {tamu.noHp && `(${tamu.noHp})`}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-700">
                        {tamu.instansi}
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <div className="line-clamp-2">{tamu.keperluan}</div>
                        {tamu.kesanPesan && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">"{tamu.kesanPesan}"</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {tamu.diterimaOleh}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {tamu.fileUrl ? (
                          <a
                            href={tamu.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold"
                          >
                            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Berkas Drive</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewDetailModal({ type: 'tamu', data: tamu })}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Rincian"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditTamu(tamu)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBukuTamu(tamu.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 3. TAB JURNAL KEPEMIMPINAN KS ---------------- */}
      {activeTab === 'jurnal' && (
        <div className="space-y-4">
          {filteredJurnal.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Belum ada jurnal refleksi kepemimpinan yang tercatat.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJurnal.map(j => (
                <div
                  key={j.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        {j.fokusKepemimpinan}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">{j.tanggal}</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Refleksi Kondisi Awal:</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{j.refleksiKondisi}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                        <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Tindakan Inovasi & Solusi:</span>
                        </div>
                        <p className="text-blue-950 leading-relaxed text-[11px]">{j.tindakanInovasi}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Dampak Perubahan yang Terjadi:</span>
                        </div>
                        <p className="text-emerald-950 leading-relaxed text-[11px]">{j.dampakPerubahan}</p>
                      </div>

                      {j.catatanRencanaLanjutan && (
                        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950">
                          <strong>Tindak Lanjut Mendatang:</strong> {j.catatanRencanaLanjutan}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      {j.fileUrl && (
                        <a
                          href={j.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Dokumentasi Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditJurnal(j)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Jurnal"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteJurnalKS(j.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Jurnal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- 4. TAB KEPUTUSAN & SURAT KEPUTUSAN (SK) ---------------- */}
      {activeTab === 'sk' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {filteredSK.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Belum ada data Surat Keputusan (SK) yang tersimpan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Nomor SK</th>
                    <th className="px-4 py-3">Tentang / Perihal SK</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Tgl Penetapan</th>
                    <th className="px-4 py-3">Tahun Ajaran</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Berkas Drive</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSK.map(sk => (
                    <tr key={sk.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {sk.nomorSK}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-sm">
                        <div>{sk.tentang}</div>
                        {sk.ringkasanKeputusan && (
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{sk.ringkasanKeputusan}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {sk.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{sk.tanggalDitetapkan}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{sk.tahunAjaran}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            sk.status === 'Berlaku'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {sk.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {sk.fileUrl ? (
                          <a
                            href={sk.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold"
                          >
                            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                            <span>SK di Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum ada</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewDetailModal({ type: 'sk', data: sk })}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Detail SK"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditSk(sk)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit SK"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteKeputusanSK(sk.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus SK"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 5. TAB RENCANA PERBAIKAN MUTU ---------------- */}
      {activeTab === 'perbaikan' && (
        <div className="space-y-4">
          {filteredPerbaikan.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Belum ada target rencana perbaikan mutu sekolah.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPerbaikan.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        {p.bidang}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          p.status === 'Tercapai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Evaluasi'
                            ? 'bg-purple-100 text-purple-800'
                            : p.status === 'Implementasi'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-bold text-slate-500 text-[10px] uppercase">Kondisi Saat Ini</div>
                          <p className="text-slate-700 text-[11px] mt-1 leading-relaxed">{p.kondisiSaatIni}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                          <div className="font-bold text-emerald-700 text-[10px] uppercase">Target Kondisi</div>
                          <p className="text-emerald-900 text-[11px] mt-1 font-semibold leading-relaxed">{p.targetKondisi}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                        <div className="font-bold text-blue-900 text-[11px]">Strategi Perbaikan:</div>
                        <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">{p.strategiPerbaikan}</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <div><strong>PJ:</strong> {p.penanggungJawab}</div>
                        <div><strong>Timeline:</strong> {p.timeline}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      {p.fileUrl && (
                        <a
                          href={p.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Laporan di Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditPerbaikan(p)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Rencana"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRencanaPerbaikan(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Rencana"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: 1. AGENDA HARIAN KS ================= */}
      <Modal
        isOpen={isAgendaModalOpen}
        onClose={() => setIsAgendaModalOpen(false)}
        title={editingAgenda ? "Edit Agenda Kerja Kepala Sekolah" : "Tambah Agenda Kerja Kepala Sekolah"}
        subtitle="Pencatatan kegiatan manajerial, peninjauan, supervisi, rapat dinas, atau koordinasi eksternal"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editingAgenda) {
              updateAgendaKS(editingAgenda.id, agendaForm);
            } else {
              addAgendaKS(agendaForm);
            }
            setIsAgendaModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Kegiatan / Agenda</label>
              <input
                type="text"
                value={agendaForm.kegiatan}
                onChange={e => setAgendaForm({ ...agendaForm, kegiatan: e.target.value })}
                placeholder="Contoh: Rapat Evaluasi Pembelajaran Semester Ganjil"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Kegiatan</label>
              <input
                type="date"
                value={agendaForm.tanggal}
                onChange={e => setAgendaForm({ ...agendaForm, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Waktu Pelaksanaan</label>
              <input
                type="text"
                value={agendaForm.waktu}
                onChange={e => setAgendaForm({ ...agendaForm, waktu: e.target.value })}
                placeholder="08.00 - 10.30 WITA"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi Pelaksanaan</label>
              <input
                type="text"
                value={agendaForm.lokasi}
                onChange={e => setAgendaForm({ ...agendaForm, lokasi: e.target.value })}
                placeholder="Ruang Pertemuan / Aula Dinas Pendidikan"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Kegiatan</label>
              <select
                value={agendaForm.status}
                onChange={e => setAgendaForm({ ...agendaForm, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Rencana">Rencana</option>
                <option value="Terlaksana">Terlaksana</option>
                <option value="Ditunda">Ditunda</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Pihak yang Terlibat / Peserta</label>
              <input
                type="text"
                value={agendaForm.pihakTerlibat}
                onChange={e => setAgendaForm({ ...agendaForm, pihakTerlibat: e.target.value })}
                placeholder="Seluruh Guru Kelas, Pengawas Pembina, dan Komite Sekolah"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Hasil / Notula / Catatan Penting</label>
              <textarea
                rows={3}
                value={agendaForm.outputHasil}
                onChange={e => setAgendaForm({ ...agendaForm, outputHasil: e.target.value })}
                placeholder="Tuliskan poin-poin keputusan rapat atau output yang dicapai..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Google Drive Upload */}
            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah Notula / Surat Tugas / Undangan ke Google Drive"
                category="AgendaKS"
                initialUrl={agendaForm.fileUrl}
                onUploadSuccess={(url) => {
                  setAgendaForm(prev => ({ ...prev, fileUrl: url }));
                }}
                helperText="Berkas pendukung agenda akan tersimpan di Google Drive SDN Lanto Dg. Pasewang."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAgendaModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingAgenda ? "Perbarui Agenda" : "Simpan Agenda"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: 2. BUKU TAMU ================= */}
      <Modal
        isOpen={isTamuModalOpen}
        onClose={() => setIsTamuModalOpen(false)}
        title={editingTamu ? "Edit Buku Tamu Kedinasan" : "Entri Buku Tamu Kedinasan"}
        subtitle="Pencatatan kunjungan resmi pejabat dinas, pengawas, tamu umum, komite, dan mitra"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editingTamu) {
              updateBukuTamu(editingTamu.id, tamuForm);
            } else {
              addBukuTamu(tamuForm);
            }
            setIsTamuModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Tamu</label>
              <input
                type="text"
                value={tamuForm.namaTamu}
                onChange={e => setTamuForm({ ...tamuForm, namaTamu: e.target.value })}
                placeholder="Drs. H. Mappanyukki, M.Pd."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instansi / Lembaga Asal</label>
              <input
                type="text"
                value={tamuForm.instansi}
                onChange={e => setTamuForm({ ...tamuForm, instansi: e.target.value })}
                placeholder="Dinas Pendidikan Kota Makassar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jabatan Tamu</label>
              <input
                type="text"
                value={tamuForm.jabatan}
                onChange={e => setTamuForm({ ...tamuForm, jabatan: e.target.value })}
                placeholder="Pengawas Pembina SD"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. Kontak / WhatsApp</label>
              <input
                type="text"
                value={tamuForm.noHp}
                onChange={e => setTamuForm({ ...tamuForm, noHp: e.target.value })}
                placeholder="0811-4400-2233"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Kunjungan</label>
              <input
                type="date"
                value={tamuForm.tanggal}
                onChange={e => setTamuForm({ ...tamuForm, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Diterima Oleh</label>
              <input
                type="text"
                value={tamuForm.diterimaOleh}
                onChange={e => setTamuForm({ ...tamuForm, diterimaOleh: e.target.value })}
                placeholder="Dra. Hj. Rosdiana, M.Pd."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Maksud & Tujuan Kunjungan</label>
              <textarea
                rows={2}
                value={tamuForm.keperluan}
                onChange={e => setTamuForm({ ...tamuForm, keperluan: e.target.value })}
                placeholder="Monitoring kesiapan ANBK dan verifikasi dokumen Kurikulum Merdeka..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Kesan & Pesan Tamu (Opsional)</label>
              <textarea
                rows={2}
                value={tamuForm.kesanPesan}
                onChange={e => setTamuForm({ ...tamuForm, kesanPesan: e.target.value })}
                placeholder="Sekolah sangat tertata rapi, guru-guru berdedikasi tinggi..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Google Drive Upload */}
            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah Berkas/Foto Tamu/Lembar Kunjungan ke Google Drive"
                category="BukuTamu"
                initialUrl={tamuForm.fileUrl}
                onUploadSuccess={(url) => {
                  setTamuForm(prev => ({ ...prev, fileUrl: url }));
                }}
                helperText="Foto kunjungan atau scan lembar tanda tangan tamu akan tersimpan di Google Drive sekolah."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTamuModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingTamu ? "Perbarui Tamu" : "Simpan Buku Tamu"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: 3. JURNAL KEPEMIMPINAN ================= */}
      <Modal
        isOpen={isJurnalModalOpen}
        onClose={() => setIsJurnalModalOpen(false)}
        title={editingJurnal ? "Edit Jurnal Refleksi Kepemimpinan" : "Tulis Jurnal Refleksi Kepemimpinan KS"}
        subtitle="Dokumentasi pembelajaran transformatif, refleksi diri, dan rencana inovasi manajerial"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editingJurnal) {
              updateJurnalKS(editingJurnal.id, jurnalForm);
            } else {
              addJurnalKS(jurnalForm);
            }
            setIsJurnalModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Refleksi</label>
              <input
                type="date"
                value={jurnalForm.tanggal}
                onChange={e => setJurnalForm({ ...jurnalForm, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fokus / Dimensi Kepemimpinan</label>
              <select
                value={jurnalForm.fokusKepemimpinan}
                onChange={e => setJurnalForm({ ...jurnalForm, fokusKepemimpinan: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Instruksional/Pembelajaran">Instruksional / Pembelajaran</option>
                <option value="Manajerial">Manajerial & Pengelolaan Sekolah</option>
                <option value="Kewirausahaan">Kewirausahaan & Kemitraan</option>
                <option value="Supervisi">Supervisi Akademik & Guru</option>
                <option value="Sosial & Komunitas">Sosial & Komunitas / Paguyuban</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Refleksi Kondisi & Tantangan yang Dihadapi</label>
              <textarea
                rows={2}
                value={jurnalForm.refleksiKondisi}
                onChange={e => setJurnalForm({ ...jurnalForm, refleksiKondisi: e.target.value })}
                placeholder="Contoh: Mengamati antusiasme guru dalam media ajar digital masih butuh pendampingan rekan sejawat..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Tindakan Inovasi & Intervensi yang Diterapkan</label>
              <textarea
                rows={2}
                value={jurnalForm.tindakanInovasi}
                onChange={e => setJurnalForm({ ...jurnalForm, tindakanInovasi: e.target.value })}
                placeholder="Contoh: Menginisiasi Komunitas Belajar mingguan dan pelatihan Canva Edukasi interaktif..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Dampak Perubahan & Pembelajaran Bermakna</label>
              <textarea
                rows={2}
                value={jurnalForm.dampakPerubahan}
                onChange={e => setJurnalForm({ ...jurnalForm, dampakPerubahan: e.target.value })}
                placeholder="Contoh: Terjadi kolaborasi aktif antar guru dan 100% kelas menggunakan modul ajar digital..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut Mendatang (Opsional)</label>
              <textarea
                rows={2}
                value={jurnalForm.catatanRencanaLanjutan}
                onChange={e => setJurnalForm({ ...jurnalForm, catatanRencanaLanjutan: e.target.value })}
                placeholder="Contoh: Menghadirkan narasumber praktisi Guru Penggerak..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Google Drive Upload */}
            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah Dokumentasi / Bukti Aksi Kepemimpinan ke Google Drive"
                category="JurnalKS"
                initialUrl={jurnalForm.fileUrl}
                onUploadSuccess={(url) => {
                  setJurnalForm(prev => ({ ...prev, fileUrl: url }));
                }}
                helperText="Bukti foto aksi atau dokumen refleksi kepemimpinan akan tersimpan di Google Drive sekolah."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsJurnalModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingJurnal ? "Perbarui Jurnal" : "Simpan Jurnal Refleksi"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: 4. KEPUTUSAN & SK KEPALA SEKOLAH ================= */}
      <Modal
        isOpen={isSkModalOpen}
        onClose={() => setIsSkModalOpen(false)}
        title={editingSk ? "Edit Surat Keputusan (SK)" : "Arsipkan Surat Keputusan (SK) Baru"}
        subtitle="Pencatatan legalitas SK Kepala Sekolah mengenai pembagian tugas, tim panitia, dan kebijakan satuan pendidikan"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editingSk) {
              updateKeputusanSK(editingSk.id, skForm);
            } else {
              addKeputusanSK(skForm);
            }
            setIsSkModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor SK</label>
              <input
                type="text"
                value={skForm.nomorSK}
                onChange={e => setSkForm({ ...skForm, nomorSK: e.target.value })}
                placeholder="800/01/SK-LDP/VII/2024"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori Keputusan</label>
              <select
                value={skForm.kategori}
                onChange={e => setSkForm({ ...skForm, kategori: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Pembagian Tugas">Pembagian Tugas Guru & GTK</option>
                <option value="Kepanitiaan">Kepanitiaan Ujian / PPDB / ANBK / P5</option>
                <option value="Pengelolaan Keuangan">Pengelolaan Keuangan & BOSP</option>
                <option value="Tata Tertib">Tata Tertib, TPPK & Disiplin</option>
                <option value="Ekstrakurikuler">Ekstrakurikuler & Pembinaan Siswa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Tentang / Perihal SK</label>
              <input
                type="text"
                value={skForm.tentang}
                onChange={e => setSkForm({ ...skForm, tentang: e.target.value })}
                placeholder="Contoh: Pembagian Tugas Mengajar dan Tugas Tambahan Guru TP 2024/2025"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Ditetapkan</label>
              <input
                type="date"
                value={skForm.tanggalDitetapkan}
                onChange={e => setSkForm({ ...skForm, tanggalDitetapkan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={skForm.tahunAjaran}
                onChange={e => setSkForm({ ...skForm, tahunAjaran: e.target.value })}
                placeholder="2024/2025"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Keberlakuan</label>
              <select
                value={skForm.status}
                onChange={e => setSkForm({ ...skForm, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Berlaku">Berlaku</option>
                <option value="Direvisi">Direvisi</option>
                <option value="Kedaluwarsa">Kedaluwarsa</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab / Pejabat</label>
              <input
                type="text"
                value={skForm.penanggungJawab || ''}
                onChange={e => setSkForm({ ...skForm, penanggungJawab: e.target.value })}
                placeholder="Dra. Hj. Rosdiana, M.Pd."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Ringkasan Diktum Keputusan</label>
              <textarea
                rows={3}
                value={skForm.ringkasanKeputusan}
                onChange={e => setSkForm({ ...skForm, ringkasanKeputusan: e.target.value })}
                placeholder="Uraikan intisari keputusan: menugaskan guru sesuai beban kerja 24 jam tatap muka, dll..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Google Drive Upload */}
            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah File Scan Dokumen SK (PDF / Word) ke Google Drive"
                category={`SK-${skForm.kategori}`}
                initialUrl={skForm.fileUrl}
                onUploadSuccess={(url) => {
                  setSkForm(prev => ({ ...prev, fileUrl: url }));
                }}
                helperText="Arsip naskah SK asli akan otomatis tersimpan di folder Google Drive sekolah."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSkModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingSk ? "Perbarui SK" : "Simpan SK"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: 5. RENCANA PERBAIKAN MUTU ================= */}
      <Modal
        isOpen={isPerbaikanModalOpen}
        onClose={() => setIsPerbaikanModalOpen(false)}
        title={editingPerbaikan ? "Edit Rencana Perbaikan Mutu" : "Tambah Rencana Perbaikan Mutu & Tindak Lanjut"}
        subtitle="Perencanaan peningkatan mutu sekolah berbasis indikator Rapor Pendidikan (PBD)"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editingPerbaikan) {
              updateRencanaPerbaikan(editingPerbaikan.id, perbaikanForm);
            } else {
              addRencanaPerbaikan(perbaikanForm);
            }
            setIsPerbaikanModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Bidang / Aspek Perbaikan</label>
              <input
                type="text"
                value={perbaikanForm.bidang}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, bidang: e.target.value })}
                placeholder="Contoh: Peningkatan Kemampuan Numerasi & Literasi Siswa"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Progres</label>
              <select
                value={perbaikanForm.status}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Inisiasi">Inisiasi</option>
                <option value="Implementasi">Implementasi</option>
                <option value="Evaluasi">Evaluasi</option>
                <option value="Tercapai">Tercapai</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Timeline / Batas Waktu</label>
              <input
                type="text"
                value={perbaikanForm.timeline}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, timeline: e.target.value })}
                placeholder="Semester Ganjil 2024/2025"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Kondisi Saat Ini (Baseline)</label>
              <textarea
                rows={2}
                value={perbaikanForm.kondisiSaatIni}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, kondisiSaatIni: e.target.value })}
                placeholder="Skor numerasi masih di angka 76.8 dan perlu akselerasi penalaran HOTS..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Target Kondisi yang Diharapkan</label>
              <textarea
                rows={2}
                value={perbaikanForm.targetKondisi}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, targetKondisi: e.target.value })}
                placeholder="Mencapai skor numerasi 85.0 dan 100% siswa tuntas asesmen minimum..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Strategi Perbaikan & Solusi</label>
              <textarea
                rows={2}
                value={perbaikanForm.strategiPerbaikan}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, strategiPerbaikan: e.target.value })}
                placeholder="Penerapan pembelajaran matematika kontekstual berbasis permainan tradisional..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Indikator Keberhasilan</label>
              <input
                type="text"
                value={perbaikanForm.indikatorKeberhasilan}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, indikatorKeberhasilan: e.target.value })}
                placeholder="Nilai rata-rata sumatif di atas 80"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab</label>
              <input
                type="text"
                value={perbaikanForm.penanggungJawab}
                onChange={e => setPerbaikanForm({ ...perbaikanForm, penanggungJawab: e.target.value })}
                placeholder="Ketua Tim Kurikulum & Kepala Sekolah"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Google Drive Upload */}
            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah Dokumen Perencanaan / Laporan Evaluasi ke Google Drive"
                category="RencanaPerbaikan"
                initialUrl={perbaikanForm.fileUrl}
                onUploadSuccess={(url) => {
                  setPerbaikanForm(prev => ({ ...prev, fileUrl: url }));
                }}
                helperText="Laporan tindak lanjut dan bukti perbaikan mutu akan tersimpan di Google Drive sekolah."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPerbaikanModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingPerbaikan ? "Perbarui Rencana" : "Simpan Rencana"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: DETAIL POPUP ================= */}
      {viewDetailModal && (
        <Modal
          isOpen={true}
          onClose={() => setViewDetailModal(null)}
          title={
            viewDetailModal.type === 'agenda' ? 'Rincian Agenda Kerja Kepala Sekolah' :
            viewDetailModal.type === 'tamu' ? 'Rincian Tamu Kedinasan' :
            viewDetailModal.type === 'jurnal' ? 'Rincian Jurnal Refleksi' :
            viewDetailModal.type === 'sk' ? 'Rincian Surat Keputusan (SK)' :
            'Rincian Rencana Perbaikan Mutu'
          }
          subtitle="Data administrasi resmi SDN Lanto Dg. Pasewang"
        >
          <div className="space-y-4 text-xs">
            {viewDetailModal.type === 'agenda' && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                  <div className="text-sm font-bold text-blue-900">{viewDetailModal.data.kegiatan}</div>
                  <div className="text-slate-500 mt-1">Tanggal: {viewDetailModal.data.tanggal} | {viewDetailModal.data.waktu}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px]">LOKASI</span>
                    <span className="font-semibold text-slate-800">{viewDetailModal.data.lokasi}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px]">STATUS</span>
                    <span className="font-semibold text-slate-800">{viewDetailModal.data.status}</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">PIHAK TERLIBAT / PESERTA</span>
                  <span className="font-semibold text-slate-800">{viewDetailModal.data.pihakTerlibat}</span>
                </div>
                {viewDetailModal.data.outputHasil && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px] mb-1">HASIL / NOTULA</span>
                    <p className="text-slate-700 leading-relaxed">{viewDetailModal.data.outputHasil}</p>
                  </div>
                )}
                {viewDetailModal.data.fileUrl && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <span className="font-semibold text-emerald-900">Lampiran berkas tersimpan di Drive</span>
                    <a
                      href={viewDetailModal.data.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold inline-flex items-center gap-1"
                    >
                      <span>Buka di Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {viewDetailModal.type === 'tamu' && (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
                  <div className="text-sm font-bold text-indigo-950">{viewDetailModal.data.namaTamu}</div>
                  <div className="text-indigo-800 font-semibold text-xs mt-0.5">{viewDetailModal.data.jabatan} - {viewDetailModal.data.instansi}</div>
                  <div className="text-slate-500 text-[11px] mt-1">Tanggal: {viewDetailModal.data.tanggal} ({viewDetailModal.data.waktu || '09.30 WITA'})</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] mb-1">MAKSUD & TUJUAN KUNJUNGAN</span>
                  <p className="text-slate-800 leading-relaxed">{viewDetailModal.data.keperluan}</p>
                </div>
                {viewDetailModal.data.kesanPesan && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 italic text-slate-700">
                    <span className="text-slate-400 font-bold not-italic block text-[10px] mb-1">KESAN & PESAN</span>
                    "{viewDetailModal.data.kesanPesan}"
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-600 pt-1 text-[11px]">
                  <span><strong>Diterima Oleh:</strong> {viewDetailModal.data.diterimaOleh}</span>
                  <span><strong>Kontak:</strong> {viewDetailModal.data.noHp || '-'}</span>
                </div>
              </div>
            )}

            {viewDetailModal.type === 'sk' && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                  <div className="font-mono font-bold text-blue-700 text-xs">{viewDetailModal.data.nomorSK}</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{viewDetailModal.data.tentang}</div>
                  <div className="text-slate-500 text-[11px] mt-1">Ditetapkan: {viewDetailModal.data.tanggalDitetapkan} | TP {viewDetailModal.data.tahunAjaran}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] mb-1">RINGKASAN KEPUTUSAN</span>
                  <p className="text-slate-800 leading-relaxed">{viewDetailModal.data.ringkasanKeputusan}</p>
                </div>
                {viewDetailModal.data.fileUrl && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <span className="font-semibold text-emerald-900">Naskah Asli SK tersimpan di Google Drive</span>
                    <a
                      href={viewDetailModal.data.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold inline-flex items-center gap-1"
                    >
                      <span>Unduh / Buka Dokumen</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDetailModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
