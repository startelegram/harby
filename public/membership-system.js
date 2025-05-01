/**
 * نظام العضويات
 * يتيح للمستخدمين التسجيل وتسجيل الدخول وإدارة حساباتهم
 */

class MembershipSystem {
    constructor() {
        // تهيئة نظام العضويات
        this.users = this.loadUsers();
        this.pendingRegistrations = this.loadPendingRegistrations();
        this.currentUser = null;
        this.isAdmin = false;
    }

    /**
     * تحميل بيانات المستخدمين من التخزين المحلي
     * @returns {Array} - قائمة المستخدمين
     */
    loadUsers() {
        const usersData = localStorage.getItem('greenhat_users');
        return usersData ? JSON.parse(usersData) : [];
    }

    /**
     * تحميل طلبات التسجيل المعلقة من التخزين المحلي
     * @returns {Array} - قائمة طلبات التسجيل المعلقة
     */
    loadPendingRegistrations() {
        const pendingData = localStorage.getItem('greenhat_pending_registrations');
        return pendingData ? JSON.parse(pendingData) : [];
    }

    /**
     * حفظ بيانات المستخدمين في التخزين المحلي
     */
    saveUsers() {
        localStorage.setItem('greenhat_users', JSON.stringify(this.users));
    }

    /**
     * حفظ طلبات التسجيل المعلقة في التخزين المحلي
     */
    savePendingRegistrations() {
        localStorage.setItem('greenhat_pending_registrations', JSON.stringify(this.pendingRegistrations));
    }

    /**
     * التحقق من وجود مستخدم بنفس اسم المستخدم أو البريد الإلكتروني
     * @param {string} username - اسم المستخدم
     * @param {string} email - البريد الإلكتروني
     * @returns {boolean} - هل المستخدم موجود بالفعل
     */
    userExists(username, email) {
        return this.users.some(user =>
            user.username === username || user.email === email
        );
    }

    /**
     * التحقق من وجود طلب تسجيل معلق بنفس اسم المستخدم أو البريد الإلكتروني
     * @param {string} username - اسم المستخدم
     * @param {string} email - البريد الإلكتروني
     * @returns {boolean} - هل طلب التسجيل موجود بالفعل
     */
    pendingRegistrationExists(username, email) {
        return this.pendingRegistrations.some(reg =>
            reg.username === username || reg.email === email
        );
    }

    /**
     * إنشاء طلب تسجيل جديد
     * @param {Object} userData - بيانات المستخدم
     * @returns {Promise<Object>} - نتيجة العملية
     */
    async register(userData) {
        try {
            // التحقق من وجود المستخدم
            if (this.userExists(userData.username, userData.email)) {
                return {
                    success: false,
                    message: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل'
                };
            }

            // التحقق من وجود طلب تسجيل معلق
            if (this.pendingRegistrationExists(userData.username, userData.email)) {
                return {
                    success: false,
                    message: 'لديك طلب تسجيل معلق بالفعل. يرجى الانتظار حتى تتم الموافقة عليه'
                };
            }

            // تشفير كلمة المرور
            const hashedPassword = await this.hashPassword(userData.password);

            // إنشاء طلب تسجيل جديد
            const registration = {
                id: Date.now().toString(),
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                fullName: userData.fullName,
                telegram: userData.telegram,
                registrationDate: new Date().toISOString(),
                status: 'pending',
                isVerified: false
            };

            // إضافة طلب التسجيل إلى قائمة الطلبات المعلقة
            this.pendingRegistrations.push(registration);
            this.savePendingRegistrations();

            return {
                success: true,
                message: 'تم إرسال طلب التسجيل بنجاح. سيتم إشعارك عند الموافقة عليه'
            };
        } catch (error) {
            console.error('خطأ في التسجيل:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
            };
        }
    }

