import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProgramUnggulan } from '../../../types';
import { Modal } from '../../common/Modal';
import { DriveFileUpload } from '../../common/DriveFileUpload';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  Award,
  Plus,
  Search,
  Sparkles,
  MapPin,
  Calendar,
  User,
  HeartHandshake,
  Lightbulb,
  Camera,
  Trash2,
  Edit,
  Eye,
  Check,
  HardDrive,
  ExternalLink
} from 'lucide-react';

export const ProgramUnggulanView: React.FC = () => {
  const {
    programUnggulanList,
    addProgramUnggulan,
    updateProgramUnggulan,
    deleteProgramUnggulan,
    currentUser
  } = useApp();

  const isGuru = currentUser.role === 'guru';

  const [selectedJenis, setSelectedJenis] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramUnggulan | null>(null);
  const [viewingItem, setViewingItem] = useState<ProgramUnggulan | null>(null);

  const [formData, setFormData] = useState<Omit<ProgramUnggulan, 'id'>>({
    jenis: 'Program Sekolah',
    namaProgram: '',
    bidang: '',
    deskripsi: '',
    inovator: '',
    dampak: '',
    tanggalPelaksanaan: new Date().toISOString().split('T')[0],
    lokasi: 'SDN Lanto Dg. Pasewang',
    fotoUrl: ''
  });

  const jenisList = ['Semua', 'Program Sekolah', 'Praktik Baik', 'Dokumentasi'];

  const safeProgramUnggulanList = programUnggulanList || [];

  const filteredList = safeProgramUnggulanList.filter(item => {
    const matchJenis = selectedJenis === 'Semua' || item.jenis === selectedJenis;
    const matchSearch =
      (item.namaProgram || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.deskripsi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.inovator || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.bidang || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchJenis && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      jenis: selectedJenis !== 'Semua' ? (selectedJenis as any) : 'Program Sekolah',
      namaProgram: '',
      bidang: '',
      deskripsi: '',
      inovator: currentUser.nama,
      dampak: '',
      tanggalPelaksanaan: new Date().toISOString().split('T')[0],
      lokasi: 'SDN Lanto Dg. Pasewang',
      fotoUrl: ''
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: ProgramUnggulan) => {
    setEditingItem(item);
    setFormData({
      jenis: item.jenis,
      namaProgram: item.namaProgram,
      bidang: item.bidang,
      deskripsi: item.deskripsi,
      inovator: item.inovator,
      dampak: item.dampak,
      tanggalPelaksanaan: item.tanggalPelaksanaan,
      lokasi: item.lokasi,
      fotoUrl: item.fotoUrl || ''
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateProgramUnggulan(editingItem.id, formData);
    } else {
      addProgramUnggulan(formData);
    }
    setIsAddModalOpen(false);
  };

  const getIcon = (jenis: string) => {
    switch (jenis) {
      case 'Program Sekolah':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'Praktik Baik':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'Dokumentasi':
        return <Camera className="w-5 h-5 text-blue-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 text-[11px] font-bold border border-yellow-200 mb-1.5">
            <Award className="w-3.5 h-3.5 text-yellow-600" />
            <span>Manajemen Sekolah • Modul 3</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Program Unggulan, Praktik Baik & Dokumentasi
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Inovasi kearifan lokal, program kebiasaan karakter, karya inovatif pendidik, dan arsip dokumentasi kegiatan SDN Lanto Dg. Pasewang Makassar.
          </p>
        </div>

        {!isGuru && (
          <button
            id="btn-tambah-program-unggulan"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program / Praktik Baik</span>
          </button>
        )}
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {jenisList.map(j => {
            const isSelected = selectedJenis === j;
            const count = j === 'Semua' 
              ? safeProgramUnggulanList.length 
              : safeProgramUnggulanList.filter(p => p.jenis === j).length;

            return (
              <button
                key={j}
                type="button"
                onClick={() => setSelectedJenis(j)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{j}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-yellow-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
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
            placeholder="Cari program unggulan, inovator, bidang, atau deskripsi kegiatan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {getIcon(item.jenis)}
                  <span>{item.jenis}</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.bidang}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {item.namaProgram}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {item.deskripsi}
              </p>

              {item.dampak && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950">
                  <div className="font-bold text-emerald-900 mb-0.5 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Dampak & Manfaat Positif:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-900">{item.dampak}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Inovator: {item.inovator}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.tanggalPelaksanaan}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.lokasi}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewingItem(item)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Lihat Detail Program"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {item.fotoUrl && (
                  <a
                    href={item.fotoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka Dokumentasi di Google Drive"
                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <HardDrive className="w-4 h-4" />
                  </a>
                )}
                {!isGuru && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Program"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProgramUnggulan(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Viewing Modal for Guru / All Users */}
      {viewingItem && (
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title={`Detail: ${viewingItem.namaProgram}`}
          subtitle={`${viewingItem.jenis} • Bidang ${viewingItem.bidang}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(viewingItem.jenis)}
                <span className="font-bold text-amber-900">{viewingItem.jenis}</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-amber-200">
                Bidang: {viewingItem.bidang}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi & Inovasi Kegiatan</span>
              <p className="mt-1 text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {viewingItem.deskripsi}
              </p>
            </div>

            {viewingItem.dampak && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-700" />
                  <span>Dampak & Manfaat Positif bagi Siswa / Sekolah:</span>
                </div>
                <p className="leading-relaxed text-emerald-900">{viewingItem.dampak}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Inovator / Penggagas:</span>
                <span className="font-bold text-slate-800">{viewingItem.inovator}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tanggal Pelaksanaan:</span>
                <span className="font-bold text-slate-800">{viewingItem.tanggalPelaksanaan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lokasi Kegiatan:</span>
                <span className="font-bold text-slate-800">{viewingItem.lokasi}</span>
              </div>
            </div>

            {viewingItem.fotoUrl && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-blue-900">Dokumentasi Google Drive</div>
                    <div className="text-[11px] text-blue-700">Tersimpan di Cloud Google Drive Sekolah</div>
                  </div>
                </div>
                <a
                  href={viewingItem.fotoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Drive</span>
                </a>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingItem ? 'Edit Program / Praktik Baik' : 'Tambah Program Unggulan & Praktik Baik'}
        subtitle="Dokumentasikan program inovasi dan pembiasaan baik di sekolah"
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori / Jenis</label>
              <select
                value={formData.jenis}
                onChange={e => setFormData({ ...formData, jenis: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="Program Sekolah">Program Sekolah</option>
                <option value="Praktik Baik">Praktik Baik (Best Practice)</option>
                <option value="Dokumentasi">Dokumentasi Kegiatan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bidang Program</label>
              <input
                type="text"
                value={formData.bidang}
                onChange={e => setFormData({ ...formData, bidang: e.target.value })}
                placeholder="Contoh: Karakter & Kearifan Lokal / Literasi"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Program / Praktik Baik</label>
              <input
                type="text"
                value={formData.namaProgram}
                onChange={e => setFormData({ ...formData, namaProgram: e.target.value })}
                placeholder="Contoh: Gerakan Lanto Berbudaya Makassar (Sipakatau, Sipakalebbi, Sipakainge)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi & Langkah Pelaksanaan</label>
              <textarea
                rows={3}
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Jelaskan mekanisme pelaksanaan, sasaran peserta, dan inovasi yang diterapkan..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Dampak & Hasil yang Dirasakan</label>
              <textarea
                rows={2}
                value={formData.dampak}
                onChange={e => setFormData({ ...formData, dampak: e.target.value })}
                placeholder="Perubahan perilaku siswa, prestasi, efisiensi waktu, atau respon wali murid..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Inovator / Penggagas</label>
              <input
                type="text"
                value={formData.inovator}
                onChange={e => setFormData({ ...formData, inovator: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Pelaksanaan</label>
              <input
                type="date"
                value={formData.tanggalPelaksanaan}
                onChange={e => setFormData({ ...formData, tanggalPelaksanaan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Lokasi / Tempat Pelaksanaan</label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={e => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah Dokumentasi / Foto / Laporan ke Google Drive"
                category={`ProgramUnggulan-${formData.jenis}`}
                initialUrl={formData.fotoUrl}
                onUploadSuccess={(url) => {
                  setFormData(prev => ({ ...prev, fotoUrl: url }));
                }}
                helperText="Foto kegiatan dan bukti praktik baik akan tersimpan langsung di folder Google Drive sekolah."
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
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 rounded-lg font-bold"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambah Program'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
