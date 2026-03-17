import { useState } from 'react';
import { calculateTotals } from '../utils/basketCalculations';
import { products } from '../data/products';

export default function OfferTester() {
  const [testItems, setTestItems] = useState([
    { id: 3, name: 'Cheese', price: 0.90, quantity: 2 },
    { id: 4, name: 'Soup', price: 0.60, quantity: 1 },
    { id: 1, name: 'Bread', price: 1.10, quantity: 1 },
    { id: 5, name: 'Butter', price: 1.20, quantity: 1 }
  ]);

  const results = calculateTotals(testItems);

  const updateQuantity = (id: number, change: number) => {
    setTestItems((prev : any) => 
      prev.map((item : any) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const resetToDefault = () => {
    setTestItems([
      { id: 3, name: 'Cheese', price: 0.90, quantity: 2 },
      { id: 4, name: 'Soup', price: 0.60, quantity: 1 },
      { id: 1, name: 'Bread', price: 1.10, quantity: 1 },
      { id: 5, name: 'Butter', price: 1.20, quantity: 1 }
    ]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🧪 Offer Tester</h2>
      
      <div className="space-y-4 mb-6">
        {testItems.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">£{item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => updateQuantity(item.id, -1)}
                className="w-8 h-8 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)}
                className="w-8 h-8 bg-green-100 text-green-600 rounded hover:bg-green-200"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={resetToDefault}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Reset to Default
      </button>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-3">Results:</h3>
        
        {results.offerBreakdown.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded">
            <p className="font-medium text-green-800 mb-2">Applied Offers:</p>
            {results.offerBreakdown.map((offer, i) => (
              <p key={i} className="text-sm text-green-700">• {offer}</p>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">£{results.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Savings:</span>
            <span className="font-medium">-£{results.savings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-green-600">£{results.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded text-sm">
        <p className="font-medium text-blue-800 mb-1">📋 Offer Rules:</p>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>Cheese: Buy 1, get 1 free (£0.90 saved per pair)</li>
          <li>Soup + Bread: Half price bread (£0.55 saved per bread with soup)</li>
          <li>Butter: 1/3 off (£0.40 saved per butter)</li>
        </ul>
      </div>
    </div>
  );
}