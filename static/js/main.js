document.addEventListener('DOMContentLoaded', function() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const enterBtn = document.getElementById('enterBtn');
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const invitationContainer = document.getElementById('invitationContainer');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const rsvpForm = document.getElementById('rsvpForm');
    const responseMessage = document.getElementById('responseMessage');
    const guestsCountGroup = document.getElementById('guestsCountGroup');

    // Функция запуска музыки
    function startMusic() {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        }).catch(e => console.log('Автовоспроизведение заблокировано:', e));
    }

    // Клик на кнопку "Открыть приглашение" - запускает музыку!
    enterBtn.addEventListener('click', function() {
        // Запускаем музыку сразу при клике
        startMusic();

        // Скрываем welcome экран
        welcomeScreen.classList.add('hidden');

        // Показываем конверт
        envelopeContainer.classList.remove('hidden');
        envelopeContainer.classList.add('visible');
    });

    // Открытие конверта
    envelope.addEventListener('click', function() {
        envelope.classList.add('open');

        // Скрытие конверта и показ приглашения
        setTimeout(() => {
            envelopeContainer.classList.add('hidden');
            invitationContainer.classList.add('visible');
        }, 800);
    });

    // Управление музыкой
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

    // ... existing code ... (остальной код без изменений)

    // Показ/скрытие поля количества гостей
    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', function() {
            guestsCountGroup.style.display = this.value === 'yes' ? 'block' : 'none';
        });
    });

    // Отправка формы
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

            responseMessage.textContent = data.message;
            responseMessage.className = 'response-message ' + (data.success ? 'success' : 'error');

            if (data.success) {
                rsvpForm.reset();
                if (willAttend) {
                    createConfetti();
                }
            }
        } catch (error) {
            responseMessage.textContent = 'Произошла ошибка. Попробуйте ещё раз.';
            responseMessage.className = 'response-message error';
        }
    });

    // Эффект конфетти
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
});