# 🚀 QUICK TESTING GUIDE - Aplikacija

Ovdje je detaljno uputstvo kako tesitrati aplikaciju sa 300 random podataka i pratiti sve operacije.

---

## 📋 PRVO: Pripremi Terminal

```powershell
# Ako server nije pokrenut:
cd c:\Users\Denis\Desktop\1\project
npm run dev

# Server će biti dostupan na:
# ✅ http://localhost:5174
```

---

## 🎯 KORAK 1: Otvorite Aplikaciju i Prijavite Se

1. **Otvori preglednik** → `http://localhost:5174`
2. **Klikni na Admin login** 
3. **Unesi credentials:**
   ```
   Username: denis.ivic
   Password: Gracanica1.
   ```
4. **Klikni "Prijavi se kao admin"**

---

## 🎯 KORAK 2: Postavi Header Podatke

1. **Unesi podatke u Header formu:**
   - Poslovni subjekat: `TEST COMPANY Ltd.`
   - JMBG/PIB: `12345678901`
   - Naziv banke: `TEST BANK`
   - Broj računa: `RS12345678901234567890`
   - Valuta: `RSD`

2. **Klikni "Spremi"**

---

## 🎯 KORAK 3: Učitaj Test Podatke (300 zapisa)

### OPCIJA A: Koristi Test Helper (preporučeno)

1. **Otvori Browser Console** (`F12` → `Console` tab)

2. **Kopiraj i prilepi test helper kod:**
   ```javascript
   // Kopiraj kompletan kod iz TEST_HELPER.js
   // ili učitaj datoteku ako je dostupna
   ```

3. **Pokreni generator:**
   ```javascript
   TestHelper.generateRandomRecords(300)
   ```

4. **Spremi u localStorage:**
   ```javascript
   // Rezultat će biti: records = [...]
   TestHelper.saveToStorage(records)
   ```

5. **Osvježi stranicu** (`F5`) da vidiš 300 zapisa

### OPCIJA B: Ručno Dodavanje Zapisa

1. **Koristi "Dodaj zapise" gumb**
2. **Unesi:** `50` zapisa
3. **Ponovi 6 puta** (50×6 = 300)
4. **Ukupno:** 300 zapisa

---

## 🎯 KORAK 4: TEST 1 - INICIJALNI EXPORT

### Što tesitamo?
- ✅ XML export sa 300 zapisa
- ✅ Validnost XML strukture
- ✅ Prisutnost svih polja
- ✅ Ispravnost podataka

### Kako?

