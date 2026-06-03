document.addEventListener('DOMContentLoaded', function() {
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
});