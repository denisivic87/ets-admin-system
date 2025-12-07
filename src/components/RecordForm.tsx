import React from 'react';
import { Record, ValidationError } from '../types/records';
import { Trash2, Building2, Layers } from 'lucide-react';

interface RecordFormProps {
  record: Record;
  index: number;
  onChange: (record: Record) => void;
  onRemove: () => void;
  errors: ValidationError[];
}

export const RecordForm: React.FC<RecordFormProps> = ({
  record,
  index,
  onChange,
  onRemove,
  errors
}) => {
  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleRecordChange = (field: keyof Omit<Record, 'id' | 'item'>, value: string) => {
    onChange({ ...record, [field]: value });
  };

  const handleItemChange = (field: keyof Record['item'], value: string | number | boolean) => {
    onChange({
      ...record,
      item: { ...record.item, [field]: value }
    });
  };

  const prefix = `record_${index}`;
  const inputClasses = "w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all";
  const labelClasses = "block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide";
  const sectionTitleClasses = "text-md font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2";

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-6 relative group transition-all hover:border-white/20 hover:shadow-lg hover:shadow-neon-blue/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono border border-white/10 text-neon-blue">
            {index + 1}
          </span>
          <span className="text-gray-200">Zapis</span>
        </h3>
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-all"
          title="Ukloni zapis"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Record Fields */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className={sectionTitleClasses}>
            <Building2 className="h-4 w-4 text-neon-blue" />
            Detalji obaveze
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className={labelClasses}>
                Kod razloga *
              </label>
              <input
                type="text"
                value={record.reason_code}
                onChange={(e) => handleRecordChange('reason_code', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_reason_code`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_reason_code`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_reason_code`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Spoljašnji ID
              </label>
              <input
                type="text"
                value={record.external_id}
                onChange={(e) => handleRecordChange('external_id', e.target.value)}
                className={inputClasses}
                placeholder="Automatski..."
              />
            </div>

            <div>
              <label className={labelClasses}>
                Primalac *
              </label>
              <input
                type="text"
                value={record.recipient}
                onChange={(e) => handleRecordChange('recipient', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_recipient`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_recipient`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_recipient`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Mesto primaoca *
              </label>
              <input
                type="text"
                value={record.recipient_place}
                onChange={(e) => handleRecordChange('recipient_place', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_recipient_place`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_recipient_place`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_recipient_place`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Broj računa *
              </label>
              <input
                type="text"
                value={record.account_number}
                onChange={(e) => handleRecordChange('account_number', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_account_number`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_account_number`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_account_number`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Broj fakture
              </label>
              <input
                type="text"
                value={record.invoice_number}
                onChange={(e) => handleRecordChange('invoice_number', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Tip fakture
              </label>
              <input
                type="text"
                value={record.invoice_type}
                onChange={(e) => handleRecordChange('invoice_type', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Datum fakture *
              </label>
              <input
                type="date"
                value={record.invoice_date}
                onChange={(e) => handleRecordChange('invoice_date', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_invoice_date`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_invoice_date`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_invoice_date`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Datum dospeća *
              </label>
              <input
                type="date"
                value={record.due_date}
                onChange={(e) => handleRecordChange('due_date', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_due_date`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_due_date`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_due_date`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Broj ugovora
              </label>
              <input
                type="text"
                value={record.contract_number}
                onChange={(e) => handleRecordChange('contract_number', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Kod plaćanja
              </label>
              <input
                type="text"
                value={record.payment_code}
                onChange={(e) => handleRecordChange('payment_code', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Model kredita
              </label>
              <input
                type="text"
                value={record.credit_model}
                onChange={(e) => handleRecordChange('credit_model', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Referentni broj kredita
              </label>
              <input
                type="text"
                value={record.credit_reference_number}
                onChange={(e) => handleRecordChange('credit_reference_number', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>
                Osnov plaćanja
              </label>
              <input
                type="text"
                value={record.payment_basis}
                onChange={(e) => handleRecordChange('payment_basis', e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Item Fields */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h4 className={sectionTitleClasses}>
            <Layers className="h-4 w-4 text-neon-purple" />
            Detalji stavke
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className={labelClasses}>
                ID korisnika budžeta *
              </label>
              <input
                type="text"
                value={record.item.budget_user_id}
                onChange={(e) => handleItemChange('budget_user_id', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_item_budget_user_id`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_budget_user_id`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_budget_user_id`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Kod programa *
              </label>
              <input
                type="text"
                value={record.item.program_code}
                onChange={(e) => handleItemChange('program_code', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_item_program_code`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_program_code`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_program_code`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Kod projekta
              </label>
              <input
                type="text"
                value={record.item.project_code}
                onChange={(e) => handleItemChange('project_code', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Kod ekonomske klasifikacije *
              </label>
              <input
                type="text"
                value={record.item.economic_classification_code}
                onChange={(e) => handleItemChange('economic_classification_code', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_item_economic_classification_code`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_economic_classification_code`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_economic_classification_code`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Kod izvora finansiranja *
              </label>
              <input
                type="text"
                value={record.item.source_of_funding_code}
                onChange={(e) => handleItemChange('source_of_funding_code', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_item_source_of_funding_code`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_source_of_funding_code`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_source_of_funding_code`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Kod funkcije *
              </label>
              <input
                type="text"
                value={record.item.function_code}
                onChange={(e) => handleItemChange('function_code', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_item_function_code`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_function_code`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_function_code`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Iznos *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={record.item.amount}
                onChange={(e) => handleItemChange('amount', parseFloat(e.target.value) || 0)}
                className={`${inputClasses} ${getError(`${prefix}_item_amount`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_amount`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_amount`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Račun evidentiranja *
              </label>
              <input
                type="text"
                value={record.item.recording_account}
                onChange={(e) => handleItemChange('recording_account', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_item_recording_account`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_recording_account`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_recording_account`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Očekivani datum plaćanja *
              </label>
              <input
                type="date"
                value={record.item.expected_payment_date}
                onChange={(e) => handleItemChange('expected_payment_date', e.target.value)}
                className={`${inputClasses} ${getError(`${prefix}_item_expected_payment_date`) ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {getError(`${prefix}_item_expected_payment_date`) && (
                <p className="text-red-400 text-xs mt-1.5 font-medium">{getError(`${prefix}_item_expected_payment_date`)}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Račun knjiženja
              </label>
              <input
                type="text"
                value={record.item.posting_account}
                onChange={(e) => handleItemChange('posting_account', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id={`urgent_payment_${index}`}
                    checked={record.item.urgent_payment}
                    onChange={(e) => handleItemChange('urgent_payment', e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/30 bg-black/20 checked:border-neon-blue checked:bg-neon-blue transition-all"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors uppercase font-medium">
                  Hitno plaćanje
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};