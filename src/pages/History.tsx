import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calendar,
  Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Movement } from "@/types";
import { getMovements, exportCSV } from "@/utils/csv-service";
import { generateMovementsPDF } from "@/utils/pdf-service";

const History: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'add' | 'remove'>('all');
  
  useEffect(() => {
    const loadedMovements = getMovements();
    setMovements(loadedMovements);
  }, []);
  
  const filteredMovements = movements
    .filter(movement => 
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(movement => {
      if (filter === 'all') return true;
      if (filter === 'add') return movement.type === 'ADD';
      if (filter === 'remove') return movement.type === 'REMOVE';
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const groupedByDate = filteredMovements.reduce<Record<string, Movement[]>>((groups, movement) => {
    const date = new Date(movement.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(movement);
    return groups;
  }, {});
  
  const handleGeneratePDF = () => {
    generateMovementsPDF(movements);
  };
  
  const handleExportCSV = () => {
    exportCSV(movements, "warehouse-movements-history.csv");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-warehouse-900">Histórico de Movimentações</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            Exportar CSV
          </Button>
          <Button 
            size="sm" 
            className="bg-warehouse-700"
            onClick={handleGeneratePDF}
          >
            Gerar PDF
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Buscar movimentações..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="add">Entradas</TabsTrigger>
            <TabsTrigger value="remove">Saídas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.length > 0 ? (
                filteredMovements.map(movement => (
                  <TableRow key={movement.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(movement.date).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium">{movement.productName}</TableCell>
                    <TableCell className="text-center">
                      {movement.type === 'ADD' ? (
                        <span className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs">
                          <ArrowUpCircle size={12} className="mr-1" />
                          Entrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs">
                          <ArrowDownCircle size={12} className="mr-1" />
                          Saída
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">{movement.quantity}</TableCell>
                    <TableCell className="max-w-xs truncate">{movement.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum histórico de movimentação encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Visualização em Linha do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedByDate).length > 0 ? (
              Object.entries(groupedByDate).map(([date, dayMovements]) => (
                <div key={date} className="border-l-2 border-warehouse-200 pl-6 ml-3 relative">
                  <div className="absolute top-0 -left-3 w-6 h-6 rounded-full bg-warehouse-700 flex items-center justify-center text-white">
                    <Calendar size={14} />
                  </div>
                  <div className="mb-4">
                    <h3 className="text-md font-semibold">{date}</h3>
                    <p className="text-xs text-muted-foreground">
                      {dayMovements.length} movimentação{dayMovements.length > 1 ? 'ões' : ''}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {dayMovements.map(movement => (
                      <div 
                        key={movement.id}
                        className="p-3 border rounded-md bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {movement.type === 'ADD' ? (
                            <div className="bg-green-100 p-2 rounded-full">
                              <ArrowUpCircle size={16} className="text-green-700" />
                            </div>
                          ) : (
                            <div className="bg-red-100 p-2 rounded-full">
                              <ArrowDownCircle size={16} className="text-red-700" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {movement.type === 'ADD' ? 'Entrada' : 'Saída'} {movement.quantity} x {movement.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(movement.date).toLocaleTimeString('pt-BR')}
                              {movement.notes && ` - ${movement.notes}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Nenhum histórico de movimentação encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