    /**
     * تسجيل الدخول
     * @param {string} username - اسم المستخدم أو البريد الإلكتروني
     * @param {string} password - كلمة المرور
     * @returns {Promise<Object>} - نتيجة العملية
     */
    async login(username, password) {
        try {
            // محاولة تسجيل الدخول

            // حالة خاصة للمشرف الرئيسي
            if (username === 'admin' && password === '@Black_00') {
                // تم التعرف على المشرف الرئيسي

                // البحث عن المشرف الرئيسي أو إنشاء واحد جديد
                let adminUser = this.users.find(user => user.username === 'admin');

                if (!adminUser) {
                    // إنشاء مشرف رئيسي جديد
                    adminUser = {
                        id: 'admin-' + Date.now().toString(),
                        username: 'admin',
                        email: 'darkmod@onionmail.org',
                        password: await this.hashPassword('@Black_00'),
                        fullName: 'مشرف النظام الرئيسي',
                        telegram: '@Crespii_bot',
                        registrationDate: new Date().toISOString(),
                        approvalDate: new Date().toISOString(),
                                            role: 'super_admin',
                                            isVerified: true
                                        };

                                        // إضافة المشرف إلى قائمة المستخدمين
                                        this.users.push(adminUser);
                                        this.saveUsers();
                                    }

                                    // تسجيل الدخول كمشرف رئيسي
                                    this.currentUser = {
                                        id: adminUser.id,
                                        username: adminUser.username,
                                        email: adminUser.email,
                                        fullName: adminUser.fullName,
                                        telegram: adminUser.telegram,
                                        role: 'super_admin',
                                        isVerified: true
                                    };

                                    // تعيين صلاحيات المشرف
                                    this.isAdmin = true;

                                    // حفظ بيانات المستخدم الحالي في الجلسة
                                    sessionStorage.setItem('greenhat_current_user', JSON.stringify(this.currentUser));

                                    return {
                                        success: true,
                                        message: 'تم تسجيل الدخول كمشرف رئيسي بنجاح',
                                        user: this.currentUser
                                    };
                                }

                                // البحث عن المستخدم
                                const user = this.users.find(user =>
                                    (user.username === username || user.email === username)
                                );

                                // التحقق من وجود المستخدم
                                if (!user) {
                                    // التحقق من وجود طلب تسجيل معلق بنفس اسم المستخدم أو البريد الإلكتروني
                                    const pendingRegistration = this.pendingRegistrations.find(reg =>
                                        (reg.username === username || reg.email === username)
                                    );

                                    if (pendingRegistration) {
                                        return {
                                            success: false,
                                            message: 'طلب التسجيل الخاص بك قيد المراجعة. يرجى الانتظار حتى تتم الموافقة عليه من قبل المشرف.'
                                        };
                                    }

                                    return {
                                        success: false,
                                        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                                    };
                                }

                                // تشفير كلمة المرور المدخلة للمقارنة
                                const hashedPassword = this.hashPassword(password);

                                // التحقق من تطابق كلمة المرور المشفرة مع المخزنة

                                // التحقق من صحة كلمة المرور
                                if (user.password !== hashedPassword) {
                                    return {
                                        success: false,
                                        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
                                    };
                                }

                                // إنشاء جلسة جديدة للمستخدم
                                let sessionResult = { success: true, sessionEnded: false };

                                // التحقق من وجود مدير الجلسات
                                if (typeof sessionManager !== 'undefined') {
                                    sessionResult = sessionManager.createSession(user.id);

                                    // إذا كانت هناك جلسة نشطة بالفعل، عرض رسالة للمستخدم
                                    if (sessionResult.sessionEnded) {
                                        // تم إنهاء جلسة سابقة للمستخدم
                                    }
                                }

                                // تسجيل الدخول
                                this.currentUser = {
                                    id: user.id,
                                    username: user.username,
                                    email: user.email,
                                    fullName: user.fullName,
                                    telegram: user.telegram,
                                    role: user.role,
                                    isVerified: user.isVerified || false
                                };

                                // إضافة معرف الجلسة إذا كان متاحًا
                                if (sessionResult.sessionId) {
                                    this.currentUser.sessionId = sessionResult.sessionId;
                                }

                                // التحقق من صلاحيات المشرف - أي مستخدم له دور غير 'user' يعتبر مشرف
                                this.isAdmin = user.role === 'admin' || user.role === 'super_admin' || user.role === 'moderator';

                                // حفظ بيانات المستخدم الحالي في الجلسة
                                sessionStorage.setItem('greenhat_current_user', JSON.stringify(this.currentUser));

                                // التحقق من وجود إشعارات غير مقروءة للمستخدم
                                const userNotifications = this.getUserNotifications(user.id);
                                const unreadNotifications = userNotifications.filter(notification => !notification.read);

                                return {
                                    success: true,
                                    message: sessionResult.sessionEnded ?
                                        'تم تسجيل الدخول بنجاح. تم إنهاء جلسة سابقة على جهاز آخر.' :
                                        'تم تسجيل الدخول بنجاح',
                                    user: this.currentUser,
                                    sessionEnded: sessionResult.sessionEnded,
                                    hasNotifications: unreadNotifications.length > 0,
                                    notifications: unreadNotifications
                                };
                            } catch (error) {
                                console.error('خطأ في تسجيل الدخول:', error);
                                return {
                                    success: false,
                                    message: 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
                                };
                            }
                        }

