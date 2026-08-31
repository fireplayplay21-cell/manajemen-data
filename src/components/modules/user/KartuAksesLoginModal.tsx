import React from 'react';
import { UserAccount, ProfilSekolah } from '../../../types';
import { DEFAULT_LOGO_SEKOLAH } from '../../../data/brandingAssets';
import { Modal } from '../../common/Modal';
import {
  Printer,
  KeyRound,
  Lock,
  Mail,
  Phone,
  School,
  CheckCircle2,
  Shield,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';

interface KartuAksesLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  profilSekolah: ProfilSekolah;
}

export const KartuAksesLoginModal: React.FC<KartuAksesLoginModalProps> = ({
  isOpen,
  onClose,
  users,
  profilSekolah
}) => {
  const safeUsers = users || [];
  const guruUsers = safeUsers.filter(u => u.role === 'guru' || u.role === 'tata_usaha' || u.role === 'kepala_sekolah');

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kartu Akses & Kredensial Login Pengguna Guru"
      subtitle="Format Cetak Kredensial Login Guru (User: NIP, Password: 123456)"
    >
      <div className="space-y-4 text-xs">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <div>
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <span>Daftar Kartu Kredensial Login Guru Resmi</span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Bagikan kartu ini kepada masing-masing guru pendidik untuk login ke Sistem Manajemen Sekolah.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kartu Login</span>
          </button>
        </div>

        {/* Grid of Printable Teacher Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {guruUsers.map((user, idx) => {
            const password = user.password || '123456';
            return (
              <div
                key={user.id}
                className="bg-white border-2 border-slate-300 rounded-xl p-3.5 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                      <img
                        src={profilSekolah.logoUrl || DEFAULT_LOGO_SEKOLAH}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_LOGO_SEKOLAH;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-800 uppercase tracking-tight line-clamp-1">
                        {profilSekolah.namaSekolah}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        NPSN: {profilSekolah.npsn}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase shrink-0">
                    KARTU LOGIN GURU
                  </span>
                </div>

                {/* Body Details */}
                <div className="flex items-start gap-3">
                  <img
                    src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={user.nama}
                    className="w-12 h-16 object-cover rounded-lg border border-slate-300 shrink-0 shadow-2xs bg-slate-100"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="font-bold text-slate-900 text-xs">
                      {user.nama}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      {user.jabatan} {user.kelasTugas ? `• ${user.kelasTugas}` : ''}
                    </div>

                    <div className="mt-2 p-1.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-semibold flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-emerald-600" />
                          <span>NIP / User:</span>
                        </span>
                        <span className="font-mono font-bold text-slate-900 select-all bg-white px-1.5 py-0.2 rounded border border-slate-200 text-[10px]">
                          {user.nip || '-'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-600" />
                          <span>Password:</span>
                        </span>
                        <span className="font-mono font-black text-emerald-800 select-all bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-300 text-[10px]">
                          {password}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                  <span>Hak Akses: Unggah Administrasi & Modul Ajar</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`Nama: ${user.nama}\nUser/NIP: ${user.nip}\nPassword: ${password}`)}
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    title="Salin data login guru"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Salin Data</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-right text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Total {guruUsers.length} Kartu Akun Login Guru Siap Digunakan.
        </div>
      </div>
    </Modal>
  );
};
