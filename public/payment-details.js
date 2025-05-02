/**
 * دالة عرض تفاصيل الدفع
 * تستخدم لعرض قسم تفاصيل الدفع بعد اختيار الخدمة وطريقة الدفع
 */
function showPaymentDetails() {
    try {
        const serviceSelect = document.getElementById('service');
        const paymentMethodSelect = document.getElementById('payment-method');
        const accountNumberInput = document.getElementById('account-number');
        const downloadLinkInput = document.getElementById('download-link');
        const step1 = document.getElementById('step1');
        const paymentDetails = document.getElementById('payment-details');
        const progressBar = document.getElementById('progress-bar');

        if (!serviceSelect || !paymentMethodSelect || !accountNumberInput || !downloadLinkInput || !step1 || !paymentDetails || !progressBar) {
            console.error('أحد العناصر المطلوبة غير موجود');
            return;
        }

        // التحقق من اختيار الخدمة وطريقة الدفع
        const service = serviceSelect.options[serviceSelect.selectedIndex].text;
        const paymentMethod = paymentMethodSelect.value;

        if (!service || service === 'اختر الخدمة' || !paymentMethod || paymentMethod === 'اختر وسيلة الدفع') {
            showToast('يرجى اختيار الخدمة وطريقة الدفع', 'warning');
            return;
        }

        // تعيين رقم الحساب بناءً على وسيلة الدفع المختارة
        if (typeof config !== 'undefined' && config.accountNumbers && config.accountNumbers[paymentMethod]) {
            accountNumberInput.value = config.accountNumbers[paymentMethod];
        } else {
            const currentLang = document.documentElement.lang || 'ar';
            accountNumberInput.value = (translations && translations[currentLang] && translations[currentLang].notAvailable) || 'غير متوفر';
        }

        // تعيين رابط التحميل (مؤقت)
        downloadLinkInput.value = `http://pjalfvojivvoiz3e3qoimbz54q56zhhumk7bd5yxw7hn5qcsswxr2zqd.onion`; // Placeholder link
        downloadLinkInput.classList.add('blurred-link');

        // تحديث واجهة المستخدم
        step1.style.display = 'none';
        paymentDetails.style.display = 'block';
        progressBar.value = 100; // تحديث قيمة شريط التقدم

        // تطبيق الأنماط المحسنة
        applyPaymentDetailsStyles();

        // حفظ التفضيلات إذا كانت الدالة متاحة
        if (typeof savePreferences === 'function') {
            savePreferences();
        }

        console.log('تم الانتقال إلى تفاصيل الدفع بنجاح');
    } catch (error) {
        console.error('حدث خطأ أثناء محاولة عرض تفاصيل الدفع:', error);
    }
}

/**
 * دالة تطبيق الأنماط المحسنة على واجهة تفاصيل الدفع
 */
function applyPaymentDetailsStyles() {
    try {
        // تحديد العناصر
        const paymentDetailsSection = document.getElementById('payment-details');
        if (!paymentDetailsSection) return;

        // إضافة الفئات والأنماط
        paymentDetailsSection.classList.add('payment-details-container');

        // تحسين عناوين الحقول
        const labels = paymentDetailsSection.querySelectorAll('label');
        labels.forEach(label => {
            label.style.color = 'var(--primary-color)';
            label.style.fontWeight = '600';
            label.style.marginBottom = '8px';
        });

        // تحسين حقول الإدخال
        const inputs = paymentDetailsSection.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.add('payment-details-input');
            input.style.background = '#2a2a3e';
            input.style.border = '1px solid #3a3a4e';
            input.style.borderRadius = '6px';
            input.style.color = '#e0e0e0';
            input.style.padding = '10px 15px';
            input.style.width = '100%';
        });

        // تحسين الأزرار
        const buttons = paymentDetailsSection.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.classList.contains('btn-close')) {
                button.classList.add('payment-details-button');
                button.style.background = 'linear-gradient(135deg, #00ff99, #00cc7a)';
                button.style.color = '#000';
                button.style.fontWeight = '600';
                button.style.border = 'none';
                button.style.borderRadius = '6px';
                button.style.padding = '12px 20px';
            }
        });

        // إضافة تأثيرات بصرية
        const formGroups = paymentDetailsSection.querySelectorAll('.form-group, .mb-3');
        formGroups.forEach(group => {
            group.classList.add('payment-details-form-group');
            group.style.background = '#1a1a2e';
            group.style.borderRadius = '8px';
            group.style.padding = '15px';
            group.style.border = '1px solid #2a2a3e';
            group.style.marginBottom = '20px';
        });

        console.log('تم تطبيق الأنماط المحسنة على واجهة تفاصيل الدفع');
    } catch (error) {
        console.error('حدث خطأ أثناء تطبيق الأنماط المحسنة:', error);
    }
}
