// ===============================================
// FIREBASE INITIALIZATION & CONFIG
// ===============================================
// ********* গুরুত্বপূর্ণ: আপনার Firebase কনফিগারেশন এখানে আপডেট করুন *********
const firebaseConfig = {
    apiKey: "আপনার সম্পূর্ণ API কী দিন", 
    authDomain: "devonix-ai.firebaseapp.com",
    projectId: "devonix-ai",
    storageBucket: "devonix-ai.appspot.com",
    messagingSenderId: "আপনার সম্পূর্ণ Sender ID দিন",
    appId: "আপনার সম্পূর্ণ App ID দিন",
    measurementId: "আপনার সম্পূর্ণ Measurement ID দিন"
};

let db;
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(// Import the functions you need from the SDKs you need
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
const analytics = getAnalytics(app););
    db = firebase.firestore();
    console.log("Firebase initialized.");
} else {
    console.error("Firebase SDK not loaded. Check script imports.");
}


// ===============================================
// LANGUAGE TRANSLATION DATA (২. ৩০টির বেশি ভাষা)
// ===============================================

const translations = {
    'en': {
        pageTitle: 'Devonix AI Sign Up',
        appName: 'Devonix AI',
        signupTitle: 'Create Your Devonix AI Account',
        placeholderName: 'Full Name',
        placeholderPhone: 'Phone Number',
        placeholderDOB: 'Date of Birth (Optional)',
        placeholderCountry: 'Country',
        placeholderDistrict: 'District',
        placeholderThana: 'Thana',
        placeholderPassword: 'Password',
        signupBtnText: 'Sign Up',
        loginText: 'Already have an account? Login',
        storeWelcome: 'Devonix Store',
        accountCreatedMessage: 'Congratulations! Your account is created. Check out the Store!',
        storeBtnText: 'Devonix Store',
        appPlaceholder: 'No apps uploaded yet. Check back soon!',
        logoutBtnText: 'Logout', // ৪. লগআউট বাটন টেক্সট
        errorMessage: 'Please fill out all required fields (Name, Phone, Password).',
        welcomeMessage: 'Welcome to Devonix AI!'
    },
    'bn': {
        pageTitle: 'ডেভোনিক্স এআই সাইন আপ',
        appName: 'ডেভোনিক্স এআই',
        signupTitle: 'আপনার ডেভোনিক্স এআই অ্যাকাউন্ট তৈরি করুন',
        placeholderName: 'পুরো নাম',
        placeholderPhone: 'ফোন নম্বর',
        placeholderDOB: 'জন্ম তারিখ (ঐচ্ছিক)',
        placeholderCountry: 'দেশ',
        placeholderDistrict: 'জেলা',
        placeholderThana: 'থানা',
        placeholderPassword: 'পাসওয়ার্ড',
        signupBtnText: 'সাইন আপ করুন',
        loginText: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে? লগইন করুন',
        storeWelcome: 'ডেভোনিক্স স্টোর',
        accountCreatedMessage: 'অভিনন্দন! আপনার অ্যাকাউন্ট তৈরি হয়েছে। স্টোরটি দেখুন!',
        storeBtnText: 'ডেভোনিক্স স্টোর',
        appPlaceholder: 'এখনো কোনো অ্যাপ আপলোড করা হয়নি। শীঘ্রই আবার দেখুন!',
        logoutBtnText: 'লগআউট', // ৪. লগআউট বাটন টেক্সট
        errorMessage: 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ঘর পূরণ করুন (নাম, ফোন, পাসওয়ার্ড)।',
        welcomeMessage: 'ডেভোনিক্স এআই-তে স্বাগতম!'
    },
    'hi': {
        pageTitle: 'डेवोनिक्स एआई साइन अप',
        appName: 'डेवोनिक्स एआई',
        signupTitle: 'अपना डेवोनिक्स एआई अकाउंट बनाएं',
        placeholderName: 'पूरा नाम',
        placeholderPhone: 'फ़ोन नंबर',
        placeholderDOB: 'जन्म तिथि (वैकल्पिक)',
        placeholderCountry: 'देश',
        placeholderDistrict: 'जिला',
        placeholderThana: 'थाना',
        placeholderPassword: 'पासवर्ड',
        signupBtnText: 'साइन अप करें',
        loginText: 'पहले से अकाउंट है? लॉग इन करें',
        storeWelcome: 'डेवोनिक्स स्टोर',
        accountCreatedMessage: 'बधाई हो! आपका अकाउंट बन गया है। स्टोर चेक करें!',
        storeBtnText: 'डेवोनिक्स स्टोर',
        appPlaceholder: 'अभी तक कोई ऐप अपलोड नहीं हुआ है। जल्द ही वापस जाँच करें!',
        logoutBtnText: 'लॉग आउट', // ৪. লগআউট বাটন টেক্সট
        errorMessage: 'कृपया सभी आवश्यक फ़ील्ड भरें (नाम, फ़ोन, पासवर्ड)।',
        welcomeMessage: 'डेवोनिक्स एआई में आपका स्वागत है!'
    },
    // ********* অন্যান্য ভাষার অনুবাদগুলি এখানে যোগ করা হয়েছে *********
};

