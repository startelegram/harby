/**
 * نظام التعليقات
 * يوفر وظائف لإضافة وعرض وإدارة التعليقات
 */

/**
 * فئة نظام التعليقات
 */
class CommentsSystem {
    constructor() {
        // تهيئة المتغيرات
        this.comments = [];
        this.pendingComments = [];
        this.loadComments();
        this.loadPendingComments();
    }

    /**
     * تحميل التعليقات من التخزين المحلي
     */
    loadComments() {
        try {
            const commentsData = localStorage.getItem('greenhat_comments');
            this.comments = commentsData ? JSON.parse(commentsData) : [];
            console.log('تم تحميل التعليقات:', this.comments.length);
        } catch (error) {
            console.error('خطأ في تحميل التعليقات:', error);
            this.comments = [];
        }
    }

    /**
     * تحميل التعليقات المعلقة من التخزين المحلي
     */
    loadPendingComments() {
        try {
            const pendingCommentsData = localStorage.getItem('greenhat_pending_comments');
            this.pendingComments = pendingCommentsData ? JSON.parse(pendingCommentsData) : [];
            console.log('تم تحميل التعليقات المعلقة:', this.pendingComments.length);
        } catch (error) {
            console.error('خطأ في تحميل التعليقات المعلقة:', error);
            this.pendingComments = [];
        }
    }

    /**
     * حفظ التعليقات في التخزين المحلي
     */
    saveComments() {
        try {
            localStorage.setItem('greenhat_comments', JSON.stringify(this.comments));
            console.log('تم حفظ التعليقات');
        } catch (error) {
            console.error('خطأ في حفظ التعليقات:', error);
        }
    }

    /**
     * حفظ التعليقات المعلقة في التخزين المحلي
     */
    savePendingComments() {
        try {
            localStorage.setItem('greenhat_pending_comments', JSON.stringify(this.pendingComments));
            console.log('تم حفظ التعليقات المعلقة');
        } catch (error) {
            console.error('خطأ في حفظ التعليقات المعلقة:', error);
        }
    }

    /**
     * إضافة تعليق جديد
     * @param {Object} commentData - بيانات التعليق
     * @returns {Object} - نتيجة العملية
     */
    addComment(commentData) {
        try {
            // التحقق من وجود البيانات المطلوبة
            if (!commentData.content || !commentData.userId || !commentData.username) {
                return {
                    success: false,
                    message: 'يرجى توفير جميع البيانات المطلوبة'
                };
            }

            // إنشاء كائن التعليق الجديد
            const newComment = {
                id: Date.now().toString(),
                content: commentData.content,
                userId: commentData.userId,
                username: commentData.username,
                date: new Date().toISOString(),
                status: 'pending',
                likes: 0,
                dislikes: 0
            };

            // إضافة التعليق إلى قائمة التعليقات المعلقة
            this.pendingComments.push(newComment);
            this.savePendingComments();

            // إضافة إشعار للمشرفين
            if (typeof membershipSystem !== 'undefined') {
                membershipSystem.addAdminNotification(
                    'تعليق جديد معلق',
                    `تم استلام تعليق جديد من ${commentData.username}`,
                    'info'
                );
            }

            // تحديث قائمة التعليقات المعلقة في واجهة المستخدم إذا كان المستخدم الحالي مشرفًا
            if (typeof membershipSystem !== 'undefined' && membershipSystem.isAdminUser() && typeof updatePendingCommentsList === 'function') {
                updatePendingCommentsList();
            }

            return {
                success: true,
                message: 'تم إرسال التعليق بنجاح. سيتم نشره بعد مراجعته من قبل المشرف'
            };
        } catch (error) {
            console.error('خطأ في إضافة تعليق:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء إضافة التعليق. يرجى المحاولة مرة أخرى.'
            };
        }
    }

    /**
     * الموافقة على تعليق معلق
     * @param {string} commentId - معرف التعليق
     * @returns {Object} - نتيجة العملية
     */
    approveComment(commentId) {
        try {
            // البحث عن التعليق في قائمة التعليقات المعلقة
            const commentIndex = this.pendingComments.findIndex(comment => comment.id === commentId);
            if (commentIndex === -1) {
                return {
                    success: false,
                    message: 'التعليق غير موجود'
                };
            }

            // نقل التعليق من قائمة التعليقات المعلقة إلى قائمة التعليقات المنشورة
            const comment = this.pendingComments[commentIndex];
            comment.status = 'approved';
            this.comments.push(comment);
            this.pendingComments.splice(commentIndex, 1);

            // حفظ التغييرات
            this.saveComments();
            this.savePendingComments();

            // إضافة إشعار للمستخدم
            if (typeof membershipSystem !== 'undefined') {
                membershipSystem.addUserNotification(
                    comment.userId,
                    'تمت الموافقة على تعليقك',
                    'تمت الموافقة على تعليقك ونشره',
                    'success'
                );
            }

            // تحديث قائمة التعليقات في واجهة المستخدم
            if (typeof updateCommentsList === 'function') {
                updateCommentsList();
            }

            // تحديث قائمة التعليقات المعلقة في واجهة المستخدم
            if (typeof updatePendingCommentsList === 'function') {
                updatePendingCommentsList();
            }

            return {
                success: true,
                message: 'تمت الموافقة على التعليق ونشره بنجاح'
            };
        } catch (error) {
            console.error('خطأ في الموافقة على تعليق:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء الموافقة على التعليق. يرجى المحاولة مرة أخرى.'
            };
        }
    }