1. **Klikni "Izvezi XML"** gumb
2. **Datoteka će se preuzeti:** `zapisi.xml`
3. **Preimenuj u:** `TEST_001_initial_300.xml`
4. **Spremi u:** `c:\Users\Denis\Desktop\1\project\`

### Što provjeriti?

```bash
# U PowerShell-u:
[xml]$xml = Get-Content "TEST_001_initial_300.xml"
$recordCount = $xml.SelectNodes("//zapis").Count
Write-Host "Broj zapisa: $recordCount"
# Trebao bi: 300
```

---

## 🎯 KORAK 5: TEST 2 - GRUPNO EDITOVANJE (HITNO)

### Što tesitamo?
- ✅ Postavi sve zapise kao HITNO
- ✅ XML export sa HITNO statusom
- ✅ Resetovanje HITNO statusa

### Kako?

1. **Klikni "Grupno menjanje"** gumb
2. **Oznaći:** "Postavi sve zapise kao HITNO"
3. **Klikni:** "Primeni izmene"
4. **Čekaj** završetak operacije

### Provjera:

1. **Otvori prvu stranicu tabele**
2. **Provjeri** da svi zapisi imaju "✅" (HITNO)
3. **Klikni "Izvezi XML"**
4. **Preimenuj u:** `TEST_002_all_hitno.xml`

```bash
# Provjeri XML:
[xml]$xml = Get-Content "TEST_002_all_hitno.xml"
$hitnoCount = $xml.SelectNodes("//zapis[hitno='true']").Count
Write-Host "HITNO zapisi: $hitnoCount / 300"
# Trebao bi: 300
```

---

## 🎯 KORAK 6: TEST 3 - RESETOVANJE HITNO

### Što tesitamo?
- ✅ Resetuj HITNO status
- ✅ Svi zapisi se vrate na normalnu vrijednost

### Kako?

1. **Klikni "Grupno menjanje"**
2. **Oznaći:** "Vrati HITNO na početnu vrijednost"
3. **Klikni:** "Primeni izmene"
4. **Čekaj** završetak

### Provjera:

1. **Pregled tabele** → svi zapisi bez "✅"
2. **Izvezi XML**
3. **Preimenuj u:** `TEST_003_hitno_reset.xml`

```bash
# Provjera - trebao bi biti isti kao TEST_001:
$file1 = Get-Content "TEST_001_initial_300.xml" -Raw
$file3 = Get-Content "TEST_003_hitno_reset.xml" -Raw
$file1 -eq $file3  # Trebao bi: True
```

---

## 🎯 KORAK 7: TEST 4 - GRUPNA IZMJENA Invoice BROJEVA

### Što tesitamo?
- ✅ Sve zapise promijenij invoice broj
- ✅ External ID regeneracija

### Kako?

1. **Klikni "Grupno menjanje"**
2. **Unesi:**
   - Broj fakture: `INV-TEST-2024`
   - Osnov plaćanja: `Testna plaćanja`
3. **Klikni:** "Primeni izmene"

### Provjera:

1. **Pregled zapisa** → svi imaju `INV-TEST-2024`
2. **Izvezi XML**
3. **Preimenuj u:** `TEST_004_bulk_changed.xml`

```bash
# Provjeri da su svi invoice brojevi ažurirani:
[xml]$xml = Get-Content "TEST_004_bulk_changed.xml"
$changed = $xml.SelectNodes("//zapis[broj_fakture='INV-TEST-2024']").Count
Write-Host "Ažurirani zapisi: $changed / 300"
# Trebao bi: 300
```

---

## 🎯 KORAK 8: TEST 5 - BRISANJE ZAPISA

### Što tesitamo?
- ✅ Pravilnost brisanja
- ✅ Ažuriranje sequence brojeva

### Kako?

1. **Idi na stranicu 1**
2. **Obriši zapise:** 1, 5, 10 (3 zapisa)
3. **Idi na stranicu 3**
4. **Obriši zapise:** 40-50 (10 zapisa)
5. **Ukupno obrisano:** 13 zapisa

### Provjera:

1. **Broj zapisa u tabeli:** trebalo bi 287 (300-13)
2. **Kontrola sequence:** brojevi trebaju biti neprekidni (1-287)
3. **Izvezi XML**
4. **Preimenuj u:** `TEST_005_after_delete.xml`

```bash
# Provjera:
[xml]$xml = Get-Content "TEST_005_after_delete.xml"
$count = $xml.SelectNodes("//zapis").Count
Write-Host "Zapisi nakon brisanja: $count"
# Trebao bi: 287
```

---

## 🎯 KORAK 9: TEST 6 - DODAVANJE ZAPISA

### Što tesitamo?
- ✅ Dodavanje novih zapisa
- ✅ Pravilnost sequence brojeva
- ✅ Automatic renumeriranje

### Kako?

1. **Koristi "Dodaj zapise"**
2. **Unesi:** `50` zapisa
3. **Klikni "Dodaj"**
4. **Čekaj** učitavanje (trebalo bi biti 287 + 50 = 337)

### Provjera:

1. **Broj zapisa:** trebalo bi 337
2. **Idi na zadnju stranicu** → trebalo bi zapisi 321-337
3. **Izvezi XML**
4. **Preimenuj u:** `TEST_006_after_add.xml`

```bash
# Provjera:
[xml]$xml = Get-Content "TEST_006_after_add.xml"
$count = $xml.SelectNodes("//zapis").Count
Write-Host "Zapisi nakon dodavanja: $count"
# Trebao bi: 337
```

---

## 🎯 KORAK 10: TEST 7 - PRETRAGA

### Što tesitamo?
- ✅ Pretraga po invoice broju
- ✅ Pretraga po contract broju
- ✅ Brisanje pretrage

### Kako?

1. **Koristi Search bar**
2. **Pretraži:** `INV-TEST-2024`
   - Trebalo bi: 337 rezultata
3. **Obriši pretragu** → sve zapise treba vidjeti

---

## 🎯 KORAK 11: TEST 8 - PAGINACIJA

### Što tesitamo?
- ✅ Navigacija kroz stranice
- ✅ Ispravnost broja zapisa po stranici

### Kako?

1. **Provjeri:** 17-18 stranica (337 ÷ 20 = 16.85)
2. **Idi na stranicu 1** → vidiš zapise 1-20
3. **Idi na stranicu 17** → vidiš zadnje zapise
4. **Idi na stranicu 10** → vidiš zapise 181-200

---

## 🎯 KORAK 12: TEST 9 - REFRESH (SKLADIŠTENJE)

### Što tesitamo?
- ✅ Podaci se čuvaju u localStorage
- ✅ Podaci se vraćaju nakon refresh-a
- ✅ Bez gubitka podataka

### Kako?

1. **Promijeni jednom zapisu** redoslijed ili iznos
2. **Pritisni F5** (refresh stranicu)
3. **Provjeri** da su svi zapisi i dalje tu (337 zapisa)
4. **Provjeri** da je promjena sprema

---

## 🎯 KORAK 13: TEST 10 - XML VALIDACIJA

### Što tesitamo?
- ✅ XML struktura ispravna
- ✅ Svi required fieldovi prisutni
- ✅ Nema korupcije podataka

### Kako?

```bash
# Validacija XML-a:
$xmlPath = "TEST_006_after_add.xml"
$xml = [xml](Get-Content $xmlPath)

