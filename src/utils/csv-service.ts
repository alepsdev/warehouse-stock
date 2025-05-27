import { Product, Movement } from "../types";
import { toast } from "@/components/ui/sonner";

const DEFAULT_PRODUCTS: Product[] = [
  // 1. Chapas
  {
    id: "1",
    name: "MDF 15mm Branco",
    quantity: 20,
    description: "Chapa de MDF 15mm acabamento branco",
    category: "Chapas",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "MDF 18mm Cru",
    quantity: 15,
    description: "Chapa de MDF 18mm acabamento cru",
    category: "Chapas",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 2. Ferragens
  {
    id: "3",
    name: "Dobradiça com amortecimento",
    quantity: 50,
    description: "Dobradiça para porta de armário com amortecimento",
    category: "Ferragens",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Corrediça telescópica",
    quantity: 30,
    description: "Corrediça telescópica para gaveta",
    category: "Ferragens",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Puxador metálico",
    quantity: 40,
    description: "Puxador metálico para gaveta",
    category: "Ferragens",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Suporte mão francesa",
    quantity: 25,
    description: "Suporte tipo mão francesa para prateleira",
    category: "Ferragens",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
    name: "Fecho magnético",
    quantity: 60,
    description: "Fecho magnético para porta",
    category: "Ferragens",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 3. Fixadores e Acessórios
  {
    id: "8",
    name: "Parafuso 4x40mm",
    quantity: 200,
    description: "Parafuso Philips 4x40mm",
    category: "Fixadores e Acessórios",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "9",
    name: "Cavilha de madeira",
    quantity: 150,
    description: "Cavilha de madeira 8mm",
    category: "Fixadores e Acessórios",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "10",
    name: "Cola branca",
    quantity: 10,
    description: "Cola branca PVA para madeira",
    category: "Fixadores e Acessórios",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "11",
    name: "Cola instantânea (super-bonder)",
    quantity: 8,
    description: "Cola instantânea para pequenos reparos",
    category: "Fixadores e Acessórios",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 4. Revestimentos e Acabamentos
  {
    id: "12",
    name: "Fita de borda",
    quantity: 100,
    description: "Fita de borda PVC branca",
    category: "Revestimentos e Acabamentos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 5. Componentes Elétricos
  {
    id: "13",
    name: "Fita de LED",
    quantity: 12,
    description: "Fita de LED 5m 12V",
    category: "Componentes Elétricos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "14",
    name: "Fonte para LED",
    quantity: 6,
    description: "Fonte 12V para fita de LED",
    category: "Componentes Elétricos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 7. Insumos Gerais
  {
    id: "15",
    name: "Lixa 120",
    quantity: 30,
    description: "Lixa grão 120 para madeira",
    category: "Insumos Gerais",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "16",
    name: "Estopa",
    quantity: 5,
    description: "Estopa para limpeza",
    category: "Insumos Gerais",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "17",
    name: "Óleo para lubrificação",
    quantity: 2,
    description: "Óleo multiuso para lubrificação",
    category: "Insumos Gerais",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_MOVEMENTS: Movement[] = [
  {
    id: "1",
    productId: "1",
    productName: "MDF 15mm Branco",
    type: "ADD",
    quantity: 10,
    date: new Date().toISOString(),
    notes: "Entrada inicial de MDF 15mm Branco"
  },
  {
    id: "2",
    productId: "3",
    productName: "Dobradiça com amortecimento",
    type: "ADD",
    quantity: 20,
    date: new Date().toISOString(),
    notes: "Compra de ferragens"
  },
  {
    id: "3",
    productId: "8",
    productName: "Parafuso 4x40mm",
    type: "ADD",
    quantity: 100,
    date: new Date().toISOString(),
    notes: "Reposição de parafusos"
  },
  {
    id: "4",
    productId: "12",
    productName: "Fita de borda",
    type: "ADD",
    quantity: 50,
    date: new Date().toISOString(),
    notes: "Compra de fitas de borda"
  },
  {
    id: "5",
    productId: "15",
    productName: "Lixa 120",
    type: "ADD",
    quantity: 10,
    date: new Date().toISOString(),
    notes: "Entrada de insumos gerais"
  },
  {
    id: "6",
    productId: "1",
    productName: "MDF 15mm Branco",
    type: "REMOVE",
    quantity: 2,
    date: new Date().toISOString(),
    notes: "Uso em projeto de armário"
  },
  {
    id: "7",
    productId: "3",
    productName: "Dobradiça com amortecimento",
    type: "REMOVE",
    quantity: 5,
    date: new Date().toISOString(),
    notes: "Montagem de porta de armário"
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
