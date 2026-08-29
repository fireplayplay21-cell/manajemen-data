import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { KelasRecord, Siswa } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  School,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Building,
  GraduationCap,
  Layers,
  LayoutGrid,
  List,
  Eye,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BookOpen
} from 'lucide-react';

export const DataKelasSection: React.FC = () => {
  const { kelasList, siswaList, ptkList, addKelas, updateKelas, deleteKelas } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFase, setSelectedFase] = useState<string>('Semua');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<KelasRecord | null>(null);
  const [viewStudentsKelas, setViewStudentsKelas] = useState<KelasRecord | null>(null);

  const [formData, setFormData] = useState<Omit<KelasRecord, 'id'>>({
    namaKelas: '',
    tingkat: '1',
    fase: 'Fase A',
    kurikulum: 'Kurikulum Merdeka',
    waliKelas: '',
    nipWaliKelas: '',
    ruangan: '',
    kapasitas: 30,
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    keterangan: ''
  });

  const handleOpenAdd = () => {
    setEditingKelas(null);
    setFormData({
      namaKelas: '',
      tingkat: '1',
      fase: 'Fase A',
      kurikulum: 'Kurikulum Merdeka',
      waliKelas: ptkList.find(p => p.jabatan.includes('Guru'))?.nama || '',
      nipWaliKelas: ptkList.find(p => p.jabatan.includes('Guru'))?.nip || '',
      ruangan: 'Ruang Kelas',
      kapasitas: 30,
      tahunAjaran: '2024/2025',
      semester: 'Ganjil',
      keterangan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kls: KelasRecord) => {
    setEditingKelas(kls);
    setFormData({
      namaKelas: kls.namaKelas,
      tingkat: kls.tingkat,
      fase: kls.fase,
      kurikulum: kls.kurikulum,
      waliKelas: kls.waliKelas,
      nipWaliKelas: kls.nipWaliKelas,
      ruangan: kls.ruangan,
      kapasitas: kls.kapasitas,
      tahunAjaran: kls.tahunAjaran,
      semester: kls.semester,
      keterangan: kls.keterangan || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKelas) {
      updateKelas(editingKelas.id, formData);
    } else {
      addKelas(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data rombel "${nama}"?`)) {
      deleteKelas(id);
    }
  };

  // Helper to get students of a specific class
  const getStudentsOfClass = (className: string): Siswa[] => {
    return siswaList.filter(s => s.kelas.toLowerCase() === className.toLowerCase());
  };

  // Filtered List
  const filteredKelas = kelasList.filter(kls => {
    const matchesSearch =
      kls.namaKelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kls.waliKelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kls.ruangan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFase =
      selectedFase === 'Semua' || kls.fase === selectedFase;
    const matchesTingkat =
      selectedTingkat === 'Semua' || kls.tingkat === selectedTingkat;
    return matchesSearch && matchesFase && matchesTingkat;
  });

  // Statistics
  const totalRombel = kelasList.length;
  const totalKapasitas = kelasList.reduce((acc, k) => acc + (k.kapasitas || 0), 0);
  const totalFaseA = kelasList.filter(k => k.fase === 'Fase A').length;
  const totalFaseB = kelasList.filter(k => k.fase === 'Fase B').length;
  const totalFaseC = kelasList.filter(k => k.fase === 'Fase C').length;

  return (
    <div id="data-kelas-section" className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Rombel</span>
            <School className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalRombel}</p>
          <span className="text-[11px] text-slate-400">Kelas Aktif</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Kapasitas</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{totalKapasitas}</p>
          <span className="text-[11px] text-slate-400">Kursi Tersedia</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fase A (Kls 1-2)</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{totalFaseA} <span className="text-xs font-normal text-slate-500">Rombel</span></p>
          <span className="text-[11px] text-slate-400">Kurikulum Merdeka</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fase B (Kls 3-4)</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-700 mt-1">{totalFaseB} <span className="text-xs font-normal text-slate-500">Rombel</span></p>
          <span className="text-[11px] text-slate-400">Kurikulum Merdeka</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fase C (Kls 5-6)</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">{totalFaseC} <span className="text-xs font-normal text-slate-500">Rombel</span></p>
          <span className="text-[11px] text-slate-400">Kurikulum Merdeka</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama kelas, nama wali kelas, atau ruangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <span>Tingkat:</span>
              <select
                value={selectedTingkat}
                onChange={(e) => setSelectedTingkat(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Tingkat</option>
                <option value="1">Kelas 1</option>
                <option value="2">Kelas 2</option>
                <option value="3">Kelas 3</option>
                <option value="4">Kelas 4</option>
                <option value="5">Kelas 5</option>
                <option value="6">Kelas 6</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <span>Fase:</span>
              <select
                value={selectedFase}
                onChange={(e) => setSelectedFase(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Fase</option>
                <option value="Fase A">Fase A</option>
                <option value="Fase B">Fase B</option>
                <option value="Fase C">Fase C</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Tampilan Tabel"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleOpenAdd}
              id="btn-tambah-kelas"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKelas.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-xl border border-slate-200/80 text-center text-slate-400">
              <School className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              Tidak ada data rombongan belajar yang sesuai kriteria pencarian.
            </div>
          ) : (
            filteredKelas.map((kls) => {
              const students = getStudentsOfClass(kls.namaKelas);
              const studentCount = students.length;
              const countLaki = students.filter(s => s.jenisKelamin === 'L').length;
              const countPerempuan = students.filter(s => s.jenisKelamin === 'P').length;
              const capacityPercent = Math.min(
                100,
                kls.kapasitas > 0 ? Math.round((studentCount / kls.kapasitas) * 100) : 0
              );

              return (
                <div
                  key={kls.id}
                  className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {kls.tingkat}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">{kls.namaKelas}</h4>
                          <span className="inline-block text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-medium">
                            {kls.fase} • {kls.kurikulum}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(kls)}
                          title="Edit Kelas"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(kls.id, kls.namaKelas)}
                          title="Hapus Kelas"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Wali Kelas & Ruang */}
                    <div className="space-y-1.5 bg-slate-50/70 p-2.5 rounded-lg text-xs border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-slate-800">{kls.waliKelas}</span>
                          {kls.nipWaliKelas && (
                            <span className="block text-[10px] text-slate-400">NIP: {kls.nipWaliKelas}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{kls.ruangan}</span>
                      </div>
                    </div>

                    {/* Student count & capacity */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600 text-[11px]">
                        <span>Jumlah Siswa Terdaftar:</span>
                        <span className="font-bold text-slate-800">
                          {studentCount} / {kls.kapasitas} Siswa
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            capacityPercent > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>L: <strong className="text-blue-600">{countLaki}</strong> | P: <strong className="text-pink-600">{countPerempuan}</strong></span>
                        <span>{kls.tahunAjaran} ({kls.semester})</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setViewStudentsKelas(kls)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Siswa ({studentCount})</span>
                    </button>
                    {kls.keterangan && (
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px]" title={kls.keterangan}>
                        {kls.keterangan}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama Kelas & Tingkat</th>
                  <th className="py-3 px-4">Fase & Kurikulum</th>
                  <th className="py-3 px-4">Wali Kelas</th>
                  <th className="py-3 px-4">Ruangan</th>
                  <th className="py-3 px-4">Jumlah Siswa</th>
                  <th className="py-3 px-4">Tahun Ajaran</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKelas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <School className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      Tidak ada data kelas yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredKelas.map((kls) => {
                    const students = getStudentsOfClass(kls.namaKelas);
                    const studentCount = students.length;

                    return (
                      <tr key={kls.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {kls.tingkat}
                            </span>
                            <span className="font-bold text-slate-800">{kls.namaKelas}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {kls.fase}
                          </span>
                          <p className="text-[10px] text-slate-400">{kls.kurikulum}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-800">{kls.waliKelas}</p>
                          <p className="text-[10px] text-slate-400">{kls.nipWaliKelas || '-'}</p>
                        </td>
                        <td className="py-3 px-4">{kls.ruangan}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setViewStudentsKelas(kls)}
                            className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{studentCount} / {kls.kapasitas} Siswa</span>
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-700">{kls.tahunAjaran}</p>
                          <p className="text-[10px] text-slate-400">Sem. {kls.semester}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(kls)}
                              title="Edit Kelas"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(kls.id, kls.namaKelas)}
                              title="Hapus Kelas"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Kelas */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingKelas ? 'Edit Data Rombel / Kelas' : 'Tambah Rombel / Kelas Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Nama Kelas *</label>
              <input
                type="text"
                required
                value={formData.namaKelas}
                onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: Kelas 1A"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tingkat Kelas *</label>
              <select
                value={formData.tingkat}
                onChange={(e) => {
                  const val = e.target.value;
                  let autoFase: 'Fase A' | 'Fase B' | 'Fase C' = 'Fase A';
                  if (val === '3' || val === '4') autoFase = 'Fase B';
                  if (val === '5' || val === '6') autoFase = 'Fase C';
                  setFormData({ ...formData, tingkat: val, fase: autoFase });
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="1">Tingkat 1</option>
                <option value="2">Tingkat 2</option>
                <option value="3">Tingkat 3</option>
                <option value="4">Tingkat 4</option>
                <option value="5">Tingkat 5</option>
                <option value="6">Tingkat 6</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Fase Pembelajaran</label>
              <select
                value={formData.fase}
                onChange={(e) => setFormData({ ...formData, fase: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="Fase A">Fase A (Kelas 1 - 2)</option>
                <option value="Fase B">Fase B (Kelas 3 - 4)</option>
                <option value="Fase C">Fase C (Kelas 5 - 6)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Kurikulum</label>
              <select
                value={formData.kurikulum}
                onChange={(e) => setFormData({ ...formData, kurikulum: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                <option value="Kurikulum 2013">Kurikulum 2013</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Pilih Wali Kelas (Dari Data PTK)</label>
              <select
                value={formData.waliKelas}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const foundPtk = ptkList.find(p => p.nama === selectedName);
                  setFormData({
                    ...formData,
                    waliKelas: selectedName,
                    nipWaliKelas: foundPtk?.nip || ''
                  });
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="">-- Pilih Guru Wali Kelas --</option>
                {ptkList.map(p => (
                  <option key={p.id} value={p.nama}>
                    {p.nama} ({p.jabatan}) - NIP: {p.nip || 'Non-PNS'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Nama Wali Kelas (Manual / Custom)</label>
              <input
                type="text"
                value={formData.waliKelas}
                onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Nama Lengkap Guru"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">NIP Wali Kelas</label>
              <input
                type="text"
                value={formData.nipWaliKelas}
                onChange={(e) => setFormData({ ...formData, nipWaliKelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="NIP Wali Kelas"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Ruangan / Gedung</label>
              <input
                type="text"
                value={formData.ruangan}
                onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Ruang 1.1 (Gedung A Lt. 1)"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Kapasitas Maksimal Siswa</label>
              <input
                type="number"
                value={formData.kapasitas}
                onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={formData.tahunAjaran}
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="2024/2025"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Keterangan Tambahan</label>
              <input
                type="text"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: Rombel shift pagi"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs font-semibold shadow-xs"
            >
              {editingKelas ? 'Simpan Perubahan' : 'Tambah Kelas'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Daftar Siswa per Kelas */}
      {viewStudentsKelas && (
        <Modal
          isOpen={!!viewStudentsKelas}
          onClose={() => setViewStudentsKelas(null)}
          title={`Daftar Peserta Didik: ${viewStudentsKelas.namaKelas}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-emerald-50/80 p-3 rounded-lg border border-emerald-100">
              <div>
                <p className="font-bold text-slate-800 text-sm">{viewStudentsKelas.namaKelas}</p>
                <p className="text-slate-600">Wali Kelas: {viewStudentsKelas.waliKelas}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800">
                  {getStudentsOfClass(viewStudentsKelas.namaKelas).length} Siswa Terdaftar
                </span>
                <p className="text-[10px] text-slate-400">Kapasitas: {viewStudentsKelas.kapasitas} Kursi</p>
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">No</th>
                    <th className="py-2 px-3">Nama Siswa</th>
                    <th className="py-2 px-3">NISN / NIS</th>
                    <th className="py-2 px-3">L/P</th>
                    <th className="py-2 px-3">Nama Orang Tua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {getStudentsOfClass(viewStudentsKelas.namaKelas).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Belum ada siswa yang dimasukkan ke {viewStudentsKelas.namaKelas}.
                      </td>
                    </tr>
                  ) : (
                    getStudentsOfClass(viewStudentsKelas.namaKelas).map((siswa, idx) => (
                      <tr key={siswa.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{siswa.nama}</td>
                        <td className="py-2 px-3 text-slate-500">{siswa.nisn}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              siswa.jenisKelamin === 'L'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-pink-50 text-pink-700'
                            }`}
                          >
                            {siswa.jenisKelamin}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">{siswa.namaOrtu || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewStudentsKelas(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium"
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
