import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Palette, Save } from 'lucide-react';
import { toast } from 'sonner';
import { StoreSettings } from '@/lib/types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Default settings for the store
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
    showRiel: false, // Added showRiel
  },
  interface: {
    advanced: false,
    showInventory: false, // Track stock disabled by default
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
    enableCustomMessage: false, // Add toggle for custom message
  },
};

const themeColors = [
  { value: 'blue', label: 'Blue', bgClass: 'bg-blue-500' },
  { value: 'green', label: 'Green', bgClass: 'bg-green-500' },
  { value: 'purple', label: 'Purple', bgClass: 'bg-purple-500' },
  { value: 'red', label: 'Red', bgClass: 'bg-red-500' },
  { value: 'orange', label: 'Orange', bgClass: 'bg-orange-500' },
  { value: 'teal', label: 'Teal', bgClass: 'bg-teal-500' },
];

const Settings = () => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [isSmartThemeEnabled, setIsSmartThemeEnabled] = useState(false); // Track smart theme mode

  /**
   * Updates the primary color of the interface.
   * @param color - The new primary color.
   */
  const handleColorChange = (color: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal') => {
    setSettings({
      ...settings,
      interface: {
        ...settings.interface,
        primaryColor: color,
      },
    });

    toast.success(`Theme color updated to ${color}`);
    document.documentElement.style.setProperty('--primary', getPrimaryColorHSL(color));
    updateDerivedColors(color);
  };

  /**
   * Updates all derived colors based on the primary color.
   * @param color - The primary color.
   */
  const updateDerivedColors = (color: string) => {
    console.log(`Updating all derived colors based on ${color}`);
  };

  /**
   * Converts a color name to its HSL value.
   * @param color - The color name.
   * @returns The HSL value of the color.
   */
  const getPrimaryColorHSL = (color: string): string => {
    switch (color) {
      case 'blue': return '221 83% 53%';
      case 'green': return '142 76% 36%';
      case 'purple': return '262 83% 58%';
      case 'red': return '0 84% 60%';
      case 'orange': return '24 94% 50%';
      case 'teal': return '174 84% 32%';
      default: return '221 83% 53%';
    }
  };

  /**
   * Saves the current settings.
   */
  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    toast.success('Settings saved successfully');
  };

  /**
   * Toggles a specific setting based on its path.
   * @param path - The path to the setting in the settings object.
   * @param value - The new value for the setting.
   */
  const handleToggleSetting = (path: string, value: boolean) => {
    const pathParts = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;

      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 overflow-y-hidden">
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Accordion type="single" collapsible defaultValue="">
              <AccordionItem value="store-info">
                <AccordionTrigger className="hover:no-underline">
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input 
                        id="storeName" 
                        value={settings.profile.storeName} 
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, storeName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Owner/Manager Name</Label>
                      <Input 
                        id="name" 
                        value={settings.profile.name} 
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, name: e.target.value }
                        })} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="telephone">Telephone</Label>
                      <Input 
                        id="telephone" 
                        value={settings.profile.telephone || ''} 
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, telephone: e.target.value }
                        })} 
                      />
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="receipt-settings">
                <AccordionTrigger className="hover:no-underline">
                  <CardHeader>
                    <CardTitle>Receipt & Invoice Settings</CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showHeader">Show Header</Label>
                      <Switch 
                        id="showHeader"
                        checked={settings.documentLayout.showHeader}
                        onCheckedChange={(checked) => handleToggleSetting('documentLayout.showHeader', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showFooter">Show Footer</Label>
                      <Switch 
                        id="showFooter"
                        checked={settings.documentLayout.showFooter}
                        onCheckedChange={(checked) => handleToggleSetting('documentLayout.showFooter', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLogo">Show Logo</Label>
                      <Switch 
                        id="showLogo"
                        checked={settings.documentLayout.showLogo}
                        onCheckedChange={(checked) => handleToggleSetting('documentLayout.showLogo', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableCustomMessage">Enable Custom Receipt Message</Label>
                      <Switch
                        id="enableCustomMessage"
                        checked={settings.documentLayout.enableCustomMessage}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            documentLayout: {
                              ...prev.documentLayout,
                              enableCustomMessage: checked,
                            },
                          }))
                        }
                      />
                    </div>
                    {settings.documentLayout.enableCustomMessage && (
                      <div className="grid gap-2">
                        <Label htmlFor="customMessage">Custom Receipt Message</Label>
                        <Textarea 
                          id="customMessage" 
                          value={settings.documentLayout.customMessage || ''} 
                          onChange={(e) => setSettings({
                            ...settings,
                            documentLayout: { 
                              ...settings.documentLayout, 
                              customMessage: e.target.value 
                            }
                          })}
                          placeholder="Thank you for your business!"
                          rows={3}
                        />
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              {/* Backup and Restore */}
              <AccordionItem value="backup-restore">
                <AccordionTrigger className="hover:no-underline">
                  <CardHeader>
                    <CardTitle>Backup and Restore</CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    {/* Backup */}
                    <div>
                      <h3 className="text-lg font-semibold">Backup</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoBackup">Auto</Label>
                        <Switch id="autoBackup" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dailyBackup">Daily</Label>
                        <Switch id="dailyBackup" checked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="connectDrive">Connect Drive</Label>
                        <Switch
                          id="connectDrive"
                          onCheckedChange={(checked) => {
                            if (checked) {
                              // Expand account field logic
                            }
                          }}
                        />
                      </div>
                      {/* Account Field */}
                      <div className="mt-2">
                        <Label htmlFor="googleAccount">Google Account</Label>
                        <Input id="googleAccount" placeholder="Connect with Magic Link" />
                      </div>
                    </div>

                    {/* Export Data */}
                    <div>
                      <h3 className="text-lg font-semibold">Export Data</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="productsInventory">Products and Inventory</Label>
                        <Switch id="productsInventory" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ordersContacts">Orders and Contacts</Label>
                        <Switch id="ordersContacts" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="salesTransactions">Sales and Transactions</Label>
                        <Switch id="salesTransactions" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="settingsPreferences">Settings and Preferences</Label>
                        <Switch id="settingsPreferences" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="incrementalExport">Incremental</Label>
                        <Switch id="incrementalExport" checked />
                      </div>
                      {/* Date Picker */}
                      <div className="mt-2">
                        <Label htmlFor="datePicker">Select Date Range</Label>
                        <Input id="datePicker" type="date" />
                      </div>
                    </div>

                    {/* Import Data */}
                    <div>
                      <h3 className="text-lg font-semibold">Import Data</h3>
                      <div className="grid gap-2">
                        <Label htmlFor="fileUpload">From Backup Files (JSON/XML)</Label>
                        <Input id="fileUpload" type="file" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="customTables">Custom Tables (CSV/XLSX)</Label>
                        <Input id="customTables" type="file" />
                      </div>
                      {/* Column Mapping */}
                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Map Columns</h4>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <Input placeholder="Name" />
                            <Input placeholder="Category" />
                            <Input placeholder="Price" />
                            <Button variant="outline" size="sm">+</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sync Button */}
                    <Button className="mt-4">Sync</Button>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            {/* Smart Theme Card */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-left">Smart Theme</CardTitle>
                <Switch
                  checked={isSmartThemeEnabled}
                  onCheckedChange={(checked) => setIsSmartThemeEnabled(checked)}
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Interface color theming based on order type
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-500"></div>
                    <span className="text-sm">In-store order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-teal-500"></div>
                    <span className="text-sm">Online/delivery order</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Purchase order</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Card */}
            <Card className={isSmartThemeEnabled ? 'opacity-50 pointer-events-none' : ''}>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex flex-wrap gap-4">
                    {themeColors.map((color) => (
                      <div 
                        key={color.value} 
                        className="text-center"
                      >
                        <button
                          className={`h-12 w-12 rounded-full ${color.bgClass} relative transition-all hover:ring-2 hover:ring-offset-2 ${settings.interface.primaryColor === color.value ? 'ring-2 ring-offset-2' : ''}`}
                          onClick={() => handleColorChange(color.value as any)}
                          aria-label={`Set color to ${color.label}`}
                        >
                          {settings.interface.primaryColor === color.value && (
                            <Check className="absolute inset-0 m-auto text-white h-6 w-6" />
                          )}
                        </button>
                        <span className="mt-1 block text-xs">{color.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Settings */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTax" className="block">Enable Tax</Label>
                  </div>
                  <Switch 
                    id="enableTax"
                    checked={settings.pos.enableTax}
                    onCheckedChange={(checked) => handleToggleSetting('pos.enableTax', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableDiscount" className="block">Enable Discounts</Label>
                  </div>
                  <Switch 
                    id="enableDiscount"
                    checked={settings.pos.enableDiscount}
                    onCheckedChange={(checked) => handleToggleSetting('pos.enableDiscount', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableDelivery" className="block">Enable Delivery</Label>
                  </div>
                  <Switch 
                    id="enableDelivery"
                    checked={settings.pos.enableDelivery}
                    onCheckedChange={(checked) => handleToggleSetting('pos.enableDelivery', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showInventory" className="block">Track Inventory</Label>
                  </div>
                  <Switch 
                    id="showInventory"
                    checked={settings.interface.showInventory}
                    onCheckedChange={(checked) => handleToggleSetting('interface.showInventory', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showRiel" className="block">Show Riel Prices</Label>
                  </div>
                  <Switch 
                    id="showRiel"
                    checked={settings.pos.showRiel}
                    onCheckedChange={(checked) => handleToggleSetting('pos.showRiel', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="googleSheets" className="block">Google Sheets</Label>
                  </div>
                  <Switch 
                    id="googleSheets"
                    checked={settings.integrations.googleSheets}
                    onCheckedChange={(checked) => handleToggleSetting('integrations.googleSheets', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="apiAccess" className="block">API Access</Label>
                  </div>
                  <Switch 
                    id="apiAccess"
                    checked={settings.integrations.api}
                    onCheckedChange={(checked) => handleToggleSetting('integrations.api', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
