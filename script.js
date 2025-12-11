// script.js ফাইল: স্ক্রিন নেভিগেশন লজিক (চূড়ান্ত)

// --- ১. সব স্ক্রিন এলিমেন্ট নির্বাচন করা ---
const landingScreen = document.getElementById('landing-screen');
const regStep1 = document.getElementById('reg-step-1'); // নাম
const regStep2 = document.getElementById('reg-step-2'); // ফোন নম্বর

// --- ২. সব বাটন এলিমেন্ট নির্বাচন করা ---
const getStartBtn = document.getElementById('get-start-btn');
const backBtn1 = document.getElementById('back-btn-1');
const nextBtn1 = document.getElementById('next-btn-1');
const backBtn2 = document.getElementById('back-btn-2');
const nextBtn2 = document.getElementById('next-btn-2');


// --- ৩. স্ক্রিন দেখানোর/লুকানোর ফাংশন ---
function showScreen(screenToShow, screenToHide) {
    if (screenToHide) {
        screenToHide.classList.add('hidden');
    }
    if (screenToShow) {
        screenToShow.classList.remove('hidden'); 
    }
    window.scrollTo(0, 0); 
}


// --- ৪. ইভেন্ট লিসেনার্স (নেভিগেশন লজিক) ---

// ল্যান্ডিং -> স্টেপ ১ (নাম)
if (getStartBtn) {
    getStartBtn.addEventListener('click', () => {
        showScreen(regStep1, landingScreen);
    });
}


// স্টেপ ১ (নাম) নেভিগেশন
if (backBtn1) {
    // Back: স্টেপ ১ -> ল্যান্ডিং
    backBtn1.addEventListener('click', () => {
        showScreen(landingScreen, regStep1);
    });
}

if (nextBtn1) {
    // Next: স্টেপ ১ -> স্টেপ ২ (ফোন নম্বর)
    nextBtn1.addEventListener('click', () => {
        showScreen(regStep2, regStep1);
    });
}


// স্টেপ ২ (ফোন নম্বর) নেভিগেশন
if (backBtn2) {
    // Back: স্টেপ ২ -> স্টেপ ১
    backBtn2.addEventListener('click', () => {
        showScreen(regStep1, regStep2);
    });
}

if (nextBtn2) {
    // Next: স্টেপ ২ -> স্টেপ ৩ (পরবর্তী ধাপ)
    nextBtn2.addEventListener('click', () => {
        alert("পরবর্তী ধাপ (স্টেপ ৩) এর ডিজাইন এখনো যুক্ত করা হয়নি।");
    });
}
