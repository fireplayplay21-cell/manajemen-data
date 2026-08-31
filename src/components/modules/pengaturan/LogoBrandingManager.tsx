import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProfilSekolah } from '../../../types';
import {
  DEFAULT_LOGO_SEKOLAH,
  DEFAULT_LOGO_MAKASSAR,
  DEFAULT_LOGO_TUT_WURI
} from '../../../data/brandingAssets';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Eye,
  Building,
  School,
  Stamp,
  ShieldCheck,
  Trash2,
  Info
} from 'lucide-react';

export const LogoBrandingManager: React.FC = () => {
  const { profilSekolah, updateProfilSekolah, showToast } = useApp();

  // Local state initialized with profilSekolah or default vector data URIs
  const [logoUtama, setLogoUtama] = useState<string>(
    profilSekolah?.logoUrl || DEFAULT_LOGO_SEKOLAH
  );
  const [logoDinas, setLogoDinas] = useState<string>(
    profilSekolah?.logoDinasUrl || DEFAULT_LOGO_MAKASSAR
  );
  const [logoTutWuri, setLogoTutWuri] = useState<string>(
    profilSekolah?.tutWuriLogoUrl || DEFAULT_LOGO_TUT_WURI
  );
  const [stempelResmi, setStempelResmi] = useState<string>(
    profilSekolah?.stempelUrl || ''
  );

  const [activePreviewTab, setActivePreviewTab] = useState<'kopsurat' | 'sidebar' | 'kartu' | 'login'>('kopsurat');
  const [dragActiveZone, setDragActiveZone] = useState<'utama' | 'dinas' | 'tutwuri' | 'stempel' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileUtamaInputRef = useRef<HTMLInputElement>(null);
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
      showToast('error', 'Gagal Membaca File', 'Terjadi kesalahan saat memproses berkas gambar.');
    };
    reader.readAsDataURL(file);
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
      showToast('success', 'Asset Web Diperbarui', 'Logo dan branding sekolah berhasil disimpan ke asset web sistem.');
    }, 400);
  };

  // Reset to initial default logos
  const handleResetToDefaults = () => {
    setLogoUtama(DEFAULT_LOGO_SEKOLAH);
    setLogoDinas(DEFAULT_LOGO_MAKASSAR);
    setLogoTutWuri(DEFAULT_LOGO_TUT_WURI);
    setStempelResmi('');
    showToast('info', 'Diatur Ulang', 'Seluruh logo telah dikembalikan ke logo resmi standar.');
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
              Manajemen Logo & Branding Sekolah
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unggah file logo resmi sekolah, lambang dinas pendidikan / pemerintah daerah, dan logo Tut Wuri Handayani untuk ditampilkan secara serasi pada seluruh halaman website, kop surat dinas, kartu akses login guru, dan cetak dokumen resmi.
            </p>
          </div>

          {/* Action Save Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-reset-logo-defaults"
              onClick={handleResetToDefaults}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
              title="Kembalikan ke logo standar bawaan"
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
              <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Asset Web'}</span>
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
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Logo Sekolah Utama</h4>
                  <p className="text-[11px] text-slate-500">
                    Tampil pada Header Sidebar Navigasi, Top Bar, dan Kartu Login Guru
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                LOGO UTAMA
              </span>
            </div>

            {/* Upload Zone with Drag & Drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActiveZone('utama'); }}
              onDragLeave={(e) => { e.preventDefault(); setDragActiveZone(null); }}
              onDrop={(e) => {
                e.preventDefault();
                setDragActiveZone(null);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processImageFile(e.dataTransfer.files[0], setLogoUtama, 'Logo Sekolah Utama');
                }
              }}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center gap-5 ${
                dragActiveZone === 'utama'
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              {/* Image Preview Box */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-xs flex items-center justify-center shrink-0 relative overflow-hidden">
                <img
                  src={logoUtama}
                  alt="Logo Sekolah Utama"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_LOGO_SEKOLAH;
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Upload Prompts & Action Buttons */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Unggah Logo Sekolah (PNG / SVG Transparan disarankan)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Tarik & letakkan file logo di sini, atau klik tombol pilih berkas. Maksimal 3 MB.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileUtamaInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Berkas Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLogoUtama(DEFAULT_LOGO_SEKOLAH);
                      showToast('info', 'Logo Direset', 'Logo sekolah dikembalikan ke standar awal.');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Gunakan Logo Standar</span>
                  </button>

                  <input
                    ref={fileUtamaInputRef}
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
          </div>

          {/* Card 2: Logo Pendamping Kop Surat & Dokumen Resmi */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Logo Kop Surat Resmi & Dokumen Dinas</h4>
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
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActiveZone('dinas'); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActiveZone(null); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveZone(null);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processImageFile(e.dataTransfer.files[0], setLogoDinas, 'Logo Dinas / Pemkot');
                  }
                }}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  dragActiveZone === 'dinas'
                    ? 'border-emerald-500 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Logo Pemkot / Dinas</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    SISI KIRI KOP
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={logoDinas}
                      alt="Logo Dinas"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_LOGO_MAKASSAR;
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-xs font-bold text-slate-800 truncate">Kota Makassar</div>
                    <p className="text-[10px] text-slate-500">Lambang Pemerintah Daerah</p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => fileDinasInputRef.current?.click()}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer underline"
                      >
                        Ganti Logo...
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoDinas(DEFAULT_LOGO_MAKASSAR);
                          showToast('info', 'Logo Direset', 'Logo dinas dikembalikan ke standar Makassar.');
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                    <input
                      ref={fileDinasInputRef}
                      type="file"
                      accept="image/*,.png,.jpg,.jpeg,.svg,.webp"
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
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActiveZone('tutwuri'); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActiveZone(null); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveZone(null);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processImageFile(e.dataTransfer.files[0], setLogoTutWuri, 'Logo Tut Wuri');
                  }
                }}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  dragActiveZone === 'tutwuri'
                    ? 'border-emerald-500 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Logo Tut Wuri Handayani</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    SISI KANAN KOP
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={logoTutWuri}
                      alt="Logo Tut Wuri"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_LOGO_TUT_WURI;
                      }}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-xs font-bold text-slate-800 truncate">Kemendikbudristek</div>
                    <p className="text-[10px] text-slate-500">Lambang Pendidikan Nasional</p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => fileTutWuriInputRef.current?.click()}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer underline"
                      >
                        Ganti Logo...
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoTutWuri(DEFAULT_LOGO_TUT_WURI);
                          showToast('info', 'Logo Direset', 'Logo Tut Wuri dikembalikan ke standar.');
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                    <input
                      ref={fileTutWuriInputRef}
                      type="file"
                      accept="image/*,.png,.jpg,.jpeg,.svg,.webp"
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
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActiveZone('stempel'); }}
              onDragLeave={(e) => { e.preventDefault(); setDragActiveZone(null); }}
              onDrop={(e) => {
                e.preventDefault();
                setDragActiveZone(null);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processImageFile(e.dataTransfer.files[0], setStempelResmi, 'Stempel Resmi');
                }
              }}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                dragActiveZone === 'stempel'
                  ? 'border-purple-500 bg-purple-50/70'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">Stempel / Cap Resmi Sekolah (Opsional)</span>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  PNG TRANSPARAN
                </span>
              </div>

              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/30 flex items-center justify-center shrink-0 overflow-hidden">
                  {stempelResmi ? (
                    <img
                      src={stempelResmi}
                      alt="Stempel Resmi"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Stamp className="w-6 h-6 text-purple-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[11px] text-slate-600">
                    {stempelResmi ? 'Stempel digital aktif untuk tanda tangan & legalitas dokumen cetak.' : 'Belum ada stempel digital terpasang.'}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileStempelInputRef.current?.click()}
                      className="text-xs text-purple-700 hover:text-purple-900 font-bold cursor-pointer underline"
                    >
                      {stempelResmi ? 'Ganti File Stempel...' : '+ Unggah Stempel PNG...'}
                    </button>
                    {stempelResmi && (
                      <button
                        type="button"
                        onClick={() => {
                          setStempelResmi('');
                          showToast('info', 'Stempel Dihapus', 'Stempel resmi digital dikosongkan.');
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                    <input
                      ref={fileStempelInputRef}
                      type="file"
                      accept="image/png,.png"
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
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActivePreviewTab('kopsurat')}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                  activePreviewTab === 'kopsurat'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kop Surat
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('sidebar')}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                  activePreviewTab === 'sidebar'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sidebar
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('kartu')}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                  activePreviewTab === 'kartu'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kartu NIP
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('login')}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center ${
                  activePreviewTab === 'login'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Login
              </button>
            </div>

            {/* PREVIEW CONTAINER 1: KOP SURAT RESMI */}
            {activePreviewTab === 'kopsurat' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Preview Kop Surat Resmi Kedinasan:</span>
                  <span className="text-[10px] text-slate-400">Standar Dokumen Resmi</span>
                </div>
                
                <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-sm space-y-3 text-slate-900">
                  {/* Kop Header */}
                  <div className="flex items-center justify-between gap-3 border-b-4 border-double border-slate-900 pb-3">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src={logoDinas}
                        alt="Logo Pemkot"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_LOGO_MAKASSAR;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-center flex-1 space-y-0.5">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-700">
                        PEMERINTAH KOTA MAKASSAR
                      </div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                        DINAS PENDIDIKAN
                      </div>
                      <div className="text-xs sm:text-sm font-black uppercase text-slate-950 tracking-tight leading-tight">
                        {profilSekolah?.namaSekolah || 'UPTD SPF SDN LANTO DG. PASEWANG'}
                      </div>
                      <div className="text-[8px] text-slate-600 leading-tight">
                        {profilSekolah?.alamat || 'Jl. Lanto Dg. Pasewang No. 45'}, {profilSekolah?.kota || 'Kota Makassar'} • NPSN: {profilSekolah?.npsn || '40307399'}
                      </div>
                      <div className="text-[8px] text-slate-500 leading-tight">
                        Email: {profilSekolah?.email || 'sdnlanto@makassar.sch.id'} | Akreditasi: {profilSekolah?.akreditasi || 'A (Unggul)'}
                      </div>
                    </div>

                    <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 p-0.5">
                      <img
                        src={logoTutWuri}
                        alt="Logo Tut Wuri"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_LOGO_TUT_WURI;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Body Simulation */}
                  <div className="text-center py-2 space-y-1">
                    <div className="text-[10px] font-bold uppercase underline text-slate-800">
                      SURAT KEPUTUSAN KEPALA SEKOLAH
                    </div>
                    <div className="text-[8px] text-slate-500">
                      Nomor: 421.2 / 084 / DISDIK / {new Date().getFullYear()}
                    </div>
                  </div>

                  {stempelResmi && (
                    <div className="flex justify-end pr-4 pt-1">
                      <div className="w-12 h-12 opacity-80 rotate-[-8deg]">
                        <img src={stempelResmi} alt="Stempel Preview" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PREVIEW CONTAINER 2: SIDEBAR WEB */}
            {activePreviewTab === 'sidebar' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-700">Preview Header Sidebar (Navigasi Kiri):</div>
                <div className="bg-[#0f172a] text-white p-4 rounded-2xl border border-slate-700 space-y-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-slate-600 overflow-hidden">
                      <img
                        src={logoUtama}
                        alt="Logo Preview"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_LOGO_SEKOLAH;
                        }}
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

            {/* PREVIEW CONTAINER 3: KARTU LOGIN GURU */}
            {activePreviewTab === 'kartu' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-700">Preview Kartu Akses Login Guru (NIP):</div>
                <div className="bg-emerald-950/5 border-2 border-emerald-300 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-white p-0.5 border border-emerald-300 flex items-center justify-center overflow-hidden">
                        <img
                          src={logoUtama}
                          alt="Logo"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_LOGO_SEKOLAH;
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-[10px] font-bold text-emerald-950 uppercase truncate max-w-[170px]">
                        {profilSekolah?.namaSekolah}
                      </div>
                    </div>
                    <span className="text-[8px] font-black bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded shrink-0">
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

            {/* PREVIEW CONTAINER 4: LOGIN PAGE */}
            {activePreviewTab === 'login' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-slate-700">Preview Halaman Login:</div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-white space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white p-1 border border-slate-300 flex items-center justify-center overflow-hidden">
                      <img
                        src={logoUtama}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_LOGO_SEKOLAH;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-white tracking-wider">
                        SIM LANTO
                      </div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[200px]">
                        {profilSekolah?.namaSekolah}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Quick Advice */}
            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/70 text-[11px] text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Penyimpanan Aman & Permanen</span>
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
