import { supabase } from './supabase';
import { Header, Record } from '../types/records';

export interface DatabaseRecord {
  id: string;
  user_id: string;
  header_id: string | null;
  sequence_number?: number;
  reason_code: string;
  external_id: string;
  recipient: string;
  recipient_place: string;
  account_number: string;
  invoice_number: string;
  invoice_type: string;
  invoice_date: string;
  due_date: string;
  contract_number: string;
  payment_code: string;
  credit_model: string;
  credit_reference_number: string;
  payment_basis: string;
  created_at: string;
  updated_at: string;
  record_items?: DatabaseRecordItem[];
}

export interface DatabaseRecordItem {
  id: string;
  record_id: string;
  budget_user_id: string;
  program_code: string;
  project_code: string;
  economic_classification_code: string;
  source_of_funding_code: string;
  function_code: string;
  amount: number;
  recording_account: string;
  expected_payment_date: string;
  urgent_payment: boolean;
  posting_account: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseHeader {
  id: string;
  user_id: string;
  cumulative_reason_code: string;
  budget_year: string;
  budget_user_id: string;
  currency_code: string;
  treasury: string;
  created_at: string;
  updated_at: string;
}

export async function saveHeaderToDatabase(userId: string, header: Header): Promise<string> {
  const { data, error } = await supabase
    .from('headers')
    .upsert({
      user_id: userId,
      cumulative_reason_code: header.cumulative_reason_code,
      budget_year: header.budget_year,
      budget_user_id: header.budget_user_id,
      currency_code: header.currency_code,
      treasury: header.treasury,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function getHeaderFromDatabase(userId: string): Promise<Header | null> {
  const { data, error } = await supabase
    .from('headers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    cumulative_reason_code: data.cumulative_reason_code,
    budget_year: data.budget_year,
    budget_user_id: data.budget_user_id,
    currency_code: data.currency_code,
    treasury: data.treasury
  };
}

export async function saveRecordToDatabase(
  userId: string,
  record: Record,
  headerId: string | null
): Promise<string> {
  const { data: recordData, error: recordError } = await supabase
    .from('records')
    .insert({
      user_id: userId,
      header_id: headerId,
      reason_code: record.reason_code,
      external_id: record.external_id,
      recipient: record.recipient,
      recipient_place: record.recipient_place,
      account_number: record.account_number,
      invoice_number: record.invoice_number,
      invoice_type: record.invoice_type,
      invoice_date: record.invoice_date,
      due_date: record.due_date,
      contract_number: record.contract_number,
      payment_code: record.payment_code,
      credit_model: record.credit_model,
      credit_reference_number: record.credit_reference_number,
      payment_basis: record.payment_basis
    })
    .select()
    .single();

  if (recordError) throw recordError;

  const { error: itemError } = await supabase
    .from('record_items')
    .insert({
      record_id: recordData.id,
      budget_user_id: record.item.budget_user_id,
      program_code: record.item.program_code,
      project_code: record.item.project_code,
      economic_classification_code: record.item.economic_classification_code,
      source_of_funding_code: record.item.source_of_funding_code,
      function_code: record.item.function_code,
      amount: record.item.amount,
      recording_account: record.item.recording_account,
      expected_payment_date: record.item.expected_payment_date,
      urgent_payment: record.item.urgent_payment,
      posting_account: record.item.posting_account
    });

  if (itemError) throw itemError;
  return recordData.id;
}

export async function getRecordsFromDatabase(userId: string): Promise<Record[]> {
  const { data: recordsData, error: recordsError } = await supabase
    .from('records')
    .select(`
      *,
      record_items (*)
    `)
    .eq('user_id', userId)
    .order('sequence_number', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (recordsError) throw recordsError;
  if (!recordsData) return [];

  return recordsData.map((dbRecord: DatabaseRecord) => ({
    id: dbRecord.id,
    sequence_number: dbRecord.sequence_number,
    reason_code: dbRecord.reason_code,
    external_id: dbRecord.external_id,
    recipient: dbRecord.recipient,
    recipient_place: dbRecord.recipient_place,
    account_number: dbRecord.account_number,
    invoice_number: dbRecord.invoice_number,
    invoice_type: dbRecord.invoice_type,
    invoice_date: dbRecord.invoice_date,
    due_date: dbRecord.due_date,
    contract_number: dbRecord.contract_number,
    payment_code: dbRecord.payment_code,
    credit_model: dbRecord.credit_model,
    credit_reference_number: dbRecord.credit_reference_number,
    payment_basis: dbRecord.payment_basis,
    item: (dbRecord.record_items && dbRecord.record_items.length > 0) ? {
      budget_user_id: dbRecord.record_items[0].budget_user_id,
      program_code: dbRecord.record_items[0].program_code,
      project_code: dbRecord.record_items[0].project_code,
      economic_classification_code: dbRecord.record_items[0].economic_classification_code,
      source_of_funding_code: dbRecord.record_items[0].source_of_funding_code,
      function_code: dbRecord.record_items[0].function_code,
      amount: dbRecord.record_items[0].amount,
      recording_account: dbRecord.record_items[0].recording_account,
      expected_payment_date: dbRecord.record_items[0].expected_payment_date,
      urgent_payment: dbRecord.record_items[0].urgent_payment,
      posting_account: dbRecord.record_items[0].posting_account
    } : {
      budget_user_id: '',
      program_code: '',
      project_code: '',
      economic_classification_code: '',
      source_of_funding_code: '',
      function_code: '',
      amount: 0,
      recording_account: '',
      expected_payment_date: '',
      urgent_payment: false,
      posting_account: ''
    }
  }));
}

export async function updateRecordInDatabase(recordId: string, record: Record): Promise<void> {
  const { error: recordError } = await supabase
    .from('records')
    .update({
      reason_code: record.reason_code,
      external_id: record.external_id,
      recipient: record.recipient,
      recipient_place: record.recipient_place,
      account_number: record.account_number,
      invoice_number: record.invoice_number,
      invoice_type: record.invoice_type,
      invoice_date: record.invoice_date,
      due_date: record.due_date,
      contract_number: record.contract_number,
      payment_code: record.payment_code,
      credit_model: record.credit_model,
      credit_reference_number: record.credit_reference_number,
      payment_basis: record.payment_basis,
      updated_at: new Date().toISOString()
    })
    .eq('id', recordId);

  if (recordError) throw recordError;

  const { error: itemError } = await supabase
    .from('record_items')
    .update({
      budget_user_id: record.item.budget_user_id,
      program_code: record.item.program_code,
      project_code: record.item.project_code,
      economic_classification_code: record.item.economic_classification_code,
      source_of_funding_code: record.item.source_of_funding_code,
      function_code: record.item.function_code,
      amount: record.item.amount,
      recording_account: record.item.recording_account,
      expected_payment_date: record.item.expected_payment_date,
      urgent_payment: record.item.urgent_payment,
      posting_account: record.item.posting_account,
      updated_at: new Date().toISOString()
    })
    .eq('record_id', recordId);

  if (itemError) throw itemError;
}

export async function deleteRecordFromDatabase(recordId: string): Promise<void> {
  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', recordId);

  if (error) throw error;
}

export async function searchRecords(
  userId: string,
  searchQuery: string
): Promise<Record[]> {
  const query = `%${searchQuery}%`;

  const { data: recordsData, error } = await supabase
    .from('records')
    .select(`
      *,
      record_items (*)
    `)
    .eq('user_id', userId)
    .or(`recipient.ilike.${query},invoice_number.ilike.${query},account_number.ilike.${query},external_id.ilike.${query}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!recordsData) return [];

  return recordsData.map((dbRecord: DatabaseRecord) => ({
    id: dbRecord.id,
    reason_code: dbRecord.reason_code,
    external_id: dbRecord.external_id,
    recipient: dbRecord.recipient,
    recipient_place: dbRecord.recipient_place,
    account_number: dbRecord.account_number,
    invoice_number: dbRecord.invoice_number,
    invoice_type: dbRecord.invoice_type,
    invoice_date: dbRecord.invoice_date,
    due_date: dbRecord.due_date,
    contract_number: dbRecord.contract_number,
    payment_code: dbRecord.payment_code,
    credit_model: dbRecord.credit_model,
    credit_reference_number: dbRecord.credit_reference_number,
    payment_basis: dbRecord.payment_basis,
    item: (dbRecord.record_items && dbRecord.record_items.length > 0) ? {
      budget_user_id: dbRecord.record_items[0].budget_user_id,
      program_code: dbRecord.record_items[0].program_code,
      project_code: dbRecord.record_items[0].project_code,
      economic_classification_code: dbRecord.record_items[0].economic_classification_code,
      source_of_funding_code: dbRecord.record_items[0].source_of_funding_code,
      function_code: dbRecord.record_items[0].function_code,
      amount: dbRecord.record_items[0].amount,
      recording_account: dbRecord.record_items[0].recording_account,
      expected_payment_date: dbRecord.record_items[0].expected_payment_date,
      urgent_payment: dbRecord.record_items[0].urgent_payment,
      posting_account: dbRecord.record_items[0].posting_account
    } : {
      budget_user_id: '',
      program_code: '',
      project_code: '',
      economic_classification_code: '',
      source_of_funding_code: '',
      function_code: '',
      amount: 0,
      recording_account: '',
      expected_payment_date: '',
      urgent_payment: false,
      posting_account: ''
    }
  }));
}

export async function clearAllUserData(userId: string): Promise<void> {
  const { error: recordsError } = await supabase
    .from('records')
    .delete()
    .eq('user_id', userId);

  if (recordsError) throw recordsError;

  const { error: headersError } = await supabase
    .from('headers')
    .delete()
    .eq('user_id', userId);

  if (headersError) throw headersError;
}
