import { describe, expect, it } from "vitest";
import { refuseAppWorker } from "./pwa-policy";

describe("offline preview safety", () => {
  it.each(["id-preview--example.lovable.app", "preview--example.lovable.app", "lovableproject.com", "x.lovableproject.com", "lovableproject-dev.com", "x.lovableproject-dev.com", "beta.lovable.dev", "x.beta.lovable.dev"])("never caches preview %s", (host) => {
    expect(refuseAppWorker(true, host, false, "")).toBe(true);
  });
  it("refuses development", () => expect(refuseAppWorker(false, "localhost", false, "")).toBe(true));
  it("refuses iframe", () => expect(refuseAppWorker(true, "invoice-gem-pro.lovable.app", true, "")).toBe(true));
  it("supports off switch", () => expect(refuseAppWorker(true, "invoice-gem-pro.lovable.app", false, "?sw=off")).toBe(true));
  it("allows published pages", () => expect(refuseAppWorker(true, "invoice-gem-pro.lovable.app", false, "")).toBe(false));
});