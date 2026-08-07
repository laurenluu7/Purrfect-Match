import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Copy, Check, Upload, RefreshCw } from 'lucide-react';
import { Cat } from '../types';

interface GoogleSheetsSyncModalProps {
  cats: Cat[];
  onClose: () => void;
  onImportCats: (importedCats: Cat[]) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  cats,
  onClose,
  onImportCats
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  // Generate CSV text for Google Sheets
  const generateCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Age (Years)',
      'Age (Months)',
      'Gender',
      'Category',
      'Status',
      'Arrival Date',
      'Medical Concerns',
      'Personality Traits',
      'Vaccinated',
      'Spayed/Neutered',
      'Microchipped',
      'FIV/FeLV',
      'Description'
    ];

    const rows = cats.map((c) => [
      c.id,
      `"${c.name}"`,
      c.ageYears,
      c.ageMonths,
      c.gender,
      `"${c.category}"`,
      c.adoptionStatus,
      c.arrivalDate,
      `"${c.medicalConcerns.join(', ')}"`,
      `"${c.personalityTraits.join(', ')}"`,
      c.medicalRecords.vaccinationsUpToDate ? 'Yes' : 'No',
      c.medicalRecords.spayedNeutered ? 'Yes' : 'No',
      c.medicalRecords.microchipped ? 'Yes' : 'No',
      c.medicalRecords.fivFelvStatus || 'Tested Clear',
      `"${c.description.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const csvContent = generateCSV();

  const handleCopy = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cat-cafe-adoption-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    setImportError('');
    setImportSuccess('');
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        onImportCats(parsed);
        setImportSuccess(`Successfully imported ${parsed.length} cats!`);
      } else {
        setImportError('Expected a JSON array of cat objects.');
      }
    } catch (e: any) {
      setImportError('Invalid JSON format. Make sure it matches cat objects array.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100 via-sky-50 to-pink-50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Google Sheets Sync & Export
              </h2>
              <p className="text-xs text-slate-600">
                Export cat cafe database to CSV or copy formatted data for Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-900">
          
          {/* Quick Actions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">
                Export Cafe Records ({cats.length} Cats)
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Download `.csv` file or copy raw text to paste into Google Sheets.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold border border-slate-300 flex items-center space-x-1.5 transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copied ? 'Copied CSV!' : 'Copy for Google Sheets'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download .CSV</span>
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">Formatted CSV Preview</label>
            <textarea
              readOnly
              rows={6}
              value={csvContent}
              className="w-full p-3 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] leading-relaxed outline-none"
            />
          </div>

          {/* JSON Backup Import */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Import / Restore Database (JSON)
            </h3>
            <p className="text-slate-600 text-[11px]">
              Paste JSON array of cats below to update or import profiles.
            </p>
            <textarea
              rows={3}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='[{"name": "Whiskers", "ageYears": 2, ...}]'
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs outline-none"
            />

            {importError && (
              <p className="text-rose-600 font-bold text-xs">{importError}</p>
            )}
            {importSuccess && (
              <p className="text-emerald-700 font-bold text-xs">{importSuccess}</p>
            )}

            <button
              onClick={handleImportJSON}
              disabled={!importText.trim()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-50"
            >
              Import Cats Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
