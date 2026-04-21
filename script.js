gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================
// AUDIO - PREMIUM CLICK SOUND (BASE64)
// ============================================
const clickSound = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
const playClickSound = () => {
    try {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    } catch(e) {}
};

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;

const isMobile = window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(hover: none)').matches;

if (!isMobile) {
    cursorDot.classList.add('active');

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .social-icon, .skill-card, .cta-button, .submit-button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
    });
}

// ============================================
// PARTICLE CANVAS - GOLD DUST EFFECT
// ============================================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let canvasVisible = true;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;
    const connectionDist = 100;
    const maxSpeed = 2;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Pause when hero is off-screen
    const canvasObserver = new IntersectionObserver(([entry]) => {
        canvasVisible = entry.isIntersecting;
    }, { threshold: 0 });
    canvasObserver.observe(canvas);

    let pMouseX = 0;
    let pMouseY = 0;
    document.addEventListener('mousemove', (e) => {
        pMouseX = e.clientX;
        pMouseY = e.clientY;
    });

    const animateParticles = () => {
        if (!canvasVisible) {
            requestAnimationFrame(animateParticles);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update + draw particles in one batch
        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            p.update();

            const dx = pMouseX - p.x;
            const dy = pMouseY - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 150) {
                p.speedX += dx * 0.001;
                p.speedY += dy * 0.001;
            }
            p.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, p.speedX));
            p.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, p.speedY));

            ctx.fillStyle = `rgba(212,175,55,${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, 6.2832);
            ctx.fill();

            // Connections — only check forward
            for (let j = i + 1; j < particleCount; j++) {
                const q = particles[j];
                const cdx = p.x - q.x;
                const cdy = p.y - q.y;
                // Skip sqrt for far-away pairs
                const distSq = cdx * cdx + cdy * cdy;
                if (distSq < connectionDist * connectionDist) {
                    const d = Math.sqrt(distSq);
                    ctx.strokeStyle = `rgba(212,175,55,${0.2 * (1 - d / connectionDist)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles.forEach(p => {
                p.x = Math.random() * canvas.width;
                p.y = Math.random() * canvas.height;
            });
        }, 150);
    });
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
const phrases = [
    'Full-Stack Software Engineer.',
    'Building Real-Time Systems.',
    'React \u00b7 Node.js \u00b7 SAP \u00b7 Supabase.'
];

let phraseIndex = 0;
let charIndex = 0;
const typewriterElement = document.querySelector('.typewriter-text');

const type = () => {
    const currentPhrase = phrases[phraseIndex];

    if (charIndex < currentPhrase.length) {
        typewriterElement.textContent += currentPhrase[charIndex];
        charIndex++;
        setTimeout(type, 50);
    } else {
        setTimeout(() => {
            typewriterElement.textContent = '';
            charIndex = 0;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        }, 3000);
    }
};
type();

// ============================================
// BUTTON RIPPLE CLICK EFFECT (Dynamic from Mouse Coordinates)
// ============================================
document.querySelectorAll('.cta-button, .submit-button').forEach(button => {
    button.addEventListener('click', function(e) {
        playClickSound();

        // Create ripple element
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.position = 'absolute';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================
// BUTTON HEARTBEAT PULSE & LETTER-SPACING ON HOVER
// ============================================
document.querySelectorAll('.cta-button, .submit-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.classList.add('pulse-heartbeat', 'button-hover-pulse');
        this.style.letterSpacing = '3px';
    });
    button.addEventListener('mouseleave', function() {
        this.classList.remove('pulse-heartbeat', 'button-hover-pulse');
        this.style.letterSpacing = '1px';
    });
});

// ============================================
// ENHANCED MAGNETIC EFFECT FOR BUTTONS & ICONS
// ============================================
const magneticState = [];
const magneticElements = document.querySelectorAll('.cta-button, .social-icon, .nav-links a');

magneticElements.forEach(element => {
    const state = { element, magneticX: 0, magneticY: 0, targetX: 0, targetY: 0 };
    magneticState.push(state);

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        state.targetX = (e.clientX - elementCenterX) * 0.12;
        state.targetY = (e.clientY - elementCenterY) * 0.12;
    });

    element.addEventListener('mouseleave', () => {
        state.targetX = 0;
        state.targetY = 0;
    });
});

// ============================================
// UNIFIED ANIMATION LOOP (cursor + magnetic)
// ============================================
const mainLoop = () => {
    if (!isMobile) {
        dotX += (mouseX - dotX) * 0.6;
        dotY += (mouseY - dotY) * 0.6;

        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
    }

    magneticState.forEach(s => {
        s.magneticX += (s.targetX - s.magneticX) * 0.18;
        s.magneticY += (s.targetY - s.magneticY) * 0.18;
        s.element.style.transform = `translate(${s.magneticX}px, ${s.magneticY}px)`;
    });

    requestAnimationFrame(mainLoop);
};
mainLoop();

// ============================================
// PROJECT CARD ENHANCED INTERACTIONS
// ============================================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.filter = 'brightness(1.2)';
        card.style.transition = 'filter 0.3s ease-out';
        
        // Stagger animate tags
        const tags = card.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
            tag.classList.add('tag-stagger');
            tag.style.animationDelay = `${index * 0.08}s`;
        });
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.filter = 'brightness(1)';
        const tags = card.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.classList.remove('tag-stagger');
        });
    });
});

