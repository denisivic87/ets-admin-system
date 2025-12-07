# 🧪 Comprehensive Application Testing Script

## Test Scenario Overview
This script will test the application with:
1. ✅ 300 random records with various data
2. ✅ XML export verification
3. ✅ Data manipulation (add/delete rows)
4. ✅ Re-export and comparison
5. ✅ Bulk edit operations
6. ✅ Search and filter functionality
7. ✅ Pagination verification
8. ✅ Data integrity checks

---

## Test Data Generation

### Test Record 1-100: Standard Invoices
```
Invoice Type: Faktura
Amount Range: 1000 - 50000
Payment Basis: Izvršeni radovi
Contract Numbers: KON-001 through KON-100
```

### Test Record 101-200: Urgent Payments
```
Invoice Type: Hitna faktura
Amount Range: 500 - 100000
Marked as URGENT: YES
Payment Basis: Naplata usluga
Contract Numbers: KON-101 through KON-200
```

### Test Record 201-300: Mixed Data
```
Invoice Type: Various
Amount Range: 100 - 200000
Some marked URGENT, some normal
Multiple payment basis types
Contract Numbers: KON-201 through KON-300
```

---

## Test Steps

### PHASE 1: Initial Load & Export
**Duration: 5 minutes**

1. **Login as Admin**
   - Username: `admin`
   - Password: `test123`

2. **Set Header Information**
   - Company: "Test Company Ltd"
   - Tax ID: "12345678901"
   - Bank Account: "RS12345678901234567890"

3. **Add 300 Records**
   - Use Bulk Add feature
   - Add 50 records at a time (6 batches)
   - Total: 300 records

4. **Verify Records Loaded**
   - Check pagination (15 pages with 20 records per page)
   - Check sequence numbers (1-300)
   - Check all fields populated

