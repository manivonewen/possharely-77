import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { InventoryItem } from '@/lib/types';
import { Search, Plus, Edit, Trash, Move, Tag, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import { useInventory } from '../contexts/inventoryContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTags } from '@/contexts/TagContext';
import PillBar from '@/components/PillBar';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState(''); // Track new category input
  const [isMoveCategoryDialogOpen, setIsMoveCategoryDialogOpen] = useState(false);
  const [selectedProductForMove, setSelectedProductForMove] = useState<InventoryItem | null>(null);
  const [price, setPrice] = useState('');
  const [confirmingAction, setConfirmingAction] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { settings } = useSettings();
  const { inventory, setInventory } = useInventory();
  const { tags } = useTags();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null); // Track expanded row
  const [newTag, setNewTag] = useState(''); // Track new tag input
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false); // Track search bar visibility
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
  const searchInputRef = useRef<HTMLInputElement | null>(null); // Ref for search input
  const [currentProduct, setCurrentProduct] = useState<InventoryItem | null>(null); // Track the product being edited
  const [editingProductId, setEditingProductId] = useState<string | null>(null); // Track the product being edited
  const [editedProduct, setEditedProduct] = useState<Partial<InventoryItem> | null>(null); // Track inline edits
  const [isTagRowVisible, setIsTagRowVisible] = useState(false); // Track visibility of tag row

  useEffect(() => {
    const fetchInventory = async () => {
      const data = [
        {
          id: '1',
          name: 'Coffee - Americano',
          price: 3.5,
          category: 'Beverages',
          inStock: 25,
          sku: 'BVRG-001',
          costPrice: 1.2,
          reorderPoint: 10,
          supplier: 'Coffee Suppliers Inc.',
          lastRestocked: new Date('2023-04-15'),
        },
        {
          id: '2',
          name: 'Coffee - Latte',
          price: 4.5,
          category: 'Beverages',
          inStock: 8,
          sku: 'BVRG-002',
          costPrice: 1.5,
          reorderPoint: 15,
          supplier: 'Coffee Suppliers Inc.',
          lastRestocked: new Date('2023-04-15'),
        },
        {
          id: '3',
          name: 'Espresso Shot',
          price: 2.5,
          category: 'Beverages',
          inStock: 30,
          sku: 'BVRG-003',
          costPrice: 0.8,
          reorderPoint: 20,
          supplier: 'Coffee Suppliers Inc.',
          lastRestocked: new Date('2023-04-10'),
        },
        {
          id: '4',
          name: 'Croissant',
          price: 3.0,
          category: 'Bakery',
          inStock: 12,
          sku: 'BKY-001',
          costPrice: 1.1,
          reorderPoint: 15,
          supplier: 'City Bakery',
          lastRestocked: new Date('2023-04-18'),
        },
        {
          id: '5',
          name: 'Chocolate Muffin',
          price: 3.5,
          category: 'Bakery',
          inStock: 5,
          sku: 'BKY-002',
          costPrice: 1.3,
          reorderPoint: 10,
          supplier: 'City Bakery',
          lastRestocked: new Date('2023-04-18'),
        },
        {
          id: '6',
          name: 'Bagel with Cream Cheese',
          price: 4.0,
          category: 'Bakery',
          inStock: 4,
          sku: 'BKY-003',
          costPrice: 1.5,
          reorderPoint: 8,
          supplier: 'City Bakery',
          lastRestocked: new Date('2023-04-16'),
        },
        {
          id: '7',
          name: 'Ham and Cheese Sandwich',
          price: 6.5,
          category: 'Food',
          inStock: 0,
          sku: 'FOOD-001',
          costPrice: 2.8,
          reorderPoint: 5,
          supplier: 'Fresh Foods Co.',
          lastRestocked: new Date('2023-04-12'),
        },
        {
          id: '8',
          name: 'Turkey Club Sandwich',
          price: 7.5,
          category: 'Food',
          inStock: 3,
          sku: 'FOOD-002',
          costPrice: 3.2,
          reorderPoint: 5,
          supplier: 'Fresh Foods Co.',
          lastRestocked: new Date('2023-04-12'),
        },
        {
          id: '9',
          name: 'Caesar Salad',
          price: 8.0,
          category: 'Food',
          inStock: 2,
          sku: 'FOOD-003',
          costPrice: 3.5,
          reorderPoint: 3,
          supplier: 'Fresh Foods Co.',
          lastRestocked: new Date('2023-04-14'),
        },
        {
          id: '10',
          name: 'Blueberry Muffin',
          price: 3.75,
          category: 'Bakery',
          inStock: 10,
          sku: 'BKY-004',
          costPrice: 1.4,
          reorderPoint: 8,
          supplier: 'City Bakery',
          lastRestocked: new Date('2023-04-19'),
        },
        {
          id: '11',
          name: 'Iced Coffee',
          price: 4.0,
          category: 'Beverages',
          inStock: 20,
          sku: 'BVRG-004',
          costPrice: 1.6,
          reorderPoint: 12,
          supplier: 'Coffee Suppliers Inc.',
          lastRestocked: new Date('2023-04-20'),
        },
        {
          id: '12',
          name: 'Bagel with Lox',
          price: 5.0,
          category: 'Bakery',
          inStock: 6,
          sku: 'BKY-005',
          costPrice: 2.0,
          reorderPoint: 5,
          supplier: 'City Bakery',
          lastRestocked: new Date('2023-04-21'),
        },
        {
          id: '13',
          name: 'Grilled Cheese Sandwich',
          price: 6.0,
          category: 'Food',
          inStock: 7,
          sku: 'FOOD-004',
          costPrice: 2.5,
          reorderPoint: 4,
          supplier: 'Fresh Foods Co.',
          lastRestocked: new Date('2023-04-22'),
        },
        {
          id: '14',
          name: 'Chicken Caesar Wrap',
          price: 7.0,
          category: 'Food',
          inStock: 5,
          sku: 'FOOD-005',
          costPrice: 3.0,
          reorderPoint: 3,
          supplier: 'Fresh Foods Co.',
          lastRestocked: new Date('2023-04-23'),
        },
        {
          id: '15',
          name: 'Hot Chocolate',
          price: 3.25,
          category: 'Beverages',
          inStock: 15,
          sku: 'BVRG-005',
          costPrice: 1.2,
          reorderPoint: 10,
          supplier: 'Coffee Suppliers Inc.',
          lastRestocked: new Date('2023-04-24'),
        },
        {
          id: '16',
          name: 'Apple Pie Slice',
          price: 4.5,
          category: 'Bakery',
          inStock: 8,
          sku: 'BKY-006',
          costPrice: 1.8,
          reorderPoint: 6,
          supplier: 'City Bakery',
          lastRestocked: new Date('2023-04-25'),
        },
        {
          id: '17',
          name: 'Veggie Burger',
          price: 8.5,
          category: 'Food',
          inStock: 4,
          sku: 'FOOD-006',
          costPrice: 4.0,
          reorderPoint: 2,
          supplier: 'Fresh Foods Co.',
          lastRestocked: new Date('2023-04-26'),
        },
      ];
      setInventory(data);
    };

    fetchInventory();
  }, [setInventory]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Show floating search icon after scrolling 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatCurrency = (amount: number) => {
    const usd = `$${amount.toFixed(2)}`;
    return `${usd}`;
  };

  const categories = Array.from(new Set(inventory.map((item) => item.category)));

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (newProduct: InventoryItem) => {
    setInventory((prev) => [...prev, newProduct]);
    setIsAddProductModalOpen(false);
  };

  const handleMoveProduct = (newCategory: string) => {
    if (selectedProductForMove) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === selectedProductForMove.id ? { ...item, category: newCategory } : item
        )
      );
      setSelectedProductForMove(null);
      setIsMoveCategoryDialogOpen(false);
    }
  };

  const handleConfirmAction = (productId: string, action: () => void) => {
    if (confirmingAction === productId) {
      action();
      setConfirmingAction(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      setConfirmingAction(productId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setConfirmingAction(null);
        timeoutRef.current = null;
      }, 3000); // Confirm icon visible for 3 seconds only
    }
  };

  const handleDeleteProduct = (id: string) => {
    setInventory((prev) => prev.filter((product) => product.id !== id));
  };

  const handleRowClick = (id: string, event: React.MouseEvent<HTMLTableRowElement>) => {
    // Prevent row click if the target is within the actions column
    if ((event.target as HTMLElement).closest('.actions-column')) return;
    setExpandedRowId((prev) => (prev === id ? null : id)); // Toggle row expansion
  };

  const handleFloatingIconClick = () => {
    if (isScrolled) {
      setIsSearchBarVisible(true);
      searchInputRef.current?.focus(); // Focus on the search input
    } else {
      setIsAddProductModalOpen(true);
    }
  };

  const handleEditProduct = (product: InventoryItem) => {
    setCurrentProduct(product); // Set the product to be edited
    setIsAddProductModalOpen(true); // Open the modal
  };

  const handleSaveProduct = () => {
    if (currentProduct) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === currentProduct.id ? currentProduct : item
        )
      );
      setCurrentProduct(null); // Clear the current product
      setIsAddProductModalOpen(false); // Close the modal
    }
  };

  const handleStartEditing = (product: InventoryItem) => {
    setEditingProductId(product.id);
    setEditedProduct({ ...product }); // Initialize with current product values
    setExpandedRowId(null); // Disable row expansion while editing
  };

  const handleConfirmEdit = () => {
    if (editingProductId && editedProduct) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === editingProductId ? { ...item, ...editedProduct } : item
        )
      );
      setEditingProductId(null);
      setEditedProduct(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct(null);
  };

  return (
    <Layout>
      <div className="p-6 overflow-y-hidden" style={{ marginTop: '-2.5em' }}>
        <div className="mt-8">
          {/* Pill Bar */}
          <PillBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <div className="card-container overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <>
                      <TableRow
                        key={item.id}
                        onClick={(e) => {
                          if (!editingProductId) handleRowClick(item.id, e); // Disable row expansion during editing
                        }}
                        className={`cursor-pointer ${
                          expandedRowId === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <TableCell>
                          {editingProductId === item.id ? (
                            <Input
                              value={editedProduct?.name || ''}
                              onChange={(e) =>
                                setEditedProduct((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="border-none bg-transparent focus:ring-0 focus:outline-none w-48" // Updated design
                            />
                          ) : (
                            item.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingProductId === item.id ? (
                            <Select
                              value={editedProduct?.category || ''}
                              onValueChange={(value) =>
                                setEditedProduct((prev) => ({
                                  ...prev,
                                  category: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            item.category
                          )}
                        </TableCell>
                        <TableCell>
                          {editingProductId === item.id ? (
                            <Input
                              type="number"
                              value={editedProduct?.price || ''}
                              onChange={(e) =>
                                setEditedProduct((prev) => ({
                                  ...prev,
                                  price: parseFloat(e.target.value) || 0,
                                }))
                              }
                              className="border-none bg-transparent focus:ring-0 focus:outline-none w-32" // Updated design
                            />
                          ) : (
                            formatCurrency(item.price)
                          )}
                        </TableCell>
                        <TableCell className="actions-column">
                          <div className="flex gap-2">
                            <button
                              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleEditProduct(item); // Open edit modal
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            {editingProductId === item.id ? (
                              <button
                                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click
                                  handleConfirmEdit(); // Confirm inline edit
                                }}
                              >
                                <Check size={16} />
                              </button>
                            ) : (
                              <button
                                className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click
                                  handleStartEditing(item); // Start inline editing
                                }}
                              >
                                <Edit size={16} />
                              </button>
                            )}
                            <button
                              className={`p-2 rounded-full ${
                                confirmingAction === item.id
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleConfirmAction(item.id, () => handleDeleteProduct(item.id));
                              }}
                            >
                              {confirmingAction === item.id ? <Check size={16} /> : <Trash size={16} />}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRowId === item.id && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <div className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {item.tags?.map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`px-3 py-1 text-sm rounded-full ${tag.color} text-white`}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
              {filteredItems.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <p>No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Product Button */}
      <button
        onClick={() => setIsAddProductModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Add Product"
      >
        <Plus className="h-6 w-6" />
      </button>

      <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 absolute top-2 right-2"
              onClick={() => {
                setIsAddProductModalOpen(false);
                setCurrentProduct(null); // Clear the current product on close
                setNewCategory(''); // Reset new category input
              }}
            >
              <X size={16} />
            </Button>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* First Column */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={currentProduct?.name || ''}
                  onChange={(e) =>
                    setCurrentProduct((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="productCategory">Category</Label>
                <Select
                  value={currentProduct?.category || ''}
                  onValueChange={(value) => {
                    if (value === 'new') {
                      setNewCategory('');
                      setCurrentProduct((prev) =>
                        prev ? { ...prev, category: 'new' } : null
                      );
                    } else {
                      setCurrentProduct((prev) =>
                        prev ? { ...prev, category: value } : null
                      );
                    }
                  }}
                >
                  <SelectTrigger id="productCategory">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Create New Category</SelectItem>
                  </SelectContent>
                </Select>
                {currentProduct?.category === 'new' && (
                  <div className="mt-2">
                    <Label htmlFor="newCategory">New Category Name</Label>
                    <Input
                      id="newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="costPrice">Cost</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={currentProduct?.costPrice || ''}
                  onChange={(e) =>
                    setCurrentProduct((prev) =>
                      prev ? { ...prev, costPrice: parseFloat(e.target.value) || 0 } : null
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="productPrice">Price</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  value={currentProduct?.price || ''}
                  onChange={(e) =>
                    setCurrentProduct((prev) =>
                      prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null
                    )
                  }
                />
              </div>
            </div>
            {/* Second Column */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Options</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="pos-item"
                      checked={currentProduct?.sku !== undefined}
                      onChange={(e) =>
                        setCurrentProduct((prev) =>
                          prev ? { ...prev, sku: e.target.checked ? prev.sku || '' : undefined } : null
                        )
                      }
                      className="h-4 w-4 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm">POS Item</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
              onClick={handleSaveProduct}
            >
              <Check size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMoveCategoryDialogOpen} onOpenChange={setIsMoveCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Product</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 absolute top-2 right-2"
              onClick={() => setIsMoveCategoryDialogOpen(false)}
            >
              <X size={16} />
            </Button>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newCategory">Select New Category</Label>
              <Select
                onValueChange={(value) => handleMoveProduct(value)}
              >
                <SelectTrigger id="newCategory">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => handleMoveProduct(selectedCategory || '')}>
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Products;