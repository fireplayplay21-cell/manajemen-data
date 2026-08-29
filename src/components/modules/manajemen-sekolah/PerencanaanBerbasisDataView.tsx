import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { IndikatorRaporPendidikan } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  FileSpreadsheet,
  Edit,
  Trash2,
  Eye,
  Check
} from 'lucide-react';

export const PerencanaanBerbasisDataView: React.FC = () => {
  const {
    pbdList,
    addPBD,
    updatePBD,
    deletePBD,
    currentUser
  } = useApp();

  const [selectedDimensi, setSelectedDimensi] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IndikatorRaporPendidikan | null>(null);
  const [viewingItem, setViewingItem] = useState<IndikatorRaporPendidikan | null>(null);

  const [formData, setFormData] = useState<Omit<IndikatorRaporPendidikan, 'id'>>({
    kode: 'A.1',
    indikator: '',
    dimensi: 'A',
    skorTahunIni: 80,
    skorTahunLalu: 75,
    capaian: 'Baik',
    identifikasiMasalah: '',
    akarMasalah: '',
    programIntervensi: '',
    targetPerbaikan: '',
    tindakLanjut: '',
    penanggungJawab: '',
    statusTindakLanjut: 'Sedang Berjalan'
  });

  const dimensiList = [
    { key: 'Semua', label: 'Semua Indikator' },
    { key: 'A', label: 'Dimensi A: Mutu Hasil Belajar (Literasi, Numerasi, Karakter)' },
    { key: 'D', label: 'Dimensi D: Kualitas Proses Pembelajaran & Iklim Keamanan' },
    { key: 'E', label: 'Dimensi E: Kompetensi & Pengelolaan Sekolah' }
  ];

  const safePbdList = pbdList || [];

  const filteredList = safePbdList.filter(item => {
    const matchDimensi = selectedDimensi === 'Semua' || item.dimensi === selectedDimensi;
    const matchSearch =
      (item.indikator || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.akarMasalah || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.programIntervensi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.penanggungJawab || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchDimensi && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      kode: 'A.' + (safePbdList.length + 1),
      indikator: '',
      dimensi: 'A',
      skorTahunIni: 80,
      skorTahunLalu: 75,
      capaian: 'Baik',
      identifikasiMasalah: '',
      akarMasalah: '',
      programIntervensi: '',
      targetPerbaikan: '',
      tindakLanjut: '',
      penanggungJawab: currentUser.nama,
      statusTindakLanjut: 'Sedang Berjalan'
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: IndikatorRaporPendidikan) => {
    setEditingItem(item);
    setFormData({
      kode: item.kode,
      indikator: item.indikator,
      dimensi: item.dimensi,
      skorTahunIni: item.skorTahunIni,
      skorTahunLalu: item.skorTahunLalu,
      capaian: item.capaian,
      identifikasiMasalah: item.identifikasiMasalah,
      akarMasalah: item.akarMasalah,
      programIntervensi: item.programIntervensi,
      targetPerbaikan: item.targetPerbaikan,
      tindakLanjut: item.tindakLanjut,
      penanggungJawab: item.penanggungJawab,
      statusTindakLanjut: item.statusTindakLanjut
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updatePBD(editingItem.id, formData);
    } else {
      addPBD(formData);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manajemen Sekolah • Modul 2</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Perencanaan Berbasis Data (PBD)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Siklus peningkatan mutu berkelanjutan: <strong>1. Rapo Pendidikan</strong> → <strong>2. Identifikasi Masalah</strong> → <strong>3. Analisis Akar Masalah</strong> → <strong>4. Program Intervensi</strong> → <strong>5. Target & Tindak Lanjut</strong>.
          </p>
        </div>

        <button
          id="btn-tambah-pbd"
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Indikator & Rencana PBD</span>
        </button>
      </div>

      {/* 5-Step PBD Infographic Card */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-5 text-white shadow-md">
        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-3">
          Alur Kerja Perencanaan Berbasis Data (PBD Kemendikbudristek)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <div className="font-bold text-blue-300 mb-1">1. Rapo Pendidikan</div>
            <p className="text-[11px] text-slate-300">Melihat capaian indikator ANBK, SPM, dan iklim keamanan sekolah.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <div className="font-bold text-amber-300 mb-1">2. Identifikasi Masalah</div>
            <p className="text-[11px] text-slate-300">Menemukan indikator capaian yang masih rendah atau perlu peningkatan.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <div className="font-bold text-rose-300 mb-1">3. Analisis Akar Masalah</div>
            <p className="text-[11px] text-slate-300">Mencari penyebab utama dari faktor guru, sarana, atau metode belajar.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <div className="font-bold text-cyan-300 mb-1">4. Program Intervensi</div>
            <p className="text-[11px] text-slate-300">Merumuskan program konkret "Benahi" ke dalam dokumen KSP & RKAS.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">
            <div className="font-bold text-emerald-300 mb-1">5. Target & Tindak Lanjut</div>
            <p className="text-[11px] text-slate-300">Menentukan sasaran kuantitatif, penanggung jawab, dan timeline evaluasi.</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {dimensiList.map(dim => (
            <button
              key={dim.key}
              type="button"
              onClick={() => setSelectedDimensi(dim.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedDimensi === dim.key
                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dim.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari indikator, akar masalah, atau program intervensi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* PBD Items List */}
      <div className="space-y-4">
        {filteredList.map(item => {
          const delta = (item.skorTahunIni - item.skorTahunLalu).toFixed(1);
          const isUp = parseFloat(delta) >= 0;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all space-y-4"
            >
              {/* Header Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0">
                    {item.kode}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.indikator}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      Dimensi {item.dimensi} • Penanggung Jawab: <span className="font-semibold text-slate-700">{item.penanggungJawab}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">
                      Skor: <span className="text-emerald-700 text-base">{item.skorTahunIni}</span>
                    </div>
                    <div className="text-[10px] flex items-center gap-1 justify-end">
                      <span className="text-slate-400">Lalu: {item.skorTahunLalu}</span>
                      <span className={`font-semibold flex items-center ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isUp ? `+${delta}` : delta}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {item.capaian}
                  </span>
                </div>
              </div>

              {/* 4 Core Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Identifikasi */}
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                  <div className="font-bold text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <span>1. Identifikasi Masalah</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {item.identifikasiMasalah}
                  </p>
                </div>

                {/* 2. Akar Masalah */}
                <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 space-y-1">
                  <div className="font-bold text-rose-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <span>2. Analisis Akar Masalah</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {item.akarMasalah}
                  </p>
                </div>

                {/* 3. Program Intervensi */}
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 space-y-1">
                  <div className="font-bold text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <span>3. Program Intervensi (Benahi)</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {item.programIntervensi}
                  </p>
                </div>

                {/* 4. Target & Tindak Lanjut */}
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1">
                  <div className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <span>4. Target & Tindak Lanjut</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    <span className="font-semibold text-emerald-800">Target:</span> {item.targetPerbaikan}
                  </p>
                  <p className="text-slate-600 text-[10px] leading-relaxed mt-1">
                    <span className="font-semibold">Aksi:</span> {item.tindakLanjut}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Status Aksi:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {item.statusTindakLanjut}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Rencana</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePBD(item.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit PBD Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingItem ? 'Edit Perencanaan Berbasis Data' : 'Tambah Perencanaan Berbasis Data (PBD)'}
        subtitle="Rumuskan identifikasi, akar masalah, dan program intervensi berbasis Rapor Pendidikan"
        maxWidth="3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Indikator</label>
              <input
                type="text"
                value={formData.kode}
                onChange={e => setFormData({ ...formData, kode: e.target.value })}
                placeholder="Contoh: A.1 / A.2 / D.1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Indikator Rapor Pendidikan</label>
              <input
                type="text"
                value={formData.indikator}
                onChange={e => setFormData({ ...formData, indikator: e.target.value })}
                placeholder="Contoh: Kemampuan Literasi Membaca Peserta Didik"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dimensi</label>
              <select
                value={formData.dimensi}
                onChange={e => setFormData({ ...formData, dimensi: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="A">Dimensi A (Hasil Belajar)</option>
                <option value="C">Dimensi C (Kompetensi PTK)</option>
                <option value="D">Dimensi D (Proses Pembelajaran)</option>
                <option value="E">Dimensi E (Pengelolaan Sekolah)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skor Tahun Ini</label>
              <input
                type="number"
                step="0.1"
                value={formData.skorTahunIni}
                onChange={e => setFormData({ ...formData, skorTahunIni: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skor Tahun Lalu</label>
              <input
                type="number"
                step="0.1"
                value={formData.skorTahunLalu}
                onChange={e => setFormData({ ...formData, skorTahunLalu: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">1. Identifikasi Masalah (Kondisi Nyata)</label>
              <textarea
                rows={2}
                value={formData.identifikasiMasalah}
                onChange={e => setFormData({ ...formData, identifikasiMasalah: e.target.value })}
                placeholder="Jelaskan kendala atau kesenjangan yang terjadi pada rapor pendidikan..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">2. Analisis Akar Masalah</label>
              <textarea
                rows={2}
                value={formData.akarMasalah}
                onChange={e => setFormData({ ...formData, akarMasalah: e.target.value })}
                placeholder="Faktor apa yang menjadi penyebab utama (metode ajar, bahan bacaan, alat peraga, dll)?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">3. Program Intervensi (Kegiatan Benahi)</label>
              <textarea
                rows={2}
                value={formData.programIntervensi}
                onChange={e => setFormData({ ...formData, programIntervensi: e.target.value })}
                placeholder="Program intervensi spesifik yang akan dimasukkan ke KSP dan RKAS..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">4. Target Perbaikan</label>
              <input
                type="text"
                value={formData.targetPerbaikan}
                onChange={e => setFormData({ ...formData, targetPerbaikan: e.target.value })}
                placeholder="Contoh: Skor numerasi > 85.0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab</label>
              <input
                type="text"
                value={formData.penanggungJawab}
                onChange={e => setFormData({ ...formData, penanggungJawab: e.target.value })}
                placeholder="Contoh: Tim Literasi & Guru Kelas 1-3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Tindak Lanjut</label>
              <select
                value={formData.statusTindakLanjut}
                onChange={e => setFormData({ ...formData, statusTindakLanjut: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Belum Dimulai">Belum Dimulai</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">5. Rincian Tindak Lanjut & Monitoring</label>
              <input
                type="text"
                value={formData.tindakLanjut}
                onChange={e => setFormData({ ...formData, tindakLanjut: e.target.value })}
                placeholder="Aksi konkret seperti pengadaan buku, workshop guru, pendampingan rutin..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambah Rencana PBD'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
