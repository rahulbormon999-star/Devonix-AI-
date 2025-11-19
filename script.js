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
  authDomain: "devonix-ai.firebas
  // ===============================================
// 3a. FIREBASE INITIALIZATION (ডেটা সেভ করার জন্য)
// ===============================================
// ********* আপনার Firebase কনফিগারেশন এখানে আপডেট করুন *********
// এই কীগুলি আপনার আপলোড করা ছবি থেকে নেওয়া হয়েছে, কিন্তু আপনাকে পুরো কীগুলি বসাতে হবে।
const firebaseConfig = {
    apiKey: "AIzaSyBdL2IGfrsMMKPF5ZaCUgW... (আপনার সম্পূর্ণ API কী দিন)", 
    authDomain: "devonix-ai.firebaseapp.com",
    projectId: "devonix-ai",
    storageBucket: "devonix-ai.appspot.com",
    messagingSenderId: "67398450167",
    appId: "1:67398450167:web:12ed985fbcb... (আপনার সম্পূর্ণ App ID দিন)",
    measurementId: "G-89899WL00E"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log("Firebase and Firestore initialized.");
} else {
    console.error("Firebase SDK not loaded.");
}


// ===============================================
// 1. LANGUAGE TRANSLATION LOGIC (ভাষা পরিবর্তনের লজিক)
// ===============================================

const translations = {
    'en': {
        pageTitle: 'Devonix AI Sign Up',
        appName: 'Devonix AI',
        signupTitle: 'Create Your Devonix AI Account',
        placeholderName: 'Full Name',
        placeholderPhone: 'Phone Number',
        placeholderDOB: 'Date of Birth',
        placeholderCountry: 'Country',
        placeholderDistrict: 'District',
        placeholderThana: 'Thana',
        placeholderPassword: 'Password',
        signupBtnText: 'Sign Up',
        loginText: 'Already have an account? Login',
        storeWelcome: 'Welcome to Devonix Store!',
        storeMessage: 'Your account has been successfully created. Download your apps below.',
        storeBtnText: 'Devonix Store',
        appPlaceholder: 'No apps uploaded yet. Check back soon!'
    },
    'bn': {
        pageTitle: 'ডেভোনিক্স এআই সাইন আপ',
        appName: 'ডেভোনিক্স এআই',
        signupTitle: 'আপনার ডেভোনিক্স এআই অ্যাকাউন্ট তৈরি করুন',
        placeholderName: 'পুরো নাম',
        placeholderPhone: 'ফোন নম্বর',
        placeholderDOB: 'জন্ম তারিখ',
        placeholderCountry: 'দেশ',
        placeholderDistrict: 'জেলা',
        placeholderThana: 'থানা',
        placeholderPassword: 'পাসওয়ার্ড',
        signupBtnText: 'সাইন আপ করুন',
        loginText: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে? লগইন করুন',
        storeWelcome: 'ডেভোনিক্স স্টোরে স্বাগতম!',
        storeMessage: 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। নিচে আপনার অ্যাপগুলি ডাউনলোড করুন।',
        storeBtnText: 'ডেভোনিক্স স্টোর',
        appPlaceholder: 'এখনো কোনো অ্যাপ আপলোড করা হয়নি। শীঘ্রই আবার দেখুন!'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    
    // ফাংশন যা অনুবাদ প্রয়োগ করে
    function applyTranslation(lang) {
        const t = translations[lang] || translations['en'];
        
        // data-key অ্যাট্রিবিউট অনুযায়ী অনুবাদ আপডেট করা হচ্ছে
        Object.keys(t).forEach(key => {
            const elements = document.querySelectorAll(`[data-key="${key}"]`);
            elements.forEach(el => {
                if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'BUTTON' || el.tagName === 'P' || el.tagName === 'TITLE') {
                    if (el.tagName === 'TITLE') {
                        document.title = t[key];
                    } else {
                        // লগইন টেক্সটের জন্য বিশেষ ব্যবস্থা যাতে লিঙ্কটি ঠিক থাকে
                        if (key === 'loginText') {
                            const link = el.querySelector('a');
                            el.innerHTML = t[key].split('?')[0] + '? ';
                            if (link) {
                                el.appendChild(link);
                                link.textContent = (t[key].split('? ')[1] || 'Login'); 
                            }
                        } else {
                            el.textContent = t[key];
                        }
                    }
                } 
                else if (el.tagName === 'INPUT' && el.placeholder) {
                    el.placeholder = t[key];
                }
            });
        });
    }

    // প্রাথমিক ভাষা সেট করা
    const initialLang = localStorage.getItem('language') || 'en';
    languageSelect.value = initialLang;
    applyTranslation(initialLang);

    // ভাষা পরিবর্তন ইভেন্ট লিসেনার
    languageSelect.addEventListener('change', (event) => {
        const newLang = event.target.value;
        localStorage.setItem('language', newLang);
        applyTranslation(newLang);
    });


    // ===============================================
    // 2. PASSWORD TOGGLE LOGIC (পাসওয়ার্ড দেখানোর লজিক)
    // ===============================================
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    togglePassword.addEventListener('click', function () {
        // পাসওয়ার্ড টাইপ 'password' থেকে 'text' এ পরিবর্তন
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // চোখের আইকন পরিবর্তন
        eyeIcon.classList.toggle('fa-eye-slash');
    });


    // ===============================================
    // 3. SIGN UP & NAVIGATION LOGIC (সাইন আপ এবং স্ক্রিন পরিবর্তনের লজিক)
    // ===============================================
    const signupBtn = document.getElementById('signupBtn');
    const signupSection = document.getElementById('signup-section');
    const storeSection = document.getElementById('store-section');
    
    // মেসেজ দেখানোর ফাংশন
    function displayMessage(message, isError = false) {
        alert(message);
        if (isError) console.error(message);
    }
    
    // সাইন আপ ফাংশন
    signupBtn.addEventListener('click', async (event) => {
        event.preventDefault(); 
        
        // 1. ফর্মের ডেটা সংগ্রহ
        const userData = {
            fullName: document.getElementById('name').value,
            phoneNumber: document.getElementById('phone').value,
            dateOfBirth: document.getElementById('dob').value,
            country: document.getElementById('country').value,
            district: document.getElementById('district').value,
            thana: document.getElementById('thana').value,
            password: document.getElementById('password').value,
            signupDate: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // সাধারণ ভ্যালিডেশন
        if (!userData.fullName || !userData.phoneNumber || !userData.password) {
            displayMessage('অনুগ্রহ করে সমস্ত প্রয়োজনীয় ঘর পূরণ করুন।', true);
            return;
        }

        // 2. ডেটা Firestore-এ সেভ করা
        try {
            if (!db) {
                displayMessage('ডেটাবেস সংযোগ ব্যর্থ হয়েছে। Firebase সেটআপ পরীক্ষা করুন।', true);
                return;
            }
            
            // 'users' কালেকশনে ডেটা যোগ করা হচ্ছে
            await db.collection("users").add(userData);

            // 3. সফল হলে নতুন স্ক্রিনে যাওয়া
            displayMessage('সাইন আপ সফল হয়েছে! এখন স্টোরে নিয়ে যাওয়া হচ্ছে...');
            signupSection.style.display = 'none'; // সাইন আপ ফর্ম লুকানো
            storeSection.style.display = 'block'; // স্টোর স্ক্রিন দেখানো
            
        } catch (error) {
            displayMessage(`সাইন আপ ব্যর্থ হয়েছে: ${error.message}`, true);
        }
    });

});

