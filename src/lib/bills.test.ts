import { beforeEach, describe, expect, it } from "vitest";
import { blankBill, loadBills, saveBill } from "./bills";

describe("startup storage", () => {
  beforeEach(() => localStorage.clear());
  it.each(["{}", "null", "broken", '[null,{"items":null}]'])("can initialize with corrupt bills: %s", (value) => {
    localStorage.setItem("abm_bills", value);
    expect(blankBill().billNo).toBe("1");
    expect(loadBills()).toEqual([]);
  });
  it("keeps valid saved bills available after restarting", () => {
    const bill = { ...blankBill(), shopName: "Test Shop", customerName: "Dheeraj" };
    saveBill(bill);
    expect(loadBills()[0]?.customerName).toBe("Dheeraj");
    expect(blankBill().shopName).toBe("Test Shop");
  });
});