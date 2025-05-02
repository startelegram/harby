/**
 * نظام تغيير اللغة
 * يوفر وظائف لتغيير لغة الموقع بين العربية والإنجليزية
 */

// اللغة الحالية
let currentLang = 'ar';

// الترجمات
const translations = {
    ar: {
        title: "Green Hat Platform",
        clientInfo: "معلومات العميل",
        selectService: "اختر الخدمة",
        servicePrice: "سعر الخدمة (USD)",
        transferFee: "رسوم التحويل (USD)",
        selectPayment: "اختر وسيلة الدفع",
        totalAmount: "المبلغ الإجمالي (USD)",
        next: "التالي",
        paymentDetails: "قد تستغرق عملية تأكيد الطلب من 5 إلى 20 دقيقة، ولكن في الغالب تستغرق 10 دقائق فقط.",
        accountNumber: "رقم الحساب للدفع",
        uploadProof: "رفع إثبات الدفع (سكرين شوت)",
        telegramAccount: "حساب تيليجرام للتواصل",
        orderStatus: "حالة الطلب",
        confirmPayment: "تأكيد الدفع",
        transactions: "سجل التحويلات الأخيرة",
        popularServices: "الخدمات الأكثر طلبًا",
        error: "حدث خطأ!",
        errorMessage: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        retry: "إعادة المحاولة",
        welcomeTitle: "منصة القبعة الخضراء",
        welcomeText: "المنصة الأكثر أمانًا وموثوقية للخدمات الأمنية والأدوات المتخصصة",
        join: "انضم الآن",
        client: "العميل",
        confirmationService: "الخدمة",
        confirmationAmount: "المبلغ",
        transactionId: "رقم العملية",
        date: "التاريخ",
        visitorCount: "عدد الزوار",
        showStats: "عرض الإحصائيات",
        visitorStats: "إحصائيات الزوار",
        confirmationTitle: "تأكيد الطلب",
        notification: "إشعار",
        loginTitle: "تسجيل الدخول",
        loginUsername: "اسم المستخدم",
        loginPassword: "كلمة المرور",
        loginButton: "تسجيل الدخول",
        registerTitle: "تسجيل حساب جديد",
        registerUsername: "اسم المستخدم",
        registerEmail: "البريد الإلكتروني",
        registerPassword: "كلمة المرور",
        registerConfirmPassword: "تأكيد كلمة المرور",
        registerFullName: "الاسم الكامل",
        registerTelegram: "حساب تيليجرام",
        registerButton: "تسجيل",
        haveAccount: "لديك حساب بالفعل؟",
        loginLink: "تسجيل الدخول",
        chatPlaceholder: "اكتب رسالتك هنا...",
        tooltipDownloadLink: "رابط تحميل الخدمة",
        unexpectedError: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
    },
    en: {
        title: "Green Hat Platform",
        clientInfo: "Client Information",
        selectService: "Select Service",
        servicePrice: "Service Price (USD)",
        transferFee: "Transfer Fee (USD)",
        selectPayment: "Select Payment Method",
        totalAmount: "Total Amount (USD)",
        next: "Next",
        paymentDetails: "Order confirmation may take 5 to 20 minutes, but usually takes only 10 minutes.",
        accountNumber: "Payment Account Number",
        uploadProof: "Upload Payment Proof (Screenshot)",
        telegramAccount: "Telegram Account for Contact",
        orderStatus: "Order Status",
        confirmPayment: "Confirm Payment",
        transactions: "Recent Transactions",
        popularServices: "Popular Services",
        error: "Error!",
        errorMessage: "An error occurred while processing your request. Please try again.",
        retry: "Retry",
        welcomeTitle: "Green Hat Platform",
        welcomeText: "The most secure and reliable platform for security services and specialized tools",
        join: "Join Now",
        client: "Client",
        confirmationService: "Service",
        confirmationAmount: "Amount",
        transactionId: "Transaction ID",
        date: "Date",
        visitorCount: "Visitor Count",
        showStats: "Show Statistics",
        visitorStats: "Visitor Statistics",
        confirmationTitle: "Order Confirmation",
        notification: "Notification",
        loginTitle: "Login",
        loginUsername: "Username",
        loginPassword: "Password",
        loginButton: "Login",
        registerTitle: "Register New Account",
        registerUsername: "Username",
        registerEmail: "Email",
        registerPassword: "Password",
        registerConfirmPassword: "Confirm Password",
        registerFullName: "Full Name",
        registerTelegram: "Telegram Account",
        registerButton: "Register",
        haveAccount: "Already have an account?",
        loginLink: "Login",
        chatPlaceholder: "Type your message here...",
        tooltipDownloadLink: "Service Download Link",
        unexpectedError: "An unexpected error occurred. Please try again."
    }
};

