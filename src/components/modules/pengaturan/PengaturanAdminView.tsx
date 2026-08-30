import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserAccount, UserRole } from '../../../types';
import { Modal } from '../../common/Modal';
import { PasFotoUploader } from '../../common/PasFotoUploader';
import { LoginGuruModal } from '../user/LoginGuruModal';
import { KartuAksesLoginModal } from '../user/KartuAksesLoginModal';
import { GoogleDriveExplorerModal } from '../drive/GoogleDriveExplorerModal';
import { LogoBrandingManager } from './LogoBrandingManager';
import { TARGET_DRIVE_FOLDER_URL, TARGET_DRIVE_FOLDER_ID } from '../../../services/driveService';
import {
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  KeyRound,
  Key,
  HardDrive,
  Cloud,
  Flame,
  RefreshCw,
  Printer,
  Download,
  Upload,
  Database,
  Search,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  FolderOpen,
  LogIn,
  LogOut,
  RotateCcw,
  GraduationCap,
  Layers,
  FileSpreadsheet,
  Check,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

export const PengaturanAdminView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    users,
    userList,
    addUser,
    updateUser,
    deleteUser,
    resetUserPasswordToDefault,
    syncPTKToUserAccounts,
    ptkList,
    kelasList,
    siswaList,
    perencanaanList,
    pbdList,
    programUnggulanList,
    suratList,
    mouList,
    supervisiAkademikList,
    supervisiManajerialList,
    rkasList,
    transaksiList,
    sarprasList,
    agendaKSList,
    bukuTamuList,
    jurnalKSList,
    keputusanSKList,
    rencanaPerbaikanList,
    administrasiGuruList,
    profilSekolah,
    firebaseUser,
    isFirebaseConnected,
    isCloudSyncing,
    lastCloudSync,
    forceCloudSync,
    loginWithGoogle,
    logoutFirebase,
    resetAllData,
    showToast,
    setActiveTab
  } = useApp();

  // Active sub-tab state inside Pengaturan
  const [activeSubTab, setActiveSubTab] = useState<'enrol' | 'login-guru' | 'logo' | 'cloud' | 'backup'>('enrol');

  // Search & Filter for User Enrolment
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Search for Guru Credentials
  const [guruSearch, setGuruSearch] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [quickPhotoUser, setQuickPhotoUser] = useState<UserAccount | null>(null);
  const [isLoginGuruModalOpen, setIsLoginGuruModalOpen] = useState(false);
  const [isKartuAksesModalOpen, setIsKartuAksesModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [defaultNipForLogin, setDefaultNipForLogin] = useState('');

  // Password visibility maps
  const [visiblePasswords, setVisiblePasswords] = useState<{ [userId: string]: boolean }>({});
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Form State for User
  const [formData, setFormData] = useState<Omit<UserAccount, 'id'>>({
    nama: '',
    nip: '',
    email: '',
    password: '123456',
    role: 'guru',
    jabatan: 'Guru Kelas',
    kelasTugas: 'Kelas 1A',
    mataPelajaran: 'Tematik Terpadu',
    status: 'Aktif',
    foto: '',
    telepon: '081234567890',
    tanggalEnrol: new Date().toISOString().split('T')[0]
  });

  const safeUserList = users || userList || [];
  const safePtkList = ptkList || [];

  // Helper to reliably get photo URL from User account or corresponding PTK record
  const getUserPhoto = (user: UserAccount): string => {
    if (user.foto && user.foto.trim() !== '') return user.foto;
    const userNipDigits = (user.nip || '').replace(/\D/g, '');
    const matchingPTK = safePtkList.find(p => {
      const ptkNipDigits = (p.nip || '').replace(/\D/g, '');
      if (userNipDigits && ptkNipDigits && userNipDigits.length >= 6 && userNipDigits === ptkNipDigits) {
        return true;
      }
      return p.nama.trim().toLowerCase() === user.nama.trim().toLowerCase();
    });
    if (matchingPTK && matchingPTK.foto && matchingPTK.foto.trim() !== '') {
      return matchingPTK.foto;
    }
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
  };

  // Filtered users for Enrolment Tab
  const filteredUsers = safeUserList.filter(u => {
    const matchRole = selectedRole === 'Semua' || u.role === selectedRole;
    const matchStatus = selectedStatus === 'Semua' || u.status === selectedStatus;
    const matchSearch =
      (u.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nip || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.jabatan || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  // Guru and PTK users for Login Guru (NIP) Tab
  const guruListAccounts = safeUserList.filter(
    u => u.role === 'guru' || u.role === 'kepala_sekolah' || u.role === 'tata_usaha'
  ).filter(u => {
    const matchSearch =
      (u.nama || '').toLowerCase().includes(guruSearch.toLowerCase()) ||
      (u.nip || '').toLowerCase().includes(guruSearch.toLowerCase()) ||
      (u.jabatan || '').toLowerCase().includes(guruSearch.toLowerCase());
    return matchSearch;
  });

  // RESTRICT ACCESS: ONLY ADMIN CAN VIEW
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200/60 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Hak Akses Terbatas</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Menu Khusus Administrator</h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Halaman <strong>Pengaturan Sistem & Enrol Akun</strong> hanya dapat diakses oleh akun dengan hak akses <strong>Administrator</strong>. Anda saat ini login sebagai <strong>{currentUser?.nama || 'Pengguna'}</strong> ({currentUser?.role === 'guru' ? 'Guru Pendidik' : currentUser?.role === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Tata Usaha'}).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab(currentUser?.role === 'guru' ? 'administrasi-guru' : 'dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Kembali ke Menu Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setFormData({
      nama: '',
      nip: '',
      email: '',
      password: '123456',
      role: 'guru',
      jabatan: 'Guru Kelas',
      kelasTugas: 'Kelas 1A',
      mataPelajaran: 'Tematik Terpadu',
      status: 'Aktif',
      foto: '',
      telepon: '081234567890',
      tanggalEnrol: new Date().toISOString().split('T')[0]
    });
    setEditingUser(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      nama: user.nama,
      nip: user.nip,
      email: user.email,
      password: user.password || '123456',
      role: user.role,
      jabatan: user.jabatan,
      kelasTugas: user.kelasTugas || '',
      mataPelajaran: user.mataPelajaran || '',
      status: user.status,
      foto: getUserPhoto(user),
      telepon: user.telepon || '',
      tanggalEnrol: user.tanggalEnrol
    });
    setIsAddModalOpen(true);
  };

  const handleSelectPTK = (ptkNama: string) => {
    const p = safePtkList.find(item => item.nama === ptkNama);
    if (p) {
      let role: UserRole = 'guru';
      if (p.jabatan.toLowerCase().includes('kepala sekolah')) {
        role = 'kepala_sekolah';
      } else if (
        p.jabatan.toLowerCase().includes('administrasi') ||
        p.jabatan.toLowerCase().includes('tata usaha') ||
        p.jabatan.toLowerCase().includes('bendahara')
      ) {
        role = 'tata_usaha';
      }

      setFormData(prev => ({
        ...prev,
        nama: p.nama,
        email: p.email || (p.nama.toLowerCase().replace(/[^a-z0-9]/g, '') + '@sdnlanto.sch.id'),
        nip: p.nip || '',
        role,
        jabatan: p.jabatan,
        password: '123456',
        telepon: p.telepon || prev.telepon,
        foto: p.foto || prev.foto
      }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    showToast('info', 'Beralih Akun', `Sekarang Anda bertindak sebagai ${user.nama} (${user.role}).`);
  };

  const handleTestLoginGuru = (user: UserAccount) => {
    setDefaultNipForLogin(user.nip || user.email);
    setIsLoginGuruModalOpen(true);
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const copyText = (text: string, label: string = 'Teks') => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Disalin', `${label} berhasil disalin ke clipboard.`);
  };

  // Export full backup database JSON
  const handleExportBackupJSON = () => {
    const fullBackup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      schoolName: profilSekolah?.namaSekolah || 'UPTD SPF SDN Lanto Dg. Pasewang',
      npsn: profilSekolah?.npsn || '40307379',
      data: {
        users: safeUserList,
        profilSekolah,
        ptkList,
        kelasList,
        siswaList,
        perencanaanList,
        pbdList,
        programUnggulanList,
        suratList,
        mouList,
        supervisiAkademikList,
        supervisiManajerialList,
        rkasList,
        transaksiList,
        sarprasList,
        agendaKSList,
        bukuTamuList,
        jurnalKSList,
        keputusanSKList,
        rencanaPerbaikanList,
        administrasiGuruList
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup-sdn-lanto-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('success', 'Backup Berhasil', 'File cadangan JSON database sekolah berhasil diunduh.');
  };

  // Import backup file JSON
  const handleImportBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (parsedData?.data) {
            // Save to localStorage keys
            Object.entries(parsedData.data).forEach(([key, val]) => {
              localStorage.setItem(`sdn_lanto_${key}`, JSON.stringify(val));
            });
            showToast('success', 'Restore Selesai', 'Data backup berhasil dipulihkan. Memuat ulang sistem...');
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          } else {
            showToast('error', 'Format Tidak Valid', 'Format file backup JSON tidak sesuai.');
          }
        } catch (err) {
          showToast('error', 'Gagal Membaca File', 'Terjadi kesalahan saat membaca file JSON.');
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Pusat Kontrol Khusus Administrator</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
            Pengaturan & Enrol Admin
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Modul terpadu untuk pengelolaan akun pengguna, kredensial login guru berbasis NIP, sinkronisasi Cloud Firestore & Google Drive, serta pencadangan database sekolah.
          </p>
        </div>

        {/* Quick Admin Action Controls: Login Guru (NIP), Cetak, Google Drive & Firebase Firestore */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Login Guru (NIP) Modal Trigger */}
          <button
            type="button"
            id="btn-pengaturan-login-guru"
            onClick={() => {
              setDefaultNipForLogin('');
              setIsLoginGuruModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Buka Form Login Cepat Guru (User: NIP, Password: 123456)"
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <span>Login Guru (NIP)</span>
          </button>

          {/* Firebase Cloud Sync & Status */}
          <button
            type="button"
            id="btn-pengaturan-firebase-sync"
            onClick={forceCloudSync}
            disabled={isCloudSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            title="Sinkronkan database ke Cloud Firestore (Firebase)"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <span>{isCloudSyncing ? 'Menyinkronkan...' : 'Firebase Cloud'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Google Drive Explorer */}
          <button
            type="button"
            id="btn-pengaturan-drive-explorer"
            onClick={() => setIsDriveModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Buka Google Drive Explorer & Manajemen Berkas Sekolah"
          >
            <HardDrive className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Google Drive</span>
            <FolderOpen className="w-3 h-3 text-blue-500" />
          </button>

          {/* Cetak / Print Halaman & Laporan */}
          <button
            type="button"
            id="btn-pengaturan-cetak"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Cetak Halaman / Ekspor Dokumen ke Format PDF"
          >
            <Printer className="w-4 h-4 text-slate-600 shrink-0" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          id="tab-btn-enrol-pengguna"
          type="button"
          onClick={() => setActiveSubTab('enrol')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'enrol'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Enrol Pengguna</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            activeSubTab === 'enrol' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
          }`}>
            {safeUserList.length} Akun
          </span>
        </button>

        <button
          id="tab-btn-login-guru-nip"
          type="button"
          onClick={() => setActiveSubTab('login-guru')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'login-guru'
              ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <span>Login Guru (NIP)</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            activeSubTab === 'login-guru' ? 'bg-emerald-100 text-emerald-800 font-mono' : 'bg-slate-200 text-slate-600 font-mono'
          }`}>
            123456
          </span>
        </button>

        <button
          id="tab-btn-logo-branding"
          type="button"
          onClick={() => setActiveSubTab('logo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'logo'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-indigo-600" />
          <span>Logo & Branding Sekolah</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
            activeSubTab === 'logo' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
          }`}>
            ASSET WEB
          </span>
        </button>

        <button
          id="tab-btn-cloud-storage"
          type="button"
          onClick={() => setActiveSubTab('cloud')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'cloud'
              ? 'bg-white text-amber-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Cloud className="w-4 h-4 text-amber-600" />
          <span>Cloud Storage & Database</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>

        <button
          id="tab-btn-backup-restore"
          type="button"
          onClick={() => setActiveSubTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-white text-purple-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Database className="w-4 h-4 text-purple-600" />
          <span>Backup & Keamanan Sistem</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: ENROL PENGGUNA                                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'enrol' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Akun Terdaftar</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{safeUserList.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Semua Role Pengguna</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Guru Pendidik</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {safeUserList.filter(u => u.role === 'guru').length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Akses Administrasi Guru</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Kepala Sekolah & TU</div>
              <div className="text-2xl font-black text-purple-700 mt-1">
                {safeUserList.filter(u => u.role === 'kepala_sekolah' || u.role === 'tata_usaha').length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Akses Manajerial & Surat</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Status Akun Aktif</div>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {safeUserList.filter(u => u.status === 'Aktif').length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Siap Login NIP</div>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, NIP, email..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
                >
                  <option value="Semua">Semua Peran (Role)</option>
                  <option value="guru">Guru Pendidik</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                  <option value="admin">Administrator</option>
                  <option value="tata_usaha">Tata Usaha</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsKartuAksesModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cetak Kartu Login</span>
                </button>

                <button
                  type="button"
                  onClick={syncPTKToUserAccounts}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  title="Otomatis buat akun login untuk semua data PTK"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sinkron dari PTK</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Pengguna</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">Pengguna</th>
                    <th className="py-3 px-4">Peran (Role)</th>
                    <th className="py-3 px-4">Jabatan / Tugas</th>
                    <th className="py-3 px-4">Password Login</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada data pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => {
                      const isCurrent = currentUser?.id === user.id;
                      const isPasswordShown = visiblePasswords[user.id];

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative group shrink-0">
                                <img
                                  src={getUserPhoto(user)}
                                  alt={user.nama}
                                  className="w-10 h-13 object-cover rounded-lg border border-slate-200 shadow-2xs group-hover:opacity-90 transition-opacity bg-slate-100"
                                />
                                <button
                                  type="button"
                                  onClick={() => setQuickPhotoUser(user)}
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center text-white transition-opacity cursor-pointer shadow-xs"
                                  title="Ganti Pas Foto (3x4)"
                                >
                                  <Camera className="w-4 h-4 text-white" />
                                </button>
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <span>{user.nama}</span>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[9px] font-bold">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-slate-700 font-semibold">NIP: {user.nip || '-'}</span>
                                  {user.nip && (
                                    <button
                                      type="button"
                                      onClick={() => copyText(user.nip, 'NIP')}
                                      className="text-slate-400 hover:text-slate-600"
                                      title="Salin NIP"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                              user.role === 'admin'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : user.role === 'kepala_sekolah'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : user.role === 'tata_usaha'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {user.role === 'admin'
                                ? 'Administrator'
                                : user.role === 'kepala_sekolah'
                                ? 'Kepala Sekolah'
                                : user.role === 'tata_usaha'
                                ? 'Tata Usaha'
                                : 'Guru Pendidik'}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-700">{user.jabatan}</div>
                            {user.kelasTugas && (
                              <div className="text-[11px] text-slate-500 font-semibold">{user.kelasTugas}</div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/80">
                              <span className="font-mono font-bold text-xs text-slate-700">
                                {isPasswordShown ? user.password || '123456' : '••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                                title={isPasswordShown ? 'Sembunyikan password' : 'Lihat password'}
                              >
                                {isPasswordShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => copyText(user.password || '123456', 'Password')}
                                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                                title="Salin password"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.status === 'Aktif'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {user.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Switch user test */}
                              <button
                                type="button"
                                onClick={() => handleSwitchUser(user)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Uji masuk sebagai pengguna ini"
                              >
                                <LogIn className="w-3.5 h-3.5" />
                              </button>

                              {/* Reset password */}
                              <button
                                type="button"
                                onClick={() => resetUserPasswordToDefault(user.id)}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Reset password ke default (123456)"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit user */}
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(user)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Pengguna"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete user */}
                              {user.role !== 'admin' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${user.nama}?`)) {
                                      deleteUser(user.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus Akun"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: LOGIN GURU (NIP)                                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'login-guru' && (
        <div className="space-y-6">
          {/* Format Credentials Banner */}
          <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-xs">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>SOP Autentikasi Pengguna Guru Resmi</span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Kredensial Login Pengguna Guru (NIP)
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Semua guru pendidik UPTD SPF SDN Lanto Dg. Pasewang dapat langsung masuk ke sistem menggunakan <strong className="text-white">NIP masing-masing</strong> dan kata sandi standar <strong className="text-emerald-300 font-mono font-bold">123456</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                  <div className="flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    <span className="text-slate-400">User / ID:</span>
                    <span className="font-mono text-emerald-200 font-bold">NIP 18 Digit</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    <span className="text-slate-400">Password Default:</span>
                    <span className="font-mono text-emerald-300 font-bold">123456</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setDefaultNipForLogin('');
                  setIsLoginGuruModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Buka Portal Login Guru</span>
              </button>

              <button
                type="button"
                onClick={() => setIsKartuAksesModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-300" />
                <span>Cetak Kartu Akses</span>
              </button>
            </div>
          </div>

          {/* Teacher List and Credential Generator */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-800">Daftar Akun Login Guru & Tenaga Kependidikan</h4>
                <p className="text-xs text-slate-500">Salin kredensial atau uji coba login langsung untuk tiap guru</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={guruSearch}
                  onChange={e => setGuruSearch(e.target.value)}
                  placeholder="Cari guru atau NIP..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guruListAccounts.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                  Tidak ditemukan akun guru yang sesuai.
                </div>
              ) : (
                guruListAccounts.map(guru => {
                  return (
                    <div
                      key={guru.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative group shrink-0">
                          <img
                            src={getUserPhoto(guru)}
                            alt={guru.nama}
                            className="w-12 h-16 object-cover rounded-lg border border-slate-200 shadow-2xs group-hover:opacity-90 transition-opacity bg-slate-100"
                          />
                          <button
                            type="button"
                            onClick={() => setQuickPhotoUser(guru)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center text-white transition-opacity cursor-pointer shadow-xs"
                            title="Ganti Pas Foto Guru"
                          >
                            <Camera className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-slate-800 text-xs truncate" title={guru.nama}>
                            {guru.nama}
                          </h5>
                          <div className="text-[11px] font-mono font-semibold text-emerald-700 mt-0.5">
                            NIP: {guru.nip || '-'}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">
                            {guru.jabatan} {guru.kelasTugas ? `• ${guru.kelasTugas}` : ''}
                          </div>
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 w-fit">
                            <span className="text-slate-400">Pass:</span>
                            <span className="font-bold text-slate-700">{guru.password || '123456'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            const cred = `Nama: ${guru.nama}\nNIP / Username: ${guru.nip}\nPassword: ${guru.password || '123456'}\nURL: Website SIM SDN Lanto Dg. Pasewang`;
                            copyText(cred, `Kredensial ${guru.nama}`);
                          }}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Salin Kredensial</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTestLoginGuru(guru)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold border border-emerald-200/80 cursor-pointer"
                        >
                          <LogIn className="w-3 h-3 text-emerald-600" />
                          <span>Uji Login NIP</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB: LOGO & BRANDING SEKOLAH (ASSET WEB)                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'logo' && (
        <LogoBrandingManager />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: CLOUD STORAGE & DATABASE                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'cloud' && (
        <div className="space-y-6">
          {/* Cloud Storage Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Google Drive Storage Panel */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">
                      Google Drive Cloud Storage
                    </div>
                    <h3 className="text-base font-black text-slate-800">
                      Folder Google Drive SDN Lanto Dg. Pasewang
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Folder Resmi Aktif
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Tempat penyimpanan berkas PDF SK, bukti supervisi akademik, kurikulum operasional, foto kegiatan, dan dokumen administrasi guru terpusat di Google Drive sekolah.
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Target Folder ID:</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">{TARGET_DRIVE_FOLDER_ID}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Kapasitas Penyimpanan:</span>
                  <span className="font-semibold text-emerald-700">Google Workspace for Education</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  href={TARGET_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka Folder Google Drive</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsDriveModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 text-emerald-400" />
                  <span>Jelajahi Berkas (Explorer)</span>
                </button>
              </div>
            </div>

            {/* Firebase Cloud Firestore Panel */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">
                      Firebase Cloud Firestore
                    </div>
                    <h3 className="text-base font-black text-slate-800">
                      Sinkronisasi Database Cloud Real-time
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Terkoneksi</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Menyimpan seluruh master data sekolah (PTK, Siswa, RKAS, Sarpras, Guru) secara permanen di cloud agar aman dan dapat diakses dari perangkat manapun.
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Sinkron Terakhir:</span>
                  <span className="font-bold text-slate-800">{lastCloudSync || 'Otomatis aktif berkala'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-500">Status Autentikasi:</span>
                  <span className="font-semibold text-slate-800">
                    {firebaseUser ? firebaseUser.email : 'Akun Google Operator / Offline Ready'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={forceCloudSync}
                  disabled={isCloudSyncing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                  <span>{isCloudSyncing ? 'Menyinkronkan Data...' : 'Sinkronkan ke Cloud Sekarang'}</span>
                </button>

                {firebaseUser ? (
                  <button
                    type="button"
                    onClick={logoutFirebase}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun Google</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer font-semibold"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>Hubungkan Akun Google</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Master Collections Summary */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Ringkasan Master Data yang Tersinkron ke Cloud</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-blue-700">{ptkList.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Data PTK</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-emerald-700">{siswaList.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Data Siswa</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-purple-700">{kelasList.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Rombel Kelas</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-amber-700">{perencanaanList.length + pbdList.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Perencanaan & PBD</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-indigo-700">{supervisiAkademikList.length + administrasiGuruList.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Supervisi & Guru</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-rose-700">{rkasList.length + sarprasList.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">RKAS & Sarpras</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: BACKUP & KEAMANAN SISTEM                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'backup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download Backup JSON */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800">Unduh Cadangan Database (Backup JSON)</h4>
                  <p className="text-xs text-slate-500">Simpan salinan cadangan lengkap seluruh data sekolah ke laptop / komputer.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                File JSON berisi data profil sekolah, PTK & pas foto, siswa, kelas, modul kurikulum, RKAS BOSP, inventaris sarpras, dan data administrasi guru.
              </div>

              <button
                type="button"
                onClick={handleExportBackupJSON}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan (.JSON)</span>
              </button>
            </div>

            {/* Restore Backup JSON */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800">Pulihkan Database (Restore JSON)</h4>
                  <p className="text-xs text-slate-500">Muat ulang seluruh data sekolah dari file cadangan JSON yang pernah diunduh.</p>
                </div>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Memulihkan data akan menggantikan data yang ada saat ini dengan data dari file cadangan.</span>
              </div>

              <label className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Pilih File Cadangan JSON & Pulihkan</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackupJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Emergency Section */}
          <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-base font-black text-rose-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Reset Database Sekolah ke Standar Awal</span>
                </h4>
                <p className="text-xs text-rose-700 mt-1 max-w-2xl">
                  Gunakan opsi ini jika Anda ingin mengembalikan seluruh master data ke pengaturan awal bawaan UPTD SPF SDN Lanto Dg. Pasewang Kota Makassar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset Data Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL TAMBAH / EDIT PENGGUNA                                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingUser ? 'Edit Akun Pengguna' : 'Enrol Pengguna Baru'}
        subtitle="Kelola akun pengguna, peran, dan kredensial login"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Quick pick from PTK (Only on Add) */}
          {!editingUser && ptkList.length > 0 && (
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 space-y-2">
              <label className="text-[11px] font-bold text-blue-900 block">
                ⚡ Pilih Cepat dari Data PTK (Otomatis Isi Nama & NIP)
              </label>
              <select
                onChange={e => handleSelectPTK(e.target.value)}
                defaultValue=""
                className="w-full px-3 py-2 bg-white text-xs border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>-- Pilih Guru / Tenaga Kependidikan --</option>
                {safePtkList.map(p => (
                  <option key={p.id} value={p.nama}>
                    {p.nama} (NIP: {p.nip || '-'}) - {p.jabatan}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Dra. Hj. Rosnaeni, M.Pd."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP (18 Digit untuk Login) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nip}
                onChange={e => setFormData({ ...formData, nip: e.target.value })}
                placeholder="197501012000032001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Sekolah
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@sdnlanto.sch.id"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password Login (Default: 123456)
              </label>
              <div className="relative">
                <input
                  type={showFormPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="123456"
                  className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowFormPassword(!showFormPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peran (Role)
              </label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="guru">Guru Pendidik</option>
                <option value="kepala_sekolah">Kepala Sekolah</option>
                <option value="tata_usaha">Tata Usaha</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.jabatan}
                onChange={e => setFormData({ ...formData, jabatan: e.target.value })}
                placeholder="Guru Kelas / Guru PAI"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Akun
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {formData.role === 'guru' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Tugas Kelas
                </label>
                <input
                  type="text"
                  value={formData.kelasTugas}
                  onChange={e => setFormData({ ...formData, kelasTugas: e.target.value })}
                  placeholder="Kelas 4A"
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={formData.mataPelajaran}
                  onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                  placeholder="Tematik Terpadu / PJOK"
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          )}

          {/* Pas Foto 3x4 Uploader */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pas Foto Resmi (3x4 Standar ASN / PTK)
            </label>
            <PasFotoUploader
              currentPhotoUrl={formData.foto}
              onPhotoChange={(newPhoto) => setFormData(prev => ({ ...prev, foto: newPhoto }))}
              personName={formData.nama || 'Pengguna'}
              gender={formData.nama.toLowerCase().includes('hj') || formData.nama.toLowerCase().includes('sitti') || formData.nama.toLowerCase().includes('nurul') || formData.nama.toLowerCase().includes('nurhaliza') || formData.nama.toLowerCase().includes('pertiwi') ? 'P' : 'L'}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingUser ? 'Simpan Perubahan' : 'Enrol Akun Baru'}
            </button>
          </div>
        </form>
      </Modal>

      {/* QUICK PHOTO CHANGER MODAL */}
      <Modal
        isOpen={!!quickPhotoUser}
        onClose={() => setQuickPhotoUser(null)}
        title="Ganti Pas Foto Pengguna & PTK"
        subtitle={`Perbarui pas foto resmi 3x4 untuk ${quickPhotoUser?.nama || ''}`}
      >
        {quickPhotoUser && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center gap-3">
              <img
                src={getUserPhoto(quickPhotoUser)}
                alt={quickPhotoUser.nama}
                className="w-12 h-16 object-cover rounded-lg border border-blue-300 shrink-0 shadow-2xs"
              />
              <div>
                <div className="font-bold text-slate-800 text-xs">{quickPhotoUser.nama}</div>
                <div className="text-[11px] font-mono text-blue-700 font-semibold mt-0.5">
                  NIP: {quickPhotoUser.nip || '-'}
                </div>
                <div className="text-[10px] text-slate-500">{quickPhotoUser.jabatan}</div>
              </div>
            </div>

            <PasFotoUploader
              currentPhotoUrl={getUserPhoto(quickPhotoUser)}
              onPhotoChange={(newPhoto) => {
                updateUser(quickPhotoUser.id, { foto: newPhoto });
                showToast('success', 'Pas Foto Diperbarui', `Foto untuk ${quickPhotoUser.nama} berhasil diperbarui dan disinkronkan ke Manajemen PTK.`);
                setQuickPhotoUser(null);
              }}
              personName={quickPhotoUser.nama}
              gender={quickPhotoUser.nama.toLowerCase().includes('hj') || quickPhotoUser.nama.toLowerCase().includes('sitti') || quickPhotoUser.nama.toLowerCase().includes('nurul') || quickPhotoUser.nama.toLowerCase().includes('nurhaliza') || quickPhotoUser.nama.toLowerCase().includes('pertiwi') ? 'P' : 'L'}
            />

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickPhotoUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL RESET KONFIRMASI */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Konfirmasi Reset Database Sekolah"
        subtitle="Tindakan ini memerlukan kehati-hatian tingkat tinggi"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-900">Perhatian! Tindakan ini tidak dapat dibatalkan</div>
              <p className="mt-1">
                Semua perubahan data lokal akan dikembalikan ke data master standar bawaan UPTD SPF SDN Lanto Dg. Pasewang.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                resetAllData();
                setShowResetConfirm(false);
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
            >
              Ya, Reset Semua Data
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL LOGIN GURU */}
      <LoginGuruModal
        isOpen={isLoginGuruModalOpen}
        onClose={() => setIsLoginGuruModalOpen(false)}
        defaultNip={defaultNipForLogin}
      />

      {/* MODAL CETAK KARTU AKSES LOGIN */}
      <KartuAksesLoginModal
        isOpen={isKartuAksesModalOpen}
        onClose={() => setIsKartuAksesModalOpen(false)}
        users={safeUserList}
        profilSekolah={profilSekolah}
      />

      {/* MODAL GOOGLE DRIVE EXPLORER */}
      <GoogleDriveExplorerModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />
    </div>
  );
};
