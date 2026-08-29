import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Siswa,
  PrestasiSiswa,
  ProgramKarakter,
  Ekstrakurikuler,
  MasalahSiswa
} from '../../../types';
import { Modal } from '../../common/Modal';
import { UploadMassalSiswaModal } from '../manajemen-data/UploadMassalSiswaModal';
import {
  GraduationCap,
  Users,
  Trophy,
  HeartHandshake,
  Activity,
  AlertTriangle,
  Plus,
  Upload,
  Search,
  Edit,
  Trash2,
  Phone,
  UserCheck,
  CheckCircle,
  MapPin
} from 'lucide-react';

export const KesiswaanView: React.FC = () => {
  const {
    siswaList,
    addSiswa,
    bulkAddSiswa,
    updateSiswa,
    deleteSiswa,
    kelasList,
    prestasiList,
    addPrestasi,
    updatePrestasi,
    deletePrestasi,
    programKarakterList,
    addProgramKarakter,
    updateProgramKarakter,
    deleteProgramKarakter,
    ekskulList,
    addEkskul,
    updateEkskul,
    deleteEkskul,
    masalahSiswaList,
    addMasalahSiswa,
    updateMasalahSiswa,
    deleteMasalahSiswa
  } = useApp();

  const [subTab, setSubTab] = useState<
    'murid' | 'prestasi' | 'karakter' | 'ekskul' | 'masalah'
  >('murid');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('Semua');

  // Modals state
  const [isSiswaModalOpen, setIsSiswaModalOpen] = useState(false);
  const [isUploadMassalModalOpen, setIsUploadMassalModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

  const [isPrestasiModalOpen, setIsPrestasiModalOpen] = useState(false);
  const [isKarakterModalOpen, setIsKarakterModalOpen] = useState(false);
  const [isEkskulModalOpen, setIsEkskulModalOpen] = useState(false);
  const [isMasalahModalOpen, setIsMasalahModalOpen] = useState(false);
  const [editingMasalah, setEditingMasalah] = useState<MasalahSiswa | null>(null);

  // Forms
  const [siswaForm, setSiswaForm] = useState<Omit<Siswa, 'id'>>({
    nisn: '',
    nis: '',
    nama: '',
    kelas: '1A',
    jenisKelamin: 'L',
    tempatLahir: 'Makassar',
    tanggalLahir: '2017-05-10',
    namaOrtu: '',
    teleponOrtu: '',
    alamat: 'Jl. Lanto Dg. Pasewang, Makassar',
    status: 'Aktif'
  });

  const [prestasiForm, setPrestasiForm] = useState<Omit<PrestasiSiswa, 'id'>>({
    namaSiswa: '',
    kelas: '4A',
    namaLomba: '',
    kategori: 'Akademik',
    tingkat: 'Kota Makassar',
    peringkat: 'Juara 1',
    tahun: '2024',
    penyelenggara: 'Dinas Pendidikan Kota Makassar',
    pembimbing: ''
  });

  const [karakterForm, setKarakterForm] = useState<Omit<ProgramKarakter, 'id'>>({
    dimensi: 'Beriman & Bertakwa',
    namaKegiatan: '',
    jadwalRutin: 'Setiap Hari Jumat Pukul 07.15 WITA',
    sasaran: 'Seluruh Siswa Kelas 1 - 6',
    deskripsi: '',
    evaluasiCapaian: '98% siswa mengikuti dengan antusias'
  });

  const [ekskulForm, setEkskulForm] = useState<Omit<Ekstrakurikuler, 'id'>>({
    namaEkskul: '',
    pembina: '',
    hariLatihan: 'Sabtu, 08.00 - 10.00 WITA',
    tempat: 'Lapangan SDN Lanto',
    jumlahAnggota: 25,
    prestasiTerbaru: ''
  });

  const [masalahForm, setMasalahForm] = useState<Omit<MasalahSiswa, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    namaSiswa: '',
    kelas: '3A',
    jenisKasus: 'Kedisiplinan & Keterlambatan',
    deskripsiMasalah: '',
    tindakanPenanganan: '',
    guruPendamping: 'Guru Kelas & Guru BK',
    keterlibatanOrtu: true,
    status: 'Dalam Pemantauan',
    hasilTindakLanjut: ''
  });

  // Handlers for Siswa
  const handleOpenAddSiswa = () => {
    setSiswaForm({
      nisn: '01' + Math.floor(10000000 + Math.random() * 90000000),
      nis: '24' + Math.floor(100 + Math.random() * 900),
      nama: '',
      kelas: '1A',
      jenisKelamin: 'L',
      tempatLahir: 'Makassar',
      tanggalLahir: '2017-05-10',
      namaOrtu: '',
      teleponOrtu: '08',
      alamat: 'Kota Makassar',
      status: 'Aktif'
    });
    setEditingSiswa(null);
    setIsSiswaModalOpen(true);
  };

  const handleOpenEditSiswa = (s: Siswa) => {
    setEditingSiswa(s);
    setSiswaForm({
      nisn: s.nisn,
      nis: s.nis,
      nama: s.nama,
      kelas: s.kelas,
      jenisKelamin: s.jenisKelamin,
      tempatLahir: s.tempatLahir,
      tanggalLahir: s.tanggalLahir,
      namaOrtu: s.namaOrtu,
      teleponOrtu: s.teleponOrtu,
      alamat: s.alamat,
      status: s.status
    });
    setIsSiswaModalOpen(true);
  };

  const handleSubmitSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSiswa) {
      updateSiswa(editingSiswa.id, siswaForm);
    } else {
      addSiswa(siswaForm);
    }
    setIsSiswaModalOpen(false);
  };

  // Filtered Siswa
  const safeSiswaList = siswaList || [];
  const safePrestasiList = prestasiList || [];
  const safeProgramKarakterList = programKarakterList || [];
  const safeEkskulList = ekskulList || [];
  const safeMasalahSiswaList = masalahSiswaList || [];

  const filteredSiswa = safeSiswaList.filter(s => {
    const matchKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
    const matchSearch =
      (s.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nisn || '').includes(searchQuery) ||
      (s.namaOrtu || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 mb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Manajemen Kesiswaan Terpadu</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Kesiswaan & Pembinaan Peserta Didik
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pengelolaan database murid, portofolio prestasi, pembiasaan program karakter, ekstrakurikuler, dan layanan bimbingan konseling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'murid' && (
            <>
              <button
                type="button"
                onClick={() => setIsUploadMassalModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
                title="Upload massal banyak data murid sekaligus via file CSV/Excel atau Salin-Tempel"
              >
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>Upload Massal Murid</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddSiswa}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Murid Baru</span>
              </button>
            </>
          )}
          {subTab === 'prestasi' && (
            <button
              type="button"
              onClick={() => setIsPrestasiModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Prestasi</span>
            </button>
          )}
          {subTab === 'karakter' && (
            <button
              type="button"
              onClick={() => setIsKarakterModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program Karakter</span>
            </button>
          )}
          {subTab === 'ekskul' && (
            <button
              type="button"
              onClick={() => setIsEkskulModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ekstrakurikuler</span>
            </button>
          )}
          {subTab === 'masalah' && (
            <button
              type="button"
              onClick={() => {
                setEditingMasalah(null);
                setMasalahForm({
                  tanggal: new Date().toISOString().split('T')[0],
                  namaSiswa: '',
                  kelas: '1A',
                  jenisKasus: 'Kedisiplinan & Keterlambatan',
                  deskripsiMasalah: '',
                  tindakanPenanganan: '',
                  guruPendamping: 'Guru Kelas & BK',
                  keterlibatanOrtu: true,
                  status: 'Dalam Pemantauan',
                  hasilTindakLanjut: ''
                });
                setIsMasalahModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Layanan Bimbingan</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'murid', label: '1. Data Murid', icon: Users, count: siswaList.length },
          { id: 'prestasi', label: '2. Prestasi Murid', icon: Trophy, count: prestasiList.length },
          { id: 'karakter', label: '3. Program Karakter', icon: HeartHandshake, count: programKarakterList.length },
          { id: 'ekskul', label: '4. Ekstrakurikuler', icon: Activity, count: ekskulList.length },
          { id: 'masalah', label: '5. Penanganan Masalah & BK', icon: AlertTriangle, count: masalahSiswaList.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DATA MURID */}
      {subTab === 'murid' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari murid berdasarkan nama, NISN, atau orang tua..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
              />
            </div>
            <select
              value={selectedKelas}
              onChange={e => setSelectedKelas(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
            >
              <option value="Semua">Semua Rombel</option>
              {['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'].map(k => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Nama & NISN</th>
                    <th className="px-4 py-3">Kelas</th>
                    <th className="px-4 py-3">L/P</th>
                    <th className="px-4 py-3">Tempat, Tgl Lahir</th>
                    <th className="px-4 py-3">Orang Tua / Wali</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSiswa.map(siswa => (
                    <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{siswa.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          NISN: {siswa.nisn} | NIS: {siswa.nis}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 rounded-md font-bold text-[10px] bg-blue-50 text-blue-700">
                          Kelas {siswa.kelas}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-600">
                        {siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {siswa.tempatLahir}, {siswa.tanggalLahir}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="font-medium text-slate-900">{siswa.namaOrtu}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{siswa.teleponOrtu}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            siswa.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {siswa.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSiswa(siswa)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSiswa(siswa.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRESTASI */}
      {subTab === 'prestasi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safePrestasiList.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {item.kategori}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    Tingkat {item.tingkat}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {item.peringkat}
                </h3>
                <div className="text-xs font-bold text-blue-700 mt-1">{item.namaLomba}</div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100 space-y-1">
                  <div>
                    <span className="text-slate-400">Nama Siswa:</span>{' '}
                    <span className="font-bold text-slate-900">{item.namaSiswa}</span> (Kelas {item.kelas})
                  </div>
                  <div>
                    <span className="text-slate-400">Penyelenggara:</span> {item.penyelenggara} ({item.tahun})
                  </div>
                  <div>
                    <span className="text-slate-400">Pembimbing:</span> {item.pembimbing}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => deletePrestasi(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: KARAKTER (P5) */}
      {subTab === 'karakter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeProgramKarakterList.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    Dimensi: {item.dimensi}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.namaKegiatan}
                </h3>
                <div className="text-xs text-slate-500 mt-1">Jadwal: {item.jadwalRutin}</div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {item.deskripsi}
                </p>

                <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
                  <span className="font-bold">Evaluasi & Capaian:</span> {item.evaluasiCapaian}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Sasaran: {item.sasaran}</span>
                <button
                  type="button"
                  onClick={() => deleteProgramKarakter(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: EKSTRAKURIKULER */}
      {subTab === 'ekskul' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeEkskulList.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    {item.jumlahAnggota} Anggota
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.namaEkskul}
                </h3>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100 space-y-1">
                  <div>
                    <span className="text-slate-400">Pembina:</span> <span className="font-bold text-slate-800">{item.pembina}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Jadwal & Tempat:</span> {item.hariLatihan} @ {item.tempat}
                  </div>
                  {item.prestasiTerbaru && (
                    <div className="pt-1 text-amber-900 font-semibold">
                      🏆 {item.prestasiTerbaru}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => deleteEkskul(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: PENANGANAN MASALAH / BK */}
      {subTab === 'masalah' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeMasalahSiswaList.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    {item.jenisKasus}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.namaSiswa} (Kelas {item.kelas})
                </h3>
                <div className="text-[11px] text-slate-400">Tanggal: {item.tanggal}</div>

                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  <strong className="text-slate-800">Uraian Kasus:</strong> {item.deskripsiMasalah}
                </p>

                <div className="mt-2 text-xs text-blue-900 bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-1">
                  <div>
                    <strong className="text-blue-950">Tindakan / Penanganan:</strong> {item.tindakanPenanganan}
                  </div>
                  <div>
                    <strong className="text-blue-950">Hasil & Pemantauan:</strong> {item.hasilTindakLanjut}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Pendamping: {item.guruPendamping}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMasalah(item);
                      setMasalahForm({
                        tanggal: item.tanggal,
                        namaSiswa: item.namaSiswa,
                        kelas: item.kelas,
                        jenisKasus: item.jenisKasus,
                        deskripsiMasalah: item.deskripsiMasalah,
                        tindakanPenanganan: item.tindakanPenanganan,
                        guruPendamping: item.guruPendamping,
                        keterlibatanOrtu: item.keterlibatanOrtu,
                        status: item.status,
                        hasilTindakLanjut: item.hasilTindakLanjut
                      });
                      setIsMasalahModalOpen(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMasalahSiswa(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Siswa */}
      <Modal
        isOpen={isSiswaModalOpen}
        onClose={() => setIsSiswaModalOpen(false)}
        title={editingSiswa ? 'Edit Data Murid' : 'Tambah Murid Baru'}
        subtitle="Entri data pokok peserta didik SDN Lanto Dg. Pasewang"
      >
        <form onSubmit={handleSubmitSiswa} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Murid</label>
              <input
                type="text"
                value={siswaForm.nama}
                onChange={e => setSiswaForm({ ...siswaForm, nama: e.target.value })}
                placeholder="Nama Lengkap Siswa"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NISN (10 Digit)</label>
              <input
                type="text"
                value={siswaForm.nisn}
                onChange={e => setSiswaForm({ ...siswaForm, nisn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIS Sekolah</label>
              <input
                type="text"
                value={siswaForm.nis}
                onChange={e => setSiswaForm({ ...siswaForm, nis: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rombel / Kelas</label>
              <select
                value={siswaForm.kelas}
                onChange={e => setSiswaForm({ ...siswaForm, kelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'].map(k => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={siswaForm.jenisKelamin}
                onChange={e => setSiswaForm({ ...siswaForm, jenisKelamin: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={siswaForm.tempatLahir}
                onChange={e => setSiswaForm({ ...siswaForm, tempatLahir: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={siswaForm.tanggalLahir}
                onChange={e => setSiswaForm({ ...siswaForm, tanggalLahir: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={siswaForm.namaOrtu}
                onChange={e => setSiswaForm({ ...siswaForm, namaOrtu: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP Ortu</label>
              <input
                type="text"
                value={siswaForm.teleponOrtu}
                onChange={e => setSiswaForm({ ...siswaForm, teleponOrtu: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
              <input
                type="text"
                value={siswaForm.alamat}
                onChange={e => setSiswaForm({ ...siswaForm, alamat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSiswaModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingSiswa ? 'Simpan Perubahan' : 'Simpan Murid'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Prestasi */}
      <Modal
        isOpen={isPrestasiModalOpen}
        onClose={() => setIsPrestasiModalOpen(false)}
        title="Catat Prestasi Murid"
        subtitle="Entri kejuaraan dan capaian membanggakan siswa"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addPrestasi(prestasiForm);
            setIsPrestasiModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Siswa Berprestasi</label>
              <input
                type="text"
                value={prestasiForm.namaSiswa}
                onChange={e => setPrestasiForm({ ...prestasiForm, namaSiswa: e.target.value })}
                placeholder="Nama Lengkap Siswa"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
              <input
                type="text"
                value={prestasiForm.kelas}
                onChange={e => setPrestasiForm({ ...prestasiForm, kelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Peringkat / Capaian</label>
              <input
                type="text"
                value={prestasiForm.peringkat}
                onChange={e => setPrestasiForm({ ...prestasiForm, peringkat: e.target.value })}
                placeholder="Juara 1 / Medali Emas"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Lomba / Kejuaraan</label>
              <input
                type="text"
                value={prestasiForm.namaLomba}
                onChange={e => setPrestasiForm({ ...prestasiForm, namaLomba: e.target.value })}
                placeholder="Contoh: Olimpiade Sains Nasional (OSN) Matematika"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tingkat Kejuaraan</label>
              <select
                value={prestasiForm.tingkat}
                onChange={e => setPrestasiForm({ ...prestasiForm, tingkat: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Kecamatan">Kecamatan</option>
                <option value="Kota Makassar">Kota Makassar</option>
                <option value="Provinsi Sulawesi Selatan">Provinsi Sulawesi Selatan</option>
                <option value="Nasional">Nasional</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penyelenggara</label>
              <input
                type="text"
                value={prestasiForm.penyelenggara}
                onChange={e => setPrestasiForm({ ...prestasiForm, penyelenggara: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Guru Pembimbing</label>
              <input
                type="text"
                value={prestasiForm.pembimbing}
                onChange={e => setPrestasiForm({ ...prestasiForm, pembimbing: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPrestasiModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
            >
              Simpan Prestasi
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Karakter */}
      <Modal
        isOpen={isKarakterModalOpen}
        onClose={() => setIsKarakterModalOpen(false)}
        title="Tambah Program Karakter Murid"
        subtitle="Entri pembiasaan positif dan projek penguatan profil pelajar Pancasila"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addProgramKarakter(karakterForm);
            setIsKarakterModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dimensi Karakter</label>
              <select
                value={karakterForm.dimensi}
                onChange={e => setKarakterForm({ ...karakterForm, dimensi: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="Beriman & Bertakwa">Beriman & Bertakwa</option>
                <option value="Berkebinekaan Global">Berkebinekaan Global</option>
                <option value="Gotong Royong">Gotong Royong</option>
                <option value="Mandiri">Mandiri</option>
                <option value="Bernalar Kritis">Bernalar Kritis</option>
                <option value="Kreatif">Kreatif</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jadwal Rutin</label>
              <input
                type="text"
                value={karakterForm.jadwalRutin}
                onChange={e => setKarakterForm({ ...karakterForm, jadwalRutin: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Kegiatan Pembiasaan</label>
              <input
                type="text"
                value={karakterForm.namaKegiatan}
                onChange={e => setKarakterForm({ ...karakterForm, namaKegiatan: e.target.value })}
                placeholder="Contoh: Sholat Dhuha Berjamaah & Tadarus Pagi"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kegiatan</label>
              <textarea
                rows={2}
                value={karakterForm.deskripsi}
                onChange={e => setKarakterForm({ ...karakterForm, deskripsi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Evaluasi & Capaian</label>
              <input
                type="text"
                value={karakterForm.evaluasiCapaian}
                onChange={e => setKarakterForm({ ...karakterForm, evaluasiCapaian: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsKarakterModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
            >
              Simpan Program
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Ekskul */}
      <Modal
        isOpen={isEkskulModalOpen}
        onClose={() => setIsEkskulModalOpen(false)}
        title="Tambah Ekstrakurikuler"
        subtitle="Entri kegiatan pengembangan minat dan bakat"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addEkskul(ekskulForm);
            setIsEkskulModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Ekstrakurikuler</label>
              <input
                type="text"
                value={ekskulForm.namaEkskul}
                onChange={e => setEkskulForm({ ...ekskulForm, namaEkskul: e.target.value })}
                placeholder="Pramuka Gugus Depan / Seni Tari Gandrang Bulo"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Guru Pembina</label>
              <input
                type="text"
                value={ekskulForm.pembina}
                onChange={e => setEkskulForm({ ...ekskulForm, pembina: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jumlah Anggota</label>
              <input
                type="number"
                value={ekskulForm.jumlahAnggota}
                onChange={e => setEkskulForm({ ...ekskulForm, jumlahAnggota: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jadwal Latihan</label>
              <input
                type="text"
                value={ekskulForm.hariLatihan}
                onChange={e => setEkskulForm({ ...ekskulForm, hariLatihan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tempat / Lokasi</label>
              <input
                type="text"
                value={ekskulForm.tempat}
                onChange={e => setEkskulForm({ ...ekskulForm, tempat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Prestasi Terbaru</label>
              <input
                type="text"
                value={ekskulForm.prestasiTerbaru}
                onChange={e => setEkskulForm({ ...ekskulForm, prestasiTerbaru: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEkskulModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
            >
              Simpan Ekskul
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Masalah / BK */}
      <Modal
        isOpen={isMasalahModalOpen}
        onClose={() => setIsMasalahModalOpen(false)}
        title={editingMasalah ? 'Edit Layanan BK' : 'Catat Penanganan Kasus & BK'}
        subtitle="Entri bimbingan konseling dan penanganan masalah peserta didik"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editingMasalah) {
              updateMasalahSiswa(editingMasalah.id, masalahForm);
            } else {
              addMasalahSiswa(masalahForm);
            }
            setIsMasalahModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Siswa</label>
              <input
                type="text"
                value={masalahForm.namaSiswa}
                onChange={e => setMasalahForm({ ...masalahForm, namaSiswa: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
              <input
                type="text"
                value={masalahForm.kelas}
                onChange={e => setMasalahForm({ ...masalahForm, kelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Kasus</label>
              <input
                type="text"
                value={masalahForm.jenisKasus}
                onChange={e => setMasalahForm({ ...masalahForm, jenisKasus: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Penanganan</label>
              <select
                value={masalahForm.status}
                onChange={e => setMasalahForm({ ...masalahForm, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="Dalam Pemantauan">Dalam Pemantauan</option>
                <option value="Selesai">Selesai</option>
                <option value="Butuh Rujukan">Butuh Rujukan</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kasus / Masalah</label>
              <textarea
                rows={2}
                value={masalahForm.deskripsiMasalah}
                onChange={e => setMasalahForm({ ...masalahForm, deskripsiMasalah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Tindakan Penanganan / Konseling</label>
              <textarea
                rows={2}
                value={masalahForm.tindakanPenanganan}
                onChange={e => setMasalahForm({ ...masalahForm, tindakanPenanganan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Hasil Tindak Lanjut</label>
              <input
                type="text"
                value={masalahForm.hasilTindakLanjut}
                onChange={e => setMasalahForm({ ...masalahForm, hasilTindakLanjut: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsMasalahModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold"
            >
              Simpan Penanganan
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Massal Siswa Modal */}
      <UploadMassalSiswaModal
        isOpen={isUploadMassalModalOpen}
        onClose={() => setIsUploadMassalModalOpen(false)}
        onSuccess={(newStudents) => {
          bulkAddSiswa(newStudents);
        }}
        existingSiswa={siswaList}
        availableClasses={Array.from(new Set([...(kelasList || []).map(k => k.namaKelas), ...(siswaList || []).map(s => s.kelas)])).sort()}
      />
    </div>
  );
};
