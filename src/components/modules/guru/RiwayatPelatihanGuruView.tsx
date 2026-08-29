import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { RiwayatPelatihanGuru } from '../../../types';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  Award,
  GraduationCap,
  Calendar,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Printer,
  User,
  Building,
  Clock,
  CheckCircle2,
  Copy,
  FolderOpen,
  X,
  FileText,
  Sparkles,
  Layers,
  Link,
  MapPin,
  Check
} from 'lucide-react';

const PRESET_PELAKSANA = [
  'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek)',
  'Balai Guru Penggerak (BGP) Provinsi Sulawesi Selatan',
  'Balai Besar Penjaminan Mutu Pendidikan (BBPMP) Sulawesi Selatan',
  'Dinas Pendidikan Kota Makassar',
  'KKG Gugus 1 Wilayah Mamajang Kota Makassar',
  'Platform Merdeka Mengajar (PMM)',
  'Google for Education & REFO Indonesia',
  'Lembaga Penjaminan Mutu Pendidikan (LPMP)'
];

const PRESET_MODA = [
  'Luring (Tatap Muka)',
  'Daring (Online / Virtual)',
  'Hybrid / Blended Learning',
  'Pelatihan Mandiri (Asinkron)'
];

export const RiwayatPelatihanGuruView: React.FC = () => {
  const {
    currentUser,
    users,
    riwayatPelatihanList,
    addRiwayatPelatihan,
    updateRiwayatPelatihan,
    deleteRiwayatPelatihan,
    showToast
  } = useApp();

  const isGuru = currentUser.role === 'guru';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGuruFilter, setSelectedGuruFilter] = useState<string>(isGuru ? currentUser.id : 'Semua');
  const [selectedPelaksanaFilter, setSelectedPelaksanaFilter] = useState<string>('Semua');
  const [selectedTahunFilter, setSelectedTahunFilter] = useState<string>('Semua');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<RiwayatPelatihanGuru | null>(null);
  const [previewItem, setPreviewItem] = useState<RiwayatPelatihanGuru | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    guruId: string;
    namaGuru: string;
    nipGuru: string;
    namaPelatihan: string;
    tanggalPelaksanaan: string;
    tanggalSelesai: string;
    pelaksana: string;
    linkDrive: string;
    tempat: string;
    jumlahJam: number;
    nomorSertifikat: string;
    tahunAjaran: string;
    keterangan: string;
  }>({
    guruId: currentUser.id,
    namaGuru: currentUser.nama,
    nipGuru: currentUser.nip || '-',
    namaPelatihan: '',
    tanggalPelaksanaan: new Date().toISOString().split('T')[0],
    tanggalSelesai: '',
    pelaksana: '',
    linkDrive: TARGET_DRIVE_FOLDER_URL,
    tempat: 'Luring (Tatap Muka)',
    jumlahJam: 32,
    nomorSertifikat: '',
    tahunAjaran: '2024/2025',
    keterangan: ''
  });

  // Filtered List
  const filteredList = useMemo(() => {
    return riwayatPelatihanList.filter(item => {
      // Search
      const matchSearch =
        searchQuery.trim() === '' ||
        item.namaPelatihan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pelaksana.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaGuru.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nomorSertifikat && item.nomorSertifikat.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.keterangan && item.keterangan.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter Guru
      const matchGuru =
        selectedGuruFilter === 'Semua' || item.guruId === selectedGuruFilter;

      // Filter Pelaksana
      const matchPelaksana =
        selectedPelaksanaFilter === 'Semua' ||
        item.pelaksana.toLowerCase().includes(selectedPelaksanaFilter.toLowerCase());

      // Filter Tahun
      const matchTahun =
        selectedTahunFilter === 'Semua' ||
        item.tanggalPelaksanaan.startsWith(selectedTahunFilter) ||
        (item.tahunAjaran && item.tahunAjaran.includes(selectedTahunFilter));

      return matchSearch && matchGuru && matchPelaksana && matchTahun;
    });
  }, [riwayatPelatihanList, searchQuery, selectedGuruFilter, selectedPelaksanaFilter, selectedTahunFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = riwayatPelatihanList.length;
    const totalJP = riwayatPelatihanList.reduce((acc, curr) => acc + (curr.jumlahJam || 0), 0);
    const uniqueTeachers = new Set(riwayatPelatihanList.map(r => r.guruId)).size;
    const uniqueOrganizers = new Set(riwayatPelatihanList.map(r => r.pelaksana.trim())).size;
    return {
      total,
      totalJP,
      uniqueTeachers,
      uniqueOrganizers
    };
  }, [riwayatPelatihanList]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      guruId: currentUser.id,
      namaGuru: currentUser.nama,
      nipGuru: currentUser.nip || '-',
      namaPelatihan: '',
      tanggalPelaksanaan: new Date().toISOString().split('T')[0],
      tanggalSelesai: '',
      pelaksana: '',
      linkDrive: TARGET_DRIVE_FOLDER_URL,
      tempat: 'Luring (Tatap Muka)',
      jumlahJam: 32,
      nomorSertifikat: '',
      tahunAjaran: '2024/2025',
      keterangan: ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: RiwayatPelatihanGuru) => {
    setEditingItem(item);
    setFormData({
      guruId: item.guruId,
      namaGuru: item.namaGuru,
      nipGuru: item.nipGuru || '-',
      namaPelatihan: item.namaPelatihan,
      tanggalPelaksanaan: item.tanggalPelaksanaan,
      tanggalSelesai: item.tanggalSelesai || '',
      pelaksana: item.pelaksana,
      linkDrive: item.linkDrive,
      tempat: item.tempat || 'Luring (Tatap Muka)',
      jumlahJam: item.jumlahJam || 32,
      nomorSertifikat: item.nomorSertifikat || '',
      tahunAjaran: item.tahunAjaran || '2024/2025',
      keterangan: item.keterangan || ''
    });
    setIsFormModalOpen(true);
  };

  const handleGuruChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gId = e.target.value;
    const found = users.find(u => u.id === gId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        guruId: found.id,
        namaGuru: found.nama,
        nipGuru: found.nip || '-'
      }));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaPelatihan.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama pelatihan wajib diisi.');
      return;
    }
    if (!formData.pelaksana.trim()) {
      showToast('error', 'Validasi Gagal', 'Lembaga pelaksana / penyelenggara wajib diisi.');
      return;
    }
    if (!formData.tanggalPelaksanaan) {
      showToast('error', 'Validasi Gagal', 'Tanggal pelaksanaan wajib diisi.');
      return;
    }
    if (!formData.linkDrive.trim()) {
      showToast('error', 'Validasi Gagal', 'Link Google Drive sertifikat / laporan wajib diisi.');
      return;
    }

    if (editingItem) {
      updateRiwayatPelatihan(editingItem.id, {
        guruId: formData.guruId,
        namaGuru: formData.namaGuru,
        nipGuru: formData.nipGuru,
        namaPelatihan: formData.namaPelatihan.trim(),
        tanggalPelaksanaan: formData.tanggalPelaksanaan,
        tanggalSelesai: formData.tanggalSelesai || undefined,
        pelaksana: formData.pelaksana.trim(),
        linkDrive: formData.linkDrive.trim(),
        tempat: formData.tempat,
        jumlahJam: Number(formData.jumlahJam) || 0,
        nomorSertifikat: formData.nomorSertifikat.trim() || undefined,
        tahunAjaran: formData.tahunAjaran,
        keterangan: formData.keterangan.trim() || undefined
      });
      showToast('success', 'Riwayat Diperbarui', 'Data riwayat pelatihan guru berhasil diperbarui.');
    } else {
      addRiwayatPelatihan({
        guruId: formData.guruId,
        namaGuru: formData.namaGuru,
        nipGuru: formData.nipGuru,
        namaPelatihan: formData.namaPelatihan.trim(),
        tanggalPelaksanaan: formData.tanggalPelaksanaan,
        tanggalSelesai: formData.tanggalSelesai || undefined,
        pelaksana: formData.pelaksana.trim(),
        linkDrive: formData.linkDrive.trim(),
        tempat: formData.tempat,
        jumlahJam: Number(formData.jumlahJam) || 0,
        nomorSertifikat: formData.nomorSertifikat.trim() || undefined,
        tahunAjaran: formData.tahunAjaran,
        keterangan: formData.keterangan.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0]
      });
      showToast('success', 'Pelatihan Ditambahkan', 'Data riwayat pelatihan guru baru berhasil disimpan.');
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteRiwayatPelatihan(id);
    setDeleteConfirmId(null);
    showToast('info', 'Data Dihapus', 'Riwayat pelatihan guru telah dihapus.');
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('info', 'Tautan Disalin', 'Link Google Drive berhasil disalin ke clipboard.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDateIndo = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const day = parseInt(parts[2], 10);
        const monthIdx = parseInt(parts[1], 10) - 1;
        const year = parts[0];
        return `${day} ${months[monthIdx]} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Pelatihan</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
            <span className="text-[11px] text-slate-500 font-medium">kegiatan</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600">Total Jam Pelajaran</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{stats.totalJP}</span>
            <span className="text-[11px] text-emerald-600 font-medium">JP Pembelajaran</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600">Pendidik Bersertifikat</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700">{stats.uniqueTeachers}</span>
            <span className="text-[11px] text-blue-600 font-medium">guru aktif</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600">Instansi Penyelenggara</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700">{stats.uniqueOrganizers}</span>
            <span className="text-[11px] text-purple-600 font-medium">lembaga</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-pelatihan-guru"
              type="text"
              placeholder="Cari nama pelatihan, lembaga pelaksana, nama guru, no sertifikat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Guru */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-guru-pelatihan"
                value={selectedGuruFilter}
                onChange={(e) => setSelectedGuruFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none max-w-[170px]"
              >
                <option value="Semua">Semua Guru</option>
                {users.filter(u => u.role === 'guru').map(g => (
                  <option key={g.id} value={g.id}>{g.nama}</option>
                ))}
              </select>
            </div>

            {/* Filter by Pelaksana */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-pelaksana-pelatihan"
                value={selectedPelaksanaFilter}
                onChange={(e) => setSelectedPelaksanaFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none max-w-[160px]"
              >
                <option value="Semua">Semua Pelaksana</option>
                <option value="Kemendikbudristek">Kemendikbudristek / PMM</option>
                <option value="Balai Guru Penggerak">BGP Sulawesi Selatan</option>
                <option value="BBPMP">BBPMP Sulsel</option>
                <option value="Dinas Pendidikan">Dinas Pendidikan Makassar</option>
                <option value="KKG">KKG Gugus Mamajang</option>
                <option value="Google">Google for Education</option>
              </select>
            </div>

            {/* Filter by Tahun */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-tahun-pelatihan"
                value={selectedTahunFilter}
                onChange={(e) => setSelectedTahunFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="Semua">Semua Tahun</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            {/* Print Button */}
            <button
              id="btn-print-pelatihan"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Cetak Rekapitulasi Pelatihan Guru"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* Add Button */}
            <button
              id="btn-tambah-riwayat-pelatihan"
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Riwayat Pelatihan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table: Riwayat Pelatihan Guru */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Tabel Riwayat & Portofolio Pelatihan Pendidik (Guru)
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {filteredList.length} dari {riwayatPelatihanList.length} Catatan
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Belum ada data pelatihan yang cocok</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tidak ditemukan data pelatihan dengan kata kunci atau filter yang dipilih. Silakan ubah filter atau tambahkan riwayat pelatihan baru.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pelatihan Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="table-riwayat-pelatihan-guru">
              <thead>
                <tr className="bg-slate-100/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 min-w-[240px]">Nama Pelatihan & Kompetensi</th>
                  <th className="py-3 px-4 min-w-[140px]">Guru Peserta</th>
                  <th className="py-3 px-4 min-w-[150px]">Tanggal Pelaksanaan</th>
                  <th className="py-3 px-4 min-w-[180px]">Lembaga Pelaksana</th>
                  <th className="py-3 px-4 min-w-[140px] text-center">Link Google Drive</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredList.map((item, idx) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                      id={`row-pelatihan-${item.id}`}
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>

                      {/* 1. Kolom: Nama Pelatihan */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                          {item.namaPelatihan}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                          {item.jumlahJam ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                              <Clock className="w-3 h-3" />
                              {item.jumlahJam} JP
                            </span>
                          ) : null}

                          {item.tempat && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.tempat}
                            </span>
                          )}

                          {item.nomorSertifikat && (
                            <span className="text-[10px] text-slate-500 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              No: {item.nomorSertifikat}
                            </span>
                          )}
                        </div>
                        {item.keterangan && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                            &ldquo;{item.keterangan}&rdquo;
                          </p>
                        )}
                      </td>

                      {/* Guru Peserta */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{item.namaGuru}</div>
                        <div className="text-[11px] text-slate-500 font-mono">NIP: {item.nipGuru || '-'}</div>
                      </td>

                      {/* 2. Kolom: Tanggal Pelaksanaan */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 text-slate-800 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{formatDateIndo(item.tanggalPelaksanaan)}</span>
                        </div>
                        {item.tanggalSelesai && item.tanggalSelesai !== item.tanggalPelaksanaan && (
                          <div className="text-[11px] text-slate-500 pl-5">
                            s.d. {formatDateIndo(item.tanggalSelesai)}
                          </div>
                        )}
                        {item.tahunAjaran && (
                          <div className="text-[10px] text-slate-500 pl-5 mt-0.5">
                            TA {item.tahunAjaran}
                          </div>
                        )}
                      </td>

                      {/* 3. Kolom: Pelaksana */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-800 leading-snug">
                              {item.pelaksana}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Kolom: Link Drive */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={item.linkDrive || TARGET_DRIVE_FOLDER_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`link-drive-${item.id}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors shadow-xs"
                            title="Buka Sertifikat / Berkas di Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka Drive</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(item.linkDrive, item.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                            title="Salin Tautan Google Drive"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                            title="Lihat Detail Pelatihan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                            title="Edit Data Pelatihan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Hapus Data Pelatihan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal: Tambah & Edit Riwayat Pelatihan */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingItem ? 'Edit Riwayat Pelatihan Guru' : 'Tambah Riwayat Pelatihan Guru'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Isi rincian kegiatan pelatihan, tanggal pelaksanaan, pelaksana, dan link sertifikat Google Drive.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Guru Peserta */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Guru Peserta <span className="text-red-500">*</span>
                </label>
                {isGuru ? (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{currentUser.nama}</div>
                      <div className="text-[11px] text-slate-500">NIP: {currentUser.nip || '-'} ({currentUser.jabatan})</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Akun Aktif
                    </span>
                  </div>
                ) : (
                  <select
                    id="form-guru-id"
                    value={formData.guruId}
                    onChange={handleGuruChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                    required
                  >
                    {users.filter(u => u.role === 'guru').map(g => (
                      <option key={g.id} value={g.id}>
                        {g.nama} — NIP: {g.nip || '-'} ({g.jabatan})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 1. Nama Pelatihan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pelatihan / Diklat / Bimtek / Workshop <span className="text-red-500">*</span>
                </label>
                <input
                  id="form-nama-pelatihan"
                  type="text"
                  placeholder="Contoh: Bimtek Kurikulum Merdeka & Penyusunan Modul Ajar Berdiferensiasi"
                  value={formData.namaPelatihan}
                  onChange={(e) => setFormData(prev => ({ ...prev, namaPelatihan: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* 2. Tanggal Pelaksanaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Mulai Pelaksanaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="form-tanggal-pelaksanaan"
                    type="date"
                    value={formData.tanggalPelaksanaan}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggalPelaksanaan: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Selesai Pelaksanaan (Opsional)
                  </label>
                  <input
                    id="form-tanggal-selesai"
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggalSelesai: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Pelaksana */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lembaga Pelaksana / Penyelenggara <span className="text-red-500">*</span>
                </label>
                <input
                  id="form-pelaksana"
                  type="text"
                  placeholder="Contoh: Balai Guru Penggerak (BGP) Provinsi Sulawesi Selatan"
                  value={formData.pelaksana}
                  onChange={(e) => setFormData(prev => ({ ...prev, pelaksana: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  required
                />
                {/* Preset Suggestions */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-400 mr-1 self-center">Pilihan cepat:</span>
                  {PRESET_PELAKSANA.slice(0, 4).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, pelaksana: p }))}
                      className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded text-slate-600 transition-colors"
                    >
                      {p.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Link Google Drive */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Google Drive (Sertifikat / Laporan / Materi) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="form-link-drive"
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={formData.linkDrive}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkDrive: e.target.value }))}
                    className="w-full pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none font-mono"
                    required
                  />
                  <a
                    href={TARGET_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold transition-colors"
                  >
                    Buka Drive
                  </a>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tempelkan tautan sertifikat PDF atau folder Google Drive dokumen pelatihan guru.
                </p>
              </div>

              {/* Additional Details (Jam, Sertifikat, Moda, Tahun Ajaran) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Durasi (Jumlah Jam / JP)
                  </label>
                  <input
                    id="form-jumlah-jam"
                    type="number"
                    min="1"
                    max="500"
                    placeholder="Contoh: 32"
                    value={formData.jumlahJam}
                    onChange={(e) => setFormData(prev => ({ ...prev, jumlahJam: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Moda / Tempat Pelatihan
                  </label>
                  <select
                    id="form-tempat"
                    value={formData.tempat}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempat: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    {PRESET_MODA.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tahun Ajaran
                  </label>
                  <select
                    id="form-tahun-ajaran"
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData(prev => ({ ...prev, tahunAjaran: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>
              </div>

              {/* No Sertifikat & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Sertifikat (Opsional)
                  </label>
                  <input
                    id="form-nomor-sertifikat"
                    type="text"
                    placeholder="Contoh: BGP-SS/IKM/0452/VI/2024"
                    value={formData.nomorSertifikat}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomorSertifikat: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan / Hasil Kompetensi
                  </label>
                  <input
                    id="form-keterangan"
                    type="text"
                    placeholder="Contoh: Lulus predikat Sangat Memuaskan, Aksi Nyata PMM tervalidasi"
                    value={formData.keterangan}
                    onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  id="btn-submit-pelatihan"
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Riwayat Pelatihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Detail Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">Detail Riwayat Pelatihan Guru</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nama Pelatihan</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{previewItem.namaPelatihan}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Guru Peserta</span>
                  <div className="font-bold text-slate-800">{previewItem.namaGuru}</div>
                  <div className="text-[10px] text-slate-500 font-mono">NIP: {previewItem.nipGuru || '-'}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Tanggal Pelaksanaan</span>
                  <div className="font-bold text-slate-800">{formatDateIndo(previewItem.tanggalPelaksanaan)}</div>
                  {previewItem.tanggalSelesai && (
                    <div className="text-[10px] text-slate-500">s.d. {formatDateIndo(previewItem.tanggalSelesai)}</div>
                  )}
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Lembaga Pelaksana</span>
                  <div className="font-bold text-slate-800">{previewItem.pelaksana}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Durasi & Moda</span>
                  <div className="font-bold text-slate-800">{previewItem.jumlahJam || 32} JP</div>
                  <div className="text-[10px] text-slate-500">{previewItem.tempat || 'Luring'}</div>
                </div>

                {previewItem.nomorSertifikat && (
                  <div className="col-span-2">
                    <span className="text-[11px] text-slate-500 font-medium">Nomor Sertifikat</span>
                    <div className="font-mono font-bold text-slate-800">{previewItem.nomorSertifikat}</div>
                  </div>
                )}

                {previewItem.keterangan && (
                  <div className="col-span-2">
                    <span className="text-[11px] text-slate-500 font-medium">Catatan / Ringkasan Capaian</span>
                    <div className="text-slate-700 italic mt-0.5">{previewItem.keterangan}</div>
                  </div>
                )}
              </div>

              {/* Link Google Drive Box */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-blue-900">Berkas Sertifikat di Google Drive</div>
                    <div className="text-[11px] text-blue-700 truncate max-w-xs">{previewItem.linkDrive}</div>
                  </div>
                </div>
                <a
                  href={previewItem.linkDrive || TARGET_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka</span>
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-center text-slate-900">Hapus Riwayat Pelatihan?</h3>
            <p className="text-xs text-center text-slate-500 mt-1">
              Data pelatihan guru ini akan dihapus dari catatan sekolah. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
