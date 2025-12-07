# 🚀 DIRECT TEST COMMANDS - Copy & Paste ready!

# Sve komande su spremne za direktan copy-paste u PowerShell

# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 1: POKRENI SERVER
# ════════════════════════════════════════════════════════════════════════════

cd c:\Users\Denis\Desktop\1\project
npm run dev

# ✅ Čeka: "VITE v5.4.8 ready in X ms"
# ✅ Server: http://localhost:5174
# ✅ Ostani sa ovom linijom - server mora biti pokrenut!


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 2: U NOVOM POWERSHELL TERMINAL-U - PROVJERI DATOTEKE
# ════════════════════════════════════════════════════════════════════════════

# Provjeri da su sve test datoteke dostupne:
cd c:\Users\Denis\Desktop\1\project
ls -Name | Select-String "TEST_|CHEATSHEET|README_TESTING"

# Trebalo bi vidjeti:
# CHEATSHEET.md
# README_TESTING.md
# TESTING_INSTRUCTIONS.md
# TESTING_READY.md
# TEST_HELPER.js
# TEST_SCRIPT.md
# VALIDATE_XML.ps1


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 3: NAKON TESTIRANJA - VALIDIRAJ SVE XML DATOTEKE
# ════════════════════════════════════════════════════════════════════════════

# Koristi PowerShell script za automatsku validaciju:
cd c:\Users\Denis\Desktop\1\project
powershell -ExecutionPolicy Bypass -File .\VALIDATE_XML.ps1

# Što će se desiti:
# 1. Pronađe sve TEST_*.xml datoteke
# 2. Validira svaku datoteku
# 3. Broji zapise
# 4. Provjeri HITNO status
# 5. Provjeri duplikate
# 6. Generiše detaljnin report


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 4: PROVJERI BROJ EXPORTOVANIH DATOTEKA
# ════════════════════════════════════════════════════════════════════════════

# Koliko XML datoteka je generirano:
cd c:\Users\Denis\Desktop\1\project
(ls TEST_*.xml 2>$null).Count

# Trebalo bi: 6+ datoteka (TEST_001 do TEST_006 minimum)


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 5: PROVJERI SADRŽAJ PRVO EXPORTOVANE DATOTEKE
# ════════════════════════════════════════════════════════════════════════════

# Koliko zapisa je u TEST_001_initial_300.xml?
[xml]$xml = Get-Content "c:\Users\Denis\Desktop\1\project\TEST_001_initial_300.xml"
$zapisi = $xml.SelectNodes("//zapis")
Write-Host "Broj zapisa u TEST_001: $($zapisi.Count)"
# Trebalo bi: 300


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 6: PROVJERI SVEXML DATOTEKE - BRZI PREGLED
# ════════════════════════════════════════════════════════════════════════════

# Brz pregled svih XML datoteka:
cd c:\Users\Denis\Desktop\1\project
$files = Get-ChildItem TEST_*.xml 2>$null
foreach ($file in $files) {
    [xml]$xml = Get-Content $file.FullName
    $count = $xml.SelectNodes("//zapis").Count
    $hitno = $xml.SelectNodes("//zapis[hitno='true']").Count
    Write-Host "$($file.Name): $count zapisa ($hitno HITNO)"
}

# Trebalo bi vidjeti:
# TEST_001_initial_300.xml: 300 zapisa (0 HITNO)
# TEST_002_all_hitno.xml: 300 zapisa (300 HITNO)
# TEST_003_hitno_reset.xml: 300 zapisa (0 HITNO)
# TEST_004_bulk_changed.xml: 300 zapisa (0 HITNO)
# TEST_005_after_delete.xml: 287 zapisa (0 HITNO)
# TEST_006_after_add.xml: 337 zapisa (0 HITNO)


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 7: USPOREDBI DVIJE DATOTEKE (TEST_001 vs TEST_003)
# ════════════════════════════════════════════════════════════════════════════

# Trebalo bi biti identične (oba trebala biti initial 300):
[xml]$xml1 = Get-Content "TEST_001_initial_300.xml"
[xml]$xml3 = Get-Content "TEST_003_hitno_reset.xml"

