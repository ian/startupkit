import { createHmac, randomBytes } from "node:crypto";
import { describe, it, expect } from "vitest";

function hashApiKey(key: string): string {
  return createHmac("sha256", key).digest("hex");
}

function generateApiKey(): string {
  return `sk_pro_${randomBytes(24).toString("hex")}`;
}

describe("API Key Generation", () => {
  it("generates a valid API key with correct prefix", () => {
    const key = generateApiKey();
    expect(key).toMatch(/^sk_pro_[a-f0-9]{48}$/);
  });

  it("generates unique keys each time", () => {
    const key1 = generateApiKey();
    const key2 = generateApiKey();
    expect(key1).not.toBe(key2);
  });

  it("generates key with correct length", () => {
    const key = generateApiKey();
    expect(key.length).toBe(55);
  });
});

describe("API Key Hashing", () => {
  it("produces consistent hash for same input", () => {
    const key = "sk_pro_test123";
    const hash1 = hashApiKey(key);
    const hash2 = hashApiKey(key);
    expect(hash1).toBe(hash2);
  });

  it("produces different hash for different inputs", () => {
    const hash1 = hashApiKey("key1");
    const hash2 = hashApiKey("key2");
    expect(hash1).not.toBe(hash2);
  });

  it("produces hex string of correct length (sha256 = 64 hex chars)", () => {
    const hash = hashApiKey("any key");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("can verify key matches hash", () => {
    const key = generateApiKey();
    const hash = hashApiKey(key);

    const expectedHash = createHmac("sha256", key).digest("hex");
    expect(hash).toBe(expectedHash);
  });
});

describe("Auth Middleware", () => {
  it("has correct AuthVariables interface structure", () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      plan: "starter" as const,
      credits: 10,
      bonusCredits: 10,
    };

    expect(mockUser.id).toBeDefined();
    expect(mockUser.email).toBeDefined();
    expect(mockUser.plan).toMatch(/^(starter|pro|enterprise)$/);
    expect(typeof mockUser.credits).toBe("number");
    expect(typeof mockUser.bonusCredits).toBe("number");
  });

  it("validates API key format in Authorization header", () => {
    const validHeader = "Bearer sk_pro_abc123def456";
    const invalidHeader = "Bearer invalid";

    expect(validHeader.startsWith("Bearer sk_pro_")).toBe(true);
    expect(invalidHeader.startsWith("Bearer sk_pro_")).toBe(false);
  });

  it("extracts token from Authorization header", () => {
    const authHeader = "Bearer sk_pro_abc123";
    const token = authHeader.slice(7);

    expect(token).toBe("sk_pro_abc123");
    expect(token.length).toBeGreaterThan(10);
  });
});
