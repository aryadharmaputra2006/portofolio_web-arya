/**
 * Core Application Engine Script
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Perubahan Style Navbar & Scroll Progress saat Window digeser
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar-custom');
        const scrollProgress = document.getElementById('scroll-progress');
        
        // Perhitungan Scroll Percentage
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;

        // Sticky Effects
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back To Top Visibility Toggle
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // 2. Portfolio Isotope-style Vanilla Filter Logic Engine
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // 3. Sertifikat Modal Data Injection Engine
    const certModal = document.getElementById('certificateModal');
    if (certModal) {
        certModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const certTitle = button.getAttribute('data-cert-title');
            const certImg = button.getAttribute('data-cert-img');
            
            const modalTitle = certModal.querySelector('.modal-title');
            const modalImg = certModal.querySelector('#modalCertImage');

            modalTitle.innerText = certTitle;
            modalImg.src = certImg;
        });
    }
});