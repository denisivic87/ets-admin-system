const fs = require('fs');
const path = require('path');

function extractTags(block) {
  const tags = {};
  const tagNames = ['id','redni_broj','broj_fakture','iznos','broj_ugovora','hitno','datum_fakture'];
  for (const t of tagNames) {
    const m = block.match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`));
    tags[t] = m ? (m[1] || '').trim() : '';
  }
  return tags;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const zapisi = content.match(/<zapis>[\s\S]*?<\/zapis>/g) || [];
  const total = zapisi.length;
  const records = zapisi.map(extractTags);

  let hitnoCount = 0;
  let missing = 0;
  const ids = [];
  const sequences = [];
  let invalidAmounts = 0;
  let invalidDates = 0;

  records.forEach((r, idx) => {
    if (!r.broj_fakture) missing++;
    if (!r.broj_ugovora) missing++;
    if (!r.iznos) missing++;
    if (r.hitno && r.hitno.toLowerCase() === 'true') hitnoCount++;
    if (r.id) ids.push(r.id);
    if (r.redni_broj) sequences.push(parseInt(r.redni_broj, 10));
    if (r.iznos) {
      const v = parseFloat(r.iznos);
      if (isNaN(v)) invalidAmounts++;
    } else invalidAmounts++;
    if (r.datum_fakture) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(r.datum_fakture)) invalidDates++;
    }
  });

  const uniqueIds = new Set(ids);
  const duplicates = ids.length - uniqueIds.size;

  sequences.sort((a,b)=>a-b);
  let gaps = false;
  for (let i=0;i<sequences.length-1;i++){
    if (sequences[i+1] - sequences[i] !== 1) {gaps = true; break}
  }

  return {
    file: path.basename(filePath),
    total,
    hitno: hitnoCount,
    missingFields: missing,
    duplicates,
    invalidAmounts,
    invalidDates,
    sequenceGaps: gaps
  };
}

(function main(){
  const dir = process.cwd();
  const files = fs.readdirSync(dir).filter(f => /^TEST_.*\.xml$/.test(f));
  if (files.length === 0) {
    console.log('No TEST_*.xml files found in', dir);
    process.exit(1);
  }

  const results = files.map(f => validateFile(path.join(dir,f)));
  console.log('Validation results:');
  results.forEach(r=>{
    console.log(`- ${r.file}: ${r.total} records, HITNO=${r.hitno}, missingFields=${r.missingFields}, duplicates=${r.duplicates}, invalidAmounts=${r.invalidAmounts}, invalidDates=${r.invalidDates}, sequenceGaps=${r.sequenceGaps}`);
  });

  fs.writeFileSync(path.join(dir,'TEST_VALIDATION_RESULTS.json'), JSON.stringify(results,null,2),'utf8');
  console.log('Wrote TEST_VALIDATION_RESULTS.json');
})();
