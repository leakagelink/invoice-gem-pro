import { calc, type Bill } from "./bills";

export async function billPdf(b: Bill) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();
  const { subtotal, tax, total } = calc(b);
  const f = (n: number) => "Rs " + n.toFixed(2);
  doc.setFillColor(11, 59, 255);
  doc.rect(0, 0, 210, 34, "F");
  doc.setTextColor(255);
  doc.setFontSize(20);
  doc.text(b.shopName || "My Shop", 105, 14, { align: "center" });
  doc.setFontSize(10);
  doc.text([b.location, b.phone && "Ph: " + b.phone, b.gstin && "GSTIN: " + b.gstin].filter(Boolean).join("  |  "), 105, 24, { align: "center" });
  doc.setTextColor(30);
  doc.setFontSize(11);
  doc.text(`Bill No: ${b.billNo}`, 14, 46);
  doc.text(`Date: ${b.date}`, 196, 46, { align: "right" });
  if (b.customerName || b.customerPhone) doc.text(`Customer: ${b.customerName} ${b.customerPhone}`, 14, 53);
  autoTable(doc, {
    startY: 60,
    head: [["No.", "Product", "Qty", "Rate", "Total"]],
    body: b.items.filter((i) => i.name || i.rate).map((i, k) => [k + 1, i.name, i.qty, f(+i.rate), f(i.qty * i.rate)]),
    headStyles: { fillColor: [11, 59, 255] },
    columnStyles: { 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let y = (doc as any).lastAutoTable.finalY + 10;
  const row = (l: string, v: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(l, 140, y); doc.text(v, 196, y, { align: "right" }); y += 7;
  };
  row("Subtotal", f(subtotal));
  if (b.discount) row("Discount", "- " + f(+b.discount));
  if (b.taxPercent) row(`Tax (${b.taxPercent}%)`, f(tax));
  doc.setFontSize(13); row("TOTAL", f(total), true);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text(`Payment: ${b.paymentMode}`, 14, y);
  if (b.notes) doc.text(doc.splitTextToSize("Note: " + b.notes, 180), 14, y + 7);
  doc.setTextColor(120);
  doc.text("Thank you! Visit again.  •  Made with Anurag Bill Making", 105, 285, { align: "center" });
  return doc;
}

// Keeps the file link alive long enough for phones to finish saving
// (jsPDF's own save() frees it too early on mobile, giving a 0 byte file).
export async function downloadPdf(b: Bill) {
  const doc = await billPdf(b);
  const blob = doc.output("blob");
  const name = `Bill-${b.billNo || "1"}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
