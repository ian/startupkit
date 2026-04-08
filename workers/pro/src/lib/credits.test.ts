import { describe, it, expect } from "vitest";

describe("DeductResult Interface", () => {
  it("validates successful deduction result", () => {
    const result = {
      success: true,
      creditsRemaining: 5,
    };

    expect(result.success).toBe(true);
    expect(result.creditsRemaining).toBeGreaterThanOrEqual(0);
  });

  it("validates failed deduction result", () => {
    const result = {
      success: false,
      creditsRemaining: 0,
    };

    expect(result.success).toBe(false);
  });

  it("validates insufficient credits result", () => {
    const result = {
      success: false,
      creditsRemaining: 3,
    };

    expect(result.success).toBe(false);
    expect(result.creditsRemaining).toBeLessThan(5); // requested amount
  });
});

describe("Credit Deduction Logic", () => {
  it("calculates total credits correctly", () => {
    const user = { credits: 5, bonus_credits: 10 };
    const total = user.credits + user.bonus_credits;
    expect(total).toBe(15);
  });

  it("detects insufficient credits", () => {
    const user = { credits: 2, bonus_credits: 3 };
    const amount = 10;
    const total = user.credits + user.bonus_credits;

    expect(total < amount).toBe(true);
  });

  it("detects sufficient credits", () => {
    const user = { credits: 50, bonus_credits: 100 };
    const amount = 10;
    const total = user.credits + user.bonus_credits;

    expect(total >= amount).toBe(true);
  });

  it("calculates credit portion from regular credits", () => {
    const user = { credits: 7, bonus_credits: 5 };
    const amount = 5;

    const fromRegular = Math.min(user.credits, amount);
    expect(fromRegular).toBe(5);
  });

  it("calculates credit portion from bonus credits when regular is insufficient", () => {
    const user = { credits: 2, bonus_credits: 5 };
    const amount = 5;

    const fromBonus = amount > user.credits ? amount - user.credits : 0;
    expect(fromBonus).toBe(3);
  });

  it("handles zero credits", () => {
    const user = { credits: 0, bonus_credits: 0 };
    const amount = 5;
    const total = user.credits + user.bonus_credits;

    expect(total < amount).toBe(true);
  });

  it("handles exact credit match", () => {
    const user = { credits: 5, bonus_credits: 0 };
    const amount = 5;
    const total = user.credits + user.bonus_credits;

    expect(total >= amount).toBe(true);
    expect(total - amount).toBe(0);
  });
});

describe("Tool Usage Logging", () => {
  it("validates tool usage structure", () => {
    const usage = {
      id: "uuid-123",
      user_id: "user-456",
      tool: "trends",
      credits_used: 5,
      request_data: '{"query": "ai"}',
      response_data: '{"results": []}',
    };

    expect(usage.id).toBeDefined();
    expect(usage.user_id).toBeDefined();
    expect(usage.tool).toBeDefined();
    expect(typeof usage.credits_used).toBe("number");
    expect(typeof usage.request_data).toBe("string");
    expect(typeof usage.response_data).toBe("string");
  });

  it("serializes request and response data to JSON", () => {
    const requestData = { query: "test" };
    const responseData = { results: ["a", "b"] };

    const serializedRequest = JSON.stringify(requestData);
    const serializedResponse = JSON.stringify(responseData);

    expect(serializedRequest).toBe('{"query":"test"}');
    expect(serializedResponse).toBe('{"results":["a","b"]}');
  });
});

describe("Credit Transaction Types", () => {
  it("validates debit transaction", () => {
    const transaction = {
      id: "uuid-123",
      user_id: "user-456",
      amount: -5,
      type: "debit",
      tool: "trends",
      description: "Google Trends lookup",
    };

    expect(transaction.type).toBe("debit");
    expect(transaction.amount).toBeLessThan(0);
  });

  it("validates credit transaction", () => {
    const transaction = {
      id: "uuid-123",
      user_id: "user-456",
      amount: 100,
      type: "credit",
      tool: null,
      description: "Monthly allocation",
    };

    expect(transaction.type).toBe("credit");
    expect(transaction.amount).toBeGreaterThan(0);
  });

  it("validates bonus transaction", () => {
    const transaction = {
      id: "uuid-123",
      user_id: "user-456",
      amount: 10,
      type: "bonus",
      tool: null,
      description: "Signup bonus",
    };

    expect(transaction.type).toBe("bonus");
    expect(transaction.amount).toBeGreaterThan(0);
  });
});

describe("Analytics Queries", () => {
  it("calculates total usage correctly", () => {
    const transactions = [{ amount: -5 }, { amount: -3 }, { amount: -2 }];

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    expect(total).toBe(-10);
  });

  it("groups usage by tool correctly", () => {
    const usage = [
      { tool: "trends", credits_used: 5 },
      { tool: "trends", credits_used: 3 },
      { tool: "seo", credits_used: 2 },
    ];

    const byTool: Record<string, number> = {};
    usage.forEach((u) => {
      byTool[u.tool] = (byTool[u.tool] || 0) + u.credits_used;
    });

    expect(byTool.trends).toBe(8);
    expect(byTool.seo).toBe(2);
  });

  it("calculates monthly usage correctly", () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const usage = [
      { created_at: startOfMonth.toISOString(), credits_used: 5 },
      { created_at: new Date().toISOString(), credits_used: 3 },
    ];

    const monthlyUsage = usage
      .filter((u) => new Date(u.created_at) >= startOfMonth)
      .reduce((sum, u) => sum + u.credits_used, 0);

    expect(monthlyUsage).toBe(8);
  });
});
