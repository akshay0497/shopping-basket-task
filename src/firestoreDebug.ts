import { db } from "./firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const checkFirestoreConnection = async () => {
  try {
    //console.log('Checking Firestore connection...');
    //console.log('Firestore instance:', db);
    //console.log('Project ID:', db.app.options.projectId);
    
    // Try to access a collection
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    
    //console.log('✅ Firestore connection successful!');
    //console.log(`Found ${snapshot.size} orders`);
    
    return { success: true, orders: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return { success: false, error };
  }
};

export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};