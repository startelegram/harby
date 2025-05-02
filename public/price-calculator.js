/**
 * دالة تحديث السعر
 * تستخدم لحساب سعر الخدمة ورسوم التحويل والمبلغ الإجمالي
 */
function updatePrice() {
    try {
        // الحصول على العناصر
        const serviceSelect = document.getElementById('service');
        const priceInput = document.getElementById('price');
        const feeInput = document.getElementById('fee');
        const amountInput = document.getElementById('amount');
        const serviceDescription = document.getElementById('service-description');

        // التحقق من وجود العناصر
        if (!serviceSelect || !priceInput || !feeInput || !amountInput) {
            console.error('أحد العناصر المطلوبة غير موجود');
            return;
        }

        // الحصول على السعر من الخدمة المختارة
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const price = selectedOption ? parseFloat(selectedOption.getAttribute('data-price') || 0) : 0;

        // حساب رسوم التحويل (5% من السعر)
        const fee = price * 0.05;

        // حساب المبلغ الإجمالي
        const amount = price + fee;

        // تحديث حقول الإدخال
        priceInput.value = price > 0 ? price.toFixed(2) : '';
        feeInput.value = price > 0 ? fee.toFixed(2) : '';
        amountInput.value = price > 0 ? amount.toFixed(2) : '';

        // تحديث وصف الخدمة
        if (serviceDescription) {
            if (price > 0) {
                const serviceName = selectedOption.textContent;
                serviceDescription.innerHTML = `<div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>${serviceName}</strong>: ${getServiceDescription(serviceName)}
                </div>`;
                serviceDescription.style.display = 'block';
            } else {
                serviceDescription.innerHTML = '';
                serviceDescription.style.display = 'none';
            }
        }

        console.log('تم تحديث السعر بنجاح');
    } catch (error) {
        console.error('حدث خطأ أثناء تحديث السعر:', error);
    }
}

/**
 * دالة تحديث المبلغ
 * تستخدم لتحديث المبلغ الإجمالي عند تغيير وسيلة الدفع
 */
function updateAmount() {
    try {
        // الحصول على العناصر
        const paymentMethodSelect = document.getElementById('payment-method');
        const priceInput = document.getElementById('price');
        const feeInput = document.getElementById('fee');
        const amountInput = document.getElementById('amount');

        // التحقق من وجود العناصر
        if (!paymentMethodSelect || !priceInput || !feeInput || !amountInput) {
            console.error('أحد العناصر المطلوبة غير موجود');
            return;
        }

        // الحصول على السعر ورسوم التحويل
        const price = parseFloat(priceInput.value || 0);
        const fee = parseFloat(feeInput.value || 0);

        // حساب المبلغ الإجمالي
        const amount = price + fee;

        // تحديث حقل المبلغ الإجمالي
        amountInput.value = price > 0 ? amount.toFixed(2) : '';

        console.log('تم تحديث المبلغ الإجمالي بنجاح');
    } catch (error) {
        console.error('حدث خطأ أثناء تحديث المبلغ الإجمالي:', error);
    }
}

/**
 * دالة الحصول على وصف الخدمة
 * @param {string} serviceName - اسم الخدمة
 * @returns {string} - وصف الخدمة
 */
function getServiceDescription(serviceName) {
    // قاموس أوصاف الخدمات
    const descriptions = {
        'زياده متابعين': 'خدمة زيادة المتابعين على منصات التواصل الاجتماعي بطريقة آمنة وموثوقة.',
        'شراء رقم دائم': 'الحصول على رقم هاتف دائم يمكن استخدامه للتحقق من الحسابات والخدمات المختلفة.',
        'سحب حساب': 'استعادة السيطرة على الحسابات المخترقة أو المفقودة بطرق آمنة ومضمونة.',
        'اسكريبت قفل حساب واتس': 'أداة متقدمة لتأمين حساب الواتساب ضد محاولات الاختراق.',
        'تطبيق اختراق الهاتف': 'تطبيق متخصص لاختبار أمان الهواتف الذكية وكشف الثغرات الأمنية.',
        'اسكريبت تلغيم': 'أداة متقدمة لإنشاء ملفات مخصصة لاختبار الأمان.',
        'استرجاع حساب او رقم': 'خدمة استعادة الحسابات أو أرقام الهواتف المفقودة أو المسروقة.',
        'Facebook fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات فيسبوك.',
        'Instagram fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات انستغرام.',
        'WhatsApp fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات واتساب.',
        'Telegram fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات تيليجرام.',
        'Twitter fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات تويتر.',
        'Snapchat fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات سناب شات.',
        'VK fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات VK.',
        'PUBG fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات ببجي.',
        'TikTok fishing.py': 'سكريبت بايثون متخصص لاختبار أمان حسابات تيك توك.',
    };

    // إرجاع وصف الخدمة إذا كان موجودًا، وإلا إرجاع وصف افتراضي
    return descriptions[serviceName] || 'خدمة متخصصة في مجال الأمن السيبراني والحماية الرقمية.';
}

// تحديث السعر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث السعر إذا كانت هناك خدمة مختارة بالفعل
    updatePrice();
});
