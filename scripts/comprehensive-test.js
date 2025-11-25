const { extractUsedKeys, cleanLocaleFiles } = require('./remove-unused-i18n.js');
const fs = require('fs');
const path = require('path');

async function test() {
  // Create test source files
  const testDir = '/tmp/test-src-comprehensive';
  const testLocaleDir = '/tmp/test-locale-comprehensive';
  
  // Clean up and create directories
  if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
  if (fs.existsSync(testLocaleDir)) fs.rmSync(testLocaleDir, { recursive: true });
  fs.mkdirSync(testDir, { recursive: true });
  fs.mkdirSync(testLocaleDir, { recursive: true });
  
  // Create test source file
  fs.writeFileSync(path.join(testDir, 'test.tsx'), `
import { useTranslation } from 'react-i18next';

export const TestComponent = () => {
  const { t } = useTranslation();
  const status = "planned";
  const type = "medication";
  
  return (
    <div>
      {t(\`encounter_status__\${status}\`)}
      {t(\`product_knowledge_type__\${type}\`)}
    </div>
  );
};
  `);
  
  // Create test locale file with keys
  const testLocale = {
    "encounter_status__planned": "Planned",
    "encounter_status__completed": "Completed",
    "encounter_status__cancelled": "Cancelled",
    "product_knowledge_type__medication": "Medication",
    "product_knowledge_type__consumable": "Consumable",
    "product_knowledge_type__nutritional_product": "Nutritional Product",
    "unused_key": "This should be removed",
    "another_unused": "This too"
  };
  
  fs.writeFileSync(
    path.join(testLocaleDir, 'en.json'),
    JSON.stringify(testLocale, null, 2)
  );
  
  // Extract used keys
  console.log("�� Extracting keys from test source...");
  const { usedKeys, dynamicPrefixes } = await extractUsedKeys(testDir, ['tsx']);
  
  console.log("\n📊 Dynamic Prefixes:");
  Array.from(dynamicPrefixes).forEach(p => console.log("  -", p));
  
  console.log("\n✅ Used Keys:");
  Array.from(usedKeys).forEach(k => console.log("  -", k));
  
  // Clean locale files
  console.log("\n🧹 Cleaning locale files...");
  cleanLocaleFiles(testLocaleDir, usedKeys, dynamicPrefixes);
  
  // Check what remains
  const cleaned = JSON.parse(fs.readFileSync(path.join(testLocaleDir, 'en.json'), 'utf-8'));
  
  console.log("\n📋 Remaining keys after cleanup:");
  Object.keys(cleaned).sort().forEach(k => console.log("  -", k));
  
  // Verify
  console.log("\n✅ Verification:");
  console.log("  encounter_status__ keys preserved:", Object.keys(cleaned).filter(k => k.startsWith('encounter_status__')).length > 0);
  console.log("  product_knowledge_type__ keys preserved:", Object.keys(cleaned).filter(k => k.startsWith('product_knowledge_type__')).length > 0);
  console.log("  unused_key removed:", !cleaned.hasOwnProperty('unused_key'));
  console.log("  another_unused removed:", !cleaned.hasOwnProperty('another_unused'));
}

test().catch(console.error);
