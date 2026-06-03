document.addEventListener('DOMContentLoaded', function() {
    const translations = {
        kk: {
            pageTitle: 'Alfarabi & Nuray үйлену тойы 💍',
            welcomeTitle: 'Шақыру билеті',
            tapToOpen: 'Ашу үшін басыңыз',
            receivedText: 'Сіз шақыру алдыңыз. басыңыз',
            openButton: 'БАСЫҢЫЗ',
            hintText: 'Шақыруды ашу үшін «БАСЫҢЫЗ» батырмасын басыңыз.',
            weddingTitle: 'Үйлену той',
            invitationText: 'Құрметті достар мен жақындар!<br>Сіздерді өміріміздегі ең маңызды күнді<br>бірге бөлісуге шақырамыз!',
            dateLabel: 'Күні',
            day: 'Сенбі',
            locationLabel: 'Өтетін орны',
            city: 'Астана қ.',
            mapLink: '📍 2ГИС картасынан ашу',
            guestGathering: 'Қонақтарды қарсы алу',
            startTime: 'Басталуы',
            rsvpTitle: 'Қатысуыңызды растаңыз',
            firstNamePlaceholder: 'Атыңыз',
            lastNamePlaceholder: 'Тегіңіз',
            attendanceQuestion: 'Сіз келе аласыз ба?',
            attendanceYes: 'Иә, қуана келемін! 🎉',
            attendanceNo: 'Өкінішке қарай, келе алмаймын 😢',
            guestsCountLabel: 'Қонақтар саны — өзіңізді қоса алғанда',
            messageLabel: 'Жас жұбайларға тілек — міндетті емес',
            messagePlaceholder: 'Тілегіңізді жазыңыз...',
            submitButton: 'Жауап жіберу 💌',
            footerText: 'Сіздерді сүйіспеншілікпен және асыға күтеміз!',
            requestError: 'Қате орын алды. Қайтадан көріңіз.',
            autoplayBlocked: 'Автоойнату бұғатталды:'
        },
        ru: {
            pageTitle: 'Свадьба Alfarabi & Nuray 💍',
            welcomeTitle: 'Пригласительный билет',
            tapToOpen: 'Нажмите, чтобы открыть',
            receivedText: 'Вы получили приглашение. Нажмите',
            openButton: 'ОТКРЫТЬ',
            hintText: 'Нажмите кнопку «ОТКРЫТЬ», чтобы открыть приглашение.',
            weddingTitle: 'Свадьба',
            invitationText: 'Дорогие друзья и близкие!<br>Мы рады пригласить вас разделить с нами<br>самый важный день в нашей жизни!',
            dateLabel: 'Дата',
            day: 'Суббота',
            locationLabel: 'Место проведения',
            city: 'г. Астана',
            mapLink: '📍 Открыть на карте 2ГИС',
            guestGathering: 'Сбор гостей',
            startTime: 'Начало',
            rsvpTitle: 'Подтвердите своё присутствие',
            firstNamePlaceholder: 'Ваше имя',
            lastNamePlaceholder: 'Ваша фамилия',
            attendanceQuestion: 'Вы сможете присутствовать?',
            attendanceYes: 'Да, с радостью! 🎉',
            attendanceNo: 'К сожалению, нет 😢',
            guestsCountLabel: 'Количество гостей — включая вас',
            messageLabel: 'Пожелание молодожёнам — необязательно',
            messagePlaceholder: 'Напишите ваше пожелание...',
            submitButton: 'Отправить ответ 💌',
            footerText: 'С любовью и нетерпением ждём вас!',
            requestError: 'Произошла ошибка. Попробуйте ещё раз.',
            autoplayBlocked: 'Автовоспроизведение заблокировано:'
        }
    };

    let currentLang = document.body.dataset.lang || localStorage.getItem('siteLang') || 'kk';

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('siteLang', lang);
        document.documentElement.lang = lang;
        document.body.dataset.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.dataset.i18nHtml;
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-lang-switch]').forEach(button => {
            button.classList.toggle('active', button.dataset.langSwitch === lang);
        });

        document.title = translations[lang].pageTitle;
    }

    const envelopeScreen = document.getElementById('envelopeScreen');
    const envelopeButton = document.getElementById('envelopeButton');
    const invitationContainer = document.getElementById('invitationContainer');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const rsvpForm = document.getElementById('rsvpForm');
    const responseMessage = document.getElementById('responseMessage');
    const guestsCountGroup = document.getElementById('guestsCountGroup');

    document.querySelectorAll('[data-lang-switch]').forEach(button => {
        button.addEventListener('click', function() {
            applyLanguage(this.dataset.langSwitch);
        });
    });

    applyLanguage(currentLang);

    function startMusic() {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        }).catch(e => console.log(translations[currentLang].autoplayBlocked, e));
    }

    let isOpening = false;

    function openInvitation() {
        if (isOpening) return;
        isOpening = true;

        envelopeScreen.classList.add('opening');

        setTimeout(() => {
            startMusic();
        }, 600);

        setTimeout(() => {
            envelopeScreen.classList.add('hidden');
            invitationContainer.classList.add('visible');
        }, 2200);
    }

    envelopeButton.addEventListener('click', openInvitation);
    envelopeButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openInvitation();
        }
    });

    let isPlaying = false;
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.textContent = '🔇';
        } else {
            bgMusic.play();
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        }
        isPlaying = !isPlaying;
    });

    bgMusic.addEventListener('play', () => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.textContent = '🎵';
    });

    bgMusic.addEventListener('pause', () => {
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.textContent = '🔇';
    });

    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', function() {
            guestsCountGroup.style.display = this.value === 'yes' ? 'block' : 'none';
        });
    });

    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const willAttend = document.querySelector('input[name="attendance"]:checked').value === 'yes';
        const guestsCount = document.getElementById('guestsCount').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch('/rsvp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    willAttend,
                    guestsCount,
                    message,
                    lang: currentLang
                })
            });

            const data = await response.json();

            responseMessage.textContent = data.message || data.error;
            responseMessage.className = 'response-message ' + (data.success ? 'success' : 'error');

            if (data.success) {
                rsvpForm.reset();
                guestsCountGroup.style.display = 'block';

                if (willAttend) {
                    createConfetti();
                }
            }
        } catch (error) {
            responseMessage.textContent = translations[currentLang].requestError;
            responseMessage.className = 'response-message error';
        }
    });

    function createConfetti() {
        const colors = ['#4a90d9', '#60a5fa', '#93c5fd', '#dbeafe', '#ffffff'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
                animation: fall ${2 + Math.random() * 3}s linear forwards;
            `;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }

        if (!document.getElementById('confettiStyles')) {
            const style = document.createElement('style');
            style.id = 'confettiStyles';
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
