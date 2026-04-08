import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { apiRequest } from "../lib/api.js";
import { CreditsInputSchema } from "../lib/schema.js";

export const creditsTool: Tool = {
  name: "credits",
  description: "Check your credit balance and usage history",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["balance", "history"],
        description: "Action to perform",
      },
    },
  },
};

export async function creditsHandler(args: Record<string, unknown>) {
  const input = CreditsInputSchema.parse(args);
  const action = input.action || "balance";

  if (action === "balance") {
    const data = await apiRequest<{
      balance: number;
      used: number;
      total: number;
    }>({
      method: "GET",
      path: "/credits/balance",
    });

    return {
      balance: data.balance,
      used: data.used,
      total: data.total,
      available: data.balance,
    };
  } else {
    const history = await apiRequest<
      Array<{
        tool: string;
        count: number;
        creditsUsed: number;
        lastUsed: string;
      }>
    >({
      method: "GET",
      path: "/credits/history",
    });

    return { history };
  }
}
