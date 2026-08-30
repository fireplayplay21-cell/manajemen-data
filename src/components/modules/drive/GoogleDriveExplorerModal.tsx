import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  UploadCloud,
  Search,
  Trash2,
  ExternalLink,
  FolderPlus,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import {
  listDriveFiles,
  uploadFileToTargetDriveFolder,
  deleteDriveFile,
  createDriveFolder,
  getDriveQuota,
  getDriveAccessToken,
  TARGET_DRIVE_FOLDER_ID,
  TARGET_DRIVE_FOLDER_URL,
  UploadedDriveFile,
  DriveQuotaInfo
} from '../../../services/driveService';

interface GoogleDriveExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile?: (file: UploadedDriveFile) => void;
  selectMode?: boolean;
}

export const GoogleDriveExplorerModal: React.FC<GoogleDriveExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
  selectMode = false
}) => {
  const { firebaseUser, loginWithGoogle, showToast } = useApp();
  const [files, setFiles] = useState<UploadedDriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pdf' | 'doc' | 'sheet' | 'image'>('all');
  const [quota, setQuota] = useState<DriveQuotaInfo | null>(null);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Arsip Sekolah');

  // Folder creation State
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Delete Confirmation State (Mandatory confirmation dialog per guidelines)
  const [fileToDelete, setFileToDelete] = useState<UploadedDriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await listDriveFiles({
        query: searchQuery || undefined,
        pageSize: 40
      });
      setFiles(data);
      const quotaData = await getDriveQuota();
      if (quotaData) setQuota(quotaData);
    } catch (err) {
      console.error('Error fetching drive files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, searchQuery, firebaseUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadFileToTargetDriveFolder(file, {
        category: uploadCategory,
        customFileName: `[${uploadCategory}] ${file.name}`
      });
      showToast('success', 'File Terunggah', `File ${file.name} berhasil diunggah ke Google Drive.`);
      fetchFiles();
      if (onSelectFile && selectMode) {
        onSelectFile(uploaded);
        onClose();
      }
    } catch (err: any) {
      showToast('error', 'Gagal Mengunggah', err.message || 'Terjadi kesalahan saat mengunggah file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const folder = await createDriveFolder(newFolderName.trim(), TARGET_DRIVE_FOLDER_ID);
      showToast('success', 'Folder Dibuat', `Folder "${folder.name}" berhasil dibuat di Google Drive.`);
      setNewFolderName('');
      setIsCreatingFolder(false);
      fetchFiles();
    } catch (err: any) {
      showToast('error', 'Gagal Membuat Folder', err.message || 'Tidak dapat membuat folder di Google Drive.');
    }
  };

  // Mandatory explicit confirmation dialog for file deletion
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteDriveFile(fileToDelete.id);
      if (success) {
        showToast('info', 'File Dihapus', `File "${fileToDelete.name}" telah dihapus dari Google Drive.`);
        setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      } else {
        showToast('error', 'Gagal Menghapus', 'Tidak dapat menghapus file dari Google Drive.');
      }
    } catch (err: any) {
      showToast('error', 'Gagal Menghapus', err.message || 'Terjadi kesalahan saat menghapus.');
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500 shrink-0" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    if (mimeType.includes('image')) return <FileImage className="w-5 h-5 text-amber-500 shrink-0" />;
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-600 shrink-0" />;
    }
    return <File className="w-5 h-5 text-slate-500 shrink-0" />;
  };

  const filteredFiles = files.filter(f => {
    if (activeFilter === 'pdf') return f.mimeType?.includes('pdf');
    if (activeFilter === 'doc') return f.mimeType?.includes('word') || f.mimeType?.includes('document');
    if (activeFilter === 'sheet') return f.mimeType?.includes('spreadsheet') || f.mimeType?.includes('excel');
    if (activeFilter === 'image') return f.mimeType?.includes('image');
    return true;
  });

  const hasToken = !!getDriveAccessToken();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Google Drive Explorer</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800">
                  SDN Lanto Dg. Pasewang
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Penyimpanan & Manajemen Arsip Digital Sekolah Terintegrasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={TARGET_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Buka di Google Drive</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth / Quota Banner */}
        <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-900">
            {firebaseUser ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Akun: <strong>{firebaseUser.displayName || firebaseUser.email}</strong>
                </span>
                {quota && (
                  <span className="text-blue-700 font-medium">
                    • Pemakaian Drive: <strong>{quota.usage}</strong> / {quota.limit}
                  </span>
                )}
              </>
            ) : (
              <span>Masuk dengan Akun Google untuk sinkronisasi Google Drive secara penuh.</span>
            )}
          </div>

          {!firebaseUser && (
            <button
              type="button"
              onClick={loginWithGoogle}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Otorisasi Akun Google
            </button>
          )}
        </div>

        {/* Toolbar & Controls */}
        <div className="p-6 space-y-4 border-b border-slate-100 bg-white">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari file dokumen, SK, laporan, ijazah di Drive..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchFiles}
                disabled={isLoading}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="Refresh Daftar File"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Buat Folder</span>
              </button>

              {/* Upload Button */}
              <label className={`inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer ${
                isUploading ? 'opacity-70 pointer-events-none' : ''
              }`}>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="sr-only"
                />
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload File</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* New Folder Form */}
          {isCreatingFolder && (
            <form onSubmit={handleCreateFolder} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Nama folder baru (misal: SK Guru 2026, Foto Kegiatan)..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingFolder(false)}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 text-xs rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
            </form>
          )}

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Filter Dokumen:</span>
            {[
              { id: 'all', label: 'Semua File' },
              { id: 'pdf', label: 'PDF' },
              { id: 'doc', label: 'Word / Docs' },
              { id: 'sheet', label: 'Excel / Spreadsheet' },
              { id: 'image', label: 'Gambar / Foto' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* File List / Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs">Memuat berkas dari Google Drive...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
              <HardDrive className="w-12 h-12 stroke-1 opacity-50 text-slate-400" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">Belum ada file di direktori ini</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Klik tombol <strong>Upload File</strong> di atas untuk menambahkan berkas ke Google Drive SDN Lanto Dg. Pasewang.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                      {getFileIcon(file.mimeType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs font-bold text-slate-900 truncate leading-snug"
                        title={file.name}
                      >
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        {file.size && <span>{file.size}</span>}
                        {file.modifiedTime && (
                          <span>
                            • {new Date(file.modifiedTime).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <span>Lihat File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1">
                      {selectMode && onSelectFile && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectFile(file);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Pilih
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setFileToDelete(file)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus file dari Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mandatory Confirmation Modal for File Deletion */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-100">
              <div className="flex items-start gap-3 text-amber-600">
                <AlertTriangle className="w-6 h-6 shrink-0 text-rose-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Konfirmasi Hapus File Google Drive
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Apakah Anda yakin ingin menghapus file <strong>"{fileToDelete.name}"</strong> dari Google Drive? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Ya, Hapus File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