# Provjeri jesu li svi zapisi validni
$zapisi = $xml.SelectNodes("//zapis")
Write-Host "Ukupno zapisa: $($zapisi.Count)"

# Provjeri random zapis:
$randomZapis = $zapisi[10]
Write-Host "Zapis #10:"
Write-Host "  ID: $($randomZapis.id)"
Write-Host "  Invoice: $($randomZapis.broj_fakture)"
Write-Host "  Iznos: $($randomZapis.iznos)"
```

---

## 📊 REZULTATI - Kreiraj Test Report

Kreiraj file `TEST_RESULTS.txt`:

```
═══════════════════════════════════════════════════════════════
              ✅ APPLICATION TEST RESULTS
═══════════════════════════════════════════════════════════════

TEST DATE: 2024-12-06
TESTER: [Tvoje ime]
APPLICATION VERSION: 1.0.0

───────────────────────────────────────────────────────────────
TEST PHASES RESULTS:
───────────────────────────────────────────────────────────────

✅ PHASE 1: INITIAL LOAD (300 Records)
   Status: PASS / FAIL
   Records: 300
   Export: TEST_001_initial_300.xml
   Notes: 

✅ PHASE 2: BULK HITNO SET
   Status: PASS / FAIL
   All marked: YES/NO
   Export: TEST_002_all_hitno.xml
   Notes: 

✅ PHASE 3: HITNO RESET
   Status: PASS / FAIL
   All reset: YES/NO
   Export: TEST_003_hitno_reset.xml
   Notes: 

✅ PHASE 4: BULK INVOICE UPDATE
   Status: PASS / FAIL
   Updated: 300/300
   Export: TEST_004_bulk_changed.xml
   Notes: 

