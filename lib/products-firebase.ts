import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProductsByCategory(category: string) {
  const q = query(collection(db, "products"), where("category", "==", category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
