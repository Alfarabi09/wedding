document.addEventListener('DOMContentLoaded', function() {
    // Инициализация языков
    initLanguageSwitcher();
    
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const invitationContainer = document.getElementById('invitationContainer');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const rsvpForm = document.getElementById('rsvpForm');
    const responseMessage = document.getElementById('responseMessage');
    const guestsCountGroup = document.getElementById('guestsCountGroup');

    const countdownTarget = new Date('2026-08-08T17:00:00');
    const countdownDays = document.getElementById('countdownDays');
    const countdownHours = document.getElementById('countdownHours');
    const countdownMinutes = document.getElementById('countdownMinutes');
    const countdownSeconds = document.getElementById('countdownSeconds');

    function updateCountdown() {
        const now = new Date();
        const diff = countdownTarget - now;

        if (diff <= 0) {
            countdownDays.textContent = '0';
            countdownHours.textContent = '0';
            countdownMinutes.textContent = '0';
            countdownSeconds.textContent = '0';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdownDays.textContent = days;
        countdownHours.textContent = hours;
        countdownMinutes.textContent = minutes;
        countdownSeconds.textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    function startMusic() {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        }).catch(error => {
            console.warn('Автовоспроизведение заблокировано:', error);
        });
    }

    envelope.addEventListener('click', function() {
        startMusic();
        envelope.classList.add('open');

        setTimeout(() => {
            envelopeContainer.classList.add('hidden');
            invitationContainer.classList.add('visible');
        }, 800);
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
                    message
                })
            });

            const data = await response.json();

            if (data.success) {
                rsvpForm.reset();
                guestsCountGroup.style.display = 'block';

                if (willAttend) {
                    // Показываем красивую анимацию успеха для тех, кто придет
                    showSuccessPopup(data.message, firstName);
                } else {
                    // Простое сообщение для тех, кто не придет
                    responseMessage.textContent = data.message || data.error;
                    responseMessage.className = 'response-message success';
                }
            } else {
                responseMessage.textContent = data.message || data.error;
                responseMessage.className = 'response-message error';
            }
        } catch (error) {
            responseMessage.textContent = 'Произошла ошибка. Попробуйте ещё раз.';
            responseMessage.className = 'response-message error';
        }
    });

    function createConfetti() {
        const colors = ['#d4af37', '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8e53'];

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

    function showSuccessPopup(message, firstName) {
        // Создаем оверлей
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeInOverlay 0.3s ease;
        `;

        // Создаем попап
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: popupBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
            position: relative;
            z-index: 10001;
        `;

        // Эмодзи с анимацией
        const emoji = document.createElement('div');
        emoji.textContent = '🎉';
        emoji.style.cssText = `
            font-size: 80px;
            margin-bottom: 20px;
            display: inline-block;
            animation: emojiJump 0.8s ease infinite;
        `;

        // Заголовок
        const title = document.createElement('h2');
        title.textContent = `Спасибо, ${firstName}!`;
        title.style.cssText = `
            font-size: 28px;
            color: #333;
            margin: 20px 0;
            font-family: Georgia, serif;
        `;

        // Сообщение
        const msg = document.createElement('p');
        msg.textContent = message;
        msg.style.cssText = `
            font-size: 16px;
            color: #666;
            margin: 10px 0;
        `;

        // Кнопка закрытия
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Спасибо!';
        closeBtn.style.cssText = `
            background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            margin-top: 20px;
            transition: all 0.3s ease;
            font-family: 'Montserrat', sans-serif;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'scale(1.05)';
            closeBtn.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'scale(1)';
            closeBtn.style.boxShadow = 'none';
        });

        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        popup.appendChild(emoji);
        popup.appendChild(title);
        popup.appendChild(msg);
        popup.appendChild(closeBtn);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Добавляем анимации если их еще нет
        if (!document.getElementById('successPopupStyles')) {
            const style = document.createElement('style');
            style.id = 'successPopupStyles';
            style.textContent = `
                @keyframes fadeInOverlay {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes popupBounce {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes emojiJump {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-30px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Создаем конфетти
        createConfetti();

        // Автозакрытие через 5 секунд
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 5000);

        // Закрытие при клике на оверлей
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }
});

// Функция для переключения языков
function initLanguageSwitcher() {
    const langRuBtn = document.getElementById('langRu');
    const langKzBtn = document.getElementById('langKz');
    
    const currentLang = localStorage.getItem('language') || 'ru';
    setLanguage(currentLang);

    langRuBtn.addEventListener('click', () => setLanguage('ru'));
    langKzBtn.addEventListener('click', () => setLanguage('kz'));
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;

    // Обновляем кнопки
    document.getElementById('langRu').classList.toggle('active', lang === 'ru');
    document.getElementById('langKz').classList.toggle('active', lang === 'kz');

    // Обновляем текст на странице
    document.querySelectorAll('[data-ru][data-kz]').forEach(el => {
        const text = el.dataset[lang];
        if (text) {
            el.textContent = text;
        }
    });

    // Обновляем placeholders
    document.querySelectorAll('[data-placeholder-ru][data-placeholder-kz]').forEach(el => {
        el.placeholder = el.dataset[`placeholder${lang === 'ru' ? 'Ru' : 'Kz'}`];
    });

    // Обновляем текст кнопки отправить если необходимо
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn && submitBtn.dataset.ru && submitBtn.dataset.kz) {
        submitBtn.textContent = submitBtn.dataset[lang];
    }
}