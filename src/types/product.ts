export const calculateTotals = (items: any[]) => {
  let subtotal = 0;
  let savings = 0;
  let offerBreakdown: string[] = [];
  items.forEach(item => {
    subtotal += item.price * item.quantity;
    if (item.name === "Cheese") {
      const free = Math.floor(item.quantity / 2);
      const saving = free * item.price;
      if (saving > 0) {
        savings += saving;
        offerBreakdown.push(`Cheese Offer: -£${saving.toFixed(2)}`);
      }
    }
    if (item.name === "Butter") {
      const saving = (item.price * item.quantity) / 3;
      if (saving > 0) {
        savings += saving;
        offerBreakdown.push(`Butter Offer: -£${saving.toFixed(2)}`);
      }
    }
  });
  const soup = items.find(i => i.name === "Soup");
  const bread = items.find(i => i.name === "Bread");
  if (soup && bread) {
    const discount = Math.min(soup.quantity, bread.quantity);
    const saving = discount * (bread.price / 2);
    if (saving > 0) {
      savings += saving;
      offerBreakdown.push(`Soup + Bread Offer: -£${saving.toFixed(2)}`);
    }
  }
  const total = subtotal - savings;
  return {
    subtotal,
    savings,
    total,
    offerBreakdown 
  };
};