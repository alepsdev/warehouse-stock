
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search,
  Box
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Product, Movement } from "@/types";
import { getProducts, saveProducts, getMovements, saveMovements } from "@/utils/csv-service";
import { toast } from "@/components/ui/sonner";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [productNameFilter, setProductNameFilter] = useState<string>("");
  

  useEffect(() => {
    const loadedProducts = getProducts();
    const loadedMovements = getMovements();
    setProducts(loadedProducts);
    setMovements(loadedMovements);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productSuggestions = products.filter(product =>
    product.name.toLowerCase().includes(productNameFilter.toLowerCase())
  );
  
  const handleAddInventory = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }
    
    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id
        ? { ...p, quantity: p.quantity + quantity, updatedAt: new Date().toISOString() }
        : p
    );
    
    const newMovement: Movement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: "ADD",
      quantity,
      date: new Date().toISOString(),
      notes: notes || "Stock addition"
    };
    
    saveProducts(updatedProducts);
    saveMovements([...movements, newMovement]);
    
    setProducts(updatedProducts);
    setMovements([...movements, newMovement]);

    resetForm();
    setShowAddDialog(false);
    toast.success(`Added ${quantity} ${selectedProduct.name} to inventory`);
  };
  
  const handleRemoveInventory = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }
    
    if (selectedProduct.quantity < quantity) {
      toast.error(`Not enough stock. Only ${selectedProduct.quantity} available.`);
      return;
    }
    
    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id
        ? { ...p, quantity: p.quantity - quantity, updatedAt: new Date().toISOString() }
        : p
    );
    
    const newMovement: Movement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: "REMOVE",
      quantity,
      date: new Date().toISOString(),
      notes: notes || "Stock removal"
    };

    saveProducts(updatedProducts);
    saveMovements([...movements, newMovement]);
    
    setProducts(updatedProducts);
    setMovements([...movements, newMovement]);

    resetForm();
    setShowRemoveDialog(false);
    toast.success(`Removed ${quantity} ${selectedProduct.name} from inventory`);
  };
  
  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setNotes("");
    setProductNameFilter("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-warehouse-900">Inventory Control</h1>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <ArrowUpCircle className="mr-2 h-5 w-5" />
          Add Inventory
        </Button>
        
        <Button
          onClick={() => setShowRemoveDialog(true)}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          <ArrowDownCircle className="mr-2 h-5 w-5" />
          Remove Inventory
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search products..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Products Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="bg-warehouse-50 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <span className="text-xs bg-warehouse-200 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">In Stock:</p>
                  <p className={`text-2xl font-bold ${product.quantity < 5 ? 'text-amber-600' : 'text-warehouse-700'}`}>
                    {product.quantity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowAddDialog(true);
                    }}
                  >
                    Add
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-warehouse-700"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowRemoveDialog(true);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
            <Box className="h-12 w-12 text-gray-300 mb-2" />
            <h3 className="font-medium">No products found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
      
      {/* Add Inventory Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory</DialogTitle>
            <DialogDescription>
              Add items to your inventory stock
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Product</Label>
              <Command className="border rounded-md">
                <CommandInput 
                  placeholder="Search for a product..." 
                  value={productNameFilter}
                  onValueChange={setProductNameFilter}
                />
                <CommandList>
                  <CommandEmpty>No products found</CommandEmpty>
                  <CommandGroup heading="Products">
                    {productSuggestions.map(product => (
                      <CommandItem 
                        key={product.id}
                        onSelect={() => {
                          setSelectedProduct(product);
                          setProductNameFilter(product.name);
                        }}
                        className="cursor-pointer"
                      >
                        {product.name}
                        <span className="ml-2 text-muted-foreground text-xs">
                          ({product.quantity} in stock)
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            
            {selectedProduct && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="add-quantity">Quantity</Label>
                  <Input
                    id="add-quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-notes">Notes (Optional)</Label>
                  <Textarea
                    id="add-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any notes about this inventory addition"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddInventory}
              className="bg-green-600 hover:bg-green-700"
            >
              Add to Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Remove Inventory Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Inventory</DialogTitle>
            <DialogDescription>
              Remove items from your inventory stock
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Product</Label>
              <Command className="border rounded-md">
                <CommandInput 
                  placeholder="Search for a product..." 
                  value={productNameFilter}
                  onValueChange={setProductNameFilter}
                />
                <CommandList>
                  <CommandEmpty>No products found</CommandEmpty>
                  <CommandGroup heading="Products">
                    {productSuggestions.map(product => (
                      <CommandItem 
                        key={product.id}
                        onSelect={() => {
                          setSelectedProduct(product);
                          setProductNameFilter(product.name);
                        }}
                        className="cursor-pointer"
                      >
                        {product.name}
                        <span className="ml-2 text-muted-foreground text-xs">
                          ({product.quantity} in stock)
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            
            {selectedProduct && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="remove-quantity">Quantity</Label>
                  <Input
                    id="remove-quantity"
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available stock: {selectedProduct.quantity}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="remove-notes">Notes (Optional)</Label>
                  <Textarea
                    id="remove-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any notes about this inventory removal"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRemoveDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRemoveInventory}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove from Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
