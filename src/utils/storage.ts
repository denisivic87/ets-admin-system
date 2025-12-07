import { Header, Record } from '../types/records';

const STORAGE_KEYS = {
  HEADER: 'xml_records_header',
  RECORDS: 'xml_records_records',
  PREFILL_ENABLED: 'xml_records_prefill_enabled'
};

export const saveHeader = (header: Header): void => {
  localStorage.setItem(STORAGE_KEYS.HEADER, JSON.stringify(header));
};

export const loadHeader = (): Header => {
  const saved = localStorage.getItem(STORAGE_KEYS.HEADER);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading header from localStorage:', error);
    }
  }
  
  return {
    cumulative_reason_code: 'PO07',
    budget_year: new Date().getFullYear().toString(),
    budget_user_id: '',
    currency_code: 'RSD',
    treasury: ''
  };
};

export const saveRecords = (records: Record[]): void => {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
};

export const loadRecords = (): Record[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading records from localStorage:', error);
    }
  }
  return [];
};

export const savePrefillEnabled = (enabled: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.PREFILL_ENABLED, JSON.stringify(enabled));
};

export const loadPrefillEnabled = (): boolean => {
  const saved = localStorage.getItem(STORAGE_KEYS.PREFILL_ENABLED);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error loading prefill setting from localStorage:', error);
    }
  }
  return true; // Default to enabled
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};