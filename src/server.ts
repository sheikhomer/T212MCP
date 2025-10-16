import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();
const app = express();
app.use(express.json());

const server = new McpServer({
    name: "T212MCP",
    version: "0.0.1",
    description: "Trading212 Read-only MCP Server",
});

const baseUrl = process.env.T212_API_URL || "https://demo.trading212.com/api/v0";
const apiKey = process.env.T212_API_KEY;
const apiSecret = process.env.T212_API_SECRET;


if (!apiKey || !apiSecret) {
    console.error("API key and secret must be set in environment variables.");
    process.exit(1);
}

const credentialsString = `${apiKey}:${apiSecret}`;
const encodedCredentials = Buffer.from(credentialsString).toString('base64');

const authHeader = `Basic ${encodedCredentials}`;

server.registerTool(
    "GetPortfolio",
    {
        title: "Trading212 Portfolio Tool",
        description: "Fetches the user's portfolio from Trading212.",
        outputSchema: {
            output: z.array(
                z.object({
                    averagePrice: z.number().optional().describe("The average price of the portfolio item"),
                    currentPrice: z.number().optional().describe("The current price of the portfolio item"),
                    frontend: z.string().optional().describe("The Origin of the request"),
                    fxPpl: z.number().optional().describe("Forex movement impact, only applies to positions with instrument currency that differs from the account currency"),
                    initialFillDate: z.string().optional().describe("The date when the position was first opened"),
                    maxBuy: z.number().optional().describe("Additional quantity that can be bought"),
                    maxSell: z.number().optional().describe("Quantity that can be sold"),
                    pieQuantity: z.number().optional().describe("Quantity of the instrument in a pie, if applicable"),
                    ppl: z.number().optional().describe("Profit and loss of the portfolio item"),
                    quantity: z.number().optional().describe("The quantity of the portfolio item"),
                    ticker: z.string().optional().describe("The unique instrument identifier"),
                }).passthrough().describe("A portfolio item")
            )
        }
    },
    async () => {
        const endpoint = "equity/portfolio";
        try {
            const response = await fetch(`${baseUrl}/${endpoint}`, {
                headers: {
                    "Authorization": authHeader,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            // Validate & coerce to match outputSchema
            const output = z.array(
                z.object({
                    averagePrice: z.coerce.number(),
                    currentPrice: z.coerce.number(),
                    frontend: z.string(),
                    fxPpl: z.coerce.number(),
                    initialFillDate: z.string(),
                    maxBuy: z.coerce.number(),
                    maxSell: z.coerce.number(),
                    pieQuantity: z.coerce.number(),
                    ppl: z.coerce.number(),
                    quantity: z.coerce.number(),
                    ticker: z.string(),
                }).passthrough()
            ).parse(data);

            return {
                content: [{ type: "text", text: JSON.stringify(output) }],
                structuredContent: { output }
            }
        } catch (error) {
            console.error("Failed to fetch portfolio:", error);
            const message = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: "text", text: `Error fetching portfolio data: ${message}` }],
                isError: true
            };
        }
    }

);

app.post("/mcp", async (req, res) => {
    try {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });

        res.on("close", () => {
            transport.close();
        });

        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error'
                },
                id: null
            });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on("error", (err) => {
    console.error("Failed to start the server:", err);
});
