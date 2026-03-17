import { calculateTotals } from "../types/product";

test("cheese offer", () => {
  const items = [{ id: 1, name: "Cheese", price: 1, quantity: 2 }];
  const result = calculateTotals(items);

  expect(result.savings).toBe(1);
});