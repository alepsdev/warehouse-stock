
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, ArrowDownCircle, ArrowUpCircle, AlertTriangle } from "lucide-react";
import { getProducts, getMovements } from "@/utils/csv-service";
import { Product, Movement } from "@/types";

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalItems: 0,
    lowStock: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    const productData = getProducts();
    const movementData = getMovements();
    
    setProducts(productData);
    setMovements(movementData);
    
    const totalItems = productData.reduce((sum, p) => sum + p.quantity, 0);
    const lowStock = productData.filter(p => p.quantity < 5).length;
    const recentActivity = movementData.filter(
      m => new Date(m.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    setStats({
      totalProducts: productData.length,
      totalItems,
      lowStock,
      recentActivity,
    });
  }, []);

  const recentMovements = movements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-warehouse-900">Painel de Controle</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
              </div>
              <Boxes size={28} className="text-warehouse-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Itens</p>
                <p className="text-3xl font-bold">{stats.totalItems}</p>
              </div>
              <Boxes size={28} className="text-warehouse-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produtos com Baixo Estoque</p>
                <p className="text-3xl font-bold">{stats.lowStock}</p>
              </div>
              <AlertTriangle size={28} className="text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Movimentações Recentes</p>
                <p className="text-3xl font-bold">{stats.recentActivity}</p>
              </div>
              <div className="flex gap-1">
                <ArrowUpCircle size={16} className="text-green-500" />
                <ArrowDownCircle size={16} className="text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMovements.length > 0 ? (
            <div className="space-y-4">
              {recentMovements.map(movement => (
                <div key={movement.id} className="flex items-start gap-4 border-b pb-3 last:border-0">
                  <div className={`mt-1 p-2 rounded-full ${movement.type === 'ADD' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {movement.type === 'ADD' ? (
                      <ArrowUpCircle size={20} className="text-green-600" />
                    ) : (
                      <ArrowDownCircle size={20} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {movement.type === 'ADD' ? 'Adicionado' : 'Removido'} {movement.quantity} x {movement.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(movement.date).toLocaleString('pt-BR')}
                    </p>
                    {movement.notes && (
                      <p className="text-sm mt-1">{movement.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma atividade recente</p>
          )}
        </CardContent>
      </Card>
      
      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <Card className="border-amber-300">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-amber-800 text-lg font-semibold flex items-center gap-2">
              <AlertTriangle size={18} />
              Alerta de Baixo Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="divide-y">
              {products.filter(p => p.quantity < 5).map(product => (
                <li key={product.id} className="py-2 flex justify-between">
                  <span>{product.name}</span>
                  <span className="font-medium">{product.quantity} em estoque</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
