const fs = require('fs');
const path = require('path');

function wrap(tag, value) {
  return `<${tag}>${value}</${tag}>`;
}

function recordToXml(record) {
  return `  <zapis>
    ${wrap('id', record.id)}
    ${wrap('redni_broj', record.sequence_number)}
    ${wrap('broj_fakture', record.invoice_number)}
    ${wrap('iznos', record.amount)}
    ${wrap('broj_ugovora', record.contract_number)}
    ${wrap('hitno', record.urgent_payment ? 'true' : 'false')}
    ${wrap('datum_fakture', record.invoice_date)}
  </zapis>`;
}

function exportXml(filename, header, records) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<root>`;
  const xmlFooter = `\n</root>`;
  const headerXml = `\n  <header>\n    ${wrap('company', header.company)}\n    ${wrap('tax_id', header.tax_id)}\n    ${wrap('bank_account', header.bank_account)}\n  </header>`;
  const recordsXml = records.map(recordToXml).join('\n');
  const content = `${xmlHeader}${headerXml}\n  <zapisi>\n${recordsXml}\n  </zapisi>${xmlFooter}`;
  fs.writeFileSync(path.join(process.cwd(), filename), content, 'utf8');
  console.log(`Wrote ${filename} (${records.length} records)`);
}

function generateRecords(count, startIndex = 1) {
  const records = [];
  const invoiceTypes = ['Faktura', 'Hitna faktura', 'Korekcija', 'Predračun'];
  const paymentBasis = ['Izvršeni radovi', 'Naplata usluga', 'Popravka', 'Konsultantske usluge', 'Nabavka materijala'];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const isUrgent = idx > 100 && idx <= 200;
    const rec = {
      id: `test_rec_${now}_${idx}`,
      sequence_number: idx,
      invoice_number: `INV-${String(idx).padStart(4, '0')}`,
      invoice_type: invoiceTypes[Math.floor(Math.random() * invoiceTypes.length)],
      invoice_date: '2024-12-01',
      due_date: '2024-12-31',
      expected_payment_date: '2024-12-25',
      contract_number: `KON-${String(idx).padStart(4, '0')}`,
      payment_basis: paymentBasis[Math.floor(Math.random() * paymentBasis.length)],
      amount: Math.floor(Math.random() * 200000) + 1000,
      urgent_payment: isUrgent
    };
    records.push(rec);
  }
  return records;
}

function resequence(records) {
  return records.map((r, i) => ({ ...r, sequence_number: i + 1 }));
}

(function main(){
  const header = {
    company: 'Test Company Ltd',
    tax_id: '12345678901',
    bank_account: 'RS12345678901234567890'
  };

  let records = generateRecords(300, 1);
  exportXml('TEST_001_initial_300.xml', header, records);

  const allUrgent = records.map(r => ({ ...r, urgent_payment: true }));
  exportXml('TEST_002_all_hitno.xml', header, allUrgent);

  const resetUrgent = allUrgent.map(r => ({ ...r, urgent_payment: false }));
  exportXml('TEST_003_hitno_reset.xml', header, resetUrgent);

  const bulkUpdated = resetUrgent.map(r => ({ ...r, invoice_number: 'INV-TEST-2024', payment_basis: 'Test Payment Basis' }));
  exportXml('TEST_004_bulk_changed.xml', header, bulkUpdated);

  const toDeleteSeqs = new Set([1,5,10]);
  for (let s=40;s<=50;s++) toDeleteSeqs.add(s);
  let afterDelete = bulkUpdated.filter(r => !toDeleteSeqs.has(r.sequence_number));
  afterDelete = resequence(afterDelete);
  exportXml('TEST_005_after_delete.xml', header, afterDelete);

  const newRecords = generateRecords(50, afterDelete.length + 1);
  let afterAdd = [...afterDelete, ...newRecords];
  afterAdd = resequence(afterAdd);
  exportXml('TEST_006_after_add.xml', header, afterAdd);

  const results = [];
  results.push(`TEST_001_initial_300.xml -> ${records.length} records`);
  results.push(`TEST_002_all_hitno.xml -> ${allUrgent.length} records (all hitno true)`);
  results.push(`TEST_003_hitno_reset.xml -> ${resetUrgent.length} records (all hitno false)`);
  results.push(`TEST_004_bulk_changed.xml -> ${bulkUpdated.length} records (invoice changed)`);
  results.push(`TEST_005_after_delete.xml -> ${afterDelete.length} records`);
  results.push(`TEST_006_after_add.xml -> ${afterAdd.length} records`);

  fs.writeFileSync(path.join(process.cwd(), 'TEST_RESULTS.txt'), results.join('\n'), 'utf8');
  console.log('Wrote TEST_RESULTS.txt');
})();
