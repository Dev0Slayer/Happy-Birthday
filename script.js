// Particle.js Configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1']
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.3,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 1,
                sync: false
            }
        },
        line_linked: {
            enable: false
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'top',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'bubble'
            },
            onclick: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 100,
                size: 6,
                duration: 0.3,
                opacity: 1,
                speed: 3
            },
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    retina_detect: true
});

// Birthday Card Interaction
document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('birthday-card');
    let isFlipped = false;
    const music = document.getElementById('bg-music');
    if (music) {
        music.muted = false;
        music.volume = 1.0;

        const tryPlay = () => {
            const p = music.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => {});
            }
        };

        // Attempt immediately
        tryPlay();
        // Attempt on window load
        window.addEventListener('load', tryPlay, { once: true });
        // Attempt when tab becomes visible
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') tryPlay();
        });
        // Attempt on first interactions (without showing any UI)
        ['click', 'mousedown', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
            document.addEventListener(evt, tryPlay, { once: true, passive: true });
        });
        // A few timed retries
        let attempts = 0;
        const intervalId = setInterval(() => {
            tryPlay();
            attempts += 1;
            if (attempts >= 5) clearInterval(intervalId);
        }, 1000);
    }

    // Slide-to-open interaction
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const front = card.querySelector('.card-front');

    const onDragStart = (x) => {
        isDragging = true;
        startX = x;
        currentX = x;
        card.classList.add('dragging');
    };
    const onDragMove = (x) => {
        if (!isDragging || isFlipped) return;
        currentX = x;
        const delta = Math.max(0, currentX - startX);
        front.style.transform = `translateX(${delta}px)`;
    };
    const onDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        const delta = Math.max(0, currentX - startX);
        const threshold = card.clientWidth * 0.35;
        if (delta > threshold) {
            // Open
            card.classList.add('slide-open');
            isFlipped = true;
            front.style.transform = '';
            setTimeout(() => {
                showFriendlyMessage();
                burstConfetti();
            }, 600);
            if (music) { music.play().catch(() => {}); }
        } else {
            // Snap back
            front.style.transform = '';
        }
    };

    // Mouse events
    front.addEventListener('mousedown', (e) => onDragStart(e.clientX));
    window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
    window.addEventListener('mouseup', onDragEnd);
    // Touch events
    front.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', onDragEnd);

    // Friendly messages that appear when card is opened
    function showFriendlyMessage() {
        const messages = [
            "🎉 Happy Birthday! Wishing you a day full of fun!",
            "🎂 Hope your year is packed with wins and good vibes!",
            "🎈 Here's to more laughs and great memories ahead!",
            "🥳 So glad to have you as a friend. Enjoy your day!",
            "🎁 May your birthday be as awesome as you are!",
            "🍰 Celebrate big today—you deserve it!",
            "✨ Keep shining and smashing your goals this year!"
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showPopupMessage(randomMessage);
    }

    function showPopupMessage(message) {
        const popup = document.createElement('div');
        popup.textContent = message;
        popup.style.cssText = `
            position: fixed;
            top: 55%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff69b4, #ff1493);
            color: white;
            padding: 20px 30px;
            border-radius: 25px;
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            animation: popupFadeIn 0.5s ease-out;
            text-align: center;
            max-width: 400px;
            line-height: 1.4;
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.animation = 'popupFadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 500);
        }, 3000);
    }

    // Click anywhere to create hearts
    document.addEventListener('click', function(e) {
        // Don't create hearts when clicking on the card itself
        if (!e.target.closest('#birthday-card')) {
            createClickHeart(e.clientX, e.clientY);
        }
        if (music) { music.play().catch(() => {}); }
    });

    function createClickHeart(x, y) {
        const confetti = ['🎉', '🎈', '🥳', '🎂', '🎁'];
        const icon = document.createElement('div');
        
        icon.textContent = confetti[Math.floor(Math.random() * confetti.length)];
        icon.className = 'click-heart';
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';

        document.body.appendChild(icon);

        setTimeout(() => {
            document.body.removeChild(icon);
        }, 1500);
    }

    // Smooth scrolling for sections
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.querySelector('.card-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.section-title, .birthday-card, .thank-you-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
});

// Add CSS for popup animations
const style = document.createElement('style');
style.textContent = `
    @keyframes popupFadeIn {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    @keyframes popupFadeOut {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
        }
    }
`;
document.head.appendChild(style);

// Add some extra interactive elements
document.addEventListener('mousemove', function(e) {
    // Create subtle mouse trail effect
    if (Math.random() > 0.98) {
        createMouseTrail(e.clientX, e.clientY);
    }
});

function createMouseTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #ff69b4, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: trailFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        document.body.removeChild(trail);
    }, 1000);
}

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(3);
        }
    }
`;
document.head.appendChild(trailStyle);

// Simple confetti burst
function burstConfetti() {
    const emojis = ['🎉','🎈','✨','🎊','🥳'];
    for (let i = 0; i < 25; i++) {
        const node = document.createElement('div');
        node.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        node.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: -10vh;
            font-size: ${Math.random() * 14 + 16}px;
            transform: translateY(0) rotate(0deg);
            animation: confettiFall ${Math.random() * 1 + 1.5}s ease-out forwards;
            z-index: 1000;
        `;
        document.body.appendChild(node);
        setTimeout(() => node.remove(), 2500);
    }
}

// Add confetti animation style
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
@keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}
`;
document.head.appendChild(confettiStyle);