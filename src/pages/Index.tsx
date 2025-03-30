import React, { useState } from 'react';
import { Product, CartItem } from '@/lib/types';
import ProductGrid from '@/components/pos/ProductGrid';
import Cart from '@/components/pos/Cart';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import PillBar from '@/components/PillBar';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Filter products by search term and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm.trim() === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="flex flex-col h-full overflow-hidden overflow-y-hidden">
        <div className="p-4">
          {/* Pill Bar */}
          <PillBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
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
        <DrawerContent className="h-[90vh] bottom-0 fixed w-full max-w-md mx-auto rounded-t-lg shadow-lg bg-white dark:bg-gray-800">
          <div className="h-full">
            <Cart
              cartItems={cartItems}
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