    /**
     * رفض تعليق معلق
     * @param {string} commentId - معرف التعليق
     * @returns {Object} - نتيجة العملية
     */
    rejectComment(commentId) {
        try {
            // البحث عن التعليق في قائمة التعليقات المعلقة
            const commentIndex = this.pendingComments.findIndex(comment => comment.id === commentId);
            if (commentIndex === -1) {
                return {
                    success: false,
                    message: 'التعليق غير موجود'
                };
            }

            // الحصول على معلومات التعليق قبل حذفه
            const comment = this.pendingComments[commentIndex];

            // حذف التعليق من قائمة التعليقات المعلقة
            this.pendingComments.splice(commentIndex, 1);
            this.savePendingComments();

            // إضافة إشعار للمستخدم
            if (typeof membershipSystem !== 'undefined') {
                membershipSystem.addUserNotification(
                    comment.userId,
                    'تم رفض تعليقك',
                    'تم رفض تعليقك لعدم توافقه مع سياسة الموقع',
                    'warning'
                );
            }

            // تحديث قائمة التعليقات المعلقة في واجهة المستخدم
            if (typeof updatePendingCommentsList === 'function') {
                updatePendingCommentsList();
            }

            return {
                success: true,
                message: 'تم رفض التعليق بنجاح'
            };
        } catch (error) {
            console.error('خطأ في رفض تعليق:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء رفض التعليق. يرجى المحاولة مرة أخرى.'
            };
        }
    }

    /**
     * حذف تعليق
     * @param {string} commentId - معرف التعليق
     * @returns {Object} - نتيجة العملية
     */
    deleteComment(commentId) {
        try {
            // البحث عن التعليق في قائمة التعليقات المنشورة
            const commentIndex = this.comments.findIndex(comment => comment.id === commentId);
            if (commentIndex === -1) {
                return {
                    success: false,
                    message: 'التعليق غير موجود'
                };
            }

            // حذف التعليق من قائمة التعليقات المنشورة
            this.comments.splice(commentIndex, 1);
            this.saveComments();

            // تحديث قائمة التعليقات في واجهة المستخدم
            if (typeof updateCommentsList === 'function') {
                updateCommentsList();
            }

            return {
                success: true,
                message: 'تم حذف التعليق بنجاح'
            };
        } catch (error) {
            console.error('خطأ في حذف تعليق:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء حذف التعليق. يرجى المحاولة مرة أخرى.'
            };
        }
    }

    /**
     * الحصول على جميع التعليقات المنشورة
     * @returns {Array} - قائمة التعليقات المنشورة
     */
    getComments() {
        return this.comments;
    }

    /**
     * الحصول على جميع التعليقات المعلقة
     * @returns {Array} - قائمة التعليقات المعلقة
     */
    getPendingComments() {
        return this.pendingComments;
    }

    /**
     * الإعجاب بتعليق
     * @param {string} commentId - معرف التعليق
     * @returns {Object} - نتيجة العملية
     */
    likeComment(commentId) {
        try {
            // البحث عن التعليق في قائمة التعليقات المنشورة
            const commentIndex = this.comments.findIndex(comment => comment.id === commentId);
            if (commentIndex === -1) {
                return {
                    success: false,
                    message: 'التعليق غير موجود'
                };
            }

            // زيادة عدد الإعجابات
            this.comments[commentIndex].likes++;
            this.saveComments();

            // تحديث قائمة التعليقات في واجهة المستخدم
            if (typeof updateCommentsList === 'function') {
                updateCommentsList();
            }

            return {
                success: true,
                message: 'تم الإعجاب بالتعليق بنجاح'
            };
        } catch (error) {
            console.error('خطأ في الإعجاب بتعليق:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء الإعجاب بالتعليق. يرجى المحاولة مرة أخرى.'
            };
        }
    }

