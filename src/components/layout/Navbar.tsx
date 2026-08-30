import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  RotateCcw,
  ChevronDown,
  Shield,
  GraduationCap,
  Briefcase,
  Building,
  Check,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    activeTab,
    currentUser,
    users,
    switchUserById,
    logout,
    resetAllData,
    profilSekolah,
    isSidebarCollapsed,
    toggleSidebarCollapse
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const safeUsers = users || [];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard & Ringkasan Manajemen Sekolah';
      case 'profil-sekolah':
        return 'Menu Profil Sekolah UPTD SPF SDN Lanto Dg. Pasewang';
      case 'perencanaan':
        return '1. Perencanaan (KSP, RKT/RKS, RKAS, Prog. KS, Kalender, Target)';
      case 'pbd':
        return '2. Perencanaan Berbasis Data (PBD & Rapor Pendidikan)';
      case 'program-unggulan':
        return '3. Program Unggulan (Program Sekolah, Praktik Baik, Dokumentasi)';
      case 'ptk-surat':
        return '4. Manajemen PTK (Surat Masuk & Keluar, MOU Kerjasama)';
      case 'administrasi-guru':
      case 'manajemen-administrasi-guru':
        return '5. Administrasi Guru (Perangkat Pembelajaran & Evaluasi)';
      case 'kesiswaan':
        return '1. Manajemen Kesiswaan (Data Murid, Prestasi, Karakter, Ekskul, Masalah)';
      case 'supervisi-akademik':
        return '1. Supervisi Akademik (Program, Jadwal, Observasi, Umpan Balik, Tindak Lanjut)';
      case 'supervisi-manajerial':
        return '2. Supervisi Manajerial (Instrumen, Pemantauan, Evaluasi, Tindak Lanjut)';
      case 'keuangan':
        return '1. Manajemen Keuangan (RKAS, Realisasi Kegiatan, Monitoring BOSP)';
      case 'sarpras':
        return '1. Manajemen Sarpras (Inventaris, Kondisi, Kebutuhan, Pemeliharaan, Peminjaman)';
      case 'administrasi-ks':
      case 'manajemen-kepala-sekolah':
        return '1. Manajemen Kepala Sekolah (Agenda, Buku Tamu, Jurnal, SK & Rencana Perbaikan)';
      case 'pengaturan':
      case 'pengaturan-admin':
      case 'settings':
      case 'enrol-pengguna':
      case 'user-management':
        return 'Pusat Pengaturan Khusus Administrator, Enrol & Cloud Storage';
      default:
        return 'Sistem Informasi Manajemen Sekolah';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
      {/* Left side: Hamburger (Mobile) / Fold Toggle (Desktop) & Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger */}
        <button
          id="btn-toggle-sidebar-mobile"
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden focus:outline-none cursor-pointer"
          aria-label="Buka Menu Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Fold / Expand Button */}
        <button
          id="btn-toggle-sidebar-desktop"
          type="button"
          onClick={toggleSidebarCollapse}
          className="hidden lg:flex p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors focus:outline-none cursor-pointer shadow-2xs items-center justify-center"
          title={isSidebarCollapsed ? "Buka / Rentangkan Sidebar" : "Lipat Sidebar ke Samping"}
          aria-label={isSidebarCollapsed ? "Buka Sidebar" : "Lipat Sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4.5 h-4.5 text-blue-600" />
          ) : (
            <PanelLeftClose className="w-4.5 h-4.5 text-slate-600" />
          )}
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-slate-800 truncate leading-snug">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Actions & User Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-xs font-medium text-slate-500">
        
        <span className="hidden md:inline font-medium text-slate-500 text-xs">
          Tahun Ajaran {profilSekolah?.tahunPelajaran || '2024/2025'}
        </span>

        {/* Reset Data to initial */}
        <div className="relative">
          <button
            id="btn-reset-data"
            type="button"
            onClick={() => setShowResetConfirm(!showResetConfirm)}
            title="Reset Data ke Default"
            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {showResetConfirm && (
            <div className="absolute right-0 mt-2 w-64 p-3 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95">
              <p className="text-xs text-slate-700 font-medium">
                Kembalikan semua data ke data contoh awal UPTD SPF SDN Lanto Dg. Pasewang?
              </p>
              <div className="mt-2.5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Ya, Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Role & User Switcher Dropdown */}
        <div className="relative">
          <button
            id="btn-user-switcher"
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-left transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser?.nama ? currentUser.nama.charAt(0) : 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser?.nama || 'Pengguna'}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                Role: <span className="font-semibold text-blue-600">{(currentUser?.role || 'guru').replace('_', ' ')}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Beralih Akun (Role Switcher)
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pilih akun pengguna untuk mencoba hak akses guru, admin, atau kepala sekolah.
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto py-1">
                {safeUsers.map(user => {
                  const isCurrent = currentUser && user.id === currentUser.id;
                  const roleBadgeStyle = {
                    admin: 'bg-rose-100 text-rose-800',
                    kepala_sekolah: 'bg-purple-100 text-purple-800',
                    guru: 'bg-emerald-100 text-emerald-800',
                    tata_usaha: 'bg-blue-100 text-blue-800'
                  }[user.role];

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        switchUserById(user.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        isCurrent ? 'bg-blue-50/70' : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {user.nama}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {user.jabatan}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded capitalize ${roleBadgeStyle}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-3 pt-2 border-t border-slate-100 mt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                  }}
                  className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Logout Button */}
        <button
          id="btn-navbar-logout"
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-all cursor-pointer shadow-xs"
          title="Keluar ke Halaman Login Utama"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden xl:inline">Keluar</span>
        </button>

      </div>
    </header>
  );
};
