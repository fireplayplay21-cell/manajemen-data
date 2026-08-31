import React, { useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { FormulirSupervisiLengkap } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  Printer,
  FileCheck,
  CheckCircle2,
  ListChecks,
  MessageSquare,
  Sparkles,
  Calendar,
  User,
  BookOpen,
  Award,
  Share2,
  CheckSquare,
  Square
} from 'lucide-react';

interface FormulirSupervisiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FormulirSupervisiLengkap | null;
  onEdit?: (item: FormulirSupervisiLengkap) => void;
}

export const FormulirSupervisiDetailModal: React.FC<FormulirSupervisiDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onEdit
}) => {
  const { profilSekolah } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!item) return null;

  const handlePrint = () => {
    window.print();
  };

  const checkedCount = item.observasi.areaObservasi.filter(a => a.ada).length;
  const totalCount = item.observasi.areaObservasi.length || 5;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instrumen & Formulir Supervisi 3 Tahap"
      subtitle={`${item.namaGuru} • ${item.mataPelajaran} (${item.kelas})`}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-xs text-slate-800">
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl print:hidden">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.statusDokumen === 'Pasca-Observasi Tuntas' || item.statusDokumen === 'Disahkan'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {item.statusDokumen}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Kategori: {item.observasi.kategoriHasil} ({checkedCount}/{totalCount} Komponen Terlaksana)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Edit Formulir
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF Dokumen</span>
            </button>
          </div>
        </div>

        {/* Printable Document Sheet Container */}
        <div
          ref={printRef}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none"
        >
          {/* Kop Surat Resmi */}
          <div className="border-b-2 border-black pb-4 text-center relative">
            <div className="flex items-center justify-between gap-4">
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Lambang_Kota_Makassar.svg/240px-Lambang_Kota_Makassar.svg.png"
                  alt="Logo Kota Makassar"
                  className="w-14 h-14 object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                  PEMERINTAH KOTA MAKASSAR
                </h4>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                  DINAS PENDIDIKAN
                </h3>
                <h2 className="text-sm sm:text-base font-black uppercase text-slate-950">
                  {profilSekolah?.nama || item.sekolah || 'UPTD SPF SD NEGERI LANTO DG. PASEWANG'}
                </h2>
                <p className="text-[10px] text-slate-600">
                  {profilSekolah?.alamat || 'Jl. Lanto Dg. Pasewang No. 12, Kec. Mamajang, Kota Makassar'} • NSS: {profilSekolah?.nss || '101196001004'} • NPSN: {profilSekolah?.npsn || '40307374'}
                </p>
                <p className="text-[10px] text-slate-600">
                  Email: {profilSekolah?.email || 'sdnlantodgpasewang@gmail.com'} • Website: {profilSekolah?.website || 'sdnlanto.sch.id'}
                </p>
              </div>

              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-blue-900 flex items-center justify-center font-black text-blue-900 text-xs bg-blue-50">
                  SDN LDP
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase underline">
              INSTRUMEN & FORMULIR SUPERVISI PEMBELAJARAN 3 TAHAP
            </h3>
            <p className="text-[11px] text-slate-600 font-semibold">
              (Formulir Pra-Observasi, Lembar Observasi 5 Komponen Inti, dan Pasca-Observasi)
            </p>
          </div>

          {/* Identitas Tabel */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-1/4 p-2 font-bold bg-slate-50 text-slate-700">Nama Sekolah</td>
                  <td className="w-1/4 p-2 text-slate-900 font-semibold">{item.sekolah || profilSekolah?.nama}</td>
                  <td className="w-1/4 p-2 font-bold bg-slate-50 text-slate-700">Hari & Tanggal</td>
                  <td className="w-1/4 p-2 text-slate-900 font-semibold">{item.hariTanggal}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 text-slate-700">Nama Guru (Observee)</td>
                  <td className="p-2 text-slate-900 font-bold">{item.namaGuru}</td>
                  <td className="p-2 font-bold bg-slate-50 text-slate-700">Kelas</td>
                  <td className="p-2 text-slate-900 font-semibold">{item.kelas}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 text-slate-700">NIP Guru</td>
                  <td className="p-2 text-slate-900">{item.nipGuru || '-'}</td>
                  <td className="p-2 font-bold bg-slate-50 text-slate-700">Waktu Percakapan</td>
                  <td className="p-2 text-slate-900">{item.waktuPercakapan || '-'}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 text-slate-700">Mata Pelajaran / Tema</td>
                  <td className="p-2 text-slate-900 font-semibold">{item.mataPelajaran}</td>
                  <td className="p-2 font-bold bg-slate-50 text-slate-700">Supervisor (Observer)</td>
                  <td className="p-2 text-slate-900 font-bold">{item.namaSupervisor}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN I: PRA-OBSERVASI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-blue-300 pb-1">
              <span className="w-6 h-6 rounded-md bg-blue-800 text-white font-black text-xs flex items-center justify-center">
                I
              </span>
              <h4 className="font-black text-slate-900 uppercase text-xs sm:text-sm">
                FORMULIR PRA-OBSERVASI PEMBELAJARAN
              </h4>
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2.5 w-12 text-center">No</th>
                    <th className="p-2.5 w-1/3">Pertanyaan / Aspek Pra-Observasi</th>
                    <th className="p-2.5">Catatan Respon & Kesepakatan Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 text-center font-bold">1</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Tujuan Pembelajaran yang Ingin Dicapai
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.praObservasi.tujuanPembelajaran || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">2</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Area / Aspek Pengembangan yang Hendak Dicapai
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.praObservasi.aspekPengembangan || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">3</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Strategi Pembelajaran yang Dipersiapkan
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.praObservasi.strategiPembelajaran || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">4</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Catatan Pra-Observasi / Kesiapan Guru
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.praObservasi.catatanPraObservasi || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BAGIAN II: LEMBAR OBSERVASI 5 KOMPONEN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-300 pb-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                  II
                </span>
                <h4 className="font-black text-slate-900 uppercase text-xs sm:text-sm">
                  LEMBAR OBSERVASI PEMBELAJARAN (5 KOMPONEN INTI)
                </h4>
              </div>
              <div className="text-[11px] font-bold text-emerald-900">
                Ketercapaian: {checkedCount}/{totalCount} Komponen ({item.observasi.kategoriHasil})
              </div>
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-emerald-300">
                  <tr>
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5 w-2/5">Aspek dan Strategi Pengembangan</th>
                    <th className="p-2.5 w-20 text-center">Ada / Tidak</th>
                    <th className="p-2.5">Catatan Pengamatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {item.observasi.areaObservasi.map((obs, idx) => (
                    <tr key={obs.id} className={obs.ada ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="p-2.5 text-center font-bold text-slate-700">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{obs.aspekDanStrategi}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            obs.ada
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {obs.ada ? 'ADA (✓)' : 'TIDAK'}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-800 leading-relaxed font-medium">
                        {obs.catatanPengamatan || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {item.observasi.catatanTambahan && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-800 text-[11px] mb-1">
                  Catatan Tambahan Observasi:
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {item.observasi.catatanTambahan}
                </p>
              </div>
            )}
          </div>

          {/* BAGIAN III: PASCA-OBSERVASI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-purple-300 pb-1">
              <span className="w-6 h-6 rounded-md bg-purple-800 text-white font-black text-xs flex items-center justify-center">
                III
              </span>
              <h4 className="font-black text-slate-900 uppercase text-xs sm:text-sm">
                FORMULIR PASCA-OBSERVASI & RENCANA TINDAK LANJUT
              </h4>
            </div>

            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-purple-50 text-purple-950 font-bold border-b border-purple-300">
                  <tr>
                    <th className="p-2.5 w-12 text-center">No</th>
                    <th className="p-2.5 w-1/3">Aspek Pasca-Observasi</th>
                    <th className="p-2.5">Uraian Refleksi & Kesepakatan Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 text-center font-bold">1</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Refleksi Guru terhadap Pembelajaran
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.pascaObservasi.refleksiGuru || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">2</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Ketercapaian Tujuan Pembelajaran
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.pascaObservasi.ketercapaianTujuan || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">3</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Umpan Balik & Catatan Supervisor
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed font-medium">
                      {item.pascaObservasi.umpanBalikSupervisor || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">4</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Sasaran Perbaikan
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.pascaObservasi.sasaranPerbaikan || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">5</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Rencana Tindak Lanjut
                    </td>
                    <td className="p-2.5 text-slate-700 leading-relaxed">
                      {item.pascaObservasi.rencanaTindakLanjut || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">6</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Komitmen Waktu
                    </td>
                    <td className="p-2.5 text-slate-700 font-semibold">
                      {item.pascaObservasi.komitmenWaktu || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-bold">7</td>
                    <td className="p-2.5 font-semibold text-slate-800">
                      Rekomendasi Akhir Supervisor
                    </td>
                    <td className="p-2.5 text-slate-900 font-semibold leading-relaxed">
                      {item.pascaObservasi.rekomendasiAkhir || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tanda Tangan Resmi */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs">
            <div className="space-y-16">
              <div>
                <p className="text-slate-500">Guru yang Disupervisi (Observee),</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline">{item.namaGuru}</p>
                <p className="text-[10px] text-slate-500">NIP. {item.nipGuru || '........................................'}</p>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <p className="text-slate-500">
                  Makassar, {item.hariTanggal}
                </p>
                <p className="text-slate-500">Supervisor (Observer),</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline">{item.namaSupervisor}</p>
                <p className="text-[10px] text-slate-500">NIP. {item.nipSupervisor || profilSekolah?.nipKepalaSekolah || '........................................'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-3 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
