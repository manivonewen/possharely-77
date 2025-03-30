import React, { createContext, useContext, useState } from 'react';
import { StoreSettings } from '@/lib/types';

const defaultSettings: StoreSettings = {
  profile: {
    name: 'Admin User',
    storeName: 'PicoPOS Store',
    telephone: '+1 (555) 123-4567',
  },
  pos: {
    language: 'en',
    enableTax: false,
    enableDiscount: false,
    currency: 'USD',
    currencyRate: 4100, // 1 USD = 4100 Riel
    enableDelivery: false,
    deliveryFee: 5,
    showRiel: false,
  },
  interface: {
    advanced: false,
    showInventory: false,
    showTransactions: true,
    showSales: true,
    showSettings: true,
    primaryColor: 'blue',
  },
  integrations: {
    telegram: false,
    loyverse: false,
    googleSheets: false,
    api: false,
  },
  documentLayout: {
    showHeader: true,
    showFooter: true,
    showLogo: true,
    showTaxDetails: false,
    customMessage: 'Thank you for your business!',
  },
};

interface SettingsContextProps {
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
}

const SettingsContext = createContext<SettingsContextProps>({
  settings: defaultSettings,
  updateSettings: (newSettings: StoreSettings) => {
    console.warn("SettingsContext.updateSettings was called outside of a SettingsProvider");
  },
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
