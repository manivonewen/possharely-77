import React, { createContext, useContext, useState } from 'react';
import { InventoryItem } from '@/lib/types';

interface InventoryContextProps {
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
}

const InventoryContext = createContext<InventoryContextProps>({
  inventory: [],
  setInventory: () => {},
});

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  return (
    <InventoryContext.Provider value={{ inventory, setInventory }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);