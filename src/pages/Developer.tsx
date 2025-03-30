import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Developer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Layout>
        <div className="container mx-auto py-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Developer Page</h1>
            <div className="flex items-center gap-2">
              <Label>Dark Mode</Label>
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Buttons</h2>
            <div className="flex gap-4">
              <Button>Primary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Input</h2>
            <Input placeholder="Enter text here..." />
          </div>

          {/* Select */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Select</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Table</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>30</TableCell>
                  <TableCell>Developer</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>25</TableCell>
                  <TableCell>Designer</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Tabs</h2>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Content for Tab 1</TabsContent>
              <TabsContent value="tab2">Content for Tab 2</TabsContent>
            </Tabs>
          </div>

          {/* Accordion */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Accordion</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="item1">
                <AccordionTrigger>Accordion Item 1</AccordionTrigger>
                <AccordionContent>Content for Accordion Item 1</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item2">
                <AccordionTrigger>Accordion Item 2</AccordionTrigger>
                <AccordionContent>Content for Accordion Item 2</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Dialog */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Dialog</h2>
            <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                </DialogHeader>
                <p>This is a dialog example.</p>
              </DialogContent>
            </Dialog>
          </div>

          {/* Toast */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Toast</h2>
            <Button onClick={() => toast.success('This is a success toast!')}>Show Toast</Button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Developer;
