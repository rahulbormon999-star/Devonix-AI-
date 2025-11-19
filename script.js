// --------------------------
// 1. Firebase Configuration
// --------------------------
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
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "XXXXXXXXXXXX",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ------------------------
// 2. Language List (50)
// ------------------------
const languages = [
    "Bangla", "English", "Hindi", "Urdu", "Spanish", "Arabic", "French", "German",
    "Chinese", "Japanese", "Korean", "Russian", "Italian", "Portuguese", "Turkish",
    "Thai", "Vietnamese", "Indonesian", "Nepali", "Tamil", "Gujarati", "Kannada",
    "Malayalam", "Sinhala", "Hebrew", "Dutch", "Polish", "Swedish", "Norwegian",
    "Danish", "Romanian", "Czech", "Greek", "Hungarian", "Filipino", "Bengali India",
    "Punjabi", "Marathi", "Lao", "Myanmar", "Khmer", "Persian", "Swahili", "Zulu",
    "Afrikaans", "Finnish", "Ukrainian", "Slovak", "Croatian", "Serbian"
];

// Add to Dropdown
const langSelect = document.getElementById("language");
languages.forEach(l => {
    const opt = document.createElement("option");
    opt.textContent = l;
    opt.value = l;
    langSelect.appendChild(opt);
});


// ------------------------
// 3. Password Show/Hide
// ------------------------
function togglePassword() {
    const pass = document.getElementById("password");
    pass.type = pass.type === "password" ? "text" : "password";
}


// ------------------------
// 4. Multi-language UI text
// ------------------------
function updateLanguage(lang) {
    if (lang === "Bangla") {
        document.getElementById("title").innerText = "একাউন্ট তৈরি করুন";
        document.getElementById("label-name").innerText = "আপনার নাম";
        document.getElementById("label-email").innerText = "ইমেইল অ্যাড্রেস";
        document.getElementById("label-password").innerText = "পাসওয়ার্ড";
        document.getElementById("label-language").innerText = "ভাষা নির্বাচন করুন";
        document.getElementById("signupBtn").innerText = "সাইন আপ";
    }
}

langSelect.addEventListener("change", () => {
    updateLanguage(langSelect.value);
});


// ------------------------
// 5. Signup Function
// ------------------------
function signupUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const language = document.getElementById("language").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            const uid = user.user.uid;

            db.collection("users").doc(uid).set({
                name: name,
                email: email,
                language: language
            });

            document.querySelector(".container").style.display = "none";
            document.getElementById("dashboard").style.display = "block";

            document.getElementById("dash-welcome").innerText =
                language === "Bangla"
                    ? `স্বাগতম, ${name}!`
                    : `Welcome, ${name}!`;

        })
        .catch(err => alert(err.message));
}
  

