import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function addProduct(product: any) {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    return docRef.id;
  } catch (e) {
    console.error("Error adding product: ", e);
    throw e;
  }
}
