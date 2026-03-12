import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// ── Boot the MCP server as a subprocess ────────────────────────────────────
const transport = new StdioClientTransport({
  command: "node",
  args: ["server.mjs"],
});

const client = new Client({ name: "calculator-demo", version: "1.0.0" });
await client.connect(transport);

// ── Helper ──────────────────────────────────────────────────────────────────
async function callTool(name, args) {
  const res = await client.callTool({ name, arguments: args });
  return res.content[0].text;
}

// ── Demo ────────────────────────────────────────────────────────────────────
console.log("🔢 Calculator MCP Demo\n" + "─".repeat(35));

// List available tools
const { tools } = await client.listTools();
console.log(`\n📋 Available tools: ${tools.map((t) => t.name).join(", ")}\n`);

// Run demo calculations
const demos = [
  { tool: "multiply", args: { a: 7, b: 6 } },
  { tool: "multiply", args: { a: 123, b: 456 } },
  { tool: "add",      args: { a: 42, b: 58 } },
  { tool: "subtract", args: { a: 100, b: 37 } },
  { tool: "divide",   args: { a: 144, b: 12 } },
  { tool: "divide",   args: { a: 9, b: 0 } },   // error case
];

for (const { tool, args } of demos) {
  const result = await callTool(tool, args);
  console.log(`  ${result}`);
}

console.log("\n✅ Demo complete!");
await client.close();
