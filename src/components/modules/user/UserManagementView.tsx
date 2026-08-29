import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserAccount, UserRole } from '../../../types';
import { Modal } from '../../common/Modal';
import { LoginGuruModal } from './LoginGuruModal';
import { KartuAksesLoginModal } from './KartuAksesLoginModal';
import {
  UserCheck,
  Shield,
  UserPlus,
  Search,
  Key,
  KeyRound,
  Trash2,
  Edit,
  CheckCircle,
  LogIn,
  Mail,
  Lock,
  Sparkles,
  Users,
  Phone,
  Printer,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  GraduationCap,
  Info
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const {
    userList,
    users,
    addUser,
    updateUser,
    deleteUser,
    currentUser,
    setCurrentUser,
    ptkList,
    profilSekolah,
    resetUserPasswordToDefault,
    syncPTKToUserAccounts
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Modals for Teacher Login and Credentials Printing
  const [isLoginGuruModalOpen, setIsLoginGuruModalOpen] = useState(false);
  const [isKartuAksesModalOpen, setIsKartuAksesModalOpen] = useState(false);
  const [defaultNipForLogin, setDefaultNipForLogin] = useState('');

  // Password visibility map
  const [visiblePasswords, setVisiblePasswords] = useState<{ [userId: string]: boolean }>({});
  const [showFormPassword, setShowFormPassword] = useState(false);

  const [formData, setFormData] = useState<Omit<UserAccount, 'id'>>({
    nama: '',
    nip: '',
    email: '',
    password: '123456',
    role: 'guru',
    jabatan: 'Guru Kelas',
    kelasTugas: 'Kelas 4A',
    mataPelajaran: 'Tematik Terpadu',
    status: 'Aktif',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    telepon: '081234567890',
    tanggalEnrol: new Date().toISOString().split('T')[0]
  });

  const safeUserList = users || userList || [];

  const filteredUsers = safeUserList.filter(u => {
    const matchRole = selectedRole === 'Semua' || u.role === selectedRole;
    const matchSearch =
      (u.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nip || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.jabatan || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      nama: '',
      nip: '',
      email: '',
      password: '123456',
      role: 'guru',
      jabatan: 'Guru Kelas',
      kelasTugas: 'Kelas 1A',
      mataPelajaran: 'Semua Mapel',
      status: 'Aktif',
      foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
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
      foto: user.foto || '',
      telepon: user.telepon || '',
      tanggalEnrol: user.tanggalEnrol
    });
    setIsAddModalOpen(true);
  };

  const handleSelectPTK = (ptkNama: string) => {
    const p = ptkList.find(item => item.nama === ptkNama);
    if (p) {
      setFormData(prev => ({
        ...prev,
        nama: p.nama,
        email: p.nama.toLowerCase().replace(/[^a-z0-9]/g, '') + '@sdnlanto.sch.id',
        nip: p.nip,
        jabatan: p.jabatan,
        password: '123456',
        telepon: p.telepon || prev.telepon
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
  };

  const handleTestLoginGuru = (user: UserAccount) => {
    setDefaultNipForLogin(user.nip || user.email);
    setIsLoginGuruModalOpen(true);
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manajemen Akses & Kredensial Guru</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Enrol Pengguna & Kredensial Login Guru
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sistem autentikasi Guru menggunakan <strong className="text-slate-700">User: NIP</strong> dan <strong className="text-emerald-700">Password: 123456</strong> untuk mengunggah dokumen kurikulum dan administrasi pembelajaran.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Button Login Guru Modal */}
          <button
            id="btn-open-login-guru"
            type="button"
            onClick={() => {
              setDefaultNipForLogin('');
              setIsLoginGuruModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Login Pengguna Guru (NIP)</span>
          </button>

          {/* Button Print Credential Cards */}
          <button
            id="btn-cetak-kartu-login"
            type="button"
            onClick={() => setIsKartuAksesModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Kartu Login Guru</span>
          </button>

          {/* Button Sync PTK */}
          <button
            id="btn-sync-ptk-users"
            type="button"
            onClick={syncPTKToUserAccounts}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
            title="Otomatis buat akun login untuk semua guru dari data PTK"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Sinkron dari PTK</span>
          </button>

          {/* Button Add New User */}
          <button
            id="btn-tambah-user-enrol"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Info Card: Standard Login Guru */}
      <div className="p-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">
              Format Autentikasi Pengguna Guru Resmi
            </div>
            <div className="text-sm font-bold flex flex-wrap items-center gap-2 mt-0.5">
              <span>Username: <strong className="text-white font-mono">NIP Guru (18 Digit)</strong></span>
              <span className="text-emerald-400">•</span>
              <span>Password Default: <strong className="font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">123456</strong></span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Guru dapat langsung login mandiri menggunakan NIP masing-masing dan password <span className="font-mono text-emerald-300 font-bold">123456</span> untuk mengunggah dokumen administrasi.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setDefaultNipForLogin('');
              setIsLoginGuruModalOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Coba Login NIP Sekarang</span>
          </button>
        </div>
      </div>

      {/* Current Active User Banner */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt={currentUser.nama}
            className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Sesi Login Pengguna Saat Ini
            </div>
            <div className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <span>{currentUser.nama}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase border border-slate-200">
                {currentUser.role === 'admin'
                  ? 'Operator Admin'
                  : currentUser.role === 'kepala_sekolah'
                  ? 'Kepala Sekolah'
                  : currentUser.role === 'tata_usaha'
                  ? 'Tata Usaha'
                  : 'Guru Pendidik'}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              <span className="font-mono font-semibold text-slate-700">NIP: {currentUser.nip || '-'}</span> • {currentUser.jabatan}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center sm:text-right">
          <div>
            Status: <span className="text-emerald-700 font-bold">● Terotentikasi ({currentUser.role.toUpperCase()})</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Password aktif: <span className="font-mono font-bold text-slate-700">{currentUser.password || '123456'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pengguna, NIP, email, atau jabatan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { key: 'Semua', label: 'Semua Akun' },
            { key: 'guru', label: 'Guru' },
            { key: 'admin', label: 'Admin' },
            { key: 'kepala_sekolah', label: 'Kepala Sekolah' },
            { key: 'tata_usaha', label: 'Tata Usaha' }
          ].map(r => (
            <button
              key={r.key}
              type="button"
              onClick={() => setSelectedRole(r.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === r.key
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Users with Login Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => {
          const isMe = user.id === currentUser.id;
          const password = user.password || '123456';
          const isPasswordVisible = !!visiblePasswords[user.id];

          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between space-y-3.5 ${
                isMe ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={user.nama}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug truncate">
                        {user.nama}
                      </h3>
                      <div className="text-[11px] text-slate-500 truncate">{user.jabatan}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'kepala_sekolah'
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === 'tata_usaha'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {user.role === 'admin'
                      ? 'Admin'
                      : user.role === 'kepala_sekolah'
                      ? 'Kepsek'
                      : user.role === 'tata_usaha'
                      ? 'Tata Usaha'
                      : 'Guru'}
                  </span>
                </div>

                {/* Kredensial Login Box (User: NIP & Password: 123456) */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  {/* NIP / Username */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-semibold">User (NIP):</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-800 text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {user.nip || '-'}
                      </span>
                      {user.nip && (
                        <button
                          type="button"
                          onClick={() => copyText(user.nip)}
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors"
                          title="Salin NIP"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-semibold">Password:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold text-emerald-800 text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {isPasswordVisible ? password : '••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title={isPasswordVisible ? 'Sembunyikan' : 'Lihat password'}
                      >
                        {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyText(password)}
                        className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors"
                        title="Salin Password"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Additional info */}
                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[150px]">{user.email}</span>
                    <button
                      type="button"
                      onClick={() => resetUserPasswordToDefault(user.id)}
                      className="text-emerald-700 hover:underline font-semibold"
                      title="Kembalikan password akun ini ke standar 123456"
                    >
                      Reset 123456
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Test Login Guru NIP */}
                  <button
                    type="button"
                    onClick={() => handleTestLoginGuru(user)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors cursor-pointer border border-emerald-200"
                    title="Uji coba masuk menggunakan NIP dan Password akun ini"
                  >
                    <KeyRound className="w-3 h-3 text-emerald-600" />
                    <span>Uji Login NIP</span>
                  </button>

                  {/* Quick Switch */}
                  {!isMe && (
                    <button
                      type="button"
                      onClick={() => handleSwitchUser(user)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                      title="Beralih sesi akun"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Switch</span>
                    </button>
                  )}
                  {isMe && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      <CheckCircle className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(user)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Profil Akun"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {safeUserList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteUser(user.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Akun"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit User */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingUser ? 'Edit Akun Pengguna' : 'Enrol Pengguna Baru'}
        subtitle="Daftarkan guru, admin, atau staf ke dalam sistem data sekolah"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="space-y-3">
            {!editingUser && (
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <label className="block font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Pilih Cepat dari Data PTK Sekolah (Auto-Fill)</span>
                </label>
                <select
                  onChange={e => handleSelectPTK(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                >
                  <option value="">-- Pilih Guru/Tendik untuk Auto-Fill NIP & Profil --</option>
                  {ptkList.map(p => (
                    <option key={p.id} value={p.nama}>
                      {p.nama} ({p.jabatan}) - NIP: {p.nip || '-'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Dra. Hj. Ratna, M.Pd."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>NIP (Username Login Guru)</span>
                  <span className="text-[10px] text-emerald-700 font-bold">18 Digit</span>
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={e => setFormData({ ...formData, nip: e.target.value })}
                  placeholder="Contoh: 19920814 201903 2 011"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Password Login</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Default: 123456</span>
                </label>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    value={formData.password || '123456'}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="123456"
                    className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    required
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Akun Belajar / Sekolah</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@guru.sd.belajar.id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peran / Role Akses</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                >
                  <option value="guru">Guru (Pendidik)</option>
                  <option value="admin">Admin (Operator Sekolah)</option>
                  <option value="kepala_sekolah">Kepala Sekolah (Manajerial)</option>
                  <option value="tata_usaha">Tata Usaha (Administrasi)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jabatan / Tugas</label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={e => setFormData({ ...formData, jabatan: e.target.value })}
                  placeholder="Guru Kelas 1A / Operator BOS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={e => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Akun</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelas Tugas (Khusus Guru)</label>
                <input
                  type="text"
                  value={formData.kelasTugas || ''}
                  onChange={e => setFormData({ ...formData, kelasTugas: e.target.value })}
                  placeholder="Contoh: Kelas 1A / Kelas 4B"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">URL Foto Profil</label>
              <input
                type="url"
                value={formData.foto}
                onChange={e => setFormData({ ...formData, foto: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold cursor-pointer"
            >
              {editingUser ? 'Simpan Perubahan' : 'Enrol Pengguna'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Login Guru */}
      <LoginGuruModal
        isOpen={isLoginGuruModalOpen}
        onClose={() => setIsLoginGuruModalOpen(false)}
        defaultNip={defaultNipForLogin}
      />

      {/* Modal Kartu Akses Login Guru */}
      <KartuAksesLoginModal
        isOpen={isKartuAksesModalOpen}
        onClose={() => setIsKartuAksesModalOpen(false)}
        users={safeUserList}
        profilSekolah={profilSekolah}
      />
    </div>
  );
};
