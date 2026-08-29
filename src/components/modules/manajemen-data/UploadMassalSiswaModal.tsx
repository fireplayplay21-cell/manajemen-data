import React, { useState, useRef } from 'react';
import { Modal } from '../../common/Modal';
import { Siswa } from '../../../types';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileText,
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';

interface UploadMassalSiswaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStudents: Omit<Siswa, 'id'>[]) => void;
  existingSiswa: Siswa[];
  availableClasses: string[];
}

interface ParsedStudentRow {
  id: string;
  raw: string[];
  nama: string;
  nisn: string;
  kelas: string;
  jenisKelamin: 'L' | 'P';
  kontakOrtu: string;
  namaOrtu: string;
  teleponOrtu: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  isValid: boolean;
  validationErrors: string[];
  isDuplicateNisn: boolean;
}

export const UploadMassalSiswaModal: React.FC<UploadMassalSiswaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingSiswa,
  availableClasses
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [isCopiedTemplate, setIsCopiedTemplate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'valid' | 'invalid'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingNisns = new Set(existingSiswa.map(s => s.nisn.trim()));

  // Normalize gender string into 'L' or 'P'
  const normalizeGender = (val: string): 'L' | 'P' => {
    const clean = val.toLowerCase().trim();
    if (clean === 'p' || clean.startsWith('perem') || clean.startsWith('wan') || clean === 'f' || clean === 'female') {
      return 'P';
    }
    return 'L';
  };

  // Normalize date into YYYY-MM-DD
  const normalizeDate = (val: string): string => {
    if (!val || val.trim() === '') return '';
    const clean = val.trim();

    // Check YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

    // Check DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyy = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (ddmmyyyy) {
      const day = ddmmyyyy[1].padStart(2, '0');
      const month = ddmmyyyy[2].padStart(2, '0');
      const year = ddmmyyyy[3];
      return `${year}-${month}-${day}`;
    }

    // Check YYYY/MM/DD
    const yyyymmdd = clean.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (yyyymmdd) {
      const year = yyyymmdd[1];
      const month = yyyymmdd[2].padStart(2, '0');
      const day = yyyymmdd[3].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return clean;
  };

  // Parse raw text (CSV, TSV, or comma/semicolon/tab-separated)
  const parseStudentData = (rawText: string) => {
    const lines = rawText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    // Detect delimiter of first line: Tab, Semicolon, Comma, Pipe
    const firstLine = lines[0];
    let delimiter = ',';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';
    else if (firstLine.includes('|')) delimiter = '|';

    // Helper to split line taking quotes into account
    const splitLine = (line: string, delim: string): string[] => {
      if (delim === '\t' || delim === '|') {
        return line.split(delim).map(cell => cell.trim().replace(/^["']|["']$/g, ''));
      }
      // Simple regex for CSV/Semicolon
      const pattern = new RegExp(`(?:^|${delim})(?:"([^"]*)"|([^"${delim}]*))`, 'g');
      const row: string[] = [];
      let match;
      while ((match = pattern.exec(line)) !== null) {
        let value = match[1] !== undefined ? match[1] : match[2];
        if (value === undefined) value = '';
        row.push(value.trim());
      }
      return row;
    };

    // Check if first line is a header
    const firstRowTokens = splitLine(firstLine, delimiter).map(t => t.toLowerCase());
    const isHeaderRow = firstRowTokens.some(
      t =>
        t.includes('nama') ||
        t.includes('nisn') ||
        t.includes('kelas') ||
        t.includes('l/p') ||
        t.includes('gender') ||
        t.includes('jenis kelamin')
    );

    let headerMap: { [key: string]: number } = {
      nama: 0,
      nisn: 1,
      kelas: 2,
      gender: 3,
      kontak: 4,
      tempat: 5,
      tanggal: 6,
      alamat: 7
    };

    let dataLines = lines;
    if (isHeaderRow) {
      firstRowTokens.forEach((token, idx) => {
        if (token.includes('nama') && !token.includes('ortu') && !token.includes('ibu') && !token.includes('ayah')) {
          headerMap.nama = idx;
        } else if (token.includes('nisn')) {
          headerMap.nisn = idx;
        } else if (token.includes('kelas') || token.includes('rombel')) {
          headerMap.kelas = idx;
        } else if (token.includes('l/p') || token.includes('gender') || token.includes('kelamin') || token.includes('jk')) {
          headerMap.gender = idx;
        } else if (token.includes('kontak') || token.includes('hp') || token.includes('telp') || token.includes('telepon') || token.includes('ortu')) {
          headerMap.kontak = idx;
        } else if (token.includes('tempat')) {
          headerMap.tempat = idx;
        } else if (token.includes('lahir') || token.includes('tanggal') || token.includes('tgl')) {
          headerMap.tanggal = idx;
        } else if (token.includes('alamat') || token.includes('domisili')) {
          headerMap.alamat = idx;
        }
      });
      dataLines = lines.slice(1);
    }

    const seenNisnsInFile = new Set<string>();
    const results: ParsedStudentRow[] = [];

    dataLines.forEach((line, index) => {
      const cols = splitLine(line, delimiter);
      if (cols.length === 0 || cols.every(c => c.length === 0)) return;

      const nama = (cols[headerMap.nama] || cols[0] || '').trim();
      const nisn = (cols[headerMap.nisn] || cols[1] || '').trim().replace(/\D/g, '') || (cols[headerMap.nisn] || cols[1] || '').trim();
      let kelas = (cols[headerMap.kelas] || cols[2] || '').trim();
      const genderRaw = (cols[headerMap.gender] || cols[3] || '').trim();
      const kontakRaw = (cols[headerMap.kontak] || cols[4] || '').trim();
      const tempat = (cols[headerMap.tempat] || cols[5] || '').trim();
      const tglRaw = (cols[headerMap.tanggal] || cols[6] || '').trim();
      const alamat = (cols[headerMap.alamat] || cols[7] || '').trim();

      // Normalize class format (if user wrote "1A" -> "Kelas 1A")
      if (kelas && /^[1-6][A-Za-z]?$/.test(kelas)) {
        kelas = `Kelas ${kelas.toUpperCase()}`;
      } else if (!kelas) {
        kelas = availableClasses[0] || 'Kelas 1A';
      }

      // Parse Kontak Ortu (extract phone digits and name if combined)
      let namaOrtu = 'Orang Tua / Wali';
      let teleponOrtu = kontakRaw;
      if (kontakRaw.includes('-') || kontakRaw.includes(':')) {
        const parts = kontakRaw.split(/[-:]/);
        namaOrtu = parts[0].trim();
        teleponOrtu = parts.slice(1).join('-').trim();
      }

      const jenisKelamin = normalizeGender(genderRaw);
      const tanggalLahir = normalizeDate(tglRaw) || '2017-01-01';

      // Validations
      const errors: string[] = [];
      if (!nama || nama.length < 2) {
        errors.push('Nama wajib diisi minimal 2 karakter');
      }
      if (!nisn) {
        errors.push('NISN wajib diisi');
      }
      if (!kelas) {
        errors.push('Kelas wajib diisi');
      }
      if (!genderRaw) {
        errors.push('L/P (Jenis Kelamin) wajib diisi');
      }

      const isDuplicateInFile = nisn ? seenNisnsInFile.has(nisn) : false;
      const isDuplicateInDb = nisn ? existingNisns.has(nisn) : false;
      if (nisn) seenNisnsInFile.add(nisn);

      if (isDuplicateInFile) {
        errors.push('NISN duplikat di dalam berkas ini');
      }

      results.push({
        id: `ROW-${index + 1}`,
        raw: cols,
        nama,
        nisn,
        kelas,
        jenisKelamin,
        kontakOrtu: kontakRaw,
        namaOrtu,
        teleponOrtu: teleponOrtu || '-',
        tempatLahir: tempat || 'Makassar',
        tanggalLahir,
        alamat: alamat || 'Makassar',
        isValid: errors.length === 0,
        validationErrors: errors,
        isDuplicateNisn: isDuplicateInDb
      });
    });

    setParsedRows(results);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      parseStudentData(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      parseStudentData(content);
    };
    reader.readAsText(file);
  };

  const handlePasteChange = (text: string) => {
    setPastedText(text);
    parseStudentData(text);
  };

  const handleRemoveRow = (rowId: string) => {
    setParsedRows(prev => prev.filter(r => r.id !== rowId));
  };

  const sampleCsvContent = `nama,nisn,kelas,l/p,kontak_ortu,tempat,tanggal_lahir,alamat
Muhammad Fadil Ramadhan,0157891234,Kelas 1A,L,081244556677,Makassar,2018-04-10,Jl. Veteran Selatan No. 12
Aisyah Putri Azzahra,0157891235,Kelas 1A,P,081399887766,Makassar,2018-06-22,Jl. Lanto Dg. Pasewang No. 45
Andi Muh. Raihan Pratama,0146782341,Kelas 4B,L,085233445566,Gowa,2015-02-14,Jl. Kakatua No. 18
Nabila Nur Syakira,0146782342,Kelas 4B,P,081277665544,Makassar,2015-09-03,Jl. Onta Lama No. 27
Farel Azka Al-Ghifari,0135673456,Kelas 5A,L,085399001122,Makassar,2014-01-18,Jl. Mawas No. 8`;

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_upload_massal_siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleCsvContent);
    setIsCopiedTemplate(true);
    setTimeout(() => setIsCopiedTemplate(false), 2500);
  };

  const handleApplySampleToPaste = () => {
    setActiveTab('paste');
    setPastedText(sampleCsvContent);
    parseStudentData(sampleCsvContent);
  };

  const validRows = parsedRows.filter(r => r.isValid);
  const invalidRows = parsedRows.filter(r => !r.isValid);

  const displayedRows = parsedRows.filter(r => {
    if (filterMode === 'valid') return r.isValid;
    if (filterMode === 'invalid') return !r.isValid;
    return true;
  });

  const handleCommitUpload = () => {
    if (validRows.length === 0) return;

    const formattedData: Omit<Siswa, 'id'>[] = validRows.map(row => ({
      nisn: row.nisn,
      nis: row.nisn.slice(-4) || '2401',
      nama: row.nama,
      kelas: row.kelas,
      jenisKelamin: row.jenisKelamin,
      tempatLahir: row.tempatLahir || 'Makassar',
      tanggalLahir: row.tanggalLahir || '2017-01-01',
      namaOrtu: row.namaOrtu || 'Orang Tua / Wali',
      teleponOrtu: row.teleponOrtu || '-',
      alamat: row.alamat || 'Makassar',
      status: 'Aktif'
    }));

    onSuccess(formattedData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFileName(null);
    setPastedText('');
    setParsedRows([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Massal Peserta Didik"
      subtitle="Import banyak data siswa sekaligus melalui berkas CSV/Excel atau salin-tempel teks"
      maxWidth="4xl"
    >
      <div className="space-y-5">
        {/* Format Explanation & Guidance Banner */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Format Standar Kolom Data Siswa (Urutan & Penamaan):</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-white hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors shadow-2xs"
                title="Download file template CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unduh Template CSV</span>
              </button>
              <button
                onClick={handleCopySample}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-white hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors shadow-2xs"
                title="Salin contoh data ke clipboard"
              >
                {isCopiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{isCopiedTemplate ? 'Tersalin!' : 'Salin Contoh'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 bg-white/90 rounded-lg border border-emerald-100">
              <span className="font-bold text-slate-800">1. Nama</span>
              <span className="ml-1 text-[10px] text-red-600 font-medium">(Wajib)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">Nama lengkap siswa</p>
            </div>
            <div className="p-2 bg-white/90 rounded-lg border border-emerald-100">
              <span className="font-bold text-slate-800">2. NISN</span>
              <span className="ml-1 text-[10px] text-red-600 font-medium">(Wajib)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">10 digit nomor NISN</p>
            </div>
            <div className="p-2 bg-white/90 rounded-lg border border-emerald-100">
              <span className="font-bold text-slate-800">3. Kelas</span>
              <span className="ml-1 text-[10px] text-red-600 font-medium">(Wajib)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">Misal: Kelas 1A, 2B</p>
            </div>
            <div className="p-2 bg-white/90 rounded-lg border border-emerald-100">
              <span className="font-bold text-slate-800">4. L/P</span>
              <span className="ml-1 text-[10px] text-red-600 font-medium">(Wajib)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">L = Laki, P = Perempuan</p>
            </div>
            <div className="p-2 bg-white/90 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700">5. Kontak Ortu</span>
              <span className="ml-1 text-[10px] text-slate-400">(Opsional)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">No HP / Nama & No HP</p>
            </div>
            <div className="p-2 bg-white/90 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700">6. Tempat</span>
              <span className="ml-1 text-[10px] text-slate-400">(Opsional)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">Kota tempat lahir</p>
            </div>
            <div className="p-2 bg-white/90 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700">7. Tanggal Lahir</span>
              <span className="ml-1 text-[10px] text-slate-400">(Opsional)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">YYYY-MM-DD / DD/MM/YYYY</p>
            </div>
            <div className="p-2 bg-white/90 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700">8. Alamat</span>
              <span className="ml-1 text-[10px] text-slate-400">(Opsional)</span>
              <p className="text-slate-500 text-[10px] mt-0.5">Alamat domisili tempat tinggal</p>
            </div>
          </div>
        </div>

        {/* Input Method Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Berkas (CSV / Excel Export)</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Salin & Tempel Langsung</span>
          </button>
        </div>

        {/* Method 1: File Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400/30'
                  : fileName
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {fileName ? `Berkas terpilih: ${fileName}` : 'Klik untuk memilih berkas atau seret & lepas ke sini'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Mendukung berkas format .CSV, .TSV, atau .TXT (Koma, Titik Koma, Tab)</p>
            </div>
          </div>
        )}

        {/* Method 2: Paste Direct Text */}
        {activeTab === 'paste' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Tempel data baris teks atau tabel copy dari Excel/Google Spreadsheet:
              </label>
              <button
                type="button"
                onClick={handleApplySampleToPaste}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium underline"
              >
                Gunakan Data Contoh
              </button>
            </div>
            <textarea
              rows={5}
              value={pastedText}
              onChange={e => handlePasteChange(e.target.value)}
              placeholder="Contoh:&#10;Muhammad Fadil Ramadhan,0157891234,Kelas 1A,L,081244556677,Makassar,2018-04-10,Jl. Veteran Selatan No. 12&#10;Aisyah Putri Azzahra,0157891235,Kelas 1A,P,081399887766,Makassar,2018-06-22,Jl. Lanto Dg. Pasewang No. 45"
              className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        )}

        {/* Live Preview and Validation Section */}
        {parsedRows.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Hasil Parsing:</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold text-[11px]">
                  Total: {parsedRows.length} Baris
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {validRows.length} Siap Diunggah
                </span>
                {invalidRows.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    {invalidRows.length} Perlu Koreksi
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="flex rounded-lg border border-slate-200 p-0.5 bg-white text-[11px]">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2 py-1 rounded font-medium ${filterMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600'}`}
                  >
                    Semua ({parsedRows.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('valid')}
                    className={`px-2 py-1 rounded font-medium ${filterMode === 'valid' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                  >
                    Valid ({validRows.length})
                  </button>
                  {invalidRows.length > 0 && (
                    <button
                      onClick={() => setFilterMode('invalid')}
                      className={`px-2 py-1 rounded font-medium ${filterMode === 'invalid' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
                    >
                      Error ({invalidRows.length})
                    </button>
                  )}
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-red-600 p-1.5 rounded-lg border border-slate-200 bg-white"
                  title="Reset Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Table */}
            <div className="max-h-64 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100/90 sticky top-0 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">NISN</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">L/P</th>
                    <th className="py-2.5 px-3">Kontak Ortu</th>
                    <th className="py-2.5 px-3">Tempat, Tgl Lahir</th>
                    <th className="py-2.5 px-3">Alamat</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {displayedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !row.isValid ? 'bg-amber-50/40' : row.isDuplicateNisn ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="py-2 px-3 whitespace-nowrap">
                        {row.isValid ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Valid</span>
                            {row.isDuplicateNisn && (
                              <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded ml-1" title="NISN sudah ada di database">
                                Update
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-700 font-semibold text-[10px]" title={row.validationErrors.join(', ')}>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate max-w-[120px]">{row.validationErrors[0]}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {row.nama || <span className="text-red-500 italic">Kosong</span>}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">
                        {row.nisn || <span className="text-red-500 italic">Kosong</span>}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[11px]">
                          {row.kelas}
                        </span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                            row.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          }`}
                        >
                          {row.jenisKelamin === 'L' ? 'L (Laki)' : 'P (Perempuan)'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                        {row.teleponOrtu !== '-' ? row.teleponOrtu : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                        {row.tempatLahir}, {row.tanggalLahir}
                      </td>
                      <td className="py-2 px-3 text-slate-500 truncate max-w-[140px]" title={row.alamat}>
                        {row.alamat}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Hapus baris ini"
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Data yang valid akan otomatis disimpan dan tersinkronisasi ke sistem.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={validRows.length === 0}
              onClick={handleCommitUpload}
              id="btn-konfirmasi-upload-massal"
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all shadow-xs ${
                validRows.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Simpan {validRows.length} Data Siswa</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
