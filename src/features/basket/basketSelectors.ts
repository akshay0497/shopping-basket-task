export interface BasketItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export const calculateTotals = (items: BasketItem[]) => {
  let subtotal = 0;
  let savings = 0;
  let offerBreakdown: string[] = [];

  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const cheese = items.find(i => i.name === "Cheese");
  if (cheese) {
    const free = Math.floor(cheese.quantity / 2);
    const saving = free * cheese.price;
    if (saving > 0) {
      savings += saving;
      offerBreakdown.push(`Cheese Offer: -£${saving.toFixed(2)}`);
    }
  }

  const soup = items.find(i => i.name === "Soup");
  const bread = items.find(i => i.name === "Bread");

  if (soup && bread) {
    const applicable = Math.min(soup.quantity, bread.quantity);
    const saving = applicable * (bread.price / 2);
    if (saving > 0) {
      savings += saving;
      offerBreakdown.push(`Soup + Bread Offer: -£${saving.toFixed(2)}`);
    }
  }

  const butter = items.find(i => i.name === "Butter");
  if (butter) {
    const saving = (butter.price * butter.quantity) / 3;
    if (saving > 0) {
      savings += saving;
      offerBreakdown.push(`Butter Offer: -£${saving.toFixed(2)}`);
    }
  }

  return {
    subtotal,
    savings,
    total: subtotal - savings,
    offerBreakdown
  };
};