import { Record, Header } from '../types/records';

export const generateXML = (header: Header, records: Record[]): string => {
  const escapeXML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const processedRecords = records.map((record, index) => {
    let externalId = record.external_id.trim();

    if (!externalId) {
      externalId = `${index + 1}`;
    }

    if (record.invoice_number && record.invoice_number.trim()) {
      externalId = `${externalId}-${record.invoice_number.trim()}`;
    }

    return {
      ...record,
      external_id: externalId
    };
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<commitments`;
  xml += ` cumulative_reason_code="${escapeXML(header.cumulative_reason_code)}"`;
  xml += ` budget_year="${escapeXML(header.budget_year)}"`;
  xml += ` budget_user_id="${escapeXML(header.budget_user_id)}"`;
  xml += ` currency_code="${escapeXML(header.currency_code)}"`;
  xml += ` treasury="${escapeXML(header.treasury)}"`;
  xml += '>\n';

  processedRecords.forEach(record => {
    xml += '  <commitment';
    if (record.sequence_number !== undefined && record.sequence_number !== null) {
      xml += ` sequence_number="${record.sequence_number}"`;
    }
    xml += ` reason_code="${escapeXML(record.reason_code)}"`;
    xml += ` external_id="${escapeXML(record.external_id)}"`;
    xml += ` recipient="${escapeXML(record.recipient)}"`;
    xml += ` recipient_place="${escapeXML(record.recipient_place)}"`;
    xml += ` account_number="${escapeXML(record.account_number)}"`;
    xml += ` invoice_number="${escapeXML(record.invoice_number)}"`;
    xml += ` invoice_type="${escapeXML(record.invoice_type)}"`;
    xml += ` invoice_date="${escapeXML(record.invoice_date)}"`;
    xml += ` due_date="${escapeXML(record.due_date)}"`;
    xml += ` contract_number="${escapeXML(record.contract_number)}"`;
    xml += ` payment_code="${escapeXML(record.payment_code)}"`;
    xml += ` credit_model="${escapeXML(record.credit_model)}"`;
    xml += ` credit_reference_number="${escapeXML(record.credit_reference_number)}"`;
    xml += ` payment_basis="${escapeXML(record.payment_basis)}"`;
    xml += '>\n';

    xml += '    <item>\n';
    xml += `      <budget_user_id>${escapeXML(record.item.budget_user_id)}</budget_user_id>\n`;
    xml += `      <program_code>${escapeXML(record.item.program_code)}</program_code>\n`;
    xml += `      <project_code>${escapeXML(record.item.project_code)}</project_code>\n`;
    xml += `      <economic_classification_code>${escapeXML(record.item.economic_classification_code)}</economic_classification_code>\n`;
    xml += `      <source_of_funding_code>${escapeXML(record.item.source_of_funding_code)}</source_of_funding_code>\n`;
    xml += `      <function_code>${escapeXML(record.item.function_code)}</function_code>\n`;
    xml += `      <amount>${record.item.amount}</amount>\n`;
    xml += `      <recording_account>${escapeXML(record.item.recording_account)}</recording_account>\n`;
    xml += `      <expected_payment_date>${escapeXML(record.item.expected_payment_date)}</expected_payment_date>\n`;
    xml += `      <urgent_payment>${record.item.urgent_payment ? 'true' : 'false'}</urgent_payment>\n`;
    xml += `      <posting_account>${escapeXML(record.item.posting_account)}</posting_account>\n`;
    xml += '    </item>\n';
    xml += '  </commitment>\n';
  });

  xml += '</commitments>';
  return xml;
};

export const downloadXML = (xml: string, filename: string = 'commitments.xml') => {
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};