                        /**
                         * تسجيل الخروج
                         * @returns {Object} - نتيجة العملية
                         */
                        logout() {
                            // إنهاء الجلسة الحالية إذا كان مدير الجلسات متاحًا
                            if (typeof sessionManager !== 'undefined' && this.currentUser && this.currentUser.id) {
                                sessionManager.endSession(this.currentUser.id);
                            }

                            this.currentUser = null;
                            this.isAdmin = false;
                            sessionStorage.removeItem('greenhat_current_user');

                            return {
                                success: true,
                                message: 'تم تسجيل الخروج بنجاح'
                            };
                        }

                        /**
                         * التحقق من حالة تسجيل الدخول
                         * @returns {boolean} - هل المستخدم مسجل الدخول
                         */
                        isLoggedIn() {
                            // التحقق من وجود بيانات المستخدم في الجلسة
                            if (!this.currentUser) {
                                const userData = sessionStorage.getItem('greenhat_current_user');
                                if (userData) {
                                    this.currentUser = JSON.parse(userData);
                                    this.isAdmin = this.currentUser.role === 'admin' || this.currentUser.role === 'super_admin' || this.currentUser.role === 'moderator';

                                    // التحقق من صلاحية الجلسة إذا كان مدير الجلسات متاحًا
                                    if (typeof sessionManager !== 'undefined' && this.currentUser.id && this.currentUser.sessionId) {
                                        const isValidSession = sessionManager.isValidSession(this.currentUser.id, this.currentUser.sessionId);

                                        if (!isValidSession) {
                                            // إذا كانت الجلسة غير صالحة، قم بتسجيل الخروج
                                            // الجلسة غير صالحة، تم تسجيل الخروج تلقائيًا
                                            this.logout();
                                            return false;
                                        }
                                    }

                                    return true;
                                }
                                return false;
                            }

                            // التحقق من صلاحية الجلسة للمستخدم الحالي
                            if (typeof sessionManager !== 'undefined' && this.currentUser.id && this.currentUser.sessionId) {
                                const isValidSession = sessionManager.isValidSession(this.currentUser.id, this.currentUser.sessionId);

                                if (!isValidSession) {
                                    // إذا كانت الجلسة غير صالحة، قم بتسجيل الخروج
                                    // الجلسة غير صالحة، تم تسجيل الخروج تلقائيًا
                                    this.logout();
                                    return false;
                                }
                            }

                            return true;
                        }

                        /**
                         * الحصول على بيانات المستخدم الحالي
                         * @returns {Object|null} - بيانات المستخدم الحالي
                         */
                        getCurrentUser() {
                            return this.currentUser;
                        }

                        /**
                         * التحقق من صلاحيات المشرف
                         * @returns {boolean} - هل المستخدم مشرف
                         */
                        isAdminUser() {
                            return this.isAdmin;
                        }

                        /**
                         * الحصول على دور المستخدم الحالي
                         * @returns {string} - دور المستخدم الحالي
                         */
                        getCurrentUserRole() {
                            return this.currentUser ? this.currentUser.role : null;
                        }

                        /**
                         * الحصول على قائمة طلبات التسجيل المعلقة
                         * @returns {Array} - قائمة طلبات التسجيل المعلقة
                         */
                        getPendingRegistrations() {
                            return this.pendingRegistrations;
                        }

                        /**
                         * إضافة إشعار للمستخدم
                         * @param {string} userId - معرف المستخدم
                         * @param {string} title - عنوان الإشعار
                         * @param {string} message - نص الإشعار
                         * @param {string} type - نوع الإشعار (success, info, warning, error)
                         */
                        addUserNotification(userId, title, message, type = 'info') {
                            try {
                                // الحصول على إشعارات المستخدم الحالية
                                const userNotificationsKey = `greenhat_user_notifications_${userId}`;
                                const userNotificationsData = localStorage.getItem(userNotificationsKey);
                                const userNotifications = userNotificationsData ? JSON.parse(userNotificationsData) : [];

                                // إنشاء إشعار جديد
                                const notification = {
                                    id: Date.now().toString(),
                                    title: title,
                                    message: message,
                                    type: type,
                                    timestamp: new Date().toISOString(),
                                    read: false
                                };

                                // إضافة الإشعار إلى قائمة الإشعارات
                                userNotifications.push(notification);

                                // حفظ الإشعارات
                                localStorage.setItem(userNotificationsKey, JSON.stringify(userNotifications));

                                // تم إضافة إشعار للمستخدم
                                return true;
                            } catch (error) {
                                // خطأ في إضافة إشعار للمستخدم
                                return false;
                            }
                        }

