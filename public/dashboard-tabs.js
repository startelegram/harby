/**
 * نظام إدارة علامات التبويب في لوحة التحكم
 * يوفر وظائف للتنقل بين علامات التبويب المختلفة في لوحة تحكم المستخدم
 */

/**
 * عرض علامة تبويب محددة في لوحة التحكم
 * @param {string} tabId - معرف علامة التبويب المراد عرضها
 */
function showDashboardTab(tabId) {
    console.log('عرض علامة التبويب:', tabId);
    
    try {
        // التحقق من وجود علامة التبويب
        const tabElement = document.getElementById(`${tabId}-tab`);
        if (!tabElement) {
            console.error(`علامة التبويب ${tabId} غير موجودة`);
            return;
        }
        
        // التأكد من أن Bootstrap موجود
        if (typeof bootstrap === 'undefined') {
            console.error('مكتبة Bootstrap غير متاحة');
            return;
        }
        
        // إنشاء كائن علامة التبويب وتفعيلها
        const tab = new bootstrap.Tab(tabElement);
        tab.show();
        
        console.log(`تم تفعيل علامة التبويب ${tabId} بنجاح`);
    } catch (error) {
        console.error('حدث خطأ أثناء محاولة عرض علامة التبويب:', error);
        
        // محاولة بديلة باستخدام النقر المباشر
        try {
            const tabElement = document.getElementById(`${tabId}-tab`);
            if (tabElement) {
                tabElement.click();
                console.log(`تم النقر على علامة التبويب ${tabId} بنجاح`);
            }
        } catch (clickError) {
            console.error('فشلت محاولة النقر المباشر على علامة التبويب:', clickError);
        }
    }
}

/**
 * تهيئة مستمعي الأحداث لعلامات التبويب
 */
function initDashboardTabs() {
    // الحصول على جميع علامات التبويب
    const tabElements = document.querySelectorAll('#dashboard-tabs [data-bs-toggle="tab"]');
    
    // إضافة مستمع لحدث التغيير
    tabElements.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function (event) {
            const activeTabId = event.target.id.replace('-tab', '');
            console.log(`تم تفعيل علامة التبويب: ${activeTabId}`);
            
            // يمكن إضافة منطق إضافي هنا عند تغيير علامة التبويب
            // مثل تحديث البيانات أو تغيير حالة واجهة المستخدم
        });
    });
    
    console.log('تم تهيئة مستمعي أحداث علامات التبويب بنجاح');
}

// تهيئة علامات التبويب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة علامات التبويب
    initDashboardTabs();
    
    console.log('تم تهيئة نظام علامات التبويب في لوحة التحكم');
});
