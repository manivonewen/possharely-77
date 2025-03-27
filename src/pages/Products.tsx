
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Product } from '@/lib/types';
import { Search, Plus, Edit, Trash2, Filter, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  inStock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  costPrice: z.coerce.number().positive("Cost price must be positive").optional(),
  taxRate: z.coerce.number().min(0).max(100, "Tax rate must be between 0 and 100").optional(),
});

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Coffee - Americano',
    price: 3.5,
    category: 'Beverages',
    inStock: 100,
    sku: 'BVRG-001',
  },
  {
    id: '2',
    name: 'Coffee - Latte',
    price: 4.5,
    category: 'Beverages',
    inStock: 100,
    sku: 'BVRG-002',
  },
  {
    id: '3',
    name: 'Espresso Shot',
    price: 2.5,
    category: 'Beverages',
    inStock: 100,
    sku: 'BVRG-003',
  },
  {
    id: '4',
    name: 'Croissant',
    price: 3.0,
    category: 'Bakery',
    inStock: 20,
    sku: 'BKY-001',
  },
  {
    id: '5',
    name: 'Chocolate Muffin',
    price: 3.5,
    category: 'Bakery',
    inStock: 15,
    sku: 'BKY-002',
  },
  {
    id: '6',
    name: 'Bagel with Cream Cheese',
    price: 4.0,
    category: 'Bakery',
    inStock: 12,
    sku: 'BKY-003',
  },
];

const categories = ['All', 'Beverages', 'Bakery', 'Food', 'Merchandise'];

const Products = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      category: '',
      inStock: 0,
      sku: '',
      barcode: '',
      costPrice: 0,
      taxRate: 0,
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    const newProduct: Product = {
      id: (products.length + 1).toString(),
      ...data,
    };
    
    setProducts([...products, newProduct]);
    setIsAddProductOpen(false);
    form.reset();
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  // Close sidebar on small screens when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial sidebar state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-pos-gray">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <main
          className={`flex flex-1 flex-col overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : ''
          }`}
        >
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-pos-dark">Products</h1>
              <p className="text-gray-500">Manage your product catalog</p>
            </div>
            
            <div className="mb-4 flex flex-col gap-4 sm:flex-row justify-between">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full pl-10"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Tag size={16} />
                      <span>Category: {selectedCategory}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map((category) => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={16} />
                      <span>Add Product</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new product to your inventory.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="inStock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>In Stock</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter category" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SKU (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="SKU code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="barcode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Barcode (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Barcode" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="costPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost Price (Optional)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="taxRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tax Rate % (Optional)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit">Add Product</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="card-container overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-pos-border">
                  <thead className="bg-pos-gray">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        In Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pos-border bg-white">
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {product.sku || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {product.category}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {product.inStock}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit size={16} className="text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <p>No products found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