                        /**
                         * الحصول على إشعارات المستخدم
                         * @param {string} userId - معرف المستخدم
                         * @returns {Array} - قائمة الإشعارات
                         */
                        getUserNotifications(userId) {
                            try {
                                const userNotificationsKey = `greenhat_user_notifications_${userId}`;
                                const userNotificationsData = localStorage.getItem(userNotificationsKey);
                                return userNotificationsData ? JSON.parse(userNotificationsData) : [];
                            } catch (error) {
                                // خطأ في الحصول على إشعارات المستخدم
                                return [];
                            }
                        }

                        /**
                         * تعليم إشعار كمقروء
                         * @param {string} userId - معرف المستخدم
                         * @param {string} notificationId - معرف الإشعار
                         * @returns {boolean} - هل تم تعليم الإشعار كمقروء بنجاح
                         */
                        markNotificationAsRead(userId, notificationId) {
                            try {
                                // الحصول على إشعارات المستخدم
                                const userNotificationsKey = `greenhat_user_notifications_${userId}`;
                                const userNotificationsData = localStorage.getItem(userNotificationsKey);
                                const userNotifications = userNotificationsData ? JSON.parse(userNotificationsData) : [];

                                // البحث عن الإشعار
                                const notificationIndex = userNotifications.findIndex(notification => notification.id === notificationId);
                                if (notificationIndex === -1) {
                                    return false;
                                }

                                // تعليم الإشعار كمقروء
                                userNotifications[notificationIndex].read = true;

                                // حفظ الإشعارات
                                localStorage.setItem(userNotificationsKey, JSON.stringify(userNotifications));

                                return true;
                            } catch (error) {
                                // خطأ في تعليم الإشعار كمقروء
                                return false;
                            }
                        }

