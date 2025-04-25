
import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import { Product } from "@/types";
import { getProducts, saveProducts } from "@/utils/csv-service";
import { toast } from "@/components/ui/sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    description: "",
    category: "",
  });

  useEffect(() => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
  }, []);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };
  
  const handleAddProduct = () => {
    if (products.some(p => p.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error(`A product with the name "${formData.name}" already exists`);
      return;
    }
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: formData.quantity,
      description: formData.description,
      category: formData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setShowAddDialog(false);
    resetForm();
    toast.success(`Added ${newProduct.name} to products`);
  };
  
  const handleUpdateProduct = () => {
    if (!currentProduct) return;
    
    if (products.some(p => 
      p.id !== currentProduct.id && 
      p.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      toast.error(`A product with the name "${formData.name}" already exists`);
      return;
    }
    
    const updatedProducts = products.map(p => 
      p.id === currentProduct.id
        ? { 
            ...p, 
            name: formData.name,
            description: formData.description,
            category: formData.category,
            quantity: formData.quantity,
            updatedAt: new Date().toISOString()
          }
        : p
    );
    
    saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setShowEditDialog(false);
    resetForm();
    toast.success(`Updated ${formData.name}`);
  };
  
  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.filter(p => p.id !== currentProduct.id);
    saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setShowDeleteDialog(false);
    toast.success(`Deleted ${currentProduct.name}`);
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      quantity: 0,
      description: "",
      category: "",
    });
    setCurrentProduct(null);
  };
  
  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      quantity: product.quantity,
      description: product.description,
      category: product.category,
    });
    setShowEditDialog(true);
  };
  
  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setShowDeleteDialog(true);
  };
  
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-warehouse-900">Produtos</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-warehouse-700">
          <Plus size={16} className="mr-2" />
          Adicionar Produto
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Buscar produtos..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Pencil size={14} className="mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(product)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
            <DialogDescription>Adicione um novo produto ao seu estoque</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                name="name"
                placeholder="Digite o nome do produto"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="Storage">Armazenamento</SelectItem>
                    <SelectItem value="Office">Escritório</SelectItem>
                    <SelectItem value="Dining">Sala de Jantar</SelectItem>
                    <SelectItem value="Living Room">Sala de Estar</SelectItem>
                    <SelectItem value="Bedroom">Quarto</SelectItem>
                    <SelectItem value="Kitchen">Cozinha</SelectItem>
                    <SelectItem value="Other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                placeholder="Digite a descrição do produto"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddProduct} className="bg-warehouse-700">Adicionar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>Modifique os detalhes do produto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Produto</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Digite o nome do produto"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantidade</Label>
                <Input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="Storage">Armazenamento</SelectItem>
                    <SelectItem value="Office">Escritório</SelectItem>
                    <SelectItem value="Dining">Sala de Jantar</SelectItem>
                    <SelectItem value="Living Room">Sala de Estar</SelectItem>
                    <SelectItem value="Bedroom">Quarto</SelectItem>
                    <SelectItem value="Kitchen">Cozinha</SelectItem>
                    <SelectItem value="Other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                name="description"
                placeholder="Digite a descrição do produto"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProduct} className="bg-warehouse-700">Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente{" "}
              <span className="font-semibold">{currentProduct?.name}</span> e
              removerá do seu inventário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
