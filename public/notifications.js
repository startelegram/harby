/**
 * إضافة إشعار للمستخدم
 * @param {Object} notification - بيانات الإشعار
 */
function addNotification(notification) {
    console.log('إضافة إشعار جديد:', notification);
    if (typeof membershipSystem !== 'undefined') {
        membershipSystem.addUserNotification(
            notification.userId,
            'إشعار جديد',
            notification.message,
            notification.type
        );
        console.log('تم إضافة الإشعار بنجاح للمستخدم:', notification.userId);
    } else {
        console.error('نظام العضوية غير متاح لإضافة الإشعار');
    }
}

/**
 * تحديث عدد الإشعارات غير المقروءة
 */
function updateNotificationsCount() {
    if (typeof membershipSystem !== 'undefined' && membershipSystem.isLoggedIn()) {
        const currentUser = membershipSystem.getCurrentUser();
        if (currentUser && currentUser.id) {
            const notifications = membershipSystem.getUserNotifications(currentUser.id);
            const unreadCount = notifications.filter(notification => !notification.read).length;
            
            // تحديث عدد الإشعارات في واجهة المستخدم
            const notificationBadge = document.getElementById('notifications-badge');
            if (notificationBadge) {
                if (unreadCount > 0) {
                    notificationBadge.textContent = unreadCount;
                    notificationBadge.style.display = 'inline-block';
                } else {
                    notificationBadge.style.display = 'none';
                }
            }
        }
    }
}

// تحديث عدد الإشعارات كل 30 ثانية
setInterval(updateNotificationsCount, 30000);

// تحديث عدد الإشعارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateNotificationsCount);
