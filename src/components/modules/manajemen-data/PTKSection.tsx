import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PTKRecord } from '../../../types';
import { Modal } from '../../common/Modal';
import { DriveFileUpload } from '../../common/DriveFileUpload';
import { PasFotoUploader } from '../../common/PasFotoUploader';
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
  UserCheck,
  Camera,
  Image as ImageIcon,
  Download,
  HelpCircle,
  Sparkles,
  User,
  Eye,
  Check
} from 'lucide-react';

export const PTKSection: React.FC = () => {
  const { ptkList, addPTK, updatePTK, deletePTK } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterJabatan, setFilterJabatan] = useState<string>('Semua');

  // Modal State
  const [isPTKModalOpen, setIsPTKModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isQuickPhotoModalOpen, setIsQuickPhotoModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  
  const [selectedPTK, setSelectedPTK] = useState<PTKRecord | null>(null);
  const [editingPTK, setEditingPTK] = useState<PTKRecord | null>(null);
  const [photoTargetPTK, setPhotoTargetPTK] = useState<PTKRecord | null>(null);

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
    telepon: '',
    foto: '',
    berkasSK: ''
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
      telepon: '',
      foto: '',
      berkasSK: ''
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
      foto: ptk.foto || '',
      berkasSK: ptk.berkasSK || ''
    });
    setIsPTKModalOpen(true);
  };

  const handleQuickPhotoEdit = (ptk: PTKRecord) => {
    setPhotoTargetPTK(ptk);
    setIsQuickPhotoModalOpen(true);
  };

  const handleSaveQuickPhoto = (photoDataUrl: string) => {
    if (photoTargetPTK) {
      updatePTK(photoTargetPTK.id, { foto: photoDataUrl });
      setIsQuickPhotoModalOpen(false);
      setPhotoTargetPTK(null);
    }
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
  const totalWithPhoto = ptkList.filter(p => !!p.foto).length;
  const totalPNS = ptkList.filter(p => p.statusKepegawaian === 'PNS').length;
  const totalPPPK = ptkList.filter(p => p.statusKepegawaian === 'PPPK').length;
  const totalHonorer = ptkList.filter(p => p.statusKepegawaian === 'Honorer' || p.statusKepegawaian === 'GTT/PTT').length;
  const totalSertifikasi = ptkList.filter(p => p.sertifikasi === 'Sudah Sertifikasi').length;

  return (
    <div id="ptk-management-section" className="space-y-6">
      
      {/* Top Banner: Panduan Pas Foto & Aset Permanen */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Camera className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                Manajemen Pas Foto & Data Pendidik Resmi
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-100 border border-emerald-300/30">
                {totalWithPhoto}/{totalPTK} Foto Terpasang
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5 max-w-xl leading-relaxed">
              Setiap pas foto otomatis dikompresi ke rasio formal 3x4 dan disimpan permanen di aset lokal & database cloud sekolah agar tidak pernah hilang atau berganti.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-emerald-200" />
            <span>Petunjuk Pas Foto</span>
          </button>
          <button
            onClick={handleOpenAddPTK}
            id="btn-tambah-ptk-banner"
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah PTK Baru</span>
          </button>
        </div>
      </div>

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
            <span className="text-xs font-medium text-slate-500">Pas Foto Ada</span>
            <ImageIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{totalWithPhoto}</p>
          <span className="text-[11px] text-slate-400">Tersimpan Permanen</span>
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
          <span className="text-[11px] text-slate-400">Guru Profesional</span>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama guru, NIP, NUPTK, jabatan, atau gelar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
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
                <option value="Semua">Semua Status</option>
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
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs ml-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah PTK</span>
            </button>
          </div>
        </div>
      </div>

      {/* PTK Table with Integrated 3x4 Pas Foto Column */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Pas Foto</th>
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
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Tidak ada data PTK yang sesuai pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredPTK.map((ptk) => (
                  <tr key={ptk.id} className="hover:bg-slate-50/60 transition-colors group">
                    
                    {/* Pas Foto Column */}
                    <td className="py-3 px-4 text-center">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => handleQuickPhotoEdit(ptk)}
                          title="Klik untuk ganti pas foto ini"
                          className="w-10 h-13 rounded-lg overflow-hidden border border-slate-300 shadow-xs bg-slate-100 hover:ring-2 hover:ring-emerald-500 transition-all cursor-pointer relative group/photo block"
                        >
                          {ptk.foto ? (
                            <img
                              src={ptk.foto}
                              alt={ptk.nama}
                              className="w-full h-full object-cover object-top"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-xs">
                              <span>{ptk.nama.charAt(0)}</span>
                              <span className="text-[8px] text-slate-400 font-normal">3x4</span>
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                        </button>

                        {ptk.foto && (
                          <div
                            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"
                            title="Foto terpasang"
                          />
                        )}
                      </div>
                    </td>

                    {/* Nama & NIP */}
                    <td className="py-3 px-4">
                      <div>
                        <button
                          onClick={() => handleViewDetail(ptk)}
                          className="font-bold text-slate-800 hover:text-emerald-600 transition-colors text-left text-xs"
                        >
                          {ptk.nama}
                        </button>
                        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 mt-0.5">
                          <span>NIP: {ptk.nip || '-'}</span>
                          <span>•</span>
                          <span>NUPTK: {ptk.nuptk || '-'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Jabatan & Tugas */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{ptk.jabatan}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        Tugas: {ptk.tugasTambahan}
                      </p>
                    </td>

                    {/* Status & Golongan */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-flex items-center w-max px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ptk.statusKepegawaian === 'PNS'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : ptk.statusKepegawaian === 'PPPK'
                              ? 'bg-teal-100 text-teal-800 border border-teal-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {ptk.statusKepegawaian}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {ptk.pangkatGolongan}
                        </span>
                      </div>
                    </td>

                    {/* Pendidikan */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{ptk.pendidikanTerakhir}</span>
                      </div>
                    </td>

                    {/* Sertifikasi */}
                    <td className="py-3 px-4">
                      {ptk.sertifikasi === 'Sudah Sertifikasi' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Tersertifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                          Belum Sertifikasi
                        </span>
                      )}
                    </td>

                    {/* Kontak */}
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

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleQuickPhotoEdit(ptk)}
                          title="Ganti Pas Foto 3x4"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleViewDetail(ptk)}
                          title="Lihat Detail Profil PTK"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditPTK(ptk)}
                          title="Edit Data Lengkap PTK"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePTK(ptk.id, ptk.nama)}
                          title="Hapus PTK"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* ================= MODAL ADD / EDIT PTK LENGKAP ================= */}
      <Modal
        isOpen={isPTKModalOpen}
        onClose={() => setIsPTKModalOpen(false)}
        title={editingPTK ? `Edit Profil PTK: ${editingPTK.nama}` : 'Tambah Data Pendidik & Tendik Baru'}
      >
        <form onSubmit={handleSavePTK} className="space-y-5 text-xs max-h-[80vh] overflow-y-auto pr-1">
          
          {/* SECTION 1: PAS FOTO PTK TERINTEGRASI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                1. Pas Foto Resmi Pendidik (Ukuran 3x4 / 4x6)
              </label>
              <span className="text-[10px] text-slate-400">
                Tersimpan permanen di aset web
              </span>
            </div>
            
            <PasFotoUploader
              currentPhotoUrl={ptkFormData.foto}
              onPhotoChange={(newPhotoUrl) => setPTKFormData(prev => ({ ...prev, foto: newPhotoUrl }))}
              personName={ptkFormData.nama || 'Pendidik'}
              gender={ptkFormData.jenisKelamin}
            />
          </div>

          {/* SECTION 2: BIODATA & IDENTITAS */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-800">
              2. Data Kepegawaian & Identitas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">
                  Nama Lengkap & Gelar Akademik *
                </label>
                <input
                  type="text"
                  required
                  value={ptkFormData.nama}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="Contoh: Dra. Hj. Rosdiana, M.Pd."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  NIP (Kosongkan jika bukan PNS/PPPK)
                </label>
                <input
                  type="text"
                  value={ptkFormData.nip}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, nip: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-mono"
                  placeholder="19700412 199303 2 004"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  NUPTK
                </label>
                <input
                  type="text"
                  value={ptkFormData.nuptk}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, nuptk: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-mono"
                  placeholder="16 digit NUPTK"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={ptkFormData.jenisKelamin}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, jenisKelamin: e.target.value as 'L' | 'P' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Status Kepegawaian
                </label>
                <select
                  value={ptkFormData.statusKepegawaian}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, statusKepegawaian: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                >
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="Honorer">Honorer Sekolah</option>
                  <option value="GTT/PTT">GTT / PTT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Pangkat & Golongan
                </label>
                <input
                  type="text"
                  value={ptkFormData.pangkatGolongan}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, pangkatGolongan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="Contoh: Pembina Tk.I / IV-b"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Pendidikan Terakhir
                </label>
                <input
                  type="text"
                  value={ptkFormData.pendidikanTerakhir}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, pendidikanTerakhir: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="Contoh: S1 PGSD UNM"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Jabatan Utama *
                </label>
                <input
                  type="text"
                  required
                  value={ptkFormData.jabatan}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, jabatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="Contoh: Guru Kelas 1A / Kepala Sekolah"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Tugas Tambahan
                </label>
                <input
                  type="text"
                  value={ptkFormData.tugasTambahan}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, tugasTambahan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="Contoh: Koordinator Literasi / Bendahara BOS"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Status Sertifikasi
                </label>
                <select
                  value={ptkFormData.sertifikasi}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, sertifikasi: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                >
                  <option value="Sudah Sertifikasi">Sudah Sertifikasi</option>
                  <option value="Belum Sertifikasi">Belum Sertifikasi</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={ptkFormData.telepon}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, telepon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="081234567890"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">
                  Alamat Email (Akun Belajar.id / Pribadi)
                </label>
                <input
                  type="email"
                  value={ptkFormData.email}
                  onChange={(e) => setPTKFormData({ ...ptkFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="guru@sd.belajar.id"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: DOKUMEN SK & GOOGLE DRIVE */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-800">
              3. Berkas SK & Ijazah (Google Drive)
            </h4>
            <DriveFileUpload
              label="Unggah Berkas SK Kenaikan Pangkat / Ijazah / Sertifikat Pendidik"
              category="Dokumen-PTK"
              initialUrl={ptkFormData.berkasSK}
              onUploadSuccess={(url) => setPTKFormData(prev => ({ ...prev, berkasSK: url }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsPTKModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-xs font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs font-bold shadow-xs cursor-pointer"
            >
              {editingPTK ? 'Simpan Perubahan' : 'Tambah PTK'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL QUICK PHOTO UPLOADER ================= */}
      {photoTargetPTK && (
        <Modal
          isOpen={isQuickPhotoModalOpen}
          onClose={() => {
            setIsQuickPhotoModalOpen(false);
            setPhotoTargetPTK(null);
          }}
          title={`Ganti Pas Foto: ${photoTargetPTK.nama}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Perbarui pas foto formal untuk <b>{photoTargetPTK.nama}</b> ({photoTargetPTK.jabatan}). Foto akan otomatis dikompresi ke rasio 3x4 dan tersimpan secara permanen.
            </p>

            <PasFotoUploader
              currentPhotoUrl={photoTargetPTK.foto}
              onPhotoChange={handleSaveQuickPhoto}
              personName={photoTargetPTK.nama}
              gender={photoTargetPTK.jenisKelamin}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsQuickPhotoModalOpen(false);
                  setPhotoTargetPTK(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL DETAIL PROFIL PTK ================= */}
      {selectedPTK && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Profil Pendidik: ${selectedPTK.nama}`}
        >
          <div className="space-y-5 text-xs">
            
            {/* Header Identity Card with 3x4 Pas Foto */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4">
              
              {/* Formal 3x4 Frame */}
              <div className="w-28 h-36 rounded-xl p-1 bg-rose-700 border-2 border-rose-800 shadow-md shrink-0 flex items-center justify-center overflow-hidden relative">
                {selectedPTK.foto ? (
                  <img
                    src={selectedPTK.foto}
                    alt={selectedPTK.nama}
                    className="w-full h-full object-cover object-top rounded-lg bg-white"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-white flex flex-col items-center justify-center rounded-lg text-slate-400">
                    <User className="w-10 h-10 text-slate-300" />
                    <span className="text-[9px] font-bold text-slate-600">3x4</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-center text-[8px] font-bold text-white uppercase tracking-wider">
                  SDN LANTO
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedPTK.statusKepegawaian === 'PNS'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedPTK.statusKepegawaian === 'PPPK'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedPTK.statusKepegawaian}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {selectedPTK.sertifikasi}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-800">
                  {selectedPTK.nama}
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  {selectedPTK.jabatan} • {selectedPTK.pangkatGolongan}
                </p>
                <p className="text-[11px] text-slate-500">
                  Tugas Tambahan: {selectedPTK.tugasTambahan || '-'}
                </p>

                {/* Quick actions for photo */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleQuickPhotoEdit(selectedPTK);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-white text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Ubah Pas Foto</span>
                  </button>

                  {selectedPTK.foto && (
                    <a
                      href={selectedPTK.foto}
                      download={`PasFoto_${selectedPTK.nama.replace(/\s+/g, '_')}.jpg`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh Pas Foto (3x4)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Grid Data Spesifik */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NIP</span>
                <p className="font-mono font-bold text-slate-800 text-xs mt-0.5">{selectedPTK.nip || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">NUPTK</span>
                <p className="font-mono font-bold text-slate-800 text-xs mt-0.5">{selectedPTK.nuptk || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pangkat / Golongan</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedPTK.pangkatGolongan || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pendidikan Terakhir</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedPTK.pendidikanTerakhir || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jenis Kelamin</span>
                <p className="font-semibold text-slate-800 text-xs mt-0.5">
                  {selectedPTK.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Status Sertifikasi</span>
                <p className="font-semibold text-emerald-700 text-xs mt-0.5">{selectedPTK.sertifikasi}</p>
              </div>
            </div>

            {/* Kontak & Dokumen */}
            <div className="space-y-2 bg-white p-3 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-slate-700 text-xs">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">Telepon / WhatsApp:</span>
                <span className="font-mono font-bold">{selectedPTK.telepon || 'Tidak tertera'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">Email:</span>
                <span className="font-mono text-blue-600">{selectedPTK.email || 'Tidak tertera'}</span>
              </div>
            </div>

            {selectedPTK.berkasSK && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                  <HardDrive className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Berkas SK / Dokumen Tersedia di Google Drive</span>
                </div>
                <a
                  href={selectedPTK.berkasSK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span>Buka Berkas</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* ================= MODAL PETUNJUK PAS FOTO PERMANEN ================= */}
      <Modal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        title="Petunjuk & Cara Menambahkan Pas Foto PTK Permanen"
      >
        <div className="space-y-4 text-xs">
          
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 leading-relaxed space-y-1">
            <h4 className="font-black text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Bagaimana Cara Memasang Pas Foto Agar Tersimpan Permanen?
            </h4>
            <p>
              Aplikasi SIM SDN Lanto Dg. Pasewang dilengkapi sistem penyimpanan gambar otomatis (Base64 Web Storage & Google Drive). Foto yang diunggah akan otomatis dikompresi sehingga <b>tidak hilang saat browser ditutup atau di-refresh</b>.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              3 Cara Praktis Menambahkan Pas Foto:
            </h5>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Upload Langsung dari Komputer / HP (Paling Direkomendasikan)</span>
              </div>
              <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                Klik ikon <b>Kamera</b> pada baris nama guru atau buka tombol <b>Edit PTK</b>. Seret file foto atau pilih file JPG/PNG dari galeri HP Anda. Sistem akan mengompresi dan memotong foto otomatis ke rasio resmi 3x4.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Pilih dari Galeri Aset Web Standar Sekolah</span>
              </div>
              <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                Pada tab <b>Aset Galeri</b> di uploader, Anda dapat memilih template foto formal pendidik berhijab / kemeja resmi / seragam ASN yang telah disediakan secara default.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Gunakan Tautan Foto Google Drive atau URL Web</span>
              </div>
              <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                Pada tab <b>Tautan / Drive</b>, tempelkan link foto yang telah Anda simpan di folder Google Drive sekolah atau server cloud Anda.
              </p>
            </div>
          </div>

          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-800 text-[11px]">
            <div className="font-bold mb-0.5">Standar Pas Foto Resmi ASN & Pendidik:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>Rasio: <b>3 x 4</b> atau <b>4 x 6</b> formal dengan pencahayaan jelas.</li>
              <li>Latar Belakang: <b>Merah</b> (Tahun Kelahiran Ganjil) atau <b>Biru</b> (Tahun Kelahiran Genap).</li>
              <li>Pakaian: Pakaian dinas harian (PDH), kemeja putih, atau batik PGRI.</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsGuideModalOpen(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
            >
              Mengerti, Tutup Panduan
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
};
