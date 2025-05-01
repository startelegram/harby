/**
 * نظام هجمات DDoS المتقدم
 * يوفر واجهة متطورة لمحاكاة هجمات DDoS لأغراض الاختبار والتعلم
 */

// وظيفة لعرض أداة هجمات DDoS
function showDdosAttackTool() {
    // التحقق من وجود مستخدم مسجل الدخول
    if (typeof membershipSystem !== 'undefined' && membershipSystem.isLoggedIn) {
        if (!membershipSystem.isLoggedIn()) {
            // إظهار رسالة تنبيه للمستخدمين غير المسجلين
            if (typeof showNotification === 'function') {
                showNotification('يجب تسجيل الدخول أولاً لاستخدام ميزة هجمات DDoS', 'info');
            } else if (typeof showMessage === 'function') {
                showMessage('يجب تسجيل الدخول أولاً لاستخدام ميزة هجمات DDoS', 'info');
            } else {
                alert('يجب تسجيل الدخول أولاً لاستخدام ميزة هجمات DDoS');
            }

            // فتح نافذة تسجيل الدخول
            try {
                const loginModal = new bootstrap.Modal(document.getElementById('login-modal'));
                loginModal.show();
            } catch (error) {
                console.error("خطأ في فتح نافذة تسجيل الدخول:", error);
            }
            return;
        }
    }

    // إنشاء نافذة الهجوم
    const ddosModal = document.createElement('div');
    ddosModal.className = 'modal fade';
    ddosModal.id = 'ddos-attack-modal';
    ddosModal.tabIndex = '-1';
    ddosModal.setAttribute('aria-labelledby', 'ddos-attack-modal-label');
    ddosModal.setAttribute('aria-hidden', 'true');

    ddosModal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content dark-modal">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="ddos-attack-modal-label">
                        <i class="fas fa-network-wired me-2"></i>أداة هجمات DDoS المتقدمة
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                </div>
                <div class="modal-body px-4 py-4">
                    <div class="ddos-container">
                        <div class="ddos-header">
                            <div class="ddos-title">
                                <i class="fas fa-shield-virus"></i>
                                أداة محاكاة هجمات DDoS
                            </div>
                            <div class="ddos-status" id="ddos-status-indicator">
                                <i class="fas fa-circle"></i>
                                جاهز للتشغيل
                            </div>
                        </div>

                        <div class="alert alert-danger mb-4" style="background: rgba(220, 53, 69, 0.1); border-color: #dc3545;">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                                <div>
                                    <strong>تحذير أمني:</strong> استخدام هذه الأداة ضد مواقع غير مصرح لك باختبارها يعتبر غير قانوني. استخدم هذه الأداة فقط على المواقع التي تملك إذناً لاختبارها.
                                </div>
                            </div>
                        </div>

                        <form id="ddos-form">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="ddos-form-group">
                                        <label for="target-url">عنوان URL المستهدف</label>
                                        <input type="url" class="ddos-input" id="target-url" placeholder="https://example.com" required>
                                        <small class="text-muted d-block mt-2">أدخل عنوان URL كامل للهدف المراد اختباره</small>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="ddos-form-group">
                                        <label for="attack-method">طريقة الهجوم</label>
                                        <select class="ddos-select" id="attack-method" required>
                                            <option value="" selected disabled>اختر طريقة الهجوم</option>
                                            <option value="syn-flood">SYN Flood</option>
                                            <option value="http-flood">HTTP Flood</option>
                                            <option value="udp-flood">UDP Flood</option>
                                            <option value="slowloris">Slowloris</option>
                                            <option value="amplification">DNS Amplification</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="ddos-form-group">
                                        <label for="threads-count">عدد الاتصالات المتزامنة</label>
                                        <input type="number" class="ddos-input" id="threads-count" min="1" max="1000" value="100" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="ddos-form-group">
                                        <label for="attack-duration">مدة الهجوم (بالثواني)</label>
                                        <input type="number" class="ddos-input" id="attack-duration" min="5" max="300" value="30" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="ddos-form-group">
                                        <label for="packet-size">حجم الحزمة (بالبايت)</label>
                                        <input type="number" class="ddos-input" id="packet-size" min="64" max="65535" value="1024" required>
                                    </div>
                                </div>
                            </div>

                            <div class="ddos-form-group">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="use-proxy" checked>
                                    <label for="use-proxy" class="form-check-label">
                                        استخدام بروكسي لإخفاء الهوية
                                    </label>
                                </div>
                            </div>
                        </form>

                        <div class="ddos-progress-container">
                            <label>تقدم الهجوم</label>
                            <div class="ddos-progress">
                                <div class="ddos-progress-bar" id="attack-progress" style="width: 0%"></div>
                            </div>
                            <div class="ddos-progress-text" id="attack-status">جاهز للبدء</div>
                        </div>

                        <div class="ddos-log-container" id="attack-log-container" style="display: none;">
                            <div class="ddos-log-title">
                                <i class="fas fa-terminal"></i>
                                سجل الهجوم
                            </div>
                            <div id="attack-log">
                                <!-- سيتم ملؤه بواسطة JavaScript -->
                            </div>
                        </div>

                        <div class="d-flex justify-content-between mt-4">
                            <button type="button" class="ddos-button" id="start-attack-btn">
                                <i class="fas fa-rocket"></i> بدء الهجوم
                            </button>
                            <button type="button" class="ddos-button stop" id="stop-attack-btn" disabled>
                                <i class="fas fa-stop-circle"></i> إيقاف الهجوم
                            </button>
                        </div>

                        <div class="ddos-methods-container">
                            <div class="ddos-methods-title">معلومات عن طرق الهجوم</div>
                            <div class="ddos-methods-accordion accordion" id="attackMethodsAccordion">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingSyn">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSyn" aria-expanded="false" aria-controls="collapseSyn">
                                            SYN Flood
                                        </button>
                                    </h2>
                                    <div id="collapseSyn" class="accordion-collapse collapse" aria-labelledby="headingSyn" data-bs-parent="#attackMethodsAccordion">
                                        <div class="accordion-body">
                                            هجوم SYN Flood يستهدف بروتوكول TCP من خلال إرسال حزم SYN بشكل متكرر دون إكمال المصافحة الثلاثية، مما يؤدي إلى استنفاد موارد الخادم.
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingHttp">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHttp" aria-expanded="false" aria-controls="collapseHttp">
                                            HTTP Flood
                                        </button>
                                    </h2>
                                    <div id="collapseHttp" class="accordion-collapse collapse" aria-labelledby="headingHttp" data-bs-parent="#attackMethodsAccordion">
                                        <div class="accordion-body">
                                            هجوم HTTP Flood يستهدف خوادم الويب من خلال إرسال عدد كبير من طلبات HTTP GET أو POST، مما يؤدي إلى استنفاد موارد الخادم.
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingUdp">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUdp" aria-expanded="false" aria-controls="collapseUdp">
                                            UDP Flood
                                        </button>
                                    </h2>
                                    <div id="collapseUdp" class="accordion-collapse collapse" aria-labelledby="headingUdp" data-bs-parent="#attackMethodsAccordion">
                                        <div class="accordion-body">
                                            هجوم UDP Flood يستهدف بروتوكول UDP من خلال إرسال حزم UDP كبيرة أو متعددة إلى منافذ عشوائية على الخادم المستهدف، مما يؤدي إلى استنفاد عرض النطاق الترددي.
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingSlowloris">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSlowloris" aria-expanded="false" aria-controls="collapseSlowloris">
                                            Slowloris
                                        </button>
                                    </h2>
                                    <div id="collapseSlowloris" class="accordion-collapse collapse" aria-labelledby="headingSlowloris" data-bs-parent="#attackMethodsAccordion">
                                        <div class="accordion-body">
                                            هجوم Slowloris يستهدف خوادم الويب من خلال فتح اتصالات متعددة وإبقائها مفتوحة لأطول فترة ممكنة عن طريق إرسال بيانات HTTP جزئية، مما يؤدي إلى استنفاد موارد الخادم.
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingAmplification">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAmplification" aria-expanded="false" aria-controls="collapseAmplification">
                                            DNS Amplification
                                        </button>
                                    </h2>
                                    <div id="collapseAmplification" class="accordion-collapse collapse" aria-labelledby="headingAmplification" data-bs-parent="#attackMethodsAccordion">
                                        <div class="accordion-body">
                                            هجوم DNS Amplification يستغل خوادم DNS المفتوحة لتضخيم حجم البيانات المرسلة إلى الهدف، حيث يتم إرسال طلبات DNS صغيرة باستخدام عنوان IP مزيف (الهدف)، مما يؤدي إلى إرسال ردود كبيرة إلى الهدف.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // إضافة النافذة إلى الصفحة
    document.body.appendChild(ddosModal);

    // تهيئة النافذة
    const ddosModalElement = new bootstrap.Modal(document.getElementById('ddos-attack-modal'));
    ddosModalElement.show();

    // إضافة مستمعي الأحداث
    const startAttackBtn = document.getElementById('start-attack-btn');
    const stopAttackBtn = document.getElementById('stop-attack-btn');
    const attackProgress = document.getElementById('attack-progress');
    const attackStatus = document.getElementById('attack-status');
    const attackLog = document.getElementById('attack-log');
    const attackLogContainer = document.getElementById('attack-log-container');
    const ddosStatusIndicator = document.getElementById('ddos-status-indicator');

    let attackInterval;
    let isAttacking = false;

    // بدء الهجوم
    startAttackBtn.addEventListener('click', function() {
        const targetUrl = document.getElementById('target-url').value;
        const attackMethod = document.getElementById('attack-method').value;
        const threadsCount = document.getElementById('threads-count').value;
        const attackDuration = document.getElementById('attack-duration').value;

        if (!targetUrl || !attackMethod) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        // تغيير حالة الأزرار
        startAttackBtn.disabled = true;
        stopAttackBtn.disabled = false;
        isAttacking = true;

        // تحديث مؤشر الحالة
        ddosStatusIndicator.innerHTML = '<i class="fas fa-circle"></i> جاري الهجوم';
        ddosStatusIndicator.classList.add('active');

        // إظهار سجل الهجوم
        attackLogContainer.style.display = 'block';

        // إضافة سجلات بدء الهجوم
        addLogEntry(`[${getCurrentTime()}] بدء هجوم ${getAttackMethodName(attackMethod)} على ${targetUrl}`);
        addLogEntry(`[${getCurrentTime()}] تهيئة ${threadsCount} اتصال متزامن...`);

        // محاكاة تقدم الهجوم
        let progress = 0;
        const totalDuration = attackDuration * 1000; // تحويل إلى مللي ثانية
        const updateInterval = 500; // تحديث كل 500 مللي ثانية
        const progressIncrement = (updateInterval / totalDuration) * 100;

        attackInterval = setInterval(function() {
            if (progress >= 100) {
                clearInterval(attackInterval);
                completeAttack();
                return;
            }

            progress += progressIncrement;
            if (progress > 100) progress = 100;

            // تحديث شريط التقدم
            attackProgress.style.width = `${progress}%`;
            attackProgress.setAttribute('aria-valuenow', progress);

            // تحديث حالة الهجوم
            if (progress < 25) {
                attackStatus.textContent = 'جاري إرسال الحزم...';
            } else if (progress < 50) {
                attackStatus.textContent = 'تم إرسال 10,000+ حزمة...';
            } else if (progress < 75) {
                attackStatus.textContent = 'الهدف يستجيب ببطء...';
            } else {
                attackStatus.textContent = 'الهدف تحت ضغط عالي...';
            }

            // إضافة سجلات عشوائية
            if (Math.random() > 0.7) {
                addRandomLogEntry(attackMethod);
            }

        }, updateInterval);
    });

    // إيقاف الهجوم
    stopAttackBtn.addEventListener('click', function() {
        if (isAttacking) {
            clearInterval(attackInterval);
            addLogEntry(`[${getCurrentTime()}] تم إيقاف الهجوم بواسطة المستخدم`);
            attackStatus.textContent = 'تم إيقاف الهجوم';
            startAttackBtn.disabled = false;
            stopAttackBtn.disabled = true;
            isAttacking = false;

            // تحديث مؤشر الحالة
            ddosStatusIndicator.innerHTML = '<i class="fas fa-circle"></i> تم الإيقاف';
            ddosStatusIndicator.classList.remove('active');
        }
    });

    // إكمال الهجوم
    function completeAttack() {
        addLogEntry(`[${getCurrentTime()}] اكتمل الهجوم`);
        addLogEntry(`[${getCurrentTime()}] إجمالي الحزم المرسلة: ${Math.floor(Math.random() * 900000) + 100000}`);
        attackStatus.textContent = 'اكتمل الهجوم';
        startAttackBtn.disabled = false;
        stopAttackBtn.disabled = true;
        isAttacking = false;

        // تحديث مؤشر الحالة
        ddosStatusIndicator.innerHTML = '<i class="fas fa-circle"></i> اكتمل الهجوم';
        ddosStatusIndicator.classList.remove('active');
    }

    // إضافة سجل جديد
    function addLogEntry(text) {
        const logEntry = document.createElement('div');
        logEntry.className = 'ddos-log-entry';

        // تحديد نوع السجل بناءً على محتواه
        if (text.includes('خطأ') || text.includes('فشل') || text.includes('رفض')) {
            logEntry.classList.add('error');
        } else if (text.includes('نجاح') || text.includes('اكتمل')) {
            logEntry.classList.add('success');
        } else if (text.includes('تحذير')) {
            logEntry.classList.add('warning');
        } else if (text.includes('تهيئة') || text.includes('بدء')) {
            logEntry.classList.add('info');
        }

        logEntry.textContent = text;
        attackLog.appendChild(logEntry);
        attackLog.scrollTop = attackLog.scrollHeight;
    }

    // إضافة سجل عشوائي بناءً على نوع الهجوم
    function addRandomLogEntry(attackMethod) {
        const entries = {
            'syn-flood': [
                `[${getCurrentTime()}] إرسال حزم SYN... (${Math.floor(Math.random() * 1000) + 500} حزمة/ثانية)`,
                `[${getCurrentTime()}] تم رفض الاتصال من قبل الهدف`,
                `[${getCurrentTime()}] تجاوز طاقة منفذ TCP على الهدف`
            ],
            'http-flood': [
                `[${getCurrentTime()}] إرسال طلبات HTTP GET... (${Math.floor(Math.random() * 800) + 200} طلب/ثانية)`,
                `[${getCurrentTime()}] استجابة الخادم: 503 Service Unavailable`,
                `[${getCurrentTime()}] زمن الاستجابة: ${Math.floor(Math.random() * 9000) + 1000}ms`
            ],
            'udp-flood': [
                `[${getCurrentTime()}] إرسال حزم UDP... (${Math.floor(Math.random() * 2000) + 1000} حزمة/ثانية)`,
                `[${getCurrentTime()}] استنفاد عرض النطاق الترددي للهدف`,
                `[${getCurrentTime()}] تم إرسال ${Math.floor(Math.random() * 50) + 10}MB من البيانات`
            ],
            'slowloris': [
                `[${getCurrentTime()}] الحفاظ على ${Math.floor(Math.random() * 900) + 100} اتصال مفتوح`,
                `[${getCurrentTime()}] إرسال بيانات HTTP جزئية`,
                `[${getCurrentTime()}] تم استنفاد موارد الخادم`
            ],
            'amplification': [
                `[${getCurrentTime()}] استخدام ${Math.floor(Math.random() * 50) + 10} خادم DNS مفتوح`,
                `[${getCurrentTime()}] عامل التضخيم: ${Math.floor(Math.random() * 50) + 20}x`,
                `[${getCurrentTime()}] تم إرسال ${Math.floor(Math.random() * 100) + 50}MB من البيانات المضخمة`
            ]
        };

        // اختيار سجل عشوائي بناءً على نوع الهجوم
        const methodEntries = entries[attackMethod] || entries['http-flood'];
        const randomEntry = methodEntries[Math.floor(Math.random() * methodEntries.length)];

        addLogEntry(randomEntry);
    }

    // الحصول على الوقت الحالي بتنسيق HH:MM:SS
    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    // الحصول على اسم طريقة الهجوم بالعربية
    function getAttackMethodName(method) {
        const methods = {
            'syn-flood': 'SYN Flood',
            'http-flood': 'HTTP Flood',
            'udp-flood': 'UDP Flood',
            'slowloris': 'Slowloris',
            'amplification': 'DNS Amplification'
        };
        return methods[method] || method;
    }

    // إضافة مستمع لإزالة النافذة عند إغلاقها
    document.getElementById('ddos-attack-modal').addEventListener('hidden.bs.modal', function() {
        if (isAttacking) {
            clearInterval(attackInterval);
            isAttacking = false;
        }
        document.body.removeChild(ddosModal);
    });
}

// تم نقل الأنماط CSS إلى ملف ddos-attack-styles.css
