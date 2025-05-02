/**
 * نظام الدفع بالعملات المشفرة
 * يتيح للمستخدمين الدفع باستخدام العملات المشفرة المختلفة مثل Bitcoin و Ethereum و Monero
 */

// تعريف كائن لتخزين معلومات العملات المشفرة المدعومة
const cryptoCurrencies = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: 'fab fa-bitcoin', rate: 0.000025, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'fab fa-ethereum', rate: 0.00035, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
    { id: 'xmr', name: 'Monero', symbol: 'XMR', icon: 'fas fa-coins', rate: 0.0055, address: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: 'fas fa-dollar-sign', rate: 1.0, address: 'TKrV3XpvGJBnrQQMUyDH5qJmiJBnV1S8JN' },
    { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', icon: 'fas fa-coins', rate: 0.0025, address: 'bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23' }
];

// متغير لتخزين حالة الدفع
let paymentStatus = 'pending'; // pending, processing, completed, failed

/**
 * تهيئة نظام الدفع بالعملات المشفرة
 */
function initializeCryptoPayment() {
    console.log('تهيئة نظام الدفع بالعملات المشفرة');

    // إضافة مستمع حدث لزر الدفع بالعملات المشفرة
    const payWithCryptoBtn = document.getElementById('pay-with-crypto-btn');
    if (payWithCryptoBtn) {
        payWithCryptoBtn.addEventListener('click', openCryptoPaymentModal);
    }

    // إضافة مستمع حدث لتغيير العملة المشفرة
    const cryptoCurrencySelect = document.getElementById('crypto-currency');
    if (cryptoCurrencySelect) {
        cryptoCurrencySelect.addEventListener('change', updateCryptoAmount);
    }

    // إضافة مستمع حدث لتغيير المبلغ
    const paymentAmountInput = document.getElementById('payment-amount');
    if (paymentAmountInput) {
        paymentAmountInput.addEventListener('input', updateCryptoAmount);
    }

    // إضافة مستمع حدث لزر تأكيد الدفع
    const confirmCryptoPaymentBtn = document.getElementById('confirm-crypto-payment');
    if (confirmCryptoPaymentBtn) {
        confirmCryptoPaymentBtn.addEventListener('click', confirmPayment);
    }

    // ملء قائمة العملات المشفرة
    populateCryptoCurrencies();
}

/**
 * ملء قائمة العملات المشفرة
 */
function populateCryptoCurrencies() {
    const cryptoCurrencySelect = document.getElementById('crypto-currency');
    if (!cryptoCurrencySelect) return;

    // مسح القائمة الحالية
    cryptoCurrencySelect.innerHTML = '';

    // إضافة العملات المشفرة المدعومة
    cryptoCurrencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.id;
        option.textContent = `${currency.name} (${currency.symbol})`;
        cryptoCurrencySelect.appendChild(option);
    });

    // تحديث المبلغ بالعملة المشفرة
    updateCryptoAmount();
}

/**
 * فتح نافذة الدفع بالعملات المشفرة
 */
function openCryptoPaymentModal() {
    console.log('فتح نافذة الدفع بالعملات المشفرة');

    try {
        // التحقق من وجود مستخدم مسجل الدخول
        if (typeof membershipSystem !== 'undefined' && typeof membershipSystem.isLoggedIn === 'function') {
            if (!membershipSystem.isLoggedIn()) {
                showNotification('يجب تسجيل الدخول أولاً لاستخدام ميزة الدفع بالعملات المشفرة', 'warning');
                return;
            }
        }

        // إعادة تعيين حالة الدفع
        paymentStatus = 'pending';

        // تحديث واجهة المستخدم
        const cryptoPaymentStatus = document.getElementById('crypto-payment-status');
        if (cryptoPaymentStatus) {
            cryptoPaymentStatus.textContent = 'في انتظار الدفع...';
            cryptoPaymentStatus.className = 'text-warning';
        }

        const cryptoPaymentResult = document.getElementById('crypto-payment-result');
        if (cryptoPaymentResult) {
            cryptoPaymentResult.innerHTML = '';
        }

        // تحديث المبلغ بالعملة المشفرة
        updateCryptoAmount();

        // إنشاء رمز QR
        generateQRCode();

        // فتح النافذة
        const modal = new bootstrap.Modal(document.getElementById('crypto-payment-modal'));
        modal.show();
    } catch (error) {
        console.error('حدث خطأ أثناء فتح نافذة الدفع بالعملات المشفرة:', error);
        showNotification('حدث خطأ أثناء فتح نافذة الدفع بالعملات المشفرة', 'error');
    }
}

/**
 * تحديث المبلغ بالعملة المشفرة
 */
function updateCryptoAmount() {
    console.log('تحديث المبلغ بالعملة المشفرة');

    try {
        const cryptoCurrencySelect = document.querySelector('.crypto-currency-item.active');
        const paymentAmountInput = document.getElementById('payment-amount');
        const cryptoAmountInput = document.getElementById('crypto-amount');
        const cryptoCurrencyIcon = document.getElementById('crypto-currency-icon');
        const walletAddressInput = document.getElementById('wallet-address');

        if (!cryptoCurrencySelect || !paymentAmountInput || !cryptoAmountInput || !cryptoCurrencyIcon || !walletAddressInput) {
            console.error('لم يتم العثور على أحد العناصر المطلوبة');
            return;
        }

        // الحصول على العملة المشفرة المحددة
        const selectedCurrencyId = cryptoCurrencySelect.getAttribute('data-currency');
        const selectedCurrency = cryptoCurrencies.find(currency => currency.id === selectedCurrencyId);

        if (!selectedCurrency) {
            console.error('لم يتم العثور على العملة المشفرة المحددة');
            return;
        }

        // الحصول على المبلغ بالدولار
        const usdAmount = parseFloat(paymentAmountInput.value) || 0;

        // حساب المبلغ بالعملة المشفرة
        const cryptoAmount = usdAmount * selectedCurrency.rate;

        // تحديث المبلغ بالعملة المشفرة
        cryptoAmountInput.value = cryptoAmount.toFixed(8);

        // تحديث أيقونة العملة المشفرة
        cryptoCurrencyIcon.className = selectedCurrency.icon;

        // تحديث عنوان المحفظة
        walletAddressInput.value = selectedCurrency.address;

        // تحديث رمز QR
        generateQRCode();
    } catch (error) {
        console.error('حدث خطأ أثناء تحديث المبلغ بالعملة المشفرة:', error);
    }
}

