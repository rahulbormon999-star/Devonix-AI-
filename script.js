// script.js ফাইল: স্ক্রিন নেভিগেশন লজিক

// --- ১. সব স্ক্রিন এলিমেন্ট নির্বাচন করা ---
const landingScreen = document.getElementById('landing-screen');
const regStep1 = document.getElementById('reg-step-1'); // নাম
const regStep2 = document.getElementById('reg-step-2'); // ফোন নম্বর (স্টেপ ২)

// --- ২. সব বাটন এলিমেন্ট নির্বাচন করা ---
// ল্যান্ডিং স্ক্রিন বাটন
const getStartBtn = document.getElementById('get-start-btn');

// স্টেপ ১ বাটন
const backBtn1 = document.getElementById('back-btn-1');
const nextBtn1 = document.getElementById('next-btn-1');

// স্টেপ ২ বাটন
const backBtn2 = document.getElementById('back-btn-2');
const nextBtn2 = document.getElementById('next-btn-2');


// --- ৩. স্ক্রিন দেখানোর/লুকানোর ফাংশন ---
function showScreen(screenToShow, screenToHide) {
    screenToHide.classList.add('hidden');
    screenToShow.classList.remove('hidden');
    window.scrollTo(0, 0); // নতুন স্ক্রিনে গেলে স্ক্রল টপে চলে যাবে
}


// --- ৪. ইভেন্ট লিসেনার্স (নেভিগেশন লজিক) ---

// ল্যান্ডিং -> স্টেপ ১ (নাম)
getStartBtn.addEventListener('click', () => {
    showScreen(regStep1, landingScreen);
});


// স্টেপ ১ (নাম) নেভিগেশন
// Back: স্টেপ ১ -> ল্যান্ডিং
backBtn1.addEventListener('click', () => {
    showScreen(landingScreen, regStep1);
});

// Next: স্টেপ ১ -> স্টেপ ২ (ফোন নম্বর)
nextBtn1.addEventListener('click', () => {
    // *ভ্যালিডেশন লজিক এখানে যুক্ত হবে, আপাতত শুধু স্ক্রিন চেঞ্জ*
    showScreen(regStep2, regStep1);
});


// স্টেপ ২ (ফোন নম্বর) নেভিগেশন
// Back: স্টেপ ২ -> স্টেপ ১
backBtn2.addEventListener('click', () => {
    showScreen(regStep1, regStep2);
});

// Next: স্টেপ ২ -> স্টেপ ৩ (পরবর্তী ধাপ)
nextBtn2.addEventListener('click', () => {
    // *ভবিষ্যতে স্টেপ ৩ এ যাবে*
    alert("পরবর্তী ধাপ (স্টেপ ৩) এর ডিজাইন এখনো যুক্ত করা হয়নি।");
});
