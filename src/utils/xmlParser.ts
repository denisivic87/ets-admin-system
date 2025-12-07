import { Record, Header } from '../types/records';

export interface ParsedXMLData {
  header: Header;
  records: Record[];
}

export const parseXML = (xmlContent: string): ParsedXMLData => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML format');
  }

  const commitmentsElement = xmlDoc.querySelector('commitments');
  if (!commitmentsElement) {
    throw new Error('Invalid XML structure - missing commitments element');
  }

  // Parse header
  const header: Header = {
    cumulative_reason_code: commitmentsElement.getAttribute('cumulative_reason_code') || '',
    budget_year: commitmentsElement.getAttribute('budget_year') || '',
    budget_user_id: commitmentsElement.getAttribute('budget_user_id') || '',
    currency_code: commitmentsElement.getAttribute('currency_code') || '',
    treasury: commitmentsElement.getAttribute('treasury') || ''
  };

  // Parse records
  const commitmentElements = xmlDoc.querySelectorAll('commitment');
  const records: Record[] = [];

  commitmentElements.forEach((commitment, index) => {
    const itemElement = commitment.querySelector('item');
    if (!itemElement) {
      throw new Error(`Missing item element in commitment ${index + 1}`);
    }

    const getTextContent = (element: Element, selector: string): string => {
      const el = element.querySelector(selector);
      return el?.textContent?.trim() || '';
    };

    const sequenceAttr = commitment.getAttribute('sequence_number');
    const sequenceNumber = sequenceAttr ? parseInt(sequenceAttr, 10) : undefined;

    const record: Record = {
      id: Date.now().toString() + index,
      sequence_number: sequenceNumber,
      reason_code: commitment.getAttribute('reason_code') || '',
      external_id: commitment.getAttribute('external_id') || '',
      recipient: commitment.getAttribute('recipient') || '',
      recipient_place: commitment.getAttribute('recipient_place') || '',
      account_number: commitment.getAttribute('account_number') || '',
      invoice_number: commitment.getAttribute('invoice_number') || '',
      invoice_type: commitment.getAttribute('invoice_type') || '',
      invoice_date: commitment.getAttribute('invoice_date') || '',
      due_date: commitment.getAttribute('due_date') || '',
      contract_number: commitment.getAttribute('contract_number') || '',
      payment_code: commitment.getAttribute('payment_code') || '',
      credit_model: commitment.getAttribute('credit_model') || '',
      credit_reference_number: commitment.getAttribute('credit_reference_number') || '',
      payment_basis: commitment.getAttribute('payment_basis') || '',
      item: {
        budget_user_id: getTextContent(itemElement, 'budget_user_id'),
        program_code: getTextContent(itemElement, 'program_code'),
        project_code: getTextContent(itemElement, 'project_code'),
        economic_classification_code: getTextContent(itemElement, 'economic_classification_code'),
        source_of_funding_code: getTextContent(itemElement, 'source_of_funding_code'),
        function_code: getTextContent(itemElement, 'function_code'),
        amount: parseFloat(getTextContent(itemElement, 'amount')) || 0,
        recording_account: getTextContent(itemElement, 'recording_account'),
        expected_payment_date: getTextContent(itemElement, 'expected_payment_date'),
        urgent_payment: getTextContent(itemElement, 'urgent_payment').toLowerCase() === 'true',
        posting_account: getTextContent(itemElement, 'posting_account')
      }
    };

    records.push(record);
  });

  return { header, records };
};

export const importXMLFile = (file: File): Promise<ParsedXMLData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const xmlContent = event.target?.result as string;
        const parsedData = parseXML(xmlContent);
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};