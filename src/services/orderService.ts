import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";

export const saveOrder = async (order: any) => {
  try {
    //console.log('Saving order to Firestore...', order);
    
    const ordersRef = collection(db, "orders");
    
    const docRef = await addDoc(ordersRef, {
      ...order,
      createdAt: serverTimestamp(),
      status: 'completed',
      environment: process.env.NODE_ENV
    });

    //console.log("✅ Order saved successfully with ID:", docRef.id);
    
    return docRef.id;
  } catch (error : any) {
    console.error("❌ Error saving order:", error);
    
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Check Firestore security rules.");
    } else if (error.code === 'not-found') {
      throw new Error("Database not found. Enable Firestore in Firebase Console.");
    } else {
      throw new Error(`Failed to save order: ${error.message}`);
    }
  }
};

export const fetchOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const fetchRecentOrders = async (limitCount = 10) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
};