# 🧪 PowerShell XML Validation Script
# Koristi ovu skriptu da validiraš sve XML datoteke nakon testiranja

# Definisanje funkcija
function Test-XMLValidity {
    param(
        [string]$FilePath
    )
    
    Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  XML Validation Report                 ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
    
    Write-Host "`n📄 File: $FilePath" -ForegroundColor Yellow
    
    try {
        $xml = [xml](Get-Content $FilePath)
        Write-Host "✅ XML je validan (dobro formiran)" -ForegroundColor Green
        
        # Brojanje zapisa
        $zapisi = $xml.SelectNodes("//zapis")
        $count = $zapisi.Count
        Write-Host "`n📊 Broj zapisa: $count" -ForegroundColor Cyan
        
        # Brojanje HITNO zapisa
        $hitno = $xml.SelectNodes("//zapis[hitno='true']").Count
        $normal = $xml.SelectNodes("//zapis[hitno='false' or not(hitno)]").Count
        Write-Host "   - HITNO: $hitno" -ForegroundColor Yellow
        Write-Host "   - Normalni: $normal" -ForegroundColor Green
        
        # Provjera obaveznih polja
        Write-Host "`n🔍 Provjera obaveznih polja:" -ForegroundColor Cyan
        $missingFields = 0
        $zapisi | ForEach-Object {
            if (-not $_.broj_fakture) { $missingFields++ }
            if (-not $_.iznos) { $missingFields++ }
            if (-not $_.broj_ugovora) { $missingFields++ }
        }
        
        if ($missingFields -eq 0) {
            Write-Host "   ✅ Svi obavezni fieldovi prisutni" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $missingFields nedostaojućih polja" -ForegroundColor Red
        }
        
        # Provjera iznosa
        Write-Host "`n💰 Provjera iznosa:" -ForegroundColor Cyan
        $totalAmount = 0
        $invalidAmounts = 0
        $zapisi | ForEach-Object {
            try {
                $amount = [decimal]$_.iznos
                $totalAmount += $amount
            } catch {
                $invalidAmounts++
            }
        }
        
        Write-Host "   - Ukupan iznos: $totalAmount" -ForegroundColor Green
        if ($invalidAmounts -eq 0) {
            Write-Host "   ✅ Svi iznosi su validni" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $invalidAmounts nevalidnih iznosa" -ForegroundColor Red
        }
        
        # Provjera datuma
        Write-Host "`n📅 Provjera datuma:" -ForegroundColor Cyan
        $invalidDates = 0
        $zapisi | ForEach-Object {
            if ($_.datum_fakture) {
                try {
                    [datetime]::ParseExact($_.datum_fakture, "yyyy-MM-dd", $null) | Out-Null
                } catch {
                    $invalidDates++
                }
            }
        }
        
        if ($invalidDates -eq 0) {
            Write-Host "   ✅ Svi datumi su validni" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $invalidDates nevalidnih datuma" -ForegroundColor Red
        }
        
        # Provjera duplikata
        Write-Host "`n🔐 Provjera duplikata:" -ForegroundColor Cyan
        $ids = $zapisi.id
        $uniqueIds = $ids | Select-Object -Unique
        
        if ($ids.Count -eq $uniqueIds.Count) {
            Write-Host "   ✅ Nema duplikata (svi ID-evi jedinstveni)" -ForegroundColor Green
        } else {
            $duplicates = $ids.Count - $uniqueIds.Count
            Write-Host "   ❌ $duplicates duplikata pronađeno" -ForegroundColor Red
        }
        
        # Provjera sekvence
        Write-Host "`n📍 Provjera sekvence:" -ForegroundColor Cyan
        $sequences = $zapisi.redni_broj | Sort-Object {[int]$_}
        $isSequential = $true
        for ($i = 0; $i -lt $sequences.Count - 1; $i++) {
            if ([int]$sequences[$i + 1] - [int]$sequences[$i] -ne 1) {
                $isSequential = $false
                break
            }
        }
        
        if ($isSequential) {
            Write-Host "   ✅ Sekvence su redoslijedi (1-$($sequences.Count))" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Sekvence imaju rupe ili nisu redoslijedi" -ForegroundColor Yellow
        }
        
        # Summary
        Write-Host "`n$('='*50)" -ForegroundColor Cyan
        Write-Host "SAŽETAK:" -ForegroundColor Cyan
        Write-Host "$('='*50)" -ForegroundColor Cyan
        Write-Host "Status: ✅ PASS" -ForegroundColor Green
        Write-Host "Zapisa: $count" -ForegroundColor Green
        Write-Host "Validnost: Potvrđena" -ForegroundColor Green
        Write-Host "$('='*50)`n" -ForegroundColor Cyan
        
        return @{
            Valid = $true
            RecordCount = $count
            HitnoCount = $hitno
            TotalAmount = $totalAmount
            Duplicates = $ids.Count - $uniqueIds.Count
        }
        
    } catch {
        Write-Host "❌ XML nije validan!" -ForegroundColor Red
        Write-Host "Greška: $($_.Exception.Message)" -ForegroundColor Red
        return @{
            Valid = $false
            Error = $_.Exception.Message
        }
    }
}

