
import { Product, Movement } from "../types";
import { toast } from "@/components/ui/sonner";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Add type declaration for jspdf-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Generate inventory report PDF
export const generateInventoryPDF = (products: Product[]): void => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Warehouse - Inventory Report", 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add table
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
    
    // Add summary info
    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
    const totalProducts = products.length;
    
    doc.setFontSize(12);
    doc.text(`Total Products: ${totalProducts}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Items in Stock: ${totalItems}`, 14, doc.autoTable.previous.finalY + 18);
    
    // Save the PDF
    doc.save("warehouse-inventory-report.pdf");
    toast.success("Inventory report generated successfully");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Error generating PDF report');
  }
};

// Generate movement history report PDF
export const generateMovementsPDF = (movements: Movement[]): void => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Warehouse - Movement History Report", 14, 22);
    
    // Add date range
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add table
    doc.autoTable({
      startY: 35,
      head: [['Date', 'Product', 'Type', 'Quantity', 'Notes']],
      body: movements.map(movement => [
        new Date(movement.date).toLocaleString(),
        movement.productName,
        movement.type,
        movement.quantity,
        movement.notes
      ]),
      theme: 'striped',
      headStyles: { fillColor: [40, 115, 160] }
    });
    
    // Add summary info
    const addedItems = movements
      .filter(m => m.type === 'ADD')
      .reduce((sum, m) => sum + m.quantity, 0);
      
    const removedItems = movements
      .filter(m => m.type === 'REMOVE')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    doc.setFontSize(12);
    doc.text(`Total Added Items: ${addedItems}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Removed Items: ${removedItems}`, 14, doc.autoTable.previous.finalY + 18);
    doc.text(`Net Change: ${addedItems - removedItems}`, 14, doc.autoTable.previous.finalY + 26);
    
    // Save the PDF
    doc.save("warehouse-movement-history.pdf");
    toast.success("Movement history report generated successfully");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Error generating PDF report');
  }
};
