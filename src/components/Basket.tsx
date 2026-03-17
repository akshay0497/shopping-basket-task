import { useSelector, useDispatch } from "react-redux";
import { calculateTotals } from "../utils/basketCalculations";
import BasketItem from "./BasketItem";
import { saveOrder } from "../services/orderService";
import { useState } from "react";
import { clearBasket, setLoading, setError } from "../features/basket/basketSlice";
import { RootState } from "../store";
import { ShoppingBag, Tag, Percent, AlertCircle, CheckCircle } from "lucide-react";

export default function Basket() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.basket.items);
  const isLoading = useSelector((state: RootState) => state.basket.loading);
  
  const [orderStatus, setOrderStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const { subtotal, savings, total, offerBreakdown } = calculateTotals(items);

  const handleOrder = async () => {
    if (items.length === 0) {
      setOrderStatus({
        type: 'error',
        message: 'Your basket is empty!'
      });
      return;
    }

    dispatch(setLoading(true));
    setOrderStatus({ type: null, message: '' });

    try {
      const orderData = {
        items,
        subtotal,
        savings,
        total,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        timestamp: new Date().toISOString()
      };

      const orderId = await saveOrder(orderData);
      
      setOrderStatus({
        type: 'success',
        message: `Order placed successfully! Order ID: ${orderId.slice(0, 8)}...`
      });
      
      dispatch(clearBasket());
    } catch (error) {
      setOrderStatus({
        type: 'error',
        message: 'Failed to place order. Please try again.'
      });
      dispatch(setError('Failed to save order'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearBasket = () => {
    if (items.length > 0 && window.confirm('Clear all items from basket?')) {
      dispatch(clearBasket());
      setOrderStatus({
        type: 'success',
        message: 'Basket cleared successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setOrderStatus({ type: null, message: '' }), 3000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your basket is empty</h3>
        <p className="text-gray-500">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Status Messages */}
      {orderStatus.type && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          orderStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {orderStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm">{orderStatus.message}</p>
        </div>
      )}

      {/* Basket Items */}
      <div className="bg-white rounded-lg">
        {items.map((item: any) => (
          <BasketItem key={item.id} item={item} />
        ))}
      </div>

      {/* Offers Section */}
      {offerBreakdown.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-green-800">Applied Offers</h4>
          </div>
          <ul className="space-y-1">
            {offerBreakdown.map((offer, index) => (
              <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full" />
                {offer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Totals Section */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-medium">£{subtotal.toFixed(2)}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex justify-between text-green-600">
            <div className="flex items-center gap-1">
              <Percent className="w-4 h-4" />
              <span>Savings:</span>
            </div>
            <span className="font-medium">-£{savings.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
          <span>Total:</span>
          <span className="text-green-600">£{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleOrder}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Place Order
            </>
          )}
        </button>

        {items.length > 0 && (
          <button
            onClick={handleClearBasket}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Clear Basket
          </button>
        )}
      </div>
    </div>
  );
}