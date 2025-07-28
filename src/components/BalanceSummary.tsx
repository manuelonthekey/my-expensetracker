import { Transaction } from '@/types/expense';
import { formatCurrency } from '@/utils/currency';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BalanceSummaryProps {
  transactions: Transaction[];
}

export const BalanceSummary = ({ transactions }: BalanceSummaryProps) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Balance */}
      <div className="md:col-span-1 bg-gradient-card rounded-2xl p-6 shadow-md border border-border/50 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <p className={`text-3xl font-bold ${
          balance >= 0 ? 'text-income' : 'text-expense'
        }`}>
          {formatCurrency(balance)}
        </p>
        {balance >= 0 ? (
          <p className="text-sm text-income flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            Positive balance
          </p>
        ) : (
          <p className="text-sm text-expense flex items-center mt-2">
            <TrendingDown className="h-4 w-4 mr-1" />
            Negative balance
          </p>
        )}
      </div>
      
      {/* Total Income */}
      <div className="bg-gradient-card rounded-2xl p-6 shadow-md border border-border/50 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
          <TrendingUp className="h-5 w-5 text-income" />
        </div>
        <p className="text-2xl font-bold text-income">
          {formatCurrency(totalIncome)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {transactions.filter(t => t.type === 'income').length} transactions
        </p>
      </div>
      
      {/* Total Expenses */}
      <div className="bg-gradient-card rounded-2xl p-6 shadow-md border border-border/50 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
          <TrendingDown className="h-5 w-5 text-expense" />
        </div>
        <p className="text-2xl font-bold text-expense">
          {formatCurrency(totalExpenses)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {transactions.filter(t => t.type === 'expense').length} transactions
        </p>
      </div>
    </div>
  );
};