
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';
import ProductGrid from '@/components/pos/ProductGrid';
import Cart from '@/components/pos/Cart';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import TelegramLogin from '@/components/auth/TelegramLogin';
import { Button } from '@/components/ui/button';

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
  const { user, isLoading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProductSelect = (product: Product) => {
    // Check if the product is already in the cart
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      // If the product is already in the cart, increment the quantity
      handleCartItemUpdate(product.id, existingItem.quantity + 1);
    } else {
      // Otherwise, add it to the cart with quantity 1
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

        <div className="flex flex-1 overflow-hidden">
          {/* Overlay for mobile when sidebar is open */}
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
            {!user && !isLoading && (
              <div className="flex justify-center items-center p-4 bg-white shadow rounded-lg m-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Login to Access POS</h2>
                  <p className="text-gray-600 mb-4">Please log in with your Telegram account to continue</p>
                  <div className="flex justify-center">
                    <TelegramLogin 
                      buttonSize="large"
                      showUserPic={true}
                      cornerRadius={8}
                    />
                  </div>
                </div>
              </div>
            )}

            {(user || isLoading) && (
              <div className="grid h-full grid-cols-1 gap-4 p-4 md:grid-cols-3">
                <div className="md:col-span-2 card-container">
                  <ProductGrid products={products} onProductSelect={handleProductSelect} />
                </div>

                <div className="card-container">
                  <Cart
                    items={cartItems}
                    onItemUpdate={handleCartItemUpdate}
                    onItemRemove={handleCartItemRemove}
                    onClearCart={handleClearCart}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
