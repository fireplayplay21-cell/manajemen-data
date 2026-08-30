import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Check,
  RefreshCw,
  Sparkles,
  Download,
  Info,
  ShieldCheck,
  User,
  Sliders
} from 'lucide-react';

// Koleksi Aset Pas Foto Standar Pendidik & Tenaga Kependidikan
export const ASSET_FOTO_PRESETS = [
  {
    id: 'preset-ks-pns',
    nama: 'Kepala Sekolah (Wanita - Hijab Formal)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    kategori: 'Wanita / Hijab'
  },
  {
    id: 'preset-guru-wanita-1',
    nama: 'Guru Kelas (Wanita - Hijab Navy)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    kategori: 'Wanita / Hijab'
  },
  {
    id: 'preset-guru-wanita-2',
    nama: 'Guru Muda (Wanita - Hijab Pastel)',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    kategori: 'Wanita / Hijab'
  },
  {
    id: 'preset-guru-pria-1',
    nama: 'Guru Kelas / Mapel (Pria - Kemeja Resmi)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    kategori: 'Pria'
  },
  {
    id: 'preset-guru-pria-2',
    nama: 'Guru Senior / PJOK (Pria - Kemeja Putih)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    kategori: 'Pria'
  },
  {
    id: 'preset-guru-pria-3',
    nama: 'Operator / Tenaga IT (Pria)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    kategori: 'Pria'
  },
  {
    id: 'preset-guru-wanita-3',
    nama: 'Guru Mapel (Wanita - Formal)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    kategori: 'Wanita'
  }
];

interface PasFotoUploaderProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoDataUrl: string) => void;
  personName?: string;
  gender?: 'L' | 'P';
  aspectRatio?: '3x4' | '4x6' | '1x1';
}