    /**
     * عدم الإعجاب بتعليق
     * @param {string} commentId - معرف التعليق
     * @returns {Object} - نتيجة العملية
     */
    dislikeComment(commentId) {
        try {
            // البحث عن التعليق في قائمة التعليقات المنشورة
            const commentIndex = this.comments.findIndex(comment => comment.id === commentId);
            if (commentIndex === -1) {
                return {
                    success: false,
                    message: 'التعليق غير موجود'
                };
            }

            // زيادة عدد عدم الإعجابات
            this.comments[commentIndex].dislikes++;
            this.saveComments();

            // تحديث قائمة التعليقات في واجهة المستخدم
            if (typeof updateCommentsList === 'function') {
                updateCommentsList();
            }

            return {
                success: true,
                message: 'تم عدم الإعجاب بالتعليق بنجاح'
            };
        } catch (error) {
            console.error('خطأ في عدم الإعجاب بتعليق:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء عدم الإعجاب بالتعليق. يرجى المحاولة مرة أخرى.'
            };
        }
    }
}

// إنشاء كائن من نظام التعليقات
const commentsSystem = new CommentsSystem();

/**
 * تحديث قائمة التعليقات في واجهة المستخدم
 */
function updateCommentsList() {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) {
        console.error('عنصر comments-container غير موجود');
        return;
    }

    // الحصول على التعليقات المنشورة
    const comments = commentsSystem.getComments();

    // تفريغ الحاوية
    commentsContainer.innerHTML = '';

    // إذا لم تكن هناك تعليقات
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<div class="alert alert-info">لا توجد تعليقات حتى الآن. كن أول من يعلق!</div>';
        return;
    }

    // ترتيب التعليقات بحسب التاريخ (الأحدث أولاً)
    comments.sort((a, b) => new Date(b.date) - new Date(a.date));

    // إنشاء عناصر التعليقات
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-user">
                    <i class="fas fa-user-circle me-2"></i>
                    <span class="comment-username">${comment.username}</span>
                </div>
                <div class="comment-date">${formatDate(comment.date)}</div>
            </div>
            <div class="comment-content">${comment.content}</div>
            <div class="comment-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="likeComment('${comment.id}')">
                    <i class="fas fa-thumbs-up me-1"></i> ${comment.likes}
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="dislikeComment('${comment.id}')">
                    <i class="fas fa-thumbs-down me-1"></i> ${comment.dislikes}
                </button>
                ${membershipSystem && membershipSystem.isAdminUser() ? `
                <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteComment('${comment.id}')">
                    <i class="fas fa-trash me-1"></i> حذف
                </button>
                ` : ''}
            </div>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

/**
 * تحديث قائمة التعليقات المعلقة في واجهة المستخدم
 */
