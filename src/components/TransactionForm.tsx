import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { TransactionFormData, CATEGORIES } from '@/types/expense';
import { formatCurrency, parseCurrency } from '@/utils/currency';
import { getCategoryIcon } from '@/utils/categories';
import { format } from 'date-fns';
import { CalendarIcon, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
}

export const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;
    
    onSubmit(formData);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date(),
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseCurrency(value);
    setFormData(prev => ({
      ...prev,
      amount: numericValue > 0 ? numericValue.toString() : ''
    }));
  };

  const categories = CATEGORIES[formData.type];

  return (
    <div className="bg-gradient-card rounded-2xl p-6 shadow-lg border border-border/50 mb-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type Toggle */}
        <div className="flex items-center justify-center space-x-4 p-1 bg-muted rounded-xl">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.type === 'income'}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ 
                  ...prev, 
                  type: checked ? 'income' : 'expense',
                  category: '' // Reset category when type changes
                }))
              }
              className="data-[state=checked]:bg-income"
            />
            <div className="flex items-center space-x-2">
              {formData.type === 'income' ? (
                <>
                  <TrendingUp className="h-5 w-5 text-income" />
                  <span className="font-medium text-income">Income</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-expense" />
                  <span className="font-medium text-expense">Expense</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={formData.amount ? formatCurrency(parseFloat(formData.amount)) : ''}
              onChange={handleAmountChange}
              className="text-lg font-semibold"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category);
                  return (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{category}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Add a note about this transaction..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className={cn(
            "w-full text-lg py-6 transition-all duration-300 hover:scale-105",
            formData.type === 'income' 
              ? "bg-gradient-income hover:shadow-income text-income-foreground" 
              : "bg-gradient-expense hover:shadow-expense text-expense-foreground"
          )}
          disabled={!formData.amount || !formData.category}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add {formData.type === 'income' ? 'Income' : 'Expense'}
        </Button>
      </form>
    </div>
  );
};