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

function testCode(label, code) {
  console.log(`\nTesting ${label}:`, code);
  const ast = babel.parseSync(code, {
    filename: 'test.tsx',
    presets: ["@babel/preset-typescript", "@babel/preset-react"],
    sourceType: "module",
  });

  traverse(ast, {
    CallExpression(path) {
      const keyArg = path.node.arguments[0];
      const prefix = getDynamicPrefix(keyArg);
      console.log("  Prefix:", prefix);
      if (keyArg.type === 'TemplateLiteral') {
        console.log("  Quasis:", keyArg.quasis.map(q => q.value.cooked));
        console.log("  Expressions count:", keyArg.expressions.length);
      }
    }
  });
}

// Different patterns
testCode("1", `t(\`encounter_status__\${selectedEncounter.status}\`)`);
testCode("2", `t(\`product_knowledge_type__\${product.product_type}\`)`);
testCode("3", `t(\`product_knowledge_type__\${type}\`)`);
testCode("4", `t(\`prefix__\${a.b.c}\`)`);
testCode("5", `<SelectItem>{t(\`product_knowledge_type__\${type}\`)}</SelectItem>`);
