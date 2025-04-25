import { Product, Movement } from "../types";
import { toast } from "@/components/ui/sonner";

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wooden Cabinet",
    quantity: 10,
    description: "Premium oak wood cabinet",
    category: "Storage",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Office Desk",
    quantity: 5,
    description: "Ergonomic office desk with drawer",
    category: "Office",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Dining Table",
    quantity: 8,
    description: "Extendable dining table for 6-8 people",
    category: "Dining",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_MOVEMENTS: Movement[] = [
  {
    id: "1",
    productId: "1",
    productName: "Wooden Cabinet",
    type: "ADD",
    quantity: 10,
    date: new Date().toISOString(),
    notes: "Initial stock"
  },
  {
    id: "2",
    productId: "2",
    productName: "Office Desk",
    type: "ADD",
    quantity: 5,
    date: new Date().toISOString(),
    notes: "Initial stock"
  },
  {
    id: "3",
    productId: "3",
    productName: "Dining Table",
    type: "ADD",
    quantity: 8,
    date: new Date().toISOString(),
    notes: "Initial stock"
  }
];

const arrayToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item).map(val => 
      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
};

const csvToArray = <T>(csv: string): T[] => {
  if (!csv) return [];
  
  const lines = csv.split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    
    headers.forEach((header, i) => {
      let value = values[i] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replace(/""/g, '"');
      }
      const numValue = Number(value);
      obj[header] = !isNaN(numValue) && value !== '' && !value.startsWith('0') ? 
        numValue : value;
    });
    
    return obj as T;
  });
};

export const getProducts = (): Product[] => {
  try {
    const productsData = localStorage.getItem('products');
    if (!productsData) {
      const csv = arrayToCSV(DEFAULT_PRODUCTS);
      localStorage.setItem('products', csv);
      return DEFAULT_PRODUCTS;
    }
    return csvToArray<Product>(productsData);
  } catch (error) {
    console.error('Error loading products:', error);
    toast.error('Error loading products data');
    return [];
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    const csv = arrayToCSV(products);
    localStorage.setItem('products', csv);
  } catch (error) {
    console.error('Error saving products:', error);
    toast.error('Error saving products data');
  }
};

export const getMovements = (): Movement[] => {
  try {
    const movementsData = localStorage.getItem('movements');
    if (!movementsData) {
      const csv = arrayToCSV(DEFAULT_MOVEMENTS);
      localStorage.setItem('movements', csv);
      return DEFAULT_MOVEMENTS;
    }
    return csvToArray<Movement>(movementsData);
  } catch (error) {
    console.error('Error loading movements:', error);
    toast.error('Error loading movement history');
    return [];
  }
};

export const saveMovements = (movements: Movement[]): void => {
  try {
    const csv = arrayToCSV(movements);
    localStorage.setItem('movements', csv);
  } catch (error) {
    console.error('Error saving movements:', error);
    toast.error('Error saving movement history');
  }
};

export const exportCSV = (data: any[], filename: string): void => {
  try {
    const csv = arrayToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.error('Error generating CSV file');
  }
};
