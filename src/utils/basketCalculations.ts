import { BasketItem, Totals } from "../types/basket.types";

export const calculateTotals = (items: BasketItem[]): Totals => {
  let subtotal = 0;
  let savings = 0;
  let offerBreakdown: string[] = [];

  // Calculate subtotal
  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  // OFFER 1: Buy one Cheese, get second Cheese free
  const cheese = items.find(i => i.name === "Cheese");
  if (cheese) {
    const freeCheeses = Math.floor(cheese.quantity / 2);
    const saving = freeCheeses * cheese.price;
    if (saving > 0) {
      savings += saving;
      offerBreakdown.push(`🧀 Cheese: Buy 1 Get 1 Free (-£${saving.toFixed(2)})`);
    }
  }

  // OFFER 2: Buy Soup, get half price Bread
  const soup = items.find(i => i.name === "Soup");
  const bread = items.find(i => i.name === "Bread");

  if (soup && bread) {
    // For each soup, you can get one bread at half price
    const eligibleBreads = Math.min(soup.quantity, bread.quantity);
    const saving = eligibleBreads * (bread.price / 2);
    if (saving > 0) {
      savings += saving;
      offerBreakdown.push(`🥣 Soup + 🍞 Bread: Half price bread (-£${saving.toFixed(2)})`);
    }
  }

  // OFFER 3: Get a third off Butter
  const butter = items.find(i => i.name === "Butter");
  if (butter) {
    // 1/3 off each butter
    const saving = (butter.price * butter.quantity) / 3;
    if (saving > 0) {
      savings += saving;
      offerBreakdown.push(`🧈 Butter: 33% off (-£${saving.toFixed(2)})`);
    }
  }

  return {
    subtotal,
    savings,
    total: subtotal - savings,
    offerBreakdown
  };
};