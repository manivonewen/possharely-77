
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Palette, Save } from 'lucide-react';
import { toast } from 'sonner';
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
  },
  interface: {
    advanced: false,
    showInventory: true,
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

  const handleColorChange = (color: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal') => {
    // Update primary color setting
    setSettings({
      ...settings,
      interface: {
        ...settings.interface,
        primaryColor: color,
      },
    });
    
    // In a real app, this would update global CSS variables or a theme context
    // For now, we'll just show a toast
    toast.success(`Theme color updated to ${color}`);
    
    // Update CSS variables for demo purposes
    document.documentElement.style.setProperty('--primary', getPrimaryColorHSL(color));
    updateDerivedColors(color);
  };
  
  const updateDerivedColors = (color: string) => {
    // This would update all the derived colors in a real app
    // Just a simple demonstration for now
    console.log(`Updating all derived colors based on ${color}`);
  };
  
  const getPrimaryColorHSL = (color: string): string => {
    // Return appropriate HSL values based on color
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

  const handleSaveSettings = () => {
    // In a real app, save to database or localStorage
    console.log('Saving settings:', settings);
    toast.success('Settings saved successfully');
  };

  const handleToggleSetting = (path: string, value: boolean) => {
    const pathParts = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      // Navigate to the nested property
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      // Set the value
      current[pathParts[pathParts.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your POS settings and preferences.</p>
        </div>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Your store details used on receipts and invoices.
                </CardDescription>
              </CardHeader>
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
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receipt & Invoice Settings</CardTitle>
                <CardDescription>
                  Customize how receipts and invoices are displayed.
                </CardDescription>
              </CardHeader>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Customize the look and feel of your POS system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Primary Color</Label>
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
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>
                  Enable or disable specific features of your POS system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTax" className="block">Enable Tax</Label>
                    <p className="text-sm text-muted-foreground">Show tax calculations in cart and receipts</p>
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
                    <p className="text-sm text-muted-foreground">Allow adding discounts to items and orders</p>
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
                    <p className="text-sm text-muted-foreground">Show delivery options and fees</p>
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
                    <p className="text-sm text-muted-foreground">Track and show product stock levels</p>
                  </div>
                  <Switch 
                    id="showInventory"
                    checked={settings.interface.showInventory}
                    onCheckedChange={(checked) => handleToggleSetting('interface.showInventory', checked)}
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
                <CardDescription>
                  Connect your POS to external services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="googleSheets" className="block">Google Sheets</Label>
                    <p className="text-sm text-muted-foreground">Export sales data to Google Sheets</p>
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
                    <p className="text-sm text-muted-foreground">Enable API for external integrations</p>
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
