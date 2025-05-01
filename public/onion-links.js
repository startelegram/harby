/**
 * نظام روابط Onion
 * يتيح للمستخدمين عرض روابط Onion والمشرفين إدارتها
 */

class OnionLinksSystem {
    constructor() {
        // تهيئة نظام روابط Onion
        this.links = this.loadLinks();
    }

    /**
     * تحميل روابط Onion من التخزين المحلي
     * @returns {Array} - قائمة روابط Onion
     */
    loadLinks() {
        const linksData = localStorage.getItem('greenhat_onion_links');
        if (linksData) {
            return JSON.parse(linksData);
        } else {
            // إنشاء روابط افتراضية إذا لم تكن موجودة
            const defaultLinks = [
                {
                    id: 'link-1',
                    name: 'dread',
                    url: 'http://dreadytofatroptsdj6io7l3xptbet6onoyno2yv7jicoxknyazubrad.onion/',
                    description:' Dread is a dark web forum accessible via Tor',
                    category: 'cyber security Platform',
                    addedBy: 'admin',
                    addedDate: new Date().toISOString()
                },
                {
                    id: 'link-2',
                    name: 'Silk Road 3.1 ',
                    url: 'http://silkroad22gtemddxbbfxe57xmb4mxgcwnbwbvarpbghsseluxwdnvyd.onion',
                    description: ' Silk Road 3.1 is a dark web forum accessible via Tor',
                    category: 'marketplace',
                    addedBy: 'admin',
                    addedDate: new Date().toISOString()
                },
                {
                    id: 'link-3',
                    name: 'cryptBB',
                    url: 'http://cryptbbtg65gibadeeo2awe3j7s6evg7eklserehqr4w4e2bis5tebid.onion/',
                    description: ' CryptBB is a dark web forum accessible via Tor',
                    category: 'Crypt',
                    addedBy: 'admin',
                    addedDate: new Date().toISOString()
                },
                {
                    id: 'link-4',
                    name: 'Xss',
                    url: 'https://xss.is/',
                    description: '  cyber security forum,a Russian-speaking hacking forum',
                    category: 'cyber security',
                    addedBy: 'admin',
                    addedDate: new Date().toISOString()
                },
                {
                    id: 'link-5',
                    name: 'onion666',
                    url: 'https://onion666.com/index.html',
                    description: '   ',
                    category: 'guide',
                    addedBy: 'admin',
                    addedDate: new Date().toISOString()
                }
            ];
            this.saveLinks(defaultLinks);
            return defaultLinks;
        }
    }

    /**
     * حفظ روابط Onion في التخزين المحلي
     * @param {Array} links - قائمة روابط Onion للحفظ
     */
    saveLinks(links) {
        localStorage.setItem('greenhat_onion_links', JSON.stringify(links));
        this.links = links;
    }

    /**
     * الحصول على جميع روابط Onion
     * @returns {Array} - قائمة روابط Onion
     */
    getAllLinks() {
        return this.links;
    }

    /**
     * الحصول على روابط Onion حسب الفئة
     * @param {string} category - فئة الروابط
     * @returns {Array} - قائمة روابط Onion في الفئة المحددة
     */
    getLinksByCategory(category) {
        return this.links.filter(link => link.category === category);
    }

    /**
     * إضافة رابط Onion جديد
     * @param {Object} linkData - بيانات الرابط الجديد
     * @returns {Object} - نتيجة العملية
     */
    addLink(linkData) {
        try {
            // التحقق من وجود البيانات المطلوبة
            if (!linkData.name || !linkData.url) {
                return {
                    success: false,
                    message: 'يرجى توفير اسم ورابط للموقع'
                };
            }

            // التحقق من صحة الرابط
            if (!this.isValidOnionUrl(linkData.url)) {
                return {
                    success: false,
                    message: 'يرجى إدخال رابط onion صحيح'
                };
            }

            // إنشاء معرف فريد للرابط
            const linkId = 'link-' + Date.now();

            // إنشاء كائن الرابط الجديد
            const newLink = {
                id: linkId,
                name: linkData.name,
                url: linkData.url,
                description: linkData.description || '',
                category: linkData.category || 'عام',
                addedBy: linkData.addedBy || 'admin',
                addedDate: new Date().toISOString()
            };

            // إضافة الرابط إلى القائمة
            this.links.push(newLink);

            // حفظ القائمة المحدثة
            this.saveLinks(this.links);

            return {
                success: true,
                message: 'تمت إضافة الرابط بنجاح',
                link: newLink
            };
        } catch (error) {
            console.error('خطأ في إضافة رابط Onion:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء إضافة الرابط'
            };
        }
    }