    /**
     * الموافقة على طلب تسجيل
     * @param {string} registrationId - معرف طلب التسجيل
     * @returns {Promise<Object>} - نتيجة العملية
     */
    async approveRegistration(registrationId) {
        try {
            // التحقق من صلاحيات المشرف
            if (!this.isAdmin) {
                return {
                    success: false,
                    message: 'ليس لديك صلاحية للقيام بهذه العملية'
                };
            }

            // البحث عن طلب التسجيل
            const registrationIndex = this.pendingRegistrations.findIndex(reg => reg.id === registrationId);
            if (registrationIndex === -1) {
                return {
                    success: false,
                    message: 'طلب التسجيل غير موجود'
                };
            }

            // الحصول على بيانات طلب التسجيل
            const registration = this.pendingRegistrations[registrationIndex];

            // إنشاء حساب جديد
            const newUser = {
                id: registration.id,
                username: registration.username,
                email: registration.email,
                password: registration.password,
                fullName: registration.fullName,
                telegram: registration.telegram,
                registrationDate: registration.registrationDate,
                approvalDate: new Date().toISOString(),
                role: 'user',
                isVerified: false
            };

            // إضافة المستخدم إلى قائمة المستخدمين
            this.users.push(newUser);
            this.saveUsers();

            // إضافة إشعار للمستخدم
            this.addUserNotification(
                newUser.id,
                'تمت الموافقة على طلب التسجيل',
                'مرحبًا بك في منصة القبعة الخضراء! تمت الموافقة على طلب التسجيل الخاص بك. يمكنك الآن تسجيل الدخول واستخدام جميع ميزات المنصة. يرجى اجتياز اختبار الأمن السيبراني للحصول على صلاحيات كاملة.',
                'success'
            );

            // حذف طلب التسجيل من قائمة الطلبات المعلقة
            this.pendingRegistrations.splice(registrationIndex, 1);
            this.savePendingRegistrations();

            // محاكاة تأخير الشبكة للواقعية
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                message: 'تمت الموافقة على طلب التسجيل بنجاح'
            };
        } catch (error) {
            // خطأ في الموافقة على طلب التسجيل
            return {
                success: false,
                message: 'حدث خطأ أثناء الموافقة على طلب التسجيل'
            };
        }
    }

    /**
     * رفض طلب تسجيل
     * @param {string} registrationId - معرف طلب التسجيل
     * @returns {Promise<Object>} - نتيجة العملية
     */
    async rejectRegistration(registrationId) {
        try {
            // التحقق من صلاحيات المشرف
            if (!this.isAdmin) {
                return {
                    success: false,
                    message: 'ليس لديك صلاحية للقيام بهذه العملية'
                };
            }

            // البحث عن طلب التسجيل
            const registrationIndex = this.pendingRegistrations.findIndex(reg => reg.id === registrationId);
            if (registrationIndex === -1) {
                return {
                    success: false,
                    message: 'طلب التسجيل غير موجود'
                };
            }

            // حذف طلب التسجيل من قائمة الطلبات المعلقة
            this.pendingRegistrations.splice(registrationIndex, 1);
            this.savePendingRegistrations();

            // محاكاة تأخير الشبكة للواقعية
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                message: 'تم رفض طلب التسجيل بنجاح'
            };
        } catch (error) {
            // خطأ في رفض طلب التسجيل
            return {
                success: false,
                message: 'حدث خطأ أثناء رفض طلب التسجيل'
            };
        }
    }

    /**
     * تشفير كلمة المرور باستخدام SHA-256
     * @param {string} password - كلمة المرور
     * @returns {string} - كلمة المرور المشفرة
     */
    async hashPassword(password) {
        // استخدام Web Crypto API لتشفير كلمة المرور بشكل آمن
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    /**
     * إنشاء مشرف افتراضي إذا لم يكن هناك مشرفين
     */
    async createDefaultAdmin() {
        try {
            // التحقق من وجود مشرف رئيسي
            const superAdminExists = this.users.some(user => user.role === 'super_admin');
            if (!superAdminExists) {
                // تشفير كلمة المرور
                const hashedPassword = await this.hashPassword('@Black_00');

                // إنشاء مشرف رئيسي افتراضي
                const adminUser = {
                    id: 'admin-' + Date.now().toString(),
                    username: 'admin',
                    email: 'darkmod@onionmail.org',
                    password: hashedPassword,
                    fullName: 'مشرف النظام الرئيسي',
                    telegram: '@Crespii_bot',
                    registrationDate: new Date().toISOString(),
                    approvalDate: new Date().toISOString(),
                    role: 'super_admin',
                    isVerified: true
                };

                // إضافة المشرف إلى قائمة المستخدمين
                this.users.push(adminUser);
                this.saveUsers();

                // تم إنشاء مشرف رئيسي افتراضي
            }
        } catch (error) {
            console.error('خطأ في إنشاء المشرف الافتراضي:', error);
        }
    }

    /**
     * الحصول على قائمة المستخدمين
     * @returns {Array} - قائمة المستخدمين
     */
    getUsers() {
        // إرجاع نسخة من قائمة المستخدمين مع إخفاء كلمات المرور
        return this.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    /**
     * توثيق حساب مستخدم
     * @param {string} userId - معرف المستخدم
     * @returns {Object} - نتيجة العملية
     */
    verifyUser(userId) {
        // التحقق من صلاحيات المشرف
        if (!this.isAdmin) {
            return {
                success: false,
                message: 'ليس لديك صلاحية للقيام بهذه العملية'
            };
        }

        // البحث عن المستخدم
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return {
                success: false,
                message: 'المستخدم غير موجود'
            };
        }

        // تحديث حالة التوثيق
        this.users[userIndex].isVerified = !this.users[userIndex].isVerified;
        this.saveUsers();

        return {
            success: true,
            message: this.users[userIndex].isVerified ?
                'تم توثيق حساب المستخدم بنجاح' :
                'تم إلغاء توثيق حساب المستخدم'
        };
    }

    /**
     * ترقية مستخدم إلى مشرف محدود الصلاحيات
     * @param {string} userId - معرف المستخدم
     * @returns {Object} - نتيجة العملية
     */
    promoteToModerator(userId) {
        // التحقق من صلاحيات المشرف الحالي
        if (!this.isAdmin) {
            return {
                success: false,
                message: 'ليس لديك صلاحية للقيام بهذه العملية'
            };
        }

        // المشرفون المحدودون لا يمكنهم ترقية مستخدمين
        if (this.currentUser.role === 'moderator') {
            return {
                success: false,
                message: 'المشرفون المحدودون لا يمكنهم ترقية مستخدمين'
            };
        }

        // البحث عن المستخدم
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return {
                success: false,
                message: 'المستخدم غير موجود'
            };
        }

        // ترقية المستخدم إلى مشرف محدود
        this.users[userIndex].role = 'moderator';
        this.saveUsers();

        return {
            success: true,
            message: 'تمت ترقية المستخدم إلى مشرف محدود الصلاحيات بنجاح'
        };
    }

    /**
     * ترقية مستخدم إلى مشرف كامل الصلاحيات
     * @param {string} userId - معرف المستخدم
     * @returns {Object} - نتيجة العملية
     */
    promoteToAdmin(userId) {
        // التحقق من صلاحيات المشرف الحالي
        if (this.currentUser.role !== 'super_admin') {
            return {
                success: false,
                message: 'فقط المشرف الرئيسي يمكنه ترقية مستخدمين إلى مشرفين كاملي الصلاحيات'
            };
        }

        // البحث عن المستخدم
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return {
                success: false,
                message: 'المستخدم غير موجود'
            };
        }

        // ترقية المستخدم إلى مشرف كامل الصلاحيات
        this.users[userIndex].role = 'admin';
        this.saveUsers();

        return {
            success: true,
            message: 'تمت ترقية المستخدم إلى مشرف كامل الصلاحيات بنجاح'
        };
    }

    /**
     * تخفيض مستوى صلاحيات مستخدم
     * @param {string} userId - معرف المستخدم
     * @returns {Object} - نتيجة العملية
     */
    demoteUser(userId) {
        // التحقق من صلاحيات المشرف الحالي
        if (!this.isAdmin) {
            return {
                success: false,
                message: 'ليس لديك صلاحية للقيام بهذه العملية'
            };
        }

        // المشرفون المحدودون لا يمكنهم تخفيض مستوى صلاحيات مستخدمين
        if (this.currentUser.role === 'moderator') {
            return {
                success: false,
                message: 'المشرفون المحدودون لا يمكنهم تخفيض مستوى صلاحيات مستخدمين'
            };
        }

        // البحث عن المستخدم
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return {
                success: false,
                message: 'المستخدم غير موجود'
            };
        }

        // منع تخفيض مستوى صلاحيات المشرف الرئيسي
        if (this.users[userIndex].role === 'super_admin') {
            return {
                success: false,
                message: 'لا يمكن تخفيض مستوى صلاحيات المشرف الرئيسي'
            };
        }

        // منع المشرفين العاديين من تخفيض مستوى صلاحيات مشرفين آخرين
        if (this.currentUser.role === 'admin' && this.users[userIndex].role === 'admin') {
            return {
                success: false,
                message: 'لا يمكن للمشرفين العاديين تخفيض مستوى صلاحيات مشرفين آخرين'
            };
        }

        // تخفيض مستوى صلاحيات المستخدم
        if (this.users[userIndex].role === 'admin') {
            this.users[userIndex].role = 'moderator';
        } else if (this.users[userIndex].role === 'moderator') {
            this.users[userIndex].role = 'user';
        }

        this.saveUsers();

        return {
            success: true,
            message: 'تم تخفيض مستوى صلاحيات المستخدم بنجاح'
        };
    }

    /**
     * حذف مستخدم
     * @param {string} userId - معرف المستخدم
     * @returns {Object} - نتيجة العملية
     */
    deleteUser(userId) {
        // التحقق من صلاحيات المشرف الحالي
        if (!this.isAdmin) {
            return {
                success: false,
                message: 'ليس لديك صلاحية للقيام بهذه العملية'
            };
        }

        // البحث عن المستخدم
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return {
                success: false,
                message: 'المستخدم غير موجود'
            };
        }

        // منع حذف المشرف الرئيسي
        if (this.users[userIndex].role === 'super_admin') {
            return {
                success: false,
                message: 'لا يمكن حذف المشرف الرئيسي'
            };
        }

        // منع المشرفين المحدودين من حذف المشرفين الآخرين
        if (this.currentUser.role === 'moderator' &&
            (this.users[userIndex].role === 'admin' || this.users[userIndex].role === 'moderator')) {
            return {
                success: false,
                message: 'ليس لديك صلاحية لحذف مشرف آخر'
            };
        }

        // منع المشرفين العاديين من حذف مشرفين آخرين
        if (this.currentUser.role === 'admin' && this.users[userIndex].role === 'admin') {
            return {
                success: false,
                message: 'لا يمكن للمشرفين العاديين حذف مشرفين آخرين'
            };
        }

        // حذف المستخدم
        this.users.splice(userIndex, 1);
        this.saveUsers();

        return {
            success: true,
            message: 'تم حذف المستخدم بنجاح'
        };
    }
}

