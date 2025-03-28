
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';
import ProductGrid from '@/components/pos/ProductGrid';
import Cart from '@/components/pos/Cart';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, List, Grid } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>(sampleProducts);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const { user, isLoading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-pos-gray">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
              onClick={toggleSidebar}
            />
          )}

          <main
            className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
              isSidebarOpen ? 'lg:ml-64' : ''
            }`}
          >
            <div className="grid h-full grid-cols-1 gap-4 p-4">
              <div className="card-container">
                <div className="mb-4 flex justify-between items-center">
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'table' | 'grid')}>
                    <ToggleGroupItem value="table" aria-label="Table view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <ProductGrid 
                  products={products} 
                  onProductSelect={handleProductSelect} 
                  viewMode={viewMode}
                  showSku={false}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Cart Button */}
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerTrigger asChild>
          <button 
            className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-pos-blue text-white shadow-lg hover:bg-pos-blue/90 transition-colors"
            aria-label="Open Cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pos-danger text-xs font-bold text-white">
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
    </div>
  );
};

export default Index;
