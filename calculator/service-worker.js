// ক্যাশের নাম ও ভার্সন
const CACHE_NAME = 'devonix-calc-v3';

// যেসব ফাইল অফলাইনে কাজ করার জন্য ক্যাশ করা হবে
const ASSETS = [
  './',
  './index.html',
  './logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.min.js',
  'https://cdn.plot.ly/plotly-latest.min.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Share+Tech+Mono&display=swap'
];

// ইনস্টল ইভেন্ট: ফাইলগুলো ক্যাশে সেভ করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Files cached successfully');
      return cache.addAll(ASSETS);
    })
  );
});

// অ্যাক্টিভেট ইভেন্ট: পুরনো ক্যাশ ডিলিট করে নতুন ক্যাশ আপডেট করা
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Old cache cleared');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// ফেচ ইভেন্ট: নেটওয়ার্ক থেকে ফাইল লোড করা, না থাকলে ক্যাশ থেকে দেখানো
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // যদি ক্যাশে ফাইল থাকে তবে সেটিই ফেরত দিবে, নাহলে নেটওয়ার্ক থেকে আনবে
      return response || fetch(event.request);
    })
  );
});
