import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProfilSekolah } from '../../../types';
import { DEFAULT_LOGO_SEKOLAH } from '../../../data/brandingAssets';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Layout,
  Check,
  Info
} from 'lucide-react';

export const LogoBrandingManager: React.FC = () => {
  const { profilSekolah, updateProfilSekolah, showToast } = useApp();

  // Local state initialized with profilSekolah or default vector data URIs
  const [logoUtama, setLogoUtama] = useState<string>(
    profilSekolah?.logoUrl || DEFAULT_LOGO_SEKOLAH
  );

  const [dragActiveZone, setDragActiveZone] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileUtamaInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded image file to Base64 Data URL
  const processImageFile = (
    file: File,
    onSuccess: (dataUrl: string) => void,
    label: string = 'Logo Sekolah Utama'
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

  // Save logo to AppContext, Cloud Firestore, and LocalStorage
  const handleSaveLogo = () => {
    setIsSaving(true);
    const updatedProfil: ProfilSekolah = {
      ...profilSekolah,
      logoUrl: logoUtama
    };

    // Save custom logo override to localStorage to prevent automatic reset on login
    try {
      localStorage.setItem('school_logo_custom', logoUtama);
    } catch (err) {
      console.warn('Gagal menyimpan logo ke localStorage', err);
    }

    updateProfilSekolah(updatedProfil);

    setTimeout(() => {
      setIsSaving(false);
      showToast('success', 'Logo Berhasil Disimpan', 'Logo resmi sekolah berhasil diperbarui dan tersimpan permanen.');
    }, 400);
  };

  // Reset to initial default logo
  const handleResetToDefault = () => {
    setLogoUtama(DEFAULT_LOGO_SEKOLAH);
    try {
      localStorage.removeItem('school_logo_custom');
    } catch (e) {
      console.warn('Gagal menghapus custom logo dari localStorage', e);
    }
    updateProfilSekolah({
      logoUrl: DEFAULT_LOGO_SEKOLAH
    });
    showToast('info', 'Logo Direset', 'Logo sekolah telah dikembalikan ke logo resmi standar.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
              Manajemen Logo Sekolah
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unggah file logo resmi sekolah untuk ditampilkan secara otomatis pada Header Sidebar Navigasi, Top Bar Sistem, Halaman Profil Sekolah, dan Kartu Akses Login Guru.
            </p>
          </div>

          {/* Action Save Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-reset-logo-defaults"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
              title="Kembalikan ke logo standar bawaan"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Standar</span>
            </button>

            <button
              type="button"
              id="btn-save-logo-assets"
              onClick={handleSaveLogo}
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Logo Sekolah'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Upload Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">Logo Sekolah Utama</h4>
              <p className="text-xs text-slate-500">
                Identitas visual utama sekolah pada aplikasi SIM LANTO
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            LOGO AKTIF
          </span>
        </div>

        {/* Upload Zone with Drag & Drop */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActiveZone(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActiveZone(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActiveZone(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processImageFile(e.dataTransfer.files[0], setLogoUtama, 'Logo Sekolah Utama');
            }
          }}
          className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center gap-6 ${
            dragActiveZone
              ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50'
          }`}
        >
          {/* Image Preview Box */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-md flex items-center justify-center shrink-0 relative overflow-hidden">
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
          <div className="space-y-4 flex-1 text-center sm:text-left">
            <div>
              <h5 className="text-sm font-bold text-slate-900">
                Unggah Berkas Logo Sekolah
              </h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Tarik & letakkan file logo di sini, atau klik tombol di bawah untuk memilih file dari perangkat Anda. Disarankan format PNG atau SVG dengan latar belakang transparan (resolusi minimal 200x200 px, maks 3 MB).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                type="button"
                onClick={() => fileUtamaInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas Logo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLogoUtama(DEFAULT_LOGO_SEKOLAH);
                  showToast('info', 'Logo Direset', 'Logo sekolah dikembalikan ke standar awal.');
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
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

        {/* Informational Cards on Logo Usage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Layout className="w-4 h-4 text-blue-600" />
              <span>Lokasi Penempatan Logo</span>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Header Sidebar Navigasi Utama</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Profil Resmi Sekolah & Dokumen SIM</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kartu Akses Login Guru Berbasis NIP</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Halaman Login Sistem</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Penyimpanan Aman & Permanen</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Logo yang disimpan diproteksi dengan sinkronisasi ganda: tersimpan pada cache lokal browser serta otomatis dicadangkan ke database awan, sehingga logo tidak akan berubah atau ter-reset otomatis setiap kali Anda melakukan login.
            </p>
          </div>
        </div>

        {/* Bottom Save Action reminder */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Pastikan mengklik tombol <strong>Simpan Logo Sekolah</strong> setelah memilih berkas baru.
          </span>
          <button
            type="button"
            onClick={handleSaveLogo}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
