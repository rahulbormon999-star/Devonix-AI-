// script.js ফাইল

// *******************************************************************
// ১. আপনার ব্যক্তিগত Firebase কনফিগারেশন কোড এখানে বসান
// *******************************************************************
const firebaseConfig = { 
    apiKey: "YOUR_API_KEY_HERE", 
    authDomain: "devonix-ai-....firebaseapp.com",
    projectId: "devonix-ai-....",
    // Import the functions you need from the SDKs you need
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
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// *******************************************************************
// ২. স্ক্রিন এবং স্টেপ নিয়ন্ত্রণের ভেরিয়েবল
// *******************************************************************
let currentStep = 1;
const totalSteps = 6;
const stepsContainer = document.getElementById('steps-container');

const landingScreen = document.getElementById('landing-screen');
const registrationFlow = document.getElementById('registration-flow');
const mainStore = document.getElementById('main-store');

const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

// *******************************************************************
// ৩. প্রধান ফাংশন - স্ক্রিন দেখান/লুকান
// *******************************************************************

// নির্দিষ্ট আইডি দিয়ে স্ক্রিন দেখানোর ফাংশন
function showScreen(screenId) {
    // সব স্ক্রিন প্রথমে লুকিয়ে ফেলুন
    landingScreen.classList.add('hidden');
    registrationFlow.classList.add('hidden');
    mainStore.classList.add('hidden');
    
    // নির্দিষ্ট স্ক্রিন দেখান
    document.getElementById(screenId).classList.remove('hidden');
}

// লগইন স্ট্যাটাস চেক করুন (ব্যবহারকারী একবার অ্যাকাউন্ট তৈরি করেছে কিনা)
function checkLoginStatus() {
    // এখানে আপনার লগইন চেক করার লজিক লিখতে হবে (যেমন লোকাল স্টোরেজ চেক করা)
    const isUserRegistered = localStorage.getItem('user_registered') === 'true';
    
    if (isUserRegistered) {
        showScreen('main-store'); // সরাসরি মূল স্ক্রিনে নিয়ে যান
        loadApps(); // অ্যাপ লোড করুন
    } else {
        showScreen('landing-screen'); // ল্যান্ডিং স্ক্রিন দেখান
    }
}

// *******************************************************************
// ৪. রেজিস্ট্রেশন ফ্লো নিয়ন্ত্রণ
// *******************************************************************

// নির্দিষ্ট স্টেপ দেখান
function showStep(step) {
    // সব স্টেপ লুকিয়ে ফেলুন
    stepsContainer.querySelectorAll('.step-content').forEach(element => {
        element.classList.add('hidden');
    });
    
    // বর্তমান স্টেপ দেখান
    stepsContainer.querySelector(`[data-step="${step}"]`).classList.remove('hidden');
    
    // বাটনগুলোর অবস্থা ঠিক করুন
    backBtn.classList.toggle('hidden', step === 1);
    nextBtn.classList.toggle('hidden', step === totalSteps);
    submitBtn.classList.toggle('hidden', step !== totalSteps);
    
    currentStep = step;
}

// Next বাটন হ্যান্ডলার
function handleNext() {
    // এখানে ইনপুট ভ্যালিডেশন লজিক লিখতে হবে
    // if (!validateStep(currentStep)) return; 

    if (currentStep < totalSteps) {
        showStep(currentStep + 1);
    }
}

// Back বাটন হ্যান্ডলার
function handleBack() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    } else {
        showScreen('landing-screen'); // যদি প্রথম স্টেপে থাকে, তবে ল্যান্ডিং এ ফিরে যান
    }
}

// *******************************************************************
// ৫. সাবমিট এবং অ্যাপ লোড লজিক
// *******************************************************************

// অ্যাকাউন্ট তৈরি সম্পন্ন করা
function completeRegistration() {
    // এখানে Firebase বা অন্য সার্ভারে ডেটা সাবমিট করার লজিক লিখতে হবে
    
    // সাবমিট সফল হলে:
    localStorage.setItem('user_registered', 'true'); // ব্যবহারকারী নিবন্ধিত হয়েছে, তা সেভ করুন
    showScreen('main-store'); 
    loadApps(); // মূল অ্যাপ স্টোরের ডেটা লোড করুন
}

// Firebase থেকে অ্যাপস লোড করার ফাংশন (পুরোনো কোড)
function loadApps() {
    const container = document.getElementById('app-list-container');
    container.innerHTML = '<h3 style="color: #007bff; text-align: center;">অ্যাপ লোড হচ্ছে...</h3>';
    
    // *** আপনার Firebase 'apps' কালেকশন থেকে ডেটা আনার কোড এখানে লিখুন ***
    db.collection("apps").get().then((querySnapshot) => {
        container.innerHTML = '';
        if (querySnapshot.empty) {
            container.innerHTML = '<p style="color:#666; text-align:center;">এখনও কোনো অ্যাপ আপলোড করা হয়নি।</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const app = doc.data(); 
            // app-card ক্লাস ব্যবহার করে ডেটা দেখানো
            container.innerHTML += `
                <div class="app-card">
                    <h2>${app.name}</h2>
                    <p style="color: #666;">${app.description || 'No description available.'}</p>
                    <p style="font-weight: bold; color: #e91e63;">Price: $${app.price || 'FREE'}</p>
                    <a href="${app.downloadUrl || '#'}" target="_blank">Download Now</a>
                </div>
            `;
        });
    }).catch((error) => {
        console.error("Error fetching documents: ", error);
        container.innerHTML = '<p style="color:red; text-align:center;">ডেটা লোড করতে সমস্যা হয়েছে।</p>';
    });
}

// *******************************************************************
// ৬. ইভেন্ট লিসেনার সেট আপ
// *******************************************************************

// ল্যান্ডিং স্ক্রিন থেকে 'Get Start' ক্লিক
document.getElementById('get-start-btn').addEventListener('click', () => {
    showScreen('registration-flow');
    showStep(1); // রেজিস্ট্রেশনের প্রথম স্টেপ দেখান
});

// Back এবং Next বাটন ক্লিক
backBtn.addEventListener('click', handleBack);
nextBtn.addEventListener('click', handleNext);

// Submit বাটন ক্লিক
submitBtn.addEventListener('click', completeRegistration);

// পেজ লোড হওয়ার সময় স্ট্যাটাস চেক করুন
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// *******************************************************************
// মনে রাখবেন: 'YOUR_API_KEY_HERE' পরিবর্তন করতে হবে!
// *******************************************************************
