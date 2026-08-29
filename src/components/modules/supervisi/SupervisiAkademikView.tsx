import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SupervisiAkademik } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  FileCheck2,
  Calendar,
  UserCheck,
  Plus,
  Search,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  ClipboardList,
  Sparkles,
  Award
} from 'lucide-react';

export const SupervisiAkademikView: React.FC = () => {
  const {
    supervisiAkademikList,
    addSupervisiAkademik,
    updateSupervisiAkademik,
    deleteSupervisiAkademik,
    ptkList,
    currentUser
  } = useApp();

  const isGuru = currentUser.role === 'guru';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<SupervisiAkademik | null>(null);
  const [editingItem, setEditingItem] = useState<SupervisiAkademik | null>(null);

  const [formData, setFormData] = useState<Omit<SupervisiAkademik, 'id'>>({
    namaGuru: '',
    nip: '',
    mataPelajaran: 'Bahasa Indonesia (Kurikulum Merdeka)',
    kelas: 'Kelas 4A',
    jadwalTanggal: new Date().toISOString().split('T')[0],
    jamKe: 'Jam 1 - 3 (07.30 - 09.15)',
    supervisor: 'Dra. Hj. Ratna, M.Pd.',
    kesiapanModulAjar: 92,
    kesiapanMedia: 90,
    kesiapanAsesmen: 88,
    catatanPraObservasi: 'Modul ajar berdiferensiasi dan instrumen asesmen formatif lengkap.',
    skorApersepsi: 90,
    skorPenguasaanMateri: 92,
    skorPendekatanBerdiferensiasi: 88,
    skorInteraksiSiswa: 94,
    skorPemanfaatanTeknologi: 90,
    skorAsesmenFormatif: 90,
    totalSkor: 90.7,
    kategoriNilai: 'Amat Baik',
    umpanBalik: 'Pembelajaran aktif dan interaktif dengan partisipasi murid yang sangat baik.',
    kelebihan: 'Pengelolaan kelas kondusif dan pemanfaatan media Chromebook sangat efektif.',
    areaPeningkatan: 'Perlu penguatan pada asesmen diferensiasi konten untuk kelompok lambat belajar.',
    tindakLanjut: 'Mengikuti workshop pembuatan rubrik diferensiasi di KKG Gugus II.',
    status: 'Observasi Selesai'
  });

  const safeSupervisiList = supervisiAkademikList || [];

  const filteredList = safeSupervisiList.filter(s => {
    const matchCat = selectedKategori === 'Semua' || s.status === selectedKategori;
    const matchSearch =
      (s.namaGuru || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.mataPelajaran || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.kelas || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.supervisor || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    const safePTK = ptkList || [];
    const defaultGuru = safePTK.length > 0 ? safePTK[0] : null;
    setFormData({
      namaGuru: defaultGuru ? defaultGuru.nama : '',
      nip: defaultGuru ? defaultGuru.nip : '',
      mataPelajaran: 'IPAS (Fase B)',
      kelas: 'Kelas 4A',
      jadwalTanggal: new Date().toISOString().split('T')[0],
      jamKe: 'Jam 1 - 3 (07.30 - 09.15)',
      supervisor: 'Kepala Sekolah',
      kesiapanModulAjar: 90,
      kesiapanMedia: 88,
      kesiapanAsesmen: 86,
      catatanPraObservasi: 'Perangkat pembelajaran lengkap, siap observasi kelas.',
      skorApersepsi: 88,
      skorPenguasaanMateri: 90,
      skorPendekatanBerdiferensiasi: 86,
      skorInteraksiSiswa: 92,
      skorPemanfaatanTeknologi: 88,
      skorAsesmenFormatif: 86,
      totalSkor: 88.3,
      kategoriNilai: 'Baik',
      umpanBalik: 'Pelaksanaan pembelajaran berjalan baik dan kontekstual.',
      kelebihan: 'Komunikasi positif dan keterlibatan aktif peserta didik.',
      areaPeningkatan: 'Variasi pertanyaan pemantik untuk memicu penalaran kritis.',
      tindakLanjut: 'Berbagi praktik baik di komunitas belajar sekolah.',
      status: 'Observasi Selesai'
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: SupervisiAkademik) => {
    setEditingItem(item);
    setFormData({
      namaGuru: item.namaGuru,
      nip: item.nip,
      mataPelajaran: item.mataPelajaran,
      kelas: item.kelas,
      jadwalTanggal: item.jadwalTanggal,
      jamKe: item.jamKe,
      supervisor: item.supervisor,
      kesiapanModulAjar: item.kesiapanModulAjar,
      kesiapanMedia: item.kesiapanMedia,
      kesiapanAsesmen: item.kesiapanAsesmen,
      catatanPraObservasi: item.catatanPraObservasi,
      skorApersepsi: item.skorApersepsi,
      skorPenguasaanMateri: item.skorPenguasaanMateri,
      skorPendekatanBerdiferensiasi: item.skorPendekatanBerdiferensiasi,
      skorInteraksiSiswa: item.skorInteraksiSiswa,
      skorPemanfaatanTeknologi: item.skorPemanfaatanTeknologi,
      skorAsesmenFormatif: item.skorAsesmenFormatif,
      totalSkor: item.totalSkor,
      kategoriNilai: item.kategoriNilai,
      umpanBalik: item.umpanBalik,
      kelebihan: item.kelebihan,
      areaPeningkatan: item.areaPeningkatan,
      tindakLanjut: item.tindakLanjut,
      status: item.status
    });
    setIsAddModalOpen(true);
  };

  const handleTeacherSelect = (teacherName: string) => {
    const t = ptkList.find(p => p.nama === teacherName);
    if (t) {
      setFormData(prev => ({
        ...prev,
        namaGuru: t.nama,
        nip: t.nip,
        mataPelajaran: t.jabatan.includes('Guru') ? t.jabatan : prev.mataPelajaran
      }));
    }
  };

  const calculateTotal = (data: typeof formData) => {
    const sum =
      data.skorApersepsi +
      data.skorPenguasaanMateri +
      data.skorPendekatanBerdiferensiasi +
      data.skorInteraksiSiswa +
      data.skorPemanfaatanTeknologi +
      data.skorAsesmenFormatif;
    const avg = parseFloat((sum / 6).toFixed(1));
    let cat: 'Amat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan' = 'Baik';
    if (avg >= 91) cat = 'Amat Baik';
    else if (avg >= 81) cat = 'Baik';
    else if (avg >= 71) cat = 'Cukup';
    else cat = 'Perlu Bimbingan';
    return { avg, cat };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { avg, cat } = calculateTotal(formData);
    const finalData = {
      ...formData,
      totalSkor: avg,
      kategoriNilai: cat
    };

    if (editingItem) {
      updateSupervisiAkademik(editingItem.id, finalData);
    } else {
      addSupervisiAkademik(finalData);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 mb-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Manajemen Supervisi • Modul 1</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Supervisi Akademik Pembelajaran Guru
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Siklus utuh 7 tahapan supervisi: Program, Jadwal, Pra Observasi, Pelaksanaan Observasi Kelas, Pasca Observasi, Umpan Balik, dan Rencana Tindak Lanjut.
          </p>
        </div>

        {!isGuru && (
          <button
            id="btn-tambah-supervisi-akademik"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Supervisi Akademik</span>
          </button>
        )}
      </div>

      {/* 7-Step Cycle Indicator */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          7 Siklus Supervisi Akademik Kurikulum Merdeka
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'Program', desc: 'Rencana Tahunan' },
            { step: '2', title: 'Jadwal', desc: 'Penjadwalan Guru' },
            { step: '3', title: 'Pra Observasi', desc: 'Kesiapan Modul' },
            { step: '4', title: 'Observasi', desc: 'Pelaksanaan Kelas' },
            { step: '5', title: 'Pasca Observasi', desc: 'Refleksi Bersama' },
            { step: '6', title: 'Umpan Balik', desc: 'Catatan & Saran' },
            { step: '7', title: 'Tindak Lanjut', desc: 'Pengembangan PKB' }
          ].map(s => (
            <div key={s.step} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-1">
                {s.step}
              </div>
              <div className="font-bold text-slate-800 text-[11px]">{s.title}</div>
              <div className="text-[10px] text-slate-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari guru, mata pelajaran, supervisor, atau kelas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
          />
        </div>

        <select
          value={selectedKategori}
          onChange={e => setSelectedKategori(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
        >
          <option value="Semua">Semua Status</option>
          <option value="Terjadwal">Terjadwal</option>
          <option value="Pra-Observasi">Pra-Observasi</option>
          <option value="Observasi Selesai">Observasi Selesai</option>
          <option value="Tuntas Ditindaklanjuti">Tuntas Ditindaklanjuti</option>
        </select>
      </div>

      {/* Grid List of Supervisi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {item.kelas}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Tuntas Ditindaklanjuti'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Observasi Selesai'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.namaGuru}
              </h3>
              <div className="text-xs font-semibold text-blue-700">{item.mataPelajaran}</div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 my-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400">Jadwal:</span> {item.jadwalTanggal}
                </div>
                <div>
                  <span className="text-slate-400">Waktu:</span> {item.jamKe}
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Supervisor:</span> {item.supervisor}
                </div>
              </div>

              {/* Score card */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-blue-800">
                    Nilai Observasi
                  </div>
                  <div className="text-lg font-black text-blue-900">
                    {item.totalSkor} / 100
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs">
                  {item.kategoriNilai}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-800">Umpan Balik:</span> {item.umpanBalik}
                </div>
                <div>
                  <span className="font-bold text-slate-800">Rencana Tindak Lanjut:</span> {item.tindakLanjut}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setViewingItem(item)}
                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="Lihat Detail Supervisi"
              >
                <Eye className="w-4 h-4" />
              </button>
              {!isGuru && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Supervisi"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSupervisiAkademik(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Supervisi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail View */}
      {viewingItem && (
        <Modal
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          title={`Detail Hasil Supervisi: ${viewingItem.namaGuru}`}
          subtitle={`Mata Pelajaran ${viewingItem.mataPelajaran} (${viewingItem.kelas})`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400">Guru:</span> <strong>{viewingItem.namaGuru}</strong>
              </div>
              <div>
                <span className="text-slate-400">NIP:</span> {viewingItem.nip || '-'}
              </div>
              <div>
                <span className="text-slate-400">Tanggal Observasi:</span> {viewingItem.jadwalTanggal} ({viewingItem.jamKe})
              </div>
              <div>
                <span className="text-slate-400">Supervisor:</span> <strong>{viewingItem.supervisor}</strong>
              </div>
            </div>

            {/* Pra observasi */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>1. Tahap Pra Observasi (Kesiapan Dokumen & Perangkat)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-slate-50">
                  <div className="text-slate-400">Modul Ajar</div>
                  <div className="font-bold text-slate-900">{viewingItem.kesiapanModulAjar}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50">
                  <div className="text-slate-400">Media Pembelajaran</div>
                  <div className="font-bold text-slate-900">{viewingItem.kesiapanMedia}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50">
                  <div className="text-slate-400">Instrumen Asesmen</div>
                  <div className="font-bold text-slate-900">{viewingItem.kesiapanAsesmen}%</div>
                </div>
              </div>
              <div className="text-slate-600 italic">{viewingItem.catatanPraObservasi}</div>
            </div>

            {/* Observasi Pembelajaran */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>2. Tahap Observasi Pelaksanaan Pembelajaran</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                  Skor: {viewingItem.totalSkor} ({viewingItem.kategoriNilai})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 flex justify-between">
                  <span>Apersepsi & Motivasi:</span> <strong>{viewingItem.skorApersepsi}</strong>
                </div>
                <div className="p-2 rounded bg-slate-50 flex justify-between">
                  <span>Penguasaan Materi:</span> <strong>{viewingItem.skorPenguasaanMateri}</strong>
                </div>
                <div className="p-2 rounded bg-slate-50 flex justify-between">
                  <span>Pembelajaran Berdiferensiasi:</span> <strong>{viewingItem.skorPendekatanBerdiferensiasi}</strong>
                </div>
                <div className="p-2 rounded bg-slate-50 flex justify-between">
                  <span>Interaksi & Partisipasi:</span> <strong>{viewingItem.skorInteraksiSiswa}</strong>
                </div>
                <div className="p-2 rounded bg-slate-50 flex justify-between">
                  <span>Pemanfaatan TIK / Media:</span> <strong>{viewingItem.skorPemanfaatanTeknologi}</strong>
                </div>
                <div className="p-2 rounded bg-slate-50 flex justify-between">
                  <span>Asesmen Formatif:</span> <strong>{viewingItem.skorAsesmenFormatif}</strong>
                </div>
              </div>
            </div>

            {/* Pasca Observasi & Umpan Balik */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>3. Pasca Observasi, Umpan Balik & Tindak Lanjut</span>
              </div>
              <div className="space-y-1.5">
                <p>
                  <strong>Kelebihan:</strong> {viewingItem.kelebihan}
                </p>
                <p>
                  <strong>Area Peningkatan:</strong> {viewingItem.areaPeningkatan}
                </p>
                <p>
                  <strong>Umpan Balik Supervisor:</strong> {viewingItem.umpanBalik}
                </p>
                <p className="p-2 rounded bg-emerald-50 text-emerald-900 font-medium">
                  <strong>Rencana Tindak Lanjut:</strong> {viewingItem.tindakLanjut}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium"
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
        title={editingItem ? 'Edit Supervisi Akademik' : 'Tambah Supervisi Akademik'}
        subtitle="Entri instrumen pra observasi, penilaian kelas, dan tindak lanjut"
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Guru yang Disupervisi</label>
              <select
                value={formData.namaGuru}
                onChange={e => handleTeacherSelect(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="" disabled>-- Pilih Guru --</option>
                {ptkList.map(p => (
                  <option key={p.id} value={p.nama}>
                    {p.nama} ({p.jabatan})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran / Tema</label>
              <input
                type="text"
                value={formData.mataPelajaran}
                onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas & Rombel</label>
              <input
                type="text"
                value={formData.kelas}
                onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supervisor (Penilai)</label>
              <input
                type="text"
                value={formData.supervisor}
                onChange={e => setFormData({ ...formData, supervisor: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Supervisi</label>
              <input
                type="date"
                value={formData.jadwalTanggal}
                onChange={e => setFormData({ ...formData, jadwalTanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Pelaksanaan</label>
              <input
                type="text"
                value={formData.jamKe}
                onChange={e => setFormData({ ...formData, jamKe: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Skor Observasi */}
            <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-2">Nilai Komponen Observasi Kelas (1 - 100):</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Apersepsi</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.skorApersepsi}
                    onChange={e => setFormData({ ...formData, skorApersepsi: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Penguasaan Materi</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.skorPenguasaanMateri}
                    onChange={e => setFormData({ ...formData, skorPenguasaanMateri: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Diferensiasi</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.skorPendekatanBerdiferensiasi}
                    onChange={e => setFormData({ ...formData, skorPendekatanBerdiferensiasi: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Interaksi Siswa</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.skorInteraksiSiswa}
                    onChange={e => setFormData({ ...formData, skorInteraksiSiswa: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Media / TIK</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.skorPemanfaatanTeknologi}
                    onChange={e => setFormData({ ...formData, skorPemanfaatanTeknologi: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Asesmen Formatif</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formData.skorAsesmenFormatif}
                    onChange={e => setFormData({ ...formData, skorAsesmenFormatif: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Umpan Balik & Catatan Supervisor</label>
              <textarea
                rows={2}
                value={formData.umpanBalik}
                onChange={e => setFormData({ ...formData, umpanBalik: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut Guru</label>
              <textarea
                rows={2}
                value={formData.tindakLanjut}
                onChange={e => setFormData({ ...formData, tindakLanjut: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
