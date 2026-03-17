import { calculateTotals } from "../utils/basketCalculations";
import { BasketItem } from "../types/basket.types";

describe('Basket Calculations with Correct Offers', () => {
  
  describe('Cheese Offer: Buy 1 Get 1 Free', () => {
    test('2 cheeses should give 1 free', () => {
      const items: BasketItem[] = [
        { id: 3, name: 'Cheese', price: 0.90, quantity: 2 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(1.80);
      expect(result.savings).toBe(0.90);
      expect(result.total).toBe(0.90);
      expect(result.offerBreakdown).toContain('🧀 Cheese: Buy 1 Get 1 Free (-£0.90)');
    });

    test('3 cheeses should give 1 free (only one pair)', () => {
      const items: BasketItem[] = [
        { id: 3, name: 'Cheese', price: 0.90, quantity: 3 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(2.70);
      expect(result.savings).toBe(0.90);
      expect(result.total).toBe(1.80);
    });

    test('4 cheeses should give 2 free', () => {
      const items: BasketItem[] = [
        { id: 3, name: 'Cheese', price: 0.90, quantity: 4 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(3.60);
      expect(result.savings).toBe(1.80);
      expect(result.total).toBe(1.80);
    });
  });

  describe('Soup + Bread Offer: Half price bread', () => {
    test('1 soup + 1 bread = half price bread', () => {
      const items: BasketItem[] = [
        { id: 4, name: 'Soup', price: 0.60, quantity: 1 },
        { id: 1, name: 'Bread', price: 1.10, quantity: 1 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(1.70);
      expect(result.savings).toBe(0.55); // Half of £1.10
      expect(result.total).toBe(1.15);
      expect(result.offerBreakdown).toContain('🥣 Soup + 🍞 Bread: Half price bread (-£0.55)');
    });

    test('2 soups + 1 bread = half price on 1 bread only', () => {
      const items: BasketItem[] = [
        { id: 4, name: 'Soup', price: 0.60, quantity: 2 },
        { id: 1, name: 'Bread', price: 1.10, quantity: 1 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(2.30);
      expect(result.savings).toBe(0.55);
      expect(result.total).toBe(1.75);
    });

    test('1 soup + 2 bread = half price on 1 bread only', () => {
      const items: BasketItem[] = [
        { id: 4, name: 'Soup', price: 0.60, quantity: 1 },
        { id: 1, name: 'Bread', price: 1.10, quantity: 2 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(2.80);
      expect(result.savings).toBe(0.55);
      expect(result.total).toBe(2.25);
    });

    test('2 soups + 2 bread = half price on 2 bread', () => {
      const items: BasketItem[] = [
        { id: 4, name: 'Soup', price: 0.60, quantity: 2 },
        { id: 1, name: 'Bread', price: 1.10, quantity: 2 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(3.40);
      expect(result.savings).toBe(1.10); // Half price on 2 breads = £1.10
      expect(result.total).toBe(2.30);
    });
  });

  describe('Butter Offer: 1/3 off', () => {
    test('1 butter = 33% off', () => {
      const items: BasketItem[] = [
        { id: 5, name: 'Butter', price: 1.20, quantity: 1 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(1.20);
      expect(result.savings).toBeCloseTo(0.40, 2); // 1.20 / 3
      expect(result.total).toBeCloseTo(0.80, 2);
      expect(result.offerBreakdown).toContain('🧈 Butter: 33% off (-£0.40)');
    });

    test('3 butters = 33% off each', () => {
      const items: BasketItem[] = [
        { id: 5, name: 'Butter', price: 1.20, quantity: 3 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(3.60);
      expect(result.savings).toBe(1.20); // 3.60 / 3
      expect(result.total).toBe(2.40);
    });

    test('2 butters = 33% off each', () => {
      const items: BasketItem[] = [
        { id: 5, name: 'Butter', price: 1.20, quantity: 2 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(2.40);
      expect(result.savings).toBe(0.80); // 2.40 / 3
      expect(result.total).toBe(1.60);
    });
  });

  describe('Multiple offers combined', () => {
    test('All offers applied together', () => {
      const items: BasketItem[] = [
        { id: 3, name: 'Cheese', price: 0.90, quantity: 2 },  // £1.80 -> save £0.90
        { id: 4, name: 'Soup', price: 0.60, quantity: 1 },    // £0.60
        { id: 1, name: 'Bread', price: 1.10, quantity: 1 },   // £1.10 -> save £0.55
        { id: 5, name: 'Butter', price: 1.20, quantity: 1 }    // £1.20 -> save £0.40
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBeCloseTo(4.70, 2); // 1.80 + 0.60 + 1.10 + 1.20
      expect(result.savings).toBeCloseTo(1.85, 2);  // 0.90 + 0.55 + 0.40
      expect(result.total).toBeCloseTo(2.85, 2);
      expect(result.offerBreakdown).toHaveLength(3);
    });

    test('Complex basket with multiple quantities', () => {
      const items: BasketItem[] = [
        { id: 3, name: 'Cheese', price: 0.90, quantity: 4 },   // 4 cheeses = 2 free
        { id: 4, name: 'Soup', price: 0.60, quantity: 3 },     // 3 soups
        { id: 1, name: 'Bread', price: 1.10, quantity: 2 },    // 2 breads = half price on 2
        { id: 5, name: 'Butter', price: 1.20, quantity: 2 },   // 2 butters = 33% off
        { id: 2, name: 'Milk', price: 0.50, quantity: 3 }      // 3 milks (no offer)
      ];
      
      const result = calculateTotals(items);
      
      // Calculate expected values
      const cheeseSubtotal = 4 * 0.90;  // = 3.60
      const soupSubtotal = 3 * 0.60;    // = 1.80
      const breadSubtotal = 2 * 1.10;   // = 2.20
      const butterSubtotal = 2 * 1.20;  // = 2.40
      const milkSubtotal = 3 * 0.50;    // = 1.50
      
      const expectedSubtotal = cheeseSubtotal + soupSubtotal + breadSubtotal + butterSubtotal + milkSubtotal;
      expect(result.subtotal).toBeCloseTo(expectedSubtotal, 2); // 11.50
      
      // Calculate savings
      const cheeseSaving = 2 * 0.90;           // 2 free cheeses = 1.80
      const breadSaving = 2 * (1.10 / 2);      // half price on 2 breads = 1.10
      const butterSaving = butterSubtotal / 3; // 33% off butter = 0.80
      
      const expectedSavings = cheeseSaving + breadSaving + butterSaving;
      expect(result.savings).toBeCloseTo(expectedSavings, 2); // 3.70
      expect(result.total).toBeCloseTo(expectedSubtotal - expectedSavings, 2); // 7.80
      expect(result.offerBreakdown).toHaveLength(3);
    });
  });

  describe('Edge cases', () => {
    test('No offers applied', () => {
      const items: BasketItem[] = [
        { id: 2, name: 'Milk', price: 0.50, quantity: 3 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(1.50);
      expect(result.savings).toBe(0);
      expect(result.total).toBe(1.50);
      expect(result.offerBreakdown).toHaveLength(0);
    });

    test('Empty basket', () => {
      const items: BasketItem[] = [];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(0);
      expect(result.savings).toBe(0);
      expect(result.total).toBe(0);
      expect(result.offerBreakdown).toHaveLength(0);
    });

    test('Cheese offer with 1 cheese only', () => {
      const items: BasketItem[] = [
        { id: 3, name: 'Cheese', price: 0.90, quantity: 1 }
      ];
      
      const result = calculateTotals(items);
      expect(result.subtotal).toBe(0.90);
      expect(result.savings).toBe(0);
      expect(result.total).toBe(0.90);
      expect(result.offerBreakdown).toHaveLength(0);
    });
  });
});