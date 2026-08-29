import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SuratRecord, MOUKerjasama } from '../../../types';
import { Modal } from '../../common/Modal';
import { DriveFileUpload } from '../../common/DriveFileUpload';
import { TARGET_DRIVE_FOLDER_URL } from '../../../services/driveService';
import {
  Mail,
  FileText,
  Handshake,
  Plus,
  Search,
  Edit,
  Trash2,
  Inbox,
  Send,
  Calendar,
  CheckCircle2,
  HardDrive,
  ExternalLink
} from 'lucide-react';

export const ManajemenPTKView: React.FC = () => {
  const {
    suratList,
    addSurat,
    updateSurat,
    deleteSurat,
    mouList,
    addMOU,
    updateMOU,
    deleteMOU
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'surat' | 'mou'>('surat');
  const [searchQuery, setSearchQuery] = useState('');

  // Surat Modal State
  const [isSuratModalOpen, setIsSuratModalOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratRecord | null>(null);
  const [suratFormData, setSuratFormData] = useState<Omit<SuratRecord, 'id'>>({
    jenis: 'Surat Masuk',
    nomorSurat: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
    tanggalDiterimaKirim: new Date().toISOString().split('T')[0],
    pengirimPenerima: '',
    perihal: '',
    kategori: 'Dinas',
    disposisi: '',
    status: 'Diproses',
    fileLampiran: ''
  });

  // MOU Modal State
  const [isMOUModalOpen, setIsMOUModalOpen] = useState(false);
  const [editingMOU, setEditingMOU] = useState<MOUKerjasama | null>(null);
  const [mouFormData, setMOUFormData] = useState<Omit<MOUKerjasama, 'id'>>({
    mitra: '',
    bidang: '',
    nomorMOU: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalBerakhir: '',
    status: 'Aktif',
    programKerja: '',
    penanggungJawab: ''
  });

  // Surat Handlers
  const handleOpenAddSurat = () => {
    setSuratFormData({
      jenis: 'Surat Masuk',
      nomorSurat: '',
      tanggalSurat: new Date().toISOString().split('T')[0],
      tanggalDiterimaKirim: new Date().toISOString().split('T')[0],
      pengirimPenerima: '',
      perihal: '',
      kategori: 'Dinas',
      disposisi: '',
      status: 'Diproses',
      fileLampiran: ''
    });
    setEditingSurat(null);
    setIsSuratModalOpen(true);
  };

  const handleOpenEditSurat = (item: SuratRecord) => {
    setEditingSurat(item);
    setSuratFormData({
      jenis: item.jenis,
      nomorSurat: item.nomorSurat,
      tanggalSurat: item.tanggalSurat,
      tanggalDiterimaKirim: item.tanggalDiterimaKirim,
      pengirimPenerima: item.pengirimPenerima,
      perihal: item.perihal,
      kategori: item.kategori,
      disposisi: item.disposisi || '',
      status: item.status,
      fileLampiran: item.fileLampiran || ''
    });
    setIsSuratModalOpen(true);
  };

  const handleSaveSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSurat) {
      updateSurat(editingSurat.id, suratFormData);
    } else {
      addSurat(suratFormData);
    }
    setIsSuratModalOpen(false);
  };

  // MOU Handlers
  const handleOpenAddMOU = () => {
    setMOUFormData({
      mitra: '',
      bidang: '',
      nomorMOU: '',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalBerakhir: '',
      status: 'Aktif',
      programKerja: '',
      penanggungJawab: ''
    });
    setEditingMOU(null);
    setIsMOUModalOpen(true);
  };

  const handleOpenEditMOU = (item: MOUKerjasama) => {
    setEditingMOU(item);
    setMOUFormData({
      mitra: item.mitra,
      bidang: item.bidang,
      nomorMOU: item.nomorMOU,
      tanggalMulai: item.tanggalMulai,
      tanggalBerakhir: item.tanggalBerakhir,
      status: item.status,
      programKerja: item.programKerja,
      penanggungJawab: item.penanggungJawab
    });
    setIsMOUModalOpen(true);
  };

  const handleSaveMOU = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMOU) {
      updateMOU(editingMOU.id, mouFormData);
    } else {
      addMOU(mouFormData);
    }
    setIsMOUModalOpen(false);
  };

  // Filtered lists
  const safeSuratList = suratList || [];
  const safeMOUList = mouList || [];

  const filteredSurat = safeSuratList.filter(
    s =>
      (s.nomorSurat || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.perihal || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.pengirimPenerima || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMOU = safeMOUList.filter(
    m =>
      (m.mitra || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.bidang || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.programKerja || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-200 mb-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>Persuratan & MOU Kemitraan • Modul 4</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Tata Persuratan Dinas & MOU Kemitraan
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pengelolaan administrasi surat dinas (Surat Masuk & Keluar) serta Naskah Kerjasama Kemitraan (MOU) UPTD SPF SDN Lanto Dg. Pasewang.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab === 'surat' && (
            <button
              id="btn-tambah-surat"
              type="button"
              onClick={handleOpenAddSurat}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Arsip Surat</span>
            </button>
          )}
          {activeSubTab === 'mou' && (
            <button
              id="btn-tambah-mou"
              type="button"
              onClick={handleOpenAddMOU}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data MOU</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="tab-sub-surat"
            type="button"
            onClick={() => setActiveSubTab('surat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'surat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Surat Masuk & Surat Keluar ({suratList.length})</span>
          </button>

          <button
            id="tab-sub-mou"
            type="button"
            onClick={() => setActiveSubTab('mou')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'mou'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>MOU & Kerjasama Kemitraan ({mouList.length})</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'surat'
                ? 'Cari nomor surat, perihal, atau instansi pengirim/tujuan...'
                : 'Cari nama mitra, bidang MOU, atau program kerja...'
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Content for TAB 1: Persuratan */}
      {activeSubTab === 'surat' && (
        <div className="space-y-3">
          {filteredSurat.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Tidak ada data arsip surat yang sesuai dengan pencarian.</p>
            </div>
          ) : (
            filteredSurat.map(surat => {
              const isMasuk = surat.jenis === 'Surat Masuk';
              return (
                <div
                  key={surat.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        isMasuk
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isMasuk ? <Inbox className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isMasuk
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {surat.jenis}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {surat.nomorSurat}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {surat.tanggalSurat}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {surat.perihal}
                      </h3>

                      <div className="text-xs text-slate-600">
                        <span className="font-semibold">{isMasuk ? 'Pengirim:' : 'Tujuan:'}</span>{' '}
                        {surat.pengirimPenerima}
                      </div>

                      {surat.disposisi && (
                        <div className="mt-1 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                          <span className="font-bold">Disposisi Kepala Sekolah:</span> {surat.disposisi}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {surat.fileLampiran && (
                      <a
                        href={surat.fileLampiran}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka Berkas di Google Drive"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Lihat di Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {surat.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditSurat(surat)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSurat(surat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Content for TAB 2: MOU Kerjasama */}
      {activeSubTab === 'mou' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMOU.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              <Handshake className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Tidak ada data MOU kemitraan yang sesuai dengan pencarian.</p>
            </div>
          ) : (
            filteredMOU.map(mou => (
              <div
                key={mou.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {mou.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {mou.nomorMOU}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {mou.mitra}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-700 mt-0.5">
                    Bidang: {mou.bidang}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100">
                    <div className="font-bold text-slate-800 mb-1">Cakupan Kerjasama:</div>
                    <p className="text-[11px] text-slate-600">{mou.programKerja}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      Masa Berlaku: {mou.tanggalMulai} s/d {mou.tanggalBerakhir}
                    </div>
                    <div className="text-[10px] text-slate-400">PJ: {mou.penanggungJawab}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditMOU(mou)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMOU(mou.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Surat Modal */}
      <Modal
        isOpen={isSuratModalOpen}
        onClose={() => setIsSuratModalOpen(false)}
        title={editingSurat ? 'Edit Arsip Surat' : 'Tambah Arsip Surat Masuk / Keluar'}
        subtitle="Pencatatan nomor surat, perihal, dan disposisi dinas"
      >
        <form onSubmit={handleSaveSurat} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Persuratan</label>
              <select
                value={suratFormData.jenis}
                onChange={e => setSuratFormData({ ...suratFormData, jenis: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Surat Masuk">Surat Masuk</option>
                <option value="Surat Keluar">Surat Keluar</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Surat</label>
              <input
                type="text"
                value={suratFormData.nomorSurat}
                onChange={e => setSuratFormData({ ...suratFormData, nomorSurat: e.target.value })}
                placeholder="421.1/089/..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Perihal Surat</label>
              <input
                type="text"
                value={suratFormData.perihal}
                onChange={e => setSuratFormData({ ...suratFormData, perihal: e.target.value })}
                placeholder="Contoh: Undangan Rapat Koordinasi ANBK"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pengirim / Penerima</label>
              <input
                type="text"
                value={suratFormData.pengirimPenerima}
                onChange={e => setSuratFormData({ ...suratFormData, pengirimPenerima: e.target.value })}
                placeholder="Dinas Pendidikan / Camat Mamajang / Wali Murid"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Surat</label>
              <input
                type="date"
                value={suratFormData.tanggalSurat}
                onChange={e => setSuratFormData({ ...suratFormData, tanggalSurat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Instruksi Disposisi Kepala Sekolah</label>
              <textarea
                rows={2}
                value={suratFormData.disposisi}
                onChange={e => setSuratFormData({ ...suratFormData, disposisi: e.target.value })}
                placeholder="Catatan arahan atau disposisi tindak lanjut..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <DriveFileUpload
                label="Unggah File Scan / Berkas Surat ke Google Drive"
                category={`Persuratan-${suratFormData.jenis}`}
                initialUrl={suratFormData.fileLampiran}
                onUploadSuccess={(url) => {
                  setSuratFormData(prev => ({ ...prev, fileLampiran: url }));
                }}
                helperText="Arsip PDF / foto surat akan disimpan di Google Drive SDN Lanto Dg. Pasewang."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSuratModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              {editingSurat ? 'Simpan Perubahan' : 'Tambah Surat'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MOU Modal */}
      <Modal
        isOpen={isMOUModalOpen}
        onClose={() => setIsMOUModalOpen(false)}
        title={editingMOU ? 'Edit MOU Kerjasama' : 'Tambah MOU & Kemitraan Sekolah'}
        subtitle="Dokumentasi perjanjian kemitraan eksternal"
      >
        <form onSubmit={handleSaveMOU} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Instansi / Lembaga Mitra</label>
              <input
                type="text"
                value={mouFormData.mitra}
                onChange={e => setMOUFormData({ ...mouFormData, mitra: e.target.value })}
                placeholder="Contoh: Puskesmas Mamajang / Polsek Mamajang"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bidang Kerjasama</label>
              <input
                type="text"
                value={mouFormData.bidang}
                onChange={e => setMOUFormData({ ...mouFormData, bidang: e.target.value })}
                placeholder="Contoh: Kesehatan Sekolah / Keamanan / Lingkungan"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Dokumen MOU</label>
              <input
                type="text"
                value={mouFormData.nomorMOU}
                onChange={e => setMOUFormData({ ...mouFormData, nomorMOU: e.target.value })}
                placeholder="Contoh: 440/012/MOU/2024"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={mouFormData.tanggalMulai}
                onChange={e => setMOUFormData({ ...mouFormData, tanggalMulai: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Berakhir</label>
              <input
                type="date"
                value={mouFormData.tanggalBerakhir}
                onChange={e => setMOUFormData({ ...mouFormData, tanggalBerakhir: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Program & Ruang Lingkup Kerjasama</label>
              <textarea
                rows={2}
                value={mouFormData.programKerja}
                onChange={e => setMOUFormData({ ...mouFormData, programKerja: e.target.value })}
                placeholder="Pemeriksaan berkala, penyuluhan, pembinaan UKS..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab Sekolah</label>
              <input
                type="text"
                value={mouFormData.penanggungJawab}
                onChange={e => setMOUFormData({ ...mouFormData, penanggungJawab: e.target.value })}
                placeholder="Contoh: Pembina UKS / Tim TPPK"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsMOUModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              {editingMOU ? 'Simpan Perubahan' : 'Tambah MOU'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
