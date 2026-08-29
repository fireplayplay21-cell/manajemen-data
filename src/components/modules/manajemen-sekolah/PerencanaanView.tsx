import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { DokumenPerencanaan } from '../../../types';
import { Modal } from '../../common/Modal';
import { DriveFileUpload } from '../../common/DriveFileUpload';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Calendar,
  Target,
  FileSpreadsheet,
  Briefcase,
  BookOpen,
  Download,
  ExternalLink,
  HardDrive
} from 'lucide-react';

export const PerencanaanView: React.FC = () => {
  const {
    perencanaanList,
    addPerencanaan,
    updatePerencanaan,
    deletePerencanaan,
    currentUser
  } = useApp();

  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DokumenPerencanaan | null>(null);
  const [viewingItem, setViewingItem] = useState<DokumenPerencanaan | null>(null);

  const [formData, setFormData] = useState<Omit<DokumenPerencanaan, 'id'>>({
    kategori: 'KSP',
    judul: '',
    tahunAjaran: '2024/2025',
    penyusun: '',
    tanggalUpload: new Date().toISOString().split('T')[0],
    status: 'Draft',
    uraian: '',
    targetCapaian: '',
    fileUrl: ''
  });

  const categories = [
    'Semua',
    'KSP',
    'RKT/RKS',
    'RKAS',
    'Program Kerja KS',
    'Kalender Pendidikan',
    'Target Sekolah'
  ];

  const safePerencanaanList = perencanaanList || [];

  const filteredList = safePerencanaanList.filter(item => {
    const matchCategory = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    const matchSearch =
      (item.judul || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.uraian || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.penyusun || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      kategori: selectedKategori !== 'Semua' ? (selectedKategori as any) : 'KSP',
      judul: '',
      tahunAjaran: '2024/2025',
      penyusun: currentUser.nama,
      tanggalUpload: new Date().toISOString().split('T')[0],
      status: 'Draft',
      uraian: '',
      targetCapaian: '',
      fileUrl: ''
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: DokumenPerencanaan) => {
    setEditingItem(item);
    setFormData({
      kategori: item.kategori,
      judul: item.judul,
      tahunAjaran: item.tahunAjaran,
      penyusun: item.penyusun,
      tanggalUpload: item.tanggalUpload,
      status: item.status,
      uraian: item.uraian,
      targetCapaian: item.targetCapaian || '',
      fileUrl: item.fileUrl || ''
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updatePerencanaan(editingItem.id, formData);
    } else {
      addPerencanaan(formData);
    }
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (kat: string) => {
    switch (kat) {
      case 'KSP':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'RKT/RKS':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'RKAS':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'Program Kerja KS':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'Kalender Pendidikan':
        return <Calendar className="w-4 h-4 text-rose-600" />;
      case 'Target Sekolah':
        return <Target className="w-4 h-4 text-teal-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Manajemen Sekolah • Modul 1</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Perencanaan Satuan Pendidikan
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pengelolaan dokumen Kurikulum Satuan Pendidikan (KSP), RKT/RKS, RKAS, Program Kerja Kepala Sekolah, Kalender Pendidikan, dan Target Kinerja Sekolah.
          </p>
        </div>

        <button
          id="btn-tambah-perencanaan"
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Perencanaan</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => {
            const count = cat === 'Semua' 
              ? safePerencanaanList.length 
              : safePerencanaanList.filter(d => d.kategori === cat).length;
            const isSelected = selectedKategori === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedKategori(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul dokumen, uraian, atau nama penyusun..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Document Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                  {getCategoryIcon(item.kategori)}
                  <span>{item.kategori}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Final' || item.status === 'Disetujui KS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mt-1">
                {item.judul}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {item.uraian}
              </p>

              {item.targetCapaian && (
                <div className="mt-3 p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900">
                  <span className="font-semibold">Target Capaian:</span> {item.targetCapaian}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                <div className="text-[11px] font-medium text-slate-700">T.A. {item.tahunAjaran}</div>
                <div className="text-[10px] text-slate-400">Penyusun: {item.penyusun}</div>
              </div>

              <div className="flex items-center gap-1">
                {item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka File di Google Drive"
                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <HardDrive className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setViewingItem(item)}
                  title="Lihat Rincian"
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  title="Edit Dokumen"
                  className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deletePerencanaan(item.id)}
                  title="Hapus Dokumen"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
            Tidak ada dokumen perencanaan yang sesuai dengan filter.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingItem ? 'Edit Dokumen Perencanaan' : 'Tambah Dokumen Perencanaan'}
        subtitle="Kelola rincian KSP, RKT, RKAS, Kalender Pendidikan, atau Target Sekolah"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori Perencanaan</label>
              <select
                value={formData.kategori}
                onChange={e => setFormData({ ...formData, kategori: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="KSP">KSP (Kurikulum Satuan Pendidikan)</option>
                <option value="RKT/RKS">RKT / RKS</option>
                <option value="RKAS">RKAS</option>
                <option value="Program Kerja KS">Program Kerja Kepala Sekolah</option>
                <option value="Kalender Pendidikan">Kalender Pendidikan</option>
                <option value="Target Sekolah">Target Sekolah</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={formData.tahunAjaran}
                onChange={e => setFormData({ ...formData, tahunAjaran: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen / Program</label>
              <input
                type="text"
                value={formData.judul}
                onChange={e => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Kurikulum Satuan Pendidikan (KSP) Fase A, B, C Tahun 2024/2025"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penyusun / Penanggung Jawab</label>
              <input
                type="text"
                value={formData.penyusun}
                onChange={e => setFormData({ ...formData, penyusun: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Dokumen</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Ditinjau">Ditinjau</option>
                <option value="Disetujui KS">Disetujui KS</option>
                <option value="Final">Final</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Uraian & Deskripsi Perencanaan</label>
              <textarea
                rows={3}
                value={formData.uraian}
                onChange={e => setFormData({ ...formData, uraian: e.target.value })}
                placeholder="Jelaskan ringkasan materi kurikulum atau target program..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Target Capaian / Output</label>
              <input
                type="text"
                value={formData.targetCapaian}
                onChange={e => setFormData({ ...formData, targetCapaian: e.target.value })}
                placeholder="Contoh: 100% siswa lulus, kenaikan skor literasi > 85.0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah Berkas/Dokumen ke Google Drive"
                category={`Perencanaan-${formData.kategori}`}
                initialUrl={formData.fileUrl}
                onUploadSuccess={(url) => {
                  setFormData(prev => ({ ...prev, fileUrl: url }));
                }}
                helperText="File akan otomatis disimpan langsung di folder Google Drive resmi SDN Lanto Dg. Pasewang."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambah Dokumen'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {viewingItem && (
        <Modal
          isOpen={true}
          onClose={() => setViewingItem(null)}
          title={`Detail Dokumen: ${viewingItem.judul}`}
          subtitle={`Kategori: ${viewingItem.kategori} • Tahun Ajaran ${viewingItem.tahunAjaran}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 block">Status Dokumen:</span>
                <span className="font-bold text-slate-900">{viewingItem.status}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Penyusun:</span>
                <span className="font-bold text-slate-900">{viewingItem.penyusun}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Upload:</span>
                <span className="font-bold text-slate-900">{viewingItem.tanggalUpload}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Uraian Dokumen:</h4>
              <p className="text-slate-700 leading-relaxed p-3 bg-white border border-slate-200 rounded-xl whitespace-pre-line">
                {viewingItem.uraian}
              </p>
            </div>

            {viewingItem.targetCapaian && (
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Target Capaian:</h4>
                <p className="text-blue-900 font-semibold p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                  {viewingItem.targetCapaian}
                </p>
              </div>
            )}

            {viewingItem.fileUrl ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <span>Berkas tersimpan di Google Drive Sekolah</span>
                </div>
                <a
                  href={viewingItem.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors"
                >
                  <span>Buka di Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-500">
                <span>Belum ada lampiran file Google Drive untuk dokumen ini.</span>
                <a
                  href={TARGET_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Buka Folder Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
