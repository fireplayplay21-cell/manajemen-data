import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ItemRKAS, TransaksiKeuangan } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  Wallet,
  FileSpreadsheet,
  Plus,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Trash2,
  Edit,
  CreditCard,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const KeuanganView: React.FC = () => {
  const {
    rkasList,
    addRKAS,
    updateRKAS,
    deleteRKAS,
    transaksiList,
    addTransaksi,
    updateTransaksi,
    deleteTransaksi
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'rkas' | 'bku'>('rkas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSumber, setSelectedSumber] = useState('Semua');

  // RKAS modal
  const [isRkasModalOpen, setIsRkasModalOpen] = useState(false);
  const [editingRkas, setEditingRkas] = useState<ItemRKAS | null>(null);
  const [rkasForm, setRkasForm] = useState<Omit<ItemRKAS, 'id'>>({
    kodeRekening: '5.1.02.01.01',
    uraianKegiatan: '',
    komponenBOS: 'Pengembangan Perpustakaan & Literasi',
    sumberDana: 'BOS Reguler',
    anggaranTotal: 5000000,
    realisasiTotal: 0,
    sisaAnggaran: 5000000,
    status: 'Direncanakan',
    triwulan: 'Triwulan 1'
  });

  const safeRkasList = rkasList || [];
  const safeTransaksiList = transaksiList || [];

  // BKU modal
  const [isBkuModalOpen, setIsBkuModalOpen] = useState(false);
  const [bkuForm, setBkuForm] = useState<Omit<TransaksiKeuangan, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    noBukti: 'BOS-2024-' + (safeTransaksiList.length + 1).toString().padStart(3, '0'),
    jenis: 'Pengeluaran',
    uraian: '',
    kategori: 'Operasional',
    nominal: 500000,
    penerimaPenyetor: 'Toko Buku Makassar',
    penanggungJawab: 'Bendahara BOS',
    statusVerifikasi: 'Terverifikasi Bendahara'
  });

  const totalAnggaran = safeRkasList.reduce((acc, curr) => acc + (curr.anggaranTotal || 0), 0);
  const totalRealisasi = safeRkasList.reduce((acc, curr) => acc + (curr.realisasiTotal || 0), 0);
  const totalSisa = totalAnggaran - totalRealisasi;
  const persentase = totalAnggaran > 0 ? ((totalRealisasi / totalAnggaran) * 100).toFixed(1) : '0';

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredRKAS = safeRkasList.filter(item => {
    const matchSumber = selectedSumber === 'Semua' || item.sumberDana === selectedSumber;
    const matchSearch =
      (item.uraianKegiatan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kodeRekening || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.komponenBOS || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchSumber && matchSearch;
  });

  const filteredBKU = safeTransaksiList.filter(t => {
    return (
      (t.uraian || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.noBukti || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.penerimaPenyetor || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenAddRKAS = () => {
    setRkasForm({
      kodeRekening: '5.1.02.0' + (safeRkasList.length + 1) + '.01',
      uraianKegiatan: '',
      komponenBOS: 'Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler',
      sumberDana: 'BOS Reguler',
      anggaranTotal: 5000000,
      realisasiTotal: 0,
      sisaAnggaran: 5000000,
      status: 'Direncanakan',
      triwulan: 'Triwulan 1'
    });
    setEditingRkas(null);
    setIsRkasModalOpen(true);
  };

  const handleOpenEditRKAS = (r: ItemRKAS) => {
    setEditingRkas(r);
    setRkasForm({
      kodeRekening: r.kodeRekening,
      uraianKegiatan: r.uraianKegiatan,
      komponenBOS: r.komponenBOS,
      sumberDana: r.sumberDana,
      anggaranTotal: r.anggaranTotal,
      realisasiTotal: r.realisasiTotal,
      sisaAnggaran: r.anggaranTotal - r.realisasiTotal,
      status: r.status,
      triwulan: r.triwulan
    });
    setIsRkasModalOpen(true);
  };

  const handleSubmitRKAS = (e: React.FormEvent) => {
    e.preventDefault();
    const sisa = rkasForm.anggaranTotal - rkasForm.realisasiTotal;
    const payload = {
      ...rkasForm,
      sisaAnggaran: sisa,
      status: (rkasForm.realisasiTotal >= rkasForm.anggaranTotal
        ? 'Terealisasi 100%'
        : rkasForm.realisasiTotal > 0
        ? 'Dalam Proses'
        : 'Direncanakan') as any
    };

    if (editingRkas) {
      updateRKAS(editingRkas.id, payload);
    } else {
      addRKAS(payload);
    }
    setIsRkasModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manajemen Keuangan & Anggaran Sekolah</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            RKAS & Realisasi Dana BOS SDN Lanto Dg. Pasewang
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Perencanaan anggaran belanja sekolah (RKAS), Buku Kas Umum (BKU), dan pertanggungjawaban dana BOS Reguler & BOS Kinerja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'rkas' ? (
            <button
              id="btn-tambah-kegiatan-rkas"
              type="button"
              onClick={handleOpenAddRKAS}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kegiatan RKAS</span>
            </button>
          ) : (
            <button
              id="btn-catat-transaksi-bku"
              type="button"
              onClick={() => {
                setBkuForm({
                  tanggal: new Date().toISOString().split('T')[0],
                  noBukti: 'BOS-2024-' + (transaksiList.length + 1).toString().padStart(3, '0'),
                  jenis: 'Pengeluaran',
                  uraian: '',
                  kategori: 'Operasional',
                  nominal: 500000,
                  penerimaPenyetor: 'Toko Perlengkapan Sekolah',
                  penanggungJawab: 'Bendahara BOS',
                  statusVerifikasi: 'Terverifikasi Bendahara'
                });
                setIsBkuModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Transaksi BKU</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Pagu RKAS
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatRupiah(totalAnggaran)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pagu Anggaran Tahun 2024</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Realisasi Anggaran
          </div>
          <div className="text-xl font-black text-emerald-600 mt-1">
            {formatRupiah(totalRealisasi)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{persentase}% terserap</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Sisa Saldo Kas
          </div>
          <div className="text-xl font-black text-blue-600 mt-1">
            {formatRupiah(totalSisa)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Tersedia di rekening</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Sub-Kegiatan RKAS
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {rkasList.length} Program
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{transaksiList.length} Transaksi di BKU</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('rkas')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'rkas'
              ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>1. Rencana Kegiatan & Anggaran Sekolah (RKAS)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('bku')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'bku'
              ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>2. Buku Kas Umum (BKU & Pembukuan)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {activeSubTab === 'rkas' && (
          <div className="flex flex-wrap items-center gap-2">
            {['Semua', 'BOS Reguler', 'BOS Kinerja', 'BOP Daerah', 'Lainnya'].map(sumber => (
              <button
                key={sumber}
                type="button"
                onClick={() => setSelectedSumber(sumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedSumber === sumber
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sumber}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'rkas'
                ? 'Cari uraian belanja RKAS, kode rekening, atau komponen BOS...'
                : 'Cari no bukti transaksi, uraian, atau rekanan penyetor...'
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Table RKAS */}
      {activeSubTab === 'rkas' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Kode & Uraian Belanja</th>
                  <th className="px-4 py-3">Komponen BOS</th>
                  <th className="px-4 py-3">Sumber Dana</th>
                  <th className="px-4 py-3">Pagu RKAS</th>
                  <th className="px-4 py-3">Realisasi</th>
                  <th className="px-4 py-3">Sisa Pagu</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRKAS.map(item => {
                  const percent =
                    item.anggaranTotal > 0
                      ? ((item.realisasiTotal / item.anggaranTotal) * 100).toFixed(0)
                      : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono text-[10px] font-bold text-slate-400">
                          {item.kodeRekening}
                        </div>
                        <div className="font-bold text-slate-900">{item.uraianKegiatan}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.triwulan}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        <div className="line-clamp-2">{item.komponenBOS}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {item.sumberDana}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatRupiah(item.anggaranTotal)}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-700">
                        <div>{formatRupiah(item.realisasiTotal)}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{percent}% terserap</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-800">
                        {formatRupiah(item.sisaAnggaran)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Terealisasi 100%'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Dalam Proses'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditRKAS(item)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRKAS(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
        </div>
      )}

      {/* Table BKU */}
      {activeSubTab === 'bku' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Tanggal & No Bukti</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Uraian Transaksi</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Nominal</th>
                  <th className="px-4 py-3">Penyetor / Rekanan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBKU.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{t.tanggal}</div>
                      <div className="font-mono text-[10px] text-slate-400">{t.noBukti}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.jenis === 'Pemasukan'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.jenis === 'Pemasukan' ? (
                          <ArrowDownLeft className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        <span>{t.jenis}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 max-w-sm">
                      {t.uraian}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {t.kategori}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 font-bold ${
                        t.jenis === 'Pemasukan' ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {formatRupiah(t.nominal)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{t.penerimaPenyetor}</div>
                      <div className="text-[10px] text-slate-400 font-normal">PJ: {t.penanggungJawab}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t.statusVerifikasi}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteTransaksi(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal RKAS */}
      <Modal
        isOpen={isRkasModalOpen}
        onClose={() => setIsRkasModalOpen(false)}
        title={editingRkas ? 'Edit Kegiatan RKAS' : 'Tambah Kegiatan Belanja RKAS'}
        subtitle="Entri perencanaan anggaran belanja operasional sekolah"
      >
        <form onSubmit={handleSubmitRKAS} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Rekening Belanja</label>
              <input
                type="text"
                value={rkasForm.kodeRekening}
                onChange={e => setRkasForm({ ...rkasForm, kodeRekening: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sumber Dana</label>
              <select
                value={rkasForm.sumberDana}
                onChange={e => setRkasForm({ ...rkasForm, sumberDana: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="BOS Reguler">BOS Reguler</option>
                <option value="BOS Kinerja">BOS Kinerja</option>
                <option value="BOP Daerah">BOP Daerah (BOSDA)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Uraian Kegiatan Belanja</label>
              <input
                type="text"
                value={rkasForm.uraianKegiatan}
                onChange={e => setRkasForm({ ...rkasForm, uraianKegiatan: e.target.value })}
                placeholder="Contoh: Pembelian Modul & Buku Teks Pelajaran Kurikulum Merdeka"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Komponen Penggunaan BOS</label>
              <input
                type="text"
                value={rkasForm.komponenBOS}
                onChange={e => setRkasForm({ ...rkasForm, komponenBOS: e.target.value })}
                placeholder="Pengembangan Perpustakaan / Kegiatan Pembelajaran"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pagu Anggaran Total (Rp)</label>
              <input
                type="number"
                value={rkasForm.anggaranTotal}
                onChange={e => setRkasForm({ ...rkasForm, anggaranTotal: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Realisasi Belanja Saat Ini (Rp)</label>
              <input
                type="number"
                value={rkasForm.realisasiTotal}
                onChange={e => setRkasForm({ ...rkasForm, realisasiTotal: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Periode Triwulan</label>
              <select
                value={rkasForm.triwulan}
                onChange={e => setRkasForm({ ...rkasForm, triwulan: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Triwulan 1">Triwulan 1 (Jan - Mar)</option>
                <option value="Triwulan 2">Triwulan 2 (Apr - Jun)</option>
                <option value="Triwulan 3">Triwulan 3 (Jul - Sep)</option>
                <option value="Triwulan 4">Triwulan 4 (Okt - Des)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRkasModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
            >
              {editingRkas ? 'Simpan Perubahan' : 'Tambah RKAS'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal BKU Transaksi */}
      <Modal
        isOpen={isBkuModalOpen}
        onClose={() => setIsBkuModalOpen(false)}
        title="Catat Transaksi Buku Kas Umum (BKU)"
        subtitle="Entri penerimaan dana atau pengeluaran belanja berbukti kuitansi"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addTransaksi(bkuForm);
            setIsBkuModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Transaksi</label>
              <input
                type="date"
                value={bkuForm.tanggal}
                onChange={e => setBkuForm({ ...bkuForm, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Bukti Kuitansi</label>
              <input
                type="text"
                value={bkuForm.noBukti}
                onChange={e => setBkuForm({ ...bkuForm, noBukti: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Transaksi</label>
              <select
                value={bkuForm.jenis}
                onChange={e => setBkuForm({ ...bkuForm, jenis: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              >
                <option value="Pengeluaran">Pengeluaran (Belanja/SPJ)</option>
                <option value="Pemasukan">Pemasukan (Pencairan BOS)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori Belanja</label>
              <select
                value={bkuForm.kategori}
                onChange={e => setBkuForm({ ...bkuForm, kategori: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Operasional">Operasional Sekolah</option>
                <option value="Sarpras">Sarpras & Perlengkapan</option>
                <option value="Perpustakaan">Perpustakaan & Buku</option>
                <option value="Kegiatan Kesiswaan">Kegiatan Kesiswaan</option>
                <option value="Gaji/Honor">Honor Tenaga Pendidik</option>
                <option value="Penerimaan Dana">Penerimaan Dana BOS</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Uraian Pembelanjaan / Transaksi</label>
              <input
                type="text"
                value={bkuForm.uraian}
                onChange={e => setBkuForm({ ...bkuForm, uraian: e.target.value })}
                placeholder="Contoh: Pembayaran belanja ATK semester ganjil"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                value={bkuForm.nominal}
                onChange={e => setBkuForm({ ...bkuForm, nominal: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Penerima / Rekanan / Toko</label>
              <input
                type="text"
                value={bkuForm.penerimaPenyetor}
                onChange={e => setBkuForm({ ...bkuForm, penerimaPenyetor: e.target.value })}
                placeholder="CV. Mandiri Jaya / Toko Buku"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBkuModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
            >
              Simpan ke BKU
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
