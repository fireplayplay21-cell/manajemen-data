import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserAccount } from '../../../types';
import {
  School,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  FileSpreadsheet,
  Award,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  Laptop,
  Flame
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, currentUser, loginWithCredentials, profilSekolah, loginWithGoogle, firebaseUser, forceCloudSync } = useApp();

  const [activePortalTab, setActivePortalTab] = useState<'guru' | 'ks' | 'admin' | 'quick'>('guru');
  const [identifierInput, setIdentifierInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Grouped users for quick access
  const guruList = users.filter(u => u.role === 'guru');
  const ksList = users.filter(u => u.role === 'kepala_sekolah');
  const adminList = users.filter(u => u.role === 'admin' || u.role === 'tata_usaha');

  // Handle portal tab change
  const handlePortalTabChange = (tab: 'guru' | 'ks' | 'admin' | 'quick') => {
    setActivePortalTab(tab);
    setErrorMessage(null);

    if (tab === 'guru') {
      const firstGuru = guruList[0];
      setIdentifierInput(firstGuru ? (firstGuru.nip || firstGuru.email) : '');
      setPasswordInput(firstGuru?.password || '123456');
    } else if (tab === 'ks') {
      const firstKs = ksList[0];
      setIdentifierInput(firstKs ? (firstKs.nip || firstKs.email) : '');
      setPasswordInput(firstKs?.password || '123456');
    } else if (tab === 'admin') {
      const firstAdmin = adminList[0];
      setIdentifierInput(firstAdmin ? (firstAdmin.nip || firstAdmin.email || firstAdmin.nama) : '');
      setPasswordInput(firstAdmin?.password || '123456');
    }
  };

  // Select a specific user preset
  const handleSelectUser = (user: UserAccount) => {
    setIdentifierInput(user.nip || user.email || user.nama);
    setPasswordInput(user.password || '123456');
    setErrorMessage(null);
    if (user.role === 'guru') setActivePortalTab('guru');
    else if (user.role === 'kepala_sekolah') setActivePortalTab('ks');
    else setActivePortalTab('admin');
  };

  // Submit login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifierInput.trim()) {
      setErrorMessage('Harap masukkan NIP, email, atau nama pengguna.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithCredentials(identifierInput, passwordInput);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    }, 200);
  };

  // Instant login for quick access cards
  const handleDirectLogin = (user: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithCredentials(user.nip || user.email || user.nama, user.password || '123456');
      setIsLoading(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Bar / Header Branding */}
      <header className="border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  SIM TERPADU SDN LANTO DG. PASEWANG
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AKREDITASI A
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium hidden xs:block">
                NPSN: <span className="font-mono text-slate-300">40307374</span> • Kota Makassar, Sulawesi Selatan
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif & Terhubung
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: School Information & Capabilities */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Portal Masuk Manajemen Data Sekolah</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Sistem Informasi Manajemen Terpadu Sekolah
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Pusat data digital UPTD SPF SDN Lanto Dg. Pasewang Kota Makassar untuk tata kelola administrasi guru, perencanaan berbasis data, supervisi, kesiswaan, dan pelaporan terintegrasi.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Administrasi Guru</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Perangkat ajar, modul ajar, presensi, & e-Supervisi</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Perencanaan & PBD</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Rapor pendidikan, KSP, RKT, RKAS, & Program Unggulan</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Supervisi Terpadu</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supervisi akademik 6 indikator & manajerial 8 SNP</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Kesiswaan & Keuangan</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Data siswa, portofolio prestasi, buku kas BOSP & Sarpras</p>
                </div>
              </div>
            </div>

            {/* Quick credentials banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/30 text-emerald-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-emerald-200">Format Akun Guru & PTK:</span>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Gunakan <span className="font-semibold text-white">NIP 18 Digit</span> sebagai Username dan kata sandi standar <span className="font-mono text-emerald-300 font-bold bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">123456</span>.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Dedicated Login Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-xl relative overflow-hidden">
              
              {/* Card Header & Portal Tabs */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                      <LogIn className="w-5 h-5 text-blue-400" />
                      <span>Masuk Akun SIM</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pilih kategori peran atau masukkan kredensial akun Anda
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                    TA {profilSekolah?.tahunPelajaran || '2024/2025'}
                  </span>
                </div>

                {/* Portal Role Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-800/90 rounded-2xl border border-slate-700/70 text-xs">
                  <button
                    id="tab-login-guru"
                    type="button"
                    onClick={() => handlePortalTabChange('guru')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'guru'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px]">Guru</span>
                  </button>

                  <button
                    id="tab-login-ks"
                    type="button"
                    onClick={() => handlePortalTabChange('ks')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'ks'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px]">Kepsek</span>
                  </button>

                  <button
                    id="tab-login-admin"
                    type="button"
                    onClick={() => handlePortalTabChange('admin')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'admin'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px]">Admin</span>
                  </button>

                  <button
                    id="tab-login-quick"
                    type="button"
                    onClick={() => handlePortalTabChange('quick')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'quick'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px]">1-Klik</span>
                  </button>
                </div>
              </div>

              {/* TAB CONTENT 1, 2, 3: STANDARD LOGIN FORM */}
              {activePortalTab !== 'quick' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-rose-950/80 border border-rose-600/50 text-rose-200 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div className="leading-relaxed">{errorMessage}</div>
                    </div>
                  )}

                  {/* Identifier Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      {activePortalTab === 'guru' ? 'NIP Guru / Username' : activePortalTab === 'ks' ? 'NIP Kepala Sekolah / Email' : 'Username Administrator / Operator'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        {activePortalTab === 'guru' ? <GraduationCap className="w-4 h-4" /> : activePortalTab === 'ks' ? <Award className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <input
                        id="login-input-identifier"
                        type="text"
                        value={identifierInput}
                        onChange={(e) => {
                          setIdentifierInput(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder={
                          activePortalTab === 'guru'
                            ? 'Contoh: 198503152009022004 atau nama'
                            : activePortalTab === 'ks'
                            ? 'Contoh: 196805121990032001'
                            : 'Contoh: admin / operator'
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-300">
                        Kata Sandi (Password)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordInput('123456');
                          setErrorMessage(null);
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-medium hover:underline cursor-pointer"
                      >
                        Gunakan Default (123456)
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-input-password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="Masukkan kata sandi..."
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                        title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Ingat sesi di perangkat ini</span>
                    </label>

                    <span className="text-[11px] text-slate-400">
                      Bantuan: <span className="text-slate-300 font-mono">123456</span>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="btn-submit-login"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Memverifikasi Kredensial...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Masuk ke Sistem Manajemen Sekolah</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      id="btn-login-google-firebase"
                      type="button"
                      onClick={() => loginWithGoogle()}
                      className="w-full py-2.5 px-3 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-semibold rounded-xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{firebaseUser ? `Terkoneksi: ${firebaseUser.displayName || firebaseUser.email}` : 'Masuk / Otorisasi Google Firebase Cloud'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* TAB CONTENT 4: 1-KLIK CEPAT AKUN TERDAFTAR */
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      Pilih salah satu profil guru atau staf di bawah untuk <strong>langsung masuk dengan 1-klik</strong> tanpa mengetik manual.
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto pr-1 space-y-2">
                    {users.map((user) => {
                      const roleBadge = {
                        admin: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                        kepala_sekolah: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                        guru: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                        tata_usaha: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }[user.role];

                      return (
                        <div
                          key={user.id}
                          className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="text-xs font-bold text-white truncate">
                                {user.nama}
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border capitalize ${roleBadge}`}>
                                {user.role.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {user.jabatan} • <span className="font-mono text-slate-300">NIP: {user.nip || '-'}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDirectLogin(user)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Masuk</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Select Preset Chips */}
              {activePortalTab !== 'quick' && (
                <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Pilihan Akun Cepat:</span>
                    <button
                      type="button"
                      onClick={() => setActivePortalTab('quick')}
                      className="text-blue-400 hover:underline cursor-pointer"
                    >
                      Lihat Semua ({users.length})
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {/* KS Preset */}
                    {ksList[0] && (
                      <button
                        type="button"
                        onClick={() => handleSelectUser(ksList[0])}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Award className="w-3 h-3 text-purple-400" />
                        <span>Kepala Sekolah</span>
                      </button>
                    )}

                    {/* Guru 1A */}
                    {guruList.find(g => g.nama.includes('Nurhaliza')) && (
                      <button
                        type="button"
                        onClick={() => handleSelectUser(guruList.find(g => g.nama.includes('Nurhaliza'))!)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <GraduationCap className="w-3 h-3 text-blue-400" />
                        <span>Guru 1A (Nurhaliza)</span>
                      </button>
                    )}

                    {/* Guru 4B */}
                    {guruList.find(g => g.nama.includes('Syahrir')) && (
                      <button
                        type="button"
                        onClick={() => handleSelectUser(guruList.find(g => g.nama.includes('Syahrir'))!)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <GraduationCap className="w-3 h-3 text-emerald-400" />
                        <span>Guru 4B (Syahrir)</span>
                      </button>
                    )}

                    {/* Admin */}
                    {adminList[0] && (
                      <button
                        type="button"
                        onClick={() => handleSelectUser(adminList[0])}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-rose-400" />
                        <span>Admin SIM</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding & Copyright */}
      <footer className="border-t border-slate-800 bg-slate-950/80 px-4 sm:px-8 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} <strong>UPTD SPF SDN Lanto Dg. Pasewang</strong> Kota Makassar. All Rights Reserved.
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Dinas Pendidikan Kota Makassar</span>
            <span>•</span>
            <span>Provinsi Sulawesi Selatan</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
