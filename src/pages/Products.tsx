
import React, { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Trash, Plus, Upload, AlertCircle, Tag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/lib/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [columnMappings, setColumnMappings] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Classic T-Shirt',
      price: 19.99,
      category: 'Clothing',
      inStock: 45,
      sku: 'TS-001',
      costPrice: 10.50,
      taxRate: 7.5
    },
    {
      id: '2',
      name: 'Bluetooth Headphones',
      price: 79.99,
      category: 'Electronics',
      inStock: 12,
      sku: 'EL-002',
      costPrice: 45.00,
      taxRate: 7.5
    },
    {
      id: '3',
      name: 'Coffee Mug',
      price: 12.99,
      category: 'Kitchenware',
      inStock: 38,
      sku: 'KW-003',
      costPrice: 5.25,
      taxRate: 7.5
    },
    {
      id: '4',
      name: 'Notebook',
      price: 4.99,
      category: 'Stationery',
      inStock: 120,
      sku: 'ST-004',
      costPrice: 1.50,
      taxRate: 7.5
    }
  ]);

  const [productTags, setProductTags] = useState<Record<string, string[]>>({
    '1': ['New', 'Sale'],
    '2': ['Premium'],
    '4': ['Eco-friendly']
  });

  const [newProduct, setNewProduct] = useState<{
    name: string;
    price: number;
    category: string;
    inStock: number;
    sku?: string;
    barcode?: string;
    costPrice?: number;
    taxRate?: number;
  }>({
    name: '',
    price: 0,
    category: '',
    inStock: 0
  });

  const categories = [...new Set(products.map(product => product.category))];

  const handleAddProduct = () => {
    const product: Product = {
      id: Math.random().toString(36).substring(2, 9),
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      inStock: newProduct.inStock,
      sku: newProduct.sku,
      barcode: newProduct.barcode,
      costPrice: newProduct.costPrice,
      taxRate: newProduct.taxRate
    };
    
    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      price: 0,
      category: '',
      inStock: 0
    });
    setIsAddProductOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, just show a toast
      setIsImportModalOpen(true);
      // In a real implementation, we would parse the file here
      // and then show the column mapping dialog
    }
  };

  const handleImportConfirm = () => {
    // This would process the file with the column mappings
    toast.success('Products imported successfully');
    setIsImportModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !selectedProductId) return;
    
    setProductTags(prev => {
      const existingTags = prev[selectedProductId] || [];
      return {
        ...prev,
        [selectedProductId]: [...existingTags, newTag]
      };
    });
    
    setNewTag('');
    setIsTagModalOpen(false);
    toast.success(`Tag "${newTag}" added to product`);
  };

  const handleTagProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsTagModalOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.barcode?.includes(searchTerm);
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    const usd = `$${amount.toFixed(2)}`;
    const riel = `៛${Math.round(amount * 4100)}`; // Assuming 1 USD = 4100 Riel
    return `${usd} (${riel})`;
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select onValueChange={setSelectedCategory} value={selectedCategory || ''}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button className="gap-1" onClick={() => setIsAddProductOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
              
              <Button variant="outline" className="gap-1 relative" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
                <span className="sr-only">Import Products</span>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".csv,.xlsx,.xls" 
                  onChange={handleFileUpload}
                />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.sku || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(productTags[product.id] || []).map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-secondary/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => toast.info(`Edit ${product.name}`)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleTagProduct(product.id)}>
                          <Tag className="h-4 w-4" />
                          <span className="sr-only">Tag</span>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => toast.info(`Delete ${product.name}`)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No products found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Add Product Dialog */}
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.price || ''} 
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  list="categories"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU (Optional)</Label>
                <Input 
                  id="sku" 
                  value={newProduct.sku || ''} 
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode (Optional)</Label>
                <Input 
                  id="barcode" 
                  value={newProduct.barcode || ''} 
                  onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="costPrice">Cost Price (Optional)</Label>
                  <Input 
                    id="costPrice" 
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.costPrice || ''} 
                    onChange={(e) => setNewProduct({...newProduct, costPrice: parseFloat(e.target.value) || undefined})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taxRate">Tax Rate % (Optional)</Label>
                  <Input 
                    id="taxRate" 
                    type="number"
                    min="0"
                    step="0.1"
                    value={newProduct.taxRate || ''} 
                    onChange={(e) => setNewProduct({...newProduct, taxRate: parseFloat(e.target.value) || undefined})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddProduct} 
                disabled={!newProduct.name || !newProduct.category || newProduct.price <= 0}
              >
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import CSV/Excel Dialog */}
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Map Columns from File</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nameColumn">Product Name Column</Label>
                <Select 
                  onValueChange={(value) => setColumnMappings({...columnMappings, name: value})}
                  value={columnMappings.name}
                >
                  <SelectTrigger id="nameColumn">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Column A</SelectItem>
                    <SelectItem value="B">Column B</SelectItem>
                    <SelectItem value="C">Column C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="categoryColumn">Category Column</Label>
                <Select 
                  onValueChange={(value) => setColumnMappings({...columnMappings, category: value})}
                  value={columnMappings.category}
                >
                  <SelectTrigger id="categoryColumn">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Column A</SelectItem>
                    <SelectItem value="B">Column B</SelectItem>
                    <SelectItem value="C">Column C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priceColumn">Price Column</Label>
                <Select 
                  onValueChange={(value) => setColumnMappings({...columnMappings, price: value})}
                  value={columnMappings.price}
                >
                  <SelectTrigger id="priceColumn">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Column A</SelectItem>
                    <SelectItem value="B">Column B</SelectItem>
                    <SelectItem value="C">Column C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Please select the columns that match your file structure.</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleImportConfirm}
                disabled={!columnMappings.name || !columnMappings.category || !columnMappings.price}
              >
                Import Products
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Tag Dialog */}
        <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Tag</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddTag} className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
