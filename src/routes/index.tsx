import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  History, MapPin, Plus, Trash2, Save, Download, Printer, Share2, FilePlus2, X, Phone, User, Search, Copy,
} from "lucide-react";
import logo from "@/assets/logo-icon.jpg";
import { AdBanner, InterstitialAd } from "@/components/AdBanner";
import { blankBill, calc, deleteBill, loadBills, money, newItem, saveBill, uid, type Bill } from "@/lib/bills";
import { billPdf } from "@/lib/pdf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anurag Bill Making — Har Dukaan Ka Bill" },
      { name: "description", content: "Dukaan ka bill banao, save karo, PDF download aur print karo. Fully offline." },
      { property: "og:title", content: "Anurag Bill Making" },
      { property: "og:description", content: "Dukaan ka bill banao, save karo, PDF download aur print karo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

function Splash() {
  return (
    <div className="splash-bg fixed inset-0 z-50 flex flex-col items-center justify-center text-primary-foreground">
      <div className="rounded-[2rem] p-3 ring-1 ring-primary-foreground/30">
        <div className="rounded-[1.6rem] p-2 ring-1 ring-primary-foreground/20">
          <img src={logo} alt="Anurag Bill Making logo" width={1024} height={1024} className="h-28 w-28 rounded-3xl shadow-2xl" />
        </div>
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-wide">ANURAG BILL MAKING</h1>
      <p className="mt-2 text-xs tracking-[0.4em] opacity-70">HAR DUKAAN KA BILL</p>
      <div className="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-primary-foreground/20">
        <div className="animate-loadbar h-full rounded-full bg-primary-foreground" />
      </div>
      <p className="absolute bottom-10 text-sm opacity-80">
        Powered By:- <span className="font-semibold">Anurag Tecnology</span>
      </p>
    </div>
  );
}

const inp = "w-full rounded-xl border border-border bg-card px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring";

function App() {
  const [splash, setSplash] = useState(true);
  const [bill, setBill] = useState<Bill | null>(null);
  const [saved, setSaved] = useState<Bill[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [ad, setAd] = useState(false);
  const [toast, setToast] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    setBill(blankBill());
    setSaved(loadBills());
    const t = setTimeout(() => setSplash(false), 2400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const totals = useMemo(() => (bill ? calc(bill) : { subtotal: 0, tax: 0, total: 0 }), [bill]);
  if (splash || !bill) return <Splash />;

  const set = <K extends keyof Bill>(k: K, v: Bill[K]) => setBill({ ...bill, [k]: v });
  const setItem = (id: string, k: "name" | "qty" | "rate", v: string) =>
    set("items", bill.items.map((i) => (i.id === id ? { ...i, [k]: k === "name" ? v : Number(v) } : i)));

  const doSave = () => {
    saveBill(bill); setSaved(loadBills()); setToast("Bill save ho gaya ✓"); setAd(true);
  };
  const doDownload = async () => { (await billPdf(bill)).save(`Bill-${bill.billNo}.pdf`); setToast("PDF download ho gaya"); };
  const doShare = async () => {
    const doc = await billPdf(bill);
    const file = new File([doc.output("blob")], `Bill-${bill.billNo}.pdf`, { type: "application/pdf" });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: `Bill ${bill.billNo}` }); } catch { /* cancelled */ }
    } else {
      const text = `${bill.shopName}\nBill No: ${bill.billNo}  Date: ${bill.date}\n` +
        bill.items.filter((i) => i.name).map((i) => `${i.name} x${i.qty} = ${money(i.qty * i.rate)}`).join("\n") +
        `\nTOTAL: ${money(totals.total)}`;
      window.open(`https://wa.me/${bill.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
    }
  };
  const doNew = () => { setBill(blankBill()); setToast("Naya bill"); };

  const filtered = saved.filter((b) =>
    [b.billNo, b.customerName, b.shopName].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen pb-28">
      <header className="no-print sticky top-0 z-30 flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground shadow-md">
        <img src={logo} alt="" width={40} height={40} className="h-10 w-10 rounded-xl" />
        <h1 className="flex-1 text-lg font-bold tracking-wide">ANURAG BILL MAKING</h1>
        <button onClick={() => setShowSaved(true)} className="flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm">
          <History className="h-4 w-4" /> Saved ({saved.length})
        </button>
      </header>

      <div className="no-print mt-3 px-4"><AdBanner /></div>

      <main className="mx-auto max-w-2xl p-4">
        <div className="print-area rounded-3xl border border-border bg-card p-5 shadow-sm">
          <input value={bill.shopName} onChange={(e) => set("shopName", e.target.value)} placeholder="Yahan Dukaan Ka Naam Likho"
            className="w-full bg-transparent text-center text-2xl font-bold text-primary outline-none placeholder:text-primary/40" />
          <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-2.5">
            <MapPin className="h-4 w-4 text-primary" />
            <input value={bill.location} onChange={(e) => set("location", e.target.value)} placeholder="Shop location" className="flex-1 bg-transparent outline-none" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input value={bill.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Shop mobile" className={inp} />
            <input value={bill.gstin} onChange={(e) => set("gstin", e.target.value)} placeholder="GSTIN (optional)" className={inp} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-muted-foreground">BILL NO
              <input value={bill.billNo} onChange={(e) => set("billNo", e.target.value)} className={inp + " mt-1 text-base font-normal text-foreground"} /></label>
            <label className="text-xs font-semibold text-muted-foreground">DATE
              <input type="date" value={bill.date} onChange={(e) => set("date", e.target.value)} className={inp + " mt-1 text-base font-normal text-foreground"} /></label>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input value={bill.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="Customer naam" className={inp + " pl-9"} /></div>
            <div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input value={bill.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} placeholder="Customer mobile" className={inp + " pl-9"} /></div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[28px_1fr_48px_70px_72px_24px] gap-1 bg-accent px-3 py-3 text-xs font-semibold text-accent-foreground">
              <span>NO.</span><span>PRODUCT</span><span>QTY</span><span>RATE</span><span className="text-right">TOTAL</span><span />
            </div>
            {bill.items.map((it, k) => (
              <div key={it.id} className="grid grid-cols-[28px_1fr_48px_70px_72px_24px] items-center gap-1 border-t border-border px-3 py-2 text-sm">
                <span className="text-muted-foreground">{k + 1}</span>
                <input value={it.name} onChange={(e) => setItem(it.id, "name", e.target.value)} placeholder="Product name" className="min-w-0 bg-transparent outline-none" />
                <input type="number" inputMode="decimal" value={it.qty || ""} onChange={(e) => setItem(it.id, "qty", e.target.value)} placeholder="1" className="min-w-0 bg-transparent outline-none" />
                <input type="number" inputMode="decimal" value={it.rate || ""} onChange={(e) => setItem(it.id, "rate", e.target.value)} placeholder="0.00" className="min-w-0 bg-transparent outline-none" />
                <span className="text-right font-medium text-primary">{it.qty * it.rate ? (it.qty * it.rate).toFixed(2) : "—"}</span>
                <button className="no-print" aria-label="Remove item" onClick={() => set("items", bill.items.length > 1 ? bill.items.filter((x) => x.id !== it.id) : [newItem()])}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => set("items", [...bill.items, newItem()])}
            className="no-print mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 py-4 font-medium text-primary">
            <Plus className="h-5 w-5" /> Add Product
          </button>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <label className="text-xs font-semibold text-muted-foreground">DISCOUNT (Rs)
              <input type="number" value={bill.discount || ""} onChange={(e) => set("discount", Number(e.target.value))} placeholder="0" className={inp + " mt-1 font-normal text-foreground"} /></label>
            <label className="text-xs font-semibold text-muted-foreground">GST / TAX %
              <input type="number" value={bill.taxPercent || ""} onChange={(e) => set("taxPercent", Number(e.target.value))} placeholder="0" className={inp + " mt-1 font-normal text-foreground"} /></label>
            <label className="text-xs font-semibold text-muted-foreground">PAYMENT
              <select value={bill.paymentMode} onChange={(e) => set("paymentMode", e.target.value)} className={inp + " mt-1 font-normal text-foreground"}>
                <option>Cash</option><option>UPI</option><option>Card</option><option>Udhaar</option></select></label>
          </div>
          <textarea value={bill.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Note (optional)" rows={2} className={inp + " mt-3"} />

          <div className="mt-4 space-y-1 px-1 text-sm text-muted-foreground">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
            {!!bill.discount && <div className="flex justify-between"><span>Discount</span><span>- {money(bill.discount)}</span></div>}
            {!!bill.taxPercent && <div className="flex justify-between"><span>Tax ({bill.taxPercent}%)</span><span>{money(totals.tax)}</span></div>}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-lg shadow-primary/30">
            <span className="font-semibold tracking-wide">TOTAL AMOUNT</span>
            <span className="text-3xl font-bold">{money(totals.total)}</span>
          </div>
        </div>
        <p className="no-print mt-4 text-center text-sm text-muted-foreground">Works fully offline · Data stays on this device</p>
        <p className="no-print mt-1 text-center text-xs text-muted-foreground">Powered By:- Anurag Tecnology</p>
      </main>

      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card px-2 py-2">
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1 text-xs font-medium">
          {[
            { l: "New", i: FilePlus2, f: doNew },
            { l: "Save", i: Save, f: doSave },
            { l: "Download", i: Download, f: doDownload },
            { l: "Print", i: Printer, f: () => window.print() },
            { l: "Share", i: Share2, f: doShare },
          ].map(({ l, i: I, f }) => (
            <button key={l} onClick={f} className={`flex flex-col items-center gap-1 rounded-xl py-2 ${l === "Save" ? "bg-primary text-primary-foreground" : "text-primary"}`}>
              <I className="h-5 w-5" />{l}
            </button>
          ))}
        </div>
      </nav>

      {showSaved && (
        <div className="no-print fixed inset-0 z-40 flex flex-col bg-background">
          <div className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
            <h2 className="flex-1 text-lg font-bold">Saved Bills ({saved.length})</h2>
            <button onClick={() => setShowSaved(false)} aria-label="Close"><X /></button>
          </div>
          <div className="p-4">
            <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Bill no / customer search karo" className={inp + " pl-9"} /></div>
          </div>
          <div className="flex-1 space-y-3 overflow-auto px-4 pb-6">
            {filtered.length === 0 && <p className="mt-10 text-center text-muted-foreground">Koi saved bill nahi hai</p>}
            {filtered.map((b) => (
              <div key={b.id} className="rounded-2xl border border-border bg-card p-4">
                <button className="w-full text-left" onClick={() => { setBill(b); setShowSaved(false); }}>
                  <div className="flex justify-between font-semibold"><span>#{b.billNo} · {b.customerName || "Customer"}</span><span className="text-primary">{money(calc(b).total)}</span></div>
                  <div className="text-sm text-muted-foreground">{b.shopName} · {b.date}</div>
                </button>
                <div className="mt-3 flex gap-4 text-sm">
                  <button className="flex items-center gap-1 text-primary" onClick={async () => (await billPdf(b)).save(`Bill-${b.billNo}.pdf`)}><Download className="h-4 w-4" />PDF</button>
                  <button className="flex items-center gap-1 text-primary" onClick={() => { setBill({ ...b, id: uid(), billNo: blankBill().billNo }); setShowSaved(false); }}><Copy className="h-4 w-4" />Copy</button>
                  <button className="flex items-center gap-1 text-destructive" onClick={() => { if (confirm("Delete this bill?")) { deleteBill(b.id); setSaved(loadBills()); } }}><Trash2 className="h-4 w-4" />Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3"><AdBanner /></div>
        </div>
      )}

      {ad && <InterstitialAd onClose={() => setAd(false)} />}
      {toast && <div className="no-print fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-2 text-sm text-background">{toast}</div>}
    </div>
  );
}
