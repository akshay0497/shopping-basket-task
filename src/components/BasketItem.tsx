import { useDispatch } from "react-redux";
import { addItem, removeItem, removeItemCompletely } from "../features/basket/basketSlice";
import { BasketItem as BasketItemType } from "../types/basket.types";
import { Trash2, Plus, Minus } from "lucide-react";

interface Props {
  item: BasketItemType;
}

export default function BasketItem({ item }: Props) {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(addItem({ id: item.id, name: item.name, price: item.price }));
  };

  const handleDecrement = () => {
    if (item.quantity === 1) {
      if (window.confirm(`Remove ${item.name} from basket?`)) {
        dispatch(removeItemCompletely(item.id));
      }
    } else {
      dispatch(removeItem(item.id));
    }
  };

  const handleRemove = () => {
    if (window.confirm(`Remove all ${item.name} from basket?`)) {
      dispatch(removeItemCompletely(item.id));
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600">
          £{item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-gray-600 hover:text-red-600"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          
          <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-gray-600 hover:text-green-600"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* <p className="font-semibold text-gray-800 min-w-[80px] text-right">
          £{itemTotal.toFixed(2)}
        </p> */}

        <button
          onClick={handleRemove}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
          aria-label="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}