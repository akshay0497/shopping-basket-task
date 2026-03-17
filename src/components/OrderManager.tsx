import { useState, useEffect } from 'react';
import { fetchOrders } from '../services/orderService';
import { Search, Calendar, DollarSign, Package, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  savings: number;
  total: number;
  itemCount: number;
  createdAt?: Date;
  timestamp?: string;
}

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Order>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [searchTerm, orders, sortField, sortDirection]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders : any= await fetchOrders();
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        // Search in order ID
        if (order.id.toLowerCase().includes(term)) return true;
        
        // Search in items
        const hasMatchingItem = order.items.some(item => 
          item.name.toLowerCase().includes(term)
        );
        if (hasMatchingItem) return true;
        
        // Search in totals
        if (order.total.toString().includes(term)) return true;
        
        return false;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle dates
      if (sortField === 'createdAt') {
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      }

      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle strings
      if (sortDirection === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

    setFilteredOrders(filtered);
  };

  const handleSort = (field: keyof Order) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === search.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    );
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const SortIcon = ({ field }: { field: keyof Order }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 inline ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">📋 Order History</h2>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Found {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Orders Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                Order ID <SortIcon field="id" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                Date <SortIcon field="createdAt" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('itemCount')}
              >
                Items <SortIcon field="itemCount" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('subtotal')}
              >
                Subtotal <SortIcon field="subtotal" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('savings')}
              >
                Savings <SortIcon field="savings" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('total')}
              >
                Total <SortIcon field="total" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No orders found</p>
                  {searchTerm && (
                    <p className="text-sm">Try adjusting your search term</p>
                  )}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <>
                  <tr 
                    key={index+1}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {highlightText(order.id.slice(0, 8) + '...', searchTerm)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(order.createdAt || order.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.itemCount || order.items?.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      £{order.subtotal?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      -£{order.savings?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      £{order.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-gray-700 mb-3">Order Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Items:</p>
                              <ul className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      {highlightText(item.name, searchTerm)} × {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      £{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Summary:</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Subtotal:</span>
                                  <span>£{order.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600">
                                  <span>Savings:</span>
                                  <span>-£{order.savings?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold pt-1 border-t">
                                  <span>Total:</span>
                                  <span>£{order.total?.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {filteredOrders.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Total Orders: <span className="font-semibold">{filteredOrders.length}</span>
            </span>
            <span className="text-gray-600">
              Total Revenue: <span className="font-semibold text-green-600">
                £{filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
              </span>
            </span>
            <span className="text-gray-600">
              Total Savings: <span className="font-semibold text-green-600">
                £{filteredOrders.reduce((sum, order) => sum + (order.savings || 0), 0).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}