5. **Export XML (Export #1)**
   - Generate XML file
   - File name: `export_001_initial_300_records.xml`
   - Verify: 300 records in XML
   - Verify: Header information present
   - Verify: All required fields populated

**Expected Result:** ✅ 300 records exported successfully

---

### PHASE 2: Bulk Edit Test
**Duration: 5 minutes**

1. **Apply Bulk Edit - HITNO Status**
   - Select "Grupno menjanje"
   - Mark all records as HITNO
   - Expected: All 300 records marked urgent_payment = true

2. **Export XML (Export #2)**
   - File name: `export_002_all_hitno.xml`
   - Verify: All records have urgent_payment = true
   - Compare with Export #1: Only difference should be urgent_payment field

3. **Reset HITNO Status**
   - Select "Grupno menjanje"
   - Click "Vrati HITNO na početnu vrijednost"
   - Expected: All 300 records reset to urgent_payment = false

4. **Export XML (Export #3)**
   - File name: `export_003_hitno_reset.xml`
   - Verify: All records have urgent_payment = false
   - Should match Export #1

**Expected Result:** ✅ HITNO status changes reflected correctly in XML

---

### PHASE 3: Selective Bulk Edit
**Duration: 5 minutes**

1. **Bulk Update Invoice Numbers**
   - Select "Grupno menjanje"
   - Change invoice_number to "INV-2024-TEST"
   - Update payment_basis to "Test Payment Basis"

2. **Export XML (Export #4)**
   - File name: `export_004_bulk_updated.xml`
   - Verify: All 300 records have new invoice_number
   - Verify: All 300 records have new payment_basis
   - External IDs should be regenerated as: "1-INV-2024-TEST", "2-INV-2024-TEST", etc.

**Expected Result:** ✅ Bulk fields updated correctly across all 300 records

---

### PHASE 4: Data Deletion Test
**Duration: 5 minutes**

1. **Delete Specific Records**
   - Go to page 1, delete record 1
   - Go to page 2, delete record 20
   - Go to page 5, delete records 80-90 (10 records)
   - Total deleted: 12 records

2. **Verify Count**
   - Expected total: 288 records
   - Sequence numbers should be: 1-12, 13-299 (with gaps for deleted)
   - OR: Re-sequenced depending on implementation

3. **Export XML (Export #5)**
   - File name: `export_005_after_deletions.xml`
   - Verify: 288 records in XML
   - Check: No gaps in sequence (1-288)
   - Verify: All invoice numbers still present

**Expected Result:** ✅ Correct number of records, proper sequence

---

### PHASE 5: Record Addition Test
**Duration: 5 minutes**

1. **Add New Records (Programmatically)**
   - Add 50 new records manually one by one
   - OR use bulk add to add 50 more

2. **Verify Total**
   - Expected: 288 + 50 = 338 records
   - New sequence numbers: 289-338

3. **Export XML (Export #6)**
   - File name: `export_006_after_additions.xml`
   - Verify: 338 records in XML
   - Verify: Sequence numbers 1-338
   - Verify: New records properly formatted

**Expected Result:** ✅ New records added with correct sequences

---

### PHASE 6: Search & Filter Test
**Duration: 5 minutes**

1. **Search by Invoice Number**
   - Search: "INV-2024"
   - Expected: 338 results (all match)
   - Verify pagination adjusts

2. **Search by Contract Number**
   - Search: "KON-050"
   - Expected: 1 result (or multiple if duplicates)
   - Verify correct record displayed

3. **Clear Search**
   - All 338 records should reappear

**Expected Result:** ✅ Search functionality working correctly

---

### PHASE 7: Pagination Test
**Duration: 3 minutes**

1. **Navigate Pagination**
   - Page 1: Records 1-20
   - Page 17: Records 321-338 (last page, fewer records)
   - Jump to page 10: Records 181-200

2. **Verify Record Display**
   - Correct sequence numbers displayed
   - Page indicator showing correct position

**Expected Result:** ✅ Pagination working correctly

---

### PHASE 8: Data Integrity Check
**Duration: 5 minutes**

1. **Compare XML Exports**
   - Export #1 (300 records, initial)
   - Export #3 (300 records, HITNO reset)
   - Export #6 (338 records, final)

2. **Validate XML Structure**
   - Check XML well-formedness
   - Verify all required fields present
   - Check data types correct
   - Verify no special characters breaking XML

3. **Cross-check Records**
   - Spot-check 20 random records
   - Verify data matches what's displayed in UI
   - Check sequence numbers match

**Expected Result:** ✅ XML integrity maintained, all exports valid

---

### PHASE 9: Edit Individual Records
**Duration: 5 minutes**

1. **Edit Record #100**
   - Change amount to 99999
   - Change invoice_type to "Korekcija"
   - Save changes

2. **Verify Changes**
   - Record #100 shows new values
   - External ID regenerated if needed

3. **Edit Record #338 (Last)**
   - Change payment_basis to "Test Edit Last"
   - Save changes

4. **Export XML (Export #7)**
   - File name: `export_007_after_individual_edits.xml`
   - Verify: Changes reflected in XML
   - Only 2 records should differ from Export #6

**Expected Result:** ✅ Individual edits applied and exported

---

### PHASE 10: Storage & Refresh Test
**Duration: 5 minutes**

1. **Verify localStorage**
   - Browser localStorage should contain all 338 records
   - Check Network tab: No API calls (all client-side)

2. **Refresh Page (F5)**
   - All data should reload
   - 338 records should still be present
   - No data loss

3. **Re-export (Export #8)**
   - File name: `export_008_after_refresh.xml`
   - Should match Export #7 exactly
   - Same 338 records with same values

**Expected Result:** ✅ Data persists after refresh, no loss

---

## Expected Results Summary

| Test Phase | Expected Result | Status |
|-----------|-----------------|--------|
| Phase 1: Initial Load | 300 records exported ✅ | PASS/FAIL |
| Phase 2: Bulk HITNO Edit | HITNO toggled for all records ✅ | PASS/FAIL |
| Phase 3: Selective Bulk Edit | Invoice numbers updated for all ✅ | PASS/FAIL |
| Phase 4: Deletion | 12 records deleted, 288 remain ✅ | PASS/FAIL |
| Phase 5: Addition | 50 records added, 338 total ✅ | PASS/FAIL |
| Phase 6: Search | Search finds correct records ✅ | PASS/FAIL |
| Phase 7: Pagination | Navigation correct, 17 pages ✅ | PASS/FAIL |
| Phase 8: Data Integrity | XML valid, data matches ✅ | PASS/FAIL |
| Phase 9: Individual Edits | Edits applied to 2 records ✅ | PASS/FAIL |
| Phase 10: Refresh | Data persists after F5 ✅ | PASS/FAIL |

---

## Validation Checklist

### ✅ XML Export Validation
- [ ] 300, 288, 338 records in respective exports
- [ ] All required fields present
- [ ] No empty required fields
- [ ] Correct XML structure
- [ ] Proper encoding (UTF-8)
- [ ] No data corruption

### ✅ Sequence Number Validation
- [ ] Numbers 1-N present
- [ ] No duplicates
- [ ] Sequential order maintained
- [ ] Updated after deletions/additions

### ✅ Data Consistency
- [ ] External IDs match pattern "N-InvoiceNumber"
- [ ] Amounts are numeric
- [ ] Dates in correct format (YYYY-MM-DD)
- [ ] Boolean values (HITNO) correct

### ✅ UI Performance
- [ ] No lag when loading 300+ records
- [ ] Pagination responsive
- [ ] Bulk edit processes quickly
- [ ] Export generates in < 5 seconds

### ✅ Storage Validation
- [ ] localStorage contains all records
- [ ] Header data preserved
- [ ] Search history optional
- [ ] Prefill settings saved

---

## Test Automation Commands

### Generate 300 Test Records (JavaScript Console)
```javascript
// This will be added as test helper
const records = [];
for (let i = 1; i <= 300; i++) {
  records.push({
    id: `rec_${i}`,
    sequence_number: i,
    invoice_number: `INV-${String(i).padStart(3, '0')}`,
    invoice_type: i <= 100 ? 'Faktura' : i <= 200 ? 'Hitna faktura' : 'Druga',
    amount: Math.floor(Math.random() * 200000) + 100,
    contract_number: `KON-${String(i).padStart(3, '0')}`,
    payment_basis: ['Izvršeni radovi', 'Naplata usluga', 'Popravka'][Math.floor(Math.random() * 3)],
    urgent_payment: i > 100 && i <= 200,
    invoice_date: '2024-12-01',
    due_date: '2024-12-31'
  });
}
```

---

## Files to Generate

1. ✅ `export_001_initial_300_records.xml` - Baseline
2. ✅ `export_002_all_hitno.xml` - All marked urgent
3. ✅ `export_003_hitno_reset.xml` - HITNO reset
4. ✅ `export_004_bulk_updated.xml` - Invoice numbers updated
5. ✅ `export_005_after_deletions.xml` - After 12 deletions (288 records)
6. ✅ `export_006_after_additions.xml` - After 50 additions (338 records)
7. ✅ `export_007_after_individual_edits.xml` - 2 records edited
8. ✅ `export_008_after_refresh.xml` - After page refresh

---

## Success Criteria

**Application is considered STABLE if:**
- ✅ All 10 test phases pass
- ✅ 0 data loss during operations
- ✅ XML exports are valid and consistent
- ✅ Pagination works correctly
- ✅ Search functionality accurate
- ✅ Bulk operations work on all 300+ records
- ✅ No JavaScript errors in console
- ✅ Performance acceptable (< 5s for exports)
- ✅ Data persists after page refresh
- ✅ No duplicate records generated

---

**Test Start Time:** [When you begin]
**Test End Time:** [When you complete]
**Total Duration:** ~45 minutes
**Tester:** [Your name]
**Result:** PASS / FAIL

