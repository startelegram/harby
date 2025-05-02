/**
 * نظام إدارة الجلسات
 * يمنع مشاركة الحسابات بين المستخدمين من خلال تقييد الجلسات المتزامنة
 */

class SessionManager {
    constructor() {
        // تهيئة مدير الجلسات
        this.activeSessions = this.loadActiveSessions();
        this.sessionTimeout = 30 * 60 * 1000; // 30 دقيقة بالمللي ثانية
    }

    /**
     * تحميل الجلسات النشطة من التخزين المحلي
     * @returns {Object} - قائمة الجلسات النشطة
     */
    loadActiveSessions() {
        const sessionsData = localStorage.getItem('greenhat_active_sessions');
        return sessionsData ? JSON.parse(sessionsData) : {};
    }

    /**
     * حفظ الجلسات النشطة في التخزين المحلي
     */
    saveActiveSessions() {
        localStorage.setItem('greenhat_active_sessions', JSON.stringify(this.activeSessions));
    }

    /**
     * إنشاء معرف جلسة فريد
     * @returns {string} - معرف الجلسة
     */
    generateSessionId() {
        return Date.now().toString() + Math.random().toString(36).substring(2, 15);
    }

    /**
     * الحصول على معلومات الجهاز
     * @returns {Object} - معلومات الجهاز
     */
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    /**
     * إنشاء جلسة جديدة للمستخدم
     * @param {string} userId - معرف المستخدم
     * @returns {Object} - معلومات الجلسة ونتيجة العملية
     */
    createSession(userId) {
        // التحقق من وجود جلسة نشطة للمستخدم
        const existingSession = this.activeSessions[userId];

        if (existingSession) {
            // التحقق مما إذا كانت الجلسة لا تزال صالحة
            const isSessionValid = Date.now() - existingSession.lastActive < this.sessionTimeout;

            if (isSessionValid) {
                // هناك جلسة نشطة بالفعل
                // إنهاء الجلسة السابقة
                this.endSession(userId);

                return {
                    success: true,
                    message: 'تم إنهاء الجلسة السابقة وإنشاء جلسة جديدة',
                    sessionEnded: true
                };
            }
        }

        // إنشاء جلسة جديدة
        const sessionId = this.generateSessionId();
        const deviceInfo = this.getDeviceInfo();

        this.activeSessions[userId] = {
            sessionId: sessionId,
            deviceInfo: deviceInfo,
            startTime: Date.now(),
            lastActive: Date.now()
        };

        this.saveActiveSessions();

        return {
            success: true,
            message: 'تم إنشاء جلسة جديدة',
            sessionId: sessionId,
            sessionEnded: false
        };
    }

    /**
     * تحديث وقت النشاط الأخير للجلسة
     * @param {string} userId - معرف المستخدم
     * @returns {boolean} - هل تم تحديث الجلسة بنجاح
     */
    updateSession(userId) {
        if (!this.activeSessions[userId]) {
            return false;
        }

        this.activeSessions[userId].lastActive = Date.now();
        this.saveActiveSessions();

        return true;
    }

    /**
     * إنهاء جلسة المستخدم
     * @param {string} userId - معرف المستخدم
     * @returns {boolean} - هل تم إنهاء الجلسة بنجاح
     */
    endSession(userId) {
        if (!this.activeSessions[userId]) {
            return false;
        }

        delete this.activeSessions[userId];
        this.saveActiveSessions();

        return true;
    }

    /**
     * التحقق من صلاحية جلسة المستخدم
     * @param {string} userId - معرف المستخدم
     * @param {string} sessionId - معرف الجلسة
     * @returns {boolean} - هل الجلسة صالحة
     */
    isValidSession(userId, sessionId) {
        if (!this.activeSessions[userId]) {
            return false;
        }

        const session = this.activeSessions[userId];

        // التحقق من تطابق معرف الجلسة
        if (session.sessionId !== sessionId) {
            return false;
        }

        // التحقق من وقت النشاط الأخير
        const isSessionExpired = Date.now() - session.lastActive > this.sessionTimeout;

        if (isSessionExpired) {
            // إنهاء الجلسة إذا كانت منتهية الصلاحية
            this.endSession(userId);
            return false;
        }

        // تحديث وقت النشاط الأخير
        this.updateSession(userId);

        return true;
    }

    /**
     * تنظيف الجلسات منتهية الصلاحية
     */
    cleanupExpiredSessions() {
        const now = Date.now();
        let hasChanges = false;

        for (const userId in this.activeSessions) {
            const session = this.activeSessions[userId];

            if (now - session.lastActive > this.sessionTimeout) {
                delete this.activeSessions[userId];
                hasChanges = true;
            }
        }

        if (hasChanges) {
            this.saveActiveSessions();
        }
    }
}

// إنشاء كائن من مدير الجلسات
const sessionManager = new SessionManager();

// تنظيف الجلسات منتهية الصلاحية كل 5 دقائق
setInterval(() => {
    sessionManager.cleanupExpiredSessions();
}, 5 * 60 * 1000);

// إضافة مستمع حدث لتحديث الجلسة عند تفاعل المستخدم
document.addEventListener('click', () => {
    try {
        if (typeof membershipSystem !== 'undefined' && typeof membershipSystem.isLoggedIn === 'function' && membershipSystem.isLoggedIn()) {
            const currentUser = membershipSystem.getCurrentUser();
            if (currentUser && currentUser.id) {
                sessionManager.updateSession(currentUser.id);
            }
        }
    } catch (error) {
        // خطأ في تحديث الجلسة عند النقر
    }
});

// إضافة مستمع حدث لتحديث الجلسة كل دقيقة
setInterval(() => {
    try {
        if (typeof membershipSystem !== 'undefined' && typeof membershipSystem.isLoggedIn === 'function' && membershipSystem.isLoggedIn()) {
            const currentUser = membershipSystem.getCurrentUser();
            if (currentUser && currentUser.id) {
                sessionManager.updateSession(currentUser.id);
            }
        }
    } catch (error) {
        // خطأ في تحديث الجلسة الدوري
    }
}, 60 * 1000);
