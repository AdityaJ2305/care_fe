const { extractUsedKeys } = require('./remove-unused-i18n.js');

async function main() {
  const src = "./src";
  const extensions = ["ts", "tsx"];

  console.log("🔍 Scanning codebase for i18n keys...");
  const { usedKeys, dynamicPrefixes } = await extractUsedKeys(src, extensions);

  console.log("\n📊 Dynamic Prefixes Found:");
  const prefixesArray = Array.from(dynamicPrefixes).sort();
  prefixesArray.forEach(prefix => {
    console.log("  -", prefix);
  });

  console.log("\n🔍 Checking specific prefixes:");
  console.log("  encounter_status__ found:", dynamicPrefixes.has("encounter_status__"));
  console.log("  product_knowledge_type__ found:", dynamicPrefixes.has("product_knowledge_type__"));
}

main().catch((err) => console.error("❌ Script failed:", err));
