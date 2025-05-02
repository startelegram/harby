/**
 * نظام إشعارات المشرفين
 * يوفر وظائف لعرض وإدارة إشعارات المشرفين
 */

/**
 * تحديث قائمة إشعارات المشرفين في واجهة المستخدم
 */
function updateAdminNotificationsList() {
    // التحقق من وجود نظام العضويات
    if (typeof membershipSystem === 'undefined' || !membershipSystem.isAdminUser()) {
        console.error('نظام العضويات غير متاح أو المستخدم ليس مشرفًا');
        return;
    }

    // الحصول على إشعارات المشرفين
    const adminNotifications = membershipSystem.getAdminNotifications();
    
    // عدد الإشعارات غير المقروءة
    const unreadCount = adminNotifications.filter(notification => !notification.read).length;
    
    // تحديث عداد الإشعارات غير المقروءة
    updateAdminNotificationCounter(unreadCount);
    
    // تحديث قائمة الإشعارات في لوحة المشرف
    updateAdminNotificationsPanel(adminNotifications);
    
    // إظهار إشعار للمشرف إذا كان هناك إشعارات غير مقروءة
    if (unreadCount > 0) {
        showToast(`لديك ${unreadCount} إشعار جديد`, 'info');
    }
}

/**
 * تحديث عداد الإشعارات غير المقروءة
 * @param {number} count - عدد الإشعارات غير المقروءة
 */
function updateAdminNotificationCounter(count) {
    const notificationCounter = document.getElementById('admin-notification-counter');
    if (notificationCounter) {
        if (count > 0) {
            notificationCounter.textContent = count;
            notificationCounter.style.display = 'inline-block';
        } else {
            notificationCounter.style.display = 'none';
        }
    }
}

/**
 * تحديث قائمة الإشعارات في لوحة المشرف
 * @param {Array} notifications - قائمة الإشعارات
 */
function updateAdminNotificationsPanel(notifications) {
    const notificationsPanel = document.getElementById('admin-notifications-panel');
    if (!notificationsPanel) {
        console.error('عنصر admin-notifications-panel غير موجود');
        return;
    }
    
    // تفريغ اللوحة
    notificationsPanel.innerHTML = '';
    
    // إذا لم تكن هناك إشعارات
    if (notifications.length === 0) {
        notificationsPanel.innerHTML = '<div class="alert alert-info">لا توجد إشعارات</div>';
        return;
    }
    
    // إنشاء قائمة الإشعارات
    const notificationsList = document.createElement('div');
    notificationsList.className = 'list-group';
    
    // ترتيب الإشعارات بحسب التاريخ (الأحدث أولاً)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // إضافة الإشعارات إلى القائمة
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `list-group-item ${notification.read ? '' : 'unread'}`;
        notificationItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-1">${notification.title}</h6>
                <small>${formatDate(notification.timestamp)}</small>
            </div>
            <p class="mb-1">${notification.message}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-${getNotificationTypeClass(notification.type)}">${getNotificationTypeText(notification.type)}</small>
                ${notification.read ? '' : `
                <button class="btn btn-sm btn-outline-primary" onclick="markAdminNotificationAsRead('${notification.id}')">
                    <i class="fas fa-check"></i> تعليم كمقروء
                </button>
                `}
            </div>
        `;
        notificationsList.appendChild(notificationItem);
    });
    
    // إضافة القائمة إلى اللوحة
    notificationsPanel.appendChild(notificationsList);
}

/**
 * تنسيق التاريخ بشكل مناسب
 * @param {string} dateString - التاريخ بصيغة ISO
 * @returns {string} - التاريخ المنسق
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
        return 'منذ لحظات';
    } else if (diffMin < 60) {
        return `منذ ${diffMin} دقيقة`;
    } else if (diffHour < 24) {
        return `منذ ${diffHour} ساعة`;
    } else if (diffDay < 30) {
        return `منذ ${diffDay} يوم`;
    } else {
        return date.toLocaleDateString('ar-EG');
    }
}

/**
 * الحصول على صنف CSS لنوع الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - صنف CSS
 */
function getNotificationTypeClass(type) {
    switch (type) {
        case 'success':
            return 'success';
        case 'info':
            return 'info';
        case 'warning':
            return 'warning';
        case 'error':
            return 'danger';
        default:
            return 'secondary';
    }
}

/**
 * الحصول على نص نوع الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - نص نوع الإشعار
 */
function getNotificationTypeText(type) {
    switch (type) {
        case 'success':
            return 'نجاح';
        case 'info':
            return 'معلومات';
        case 'warning':
            return 'تحذير';
        case 'error':
            return 'خطأ';
        default:
            return 'إشعار';
    }
}

/**
 * تعليم إشعار المشرفين كمقروء
 * @param {string} notificationId - معرف الإشعار
 */
function markAdminNotificationAsRead(notificationId) {
    // التحقق من وجود نظام العضويات
    if (typeof membershipSystem === 'undefined' || !membershipSystem.isAdminUser()) {
        console.error('نظام العضويات غير متاح أو المستخدم ليس مشرفًا');
        return;
    }
    
    // تعليم الإشعار كمقروء
    const result = membershipSystem.markAdminNotificationAsRead(notificationId);
    
    // تحديث قائمة الإشعارات
    if (result) {
        updateAdminNotificationsList();
    }
}

// تحديث قائمة إشعارات المشرفين عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من وجود نظام العضويات
    if (typeof membershipSystem !== 'undefined' && membershipSystem.isAdminUser()) {
        // تحديث قائمة الإشعارات
        updateAdminNotificationsList();
        
        // تحديث قائمة الإشعارات كل دقيقة
        setInterval(updateAdminNotificationsList, 60000);
    }
});
