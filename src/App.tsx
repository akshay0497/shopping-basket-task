import { Provider } from "react-redux";
import { store } from "./store";
import Basket from "./components/Basket";
import ProductList from "./components/ProductList";
import OrderManager from "./components/OrderManager";
import { ShoppingBasket, History } from "lucide-react";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-xl">
                  <ShoppingBasket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Smart Basket</h1>
                  <p className="text-sm text-gray-500">Smart shopping with automatic offers</p>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'shop' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🛒 Shop
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'orders' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Order History
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'shop' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-600 rounded-full" />
                    Products
                  </h2>
                  <ProductList />
                </div>
              </div>

              {/* Basket Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-600 rounded-full" />
                    Your Basket
                  </h2>
                  <Basket />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded-full" />
                Order History
              </h2>
              <OrderManager />
            </div>
          )}
        </main>
      </div>
    </Provider>
  );
}

export default App;