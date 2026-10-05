import { getApiBase } from "@/lib/api";

describe("API utilities", () => {
  it("returns the API base URL", () => {
    expect(getApiBase()).toBeDefined();
    expect(typeof getApiBase()).toBe("string");
  });

  it("uses environment variable when set", () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_BASE;
    process.env.NEXT_PUBLIC_API_BASE = "http://test:8000/api/v1";
    
    // Re-import to get fresh value
    jest.resetModules();
    const { getApiBase: getApiBaseFresh } = require("@/lib/api");
    
    expect(getApiBaseFresh()).toBe("http://test:8000/api/v1");
    
    if (originalEnv) {
      process.env.NEXT_PUBLIC_API_BASE = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_API_BASE;
    }
  });
});