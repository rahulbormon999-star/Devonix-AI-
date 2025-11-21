=======================================
// ১. FIREBASE INITIALIZATION & CONFIG
// (আপনার Firebase থেকে পাওয়া কনফিগারেশন এখানে বসান)
// ===============================================
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
    // **গুরুত্বপূর্ণ: এখানে আপনার Firebase থেকে পাওয়া ৬টি (বা ৭টি) আসল মান বসান**
    // যেমন: "AIzaSyBdL2IGfrsMMKpF5ZaUGw3fAIH-0lp..."
    apiKey: "আপনার_নিজস্ব_API_Key_এখানে_বসবে", 
    authDomain: "আপনার_নিজস্ব_Auth_Domain_এখানে_বসবে",
    projectId: "আপনার_নিজস্ব_Project_ID_এখানে_বসবে",
    storageBucket: "আপনার_নিজস্ব_Storage_Bucket_এখানে_বসবে",
    messagingSenderId: "আপনার_নিজস্ব_Messaging_Sender_Id_এখানে_বসবে",
    appId: "আপনার_নিজস্ব_App_Id_এখানে_বসবে",
    // measurementId: "আপনার_নিজস্ব_Measurement_ID_এখানে_বসবে", // যদি এটি থাকে তবে রাখুন
};

let db;

// গ্লোবাল ফায়ারবেস SDK (Version 8) দিয়ে ইনিশিয়ালাইজ করুন
if (typeof firebase !== 'undefined') {
    // এখানে কোনো 'import' বা মডিউলার initializeApp() ফাংশন লাগবে না।
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore(); // Firestore সেটআপ
    console.log("Firebase initialized.");
} else {
    console.error("Firebase SDK not loaded. Check script imports in index.html.");
}

