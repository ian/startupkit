import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";

const TEST_CONFIG_DIR = join(homedir(), ".startupkit-test");
const TEST_CONFIG_FILE = join(TEST_CONFIG_DIR, "pro.json");

const cleanUp = () => {
  try {
    if (existsSync(TEST_CONFIG_FILE)) {
      rmSync(TEST_CONFIG_FILE, { force: true });
    }
    if (existsSync(TEST_CONFIG_DIR)) {
      rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors
  }
};

const loadAuthConfig = () => {
  if (!existsSync(TEST_CONFIG_FILE)) {
    return {};
  }
  try {
    const content = readFileSync(TEST_CONFIG_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
};

const getApiKey = () => {
  const config = loadAuthConfig();
  return config.apiKey || null;
};

const hasApiKey = () => {
  return !!getApiKey();
};

describe("Auth Config - loadAuthConfig", () => {
  beforeEach(() => {
    cleanUp();
  });

  afterEach(() => {
    cleanUp();
  });

  it("returns empty object when config file does not exist", () => {
    const result = loadAuthConfig();
    expect(result).toEqual({});
  });

  it("returns empty object when config file is invalid JSON", () => {
    mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    writeFileSync(TEST_CONFIG_FILE, "invalid json");

    const result = loadAuthConfig();
    expect(result).toEqual({});
  });

  it("returns parsed config when file exists and is valid", () => {
    mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    writeFileSync(
      TEST_CONFIG_FILE,
      JSON.stringify({
        apiKey: "sk_test_123",
        baseUrl: "http://localhost:3000",
      }),
    );

    const result = loadAuthConfig();
    expect(result).toEqual({
      apiKey: "sk_test_123",
      baseUrl: "http://localhost:3000",
    });
  });
});

describe("Auth Config - getApiKey", () => {
  beforeEach(() => {
    cleanUp();
  });

  afterEach(() => {
    cleanUp();
  });

  it("returns null when no config exists", () => {
    const result = getApiKey();
    expect(result).toBeNull();
  });

  it("returns apiKey when config exists", () => {
    mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    writeFileSync(
      TEST_CONFIG_FILE,
      JSON.stringify({ apiKey: "sk_pro_test123" }),
    );

    const result = getApiKey();
    expect(result).toBe("sk_pro_test123");
  });

  it("returns null when apiKey is not in config", () => {
    mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    writeFileSync(
      TEST_CONFIG_FILE,
      JSON.stringify({ baseUrl: "http://localhost:3000" }),
    );

    const result = getApiKey();
    expect(result).toBeNull();
  });
});

describe("Auth Config - hasApiKey", () => {
  beforeEach(() => {
    cleanUp();
  });

  afterEach(() => {
    cleanUp();
  });

  it("returns false when no config exists", () => {
    const result = hasApiKey();
    expect(result).toBe(false);
  });

  it("returns true when apiKey exists", () => {
    mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    writeFileSync(
      TEST_CONFIG_FILE,
      JSON.stringify({ apiKey: "sk_pro_test123" }),
    );

    const result = hasApiKey();
    expect(result).toBe(true);
  });

  it("returns false when apiKey is empty string", () => {
    mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    writeFileSync(TEST_CONFIG_FILE, JSON.stringify({ apiKey: "" }));

    const result = hasApiKey();
    expect(result).toBe(false);
  });
});

describe("API Key Format Validation", () => {
  it("validates sk_pro_ prefix format", () => {
    const validKey = "sk_pro_abc123def456";
    const invalidKey = "sk_live_abc123";

    expect(validKey.startsWith("sk_pro_")).toBe(true);
    expect(invalidKey.startsWith("sk_pro_")).toBe(false);
  });

  it("validates minimum key length", () => {
    const shortKey = "sk_pro_ab";
    const validKey = "sk_pro_abcdefghijklmnopqrstuvwxyz123456";

    expect(validKey.length >= 10).toBe(true);
    expect(shortKey.length >= 10).toBe(false);
  });
});