$count1 = $xml1.SelectNodes("//zapis").Count
$count3 = $xml3.SelectNodes("//zapis").Count

Write-Host "TEST_001: $count1 zapisa"
Write-Host "TEST_003: $count3 zapisa"
Write-Host "Identične: $($count1 -eq $count3)"

# Trebalo bi: True


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 8: DETALJNNA VALIDACIJA PRVE DATOTEKE
# ════════════════════════════════════════════════════════════════════════════

# Detaljnna provjera strukture XML-a:
[xml]$xml = Get-Content "TEST_001_initial_300.xml"
$zapisi = $xml.SelectNodes("//zapis")

Write-Host "═══════════════════════════════════════"
Write-Host "Detaljnna Validacija XML-a"
Write-Host "═══════════════════════════════════════"
Write-Host ""

# Broj zapisa
Write-Host "Broj zapisa: $($zapisi.Count)"

# Provjeri obavezne fieldove
$missingFields = 0
foreach ($zapis in $zapisi) {
    if (-not $zapis.broj_fakture) { $missingFields++ }
    if (-not $zapis.iznos) { $missingFields++ }
    if (-not $zapis.broj_ugovora) { $missingFields++ }
}
Write-Host "Nedostajući fieldovi: $missingFields"

# Provjeri iznose
$totalAmount = 0
foreach ($zapis in $zapisi) {
    try {
        $totalAmount += [decimal]$zapis.iznos
    } catch {}
}
Write-Host "Ukupan iznos: $totalAmount RSD"

# Provjeri duplikate
$ids = $zapisi.id
$uniqueIds = $ids | Select-Object -Unique
Write-Host "Duplikati: $($ids.Count - $uniqueIds.Count)"

# Rezultat
Write-Host ""
Write-Host "═══════════════════════════════════════"
if ($missingFields -eq 0 -and ($ids.Count -eq $uniqueIds.Count)) {
    Write-Host "✅ XML je VALIDAN"
} else {
    Write-Host "❌ XML ima problema"
}
Write-Host "═══════════════════════════════════════"


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 9: KREIRAJ TEST REPORT - SAMPLE
# ════════════════════════════════════════════════════════════════════════════

# Kreiraj TEST_RESULTS.txt fajl sa rezultatima:
$report = @"
═══════════════════════════════════════════════════════════════
              ✅ APPLICATION TEST RESULTS
═══════════════════════════════════════════════════════════════

TEST DATE: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
TESTER: [Tvoje Ime]

───────────────────────────────────────────────────────────────

✅ PHASE 1: INITIAL LOAD
   Status: [PASS/FAIL]
   Records: 300
   File: TEST_001_initial_300.xml
   Notes: 

✅ PHASE 2: BULK HITNO SET
   Status: [PASS/FAIL]
   All marked: YES/NO
   File: TEST_002_all_hitno.xml
   Notes: 

✅ PHASE 3: HITNO RESET
   Status: [PASS/FAIL]
   Matched Phase 1: YES/NO
   File: TEST_003_hitno_reset.xml
   Notes: 

✅ PHASE 4: BULK UPDATE
   Status: [PASS/FAIL]
   Updated: 300/300
   File: TEST_004_bulk_changed.xml
   Notes: 

✅ PHASE 5: DELETE
   Status: [PASS/FAIL]
   Deleted: 13
   Remaining: 287
   File: TEST_005_after_delete.xml
   Notes: 

✅ PHASE 6: ADD
   Status: [PASS/FAIL]
   Added: 50
   Total: 337
   File: TEST_006_after_add.xml
   Notes: 

✅ PHASE 7: SEARCH
   Status: [PASS/FAIL]
   Results: 337
   Notes: 

✅ PHASE 8: PAGINATION
   Status: [PASS/FAIL]
   Pages: 17
   Notes: 

✅ PHASE 9: REFRESH
   Status: [PASS/FAIL]
   Data Persisted: YES/NO
   Notes: 

