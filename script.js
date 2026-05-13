// Sticky Header on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth reveal animations on scroll
const revealElements = document.querySelectorAll('.service-card, .team-member, .hero-text, .hero-image');

const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8;
    
    revealElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < triggerBottom) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Initial setup for reveal elements
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger once on load

// Service card hover animation enhancement (optional)
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.service-icon').style.transform = 'scale(1.1) rotate(10deg)';
    });
    card.addEventListener('mouseleave', () => {
        card.querySelector('.service-icon').style.transform = 'scale(1) rotate(0deg)';
    });
});
