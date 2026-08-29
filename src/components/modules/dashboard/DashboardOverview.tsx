import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users,
  GraduationCap,
  FileCheck,
  TrendingUp,
  Wallet,
  Building2,
  Calendar,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    profilSekolah,
    setActiveTab,
    siswaList,
    ptkList,
    kelasList,
    perencanaanList,
    pbdList,
    rkasList,
    supervisiAkademikList,
    prestasiList,
    masalahSiswaList,
    agendaKSList,
    sarprasList,
    currentUser
  } = useApp();

  const safeSiswa = siswaList || [];
  const safePTK = ptkList || [];
  const safeKelas = kelasList || [];
  const safePerencanaan = perencanaanList || [];
  const safeRKAS = rkasList || [];
  const safeSupervisi = supervisiAkademikList || [];
  const safePBD = pbdList || [];
  const safeAgenda = agendaKSList || [];

  // Calculations
  const totalSiswa = safeSiswa.length;
  const totalPTK = safePTK.length;
  const totalDokumen = safePerencanaan.length;
  const totalAnggaran = safeRKAS.reduce((acc, curr) => acc + (curr.anggaranTotal || 0), 0);
  const totalRealisasi = safeRKAS.reduce((acc, curr) => acc + (curr.realisasiTotal || 0), 0);
  const persenRealisasi = totalAnggaran > 0 ? Math.round((totalRealisasi / totalAnggaran) * 100) : 0;

  const avgSupervisi =
    safeSupervisi.length > 0
      ? Math.round(
          safeSupervisi.reduce((acc, curr) => acc + (curr.totalSkor || 0), 0) /
            safeSupervisi.length
        )
      : 0;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0f172a] text-white p-6 sm:p-8 shadow-xs border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Sistem Informasi Manajemen Terpadu</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
            Selamat Datang di Portal Manajemen Data
          </h1>
          <p className="text-sm font-semibold text-blue-400 mt-1">
            {profilSekolah.namaSekolah} Kota Makassar
          </p>
          <p className="text-xs text-slate-300 mt-2.5 max-w-2xl leading-relaxed">
            Pusat kendali dan pelaporan data perencanaan sekolah, perencanaan berbasis data (PBD), kesiswaan, supervisi akademik & manajerial, keuangan BOSP, inventaris sarpras, serta administrasi kepala sekolah.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              id="btn-goto-pbd"
              type="button"
              onClick={() => setActiveTab('pbd')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Perencanaan Berbasis Data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-goto-administrasi-guru"
              type="button"
              onClick={() => setActiveTab('administrasi-guru')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Administrasi Guru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-goto-kesiswaan"
              type="button"
              onClick={() => setActiveTab('kesiswaan')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Data Kesiswaan</span>
            </button>
            <button
              id="btn-goto-supervisi"
              type="button"
              onClick={() => setActiveTab('supervisi-akademik')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Supervisi Guru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Siswa Terdata
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalSiswa}</span>
            <span className="text-xs text-slate-500 font-medium">Peserta Didik</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium inline-block border border-blue-100">
            {safeKelas.length > 0 ? `${safeKelas.length} Rombel Terdaftar` : '0 Rombel Terdaftar'}
          </div>
        </div>

        {/* PTK */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Guru & Tenaga Pendidik
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalPTK}</span>
            <span className="text-xs text-slate-500 font-medium">Personel</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium inline-block border border-indigo-100">
            {safePTK.filter(p => p.sertifikasi === 'Sudah Sertifikasi').length} Guru Bersertifikasi
          </div>
        </div>

        {/* Realisasi Keuangan */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Realisasi BOSP 2024
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{persenRealisasi}%</span>
            <span className="text-xs text-slate-500 font-medium">Terserap</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded truncate font-medium border border-emerald-100">
            {formatRupiah(totalRealisasi)} / {formatRupiah(totalAnggaran)}
          </div>
        </div>

        {/* Skor Supervisi */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Rata-rata Supervisi Guru
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgSupervisi > 0 ? avgSupervisi : 0}</span>
            <span className="text-xs text-violet-600 font-semibold">{avgSupervisi > 0 ? '/ 100' : 'Belum Ada Observasi'}</span>
          </div>
          <div className="mt-2 text-[11px] text-violet-700 bg-violet-50 px-2 py-0.5 rounded font-medium inline-block border border-violet-100">
            {safeSupervisi.length} Guru Telah Diobservasi
          </div>
        </div>
      </div>

      {/* Grid: Perencanaan Berbasis Data (PBD) Highlights & Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Rapor Pendidikan & PBD Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Ringkasan Rapor Pendidikan & PBD Sekolah</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi mutu capaian Asesmen Nasional UPTD SPF SDN Lanto Dg. Pasewang
              </p>
            </div>
            <button
              id="btn-all-pbd"
              type="button"
              onClick={() => setActiveTab('pbd')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>Lihat Detail PBD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {safePBD.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Dimensi {item.kode}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Skor: <span className="text-blue-600">{item.skorTahunIni}</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                  {item.indikator}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  <span className="font-semibold text-slate-700">Akar Masalah:</span> {item.akarMasalah}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">PJ: {item.penanggungJawab}</span>
                  <span className="px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-800">
                    {item.statusTindakLanjut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Agenda Kepala Sekolah & Catatan Terkini */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-600" />
                <span>Agenda Kepala Sekolah</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Kegiatan dan jadwal dinas terbaru</p>
            </div>
            <button
              id="btn-all-agenda"
              type="button"
              onClick={() => setActiveTab('administrasi-ks')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {safeAgenda.slice(0, 5).map(agenda => (
              <div
                key={agenda.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500">{agenda.tanggal}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {agenda.waktu}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 leading-snug">
                  {agenda.kegiatan}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>📍 {agenda.lokasi}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-700" />
              <span>Semboyan Sekolah</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed italic">
              "{profilSekolah.semboyan}"
            </p>
          </div>
        </div>

      </div>

      {/* Quick Navigation Cards to All Specific Requested Modules */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Akses Cepat Modul Manajemen Data Sekolah
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Pilih modul di bawah ini untuk mengelola data operasional dan administrasi secara lengkap:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Perencanaan */}
          <button
            type="button"
            onClick={() => setActiveTab('perencanaan')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Perencanaan</div>
            <div className="text-[10px] text-slate-500 mt-1">KSP, RKT, RKAS, Kalender</div>
          </button>

          {/* Kesiswaan */}
          <button
            type="button"
            onClick={() => setActiveTab('kesiswaan')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Kesiswaan</div>
            <div className="text-[10px] text-slate-500 mt-1">Presensi, Prestasi & Karakter</div>
          </button>

          {/* Supervisi */}
          <button
            type="button"
            onClick={() => setActiveTab('supervisi-akademik')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Supervisi</div>
            <div className="text-[10px] text-slate-500 mt-1">Observasi & Manajerial</div>
          </button>

          {/* Keuangan */}
          <button
            type="button"
            onClick={() => setActiveTab('keuangan')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Keuangan BOSP</div>
            <div className="text-[10px] text-slate-500 mt-1">RKAS & Pembukuan Kas</div>
          </button>

          {/* Sarpras */}
          <button
            type="button"
            onClick={() => setActiveTab('sarpras')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Sarpras</div>
            <div className="text-[10px] text-slate-500 mt-1">Inventaris & Kondisi</div>
          </button>

          {/* Enrol Pengguna */}
          <button
            type="button"
            onClick={() => setActiveTab('enrol-pengguna')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Enrol Pengguna</div>
            <div className="text-[10px] text-slate-500 mt-1">Akun Guru & Admin</div>
          </button>
        </div>
      </div>
    </div>
  );
};