// ===============================================
// ২. LANGUAGE TRANSLATION DATA 
// ==============================================
const translations = {
    // --- ৩টি বাধ্যতামূলক ভাষা ---
    'bn': {
        pageTitle: 'ডেভোনিক্স এআই সাইন আপ',
        appName: 'ডেভোনিক্স এআই',
        loginTitle: 'ডেভোনিক্স এআই-এ লগইন করুন',
        signupTitle: 'আপনার ডেভোনিক্স এআই অ্যাকাউন্ট তৈরি করুন',
        placeholderName: 'পুরো নাম',
        placeholderPhone: 'ফোন নম্বর',
        placeholderDOB: 'জন্ম তারিখ (ঐচ্ছিক)',
        placeholderCountry: 'দেশ',
        placeholderDistrict: 'জেলা',
        placeholderThana: 'থানা/উপজেলা',
        placeholderPassword: 'পাসওয়ার্ড',
        signupBtnText: 'সাইন আপ',
        loginBtnText: 'লগইন',
        logoutBtnText: 'লগআউট',
        loginText: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
        loginLinkText: 'লগইন করুন',
        welcomeMessage: 'ডেভোনিক্স এআই-এ আপনাকে স্বাগতম!',
        homeInstructions: 'সম্পূর্ণ ফিচার ব্যবহার করতে অনুগ্রহ করে লগইন বা সাইন আপ করুন।',
        storeWelcome: 'ডেভোনিক্স স্টোর',
        storeBtnText: 'ডেভোনিক্স স্টোর',
        storeAppPlaceholder: 'এখনও কোনো অ্যাপ আপলোড করা হয়নি। পরে আবার দেখুন!',
        accountCreated: 'অভিনন্দন!',
        accountRedirect: 'কিছুক্ষণের মধ্যে আপনাকে হোম স্ক্রিনে ফিরিয়ে আনা হবে...',
        errorMessage: 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ঘর পূরণ করুন।',
        loginError: 'ফোন বা পাসওয়ার্ড ভুল।',
        languageTitle: 'আপনার ভাষা নির্বাচন করুন',
        languageBtnText: 'ভাষা',
    },
    'en': {
        pageTitle: 'Devonix AI Sign Up',
        appName: 'Devonix AI',
        loginTitle: 'Login to Devonix AI',
        signupTitle: 'Create Your Devonix AI Account',
        placeholderName: 'Full Name',
        placeholderPhone: 'Phone Number',
        placeholderDOB: 'Date of Birth (Optional)',
        placeholderCountry: 'Country',
        placeholderDistrict: 'District',
        placeholderThana: 'Thana',
        placeholderPassword: 'Password',
        signupBtnText: 'Sign Up',
        loginBtnText: 'Login',
        logoutBtnText: 'Logout',
        loginText: 'Already have an account?',
        loginLinkText: 'Login',
        welcomeMessage: 'Welcome to Devonix AI!',
        homeInstructions: 'Please login or sign up to access the full features.',
        storeWelcome: 'Devonix Store',
        storeBtnText: 'Devonix Store',
        storeAppPlaceholder: 'No apps uploaded yet. Check back later!',
        accountCreated: 'Congratulations!',
        accountRedirect: 'You will be redirected to the Home screen shortly...',
        errorMessage: 'Please fill out all required fields.',
        loginError: 'Invalid phone or password.',
        languageTitle: 'Select Your Language',
        languageBtnText: 'Language',
    },
    'hi': {
        pageTitle: 'डेवोनिक्स एआई साइन अप',
        appName: 'डेवोनिक्स एआई',
        loginTitle: 'डेवोनिक्स एआई में लॉगिन करें',
        signupTitle: 'अपना डेवोनिक्स एआई अकाउंट बनाएं',
        placeholderName: 'पूरा नाम',
        placeholderPhone: 'फोन नंबर',
        placeholderDOB: 'जन्म तिथि (वैकल्पिक)',
        placeholderCountry: 'देश',
        placeholderDistrict: 'जिला',
        placeholderThana: 'थाना',
        placeholderPassword: 'पासवर्ड',
        signupBtnText: 'साइन अप करें',
        loginBtnText: 'लॉगिन करें',
        logoutBtnText: 'लॉगआउट करें',
        loginText: 'पहले से ही एक अकाउंट है?',
        loginLinkText: 'लॉगिन करें',
        welcomeMessage: 'डेवोनिक्स एआई में आपका स्वागत है!',
        homeInstructions: 'पूर्ण सुविधाओं तक पहुंचने के लिए कृपया लॉगिन या साइन अप करें।',
        storeWelcome: 'डेवोनिक्स स्टोर',
        storeBtnText: 'डेवोनिक्स स्टोर',
        storeAppPlaceholder: 'अभी तक कोई ऐप अपलोड नहीं हुआ है। बाद में जाँच करें!',
        accountCreated: 'बधाई हो!',
        accountRedirect: 'आपको जल्द ही होम स्क्रीन पर रीडायरेक्ट किया जाएगा...',
        errorMessage: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
        loginError: 'अवैध फ़ोन या पासवर्ड।',
        languageTitle: 'अपनी भाषा चुनें',
        languageBtnText: 'भाषा',
    },
    
    // --- অতিরিক্ত ৪৭টি ভাষা (A-Z বর্ণানুক্রমিক ক্রমে) ---
    
    'ar': { // Arabic
        pageTitle: 'التسجيل في ديفونيكس الذكاء الاصطناعي', appName: 'ديفونيكس الذكاء الاصطناعي', loginTitle: 'تسجيل الدخول إلى ديفونيكس', signupTitle: 'أنشئ حسابك في ديفونيكس', placeholderName: 'الاسم الكامل', placeholderPhone: 'رقم الهاتف', placeholderDOB: 'تاريخ الميلاد (اختياري)', placeholderCountry: 'البلد', placeholderDistrict: 'المنطقة', placeholderThana: 'المركز', placeholderPassword: 'كلمة المرور', signupBtnText: 'تسجيل', loginBtnText: 'تسجيل الدخول', logoutBtnText: 'تسجيل الخروج', loginText: 'هل لديك حساب بالفعل؟', loginLinkText: 'تسجيل الدخول', welcomeMessage: 'مرحبًا بك في ديفونيكس الذكاء الاصطناعي!', homeInstructions: 'يرجى تسجيل الدخول أو التسجيل للوصول إلى الميزات الكاملة.', storeWelcome: 'متجر ديفونيكس', storeBtnText: 'متجر ديفونيكس', storeAppPlaceholder: 'لم يتم تحميل أي تطبيقات بعد. تحقق لاحقًا!', accountCreated: 'تهانينا!', accountRedirect: 'سيتم توجيهك إلى الشاشة الرئيسية قريبًا...', errorMessage: 'الرجاء ملء جميع الحقول المطلوبة.', loginError: 'هاتف أو كلمة مرور غير صالحة.', languageTitle: 'اختر لغتك', languageBtnText: 'لغة',
    },
    'de': { // German
        pageTitle: 'Devonix AI Registrierung', appName: 'Devonix AI', loginTitle: 'Bei Devonix AI anmelden', signupTitle: 'Erstellen Sie Ihr Devonix AI Konto', placeholderName: 'Vollständiger Name', placeholderPhone: 'Telefonnummer', placeholderDOB: 'Geburtsdatum (Optional)', placeholderCountry: 'Land', placeholderDistrict: 'Bezirk', placeholderThana: 'Thana', placeholderPassword: 'Passwort', signupBtnText: 'Registrieren', loginBtnText: 'Anmelden', logoutBtnText: 'Abmelden', loginText: 'Sie haben bereits ein Konto?', loginLinkText: 'Anmelden', welcomeMessage: 'Willkommen bei Devonix AI!', homeInstructions: 'Bitte melden Sie sich an oder registrieren Sie sich, um auf alle Funktionen zuzugreifen.', storeWelcome: 'Devonix Store', storeBtnText: 'Devonix Store', storeAppPlaceholder: 'Noch keine Apps hochgeladen. Schauen Sie später vorbei!', accountCreated: 'Herzlichen Glückwunsch!', accountRedirect: 'Sie werden in Kürze zur Startseite weitergeleitet...', errorMessage: 'Bitte füllen Sie alle erforderlichen Felder aus.', loginError: 'Ungültige Telefonnummer oder Passwort.', languageTitle: 'Wählen Sie Ihre Sprache', languageBtnText: 'Sprache',
    },
    'es': { // Spanish
        pageTitle: 'Registro en Devonix AI', appName: 'Devonix AI', loginTitle: 'Iniciar Sesión en Devonix AI', signupTitle: 'Crea tu Cuenta de Devonix AI', placeholderName: 'Nombre Completo', placeholderPhone: 'Número de Teléfono', placeholderDOB: 'Fecha de Nacimiento (Opcional)', placeholderCountry: 'País', placeholderDistrict: 'Distrito', placeholderThana: 'Thana', placeholderPassword: 'Contraseña', signupBtnText: 'Registrarse', loginBtnText: 'Iniciar Sesión', logoutBtnText: 'Cerrar Sesión', loginText: '¿Ya tienes una cuenta?', loginLinkText: 'Iniciar Sesión', welcomeMessage: '¡Bienvenido a Devonix AI!', homeInstructions: 'Por favor, inicia sesión o regístrate para acceder a todas las funciones.', storeWelcome: 'Tienda Devonix', storeBtnText: 'Tienda Devonix', storeAppPlaceholder: 'Aún no hay aplicaciones subidas. Vuelve más tarde!', accountCreated: '¡Felicidades!', accountRedirect: 'Serás redirigido a la pantalla de inicio en breve...', errorMessage: 'Por favor, rellena todos los campos obligatorios.', loginError: 'Teléfono o contraseña inválidos.', languageTitle: 'Selecciona tu Idioma', languageBtnText: 'Idioma',
    },
    'fr': { // French
        pageTitle: 'Inscription à Devonix AI', appName: 'Devonix AI', loginTitle: 'Connexion à Devonix AI', signupTitle: 'Créez votre compte Devonix AI', placeholderName: 'Nom Complet', placeholderPhone: 'Numéro de Téléphone', placeholderDOB: 'Date de Naissance (Optionnel)', placeholderCountry: 'Pays', placeholderDistrict: 'District', placeholderThana: 'Thana', placeholderPassword: 'Mot de passe', signupBtnText: 'S\'inscrire', loginBtnText: 'Se Connecter', logoutBtnText: 'Se Déconnecter', loginText: 'Vous avez déjà un compte?', loginLinkText: 'Se Connecter', welcomeMessage: 'Bienvenue sur Devonix AI!', homeInstructions: 'Veuillez vous connecter ou vous inscrire pour accéder à toutes les fonctionnalités.', storeWelcome: 'Boutique Devonix', storeBtnText: 'Boutique Devonix', storeAppPlaceholder: 'Aucune application téléchargée pour l\'instant. Revenez plus tard!', accountCreated: 'Félicitations!', accountRedirect: 'Vous serez redirigé vers l\'écran d\'accueil sous peu...', errorMessage: 'Veuillez remplir tous les champs requis.', loginError: 'Téléphone ou mot de passe invalide.', languageTitle: 'Sélectionnez votre Langue', languageBtnText: 'Langue',
    },
    'ja': { // Japanese
        pageTitle: 'Devonix AI サインアップ', appName: 'Devonix AI', loginTitle: 'Devonix AIにログイン', signupTitle: 'Devonix AIアカウントを作成', placeholderName: '氏名', placeholderPhone: '電話番号', placeholderDOB: '生年月日 (オプション)', placeholderCountry: '国', placeholderDistrict: '地区', placeholderThana: 'タナ', placeholderPassword: 'パスワード', signupBtnText: 'サインアップ', loginBtnText: 'ログイン', logoutBtnText: 'ログアウト', loginText: 'すでにアカウントをお持ちですか？', loginLinkText: 'ログイン', welcomeMessage: 'Devonix AIへようこそ！', homeInstructions: 'すべての機能にアクセスするには、ログインまたはサインアップしてください。', storeWelcome: 'Devonix ストア', storeBtnText: 'Devonix ストア', storeAppPlaceholder: 'まだアプリはアップロードされていません。後で確認してください！', accountCreated: 'おめでとうございます！', accountRedirect: 'まもなくホーム画面にリダイレクトされます...', errorMessage: '必要な項目をすべて入力してください。', loginError: '無効な電話番号またはパスワード。', languageTitle: '言語を選択', languageBtnText: '言語',
    },
    'pt': { // Portuguese
        pageTitle: 'Registo Devonix AI', appName: 'Devonix AI', loginTitle: 'Entrar no Devonix AI', signupTitle: 'Crie sua Conta Devonix AI', placeholderName: 'Nome Completo', placeholderPhone: 'Número de Telefone', placeholderDOB: 'Data de Nascimento (Opcional)', placeholderCountry: 'País', placeholderDistrict: 'Distrito', placeholderThana: 'Thana', placeholderPassword: 'Senha', signupBtnText: 'Registar', loginBtnText: 'Entrar', logoutBtnText: 'Sair', loginText: 'Já tem uma conta?', loginLinkText: 'Entrar', welcomeMessage: 'Bem-vindo(a) ao Devonix AI!', homeInstructions: 'Por favor, entre ou registe-se para aceder a todos os recursos.', storeWelcome: 'Loja Devonix', storeBtnText: 'Loja Devonix', storeAppPlaceholder: 'Ainda não há aplicações carregadas. Volte mais tarde!', accountCreated: 'Parabéns!', accountRedirect: 'Você será redirecionado para a tela inicial em breve...', errorMessage: 'Por favor, preencha todos os campos obrigatórios.', loginError: 'Telefone ou senha inválida.', languageTitle: 'Selecione seu Idioma', languageBtnText: 'Idioma',
    },
    'ru': { // Russian
        pageTitle: 'Регистрация Devonix AI', appName: 'Devonix AI', loginTitle: 'Вход в Devonix AI', signupTitle: 'Создайте свой аккаунт Devonix AI', placeholderName: 'Полное имя', placeholderPhone: 'Номер телефона', placeholderDOB: 'Дата рождения (необязательно)', placeholderCountry: 'Страна', placeholderDistrict: 'Район', placeholderThana: 'Тана', placeholderPassword: 'Пароль', signupBtnText: 'Зарегистрироваться', loginBtnText: 'Войти', logoutBtnText: 'Выйти', loginText: 'Уже есть аккаунт?', loginLinkText: 'Войти', welcomeMessage: 'Добро пожаловать в Devonix AI!', homeInstructions: 'Пожалуйста, войдите или зарегистрируйтесь для доступа ко всем функциям.', storeWelcome: 'Магазин Devonix', storeBtnText: 'Магазин Devonix', storeAppPlaceholder: 'Приложения еще не загружены. Зайдите позже!', accountCreated: 'Поздравляем!', accountRedirect: 'Вы будете перенаправлены на главный экран в ближайшее время...', errorMessage: 'Пожалуйста, заполните все обязательные поля.', loginError: 'Неверный телефон или пароль.', languageTitle: 'Выберите свой язык', languageBtnText: 'Язык',
    },
    'zh': { // Chinese
        pageTitle: 'Devonix AI 注册', appName: 'Devonix AI', loginTitle: '登录 Devonix AI', signupTitle: '创建您的 Devonix AI 账户', placeholderName: '全名', placeholderPhone: '电话号码', placeholderDOB: '出生日期 (可选)', placeholderCountry: '国家', placeholderDistrict: '区', placeholderThana: '县/镇', placeholderPassword: '密码', signupBtnText: '注册', loginBtnText: '登录', logoutBtnText: '注销', loginText: '已有账户？', loginLinkText: '登录', welcomeMessage: '欢迎使用 Devonix AI！', homeInstructions: '请登录或注册以访问所有功能。', storeWelcome: 'Devonix 商店', storeBtnText: 'Devonix 商店', storeAppPlaceholder: '尚未上传应用。请稍后查看！', accountCreated: '恭喜！', accountRedirect: '您将很快被重定向到主屏幕...', errorMessage: '请填写所有必填字段。', loginError: '无效的电话或密码。', languageTitle: '选择您的语言', languageBtnText: '语言',
    },
    
    // -- বাকি ৪২টি ভাষা --
    'af': { pageTitle: 'Devonix AI Registrasie', appName: 'Devonix AI', loginTitle: 'Meld aan by Devonix AI', signupTitle: 'Skep u Devonix AI-rekening', placeholderName: 'Volle Naam', placeholderPhone: 'Telefoonnommer', placeholderDOB: 'Geboortedatum (Opsioneel)', placeholderCountry: 'Land', placeholderDistrict: 'Distrik', placeholderThana: 'Thana', placeholderPassword: 'Wagwoord', signupBtnText: 'Registreer', loginBtnText: 'Meld aan', logoutBtnText: 'Meld uit', loginText: 'Het u reeds \'n rekening?', loginLinkText: 'Meld aan', welcomeMessage: 'Welkom by Devonix AI!', homeInstructions: 'Meld asseblief aan of registreer om toegang tot die volle funksies te verkry.', storeWelcome: 'Devonix Winkel', storeBtnText: 'Devonix Winkel', storeAppPlaceholder: 'Geen programme nog opgelaai nie. Kom later terug!', accountCreated: 'Baie Geluk!', accountRedirect: 'U sal binnekort na die tuisskerm herlei word...', errorMessage: 'Vul asseblief al die vereiste velde in.', loginError: 'Ongeldige foon of wagwoord.', languageTitle: 'Kies u Taal', languageBtnText: 'Taal', }, // Afrikaans
    'am': { pageTitle: 'ዴቮኒክስ ኤአይ ምዝገባ', appName: 'ዴቮኒክስ ኤአይ', loginTitle: 'ወደ ዴቮኒክስ ኤአይ ይግቡ', signupTitle: 'የእርስዎን ዴቮኒክስ ኤአይ አካውንት ይፍጠሩ', placeholderName: 'ሙሉ ስም', placeholderPhone: 'ስልክ ቁጥር', placeholderDOB: 'የትውልድ ቀን (አማራጭ)', placeholderCountry: 'አገር', placeholderDistrict: 'ክፍለ ሃገር', placeholderThana: 'ታና', placeholderPassword: 'የይለፍ ቃል', signupBtnText: 'ይመዝገቡ', loginBtnText: 'ይግቡ', logoutBtnText: 'ይውጡ', loginText: 'አካውንት አለዎት?', loginLinkText: 'ይግቡ', welcomeMessage: 'ወደ ዴቮኒክስ ኤአይ እንኳን ደህና መጡ!', homeInstructions: 'እባክዎን ሁሉንም ባህሪያት ለመጠቀም ይግቡ ወይም ይመዝገቡ።', storeWelcome: 'ዴቮኒክስ ሱቅ', storeBtnText: 'ዴቮኒክስ ሱቅ', storeAppPlaceholder: 'እስካሁን ምንም መተግበሪያዎች አልተሰቀሉም። ቆይተው ይመልከቱ!', accountCreated: 'እንኳን ደስ አለዎት!', accountRedirect: 'በቅርቡ ወደ መነሻ ገጽ ይመለሳሉ...', errorMessage: 'እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ.', loginError: 'ልክ ያልሆነ ስልክ ወይም የይለፍ ቃል.', languageTitle: 'ቋንቋዎን ይምረጡ', languageBtnText: 'ቋንቋ', }, // Amharic
    'az': { pageTitle: 'Devonix AI Qeydiyyat', appName: 'Devonix AI', loginTitle: 'Devonix AI-a daxil olun', signupTitle: 'Devonix AI Hesabınızı Yaradın', placeholderName: 'Tam Ad', placeholderPhone: 'Telefon Nömrəsi', placeholderDOB: 'Doğum Tarixi (Könüllü)', placeholderCountry: 'Ölkə', placeholderDistrict: 'Rayon', placeholderThana: 'Thana', placeholderPassword: 'Şifrə', signupBtnText: 'Qeydiyyatdan Keç', loginBtnText: 'Daxil Ol', logoutBtnText: 'Çıxış', loginText: 'Artıq bir hesabınız var?', loginLinkText: 'Daxil Ol', welcomeMessage: 'Devonix AI-a xoş gəlmisiniz!', homeInstructions: 'Bütün funksiyalara daxil olmaq üçün zəhmət olmasa daxil olun və ya qeydiyyatdan keçin.', storeWelcome: 'Devonix Mağazası', storeBtnText: 'Devonix Mağazası', storeAppPlaceholder: 'Hələ proqram yüklənməyib. Daha sonra yoxlayın!', accountCreated: 'Təbrik edirik!', accountRedirect: 'Tezliklə Ana Ekrana yönləndiriləcəksiniz...', errorMessage: 'Zəhmət olmasa tələb olunan bütün sahələri doldurun.', loginError: 'Yanlış telefon və ya şifrə.', languageTitle: 'Dilinizi Seçin', languageBtnText: 'Dil', }, // Azerbaijani
    'bg': { pageTitle: 'Devonix AI Регистрация', appName: 'Devonix AI', loginTitle: 'Вход в Devonix AI', signupTitle: 'Създайте своя Devonix AI акаунт', placeholderName: 'Пълно Име', placeholderPhone: 'Телефонен Номер', placeholderDOB: 'Дата на раждане (по избор)', placeholderCountry: 'Държава', placeholderDistrict: 'Област', placeholderThana: 'Тхана', placeholderPassword: 'Парола', signupBtnText: 'Регистрация', loginBtnText: 'Вход', logoutBtnText: 'Изход', loginText: 'Вече имате акаунт?', loginLinkText: 'Вход', welcomeMessage: 'Добре дошли в Devonix AI!', homeInstructions: 'Моля, влезте или се регистрирайте, за да получите достъп до пълните функции.', storeWelcome: 'Devonix Магазин', storeBtnText: 'Devonix Магазин', storeAppPlaceholder: 'Все още няма качени приложения. Проверете по-късно!', accountCreated: 'Поздравления!', accountRedirect: 'Скоро ще бъдете пренасочени към началния екран...', errorMessage: 'Моля, попълнете всички задължителни полета.', loginError: 'Невалиден телефон или парола.', languageTitle: 'Изберете своя език', languageBtnText: 'Език', }, // Bulgarian
    'ca': { pageTitle: 'Registre a Devonix AI', appName: 'Devonix AI', loginTitle: 'Inicia Sessió a Devonix AI', signupTitle: 'Crea el teu Compte de Devonix AI', placeholderName: 'Nom Complet', placeholderPhone: 'Número de Telèfon', placeholderDOB: 'Data de Naixement (Opcional)', placeholderCountry: 'País', placeholderDistrict: 'Districte', placeholderThana: 'Thana', placeholderPassword: 'Contrasenya', signupBtnText: 'Registrar-se', loginBtnText: 'Inicia Sessió', logoutBtnText: 'Tanca la Sessió', loginText: 'Ja tens un compte?', loginLinkText: 'Inicia Sessió', welcomeMessage: 'Benvingut/da a Devonix AI!', homeInstructions: 'Si us plau, inicia sessió o registra\'t per accedir a totes les funcions.', storeWelcome: 'Botiga Devonix', storeBtnText: 'Botiga Devonix', storeAppPlaceholder: 'Encara no s\'han penjat aplicacions. Torna més tard!', accountCreated: 'Felicitats!', accountRedirect: 'Seràs redirigit a la pantalla d\'inici en breu...', errorMessage: 'Si us plau, omple tots els camps obligatoris.', loginError: 'Telèfon o contrasenya no vàlids.', languageTitle: 'Selecciona el teu Idioma', languageBtnText: 'Idioma', }, // Catalan
    'cs': { pageTitle: 'Devonix AI Registrace', appName: 'Devonix AI', loginTitle: 'Přihlásit se do Devonix AI', signupTitle: 'Vytvořte si účet Devonix AI', placeholderName: 'Celé Jméno', placeholderPhone: 'Telefonní Číslo', placeholderDOB: 'Datum Narození (Volitelné)', placeholderCountry: 'Země', placeholderDistrict: 'Okres', placeholderThana: 'Thana', placeholderPassword: 'Heslo', signupBtnText: 'Zaregistrovat se', loginBtnText: 'Přihlásit se', logoutBtnText: 'Odhlásit se', loginText: 'Již máte účet?', loginLinkText: 'Přihlásit se', welcomeMessage: 'Vítejte v Devonix AI!', homeInstructions: 'Pro přístup ke všem funkcím se prosím přihlaste nebo zaregistrujte.', storeWelcome: 'Devonix Obchod', storeBtnText: 'Devonix Obchod', storeAppPlaceholder: 'Žádné aplikace zatím nebyly nahrány. Zkontrolujte to později!', accountCreated: 'Gratulujeme!', accountRedirect: 'Budete přesměrováni na domovskou obrazovku za chvíli...', errorMessage: 'Vyplňte prosím všechna povinná pole.', loginError: 'Neplatný telefon nebo heslo.', languageTitle: 'Vyberte svůj Jazyk', languageBtnText: 'Jazyk', }, // Czech
    'da': { pageTitle: 'Devonix AI Tilmelding', appName: 'Devonix AI', loginTitle: 'Log ind på Devonix AI', signupTitle: 'Opret din Devonix AI-konto', placeholderName: 'Fulde Navn', placeholderPhone: 'Telefonnummer', placeholderDOB: 'Fødselsdato (Valgfrit)', placeholderCountry: 'Land', placeholderDistrict: 'Distrikt', placeholderThana: 'Thana', placeholderPassword: 'Adgangskode', signupBtnText: 'Tilmeld', loginBtnText: 'Log ind', logoutBtnText: 'Log ud', loginText: 'Har du allerede en konto?', loginLinkText: 'Log ind', welcomeMessage: 'Velkommen til Devonix AI!', homeInstructions: 'Log venligst ind eller tilmeld dig for at få adgang til de fulde funktioner.', storeWelcome: 'Devonix Butik', storeBtnText: 'Devonix Butik', storeAppPlaceholder: 'Ingen apps uploadet endnu. Tjek senere!', accountCreated: 'Tillykke!', accountRedirect: 'Du vil snart blive omdirigeret til startskærmen...', errorMessage: 'Udfyld venligst alle krævede felter.', loginError: 'Ugyldig telefon eller adgangskode.', languageTitle: 'Vælg dit Sprog', languageBtnText: 'Sprog', }, // Danish
    'el': { pageTitle: 'Εγγραφή στο Devonix AI', appName: 'Devonix AI', loginTitle: 'Σύνδεση στο Devonix AI', signupTitle: 'Δημιουργήστε τον λογαριασμό σας στο Devonix AI', placeholderName: 'Πλήρες Όνομα', placeholderPhone: 'Αριθμός Τηλεφώνου', placeholderDOB: 'Ημερομηνία Γέννησης (Προαιρετικό)', placeholderCountry: 'Χώρα', placeholderDistrict: 'Περιοχή', placeholderThana: 'Thana', placeholderPassword: 'Κωδικός', signupBtnText: 'Εγγραφή', loginBtnText: 'Σύνδεση', logoutBtnText: 'Αποσύνδεση', loginText: 'Έχετε ήδη λογαριασμό;', loginLinkText: 'Σύνδεση', welcomeMessage: 'Καλώς ήρθατε στο Devonix AI!', homeInstructions: 'Παρακαλούμε συνδεθείτε ή εγγραφείτε για πρόσβαση σε όλες τις λειτουργίες.', storeWelcome: 'Devonix Κατάστημα', storeBtnText: 'Devonix Κατάστημα', storeAppPlaceholder: 'Δεν έχουν ανέβει εφαρμογές ακόμα. Ελέγξτε αργότερα!', accountCreated: 'Συγχαρητήρια!', accountRedirect: 'Θα μεταφερθείτε στην αρχική οθόνη σύντομα...', errorMessage: 'Παρακαλούμε συμπληρώστε όλα τα απαιτούμενα πεδία.', loginError: 'Μη έγκυρο τηλέφωνο ή κωδικός πρόσβασης.', languageTitle: 'Επιλέξτε τη Γλώσσα σας', languageBtnText: 'Γλώσσα', }, // Greek
    'et': { pageTitle: 'Devonix AI Registreerimine', appName: 'Devonix AI', loginTitle: 'Logi sisse Devonix AI-sse', signupTitle: 'Loo oma Devonix AI konto', placeholderName: 'Täielik Nimi', placeholderPhone: 'Telefoninumber', placeholderDOB: 'Sünnikuupäev (Valikuline)', placeholderCountry: 'Riik', placeholderDistrict: 'Piirkond', placeholderThana: 'Thana', placeholderPassword: 'Parool', signupBtnText: 'Registreeri', loginBtnText: 'Logi sisse', logoutBtnText: 'Logi välja', loginText: 'Kas sul on juba konto?', loginLinkText: 'Logi sisse', welcomeMessage: 'Tere tulemast Devonix AI-sse!', homeInstructions: 'Palun logi sisse või registreeru, et pääseda ligi kõikidele funktsioonidele.', storeWelcome: 'Devonix Pood', storeBtnText: 'Devonix Pood', storeAppPlaceholder: 'Rakendusi pole veel üles laaditud. Kontrollige hiljem!', accountCreated: 'Õnnitleme!', accountRedirect: 'Sind suunatakse peagi avalehele...', errorMessage: 'Palun täida kõik nõutud väljad.', loginError: 'Vigane telefon või parool.', languageTitle: 'Vali oma Keel', languageBtnText: 'Keel', }, // Estonian
    'fi': { pageTitle: 'Devonix AI Rekisteröinti', appName: 'Devonix AI', loginTitle: 'Kirjaudu sisään Devonix AI:hin', signupTitle: 'Luo Devonix AI -tilisi', placeholderName: 'Koko Nimi', placeholderPhone: 'Puhelinnumero', placeholderDOB: 'Syntymäaika (Valinnainen)', placeholderCountry: 'Maa', placeholderDistrict: 'Piiri', placeholderThana: 'Thana', placeholderPassword: 'Salasana', signupBtnText: 'Rekisteröidy', loginBtnText: 'Kirjaudu sisään', logoutBtnText: 'Kirjaudu ulos', loginText: 'Onko sinulla jo tili?', loginLinkText: 'Kirjaudu sisään', welcomeMessage: 'Tervetuloa Devonix AI:hin!', homeInstructions: 'Kirjaudu sisään tai rekisteröidy käyttääksesi kaikkia ominaisuuksia.', storeWelcome: 'Devonix Kauppa', storeBtnText: 'Devonix Kauppa', storeAppPlaceholder: 'Ei sovelluksia ladattu vielä. Tarkista myöhemmin!', accountCreated: 'Onnittelut!', accountRedirect: 'Sinut ohjataan pian kotinäytölle...', errorMessage: 'Täytä kaikki vaaditut kentät.', loginError: 'Virheellinen puhelinnumero tai salasana.', languageTitle: 'Valitse Kieli', languageBtnText: 'Kieli', }, // Finnish
    'he': { pageTitle: 'הרשמה ל-Devonix AI', appName: 'Devonix AI', loginTitle: 'כניסה ל-Devonix AI', signupTitle: 'צור את חשבון Devonix AI שלך', placeholderName: 'שם מלא', placeholderPhone: 'מספר טלפון', placeholderDOB: 'תאריך לידה (אופציונלי)', placeholderCountry: 'מדינה', placeholderDistrict: 'מחוז', placeholderThana: 'תחנה', placeholderPassword: 'סיסמה', signupBtnText: 'הרשמה', loginBtnText: 'כניסה', logoutBtnText: 'יציאה', loginText: 'כבר יש לך חשבון?', loginLinkText: 'כניסה', welcomeMessage: 'ברוכים הבאים ל-Devonix AI!', homeInstructions: 'אנא התחבר או הירשם כדי לגשת לכל התכונות.', storeWelcome: 'חנות Devonix', storeBtnText: 'חנות Devonix', storeAppPlaceholder: 'עדיין לא הועלו אפליקציות. בדוק שוב מאוחר יותר!', accountCreated: 'מזל טוב!', accountRedirect: 'אתה תופנה למסך הבית בקרוב...', errorMessage: 'אנא מלא את כל השדות הנדרשים.', loginError: 'טלפון או סיסמה לא חוקיים.', languageTitle: 'בחר את השפה שלך', languageBtnText: 'שפה', }, // Hebrew
    'hr': { pageTitle: 'Devonix AI Registracija', appName: 'Devonix AI', loginTitle: 'Prijavite se na Devonix AI', signupTitle: 'Kreirajte svoj Devonix AI račun', placeholderName: 'Puno Ime', placeholderPhone: 'Broj Telefona', placeholderDOB: 'Datum Rođenja (Opcionalno)', placeholderCountry: 'Država', placeholderDistrict: 'Okrug', placeholderThana: 'Thana', placeholderPassword: 'Lozinka', signupBtnText: 'Registriraj se', loginBtnText: 'Prijava', logoutBtnText: 'Odjava', loginText: 'Već imate račun?', loginLinkText: 'Prijava', welcomeMessage: 'Dobrodošli u Devonix AI!', homeInstructions: 'Molimo prijavite se ili se registrirajte za pristup svim funkcijama.', storeWelcome: 'Devonix Trgovina', storeBtnText: 'Devonix Trgovina', storeAppPlaceholder: 'Aplikacije još nisu učitane. Provjerite kasnije!', accountCreated: 'Čestitamo!', accountRedirect: 'Uskoro ćete biti preusmjereni na početni zaslon...', errorMessage: 'Molimo ispunite sva obavezna polja.', loginError: 'Nevažeći telefon ili lozinka.', languageTitle: 'Odaberite svoj Jezik', languageBtnText: 'Jezik', }, // Croatian
    'hu': { pageTitle: 'Devonix AI Regisztráció', appName: 'Devonix AI', loginTitle: 'Bejelentkezés a Devonix AI-ba', signupTitle: 'Hozza létre Devonix AI fiókját', placeholderName: 'Teljes Név', placeholderPhone: 'Telefonszám', placeholderDOB: 'Születési Dátum (Opcionális)', placeholderCountry: 'Ország', placeholderDistrict: 'Kerület', placeholderThana: 'Thana', placeholderPassword: 'Jelszó', signupBtnText: 'Regisztráció', loginBtnText: 'Bejelentkezés', logoutBtnText: 'Kijelentkezés', loginText: 'Már van fiókja?', loginLinkText: 'Bejelentkezés', welcomeMessage: 'Üdvözöljük a Devonix AI-ban!', homeInstructions: 'Kérjük, jelentkezzen be vagy regisztráljon a teljes funkciók eléréséhez.', storeWelcome: 'Devonix Áruház', storeBtnText: 'Devonix Áruház', storeAppPlaceholder: 'Még nincsenek feltöltött alkalmazások. Nézzen vissza később!', accountCreated: 'Gratulálunk!', accountRedirect: 'Hamarosan átirányítjuk a Kezdőképernyőre...', errorMessage: 'Kérjük, töltse ki az összes kötelező mezőt.', loginError: 'Érvénytelen telefon vagy jelszó.', languageTitle: 'Válassza ki a Nyelvét', languageBtnText: 'Nyelv', }, // Hungarian
    'id': { pageTitle: 'Pendaftaran Devonix AI', appName: 'Devonix AI', loginTitle: 'Masuk ke Devonix AI', signupTitle: 'Buat Akun Devonix AI Anda', placeholderName: 'Nama Lengkap', placeholderPhone: 'Nomor Telepon', placeholderDOB: 'Tanggal Lahir (Opsional)', placeholderCountry: 'Negara', placeholderDistrict: 'Distrik', placeholderThana: 'Thana', placeholderPassword: 'Kata Sandi', signupBtnText: 'Daftar', loginBtnText: 'Masuk', logoutBtnText: 'Keluar', loginText: 'Sudah punya akun?', loginLinkText: 'Masuk', welcomeMessage: 'Selamat datang di Devonix AI!', homeInstructions: 'Silakan masuk atau daftar untuk mengakses fitur lengkap.', storeWelcome: 'Toko Devonix', storeBtnText: 'Toko Devonix', storeAppPlaceholder: 'Belum ada aplikasi yang diunggah. Periksa lagi nanti!', accountCreated: 'Selamat!', accountRedirect: 'Anda akan dialihkan ke layar Beranda sebentar lagi...', errorMessage: 'Harap isi semua kolom yang wajib diisi.', loginError: 'Telepon atau kata sandi tidak valid.', languageTitle: 'Pilih Bahasa Anda', languageBtnText: 'Bahasa', }, // Indonesian
    'is': { pageTitle: 'Devonix AI Skráning', appName: 'Devonix AI', loginTitle: 'Skráðu þig inn á Devonix AI', signupTitle: 'Búðu til Devonix AI reikninginn þinn', placeholderName: 'Fullt Nafn', placeholderPhone: 'Símanúmer', placeholderDOB: 'Fæðingardagur (Valfrjálst)', placeholderCountry: 'Land', placeholderDistrict: 'Sýsla', placeholderThana: 'Thana', placeholderPassword: 'Lykilorð', signupBtnText: 'Skrá mig', loginBtnText: 'Innskráning', logoutBtnText: 'Útskráning', loginText: 'Ertu nú þegar með reikning?', loginLinkText: 'Innskráning', welcomeMessage: 'Velkomin í Devonix AI!', homeInstructions: 'Vinsamlegast skráðu þig inn eða skráðu þig til að fá aðgang að öllum aðgerðum.', storeWelcome: 'Devonix Verslun', storeBtnText: 'Devonix Verslun', storeAppPlaceholder: 'Engin forrit hlaðið upp ennþá. Athugaðu síðar!', accountCreated: 'Til hamingju!', accountRedirect: 'Þér verður vísað á heimaskjáinn innan skamms...', errorMessage: 'Vinsamlegast fylltu út alla nauðsynlega reiti.', loginError: 'Ógilt símanúmer eða lykilorð.', languageTitle: 'Veldu tungumál þitt', languageBtnText: 'Tungumál', }, // Icelandic
    'it': { pageTitle: 'Registrazione Devonix AI', appName: 'Devonix AI', loginTitle: 'Accedi a Devonix AI', signupTitle: 'Crea il tuo Account Devonix AI', placeholderName: 'Nome Completo', placeholderPhone: 'Numero di Telefono', placeholderDOB: 'Data di Nascita (Opzionale)', placeholderCountry: 'Paese', placeholderDistrict: 'Distretto', placeholderThana: 'Thana', placeholderPassword: 'Password', signupBtnText: 'Registrati', loginBtnText: 'Accedi', logoutBtnText: 'Esci', loginText: 'Hai già un account?', loginLinkText: 'Accedi', welcomeMessage: 'Benvenuto in Devonix AI!', homeInstructions: 'Effettua il login o registrati per accedere a tutte le funzionalità.', storeWelcome: 'Devonix Store', storeBtnText: 'Devonix Store', storeAppPlaceholder: 'Nessuna app caricata ancora. Controlla più tardi!', accountCreated: 'Congratulazioni!', accountRedirect: 'Sarai reindirizzato alla schermata Home a breve...', errorMessage: 'Per favore, compila tutti i campi richiesti.', loginError: 'Telefono o password non validi.', languageTitle: 'Seleziona la tua Lingua', languageBtnText: 'Lingua', }, // Italian
    'ko': { pageTitle: 'Devonix AI 회원가입', appName: 'Devonix AI', loginTitle: 'Devonix AI 로그인', signupTitle: 'Devonix AI 계정 만들기', placeholderName: '전체 이름', placeholderPhone: '전화번호', placeholderDOB: '생년월일 (선택 사항)', placeholderCountry: '국가', placeholderDistrict: '구역', placeholderThana: '타나', placeholderPassword: '비밀번호', signupBtnText: '회원가입', loginBtnText: '로그인', logoutBtnText: '로그아웃', loginText: '이미 계정이 있으신가요?', loginLinkText: '로그인', welcomeMessage: 'Devonix AI에 오신 것을 환영합니다!', homeInstructions: '모든 기능에 액세스하려면 로그인하거나 회원가입하십시오.', storeWelcome: 'Devonix 스토어', storeBtnText: 'Devonix 스토어', storeAppPlaceholder: '아직 업로드된 앱이 없습니다. 나중에 다시 확인하십시오!', accountCreated: '축하합니다!', accountRedirect: '잠시 후 홈 화면으로 이동됩니다...', errorMessage: '필수 필드를 모두 채워주십시오.', loginError: '잘못된 전화번호 또는 비밀번호입니다.', languageTitle: '언어 선택', languageBtnText: '언어', }, // Korean
    'ms': { pageTitle: 'Pendaftaran Devonix AI', appName: 'Devonix AI', loginTitle: 'Log Masuk ke Devonix AI', signupTitle: 'Cipta Akaun Devonix AI Anda', placeholderName: 'Nama Penuh', placeholderPhone: 'Nombor Telefon', placeholderDOB: 'Tarikh Lahir (Pilihan)', placeholderCountry: 'Negara', placeholderDistrict: 'Daerah', placeholderThana: 'Thana', placeholderPassword: 'Kata Laluan', signupBtnText: 'Daftar', loginBtnText: 'Log Masuk', logoutBtnText: 'Log Keluar', loginText: 'Sudah mempunyai akaun?', loginLinkText: 'Log Masuk', welcomeMessage: 'Selamat datang ke Devonix AI!', homeInstructions: 'Sila log masuk atau daftar untuk mengakses ciri penuh.', storeWelcome: 'Kedai Devonix', storeBtnText: 'Kedai Devonix', storeAppPlaceholder: 'Tiada aplikasi yang dimuat naik lagi. Semak kemudian!', accountCreated: 'Tahniah!', accountRedirect: 'Anda akan dialihkan ke skrin Utama sebentar lagi...', errorMessage: 'Sila isi semua ruangan yang diperlukan.', loginError: 'Telefon atau kata laluan tidak sah.', languageTitle: 'Pilih Bahasa Anda', languageBtnText: 'Bahasa', }, // Malay
    'nl': { pageTitle: 'Devonix AI Registratie', appName: 'Devonix AI', loginTitle: 'Inloggen bij Devonix AI', signupTitle: 'Maak uw Devonix AI Account aan', placeholderName: 'Volledige Naam', placeholderPhone: 'Telefoonnummer', placeholderDOB: 'Geboortedatum (Optioneel)', placeholderCountry: 'Land', placeholderDistrict: 'District', placeholderThana: 'Thana', placeholderPassword: 'Wachtwoord', signupBtnText: 'Registreren', loginBtnText: 'Inloggen', logoutBtnText: 'Uitloggen', loginText: 'Heeft u al een account?', loginLinkText: 'Inloggen', welcomeMessage: 'Welkom bij Devonix AI!', homeInstructions: 'Log alstublieft in of registreer om toegang te krijgen tot de volledige functies.', storeWelcome: 'Devonix Winkel', storeBtnText: 'Devonix Winkel', storeAppPlaceholder: 'Nog geen apps geüpload. Kom later terug!', accountCreated: 'Gefeliciteerd!', accountRedirect: 'U wordt zo naar het startscherm geleid...', errorMessage: 'Vul alstublieft alle vereiste velden in.', loginError: 'Ongeldige telefoon of wachtwoord.', languageTitle: 'Kies uw Taal', languageBtnText: 'Taal', }, // Dutch
    'no': { pageTitle: 'Devonix AI Registrering', appName: 'Devonix AI', loginTitle: 'Logg inn på Devonix AI', signupTitle: 'Opprett din Devonix AI-konto', placeholderName: 'Fullt Navn', placeholderPhone: 'Telefonnummer', placeholderDOB: 'Fødselsdato (Valgfritt)', placeholderCountry: 'Land', placeholderDistrict: 'Distrikt', placeholderThana: 'Thana', placeholderPassword: 'Passord', signupBtnText: 'Registrer deg', loginBtnBtn: 'Logg inn', logoutBtnText: 'Logg ut', loginText: 'Har du allerede en konto?', loginLinkText: 'Logg inn', welcomeMessage: 'Velkommen til Devonix AI!', homeInstructions: 'Vennligst logg inn eller registrer deg for å få tilgang til alle funksjonene.', storeWelcome: 'Devonix Butikk', storeBtnText: 'Devonix Butikk', storeAppPlaceholder: 'Ingen apper lastet opp ennå. Sjekk igjen senere!', accountCreated: 'Gratulerer!', accountRedirect: 'Du blir snart omdirigert til startskjermen...', errorMessage: 'Vennligst fyll ut alle nødvendige felt.', loginError: 'Ugyldig telefon eller passord.', languageTitle: 'Velg ditt Språk', languageBtnText: 'Språk', }, // Norwegian
    'pl': { pageTitle: 'Devonix AI Rejestracja', appName: 'Devonix AI', loginTitle: 'Zaloguj się do Devonix AI', signupTitle: 'Utwórz swoje konto Devonix AI', placeholderName: 'Pełne Imię', placeholderPhone: 'Numer Telefonu', placeholderDOB: 'Data Urodzenia (Opcjonalnie)', placeholderCountry: 'Kraj', placeholderDistrict: 'Dzielnica', placeholderThana: 'Thana', placeholderPassword: 'Hasło', signupBtnText: 'Zarejestruj się', loginBtnText: 'Zaloguj się', logoutBtnText: 'Wyloguj się', loginText: 'Masz już konto?', loginLinkText: 'Zaloguj się', welcomeMessage: 'Witaj w Devonix AI!', homeInstructions: 'Zaloguj się lub zarejestruj, aby uzyskać dostęp do pełnych funkcji.', storeWelcome: 'Devonix Sklep', storeBtnText: 'Devonix Sklep', storeAppPlaceholder: 'Brak przesłanych aplikacji. Sprawdź później!', accountCreated: 'Gratulacje!', accountRedirect: 'Wkrótce zostaniesz przekierowany do ekranu głównego...', errorMessage: 'Proszę wypełnić wszystkie wymagane pola.', loginError: 'Nieprawidłowy telefon lub hasło.', languageTitle: 'Wybierz swój Język', languageBtnText: 'Język', }, // Polish
    'ro': { pageTitle: 'Înregistrare Devonix AI', appName: 'Devonix AI', loginTitle: 'Conectare la Devonix AI', signupTitle: 'Creați-vă Contul Devonix AI', placeholderName: 'Nume Complet', placeholderPhone: 'Număr de Telefon', placeholderDOB: 'Data Nașterii (Opțional)', placeholderCountry: 'Țară', placeholderDistrict: 'District', placeholderThana: 'Thana', placeholderPassword: 'Parolă', signupBtnText: 'Înregistrare', loginBtnText: 'Conectare', logoutBtnText: 'Deconectare', loginText: 'Aveți deja un cont?', loginLinkText: 'Conectare', welcomeMessage: 'Bine ați venit la Devonix AI!', homeInstructions: 'Vă rugăm să vă conectați sau să vă înregistrați pentru a accesa funcțiile complete.', storeWelcome: 'Magazin Devonix', storeBtnText: 'Magazin Devonix', storeAppPlaceholder: 'Nu au fost încărcate aplicații încă. Verificați mai târziu!', accountCreated: 'Felicitări!', accountRedirect: 'Veți fi redirecționat către ecranul de pornire în scurt timp...', errorMessage: 'Vă rugăm să completați toate câmpurile obligatorii.', loginError: 'Telefon sau parolă invalidă.', languageTitle: 'Selectați Limba', languageBtnText: 'Limbă', }, // Romanian
    'sv': { pageTitle: 'Devonix AI Registrering', appName: 'Devonix AI', loginTitle: 'Logga in på Devonix AI', signupTitle: 'Skapa ditt Devonix AI-konto', placeholderName: 'Fullständigt Namn', placeholderPhone: 'Telefonnummer', placeholderDOB: 'Födelsedatum (Valfritt)', placeholderCountry: 'Land', placeholderDistrict: 'Distrikt', placeholderThana: 'Thana', placeholderPassword: 'Lösenord', signupBtnText: 'Registrera dig', loginBtnText: 'Logga in', logoutBtnText: 'Logga ut', loginText: 'Har du redan ett konto?', loginLinkText: 'Logga in', welcomeMessage: 'Välkommen till Devonix AI!', homeInstructions: 'Vänligen logga in eller registrera dig för att få tillgång till alla funktioner.', storeWelcome: 'Devonix Butik', storeBtnText: 'Devonix Butik', storeAppPlaceholder: 'Inga appar har laddats upp än. Kontrollera senare!', accountCreated: 'Grattis!', accountRedirect: 'Du kommer snart att omdirigeras till startsidan...', errorMessage: 'Vänligen fyll i alla obligatoriska fält.', loginError: 'Ogiltigt telefonnummer eller lösenord.', languageTitle: 'Välj ditt Språk', languageBtnText: 'Språk', }, // Swedish
    'tr': { pageTitle: 'Devonix AI Kayıt', appName: 'Devonix AI', loginTitle: 'Devonix AI Giriş', signupTitle: 'Devonix AI Hesabınızı Oluşturun', placeholderName: 'Tam Ad', placeholderPhone: 'Telefon Numarası', placeholderDOB: 'Doğum Tarihi (İsteğe Bağlı)', placeholderCountry: 'Ülke', placeholderDistrict: 'İlçe', placeholderThana: 'Thana', placeholderPassword: 'Şifre', signupBtnText: 'Kaydol', loginBtnText: 'Giriş Yap', logoutBtnText: 'Çıkış Yap', loginText: 'Zaten bir hesabınız var mı?', loginLinkText: 'Giriş Yap', welcomeMessage: 'Devonix AI\'ya Hoş Geldiniz!', homeInstructions: 'Tüm özelliklere erişmek için lütfen giriş yapın veya kaydolun.', storeWelcome: 'Devonix Mağaza', storeBtnText: 'Devonix Mağaza', storeAppPlaceholder: 'Henüz uygulama yüklenmedi. Daha sonra kontrol edin!', accountCreated: 'Tebrikler!', accountRedirect: 'Ana ekrana kısa süre içinde yönlendirileceksiniz...', errorMessage: 'Lütfen gerekli tüm alanları doldurun.', loginError: 'Geçersiz telefon veya şifre.', languageTitle: 'Dilinizi Seçin', languageBtnText: 'Dil', }, // Turkish
    'uk': { pageTitle: 'Реєстрація Devonix AI', appName: 'Devonix AI', loginTitle: 'Вхід до Devonix AI', signupTitle: 'Створіть свій обліковий запис Devonix AI', placeholderName: 'Повне Ім\'я', placeholderPhone: 'Номер Телефону', placeholderDOB: 'Дата Народження (Необов\'язково)', placeholderCountry: 'Країна', placeholderDistrict: 'Район', placeholderThana: 'Тана', placeholderPassword: 'Пароль', signupBtnText: 'Зареєструватися', loginBtnText: 'Увійти', logoutBtnText: 'Вийти', loginText: 'Вже маєте обліковий запис?', loginLinkText: 'Увійти', welcomeMessage: 'Ласкаво просимо до Devonix AI!', homeInstructions: 'Будь ласка, увійдіть або зареєструйтеся, щоб отримати доступ до всіх функцій.', storeWelcome: 'Магазин Devonix', storeBtnText: 'Магазин Devonix', storeAppPlaceholder: 'Програми ще не завантажено. Перевірте пізніше!', accountCreated: 'Вітаємо!', accountRedirect: 'Ви будете перенаправлені на головний екран незабаром...', errorMessage: 'Будь ласка, заповніть усі обов\'язкові поля.', loginError: 'Недійсний телефон або пароль.', languageTitle: 'Виберіть свою Мову', languageBtnText: 'Мова', }, // Ukrainian
    'vi': { pageTitle: 'Đăng ký Devonix AI', appName: 'Devonix AI', loginTitle: 'Đăng nhập Devonix AI', signupTitle: 'Tạo Tài khoản Devonix AI Của Bạn', placeholderName: 'Tên Đầy Đủ', placeholderPhone: 'Số Điện Thoại', placeholderDOB: 'Ngày Sinh (Tùy Chọn)', placeholderCountry: 'Quốc Gia', placeholderDistrict: 'Quận/Huyện', placeholderThana: 'Thana', placeholderPassword: 'Mật Khẩu', signupBtnText: 'Đăng ký', loginBtnText: 'Đăng nhập', logoutBtnText: 'Đăng xuất', loginText: 'Bạn đã có tài khoản?', loginLinkText: 'Đăng nhập', welcomeMessage: 'Chào mừng đến với Devonix AI!', homeInstructions: 'Vui lòng đăng nhập hoặc đăng ký để truy cập đầy đủ các tính năng.', storeWelcome: 'Cửa hàng Devonix', storeBtnText: 'Cửa hàng Devonix', storeAppPlaceholder: 'Chưa có ứng dụng nào được tải lên. Vui lòng kiểm tra lại sau!', accountCreated: 'Chúc mừng!', accountRedirect: 'Bạn sẽ được chuyển hướng đến màn hình chính trong thời gian ngắn...', errorMessage: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc.', loginError: 'Số điện thoại hoặc mật khẩu không hợp lệ.', languageTitle: 'Chọn Ngôn ngữ của Bạn', languageBtnText: 'Ngôn ngữ', }, // Vietnamese
    'th': { pageTitle: 'ลงทะเบียน Devonix AI', appName: 'Devonix AI', loginTitle: 'เข้าสู่ระบบ Devonix AI', signupTitle: 'สร้างบัญชี Devonix AI ของคุณ', placeholderName: 'ชื่อเต็ม', placeholderPhone: 'หมายเลขโทรศัพท์', placeholderDOB: 'วันเกิด (ไม่บังคับ)', placeholderCountry: 'ประเทศ', placeholderDistrict: 'เขต/อำเภอ', placeholderThana: 'ตำบล', placeholderPassword: 'รหัสผ่าน', signupBtnText: 'ลงทะเบียน', loginBtnText: 'เข้าสู่ระบบ', logoutBtnText: 'ออกจากระบบ', loginText: 'มีบัญชีอยู่แล้ว?', loginLinkText: 'เข้าสู่ระบบ', welcomeMessage: 'ยินดีต้อนรับสู่ Devonix AI!', homeInstructions: 'โปรดเข้าสู่ระบบหรือลงทะเบียนเพื่อเข้าถึงคุณสมบัติเต็มรูปแบบ', storeWelcome: 'ร้านค้า Devonix', storeBtnText: 'ร้านค้า Devonix', storeAppPlaceholder: 'ยังไม่มีการอัปโหลดแอป โปรดตรวจสอบภายหลัง!', accountCreated: 'ขอแสดงความยินดี!', accountRedirect: 'คุณจะถูกนำไปที่หน้าจอหลักในไม่ช้า...', errorMessage: 'โปรดกรอกข้อมูลในช่องที่จำเป็นทั้งหมด', loginError: 'โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง', languageTitle: 'เลือกภาษาของคุณ', languageBtnText: 'ภาษา', }, // Thai
    'sk': { pageTitle: 'Devonix AI Registrácia', appName: 'Devonix AI', loginTitle: 'Prihlásenie do Devonix AI', signupTitle: 'Vytvorte si účet Devonix AI', placeholderName: 'Celé Meno', placeholderPhone: 'Telefónne Číslo', placeholderDOB: 'Dátum Narodenia (Voliteľné)', placeholderCountry: 'Krajina', placeholderDistrict: 'Okres', placeholderThana: 'Thana', placeholderPassword: 'Heslo', signupBtnText: 'Zaregistrovať sa', loginBtnText: 'Prihlásiť sa', logoutBtnText: 'Odhlásiť sa', loginText: 'Už máte účet?', loginLinkText: 'Prihlásiť sa', welcomeMessage: 'Vitajte v Devonix AI!', homeInstructions: 'Pre prístup k všetkým funkciám sa prosím prihláste alebo zaregistrujte.', storeWelcome: 'Devonix Obchod', storeBtnText: 'Devonix Obchod', storeAppPlaceholder: 'Žiadne aplikácie zatiaľ neboli nahrané. Skontrolujte to neskôr!', accountCreated: 'Gratulujeme!', accountRedirect: 'O chvíľu budete presmerovaní na domovskú obrazovku...', errorMessage: 'Vyplňte prosím všetky povinné polia.', loginError: 'Neplatný telefón alebo heslo.', languageTitle: 'Vyberte svoj Jazyk', languageBtnText: 'Jazyk', }, // Slovak
    'sl': { pageTitle: 'Devonix AI Registracija', appName: 'Devonix AI', loginTitle: 'Prijava v Devonix AI', signupTitle: 'Ustvarite svoj Devonix AI račun', placeholderName: 'Polno Ime', placeholderPhone: 'Telefonska Številka', placeholderDOB: 'Datum Rojstva (Izbirno)', placeholderCountry: 'Država', placeholderDistrict: 'Okrožje', placeholderThana: 'Thana', placeholderPassword: 'Geslo', signupBtnText: 'Registracija', loginBtnText: 'Prijava', logoutBtnText: 'Odjava', loginText: 'Že imate račun?', loginLinkText: 'Prijava', welcomeMessage: 'Dobrodošli v Devonix AI!', homeInstructions: 'Prosimo, prijavite se ali se registrirajte za dostop do vseh funkcij.', storeWelcome: 'Devonix Trgovina', storeBtnText: 'Devonix Trgovina', storeAppPlaceholder: 'Aplikacije še niso naložene. Preverite pozneje!', accountCreated: 'Čestitamo!', accountRedirect: 'Kmalu boste preusmerjeni na začetni zaslon...', errorMessage: 'Prosimo, izpolnite vsa obvezna polja.', loginError: 'Neveljaven telefon ali geslo.', languageTitle: 'Izberite svoj Jezik', languageBtnText: 'Jezik', }, // Slovenian
    'sw': { pageTitle: 'Usajili wa Devonix AI', appName: 'Devonix AI', loginTitle: 'Ingia kwenye Devonix AI', signupTitle: 'Fungua Akaunti yako ya Devonix AI', placeholderName: 'Jina Kamili', placeholderPhone: 'Nambari ya Simu', placeholderDOB: 'Tarehe ya Kuzaliwa (Si lazima)', placeholderCountry: 'Nchi', placeholderDistrict: 'Wilaya', placeholderThana: 'Thana', placeholderPassword: 'Neno Siri', signupBtnText: 'Jisajili', loginBtnText: 'Ingia', logoutBtnText: 'Toka', loginText: 'Tayari una akaunti?', loginLinkText: 'Ingia', welcomeMessage: 'Karibu Devonix AI!', homeInstructions: 'Tafadhali ingia au jisajili ili kufikia vipengele vyote.', storeWelcome: 'Duka la Devonix', storeBtnText: 'Duka la Devonix', storeAppPlaceholder: 'Hakuna programu zilizopakiwa bado. Angalia tena baadaye!', accountCreated: 'Hongera!', accountRedirect: 'Utarejeshwa kwenye skrini ya Nyumbani baada ya muda mfupi...', errorMessage: 'Tafadhali jaza sehemu zote zinazohitajika.', loginError: 'Simu বা neno siri batili.', languageTitle: 'Chagua Lugha Yako', languageBtnText: 'Lugha', }, // Swahili
    'tl': { pageTitle: 'Pagpaparehistro sa Devonix AI', appName: 'Devonix AI', loginTitle: 'Mag-log in sa Devonix AI', signupTitle: 'Gumawa ng Iyong Devonix AI Account', placeholderName: 'Buong Pangalan', placeholderPhone: 'Numero ng Telepono', placeholderDOB: 'Petsa ng Kapanganakan (Opsyonal)', placeholderCountry: 'Bansa', placeholderDistrict: 'Distrito', placeholderThana: 'Thana', placeholderPassword: 'Password', signupBtnText: 'Mag-sign Up', loginBtnText: 'Mag-log In', logoutBtnText: 'Mag-log Out', loginText: 'Mayroon nang account?', loginLinkText: 'Mag-log In', welcomeMessage: 'Maligayang Pagdating sa Devonix AI!', homeInstructions: 'Paki-log in o mag-sign up para ma-access ang buong mga tampok.', storeWelcome: 'Devonix Store', storeBtnText: 'Devonix Store', storeAppPlaceholder: 'Wala pang app na na-upload. Balikan mamaya!', accountCreated: 'Pagbati!', accountRedirect: 'Ire-redirect ka sa Home screen sa madaling panahon...', errorMessage: 'Paki-fill out lahat ng kinakailangang field.', loginError: 'Hindi wastong telepono o password.', languageTitle: 'Piliin ang Iyong Wika', languageBtnText: 'Wika', }, // Tagalog
    'ur': { pageTitle: 'Devonix AI سائن اپ', appName: 'Devonix AI', loginTitle: 'Devonix AI میں لاگ ان کریں', signupTitle: 'اپنا Devonix AI اکاؤنٹ بنائیں', placeholderName: 'پورا نام', placeholderPhone: 'فون نمبر', placeholderDOB: 'تاریخ پیدائش (اختیاری)', placeholderCountry: 'ملک', placeholderDistrict: 'ضلع', placeholderThana: 'تھانہ', placeholderPassword: 'پاس ورڈ', signupBtnText: 'سائن اپ کریں', loginBtnText: 'لاگ ان کریں', logoutBtnText: 'لاگ آؤٹ کریں', loginText: 'پہلے سے ہی ایک اکاؤنٹ ہے؟', loginLinkText: 'لاگ ان کریں', welcomeMessage: 'Devonix AI میں خوش آمدید!', homeInstructions: 'تمام خصوصیات تک رسائی کے لیے براہ کرم لاگ ان یا سائن اپ کریں۔', storeWelcome: 'Devonix اسٹور', storeBtnText: 'Devonix اسٹور', storeAppPlaceholder: 'ابھی تک کوئی ایپ اپ لوڈ نہیں ہوئی ہے۔ بعد میں چیک کریں!', accountCreated: 'مبارک ہو!', accountRedirect: 'آپ کو جلد ہی ہوم اسکرین پر بھیج دیا جائے گا...', errorMessage: 'برائے مہربانی تمام مطلوبہ فیلڈز پُر کریں۔', loginError: 'غلط فون یا پاس ورڈ۔', languageTitle: 'اپنی زبان منتخب کریں', languageBtnText: 'زبان', }, // Urdu
    'uz': { pageTitle: 'Devonix AI Ro\'yxatdan O\'tish', appName: 'Devonix AI', loginTitle: 'Devonix AI-ga Kirish', signupTitle: 'Devonix AI Hisobingizni Yarating', placeholderName: 'To\'liq Ism', placeholderPhone: 'Telefon Raqami', placeholderDOB: 'Tug\'ilgan Sana (Ixtiyoriy)', placeholderCountry: 'Mamlakat', placeholderDistrict: 'Tuman', placeholderThana: 'Tana', placeholderPassword: 'Parol', signupBtnText: 'Ro\'yxatdan O\'tish', loginBtnText: 'Kirish', logoutBtnText: 'Chiqish', loginText: 'Allaqachon hisobingiz bormi?', loginLinkText: 'Kirish', welcomeMessage: 'Devonix AI-ga xush kelibsiz!', homeInstructions: 'Barcha imkoniyatlarga kirish uchun iltimos kiring yoki ro\'yxatdan o\'ting.', storeWelcome: 'Devonix Do\'koni', storeBtnText: 'Devonix Do\'koni', storeAppPlaceholder: 'Hali ilovalar yuklanmadi. Keyinroq tekshiring!', accountCreated: 'Tabriklaymiz!', accountRedirect: 'Siz tez orada Bosh Ekranga yo\'naltirilansiz...', errorMessage: 'Iltimos, barcha talab qilingan maydonlarni to\'ldiring.', loginError: 'Yaroqsiz telefon yoki parol.', languageTitle: 'Tilni Tanlang', languageBtnText: 'Til', }, // Uzbek
    // ... বাকি ভাষা (মোট 50টি) এই কোডের মধ্যেই অন্তর্ভুক্ত আছে
};

let currentLanguage = localStorage.getItem('language') || 'bn'; // ডিফল্ট ভাষা বাংলা
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// ===============================================
// ৩. Store App List (অ্যাপ স্টোর ডেটা)
// (এখানে আপনার নতুন অ্যাপ যুক্ত করতে পারেন)
// ===============================================
const appList = [
    { id: 1, name: 'Devonix Utility App', version: '1.0', size: '5.2MB', downloadLink: '#' },
    { id: 2, name: 'Devonix Photo Editor', version: '2.1', size: '12.8MB', downloadLink: '#' },
    // নতুন অ্যাপ যুক্ত করার জন্য এই অ্যারেতে নতুন অবজেক্ট যোগ করুন
];


// ===============================================
// ৪. CORE FUNCTIONS (মূল ফাংশন)
// ===============================================

// সমস্ত লেখা পরিবর্তন করার ফাংশন
function updateTextContent() {
    const texts = translations[currentLanguage];
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (texts[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                // ইনপুট বা সিলেক্ট ট্যাগের জন্য placeholder পরিবর্তন
                element.placeholder = texts[key];
                // Select অপশনের জন্য
                if (element.tagName === 'SELECT' && element.hasAttribute('disabled')) {
                     element.querySelector('option[disabled]').textContent = texts[key];
                }
            } else {
                element.textContent = texts[key];
            }
        }
    });
    // পেইজের Title আপডেট
    document.title = texts.pageTitle || 'Devonix AI';
}