// إنشاء كائن من نظام العضويات
const membershipSystem = new MembershipSystem();

// إنشاء مشرف افتراضي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await membershipSystem.createDefaultAdmin();

    // التحقق من حالة تسجيل الدخول
    if (membershipSystem.isLoggedIn()) {
        updateUIForLoggedInUser();
    } else {
        updateUIForGuest();
    }
});

/**
 * تحديث واجهة المستخدم للمستخدم المسجل
 */
function updateUIForLoggedInUser() {
    const currentUser = membershipSystem.getCurrentUser();
    const isAdmin = membershipSystem.isAdminUser();

    // إخفاء أزرار تسجيل الدخول والتسجيل
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');

    // إظهار أزرار المستخدم المسجل
    document.querySelectorAll('.user-only').forEach(el => {
        if (el.tagName === 'LI') {
            el.style.display = 'list-item';
        } else {
            el.style.display = 'block';
        }
    });

    // إظهار اسم المستخدم
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = currentUser.username;
        el.style.display = 'inline-block';
    });

    // إظهار أزرار المشرف إذا كان المستخدم مشرفًا
    if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => {
            if (el.tagName === 'LI') {
                // إذا كان العنصر هو عنصر قائمة، نتعامل معه بشكل مختلف
                el.style.display = 'list-item';
            } else {
                el.style.display = 'block';
            }
        });
    } else {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }

    // تحديث قائمة طلبات التسجيل للمشرف
    if (isAdmin) {
        updatePendingRegistrationsList();
    }
}

