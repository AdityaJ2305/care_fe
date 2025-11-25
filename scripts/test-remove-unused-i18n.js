/**
 * Tests for remove-unused-i18n.js script
 * 
 * This test file verifies that dynamic prefix detection works correctly
 * for various patterns including encounter_status__ and product_knowledge_type__
 */

const { extractUsedKeys, cleanLocaleFiles } = require('./remove-unused-i18n.js');
const fs = require('fs');
const path = require('path');

/**
 * Test helper to create temporary test environment
 */
function setupTestEnv() {
  const testDir = '/tmp/test-i18n-src';
  const testLocaleDir = '/tmp/test-i18n-locale';
  
  // Clean up and create directories
  if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
  if (fs.existsSync(testLocaleDir)) fs.rmSync(testLocaleDir, { recursive: true });
  fs.mkdirSync(testDir, { recursive: true });
  fs.mkdirSync(testLocaleDir, { recursive: true });
  
  return { testDir, testLocaleDir };
}

/**
 * Test 1: Verify encounter_status__ and product_knowledge_type__ are both detected
 */
async function testDynamicPrefixDetection() {
  console.log("\n🧪 Test 1: Dynamic Prefix Detection");
  console.log("=" .repeat(60));
  
  const { testDir, testLocaleDir } = setupTestEnv();
  
  // Create test source file with both patterns
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
  
  const { usedKeys, dynamicPrefixes } = await extractUsedKeys(testDir, ['tsx']);
  
  const hasEncounterStatus = dynamicPrefixes.has("encounter_status__");
  const hasProductKnowledgeType = dynamicPrefixes.has("product_knowledge_type__");
  
  console.log(`encounter_status__ detected: ${hasEncounterStatus ? '✅' : '❌'}`);
  console.log(`product_knowledge_type__ detected: ${hasProductKnowledgeType ? '✅' : '❌'}`);
  
  if (!hasEncounterStatus || !hasProductKnowledgeType) {
    console.error("❌ Test FAILED: One or both prefixes not detected");
    return false;
  }
  
  console.log("✅ Test PASSED: Both prefixes detected correctly");
  return true;
}

/**
 * Test 2: Verify keys with detected prefixes are preserved during cleanup
 */
async function testPrefixKeyPreservation() {
  console.log("\n🧪 Test 2: Prefix Key Preservation");
  console.log("=".repeat(60));
  
  const { testDir, testLocaleDir } = setupTestEnv();
  
  // Create test source file
  fs.writeFileSync(path.join(testDir, 'test.tsx'), `
import { useTranslation } from 'react-i18next';

export const Test = () => {
  const { t } = useTranslation();
  return (
    <>
      {t(\`encounter_status__\${status}\`)}
      {t(\`product_knowledge_type__\${type}\`)}
    </>
  );
};
  `);
  
  // Create test locale file
  const testLocale = {
    "encounter_status__planned": "Planned",
    "encounter_status__completed": "Completed",
    "encounter_status__in_progress": "In Progress",
    "product_knowledge_type__medication": "Medication",
    "product_knowledge_type__consumable": "Consumable",
    "product_knowledge_type__nutritional_product": "Nutritional Product",
    "unused_key": "This should be removed",
    "another_unused_key": "This too"
  };
  
  fs.writeFileSync(
    path.join(testLocaleDir, 'en.json'),
    JSON.stringify(testLocale, null, 2)
  );
  
  // Extract and clean
  const { usedKeys, dynamicPrefixes } = await extractUsedKeys(testDir, ['tsx']);
  cleanLocaleFiles(testLocaleDir, usedKeys, dynamicPrefixes);
  
  // Verify results
  const cleaned = JSON.parse(fs.readFileSync(path.join(testLocaleDir, 'en.json'), 'utf-8'));
  
  const encounterKeysPreserved = Object.keys(cleaned).filter(k => k.startsWith('encounter_status__')).length === 3;
  const productKeysPreserved = Object.keys(cleaned).filter(k => k.startsWith('product_knowledge_type__')).length === 3;
  const unusedKeysRemoved = !cleaned.hasOwnProperty('unused_key') && !cleaned.hasOwnProperty('another_unused_key');
  
  console.log(`encounter_status__ keys preserved (3): ${encounterKeysPreserved ? '✅' : '❌'}`);
  console.log(`product_knowledge_type__ keys preserved (3): ${productKeysPreserved ? '✅' : '❌'}`);
  console.log(`Unused keys removed: ${unusedKeysRemoved ? '✅' : '❌'}`);
  
  if (!encounterKeysPreserved || !productKeysPreserved || !unusedKeysRemoved) {
    console.error("❌ Test FAILED: Key preservation incorrect");
    return false;
  }
  
  console.log("✅ Test PASSED: Keys preserved correctly");
  return true;
}

/**
 * Test 3: Verify multiline t() calls work correctly
 */
async function testMultilineCalls() {
  console.log("\n🧪 Test 3: Multiline t() Calls");
  console.log("=".repeat(60));
  
  const { testDir, testLocaleDir } = setupTestEnv();
  
  // Create test with multiline calls (like in ProductView.tsx)
  fs.writeFileSync(path.join(testDir, 'test.tsx'), `
import { useTranslation } from 'react-i18next';

export const Test = () => {
  const { t } = useTranslation();
  return (
    <div>
      {t(
        \`product_knowledge_type__\${product.product_knowledge.product_type}\`,
      )}
    </div>
  );
};
  `);
  
  const { usedKeys, dynamicPrefixes } = await extractUsedKeys(testDir, ['tsx']);
  
  const hasPrefix = dynamicPrefixes.has("product_knowledge_type__");
  console.log(`Multiline product_knowledge_type__ detected: ${hasPrefix ? '✅' : '❌'}`);
  
  if (!hasPrefix) {
    console.error("❌ Test FAILED: Multiline call not detected");
    return false;
  }
  
  console.log("✅ Test PASSED: Multiline calls work correctly");
  return true;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 Testing remove-unused-i18n.js");
  console.log("=".repeat(60));
  
  const results = [];
  
  results.push(await testDynamicPrefixDetection());
  results.push(await testPrefixKeyPreservation());
  results.push(await testMultilineCalls());
  
  console.log("\n" + "=".repeat(60));
  const allPassed = results.every(r => r);
  if (allPassed) {
    console.log("✅ ALL TESTS PASSED");
  } else {
    console.log("❌ SOME TESTS FAILED");
    process.exit(1);
  }
  console.log("=".repeat(60) + "\n");
}

// Run tests when executed directly
if (require.main === module) {
  runTests().catch((err) => {
    console.error("❌ Test execution failed:", err);
    process.exit(1);
  });
}

module.exports = { runTests };
