import { placeOrder, } from "./trade";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getPositions } from "./trade.js";

// Create an MCP server
const server = new McpServer({
  name: "Zerodha-Trade",
  version: "1.0.0",
  capabilities: {
    // Explicitly declare which standard methods are supported
    resources: { list: false },  // Set to true if you implement this
    prompts: { list: false } ,    // Set to true if you implement this
    tools: { listChanged: false } // Set to true if you implement this
  }
});

interface StockOrderInput {
  stock: string;
  quantity: number;
}

// Add an addition tool
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }: {a:number,b:number}) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

//
server.tool("factorial",
  { n: z.number() },
  async ({ n }:{n: number}) => {
    let ans = 1;
    for (let i = 1; i <= n; i++) {
      ans *= i;
    }
   return{ content: [{ type: "text", text: String(ans) }] 
          };
  
   }

);

server.tool("buy-stock","Buys the stock on zerodha exhange for the user.  It excutes the a real order to buy the stock for the.", 
  {stock: z.string(), quantity: z.number() },
  async ({ stock, quantity }: StockOrderInput) => {
    try {
      await placeOrder(stock, quantity, "BUY");
      return { content: [{ type: "text", text: `Bought ${quantity} shares of ${stock}` }] };
    } catch (error:any) {
      return { content: [{ type: "text", text: `Error buying stock: ${error.message}` }] };
    }
  }
);

server.tool("sell-stock","Sells the stock on zerodha exhange for the user. It excutes the a real order to sell the stock for the.",
  { stock: z.string(), quantity: z.number() },
  async ({ stock, quantity }: StockOrderInput) => {
    try {
      await placeOrder(stock, quantity, "SELL");
      return {
        content: [{ type: "text", text: `Sold ${quantity} shares of ${stock}` }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error selling stock: ${error.message}` }]
      };
    }
  }
);

server.tool("show-portfolio","Shows my complete portfolio",
  { },
  async () => {
    const holdings = await getPositions();
    return {
      content: [{ type: "text", text: holdings }] // Use the already fetched holdings
    };
  }
);


const transport = new StdioServerTransport();
await server.connect(transport); 

