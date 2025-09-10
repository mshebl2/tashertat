// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore, getFirestore, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPsTy9KtXrCYbqJIow-jLltutiFP9FyG0",
  authDomain: "perfume-eb466.firebaseapp.com",
  projectId: "perfume-eb466",
  storageBucket: "perfume-eb466.appspot.com",
  messagingSenderId: "182989189383",
  appId: "1:182989189383:web:f2b7b70cef5d060c09d5a2",
  measurementId: "G-2GR0S15PJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Reduce console noise and avoid WebChannel where possible
try {
  setLogLevel('error');
} catch {}

// Prefer fetch-based transport; helps with some extensions/firewalls
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
      experimentalAutoDetectLongPolling: true,
      useFetchStreams: false,
    });
  } catch {
    return getFirestore(app);
  }
})();
export const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };
