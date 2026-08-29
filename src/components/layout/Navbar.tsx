import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TARGET_DRIVE_FOLDER_URL } from '../../services/driveService';
import { LoginGuruModal } from '../modules/user/LoginGuruModal';
import {
  Menu,
  Printer,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Shield,
  GraduationCap,
  Briefcase,
  FileSpreadsheet,
  Building,
  Check,
  HardDrive,
  ExternalLink,
  Cloud,
  RefreshCw,
  Flame,
  LogIn,
  LogOut,
  Sparkles,
  KeyRound
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
    firebaseUser,
    isFirebaseConnected,
    isCloudSyncing,
    lastCloudSync,
    loginWithGoogle,
    logoutFirebase,
    forceCloudSync
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCloudMenu, setShowCloudMenu] = useState(false);
  const [isLoginGuruModalOpen, setIsLoginGuruModalOpen] = useState(false);

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
        return '1. Manajemen Kepala Sekolah (Agenda, Buku Tamu, Jurnal, SK & Rencana Perbaikan)';
      case 'enrol-pengguna':
        return 'Enrol Pengguna Guru, Admin & Tenaga Kependidikan';
      default:
        return 'Sistem Informasi Manajemen Sekolah';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="btn-toggle-sidebar"
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden focus:outline-none"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-slate-800 truncate leading-snug">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Actions & User Switcher */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs font-medium text-slate-500">
        
        <span className="hidden md:inline font-medium text-slate-500 text-xs">
          Tahun Ajaran {profilSekolah?.tahunPelajaran || '2024/2025'}
        </span>

        {/* Firebase Cloud Firestore Sync Button */}
        <div className="relative">
          <button
            id="btn-firebase-cloud-sync"
            type="button"
            onClick={() => setShowCloudMenu(!showCloudMenu)}
            title="Status Database Cloud Firestore (Firebase)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer bg-amber-50/80 border-amber-200 text-amber-900 hover:bg-amber-100"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span className="hidden sm:inline">Firebase</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {showCloudMenu && (
            <div className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Firebase Firestore</h4>
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      Cloud Database Terkoneksi
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mb-3 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sinkron Terakhir:</span>
                  <span className="font-semibold text-slate-800">{lastCloudSync || 'Otomatis aktif'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Akun Firebase:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {firebaseUser ? (firebaseUser.displayName || firebaseUser.email) : 'Tamu / Offline Ready'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  id="btn-trigger-cloud-sync"
                  onClick={() => {
                    forceCloudSync();
                    setShowCloudMenu(false);
                  }}
                  disabled={isCloudSyncing}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                  <span>{isCloudSyncing ? 'Menyinkronkan...' : 'Sinkronkan ke Cloud Sekarang'}</span>
                </button>

                {firebaseUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      logoutFirebase();
                      setShowCloudMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun Firebase</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      loginWithGoogle();
                      setShowCloudMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>Login dengan Akun Google</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Google Drive Folder Link */}
        <a
          id="btn-google-drive-folder"
          href={TARGET_DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Buka Folder Google Drive SDN Lanto Dg. Pasewang"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
        >
          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
          <span>Google Drive</span>
          <ExternalLink className="w-3 h-3 text-emerald-500" />
        </a>

        <div className="hidden md:block h-4 w-[1px] bg-slate-300"></div>

        {/* Print / Cetak Laporan */}
        <button
          id="btn-cetak-halaman"
          type="button"
          onClick={handlePrint}
          title="Cetak Halaman / Ekspor Laporan PDF"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Cetak</span>
        </button>

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
                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                >
                  Ya, Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Button Login Guru (User: NIP, Pass: 123456) */}
        <button
          id="btn-navbar-login-guru"
          type="button"
          onClick={() => setIsLoginGuruModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          title="Login Pengguna Guru (User: NIP, Password: 123456)"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Login Guru (NIP)</span>
          <span className="sm:hidden">Login Guru</span>
        </button>

        {/* Quick Role & User Switcher Dropdown */}
        <div className="relative">
          <button
            id="btn-user-switcher"
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-left transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser.nama.charAt(0)}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.nama}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                Role: <span className="font-semibold text-blue-600">{currentUser.role.replace('_', ' ')}</span>
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
                {users.map(user => {
                  const isCurrent = user.id === currentUser.id;
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

              <div className="px-3 pt-2 border-t border-slate-100 mt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(false);
                    setIsLoginGuruModalOpen(true);
                  }}
                  className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Login NIP Guru</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                  }}
                  className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
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

      {/* Modal Login Guru */}
      <LoginGuruModal
        isOpen={isLoginGuruModalOpen}
        onClose={() => setIsLoginGuruModalOpen(false)}
      />
    </header>
  );
};