/**
 * تغيير لغة الموقع
 * @param {string} lang - رمز اللغة ('ar' للعربية، 'en' للإنجليزية)
 */
function changeLanguage(lang) {
    console.log('تغيير اللغة إلى:', lang);
    
    // تحديث اللغة الحالية
    currentLang = lang;
    
    // تحديث اتجاه الصفحة واللغة
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // تحديث رابط Bootstrap بناءً على اتجاه اللغة
    const bootstrapLink = document.querySelector('link[href*="bootstrap"]');
    if (bootstrapLink) {
        if (currentLang === 'ar') {
            bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.rtl.min.css';
        } else {
            bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css';
        }
    }

    // تأخير صغير للتأكد من تحديث DOM بالاتجاه الجديد
    setTimeout(() => {
        updateLanguage();
        console.log('تم تغيير اللغة إلى:', currentLang);
    }, 100);
}

/**
 * تحديث واجهة المستخدم بناءً على اللغة المحددة
 */
function updateLanguage() {
    console.log('تحديث واجهة المستخدم باللغة:', currentLang);

    // التأكد من وجود ترجمات للغة الحالية
    if (!translations[currentLang]) {
        console.error('لم يتم العثور على ترجمات للغة:', currentLang);
        return;
    }

    // تحديث الصفحة الرئيسية
    const landingTitle = document.querySelector('#landing-page h1');
    if (landingTitle) landingTitle.textContent = translations[currentLang].welcomeTitle;

    const landingText = document.querySelector('#landing-page p');
    if (landingText) landingText.textContent = translations[currentLang].welcomeText;

    const landingButton = document.querySelector('#landing-page .btn-custom');
    if (landingButton) landingButton.textContent = translations[currentLang].join;

    // تحديث الشعار
    const logoText = document.querySelector('.logo-text');
    if (logoText) logoText.textContent = translations[currentLang].title;

    // تحديث قسم معلومات العميل
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length > 0) sectionTitles[0].textContent = translations[currentLang].clientInfo;

    // تحديث تسميات النموذج
    const formLabels = document.querySelectorAll('.form-label');
    if (formLabels.length > 0) formLabels[0].textContent = translations[currentLang].selectService;
    if (formLabels.length > 1) formLabels[1].textContent = translations[currentLang].servicePrice;
    if (formLabels.length > 2) formLabels[2].textContent = translations[currentLang].transferFee;
    if (formLabels.length > 3) formLabels[3].textContent = translations[currentLang].selectPayment;
    if (formLabels.length > 4) formLabels[4].textContent = translations[currentLang].totalAmount;
    if (formLabels.length > 5) formLabels[5].textContent = translations[currentLang].accountNumber;
    if (formLabels.length > 6) formLabels[6].textContent = translations[currentLang].uploadProof;
    if (formLabels.length > 7) formLabels[7].textContent = translations[currentLang].tooltipDownloadLink;
    if (formLabels.length > 8) formLabels[8].textContent = translations[currentLang].telegramAccount;
    if (formLabels.length > 9) formLabels[9].textContent = translations[currentLang].orderStatus;

    // تحديث الأزرار
    const customButtons = document.querySelectorAll('.btn-custom');
    if (customButtons.length > 1) customButtons[1].textContent = translations[currentLang].next;

    // تحديث معلومات التنبيه
    const alertInfo = document.querySelector('.alert-info');
    if (alertInfo) alertInfo.textContent = translations[currentLang].paymentDetails;

    // تحديث زر تأكيد الدفع
    const confirmPayment = document.querySelector('#confirm-payment');
    if (confirmPayment) confirmPayment.textContent = translations[currentLang].confirmPayment;

    // تحديث المعاملات والخدمات الشائعة
    if (sectionTitles.length > 1) sectionTitles[1].textContent = translations[currentLang].transactions;
    if (sectionTitles.length > 2) sectionTitles[2].textContent = translations[currentLang].popularServices;

    // تحديث صفحة الخطأ
    const errorTitle = document.querySelector('#error-page h2');
    if (errorTitle) errorTitle.textContent = translations[currentLang].error;

    const errorMessage = document.querySelector('#error-page p');
    if (errorMessage) errorMessage.textContent = translations[currentLang].errorMessage;

    const errorButton = document.querySelector('#error-page .btn-custom');
    if (errorButton) errorButton.textContent = translations[currentLang].retry;

    // تحديث رؤوس الجدول
    const tableHeaders = document.querySelectorAll('#transaction-table th');
    if (tableHeaders.length > 0) tableHeaders[0].textContent = translations[currentLang].client || 'العميل';
    if (tableHeaders.length > 1) tableHeaders[1].textContent = translations[currentLang].confirmationService || 'الخدمة';
    if (tableHeaders.length > 2) tableHeaders[2].textContent = translations[currentLang].confirmationAmount || 'المبلغ';
    if (tableHeaders.length > 3) tableHeaders[3].textContent = translations[currentLang].selectPayment || 'طريقة الدفع';
    if (tableHeaders.length > 4) tableHeaders[4].textContent = translations[currentLang].transactionId || 'رقم العملية';
    if (tableHeaders.length > 5) tableHeaders[5].textContent = translations[currentLang].date || 'التاريخ';

    // تحديث عداد الزوار
    const visitorCounterTitle = document.querySelector('.visitor-counter h3');
    if (visitorCounterTitle) visitorCounterTitle.textContent = translations[currentLang].visitorCount;

    const visitorCounterButton = document.querySelector('.visitor-counter .btn-custom');
    if (visitorCounterButton) visitorCounterButton.textContent = translations[currentLang].showStats;

    // تحديث نافذة التأكيد
    const confirmationTitle = document.querySelector('#confirmationModal .modal-title');
    if (confirmationTitle) confirmationTitle.textContent = translations[currentLang].confirmationTitle;

    // تحديث حقل الدردشة
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) chatInput.placeholder = translations[currentLang].chatPlaceholder;

    // تحديث إشعار التنبيه
    const toastHeader = document.querySelector('.toast-header .me-auto');
    if (toastHeader) toastHeader.textContent = translations[currentLang].notification;

    // تحديث عنوان إحصائيات الزوار
    const visitorStatsTitle = document.querySelector('.visitor-stats h3');
    if (visitorStatsTitle) {
        visitorStatsTitle.textContent = translations[currentLang].visitorStats;
    }

    // تحديث نافذة تسجيل الدخول
    const loginModalTitle = document.querySelector('#login-modal .modal-title');
    if (loginModalTitle) loginModalTitle.textContent = translations[currentLang].loginTitle;

    const loginUsernameLabel = document.querySelector('#login-form label[for="login-username"]');
    if (loginUsernameLabel) loginUsernameLabel.textContent = translations[currentLang].loginUsername;

    const loginPasswordLabel = document.querySelector('#login-form label[for="login-password"]');
    if (loginPasswordLabel) loginPasswordLabel.textContent = translations[currentLang].loginPassword;

    const loginButton = document.querySelector('#login-form .btn-custom');
    if (loginButton) loginButton.textContent = translations[currentLang].loginButton;

    // تحديث نافذة التسجيل
    const registerModalTitle = document.querySelector('#register-modal .modal-title');
    if (registerModalTitle) registerModalTitle.textContent = translations[currentLang].registerTitle;

    const registerUsernameLabel = document.querySelector('#register-form label[for="register-username"]');
    if (registerUsernameLabel) registerUsernameLabel.textContent = translations[currentLang].registerUsername;

    const registerEmailLabel = document.querySelector('#register-form label[for="register-email"]');
    if (registerEmailLabel) registerEmailLabel.textContent = translations[currentLang].registerEmail;

    const registerPasswordLabel = document.querySelector('#register-form label[for="register-password"]');
    if (registerPasswordLabel) registerPasswordLabel.textContent = translations[currentLang].registerPassword;

    const registerConfirmPasswordLabel = document.querySelector('#register-form label[for="register-confirm-password"]');
    if (registerConfirmPasswordLabel) registerConfirmPasswordLabel.textContent = translations[currentLang].registerConfirmPassword;

    const registerFullNameLabel = document.querySelector('#register-form label[for="register-fullname"]');
    if (registerFullNameLabel) registerFullNameLabel.textContent = translations[currentLang].registerFullName;

    const registerTelegramLabel = document.querySelector('#register-form label[for="register-telegram"]');
    if (registerTelegramLabel) registerTelegramLabel.textContent = translations[currentLang].registerTelegram;

    const registerButton = document.querySelector('#register-form .btn-custom');
    if (registerButton) registerButton.textContent = translations[currentLang].registerButton;

    const haveAccountText = document.querySelector('#register-modal .modal-footer p');
    if (haveAccountText) {
        const loginLink = haveAccountText.querySelector('a');
        haveAccountText.textContent = translations[currentLang].haveAccount + ' ';
        if (loginLink) {
            haveAccountText.appendChild(loginLink);
            loginLink.textContent = translations[currentLang].loginLink;
        }
    }

    // تحديث عناوين بطاقات الخدمات حسب اللغة المختارة
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const serviceName = card.getAttribute('data-service');
        const serviceTitle = card.querySelector('.service-card-content h5');

        // تحديث عناوين الخدمات الأساسية حسب اللغة
        if (serviceName === "زياده متابعين" && currentLang === 'en') {
            serviceTitle.textContent = "Increase Followers";
            card.setAttribute('data-service', "Increase Followers");
        } else if (serviceName === "Increase Followers" && currentLang === 'ar') {
            serviceTitle.textContent = "زياده متابعين";
            card.setAttribute('data-service', "زياده متابعين");
        } else if (serviceName === "شراء رقم دائم" && currentLang === 'en') {
            serviceTitle.textContent = "Buy Permanent Number";
            card.setAttribute('data-service', "Buy Permanent Number");
        } else if (serviceName === "Buy Permanent Number" && currentLang === 'ar') {
            serviceTitle.textContent = "شراء رقم دائم";
            card.setAttribute('data-service', "شراء رقم دائم");
        }
        // يمكن إضافة المزيد من الخدمات هنا
    });

    // تحديث عناوين فئات الخدمات
    const categoryTitles = document.querySelectorAll('.service-category-title');
    if (categoryTitles.length >= 1) {
        categoryTitles[0].innerHTML = currentLang === 'ar' ?
            '<i class="fas fa-star me-2"></i>الخدمات الأساسية' :
            '<i class="fas fa-star me-2"></i>Basic Services';
    }
    if (categoryTitles.length >= 2) {
        categoryTitles[1].innerHTML = currentLang === 'ar' ?
            '<i class="fas fa-crown me-2"></i>الخدمات المتقدمة' :
            '<i class="fas fa-crown me-2"></i>Advanced Services';
    }
    if (categoryTitles.length >= 3) {
        categoryTitles[2].innerHTML = currentLang === 'ar' ?
            '<i class="fas fa-fish me-2"></i>أدوات الفيشينج' :
            '<i class="fas fa-fish me-2"></i>Phishing Tools';
    }
    
    // إخفاء/إظهار الشهادات حسب اللغة
    const arabicTestimonials = document.querySelectorAll('.testimonial:not(.english-testimonial)');
    const englishTestimonials = document.querySelectorAll('.english-testimonial');
    
    arabicTestimonials.forEach(testimonial => {
        testimonial.style.display = currentLang === 'ar' ? 'block' : 'none';
    });
    
    englishTestimonials.forEach(testimonial => {
        testimonial.style.display = currentLang === 'en' ? 'block' : 'none';
    });
}

// تهيئة اللغة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التأكد من أن محدد اللغة يطابق اللغة الحالية
    const languageSelector = document.getElementById('language');
    if (languageSelector) {
        languageSelector.value = currentLang;
    }
    
    // تحديث واجهة المستخدم باللغة الحالية
    updateLanguage();
    
    console.log('تم تحميل الصفحة باللغة:', currentLang);
});