/**
 * إنشاء رمز QR
 */
function generateQRCode() {
    console.log('إنشاء رمز QR');

    try {
        const cryptoCurrencySelect = document.querySelector('.crypto-currency-item.active');
        const cryptoAmountInput = document.getElementById('crypto-amount');
        const qrCodeContainer = document.getElementById('qr-code');

        if (!cryptoCurrencySelect || !cryptoAmountInput || !qrCodeContainer) {
            console.error('لم يتم العثور على أحد العناصر المطلوبة');
            return;
        }

        // الحصول على العملة المشفرة المحددة
        const selectedCurrencyId = cryptoCurrencySelect.getAttribute('data-currency');
        const selectedCurrency = cryptoCurrencies.find(currency => currency.id === selectedCurrencyId);

        if (!selectedCurrency) {
            console.error('لم يتم العثور على العملة المشفرة المحددة');
            return;
        }

        // الحصول على المبلغ بالعملة المشفرة
        const cryptoAmount = parseFloat(cryptoAmountInput.value) || 0;

        // إنشاء رابط الدفع
        const paymentLink = `${selectedCurrency.id}:${selectedCurrency.address}?amount=${cryptoAmount}`;

        // إنشاء رمز QR
        qrCodeContainer.innerHTML = '';

        // في التطبيق الحقيقي، سيتم استخدام مكتبة لإنشاء رمز QR
        // هنا نستخدم صورة وهمية لرمز QR
        const qrImage = document.createElement('img');
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentLink)}`;
        qrImage.alt = 'رمز QR للدفع';
        qrImage.style.maxWidth = '100%';
        qrCodeContainer.appendChild(qrImage);
    } catch (error) {
        console.error('حدث خطأ أثناء إنشاء رمز QR:', error);
    }
}

/**
 * تأكيد الدفع
 */
function confirmPayment() {
    console.log('تأكيد الدفع');

    try {
        // تحديث حالة الدفع
        paymentStatus = 'processing';

        // تحديث واجهة المستخدم
        const cryptoPaymentStatus = document.getElementById('crypto-payment-status');
        if (cryptoPaymentStatus) {
            cryptoPaymentStatus.textContent = 'جاري التحقق من الدفع...';
            cryptoPaymentStatus.className = 'text-info';
        }

        const confirmCryptoPaymentBtn = document.getElementById('confirm-crypto-payment');
        if (confirmCryptoPaymentBtn) {
            confirmCryptoPaymentBtn.disabled = true;
        }

        // محاكاة عملية التحقق من الدفع
        setTimeout(() => {
            // تحديث حالة الدفع
            paymentStatus = 'completed';

            // تحديث واجهة المستخدم
            if (cryptoPaymentStatus) {
                cryptoPaymentStatus.textContent = 'تم تأكيد الدفع بنجاح!';
                cryptoPaymentStatus.className = 'text-success';
            }

            if (confirmCryptoPaymentBtn) {
                confirmCryptoPaymentBtn.disabled = false;
            }

            const cryptoPaymentResult = document.getElementById('crypto-payment-result');
            if (cryptoPaymentResult) {
                cryptoPaymentResult.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i> تم تأكيد الدفع بنجاح! سيتم تفعيل الخدمة خلال دقائق.
                    </div>
                `;
            }

            // إظهار إشعار نجاح
            showNotification('تم تأكيد الدفع بنجاح!', 'success');

            // إغلاق النافذة بعد فترة
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('crypto-payment-modal'));
                if (modal) {
                    modal.hide();
                }
            }, 3000);
        }, 2000);
    } catch (error) {
        console.error('حدث خطأ أثناء تأكيد الدفع:', error);
        showNotification('حدث خطأ أثناء تأكيد الدفع', 'error');
    }
}

/**
 * عرض إشعار
 * @param {string} message - رسالة الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    console.log(`إشعار (${type}): ${message}`);

    // استخدام دالة showToast من crypto-payment-init.js إذا كانت متاحة
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }

    // استخدام نظام الإشعارات الموجود إذا كان متاحًا
    if (typeof showMessage === 'function') {
        showMessage(message, type);
    } else if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        // إنشاء إشعار بسيط
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.innerHTML = `<i class="fas fa-info-circle me-2"></i> ${message}`;

        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);

        // إزالة الإشعار بعد فترة
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

/**
 * اختيار العملة المشفرة
 * @param {HTMLElement} element - عنصر العملة المشفرة
 * @param {string} currencyId - معرف العملة المشفرة
 */
function selectCryptoCurrency(element, currencyId) {
    // إزالة الفئة النشطة من جميع العناصر
    const currencyItems = document.querySelectorAll('.crypto-currency-item');
    currencyItems.forEach(item => {
        item.classList.remove('active');
    });

    // إضافة الفئة النشطة للعنصر المحدد
    element.classList.add('active');

    // تحديث المبلغ بالعملة المشفرة
    updateCryptoAmount();
}

// تهيئة نظام الدفع بالعملات المشفرة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeCryptoPayment();
});
