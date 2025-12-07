import React from 'react';
import { Record, ValidationError } from '../types/records';
import { Trash2, CreditCard as Edit, Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface RecordsTableProps {
  records: Record[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onView: (index: number) => void;
  errors: ValidationError[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isSearching?: boolean;
  searchQuery?: string;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({
  records,
  onEdit,
  onRemove,
  onView,
  errors,
  currentPage,
  totalPages,
  onPageChange,
  isSearching = false,
  searchQuery = ''
}) => {
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const hasError = (recordId: string) => {
    return errors.some(error => error.recordId === recordId);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('sr-RS');
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('sr-RS', { minimumFractionDigits: 2 });
  };

  const getGlobalIndex = (localIndex: number) => {
    return (currentPage - 1) * 20 + localIndex;
  };

  const getDisplayNumber = (record: Record, fallbackIndex: number) => {
    if (record.sequence_number !== undefined && record.sequence_number !== null) {
      return record.sequence_number;
    }
    return fallbackIndex + 1;
  };

  if (records.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
        {isSearching ? (
          <>
            <p className="text-gray-500 mb-2">Nema rezultata za pretragu: <strong>"{searchQuery}"</strong></p>
            <p className="text-sm text-gray-400">Pokušajte sa drugim pojmom pretrage</p>
          </>
        ) : (
          <p className="text-gray-500 mb-4">Još nema zapisa. Dodajte prvi zapis da počnete.</p>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="bg-neon-blue w-2 h-6 rounded-full"></span>
          Pregled zapisa
        </h3>
        {totalPages > 1 && (
          <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Stranica {currentPage} <span className="text-gray-600 mx-1">/</span> {totalPages}
          </span>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-neon-blue uppercase tracking-wider">#</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Kod razloga</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Spoljašnji ID</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Primalac</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Račun</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Datumi</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Iznos</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Detalji</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Hitno</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.map((record, index) => {
              const globalIndex = getGlobalIndex(index);
              const isError = hasError(record.id);

              return (
                <React.Fragment key={record.id}>
                  <tr
                    className={`transition-colors group ${isError
                      ? 'bg-red-500/10 hover:bg-red-500/20'
                      : 'hover:bg-white/5'
                      }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {getDisplayNumber(record, globalIndex)}
                      {isError && (
                        <span className="ml-2 text-red-400 animate-pulse" title="Greška">⚠️</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.reason_code ? (
                        <span className="bg-white/5 px-2 py-1 rounded text-gray-200 border border-white/10">{record.reason_code}</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.external_id || <span className="text-gray-600 italic">auto</span>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300 max-w-xs truncate font-medium">
                      {record.recipient || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                      {record.account_number || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-400">
                      <div className="flex flex-col">
                        <span>F: {formatDate(record.invoice_date)}</span>
                        <span>D: {formatDate(record.due_date)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-emerald-400 font-bold font-mono">
                      {formatAmount(record.item.amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-400">
                      <div className="flex flex-col gap-1">
                        <span className="bg-white/5 px-1.5 rounded">{record.item.program_code || '-'}</span>
                        <span className="bg-white/5 px-1.5 rounded">{record.item.economic_classification_code || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {record.item.urgent_payment ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                          Da
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500">
                          Ne
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(index);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {expandedRows.has(index) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(globalIndex);
                          }}
                          className="p-1.5 rounded-lg text-neon-blue hover:text-cyan-300 hover:bg-neon-blue/10 transition-colors"
                          title="Uredi"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(globalIndex);
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          title="Obriši"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRows.has(index) && (
                    <tr className="bg-black/20">
                      <td colSpan={10} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                          <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="font-bold text-neon-purple border-b border-white/10 pb-2 mb-2">Dodatni podaci obaveze</h4>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Broj fakture:</span> <span className="text-gray-200 text-right">{record.invoice_number || '-'}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Tip fakture:</span> <span className="text-gray-200 text-right">{record.invoice_type || '-'}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Ugovor:</span> <span className="text-gray-200 text-right">{record.contract_number || '-'}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Osnov plaćanja:</span> <span className="text-gray-200 text-right">{record.payment_basis || '-'}</span></div>
                          </div>

                          <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="font-bold text-neon-pink border-b border-white/10 pb-2 mb-2">Budžetski podaci</h4>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">ID korisnika:</span> <span className="text-gray-200 text-right">{record.item.budget_user_id || '-'}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Projekat:</span> <span className="text-gray-200 text-right">{record.item.project_code || '-'}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Izvor fin.:</span> <span className="text-gray-200 text-right">{record.item.source_of_funding_code || '-'}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Funkcija:</span> <span className="text-gray-200 text-right">{record.item.function_code || '-'}</span></div>
                          </div>

                          <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="font-bold text-neon-blue border-b border-white/10 pb-2 mb-2">Računi i plaćanje</h4>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Očekivano:</span> <span className="text-gray-200 text-right">{formatDate(record.item.expected_payment_date)}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Račun evid.:</span> <span className="text-gray-200 text-right font-mono text-xs">{record.item.recording_account || '-'}</span></div>
                            <div className="grid grid-cols-2 gap-2"><span className="text-gray-500">Račun knjiž.:</span> <span className="text-gray-200 text-right font-mono text-xs">{record.item.posting_account || '-'}</span></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Prikazano {records.length} rezultata
          </div>

          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center space-x-1">
                {/* Simplified pagination for Gen Z look - dots if too many */}
                <span className="text-sm font-medium text-white px-2">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};