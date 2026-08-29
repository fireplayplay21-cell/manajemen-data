/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { ShieldAlert } from 'lucide-react';
import { ActiveTab } from './types';

// Modules
import { DashboardOverview } from './components/modules/dashboard/DashboardOverview';
import { ProfilSekolahView } from './components/modules/profil/ProfilSekolahView';
import { ManajemenDataView } from './components/modules/manajemen-data/ManajemenDataView';
import { PerencanaanView } from './components/modules/manajemen-sekolah/PerencanaanView';
import { PerencanaanBerbasisDataView } from './components/modules/manajemen-sekolah/PerencanaanBerbasisDataView';
import { ProgramUnggulanView } from './components/modules/manajemen-sekolah/ProgramUnggulanView';
import { ManajemenPTKView } from './components/modules/manajemen-sekolah/ManajemenPTKView';
import { KesiswaanView } from './components/modules/kesiswaan/KesiswaanView';
import { SupervisiAkademikView } from './components/modules/supervisi/SupervisiAkademikView';
import { SupervisiManajerialView } from './components/modules/supervisi/SupervisiManajerialView';
import { KeuanganView } from './components/modules/keuangan/KeuanganView';
import { SarprasView } from './components/modules/sarpras/SarprasView';
import { KepalaSekolahView } from './components/modules/kepala-sekolah/KepalaSekolahView';
import { AdministrasiGuruView } from './components/modules/guru/AdministrasiGuruView';
import { UserManagementView } from './components/modules/user/UserManagementView';
import { LoginPage } from './components/modules/auth/LoginPage';

const GURU_ALLOWED_TABS: ActiveTab[] = [
  'administrasi-guru',
  'manajemen-administrasi-guru',
  'program-unggulan',
  'manajemen-program-unggulan',
  'supervisi-akademik',
  'supervisi-manajerial'
];

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated, currentUser } = useApp();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Auto redirect if user is Guru and currently on an unauthorized tab
  useEffect(() => {
    if (currentUser?.role === 'guru' && !GURU_ALLOWED_TABS.includes(activeTab)) {
      setActiveTab('administrasi-guru');
    }
  }, [currentUser?.role, activeTab, setActiveTab]);

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    // Role guard: Guru only has access to Administrasi Guru, Program Unggulan, Supervisi Akademik, and Supervisi Manajerial
    if (currentUser?.role === 'guru' && !GURU_ALLOWED_TABS.includes(activeTab)) {
      return (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-sm my-12">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Akses Terbatas untuk Role Guru</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Akun Anda dengan peran <strong>Guru Pendidik</strong> hanya diizinkan untuk mengakses modul <strong>Administrasi Guru</strong>, <strong>Program Unggulan Sekolah</strong>, <strong>Supervisi Akademik</strong>, dan <strong>Supervisi Manajerial</strong>.
          </p>
          <button
            onClick={() => setActiveTab('administrasi-guru')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Buka Administrasi Guru
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'profil-sekolah':
        return <ProfilSekolahView />;
      case 'manajemen-data':
      case 'data-ptk':
      case 'data-siswa':
      case 'data-kelas':
        return <ManajemenDataView />;
      case 'perencanaan':
      case 'manajemen-perencanaan':
        return <PerencanaanView />;
      case 'pbd':
      case 'manajemen-pbd':
        return <PerencanaanBerbasisDataView />;
      case 'program-unggulan':
      case 'manajemen-program-unggulan':
        return <ProgramUnggulanView />;
      case 'ptk-surat':
      case 'manajemen-ptk':
        return <ManajemenPTKView />;
      case 'administrasi-guru':
      case 'manajemen-administrasi-guru':
        return <AdministrasiGuruView />;
      case 'kesiswaan':
      case 'manajemen-kesiswaan':
        return <KesiswaanView />;
      case 'supervisi-akademik':
        return <SupervisiAkademikView />;
      case 'supervisi-manajerial':
        return <SupervisiManajerialView />;
      case 'keuangan':
      case 'manajemen-keuangan':
        return <KeuanganView />;
      case 'sarpras':
      case 'manajemen-sarpras':
        return <SarprasView />;
      case 'administrasi-ks':
      case 'manajemen-kepala-sekolah':
        return <KepalaSekolahView />;
      case 'enrol-pengguna':
      case 'user-management':
        return <UserManagementView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased text-slate-800 font-sans">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="lg:pl-80 flex flex-col flex-1 min-h-screen transition-all duration-300">
        <Navbar onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
        <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
          <p>
            © {new Date().getFullYear()} UPTD SPF SDN Lanto Dg. Pasewang Kota Makassar. Sistem Informasi Manajemen Data Sekolah Terpadu.
          </p>
        </footer>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

