import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PTKRecord } from '../../../types';
import { Modal } from '../../common/Modal';
import { DriveFileUpload } from '../../common/DriveFileUpload';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Award,
  Filter,
  HardDrive,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const PTKSection: React.FC = () => {
  const { ptkList, addPTK, updatePTK, deletePTK } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterJabatan, setFilterJabatan] = useState<string>('Semua');

  // Modal State
  const [isPTKModalOpen, setIsPTKModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPTK, setSelectedPTK] = useState<PTKRecord | null>(null);
  const [editingPTK, setEditingPTK] = useState<PTKRecord | null>(null);

  const [ptkFormData, setPTKFormData] = useState<Omit<PTKRecord, 'id'>>({
    nama: '',
    nip: '',
    nuptk: '',
    jenisKelamin: 'P',
    pangkatGolongan: 'Penata Muda / III-a',
    jabatan: 'Guru Kelas',
    tugasTambahan: '-',
    pendidikanTerakhir: 'S1 PGSD',
    statusKepegawaian: 'PNS',
    sertifikasi: 'Sudah Sertifikasi',
    email: '',
    telepon: ''
  });

  const handleOpenAddPTK = () => {
    setEditingPTK(null);
    setPTKFormData({
      nama: '',
      nip: '',
      nuptk: '',
      jenisKelamin: 'P',
      pangkatGolongan: 'Penata Muda / III-a',
      jabatan: 'Guru Kelas',
      tugasTambahan: '-',
      pendidikanTerakhir: 'S1 PGSD',
      statusKepegawaian: 'PNS',
      sertifikasi: 'Sudah Sertifikasi',
      email: '',
      telepon: ''
    });
    setIsPTKModalOpen(true);
  };

  const handleOpenEditPTK = (ptk: PTKRecord) => {
    setEditingPTK(ptk);
    setPTKFormData({
      nama: ptk.nama,
      nip: ptk.nip,
      nuptk: ptk.nuptk,
      jenisKelamin: ptk.jenisKelamin,
      pangkatGolongan: ptk.pangkatGolongan,
      jabatan: ptk.jabatan,
      tugasTambahan: ptk.tugasTambahan,
      pendidikanTerakhir: ptk.pendidikanTerakhir,
      statusKepegawaian: ptk.statusKepegawaian,
      sertifikasi: ptk.sertifikasi,
      email: ptk.email,
      telepon: ptk.telepon,
      berkasSK: ptk.berkasSK
    });
    setIsPTKModalOpen(true);
  };

  const handleSavePTK = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPTK) {
      updatePTK(editingPTK.id, ptkFormData);
    } else {
      addPTK(ptkFormData);
    }
    setIsPTKModalOpen(false);
  };

  const handleDeletePTK = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data PTK "${nama}"?`)) {
      deletePTK(id);
    }
  };

  const handleViewDetail = (ptk: PTKRecord) => {
    setSelectedPTK(ptk);
    setIsDetailModalOpen(true);
  };

  // Filtered List
  const filteredPTK = ptkList.filter(ptk => {
    const matchesSearch =
      ptk.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ptk.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ptk.nuptk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ptk.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'Semua' || ptk.statusKepegawaian === filterStatus;
    const matchesJabatan =
      filterJabatan === 'Semua' || ptk.jabatan === filterJabatan;
    return matchesSearch && matchesStatus && matchesJabatan;
  });

  // Statistics
  const totalPTK = ptkList.length;
  const totalPNS = ptkList.filter(p => p.statusKepegawaian === 'PNS').length;
  const totalPPPK = ptkList.filter(p => p.statusKepegawaian === 'PPPK').length;
  const totalHonorer = ptkList.filter(p => p.statusKepegawaian === 'Honorer' || p.statusKepegawaian === 'GTT/PTT').length;
  const totalSertifikasi = ptkList.filter(p => p.sertifikasi === 'Sudah Sertifikasi').length;
  const totalLaki = ptkList.filter(p => p.jenisKelamin === 'L').length;
  const totalPerempuan = ptkList.filter(p => p.jenisKelamin === 'P').length;

  return (
    <div id="ptk-management-section" className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total PTK</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalPTK}</p>
          <span className="text-[11px] text-slate-400">Guru & Tendik</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">PNS</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{totalPNS}</p>
          <span className="text-[11px] text-slate-400">Aparatur Sipil</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">PPPK</span>
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-700 mt-1">{totalPPPK}</p>
          <span className="text-[11px] text-slate-400">Perjanjian Kerja</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Honorer/GTT</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{totalHonorer}</p>
          <span className="text-[11px] text-slate-400">Tenaga Kontrak</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sertifikasi</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{totalSertifikasi}</p>
          <span className="text-[11px] text-slate-400">Pendidik Profesi</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Gender (L/P)</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">{totalLaki} / {totalPerempuan}</p>
          <span className="text-[11px] text-slate-400">Laki / Perempuan</span>
        </div>
      </div>

      {/* Action & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama guru, NIP, NUPTK, atau jabatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="Honorer">Honorer</option>
                <option value="GTT/PTT">GTT/PTT</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <span>Jabatan:</span>
              <select
                value={filterJabatan}
                onChange={(e) => setFilterJabatan(e.target.value)}
                className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Jabatan</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Guru Kelas">Guru Kelas</option>
                <option value="Guru PJOK">Guru PJOK</option>
                <option value="Guru PAI">Guru PAI</option>
                <option value="Tenaga Administrasi">Tenaga Administrasi</option>
                <option value="Operator Sekolah">Operator Sekolah</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddPTK}
              id="btn-tambah-ptk"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah PTK</span>
            </button>
          </div>
        </div>
      </div>

      {/* PTK Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">Jabatan & Tugas</th>
                <th className="py-3 px-4">Status & Golongan</th>
                <th className="py-3 px-4">Pendidikan</th>
                <th className="py-3 px-4">Sertifikasi</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPTK.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Tidak ada data PTK yang sesuai pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredPTK.map((ptk) => (
                  <tr key={ptk.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {ptk.nama.charAt(0)}
                        </div>
                        <div>
                          <button
                            onClick={() => handleViewDetail(ptk)}
                            className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors text-left"
                          >
                            {ptk.nama}
                          </button>
                          <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-2">
                            <span>NIP: {ptk.nip || '-'}</span>
                            <span>•</span>
                            <span>NUPTK: {ptk.nuptk || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{ptk.jabatan}</p>
                      <p className="text-[11px] text-slate-500">Tugas: {ptk.tugasTambahan}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center w-max px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ptk.statusKepegawaian === 'PNS'
                              ? 'bg-blue-100 text-blue-800'
                              : ptk.statusKepegawaian === 'PPPK'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ptk.statusKepegawaian}
                        </span>
                        <span className="text-[11px] text-slate-500">{ptk.pangkatGolongan}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ptk.pendidikanTerakhir}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {ptk.sertifikasi === 'Sudah Sertifikasi' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Tersertifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          Belum Sertifikasi
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {ptk.telepon && (
                          <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{ptk.telepon}</span>
                          </div>
                        )}
                        {ptk.email && (
                          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[120px]">{ptk.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditPTK(ptk)}
                          title="Edit PTK"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePTK(ptk.id, ptk.nama)}
                          title="Hapus PTK"
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

      {/* Modal Add / Edit PTK */}
      <Modal
        isOpen={isPTKModalOpen}
        onClose={() => setIsPTKModalOpen(false)}
        title={editingPTK ? 'Edit Data PTK' : 'Tambah Data PTK Baru'}
      >
        <form onSubmit={handleSavePTK} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                value={ptkFormData.nama}
                onChange={(e) => setPTKFormData({ ...ptkFormData, nama: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: Dra. Hj. Maryam, M.Pd."
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">NIP (Kosongkan jika bukan PNS/PPPK)</label>
              <input
                type="text"
                value={ptkFormData.nip}
                onChange={(e) => setPTKFormData({ ...ptkFormData, nip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="19700101 199503 1 001"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">NUPTK</label>
              <input
                type="text"
                value={ptkFormData.nuptk}
                onChange={(e) => setPTKFormData({ ...ptkFormData, nuptk: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="16 digit NUPTK"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Jenis Kelamin</label>
              <select
                value={ptkFormData.jenisKelamin}
                onChange={(e) => setPTKFormData({ ...ptkFormData, jenisKelamin: e.target.value as 'L' | 'P' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Status Kepegawaian</label>
              <select
                value={ptkFormData.statusKepegawaian}
                onChange={(e) => setPTKFormData({ ...ptkFormData, statusKepegawaian: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="Honorer">Honorer Sekolah</option>
                <option value="GTT/PTT">GTT / PTT</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Pangkat & Golongan</label>
              <input
                type="text"
                value={ptkFormData.pangkatGolongan}
                onChange={(e) => setPTKFormData({ ...ptkFormData, pangkatGolongan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: Pembina Tk.I / IV-b"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Pendidikan Terakhir</label>
              <input
                type="text"
                value={ptkFormData.pendidikanTerakhir}
                onChange={(e) => setPTKFormData({ ...ptkFormData, pendidikanTerakhir: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: S1 PGSD UNM"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Jabatan Utama</label>
              <input
                type="text"
                required
                value={ptkFormData.jabatan}
                onChange={(e) => setPTKFormData({ ...ptkFormData, jabatan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: Guru Kelas 1A / Operator"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Tugas Tambahan</label>
              <input
                type="text"
                value={ptkFormData.tugasTambahan}
                onChange={(e) => setPTKFormData({ ...ptkFormData, tugasTambahan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Contoh: Pembina Pramuka / Bendahara BOS"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Status Sertifikasi</label>
              <select
                value={ptkFormData.sertifikasi}
                onChange={(e) => setPTKFormData({ ...ptkFormData, sertifikasi: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="Sudah Sertifikasi">Sudah Sertifikasi</option>
                <option value="Belum Sertifikasi">Belum Sertifikasi</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Nomor WhatsApp / Telepon</label>
              <input
                type="text"
                value={ptkFormData.telepon}
                onChange={(e) => setPTKFormData({ ...ptkFormData, telepon: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="081234567890"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Alamat Email</label>
              <input
                type="email"
                value={ptkFormData.email}
                onChange={(e) => setPTKFormData({ ...ptkFormData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="guru@sdnlanto.sch.id"
              />
            </div>

            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah Berkas SK / Ijazah / Dokumen PTK (Google Drive)"
                category="manajemen-sekolah"
                currentUrl={ptkFormData.berkasSK}
                onUploadComplete={(url) => setPTKFormData({ ...ptkFormData, berkasSK: url })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsPTKModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs font-semibold shadow-xs"
            >
              {editingPTK ? 'Simpan Perubahan' : 'Tambah PTK'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail PTK */}
      {selectedPTK && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Profil Pendidik: ${selectedPTK.nama}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
                {selectedPTK.nama.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{selectedPTK.nama}</h4>
                <p className="text-slate-600">{selectedPTK.jabatan} • {selectedPTK.statusKepegawaian}</p>
                <p className="text-[11px] text-emerald-700 font-medium">{selectedPTK.sertifikasi}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
              <div>
                <span className="text-[11px] text-slate-400">NIP</span>
                <p className="font-semibold text-slate-800">{selectedPTK.nip || '-'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">NUPTK</span>
                <p className="font-semibold text-slate-800">{selectedPTK.nuptk || '-'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Pangkat / Golongan</span>
                <p className="font-semibold text-slate-800">{selectedPTK.pangkatGolongan || '-'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Pendidikan Terakhir</span>
                <p className="font-semibold text-slate-800">{selectedPTK.pendidikanTerakhir || '-'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Tugas Tambahan</span>
                <p className="font-semibold text-slate-800">{selectedPTK.tugasTambahan || '-'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Jenis Kelamin</span>
                <p className="font-semibold text-slate-800">{selectedPTK.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedPTK.telepon || 'Tidak ada nomor telepon'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedPTK.email || 'Tidak ada email'}</span>
              </div>
            </div>

            {selectedPTK.berkasSK && (
              <div className="pt-2 border-t border-slate-200">
                <a
                  href={selectedPTK.berkasSK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Dokumen SK / Ijazah di Google Drive
                </a>
              </div>
            )}

            <div className="flex justify-end pt-3">
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
    </div>
  );
};
