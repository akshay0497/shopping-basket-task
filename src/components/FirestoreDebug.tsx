import { useState, useEffect } from 'react';
import { checkFirestoreConnection, getAllOrders } from '../firestoreDebug';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FirestoreDebug() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<any>('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus('checking');
    const result : any = await checkFirestoreConnection();
    
    if (result?.success) {
      setStatus('connected');
      setOrders(result.orders || []);
      setError('');
    } else {
      setStatus('error');
      setError(result.error?.message || 'Unknown error');
    }
  };

  const createTestOrder = async () => {
    try {
      const testOrder = {
        items: [
          { id: 1, name: 'Test Product', price: 9.99, quantity: 1 }
        ],
        subtotal: 9.99,
        savings: 0,
        total: 9.99,
        itemCount: 1,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), testOrder);
      //console.log('Test order created with ID:', docRef.id);
      
      // Refresh orders
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders);
      
      alert(`✅ Test order created with ID: ${docRef.id}`);
    } catch (err : any) {
      console.error('Failed to create test order:', err);
      alert(`❌ Failed: ${err.message}`);
    }
  };

  if (!expanded) {
    return (
      <button 
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        🔍 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold">Firestore Debugger</h3>
        <button 
          onClick={() => setExpanded(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="p-4 max-h-96 overflow-auto">
        {/* Connection Status */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Connection Status:</p>
          {status === 'checking' && (
            <div className="flex items-center gap-2 text-yellow-600">
              <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
              Checking connection...
            </div>
          )}
          {status === 'connected' && (
            <p className="text-green-600 flex items-center gap-1">
              <span>✅</span> Connected to Firestore
            </p>
          )}
          {status === 'error' && (
            <div>
              <p className="text-red-600 flex items-center gap-1 mb-1">
                <span>❌</span> Connection failed
              </p>
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="mb-4 bg-gray-50 p-3 rounded">
          <p className="text-xs font-mono break-all">
            <span className="text-gray-500">Project:</span> {db.app.options.projectId}
          </p>
          <p className="text-xs font-mono">
            <span className="text-gray-500">Database:</span> (default)
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={testConnection}
            className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
          >
            Test Connection
          </button>
          <button
            onClick={createTestOrder}
            className="flex-1 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700"
          >
            Create Test Order
          </button>
        </div>

        {/* Orders List */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Recent Orders ({orders.length}):
          </p>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No orders found</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order, index) => (
                <div key={order.id || index} className="bg-gray-50 p-2 rounded text-xs">
                  <p className="font-mono text-gray-600">ID: {order.id}</p>
                  <p>Items: {order.items?.length || 0}</p>
                  <p>Total: £{order.total?.toFixed(2) || 0}</p>
                  <p className="text-gray-500">
                    {order.createdAt?.toDate?.() 
                      ? order.createdAt.toDate().toLocaleString()
                      : order.timestamp || 'No timestamp'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Troubleshooting Tips */}
        {status === 'error' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800 mb-2">Troubleshooting:</p>
            <ul className="text-xs text-yellow-700 list-disc pl-4 space-y-1">
              <li>Make sure Firestore is enabled in Firebase Console</li>
              <li>Check if database is in test mode</li>
              <li>Verify Firebase project ID is correct</li>
              <li>Check browser console for detailed errors</li>
              <li>Ensure no ad blockers are interfering</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}