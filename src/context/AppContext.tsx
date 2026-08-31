import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth, googleProvider, signInWithPopup, signOut, handleFirestoreError, OperationType } from '../services/firebase';
import { setDriveAccessToken } from '../services/driveService';
import {
  UserAccount,
  UserRole,
  ProfilSekolah,
  DokumenPerencanaan,
  IndikatorRaporPendidikan,
  ProgramUnggulan,
  PTKRecord,
  SuratRecord,
  MOUKerjasama,
  Siswa,
  PresensiHarian,
  PrestasiSiswa,
  ProgramKarakter,
  Ekstrakurikuler,
  MasalahSiswa,
  SupervisiAkademik,
  SupervisiManajerial,
  FormulirSupervisiLengkap,
  ItemObservasi5Komponen,
  ItemRKAS,
  TransaksiKeuangan,
  ItemSarpras,
  PemeliharaanSarpras,
  PeminjamanSarpras,
  AgendaHarianKS,
  AgendaRapat,
  BukuTamu,
  JurnalKepemimpinan,
  KeputusanSK,
  RencanaPerbaikan,
  DokumenAdministrasiGuru,
  RiwayatPelatihanGuru,
  KelasRecord,
  ActiveTab
} from '../types';

export type { ActiveTab };

import {
  initialProfilSekolah,
  initialUsers,
  initialPerencanaan,
  initialPBD,
  initialProgramUnggulan,
  initialPTK,
  initialSurat,
  initialMOU,
  initialKelas,
  initialSiswa,
  initialPresensi,
  initialPrestasi,
  initialProgramKarakter,
  initialEkstrakurikuler,
  initialMasalahSiswa,
  initialSupervisiAkademik,
  initialSupervisiManajerial,
  initialFormulirSupervisi,
  initialRKAS,
  initialTransaksi,
  initialSarpras,
  initialPemeliharaan,
  initialPeminjaman,
  initialAgendaKS,
  initialAgendaRapat,
  initialBukuTamu,
  initialJurnalKepemimpinan,
  initialKeputusanSK,
  initialRencanaPerbaikan,
  initialAdministrasiGuru,
  initialRiwayatPelatihanGuru
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & Role
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  toggleSidebarCollapse: () => void;
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  logout: () => void;
  users: UserAccount[];
  userList: UserAccount[];
  switchUserById: (userId: string) => void;
  loginWithNipAndPassword: (
    nipOrIdentifier: string,
    password: string
  ) => { success: boolean; message: string; user?: UserAccount };
  loginWithCredentials: (
    identifier: string,
    password: string
  ) => { success: boolean; message: string; user?: UserAccount };
  resetUserPasswordToDefault: (userId: string) => void;
  syncPTKToUserAccounts: () => { createdCount: number; message: string };
  
  // Data States
  profilSekolah: ProfilSekolah;
  perencanaanList: DokumenPerencanaan[];
  pbdList: IndikatorRaporPendidikan[];
  programUnggulanList: ProgramUnggulan[];
  ptkList: PTKRecord[];
  kelasList: KelasRecord[];
  suratList: SuratRecord[];
  mouList: MOUKerjasama[];
  siswaList: Siswa[];
  presensiList: PresensiHarian[];
  prestasiList: PrestasiSiswa[];
  programKarakterList: ProgramKarakter[];
  ekskulList: Ekstrakurikuler[];
  masalahSiswaList: MasalahSiswa[];
  supervisiAkademikList: SupervisiAkademik[];
  supervisiManajerialList: SupervisiManajerial[];
  formulirSupervisiList: FormulirSupervisiLengkap[];
  rkasList: ItemRKAS[];
  transaksiList: TransaksiKeuangan[];
  sarprasList: ItemSarpras[];
  pemeliharaanList: PemeliharaanSarpras[];
  peminjamanList: PeminjamanSarpras[];
  agendaKSList: AgendaHarianKS[];
  agendaRapatList: AgendaRapat[];
  bukuTamuList: BukuTamu[];
  jurnalKSList: JurnalKepemimpinan[];
  keputusanSKList: KeputusanSK[];
  rencanaPerbaikanList: RencanaPerbaikan[];
  administrasiGuruList: DokumenAdministrasiGuru[];
  riwayatPelatihanList: RiwayatPelatihanGuru[];

  // Mutators
  updateProfilSekolah: (data: Partial<ProfilSekolah>) => void;
  addUser: (user: Omit<UserAccount, 'id' | 'tanggalEnrol'>) => void;
  updateUser: (id: string, user: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;

  // Generic and specific add/update/delete helpers
  addAdministrasiGuru: (item: Omit<DokumenAdministrasiGuru, 'id'>) => void;
  updateAdministrasiGuru: (id: string, item: Partial<DokumenAdministrasiGuru>) => void;
  deleteAdministrasiGuru: (id: string) => void;
  kirimAdministrasiGuru: (id: string) => void;
  berikanUmpanBalikPositif: (
    id: string,
    feedback: {
      umpanBalikPositif: string;
      penilaiKS: string;
      bintangApresiasi?: number;
      aspekApresiasi?: string[];
      status?: DokumenAdministrasiGuru['status'];
    }
  ) => void;

  addRiwayatPelatihan: (item: Omit<RiwayatPelatihanGuru, 'id'>) => void;
  updateRiwayatPelatihan: (id: string, item: Partial<RiwayatPelatihanGuru>) => void;
  deleteRiwayatPelatihan: (id: string) => void;

  addPerencanaan: (item: Omit<DokumenPerencanaan, 'id'>) => void;
  updatePerencanaan: (id: string, item: Partial<DokumenPerencanaan>) => void;
  deletePerencanaan: (id: string) => void;

  addPBD: (item: Omit<IndikatorRaporPendidikan, 'id'>) => void;
  updatePBD: (id: string, item: Partial<IndikatorRaporPendidikan>) => void;
  deletePBD: (id: string) => void;

  addProgramUnggulan: (item: Omit<ProgramUnggulan, 'id'>) => void;
  updateProgramUnggulan: (id: string, item: Partial<ProgramUnggulan>) => void;
  deleteProgramUnggulan: (id: string) => void;

  addPTK: (item: Omit<PTKRecord, 'id'>) => void;
  updatePTK: (id: string, item: Partial<PTKRecord>) => void;
  deletePTK: (id: string) => void;

  addKelas: (item: Omit<KelasRecord, 'id'>) => void;
  updateKelas: (id: string, item: Partial<KelasRecord>) => void;
  deleteKelas: (id: string) => void;

  addSurat: (item: Omit<SuratRecord, 'id'>) => void;
  updateSurat: (id: string, item: Partial<SuratRecord>) => void;
  deleteSurat: (id: string) => void;

  addMOU: (item: Omit<MOUKerjasama, 'id'>) => void;
  updateMOU: (id: string, item: Partial<MOUKerjasama>) => void;
  deleteMOU: (id: string) => void;

  addSiswa: (item: Omit<Siswa, 'id'>) => void;
  bulkAddSiswa: (items: Omit<Siswa, 'id'>[]) => number;
  updateSiswa: (id: string, item: Partial<Siswa>) => void;
  deleteSiswa: (id: string) => void;

  addPresensi: (item: Omit<PresensiHarian, 'id'>) => void;
  updatePresensi: (id: string, item: Partial<PresensiHarian>) => void;
  deletePresensi: (id: string) => void;

  addPrestasi: (item: Omit<PrestasiSiswa, 'id'>) => void;
  updatePrestasi: (id: string, item: Partial<PrestasiSiswa>) => void;
  deletePrestasi: (id: string) => void;

  addProgramKarakter: (item: Omit<ProgramKarakter, 'id'>) => void;
  updateProgramKarakter: (id: string, item: Partial<ProgramKarakter>) => void;
  deleteProgramKarakter: (id: string) => void;

  addEkskul: (item: Omit<Ekstrakurikuler, 'id'>) => void;
  updateEkskul: (id: string, item: Partial<Ekstrakurikuler>) => void;
  deleteEkskul: (id: string) => void;

  addMasalahSiswa: (item: Omit<MasalahSiswa, 'id'>) => void;
  updateMasalahSiswa: (id: string, item: Partial<MasalahSiswa>) => void;
  deleteMasalahSiswa: (id: string) => void;

  addSupervisiAkademik: (item: Omit<SupervisiAkademik, 'id'>) => void;
  updateSupervisiAkademik: (id: string, item: Partial<SupervisiAkademik>) => void;
  deleteSupervisiAkademik: (id: string) => void;

  addSupervisiManajerial: (item: Omit<SupervisiManajerial, 'id'>) => void;
  updateSupervisiManajerial: (id: string, item: Partial<SupervisiManajerial>) => void;
  deleteSupervisiManajerial: (id: string) => void;

  addFormulirSupervisi: (item: Omit<FormulirSupervisiLengkap, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateFormulirSupervisi: (id: string, item: Partial<FormulirSupervisiLengkap>) => void;
  deleteFormulirSupervisi: (id: string) => void;
  syncFormulirToManajerial: (formulirId: string) => void;
  syncFormulirToAkademik: (formulirId: string) => void;
  syncAllFormulirToAkademik: () => void;

  addRKAS: (item: Omit<ItemRKAS, 'id'>) => void;
  updateRKAS: (id: string, item: Partial<ItemRKAS>) => void;
  deleteRKAS: (id: string) => void;

  addTransaksi: (item: Omit<TransaksiKeuangan, 'id'>) => void;
  updateTransaksi: (id: string, item: Partial<TransaksiKeuangan>) => void;
  deleteTransaksi: (id: string) => void;

  addSarpras: (item: Omit<ItemSarpras, 'id'>) => void;
  updateSarpras: (id: string, item: Partial<ItemSarpras>) => void;
  deleteSarpras: (id: string) => void;

  addPemeliharaan: (item: Omit<PemeliharaanSarpras, 'id'>) => void;
  updatePemeliharaan: (id: string, item: Partial<PemeliharaanSarpras>) => void;
  deletePemeliharaan: (id: string) => void;

  addPeminjaman: (item: Omit<PeminjamanSarpras, 'id'>) => void;
  updatePeminjaman: (id: string, item: Partial<PeminjamanSarpras>) => void;
  deletePeminjaman: (id: string) => void;

  addAgendaKS: (item: Omit<AgendaHarianKS, 'id'>) => void;
  updateAgendaKS: (id: string, item: Partial<AgendaHarianKS>) => void;
  deleteAgendaKS: (id: string) => void;

  addAgendaRapat: (item: Omit<AgendaRapat, 'id'>) => void;
  updateAgendaRapat: (id: string, item: Partial<AgendaRapat>) => void;
  deleteAgendaRapat: (id: string) => void;

  addBukuTamu: (item: Omit<BukuTamu, 'id'>) => void;
  updateBukuTamu: (id: string, item: Partial<BukuTamu>) => void;
  deleteBukuTamu: (id: string) => void;

  addJurnalKS: (item: Omit<JurnalKepemimpinan, 'id'>) => void;
  updateJurnalKS: (id: string, item: Partial<JurnalKepemimpinan>) => void;
  deleteJurnalKS: (id: string) => void;

  addKeputusanSK: (item: Omit<KeputusanSK, 'id'>) => void;
  updateKeputusanSK: (id: string, item: Partial<KeputusanSK>) => void;
  deleteKeputusanSK: (id: string) => void;

  addRencanaPerbaikan: (item: Omit<RencanaPerbaikan, 'id'>) => void;
  updateRencanaPerbaikan: (id: string, item: Partial<RencanaPerbaikan>) => void;
  deleteRencanaPerbaikan: (id: string) => void;

  // Firebase & Cloud Sync
  firebaseUser: User | null;
  isFirebaseConnected: boolean;
  isCloudSyncing: boolean;
  lastCloudSync: string | null;
  loginWithGoogle: () => Promise<void>;
  logoutFirebase: () => Promise<void>;
  forceCloudSync: () => Promise<void>;

  // Toast / Feedback
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Reset to initial
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`sdn_lanto_${key}`);
    if (!item || item === 'undefined' || item === 'null') return fallback;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return fallback;
    if (Array.isArray(fallback)) {
      return (Array.isArray(parsed) ? parsed : fallback) as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`sdn_lanto_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to local storage', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return loadFromStorage<boolean>('isSidebarCollapsed', false);
  });
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return loadFromStorage<boolean>('isAuthenticated', false);
  });
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const loaded = loadFromStorage<UserAccount[]>('users', initialUsers);
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : initialUsers;
  });
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = loadFromStorage<UserAccount | null>('currentUser', null);
    const userPool = loadFromStorage<UserAccount[]>('users', initialUsers);
    const validPool = Array.isArray(userPool) && userPool.length > 0 ? userPool : initialUsers;
    if (saved && validPool.some(u => u.id === saved.id)) return saved;
    return validPool[0] || initialUsers[0];
  });

  const [profilSekolah, setProfilSekolah] = useState<ProfilSekolah>(() => loadFromStorage('profilSekolah', initialProfilSekolah));
  const [perencanaanList, setPerencanaanList] = useState<DokumenPerencanaan[]>(() => loadFromStorage('perencanaan', initialPerencanaan));
  const [pbdList, setPbdList] = useState<IndikatorRaporPendidikan[]>(() => loadFromStorage('pbd', initialPBD));
  const [programUnggulanList, setProgramUnggulanList] = useState<ProgramUnggulan[]>(() => loadFromStorage('programUnggulan', initialProgramUnggulan));
  const [ptkList, setPtkList] = useState<PTKRecord[]>(() => loadFromStorage('ptk', initialPTK));
  const [kelasList, setKelasList] = useState<KelasRecord[]>(() => loadFromStorage('kelas', initialKelas));
  const [suratList, setSuratList] = useState<SuratRecord[]>(() => loadFromStorage('surat', initialSurat));
  const [mouList, setMouList] = useState<MOUKerjasama[]>(() => loadFromStorage('mou', initialMOU));
  const [siswaList, setSiswaList] = useState<Siswa[]>(() => loadFromStorage('siswa', initialSiswa));
  const [presensiList, setPresensiList] = useState<PresensiHarian[]>(() => loadFromStorage('presensi', initialPresensi));
  const [prestasiList, setPrestasiList] = useState<PrestasiSiswa[]>(() => loadFromStorage('prestasi', initialPrestasi));
  const [programKarakterList, setProgramKarakterList] = useState<ProgramKarakter[]>(() => loadFromStorage('programKarakter', initialProgramKarakter));
  const [ekskulList, setEkskulList] = useState<Ekstrakurikuler[]>(() => loadFromStorage('ekskul', initialEkstrakurikuler));
  const [masalahSiswaList, setMasalahSiswaList] = useState<MasalahSiswa[]>(() => loadFromStorage('masalahSiswa', initialMasalahSiswa));
  const [supervisiAkademikList, setSupervisiAkademikList] = useState<SupervisiAkademik[]>(() => loadFromStorage('supervisiAkademik', initialSupervisiAkademik));
  const [supervisiManajerialList, setSupervisiManajerialList] = useState<SupervisiManajerial[]>(() => loadFromStorage('supervisiManajerial', initialSupervisiManajerial));
  const [formulirSupervisiList, setFormulirSupervisiList] = useState<FormulirSupervisiLengkap[]>(() => loadFromStorage('formulirSupervisi', initialFormulirSupervisi));
  const [rkasList, setRkasList] = useState<ItemRKAS[]>(() => loadFromStorage('rkas', initialRKAS));
  const [transaksiList, setTransaksiList] = useState<TransaksiKeuangan[]>(() => loadFromStorage('transaksi', initialTransaksi));
  const [sarprasList, setSarprasList] = useState<ItemSarpras[]>(() => loadFromStorage('sarpras', initialSarpras));
  const [pemeliharaanList, setPemeliharaanList] = useState<PemeliharaanSarpras[]>(() => loadFromStorage('pemeliharaan', initialPemeliharaan));
  const [peminjamanList, setPeminjamanList] = useState<PeminjamanSarpras[]>(() => loadFromStorage('peminjaman', initialPeminjaman));
  const [agendaKSList, setAgendaKSList] = useState<AgendaHarianKS[]>(() => loadFromStorage('agendaKS', initialAgendaKS));
  const [agendaRapatList, setAgendaRapatList] = useState<AgendaRapat[]>(() => loadFromStorage('agendaRapat', initialAgendaRapat));
  const [bukuTamuList, setBukuTamuList] = useState<BukuTamu[]>(() => loadFromStorage('bukuTamu', initialBukuTamu));
  const [jurnalKSList, setJurnalKSList] = useState<JurnalKepemimpinan[]>(() => loadFromStorage('jurnalKS', initialJurnalKepemimpinan));
  const [keputusanSKList, setKeputusanSKList] = useState<KeputusanSK[]>(() => loadFromStorage('keputusanSK', initialKeputusanSK));
  const [rencanaPerbaikanList, setRencanaPerbaikanList] = useState<RencanaPerbaikan[]>(() => loadFromStorage('rencanaPerbaikan', initialRencanaPerbaikan));
  const [administrasiGuruList, setAdministrasiGuruList] = useState<DokumenAdministrasiGuru[]>(() => loadFromStorage('administrasiGuru', initialAdministrasiGuru));
  const [riwayatPelatihanList, setRiwayatPelatihanList] = useState<RiwayatPelatihanGuru[]>(() => loadFromStorage('riwayatPelatihan', initialRiwayatPelatihanGuru));

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Firebase & Cloud Sync States
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(() => loadFromStorage('lastCloudSync', null));

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsFirebaseConnected(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time changes
  useEffect(() => {
    const docPath = 'school_data/sdn_lanto_master';
    const unsub = onSnapshot(doc(db, 'school_data', 'sdn_lanto_master'), (snap) => {
      if (snap.exists()) {
        const cloudData = snap.data();
        if (cloudData.profilSekolah) setProfilSekolah(cloudData.profilSekolah);
        if (Array.isArray(cloudData.perencanaanList)) setPerencanaanList(cloudData.perencanaanList);
        if (Array.isArray(cloudData.pbdList)) setPbdList(cloudData.pbdList);
        if (Array.isArray(cloudData.programUnggulanList)) setProgramUnggulanList(cloudData.programUnggulanList);
        if (Array.isArray(cloudData.ptkList)) setPtkList(cloudData.ptkList);
        if (Array.isArray(cloudData.kelasList)) setKelasList(cloudData.kelasList);
        if (Array.isArray(cloudData.suratList)) setSuratList(cloudData.suratList);
        if (Array.isArray(cloudData.mouList)) setMouList(cloudData.mouList);
        if (Array.isArray(cloudData.users)) setUsers(cloudData.users);
        if (Array.isArray(cloudData.siswaList)) setSiswaList(cloudData.siswaList);
        if (Array.isArray(cloudData.presensiList)) setPresensiList(cloudData.presensiList);
        if (Array.isArray(cloudData.prestasiList)) setPrestasiList(cloudData.prestasiList);
        if (Array.isArray(cloudData.programKarakterList)) setProgramKarakterList(cloudData.programKarakterList);
        if (Array.isArray(cloudData.ekskulList)) setEkskulList(cloudData.ekskulList);
        if (Array.isArray(cloudData.masalahSiswaList)) setMasalahSiswaList(cloudData.masalahSiswaList);
        if (Array.isArray(cloudData.supervisiAkademikList)) setSupervisiAkademikList(cloudData.supervisiAkademikList);
        if (Array.isArray(cloudData.supervisiManajerialList)) setSupervisiManajerialList(cloudData.supervisiManajerialList);
        if (Array.isArray(cloudData.formulirSupervisiList)) setFormulirSupervisiList(cloudData.formulirSupervisiList);
        if (Array.isArray(cloudData.rkasList)) setRkasList(cloudData.rkasList);
        if (Array.isArray(cloudData.transaksiList)) setTransaksiList(cloudData.transaksiList);
        if (Array.isArray(cloudData.sarprasList)) setSarprasList(cloudData.sarprasList);
        if (Array.isArray(cloudData.pemeliharaanList)) setPemeliharaanList(cloudData.pemeliharaanList);
        if (Array.isArray(cloudData.peminjamanList)) setPeminjamanList(cloudData.peminjamanList);
        if (Array.isArray(cloudData.agendaKSList)) setAgendaKSList(cloudData.agendaKSList);
        if (Array.isArray(cloudData.agendaRapatList)) setAgendaRapatList(cloudData.agendaRapatList);
        if (Array.isArray(cloudData.bukuTamuList)) setBukuTamuList(cloudData.bukuTamuList);
        if (Array.isArray(cloudData.jurnalKSList)) setJurnalKSList(cloudData.jurnalKSList);
        if (Array.isArray(cloudData.keputusanSKList)) setKeputusanSKList(cloudData.keputusanSKList);
        if (Array.isArray(cloudData.rencanaPerbaikanList)) setRencanaPerbaikanList(cloudData.rencanaPerbaikanList);
        if (Array.isArray(cloudData.administrasiGuruList)) setAdministrasiGuruList(cloudData.administrasiGuruList);
        if (Array.isArray(cloudData.riwayatPelatihanList)) setRiwayatPelatihanList(cloudData.riwayatPelatihanList);
        const now = new Date().toLocaleTimeString('id-ID');
        setLastCloudSync(now);
      } else {
        // Automatically seed/push current data to Firestore if cloud document is not yet initialized
        setDoc(doc(db, 'school_data', 'sdn_lanto_master'), {
          profilSekolah,
          users,
          perencanaanList,
          pbdList,
          programUnggulanList,
          ptkList,
          kelasList,
          suratList,
          mouList,
          siswaList,
          presensiList,
          prestasiList,
          programKarakterList,
          ekskulList,
          masalahSiswaList,
          supervisiAkademikList,
          supervisiManajerialList,
          formulirSupervisiList,
          rkasList,
          transaksiList,
          sarprasList,
          pemeliharaanList,
          peminjamanList,
          agendaKSList,
          agendaRapatList,
          bukuTamuList,
          jurnalKSList,
          keputusanSKList,
          rencanaPerbaikanList,
          administrasiGuruList,
          riwayatPelatihanList,
          updatedAt: new Date().toISOString()
        }, { merge: true }).then(() => {
          const now = new Date().toLocaleTimeString('id-ID');
          setLastCloudSync(now);
        }).catch((err) => {
          console.warn('Initial Firestore Seed notice:', err.message);
        });
      }
    }, (error) => {
      // Don't crash if offline or permission denied
      console.warn('Firestore Snapshot Status:', error.message);
    });
    return () => unsub();
  }, [firebaseUser]);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          setDriveAccessToken(credential.accessToken);
        }
        showToast('success', 'Login Google & Drive Berhasil', `Selamat datang, ${result.user.displayName || result.user.email}! Akses Google Drive dan sinkronisasi Firestore telah aktif.`);
      }
    } catch (err: unknown) {
      console.error('Firebase/Google Login Error:', err);
      showToast('error', 'Login Google Gagal', err instanceof Error ? err.message : 'Tidak dapat login ke Google.');
    }
  };

  const logoutFirebase = async () => {
    try {
      await signOut(auth);
      setDriveAccessToken(null);
      showToast('info', 'Logout Google', 'Anda telah keluar dari akun Google & Firebase.');
    } catch (err: unknown) {
      console.error('Firebase Logout Error:', err);
    }
  };

  // Sync to local storage on changes
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => saveToStorage('profilSekolah', profilSekolah), [profilSekolah]);
  useEffect(() => saveToStorage('perencanaan', perencanaanList), [perencanaanList]);
  useEffect(() => saveToStorage('pbd', pbdList), [pbdList]);
  useEffect(() => saveToStorage('programUnggulan', programUnggulanList), [programUnggulanList]);
  useEffect(() => saveToStorage('ptk', ptkList), [ptkList]);
  useEffect(() => saveToStorage('kelas', kelasList), [kelasList]);
  useEffect(() => saveToStorage('surat', suratList), [suratList]);
  useEffect(() => saveToStorage('mou', mouList), [mouList]);
  useEffect(() => saveToStorage('siswa', siswaList), [siswaList]);
  useEffect(() => saveToStorage('presensi', presensiList), [presensiList]);
  useEffect(() => saveToStorage('prestasi', prestasiList), [prestasiList]);
  useEffect(() => saveToStorage('programKarakter', programKarakterList), [programKarakterList]);
  useEffect(() => saveToStorage('ekskul', ekskulList), [ekskulList]);
  useEffect(() => saveToStorage('masalahSiswa', masalahSiswaList), [masalahSiswaList]);
  useEffect(() => saveToStorage('supervisiAkademik', supervisiAkademikList), [supervisiAkademikList]);
  useEffect(() => saveToStorage('supervisiManajerial', supervisiManajerialList), [supervisiManajerialList]);
  useEffect(() => saveToStorage('formulirSupervisi', formulirSupervisiList), [formulirSupervisiList]);
  useEffect(() => saveToStorage('rkas', rkasList), [rkasList]);
  useEffect(() => saveToStorage('transaksi', transaksiList), [transaksiList]);
  useEffect(() => saveToStorage('sarpras', sarprasList), [sarprasList]);
  useEffect(() => saveToStorage('pemeliharaan', pemeliharaanList), [pemeliharaanList]);
  useEffect(() => saveToStorage('peminjaman', peminjamanList), [peminjamanList]);
  useEffect(() => saveToStorage('agendaKS', agendaKSList), [agendaKSList]);
  useEffect(() => saveToStorage('agendaRapat', agendaRapatList), [agendaRapatList]);
  useEffect(() => saveToStorage('bukuTamu', bukuTamuList), [bukuTamuList]);
  useEffect(() => saveToStorage('jurnalKS', jurnalKSList), [jurnalKSList]);
  useEffect(() => saveToStorage('keputusanSK', keputusanSKList), [keputusanSKList]);
  useEffect(() => saveToStorage('rencanaPerbaikan', rencanaPerbaikanList), [rencanaPerbaikanList]);
  useEffect(() => saveToStorage('isAuthenticated', isAuthenticated), [isAuthenticated]);
  useEffect(() => saveToStorage('isSidebarCollapsed', isSidebarCollapsed), [isSidebarCollapsed]);
  useEffect(() => saveToStorage('administrasiGuru', administrasiGuruList), [administrasiGuruList]);
  useEffect(() => saveToStorage('riwayatPelatihan', riwayatPelatihanList), [riwayatPelatihanList]);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logout = () => {
    setIsAuthenticated(false);
    saveToStorage('isAuthenticated', false);
    showToast('info', 'Sesi Berakhir', 'Anda telah keluar dari Sistem Informasi Manajemen Data Sekolah.');
  };

  const switchUserById = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      showToast('info', 'Beralih Akun Pengguna', `Anda sekarang aktif sebagai ${found.nama} (${found.jabatan})`);
    }
  };

  const loginWithCredentials = (
    identifier: string,
    password: string
  ): { success: boolean; message: string; user?: UserAccount } => {
    if (!identifier || !identifier.trim()) {
      showToast('error', 'Login Gagal', 'Harap masukkan NIP, Email, atau Username.');
      return { success: false, message: 'Harap masukkan NIP, Email, atau Username.' };
    }

    const rawInput = identifier.trim();
    const cleanDigitsInput = rawInput.replace(/\D/g, '');

    // Match by digits-only NIP, exact NIP string, email, or partial name
    const foundUser = users.find(u => {
      const userNipDigits = (u.nip || '').replace(/\D/g, '');
      if (cleanDigitsInput && cleanDigitsInput.length >= 6 && userNipDigits && userNipDigits === cleanDigitsInput) {
        return true;
      }
      if (u.nip && u.nip.trim().toLowerCase() === rawInput.toLowerCase()) {
        return true;
      }
      if (u.email && u.email.trim().toLowerCase() === rawInput.toLowerCase()) {
        return true;
      }
      if (u.nama && u.nama.trim().toLowerCase() === rawInput.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!foundUser) {
      const errMsg = `Akun "${rawInput}" tidak ditemukan dalam sistem sekolah.`;
      showToast('error', 'Login Gagal', errMsg);
      return { success: false, message: errMsg };
    }

    if (foundUser.status === 'Nonaktif') {
      const errMsg = `Akun ${foundUser.nama} sedang dinonaktifkan. Hubungi Administrator Sekolah.`;
      showToast('error', 'Akun Nonaktif', errMsg);
      return { success: false, message: errMsg };
    }

    const correctPassword = (foundUser.password && foundUser.password.trim()) || '123456';
    const inputPassword = (password || '').trim();

    if (inputPassword !== correctPassword) {
      const errMsg = 'Kata sandi salah. Gunakan kata sandi default: 123456';
      showToast('error', 'Password Salah', errMsg);
      return { success: false, message: errMsg };
    }

    // Success login
    setCurrentUser(foundUser);
    setIsAuthenticated(true);

    if (foundUser.role === 'guru') {
      setActiveTab('administrasi-guru');
    } else if (foundUser.role === 'kepala_sekolah' || foundUser.role === 'admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('kesiswaan');
    }

    showToast(
      'success',
      'Login Berhasil',
      `Selamat datang, ${foundUser.nama}! Anda masuk sebagai ${foundUser.jabatan}`
    );
    return { success: true, message: 'Login berhasil', user: foundUser };
  };

  const loginWithNipAndPassword = (
    nipOrIdentifier: string,
    password: string
  ): { success: boolean; message: string; user?: UserAccount } => {
    return loginWithCredentials(nipOrIdentifier, password);
  };

  const resetUserPasswordToDefault = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: '123456' } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, password: '123456' }));
    }
    showToast('success', 'Password Direset', 'Password pengguna berhasil direset ke standar default: 123456');
  };

  // Normalization helper to link PTK & User accounts by NIP digits or Name
  const isSamePerson = (
    a: { nip?: string; nama?: string },
    b: { nip?: string; nama?: string }
  ): boolean => {
    if (!a || !b) return false;
    const nipA = (a.nip || '').replace(/\D/g, '');
    const nipB = (b.nip || '').replace(/\D/g, '');
    if (nipA && nipB && nipA.length >= 6 && nipA === nipB) {
      return true;
    }
    const nameA = (a.nama || '').trim().toLowerCase();
    const nameB = (b.nama || '').trim().toLowerCase();
    if (nameA && nameB && nameA === nameB) {
      return true;
    }
    return false;
  };

  // Synchronize photo and profile between PTK and Users on load / change
  useEffect(() => {
    // 1. Sync PTK photos to Users if user lacks photo or is different
    setUsers(prevUsers => {
      let changed = false;
      const updated = prevUsers.map(user => {
        const matchingPTK = ptkList.find(p => isSamePerson(p, user));
        if (matchingPTK && matchingPTK.foto && user.foto !== matchingPTK.foto) {
          changed = true;
          return { ...user, foto: matchingPTK.foto };
        }
        return user;
      });
      return changed ? updated : prevUsers;
    });

    // 2. Sync User photos to PTK if PTK lacks photo
    setPtkList(prevPTK => {
      let changed = false;
      const updated = prevPTK.map(ptk => {
        const matchingUser = users.find(u => isSamePerson(u, ptk));
        if (matchingUser && matchingUser.foto && (!ptk.foto || ptk.foto !== matchingUser.foto)) {
          changed = true;
          return { ...ptk, foto: matchingUser.foto };
        }
        return ptk;
      });
      return changed ? updated : prevPTK;
    });

    // 3. Keep current logged in user photo up to date
    setCurrentUser(prevCurrent => {
      const matchingPTK = ptkList.find(p => isSamePerson(p, prevCurrent));
      if (matchingPTK && matchingPTK.foto && prevCurrent.foto !== matchingPTK.foto) {
        return { ...prevCurrent, foto: matchingPTK.foto };
      }
      return prevCurrent;
    });
  }, [ptkList.length]);

  const syncPTKToUserAccounts = (): { createdCount: number; message: string } => {
    let createdCount = 0;
    let updatedCount = 0;

    setUsers(prevUsers => {
      let currentUsers = [...prevUsers];

      ptkList.forEach(ptk => {
        const existingIndex = currentUsers.findIndex(u => isSamePerson(ptk, u));

        if (existingIndex >= 0) {
          // Update existing user with PTK photo and details
          const existingUser = currentUsers[existingIndex];
          const hasNewPhoto = ptk.foto && ptk.foto !== existingUser.foto;
          const hasNewNip = ptk.nip && ptk.nip !== existingUser.nip && existingUser.nip === '-';

          if (hasNewPhoto || hasNewNip) {
            currentUsers[existingIndex] = {
              ...existingUser,
              foto: ptk.foto || existingUser.foto,
              nip: existingUser.nip && existingUser.nip !== '-' ? existingUser.nip : ptk.nip,
              jabatan: ptk.jabatan || existingUser.jabatan
            };
            updatedCount++;
          }
        } else {
          let role: UserRole = 'guru';
          if (ptk.jabatan.toLowerCase().includes('kepala sekolah')) {
            role = 'kepala_sekolah';
          } else if (
            ptk.jabatan.toLowerCase().includes('administrasi') ||
            ptk.jabatan.toLowerCase().includes('tata usaha') ||
            ptk.jabatan.toLowerCase().includes('bendahara')
          ) {
            role = 'tata_usaha';
          }

          const newAccount: UserAccount = {
            id: `USR-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
            nama: ptk.nama,
            nip: ptk.nip || '-',
            email: ptk.email || `${ptk.nama.toLowerCase().replace(/[^a-z0-9]/g, '')}@sdnlanto.sch.id`,
            password: '123456',
            role,
            jabatan: ptk.jabatan,
            status: 'Aktif',
            foto: ptk.foto || '',
            telepon: ptk.telepon || '081234567890',
            tanggalEnrol: new Date().toISOString().split('T')[0]
          };

          currentUsers.push(newAccount);
          createdCount++;
        }
      });

      return currentUsers;
    });

    if (createdCount > 0 || updatedCount > 0) {
      const msg = `Sinkronisasi berhasil: ${createdCount} akun baru dienrol, ${updatedCount} foto & profil pengguna diperbarui dari data PTK.`;
      showToast('success', 'Sinkronisasi PTK & Pengguna', msg);
      return { createdCount, message: msg };
    } else {
      const msg = 'Semua data PTK dan akun pengguna sudah 100% tersinkron beserta pas fotonya.';
      showToast('info', 'Sudah Tersinkron', msg);
      return { createdCount: 0, message: msg };
    }
  };

  const updateProfilSekolah = (data: Partial<ProfilSekolah>) => {
    setProfilSekolah(prev => ({ ...prev, ...data }));
    showToast('success', 'Profil Diperbarui', 'Data profil sekolah berhasil disimpan.');
  };

  const addUser = (userData: Omit<UserAccount, 'id' | 'tanggalEnrol'>) => {
    // If matching PTK exists, prioritize syncing photo
    const matchingPTK = ptkList.find(p => isSamePerson(p, userData));
    const finalFoto = userData.foto || matchingPTK?.foto || '';

    const newUser: UserAccount = {
      ...userData,
      foto: finalFoto,
      id: `USR-${Date.now().toString().slice(-4)}`,
      tanggalEnrol: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);

    // If new user has a photo, sync back to PTK if PTK lacks one
    if (matchingPTK && finalFoto && (!matchingPTK.foto || matchingPTK.foto !== finalFoto)) {
      setPtkList(prev => prev.map(p => p.id === matchingPTK.id ? { ...p, foto: finalFoto } : p));
    }

    showToast('success', 'Pengguna Terenrol', `Akun ${newUser.nama} (${newUser.role.toUpperCase()}) berhasil ditambahkan.`);
  };

  const updateUser = (id: string, userData: Partial<UserAccount>) => {
    let updatedUser: UserAccount | undefined;

    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const merged = { ...u, ...userData };
        updatedUser = merged;
        return merged;
      }
      return u;
    }));

    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...userData }));
    }

    // Synchronize changes to matching PTK record in Manajemen Data PTK
    if (updatedUser) {
      const target = updatedUser;
      setPtkList(prev => prev.map(p => {
        if (isSamePerson(p, target)) {
          return {
            ...p,
            ...(userData.nama ? { nama: userData.nama } : {}),
            ...(userData.nip ? { nip: userData.nip } : {}),
            ...(userData.foto !== undefined ? { foto: userData.foto } : {}),
            ...(userData.email ? { email: userData.email } : {}),
            ...(userData.telepon ? { telepon: userData.telepon } : {}),
            ...(userData.jabatan ? { jabatan: userData.jabatan } : {})
          };
        }
        return p;
      }));
    }

    showToast('success', 'Pengguna Diperbarui', 'Data akun pengguna dan foto profil berhasil diperbarui & disinkronkan ke PTK.');
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      showToast('error', 'Gagal Menghapus', 'Minimal harus ada 1 pengguna tersisa.');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser.id === id) {
      const remaining = users.filter(u => u.id !== id);
      setCurrentUser(remaining[0]);
    }
    showToast('info', 'Pengguna Dihapus', 'Akun pengguna berhasil dihapus dari sistem.');
  };

  // Helper factory for generic state operations
  const createCRUD = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    entityName: string,
    prefix: string
  ) => {
    return {
      add: (item: Omit<T, 'id'>) => {
        const newItem = { ...item, id: `${prefix}-${Date.now().toString().slice(-4)}` } as T;
        setter(prev => [newItem, ...prev]);
        showToast('success', 'Data Ditambahkan', `Data ${entityName} berhasil disimpan.`);
      },
      update: (id: string, item: Partial<T>) => {
        setter(prev => prev.map(el => (el.id === id ? { ...el, ...item } : el)));
        showToast('success', 'Data Diperbarui', `Perubahan data ${entityName} berhasil disimpan.`);
      },
      delete: (id: string) => {
        setter(prev => prev.filter(el => el.id !== id));
        showToast('info', 'Data Dihapus', `Data ${entityName} berhasil dihapus.`);
      }
    };
  };

  // Specialized PTK operations with instant bidirectional sync to User Accounts
  const addPTK = (item: Omit<PTKRecord, 'id'>) => {
    const newPTK: PTKRecord = {
      ...item,
      id: `PTK-${Date.now().toString().slice(-4)}`
    };
    setPtkList(prev => [newPTK, ...prev]);

    // If matching User exists, sync photo and details
    setUsers(prev => prev.map(u => {
      if (isSamePerson(newPTK, u)) {
        return {
          ...u,
          ...(newPTK.foto ? { foto: newPTK.foto } : {}),
          ...(newPTK.nip ? { nip: newPTK.nip } : {}),
          ...(newPTK.nama ? { nama: newPTK.nama } : {}),
          ...(newPTK.jabatan ? { jabatan: newPTK.jabatan } : {})
        };
      }
      return u;
    }));

    showToast('success', 'PTK Ditambahkan', `Data PTK ${newPTK.nama} berhasil ditambahkan dan disinkronkan.`);
  };

  const updatePTK = (id: string, item: Partial<PTKRecord>) => {
    let updatedPTK: PTKRecord | undefined;

    setPtkList(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...item };
        updatedPTK = merged;
        return merged;
      }
      return p;
    }));

    // Synchronize to matching User account in Enrol Pengguna
    if (updatedPTK) {
      const target = updatedPTK;
      setUsers(prev => prev.map(u => {
        if (isSamePerson(target, u) || (item.nip && isSamePerson({ nip: item.nip, nama: item.nama || target.nama }, u))) {
          return {
            ...u,
            ...(item.nama ? { nama: item.nama } : {}),
            ...(item.nip ? { nip: item.nip } : {}),
            ...(item.foto !== undefined ? { foto: item.foto } : {}),
            ...(item.email ? { email: item.email } : {}),
            ...(item.telepon ? { telepon: item.telepon } : {}),
            ...(item.jabatan ? { jabatan: item.jabatan } : {})
          };
        }
        return u;
      }));

      // If current logged-in user is this PTK, update currentUser
      setCurrentUser(prev => {
        if (isSamePerson(target, prev)) {
          return {
            ...prev,
            ...(item.nama ? { nama: item.nama } : {}),
            ...(item.nip ? { nip: item.nip } : {}),
            ...(item.foto !== undefined ? { foto: item.foto } : {}),
            ...(item.email ? { email: item.email } : {}),
            ...(item.telepon ? { telepon: item.telepon } : {}),
            ...(item.jabatan ? { jabatan: item.jabatan } : {})
          };
        }
        return prev;
      });
    }

    showToast('success', 'Data PTK Diperbarui', 'Data dan pas foto PTK berhasil disimpan & otomatis disinkronkan ke akun login.');
  };

  const deletePTK = (id: string) => {
    setPtkList(prev => prev.filter(el => el.id !== id));
    showToast('info', 'Data Dihapus', 'Data PTK berhasil dihapus.');
  };

  const perencanaanCRUD = createCRUD<DokumenPerencanaan>(setPerencanaanList, 'Perencanaan', 'DOC');
  const pbdCRUD = createCRUD<IndikatorRaporPendidikan>(setPbdList, 'Perencanaan Berbasis Data', 'PBD');
  const programUnggulanCRUD = createCRUD<ProgramUnggulan>(setProgramUnggulanList, 'Program Unggulan', 'PRG');
  const kelasCRUD = createCRUD<KelasRecord>(setKelasList, 'Data Kelas', 'KLS');
  const suratCRUD = createCRUD<SuratRecord>(setSuratList, 'Persuratan', 'SRT');
  const mouCRUD = createCRUD<MOUKerjasama>(setMouList, 'MOU Kerjasama', 'MOU');
  const siswaCRUD = createCRUD<Siswa>(setSiswaList, 'Data Siswa', 'SIS');

  const bulkAddSiswa = (newSiswaList: Omit<Siswa, 'id'>[]): number => {
    if (!newSiswaList || newSiswaList.length === 0) return 0;
    const now = Date.now();
    const createdItems: Siswa[] = newSiswaList.map((item, index) => ({
      ...item,
      id: `SIS-${now.toString().slice(-4)}${index + 1}`
    }));
    setSiswaList(prev => [...createdItems, ...prev]);
    showToast(
      'success',
      'Upload Massal Berhasil',
      `${createdItems.length} data peserta didik berhasil ditambahkan ke database.`
    );
    return createdItems.length;
  };
  const presensiCRUD = createCRUD<PresensiHarian>(setPresensiList, 'Presensi Kelas', 'PRS');
  const prestasiCRUD = createCRUD<PrestasiSiswa>(setPrestasiList, 'Prestasi Siswa', 'PST');
  const programKarakterCRUD = createCRUD<ProgramKarakter>(setProgramKarakterList, 'Program Karakter', 'PK');
  const ekskulCRUD = createCRUD<Ekstrakurikuler>(setEkskulList, 'Ekstrakurikuler', 'EKS');
  const masalahSiswaCRUD = createCRUD<MasalahSiswa>(setMasalahSiswaList, 'Bimbingan & Masalah Siswa', 'MSH');
  const supervisiAkdCRUD = createCRUD<SupervisiAkademik>(setSupervisiAkademikList, 'Supervisi Akademik', 'SUP-AKD');
  const supervisiManCRUD = createCRUD<SupervisiManajerial>(setSupervisiManajerialList, 'Supervisi Manajerial', 'SUP-MAN');
  const rkasCRUD = createCRUD<ItemRKAS>(setRkasList, 'RKAS', 'RKAS');
  const transaksiCRUD = createCRUD<TransaksiKeuangan>(setTransaksiList, 'Transaksi Keuangan', 'TRX');
  const sarprasCRUD = createCRUD<ItemSarpras>(setSarprasList, 'Inventaris Sarpras', 'SAR');
  const pemeliharaanCRUD = createCRUD<PemeliharaanSarpras>(setPemeliharaanList, 'Pemeliharaan Sarpras', 'MNT');
  const peminjamanCRUD = createCRUD<PeminjamanSarpras>(setPeminjamanList, 'Peminjaman Sarpras', 'PINJ');
  const agendaKSCRUD = createCRUD<AgendaHarianKS>(setAgendaKSList, 'Agenda Kepala Sekolah', 'AGD');
  const agendaRapatCRUD = createCRUD<AgendaRapat>(setAgendaRapatList, 'Agenda Rapat Pegawai', 'RPT');
  const bukuTamuCRUD = createCRUD<BukuTamu>(setBukuTamuList, 'Buku Tamu', 'TMU');
  const jurnalKSCRUD = createCRUD<JurnalKepemimpinan>(setJurnalKSList, 'Jurnal Kepemimpinan', 'JRN');
  const keputusanSKCRUD = createCRUD<KeputusanSK>(setKeputusanSKList, 'Keputusan & SK', 'SK');
  const rencanaPerbaikanCRUD = createCRUD<RencanaPerbaikan>(setRencanaPerbaikanList, 'Rencana Perbaikan', 'RPB');
  const administrasiGuruCRUD = createCRUD<DokumenAdministrasiGuru>(setAdministrasiGuruList, 'Administrasi Guru', 'ADM-GURU');
  const riwayatPelatihanCRUD = createCRUD<RiwayatPelatihanGuru>(setRiwayatPelatihanList, 'Riwayat Pelatihan Guru', 'TRN');

  // Helper to convert Formulir 3 Tahap to Supervisi Akademik (Matriks Penilaian)
  const mapFormulirToSupervisiAkademik = (
    doc: FormulirSupervisiLengkap,
    existingId?: string
  ): SupervisiAkademik => {
    const comp1 = doc.observasi.areaObservasi.find(c => c.nomor === 1)?.ada ?? true;
    const comp2 = doc.observasi.areaObservasi.find(c => c.nomor === 2)?.ada ?? true;
    const comp3 = doc.observasi.areaObservasi.find(c => c.nomor === 3)?.ada ?? true;
    const comp4 = doc.observasi.areaObservasi.find(c => c.nomor === 4)?.ada ?? true;
    const comp5 = doc.observasi.areaObservasi.find(c => c.nomor === 5)?.ada ?? true;

    // Pra Observasi Scores
    const kesiapanModulAjar = doc.praObservasi.kesiapanModulAjar ? 95 : 65;
    const kesiapanMedia = doc.praObservasi.kesiapanMediaAjar ? 92 : 65;
    const kesiapanAsesmen = doc.praObservasi.kesiapanInstrumenAsesmen ? 90 : 65;
    const catatanPraObservasi =
      doc.praObservasi.catatanPraObservasi ||
      doc.praObservasi.tujuanPembelajaran ||
      'Modul ajar berdiferensiasi dan instrumen asesmen formatif lengkap.';

    // Observasi Kelas 6 Indikator Skor (0-100)
    const skorApersepsi = comp1 ? 94 : 65;
    const skorPenguasaanMateri = comp4 && comp5 ? 95 : comp5 ? 90 : 68;
    const skorPendekatanBerdiferensiasi = comp1 && comp3 ? 95 : comp1 ? 90 : 65;
    const skorInteraksiSiswa = comp3 && comp4 ? 94 : comp3 ? 88 : 70;
    const skorPemanfaatanTeknologi = comp2 ? 92 : 65;
    const skorAsesmenFormatif = comp5 ? 92 : 68;

    const totalSum =
      skorApersepsi +
      skorPenguasaanMateri +
      skorPendekatanBerdiferensiasi +
      skorInteraksiSiswa +
      skorPemanfaatanTeknologi +
      skorAsesmenFormatif;
    const totalSkor = parseFloat((totalSum / 6).toFixed(1));

    let kategoriNilai: 'Amat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan' = 'Baik';
    if (totalSkor >= 91) kategoriNilai = 'Amat Baik';
    else if (totalSkor >= 81) kategoriNilai = 'Baik';
    else if (totalSkor >= 71) kategoriNilai = 'Cukup';
    else kategoriNilai = 'Perlu Bimbingan';

    let status: 'Terjadwal' | 'Pra-Observasi' | 'Observasi Selesai' | 'Tuntas Ditindaklanjuti' = 'Observasi Selesai';
    if (doc.statusDokumen === 'Disahkan' || doc.statusDokumen === 'Pasca-Observasi Tuntas') {
      status = 'Tuntas Ditindaklanjuti';
    } else if (doc.statusDokumen === 'Observasi Berjalan') {
      status = 'Observasi Selesai';
    } else if (doc.statusDokumen === 'Pra-Observasi Selesai') {
      status = 'Pra-Observasi';
    } else {
      status = 'Terjadwal';
    }

    return {
      id: existingId || `SUP-AKD-${Date.now().toString().slice(-4)}`,
      namaGuru: doc.namaGuru,
      nip: doc.nipGuru || '',
      mataPelajaran: doc.mataPelajaran,
      kelas: doc.kelas,
      jadwalTanggal: doc.hariTanggal,
      jamKe: doc.waktuPercakapan || '08.00 - 09.30',
      supervisor: doc.namaSupervisor || profilSekolah.kepalaSekolah,
      kesiapanModulAjar,
      kesiapanMedia,
      kesiapanAsesmen,
      catatanPraObservasi,
      skorApersepsi,
      skorPenguasaanMateri,
      skorPendekatanBerdiferensiasi,
      skorInteraksiSiswa,
      skorPemanfaatanTeknologi,
      skorAsesmenFormatif,
      totalSkor,
      kategoriNilai,
      umpanBalik:
        doc.pascaObservasi.umpanBalikSupervisor ||
        doc.observasi.catatanTambahan ||
        'Pembelajaran diferensiasi aktif dan interaktif.',
      kelebihan:
        doc.pascaObservasi.ketercapaianTujuan ||
        'Pengelolaan kelas kondusif dan pemanfaatan media ajar sangat efektif.',
      areaPeningkatan:
        doc.pascaObservasi.sasaranPerbaikan ||
        'Perlu penguatan asesmen formatif berkelanjutan.',
      tindakLanjut:
        doc.pascaObservasi.rencanaTindakLanjut ||
        doc.pascaObservasi.rekomendasiAkhir ||
        'Berbagi praktik baik di Komunitas Belajar (Kombel) Guru.',
      status,
      formulirSupervisiId: doc.id,
      sinkronDariFormulir: true
    };
  };

  const addFormulirSupervisi = (item: Omit<FormulirSupervisiLengkap, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `FORM-SUP-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    const newDoc: FormulirSupervisiLengkap = {
      ...item,
      id: newId,
      createdAt: now.split('T')[0],
      updatedAt: now.split('T')[0]
    };

    // Auto sync to Supervisi Akademik (Matriks Penilaian) by default
    if (newDoc.sinkronKeAkademik !== false) {
      const newAkdId = `SUP-AKD-${Date.now().toString().slice(-4)}`;
      const mappedAkd = mapFormulirToSupervisiAkademik(newDoc, newAkdId);
      setSupervisiAkademikList(prev => [mappedAkd, ...prev]);
      newDoc.akademikRefId = newAkdId;
    }

    // Auto sync to Supervisi Manajerial if enabled
    if (newDoc.sinkronKeManajerial) {
      const checkedCount = newDoc.observasi.areaObservasi.filter(a => a.ada).length;
      const totalCount = newDoc.observasi.areaObservasi.length || 5;
      const manajerialTitle = `Instrumen 3 Formulir Observasi Kelas 5 Komponen (${newDoc.namaGuru} - ${newDoc.mataPelajaran})`;
      const hasilTemuan = `[Observasi ${newDoc.observasi.kategoriHasil}] ${checkedCount}/${totalCount} Komponen Terpenuhi. ${newDoc.observasi.catatanTambahan}`;
      const evaluasiProgram = `Pra-Observasi: ${newDoc.praObservasi.tujuanPembelajaran || 'Tujuan terdefinisi'} | Pasca: ${newDoc.pascaObservasi.ketercapaianTujuan || 'Refleksi pembelajaran dicatat'}`;
      const rekomendasiTindakLanjut = newDoc.pascaObservasi.rencanaTindakLanjut || newDoc.pascaObservasi.rekomendasiAkhir || 'Pertahankan praktik baik pembelajaran berdiferensiasi.';
      const statusManajerial = (newDoc.observasi.kategoriHasil === 'Sangat Baik' || newDoc.observasi.kategoriHasil === 'Baik') ? 'Sesuai Standar' : 'Perlu Perbaikan';

      const newManId = `SUP-MAN-${Date.now().toString().slice(-4)}`;
      const newManRecord: SupervisiManajerial = {
        id: newManId,
        aspekStandar: 'Standar Proses',
        instrumen: manajerialTitle,
        tanggalPemantauan: newDoc.hariTanggal.includes('-') ? newDoc.hariTanggal : new Date().toISOString().split('T')[0],
        petugasPemantau: newDoc.namaSupervisor,
        hasilTemuan,
        evaluasiProgram,
        rekomendasiTindakLanjut,
        status: statusManajerial,
        formulirSupervisiId: newId
      };
      setSupervisiManajerialList(prev => [newManRecord, ...prev]);
      newDoc.manajerialRefId = newManId;
    }

    setFormulirSupervisiList(prev => [newDoc, ...prev]);

    showToast('success', 'Formulir Supervisi Disimpan', `Formulir 3 Tahap untuk ${item.namaGuru} berhasil disimpan dan nilai observasi disinkronkan ke Matriks Penilaian.`);
    return newId;
  };

  const updateFormulirSupervisi = (id: string, item: Partial<FormulirSupervisiLengkap>) => {
    let updatedDoc: FormulirSupervisiLengkap | undefined;

    setFormulirSupervisiList(prev => prev.map(f => {
      if (f.id === id) {
        const merged: FormulirSupervisiLengkap = {
          ...f,
          ...item,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        updatedDoc = merged;
        return merged;
      }
      return f;
    }));

    // Auto sync to Supervisi Akademik (Matriks Penilaian)
    if (updatedDoc && updatedDoc.sinkronKeAkademik !== false) {
      const doc = updatedDoc;
      setSupervisiAkademikList(prev => {
        const exists = prev.some(
          s => s.formulirSupervisiId === id || s.id === doc.akademikRefId || (s.namaGuru === doc.namaGuru && s.mataPelajaran === doc.mataPelajaran)
        );
        if (exists) {
          return prev.map(s => {
            if (s.formulirSupervisiId === id || s.id === doc.akademikRefId || (s.namaGuru === doc.namaGuru && s.mataPelajaran === doc.mataPelajaran)) {
              return mapFormulirToSupervisiAkademik(doc, s.id);
            }
            return s;
          });
        } else {
          const newAkdId = `SUP-AKD-${Date.now().toString().slice(-4)}`;
          return [mapFormulirToSupervisiAkademik(doc, newAkdId), ...prev];
        }
      });
    }

    // If synced, update the corresponding Supervisi Manajerial entry
    if (updatedDoc && updatedDoc.sinkronKeManajerial) {
      const doc = updatedDoc;
      const checkedCount = doc.observasi.areaObservasi.filter(a => a.ada).length;
      const totalCount = doc.observasi.areaObservasi.length || 5;
      const manajerialTitle = `Instrumen 3 Formulir Observasi Kelas 5 Komponen (${doc.namaGuru} - ${doc.mataPelajaran})`;
      const hasilTemuan = `[Observasi ${doc.observasi.kategoriHasil}] ${checkedCount}/${totalCount} Komponen Terpenuhi. ${doc.observasi.catatanTambahan}`;
      const evaluasiProgram = `Pra-Observasi: ${doc.praObservasi.tujuanPembelajaran || 'Tujuan terdefinisi'} | Pasca: ${doc.pascaObservasi.ketercapaianTujuan || 'Refleksi pembelajaran dicatat'}`;
      const rekomendasiTindakLanjut = doc.pascaObservasi.rencanaTindakLanjut || doc.pascaObservasi.rekomendasiAkhir || 'Pertahankan praktik baik pembelajaran berdiferensiasi.';
      const statusManajerial = (doc.observasi.kategoriHasil === 'Sangat Baik' || doc.observasi.kategoriHasil === 'Baik') ? 'Sesuai Standar' : 'Perlu Perbaikan';

      setSupervisiManajerialList(prev => {
        const exists = prev.some(m => m.formulirSupervisiId === id || m.id === doc.manajerialRefId);
        if (exists) {
          return prev.map(m => {
            if (m.formulirSupervisiId === id || m.id === doc.manajerialRefId) {
              return {
                ...m,
                aspekStandar: 'Standar Proses',
                instrumen: manajerialTitle,
                tanggalPemantauan: doc.hariTanggal.includes('-') ? doc.hariTanggal : new Date().toISOString().split('T')[0],
                petugasPemantau: doc.namaSupervisor,
                hasilTemuan,
                evaluasiProgram,
                rekomendasiTindakLanjut,
                status: statusManajerial,
                formulirSupervisiId: id
              };
            }
            return m;
          });
        } else {
          const newManId = `SUP-MAN-${Date.now().toString().slice(-4)}`;
          return [{
            id: newManId,
            aspekStandar: 'Standar Proses',
            instrumen: manajerialTitle,
            tanggalPemantauan: doc.hariTanggal.includes('-') ? doc.hariTanggal : new Date().toISOString().split('T')[0],
            petugasPemantau: doc.namaSupervisor,
            hasilTemuan,
            evaluasiProgram,
            rekomendasiTindakLanjut,
            status: statusManajerial,
            formulirSupervisiId: id
          }, ...prev];
        }
      });
    }

    showToast('success', 'Formulir Supervisi Diperbarui', 'Perubahan formulir supervisi dan nilai matriks penilaian berhasil disinkronkan.');
  };

  const deleteFormulirSupervisi = (id: string) => {
    setFormulirSupervisiList(prev => prev.filter(f => f.id !== id));
    // Also unlink or remove matching record in Supervisi Manajerial
    setSupervisiManajerialList(prev => prev.filter(m => m.formulirSupervisiId !== id));
    // Mark or clean up link in Supervisi Akademik
    setSupervisiAkademikList(prev =>
      prev.map(s => (s.formulirSupervisiId === id ? { ...s, sinkronDariFormulir: false, formulirSupervisiId: undefined } : s))
    );
    showToast('info', 'Formulir Dihapus', 'Dokumen formulir supervisi berhasil dihapus.');
  };

  const syncFormulirToAkademik = (formulirId: string) => {
    const doc = formulirSupervisiList.find(f => f.id === formulirId);
    if (!doc) return;

    let targetAkdId: string | undefined;

    setSupervisiAkademikList(prev => {
      const existing = prev.find(
        s =>
          s.formulirSupervisiId === formulirId ||
          s.id === doc.akademikRefId ||
          (s.namaGuru === doc.namaGuru && s.mataPelajaran === doc.mataPelajaran)
      );
      if (existing) {
        targetAkdId = existing.id;
        const mapped = mapFormulirToSupervisiAkademik(doc, existing.id);
        return prev.map(s => (s.id === existing.id ? mapped : s));
      } else {
        const newId = `SUP-AKD-${Date.now().toString().slice(-4)}`;
        targetAkdId = newId;
        const mapped = mapFormulirToSupervisiAkademik(doc, newId);
        return [mapped, ...prev];
      }
    });

    if (targetAkdId) {
      setFormulirSupervisiList(prev =>
        prev.map(f => (f.id === formulirId ? { ...f, akademikRefId: targetAkdId, sinkronKeAkademik: true } : f))
      );
    }

    showToast(
      'success',
      'Nilai Observasi Disinkronkan',
      `Nilai observasi 5 komponen dari ${doc.namaGuru} (${doc.mataPelajaran}) berhasil disinkronkan ke Matriks Penilaian Supervisi Akademik.`
    );
  };

  const syncAllFormulirToAkademik = () => {
    if (!formulirSupervisiList || formulirSupervisiList.length === 0) {
      showToast('info', 'Tidak Ada Data', 'Belum ada formulir supervisi 3 tahap untuk disinkronkan.');
      return;
    }

    setSupervisiAkademikList(prev => {
      let currentList = [...prev];
      formulirSupervisiList.forEach(doc => {
        const existing = currentList.find(
          s =>
            s.formulirSupervisiId === doc.id ||
            s.id === doc.akademikRefId ||
            (s.namaGuru === doc.namaGuru && s.mataPelajaran === doc.mataPelajaran)
        );
        if (existing) {
          const mapped = mapFormulirToSupervisiAkademik(doc, existing.id);
          currentList = currentList.map(s => (s.id === existing.id ? mapped : s));
        } else {
          const newId = `SUP-AKD-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;
          const mapped = mapFormulirToSupervisiAkademik(doc, newId);
          currentList = [mapped, ...currentList];
        }
      });
      return currentList;
    });

    showToast(
      'success',
      'Sinkronisasi Massal Berhasil',
      `Semua nilai observasi (${formulirSupervisiList.length} Formulir Supervisi) telah berhasil disinkronkan ke Matriks Penilaian Supervisi Akademik.`
    );
  };

  const syncFormulirToManajerial = (formulirId: string) => {
    const doc = formulirSupervisiList.find(f => f.id === formulirId);
    if (!doc) return;

    const checkedCount = doc.observasi.areaObservasi.filter(a => a.ada).length;
    const totalCount = doc.observasi.areaObservasi.length || 5;
    const manajerialTitle = `Instrumen 3 Formulir Observasi Kelas 5 Komponen (${doc.namaGuru} - ${doc.mataPelajaran})`;
    const hasilTemuan = `[Observasi ${doc.observasi.kategoriHasil}] ${checkedCount}/${totalCount} Komponen Terpenuhi. ${doc.observasi.catatanTambahan}`;
    const evaluasiProgram = `Pra-Observasi: ${doc.praObservasi.tujuanPembelajaran || 'Tujuan terdefinisi'} | Pasca: ${doc.pascaObservasi.ketercapaianTujuan || 'Refleksi pembelajaran dicatat'}`;
    const rekomendasiTindakLanjut = doc.pascaObservasi.rencanaTindakLanjut || doc.pascaObservasi.rekomendasiAkhir || 'Pertahankan praktik baik pembelajaran berdiferensiasi.';
    const statusManajerial = (doc.observasi.kategoriHasil === 'Sangat Baik' || doc.observasi.kategoriHasil === 'Baik') ? 'Sesuai Standar' : 'Perlu Perbaikan';

    setSupervisiManajerialList(prev => {
      const exists = prev.some(m => m.formulirSupervisiId === formulirId || m.id === doc.manajerialRefId);
      if (exists) {
        return prev.map(m => {
          if (m.formulirSupervisiId === formulirId || m.id === doc.manajerialRefId) {
            return {
              ...m,
              aspekStandar: 'Standar Proses',
              instrumen: manajerialTitle,
              tanggalPemantauan: doc.hariTanggal.includes('-') ? doc.hariTanggal : new Date().toISOString().split('T')[0],
              petugasPemantau: doc.namaSupervisor,
              hasilTemuan,
              evaluasiProgram,
              rekomendasiTindakLanjut,
              status: statusManajerial,
              formulirSupervisiId: formulirId
            };
          }
          return m;
        });
      } else {
        const newManId = `SUP-MAN-${Date.now().toString().slice(-4)}`;
        return [{
          id: newManId,
          aspekStandar: 'Standar Proses',
          instrumen: manajerialTitle,
          tanggalPemantauan: doc.hariTanggal.includes('-') ? doc.hariTanggal : new Date().toISOString().split('T')[0],
          petugasPemantau: doc.namaSupervisor,
          hasilTemuan,
          evaluasiProgram,
          rekomendasiTindakLanjut,
          status: statusManajerial,
          formulirSupervisiId: formulirId
        }, ...prev];
      }
    });

    showToast('success', 'Sinkronisasi Berhasil', `Data hasil observasi pembelajaran ${doc.namaGuru} telah disinkronkan ke Matriks Supervisi Manajerial.`);
  };

  const kirimAdministrasiGuru = (id: string) => {
    setAdministrasiGuruList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Terkirim',
          tanggalKirim: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    showToast('success', 'Dokumen Terkirim', 'Dokumen administrasi guru berhasil dikirimkan ke Kepala Sekolah untuk ditinjau.');
  };

  const berikanUmpanBalikPositif = (
    id: string,
    feedback: {
      umpanBalikPositif: string;
      penilaiKS: string;
      bintangApresiasi?: number;
      aspekApresiasi?: string[];
      status?: DokumenAdministrasiGuru['status'];
    }
  ) => {
    setAdministrasiGuruList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          umpanBalikPositif: feedback.umpanBalikPositif,
          penilaiKS: feedback.penilaiKS,
          bintangApresiasi: feedback.bintangApresiasi || 5,
          aspekApresiasi: feedback.aspekApresiasi && feedback.aspekApresiasi.length > 0 ? feedback.aspekApresiasi : ['Sesuai Capaian Pembelajaran'],
          tanggalUmpanBalik: new Date().toISOString().split('T')[0],
          status: feedback.status || 'Disetujui Penuh'
        };
      }
      return item;
    }));
    showToast('success', 'Umpan Balik Positif Diberikan', 'Apresiasi dan umpan balik positif berhasil disimpan untuk guru.');
  };

  const forceCloudSync = useCallback(async () => {
    setIsCloudSyncing(true);
    const docPath = 'school_data/sdn_lanto_master';
    try {
      await setDoc(doc(db, 'school_data', 'sdn_lanto_master'), {
        profilSekolah,
        users,
        perencanaanList,
        pbdList,
        programUnggulanList,
        ptkList,
        suratList,
        mouList,
        siswaList,
        presensiList,
        prestasiList,
        programKarakterList,
        ekskulList,
        masalahSiswaList,
        supervisiAkademikList,
        supervisiManajerialList,
        formulirSupervisiList,
        rkasList,
        transaksiList,
        sarprasList,
        pemeliharaanList,
        peminjamanList,
        agendaKSList,
        bukuTamuList,
        jurnalKSList,
        keputusanSKList,
        rencanaPerbaikanList,
        administrasiGuruList,
        riwayatPelatihanList,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const now = new Date().toLocaleTimeString('id-ID');
      setLastCloudSync(now);
      saveToStorage('lastCloudSync', now);
      showToast('success', 'Database Cloud Terperbarui', 'Seluruh data master sekolah SDN Lanto Dg. Pasewang berhasil disimpan ke Firebase Cloud Firestore.');
    } catch (error) {
      console.error('Cloud Sync Error:', error);
      handleFirestoreError(error, OperationType.WRITE, docPath);
      showToast('error', 'Gagal Sinkronisasi', 'Terjadi kendala saat menyinkronkan data ke Cloud Firestore.');
    } finally {
      setIsCloudSyncing(false);
    }
  }, [
    profilSekolah,
    users,
    perencanaanList,
    pbdList,
    programUnggulanList,
    ptkList,
    kelasList,
    suratList,
    mouList,
    siswaList,
    presensiList,
    prestasiList,
    programKarakterList,
    ekskulList,
    masalahSiswaList,
    supervisiAkademikList,
    supervisiManajerialList,
    rkasList,
    transaksiList,
    sarprasList,
    pemeliharaanList,
    peminjamanList,
    agendaKSList,
    bukuTamuList,
    jurnalKSList,
    keputusanSKList,
    rencanaPerbaikanList,
    administrasiGuruList,
    riwayatPelatihanList,
    formulirSupervisiList
  ]);

  const resetAllData = () => {
    localStorage.clear();
    setProfilSekolah(initialProfilSekolah);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setPerencanaanList(initialPerencanaan);
    setPbdList(initialPBD);
    setProgramUnggulanList(initialProgramUnggulan);
    setPtkList(initialPTK);
    setKelasList(initialKelas);
    setSuratList(initialSurat);
    setMouList(initialMOU);
    setSiswaList(initialSiswa);
    setPresensiList(initialPresensi);
    setPrestasiList(initialPrestasi);
    setProgramKarakterList(initialProgramKarakter);
    setEkskulList(initialEkstrakurikuler);
    setMasalahSiswaList(initialMasalahSiswa);
    setSupervisiAkademikList(initialSupervisiAkademik);
    setSupervisiManajerialList(initialSupervisiManajerial);
    setFormulirSupervisiList(initialFormulirSupervisi);
    setRkasList(initialRKAS);
    setTransaksiList(initialTransaksi);
    setSarprasList(initialSarpras);
    setPemeliharaanList(initialPemeliharaan);
    setPeminjamanList(initialPeminjaman);
    setAgendaKSList(initialAgendaKS);
    setAgendaRapatList(initialAgendaRapat);
    setBukuTamuList(initialBukuTamu);
    setJurnalKSList(initialJurnalKepemimpinan);
    setKeputusanSKList(initialKeputusanSK);
    setRencanaPerbaikanList(initialRencanaPerbaikan);
    setAdministrasiGuruList(initialAdministrasiGuru);
    setRiwayatPelatihanList(initialRiwayatPelatihanGuru);
    showToast('info', 'Data Direset', 'Semua data telah dikembalikan ke standar awal UPTD SPF SDN Lanto Dg. Pasewang.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapse,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        users: Array.isArray(users) ? users : initialUsers,
        userList: Array.isArray(users) ? users : initialUsers,
        switchUserById,
        loginWithNipAndPassword,
        loginWithCredentials,
        resetUserPasswordToDefault,
        syncPTKToUserAccounts,
        profilSekolah,
        perencanaanList: Array.isArray(perencanaanList) ? perencanaanList : initialPerencanaan,
        pbdList: Array.isArray(pbdList) ? pbdList : initialPBD,
        programUnggulanList: Array.isArray(programUnggulanList) ? programUnggulanList : initialProgramUnggulan,
        ptkList: Array.isArray(ptkList) ? ptkList : initialPTK,
        kelasList: Array.isArray(kelasList) ? kelasList : initialKelas,
        suratList: Array.isArray(suratList) ? suratList : initialSurat,
        mouList: Array.isArray(mouList) ? mouList : initialMOU,
        siswaList: Array.isArray(siswaList) ? siswaList : initialSiswa,
        presensiList: Array.isArray(presensiList) ? presensiList : initialPresensi,
        prestasiList: Array.isArray(prestasiList) ? prestasiList : initialPrestasi,
        programKarakterList: Array.isArray(programKarakterList) ? programKarakterList : initialProgramKarakter,
        ekskulList: Array.isArray(ekskulList) ? ekskulList : initialEkstrakurikuler,
        masalahSiswaList: Array.isArray(masalahSiswaList) ? masalahSiswaList : initialMasalahSiswa,
        supervisiAkademikList: Array.isArray(supervisiAkademikList) ? supervisiAkademikList : initialSupervisiAkademik,
        supervisiManajerialList: Array.isArray(supervisiManajerialList) ? supervisiManajerialList : initialSupervisiManajerial,
        formulirSupervisiList: Array.isArray(formulirSupervisiList) ? formulirSupervisiList : initialFormulirSupervisi,
        rkasList: Array.isArray(rkasList) ? rkasList : initialRKAS,
        transaksiList: Array.isArray(transaksiList) ? transaksiList : initialTransaksi,
        sarprasList: Array.isArray(sarprasList) ? sarprasList : initialSarpras,
        pemeliharaanList: Array.isArray(pemeliharaanList) ? pemeliharaanList : initialPemeliharaan,
        peminjamanList: Array.isArray(peminjamanList) ? peminjamanList : initialPeminjaman,
        agendaKSList: Array.isArray(agendaKSList) ? agendaKSList : initialAgendaKS,
        agendaRapatList: Array.isArray(agendaRapatList) ? agendaRapatList : initialAgendaRapat,
        bukuTamuList: Array.isArray(bukuTamuList) ? bukuTamuList : initialBukuTamu,
        jurnalKSList: Array.isArray(jurnalKSList) ? jurnalKSList : initialJurnalKepemimpinan,
        keputusanSKList: Array.isArray(keputusanSKList) ? keputusanSKList : initialKeputusanSK,
        rencanaPerbaikanList: Array.isArray(rencanaPerbaikanList) ? rencanaPerbaikanList : initialRencanaPerbaikan,
        administrasiGuruList: Array.isArray(administrasiGuruList) ? administrasiGuruList : initialAdministrasiGuru,
        riwayatPelatihanList: Array.isArray(riwayatPelatihanList) ? riwayatPelatihanList : initialRiwayatPelatihanGuru,

        updateProfilSekolah,
        addUser,
        updateUser,
        deleteUser,

        addAdministrasiGuru: administrasiGuruCRUD.add,
        updateAdministrasiGuru: administrasiGuruCRUD.update,
        deleteAdministrasiGuru: administrasiGuruCRUD.delete,
        kirimAdministrasiGuru,
        berikanUmpanBalikPositif,

        addRiwayatPelatihan: riwayatPelatihanCRUD.add,
        updateRiwayatPelatihan: riwayatPelatihanCRUD.update,
        deleteRiwayatPelatihan: riwayatPelatihanCRUD.delete,

        addPerencanaan: perencanaanCRUD.add,
        updatePerencanaan: perencanaanCRUD.update,
        deletePerencanaan: perencanaanCRUD.delete,

        addPBD: pbdCRUD.add,
        updatePBD: pbdCRUD.update,
        deletePBD: pbdCRUD.delete,

        addProgramUnggulan: programUnggulanCRUD.add,
        updateProgramUnggulan: programUnggulanCRUD.update,
        deleteProgramUnggulan: programUnggulanCRUD.delete,

        addPTK,
        updatePTK,
        deletePTK,

        addKelas: kelasCRUD.add,
        updateKelas: kelasCRUD.update,
        deleteKelas: kelasCRUD.delete,

        addSurat: suratCRUD.add,
        updateSurat: suratCRUD.update,
        deleteSurat: suratCRUD.delete,

        addMOU: mouCRUD.add,
        updateMOU: mouCRUD.update,
        deleteMOU: mouCRUD.delete,

        addSiswa: siswaCRUD.add,
        bulkAddSiswa,
        updateSiswa: siswaCRUD.update,
        deleteSiswa: siswaCRUD.delete,

        addPresensi: presensiCRUD.add,
        updatePresensi: presensiCRUD.update,
        deletePresensi: presensiCRUD.delete,

        addPrestasi: prestasiCRUD.add,
        updatePrestasi: prestasiCRUD.update,
        deletePrestasi: prestasiCRUD.delete,

        addProgramKarakter: programKarakterCRUD.add,
        updateProgramKarakter: programKarakterCRUD.update,
        deleteProgramKarakter: programKarakterCRUD.delete,

        addEkskul: ekskulCRUD.add,
        updateEkskul: ekskulCRUD.update,
        deleteEkskul: ekskulCRUD.delete,

        addMasalahSiswa: masalahSiswaCRUD.add,
        updateMasalahSiswa: masalahSiswaCRUD.update,
        deleteMasalahSiswa: masalahSiswaCRUD.delete,

        addSupervisiAkademik: supervisiAkdCRUD.add,
        updateSupervisiAkademik: supervisiAkdCRUD.update,
        deleteSupervisiAkademik: supervisiAkdCRUD.delete,

        addSupervisiManajerial: supervisiManCRUD.add,
        updateSupervisiManajerial: supervisiManCRUD.update,
        deleteSupervisiManajerial: supervisiManCRUD.delete,

        addFormulirSupervisi,
        updateFormulirSupervisi,
        deleteFormulirSupervisi,
        syncFormulirToManajerial,
        syncFormulirToAkademik,
        syncAllFormulirToAkademik,

        addRKAS: rkasCRUD.add,
        updateRKAS: rkasCRUD.update,
        deleteRKAS: rkasCRUD.delete,

        addTransaksi: transaksiCRUD.add,
        updateTransaksi: transaksiCRUD.update,
        deleteTransaksi: transaksiCRUD.delete,

        addSarpras: sarprasCRUD.add,
        updateSarpras: sarprasCRUD.update,
        deleteSarpras: sarprasCRUD.delete,

        addPemeliharaan: pemeliharaanCRUD.add,
        updatePemeliharaan: pemeliharaanCRUD.update,
        deletePemeliharaan: pemeliharaanCRUD.delete,

        addPeminjaman: peminjamanCRUD.add,
        updatePeminjaman: peminjamanCRUD.update,
        deletePeminjaman: peminjamanCRUD.delete,

        addAgendaKS: agendaKSCRUD.add,
        updateAgendaKS: agendaKSCRUD.update,
        deleteAgendaKS: agendaKSCRUD.delete,

        addAgendaRapat: agendaRapatCRUD.add,
        updateAgendaRapat: agendaRapatCRUD.update,
        deleteAgendaRapat: agendaRapatCRUD.delete,

        addBukuTamu: bukuTamuCRUD.add,
        updateBukuTamu: bukuTamuCRUD.update,
        deleteBukuTamu: bukuTamuCRUD.delete,

        addJurnalKS: jurnalKSCRUD.add,
        updateJurnalKS: jurnalKSCRUD.update,
        deleteJurnalKS: jurnalKSCRUD.delete,

        addKeputusanSK: keputusanSKCRUD.add,
        updateKeputusanSK: keputusanSKCRUD.update,
        deleteKeputusanSK: keputusanSKCRUD.delete,

        addRencanaPerbaikan: rencanaPerbaikanCRUD.add,
        updateRencanaPerbaikan: rencanaPerbaikanCRUD.update,
        deleteRencanaPerbaikan: rencanaPerbaikanCRUD.delete,

        toasts,
        showToast,
        removeToast,
        resetAllData,

        // Firebase & Cloud Sync
        firebaseUser,
        isFirebaseConnected,
        isCloudSyncing,
        lastCloudSync,
        loginWithGoogle,
        logoutFirebase,
        forceCloudSync
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
