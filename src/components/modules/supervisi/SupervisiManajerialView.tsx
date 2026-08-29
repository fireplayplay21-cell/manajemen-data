import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SupervisiManajerial } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle,
  Edit,
  Trash2,
  AlertTriangle,
  FileCheck,
  Eye
} from 'lucide-react';

export const SupervisiManajerialView: React.FC = () => {
  const {
    supervisiManajerialList,
    addSupervisiManajerial,
    updateSupervisiManajerial,
    deleteSupervisiManajerial,
    currentUser
  } = useApp();

  const isGuru = currentUser.role === 'guru';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupervisiManajerial | null>(null);
  const [viewingItem, setViewingItem] = useState<SupervisiManajerial | null>(null);

  const [formData, setFormData] = useState<Omit<SupervisiManajerial, 'id'>>({
    aspekStandar: 'Standar Pengelolaan',
    instrumen: 'Instrumen Evaluasi Diri & Pengawasan 8 SNP',
    tanggalPemantauan: new Date().toISOString().split('T')[0],
    petugasPemantau: 'Pengawas Bina Kec. Mamajang Disdik Makassar',
    hasilTemuan: 'Dokumen KSP dan tata kelola administrasi tersusun rapi.',
    evaluasiProgram: 'Pelaksanaan program tahunan berjalan tepat waktu 95%.',
    rekomendasiTindakLanjut: 'Pertahankan sistem arsip digital terpadu dan perbarui SOP layanan.',
    status: 'Sesuai Standar'
  });

  const safeSupervisiManajerialList = supervisiManajerialList || [];

  const filteredList = safeSupervisiManajerialList.filter(s => {
    const matchStatus = selectedStatus === 'Semua' || s.status === selectedStatus;
    const matchSearch =
      (s.aspekStandar || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.petugasPemantau || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.hasilTemuan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.rekomendasiTindakLanjut || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      aspekStandar: 'Standar Pengelolaan',
      instrumen: 'Instrumen 8 Standar Nasional Pendidikan',
      tanggalPemantauan: new Date().toISOString().split('T')[0],
      petugasPemantau: 'Pengawas Bina Disdik Makassar',
      hasilTemuan: '',
      evaluasiProgram: '',
      rekomendasiTindakLanjut: '',
      status: 'Sesuai Standar'
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: SupervisiManajerial) => {
    setEditingItem(item);
    setFormData({
      aspekStandar: item.aspekStandar,
      instrumen: item.instrumen,
      tanggalPemantauan: item.tanggalPemantauan,
      petugasPemantau: item.petugasPemantau,
      hasilTemuan: item.hasilTemuan,
      evaluasiProgram: item.evaluasiProgram,
      rekomendasiTindakLanjut: item.rekomendasiTindakLanjut,
      status: item.status
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateSupervisiManajerial(editingItem.id, formData);
    } else {
      addSupervisiManajerial(formData);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Manajemen Supervisi • Modul 2</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Supervisi Manajerial Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pemantauan 8 Standar Nasional Pendidikan (SNP), instrumen tata kelola, evaluasi program, dan rekomendasi tindak lanjut bersama Pengawas Sekolah.
          </p>
        </div>

        {!isGuru && (
          <button
            id="btn-tambah-supervisi-manajerial"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Supervisi Manajerial</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aspek standar SNP, pengawas, atau hasil temuan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
        >
          <option value="Semua">Semua Status</option>
          <option value="Sesuai Standar">Sesuai Standar</option>
          <option value="Perlu Perbaikan">Perlu Perbaikan</option>
          <option value="Kritis">Kritis</option>
        </select>
      </div>

      {/* Grid Manajerial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {item.aspekStandar}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Sesuai Standar'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Perlu Perbaikan'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.aspekStandar}
              </h3>

              <div className="text-xs text-slate-500 mt-1">
                Instrumen: <span className="font-semibold text-slate-700">{item.instrumen}</span>
              </div>

              <div className="space-y-2 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-slate-800 mb-1">Hasil Pemantauan & Temuan:</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{item.hasilTemuan}</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950">
                  <div className="font-bold text-amber-900 mb-1">Evaluasi Program:</div>
                  <p className="text-amber-900 leading-relaxed text-[11px]">{item.evaluasiProgram}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                  <div className="font-bold text-emerald-900 mb-1">Rekomendasi Tindak Lanjut:</div>
                  <p className="text-emerald-900 leading-relaxed text-[11px]">{item.rekomendasiTindakLanjut}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                <div className="text-[11px] font-medium text-slate-700">
                  Tanggal: {item.tanggalPemantauan}
                </div>
                <div className="text-[10px] text-slate-400">Petugas: {item.petugasPemantau}</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewingItem(item)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Lihat Detail Supervisi Manajerial"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {!isGuru && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Manajerial"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSupervisiManajerial(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Manajerial"
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
          title={`Detail Supervisi: ${viewingItem.aspekStandar}`}
          subtitle={`Instrumen: ${viewingItem.instrumen}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div>
                <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">Standar SNP</span>
                <span className="text-sm font-bold text-blue-950">{viewingItem.aspekStandar}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  viewingItem.status === 'Sesuai Standar'
                    ? 'bg-emerald-600 text-white'
                    : viewingItem.status === 'Perlu Perbaikan'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {viewingItem.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Petugas / Pengawas Pemantau:</span>
                <span className="font-bold text-slate-800">{viewingItem.petugasPemantau}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tanggal Pemantauan:</span>
                <span className="font-bold text-slate-800">{viewingItem.tanggalPemantauan}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Hasil Pemantauan & Temuan Lapangan:</span>
              </div>
              <p className="leading-relaxed text-slate-700">{viewingItem.hasilTemuan}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Evaluasi Keterlaksanaan Program:</span>
              </div>
              <p className="leading-relaxed text-amber-900">{viewingItem.evaluasiProgram}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Rekomendasi Tindak Lanjut:</span>
              </div>
              <p className="leading-relaxed text-emerald-900">{viewingItem.rekomendasiTindakLanjut}</p>
            </div>

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
        title={editingItem ? 'Edit Supervisi Manajerial' : 'Tambah Supervisi Manajerial'}
        subtitle="Entri pemantauan tata kelola sekolah, evaluasi, dan rekomendasi"
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standar SNP</label>
              <select
                value={formData.aspekStandar}
                onChange={e => setFormData({ ...formData, aspekStandar: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Standar Pengelolaan">Standar Pengelolaan</option>
                <option value="Standar Isi">Standar Isi</option>
                <option value="Standar Proses">Standar Proses</option>
                <option value="Standar Kelulusan">Standar Kelulusan</option>
                <option value="Standar PTK">Standar PTK</option>
                <option value="Standar Sarpras">Standar Sarpras</option>
                <option value="Standar Pembiayaan">Standar Pembiayaan</option>
                <option value="Standar Penilaian">Standar Penilaian</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instrumen yang Digunakan</label>
              <input
                type="text"
                value={formData.instrumen}
                onChange={e => setFormData({ ...formData, instrumen: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Petugas / Pengawas</label>
              <input
                type="text"
                value={formData.petugasPemantau}
                onChange={e => setFormData({ ...formData, petugasPemantau: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Pemantauan</label>
              <input
                type="date"
                value={formData.tanggalPemantauan}
                onChange={e => setFormData({ ...formData, tanggalPemantauan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Hasil Pemantauan & Temuan Lapangan</label>
              <textarea
                rows={2}
                value={formData.hasilTemuan}
                onChange={e => setFormData({ ...formData, hasilTemuan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Evaluasi Program</label>
              <textarea
                rows={2}
                value={formData.evaluasiProgram}
                onChange={e => setFormData({ ...formData, evaluasiProgram: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Rekomendasi Tindak Lanjut</label>
              <textarea
                rows={2}
                value={formData.rekomendasiTindakLanjut}
                onChange={e => setFormData({ ...formData, rekomendasiTindakLanjut: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Ketercapaian</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Sesuai Standar">Sesuai Standar</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                <option value="Kritis">Kritis</option>
              </select>
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
              {editingItem ? 'Simpan Perubahan' : 'Simpan Supervisi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
