/**
 * 🧪 APPLICATION TEST HELPER
 * 
 * This file provides testing utilities that can be used in the browser console.
 * 
 * Usage:
 * 1. Open browser Developer Tools (F12)
 * 2. Go to Console tab
 * 3. Copy and paste functions below
 * 4. Run: TestHelper.generateRandomRecords(300)
 * 5. Check results
 */

const TestHelper = {
  
  /**
   * Generate random test records
   * @param {number} count - Number of records to generate
   * @returns {array} Array of test records
   */
  generateRandomRecords(count = 300) {
    console.log(`🔄 Generating ${count} test records...`);
    const records = [];
    const invoiceTypes = ['Faktura', 'Hitna faktura', 'Korekcija', 'Predračun'];
    const paymentBasis = ['Izvršeni radovi', 'Naplata usluga', 'Popravka', 'Konsultantske usluge', 'Nabavka materijala'];
    
    for (let i = 1; i <= count; i++) {
      const isUrgent = i > 100 && i <= 200;
      const record = {
        id: `test_rec_${Date.now()}_${i}`,
        sequence_number: i,
        invoice_number: `INV-${String(i).padStart(4, '0')}`,
        invoice_type: invoiceTypes[Math.floor(Math.random() * invoiceTypes.length)],
        invoice_date: '2024-12-01',
        due_date: '2024-12-31',
        expected_payment_date: '2024-12-25',
        contract_number: `KON-${String(i).padStart(4, '0')}`,
        payment_basis: paymentBasis[Math.floor(Math.random() * paymentBasis.length)],
        amount: Math.floor(Math.random() * 200000) + 1000,
        urgent_payment: isUrgent,
        item: {
          amount: Math.floor(Math.random() * 200000) + 1000,
          urgent_payment: isUrgent,
          expected_payment_date: '2024-12-25'
        }
      };
      records.push(record);
    }
    
    console.log(`✅ Generated ${records.length} records`);
    console.table(records.slice(0, 5)); // Show first 5
    console.log(`📊 Sample breakdown:`);
    console.log(`   - Standard: ${count - 100} records`);
    console.log(`   - Urgent: 100 records`);
    console.log(`   - Total: ${count} records`);
    
    return records;
  },

  /**
   * Save records to localStorage
   * @param {array} records - Records to save
   */
  saveToStorage(records) {
    console.log(`💾 Saving ${records.length} records to localStorage...`);
    try {
      localStorage.setItem('records', JSON.stringify(records));
      console.log(`✅ Successfully saved ${records.length} records`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving records:`, error);
      return false;
    }
  },

  /**
   * Get records from localStorage
   * @returns {array} Records from storage
   */
  getFromStorage() {
    try {
      const stored = localStorage.getItem('records');
      const records = stored ? JSON.parse(stored) : [];
      console.log(`📂 Retrieved ${records.length} records from localStorage`);
      return records;
    } catch (error) {
      console.error(`❌ Error retrieving records:`, error);
      return [];
    }
  },

  /**
   * Verify record count
   * @returns {object} Verification results
   */
  verifyRecordCount() {
    const records = this.getFromStorage();
    console.log(`\n📊 RECORD COUNT VERIFICATION`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total records: ${records.length}`);
    console.log(`Urgent records: ${records.filter(r => r.urgent_payment).length}`);
    console.log(`Normal records: ${records.filter(r => !r.urgent_payment).length}`);
    
    const expected = {
      standard: records.length - 100,
      urgent: 100,
      total: records.length
    };
    
    return {
      actual: records.length,
      expected: expected.total,
      pass: records.length === expected.total
    };
  },

  /**
   * Check data integrity
   * @returns {object} Integrity check results
   */
  checkIntegrity() {
    const records = this.getFromStorage();
    console.log(`\n🔍 DATA INTEGRITY CHECK`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    const issues = [];
    const warnings = [];
    
    // Check for duplicates
    const ids = records.map(r => r.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      issues.push(`⚠️ Found ${ids.length - uniqueIds.size} duplicate IDs`);
    }
    
    // Check for missing required fields
    records.forEach((record, index) => {
      if (!record.invoice_number) issues.push(`Record ${index}: Missing invoice_number`);
      if (!record.contract_number) issues.push(`Record ${index}: Missing contract_number`);
      if (record.amount === undefined) issues.push(`Record ${index}: Missing amount`);
      if (isNaN(record.sequence_number)) warnings.push(`Record ${index}: Invalid sequence_number`);
    });
    
    // Check sequence numbers
    const sequences = records.map(r => r.sequence_number).sort((a, b) => a - b);
    let hasGaps = false;
    for (let i = 0; i < sequences.length - 1; i++) {
      if (sequences[i + 1] - sequences[i] !== 1) {
        hasGaps = true;
        break;
      }
    }
    if (hasGaps) {
      warnings.push(`⚠️ Gaps detected in sequence numbers`);
    }
    
    console.log(`Total records: ${records.length}`);
    console.log(`Unique IDs: ${uniqueIds.size}`);
    console.log(`Issues found: ${issues.length}`);
    console.log(`Warnings: ${warnings.length}`);
    
    if (issues.length > 0) {
      console.error(`❌ ISSUES:`, issues);
    }
    if (warnings.length > 0) {
      console.warn(`⚠️ WARNINGS:`, warnings);
    }
    if (issues.length === 0 && warnings.length === 0) {
      console.log(`✅ No issues found!`);
    }
    
    return {
      totalRecords: records.length,
      issues: issues.length,
      warnings: warnings.length,
      pass: issues.length === 0
    };
  },

  /**
   * Simulate bulk delete
   * @param {number} count - Number of records to delete
   */
  simulateBulkDelete(count = 10) {
    const records = this.getFromStorage();
    console.log(`\n🗑️ BULK DELETE SIMULATION`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Before: ${records.length} records`);
    
    const deleted = records.splice(0, count);
    this.saveToStorage(records);
    
    console.log(`Deleted: ${count} records`);
    console.log(`After: ${records.length} records`);
    console.log(`✅ Successfully deleted ${count} records`);
    
    return {
      before: records.length + count,
      deleted: count,
      after: records.length
    };
  },

  /**
   * Simulate bulk add
   * @param {number} count - Number of records to add
   */
  simulateBulkAdd(count = 50) {
    const records = this.getFromStorage();
    const newRecords = this.generateRandomRecords(count);
    
    console.log(`\n➕ BULK ADD SIMULATION`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Before: ${records.length} records`);
    
    // Re-sequence all records
    const allRecords = [...records, ...newRecords];
    allRecords.forEach((record, index) => {
      record.sequence_number = index + 1;
    });
    
    this.saveToStorage(allRecords);
    
    console.log(`Added: ${count} records`);
    console.log(`After: ${allRecords.length} records`);
    console.log(`✅ Successfully added ${count} records`);
    
    return {
      before: records.length,
      added: count,
      after: allRecords.length
    };
  },

  /**
   * Generate test report
   * @returns {object} Test report
   */
  generateTestReport() {
    console.log(`\n\n════════════════════════════════════════════════════════`);
    console.log(`📋 COMPREHENSIVE TEST REPORT`);
    console.log(`════════════════════════════════════════════════════════\n`);
    
    const countCheck = this.verifyRecordCount();
    const integrityCheck = this.checkIntegrity();
    
    console.log(`\n📊 SUMMARY`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Record Count Test: ${countCheck.pass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Expected: ${countCheck.expected}`);
    console.log(`  Actual: ${countCheck.actual}`);
    
    console.log(`\nData Integrity Test: ${integrityCheck.pass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Total Records: ${integrityCheck.totalRecords}`);
    console.log(`  Issues: ${integrityCheck.issues}`);
    console.log(`  Warnings: ${integrityCheck.warnings}`);
    
    console.log(`\n════════════════════════════════════════════════════════`);
    console.log(`Overall Result: ${(countCheck.pass && integrityCheck.pass) ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`════════════════════════════════════════════════════════\n`);
    
    return {
      countTest: countCheck,
      integrityTest: integrityCheck,
      overallPass: countCheck.pass && integrityCheck.pass
    };
  },

  /**
   * Run complete test sequence
   */
  async runFullTest() {
    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`🚀 STARTING FULL APPLICATION TEST SUITE`);
    console.log(`${'='.repeat(60)}\n`);
    
    const startTime = Date.now();
    
    // Phase 1: Generate records
    console.log(`\n📝 PHASE 1: GENERATE 300 RECORDS`);
    console.log(`─────────────────────────────────`);
    const records = this.generateRandomRecords(300);
    
    // Phase 2: Save to storage
    console.log(`\n📝 PHASE 2: SAVE TO STORAGE`);
    console.log(`─────────────────────────────────`);
    this.saveToStorage(records);
    
    // Phase 3: Verify
    console.log(`\n📝 PHASE 3: VERIFY RECORDS`);
    console.log(`─────────────────────────────────`);
    this.verifyRecordCount();
    
    // Phase 4: Check integrity
    console.log(`\n📝 PHASE 4: CHECK INTEGRITY`);
    console.log(`─────────────────────────────────`);
    this.checkIntegrity();
    
    // Phase 5: Simulate deletion
    console.log(`\n📝 PHASE 5: SIMULATE DELETION`);
    console.log(`─────────────────────────────────`);
    this.simulateBulkDelete(10);
    
    // Phase 6: Simulate addition
    console.log(`\n📝 PHASE 6: SIMULATE ADDITION`);
    console.log(`─────────────────────────────────`);
    this.simulateBulkAdd(50);
    
    // Phase 7: Final report
    console.log(`\n📝 PHASE 7: FINAL REPORT`);
    console.log(`─────────────────────────────────`);
    const report = this.generateTestReport();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n⏱️ Test Duration: ${duration.toFixed(2)} seconds`);
    console.log(`${'='.repeat(60)}\n`);
    
    return report;
  },

  /**
   * Display usage instructions
   */
  showHelp() {
    console.log(`
    
╔════════════════════════════════════════════════════════════════════╗
║                 🧪 TEST HELPER FUNCTIONS                           ║
╚════════════════════════════════════════════════════════════════════╝

📖 USAGE INSTRUCTIONS:

1. GENERATE TEST DATA:
   TestHelper.generateRandomRecords(300)

2. SAVE TO STORAGE:
   TestHelper.saveToStorage(records)

3. VERIFY RECORD COUNT:
   TestHelper.verifyRecordCount()

4. CHECK DATA INTEGRITY:
   TestHelper.checkIntegrity()

5. SIMULATE DELETE:
   TestHelper.simulateBulkDelete(10)

6. SIMULATE ADD:
   TestHelper.simulateBulkAdd(50)

7. GENERATE REPORT:
   TestHelper.generateTestReport()

8. RUN FULL TEST:
   TestHelper.runFullTest()

9. SHOW THIS HELP:
   TestHelper.showHelp()

═══════════════════════════════════════════════════════════════════════

📊 QUICK TEST SEQUENCE:

// Step 1: Generate 300 records
TestHelper.generateRandomRecords(300)

// Step 2: Save to app (manually navigate to app and import)
// Or run full test:
TestHelper.runFullTest()

═══════════════════════════════════════════════════════════════════════
    `);
  }
};

// Auto-show help on load
console.log(`
✅ TestHelper loaded successfully!
Type: TestHelper.showHelp() for instructions
Or:   TestHelper.runFullTest() to run complete test suite
`);
