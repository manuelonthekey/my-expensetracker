import { useState } from 'react';
import { Transaction, TransactionFormData } from '@/types/expense';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BalanceSummary } from '@/components/BalanceSummary';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { toast } from '@/hooks/use-toast';
import { parseCurrency } from '@/utils/currency';
import { Wallet, TrendingUp } from 'lucide-react';

const Index = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('expense-tracker-transactions', []);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const addTransaction = (formData: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: formData.type,
      amount: parseCurrency(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      createdAt: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    toast({
      title: `${formData.type === 'income' ? 'Income' : 'Expense'} added!`,
      description: `${formData.category} - ${formData.amount}`,
      duration: 3000,
    });
  };

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    // In a real app, you'd open an edit modal here
    toast({
      title: "Edit functionality",
      description: "Edit feature would open here",
      duration: 2000,
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
              <p className="text-muted-foreground">Monitor your income and expenses with ease</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Summary */}
        <BalanceSummary transactions={transactions} />
        
        {/* Transaction Form */}
        <TransactionForm onSubmit={addTransaction} />
        
        {/* Transaction List */}
        <TransactionList 
          transactions={transactions}
          onEdit={editTransaction}
          onDelete={deleteTransaction}
        />
      </main>
    </div>
  );
};

export default Index;
