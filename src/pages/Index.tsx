
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';
import ProductGrid from '@/components/pos/ProductGrid';
import Cart from '@/components/pos/Cart';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, List, Grid, Search } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';

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
  {
    id: '7',
    name: 'Ham and Cheese Sandwich',
    price: 6.5,
    category: 'Food',
    inStock: 8,
    sku: 'FOOD-001',
  },
  {
    id: '8',
    name: 'Turkey Club Sandwich',
    price: 7.5,
    category: 'Food',
    inStock: 10,
    sku: 'FOOD-002',
  },
  {
    id: '9',
    name: 'Caesar Salad',
    price: 8.0,
    category: 'Food',
    inStock: 5,
    sku: 'FOOD-003',
  },
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>(sampleProducts);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const { user, isLoading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleProductSelect = (product: Product) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      handleCartItemUpdate(product.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };

  const handleCartItemUpdate = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleCartItemRemove = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map((product) => product.category)));

  // Filter products by search term and selected categories
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm.trim() === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(product.category);
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Layout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 flex flex-col space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-2">
            {/* View mode toggle first */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">View:</span>
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'table' | 'grid')}>
                <ToggleGroupItem value="table" aria-label="View as table">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="View as grid">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {/* Category toggles */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product grid in a scrollable container */}
        <div className="flex-1 overflow-auto p-4">
          <ProductGrid 
            products={filteredProducts} 
            onProductSelect={handleProductSelect} 
            viewMode={viewMode}
            onViewModeChange={(mode) => setViewMode(mode as 'table' | 'grid')}
            showSku={false}
          />
        </div>
      </div>

      {/* Floating Cart Button */}
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerTrigger asChild>
          <button 
            className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            aria-label="Open Cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </DrawerTrigger>
        <DrawerContent className="h-[90vh]">
          <div className="h-full">
            <Cart
              items={cartItems}
              onItemUpdate={handleCartItemUpdate}
              onItemRemove={handleCartItemRemove}
              onClearCart={handleClearCart}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default Index;