/**
 * تحديث واجهة المستخدم للزائر
 */
function updateUIForGuest() {
    // إظهار أزرار تسجيل الدخول والتسجيل
    document.querySelectorAll('.guest-only').forEach(el => {
        if (el.tagName === 'LI') {
            el.style.display = 'list-item';
        } else {
            el.style.display = 'block';
        }
    });

    // إخفاء أزرار المستخدم المسجل
    document.querySelectorAll('.user-only').forEach(el => el.style.display = 'none');

    // إخفاء أزرار المشرف
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');

    // إخفاء اسم المستخدم
    document.querySelectorAll('.user-name').forEach(el => el.style.display = 'none');
}

/**
 * تحديث قائمة طلبات التسجيل المعلقة
 */
function updatePendingRegistrationsList() {
    const pendingRegistrations = membershipSystem.getPendingRegistrations();
    const pendingRegistrationsList = document.getElementById('pending-registrations-list');

    if (pendingRegistrationsList) {
        pendingRegistrationsList.innerHTML = '';

        if (pendingRegistrations.length === 0) {
            pendingRegistrationsList.innerHTML = '<div class="alert alert-info">لا توجد طلبات تسجيل معلقة</div>';
            return;
        }

        pendingRegistrations.forEach(registration => {
            const registrationItem = document.createElement('div');
            registrationItem.className = 'card mb-3';
            registrationItem.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${registration.fullName}</h5>
                    <p class="card-text">اسم المستخدم: ${registration.username}</p>
                    <p class="card-text">البريد الإلكتروني: ${registration.email}</p>
                    <p class="card-text">تيليجرام: ${registration.telegram}</p>
                    <p class="card-text">تاريخ التسجيل: ${new Date(registration.registrationDate).toLocaleString()}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-success" onclick="approveRegistration('${registration.id}')">
                            <i class="fas fa-check"></i> موافقة
                        </button>
                        <button class="btn btn-danger" onclick="rejectRegistration('${registration.id}')">
                            <i class="fas fa-times"></i> رفض
                        </button>
                    </div>
                </div>
            `;
            pendingRegistrationsList.appendChild(registrationItem);
        });
    }
}

/**
 * تسجيل مستخدم جديد
 */
async function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const fullName = document.getElementById('register-fullname').value;
    const telegram = document.getElementById('register-telegram').value;

    // التحقق من صحة البيانات
    if (!username || !email || !password || !confirmPassword || !fullName || !telegram) {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('كلمات المرور غير متطابقة', 'error');
        return;
    }

    // إظهار مؤشر التحميل
    const registerButton = document.querySelector('#register-form button[type="button"]');
    const originalButtonText = registerButton.innerHTML;
    registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    registerButton.disabled = true;

    try {
        // إرسال طلب التسجيل
        const result = await membershipSystem.register({
            username,
            email,
            password,
            fullName,
            telegram
        });

        // عرض نتيجة العملية
        showMessage(result.message, result.success ? 'success' : 'error');

        // إعادة تعيين النموذج إذا كانت العملية ناجحة
        if (result.success) {
            document.getElementById('register-form').reset();
            // إغلاق نافذة التسجيل
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('register-modal'));
            if (registerModal) {
                registerModal.hide();
            }
        }
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        showMessage('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        // إعادة زر التسجيل إلى حالته الأصلية
        registerButton.innerHTML = originalButtonText;
        registerButton.disabled = false;
    }
}

/**
 * تسجيل الدخول
 */
async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // التحقق من صحة البيانات
    if (!username || !password) {
        showMessage('يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }

    // إظهار مؤشر التحميل
    const loginButton = document.querySelector('#login-form button[type="button"]');
    const originalButtonText = loginButton.innerHTML;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
    loginButton.disabled = true;

    try {
        // تسجيل الدخول
        const result = await membershipSystem.login(username, password);

        // عرض نتيجة العملية
        showMessage(result.message, result.success ? 'success' : 'error');

        // تحديث واجهة المستخدم إذا كانت العملية ناجحة
        if (result.success) {
            document.getElementById('login-form').reset();
            // إغلاق نافذة تسجيل الدخول
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
            if (loginModal) {
                loginModal.hide();
            }
            updateUIForLoggedInUser();
        }
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        showMessage('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        // إعادة زر تسجيل الدخول إلى حالته الأصلية
        loginButton.innerHTML = originalButtonText;
        loginButton.disabled = false;
    }
}

/**
 * تسجيل الخروج
 */
function logoutUser() {
    const result = membershipSystem.logout();
    showMessage(result.message, 'info');
    updateUIForGuest();
}

/**
 * الموافقة على طلب تسجيل
 * @param {string} registrationId - معرف طلب التسجيل
 */
async function approveRegistration(registrationId) {
    try {
        // إظهار مؤشر التحميل
        const approveButton = document.querySelector(`button[onclick="approveRegistration('${registrationId}')"]`);
        if (approveButton) {
            const originalButtonText = approveButton.innerHTML;
            approveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            approveButton.disabled = true;

            const result = await membershipSystem.approveRegistration(registrationId);
            showMessage(result.message, result.success ? 'success' : 'error');

            if (result.success) {
                updatePendingRegistrationsList();
            } else {
                // إعادة الزر إلى حالته الأصلية في حالة الفشل
                approveButton.innerHTML = originalButtonText;
                approveButton.disabled = false;
            }
        } else {
            const result = await membershipSystem.approveRegistration(registrationId);
            showMessage(result.message, result.success ? 'success' : 'error');
            if (result.success) {
                updatePendingRegistrationsList();
            }
        }
    } catch (error) {
        console.error('خطأ في الموافقة على طلب التسجيل:', error);
        showMessage('حدث خطأ أثناء الموافقة على طلب التسجيل. يرجى المحاولة مرة أخرى.', 'error');
    }
}

/**
 * رفض طلب تسجيل
 * @param {string} registrationId - معرف طلب التسجيل
 */
async function rejectRegistration(registrationId) {
    try {
        // إظهار مؤشر التحميل
        const rejectButton = document.querySelector(`button[onclick="rejectRegistration('${registrationId}')"]`);
        if (rejectButton) {
            const originalButtonText = rejectButton.innerHTML;
            rejectButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            rejectButton.disabled = true;

            const result = await membershipSystem.rejectRegistration(registrationId);
            showMessage(result.message, result.success ? 'success' : 'error');

            if (result.success) {
                updatePendingRegistrationsList();
            } else {
                // إعادة الزر إلى حالته الأصلية في حالة الفشل
                rejectButton.innerHTML = originalButtonText;
                rejectButton.disabled = false;
            }
        } else {
            const result = await membershipSystem.rejectRegistration(registrationId);
            showMessage(result.message, result.success ? 'success' : 'error');
            if (result.success) {
                updatePendingRegistrationsList();
            }
        }
    } catch (error) {
        console.error('خطأ في رفض طلب التسجيل:', error);
        showMessage('حدث خطأ أثناء رفض طلب التسجيل. يرجى المحاولة مرة أخرى.', 'error');
    }
}

/**
 * عرض رسالة للمستخدم
 * @param {string} message - نص الرسالة
 * @param {string} type - نوع الرسالة (success, error, info)
 */
function showMessage(message, type) {
    const toast = document.getElementById('toast');
    const toastBody = toast.querySelector('.toast-body');

    // تعيين نص الرسالة
    toastBody.textContent = message;

    // تعيين لون الرسالة حسب النوع
    toast.className = 'toast';
    if (type === 'error') {
        toast.classList.add('bg-danger', 'text-white');
    } else if (type === 'success') {
        toast.classList.add('bg-success', 'text-white');
    } else {
        toast.classList.add('bg-info', 'text-white');
    }

    // عرض الرسالة
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}