// ============================================
// VANILLA TILT FOR PROJECT CARDS
// ============================================
// VanillaTilt only on non-project cards (project cards have anchor children that need reliable clicks)
VanillaTilt.init(document.querySelectorAll(".skill-card"), {
    max: 25,
    scale: 1.05,
    speed: 400,
    glare: true,
    "max-glare": 0.3
});

// ============================================
// FORM VALIDATION WITH SHAKE & FLOATING LABELS
// ============================================
const form = document.getElementById('contactForm');
const formInputs = form.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    input.addEventListener('input', function() {
        const label = this.parentElement.querySelector('.form-label');
        if (this.value.trim() !== '') {
            label.style.top = '-20px';
            label.style.color = 'var(--color-accent-gold)';
            label.style.fontSize = '0.8rem';
        } else {
            label.style.top = '0';
            label.style.color = 'var(--color-text-secondary)';
            label.style.fontSize = '0.9rem';
        }
    });
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm() {
    let isValid = true;
    formInputs.forEach(input => {
        const value = input.value.trim();
        let valid = false;

        if (input.id === 'name') {
            valid = value.length >= 2;
        } else if (input.id === 'email') {
            valid = validateEmail(value);
        } else if (input.id === 'message') {
            valid = value.length >= 10;
        }

        if (!valid) {
            isValid = false;
            input.classList.add('error', 'shake-error');
            setTimeout(() => input.classList.remove('shake-error'), 400);
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

function openMailClient(mailtoUrl) {
    const fallbackFrame = document.createElement('iframe');
    fallbackFrame.style.display = 'none';
    fallbackFrame.src = mailtoUrl;
    document.body.appendChild(fallbackFrame);

    setTimeout(() => {
        fallbackFrame.remove();
        globalThis.location.href = mailtoUrl;
    }, 150);
}

// ============================================
// CONTACT FORM SUBMISSION WITH SUCCESS ANIMATION
// ============================================
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    formInputs.forEach(input => input.classList.remove('error'));

    if (!validateForm()) {
        return;
    }

    playClickSound();

    const name = document.getElementById('name').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent('Portfolio Contact from ' + name);
    const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + emailVal + '\n\n' +
        'Message:\n' + message
    );
    const mailtoUrl = 'mailto:agrawalabhishek2020@gmail.com?subject=' + subject + '&body=' + body;

    // Open default email client with message pre-filled
    openMailClient(mailtoUrl);

    // Show success animation
    const button = form.querySelector('.submit-button');
    gsap.to(form, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
            form.style.display = 'none';

            const successDiv = document.getElementById('formSuccess');
            successDiv.classList.add('active');

            gsap.fromTo(successDiv,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'back.out' }
            );

            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successDiv.classList.remove('active');
                button.disabled = false;
                button.textContent = 'Send Message';

                gsap.fromTo(form,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.4 }
                );
            }, 4000);
        }
    });
});

// ============================================
// NAVIGATION ACTIVE LINK TRACKING (Liquid Underline)
// ============================================
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -30% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.style.color = 'var(--color-text-primary)';
                
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                    link.style.color = 'var(--color-accent-gold)';
                    
                    // Liquid underline effect
                    gsap.to(link, {
                        textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
                        duration: 0.3
                    });
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// ============================================
// ENHANCED SMOOTH SCROLL WITH HIGH INERTIA
// ============================================
document.querySelectorAll('.nav-links a[href^="#"], .cta-button[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 0.3,
                scrollTo: {
                    y: target,
                    autoKill: false
                },
                ease: 'power2.out'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS WITH GSAP
// ============================================
gsap.utils.toArray('section').forEach((section, index) => {
    if (index === 0) return; // Skip hero

    const heading = section.querySelector('h2');
    const subtitle = section.querySelector('.section-subtitle');
    const cards = section.querySelectorAll('.skill-card, .project-card, .timeline-item');

    // Animate heading
    if (heading) {
        gsap.fromTo(
            heading,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: false,
                    markers: false
                }
            }
        );
    }

    // Animate subtitle
    if (subtitle) {
        gsap.fromTo(
            subtitle,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.1,
                scrollTrigger: {
                    trigger: subtitle,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: false,
                    markers: false
                }
            }
        );
    }

    // Stagger animate cards
    cards.forEach((card, idx) => {
        gsap.fromTo(
            card,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: idx * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'top 55%',
                    scrub: false,
                    markers: false
                }
            }
        );
    });
});

// ============================================
// SCROLL ORCHESTRATION - HERO FADE OUT
// ============================================
gsap.to('.hero-content', {
    opacity: 0.3,
    y: -100,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION - willChange on hover only
// ============================================
document.querySelectorAll('.skill-card, .project-card, .cta-button, .submit-button').forEach(el => {
    el.addEventListener('mouseenter', () => { el.style.willChange = 'transform'; });
    el.addEventListener('mouseleave', () => { el.style.willChange = 'auto'; });
});

// ============================================
// SCROLL TRIGGER REFRESH ON LOAD & RESIZE
// ============================================
window.addEventListener('load', () => {
    ScrollTrigger.refresh();

    // Hide preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => preloader.remove());
    }
});

let stResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(stResizeTimer);
    stResizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinksContainer.classList.toggle('active');
        navToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            navToggle.querySelector('i').className = 'fas fa-bars';
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}
