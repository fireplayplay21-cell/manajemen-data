import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProfilSekolah } from '../../../types';
import { Modal } from '../../common/Modal';
import { DEFAULT_LOGO_SEKOLAH } from '../../../data/brandingAssets';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  Edit,
  Save,
  Check,
  Calendar,
  CalendarDays,
  Sparkles,
  Edit3,
  Database,
  RefreshCw,
  ArrowRight,
  Lock,
  Upload
} from 'lucide-react';

const TAHUN_PELAJARAN_OPTIONS = [
  '2023/2024',
  '2024/2025',
  '2025/2026',
  '2026/2027',
  '2027/2028',
  '2028/2029'
];

const SEMESTER_OPTIONS = [
  'Semester Ganjil',
  'Semester Genap',
  'Semester 1 (Ganjil)',
  'Semester 2 (Genap)'
];

export const ProfilSekolahView: React.FC = () => {
  const {
    profilSekolah,
    updateProfilSekolah,
    currentUser,
    setActiveTab,
    databaseSekolahList,
    activeDatabaseSekolah,
    sinkronkanKeProfilSekolah,
    showToast
  } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSelectDatabaseModalOpen, setIsSelectDatabaseModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProfilSekolah>(profilSekolah);
  const [isCustomTahun, setIsCustomTahun] = useState(false);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'kepala_sekolah';

  const handleOpenEdit = () => {
    setFormData(profilSekolah);
    const isCustom = !TAHUN_PELAJARAN_OPTIONS.includes(profilSekolah.tahunPelajaran || '2024/2025');
    setIsCustomTahun(isCustom);
    setIsEditModalOpen(true);
  };

  const handleAutoFillFromDatabase = (targetDb?: any) => {
    const target = targetDb || activeDatabaseSekolah || databaseSekolahList[0];
    if (!target) return;
    setFormData(prev => ({
      ...prev,
      namaSekolah: target.namaSekolah,
      tahunPelajaran: target.tahunPelajaran,
      semester: target.semesterAktif,
      npsn: target.npsn,
      statusSekolah: target.statusSekolah,
      bentukPendidikan: target.bentukPendidikan,
      kurikulum: target.kurikulum,
      kepalaSekolah: target.namaKepalaSekolah,
      nipKepalaSekolah: target.nipKepalaSekolah,
      telepon: target.kontakTelepon,
      email: target.kontakEmail,
      website: target.website,
      alamat: target.alamatSekolah,
      akreditasi: target.akreditasi
    }));
    showToast('info', 'Data Diisi dari Database Sekolah', `Parameter profil berhasil diselaraskan dengan Database Sekolah "${target.namaSekolah}".`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilSekolah(formData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 p-1.5 flex items-center justify-center shadow-md shadow-blue-500/10 overflow-hidden">
              <img
                src={profilSekolah.logoUrl || DEFAULT_LOGO_SEKOLAH}
                alt="Logo Sekolah Resmi Terkunci"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_LOGO_SEKOLAH;
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <span
              title="Logo Resmi Terkunci & Dilindungi"
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
            >
              <Lock className="w-2.5 h-2.5" />
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                NPSN: {profilSekolah.npsn}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                Akreditasi {profilSekolah.akreditasi}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                <Calendar className="w-3 h-3 text-purple-500" />
                TP {profilSekolah.tahunPelajaran || '2024/2025'} {profilSekolah.semester ? `• ${profilSekolah.semester}` : ''}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              Profil Sekolah {profilSekolah.namaSekolah} Kota Makassar
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{profilSekolah.alamat}, Kel. {profilSekolah.kelurahan}, Kec. {profilSekolah.kecamatan}, {profilSekolah.kota}</span>
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {currentUser.role === 'admin' && (
              <button
                type="button"
                id="btn-nav-to-logo-branding"
                onClick={() => setActiveTab('pengaturan')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors shrink-0 cursor-pointer shadow-xs"
                title="Buka Pengaturan untuk Unggah & Kunci Logo Sekolah"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Unggah / Kunci Logo</span>
              </button>
            )}

            <button
              id="btn-ambil-dari-database-sekolah"
              type="button"
              onClick={() => setIsSelectDatabaseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              title="Ambil dan Sinkronkan Data dari Database Sekolah"
            >
              <Database className="w-4 h-4" />
              <span>Ambil Data dari Database</span>
            </button>

            <button
              id="btn-edit-profil-sekolah"
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Data Profil</span>
            </button>
          </div>
        )}
      </div>

      {/* Database Sekolah Synchronization & Connection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs">
        <div className="flex items-center gap-3 text-emerald-950">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-900">Database Sekolah Terhubung:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800 text-[10px] font-black">
                {activeDatabaseSekolah?.tahunPelajaran ? `TP ${activeDatabaseSekolah.tahunPelajaran} • ${activeDatabaseSekolah.semesterAktif}` : 'Master Aktif'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              {activeDatabaseSekolah?.namaSekolah || profilSekolah.namaSekolah} • Pimpinan: <span className="font-bold">{activeDatabaseSekolah?.namaKepalaSekolah || profilSekolah.kepalaSekolah}</span> (NIP. {activeDatabaseSekolah?.nipKepalaSekolah || profilSekolah.nipKepalaSekolah})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('database-sekolah')}
            className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 transition-colors cursor-pointer"
          >
            Kelola Master Database
          </button>
          <button
            type="button"
            onClick={() => sinkronkanKeProfilSekolah()}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            title="Tarik data master terbaru dari Database Sekolah ke profil ini"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tarik & Sinkronkan</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Identitas Utama */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Identitas Satuan Pendidikan</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Nama Sekolah:</span>
              <span className="font-semibold text-slate-800 text-right">{profilSekolah.namaSekolah}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Tahun Pelajaran:</span>
              <span className="font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-500" />
                {profilSekolah.tahunPelajaran || '2024/2025'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Semester Aktif:</span>
              <span className="font-medium text-slate-800">{profilSekolah.semester || 'Semester Ganjil'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">NPSN:</span>
              <span className="font-semibold text-slate-800">{profilSekolah.npsn}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">NSS:</span>
              <span className="font-semibold text-slate-800">{profilSekolah.nss}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Status Sekolah:</span>
              <span className="font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">{profilSekolah.statusSekolah}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Bentuk Pendidikan:</span>
              <span className="font-semibold text-slate-800">{profilSekolah.bentukPendidikan}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Kurikulum:</span>
              <span className="font-semibold text-slate-800">{profilSekolah.kurikulum}</span>
            </div>
            <div className="py-1.5 border-b border-slate-50">
              <span className="text-slate-500 block mb-0.5">Kepala Sekolah:</span>
              <span className="font-bold text-blue-900 block">{profilSekolah.kepalaSekolah}</span>
              <span className="text-[11px] text-slate-500">NIP. {profilSekolah.nipKepalaSekolah}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Kontak & Lokasi Resmi</span>
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{profilSekolah.telepon}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-blue-600">{profilSekolah.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <a href={profilSekolah.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {profilSekolah.website}
              </a>
            </div>
          </div>
        </div>

        {/* Visi, Misi & Semboyan Kearifan Lokal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visi Misi Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Visi Sekolah</div>
              <blockquote className="mt-2 p-4 rounded-xl bg-blue-50/70 border-l-4 border-blue-600 text-sm font-semibold text-slate-800 leading-relaxed italic">
                "{profilSekolah.visi}"
              </blockquote>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Misi Satuan Pendidikan</div>
              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                {profilSekolah.misi.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tujuan Strategis Sekolah</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profilSekolah.tujuan.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 text-xs text-slate-700">
                    <span className="font-bold text-blue-600 mr-1.5">{idx + 1}.</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Semboyan Budaya Makassar */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-200/80 p-5 text-amber-950 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Nilai Budaya Kearifan Lokal Kota Makassar
              </h4>
              <p className="text-sm font-bold text-amber-900 mt-1">
                {profilSekolah.semboyan}
              </p>
              <p className="text-xs text-amber-800/80 mt-1">
                Menghargai sesama (Sipakatau), saling memuliakan (Sipakalebbi), dan saling mengingatkan dalam kebaikan (Sipakainge).
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profil Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profil Sekolah"
        subtitle="Ubah data identitas, tahun pelajaran, visi misi, dan kontak resmi SDN Lanto Dg. Pasewang"
        maxWidth="3xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Quick Sync from Database Sekolah Button */}
          {databaseSekolahList.length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950 text-xs">Tersedia Master Database Sekolah</p>
                  <p className="text-[11px] text-emerald-700">Isi otomatis seluruh data identitas, pimpinan, dan kontak dari database pusat.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAutoFillFromDatabase()}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Isi Otomatis</span>
              </button>
            </div>
          )}

          {/* Section: Tahun Pelajaran & Semester Aktif */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Pengaturan Tahun Pelajaran & Semester</h4>
                  <p className="text-[11px] text-slate-500">Pilih dari daftar cepat atau isi secara manual</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomTahun(!isCustomTahun)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isCustomTahun ? 'Pilih dari Daftar' : 'Isi Manual'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Tahun Pelajaran Input / Select */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tahun Pelajaran (TP)
                </label>

                {!isCustomTahun ? (
                  <div className="space-y-2">
                    <select
                      id="select-tahun-pelajaran"
                      value={formData.tahunPelajaran || '2024/2025'}
                      onChange={e => {
                        if (e.target.value === '__custom__') {
                          setIsCustomTahun(true);
                        } else {
                          setFormData({ ...formData, tahunPelajaran: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
                    >
                      {TAHUN_PELAJARAN_OPTIONS.map(tp => (
                        <option key={tp} value={tp}>
                          Tahun Pelajaran {tp}
                        </option>
                      ))}
                      <option value="__custom__">➕ Isi Manual Lainnya...</option>
                    </select>

                    {/* Quick Selection Chips */}
                    <div className="flex flex-wrap gap-1">
                      {TAHUN_PELAJARAN_OPTIONS.slice(0, 4).map(tp => {
                        const isSelected = (formData.tahunPelajaran || '2024/2025') === tp;
                        return (
                          <button
                            key={tp}
                            type="button"
                            onClick={() => setFormData({ ...formData, tahunPelajaran: tp })}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {tp}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        id="input-manual-tahun-pelajaran"
                        type="text"
                        value={formData.tahunPelajaran || ''}
                        onChange={e => setFormData({ ...formData, tahunPelajaran: e.target.value })}
                        placeholder="Contoh: 2024/2025 atau 2025/2026"
                        className="w-full px-3 py-2 bg-white border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Ketikkan format tahun ajaran yang diinginkan (bebas isi manual).
                    </p>
                  </div>
                )}
              </div>

              {/* Semester Select */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Semester Aktif
                </label>
                <div className="space-y-2">
                  <select
                    id="select-semester"
                    value={formData.semester || 'Semester Ganjil'}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
                  >
                    {SEMESTER_OPTIONS.map(sem => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-1">
                    {['Semester Ganjil', 'Semester Genap'].map(sem => {
                      const isSelected = (formData.semester || 'Semester Ganjil') === sem;
                      return (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setFormData({ ...formData, semester: sem })}
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sem}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={formData.namaSekolah}
                onChange={e => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kepala Sekolah</label>
              <input
                type="text"
                value={formData.kepalaSekolah}
                onChange={e => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={e => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Akreditasi</label>
              <input
                type="text"
                value={formData.akreditasi}
                onChange={e => setFormData({ ...formData, akreditasi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kurikulum</label>
              <input
                type="text"
                value={formData.kurikulum}
                onChange={e => setFormData({ ...formData, kurikulum: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Visi Sekolah</label>
              <textarea
                rows={3}
                value={formData.visi}
                onChange={e => setFormData({ ...formData, visi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Semboyan Sekolah</label>
              <input
                type="text"
                value={formData.semboyan}
                onChange={e => setFormData({ ...formData, semboyan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Select Database Sekolah Modal */}
      <Modal
        isOpen={isSelectDatabaseModalOpen}
        onClose={() => setIsSelectDatabaseModalOpen(false)}
        title="Ambil Data dari Database Sekolah"
        subtitle="Pilih rekaman Master Database Sekolah untuk diterapkan langsung ke Profil Sekolah resmi"
        maxWidth="3xl"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <p className="font-semibold mb-0.5">Sinkronisasi Instan ke Profil Sekolah</p>
            Memilih salah satu data di bawah akan memperbarui 14 parameter pokok Profil Sekolah: nama sekolah, tahun pelajaran, semester, NPSN, status sekolah, bentuk pendidikan, kurikulum, nama kepala (terhubung database PTK), NIP, kontak telepon, email, website, alamat, dan akreditasi.
          </div>

          {databaseSekolahList.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
              <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Belum ada data pada Database Sekolah.</p>
              <button
                type="button"
                onClick={() => {
                  setIsSelectDatabaseModalOpen(false);
                  setActiveTab('database-sekolah');
                }}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Buat Data Baru di Database Sekolah
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {databaseSekolahList.map(item => {
                const isSelected = item.id === activeDatabaseSekolah?.id;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-400/40'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{item.namaSekolah}</h4>
                          {item.isAktif && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                              Database Aktif
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200">
                            TP {item.tahunPelajaran} • {item.semesterAktif}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          NPSN: {item.npsn} • Status: {item.statusSekolah} • Jenjang: {item.bentukPendidikan} • Akreditasi: {item.akreditasi}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            handleAutoFillFromDatabase(item);
                            setIsSelectDatabaseModalOpen(false);
                            setIsEditModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          title="Isi form dan edit terlebih dahulu sebelum simpan"
                        >
                          Isi Form Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sinkronkanKeProfilSekolah(item.id);
                            setIsSelectDatabaseModalOpen(false);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Terapkan ke Profil</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100 bg-slate-50/50 p-2.5 rounded-lg">
                      <div>
                        <span className="text-slate-400 block">Kepala Sekolah:</span>
                        <span className="font-bold text-slate-800">{item.namaKepalaSekolah}</span>
                        <span className="text-[10px] text-slate-500 block">NIP. {item.nipKepalaSekolah}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Kurikulum & Alamat:</span>
                        <span className="font-medium text-slate-700">{item.kurikulum}</span>
                        <span className="truncate block text-slate-500">{item.alamatSekolah}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Kontak & Web:</span>
                        <span>{item.kontakTelepon} • {item.kontakEmail}</span>
                        <span className="truncate block text-blue-600">{item.website}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsSelectDatabaseModalOpen(false);
                setActiveTab('database-sekolah');
              }}
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola dan tambah data di Master Database Sekolah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSelectDatabaseModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

