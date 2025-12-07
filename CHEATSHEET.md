# ⚡ QUICK TEST CHEATSHEET

## 🚀 START (30 sekundi)
```powershell
cd c:\Users\Denis\Desktop\1\project
npm run dev
# Čeka: http://localhost:5174
```

## 🔐 LOGIN (1 minut)
```
Username: denis.ivic
Password: Gracanica1.
```

## 📊 LOAD 300 RECORDS (2 minute)
```javascript
// F12 → Console tab → Lijepi i pokreni:

TestHelper.generateRandomRecords(300)
TestHelper.saveToStorage(records)
// Osvježi (F5)
```

## ✅ 10 TEST PHASES

| # | Test | Action | Expected | File |
|---|------|--------|----------|------|
| 1 | Initial | Export | 300 records | TEST_001.xml |
| 2 | HITNO Set | Bulk edit | All urgent | TEST_002.xml |
| 3 | HITNO Reset | Bulk edit | All normal | TEST_003.xml |
| 4 | Bulk Update | Change invoice | 300 updated | TEST_004.xml |
| 5 | Delete | Delete 13 | 287 remain | TEST_005.xml |
| 6 | Add | Add 50 | 337 total | TEST_006.xml |
| 7 | Search | Search | 337 found | - |
| 8 | Pagination | Navigate | 17 pages | - |
| 9 | Refresh | F5 | Data intact | - |
| 10 | Validate | Check XML | All valid | - |

## 📁 GENERATED FILES

✅ TEST_SCRIPT.md → Detaljni scenarij (45 min)
✅ TESTING_INSTRUCTIONS.md → Korak-po-korak (30 min)
✅ TEST_HELPER.js → Browser console funkcije
✅ VALIDATE_XML.ps1 → XML validacija skriptu
✅ TESTING_READY.md → Overview (ovo)

## 🔧 BROWSER CONSOLE COMMANDS

```javascript
// Generate & save
TestHelper.generateRandomRecords(300)
TestHelper.saveToStorage(records)

// Verify
TestHelper.verifyRecordCount()
TestHelper.checkIntegrity()

// Simulate
TestHelper.simulateBulkDelete(10)
TestHelper.simulateBulkAdd(50)

// Report
TestHelper.generateTestReport()
TestHelper.runFullTest()
```

## ⚙️ VALIDATION

```powershell
# U PowerShell:
powershell -ExecutionPolicy Bypass -File VALIDATE_XML.ps1

# Što će se desiti:
# ✅ Pronađe sve TEST_*.xml datoteke
# ✅ Validira sve datoteke
# ✅ Broji zapise
# ✅ Generiše report
```

## 📊 SUCCESS CHECKLIST

- [ ] 300 zapisa učitano
- [ ] XML export radi
- [ ] HITNO toggle radi
- [ ] Bulk edit radi na svim
- [ ] Delete/add radi
- [ ] Search pronalazi sve
- [ ] Pagination ispravna
- [ ] Refresh čuva podatke
- [ ] XML validna
- [ ] Nema console greške

## 🎯 TIME ESTIMATES

- Setup: 5 min
- Data Load: 5 min
- Tests 1-3: 5 min
- Tests 4-6: 10 min
- Tests 7-10: 10 min
- Validation: 5 min
- **TOTAL: ~45 min**

## 🆘 QUICK FIXES

```javascript
// Problem: Zapisi se ne vide
localStorage.getItem('records').length
// Trebalo bi: 300

// Problem: HITNO ne radi
// Osvježi (F5) i pokušaj ponovno

// Problem: XML se ne exportuje
// Provjeri console (F12) za greške

// Problem: Validation ne radi
// Koristi: dir TEST_*.xml da vidiš datoteke
```

## 📝 EXPECTED RESULTS

| Phase | Input | Output | Status |
|-------|-------|--------|--------|
| 1 | - | 300 | PASS |
| 2 | HITNO | 300 | PASS |
| 3 | Reset | 300 | PASS |
| 4 | Update | INV-TEST | PASS |
| 5 | Delete 13 | 287 | PASS |
| 6 | Add 50 | 337 | PASS |
| 7 | Search | Found | PASS |
| 8 | Pagination | 17 pages | PASS |
| 9 | Refresh | Intact | PASS |
| 10 | Validate | Valid | PASS |

## 🚀 GO!

```
1. npm run dev
2. Login
3. Setup header
4. Generate 300 records
5. Run tests 1-10
6. Validate XML
7. Report results
```

**App: http://localhost:5174** 🎉

---

**Print this page or keep open while testing!** 📋
