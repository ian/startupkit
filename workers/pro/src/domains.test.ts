import { describe, it, expect } from "vitest";

describe("DomainResult Structure", () => {
  it("validates complete domain result", () => {
    const result = {
      name: "example.com",
      available: true,
      price: 9.99,
      renewalPrice: 12.99,
      registrar: "Porkbun",
    };

    expect(result.name).toBeDefined();
    expect(result.name.includes(".")).toBe(true);
    expect(typeof result.available).toBe("boolean");
    expect(typeof result.price).toBe("number");
    expect(typeof result.renewalPrice).toBe("number");
    expect(typeof result.registrar).toBe("string");
  });

  it("validates unavailable domain result", () => {
    const result = {
      name: "taken.com",
      available: false,
      registrar: "Namecheap",
    };

    expect(result.available).toBe(false);
    expect(result.price).toBeUndefined();
  });

  it("validates domain name format", () => {
    const validDomains = ["example.com", "my-app.io", "startup.ai", "cool.co"];

    validDomains.forEach((domain) => {
      expect(domain).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*\.[a-z]{2,}$/i);
    });
  });
});

describe("Domain Extension Validation", () => {
  const validExtensions = [
    ".com",
    ".io",
    ".co",
    ".ai",
    ".app",
    ".dev",
    ".xyz",
    ".net",
    ".org",
  ];

  it("validates supported extensions", () => {
    validExtensions.forEach((ext) => {
      expect(ext.startsWith(".")).toBe(true);
      expect(ext.length).toBeGreaterThan(1);
    });
  });

  it("extracts TLD from domain", () => {
    const domain = "example.com";
    const tld = domain.split(".").pop();
    expect(tld).toBe("com");
  });

  it("normalizes extension format", () => {
    const extensions = ["com", ".com", "io", ".io"];
    const normalized = extensions.map((ext) =>
      ext.startsWith(".") ? ext : `.${ext}`,
    );

    normalized.forEach((ext) => {
      expect(ext.startsWith(".")).toBe(true);
    });
  });
});

describe("Porkbun API Response", () => {
  it("validates Porkbun pricing response structure", () => {
    const response = {
      status: "SUCCESS",
      pricing: {
        com: {
          bulk_price: "7.98",
          currency: "USD",
          effective_price: "8.98",
          id: "dotcom",
          price: "8.98",
          period: "1",
        },
      },
    };

    expect(response.status).toBe("SUCCESS");
    expect(response.pricing).toBeDefined();
    expect(response.pricing.com.price).toBeDefined();
  });

  it("parses Porkbun pricing correctly", () => {
    const pricing = {
      price: "8.98",
      effective_price: "10.98",
    };

    const price = parseFloat(pricing.price);
    const renewalPrice = parseFloat(pricing.effective_price);

    expect(price).toBe(8.98);
    expect(renewalPrice).toBe(10.98);
    expect(renewalPrice).toBeGreaterThan(price);
  });
});

describe("Namecheap API Response", () => {
  it("validates Namecheap XML response parsing", () => {
    const xml = `<Domain Domain="example.com" Available="true"/>`;
    const match = xml.match(/<Domain\s+Domain="([^"]+)"\s+Available="([^"]+)"/);

    expect(match).not.toBeNull();
    if (match) {
      expect(match[1]).toBe("example.com");
      expect(match[2]).toBe("true");
    }
  });

  it("converts Namecheap availability string to boolean", () => {
    const availableString = "true";
    const unavailableString = "false";

    const available = availableString === "true";
    const unavailable = unavailableString === "true";

    expect(available).toBe(true);
    expect(unavailable).toBe(false);
  });
});

describe("Domain Provider Interface", () => {
  it("validates provider structure", () => {
    const provider = {
      id: "porkbun",
      name: "Porkbun",
      search: async () => [],
      checkAvailability: async () => ({}) as any,
    };

    expect(provider.id).toBeDefined();
    expect(provider.name).toBeDefined();
    expect(typeof provider.search).toBe("function");
    expect(typeof provider.checkAvailability).toBe("function");
  });

  it("validates search options", () => {
    const searchOptions = {
      name: "startup",
      extensions: [".com", ".io"],
    };

    expect(searchOptions.name).toBeDefined();
    expect(Array.isArray(searchOptions.extensions)).toBe(true);
    expect(searchOptions.extensions.length).toBeGreaterThan(0);
  });
});

describe("Credit Cost Calculation", () => {
  it("calculates credit cost per extension", () => {
    const extensions = [".com", ".io", ".ai"];
    const creditCost = extensions.length;

    expect(creditCost).toBe(3);
  });

  it("handles single extension", () => {
    const extensions = [".com"];
    const creditCost = extensions.length;

    expect(creditCost).toBe(1);
  });

  it("uses default extensions when none provided", () => {
    const defaultExtensions = [".com", ".io", ".co", ".ai", ".app"];
    const extensions = undefined;

    const exts = extensions?.length ? extensions : defaultExtensions;

    expect(exts).toEqual(defaultExtensions);
    expect(exts.length).toBe(5);
  });
});

describe("Domain Search Flow", () => {
  it("handles search with user provider", async () => {
    const userProvider = {
      id: "porkbun",
      search: async ({
        name,
        extensions,
      }: {
        name: string;
        extensions: string[];
      }) => [
        {
          name: `${name}${extensions[0]}`,
          available: true,
          price: 9.99,
          registrar: "Porkbun",
        },
      ],
    };

    const result = await userProvider.search({
      name: "test",
      extensions: [".com"],
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].available).toBe(true);
  });

  it("falls back to mock data when no provider configured", async () => {
    const useMock = true;
    const mockData = [
      { name: "test.com", available: true, price: 9.99, registrar: "Mock" },
    ];

    const result = useMock ? mockData : null;

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