    /**
     * تحديث رابط Onion موجود
     * @param {string} linkId - معرف الرابط
     * @param {Object} linkData - بيانات الرابط المحدثة
     * @returns {Object} - نتيجة العملية
     */
    updateLink(linkId, linkData) {
        try {
            // البحث عن الرابط
            const linkIndex = this.links.findIndex(link => link.id === linkId);
            if (linkIndex === -1) {
                return {
                    success: false,
                    message: 'الرابط غير موجود'
                };
            }

            // التحقق من صحة الرابط
            if (linkData.url && !this.isValidOnionUrl(linkData.url)) {
                return {
                    success: false,
                    message: 'يرجى إدخال رابط onion صحيح'
                };
            }

            // تحديث بيانات الرابط
            this.links[linkIndex] = {
                ...this.links[linkIndex],
                name: linkData.name || this.links[linkIndex].name,
                url: linkData.url || this.links[linkIndex].url,
                description: linkData.description !== undefined ? linkData.description : this.links[linkIndex].description,
                category: linkData.category || this.links[linkIndex].category
            };

            // حفظ القائمة المحدثة
            this.saveLinks(this.links);

            return {
                success: true,
                message: 'تم تحديث الرابط بنجاح',
                link: this.links[linkIndex]
            };
        } catch (error) {
            console.error('خطأ في تحديث رابط Onion:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء تحديث الرابط'
            };
        }
    }

    /**
     * حذف رابط Onion
     * @param {string} linkId - معرف الرابط
     * @returns {Object} - نتيجة العملية
     */
    deleteLink(linkId) {
        try {
            // البحث عن الرابط
            const linkIndex = this.links.findIndex(link => link.id === linkId);
            if (linkIndex === -1) {
                return {
                    success: false,
                    message: 'الرابط غير موجود'
                };
            }

            // حذف الرابط من القائمة
            this.links.splice(linkIndex, 1);

            // حفظ القائمة المحدثة
            this.saveLinks(this.links);

            return {
                success: true,
                message: 'تم حذف الرابط بنجاح'
            };
        } catch (error) {
            console.error('خطأ في حذف رابط Onion:', error);
            return {
                success: false,
                message: 'حدث خطأ أثناء حذف الرابط'
            };
        }
    }

    /**
     * التحقق من صحة رابط Onion
     * @param {string} url - الرابط المراد التحقق منه
     * @returns {boolean} - هل الرابط صحيح
     */
    isValidOnionUrl(url) {
        // التحقق من أن الرابط يحتوي على .onion
        return url.includes('.onion');
    }

    /**
     * الحصول على فئات الروابط الفريدة
     * @returns {Array} - قائمة الفئات الفريدة
     */
    getUniqueCategories() {
        const categories = this.links.map(link => link.category);
        return [...new Set(categories)];
    }
}

// إنشاء كائن من نظام روابط Onion
const onionLinksSystem = new OnionLinksSystem();

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // إضافة مستمع لزر فتح نافذة روابط Onion
    const onionLinksBtn = document.getElementById('onion-links-btn');
    if (onionLinksBtn) {
        onionLinksBtn.addEventListener('click', openOnionLinksModal);
    }

    // إضافة مستمع لزر إضافة رابط جديد
    const addLinkBtn = document.getElementById('add-onion-link-btn');
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', showAddLinkForm);
    }

    // إضافة مستمع لنموذج إضافة رابط
    const addLinkForm = document.getElementById('add-onion-link-form');
    if (addLinkForm) {
        addLinkForm.addEventListener('submit', handleAddLinkFormSubmit);
    }
});

/**
 * فتح نافذة روابط Onion
 */
function openOnionLinksModal() {
    // التحقق من تسجيل الدخول
    if (typeof membershipSystem !== 'undefined' && membershipSystem.isLoggedIn) {
        if (!membershipSystem.isLoggedIn()) {
            showToast('يرجى تسجيل الدخول أولاً للوصول إلى روابط Onion', 'error');
            return;
        }
    }

    // تحديث قائمة الروابط
    updateOnionLinksList();

    // عرض النافذة
    const onionLinksModal = document.getElementById('onion-links-modal');
    if (onionLinksModal) {
        const bsModal = new bootstrap.Modal(onionLinksModal);
        bsModal.show();
    }
}

/**
 * تحديث قائمة روابط Onion
 */
