import { useSelector } from "react-redux";
import { saveOrder } from "./services/orderService";
import { calculateTotals } from "./features/basket/basketSelectors";

const handleOrder = async (items : any) => {
  try {
    const { subtotal, savings, total } = calculateTotals(items);

    const orderData = {
      items,
      subtotal,
      savings,
      total
    };

    await saveOrder(orderData);

    alert("✅ Order placed successfully!");
  } catch (err) {
    alert("❌ Failed to place order");
  }
};