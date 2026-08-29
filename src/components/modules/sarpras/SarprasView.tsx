import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ItemSarpras, PemeliharaanSarpras, PeminjamanSarpras } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  Boxes,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Wrench,
  BookOpen,
  Edit,
  Trash2,
  PackageCheck,
  Building,
  Laptop
} from 'lucide-react';

export const SarprasView: React.FC = () => {
  const {
    sarprasList,
    addSarpras,
    updateSarpras,
    deleteSarpras,
    pemeliharaanList,
    addPemeliharaan,
    updatePemeliharaan,
    deletePemeliharaan,
    peminjamanList,
    addPeminjaman,
    updatePeminjaman,
    deletePeminjaman
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'inventaris' | 'pemeliharaan' | 'peminjaman'>('inventaris');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  // Inventaris Modals
  const [isSarprasModalOpen, setIsSarprasModalOpen] = useState(false);
  const [editingSarpras, setEditingSarpras] = useState<ItemSarpras | null>(null);
  const [sarprasForm, setSarprasForm] = useState<Omit<ItemSarpras, 'id'>>({
    kodeBarang: 'SAR-2024-001',
    namaBarang: '',
    kategori: 'Elektronik & IT',
    lokasi: 'Laboratorium Komputer',
    jumlah: 1,
    satuan: 'Unit',
    kondisiBaik: 1,
    kondisiRusakRingan: 0,
    kondisiRusakBerat: 0,
    tahunPerolehan: 2024,
    sumberDana: 'BOS Kinerja',
    nilaiAsetPerolehan: 7500000,
    keterangan: 'Kondisi prima siap pakai'
  });

  // Pemeliharaan Modal
  const [isMntModalOpen, setIsMntModalOpen] = useState(false);
  const [mntForm, setMntForm] = useState<Omit<PemeliharaanSarpras, 'id'>>({
    namaBarang: 'Chromebook Axioo',
    lokasi: 'Lab Komputer',
    jenisKerusakan: 'Perbaikan Sistem Operasi & Baterai',
    usulanPerbaikan: 'Servis resmi vendor',
    biayaEstimasi: 350000,
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
    pelaksana: 'Teknisi Sekolah',
    status: 'Sedang Dikerjakan'
  });

  // Peminjaman Modal
  const [isPinjamModalOpen, setIsPinjamModalOpen] = useState(false);
  const [pinjamForm, setPinjamForm] = useState<Omit<PeminjamanSarpras, 'id'>>({
    namaPeminjam: 'Guru Kelas 5A',
    kontak: '08123456789',
    namaBarang: 'Proyektor Epson LCD',
    jumlah: 1,
    tanggalPinjam: new Date().toISOString().split('T')[0],
    tanggalKembaliEstimasi: new Date().toISOString().split('T')[0],
    keperluan: 'Presentasi Projek P5 Tema Kearifan Lokal',
    status: 'Dipinjam'
  });

  const safeSarprasList = sarprasList || [];
  const safePemeliharaanList = pemeliharaanList || [];
  const safePeminjamanList = peminjamanList || [];

  const totalUnit = safeSarprasList.reduce((acc, curr) => acc + (curr.jumlah || 0), 0);
  const totalBaik = safeSarprasList.reduce((acc, curr) => acc + (curr.kondisiBaik || 0), 0);
  const totalRusakRingan = safeSarprasList.reduce((acc, curr) => acc + (curr.kondisiRusakRingan || 0), 0);
  const totalRusakBerat = safeSarprasList.reduce((acc, curr) => acc + (curr.kondisiRusakBerat || 0), 0);

  const filteredSarpras = safeSarprasList.filter(item => {
    const matchCat = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    const matchSearch =
      (item.namaBarang || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kodeBarang || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.lokasi || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAddSarpras = () => {
    setSarprasForm({
      kodeBarang: 'SAR-2024-' + (safeSarprasList.length + 1).toString().padStart(3, '0'),
      namaBarang: '',
      kategori: 'Elektronik & IT',
      lokasi: 'Ruang Kelas 1A',
      jumlah: 1,
      satuan: 'Unit',
      kondisiBaik: 1,
      kondisiRusakRingan: 0,
      kondisiRusakBerat: 0,
      tahunPerolehan: 2024,
      sumberDana: 'BOS Reguler',
      nilaiAsetPerolehan: 3000000,
      keterangan: 'Barang baru terinventaris'
    });
    setEditingSarpras(null);
    setIsSarprasModalOpen(true);
  };

  const handleOpenEditSarpras = (s: ItemSarpras) => {
    setEditingSarpras(s);
    setSarprasForm({
      kodeBarang: s.kodeBarang,
      namaBarang: s.namaBarang,
      kategori: s.kategori,
      lokasi: s.lokasi,
      jumlah: s.jumlah,
      satuan: s.satuan,
      kondisiBaik: s.kondisiBaik,
      kondisiRusakRingan: s.kondisiRusakRingan,
      kondisiRusakBerat: s.kondisiRusakBerat,
      tahunPerolehan: s.tahunPerolehan,
      sumberDana: s.sumberDana,
      nilaiAsetPerolehan: s.nilaiAsetPerolehan,
      keterangan: s.keterangan
    });
    setIsSarprasModalOpen(true);
  };

  const handleSubmitSarpras = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSarpras) {
      updateSarpras(editingSarpras.id, sarprasForm);
    } else {
      addSarpras(sarprasForm);
    }
    setIsSarprasModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 text-[11px] font-bold border border-orange-200 mb-1.5">
            <Boxes className="w-3.5 h-3.5 text-orange-600" />
            <span>Manajemen Sarana & Prasarana</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Inventaris Sarpras SDN Lanto Dg. Pasewang
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pencatatan aset gedung, ruang kelas, laboratorium TIK, perpustakaan, perabot belajar, pemeliharaan rutin, dan peminjaman alat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'inventaris' && (
            <button
              id="btn-tambah-aset-sarpras"
              type="button"
              onClick={handleOpenAddSarpras}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aset Sarpras</span>
            </button>
          )}
          {activeSubTab === 'pemeliharaan' && (
            <button
              type="button"
              onClick={() => setIsMntModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pemeliharaan</span>
            </button>
          )}
          {activeSubTab === 'peminjaman' && (
            <button
              type="button"
              onClick={() => setIsPinjamModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Peminjaman</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Unit Aset
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalUnit} Unit</div>
          <div className="text-[10px] text-slate-400 mt-1">Terdata di inventaris</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Kondisi Baik</span>
          </div>
          <div className="text-xl font-black text-emerald-600 mt-1">{totalBaik} Unit</div>
          <div className="text-[10px] text-emerald-700 mt-1">Siap digunakan</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Rusak Ringan</span>
          </div>
          <div className="text-xl font-black text-amber-600 mt-1">{totalRusakRingan} Unit</div>
          <div className="text-[10px] text-amber-700 mt-1">Pemeliharaan / Servis</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rusak Berat</span>
          </div>
          <div className="text-xl font-black text-rose-600 mt-1">{totalRusakBerat} Unit</div>
          <div className="text-[10px] text-rose-700 mt-1">Usulan penghapusan</div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('inventaris')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'inventaris'
              ? 'border-orange-600 text-orange-600 bg-orange-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>1. Buku Inventaris Sarpras ({sarprasList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('pemeliharaan')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'pemeliharaan'
              ? 'border-orange-600 text-orange-600 bg-orange-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>2. Riwayat Pemeliharaan ({pemeliharaanList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('peminjaman')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'peminjaman'
              ? 'border-orange-600 text-orange-600 bg-orange-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>3. Peminjaman Sarpras ({peminjamanList.length})</span>
        </button>
      </div>

      {/* TAB 1: INVENTARIS */}
      {activeSubTab === 'inventaris' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                'Semua',
                'Ruang/Gedung',
                'Mebelair',
                'Elektronik & IT',
                'Alat Peraga Edukatif',
                'Sarana Olahraga',
                'Buku & Literasi'
              ].map(kat => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedKategori === kat
                      ? 'bg-orange-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama aset, kode inventaris, atau ruangan/lokasi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSarpras.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.kodeBarang}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {item.kategori}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.namaBarang}
                  </h3>

                  <div className="mt-2 text-xs font-semibold text-orange-950">
                    Total: <span className="font-bold text-slate-900">{item.jumlah} {item.satuan}</span>
                  </div>

                  {/* Conditions row */}
                  <div className="grid grid-cols-3 gap-1.5 my-2.5 text-center text-[10px] font-bold">
                    <div className="p-1.5 rounded bg-emerald-50 text-emerald-800">
                      <div>{item.kondisiBaik}</div>
                      <div className="font-normal text-[9px]">Baik</div>
                    </div>
                    <div className="p-1.5 rounded bg-amber-50 text-amber-800">
                      <div>{item.kondisiRusakRingan}</div>
                      <div className="font-normal text-[9px]">R. Ringan</div>
                    </div>
                    <div className="p-1.5 rounded bg-rose-50 text-rose-800">
                      <div>{item.kondisiRusakBerat}</div>
                      <div className="font-normal text-[9px]">R. Berat</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-100 space-y-1">
                    <div>
                      <span className="text-slate-400">Lokasi:</span> <span className="font-medium text-slate-800">{item.lokasi}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Perolehan:</span> {item.sumberDana} ({item.tahunPerolehan})
                    </div>
                    {item.keterangan && (
                      <div>
                        <span className="text-slate-400">Catatan:</span> {item.keterangan}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditSarpras(item)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSarpras(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PEMELIHARAAN */}
      {activeSubTab === 'pemeliharaan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safePemeliharaanList.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {item.lokasi}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Sedang Dikerjakan'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.namaBarang}
                </h3>
                <div className="text-xs text-rose-700 font-semibold mt-1">
                  Kerusakan: {item.jenisKerusakan}
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div>
                    <span className="text-slate-400">Usulan Tindakan:</span> {item.usulanPerbaikan}
                  </div>
                  <div>
                    <span className="text-slate-400">Estimasi Biaya:</span>{' '}
                    <strong>Rp {(item.biayaEstimasi || 0).toLocaleString('id-ID')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Pelaksana:</span> {item.pelaksana}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Mulai: {item.tanggalMulai}</span>
                <button
                  type="button"
                  onClick={() => deletePemeliharaan(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PEMINJAMAN */}
      {activeSubTab === 'peminjaman' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safePeminjamanList.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {item.jumlah} Unit
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Dikembalikan'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.namaBarang}
                </h3>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100 space-y-1">
                  <div>
                    <span className="text-slate-400">Peminjam:</span> <span className="font-bold text-slate-800">{item.namaPeminjam}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Kontak:</span> {item.kontak}
                  </div>
                  <div>
                    <span className="text-slate-400">Keperluan:</span> {item.keperluan}
                  </div>
                  <div>
                    <span className="text-slate-400">Tgl Pinjam:</span> {item.tanggalPinjam}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {item.status === 'Dipinjam' ? (
                  <button
                    type="button"
                    onClick={() => updatePeminjaman(item.id, { status: 'Dikembalikan' })}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Tandai Kembali
                  </button>
                ) : (
                  <span className="text-emerald-700 font-semibold text-[11px]">Selesai</span>
                )}

                <button
                  type="button"
                  onClick={() => deletePeminjaman(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Inventaris */}
      <Modal
        isOpen={isSarprasModalOpen}
        onClose={() => setIsSarprasModalOpen(false)}
        title={editingSarpras ? 'Edit Aset Sarpras' : 'Tambah Aset Sarana Prasarana'}
        subtitle="Entri inventarisasi sarana, prasarana, dan perabot sekolah"
      >
        <form onSubmit={handleSubmitSarpras} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Barang / Ruang</label>
              <input
                type="text"
                value={sarprasForm.namaBarang}
                onChange={e => setSarprasForm({ ...sarprasForm, namaBarang: e.target.value })}
                placeholder="Contoh: Laptop Chromebook Axioo / Meja Kursi Murid"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Inventaris</label>
              <input
                type="text"
                value={sarprasForm.kodeBarang}
                onChange={e => setSarprasForm({ ...sarprasForm, kodeBarang: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori Sarpras</label>
              <select
                value={sarprasForm.kategori}
                onChange={e => setSarprasForm({ ...sarprasForm, kategori: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="Ruang/Gedung">Ruang / Gedung</option>
                <option value="Elektronik & IT">Elektronik & IT (Chromebook/LCD)</option>
                <option value="Mebelair">Mebelair (Meja/Kursi/Lemari)</option>
                <option value="Alat Peraga Edukatif">Alat Peraga Edukatif (APE)</option>
                <option value="Sarana Olahraga">Sarana Olahraga</option>
                <option value="Buku & Literasi">Buku & Literasi</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jumlah Unit Total</label>
              <input
                type="number"
                min="1"
                value={sarprasForm.jumlah}
                onChange={e => setSarprasForm({ ...sarprasForm, jumlah: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Satuan</label>
              <input
                type="text"
                value={sarprasForm.satuan}
                onChange={e => setSarprasForm({ ...sarprasForm, satuan: e.target.value as any })}
                placeholder="Unit / Set / Ruang"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kondisi Baik (Unit)</label>
              <input
                type="number"
                value={sarprasForm.kondisiBaik}
                onChange={e => setSarprasForm({ ...sarprasForm, kondisiBaik: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rusak Ringan (Unit)</label>
              <input
                type="number"
                value={sarprasForm.kondisiRusakRingan}
                onChange={e => setSarprasForm({ ...sarprasForm, kondisiRusakRingan: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rusak Berat (Unit)</label>
              <input
                type="number"
                value={sarprasForm.kondisiRusakBerat}
                onChange={e => setSarprasForm({ ...sarprasForm, kondisiRusakBerat: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ruangan / Lokasi</label>
              <input
                type="text"
                value={sarprasForm.lokasi}
                onChange={e => setSarprasForm({ ...sarprasForm, lokasi: e.target.value })}
                placeholder="Ruang Kelas 1A / Perpustakaan"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sumber Dana Perolehan</label>
              <input
                type="text"
                value={sarprasForm.sumberDana}
                onChange={e => setSarprasForm({ ...sarprasForm, sumberDana: e.target.value })}
                placeholder="BOS Kinerja / BOS Reguler / DAK"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Perolehan</label>
              <input
                type="number"
                value={sarprasForm.tahunPerolehan}
                onChange={e => setSarprasForm({ ...sarprasForm, tahunPerolehan: parseInt(e.target.value) || 2024 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
              <input
                type="text"
                value={sarprasForm.keterangan}
                onChange={e => setSarprasForm({ ...sarprasForm, keterangan: e.target.value })}
                placeholder="Catatan nomor seri, kondisi..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSarprasModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
            >
              {editingSarpras ? 'Simpan Perubahan' : 'Tambah Aset'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Pemeliharaan */}
      <Modal
        isOpen={isMntModalOpen}
        onClose={() => setIsMntModalOpen(false)}
        title="Tambah Catatan Pemeliharaan Sarpras"
        subtitle="Entri servis dan perbaikan fasilitas sekolah"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addPemeliharaan(mntForm);
            setIsMntModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Barang / Ruang</label>
              <input
                type="text"
                value={mntForm.namaBarang}
                onChange={e => setMntForm({ ...mntForm, namaBarang: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi</label>
              <input
                type="text"
                value={mntForm.lokasi}
                onChange={e => setMntForm({ ...mntForm, lokasi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimasi Biaya (Rp)</label>
              <input
                type="number"
                value={mntForm.biayaEstimasi}
                onChange={e => setMntForm({ ...mntForm, biayaEstimasi: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Jenis Kerusakan</label>
              <input
                type="text"
                value={mntForm.jenisKerusakan}
                onChange={e => setMntForm({ ...mntForm, jenisKerusakan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Usulan Tindakan Perbaikan</label>
              <input
                type="text"
                value={mntForm.usulanPerbaikan}
                onChange={e => setMntForm({ ...mntForm, usulanPerbaikan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsMntModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold"
            >
              Simpan Pemeliharaan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Peminjaman */}
      <Modal
        isOpen={isPinjamModalOpen}
        onClose={() => setIsPinjamModalOpen(false)}
        title="Catat Peminjaman Sarpras"
        subtitle="Entri peminjaman alat pembelajaran dan sarana sekolah"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            addPeminjaman(pinjamForm);
            setIsPinjamModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Peminjam</label>
              <input
                type="text"
                value={pinjamForm.namaPeminjam}
                onChange={e => setPinjamForm({ ...pinjamForm, namaPeminjam: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. Kontak / WA</label>
              <input
                type="text"
                value={pinjamForm.kontak}
                onChange={e => setPinjamForm({ ...pinjamForm, kontak: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Barang yang Dipinjam</label>
              <input
                type="text"
                value={pinjamForm.namaBarang}
                onChange={e => setPinjamForm({ ...pinjamForm, namaBarang: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jumlah</label>
              <input
                type="number"
                min="1"
                value={pinjamForm.jumlah}
                onChange={e => setPinjamForm({ ...pinjamForm, jumlah: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimasi Tanggal Kembali</label>
              <input
                type="date"
                value={pinjamForm.tanggalKembaliEstimasi}
                onChange={e => setPinjamForm({ ...pinjamForm, tanggalKembaliEstimasi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Keperluan Peminjaman</label>
              <input
                type="text"
                value={pinjamForm.keperluan}
                onChange={e => setPinjamForm({ ...pinjamForm, keperluan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPinjamModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Simpan Peminjaman
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
