import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Siswa } from '../../../types';
import { Modal } from '../../common/Modal';
import { UploadMassalSiswaModal } from './UploadMassalSiswaModal';
import {
  GraduationCap,
  Users,
  Search,
  Plus,
  Upload,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Filter,
  CheckCircle2,
  UserCheck,
  UserX,
  School,
  FileSpreadsheet
} from 'lucide-react';

export const DataSiswaSection: React.FC = () => {
  const { siswaList, kelasList, addSiswa, bulkAddSiswa, updateSiswa, deleteSiswa } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

  const [formData, setFormData] = useState<Omit<Siswa, 'id'>>({
    nisn: '',
    nis: '',
    nama: '',
    kelas: 'Kelas 1A',
    jenisKelamin: 'L',
    tempatLahir: 'Makassar',
    tanggalLahir: '2017-01-01',
    namaOrtu: '',
    teleponOrtu: '',
    alamat: '',
    status: 'Aktif'
  });

  // Extract unique class list from either kelasList or siswaList
  const classOptions = Array.from(
    new Set([
      ...kelasList.map(k => k.namaKelas),
      ...siswaList.map(s => s.kelas)
    ])
  ).sort();

  const handleOpenAdd = () => {
    setEditingSiswa(null);
    setFormData({
      nisn: '',
      nis: '',
      nama: '',
      kelas: classOptions[0] || 'Kelas 1A',
      jenisKelamin: 'L',
      tempatLahir: 'Makassar',
      tanggalLahir: '2017-01-01',
      namaOrtu: '',
      teleponOrtu: '',
      alamat: '',
      status: 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setFormData({
      nisn: siswa.nisn,
      nis: siswa.nis,
      nama: siswa.nama,
      kelas: siswa.kelas,
      jenisKelamin: siswa.jenisKelamin,
      tempatLahir: siswa.tempatLahir,
      tanggalLahir: siswa.tanggalLahir,
      namaOrtu: siswa.namaOrtu,
      teleponOrtu: siswa.teleponOrtu,
      alamat: siswa.alamat,
      status: siswa.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSiswa) {
      updateSiswa(editingSiswa.id, formData);
    } else {
      addSiswa(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data peserta didik "${nama}"?`)) {
      deleteSiswa(id);
    }
  };

  const handleViewDetail = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setIsDetailModalOpen(true);
  };

  // Filtered List
  const filteredSiswa = siswaList.filter(s => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.namaOrtu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKelas =
      selectedKelas === 'Semua' || s.kelas === selectedKelas;
    const matchesGender =
      selectedGender === 'Semua' || s.jenisKelamin === selectedGender;
    const matchesStatus =
      selectedStatus === 'Semua' || s.status === selectedStatus;

    return matchesSearch && matchesKelas && matchesGender && matchesStatus;
  });

  // Statistics
  const totalSiswa = siswaList.length;
  const totalLaki = siswaList.filter(s => s.jenisKelamin === 'L').length;
  const totalPerempuan = siswaList.filter(s => s.jenisKelamin === 'P').length;
  const totalAktif = siswaList.filter(s => s.status === 'Aktif').length;
  const totalPindahLulus = siswaList.filter(s => s.status !== 'Aktif').length;

  return (
    <div id="data-siswa-section" className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Siswa</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalSiswa}</p>
          <span className="text-[11px] text-slate-400">Terdata di Sistem</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Laki-Laki (L)</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{totalLaki}</p>
          <span className="text-[11px] text-slate-400">
            {totalSiswa > 0 ? `${Math.round((totalLaki / totalSiswa) * 100)}% dari total` : '-'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Perempuan (P)</span>
            <Users className="w-4 h-4 text-pink-600" />
          </div>
          <p className="text-2xl font-bold text-pink-700 mt-1">{totalPerempuan}</p>
          <span className="text-[11px] text-slate-400">
            {totalSiswa > 0 ? `${Math.round((totalPerempuan / totalSiswa) * 100)}% dari total` : '-'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Status Aktif</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{totalAktif}</p>
          <span className="text-[11px] text-slate-400">Siswa Aktif Belajar</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pindah / Lulus</span>
            <UserX className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-slate-700 mt-1">{totalPindahLulus}</p>
          <span className="text-[11px] text-slate-400">Mutasi / Alumni</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, NIS, nama orang tua, atau alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <School className="w-3.5 h-3.5" />
              <span>Kelas:</span>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Kelas</option>
                {classOptions.map((kls) => (
                  <option key={kls} value={kls}>{kls}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <span>Gender:</span>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua (L/P)</option>
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Pindah">Pindah</option>
                <option value="Lulus">Lulus</option>
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                id="btn-upload-massal-siswa"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
                title="Unggah banyak data siswa sekaligus via CSV/Excel atau Salin-Tempel"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Massal</span>
              </button>

              <button
                onClick={handleOpenAdd}
                id="btn-tambah-siswa"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Siswa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Siswa Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Tempat, Tanggal Lahir</th>
                <th className="py-3 px-4">Orang Tua & Kontak</th>
                <th className="py-3 px-4">Alamat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Tidak ada data peserta didik yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            siswa.jenisKelamin === 'L'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-pink-100 text-pink-700'
                          }`}
                        >
                          {siswa.nama.charAt(0)}
                        </div>
                        <div>
                          <button
                            onClick={() => handleViewDetail(siswa)}
                            className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors text-left"
                          >
                            {siswa.nama}
                          </button>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span>NISN: {siswa.nisn || '-'}</span>
                            <span>•</span>
                            <span>NIS: {siswa.nis || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                        {siswa.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                          siswa.jenisKelamin === 'L'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-pink-50 text-pink-700'
                        }`}
                      >
                        {siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-800 font-medium">{siswa.tempatLahir}</p>
                      <p className="text-[11px] text-slate-400">{siswa.tanggalLahir}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{siswa.namaOrtu || '-'}</p>
                      {siswa.teleponOrtu && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{siswa.teleponOrtu}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-[180px]">
                      <p className="truncate text-slate-600 text-[11px]" title={siswa.alamat}>
                        {siswa.alamat || '-'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          siswa.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : siswa.status === 'Pindah'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {siswa.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(siswa)}
                          title="Edit Siswa"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(siswa.id, siswa.nama)}
                          title="Hapus Siswa"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Siswa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSiswa ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: Muhammad Raihan Pratama"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">NISN (10 Digit) *</label>
              <input
                type="text"
                required
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="0145678910"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">NIS Sekolah</label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="2401"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Rombel / Kelas *</label>
              <select
                required
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                {classOptions.map((kls) => (
                  <option key={kls} value={kls}>{kls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Jenis Kelamin *</label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={formData.tempatLahir}
                onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Makassar"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={formData.namaOrtu}
                onChange={(e) => setFormData({ ...formData, namaOrtu: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Nama Ayah/Ibu"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Nomor Telepon / WA Ortu</label>
              <input
                type="text"
                value={formData.teleponOrtu}
                onChange={(e) => setFormData({ ...formData, teleponOrtu: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="08123456789"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Status Keaktifan</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pindah">Pindah / Mutasi</option>
                <option value="Lulus">Lulus</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Alamat Domisili Siswa</label>
              <textarea
                rows={2}
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Jl. Lanto Dg. Pasewang No. ..."
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
              {editingSiswa ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail Siswa */}
      {selectedSiswa && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Biodata Siswa: ${selectedSiswa.nama}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${
                  selectedSiswa.jenisKelamin === 'L' ? 'bg-blue-600' : 'bg-pink-600'
                }`}
              >
                {selectedSiswa.nama.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{selectedSiswa.nama}</h4>
                <p className="text-slate-600">{selectedSiswa.kelas} • NISN: {selectedSiswa.nisn}</p>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    selectedSiswa.status === 'Aktif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Status: {selectedSiswa.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
              <div>
                <span className="text-[11px] text-slate-400">NIS</span>
                <p className="font-semibold text-slate-800">{selectedSiswa.nis || '-'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Jenis Kelamin</span>
                <p className="font-semibold text-slate-800">
                  {selectedSiswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Tempat, Tanggal Lahir</span>
                <p className="font-semibold text-slate-800">
                  {selectedSiswa.tempatLahir}, {selectedSiswa.tanggalLahir}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Orang Tua / Wali</span>
                <p className="font-semibold text-slate-800">{selectedSiswa.namaOrtu || '-'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Telepon Ortu: {selectedSiswa.teleponOrtu || 'Tidak ada nomor telepon'}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                <span>Alamat: {selectedSiswa.alamat || 'Alamat belum diinput'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Massal Siswa Modal */}
      <UploadMassalSiswaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(newStudents) => {
          bulkAddSiswa(newStudents);
        }}
        existingSiswa={siswaList}
        availableClasses={classOptions}
      />
    </div>
  );
};
