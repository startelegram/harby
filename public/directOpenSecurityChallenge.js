/**
 * دالة لفتح نافذة اختبار الأمن السيبراني مباشرة بدون التحقق من تسجيل الدخول
 * هذه الدالة تتجاوز التحقق من تسجيل الدخول وتفتح نافذة الاختبار مباشرة
 */
function directOpenSecurityChallenge() {
    try {
        // عرض نافذة الاختبار مباشرة بدون التحقق من تسجيل الدخول
        const securityChallengeModal = document.getElementById('security-challenge-modal');
        if (securityChallengeModal) {
            // تطبيق الأنماط المحسنة قبل فتح النافذة
            applySecurityChallengeStyles(securityChallengeModal);

            const bsModal = new bootstrap.Modal(securityChallengeModal);
            bsModal.show();
            console.log("تم فتح نافذة اختبار الأمن السيبراني مباشرة بنجاح");

            // إعادة تعيين واجهة الاختبار
            const challengeContainer = document.getElementById('challenge-container');
            const challengeResult = document.getElementById('challenge-result');
            const startScreen = document.getElementById('challenge-start-screen');
            const questionsScreen = document.getElementById('challenge-questions-screen');

            if (challengeContainer) challengeContainer.style.display = 'block';
            if (challengeResult) challengeResult.style.display = 'none';
            if (startScreen) startScreen.style.display = 'block';
            if (questionsScreen) questionsScreen.style.display = 'none';
        } else {
            console.error("لم يتم العثور على عنصر security-challenge-modal");
            showToast('حدث خطأ أثناء محاولة فتح نافذة اختبار الأمن السيبراني', 'error');
        }
    } catch (error) {
        console.error("حدث خطأ أثناء فتح نافذة اختبار الأمن السيبراني:", error);
        showToast('حدث خطأ أثناء محاولة فتح نافذة اختبار الأمن السيبراني', 'error');
    }
}

/**
 * دالة تطبيق الأنماط المحسنة على واجهة اختبار الأمن السيبراني
 * @param {HTMLElement} modalElement - عنصر النافذة المنبثقة
 */
function applySecurityChallengeStyles(modalElement) {
    try {
        if (!modalElement) return;

        // تطبيق الأنماط على النافذة المنبثقة
        modalElement.classList.add('security-challenge-modal');

        // تحسين محتوى النافذة
        const modalContent = modalElement.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.background = 'var(--secondary-color)';
            modalContent.style.border = '1px solid #2a2a3e';
            modalContent.style.borderRadius = '12px';
            modalContent.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 150, 0.1)';
            modalContent.style.color = 'var(--text-color)';
        }

        // تحسين رأس النافذة
        const modalHeader = modalElement.querySelector('.modal-header');
        if (modalHeader) {
            modalHeader.style.borderBottom = '1px solid #2a2a3e';
            modalHeader.style.padding = '15px 20px';
            modalHeader.style.background = 'linear-gradient(to right, #1a1a2e, #2a2a3e)';
        }

        // تحسين عنوان النافذة
        const modalTitle = modalElement.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.style.color = 'var(--primary-color)';
            modalTitle.style.fontWeight = '600';
        }

        // تحسين جسم النافذة
        const modalBody = modalElement.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.padding = '20px';
            modalBody.style.background = 'var(--secondary-color)';
        }

        // تحسين تذييل النافذة
        const modalFooter = modalElement.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.style.borderTop = '1px solid #2a2a3e';
            modalFooter.style.padding = '15px 20px';
            modalFooter.style.background = 'linear-gradient(to right, #1a1a2e, #2a2a3e)';
        }

        // تحسين شاشة البداية
        const startScreen = modalElement.querySelector('#challenge-start-screen');
        if (startScreen) {
            startScreen.classList.add('challenge-start-screen');

            // تحسين العنوان
            const title = startScreen.querySelector('h4');
            if (title) {
                title.classList.add('challenge-start-title');
                title.style.color = 'var(--primary-color)';
                title.style.fontSize = '1.8rem';
                title.style.fontWeight = '700';
                title.style.marginBottom = '15px';
                title.style.textShadow = '0 0 10px rgba(0, 255, 150, 0.3)';
            }

            // تحسين الوصف
            const description = startScreen.querySelector('p');
            if (description) {
                description.classList.add('challenge-start-description');
                description.style.color = 'var(--text-color)';
                description.style.fontSize = '1rem';
                description.style.lineHeight = '1.6';
                description.style.marginBottom = '25px';
            }

            // تحسين زر البدء
            const startButton = startScreen.querySelector('button');
            if (startButton) {
                startButton.classList.add('challenge-start-button');
                startButton.style.background = 'linear-gradient(135deg, #00ff99, #00cc7a)';
                startButton.style.color = '#000';
                startButton.style.fontWeight = '600';
                startButton.style.border = 'none';
                startButton.style.borderRadius = '8px';
                startButton.style.padding = '12px 30px';
                startButton.style.fontSize = '1.1rem';
            }
        }

        // تحسين الأزرار الأخرى
        const buttons = modalElement.querySelectorAll('button:not(.btn-close):not(.challenge-start-button)');
        buttons.forEach(button => {
            button.style.background = 'linear-gradient(135deg, #00ff99, #00cc7a)';
            button.style.color = '#000';
            button.style.fontWeight = '600';
            button.style.border = 'none';
            button.style.borderRadius = '6px';
            button.style.padding = '10px 20px';
            button.style.transition = 'all 0.3s ease';
        });

        console.log('تم تطبيق الأنماط المحسنة على واجهة اختبار الأمن السيبراني');
    } catch (error) {
        console.error('حدث خطأ أثناء تطبيق الأنماط المحسنة:', error);
    }
}