✅ PHASE 10: XML VALIDATION
   Status: [PASS/FAIL]
   All Valid: YES/NO
   Notes: 

───────────────────────────────────────────────────────────────

OVERALL RESULT: [PASS/FAIL]

Total Tests: 10
Passed: __/10
Failed: __/10

Recommendation:
[✓] Ready for production
[ ] Needs fixes
[ ] Major issues

═══════════════════════════════════════════════════════════════
"@

$report | Out-File "TEST_RESULTS.txt"
Write-Host "✅ TEST_RESULTS.txt kreiran"


# ════════════════════════════════════════════════════════════════════════════
# 📋 STEP 10: KREIRAJ SUMMARY REPORT
# ════════════════════════════════════════════════════════════════════════════

# Generiši summary od svih XML datoteka:
$files = Get-ChildItem TEST_*.xml 2>$null
$summary = "TEST_SUMMARY.txt`n`n"

$summary += "Datum: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n`n"
$summary += "═══════════════════════════════════════════`n"
$summary += "DATOTEKA               | ZAPISA | HITNO | STATUS`n"
$summary += "═══════════════════════════════════════════`n"

foreach ($file in $files) {
    try {
        [xml]$xml = Get-Content $file.FullName
        $count = $xml.SelectNodes("//zapis").Count
        $hitno = $xml.SelectNodes("//zapis[hitno='true']").Count
        $summary += "$($file.Name.PadRight(23)) | $($count.ToString().PadRight(6)) | $($hitno.ToString().PadRight(5)) | ✅`n"
    } catch {
        $summary += "$($file.Name.PadRight(23)) | ERROR | - | ❌`n"
    }
}

$summary | Out-File "TEST_SUMMARY_AUTO.txt"
Write-Host "✅ TEST_SUMMARY_AUTO.txt kreiran"


# ════════════════════════════════════════════════════════════════════════════
# 📋 EXTRA: PROVJERI KOLIKO JE TREBALO VREMENA ZA EXPORT
# ════════════════════════════════════════════════════════════════════════════

# Veličine datoteka:
cd c:\Users\Denis\Desktop\1\project
$files = Get-ChildItem TEST_*.xml 2>$null
foreach ($file in $files) {
    $size = $file.Length / 1024  # Convert to KB
    Write-Host "$($file.Name): $([Math]::Round($size, 2)) KB"
}


# ════════════════════════════════════════════════════════════════════════════
# 📋 EXTRA: AUTOMATSKI FORMAT SVE XML DATOTEKE (ako trebam)
# ════════════════════════════════════════════════════════════════════════════

# Ako XML datoteke trebale biti lijepo formatovane:
cd c:\Users\Denis\Desktop\1\project
$files = Get-ChildItem TEST_*.xml 2>$null

foreach ($file in $files) {
    [xml]$xml = Get-Content $file.FullName
    $writer = New-Object System.IO.StringWriter
    $xmlWriter = New-Object System.Xml.XmlTextWriter $writer
    $xmlWriter.Formatting = 'Indented'
    $xmlWriter.IndentationLevel = 0
    $xml.WriteContentTo($xmlWriter)
    $xmlWriter.Close()
    
    $writer.ToString() | Out-File $file.FullName -Encoding UTF8
    Write-Host "✅ Formatovana: $($file.Name)"
}


# ════════════════════════════════════════════════════════════════════════════
# 🎉 SVE JE GOTOVO!
# ════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "✅ Testiranje je završeno!"
Write-Host ""
Write-Host "Datoteke su dostupne u:"
Write-Host "  c:\Users\Denis\Desktop\1\project\"
Write-Host ""
Write-Host "Rezultati:"
Write-Host "  • TEST_001 do TEST_006.xml"
Write-Host "  • TEST_RESULTS.txt"
Write-Host "  • TEST_SUMMARY_AUTO.txt"
Write-Host ""
Write-Host "Za detaljnnu analizu, koristi:"
Write-Host "  powershell -ExecutionPolicy Bypass -File VALIDATE_XML.ps1"
Write-Host ""
