import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { DEFAULT_LOGO_SEKOLAH } from '../../../data/brandingAssets';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Lock,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Sparkles,
  Layout,
  Check,
  Info,
  Trash2
} from 'lucide-react';

export const LogoBrandingManager: React.FC = () => {
  const { profilSekolah, updateProfilSekolah, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string>(
    profilSekolah?.logoUrl || DEFAULT_LOGO_SEKOLAH
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasNewSelection, setHasNewSelection] = useState(false);

  // Proses berkas gambar yang dipilih atau di-drop
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Format Tidak Didukung', 'Harap unggah berkas gambar (PNG, JPG, JPEG, SVG, atau WebP).');
      return;
    }

    // Maksimum 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Ukuran Terlalu Besar', 'Ukuran berkas logo maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewLogo(result);
        setHasNewSelection(true);
        showToast('info', 'Pratinjau Logo Siap', 'Logo berhasil dimuat. Klik "Simpan & Kunci Logo" untuk menerapkan secara permanen.');
      }
    };
    reader.onerror = () => {
      showToast('error', 'Gagal Membaca File', 'Terjadi kesalahan saat memproses gambar logo.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Simpan dan Kunci Logo agar tidak berganti saat login
  const handleSaveAndLock = () => {
    setIsSaving(true);

    try {
      localStorage.setItem('school_logo_custom', previewLogo);
      localStorage.setItem('school_logo_locked', 'true');
    } catch (e) {
      console.warn('Gagal menyimpan ke cache lokal:', e);
    }

    updateProfilSekolah({
      logoUrl: previewLogo
    });

    setTimeout(() => {
      setIsSaving(false);
      setHasNewSelection(false);
      showToast(
        'success',
        'Logo Berhasil Disimpan & Dikunci',
        'Logo sekolah baru Anda telah dikunci dan diproteksi. Logo tidak akan berganti atau ter-reset saat login.'
      );
    }, 400);
  };

  // Kembalikan ke Logo Resmi Bawaan SDN Lanto
  const handleResetToDefault = () => {
    setPreviewLogo(DEFAULT_LOGO_SEKOLAH);
    setHasNewSelection(true);

    try {
      localStorage.setItem('school_logo_custom', DEFAULT_LOGO_SEKOLAH);
      localStorage.setItem('school_logo_locked', 'true');
    } catch (e) {}

    updateProfilSekolah({
      logoUrl: DEFAULT_LOGO_SEKOLAH
    });

    showToast(
      'info',
      'Kembali ke Logo Resmi Bawaan',
      'Logo telah disetel ulang ke lambang resmi bawaan SDN Lanto Dg. Pasewang dan dikunci.'
    );
    setHasNewSelection(false);
  };

  // Hapus Logo Kustom yang Diunggah
  const handleDeleteCustomLogo = () => {
    try {
      localStorage.removeItem('school_logo_custom');
      localStorage.removeItem('school_logo_locked');
    } catch (e) {}

    setPreviewLogo(DEFAULT_LOGO_SEKOLAH);
    setHasNewSelection(false);

    updateProfilSekolah({
      logoUrl: DEFAULT_LOGO_SEKOLAH
    });

    showToast(
      'info',
      'Logo Kustom Dihapus',
      'Logo kustom yang diunggah telah berhasil dihapus. Sistem kembali menampilkan logo resmi sekolah.'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
        className="hidden"
        id="input-upload-logo-sekolah"
      />

      {/* Header Banner Penjelasan & Panduan */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>PANDUAN UNGGAH & KUNCI LOGO SEKOLAH</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Cara Unggah Logo Sekolah
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Anda dapat mengunggah berkas logo sekolah Anda (format <strong>PNG, JPG, SVG, WebP</strong>). Setelah diunggah, klik tombol <strong>"Simpan & Kunci Logo"</strong> agar logo tersimpan permanen dan terkunci rapat sehingga tidak akan tertukar atau kembali ke logo lain saat login.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-pilih-berkas-header"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Pilih Berkas Logo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Langkah-langkah Unggah Cepat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
            1
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs block">Pilih Berkas</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Klik tombol unggah atau drag & drop file logo dari komputer Anda.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-black text-xs shrink-0">
            2
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs block">Cek Pratinjau</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Periksa tampilan logo di kotak pratinjau sebelum mengunci perubahan.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
            3
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs block">Simpan & Kunci</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Sistem mengunci logo agar tidak berganti otomatis saat Anda login kembali.</p>
          </div>
        </div>
      </div>

      {/* Main Upload & Preview Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Pengaturan & Berkas Logo Sekolah
              </h4>
              <p className="text-xs text-slate-500">
                Unggah dan kelola logo sekolah resmi untuk seluruh sistem SIM LANTO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              PROTEKSI LOGO AKTIF
            </span>
          </div>
        </div>

        {/* Dropzone & Preview Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Kolom Kiri: Pratinjau Logo Saat Ini */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Pratinjau Logo Aktif
            </span>
            <div className="relative group mb-3">
              <div className="w-36 h-36 rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-md shadow-slate-200/50 flex items-center justify-center overflow-hidden">
                <img
                  src={previewLogo}
                  alt="Logo Sekolah"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_LOGO_SEKOLAH;
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm border-2 border-white">
                <Lock className="w-3 h-3" />
                <span>TERKUNCI</span>
              </div>
            </div>
            <p className="text-xs font-black text-slate-800 line-clamp-1">
              {profilSekolah.namaSekolah || 'SDN Lanto Dg. Pasewang'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              NPSN: {profilSekolah.npsn || '40307044'}
            </p>
          </div>

          {/* Kolom Kanan: Area Drag and Drop & Tombol Unggah */}
          <div className="md:col-span-8 space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  Tarik & Letakkan berkas gambar logo di sini, atau <span className="text-blue-600 underline">Klik untuk Memilih</span>
                </p>
                <p className="text-xs text-slate-500">
                  Mendukung PNG transparan, JPG, SVG, WebP (Rekomendasi rasio 1:1, maks 5 MB)
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-upload-file-pilih"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Pilih Berkas Komputer</span>
                </button>

                <button
                  type="button"
                  id="btn-hapus-logo-kustom"
                  onClick={handleDeleteCustomLogo}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Hapus logo kustom yang diunggah dan bersihkan penyimpanan"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Hapus Logo Kustom</span>
                </button>

                <button
                  type="button"
                  id="btn-reset-default-logo"
                  onClick={handleResetToDefault}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  title="Kembalikan ke lambang resmi bawaan SDN Lanto Dg. Pasewang"
                >
                  <span>Reset Bawaan</span>
                </button>
              </div>

              <button
                type="button"
                id="btn-simpan-kunci-logo"
                onClick={handleSaveAndLock}
                disabled={isSaving}
                className={`px-5 py-2.5 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                  hasNewSelection
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/20 ring-2 ring-emerald-400/50'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-600/20'
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Menyimpan & Mengunci...' : 'Simpan & Kunci Logo Sekolah'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Note: Anti-Reset Guarantee */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold block">Proteksi Kunci Logo (Anti-Reset saat Login)</span>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Ketika Anda menekan tombol <strong>"Simpan & Kunci Logo Sekolah"</strong>, logo baru akan disimpan di memori permanen dan terlindungi secara otomatis. Sistem telah dikunci sehingga akun guru, kepala sekolah, atau admin yang masuk kembali <strong>tidak akan mengubah atau me-reset logo</strong> ke logo lain.
            </p>
          </div>
        </div>

        {/* Lokasi Penerapan Logo */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <Layout className="w-4 h-4 text-indigo-600" />
            <span>Logo yang Diunggah & Dikunci Akan Tampil Otomatis Pada:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200/70">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Header Sidebar Navigasi Utama SIM LANTO</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200/70">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Halaman Profil Resmi Sekolah & Ringkasan Data</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200/70">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Kartu Akses Login Guru Berbasis NIP</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200/70">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Halaman Utama Login Portal SIM Sekolah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
