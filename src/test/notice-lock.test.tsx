import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as bills from "@/lib/bills";
import { BillApp } from "@/components/BillApp";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Notice-only access", () => {
  it("never starts bill creation or reads saved bills while the app is locked", () => {
    const createBill = vi.spyOn(bills, "blankBill");
    const readBills = vi.spyOn(bills, "loadBills");
    const saveBill = vi.spyOn(bills, "saveBill");
    render(<BillApp />);
    expect(createBill).not.toHaveBeenCalled();
    expect(readBills).not.toHaveBeenCalled();
    expect(saveBill).not.toHaveBeenCalled();
  });
});