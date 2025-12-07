import React, { useState } from 'react';
import { X, FileText, Check, AlertTriangle } from 'lucide-react';
import { importXMLFile, ParsedXMLData } from '../utils/xmlParser';
import { validateAll } from '../utils/validation';
import { loadHeader, loadRecords } from '../utils/storage';
import { Header, Record, ValidationError } from '../types/records';

interface XmlValidatorProps {
  onClose?: () => void;
}

interface Summary {
  total: number;
  urgentCount: number;
  duplicates: string[];
  seqGaps: boolean;
}

interface CompareResult {
  countDiff: { parsed: number; app: number };
  missingInApp: string[];
  extraInApp: string[];
  seqMismatches: { id: string; parsed_seq?: number; app_seq?: number }[];
  headerMatch: boolean;
}

export const XmlValidator: React.FC<XmlValidatorProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

  const resetStates = () => {
    setParsingError(null);
    setValidationErrors(null);
    setSummary(null);
    setCompareResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetStates();
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
    else setFile(null);
  };

  const calcSequenceGaps = (records: Record[]) => {
    const seq = records
      .map(r => typeof r.sequence_number === 'number' ? r.sequence_number : NaN)
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => a - b);

    if (seq.length === 0) return false;
    for (let i = 1; i < seq.length; i++) {
      if (seq[i] !== seq[i - 1] + 1) return true;
    }
    return false;
  };

  const handleValidateFile = async () => {
    resetStates();
    if (!file) return setParsingError('Izaberite XML fajl za validaciju');

    try {
      const parsed: ParsedXMLData = await importXMLFile(file);

      // Basic summary
      const total = parsed.records.length;
      const urgentCount = parsed.records.filter(r => !!r.item?.urgent_payment).length;
      const duplicates = (() => {
        const map = new Map<string, number>();
        parsed.records.forEach(r => {
          const key = r.external_id || r.invoice_number || r.id || '';
          if (!map.has(key)) map.set(key, 0);
          map.set(key, (map.get(key) || 0) + 1);
        });
        return Array.from(map.entries()).filter(([, c]) => c > 1).map(([k]) => k).filter(k => k);
      })();

      const seqGaps = calcSequenceGaps(parsed.records);

      const errors = validateAll(parsed.header as Header, parsed.records as Record[]);

      setSummary({ total, urgentCount, duplicates, seqGaps });
      setValidationErrors(errors.length ? errors : null);
    } catch (err) {
      setParsingError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleCompareWithApp = async () => {
    resetStates();
    if (!file) return setParsingError('Izaberite XML fajl za poređenje');

    try {
      const parsed: ParsedXMLData = await importXMLFile(file);
      const appHeader = loadHeader();
      const appRecords = loadRecords();

      const parsedIds = new Set(parsed.records.map(r => r.external_id || r.invoice_number || r.id));
      const appIds = new Set(appRecords.map(r => r.external_id || r.invoice_number || r.id));

      const missingInApp = Array.from(parsedIds).filter(id => id && !appIds.has(id));
      const extraInApp = Array.from(appIds).filter(id => id && !parsedIds.has(id));

      const countDiff = { parsed: parsed.records.length, app: appRecords.length };

      const seqMismatches = parsed.records
        .map(pr => {
          const match = appRecords.find(ar => (ar.external_id || ar.invoice_number || ar.id) === (pr.external_id || pr.invoice_number || pr.id));
          if (!match) return null;
          return { id: pr.external_id || pr.invoice_number || pr.id, parsed_seq: pr.sequence_number, app_seq: match.sequence_number };
        })
        .filter((item) => !!item) as { id: string; parsed_seq?: number; app_seq?: number }[];

      setCompareResult({ countDiff, missingInApp, extraInApp, seqMismatches, headerMatch: JSON.stringify(parsed.header) === JSON.stringify(appHeader) });
    } catch (err) {
      setParsingError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-gray-900">Validacija XML fajla</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { if (onClose) onClose(); }}
              className="p-2 rounded hover:bg-gray-100"
              title="Zatvori"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Izaberite XML fajl</label>
            <input type="file" accept=".xml,text/xml" onChange={handleFileChange} />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleValidateFile}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FileText className="h-4 w-4" />
              <span>Validiraj fajl</span>
            </button>

            <button
              onClick={handleCompareWithApp}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <Check className="h-4 w-4 text-green-600" />
              <span>Poredi sa podacima iz aplikacije</span>
            </button>
          </div>

          {parsingError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>{parsingError}</div>
            </div>
          )}

          {summary && (
            <div className="p-3 bg-green-50 border border-green-100 rounded text-sm text-green-800">
              <div className="font-medium">Sažetak fajla</div>
              <div>Ukupno zapisa: {summary.total}</div>
              <div>HITNO (urgent) broj: {summary.urgentCount}</div>
              <div>Duplikati ekst. ID / fakture: {summary.duplicates.length ? summary.duplicates.join(', ') : 'Nema'}</div>
              <div>Neusklađenost sekvence (gaps): {summary.seqGaps ? 'DA' : 'NE'}</div>
            </div>
          )}

          {validationErrors && (
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
              <div className="font-medium mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-700" /> Validacione greške</div>
              <ul className="list-disc pl-5 max-h-48 overflow-auto">
                {validationErrors.map((e, i) => (
                  <li key={i}>{e.message}</li>
                ))}
              </ul>
            </div>
          )}

          {compareResult && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
              <div className="font-medium mb-2">Rezultat poređenja</div>
              <div>Zapisa - fajl: {compareResult.countDiff.parsed}, aplikacija: {compareResult.countDiff.app}</div>
              <div>U fajlu ali ne u aplikaciji: {compareResult.missingInApp.length ? compareResult.missingInApp.slice(0, 10).join(', ') : 'Nema'}</div>
              <div>U aplikaciji ali ne u fajlu: {compareResult.extraInApp.length ? compareResult.extraInApp.slice(0, 10).join(', ') : 'Nema'}</div>
              <div>Neusklađene sekvence (prikaz do 10):</div>
              <ul className="list-disc pl-5 max-h-32 overflow-auto">
                {compareResult.seqMismatches.slice(0, 10).map((s, i) => (
                  <li key={i}>{s.id}: fajl_seq={s.parsed_seq ?? 'n/a'} app_seq={s.app_seq ?? 'n/a'}</li>
                ))}
              </ul>
              <div className="mt-2">Header identičan: {compareResult.headerMatch ? 'DA' : 'NE'}</div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => { if (onClose) onClose(); }}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >Zatvori</button>
        </div>
      </div>
    </div>
  );
};

export default XmlValidator;
