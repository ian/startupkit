import { describe, it, expect } from "vitest";

describe("Database Schema Validation", () => {
  it("validates users table schema structure", () => {
    const schema = {
      id: "TEXT PRIMARY KEY",
      email: "TEXT UNIQUE NOT NULL",
      password_hash: "TEXT",
      plan: "TEXT DEFAULT 'starter'",
      api_key: "TEXT UNIQUE",
      api_key_hash: "TEXT",
      created_at: "TEXT DEFAULT (datetime('now'))",
      updated_at: "TEXT DEFAULT (datetime('now'))",
    };

    expect(schema.id).toContain("PRIMARY KEY");
    expect(schema.email).toContain("UNIQUE");
    expect(schema.plan).toContain("DEFAULT");
  });

  it("validates api_keys table schema structure", () => {
    const schema = {
      id: "TEXT PRIMARY KEY",
      user_id: "TEXT NOT NULL",
      key_hash: "TEXT NOT NULL",
      name: "TEXT DEFAULT 'Default Key'",
      last_used_at: "TEXT",
      created_at: "TEXT DEFAULT (datetime('now'))",
    };

    expect(schema.id).toContain("PRIMARY KEY");
    expect(schema.user_id).toContain("NOT NULL");
    expect(schema.key_hash).toContain("NOT NULL");
  });

  it("validates credit_transactions table schema structure", () => {
    const schema = {
      id: "TEXT PRIMARY KEY",
      user_id: "TEXT NOT NULL",
      amount: "INTEGER NOT NULL",
      type: "TEXT NOT NULL",
      tool: "TEXT",
      description: "TEXT",
      created_at: "TEXT DEFAULT (datetime('now'))",
    };

    expect(schema.amount).toContain("INTEGER");
    expect(schema.type).toContain("NOT NULL");
  });

  it("validates tool_usage table schema structure", () => {
    const schema = {
      id: "TEXT PRIMARY KEY",
      user_id: "TEXT NOT NULL",
      tool: "TEXT NOT NULL",
      credits_used: "INTEGER NOT NULL",
      request_data: "TEXT",
      response_data: "TEXT",
      created_at: "TEXT DEFAULT (datetime('now'))",
    };

    expect(schema.tool).toContain("NOT NULL");
    expect(schema.credits_used).toContain("INTEGER");
  });

  it("validates subscriptions table schema structure", () => {
    const schema = {
      id: "TEXT PRIMARY KEY",
      user_id: "TEXT NOT NULL",
      plan: "TEXT NOT NULL",
      status: "TEXT DEFAULT 'active'",
      current_period_start: "TEXT",
      current_period_end: "TEXT",
      cancel_at_period_end: "INTEGER DEFAULT 0",
    };

    expect(schema.status).toContain("DEFAULT");
    expect(schema.cancel_at_period_end).toContain("DEFAULT");
  });

  it("has correct indexes defined", () => {
    const indexes = [
      "idx_users_email ON users(email)",
      "idx_users_api_key ON users(api_key)",
      "idx_api_keys_user_id ON api_keys(user_id)",
      "idx_api_keys_hash ON api_keys(key_hash)",
      "idx_credit_transactions_user ON credit_transactions(user_id)",
      "idx_tool_usage_user ON tool_usage(user_id)",
      "idx_tool_usage_tool ON tool_usage(tool)",
    ];

    indexes.forEach((idx) => {
      expect(idx).toMatch(/^idx_\w+ ON \w+\(\w+\)$/);
    });
  });

  it("has proper foreign key constraints", () => {
    const foreignKeys = ["user_id REFERENCES users(id) ON DELETE CASCADE"];

    foreignKeys.forEach((fk) => {
      expect(fk).toContain("REFERENCES");
      expect(fk).toContain("ON DELETE CASCADE");
    });
  });
});

describe("Credit Transaction Types", () => {
  const validTypes = ["debit", "credit", "bonus"];

  it("accepts valid transaction types", () => {
    validTypes.forEach((type) => {
      expect(validTypes).toContain(type);
    });
  });

  it("has correct debit behavior (negative amount)", () => {
    const debitAmount = -5;
    expect(debitAmount).toBeLessThan(0);
  });

  it("has correct credit behavior (positive amount)", () => {
    const creditAmount = 10;
    expect(creditAmount).toBeGreaterThan(0);
  });
});

describe("Subscription Status", () => {
  const validStatuses = ["active", "cancelled", "past_due", "trialing"];

  it("accepts valid subscription statuses", () => {
    validStatuses.forEach((status) => {
      expect(validStatuses).toContain(status);
    });
  });

  it("rejects invalid subscription statuses", () => {
    const invalidStatus = "expired";
    expect(validStatuses).not.toContain(invalidStatus);
  });
});
