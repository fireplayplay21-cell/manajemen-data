import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProfilSekolah } from '../../../types';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Download,
  Eye,
  FileText,
  Building,
  School,
  Stamp,
  Layers,
  ShieldCheck,
  Check,
  ExternalLink,
  Trash2,
  Maximize2,
  FolderOpen
} from 'lucide-react';

// Preset logo options for instant professional selection
const LOGO_PRESETS = [
  {
    id: 'preset-lanto-blue',
    name: 'Logo Resmi SDN Lanto Dg. Pasewang (Emas & Biru)',
    desc: 'Lambang resmi dengan perisai biru, bintang emas, buku terbuka dan pena',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300'
  },
  {
    id: 'preset-tutwuri',
    name: 'Logo Tut Wuri Handayani (Kemendikbudristek)',
    desc: 'Lambang pendidikan nasional standar Kementerian Pendidikan Dasar & Menengah',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Tut_Wuri_Handayani.png/300px-Logo_Tut_Wuri_Handayani.png'
  },
  {
    id: 'preset-makassar',
    name: 'Logo Pemerintah Kota Makassar (Dinas Pendidikan)',
    desc: 'Lambang resmi Pemerintah Kota Makassar Sulawesi Selatan',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Coat_of_arms_of_Makassar.svg/240px-Coat_of_arms_of_Makassar.svg.png'
  },
  {
    id: 'preset-sd-merahputih',
    name: 'Logo Sekolah Dasar Merah Putih (SD Negeri)',
    desc: 'Lambang perisai merah putih jenjang Sekolah Dasar Nasional',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300'
  },
  {
    id: 'preset-adiwiyata',
    name: 'Logo Sekolah Ramah Anak & Adiwiyata',
    desc: 'Lambang sekolah berwawasan lingkungan hidup hijau dan ramah anak',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300'
  }
];

