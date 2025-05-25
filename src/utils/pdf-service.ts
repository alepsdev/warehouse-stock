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

// Função para revogar a URL do PDF
export const revokePDFUrl = (url: string) => {
  URL.revokeObjectURL(url);
};

// Gera PDF simples de inventário e retorna URL para preview
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
    let y = 15;
    doc.setFontSize(16);
    doc.text("Relatório de Estoque", 10, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Gerado em: ${formatDateTime(new Date())}`, 10, y);
    y += 10;
    doc.setFontSize(12);
    products.forEach((product, idx) => {
      doc.text(
        `${idx + 1}. ${product.name} | Qtd: ${product.quantity} | Cat: ${product.category}`,
        10,
        y
      );
      y += 7;
      if (product.description) {
        doc.setFontSize(10);
        doc.text(`Descrição: ${product.description}`, 14, y);
        y += 6;
        doc.setFontSize(12);
      }
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });
    const filename = options?.filename || "relatorio-estoque.pdf";
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    options?.onSuccess?.({ blob, url });
  } catch (error) {
    options?.onError?.(error);
  }
};

// Gera PDF simples de movimentações e retorna URL para preview
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
    let y = 15;
    doc.setFontSize(16);
    doc.text("Histórico de Movimentações", 10, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Gerado em: ${formatDateTime(new Date())}`, 10, y);
    y += 10;
    doc.setFontSize(12);
    movements.forEach((m, idx) => {
      doc.text(
        `${idx + 1}. ${formatDateTime(m.date)} | ${m.productName} | ${m.type === 'ADD' ? 'Entrada' : 'Saída'} | Qtd: ${m.quantity}`,
        10,
        y
      );
      y += 7;
      if (m.notes) {
        doc.setFontSize(10);
        doc.text(`Obs: ${m.notes}`, 14, y);
        y += 6;
        doc.setFontSize(12);
      }
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });
    const filename = options?.filename || "relatorio-movimentacoes.pdf";
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    options?.onSuccess?.({ blob, url });
  } catch (error) {
    options?.onError?.(error);
  }
};
