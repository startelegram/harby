/**
 * نظام الإشعارات المخصص
 * يوفر واجهة موحدة لعرض الإشعارات في الموقع بطريقة متناسقة
 */

// كائن لإدارة الإشعارات
const customNotifications = {
    // حاوية الإشعارات
    container: null,
    
    // تهيئة نظام الإشعارات
    initialize: function() {
        // إنشاء حاوية الإشعارات إذا لم تكن موجودة
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'custom-notifications-container';
            document.body.appendChild(this.container);
            
            // إضافة الأنماط CSS
            this.addStyles();
        }
    },
    
    // إضافة الأنماط CSS
    addStyles: function() {
        if (!document.getElementById('custom-notifications-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-notifications-styles';
            style.textContent = `
                .custom-notifications-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    max-width: 350px;
                    max-height: 80vh;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column-reverse;
                    gap: 10px;
                }
                
                .custom-notification {
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    color: #fff;
                    font-size: 14px;
                    display: flex;
                    align-items: flex-start;
                    opacity: 0;
                    transform: translateX(50px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .custom-notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .custom-notification-icon {
                    margin-right: 12px;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .custom-notification-content {
                    flex: 1;
                }
                
                .custom-notification-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .custom-notification-close {
                    cursor: pointer;
                    font-size: 16px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                    margin-left: 10px;
                }
                
                .custom-notification-close:hover {
                    opacity: 1;
                }
                
                .custom-notification-message {
                    line-height: 1.4;
                }
                
                .custom-notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.3);
                }
                
                .custom-notification-progress-bar {
                    height: 100%;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.7);
                    transform-origin: left;
                }
                
                .custom-notification.success {
                    background-color: rgba(25, 135, 84, 0.9);
                }
                
                .custom-notification.error {
                    background-color: rgba(220, 53, 69, 0.9);
                }
                
                .custom-notification.warning {
                    background-color: rgba(255, 193, 7, 0.9);
                    color: #212529;
                }
                
                .custom-notification.info {
                    background-color: rgba(13, 110, 253, 0.9);
                }
                
                @media (max-width: 576px) {
                    .custom-notifications-container {
                        right: 10px;
                        left: 10px;
                        max-width: calc(100% - 20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // عرض إشعار جديد
    show: function(options) {
        // التأكد من تهيئة النظام
        this.initialize();
        
        // الإعدادات الافتراضية
        const defaults = {
            title: 'إشعار',
            message: '',
            type: 'info', // success, error, warning, info
            duration: 5000, // بالمللي ثانية
            closable: true,
            icon: null
        };
        
        // دمج الإعدادات
        const settings = Object.assign({}, defaults, options);
        
        // تحديد الأيقونة المناسبة
        if (!settings.icon) {
            switch (settings.type) {
                case 'success':
                    settings.icon = 'fas fa-check-circle';
                    break;
                case 'error':
                    settings.icon = 'fas fa-exclamation-circle';
                    break;
                case 'warning':
                    settings.icon = 'fas fa-exclamation-triangle';
                    break;
                case 'info':
                default:
                    settings.icon = 'fas fa-info-circle';
                    break;
            }
        }
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `custom-notification ${settings.type}`;
        
        // إنشاء محتوى الإشعار
        notification.innerHTML = `
            <div class="custom-notification-icon">
                <i class="${settings.icon}"></i>
            </div>
            <div class="custom-notification-content">
                <div class="custom-notification-title">
                    ${settings.title}
                    ${settings.closable ? '<span class="custom-notification-close"><i class="fas fa-times"></i></span>' : ''}
                </div>
                <div class="custom-notification-message">${settings.message}</div>
            </div>
            <div class="custom-notification-progress">
                <div class="custom-notification-progress-bar"></div>
            </div>
        `;
        
        // إضافة الإشعار إلى الحاوية
        this.container.appendChild(notification);
        
        // إظهار الإشعار بتأثير انتقالي
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // إضافة مستمع لزر الإغلاق
        if (settings.closable) {
            const closeButton = notification.querySelector('.custom-notification-close');
            closeButton.addEventListener('click', () => {
                this.close(notification);
            });
        }
        
        // تحريك شريط التقدم
        const progressBar = notification.querySelector('.custom-notification-progress-bar');
        progressBar.style.transition = `transform ${settings.duration / 1000}s linear`;
        progressBar.style.transform = 'scaleX(0)';
        
        // إغلاق الإشعار تلقائيًا بعد المدة المحددة
        if (settings.duration > 0) {
            setTimeout(() => {
                this.close(notification);
            }, settings.duration);
        }
        
        // إرجاع عنصر الإشعار
        return notification;
    },
    
    // إغلاق إشعار
    close: function(notification) {
        if (!notification) return;
        
        // إخفاء الإشعار بتأثير انتقالي
        notification.classList.remove('show');
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        // إزالة الإشعار من الحاوية بعد انتهاء التأثير
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    // إغلاق جميع الإشعارات
    closeAll: function() {
        const notifications = this.container.querySelectorAll('.custom-notification');
        notifications.forEach(notification => {
            this.close(notification);
        });
    }
};

/**
 * عرض إشعار للمستخدم
 * @param {string} message - نص الرسالة
 * @param {string} type - نوع الرسالة (success, error, warning, info)
 * @param {Object} options - خيارات إضافية
 */
function showCustomNotification(message, type = 'info', options = {}) {
    return customNotifications.show({
        message: message,
        type: type,
        ...options
    });
}

// تهيئة نظام الإشعارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    customNotifications.initialize();
});

// استبدال دالة showMessage الأصلية بالدالة الجديدة
if (typeof window.showMessage !== 'undefined') {
    const originalShowMessage = window.showMessage;
    window.showMessage = function(message, type) {
        // استدعاء الدالة الجديدة
        showCustomNotification(message, type);
        
        // استدعاء الدالة الأصلية للحفاظ على التوافق
        // originalShowMessage(message, type);
    };
}

// استبدال دالة showNotification الأصلية بالدالة الجديدة
if (typeof window.showNotification !== 'undefined') {
    const originalShowNotification = window.showNotification;
    window.showNotification = function(message, type) {
        // استدعاء الدالة الجديدة
        showCustomNotification(message, type);
        
        // استدعاء الدالة الأصلية للحفاظ على التوافق
        // originalShowNotification(message, type);
    };
}
