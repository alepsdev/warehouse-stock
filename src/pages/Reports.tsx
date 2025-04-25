
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Product, Movement } from "@/types";
import { getProducts, getMovements, exportCSV } from "@/utils/csv-service";
import { generateInventoryPDF, generateMovementsPDF } from "@/utils/pdf-service";

const Reports: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  
  useEffect(() => {
    const productData = getProducts();
    const movementData = getMovements();
    
    setProducts(productData);
    setMovements(movementData);
  }, []);
  
  const handleInventoryReport = () => {
    generateInventoryPDF(products);
  };
  
  const handleMovementsReport = () => {
    generateMovementsPDF(movements);
  };
  
  const handleExportProductsCSV = () => {
    exportCSV(products, "warehouse-products.csv");
  };
  
  const handleExportMovementsCSV = () => {
    exportCSV(movements, "warehouse-movements.csv");
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-warehouse-900">Relatórios</h1>
      
      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Relatório de Estoque
            </CardTitle>
            <CardDescription>
              Gere um relatório completo do seu estoque atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Total de Produtos:</span>
                <span>{products.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Total de Itens:</span>
                <span>{products.reduce((sum, p) => sum + p.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Itens com Baixo Estoque:</span>
                <span>{products.filter(p => p.quantity < 5).length}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={handleExportProductsCSV}
              >
                <Download size={16} className="mr-1" />
                CSV
              </Button>
              <Button 
                onClick={handleInventoryReport}
                size="sm"
                className="flex-1 bg-warehouse-700"
              >
                <FileText size={16} className="mr-1" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Movement History Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Histórico de Movimentações
            </CardTitle>
            <CardDescription>
              Gere um relatório de todas as movimentações do estoque
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Total de Movimentações:</span>
                <span>{movements.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Itens Adicionados:</span>
                <span>{movements.filter(m => m.type === 'ADD').reduce((sum, m) => sum + m.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Itens Removidos:</span>
                <span>{movements.filter(m => m.type === 'REMOVE').reduce((sum, m) => sum + m.quantity, 0)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={handleExportMovementsCSV}
              >
                <Download size={16} className="mr-1" />
                CSV
              </Button>
              <Button 
                onClick={handleMovementsReport}
                size="sm"
                className="flex-1 bg-warehouse-700"
              >
                <FileText size={16} className="mr-1" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>
            Clique em qualquer relatório para gerar em formato PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="p-4 border rounded-md hover:bg-warehouse-50 cursor-pointer transition-colors flex justify-between items-center"
              onClick={handleInventoryReport}
            >
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-warehouse-700" />
                <div>
                  <h3 className="font-medium">Relatório de Estoque Atual</h3>
                  <p className="text-sm text-muted-foreground">
                    Uma lista completa de todos os produtos em estoque com quantidades
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download size={16} />
              </Button>
            </div>
            
            <div 
              className="p-4 border rounded-md hover:bg-warehouse-50 cursor-pointer transition-colors flex justify-between items-center"
              onClick={handleMovementsReport}
            >
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-warehouse-700" />
                <div>
                  <h3 className="font-medium">Relatório de Histórico de Movimentações</h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe todas as entradas e saídas com datas e quantidades
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
