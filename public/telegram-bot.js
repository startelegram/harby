/**
 * نظام التكامل مع بوت تيليجرام
 * يتيح إرسال طلبات التسجيل إلى بوت تيليجرام والموافقة عليها من خلال البوت
 */

class TelegramBotSystem {
    constructor() {
        this.botToken = '6595235172:AAEDNLtZAmIwEOyJD3VGPVVTX2KfsjxqOkI';
        this.adminChatId = '6466421046';
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
        this.pendingApprovals = this.loadPendingApprovals();
        
        // بدء التحقق من الردود كل 30 ثانية
        this.startCheckingResponses();
    }

    /**
     * تحميل طلبات الموافقة المعلقة من التخزين المحلي
     */
    loadPendingApprovals() {
        const pendingApprovalsData = localStorage.getItem('greenhat_telegram_pending_approvals');
        return pendingApprovalsData ? JSON.parse(pendingApprovalsData) : [];
    }

    /**
     * حفظ طلبات الموافقة المعلقة في التخزين المحلي
     */
    savePendingApprovals() {
        localStorage.setItem('greenhat_telegram_pending_approvals', JSON.stringify(this.pendingApprovals));
    }

    /**
     * إرسال طلب تسجيل إلى بوت تيليجرام
     * @param {Object} registration - بيانات طلب التسجيل
     * @returns {Promise<Object>} - نتيجة العملية
     */
    async sendRegistrationRequest(registration) {
        try {
            // إنشاء رسالة تحتوي على بيانات طلب التسجيل
            const message = `
🔐 *طلب تسجيل جديد* 🔐

👤 *الاسم الكامل*: ${registration.fullName}
👤 *اسم المستخدم*: ${registration.username}
📧 *البريد الإلكتروني*: ${registration.email}
📱 *تيليجرام*: ${registration.telegram}
📅 *تاريخ التسجيل*: ${new Date(registration.registrationDate).toLocaleString()}

هل ترغب في الموافقة على هذا الطلب؟
/approve_${registration.id} للموافقة
/reject_${registration.id} للرفض
`;

            // إرسال الرسالة إلى المشرف
            const response = await fetch(`${this.apiUrl}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.adminChatId,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            });

            const result = await response.json();

            if (result.ok) {
                // إضافة طلب التسجيل إلى قائمة الطلبات المعلقة
                this.pendingApprovals.push({
                    registrationId: registration.id,
                    messageId: result.result.message_id,
                    timestamp: Date.now(),
                });
                this.savePendingApprovals();

                return {
                    success: true,
                    message: 'تم إرسال طلب التسجيل إلى المشرف عبر تيليجرام',
                };
            } else {
                console.error('خطأ في إرسال الرسالة إلى تيليجرام:', result);
                return {
                    success: false,
                    message: 'حدث خطأ أثناء إرسال طلب التسجيل إلى تيليجرام',
                };
            }
        } catch (error) {
            console.error('خطأ في إرسال طلب التسجيل إلى تيليجرام:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء إرسال طلب التسجيل إلى تيليجرام',
            };
        }
    }

    /**
     * بدء التحقق من الردود من بوت تيليجرام
     */
    startCheckingResponses() {
        // التحقق من الردود كل 30 ثانية
        setInterval(() => {
            this.checkBotResponses();
        }, 30000);

        // التحقق من الردود عند تحميل الصفحة
        this.checkBotResponses();
    }

    /**
     * التحقق من الردود من بوت تيليجرام
     */
    async checkBotResponses() {
        try {
            // الحصول على آخر تحديثات البوت
            const response = await fetch(`${this.apiUrl}/getUpdates`);
            const result = await response.json();

            if (result.ok) {
                const updates = result.result;

                // معالجة كل تحديث
                for (const update of updates) {
                    if (update.message && update.message.from.id.toString() === this.adminChatId) {
                        const text = update.message.text;

                        // التحقق من أوامر الموافقة أو الرفض
                        if (text.startsWith('/approve_')) {
                            const registrationId = text.replace('/approve_', '');
                            await this.handleApproval(registrationId);
                        } else if (text.startsWith('/reject_')) {
                            const registrationId = text.replace('/reject_', '');
                            await this.handleRejection(registrationId);
                        }
                    }
                }
            } else {
                console.error('خطأ في الحصول على تحديثات البوت:', result);
            }
        } catch (error) {
            console.error('خطأ في التحقق من ردود البوت:', error);
        }
    }

    /**
     * معالجة الموافقة على طلب التسجيل
     * @param {string} registrationId - معرف طلب التسجيل
     */
    async handleApproval(registrationId) {
        try {
            // التحقق من وجود طلب التسجيل في قائمة الطلبات المعلقة
            const pendingApprovalIndex = this.pendingApprovals.findIndex(
                approval => approval.registrationId === registrationId
            );

            if (pendingApprovalIndex !== -1) {
                // الحصول على طلب التسجيل من نظام العضوية
                const registration = membershipSystem.getPendingRegistrationById(registrationId);

                if (registration) {
                    // الموافقة على طلب التسجيل
                    const result = await membershipSystem.approveRegistration(registrationId);

                    // إرسال رسالة تأكيد إلى المشرف
                    await fetch(`${this.apiUrl}/sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: this.adminChatId,
                            text: `✅ تمت الموافقة على طلب التسجيل لـ ${registration.username} بنجاح.`,
                        }),
                    });

                    // حذف طلب التسجيل من قائمة الطلبات المعلقة
                    this.pendingApprovals.splice(pendingApprovalIndex, 1);
                    this.savePendingApprovals();

                    // تحديث واجهة المستخدم إذا كان المشرف متصلاً
                    if (typeof updatePendingRegistrationsList === 'function') {
                        updatePendingRegistrationsList();
                    }
                }
            }
        } catch (error) {
            console.error('خطأ في معالجة الموافقة على طلب التسجيل:', error);
        }
    }

    /**
     * معالجة رفض طلب التسجيل
     * @param {string} registrationId - معرف طلب التسجيل
     */
    async handleRejection(registrationId) {
        try {
            // التحقق من وجود طلب التسجيل في قائمة الطلبات المعلقة
            const pendingApprovalIndex = this.pendingApprovals.findIndex(
                approval => approval.registrationId === registrationId
            );

            if (pendingApprovalIndex !== -1) {
                // الحصول على طلب التسجيل من نظام العضوية
                const registration = membershipSystem.getPendingRegistrationById(registrationId);

                if (registration) {
                    // رفض طلب التسجيل
                    const result = await membershipSystem.rejectRegistration(registrationId);

                    // إرسال رسالة تأكيد إلى المشرف
                    await fetch(`${this.apiUrl}/sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: this.adminChatId,
                            text: `❌ تم رفض طلب التسجيل لـ ${registration.username}.`,
                        }),
                    });

                    // حذف طلب التسجيل من قائمة الطلبات المعلقة
                    this.pendingApprovals.splice(pendingApprovalIndex, 1);
                    this.savePendingApprovals();

                    // تحديث واجهة المستخدم إذا كان المشرف متصلاً
                    if (typeof updatePendingRegistrationsList === 'function') {
                        updatePendingRegistrationsList();
                    }
                }
            }
        } catch (error) {
            console.error('خطأ في معالجة رفض طلب التسجيل:', error);
        }
    }
}

// إنشاء كائن من نظام بوت تيليجرام
const telegramBotSystem = new TelegramBotSystem();
