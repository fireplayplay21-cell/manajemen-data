import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserAccount } from '../../../types';
import {
  Cloud,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Award,
  ChevronRight,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  HardDrive
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, currentUser, loginWithCredentials, profilSekolah, loginWithGoogle, firebaseUser } = useApp();

  const [activeRole, setActiveRole] = useState<'admin' | 'kepala_sekolah' | 'guru'>('guru');
  const [identifierInput, setIdentifierInput] = useState<string>('198503152009022004');
  const [passwordInput, setPasswordInput] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showQuickPicker, setShowQuickPicker] = useState<boolean>(false);

  const safeUsers = users || [];

  // Filtered lists
  const guruList = safeUsers.filter(u => u.role === 'guru');
  const ksList = safeUsers.filter(u => u.role === 'kepala_sekolah');
  const adminList = safeUsers.filter(u => u.role === 'admin' || u.role === 'tata_usaha');

  // Handle Role Switch
  const handleRoleChange = (role: 'admin' | 'kepala_sekolah' | 'guru') => {
    setActiveRole(role);
    setErrorMessage(null);

    if (role === 'guru') {
      const defaultGuru = guruList[0];
      setIdentifierInput(defaultGuru ? (defaultGuru.nip || defaultGuru.email) : '198503152009022004');
      setPasswordInput(defaultGuru?.password || '123456');
    } else if (role === 'kepala_sekolah') {
      const defaultKs = ksList[0];
      setIdentifierInput(defaultKs ? (defaultKs.nip || defaultKs.email) : '196805121990032001');
      setPasswordInput(defaultKs?.password || '123456');
    } else if (role === 'admin') {
      const defaultAdmin = adminList[0];
      setIdentifierInput(defaultAdmin ? (defaultAdmin.nip || defaultAdmin.email || defaultAdmin.nama) : 'admin');
      setPasswordInput(defaultAdmin?.password || '123456');
    }
  };

  // Select a specific user preset
  const handleSelectUser = (user: UserAccount) => {
    const targetRole = (user.role === 'admin' || user.role === 'tata_usaha') ? 'admin' : (user.role as 'kepala_sekolah' | 'guru');
    setActiveRole(targetRole);
    setIdentifierInput(user.nip || user.email || user.nama);
    setPasswordInput(user.password || '123456');
    setErrorMessage(null);
    setShowQuickPicker(false);
  };

  // Submit login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifierInput.trim()) {
      setErrorMessage('Harap masukkan NIP, Username, atau Email Anda.');
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

  // Direct login
  const handleDirectLogin = (user: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithCredentials(user.nip || user.email || user.nama, user.password || '123456');
      setIsLoading(false);
    }, 150);
  };

  // Role Metadata Configs
  const roleConfigs = {
    admin: {
      title: 'Login Administrator & TU',
      tagline: 'Portal Tata Kelola Master Data & Sistem',
      badge: 'Admin / Operator',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
      activeTabClass: 'bg-rose-500 text-white shadow-md shadow-rose-500/30',
      buttonClass: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-500/25',
      inputPlaceholder: 'Username Admin / NIP Operator (cth: admin)',
      inputLabel: 'Username / NIP Administrator',
      icon: <ShieldCheck className="w-5 h-5" />,
      features: ['Manajemen PTK, Siswa & Sarpras', 'Pengelolaan Kas BOSP & RKAS', 'Manajemen Akun Pengguna & Backup Cloud']
    },
    kepala_sekolah: {
      title: 'Login Kepala Sekolah',
      tagline: 'Portal Supervisi & Kepemimpinan Pembelajaran',
      badge: 'Pimpinan Sekolah',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      activeTabClass: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25',
      inputPlaceholder: 'NIP Kepala Sekolah (cth: 196805121990032001)',
      inputLabel: 'NIP / Email Kepala Sekolah',
      icon: <Award className="w-5 h-5" />,
      features: ['Supervisi Akademik & Validasi Perangkat', 'Monitoring Rapor Pendidikan & PBD', 'Disposisi Surat Masuk & Kerjasama MOU']
    },
    guru: {
      title: 'Login Guru & Pendidik',
      tagline: 'Portal Administrasi Kelas & Perangkat Ajar',
      badge: 'Guru Kelas & Mapel',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
      activeTabClass: 'bg-[#00c0ff] text-white shadow-md shadow-[#00c0ff]/30',
      buttonClass: 'bg-[#00c0ff] hover:bg-[#00abeb] text-white shadow-[#00c0ff]/30',
      inputPlaceholder: 'NIP Guru 18 Digit (cth: 198503152009022004)',
      inputLabel: 'NIP Guru / Nama Pengguna',
      icon: <GraduationCap className="w-5 h-5" />,
      features: ['Administrasi RPP & Modul Ajar Merdeka', 'Input Nilai Siswa, Rapor & Jurnal Harian', 'Integrasi Google Drive Dokumen & Sertifikat']
    }
  };

  const currentConfig = roleConfigs[activeRole];

  return (
    <div className="min-h-screen bg-[#00c3ff] flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-10 antialiased selection:bg-[#00c0ff] selection:text-white">
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl shadow-cyan-950/25 border border-white/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ================= LEFT SIDE: BRANDING, VECTOR ILLUSTRATION & CLOUD CAPTION ================= */}
        <div className="lg:col-span-6 bg-gradient-to-b from-white via-sky-50/40 to-cyan-50/70 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 relative overflow-hidden">
          
          {/* Top Logo */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-md shadow-[#00c0ff]/20 p-1 overflow-hidden shrink-0">
                {profilSekolah.logoUrl ? (
                  <img src={profilSekolah.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Cloud className="w-5 h-5 text-[#00c0ff] fill-[#00c0ff]" />
                )}
              </div>
              <div>
                <span className="text-sm font-black tracking-wider text-slate-800 uppercase block leading-none">
                  SIM LANTO
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-tight block mt-0.5">
                  {profilSekolah.namaSekolah || 'UPTD SPF SDN LANTO DG. PASEWANG'}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-cyan-100/80 text-cyan-800 border border-cyan-200">
              AKREDITASI {profilSekolah.akreditasi || 'A'}
            </span>
          </div>

          {/* Center Illustration Area */}
          <div className="py-6 sm:py-8 flex flex-col items-center justify-center relative my-auto">
            
            {/* Custom Modern Vector Illustration (Matching reference image style) */}
            <div className="w-full max-w-[340px] aspect-[4/3] relative flex items-center justify-center">
              <svg viewBox="0 0 400 320" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d2ff" />
                    <stop offset="100%" stopColor="#0077b6" />
                  </linearGradient>
                  <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f8fafc" />
                  </linearGradient>
                  <linearGradient id="charGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                </defs>

                {/* Background Organic Blob Shape */}
                <path
                  d="M70,140 C50,80 120,30 200,45 C280,60 360,90 350,170 C340,250 260,280 170,275 C90,270 90,200 70,140 Z"
                  fill="url(#blobGrad)"
                  opacity="0.88"
                />

                {/* Floating Spheres & Particles */}
                <circle cx="90" cy="70" r="16" fill="#38bdf8" opacity="0.6" />
                <circle cx="340" cy="80" r="22" fill="#0284c7" opacity="0.4" />
                <circle cx="85" cy="180" r="10" fill="#00c3ff" opacity="0.5" />

                {/* Floating Document Folder / Card Behind */}
                <g transform="translate(180, 50) rotate(12)">
                  <rect width="110" height="75" rx="8" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))" />
                  <circle cx="20" cy="20" r="8" fill="#c084fc" opacity="0.7" />
                  <rect x="35" y="15" width="55" height="4" rx="2" fill="#cbd5e1" />
                  <rect x="35" y="24" width="40" height="3" rx="1.5" fill="#e2e8f0" />
                  <rect x="15" y="38" width="80" height="3" rx="1.5" fill="#e2e8f0" />
                  <rect x="15" y="46" width="60" height="3" rx="1.5" fill="#e2e8f0" />
                </g>

                {/* Main White Folder Base in Center */}
                <path
                  d="M100,165 L170,165 L185,180 L290,180 C296,180 300,184 300,190 L300,280 C300,286 296,290 290,290 L110,290 C104,290 100,286 100,280 Z"
                  fill="#ffffff"
                  filter="drop-shadow(0 8px 16px rgba(0,70,140,0.12))"
                />

                {/* Document Sheets Coming Out of Folder */}
                <g transform="translate(120, 110) rotate(-6)">
                  <rect width="90" height="110" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                  <rect x="12" y="18" width="50" height="5" rx="2" fill="#00c3ff" />
                  <rect x="12" y="30" width="65" height="3" rx="1.5" fill="#94a3b8" />
                  <rect x="12" y="38" width="65" height="3" rx="1.5" fill="#cbd5e1" />
                  <rect x="12" y="46" width="55" height="3" rx="1.5" fill="#cbd5e1" />
                  <rect x="12" y="54" width="60" height="3" rx="1.5" fill="#e2e8f0" />
                  <rect x="12" y="62" width="45" height="3" rx="1.5" fill="#e2e8f0" />
                </g>

                {/* Color Palette / Swatch Grid Graphic */}
                <g transform="translate(180, 140)">
                  <rect width="60" height="50" rx="5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                  <rect x="6" y="8" width="12" height="15" rx="2" fill="#00c3ff" />
                  <rect x="22" y="8" width="12" height="15" rx="2" fill="#38bdf8" />
                  <rect x="38" y="8" width="12" height="15" rx="2" fill="#f43f5e" />
                  <rect x="6" y="27" width="12" height="15" rx="2" fill="#fbbf24" />
                  <rect x="22" y="27" width="12" height="15" rx="2" fill="#10b981" />
                  <rect x="38" y="27" width="12" height="15" rx="2" fill="#6366f1" />
                </g>

                {/* Front White Document Folder Lip */}
                <path
                  d="M100,195 L165,195 L180,210 L300,210 L300,285 C300,290 295,295 290,295 L110,295 C105,295 100,290 100,285 Z"
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />

                {/* Cloud Upload Icon Badge on Folder */}
                <circle cx="170" cy="250" r="22" fill="#00c3ff" />
                <path
                  d="M163,253 L170,245 L177,253 M170,246 L170,258"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Stylized Human Figure 1 (Behind folder lifting doc) */}
                <circle cx="235" cy="115" r="9" fill="#fcd34d" />
                <path d="M225,128 C225,128 235,124 245,128 L240,155 L228,155 Z" fill="#f87171" />
                <path d="M226,132 L208,110 M242,132 L260,110" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />

                {/* Stylized Human Figure 2 (Foreground carrying file) */}
                {/* Head */}
                <circle cx="280" cy="180" r="10" fill="#0f172a" />
                <circle cx="280" cy="183" r="8" fill="#fcd34d" />
                {/* Torso / Jacket */}
                <path d="M268,198 C268,194 274,192 280,192 C286,192 292,194 292,198 L288,235 L272,235 Z" fill="url(#charGrad)" />
                {/* Document in Hand */}
                <g transform="translate(250, 195) rotate(-15)">
                  <rect width="28" height="38" rx="3" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
                  <rect x="4" y="6" width="18" height="2" fill="#00c3ff" />
                  <rect x="4" y="12" width="20" height="2" fill="#94a3b8" />
                  <rect x="4" y="17" width="15" height="2" fill="#cbd5e1" />
                </g>
                {/* Arms */}
                <path d="M270,202 L256,215 M290,202 L276,215" stroke="url(#charGrad)" strokeWidth="4" strokeLinecap="round" />
                {/* Legs */}
                <path d="M273,235 L260,285 M287,235 L298,285" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />

                {/* Decorative Botanical Leaf on left */}
                <path d="M60,280 C65,245 90,240 100,260 C80,270 70,285 60,280 Z" fill="#38bdf8" opacity="0.7" />
                <path d="M50,290 C55,260 75,255 85,275 C70,282 60,295 50,290 Z" fill="#0284c7" opacity="0.6" />
              </svg>
            </div>

            {/* Role highlight pills inside illustration area */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                activeRole === 'guru' ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                Guru & Tendik
              </span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                activeRole === 'kepala_sekolah' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                Kepala Sekolah
              </span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                activeRole === 'admin' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                Admin TU
              </span>
            </div>
          </div>

          {/* Bottom Tagline & Carousel Indicators */}
          <div className="text-center space-y-3 z-10 pt-2">
            <p className="text-xs sm:text-sm font-extrabold text-[#00a8e8] tracking-wider uppercase">
              UPLOAD ANY FILE TO YOUR CLOUD STORAGE
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {currentConfig.tagline} • Terintegrasi Google Drive & Firestore
            </p>

            {/* Pagination / Carousel Indicator Pills (like screenshot) */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleRoleChange('guru')}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeRole === 'guru' ? 'w-8 bg-[#00c0ff]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title="Pilih Peran Guru"
              />
              <button
                type="button"
                onClick={() => handleRoleChange('kepala_sekolah')}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeRole === 'kepala_sekolah' ? 'w-8 bg-purple-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title="Pilih Peran Kepala Sekolah"
              />
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeRole === 'admin' ? 'w-8 bg-rose-500' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title="Pilih Peran Admin"
              />
            </div>
          </div>

        </div>


        {/* ================= RIGHT SIDE: DEDICATED ROLE LOGIN FORM ================= */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Top Heading */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-black text-[#00c0ff] tracking-tight">
                  Welcome to SIM
                </h1>
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${currentConfig.badgeColor}`}>
                  {currentConfig.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih peran Anda di bawah dan masukkan kredensial untuk mengakses data sekolah & penyimpanan cloud.
              </p>
            </div>

            {/* Distinct Role Selection Tabs (ADMIN vs KEPALA SEKOLAH vs GURU) */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pilih Portal Masuk:
              </div>

              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/90 rounded-2xl">
                {/* 1. GURU */}
                <button
                  id="btn-role-guru"
                  type="button"
                  onClick={() => handleRoleChange('guru')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    activeRole === 'guru'
                      ? 'bg-[#00c0ff] text-white shadow-md shadow-[#00c0ff]/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-[11px]">Guru</span>
                </button>

                {/* 2. KEPALA SEKOLAH */}
                <button
                  id="btn-role-ks"
                  type="button"
                  onClick={() => handleRoleChange('kepala_sekolah')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    activeRole === 'kepala_sekolah'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span className="text-[11px]">Kepsek</span>
                </button>

                {/* 3. ADMIN */}
                <button
                  id="btn-role-admin"
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    activeRole === 'admin'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px]">Admin</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Login Form Fields (Styled exactly like reference UI) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field 1: Full Name / Identifier Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  {currentConfig.inputLabel}
                </label>
                <div className="relative">
                  <input
                    id="input-login-identifier"
                    type="text"
                    value={identifierInput}
                    onChange={(e) => {
                      setIdentifierInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder={currentConfig.inputPlaceholder}
                    className="w-full px-4 py-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-medium rounded-xl border border-transparent focus:border-[#00c0ff] focus:ring-2 focus:ring-[#00c0ff]/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password Input with Eye Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-600">
                    Kata Sandi (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordInput('123456');
                      setErrorMessage(null);
                    }}
                    className="text-[10px] text-[#00a8e8] hover:underline font-semibold cursor-pointer"
                  >
                    Default: 123456
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 pr-11 py-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-mono font-medium rounded-xl border border-transparent focus:border-[#00c0ff] focus:ring-2 focus:ring-[#00c0ff]/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-100 border-slate-300 text-[#00c0ff] focus:ring-[#00c0ff]"
                  />
                  <span className="text-[11px]">Ingat akun saya</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowQuickPicker(!showQuickPicker)}
                  className="text-[11px] text-[#00a8e8] font-bold hover:underline cursor-pointer"
                >
                  {showQuickPicker ? 'Tutup Daftar Akun' : 'Pilih Akun Guru Lain'}
                </button>
              </div>

              {/* Main Submit Action Button (Vivid Cyan Pill like reference UI) */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-6 font-black rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                  activeRole === 'guru'
                    ? 'bg-[#00c0ff] hover:bg-[#00abeb] text-white shadow-[#00c0ff]/30'
                    : activeRole === 'kepala_sekolah'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>MASUK SEBAGAI {activeRole === 'guru' ? 'GURU' : activeRole === 'kepala_sekolah' ? 'KEPALA SEKOLAH' : 'ADMIN'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Quick User Picker Drawer */}
            {showQuickPicker && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Daftar Cepat Akun PTK Terdaftar:</span>
                  <span className="text-slate-400">{safeUsers.length} Akun</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {safeUsers.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectUser(u)}
                      className="w-full p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">
                          {u.nama}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {u.jabatan} • NIP: {u.nip || '-'}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider "Or sign up with other account" */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-400 font-medium">
                Or sign up with other account
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google / Cloud Storage Login Button */}
            <div className="space-y-2">
              <button
                id="btn-google-cloud-login"
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
              >
                {/* Google G Logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>
                  {firebaseUser
                    ? `Terkoneksi Google: ${firebaseUser.displayName || firebaseUser.email}`
                    : 'SIGN UP WITH GOOGLE'}
                </span>
              </button>
            </div>

          </div>

          {/* Bottom Footer Helper Link */}
          <div className="pt-4 mt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => {
                setIdentifierInput('198503152009022004');
                setPasswordInput('123456');
                setActiveRole('guru');
              }}
              className="text-[#00c0ff] font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
