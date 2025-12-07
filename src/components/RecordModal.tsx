import React from 'react';
import { Record, ValidationError } from '../types/records';
import { X } from 'lucide-react';

interface RecordModalProps {
  record: Record;
  index: number;
  isOpen: boolean;
  mode: 'view' | 'edit';
  onClose: () => void;
  onChange?: (record: Record) => void;
  onSave?: () => void;
  errors: ValidationError[];
}

export const RecordModal: React.FC<RecordModalProps> = ({
  record,
  index,
  isOpen,
  mode,
  onClose,
  onChange,
  onSave,
  errors
}) => {
  if (!isOpen) return null;

  const getError = (field: string) => errors.find(e => e.field === field)?.message;
  const prefix = `record_${index}`;

  const handleRecordChange = (field: keyof Omit<Record, 'id' | 'item'>, value: string) => {
    if (onChange) {
      onChange({ ...record, [field]: value });
    }
  };

  const handleItemChange = (field: keyof Record['item'], value: string | number | boolean) => {
    if (onChange) {
      onChange({ 
        ...record, 
        item: { ...record.item, [field]: value }
      });
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'view' ? 'Pregled zapisa' : 'Uređivanje zapisa'} {index + 1}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Detalji obaveze */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Detalji obaveze</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod razloga *
                </label>
                <input
                  type="text"
                  value={record.reason_code}
                  onChange={(e) => handleRecordChange('reason_code', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_reason_code`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_reason_code`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_reason_code`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spoljašnji ID
                </label>
                <input
                  type="text"
                  value={record.external_id}
                  onChange={(e) => handleRecordChange('external_id', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Automatski numerisan ako je prazan"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primalac *
                </label>
                <input
                  type="text"
                  value={record.recipient}
                  onChange={(e) => handleRecordChange('recipient', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_recipient`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_recipient`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_recipient`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesto primaoca *
                </label>
                <input
                  type="text"
                  value={record.recipient_place}
                  onChange={(e) => handleRecordChange('recipient_place', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_recipient_place`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_recipient_place`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_recipient_place`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Broj računa *
                </label>
                <input
                  type="text"
                  value={record.account_number}
                  onChange={(e) => handleRecordChange('account_number', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_account_number`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_account_number`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_account_number`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Broj fakture
                </label>
                <input
                  type="text"
                  value={record.invoice_number}
                  onChange={(e) => handleRecordChange('invoice_number', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tip fakture
                </label>
                <input
                  type="text"
                  value={record.invoice_type}
                  onChange={(e) => handleRecordChange('invoice_type', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum fakture *
                </label>
                <input
                  type="date"
                  value={record.invoice_date}
                  onChange={(e) => handleRecordChange('invoice_date', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_invoice_date`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_invoice_date`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_invoice_date`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum dospeća *
                </label>
                <input
                  type="date"
                  value={record.due_date}
                  onChange={(e) => handleRecordChange('due_date', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_due_date`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_due_date`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_due_date`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Broj ugovora
                </label>
                <input
                  type="text"
                  value={record.contract_number}
                  onChange={(e) => handleRecordChange('contract_number', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod plaćanja
                </label>
                <input
                  type="text"
                  value={record.payment_code}
                  onChange={(e) => handleRecordChange('payment_code', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model kredita
                </label>
                <input
                  type="text"
                  value={record.credit_model}
                  onChange={(e) => handleRecordChange('credit_model', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referentni broj kredita
                </label>
                <input
                  type="text"
                  value={record.credit_reference_number}
                  onChange={(e) => handleRecordChange('credit_reference_number', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Osnov plaćanja
                </label>
                <input
                  type="text"
                  value={record.payment_basis}
                  onChange={(e) => handleRecordChange('payment_basis', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Detalji stavke */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Detalji stavke</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID korisnika budžeta *
                </label>
                <input
                  type="text"
                  value={record.item.budget_user_id}
                  onChange={(e) => handleItemChange('budget_user_id', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_budget_user_id`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_budget_user_id`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_budget_user_id`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod programa *
                </label>
                <input
                  type="text"
                  value={record.item.program_code}
                  onChange={(e) => handleItemChange('program_code', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_program_code`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_program_code`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_program_code`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod projekta
                </label>
                <input
                  type="text"
                  value={record.item.project_code}
                  onChange={(e) => handleItemChange('project_code', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod ekonomske klasifikacije *
                </label>
                <input
                  type="text"
                  value={record.item.economic_classification_code}
                  onChange={(e) => handleItemChange('economic_classification_code', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_economic_classification_code`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_economic_classification_code`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_economic_classification_code`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod izvora finansiranja *
                </label>
                <input
                  type="text"
                  value={record.item.source_of_funding_code}
                  onChange={(e) => handleItemChange('source_of_funding_code', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_source_of_funding_code`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_source_of_funding_code`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_source_of_funding_code`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod funkcije *
                </label>
                <input
                  type="text"
                  value={record.item.function_code}
                  onChange={(e) => handleItemChange('function_code', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_function_code`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_function_code`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_function_code`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Iznos *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={record.item.amount}
                  onChange={(e) => handleItemChange('amount', parseFloat(e.target.value) || 0)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_amount`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_amount`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_amount`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Račun evidentiranja *
                </label>
                <input
                  type="text"
                  value={record.item.recording_account}
                  onChange={(e) => handleItemChange('recording_account', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_recording_account`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_recording_account`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_recording_account`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Očekivani datum plaćanja *
                </label>
                <input
                  type="date"
                  value={record.item.expected_payment_date}
                  onChange={(e) => handleItemChange('expected_payment_date', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  } ${getError(`${prefix}_item_expected_payment_date`) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {getError(`${prefix}_item_expected_payment_date`) && (
                  <p className="text-red-500 text-xs mt-1">{getError(`${prefix}_item_expected_payment_date`)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Račun knjiženja
                </label>
                <input
                  type="text"
                  value={record.item.posting_account}
                  onChange={(e) => handleItemChange('posting_account', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isReadOnly ? 'bg-gray-50' : ''
                  }`}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`urgent_payment_modal_${index}`}
                  checked={record.item.urgent_payment}
                  onChange={(e) => handleItemChange('urgent_payment', e.target.checked)}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`urgent_payment_modal_${index}`} className="ml-2 block text-sm text-gray-700">
                  Hitno plaćanje
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {mode === 'view' ? 'Zatvori' : 'Otkaži'}
          </button>
          {mode === 'edit' && onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              Sačuvaj
            </button>
          )}
        </div>
      </div>
    </div>
  );
};