export const PasFotoUploader: React.FC<PasFotoUploaderProps> = ({
  currentPhotoUrl,
  onPhotoChange,
  personName = 'Pendidik',
  gender = 'P',
  aspectRatio = '3x4'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url' | 'camera'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bgStyle, setBgStyle] = useState<'red' | 'blue' | 'neutral'>('red');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Kompresi Gambar Cerdas ke Rasio Pas Foto 3:4 (Base64 Web Asset Ringan & Permanen)
  const processAndCompressImage = (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          // Standar resolusi 3x4: 360 x 480 px (Kualitas tajam, ukuran < 40KB)
          const targetWidth = 360;
          const targetHeight = 480;
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Canvas rendering context not available');
          }

          // Hitung crop center cover
          const imgRatio = img.width / img.height;
          const targetRatio = targetWidth / targetHeight;
          let renderW = targetWidth;
          let renderH = targetHeight;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > targetRatio) {
            renderH = targetHeight;
            renderW = img.width * (targetHeight / img.height);
            offsetX = (targetWidth - renderW) / 2;
          } else {
            renderW = targetWidth;
            renderH = img.height * (targetWidth / img.width);
            offsetY = (targetHeight - renderH) / 2;
          }

          // Draw image
          ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

          // Convert to highly optimized JPEG Base64
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onPhotoChange(compressedDataUrl);
          setIsProcessing(false);
        } catch (err: any) {
          setErrorMsg('Gagal memproses gambar: ' + (err.message || 'Error'));
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMsg('Format file gambar tidak valid.');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Harap pilih file gambar (JPG, PNG, WebP).');
        return;
      }
      processAndCompressImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processAndCompressImage(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setIsProcessing(true);
    // Directly apply URL
    onPhotoChange(urlInput.trim());
    setIsProcessing(false);
    setUrlInput('');
  };

  const handleSelectPreset = (url: string) => {
    onPhotoChange(url);
  };

  const handleRemovePhoto = () => {
    onPhotoChange('');
  };

  // Start Camera
  const startCamera = async () => {
    setIsCameraActive(true);
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setErrorMsg('Tidak dapat mengakses kamera: ' + (err.message || 'Izin ditolak'));
      setIsCameraActive(false);
    }
  };

  // Capture Camera
  const captureCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Calculate crop from video
      const vRatio = video.videoWidth / video.videoHeight;
      const tRatio = 360 / 480;
      let rW = 360;
      let rH = 480;
      let ox = 0;
      let oy = 0;

      if (vRatio > tRatio) {
        rH = 480;
        rW = video.videoWidth * (480 / video.videoHeight);
        ox = (360 - rW) / 2;
      } else {
        rW = 360;
        rH = video.videoHeight * (360 / video.videoWidth);
        oy = (480 - rH) / 2;
      }

      ctx.drawImage(video, ox, oy, rW, rH);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onPhotoChange(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Pas Foto Resmi PTK (Format 3x4 / 4x6)
            </h4>
            <p className="text-[11px] text-slate-500">
              Tersimpan permanen di memori aset web & data sekolah.
            </p>
          </div>
        </div>

        {currentPhotoUrl && (
          <div className="flex items-center gap-2">
            <a
              href={currentPhotoUrl}
              download={`PasFoto_${personName.replace(/\s+/g, '_')}.jpg`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Unduh Foto</span>
            </a>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus Foto</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Preview on Left, Selector on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
        
        {/* Preview Frame 3x4 */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative group">
            
            {/* Background color accent badge */}
            <div className={`w-36 h-48 sm:w-40 sm:h-52 rounded-xl p-1.5 shadow-md border-2 transition-all flex items-center justify-center overflow-hidden ${
              bgStyle === 'red'
                ? 'bg-rose-700 border-rose-800 text-white'
                : bgStyle === 'blue'
                ? 'bg-blue-700 border-blue-800 text-white'
                : 'bg-slate-200 border-slate-300 text-slate-700'
            }`}>
              {currentPhotoUrl ? (
                <div className="w-full h-full rounded-lg overflow-hidden bg-white relative">
                  <img
                    src={currentPhotoUrl}
                    alt={`Pas Foto ${personName}`}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if URL fails
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400';
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-xs py-1 px-1.5 text-center">
                    <span className="text-[10px] font-bold text-white tracking-wider uppercase truncate block">
                      3 x 4 FORMAL
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full rounded-lg bg-white/90 flex flex-col items-center justify-center p-3 text-center text-slate-400">
                  <User className="w-12 h-12 text-slate-300 mb-1" />
                  <span className="text-[11px] font-bold text-slate-600 leading-tight">
                    Belum Ada Pas Foto
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    Format 3x4 / 4x6
                  </span>
                </div>
              )}
            </div>

            {/* Status indicator pill */}
            <div className="mt-2 text-center">
              {currentPhotoUrl ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Foto Terpasang
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                  Foto Default / Kosong
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls on Right */}
        <div className="md:col-span-8 space-y-3">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Gambar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('preset');
                stopCamera();
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aset Galeri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('url');
                stopCamera();
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Tautan / Drive</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Kamera</span>
            </button>
          </div>

          {/* TAB 1: UPLOAD DARI KOMPUTER / HP */}
          {activeTab === 'upload' && (
            <div className="space-y-2">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-400 bg-white hover:bg-emerald-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {isProcessing ? 'Mengompres & Menyimpan Foto...' : 'Klik atau Seret Pas Foto ke Sini'}
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-sm">
                    Mendukung file JPG, PNG, atau WebP. Foto akan otomatis di-crop & dikompresi ke rasio 3x4 resmi agar permanen di aset web.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PILIH DARI GALERI ASET RESMI SEKOLAH */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 font-medium">
                Pilih foto aset pendidik standar sekolah untuk profil {personName}:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {ASSET_FOTO_PRESETS.map((preset) => {
                  const isSelected = currentPhotoUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col items-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 mb-1 relative">
                        <img
                          src={preset.url}
                          alt={preset.nama}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center block">
                        {preset.kategori}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INPUT TAUTAN URL / GOOGLE DRIVE */}
          {activeTab === 'url' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-slate-700">
                Masukkan Tautan URL Foto Web / Google Drive:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://... atau tautan Google Drive / Cloud"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Tip: Anda dapat menggunakan tautan foto dari Google Drive sekolah atau server cloud storage Anda.
              </p>
            </div>
          )}

          {/* TAB 4: KAMERA LANGSUNG */}
          {activeTab === 'camera' && (
            <div className="space-y-2">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] max-h-48 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-emerald-500/40 pointer-events-none flex items-center justify-center">
                  <div className="w-28 h-36 border border-dashed border-white/80 rounded-lg"></div>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={captureCamera}
                  disabled={!isCameraActive}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ambil Jepretan Foto (3x4)</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Panduan Penyimpanan Permanen */}
          <div className="p-2.5 bg-sky-50/80 border border-sky-200 text-sky-800 rounded-xl text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-bold">Keamanan & Permanensi Aset:</span> Foto otomatis dikonversi ke format Web Base64/Aset terkompresi sehingga tersimpan permanen di memori lokal dan sinkronisasi database sekolah tanpa bergantung pada hosting eksternal.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
