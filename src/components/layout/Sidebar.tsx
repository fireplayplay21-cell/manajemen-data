import React, { useState } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
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
  LogOut,
  FolderCheck,
  Database,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight
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
    administrasiGuruList,
    profilSekolah,
    isSidebarCollapsed,
    toggleSidebarCollapse
  } = useApp();

  const [isLoginGuruModalOpen, setIsLoginGuruModalOpen] = useState(false);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const roleLabels = {
    admin: 'Administrator',
    kepala_sekolah: 'Kepala Sekolah',
    guru: 'Guru Pendidik',
    tata_usaha: 'Tata Usaha'
  };

  // Helper renderer for menu buttons that adapts cleanly to collapsed / expanded states
  const renderNavButton = (
    id: string,
    tab: ActiveTab,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    count?: number,
    badgeText?: string,
    colorTheme: 'blue' | 'emerald' | 'violet' | 'amber' | 'cyan' | 'rose' | 'indigo' = 'blue'
  ) => {
    const isTabActive =
      activeTab === tab ||
      (tab === 'data-ptk' && activeTab === 'manajemen-data') ||
      (tab === 'perencanaan' && activeTab === 'manajemen-perencanaan') ||
      (tab === 'pbd' && activeTab === 'manajemen-pbd') ||
      (tab === 'program-unggulan' && activeTab === 'manajemen-program-unggulan') ||
      (tab === 'ptk-surat' && activeTab === 'manajemen-ptk') ||
      (tab === 'administrasi-guru' && activeTab === 'manajemen-administrasi-guru') ||
      (tab === 'kesiswaan' && activeTab === 'manajemen-kesiswaan') ||
      (tab === 'keuangan' && activeTab === 'manajemen-keuangan') ||
      (tab === 'sarpras' && activeTab === 'manajemen-sarpras') ||
      (tab === 'administrasi-ks' && activeTab === 'manajemen-kepala-sekolah') ||
      (tab === 'pengaturan' &&
        (activeTab === 'pengaturan-admin' ||
          activeTab === 'settings' ||
          activeTab === 'enrol-pengguna' ||
          activeTab === 'user-management'));

    const colorMap = {
      blue: {
        active: 'bg-blue-600/20 text-blue-300 border-blue-500 font-semibold',
        icon: 'text-blue-400',
        badge: 'bg-blue-950/70 text-blue-300 border-blue-800/40',
        activeDot: 'bg-blue-500'
      },
      emerald: {
        active: 'bg-emerald-600/20 text-emerald-300 border-emerald-500 font-semibold',
        icon: 'text-emerald-400',
        badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40',
        activeDot: 'bg-emerald-500'
      },
      violet: {
        active: 'bg-violet-600/20 text-violet-300 border-violet-500 font-semibold',
        icon: 'text-violet-400',
        badge: 'bg-violet-950/70 text-violet-300 border-violet-800/40',
        activeDot: 'bg-violet-500'
      },
      indigo: {
        active: 'bg-indigo-600/20 text-indigo-300 border-indigo-500 font-semibold',
        icon: 'text-indigo-400',
        badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/40',
        activeDot: 'bg-indigo-500'
      },
      amber: {
        active: 'bg-amber-600/20 text-amber-300 border-amber-500 font-semibold',
        icon: 'text-amber-400',
        badge: 'bg-amber-950/70 text-amber-300 border-amber-800/40',
        activeDot: 'bg-amber-500'
      },
      cyan: {
        active: 'bg-cyan-600/20 text-cyan-300 border-cyan-500 font-semibold',
        icon: 'text-cyan-400',
        badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/40',
        activeDot: 'bg-cyan-500'
      },
      rose: {
        active: 'bg-rose-600/20 text-rose-300 border-rose-500 font-semibold',
        icon: 'text-rose-400',
        badge: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
        activeDot: 'bg-rose-500'
      }
    };

    const theme = colorMap[colorTheme] || colorMap.blue;

    if (isSidebarCollapsed) {
      // COLLAPSED / FOLDED BUTTON (DESKTOP)
      return (
        <div key={id} className="relative group flex justify-center w-full">
          <button
            id={id}
            type="button"
            onClick={() => handleSelectTab(tab)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer relative ${
              isTabActive
                ? `${theme.active} shadow-xs`
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            aria-label={label}
          >
            <Icon className={`w-5 h-5 shrink-0 ${isTabActive ? theme.icon : 'text-slate-400 group-hover:text-slate-200'}`} />

            {/* Active Indicator Bar / Dot */}
            {isTabActive && (
              <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${theme.activeDot}`} />
            )}

            {/* Micro Badge for numeric counts when collapsed */}
            {count !== undefined && count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-slate-800 border border-slate-600 text-[9px] font-bold text-slate-200 flex items-center justify-center shadow-xs">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          {/* Floating Tooltip on Hover (Desktop) */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white rounded-lg shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity flex items-center gap-2 whitespace-nowrap hidden lg:flex text-xs font-semibold">
            <span>{label}</span>
            {count !== undefined && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${theme.badge}`}>
                {count}
              </span>
            )}
            {badgeText && (
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${theme.badge}`}>
                {badgeText}
              </span>
            )}
          </div>
        </div>
      );
    }

    // EXPANDED / NORMAL BUTTON
    return (
      <button
        key={id}
        id={id}
        type="button"
        onClick={() => handleSelectTab(tab)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-xs ${
          isTabActive
            ? `${theme.active} border-l-2 font-semibold`
            : 'text-slate-300 hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 ${isTabActive ? theme.icon : 'text-slate-400'}`} />
          <span className="text-left font-medium truncate">{label}</span>
        </div>

        {count !== undefined && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold shrink-0 ${theme.badge}`}>
            {count}
          </span>
        )}

        {badgeText && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase shrink-0 ${theme.badge}`}>
            {badgeText}
          </span>
        )}
      </button>
    );
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
        className={`fixed top-0 left-0 bottom-0 z-40 ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-80'
        } w-80 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-700 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with Geometric Branding & Collapse Toggle */}
        <div className={`border-b border-slate-700 transition-all duration-300 ${isSidebarCollapsed ? 'p-3' : 'p-5 sm:p-6'}`}>
          <div className="flex items-center justify-between gap-2">
            <div className={`flex items-center gap-3 min-w-0 ${isSidebarCollapsed ? 'w-full justify-center' : ''}`}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 cursor-pointer transition-all hover:scale-105 overflow-hidden bg-white p-1 border border-slate-600"
                onClick={() => {
                  if (isSidebarCollapsed) toggleSidebarCollapse();
                }}
                title={isSidebarCollapsed ? "Klik untuk Rentangkan Sidebar" : (profilSekolah?.namaSekolah || "UPTD SPF SDN Lanto Dg. Pasewang")}
              >
                {profilSekolah?.logoUrl ? (
                  <img
                    src={profilSekolah.logoUrl}
                    alt="Logo Sekolah"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    L
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <div className="min-w-0 flex-1 flex flex-col">
                  <span className="text-white font-bold text-sm leading-tight truncate">
                    SDN LANTO DG. PASEWANG
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 opacity-70">
                    MANAJEMEN DATA
                  </span>
                </div>
              )}
            </div>

            {/* Toggle Fold Button on Header (Desktop) */}
            {!isSidebarCollapsed && (
              <button
                id="sidebar-btn-fold-header"
                type="button"
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-colors cursor-pointer shrink-0"
                title="Lipat Sidebar ke Samping"
                aria-label="Lipat Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle Fold Button when Collapsed (Desktop) */}
          {isSidebarCollapsed && (
            <div className="hidden lg:flex justify-center mt-2 pt-2 border-t border-slate-800">
              <button
                id="sidebar-btn-unfold-header"
                type="button"
                onClick={toggleSidebarCollapse}
                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                title="Rentangkan / Buka Sidebar"
                aria-label="Buka Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          )}

          {/* Banner Welcome prompt (Only when expanded) */}
          {!isSidebarCollapsed && (
            <div className="mt-4 p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-[11px] leading-relaxed text-blue-200 font-medium animate-in fade-in">
              Selamat Datang di Website Manajemen Data UPTD SPF SDN Lanto Dg. Pasewang Kota Makassar
            </div>
          )}
        </div>

        {/* Navigation Menus (Scrollable) */}
        <div className={`flex-1 overflow-y-auto ${isSidebarCollapsed ? 'p-2 space-y-3' : 'p-4 space-y-4'} text-xs font-medium custom-scrollbar`}>
          
          {currentUser.role === 'guru' ? (
            /* MENU KHUSUS ROLE GURU */
            <div className="space-y-3">
              {!isSidebarCollapsed ? (
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 px-2 flex items-center justify-between">
                  <span>Menu Akses Guru</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 font-bold text-emerald-300">
                    PENDIDIK
                  </span>
                </div>
              ) : (
                <div className="w-full h-px bg-slate-800 my-1" />
              )}

              <div className="space-y-1.5">
                {renderNavButton('menu-guru-administrasi', 'administrasi-guru', '1. Administrasi Guru', FolderCheck, administrasiGuruList?.length || 0, undefined, 'emerald')}
                {renderNavButton('menu-guru-program-unggulan', 'program-unggulan', '2. Program Unggulan Sekolah', Award, undefined, undefined, 'blue')}
                {renderNavButton('menu-guru-supervisi-akademik', 'supervisi-akademik', '3. Supervisi Akademik', ClipboardCheck, supervisiAkademikList.length, undefined, 'violet')}
                {renderNavButton('menu-guru-supervisi-manajerial', 'supervisi-manajerial', '4. Supervisi Manajerial', ShieldCheck, undefined, undefined, 'indigo')}
              </div>
            </div>
          ) : (
            /* MENU LENGKAP UNTUK KEPALA SEKOLAH, ADMIN & TATA USAHA */
            <>
              {/* Section: Utama */}
              <div className="space-y-1">
                {!isSidebarCollapsed ? (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                    Utama
                  </div>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-1" />
                )}
                
                {renderNavButton('menu-dashboard', 'dashboard', 'Dashboard Ringkasan', LayoutDashboard, undefined, 'UTAMA', 'blue')}
                {renderNavButton('menu-profil-sekolah', 'profil-sekolah', 'Profil Sekolah', Building2, undefined, undefined, 'blue')}
              </div>

              {/* Section: Manajemen Data */}
              <div className="space-y-1">
                {!isSidebarCollapsed ? (
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Manajemen Data</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      DATA POKOK
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-1" />
                )}
                
                {renderNavButton('menu-data-ptk', 'data-ptk', '1. PTK (Pendidik & Tendik)', Users, ptkList.length, undefined, 'emerald')}
                {renderNavButton('menu-data-siswa', 'data-siswa', '2. Data Siswa', GraduationCap, siswaList.length, undefined, 'blue')}
                {renderNavButton('menu-data-kelas', 'data-kelas', '3. Data Kelas (Rombel)', School, kelasList.length, undefined, 'amber')}
              </div>

              {/* Section: Manajemen Sekolah */}
              <div className="space-y-1">
                {!isSidebarCollapsed ? (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                    Manajemen Sekolah
                  </div>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-1" />
                )}
                
                {renderNavButton('menu-perencanaan', 'perencanaan', '1. Perencanaan (KSP, RKT, RKAS)', FileText, perencanaanList.length, undefined, 'blue')}
                {renderNavButton('menu-pbd', 'pbd', '2. Perencanaan Berbasis Data (PBD)', TrendingUp, pbdList.length, undefined, 'emerald')}
                {renderNavButton('menu-program-unggulan', 'program-unggulan', '3. Program Unggulan', Award, undefined, undefined, 'blue')}
                {renderNavButton('menu-ptk-surat', 'ptk-surat', '4. Persuratan & MOU Kemitraan', FileText, suratList.length, undefined, 'blue')}
                {renderNavButton('menu-administrasi-guru', 'administrasi-guru', '5. Administrasi Guru', FolderCheck, administrasiGuruList?.length || 0, undefined, 'emerald')}
              </div>

              {/* Section: Operasional & Kesiswaan */}
              <div className="space-y-1">
                {!isSidebarCollapsed ? (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
                    Operasional & Kesiswaan
                  </div>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-1" />
                )}
                
                {renderNavButton('menu-kesiswaan', 'kesiswaan', 'Manajemen Kesiswaan', GraduationCap, siswaList.length, undefined, 'cyan')}
                {renderNavButton('menu-supervisi-akademik', 'supervisi-akademik', 'Supervisi Akademik', ClipboardCheck, supervisiAkademikList.length, undefined, 'violet')}
                {renderNavButton('menu-supervisi-manajerial', 'supervisi-manajerial', 'Supervisi Manajerial', ShieldCheck, undefined, undefined, 'indigo')}
                {renderNavButton('menu-keuangan', 'keuangan', 'Keuangan & BOSP', Wallet, rkasList.length, undefined, 'blue')}
                {renderNavButton('menu-sarpras', 'sarpras', 'Sarana & Prasarana', PackageCheck, sarprasList.length, undefined, 'blue')}
                {renderNavButton(
                  'menu-administrasi-ks',
                  'administrasi-ks',
                  'Administrasi Kepala Sekolah',
                  Briefcase,
                  (agendaKSList?.length || 0) + (bukuTamuList?.length || 0) + (jurnalKSList?.length || 0) + (keputusanSKList?.length || 0) + (rencanaPerbaikanList?.length || 0),
                  undefined,
                  'amber'
                )}
              </div>

              {/* Section: Pengaturan & Enrol Admin (HANYA UNTUK ROLE ADMIN) */}
              {currentUser.role === 'admin' && (
                <div className="pt-2 border-t border-slate-700/80 space-y-1">
                  {!isSidebarCollapsed ? (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2 px-2 flex items-center justify-between">
                      <span>Pengaturan Khusus Admin</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800/60 font-bold text-rose-300">
                        ADMIN
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-px bg-rose-950/80 my-1" />
                  )}

                  {renderNavButton('menu-pengaturan-admin', 'pengaturan', 'Pengaturan', Settings, undefined, 'ENROL & CLOUD', 'rose')}
                </div>
              )}
            </>
          )}

        </div>

        {/* Sidebar Footer: Active User Geometric Indicator & Logout */}
        <div className={`border-t border-slate-700 bg-[#0f172a] transition-all duration-300 ${isSidebarCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3.5 flex items-center justify-between gap-2'}`}>
          {isSidebarCollapsed ? (
            /* Collapsed Footer */
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="relative group">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-default">
                  {currentUser.nama.charAt(0)}
                </div>
                {/* User Tooltip on hover */}
                <div className="absolute left-full ml-3 bottom-0 px-3 py-2 bg-slate-900 text-white rounded-lg shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity whitespace-nowrap hidden lg:block text-xs">
                  <div className="font-bold">{currentUser.nama}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{roleLabels[currentUser.role]}</div>
                </div>
              </div>

              <button
                id="sidebar-btn-logout-collapsed"
                type="button"
                onClick={logout}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Keluar ke Halaman Login"
                aria-label="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Expanded Footer */
            <>
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
                aria-label="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
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
