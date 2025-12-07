import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (updates: BulkEditData) => void;
  recordCount: number;
}

export interface BulkEditData {
  invoice_number?: string;
  invoice_type?: string;
  invoice_date?: string;
  due_date?: string;
  expected_payment_date?: string;
  contract_number?: string;
  payment_basis?: string;
  urgent_payment?: boolean;
  reset_urgent_payment?: boolean;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  onApply,
  recordCount
}) => {
  const [updates, setUpdates] = useState<BulkEditData>({
    urgent_payment: false,
    reset_urgent_payment: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty values, but allow boolean values

    const filteredUpdates: BulkEditData = {};

    Object.entries(updates).forEach(([key, value]) => {
      // Skip reset_urgent_payment from output, but keep it for internal logic
      if (key === 'reset_urgent_payment' && value === true) {
        filteredUpdates.reset_urgent_payment = true;
        return;
      }

      // For boolean values, always include them
      if (typeof value === 'boolean' && key !== 'reset_urgent_payment') {
        if (key === 'urgent_payment') {
          filteredUpdates.urgent_payment = value;
        }
      }
      // For string values, include only if not empty
      else if (typeof value === 'string' && value.trim() !== '') {
        (filteredUpdates as any)[key] = value;
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      alert('Molimo unesite najmanje jedno polje za izmenu.');
      return;
    }

    onApply(filteredUpdates);
    onClose();
    setUpdates({
      urgent_payment: false,
      reset_urgent_payment: false,
    });
  };

  const handleClose = () => {
    onClose();
    setUpdates({
      urgent_payment: false,
      reset_urgent_payment: false,
    });
  };

  const inputClasses = "w-full px-3 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all text-sm";
  const labelClasses = "block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 relative">
        <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Grupno menjanje podataka
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-xl flex items-start gap-3">
            <div className="text-sm text-gray-300">
              <p className="mb-1 text-white font-medium">Masovna izmena</p>
              <p>
                Ove izmene će biti primenjene na svih <strong className="text-white">{recordCount}</strong> zapisa.
                Ostavite polja prazna ako ne želite da ih menjate.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Broj fakture
              </label>
              <input
                type="text"
                value={updates.invoice_number || ''}
                onChange={(e) => setUpdates({ ...updates, invoice_number: e.target.value })}
                className={inputClasses}
                placeholder="Unesite novi broj fakture..."
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Spoljašnji ID će se automatski ažurirati (# + faktura)
              </p>
            </div>

            <div>
              <label className={labelClasses}>
                Tip fakture
              </label>
              <input
                type="text"
                value={updates.invoice_type || ''}
                onChange={(e) => setUpdates({ ...updates, invoice_type: e.target.value })}
                className={inputClasses}
                placeholder="Unesite tip fakture..."
              />
            </div>

            <div>
              <label className={labelClasses}>
                Datum fakture
              </label>
              <input
                type="date"
                value={updates.invoice_date || ''}
                onChange={(e) => setUpdates({ ...updates, invoice_date: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Datum dospeća
              </label>
              <input
                type="date"
                value={updates.due_date || ''}
                onChange={(e) => setUpdates({ ...updates, due_date: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Očekivani datum plaćanja
              </label>
              <input
                type="date"
                value={updates.expected_payment_date || ''}
                onChange={(e) => setUpdates({ ...updates, expected_payment_date: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Broj ugovora
              </label>
              <input
                type="text"
                value={updates.contract_number || ''}
                onChange={(e) => setUpdates({ ...updates, contract_number: e.target.value })}
                className={inputClasses}
                placeholder="Unesite broj ugovora..."
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>
                Osnov plaćanja
              </label>
              <input
                type="text"
                value={updates.payment_basis || ''}
                onChange={(e) => setUpdates({ ...updates, payment_basis: e.target.value })}
                className={inputClasses}
                placeholder="Unesite osnov plaćanja..."
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Status plaćanja</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={updates.urgent_payment === true}
                    onChange={(e) => setUpdates({ ...updates, urgent_payment: e.target.checked, reset_urgent_payment: false })}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/30 bg-black/20 checked:border-neon-blue checked:bg-neon-blue transition-all"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Postavi sve zapise kao <span className="text-red-400 font-bold">HITNO</span>
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={updates.reset_urgent_payment === true}
                    onChange={(e) => setUpdates({ ...updates, reset_urgent_payment: e.target.checked, urgent_payment: false })}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/30 bg-black/20 checked:border-green-500 checked:bg-green-500 transition-all"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Resetuj <span className="text-red-400 font-bold">HITNO</span> (postavi na normalno)
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto neon-button px-8 py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              <span>Primeni izmene</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
