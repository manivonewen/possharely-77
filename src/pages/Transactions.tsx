
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, ArrowDownCircle, ArrowUpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'trx-001',
      amount: 46.86,
      type: 'income',
      contactName: 'John Doe',
      description: 'Order payment',
      date: new Date('2023-10-15T14:30:00')
    },
    {
      id: 'trx-002',
      amount: 87.56,
      type: 'income',
      contactName: 'Jane Smith',
      description: 'Order payment',
      date: new Date('2023-10-16T09:45:00')
    },
    {
      id: 'trx-003',
      amount: 25.00,
      type: 'expense',
      contactName: 'ABC Supplies',
      description: 'Office supplies',
      date: new Date('2023-10-16T16:15:00')
    },
    {
      id: 'trx-004',
      amount: 120.00,
      type: 'expense',
      contactName: 'City Power',
      description: 'Electricity bill',
      date: new Date('2023-10-17T11:20:00')
    }
  ]);
  
  const [newTransaction, setNewTransaction] = useState<{
    amount: number;
    type: 'income' | 'expense';
    contactName: string;
    description?: string;
  }>({
    amount: 0,
    type: 'expense',
    contactName: '',
  });

  const filteredTransactions = transactions
    .filter(transaction => {
      const searchValue = searchTerm.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(searchValue) ||
        transaction.type.toLowerCase().includes(searchValue) ||
        transaction.contactName?.toLowerCase().includes(searchValue) ||
        transaction.description?.toLowerCase().includes(searchValue) ||
        transaction.amount.toString().includes(searchValue)
      );
    })
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.date.getTime() - b.date.getTime();
      } else {
        return b.date.getTime() - a.date.getTime();
      }
    });

  const handleAddTransaction = () => {
    const transaction: Transaction = {
      id: `trx-${Math.random().toString(36).substring(2, 9)}`,
      amount: newTransaction.amount,
      type: newTransaction.type,
      contactName: newTransaction.contactName,
      description: newTransaction.description,
      date: new Date()
    };
    
    setTransactions(prev => [...prev, transaction]);
    setNewTransaction({
      amount: 0,
      type: 'expense',
      contactName: '',
    });
    setIsAddTransactionOpen(false);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = income - expenses;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button className="gap-1" onClick={() => setIsAddTransactionOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-900/20">
            <div className="text-sm text-muted-foreground mb-1">Income</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">${income.toFixed(2)}</div>
          </div>
          <div className="rounded-lg border p-4 bg-red-50 dark:bg-red-900/20">
            <div className="text-sm text-muted-foreground mb-1">Expenses</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">${expenses.toFixed(2)}</div>
          </div>
          <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-900/20">
            <div className="text-sm text-muted-foreground mb-1">Balance</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">${balance.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead onClick={toggleSortDirection} className="cursor-pointer">
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortDirection === 'asc' ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.type === 'income' ? (
                          <ArrowDownCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                        )}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.contactName}</TableCell>
                    <TableCell>{transaction.description || '-'}</TableCell>
                    <TableCell className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{format(transaction.date, 'dd/MM/yy')}</div>
                        <div className="text-xs text-muted-foreground">{format(transaction.date, 'HH:mm')}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Add Transaction Dialog */}
        <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(value: 'income' | 'expense') => 
                    setNewTransaction({...newTransaction, type: value})
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTransaction.amount || ''} 
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact</Label>
                <Input 
                  id="contact" 
                  value={newTransaction.contactName} 
                  onChange={(e) => setNewTransaction({...newTransaction, contactName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={newTransaction.description || ''} 
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddTransaction} 
                disabled={!newTransaction.contactName || newTransaction.amount <= 0}
              >
                Add Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
