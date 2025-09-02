export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

export const calculateTotal = (items: any[]): number => {
  return items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
};