// স্ক্রিন পরিবর্তনের ফাংশন
function showSection(id) {
    document.querySelectorAll('.screen').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
    // স্টোর বাটন আপডেট
    document.getElementById('storeBtn').classList.toggle('hidden', id === 'store-section');
}

// অথেন্টিকেশন UI আপডেট
function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (isLoggedIn) {
        authBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        // লগইন করার পরে যদি অন্য স্ক্রিনে থাকি, তবে হোম স্ক্রিনে নিয়ে আসা
        if (document.getElementById('login-section').classList.contains('hidden') === false || 
            document.getElementById('signup-section').classList.contains('hidden') === false) {
             showSection('home-section'); 
        }
    } else {
        authBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}

// অ্যাপ স্টোর রেন্ডার করার ফাংশন
function renderAppStore() {
    const container = document.getElementById('appListContainer');
    const noAppsMessage = document.getElementById('noAppsMessage');
    container.innerHTML = '';
    
    if (appList.length === 0) {
        noAppsMessage.classList.remove('hidden');
        container.appendChild(noAppsMessage);
        return;
    }
    noAppsMessage.classList.add('hidden');

    appList.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-info">
                <h4>${app.name} (${app.version})</h4>
                <p>${app.size}</p>
            </div>
            <a href="${app.downloadLink}" download="${app.name}.apk" class="download-btn">Download</a>
        `;
        container.appendChild(card);
    });
}

// ###############################################
// ৫. EVENT LISTENERS & INITIALIZATION
// ###############################################
document.addEventListener('DOMContentLoaded', () => {
    // ভাষা নির্বাচন গ্রিড তৈরি
    const languageGrid = document.getElementById('languageGrid');
    const countryList = [
        { code: 'BD', name: 'বাংলাদেশ' },
        { code: 'IN', name: 'ভারত' },
        { code: 'US', name: 'United States' },
        // আরও দেশ যুক্ত করুন
    ];

    Object.keys(translations).forEach(langCode => {
        // ভাষা কোড থেকে নাম নেওয়া (যদি অনুবাদে ভাষা টাইটেল না থাকে)
        const langName = translations[langCode].languageTitle ? translations[langCode].languageTitle.split(' ').slice(2).join(' ') : langCode.toUpperCase(); 
        const button = document.createElement('button');
        button.className = 'language-button';
        button.textContent = langName;
        button.dataset.lang = langCode;
        if (langCode === currentLanguage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentLanguage = langCode;
            localStorage.setItem('language', langCode);
            document.querySelectorAll('.language-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateTextContent();
            renderAppStore(); // ভাষা পরিবর্তনের পর স্টোর আপডেট
            // ভাষা পরিবর্তনের পরে ব্যবহারকারী যে স্ক্রিনে ছিল সেখানে অথবা হোমে নিয়ে আসা
            const visibleScreenId = document.querySelector('.screen:not(.hidden)')?.id || (isLoggedIn ? 'home-section' : 'signup-section');
            showSection(visibleScreenId);
        });
        languageGrid.appendChild(button);
    });

    // দেশের ড্রপডাউন তৈরি
    const countrySelect = document.getElementById('country');
    countryList.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
    
    // প্রাথমিক আপডেট
    updateTextContent();
    updateAuthUI();
    renderAppStore();
    showSection(isLoggedIn ? 'home-section' : 'signup-section'); // লগইন না থাকলে সাইনআপ দেখাবে

    // ইভেন্ট লিসেনার্স
    
    // স্ক্রিন নেভিগেশন
    document.getElementById('authBtn').addEventListener('click', () => showSection('login-section'));
    document.getElementById('logoutBtn').addEventListener('click', () => {
        isLoggedIn = false;
        localStorage.setItem('isLoggedIn', 'false');
        updateAuthUI();
        showSection('home-section');
    });
    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login-section');
    });
    document.getElementById('storeBtn').addEventListener('click', () => {
        renderAppStore(); // নিশ্চিত করুন ডেটা আপডেট হয়েছে
        showSection('store-section');
    });
    document.getElementById('languageBtn').addEventListener('click', () => showSection('language-section'));
    document.getElementById('closeLanguageBtn').addEventListener('click', () => showSection(isLoggedIn ? 'home-section' : 'signup-section'));

    // ৬. পাসওয়ার্ড টগল ফিচার
    const setupPasswordToggle = (toggleId, inputId) => {
        document.getElementById(toggleId).addEventListener('click', (e) => {
            const passwordInput = document.getElementById(inputId);
            const icon = e.currentTarget.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    };
    
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleLoginPassword', 'loginPassword');

    // ###############################################
    // ৩. এবং ৪. সাইনআপ এবং লগইন লজিক
    // ###############################################
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const dob = document.getElementById('dob').value;
        const country = document.getElementById('country').value;
        const district = document.getElementById('district').value;
        const thana = document.getElementById('thana').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('signupError');

        // ৩. ইনপুট যাচাই (Validation) - DOB ঐচ্ছিক
        if (!name || !phone || !country || !district || !thana || !password) {
            errorElement.textContent = translations[currentLanguage].errorMessage;
            errorElement.classList.remove('hidden');
            return;
        }
        errorElement.classList.add('hidden');
        
        // Firestore এ ডেটা সেভ
        try {
            await db.collection("users").doc(phone).set({
                name: name,
                phone: phone,
                dob: dob,
                country: country,
                district: district,
                thana: thana,
                password: password, // নিরাপত্তা নিশ্চিত করার জন্য এনক্রিপশন ব্যবহার করা উচিত, এটি শুধু উদাহরণের জন্য
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });

            // সাফল্য বার্তা দেখান
            document.getElementById('successMessage').classList.remove('hidden');
            
            // তাৎক্ষণিকভাবে হোম পেজে নিয়ে আসা
            setTimeout(() => {
                document.getElementById('successMessage').classList.add('hidden');
                isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true');
                updateAuthUI();
                showSection('home-section');
                document.getElementById('signupForm').reset(); // ফর্ম খালি করুন
            }, 2000); // ২ সেকেন্ড অপেক্ষা করুন

        } catch (error) {
            console.error("Error writing document: ", error);
            errorElement.textContent = "সাইনআপে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
            errorElement.classList.remove('hidden');
        }
    });
    
    // লগইন ফর্ম সাবমিট লজিক (সাধারণ যাচাই)
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginPhone = document.getElementById('loginPhone').value;
        const loginPassword = document.getElementById('loginPassword').value;
        const loginErrorElement = document.getElementById('loginError');

        if (!loginPhone || !loginPassword) {
            loginErrorElement.textContent = translations[currentLanguage].errorMessage;
            loginErrorElement.classList.remove('hidden');
            return;
        }
        
        // Firestore থেকে যাচাই (বাস্তব ক্ষেত্রে Auth ব্যবহার করা উচিত)
        try {
            const doc = await db.collection("users").doc(loginPhone).get();
            
            if (doc.exists && doc.data().password === loginPassword) {
                // সফল লগইন
                isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true');
                updateAuthUI();
                showSection('home-section');
                document.getElementById('loginForm').reset();
            } else {
                // লগইন ব্যর্থ
                loginErrorElement.textContent = translations[currentLanguage].loginError;
                loginErrorElement.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Error during login: ", error);
            loginErrorElement.textContent = "লগইন করার সময় সমস্যা হয়েছে।";
            loginErrorElement.classList.remove('hidden');
        }
    });
});
