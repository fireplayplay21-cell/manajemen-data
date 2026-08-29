import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserAccount } from '../../../types';
import { Modal } from '../../common/Modal';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  School,
  GraduationCap,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface LoginGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNip?: string;
}

export const LoginGuruModal: React.FC<LoginGuruModalProps> = ({
  isOpen,
  onClose,
  defaultNip = ''
}) => {
  const { users, loginWithNipAndPassword, currentUser } = useApp();

  const [nipInput, setNipInput] = useState(defaultNip);
  const [passwordInput, setPasswordInput] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPick, setShowQuickPick] = useState(true);

  // Filter list of Guru and staff
  const guruUsers = users.filter(u => u.role === 'guru' || u.role === 'kepala_sekolah' || u.role === 'tata_usaha');

  const handleQuickSelect = (user: UserAccount) => {
    setNipInput(user.nip || user.email);
    setPasswordInput(user.password || '123456');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithNipAndPassword(nipInput, passwordInput);
      setIsLoading(false);

      if (result.success) {
        onClose();
      } else {
        setErrorMessage(result.message);
      }
    }, 250);
  };

  const handleFillDefaultPassword = () => {
    setPasswordInput('123456');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Portal Login Pengguna Guru"
      subtitle="UPTD SPF SDN Lanto Dg. Pasewang Kota Makassar"
    >
      <div className="space-y-4">
        {/* Banner Info */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-xl text-white shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-emerald-200 flex items-center gap-1.5">
                <span>Format Login Pengguna Guru</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-[10px] font-mono">Resmi</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                <span className="text-white font-semibold">User:</span> NIP Guru (18 Digit) •{' '}
                <span className="text-white font-semibold">Password:</span> <span className="font-mono text-emerald-300 font-bold bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-500/30">123456</span>
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Gagal Masuk</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* NIP Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>NIP Pengguna Guru (Username)</span>
              <span className="text-[10px] font-normal text-slate-400">18 Digit NIP Resmi</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-login-nip"
                type="text"
                value={nipInput}
                onChange={e => setNipInput(e.target.value)}
                placeholder="Contoh: 19920814 201903 2 011"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono text-xs bg-slate-50/50"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Password Akun</label>
              <button
                type="button"
                onClick={handleFillDefaultPassword}
                className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer"
              >
                Gunakan Password Default (123456)
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-login-password"
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Masukkan Password (Default: 123456)"
                className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-xs bg-slate-50/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="btn-submit-login-guru"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk sebagai Pengguna Guru</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Pick Guru (Demo & Uji Coba Cepat NIP) */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pilih Cepat Akun Guru untuk Uji Coba:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowQuickPick(!showQuickPick)}
              className="text-[10px] text-blue-600 font-medium hover:underline"
            >
              {showQuickPick ? 'Sembunyikan' : 'Tampilkan Daftar'}
            </button>
          </div>

          {showQuickPick && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {guruUsers.map(u => {
                const isSelected = (u.nip && u.nip === nipInput) || u.email === nipInput;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSelect(u)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 truncate text-[11px] leading-tight">
                        {u.nama}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        NIP: {u.nip || '-'}
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                      {u.role === 'guru' ? 'Guru' : u.role === 'kepala_sekolah' ? 'Kepsek' : 'Staf'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Akun aktif saat ini: <strong className="text-slate-800">{currentUser.nama}</strong></span>
          <span className="font-mono text-emerald-700 font-bold">Pass: 123456</span>
        </div>
      </div>
    </Modal>
  );
};
