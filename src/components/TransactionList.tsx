import { useState } from 'react';
import { Transaction } from '@/types/expense';
import { formatCurrency } from '@/utils/currency';
import { getCategoryIcon } from '@/utils/categories';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Edit, Trash2, Filter, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // Get unique categories for filter
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income' || filter === 'expense') return transaction.type === filter;
    return transaction.category === filter;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  if (transactions.length === 0) {
    return (
      <div className="bg-gradient-card rounded-2xl p-8 shadow-md border border-border/50 text-center animate-fade-in">
        <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
        <p className="text-muted-foreground">Add your first income or expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card rounded-2xl p-6 shadow-lg border border-border/50 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Filter */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedTransactions.map((transaction, index) => {
          const Icon = getCategoryIcon(transaction.category);
          
          return (
            <div
              key={transaction.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md animate-fade-in",
                transaction.type === 'income' 
                  ? "bg-income/5 border-income/20 hover:bg-income/10" 
                  : "bg-expense/5 border-expense/20 hover:bg-expense/10"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  transaction.type === 'income' ? "bg-income/20" : "bg-expense/20"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    transaction.type === 'income' ? "text-income" : "text-expense"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-foreground">{transaction.category}</h3>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      transaction.type === 'income' 
                        ? "bg-income text-income-foreground" 
                        : "bg-expense text-expense-foreground"
                    )}>
                      {transaction.type}
                    </span>
                  </div>
                  {transaction.description && (
                    <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={cn(
                  "font-bold text-lg",
                  transaction.type === 'income' ? "text-income" : "text-expense"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};