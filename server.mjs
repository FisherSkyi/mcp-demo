import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP Server
const server = new McpServer({
  name: "calculator",
  version: "1.0.0",
});

// ── Tool: multiply ──────────────────────────────────────────────────────────
server.tool(
  "multiply",
  "Multiply two numbers together",
  {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  },
  async ({ a, b }) => {
    const result = a * b;
    return {
      content: [
        {
          type: "text",
          text: `${a} × ${b} = ${result}`,
        },
      ],
    };
  }
);

// ── Tool: add ───────────────────────────────────────────────────────────────
server.tool(
  "add",
  "Add two numbers together",
  {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  },
  async ({ a, b }) => {
    const result = a + b;
    return {
      content: [{ type: "text", text: `${a} + ${b} = ${result}` }],
    };
  }
);

// ── Tool: subtract ──────────────────────────────────────────────────────────
server.tool(
  "subtract",
  "Subtract one number from another",
  {
    a: z.number().describe("Number to subtract from"),
    b: z.number().describe("Number to subtract"),
  },
  async ({ a, b }) => {
    const result = a - b;
    return {
      content: [{ type: "text", text: `${a} − ${b} = ${result}` }],
    };
  }
);

// ── Tool: divide ────────────────────────────────────────────────────────────
server.tool(
  "divide",
  "Divide one number by another",
  {
    a: z.number().describe("Dividend (number to divide)"),
    b: z.number().describe("Divisor (number to divide by)"),
  },
  async ({ a, b }) => {
    if (b === 0) {
      return {
        content: [{ type: "text", text: "Error: Division by zero is undefined." }],
        isError: true,
      };
    }
    const result = a / b;
    return {
      content: [{ type: "text", text: `${a} ÷ ${b} = ${result}` }],
    };
  }
);

// ── Start server over stdio ─────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("✅ Calculator MCP server running on stdio");
