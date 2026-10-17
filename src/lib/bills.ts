export type Item = { id: string; name: string; qty: number; rate: number };
export type Bill = {
  id: string;
  shopName: string;
  location: string;
  phone: string;
  gstin: string;
  customerName: string;
  customerPhone: string;
  billNo: string;
  date: string;
  items: Item[];
  discount: number;
  taxPercent: number;
  notes: string;
  paymentMode: string;
  savedAt?: number;
};

const KEY = "abm_bills";
const SHOP = "abm_shop";

export const uid = () => Math.random().toString(36).slice(2, 10);
export const newItem = (): Item => ({ id: uid(), name: "", qty: 1, rate: 0 });

export function calc(b: Pick<Bill, "items" | "discount" | "taxPercent">) {
  const subtotal = b.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
  const afterDisc = Math.max(0, subtotal - (Number(b.discount) || 0));
  const tax = (afterDisc * (Number(b.taxPercent) || 0)) / 100;
  return { subtotal, tax, total: afterDisc + tax };
}

export const money = (n: number) => "Rs " + n.toFixed(2);

export function loadBills(): Bill[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveBill(b: Bill) {
  const all = loadBills().filter((x) => x.id !== b.id);
  all.unshift({ ...b, savedAt: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(all));
  const { shopName, location, phone, gstin } = b;
  localStorage.setItem(SHOP, JSON.stringify({ shopName, location, phone, gstin }));
}
export function deleteBill(id: string) {
  localStorage.setItem(KEY, JSON.stringify(loadBills().filter((x) => x.id !== id)));
}
export function nextBillNo() {
  const nums = loadBills().map((b) => parseInt(b.billNo)).filter((n) => !isNaN(n));
  return String(nums.length ? Math.max(...nums) + 1 : 1);
}
export function blankBill(): Bill {
  let shop = { shopName: "", location: "", phone: "", gstin: "" };
  try { shop = { ...shop, ...JSON.parse(localStorage.getItem(SHOP) || "{}") }; } catch { /* empty */ }
  return {
    id: uid(), ...shop, customerName: "", customerPhone: "", billNo: nextBillNo(),
    date: new Date().toISOString().slice(0, 10), items: [newItem()], discount: 0, taxPercent: 0,
    notes: "", paymentMode: "Cash",
  };
}