function updateOnionLinksList() {
    const linksContainer = document.getElementById('onion-links-container');
    if (!linksContainer) return;

    // الحصول على جميع الروابط
    const links = onionLinksSystem.getAllLinks();

    // الحصول على الفئات الفريدة
    const categories = onionLinksSystem.getUniqueCategories();

    // إنشاء HTML لعرض الروابط مقسمة حسب الفئات
    let html = '';

    categories.forEach(category => {
        // الحصول على روابط الفئة الحالية
        const categoryLinks = onionLinksSystem.getLinksByCategory(category);

        // إضافة عنوان الفئة
        html += `
            <div class="onion-category mb-4">
                <h5 class="category-title">
                    <i class="fas fa-folder me-2"></i>${category}
                </h5>
                <div class="onion-links-list">
        `;

        // إضافة الروابط
        categoryLinks.forEach(link => {
            html += `
                <div class="onion-link-card" data-link-id="${link.id}">
                    <div class="onion-link-header">
                        <h6 class="onion-link-name">${link.name}</h6>
                        <div class="onion-link-actions admin-only" style="display: none;">
                            <button class="btn btn-sm btn-outline-primary edit-link-btn" data-link-id="${link.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-link-btn" data-link-id="${link.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="onion-link-url">
                        <code>${link.url}</code>
                        <button class="btn btn-sm btn-outline-success copy-link-btn" data-link="${link.url}">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p class="onion-link-description">${link.description}</p>
                </div>
            `;
        });

        // إغلاق عناصر الفئة
        html += `
                </div>
            </div>
        `;
    });

    // إضافة HTML إلى الحاوية
    linksContainer.innerHTML = html;

    // إضافة مستمعي الأحداث للأزرار
    addLinkButtonsEventListeners();

    // تحديث واجهة المستخدم بناءً على صلاحيات المستخدم
    updateUIBasedOnUserRole();
}

/**
 * إضافة مستمعي الأحداث لأزرار الروابط
 */
function addLinkButtonsEventListeners() {
    // أزرار نسخ الروابط
    document.querySelectorAll('.copy-link-btn').forEach(button => {
        button.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            copyToClipboard(link);
        });
    });

    // أزرار تعديل الروابط
    document.querySelectorAll('.edit-link-btn').forEach(button => {
        button.addEventListener('click', function() {
            const linkId = this.getAttribute('data-link-id');
            showEditLinkForm(linkId);
        });
    });

    // أزرار حذف الروابط
    document.querySelectorAll('.delete-link-btn').forEach(button => {
        button.addEventListener('click', function() {
            const linkId = this.getAttribute('data-link-id');
            confirmDeleteLink(linkId);
        });
    });
}

/**
 * تحديث واجهة المستخدم بناءً على صلاحيات المستخدم
 */
function updateUIBasedOnUserRole() {
    // التحقق من صلاحيات المشرف
    const isAdmin = typeof membershipSystem !== 'undefined' && 
                    typeof membershipSystem.isAdminUser === 'function' && 
                    membershipSystem.isAdminUser();

    // إظهار/إخفاء عناصر المشرف
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'flex' : 'none';
    });

    // إظهار/إخفاء زر إضافة رابط جديد
    const addLinkBtn = document.getElementById('add-onion-link-btn');
    if (addLinkBtn) {
        addLinkBtn.style.display = isAdmin ? 'block' : 'none';
    }
}

/**
 * عرض نموذج إضافة رابط جديد
 */
function showAddLinkForm() {
    // إعادة تعيين النموذج
    const form = document.getElementById('add-onion-link-form');
    if (form) {
        form.reset();
        form.setAttribute('data-mode', 'add');
        form.removeAttribute('data-link-id');
    }

    // تغيير عنوان النموذج
    const formTitle = document.getElementById('link-form-title');
    if (formTitle) {
        formTitle.textContent = 'إضافة رابط Onion جديد';
    }

    // تغيير نص زر الإرسال
    const submitBtn = document.getElementById('link-form-submit');
    if (submitBtn) {
        submitBtn.textContent = 'إضافة';
    }

    // عرض النموذج
    const linkFormModal = document.getElementById('onion-link-form-modal');
    if (linkFormModal) {
        const bsModal = new bootstrap.Modal(linkFormModal);
        bsModal.show();
    }
}

/**
 * عرض نموذج تعديل رابط
 * @param {string} linkId - معرف الرابط
 */
function showEditLinkForm(linkId) {
    // الحصول على بيانات الرابط
    const link = onionLinksSystem.getAllLinks().find(l => l.id === linkId);
    if (!link) return;

    // ملء النموذج ببيانات الرابط
    const form = document.getElementById('add-onion-link-form');
    if (form) {
        form.setAttribute('data-mode', 'edit');
        form.setAttribute('data-link-id', linkId);

        document.getElementById('link-name').value = link.name;
        document.getElementById('link-url').value = link.url;
        document.getElementById('link-description').value = link.description;
        document.getElementById('link-category').value = link.category;
    }

    // تغيير عنوان النموذج
    const formTitle = document.getElementById('link-form-title');
    if (formTitle) {
        formTitle.textContent = 'تعديل رابط Onion';
    }

    // تغيير نص زر الإرسال
    const submitBtn = document.getElementById('link-form-submit');
    if (submitBtn) {
        submitBtn.textContent = 'تحديث';
    }

    // عرض النموذج
    const linkFormModal = document.getElementById('onion-link-form-modal');
    if (linkFormModal) {
        const bsModal = new bootstrap.Modal(linkFormModal);
        bsModal.show();
    }
}

