
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StoreSettings } from '@/lib/types';
import { ArrowUpFromLine, ArrowDownToLine, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

export default function Settings() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  
  const [settings, setSettings] = useState<StoreSettings>({
    profile: {
      name: 'John Doe',
      storeName: 'My PICOpos Store',
      telephone: '+1234567890',
    },
    pos: {
      language: 'en',
      enableTax: true,
      enableDiscount: true,
      currency: 'USD',
      currencyRate: 4000,
      enableDelivery: false,
      deliveryFee: 5,
    },
    interface: {
      advanced: false,
      showInventory: true,
      showTransactions: true,
      showSales: true,
      showSettings: true,
    },
    integrations: {
      telegram: true,
      loyverse: false,
      googleSheets: false,
      api: false,
    },
    documentLayout: {
      showHeader: true,
      showFooter: true,
      showLogo: true,
      showTaxDetails: true,
      customMessage: 'Thank you for your purchase!',
    }
  });

  const [exportCategories, setExportCategories] = useState({
    products: true,
    inventory: true,
    contacts: true,
    orders: true,
    settings: true,
  });

  const [restoreCategories, setRestoreCategories] = useState({
    products: true,
    inventory: true,
    contacts: true,
    orders: true,
    settings: true,
  });

  const handleSettingChange = (
    section: keyof StoreSettings, 
    setting: string, 
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleExport = () => {
    // In a real app, this would trigger a data export
    toast.success('Data exported successfully');
    setExportDialogOpen(false);
  };

  const handleRestore = () => {
    // In a real app, this would trigger a data restore
    toast.success('Data restored successfully');
    setRestoreDialogOpen(false);
  };

  const handleBackup = () => {
    // In a real app, this would trigger a backup
    toast.success('Backup created successfully');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your application settings</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {/* Profile Settings */}
            <AccordionItem value="profile">
              <AccordionTrigger className="text-lg">Profile</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <div className="grid gap-2">
                    <Label htmlFor="profile-name">Your Name</Label>
                    <Input 
                      id="profile-name" 
                      value={settings.profile.name} 
                      onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input 
                      id="store-name" 
                      value={settings.profile.storeName} 
                      onChange={(e) => handleSettingChange('profile', 'storeName', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="telephone">Telephone</Label>
                    <Input 
                      id="telephone" 
                      value={settings.profile.telephone || ''} 
                      onChange={(e) => handleSettingChange('profile', 'telephone', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input 
                      id="logo" 
                      value={settings.profile.logo || ''} 
                      onChange={(e) => handleSettingChange('profile', 'logo', e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* POS Settings */}
            <AccordionItem value="pos">
              <AccordionTrigger className="text-lg">POS</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="language">Language</Label>
                      <div className="text-sm text-muted-foreground">
                        Select display language
                      </div>
                    </div>
                    <select 
                      id="language"
                      className="rounded-md border border-input bg-background px-3 py-2"
                      value={settings.pos.language}
                      onChange={(e) => handleSettingChange('pos', 'language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Tax</Label>
                      <div className="text-sm text-muted-foreground">
                        Calculate and apply taxes to orders
                      </div>
                    </div>
                    <Switch 
                      checked={settings.pos.enableTax} 
                      onCheckedChange={(checked) => handleSettingChange('pos', 'enableTax', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Discount</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow applying discounts to orders
                      </div>
                    </div>
                    <Switch 
                      checked={settings.pos.enableDiscount} 
                      onCheckedChange={(checked) => handleSettingChange('pos', 'enableDiscount', checked)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input 
                      id="currency" 
                      value={settings.pos.currency} 
                      onChange={(e) => handleSettingChange('pos', 'currency', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="currency-rate">Currency Rate</Label>
                    <Input 
                      id="currency-rate" 
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.pos.currencyRate} 
                      onChange={(e) => handleSettingChange('pos', 'currencyRate', parseFloat(e.target.value) || 0)}
                    />
                    <div className="text-sm text-muted-foreground">
                      1 USD = {settings.pos.currencyRate} (local currency)
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Delivery</Label>
                      <div className="text-sm text-muted-foreground">
                        Add delivery option to orders
                      </div>
                    </div>
                    <Switch 
                      checked={settings.pos.enableDelivery} 
                      onCheckedChange={(checked) => handleSettingChange('pos', 'enableDelivery', checked)}
                    />
                  </div>
                  
                  {settings.pos.enableDelivery && (
                    <div className="grid gap-2">
                      <Label htmlFor="delivery-fee">Delivery Fee</Label>
                      <Input 
                        id="delivery-fee" 
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.pos.deliveryFee} 
                        onChange={(e) => handleSettingChange('pos', 'deliveryFee', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Interface Settings */}
            <AccordionItem value="interface">
              <AccordionTrigger className="text-lg">Interface</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Advanced Mode</Label>
                      <div className="text-sm text-muted-foreground">
                        Enable advanced features and options
                      </div>
                    </div>
                    <Switch 
                      checked={settings.interface.advanced} 
                      onCheckedChange={(checked) => handleSettingChange('interface', 'advanced', checked)}
                    />
                  </div>
                  
                  {settings.interface.advanced && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Inventory</Label>
                          <div className="text-sm text-muted-foreground">
                            Display inventory management section
                          </div>
                        </div>
                        <Switch 
                          checked={settings.interface.showInventory} 
                          onCheckedChange={(checked) => handleSettingChange('interface', 'showInventory', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Transactions</Label>
                          <div className="text-sm text-muted-foreground">
                            Display transaction management section
                          </div>
                        </div>
                        <Switch 
                          checked={settings.interface.showTransactions} 
                          onCheckedChange={(checked) => handleSettingChange('interface', 'showTransactions', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Sales</Label>
                          <div className="text-sm text-muted-foreground">
                            Display sales management section
                          </div>
                        </div>
                        <Switch 
                          checked={settings.interface.showSales} 
                          onCheckedChange={(checked) => handleSettingChange('interface', 'showSales', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Settings</Label>
                          <div className="text-sm text-muted-foreground">
                            Display settings section
                          </div>
                        </div>
                        <Switch 
                          checked={settings.interface.showSettings} 
                          onCheckedChange={(checked) => handleSettingChange('interface', 'showSettings', checked)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Backup Settings */}
            <AccordionItem value="backup">
              <AccordionTrigger className="text-lg">Backup & Data</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleBackup} className="flex-1">
                      <ArrowUpFromLine className="mr-2 h-4 w-4" />
                      Backup Data
                    </Button>
                    <Button onClick={() => setExportDialogOpen(true)} className="flex-1">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button onClick={() => setRestoreDialogOpen(true)} variant="outline" className="flex-1">
                      <ArrowUpFromLine className="mr-2 h-4 w-4" />
                      Restore Data
                    </Button>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-300">Important</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          Regular backups help protect your data. We recommend backing up at least once a week.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Integration Settings */}
            <AccordionItem value="integration">
              <AccordionTrigger className="text-lg">Integrations</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Telegram Integration</Label>
                      <div className="text-sm text-muted-foreground">
                        Connect your Telegram account
                      </div>
                    </div>
                    <Switch 
                      checked={settings.integrations.telegram} 
                      onCheckedChange={(checked) => handleSettingChange('integrations', 'telegram', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Loyverse Integration</Label>
                      <div className="text-sm text-muted-foreground">
                        Sync with Loyverse POS
                      </div>
                    </div>
                    <Switch 
                      checked={settings.integrations.loyverse} 
                      onCheckedChange={(checked) => handleSettingChange('integrations', 'loyverse', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Google Sheets Integration</Label>
                      <div className="text-sm text-muted-foreground">
                        Export data to Google Sheets
                      </div>
                    </div>
                    <Switch 
                      checked={settings.integrations.googleSheets} 
                      onCheckedChange={(checked) => handleSettingChange('integrations', 'googleSheets', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Access</Label>
                      <div className="text-sm text-muted-foreground">
                        Enable API for external integrations
                      </div>
                    </div>
                    <Switch 
                      checked={settings.integrations.api} 
                      onCheckedChange={(checked) => handleSettingChange('integrations', 'api', checked)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Document Layout Settings */}
            <AccordionItem value="document">
              <AccordionTrigger className="text-lg">Document Layout</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Header</Label>
                      <div className="text-sm text-muted-foreground">
                        Display store information at the top
                      </div>
                    </div>
                    <Switch 
                      checked={settings.documentLayout.showHeader} 
                      onCheckedChange={(checked) => handleSettingChange('documentLayout', 'showHeader', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Footer</Label>
                      <div className="text-sm text-muted-foreground">
                        Display store information at the bottom
                      </div>
                    </div>
                    <Switch 
                      checked={settings.documentLayout.showFooter} 
                      onCheckedChange={(checked) => handleSettingChange('documentLayout', 'showFooter', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Logo</Label>
                      <div className="text-sm text-muted-foreground">
                        Display store logo on documents
                      </div>
                    </div>
                    <Switch 
                      checked={settings.documentLayout.showLogo} 
                      onCheckedChange={(checked) => handleSettingChange('documentLayout', 'showLogo', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Tax Details</Label>
                      <div className="text-sm text-muted-foreground">
                        Display tax information on documents
                      </div>
                    </div>
                    <Switch 
                      checked={settings.documentLayout.showTaxDetails} 
                      onCheckedChange={(checked) => handleSettingChange('documentLayout', 'showTaxDetails', checked)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="custom-message">Custom Message</Label>
                    <Input 
                      id="custom-message" 
                      value={settings.documentLayout.customMessage || ''} 
                      onChange={(e) => handleSettingChange('documentLayout', 'customMessage', e.target.value)}
                    />
                    <div className="text-sm text-muted-foreground">
                      This message will appear at the bottom of receipts and invoices
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </div>
        
        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Data</DialogTitle>
              <DialogDescription>
                Select the categories of data you want to export
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="export-products"
                    checked={exportCategories.products}
                    onChange={(e) => setExportCategories({...exportCategories, products: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="export-products">Products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="export-inventory"
                    checked={exportCategories.inventory}
                    onChange={(e) => setExportCategories({...exportCategories, inventory: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="export-inventory">Inventory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="export-contacts"
                    checked={exportCategories.contacts}
                    onChange={(e) => setExportCategories({...exportCategories, contacts: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="export-contacts">Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="export-orders"
                    checked={exportCategories.orders}
                    onChange={(e) => setExportCategories({...exportCategories, orders: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="export-orders">Orders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="export-settings"
                    checked={exportCategories.settings}
                    onChange={(e) => setExportCategories({...exportCategories, settings: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="export-settings">Settings</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleExport}>Export</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Restore Dialog */}
        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restore Data</DialogTitle>
              <DialogDescription>
                Select the categories of data you want to restore
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="restore-products"
                    checked={restoreCategories.products}
                    onChange={(e) => setRestoreCategories({...restoreCategories, products: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="restore-products">Products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="restore-inventory"
                    checked={restoreCategories.inventory}
                    onChange={(e) => setRestoreCategories({...restoreCategories, inventory: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="restore-inventory">Inventory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="restore-contacts"
                    checked={restoreCategories.contacts}
                    onChange={(e) => setRestoreCategories({...restoreCategories, contacts: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="restore-contacts">Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="restore-orders"
                    checked={restoreCategories.orders}
                    onChange={(e) => setRestoreCategories({...restoreCategories, orders: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="restore-orders">Orders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="restore-settings"
                    checked={restoreCategories.settings}
                    onChange={(e) => setRestoreCategories({...restoreCategories, settings: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="restore-settings">Settings</Label>
                </div>
              </div>
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Warning</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Restoring data will overwrite existing information. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleRestore}>Restore</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
