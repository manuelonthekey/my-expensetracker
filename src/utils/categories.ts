import { 
  IndianRupee, 
  Briefcase, 
  TrendingUp, 
  Building, 
  Gift, 
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Zap,
  Heart,
  Plane,
  GraduationCap,
  MoreHorizontal
} from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'Salary': IndianRupee,
    'Freelance': Briefcase,
    'Investment': TrendingUp,
    'Business': Building,
    'Gift': Gift,
    'Other Income': Plus,
    'Food & Dining': Utensils,
    'Transportation': Car,
    'Shopping': ShoppingBag,
    'Entertainment': Film,
    'Bills & Utilities': Zap,
    'Healthcare': Heart,
    'Travel': Plane,
    'Education': GraduationCap,
    'Other Expense': MoreHorizontal,
  };
  
  return iconMap[category] || MoreHorizontal;
};