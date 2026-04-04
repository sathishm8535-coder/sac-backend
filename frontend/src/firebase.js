import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCpGrmaOXenIj67z_gYIHt72u41JVtrPyo",
  authDomain: "sac-exam-a8bb7.firebaseapp.com",
  projectId: "sac-exam-a8bb7",
  storageBucket: "sac-exam-a8bb7.firebasestorage.app",
  messagingSenderId: "247149515241",
  appId: "1:247149515241:web:5aeb7b3f884770e9ccfb78",
  measurementId: "G-B8GHXFBRZK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