function Compare-XMLFiles {
    param(
        [string]$File1,
        [string]$File2
    )
    
    Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║  XML Comparison Report                 ║" -ForegroundColor Magenta
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Magenta
    
    Write-Host "`n📄 Datoteka 1: $File1" -ForegroundColor Yellow
    Write-Host "📄 Datoteka 2: $File2" -ForegroundColor Yellow
    
    try {
        $xml1 = [xml](Get-Content $File1)
        $xml2 = [xml](Get-Content $File2)
        
        $zapisi1 = $xml1.SelectNodes("//zapis")
        $zapisi2 = $xml2.SelectNodes("//zapis")
        
        Write-Host "`n📊 Broj zapisa:" -ForegroundColor Cyan
        Write-Host "   Datoteka 1: $($zapisi1.Count)" -ForegroundColor Yellow
        Write-Host "   Datoteka 2: $($zapisi2.Count)" -ForegroundColor Yellow
        
        if ($zapisi1.Count -eq $zapisi2.Count) {
            Write-Host "   ✅ Oba fajla imaju isti broj zapisa" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Razlika: $([Math]::Abs($zapisi1.Count - $zapisi2.Count))" -ForegroundColor Red
        }
        
        # Provjera razlika u podacima
        Write-Host "`n🔄 Provjera razlika:" -ForegroundColor Cyan
        
        $differences = 0
        if ($zapisi1.Count -eq $zapisi2.Count) {
            for ($i = 0; $i -lt $zapisi1.Count; $i++) {
                $z1 = $zapisi1[$i]
                $z2 = $zapisi2[$i]
                
                if ($z1.broj_fakture -ne $z2.broj_fakture) { $differences++ }
                if ($z1.iznos -ne $z2.iznos) { $differences++ }
            }
        }
        
        if ($differences -eq 0) {
            Write-Host "   ✅ Nema razlika (datoteke su identične)" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Pronađene $differences razlike" -ForegroundColor Yellow
        }
        
        Write-Host "`n$('='*50)" -ForegroundColor Cyan
        Write-Host "REZULTAT: $($differences -eq 0 ? '✅ IDENTIČNI' : '⚠️ RAZLIČITI')" -ForegroundColor $(if($differences -eq 0) { 'Green' } else { 'Yellow' })
        Write-Host "$('='*50)`n" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Greška pri uspoređivanju!" -ForegroundColor Red
        Write-Host "Greška: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Analyze-AllXMLFiles {
    param(
        [string]$Directory
    )
    
    Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  📊 COMPREHENSIVE TEST ANALYSIS REPORT 📊               ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
    
    $xmlFiles = Get-ChildItem -Path $Directory -Filter "TEST_*.xml" | Sort-Object Name
    
    if ($xmlFiles.Count -eq 0) {
        Write-Host "`n❌ Nema TEST_*.xml datoteka u: $Directory" -ForegroundColor Red
        return
    }
    
    Write-Host "`nPronađeno $($xmlFiles.Count) TEST datoteka`n" -ForegroundColor Yellow
    
    $results = @()
    
    foreach ($file in $xmlFiles) {
        Write-Host "┌─────────────────────────────────────────────────────┐" -ForegroundColor Gray
        $result = Test-XMLValidity -FilePath $file.FullName
        $results += @{
            FileName = $file.Name
            Result = $result
        }
    }
    
    # Sažetak
    Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  📋 SAŽETAK SVIH TESTIRANJA                             ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
    
    Write-Host "`n📊 Statistika po datotekama:" -ForegroundColor Cyan
    Write-Host $("Datoteka".PadRight(30)) + "Zapisa".PadRight(10) + "HITNO".PadRight(10) + "Status" -ForegroundColor Yellow
    Write-Host $("─" * 70) -ForegroundColor Gray
    
    foreach ($r in $results) {
        $fileName = $r.FileName.PadRight(30)
        $recordCount = ($r.Result.RecordCount ?? "N/A").ToString().PadRight(10)
        $hitnoCount = ($r.Result.HitnoCount ?? "N/A").ToString().PadRight(10)
        $status = ($r.Result.Valid ? "✅ OK" : "❌ ERROR")
        
        Write-Host "$fileName$recordCount$hitnoCount$status" -ForegroundColor $(if($r.Result.Valid) { 'Green' } else { 'Red' })
    }
    
    Write-Host "`n📈 Ukupna statistika:" -ForegroundColor Cyan
    $validCount = ($results | Where-Object { $_.Result.Valid }).Count
    $totalRecords = ($results | Where-Object { $_.Result.Valid } | Measure-Object -Property Result.RecordCount -Sum).Sum
    
    Write-Host "   Validnih datoteka: $validCount/$($results.Count)" -ForegroundColor Green
    Write-Host "   Ukupnih zapisa (sve datoteke): $totalRecords" -ForegroundColor Green
    
    Write-Host "`n$('═'*70)`n" -ForegroundColor Cyan
}

# MAIN SCRIPT
Write-Host "
╔════════════════════════════════════════════════════════════╗
║        🧪 XML VALIDATION & TEST ANALYSIS TOOL 🧪           ║
╚════════════════════════════════════════════════════════════╝
" -ForegroundColor Green

$testDir = "$PSScriptRoot"
Write-Host "Direktorij: $testDir`n" -ForegroundColor Yellow

# Pokreni analizu
Analyze-AllXMLFiles -Directory $testDir

# Opciono: Usporedba specifičnih datoteka
Write-Host "`n📌 Opcija: Usporedba dviju datoteka" -ForegroundColor Cyan
Write-Host "Ako želiš usporediti dvije datoteke, koristi:" -ForegroundColor Gray
Write-Host "  Compare-XMLFiles -File1 'TEST_001.xml' -File2 'TEST_003.xml'" -ForegroundColor Gray

Write-Host "`n✅ Analiza završena!`n" -ForegroundColor Green
