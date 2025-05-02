/**
 * نظام إدارة نتائج اختبارات الأمن السيبراني للمشرفين
 * يتيح للمشرفين عرض ومراجعة نتائج اختبارات المستخدمين
 */

class AdminTestResultsSystem {
    constructor() {
        // تهيئة النظام
        this.testResults = this.loadTestResults();
    }

    /**
     * تحميل نتائج الاختبارات من التخزين المحلي
     * @returns {Array} - قائمة نتائج الاختبارات
     */
    loadTestResults() {
        console.log("تحميل نتائج اختبارات الأمن السيبراني");
        const testResultsData = localStorage.getItem('greenhat_test_results');
        const testResults = testResultsData ? JSON.parse(testResultsData) : [];
        console.log(`تم تحميل ${testResults.length} نتيجة اختبار`);
        
        // عرض نتائج الاختبارات في لوحة المشرف
        this.displayTestResults(testResults);
        
        return testResults;
    }

    /**
     * عرض نتائج الاختبارات في لوحة المشرف
     * @param {Array} testResults - قائمة نتائج الاختبارات
     */
    displayTestResults(testResults) {
        console.log("عرض نتائج اختبارات الأمن السيبراني في لوحة المشرف");
        const testResultsList = document.getElementById('test-results-list');
        
        if (!testResultsList) {
            console.error("لم يتم العثور على عنصر test-results-list");
            return;
        }
        
        testResultsList.innerHTML = '';

        if (testResults.length === 0) {
            testResultsList.innerHTML = '<div class="alert alert-info">لا توجد نتائج اختبارات</div>';
            return;
        }

        // ترتيب النتائج بحيث تكون الأحدث في الأعلى
        const sortedResults = [...testResults].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        sortedResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'card mb-3';
            resultItem.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${result.username}</h5>
                    <p class="card-text">البريد الإلكتروني: ${result.email}</p>
                    <p class="card-text">النتيجة: ${result.result.percentage}% (${result.result.correctAnswers}/${result.result.totalQuestions})</p>
                    <p class="card-text">الوقت المستغرق: ${this.formatTime(result.result.timeSpent)}</p>
                    <p class="card-text">تاريخ الاختبار: ${new Date(result.timestamp).toLocaleString()}</p>
                    <p class="card-text">
                        الحالة: 
                        <span class="badge ${result.result.passed ? 'bg-success' : 'bg-danger'}">
                            ${result.result.passed ? 'اجتاز الاختبار' : 'لم يجتز الاختبار'}
                        </span>
                    </p>
                    <p class="card-text">
                        المراجعة: 
                        <span class="badge ${result.reviewed ? 'bg-success' : 'bg-warning'}">
                            ${result.reviewed ? 'تمت المراجعة' : 'قيد المراجعة'}
                        </span>
                    </p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary" onclick="adminTestResults.viewTestDetails('${result.id}')">
                            <i class="fas fa-eye"></i> عرض التفاصيل
                        </button>
                        ${!result.reviewed ? 
                            `<button class="btn btn-success" onclick="adminTestResults.markAsReviewed('${result.id}')">
                                <i class="fas fa-check"></i> تعليم كمراجع
                            </button>` : 
                            `<button class="btn btn-warning" onclick="adminTestResults.markAsUnreviewed('${result.id}')">
                                <i class="fas fa-undo"></i> إلغاء المراجعة
                            </button>`
                        }
                        <button class="btn btn-danger" onclick="adminTestResults.deleteTestResult('${result.id}')">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            `;
            testResultsList.appendChild(resultItem);
        });
    }

    /**
     * تنسيق الوقت بالثواني إلى صيغة دقائق:ثواني
     * @param {number} seconds - الوقت بالثواني
     * @returns {string} - الوقت بصيغة دقائق:ثواني
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * عرض تفاصيل نتيجة اختبار
     * @param {string} resultId - معرف نتيجة الاختبار
     */
    viewTestDetails(resultId) {
        console.log(`عرض تفاصيل نتيجة الاختبار: ${resultId}`);
        const result = this.testResults.find(r => r.id === resultId);
        
        if (!result) {
            showToast('لم يتم العثور على نتيجة الاختبار', 'error');
            return;
        }

        // إنشاء نافذة منبثقة لعرض التفاصيل
        const modalId = 'test-details-modal';
        let modal = document.getElementById(modalId);
        
        // إذا لم تكن النافذة موجودة، قم بإنشائها
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-labelledby', 'test-details-modal-label');
            modal.setAttribute('aria-hidden', 'true');
            
            document.body.appendChild(modal);
        }
        
        // تحديث محتوى النافذة
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header">
                        <h5 class="modal-title" id="test-details-modal-label">تفاصيل نتيجة اختبار ${result.username}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <h6>معلومات المستخدم</h6>
                                <p>اسم المستخدم: ${result.username}</p>
                                <p>البريد الإلكتروني: ${result.email}</p>
                                <p>معرف المستخدم: ${result.userId}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>معلومات الاختبار</h6>
                                <p>النتيجة: ${result.result.percentage}% (${result.result.correctAnswers}/${result.result.totalQuestions})</p>
                                <p>الوقت المستغرق: ${this.formatTime(result.result.timeSpent)}</p>
                                <p>تاريخ الاختبار: ${new Date(result.timestamp).toLocaleString()}</p>
                                <p>
                                    الحالة: 
                                    <span class="badge ${result.result.passed ? 'bg-success' : 'bg-danger'}">
                                        ${result.result.passed ? 'اجتاز الاختبار' : 'لم يجتز الاختبار'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        <h6>إجابات المستخدم</h6>
                        <div class="table-responsive">
                            <table class="table table-dark table-striped">
                                <thead>
                                    <tr>
                                        <th>رقم السؤال</th>
                                        <th>إجابة المستخدم</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${result.userAnswers.map((answer, index) => {
                                        // الحصول على معرف التحدي
                                        const challengeId = result.challengeIds[index];
                                        
                                        // تحديد حالة الإجابة (صحيحة أم خاطئة)
                                        const isCorrect = typeof answer === 'number' && answer === this.getChallengeCorrectAnswer(challengeId);
                                        
                                        return `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td>${answer !== null && answer !== undefined ? answer : 'لم يتم الإجابة'}</td>
                                                <td>
                                                    <span class="badge ${isCorrect ? 'bg-success' : 'bg-danger'}">
                                                        ${isCorrect ? 'صحيحة' : 'خاطئة'}
                                                    </span>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                        ${!result.reviewed ? 
                            `<button type="button" class="btn btn-success" onclick="adminTestResults.markAsReviewed('${result.id}'); bootstrap.Modal.getInstance(document.getElementById('${modalId}')).hide();">
                                <i class="fas fa-check"></i> تعليم كمراجع
                            </button>` : 
                            `<button type="button" class="btn btn-warning" onclick="adminTestResults.markAsUnreviewed('${result.id}'); bootstrap.Modal.getInstance(document.getElementById('${modalId}')).hide();">
                                <i class="fas fa-undo"></i> إلغاء المراجعة
                            </button>`
                        }
                    </div>
                </div>
            </div>
        `;
        
        // عرض النافذة
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    /**
     * الحصول على الإجابة الصحيحة لتحدي معين
     * @param {string} challengeId - معرف التحدي
     * @returns {number|null} - الإجابة الصحيحة أو null إذا لم يتم العثور على التحدي
     */
    getChallengeCorrectAnswer(challengeId) {
        // في التطبيق الحقيقي، يجب استرجاع هذه المعلومات من قاعدة البيانات
        // هنا نستخدم قيمة افتراضية للتبسيط
        return 0;
    }


    /**
     * تعليم نتيجة اختبار كمراجعة
     * @param {string} resultId - معرف نتيجة الاختبار
     */
    markAsReviewed(resultId) {
        console.log(`تعليم نتيجة الاختبار كمراجعة: ${resultId}`);
        const resultIndex = this.testResults.findIndex(r => r.id === resultId);
        
        if (resultIndex === -1) {
            showToast('لم يتم العثور على نتيجة الاختبار', 'error');
            return;
        }
        
        // تحديث حالة المراجعة
        this.testResults[resultIndex].reviewed = true;
        
        // حفظ التغييرات
        this.saveTestResults();
        
        // تحديث العرض
        this.displayTestResults(this.testResults);
        
        showToast('تم تعليم نتيجة الاختبار كمراجعة', 'success');
    }

    /**
     * إلغاء تعليم نتيجة اختبار كمراجعة
     * @param {string} resultId - معرف نتيجة الاختبار
     */
    markAsUnreviewed(resultId) {
        console.log(`إلغاء تعليم نتيجة الاختبار كمراجعة: ${resultId}`);
        const resultIndex = this.testResults.findIndex(r => r.id === resultId);
        
        if (resultIndex === -1) {
            showToast('لم يتم العثور على نتيجة الاختبار', 'error');
            return;
        }
        
        // تحديث حالة المراجعة
        this.testResults[resultIndex].reviewed = false;
        
        // حفظ التغييرات
        this.saveTestResults();
        
        // تحديث العرض
        this.displayTestResults(this.testResults);
        
        showToast('تم إلغاء تعليم نتيجة الاختبار كمراجعة', 'success');
    }

    /**
     * حذف نتيجة اختبار
     * @param {string} resultId - معرف نتيجة الاختبار
     */
    deleteTestResult(resultId) {
        console.log(`حذف نتيجة الاختبار: ${resultId}`);
        if (!confirm('هل أنت متأكد من حذف نتيجة الاختبار هذه؟')) {
            return;
        }
        
        const resultIndex = this.testResults.findIndex(r => r.id === resultId);
        
        if (resultIndex === -1) {
            showToast('لم يتم العثور على نتيجة الاختبار', 'error');
            return;
        }
        
        // حذف نتيجة الاختبار
        this.testResults.splice(resultIndex, 1);
        
        // حفظ التغييرات
        this.saveTestResults();
        
        // تحديث العرض
        this.displayTestResults(this.testResults);
        
        showToast('تم حذف نتيجة الاختبار بنجاح', 'success');
    }

    /**
     * حفظ نتائج الاختبارات في التخزين المحلي
     */
    saveTestResults() {
        localStorage.setItem('greenhat_test_results', JSON.stringify(this.testResults));
    }
}

// إنشاء كائن من نظام إدارة نتائج الاختبارات
const adminTestResults = new AdminTestResultsSystem();

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحميل نتائج الاختبارات
    adminTestResults.loadTestResults();
    
    // إضافة مستمع لزر تحديث نتائج الاختبارات
    const refreshBtn = document.getElementById('refresh-test-results-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            adminTestResults.loadTestResults();
            showToast('تم تحديث نتائج الاختبارات', 'success');
        });
    }
});
