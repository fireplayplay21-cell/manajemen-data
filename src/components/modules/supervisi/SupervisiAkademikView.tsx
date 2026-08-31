import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FormulirSupervisiLengkap } from '../../../types';
import { FormulirSupervisiModal } from './FormulirSupervisiModal';
import { FormulirSupervisiDetailModal } from './FormulirSupervisiDetailModal';
import {
  FileCheck2,
  Plus,
  Search,
  CheckCircle,
  Edit,
  Trash2,
  Sparkles,
  Printer,
  RefreshCw,
  ListChecks
} from 'lucide-react';

export const SupervisiAkademikView: React.FC = () => {
  const {
    formulirSupervisiList,
    addFormulirSupervisi,
    updateFormulirSupervisi,
    deleteFormulirSupervisi,
    syncFormulirToManajerial,
    currentUser
  } = useApp();

  const isGuru = currentUser.role === 'guru';

  // State for Formulir 3 Tahap
  const [searchFormulir, setSearchFormulir] = useState('');
  const [selectedKategoriFormulir, setSelectedKategoriFormulir] = useState('Semua');
  const [isFormulirModalOpen, setIsFormulirModalOpen] = useState(false);
  const [editingFormulir, setEditingFormulir] = useState<FormulirSupervisiLengkap | null>(null);
  const [viewingFormulir, setViewingFormulir] = useState<FormulirSupervisiLengkap | null>(null);

  const safeFormulirList = formulirSupervisiList || [];

  // Filter for Formulir 3 Tahap
  const filteredFormulirList = safeFormulirList.filter(f => {
    const matchKategori =
      selectedKategoriFormulir === 'Semua' ||
      f.observasi.kategoriHasil === selectedKategoriFormulir;
    const matchSearch =
      (f.namaGuru || '').toLowerCase().includes(searchFormulir.toLowerCase()) ||
      (f.mataPelajaran || '').toLowerCase().includes(searchFormulir.toLowerCase()) ||
      (f.kelas || '').toLowerCase().includes(searchFormulir.toLowerCase()) ||
      (f.namaSupervisor || '').toLowerCase().includes(searchFormulir.toLowerCase()) ||
      (f.observasi.catatanTambahan || '').toLowerCase().includes(searchFormulir.toLowerCase());
    return matchKategori && matchSearch;
  });

  // Formulir Actions
  const handleOpenAddFormulir = () => {
    setEditingFormulir(null);
    setIsFormulirModalOpen(true);
  };

  const handleOpenEditFormulir = (item: FormulirSupervisiLengkap) => {
    setEditingFormulir(item);
    setIsFormulirModalOpen(true);
  };

  const handleSaveFormulir = (data: Omit<FormulirSupervisiLengkap, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingFormulir) {
      updateFormulirSupervisi(editingFormulir.id, data);
    } else {
      addFormulirSupervisi(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manajemen Supervisi Pembelajaran Guru</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Supervisi Akademik Pembelajaran Guru
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Instrumen & Formulir Supervisi 3 Tahap (Pra-Observasi, Lembar Observasi 5 Komponen Inti, dan Pasca-Observasi) Kurikulum Merdeka.
          </p>
        </div>

        {!isGuru && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-tambah-formulir-supervisi-akademik"
              type="button"
              onClick={handleOpenAddFormulir}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Formulir Supervisi Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content: FORMULIR 3 TAHAP SUPERVISI (PRA, OBSERVASI 5 KOMPONEN, PASCA) */}
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Reference Info Card */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                Instrumen 3 Formulir Supervisi Observasi Kelas (5 Komponen Terpadu)
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Isian tabel 5 komponen (Diferensiasi, Alat Peraga/TIK, Kebebasan Berkelompok, Pendampingan Produk, dan Pendekatan Saintifik) otomatis disinkronkan ke <strong>Supervisi Manajerial (Standar Proses)</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-emerald-900 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300">
            <ListChecks className="w-4 h-4 text-emerald-700" />
            <span>Total Dokumen: {safeFormulirList.length}</span>
          </div>
        </div>

        {/* Search & Filter for Formulir */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama guru, mata pelajaran, kelas, atau supervisor..."
              value={searchFormulir}
              onChange={e => setSearchFormulir(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50"
            />
          </div>

          <select
            value={selectedKategoriFormulir}
            onChange={e => setSelectedKategoriFormulir(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Sangat Baik">Sangat Baik</option>
            <option value="Baik">Baik</option>
            <option value="Cukup">Cukup</option>
            <option value="Perlu Bimbingan">Perlu Bimbingan</option>
          </select>
        </div>

        {/* Grid Formulir 3 Tahap Cards */}
        {filteredFormulirList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 text-sm">Tidak ada formulir supervisi ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol "Buat Formulir Supervisi Baru" untuk memulai evaluasi pembelajaran guru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulirList.map(item => {
              const checkedCount = item.observasi.areaObservasi.filter(a => a.ada).length;
              const totalCount = item.observasi.areaObservasi.length || 5;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.mataPelajaran} • {item.kelas}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.observasi.kategoriHasil === 'Sangat Baik'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : item.observasi.kategoriHasil === 'Baik'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {item.observasi.kategoriHasil} ({checkedCount}/{totalCount})
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900">{item.namaGuru}</h3>
                      <p className="text-xs text-slate-500">
                        NIP. {item.nipGuru || '-'} • Supervisor: <span className="font-semibold text-slate-700">{item.namaSupervisor}</span>
                      </p>
                    </div>

                    {/* 3 Form Highlights */}
                    <div className="space-y-2 text-xs">
                      {/* Pra Observasi Snippet */}
                      <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                        <div className="font-bold text-blue-900 text-[11px] mb-0.5 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded bg-blue-200 text-blue-800 text-[9px] flex items-center justify-center font-black">
                            1
                          </span>
                          <span>Pra-Observasi (Tujuan & Fokus):</span>
                        </div>
                        <p className="text-blue-950 text-[11px] line-clamp-2 leading-relaxed">
                          {item.praObservasi.tujuanPembelajaran || 'Tujuan pembelajaran belum diisi'}
                        </p>
                      </div>

                      {/* Observasi 5 Komponen Status Bar */}
                      <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <div className="font-bold text-emerald-900 text-[11px] mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-emerald-200 text-emerald-800 text-[9px] flex items-center justify-center font-black">
                              2
                            </span>
                            <span>Observasi 5 Komponen Inti:</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800">
                            {checkedCount} dari 5 Terpenuhi
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {item.observasi.areaObservasi.map((comp) => (
                            <div
                              key={comp.id}
                              title={`${comp.komponen}: ${comp.ada ? 'Ada' : 'Belum Ada'}`}
                              className={`h-2 rounded-full transition-all ${
                                comp.ada ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Pasca Observasi Snippet */}
                      <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                        <div className="font-bold text-purple-900 text-[11px] mb-0.5 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded bg-purple-200 text-purple-800 text-[9px] flex items-center justify-center font-black">
                            3
                          </span>
                          <span>Pasca-Observasi & RTL:</span>
                        </div>
                        <p className="text-purple-950 text-[11px] line-clamp-2 leading-relaxed">
                          {item.pascaObservasi.rencanaTindakLanjut || item.pascaObservasi.rekomendasiAkhir || 'Rencana tindak lanjut dicatat.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span>{item.hariTanggal}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Tersinkron ke Manajerial</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {!isGuru && (
                        <button
                          type="button"
                          onClick={() => syncFormulirToManajerial(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer border border-emerald-200"
                          title="Sinkronkan nilai observasi 5 komponen ke Supervisi Manajerial"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Sinkronkan Manajerial</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setViewingFormulir(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        title="Buka Lembar Cetak & Preview Lengkap"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>Cetak / Detail</span>
                      </button>

                      {!isGuru && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEditFormulir(item)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Formulir Supervisi"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteFormulirSupervisi(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Formulir Supervisi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive 3-Stage Form Modal */}
      {isFormulirModalOpen && (
        <FormulirSupervisiModal
          isOpen={isFormulirModalOpen}
          onClose={() => {
            setIsFormulirModalOpen(false);
            setEditingFormulir(null);
          }}
          initialData={editingFormulir}
          onSave={handleSaveFormulir}
        />
      )}

      {/* Full Document Print & View Modal */}
      {viewingFormulir && (
        <FormulirSupervisiDetailModal
          isOpen={!!viewingFormulir}
          onClose={() => setViewingFormulir(null)}
          item={viewingFormulir}
          onEdit={
            !isGuru
              ? (item) => {
                  setViewingFormulir(null);
                  handleOpenEditFormulir(item);
                }
              : undefined
          }
        />
      )}
    </div>
  );
};
