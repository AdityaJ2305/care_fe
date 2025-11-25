# i18n Key Cleanup Script

## Overview

The `remove-unused-i18n.js` script automatically detects and removes unused translation keys from locale files while preserving dynamically-referenced keys.

## How It Works

The script uses AST (Abstract Syntax Tree) parsing via Babel to analyze the codebase and identify all i18n key usage patterns:

### Static Keys
```typescript
t("welcome_message")  // ✅ Detects "welcome_message"
```

### Dynamic Keys with Prefixes  
```typescript
// ✅ Detects "encounter_status__" as a dynamic prefix
{t(`encounter_status__${status}`)}

// ✅ Detects "product_knowledge_type__" as a dynamic prefix  
{t(`product_knowledge_type__${type}`)}
```

**All keys starting with detected prefixes are preserved**, regardless of the specific suffix values.

### Plural Keys
```typescript
// ✅ Detects "item" and also preserves "item_one" and "item_other"
t("item", { count: 5 })
```

### Trans Components
```tsx
// ✅ Detects "greeting"
<Trans i18nKey="greeting">Hello</Trans>
```

## Running the Script

### Cleanup Locale Files
```bash
node scripts/remove-unused-i18n.js
```

### Run Tests
```bash
npm run test:i18n
```

## How Dynamic Prefix Detection Works

When the script encounters a template literal like `` t(`prefix__${variable}`) ``:

1. **AST Parsing**: Parses the code into an Abstract Syntax Tree
2. **Template Literal Detection**: Identifies TemplateLiteral nodes with expressions
3. **Prefix Extraction**: Extracts the text before the first `${}` as the prefix
4. **Key Preservation**: During cleanup, ALL locale keys starting with the prefix are kept

### Example

Source code:
```typescript
Object.values(ProductKnowledgeType).map((type) => (
  <SelectItem key={type} value={type}>
    {t(`product_knowledge_type__${type}`)}
  </SelectItem>
))
```

Detected prefix: `product_knowledge_type__`

Preserved keys:
- ✅ `product_knowledge_type__medication`
- ✅ `product_knowledge_type__consumable`  
- ✅ `product_knowledge_type__nutritional_product`

## Supported Patterns

| Pattern | Detected | Example |
|---------|----------|---------|
| Simple variable | ✅ | `` t(`status__${s}`) `` |
| Member access | ✅ | `` t(`status__${obj.status}`) `` |
| Nested member access | ✅ | `` t(`type__${a.b.c.type}`) `` |
| Multiline calls | ✅ | `` t(\n  `prefix__${var}`,\n) `` |
| Different variable names | ✅ | `` t(`prefix__${type}`) `` |

## Common Prefixes in Codebase

- `encounter_status__` - Encounter status translations
- `product_knowledge_type__` - Product type translations
- `medication_status__` - Medication status translations
- `consent_category__` - Consent category translations
- And many more...

## Troubleshooting

### Keys Being Removed Unexpectedly

1. Ensure the key is actually used in the codebase
2. For dynamic keys, verify the prefix pattern is correct (must come BEFORE `${}`)
3. Run tests to verify detection: `npm run test:i18n`

### Verifying Detection

To see which prefixes are detected:
```javascript
const { extractUsedKeys } = require('./scripts/remove-unused-i18n.js');
const { dynamicPrefixes } = await extractUsedKeys('./src', ['ts', 'tsx']);
console.log(Array.from(dynamicPrefixes).sort());
```

## Testing

The script includes comprehensive tests in `test-remove-unused-i18n.js`:

- ✅ Dynamic prefix detection for multiple patterns
- ✅ Key preservation during cleanup
- ✅ Multiline t() call support
- ✅ Both `encounter_status__` and `product_knowledge_type__` patterns

Run tests with:
```bash
npm run test:i18n
```