function updatePendingCommentsList() {
    const pendingCommentsContainer = document.getElementById('pending-comments-container');
    if (!pendingCommentsContainer) {
        console.error('عنصر pending-comments-container غير موجود');
        return;
    }

    // الحصول على التعليقات المعلقة
    const pendingComments = commentsSystem.getPendingComments();

    // تفريغ الحاوية
    pendingCommentsContainer.innerHTML = '';

    // إذا لم تكن هناك تعليقات معلقة
    if (pendingComments.length === 0) {
        pendingCommentsContainer.innerHTML = '<div class="alert alert-info">لا توجد تعليقات معلقة</div>';
        return;
    }

    // ترتيب التعليقات بحسب التاريخ (الأحدث أولاً)
    pendingComments.sort((a, b) => new Date(b.date) - new Date(a.date));

    // إنشاء عناصر التعليقات المعلقة
    pendingComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'card mb-3';
        commentElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-subtitle text-muted">
                        <i class="fas fa-user-circle me-2"></i> ${comment.username}
                    </h6>
                    <small class="text-muted">${formatDate(comment.date)}</small>
                </div>
                <p class="card-text">${comment.content}</p>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-success me-2" onclick="approveComment('${comment.id}')">
                        <i class="fas fa-check me-1"></i> موافقة
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectComment('${comment.id}')">
                        <i class="fas fa-times me-1"></i> رفض
                    </button>
                </div>
            </div>
        `;
        pendingCommentsContainer.appendChild(commentElement);
    });

    // تحديث عدد التعليقات المعلقة في علامة التبويب
    const pendingCommentsTab = document.getElementById('pending-comments-tab');
    if (pendingCommentsTab) {
        pendingCommentsTab.innerHTML = `التعليقات المعلقة ${pendingComments.length > 0 ? `<span class="badge bg-danger rounded-pill">${pendingComments.length}</span>` : ''}`;
    }
}

/**
 * إضافة تعليق جديد
 */
function addNewComment() {
    // التحقق من تسجيل الدخول
    if (!membershipSystem || !membershipSystem.isLoggedIn()) {
        showToast('يجب تسجيل الدخول لإضافة تعليق', 'warning');
        return;
    }

    // الحصول على محتوى التعليق
    const commentContent = document.getElementById('comment-content');
    if (!commentContent) {
        console.error('عنصر comment-content غير موجود');
        return;
    }

    const content = commentContent.value.trim();
    if (!content) {
        showToast('يرجى كتابة تعليق', 'warning');
        return;
    }

    // الحصول على معلومات المستخدم
    const currentUser = membershipSystem.getCurrentUser();
    if (!currentUser) {
        showToast('حدث خطأ في الحصول على معلومات المستخدم', 'error');
        return;
    }

    // إضافة التعليق
    const result = commentsSystem.addComment({
        content: content,
        userId: currentUser.id,
        username: currentUser.username
    });

    // عرض نتيجة العملية
    showToast(result.message, result.success ? 'success' : 'error');

    // مسح حقل التعليق إذا تمت العملية بنجاح
    if (result.success) {
        commentContent.value = '';
    }
}

/**
 * الموافقة على تعليق معلق
 * @param {string} commentId - معرف التعليق
 */
function approveComment(commentId) {
    // التحقق من صلاحيات المشرف
    if (!membershipSystem || !membershipSystem.isAdminUser()) {
        showToast('ليس لديك صلاحية للقيام بهذه العملية', 'error');
        return;
    }

    // الموافقة على التعليق
    const result = commentsSystem.approveComment(commentId);

    // عرض نتيجة العملية
    showToast(result.message, result.success ? 'success' : 'error');
}

/**
 * رفض تعليق معلق
 * @param {string} commentId - معرف التعليق
 */
function rejectComment(commentId) {
    // التحقق من صلاحيات المشرف
    if (!membershipSystem || !membershipSystem.isAdminUser()) {
        showToast('ليس لديك صلاحية للقيام بهذه العملية', 'error');
        return;
    }

    // رفض التعليق
    const result = commentsSystem.rejectComment(commentId);

    // عرض نتيجة العملية
    showToast(result.message, result.success ? 'success' : 'error');
}

/**
 * حذف تعليق
 * @param {string} commentId - معرف التعليق
 */
function deleteComment(commentId) {
    // التحقق من صلاحيات المشرف
    if (!membershipSystem || !membershipSystem.isAdminUser()) {
        showToast('ليس لديك صلاحية للقيام بهذه العملية', 'error');
        return;
    }

    // حذف التعليق
    const result = commentsSystem.deleteComment(commentId);

    // عرض نتيجة العملية
    showToast(result.message, result.success ? 'success' : 'error');
}

/**
 * الإعجاب بتعليق
 * @param {string} commentId - معرف التعليق
 */
function likeComment(commentId) {
    // التحقق من تسجيل الدخول
    if (!membershipSystem || !membershipSystem.isLoggedIn()) {
        showToast('يجب تسجيل الدخول للإعجاب بالتعليقات', 'warning');
        return;
    }

    // الإعجاب بالتعليق
    const result = commentsSystem.likeComment(commentId);

    // عرض نتيجة العملية
    if (!result.success) {
        showToast(result.message, 'error');
    }
}

/**
 * عدم الإعجاب بتعليق
 * @param {string} commentId - معرف التعليق
 */
function dislikeComment(commentId) {
    // التحقق من تسجيل الدخول
    if (!membershipSystem || !membershipSystem.isLoggedIn()) {
        showToast('يجب تسجيل الدخول لعدم الإعجاب بالتعليقات', 'warning');
        return;
    }

    // عدم الإعجاب بالتعليق
    const result = commentsSystem.dislikeComment(commentId);

    // عرض نتيجة العملية
    if (!result.success) {
        showToast(result.message, 'error');
    }
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

// تهيئة نظام التعليقات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحديث قائمة التعليقات
    updateCommentsList();
    
    // تحديث قائمة التعليقات المعلقة إذا كان المستخدم مشرفًا
    if (membershipSystem && membershipSystem.isAdminUser()) {
        updatePendingCommentsList();
    }
    
    // إظهار/إخفاء نموذج التعليق بناءً على حالة تسجيل الدخول
    const commentForm = document.getElementById('comment-form');
    const guestOnly = document.querySelector('.guest-only');
    
    if (commentForm && guestOnly) {
        if (membershipSystem && membershipSystem.isLoggedIn()) {
            commentForm.style.display = 'block';
            guestOnly.style.display = 'none';
        } else {
            commentForm.style.display = 'none';
            guestOnly.style.display = 'block';
        }
    }
});
