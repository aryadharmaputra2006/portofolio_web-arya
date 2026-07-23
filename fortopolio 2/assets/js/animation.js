
document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initAOS();
    initTypedText();
    initParticleBackground();
    initCustomCursor();
    initProfileTilt();
});

/* ==========================================================================
   0. PRELOADER — WAJIB ADA, ini yang tadinya hilang & bikin spinner macet
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    function hidePreloader() {
        preloader.classList.add('fade-out');
    }

    // Cara normal: hilang begitu semua resource (gambar, font, dll) selesai load
    window.addEventListener('load', hidePreloader);

    // SAFETY NET: apa pun yang terjadi (gambar lambat, script error, dll),
    // preloader dipaksa hilang maksimal 3 detik supaya TIDAK PERNAH macet.
    setTimeout(hidePreloader, 3000);
}

/* ==========================================================================
   0B. AOS INIT — untuk scroll reveal (data-aos="...")
   ========================================================================== */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 60,
            easing: 'ease-out-cubic'
        });
    }
}

/* ==========================================================================
   0C. TYPED.JS INIT — untuk teks berjalan di hero (#typed-text)
   ========================================================================== */
function initTypedText() {
    const el = document.getElementById('typed-text');
    if (!el || typeof Typed === 'undefined') return;

    new Typed('#typed-text', {
        strings: [
            'Web Developer',
            'UI/UX Designer',
            'Network Technician',
            'Software Engineer'
        ],
        typeSpeed: 60,
        backSpeed: 35,
        backDelay: 1500,
        loop: true,
        smartBackspace: true
    });
}

/* ==========================================================================
   1. PARTICLE BACKGROUND — titik-titik mengambang & saling terhubung
   ========================================================================== */
function initParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const COUNT = window.innerWidth < 768 ? 30 : 55;

    function createParticles() {
        particles = [];
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.8 + 0.6
            });
        }
    }
    createParticles();
    window.addEventListener('resize', createParticles);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function tick() {
        ctx.clearRect(0, 0, width, height);
        const dotColor = isDark() ? 'rgba(56, 189, 248, 0.65)' : 'rgba(37, 99, 235, 0.5)';
        const lineColor = isDark() ? 'rgba(56, 189, 248,' : 'rgba(37, 99, 235,';

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = lineColor + (1 - dist / 130) * 0.15 + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        if (!reduceMotion) requestAnimationFrame(tick);
    }

    if (!reduceMotion) {
        requestAnimationFrame(tick);
    } else {
        tick();
    }
}

/* ==========================================================================
   2. CUSTOM CURSOR — titik + ring mengikuti mouse, membesar di elemen interaktif
   ========================================================================== */
function initCustomCursor() {
    // Cursor kustom hanya untuk device dengan mouse presisi (desktop)
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    document.body.classList.add('custom-cursor-active');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveSelector = 'a, button, .filter-btn, .glass-card, input, textarea';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            document.body.classList.add('cursor-hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
            document.body.classList.remove('cursor-hover');
        }
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '0.6';
    });
}

/* ==========================================================================
   3. TILT 3D PADA FOTO PROFIL — mengikuti pergerakan mouse
   ========================================================================== */
function initProfileTilt() {
    const wrapper = document.querySelector('.hero-img-wrapper');
    if (!wrapper) return;
    const img = wrapper.querySelector('img');
    if (!img) return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;

        img.style.transform = `scale(1.05) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
}
