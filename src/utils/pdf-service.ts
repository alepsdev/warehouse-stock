import { Product, Movement } from "../types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Add type declaration for jspdf-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Helper to format date/time
const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString();
};

// PDF generation result type
export type PDFResult = {
  blob: Blob;
  url: string;
};

// Core PDF save/download logic
const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate inventory report PDF
export const generateInventoryPDF = (
  products: Product[],
  options?: {
    filename?: string;
    onSuccess?: (result: PDFResult) => void;
    onError?: (error: unknown) => void;
  }
): void => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Warehouse - Inventory Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${formatDateTime(new Date())}`, 14, 30);
    doc.autoTable({
      startY: 35,
      head: [['ID', 'Name', 'Quantity', 'Category', 'Description']],
      body: products.map(product => [
        product.id,
        product.name,
        product.quantity,
        product.category,
        product.description
      ]),
      theme: 'striped',
      headStyles: { fillColor: [40, 115, 160] }
    });
    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
    const totalProducts = products.length;
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text(`Total Products: ${totalProducts}`, 14, finalY + 10);
    doc.text(`Total Items in Stock: ${totalItems}`, 14, finalY + 18);
    const filename = options?.filename || "warehouse-inventory-report.pdf";
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    downloadPDF(blob, filename);
    options?.onSuccess?.({ blob, url });
  } catch (error) {
    options?.onError?.(error);
    // Optionally, you can log or handle error here
  }
};

// Generate movement history report PDF
export const generateMovementsPDF = (
  movements: Movement[],
  options?: {
    filename?: string;
    onSuccess?: (result: PDFResult) => void;
    onError?: (error: unknown) => void;
  }
): void => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Warehouse - Movement History Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${formatDateTime(new Date())}`, 14, 30);
    doc.autoTable({
      startY: 35,
      head: [['Date', 'Product', 'Type', 'Quantity', 'Notes']],
      body: movements.map(movement => [
        formatDateTime(movement.date),
        movement.productName,
        movement.type,
        movement.quantity,
        movement.notes
      ]),
      theme: 'striped',
      headStyles: { fillColor: [40, 115, 160] }
    });
    const addedItems = movements
      .filter(m => m.type === 'ADD')
      .reduce((sum, m) => sum + m.quantity, 0);
    const removedItems = movements
      .filter(m => m.type === 'REMOVE')
      .reduce((sum, m) => sum + m.quantity, 0);
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text(`Total Added Items: ${addedItems}`, 14, finalY + 10);
    doc.text(`Total Removed Items: ${removedItems}`, 14, finalY + 18);
    doc.text(`Net Change: ${addedItems - removedItems}`, 14, finalY + 26);
    const filename = options?.filename || "warehouse-movement-history.pdf";
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    downloadPDF(blob, filename);
    options?.onSuccess?.({ blob, url });
  } catch (error) {
    options?.onError?.(error);
    // Optionally, you can log or handle error here
  }
};