export const LogoBrandingManager: React.FC = () => {
  const { profilSekolah, updateProfilSekolah, showToast } = useApp();

  // Local state for logos before saving
  const [logoUtama, setLogoUtama] = useState<string>(
    profilSekolah?.logoUrl || LOGO_PRESETS[0].url
  );
  const [logoDinas, setLogoDinas] = useState<string>(
    profilSekolah?.logoDinasUrl || LOGO_PRESETS[2].url
  );
  const [logoTutWuri, setLogoTutWuri] = useState<string>(
    profilSekolah?.tutWuriLogoUrl || LOGO_PRESETS[1].url
  );
  const [stempelResmi, setStempelResmi] = useState<string>(
    profilSekolah?.stempelUrl || ''
  );

  const [activePreviewTab, setActivePreviewTab] = useState<'sidebar' | 'kopsurat' | 'kartu' | 'login'>('sidebar');
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDinasInputRef = useRef<HTMLInputElement>(null);
  const fileTutWuriInputRef = useRef<HTMLInputElement>(null);
  const fileStempelInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded image file to Base64 Data URL
  const processImageFile = (
    file: File,
    onSuccess: (dataUrl: string) => void,
    label: string = 'Logo'
  ) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Format Tidak Didukung', 'Harap unggah file gambar (PNG, JPG, SVG, WebP).');
      return;
    }

    // Limit size to max 3MB for high performance storage
    if (file.size > 3 * 1024 * 1024) {
      showToast('error', 'Ukuran Terlalu Besar', 'Ukuran gambar maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onSuccess(result);
        showToast('success', 'Gambar Berhasil Dimuat', `${label} berhasil diunggah dan siap disimpan.`);
      }
    };
    reader.onerror = () => {
      showToast('error', 'Gagal Membaca File', 'Terjadi kesalahan saat memproses gambar.');
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag and drop for Main Logo
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], setLogoUtama, 'Logo Sekolah Utama');
    }
  };

  // Save all logos to AppContext and LocalStorage
  const handleSaveAllLogos = () => {
    setIsSaving(true);
    const updatedProfil: ProfilSekolah = {
      ...profilSekolah,
      logoUrl: logoUtama,
      logoDinasUrl: logoDinas,
      tutWuriLogoUrl: logoTutWuri,
      stempelUrl: stempelResmi
    };

    updateProfilSekolah(updatedProfil);

    setTimeout(() => {
      setIsSaving(false);
      showToast('success', 'Asset Web Diperbarui', 'Logo dan branding sekolah berhasil disimpan ke asset web & database.');
    }, 400);
  };

  // Reset to initial default logos
  const handleResetToDefaults = () => {
    setLogoUtama(LOGO_PRESETS[0].url);
    setLogoDinas(LOGO_PRESETS[2].url);
    setLogoTutWuri(LOGO_PRESETS[1].url);
    setStempelResmi('');
    showToast('info', 'Diatur Ulang', 'Logo telah dikembalikan ke standar awal.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <ImageIcon className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Asset Web & Identitas Visual Sekolah</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Manajemen Logo & Branding UPTD SPF SDN Lanto Dg. Pasewang
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unggah logo sekolah, logo dinas pendidikan, dan logo pendamping untuk ditampilkan secara konsisten di seluruh antarmuka web, sidebar navigasi, kop surat dinas, serta kartu akses login guru.
            </p>
          </div>

          {/* Action Save Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-reset-logo-defaults"
              onClick={handleResetToDefaults}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Standar</span>
            </button>

            <button
              type="button"
              id="btn-save-logo-assets"
              onClick={handleSaveAllLogos}
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan Asset...' : 'Simpan ke Asset Web'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Zones (Left) & Live Mockup Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: UPLOAD CONTROLS (7 COLS)                                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Logo Sekolah Utama (Header & Sidebar) */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Logo Sekolah Utama</h4>
                  <p className="text-[11px] text-slate-500">
                    Tampil pada Header Sidebar, Top Bar, dan Favicon Aplikasi
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                LOGO UTAMA
              </span>
            </div>

            {/* Upload Zone with Drag & Drop */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center gap-6 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              {/* Image Preview Box with checkerboard background */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden group">
                <div
                  className="w-full h-full rounded-xl bg-contain bg-center bg-no-repeat transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url("${logoUtama}")` }}
                />
              </div>

              {/* Upload Prompts & File Input */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Tarik & letakkan file logo di sini, atau klik tombol di bawah
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format didukung: PNG (transparan direkomendasikan), JPG, SVG, WebP. Maksimal 3 MB.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Berkas Logo</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.png,.jpg,.jpeg,.svg,.webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processImageFile(e.target.files[0], setLogoUtama, 'Logo Sekolah Utama');
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Preset Logo Selection Carousel / Grid */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pilihan Logo Preset Siap Pakai:</span>
                </span>
                <span className="text-[10px] text-slate-400">Klik untuk menerapkan instan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LOGO_PRESETS.map((preset) => {
                  const isSelected = logoUtama === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setLogoUtama(preset.url);
                        showToast('info', 'Preset Dipilih', `${preset.name} dipilih sebagai logo utama.`);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate">{preset.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{preset.desc}</div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Logo Pendamping Kop Surat & Dokumen Resmi */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Logo Kop Surat & Dokumen Resmi</h4>
                  <p className="text-[11px] text-slate-500">
                    Digunakan pada Kop Surat Dinas, Cetak Keputusan SK, Laporan RKAS & MOU
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                KOP SURAT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Logo Pemkot Makassar / Dinas */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Logo Dinas / Pemkot (Kiri)</span>
                  <span className="text-[10px] font-semibold text-slate-500">Sisi Kiri Kop</span>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={logoDinas}
                      alt="Logo Dinas"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-slate-700 truncate">Kota Makassar</div>
                    <button
                      type="button"
                      onClick={() => fileDinasInputRef.current?.click()}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      Ganti Logo Dinas...
                    </button>
                    <input
                      ref={fileDinasInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processImageFile(e.target.files[0], setLogoDinas, 'Logo Dinas');
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Logo Tut Wuri Handayani / Kanan */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Logo Tut Wuri (Kanan)</span>
                  <span className="text-[10px] font-semibold text-slate-500">Sisi Kanan Kop</span>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={logoTutWuri}
                      alt="Logo Tut Wuri"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-slate-700 truncate">Tut Wuri Handayani</div>
                    <button
                      type="button"
                      onClick={() => fileTutWuriInputRef.current?.click()}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      Ganti Logo Tut Wuri...
                    </button>
                    <input
                      ref={fileTutWuriInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processImageFile(e.target.files[0], setLogoTutWuri, 'Logo Tut Wuri');
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Cap Stempel Resmi Sekolah */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">Stempel / Cap Resmi Sekolah (Opsional)</span>
                </div>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  PNG Transparan
                </span>
              </div>

              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/30 flex items-center justify-center shrink-0 overflow-hidden">
                  {stempelResmi ? (
                    <img src={stempelResmi} alt="Stempel Resmi" className="w-full h-full object-contain" />
                  ) : (
                    <Stamp className="w-6 h-6 text-purple-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[11px] text-slate-600">
                    {stempelResmi ? 'Stempel digital aktif untuk tanda tangan & legalitas dokumen.' : 'Belum ada stempel digital.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileStempelInputRef.current?.click()}
                      className="text-xs text-purple-700 hover:text-purple-900 font-bold cursor-pointer"
                    >
                      {stempelResmi ? 'Ganti File Stempel...' : '+ Unggah Stempel PNG...'}
                    </button>
                    {stempelResmi && (
                      <button
                        type="button"
                        onClick={() => setStempelResmi('')}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                    <input
                      ref={fileStempelInputRef}
                      type="file"
                      accept="image/png"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processImageFile(e.target.files[0], setStempelResmi, 'Stempel Resmi');
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIVE MOCKUP PREVIEW (5 COLS)                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">Simulasi Tampilan Asset Web</h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                LIVE PREVIEW
              </span>
            </div>

            {/* Preview Tab Buttons */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActivePreviewTab('sidebar')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                  activePreviewTab === 'sidebar'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sidebar Nav
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('kopsurat')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                  activePreviewTab === 'kopsurat'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kop Surat
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('kartu')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                  activePreviewTab === 'kartu'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kartu Guru
              </button>
            </div>

            {/* PREVIEW CONTAINER 1: SIDEBAR WEB */}
            {activePreviewTab === 'sidebar' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-700">Preview Header Sidebar (Navigasi Kiri):</div>
                <div className="bg-[#0f172a] text-white p-4 rounded-2xl border border-slate-700 space-y-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-slate-600">
                      <img
                        src={logoUtama}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs tracking-tight text-white truncate">
                        {profilSekolah?.namaSekolah || 'UPTD SPF SDN LANTO DG. PASEWANG'}
                      </div>
                      <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        MANAJEMEN DATA SEKOLAH
                      </div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/40 text-[10px] text-blue-200">
                    Selamat Datang di Website Manajemen Data UPTD SPF SDN Lanto Dg. Pasewang
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW CONTAINER 2: KOP SURAT RESMI */}
            {activePreviewTab === 'kopsurat' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-700">Preview Kop Surat & Dokumen Resmi:</div>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-xs space-y-2 text-slate-900">
                  <div className="flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-2">
                    <img src={logoDinas} alt="Logo Pemkot" className="w-10 h-10 object-contain shrink-0" />
                    <div className="text-center flex-1">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                        PEMERINTAH KOTA MAKASSAR
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                        DINAS PENDIDIKAN
                      </div>
                      <div className="text-xs font-black uppercase text-slate-950">
                        {profilSekolah?.namaSekolah}
                      </div>
                      <div className="text-[8px] text-slate-500">
                        {profilSekolah?.alamat}, {profilSekolah?.kota} • NPSN: {profilSekolah?.npsn}
                      </div>
                    </div>
                    <img src={logoTutWuri} alt="Logo Tut Wuri" className="w-10 h-10 object-contain shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-400 italic text-center py-2">
                    [ Konten Surat Dinas / SK / Laporan Resmi ]
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW CONTAINER 3: KARTU LOGIN GURU */}
            {activePreviewTab === 'kartu' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-700">Preview Kartu Akses Login Guru (NIP):</div>
                <div className="bg-emerald-950/5 border-2 border-emerald-300 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white p-0.5 border border-emerald-300 flex items-center justify-center">
                        <img src={logoUtama} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-[10px] font-bold text-emerald-950 uppercase">
                        {profilSekolah?.namaSekolah}
                      </div>
                    </div>
                    <span className="text-[8px] font-black bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">
                      KARTU NIP
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-slate-200 rounded border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      3x4
                    </div>
                    <div className="text-[10px] space-y-0.5">
                      <div className="font-bold text-slate-800">Dra. Hj. Rosdiana, M.Pd.</div>
                      <div className="text-slate-500">NIP: 197004121993032004</div>
                      <div className="text-emerald-700 font-mono font-bold">Password: 123456</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Quick Advice */}
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/70 text-[11px] text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Penyimpanan Otomatis</span>
              </div>
              <p className="text-blue-800 leading-relaxed">
                Setelah mengklik tombol <strong>Simpan ke Asset Web</strong>, seluruh file logo tersimpan secara permanen di cache sistem lokal dan otomatis dicadangkan pada database awan.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
