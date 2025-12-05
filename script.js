// script.js ফাইল 

// *******************************************************************
// ১. আপনার ব্যক্তিগত Firebase কনফিগারেশন কোড এখানে বসান
// *******************************************************************
const firebaseConfig = { 
    apiKey: "YOUR_API_KEY_HERE", // আপনার Key এখানে দিন
    authDomain: "devonix-ai-....firebaseapp.com",
    projectId: "devonix-ai-....",
    //... বাকি লাইনগুলো
};
firebase.initializeApp(firebaseConfig);

// ডেটা লোড করার ফাংশন
function loadApps() {
    const container = document.getElementById('app-list-container');
    if (!container) return; 

    const db = firebase.firestore();
    
    // 'apps' কালেকশন থেকে ডেটা সংগ্রহ
    db.collection("apps").get().then((querySnapshot) => {
        container.innerHTML = ''; // লোডিং মেসেজ মুছে ফেলা

        querySnapshot.forEach((doc) => {
            const app = doc.data(); 
            
            // ডেটা অনুযায়ী HTML কার্ড তৈরি
            // এখানে .app-card, h2, a ট্যাগ ব্যবহার করা হয়েছে যা style.css দিয়ে ডিজাইন করা
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

// অ্যাপস লোড করার ফাংশনটি চালু করুন
loadApps();
