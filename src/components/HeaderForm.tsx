import React from 'react';
import { Header, ValidationError } from '../types/records';
import { FileText, Calendar, Wallet, Building2, Coins } from 'lucide-react';

interface HeaderFormProps {
  header: Header;
  onChange: (header: Header) => void;
  errors: ValidationError[];
  disabled?: boolean;
}

export const HeaderForm: React.FC<HeaderFormProps> = ({ header, onChange, errors, disabled }) => {
  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleChange = (field: keyof Header, value: string) => {
    onChange({ ...header, [field]: value });
  };

  const inputClasses = `w-full px-4 py-2.5 bg-black/20 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <FileText className="h-24 w-24 text-white" />
      </div>

      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="bg-neon-blue/20 p-2 rounded-lg mr-3 border border-neon-blue/30">
          <Building2 className="h-5 w-5 text-neon-blue" />
        </span>
        Informacije zaglavlja
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
            Kumulativni kod razloga
          </label>
          <div className="relative">
            <input
              type="text"
              value={header.cumulative_reason_code}
              onChange={(e) => handleChange('cumulative_reason_code', e.target.value)}
              className={`${inputClasses} ${getError('cumulative_reason_code') ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'}`}
              placeholder="npr. PO07"
              disabled={disabled}
            />
          </div>
          {getError('cumulative_reason_code') && (
            <p className="text-red-400 text-xs mt-1.5 font-medium">{getError('cumulative_reason_code')}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
            Budžetska godina
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={header.budget_year}
              onChange={(e) => handleChange('budget_year', e.target.value)}
              className={`${inputClasses} pl-10 ${getError('budget_year') ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'}`}
              placeholder="npr. 2025"
              disabled={disabled}
            />
          </div>
          {getError('budget_year') && (
            <p className="text-red-400 text-xs mt-1.5 font-medium">{getError('budget_year')}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
            ID korisnika budžeta
          </label>
          <input
            type="text"
            value={header.budget_user_id}
            onChange={(e) => handleChange('budget_user_id', e.target.value)}
            className={`${inputClasses} ${getError('budget_user_id') ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'}`}
            placeholder="ID korisnika"
            disabled={disabled}
          />
          {getError('budget_user_id') && (
            <p className="text-red-400 text-xs mt-1.5 font-medium">{getError('budget_user_id')}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
            Kod valute
          </label>
          <div className="relative">
            <Coins className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={header.currency_code}
              onChange={(e) => handleChange('currency_code', e.target.value)}
              className={`${inputClasses} pl-10 ${getError('currency_code') ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'}`}
              placeholder="npr. RSD"
              disabled={disabled}
            />
          </div>
          {getError('currency_code') && (
            <p className="text-red-400 text-xs mt-1.5 font-medium">{getError('currency_code')}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
            Trezor
          </label>
          <div className="relative">
            <Wallet className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={header.treasury}
              onChange={(e) => handleChange('treasury', e.target.value)}
              className={`${inputClasses} pl-10 ${getError('treasury') ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10'}`}
              placeholder="Kod trezora"
              disabled={disabled}
            />
          </div>
          {getError('treasury') && (
            <p className="text-red-400 text-xs mt-1.5 font-medium">{getError('treasury')}</p>
          )}
        </div>
      </div>
    </div>
  );
};