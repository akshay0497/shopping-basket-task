import { useDispatch } from "react-redux";
import { addItem } from "../features/basket/basketSlice";
import { products } from "../data/products";
import { Product } from "../types/basket.types";
import { ShoppingCart } from "lucide-react";

export default function ProductList() {
  const dispatch = useDispatch();

  const handleAddToBasket = (product: Product) => {
    dispatch(addItem(product));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-3xl font-bold text-green-600">
                £{product.price.toFixed(2)}
              </p>
            </div>
            
            <button
              onClick={() => handleAddToBasket(product)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Add to Basket
            </button>
          </div>
          
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity" />
        </div>
      ))}
    </div>
  );
}