/**
 * معالجة إرسال نموذج إضافة/تعديل رابط
 * @param {Event} event - حدث الإرسال
 */
function handleAddLinkFormSubmit(event) {
    event.preventDefault();

    // الحصول على بيانات النموذج
    const form = event.target;
    const mode = form.getAttribute('data-mode');
    const linkId = form.getAttribute('data-link-id');

    const linkData = {
        name: document.getElementById('link-name').value,
        url: document.getElementById('link-url').value,
        description: document.getElementById('link-description').value,
        category: document.getElementById('link-category').value
    };

    let result;

    // إضافة أو تعديل الرابط
    if (mode === 'edit' && linkId) {
        result = onionLinksSystem.updateLink(linkId, linkData);
    } else {
        result = onionLinksSystem.addLink(linkData);
    }

    // عرض رسالة النتيجة
    showToast(result.message, result.success ? 'success' : 'error');

    // إذا نجحت العملية، أغلق النموذج وحدث القائمة
    if (result.success) {
        // إغلاق النموذج
        const linkFormModal = bootstrap.Modal.getInstance(document.getElementById('onion-link-form-modal'));
        if (linkFormModal) {
            linkFormModal.hide();
        }

        // تحديث قائمة الروابط
        updateOnionLinksList();
    }
}

/**
 * تأكيد حذف رابط
 * @param {string} linkId - معرف الرابط
 */
function confirmDeleteLink(linkId) {
    // الحصول على بيانات الرابط
    const link = onionLinksSystem.getAllLinks().find(l => l.id === linkId);
    if (!link) return;

    // طلب تأكيد الحذف
    if (confirm(`هل أنت متأكد من حذف الرابط "${link.name}"؟`)) {
        const result = onionLinksSystem.deleteLink(linkId);
        showToast(result.message, result.success ? 'success' : 'error');

        // تحديث قائمة الروابط إذا نجحت العملية
        if (result.success) {
            updateOnionLinksList();
        }
    }
}

/**
 * نسخ نص إلى الحافظة
 * @param {string} text - النص المراد نسخه
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('تم نسخ الرابط إلى الحافظة', 'success');
        })
        .catch(err => {
            console.error('فشل في نسخ النص: ', err);
            showToast('فشل في نسخ الرابط', 'error');
        });
}

/**
 * تحديث قائمة روابط Onion في لوحة المشرف
 */
function updateAdminOnionLinks() {
    const adminLinksContainer = document.getElementById('admin-onion-links-container');
    if (!adminLinksContainer) return;

    // الحصول على جميع الروابط
    const links = onionLinksSystem.getAllLinks();

    // إنشاء جدول لعرض الروابط
    let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>الرابط</th>
                        <th>الفئة</th>
                        <th>تاريخ الإضافة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // إضافة صفوف الجدول
    links.forEach(link => {
        const addedDate = new Date(link.addedDate).toLocaleDateString();
        html += `
            <tr>
                <td>${link.name}</td>
                <td><code>${link.url}</code></td>
                <td>${link.category}</td>
                <td>${addedDate}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary admin-edit-link-btn" data-link-id="${link.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger admin-delete-link-btn" data-link-id="${link.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    // إغلاق الجدول
    html += `
                </tbody>
            </table>
        </div>
    `;

    // إضافة HTML إلى الحاوية
    adminLinksContainer.innerHTML = html;

    // إضافة مستمعي الأحداث للأزرار
    addAdminLinkButtonsEventListeners();
}

/**
 * إضافة مستمعي الأحداث لأزرار الروابط في لوحة المشرف
 */
function addAdminLinkButtonsEventListeners() {
    // أزرار تعديل الروابط
    document.querySelectorAll('.admin-edit-link-btn').forEach(button => {
        button.addEventListener('click', function() {
            const linkId = this.getAttribute('data-link-id');
            showEditLinkForm(linkId);
        });
    });

    // أزرار حذف الروابط
    document.querySelectorAll('.admin-delete-link-btn').forEach(button => {
        button.addEventListener('click', function() {
            const linkId = this.getAttribute('data-link-id');
            confirmDeleteLink(linkId);
        });
    });
}
