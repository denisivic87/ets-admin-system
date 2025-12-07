# 🚀 COMPREHENSIVE TEST SUITE - GOTOV JE!

Kreirane su sve potrebne datoteke za testiranje aplikacije sa 300 podataka. Evo što imaš dostupno:

---

## 📁 Kreirane Datoteke

### 1. **TEST_SCRIPT.md** 📋
   - Detaljni test scenario sa 10 faza
   - Očekivani rezultati za svaku fazu
   - Validation checklist
   - Success criteria
   
### 2. **TESTING_INSTRUCTIONS.md** 🎯
   - Korak-po-korak uputstvo
   - Kako učitati 300 random podataka
   - Kako testirati svaku funkcionalnost
   - Kako kreirati test report
   - Diagnostika ako nešto ne radi

### 3. **TEST_HELPER.js** 🔧
   - JavaScript datoteka sa test funkcijama
   - Može se pokreći iz Browser Console-a
   - Generiše random 300 zapisa
   - Validira integritet podataka
   - Simulira delete/add operacije

### 4. **VALIDATE_XML.ps1** ✅
   - PowerShell skriptu za validaciju XML-a
   - Automatski analizira sve TEST_*.xml datoteke
   - Provjeri strukturu, duplikate, sequence brojeve
   - Uspoređuje dvije datoteke
   - Generiše finalni report

---

## 🎯 BRZI START GUIDE

### Korak 1: Pokreni Aplikaciju
```powershell
cd c:\Users\Denis\Desktop\1\project
npm run dev
# Dostupno na: http://localhost:5174
```

### Korak 2: Otvori Aplikaciju
- Browser: `http://localhost:5174`
- Login kao admin (denis.ivic / Gracanica1.)

### Korak 3: Učitaj Test Podatke
- Otvori Browser Console (`F12` → `Console`)
- Kopiraj kod iz `TEST_HELPER.js`
- Pokreni: `TestHelper.runFullTest()`
- Ili korak-po-korak prema `TESTING_INSTRUCTIONS.md`

### Korak 4: Testira Svaku Fazu
Slijedi korake iz `TESTING_INSTRUCTIONS.md`:
1. ✅ Inicijalni export (300 zapisa)
2. ✅ HITNO postavljanje
3. ✅ HITNO resetovanje
4. ✅ Bulk edit invoice brojeva
5. ✅ Brisanje zapisa
6. ✅ Dodavanje zapisa
7. ✅ Pretraga
8. ✅ Paginacija
9. ✅ Refresh (localStorage)
10. ✅ XML validacija

### Korak 5: Generiraj Report
```powershell
cd c:\Users\Denis\Desktop\1\project
powershell -ExecutionPolicy Bypass -File VALIDATE_XML.ps1
```

---

## 🧪 TEST SCENARIO PREGLED

### TEST_001: Initial 300 Records
```
📊 Što se testira:
   - Učitavanje 300 zapisa
   - XML export sa svim podacima
   - Validnost strukture

📁 Očekivana datoteka: TEST_001_initial_300.xml
✅ Trebalo bi: 300 zapisa u XML-u
```

### TEST_002: Bulk HITNO Set
```
📊 Što se testira:
   - Postavi sve zapise kao HITNO
   - Potvrdi u UI-u
   - Export sa HITNO statusom

📁 Očekivana datoteka: TEST_002_all_hitno.xml
✅ Trebalo bi: 300 HITNO zapisa
```

### TEST_003: HITNO Reset
```
📊 Što se testira:
   - Resetuj HITNO status
   - Vrati na početnu vrijednost
   - Export bi trebao biti isti kao TEST_001

📁 Očekivana datoteka: TEST_003_hitno_reset.xml
✅ Trebalo bi: Identičan TEST_001 (300 normalnih zapisa)
```

### TEST_004: Bulk Update Invoice
```
📊 Što se testira:
   - Promijenij sve invoice brojeve
   - External ID regeneracija
   - Bulk payment_basis update

📁 Očekivana datoteka: TEST_004_bulk_changed.xml
✅ Trebalo bi: Svi zapisi sa INV-TEST-2024
```

### TEST_005: Delete Operations
```
📊 Što se testira:
   - Obriši 13 zapisa
   - Ažuriranje sequence brojeva
   - Provjera redoslijeda

📁 Očekivana datoteka: TEST_005_after_delete.xml
✅ Trebalo bi: 287 zapisa (300 - 13)
```

### TEST_006: Add Operations
```
📊 Što se testira:
   - Dodaj 50 novih zapisa
   - Automatic re-sequencing
   - Validnost novih zapisa

📁 Očekivana datoteka: TEST_006_after_add.xml
✅ Trebalo bi: 337 zapisa (287 + 50)
```

### TEST_007-010: Additional Tests
```
📊 Pretraga, paginacija, refresh, validacija
```

---

## 📊 REZULTATI KOJE TREBAM VIDJETI

| Test | Input | Očekivani Rezultat | Kriterij | Status |
|------|-------|------------------|---------|--------|
| 1 | 300 zapisa | 300 u XML | ✅ | PASS/FAIL |
| 2 | HITNO true | Svi HITNO | ✅ | PASS/FAIL |
| 3 | HITNO reset | Kao TEST_1 | ✅ | PASS/FAIL |
| 4 | Bulk update | INV-TEST-2024 | ✅ | PASS/FAIL |
| 5 | Delete 13 | 287 ostaje | ✅ | PASS/FAIL |
| 6 | Add 50 | 337 zapisa | ✅ | PASS/FAIL |
| 7 | Search | 337 rezultata | ✅ | PASS/FAIL |
| 8 | Pagination | 17 stranica | ✅ | PASS/FAIL |
| 9 | Refresh | Svi zapisi | ✅ | PASS/FAIL |
| 10 | XML valid | Dobro formiran | ✅ | PASS/FAIL |

