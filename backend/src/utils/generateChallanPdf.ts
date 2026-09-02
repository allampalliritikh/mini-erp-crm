import PDFDocument from "pdfkit";
import { Response } from "express";

interface ChallanItemForPdf {
  productName: string;
  productSku: string;
  unitPrice: any; // Prisma Decimal — cast to Number before use
  quantity: number;
}

interface ChallanForPdf {
  challanNumber: string;
  status: string;
  createdAt: Date;
  totalQuantity: number;
  customer: {
    name: string;
    businessName?: string | null;
    mobile: string;
    email?: string | null;
    address?: string | null;
    gstNumber?: string | null;
  };
  items: ChallanItemForPdf[];
}

/**
 * Streams a PDF invoice/challan directly to the HTTP response.
 * Kept deliberately simple (no external template engine) so it has
 * no extra runtime dependencies beyond pdfkit.
 */
export function streamChallanPdf(res: Response, challan: ChallanForPdf) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="challan-${challan.challanNumber}.pdf"`
  );

  doc.pipe(res);

  // ---- Header ----
  doc
    .fontSize(20)
    .text("DELIVERY CHALLAN / INVOICE", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .text(`Challan No: ${challan.challanNumber}`, { continued: false })
    .text(`Date: ${new Date(challan.createdAt).toLocaleDateString("en-IN")}`)
    .text(`Status: ${challan.status}`)
    .moveDown(1);

  // ---- Customer block ----
  doc.fontSize(12).text("Bill To:", { underline: true }).moveDown(0.3);
  doc.fontSize(10);
  doc.text(challan.customer.name);
  if (challan.customer.businessName) doc.text(challan.customer.businessName);
  if (challan.customer.address) doc.text(challan.customer.address);
  doc.text(`Mobile: ${challan.customer.mobile}`);
  if (challan.customer.email) doc.text(`Email: ${challan.customer.email}`);
  if (challan.customer.gstNumber) doc.text(`GSTIN: ${challan.customer.gstNumber}`);
  doc.moveDown(1.5);

  // ---- Items table ----
  const tableTop = doc.y;
  const colX = { sno: 50, name: 80, sku: 260, qty: 350, price: 410, total: 480 };

  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("#", colX.sno, tableTop);
  doc.text("Product", colX.name, tableTop);
  doc.text("SKU", colX.sku, tableTop);
  doc.text("Qty", colX.qty, tableTop);
  doc.text("Unit Price", colX.price, tableTop);
  doc.text("Total", colX.total, tableTop);

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(545, tableTop + 15)
    .stroke();

  doc.font("Helvetica");
  let y = tableTop + 22;
  let grandTotal = 0;

  challan.items.forEach((item, idx) => {
    const unitPrice = Number(item.unitPrice);
    const lineTotal = unitPrice * item.quantity;
    grandTotal += lineTotal;

    doc.text(String(idx + 1), colX.sno, y);
    doc.text(item.productName, colX.name, y, { width: 170 });
    doc.text(item.productSku, colX.sku, y);
    doc.text(String(item.quantity), colX.qty, y);
    doc.text(unitPrice.toFixed(2), colX.price, y);
    doc.text(lineTotal.toFixed(2), colX.total, y);

    y += 20;
  });

  doc.moveTo(50, y).lineTo(545, y).stroke();
  y += 10;

  doc.font("Helvetica-Bold");
  doc.text(`Total Quantity: ${challan.totalQuantity}`, colX.sno, y);
  doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, colX.total - 40, y);

  doc.moveDown(3);
  doc
    .font("Helvetica")
    .fontSize(8)
    .text("This is a system-generated document.", 50, doc.y, { align: "center" });

  doc.end();
}