✅ PHASE 5: BULK DELETE
   Status: PASS / FAIL
   Deleted: 13 records
   Remaining: 287
   Export: TEST_005_after_delete.xml
   Notes: 

✅ PHASE 6: BULK ADD
   Status: PASS / FAIL
   Added: 50 records
   Total: 337
   Export: TEST_006_after_add.xml
   Notes: 

✅ PHASE 7: SEARCH TEST
   Status: PASS / FAIL
   Found: 337 records
   Notes: 

✅ PHASE 8: PAGINATION TEST
   Status: PASS / FAIL
   Pages: 17
   Notes: 

✅ PHASE 9: REFRESH TEST
   Status: PASS / FAIL
   Data persisted: YES/NO
   Records after refresh: 337
   Notes: 

✅ PHASE 10: XML VALIDATION
   Status: PASS / FAIL
   All required fields: YES/NO
   No corruption: YES/NO
   Notes: 

───────────────────────────────────────────────────────────────
PERFORMANCE METRICS:
───────────────────────────────────────────────────────────────

Initial Load Time: ___ seconds
Bulk Edit Time: ___ seconds
XML Export Time: ___ seconds
Delete Operations: ___ seconds
Add Operations: ___ seconds
Search Response: ___ seconds

───────────────────────────────────────────────────────────────
ISSUES FOUND:
───────────────────────────────────────────────────────────────

[ ] No issues
[ ] Minor issues (list below)
[ ] Critical issues (list below)

Issues:
1. 
2. 
3. 

───────────────────────────────────────────────────────────────
OVERALL RESULT: PASS / FAIL
───────────────────────────────────────────────────────────────

Total Tests: 10
Passed: __/10
Failed: __/10

Recommendation:
[ ] Application ready for production
[ ] Needs minor fixes
[ ] Needs major fixes

═══════════════════════════════════════════════════════════════
```

---

## 🔍 DIAGNOSTIKA - Ako nešto ne radi

### Problem: "Zapisi se ne učitavaju"
```javascript
// U Console:
localStorage.getItem('records')  // Trebalo bi vidjeti 300 zapisa
localStorage.getItem('prefill_enabled')
localStorage.getItem('header')
```

### Problem: "XML se ne exportuje"
1. Provjeri ima li zapisa: trebalo bi 300+
2. Klikni "Izvezi XML" ponovno
3. Provjerim Console za greške (`F12`)

### Problem: "Brisanje ne radi"
1. Osvježi stranicu (`F5`)
2. Pokušaj ponovno
3. Ako ne radi, kontaktiraj developera

### Problem: "Sequence brojevi nisu redoslijedi"
```javascript
// U Console:
const records = JSON.parse(localStorage.getItem('records'))
records.map(r => r.sequence_number).sort((a,b) => a-b)
// Trebalo bi: [1, 2, 3, ... 337]
```

---

## ✅ SUCCESS CHECKLIST

- [ ] 300 zapisa učitano
- [ ] XML export radi sa svim podacima
- [ ] HITNO se može postaviti i resetovati
- [ ] Brisanje zapisa radi ispravno
- [ ] Dodavanje zapisa radi ispravno
- [ ] Pretraga nalazi sve zapise
- [ ] Paginacija prikazuje točne broeve
- [ ] Podaci se čuvaju nakon refresh-a
- [ ] XML struktura je validna
- [ ] Nema greške u Console-u

---

## 🎉 KADA SI GOTOV

1. **Spremi sve TEST_*.xml datoteke** u: `c:\Users\Denis\Desktop\1\project\`
2. **Spremi TEST_RESULTS.txt** sa rezultatima
3. **Praslinaj sreenshots** ako naiđeš na probleme
4. **Prosljeđi rezultate** za analizu

---

**Aplikacija je na:** http://localhost:5174
**Očekivano vrijeme testiranja:** ~30-45 minuta
**Good luck! 🚀**