---

## 🔧 TEST HELPER - FUNKCIJE U BROWSER CONSOLE

```javascript
// 1. Generiši 300 random zapisa
TestHelper.generateRandomRecords(300)

// 2. Spremi u localStorage
TestHelper.saveToStorage(records)

// 3. Učitaj iz localStorage
TestHelper.getFromStorage()

// 4. Provjeri broj zapisa
TestHelper.verifyRecordCount()

// 5. Provjeri integritet podataka
TestHelper.checkIntegrity()

// 6. Simuliraj brisanje 10 zapisa
TestHelper.simulateBulkDelete(10)

// 7. Simuliraj dodavanje 50 zapisa
TestHelper.simulateBulkAdd(50)

// 8. Generiraj test report
TestHelper.generateTestReport()

// 9. Pokreni kompletan test
TestHelper.runFullTest()

// 10. Prikaži pomoć
TestHelper.showHelp()
```

---

## 🎬 KAKO KORISTITI TEST HELPER

### Metoda 1: Direktno U Browser-u
```
1. F12 → Console tab
2. Kopiraj i lijepi kompletan TEST_HELPER.js kod
3. Pokreni: TestHelper.runFullTest()
4. Prati output
```

### Metoda 2: File Link (ako je dostupan)
```
1. Ako je TEST_HELPER.js učitan kao <script>, može se koristiti direktno
2. Jer je sadržan u index.html ili kao external file
```

### Metoda 3: Ručno Korak-po-Korak
```javascript
// Korak 1
records = TestHelper.generateRandomRecords(300)

// Korak 2 (osvježi stranicu prije toga)
TestHelper.saveToStorage(records)

// Korak 3 (u aplikaciji, idi na stranicu)
// Trebalo bi vidjeti 300 zapisa

// Korak 4 (test)
TestHelper.verifyRecordCount()
```

---

## ✅ VALIDACIJA REZULTATA

### Koristi PowerShell skriptu:
```powershell
cd c:\Users\Denis\Desktop\1\project
powershell -ExecutionPolicy Bypass -File .\VALIDATE_XML.ps1
```

**Što će se desiti:**
- ✅ Pronađe sve TEST_*.xml datoteke
- ✅ Validira svaku datoteku
- ✅ Broji zapise
- ✅ Provjeri HITNO status
- ✅ Provjeri duplikate
- ✅ Provjeri sequence brojeve
- ✅ Usporedi datoteke
- ✅ Generiše finalni report

---

## 📝 ŠTO TREBAM SPREMI

Nakon testiranja, trebam spremi:

1. **XML datoteke:**
   - TEST_001_initial_300.xml
   - TEST_002_all_hitno.xml
   - TEST_003_hitno_reset.xml
   - TEST_004_bulk_changed.xml
   - TEST_005_after_delete.xml
   - TEST_006_after_add.xml
   - TEST_007... (ako imaš više)

2. **Test Report:**
   - TEST_RESULTS.txt sa rezultatima svake faze

3. **Screenshots (opciono):**
   - Ako naiđeš na greške ili nešto neuobičajeno

4. **Browser Console Output (opciono):**
   - Ako naiđeš na JavaScript greške
   - Copy-paste iz Console-a

---

## 🐛 TROUBLESHOOTING

### "Zapisi se ne učitavaju"
```javascript
// U Console:
JSON.parse(localStorage.getItem('records')).length
// Trebalo bi: 300 (ili više)
```

### "XML se ne exportuje"
- Provjeri: Ima li zapisa u tabeli?
- Pokušaj: Osvježi stranicu (F5)
- Provjeri Console za greške

### "HITNO button ne radi"
- Provjeri: Imaš li zapisa?
- Pokušaj: Osvježi i ponovi

### "Validation script ne radi"
```powershell
# Prvo provjeri datoteke:
dir c:\Users\Denis\Desktop\1\project\TEST_*.xml

# Pokreni skriptu:
powershell -ExecutionPolicy Bypass -File c:\Users\Denis\Desktop\1\project\VALIDATE_XML.ps1
```

---

## 📊 EXPECTED TIMELINE

- **Setup:** 5 minuta (login, header setup)
- **Data Loading:** 5 minuta (300 zapisa)
- **Phase 1-3 (Export + HITNO):** 5 minuta
- **Phase 4-6 (Bulk edit, delete, add):** 10 minuta
- **Phase 7-10 (Search, pagination, validation):** 10 minuta
- **XML Validation:** 5 minuta
- **Report Generation:** 5 minuta

**TOTAL: ~45 minuta**

---

## 🎉 SUCCESS CRITERIA

**Aplikacija je READY AKO:**

✅ 300 zapisa se učita bez greške
✅ XML export radi sa svim podacima
✅ HITNO se može postaviti i resetovati
✅ Bulk edit radi na svim zapisima
✅ Brisanje i dodavanje zapisa radi
✅ Pretraga pronalazi sve zapise
✅ Paginacija je točna
✅ Podaci se čuvaju nakon refresh-a
✅ XML struktura je validna
✅ Nema greške u Console-u

---

## 🚀 POKRENI SADA!

```powershell
# 1. Terminal - pokreni server
cd c:\Users\Denis\Desktop\1\project
npm run dev

# 2. Browser - otvorit će se na http://localhost:5174
# 3. Slijedi TESTING_INSTRUCTIONS.md korak-po-korak
# 4. U meantime, prepasi rezultate sa VALIDATE_XML.ps1
```

---

**Sve datoteke su dostupne u:** `c:\Users\Denis\Desktop\1\project\`

**Aplikacija je pokrenuta na:** `http://localhost:5174`

**Testiranje je spremno! 🧪✨**
