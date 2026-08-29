import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { PTKSection } from './PTKSection';
import { DataSiswaSection } from './DataSiswaSection';
import { DataKelasSection } from './DataKelasSection';
import {
  Database,
  Users,
  GraduationCap,
  School,
  Sparkles,
  Cloud,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const ManajemenDataView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    ptkList,
    siswaList,
    kelasList,
    isFirebaseConnected,
    isCloudSyncing,
    lastCloudSync,
    forceCloudSync
  } = useApp();

  // Determine initial subTab from activeTab
  const getSubTabFromActiveTab = (): 'ptk' | 'siswa' | 'kelas' => {
    if (activeTab === 'data-siswa') return 'siswa';
    if (activeTab === 'data-kelas') return 'kelas';
    return 'ptk';
  };

  const [activeSubTab, setActiveSubTab] = useState<'ptk' | 'siswa' | 'kelas'>(getSubTabFromActiveTab);

  // Sync state if global activeTab changes
  useEffect(() => {
    if (activeTab === 'data-ptk') {
      setActiveSubTab('ptk');
    } else if (activeTab === 'data-siswa') {
      setActiveSubTab('siswa');
    } else if (activeTab === 'data-kelas') {
      setActiveSubTab('kelas');
    }
  }, [activeTab]);

  const handleTabChange = (tab: 'ptk' | 'siswa' | 'kelas') => {
    setActiveSubTab(tab);
    if (tab === 'ptk') setActiveTab('data-ptk');
    if (tab === 'siswa') setActiveTab('data-siswa');
    if (tab === 'kelas') setActiveTab('data-kelas');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Database className="w-3.5 h-3.5" />
                Master Data Sekolah
              </span>
              {isFirebaseConnected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/20 text-teal-200 border border-teal-400/30">
                  <Cloud className="w-3 h-3 text-teal-300" />
                  Cloud Firestore Aktif
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Manajemen Data Pokok Pendidikan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Pusat pengelolaan terpadu data Pendidik & Tenaga Kependidikan (PTK), Peserta Didik (Data Siswa), dan Rombongan Belajar (Data Kelas) UPTD SPF SDN Lanto Dg. Pasewang.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={forceCloudSync}
              disabled={isCloudSyncing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors backdrop-blur-sm text-white disabled:opacity-50"
              title="Sinkronkan data ke Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              <span>{isCloudSyncing ? 'Menyinkronkan...' : 'Sinkron Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Header Badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-slate-300 text-[11px]">PTK Terdaftar</p>
              <p className="font-bold text-white text-base leading-tight">{ptkList.length} Guru/Tendik</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <p className="text-slate-300 text-[11px]">Total Siswa</p>
              <p className="font-bold text-white text-base leading-tight">{siswaList.length} Peserta Didik</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/20 flex items-center justify-center shrink-0">
              <School className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="text-slate-300 text-[11px]">Rombel / Kelas</p>
              <p className="font-bold text-white text-base leading-tight">{kelasList.length} Rombel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl border border-slate-300/60 shadow-inner max-w-fit">
        <button
          onClick={() => handleTabChange('ptk')}
          id="tab-btn-ptk"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === 'ptk'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>PTK (Pendidik & Tendik)</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
              activeSubTab === 'ptk'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-300/80 text-slate-700'
            }`}
          >
            {ptkList.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('siswa')}
          id="tab-btn-data-siswa"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === 'siswa'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Data Siswa</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
              activeSubTab === 'siswa'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-slate-300/80 text-slate-700'
            }`}
          >
            {siswaList.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('kelas')}
          id="tab-btn-data-kelas"
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSubTab === 'kelas'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <School className="w-4 h-4 text-amber-600" />
          <span>Data Kelas (Rombel)</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
              activeSubTab === 'kelas'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-300/80 text-slate-700'
            }`}
          >
            {kelasList.length}
          </span>
        </button>
      </div>

      {/* Main Content Sections */}
      {activeSubTab === 'ptk' && <PTKSection />}
      {activeSubTab === 'siswa' && <DataSiswaSection />}
      {activeSubTab === 'kelas' && <DataKelasSection />}
    </div>
  );
};
