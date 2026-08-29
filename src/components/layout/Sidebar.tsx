import React, { useState } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { TARGET_DRIVE_FOLDER_URL } from '../../services/driveService';
import { LoginGuruModal } from '../modules/user/LoginGuruModal';
import {
  School,
  LayoutDashboard,
  Building2,
  FileText,
  TrendingUp,
  Award,
  Users,
  GraduationCap,
  ClipboardCheck,
  ShieldCheck,
  Wallet,
  PackageCheck,
  Briefcase,
  UserPlus,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
  BookOpen,
  HardDrive,
  ExternalLink,
  FolderCheck,
  MessageSquareHeart,
  KeyRound,
  Database
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    users,
    logout,
    ptkList,
    kelasList,
    perencanaanList,
    pbdList,
    siswaList,
    supervisiAkademikList,
    sarprasList,
    rkasList,
    suratList,
    agendaKSList,
    bukuTamuList,
    jurnalKSList,
    keputusanSKList,
    rencanaPerbaikanList,
    administrasiGuruList
  } = useApp();

  // Collapsible state for submenus
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    manajemenSekolah: true,
    manajemenKesiswaan: true,
    manajemenSupervisi: true,
    manajemenKeuangan: true,
    manajemenSarpras: true,
    manajemenKS: true
  });

  const [isLoginGuruModalOpen, setIsLoginGuruModalOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const roleColors = {
    admin: 'bg-rose-500/10 text-rose-700 border-rose-200',
    kepala_sekolah: 'bg-purple-500/10 text-purple-700 border-purple-200',
    guru: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    tata_usaha: 'bg-blue-500/10 text-blue-700 border-blue-200'
  };

  const roleLabels = {
    admin: 'Administrator',
    kepala_sekolah: 'Kepala Sekolah',
    guru: 'Guru Pendidik',
    tata_usaha: 'Tata Usaha'
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-700 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with Geometric School Branding */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-xs shrink-0">
              L
            </div>
            <div className="min-w-0 flex-1 flex flex-col">
              <span className="text-white font-bold text-sm leading-tight truncate">
                SDN LANTO DG. PASEWANG
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 opacity-70">
                MANAJEMEN DATA
              </span>
            </div>
          </div>

          {/* Banner Welcome prompt */}
          <div className="mt-4 p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-[11px] leading-relaxed text-blue-200 font-medium">
            Selamat Datang di Website Manajemen Data UPTD SPF SDN Lanto Dg. Pasewang Kota Makassar
          </div>
        </div>

        {/* Navigation Menus (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-medium custom-scrollbar">
          
          {currentUser.role === 'guru' ? (
            /* MENU KHUSUS ROLE GURU (Akses Terbatas: Administrasi Guru, Program Unggulan, Supervisi Akademik, Supervisi Manajerial) */
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 px-2 flex items-center justify-between">
                  <span>Menu Akses Guru</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 font-bold text-emerald-300">
                    PENDIDIK
                  </span>
                </div>
                <div className="space-y-1.5">
                  {/* 1. Administrasi Guru */}
                  <button
                    id="menu-guru-administrasi"
                    type="button"
                    onClick={() => handleSelectTab('administrasi-guru')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'administrasi-guru' || activeTab === 'manajemen-administrasi-guru'
                        ? 'bg-emerald-600/20 text-emerald-300 border-l-2 border-emerald-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FolderCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span className="text-left font-medium">1. Administrasi Guru</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/50 font-bold font-mono">
                      {administrasiGuruList?.length || 0}
                    </span>
                  </button>

                  {/* 2. Program Unggulan Sekolah */}
                  <button
                    id="menu-guru-program-unggulan"
                    type="button"
                    onClick={() => handleSelectTab('program-unggulan')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'program-unggulan' || activeTab === 'manajemen-program-unggulan'
                        ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 shrink-0 text-blue-400" />
                      <span className="text-left font-medium">2. Program Unggulan Sekolah</span>
                    </div>
                  </button>

                  {/* 3. Supervisi Akademik */}
                  <button
                    id="menu-guru-supervisi-akademik"
                    type="button"
                    onClick={() => handleSelectTab('supervisi-akademik')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'supervisi-akademik'
                        ? 'bg-violet-600/20 text-violet-300 border-l-2 border-violet-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ClipboardCheck className="w-4 h-4 shrink-0 text-violet-400" />
                      <span className="text-left font-medium">3. Supervisi Akademik</span>
                    </div>
                    <span className="text-[9px] text-violet-400 bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-800/40 font-bold">
                      {supervisiAkademikList.length}
                    </span>
                  </button>

                  {/* 4. Supervisi Manajerial */}
                  <button
                    id="menu-guru-supervisi-manajerial"
                    type="button"
                    onClick={() => handleSelectTab('supervisi-manajerial')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeTab === 'supervisi-manajerial'
                        ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span className="text-left font-medium">4. Supervisi Manajerial</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section: Google Drive Cloud */}
              <div className="pt-2 border-t border-slate-700/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center justify-between">
                  <span>Cloud Storage</span>
                  <span className="text-[9px] text-emerald-400 font-bold">DRIVE</span>
                </div>
                <a
                  id="sidebar-link-drive"
                  href={TARGET_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-emerald-400 hover:bg-emerald-950/40 border border-emerald-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="text-left font-medium">Folder Google Drive</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          ) : (
            /* MENU LENGKAP UNTUK KEPALA SEKOLAH, ADMIN & TATA USAHA */
            <>
              {/* Section: Utama */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                  Utama
                </div>
                <div className="space-y-1">
                  <button
                    id="menu-dashboard"
                    type="button"
                    onClick={() => handleSelectTab('dashboard')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard Ringkasan</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/20 font-bold">
                      UTAMA
                    </span>
                  </button>

                  <button
                    id="menu-profil-sekolah"
                    type="button"
                    onClick={() => handleSelectTab('profil-sekolah')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'profil-sekolah'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4" />
                      <span className="text-left font-medium leading-tight">Profil Sekolah</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section: Manajemen Data */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Manajemen Data</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    DATA POKOK
                  </span>
                </div>
                
                <div className="space-y-1">
                  {/* PTK (Pendidik & Tendik) */}
                  <button
                    id="menu-data-ptk"
                    type="button"
                    onClick={() => handleSelectTab('data-ptk')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'data-ptk' || activeTab === 'manajemen-data'
                        ? 'bg-emerald-600/20 text-emerald-300 border-l-2 border-emerald-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span className="text-left font-medium">1. PTK (Pendidik & Tendik)</span>
                    </div>
                    <span className="text-[9px] text-emerald-300 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/40 font-mono font-bold">
                      {ptkList.length}
                    </span>
                  </button>

                  {/* Data Siswa */}
                  <button
                    id="menu-data-siswa"
                    type="button"
                    onClick={() => handleSelectTab('data-siswa')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'data-siswa'
                        ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 shrink-0 text-blue-400" />
                      <span className="text-left font-medium">2. Data Siswa</span>
                    </div>
                    <span className="text-[9px] text-blue-300 bg-blue-950/70 px-1.5 py-0.5 rounded border border-blue-800/40 font-mono font-bold">
                      {siswaList.length}
                    </span>
                  </button>

                  {/* Data Kelas */}
                  <button
                    id="menu-data-kelas"
                    type="button"
                    onClick={() => handleSelectTab('data-kelas')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'data-kelas'
                        ? 'bg-amber-600/20 text-amber-300 border-l-2 border-amber-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <School className="w-4 h-4 shrink-0 text-amber-400" />
                      <span className="text-left font-medium">3. Data Kelas (Rombel)</span>
                    </div>
                    <span className="text-[9px] text-amber-300 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-800/40 font-mono font-bold">
                      {kelasList.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Section: Manajemen */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                  Manajemen Sekolah
                </div>
                
                <div className="space-y-1">
                  {/* Perencanaan */}
                  <button
                    id="menu-perencanaan"
                    type="button"
                    onClick={() => handleSelectTab('perencanaan')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'perencanaan' || activeTab === 'manajemen-perencanaan'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="text-left">1. Perencanaan (KSP, RKT, RKAS)</span>
                    </div>
                    <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                      {perencanaanList.length}
                    </span>
                  </button>

                  {/* PBD */}
                  <button
                    id="menu-pbd"
                    type="button"
                    onClick={() => handleSelectTab('pbd')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'pbd' || activeTab === 'manajemen-pbd'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span className="text-left">2. Perencanaan Berbasis Data (PBD)</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 font-bold">
                      {pbdList.length}
                    </span>
                  </button>

                  {/* Program Unggulan */}
                  <button
                    id="menu-program-unggulan"
                    type="button"
                    onClick={() => handleSelectTab('program-unggulan')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'program-unggulan' || activeTab === 'manajemen-program-unggulan'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 shrink-0" />
                      <span className="text-left">3. Program Unggulan</span>
                    </div>
                  </button>

                  {/* Persuratan & MOU Kemitraan */}
                  <button
                    id="menu-ptk-surat"
                    type="button"
                    onClick={() => handleSelectTab('ptk-surat')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'ptk-surat' || activeTab === 'manajemen-ptk'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="text-left">4. Persuratan & MOU Kemitraan</span>
                    </div>
                    <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                      {suratList.length}
                    </span>
                  </button>

                  {/* Administrasi Guru */}
                  <button
                    id="menu-administrasi-guru"
                    type="button"
                    onClick={() => handleSelectTab('administrasi-guru')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'administrasi-guru' || activeTab === 'manajemen-administrasi-guru'
                        ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FolderCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span className="text-left">5. Administrasi Guru</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/50 font-bold font-mono">
                      {administrasiGuruList?.length || 0}
                    </span>
                  </button>
                </div>
              </div>

              {/* Section: Operasional */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                  Operasional & Kesiswaan
                </div>
                
                <div className="space-y-1">
                  {/* Kesiswaan */}
                  <button
                    id="menu-kesiswaan"
                    type="button"
                    onClick={() => handleSelectTab('kesiswaan')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'kesiswaan' || activeTab === 'manajemen-kesiswaan'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span className="text-left">Manajemen Kesiswaan</span>
                    </div>
                    <span className="text-[9px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 font-bold">
                      {siswaList.length}
                    </span>
                  </button>

                  {/* Supervisi Akademik */}
                  <button
                    id="menu-supervisi-akademik"
                    type="button"
                    onClick={() => handleSelectTab('supervisi-akademik')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'supervisi-akademik'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ClipboardCheck className="w-4 h-4 shrink-0" />
                      <span className="text-left">Supervisi Akademik</span>
                    </div>
                    <span className="text-[9px] text-violet-400 bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-800/40 font-bold">
                      {supervisiAkademikList.length}
                    </span>
                  </button>

                  {/* Supervisi Manajerial */}
                  <button
                    id="menu-supervisi-manajerial"
                    type="button"
                    onClick={() => handleSelectTab('supervisi-manajerial')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'supervisi-manajerial'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span className="text-left">Supervisi Manajerial</span>
                    </div>
                  </button>

                  {/* Keuangan BOSP */}
                  <button
                    id="menu-keuangan"
                    type="button"
                    onClick={() => handleSelectTab('keuangan')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'keuangan' || activeTab === 'manajemen-keuangan'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-4 h-4 shrink-0" />
                      <span className="text-left">Keuangan & BOSP</span>
                    </div>
                    <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                      {rkasList.length}
                    </span>
                  </button>

                  {/* Sarpras */}
                  <button
                    id="menu-sarpras"
                    type="button"
                    onClick={() => handleSelectTab('sarpras')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'sarpras' || activeTab === 'manajemen-sarpras'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PackageCheck className="w-4 h-4 shrink-0" />
                      <span className="text-left">Sarana & Prasarana</span>
                    </div>
                    <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                      {sarprasList.length}
                    </span>
                  </button>

                  {/* Kepala Sekolah */}
                  <button
                    id="menu-administrasi-ks"
                    type="button"
                    onClick={() => handleSelectTab('administrasi-ks')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                      activeTab === 'administrasi-ks' || activeTab === 'manajemen-kepala-sekolah'
                        ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 rounded-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span className="text-left">Administrasi Kepala Sekolah</span>
                    </div>
                    <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 font-bold">
                      {(agendaKSList?.length || 0) + (bukuTamuList?.length || 0) + (jurnalKSList?.length || 0) + (keputusanSKList?.length || 0) + (rencanaPerbaikanList?.length || 0)}
                    </span>
                  </button>
                </div>
              </div>

              {/* Section: Google Drive Cloud */}
              <div className="pt-2 border-t border-slate-700/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center justify-between">
                  <span>Cloud Storage</span>
                  <span className="text-[9px] text-emerald-400 font-bold">DRIVE</span>
                </div>
                <a
                  id="sidebar-link-drive"
                  href={TARGET_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-emerald-400 hover:bg-emerald-950/40 border border-emerald-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="text-left font-medium">Folder Google Drive</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              {/* Section: Pengguna */}
              <div className="pt-2 border-t border-slate-700/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center justify-between">
                  <span>Pengguna & Akses</span>
                  <span className="text-[9px] text-emerald-400 font-mono">123456</span>
                </div>

                {/* Quick Portal Login Guru (NIP) */}
                <button
                  id="sidebar-btn-login-guru"
                  type="button"
                  onClick={() => setIsLoginGuruModalOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="text-left font-bold text-xs">Login Guru (NIP)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-800/80 text-emerald-200 font-mono font-bold">
                    123456
                  </span>
                </button>

                <button
                  id="menu-enrol-pengguna"
                  type="button"
                  onClick={() => handleSelectTab('enrol-pengguna')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'enrol-pengguna' || activeTab === 'user-management'
                      ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 rounded-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span className="text-left">Enrol Pengguna</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/20 font-bold">
                    {users.length} AKUN
                  </span>
                </button>
              </div>
            </>
          )}

        </div>

        {/* Sidebar Footer: Active User Geometric Indicator & Logout */}
        <div className="p-3.5 border-t border-slate-700 bg-[#0f172a] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {currentUser.nama.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-medium text-xs truncate leading-tight">
                {currentUser.nama}
              </div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider opacity-60">
                {roleLabels[currentUser.role]}
              </div>
            </div>
          </div>

          <button
            id="sidebar-btn-logout"
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-700/50 transition-colors cursor-pointer shrink-0"
            title="Keluar ke Halaman Login"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* Modal Login Guru */}
      <LoginGuruModal
        isOpen={isLoginGuruModalOpen}
        onClose={() => setIsLoginGuruModalOpen(false)}
      />
    </>
  );
};
