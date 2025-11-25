const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;

function getDynamicPrefix(node) {
  if (
    !node ||
    node.type !== "TemplateLiteral" ||
    node.expressions.length === 0
  ) {
    return null;
  }

  // Get the first quasi (the part before the first ${})
  const firstQuasi = node.quasis[0];
  if (firstQuasi && firstQuasi.value.cooked) {
    return firstQuasi.value.cooked;
  }

  return null;
}

// Test case 1: encounter_status__
const code1 = `t(\`encounter_status__\${selectedEncounter.status}\`)`;
console.log("Testing code1:", code1);
const ast1 = babel.parseSync(code1, {
  filename: 'test1.tsx',
  presets: ["@babel/preset-typescript"],
  sourceType: "module",
});

traverse(ast1, {
  CallExpression(path) {
    const keyArg = path.node.arguments[0];
    const prefix = getDynamicPrefix(keyArg);
    console.log("Prefix from code1:", prefix);
  }
});

// Test case 2: product_knowledge_type__
const code2 = `t(\`product_knowledge_type__\${type}\`)`;
console.log("\nTesting code2:", code2);
const ast2 = babel.parseSync(code2, {
  filename: 'test2.tsx',
  presets: ["@babel/preset-typescript"],
  sourceType: "module",
});

traverse(ast2, {
  CallExpression(path) {
    const keyArg = path.node.arguments[0];
    const prefix = getDynamicPrefix(keyArg);
    console.log("Prefix from code2:", prefix);
  }
});