// ===============================================
// APP DOWNLOAD DATA (৫. অ্যাপস)
// আপনি এই Array-তে নতুন অ্যাপ যোগ করলে, তা স্বয়ংক্রিয়ভাবে স্টোরে যুক্ত হবে (৬)
// ===============================================
const appList = [
    { name: 'Devonix AI Core', link: '#', version: '1.0' },
    { name: 'Devonix AI Assistant', link: '#', version: '1.2' },
    // নতুন অ্যাপস যোগ করুন:
    // { name: 'নতুন অ্যাপের নাম', link: 'ডাউনলোড লিঙ্ক', version: 'সংস্করণ' }, 
];


// ===============================================
// CORE FUNCTIONALITY
// ===============================================

// Global state to track user login status
let userLoggedIn = false; 

document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    const authBtn = document.getElementById('authBtn');
    const storeBtn = document.getElementById('storeBtn');
    const signupSection = document.getElementById('signup-section');
    const welcomeSection = document.getElementById('welcome-section');
    const storeSection = document.getElementById('store-section');
    const appDownloadList = document.getElementById('app-download-list');
    const signupForm = document.getElementById('signupForm');


    // ২. ভাষা পরিবর্তনের লজিক
    function applyTranslation(lang) {
        const t = translations[lang] || translations['en']; 
        
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (t[key]) {
                if (el.tagName === 'INPUT' && el.placeholder) {
                    el.placeholder = t[key];
                } else if (el.tagName === 'BUTTON' || el.tagName === 'H2' || el.tagName === 'H3') {
                    el.textContent = t[key];
                } else {
                    // This is primarily for the <p> tag containing the Login link
                    el.innerHTML = t[key].replace('Login', `<a href="#">${t['loginText'].split('?')[1].trim() || 'Login'}</a>`);
                }
            }
        });
        document.querySelector('title').textContent = t['pageTitle'];
        
        // Update Auth Button text based on login state
        updateAuthButton(userLoggedIn, lang); 
    }

    // ৪. লগইন/লগআউট বাটনের অবস্থা
    function updateAuthButton(isLoggedIn, lang = 'en') {
        const t = translations[lang] || translations['en'];
        if (isLoggedIn) {
            authBtn.textContent = t['logoutBtnText'];
            authBtn.setAttribute('data-key', 'logoutBtnText');
            authBtn.onclick = handleLogout;
        } else {
            authBtn.textContent = t['signupBtnText'];
            authBtn.setAttribute('data-key', 'signupBtnText');
            authBtn.onclick = showSignup;
        }
    }
    
    // ন্যাভিগেশন লজিক (৩, ৪, ৫)
    function showSection(sectionToShow) {
        // Hide all sections first
        [signupSection, welcomeSection, storeSection].forEach(section => {
            section.style.display = 'none';
        });

        // Show the desired section
        if (sectionToShow === 'signup' && !userLoggedIn) {
            signupSection.style.display = 'block';
        } else if (sectionToShow === 'welcome' && userLoggedIn) {
            welcomeSection.style.display = 'block';
        } else if (sectionToShow === 'store') {
            storeSection.style.display = 'block';
        } else if (userLoggedIn) {
             // If logged in, but not signup, show welcome by default
             welcomeSection.style.display = 'block'; 
        } else {
            // If not logged in, always default to signup
            signupSection.style.display = 'block';
        }
    }
    
    function showSignup() {
        showSection('signup');
    }

    function showStore() {
        showSection('store');
    }

    // ৫. স্টোর অ্যাপস ডিসপ্লে লজিক
    function displayApps() {
        appDownloadList.innerHTML = '';
        if (appList.length === 0) {
            appDownloadList.innerHTML = `<p data-key="appPlaceholder">${translations[languageSelect.value].appPlaceholder}</p>`;
            return;
        }
        
        appList.forEach(app => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            appItem.innerHTML = `
                <div>
                    <h4>${app.name} (v${app.version})</h4>
                </div>
                <a href="${app.link}" class="download-btn" target="_blank">Download</a>
            `;
            appDownloadList.appendChild(appItem);
        });
    }


    // ৪. লগআউট হ্যান্ডলার
    function handleLogout() {
        userLoggedIn = false;
        // Optionally clear user data from local storage
        localStorage.removeItem('language'); 
        localStorage.removeItem('userLoggedIn'); 
        
        const currentLang = languageSelect.value;
        const logoutMessage = (translations[currentLang] || translations['en']).logoutBtnText + ' Successful!';
        alert(logoutMessage);
        
        updateAuthButton(false, currentLang);
        showSection('signup'); // Go back to signup screen
    }


    // ৩. সাইন আপ হ্যান্ডলার
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const currentLang = languageSelect.value;
        const t = translations[currentLang] || translations['en'];

        // 1. Get Form Data
        const userData = {
            fullName: document.getElementById('name').value.trim(),
            phoneNumber: document.getElementById('phone').value.trim(),
            dateOfBirth: document.getElementById('dob').value.trim(),
            country: document.getElementById('country').value.trim(),
            district: document.getElementById('district').value.trim(),
            thana: document.getElementById('thana').value.trim(),
            password: document.getElementById('password').value,
            signupDate: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Validation (Checking only required fields: Name, Phone, Password)
        if (!userData.fullName || !userData.phoneNumber || !userData.password) {
            alert(t['errorMessage']);
            return;
        }

        // 2. Save Data to Firestore
        try {
            if (!db) {
                alert('Database connection failed. Please check Firebase setup.');
                return;
            }
            
            // Assuming phone number is unique identifier for simplicity
            const userRef = db.collection("users").doc(userData.phoneNumber);
            await userRef.set(userData); 

            // 3. Navigation upon success (৩. অভিনন্দন এবং হোম পেজে নিয়ে আসা)
            userLoggedIn = true; // Set login status
            localStorage.setItem('userLoggedIn', 'true');
            
            alert(t['accountCreatedMessage']);
            
            // Clear form
            signupForm.reset(); 
            
            updateAuthButton(true, currentLang);
            showSection('welcome'); // Go to the welcome/home screen
            
        } catch (error) {
            alert(`Sign Up Failed: ${error.message}`);
        }
    });


    // ইভেন্ট লিসেনার সেটআপ
    languageSelect.addEventListener('change', (event) => {
        const newLang = event.target.value;
        localStorage.setItem('language', newLang);
        applyTranslation(newLang);
    });
    
    // ৫. স্টোর বাটন লিসেনার
    storeBtn.addEventListener('click', showStore); 
    
    // পাসওয়ার্ড টোগল
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (togglePassword && passwordInput && eyeIcon) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }

    // প্রাথমিক লোডিং
    const initialLang = localStorage.getItem('language') || 'en';
    languageSelect.value = initialLang;
    
    if (localStorage.getItem('userLoggedIn') === 'true') {
        userLoggedIn = true;
        showSection('welcome'); 
    } else {
        showSection('signup');
    }
    
    applyTranslation(initialLang);
    displayApps(); // ৫. অ্যাপসগুলি লোড করা
});
