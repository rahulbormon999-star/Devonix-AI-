// ========== Firebase Setup ==========
const firebaseConfig = {// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdL2IGfrsMMKpF5ZaCUgW3fAlH-0lpht4",
  authDomain: "devonix-ai.firebaseapp.com",
  projectId: "devonix-ai",
  storageBucket: "devonix-ai.firebasestorage.app",
  messagingSenderId: "67398450167",
  appId: "1:67398450167:web:12ed985fcb4aa53a0f4cf2",
  measurementId: "G-89899WL00E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// উপরের জায়গায় Firebase থেকে পাওয়া কোড বসাতে হবে ↑↑↑

// Firebase initialize
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// ========== Signup & Login Logic ==========
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const goToLogin = document.getElementById("goToLogin");
const goToSignup = document.getElementById("goToSignup");

const signupSection = document.getElementById("signup-section");
const loginSection = document.getElementById("login-section");
const storeSection = document.getElementById("store-section");

// Change form view
goToLogin.onclick = () => {
  signupSection.style.display = "none";
  loginSection.style.display = "block";
};

goToSignup.onclick = () => {
  loginSection.style.display = "none";
  signupSection.style.display = "block";
};

// Signup
signupBtn.onclick = async () => {
  const user = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    dob: document.getElementById("dob").value,
    country: document.getElementById("country").value,
    district: document.getElementById("district").value,
    thana: document.getElementById("thana").value,
    password: document.getElementById("password").value
  };

  if (user.phone && user.password) {
    await db.collection("users").doc(user.phone).set(user);
    alert("✅ Account Created Successfully!");
    signupSection.style.display = "none";
    loginSection.style.display = "block";
  } else {
    alert("❌ Please fill all required fields!");
  }
};

// Login
loginBtn.onclick = async () => {
  const phone = document.getElementById("loginPhone").value;
  const pass = document.getElementById("loginPassword").value;

  const doc = await db.collection("users").doc(phone).get();

  if (doc.exists && doc.data().password === pass) {
    alert("✅ Login Successful!");
    loginSection.style.display = "none";
    storeSection.style.display = "block";
  } else {
    alert("❌ Invalid Phone or Password!");
  }
};

// ========== Multi-Language Support ==========
const languageData = {
  en: {
    signupTitle: "Create Your Devonix AI Account",
    signupBtn: "Sign Up",
    loginTitle: "Login to Devonix AI",
    loginBtn: "Login",
    loginLink: "Login",
    signupLink: "Sign Up",
    storeTitle: "Devonix Store",
    storeText: "Your uploaded apps will appear here."
  },
  bn: {
    signupTitle: "আপনার Devonix AI একাউন্ট তৈরি করুন",
    signupBtn: "সাইন আপ করুন",
    loginTitle: "Devonix AI-এ লগইন করুন",
    loginBtn: "লগইন করুন",
    loginLink: "লগইন করুন",
    signupLink: "সাইন আপ করুন",
    storeTitle: "ডেবোনিক্স স্টোর",
    storeText: "আপনার আপলোড করা অ্যাপস এখানে দেখা যাবে।"
  },
  hi: {
    signupTitle: "अपना Devonix AI खाता बनाएं",
    signupBtn: "साइन अप करें",
    loginTitle: "Devonix AI में लॉग इन करें",
    loginBtn: "लॉग इन करें",
    loginLink: "लॉग इन करें",
    signupLink: "साइन अप करें",
    storeTitle: "डेवोनिक्स स्टोर",
    storeText: "आपके द्वारा अपलोड किए गए ऐप यहाँ दिखाई देंगे।"
  }
};

document.getElementById("languageSelect").addEventListener("change", (e) => {
  const lang = e.target.value;
  const keys = document.querySelectorAll("[data-key]");
  keys.forEach((el) => {
    el.innerText = languageData[lang][el.dataset.key] || el.innerText;
  });
});
