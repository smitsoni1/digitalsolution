/* ============================================================
   DIGITAL SOLUTIONS - Main JavaScript
   Handles: Navigation, Scroll Effects, Animations, Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ========================================================
       1. HAMBURGER MOBILE MENU
    ======================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen.toString());
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on outside click
        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /* ========================================================
       2. STICKY HEADER ON SCROLL
    ======================================================== */
    const header = document.getElementById('header');

    if (header && !header.classList.contains('always-white')) {
        function handleHeaderScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Run once on load
    }

    /* ========================================================
       3. SCROLL-TO-TOP BUTTON
    ======================================================== */
    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ========================================================
       4. FADE-UP SCROLL ANIMATIONS (IntersectionObserver)
    ======================================================== */
    const fadeElements = document.querySelectorAll('.fade-up');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    // Stagger delay for child elements
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all immediately if no IntersectionObserver support
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ========================================================
       5. COUNTER ANIMATION (Stats Numbers)
    ======================================================== */
    function animateCounter(el, target, suffix) {
        var start     = 0;
        var duration  = 1800;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
            var current  = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    const statNums = document.querySelectorAll('.stat-num, .num');

    if (statNums.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el   = entry.target;
                    var text = el.textContent.trim();

                    // Parse number and suffix
                    var match = text.match(/^(\d+)(.*)$/);
                    if (match) {
                        var num    = parseInt(match[1], 10);
                        var suffix = match[2] || '';
                        animateCounter(el, num, suffix);
                    }
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNums.forEach(function (el) {
            counterObserver.observe(el);
        });
    }

    /* ========================================================
       6. CONTACT FORM HANDLING
    ======================================================== */
    var contactForm  = document.getElementById('contactForm');
    var formSuccess  = document.getElementById('formSuccess');
    var submitBtn    = document.getElementById('submit-inquiry-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            var fullName = document.getElementById('full-name');
            var phone    = document.getElementById('phone');
            var email    = document.getElementById('email');
            var service  = document.getElementById('service');
            var message  = document.getElementById('message');

            var isValid = true;

            [fullName, phone, email, service, message].forEach(function (field) {
                if (field && !field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    field.style.boxShadow   = '0 0 0 4px rgba(231,76,60,0.15)';
                    isValid = false;
                } else if (field) {
                    field.style.borderColor = '';
                    field.style.boxShadow   = '';
                }
            });

            // Email format check
            if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = '#e74c3c';
                isValid = false;
            }

            if (!isValid) {
                // Shake animation for invalid form
                contactForm.style.animation = 'shake 0.4s ease';
                setTimeout(function () { contactForm.style.animation = ''; }, 400);
                return;
            }

            // Submit form to Web3Forms
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled  = true;
            }

            var budgetField = document.getElementById('budget');
            var budgetVal   = budgetField ? budgetField.value : 'Not specified';
            var serviceText = service ? service.options[service.selectedIndex].text : 'Not specified';

            var formData = new FormData();
            formData.append("access_key", "d25f9303-9b19-4e8f-9f05-525059321952");
            formData.append("name", fullName.value);
            formData.append("phone", phone.value);
            formData.append("email", email.value);
            formData.append("service", serviceText);
            formData.append("budget", budgetVal);
            formData.append("message", message.value);
            formData.append("subject", "New Inquiry from " + fullName.value);
            formData.append("from_name", "Digital Solutions");

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    contactForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                    }
                } else {
                    alert("Something went wrong. Please try again or email us directly at dsteck.official@gmail.com.");
                    if (submitBtn) {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry';
                        submitBtn.disabled  = false;
                    }
                }
            })
            .catch(function (error) {
                console.error("Error submitting form:", error);
                alert("Connection error. Please check your internet connection and try again.");
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry';
                    submitBtn.disabled  = false;
                }
            });
        });

        // Real-time field validation reset
        contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                this.style.borderColor = '';
                this.style.boxShadow   = '';
            });
        });
    }

    /* ========================================================
       7. ACTIVE NAV LINK HIGHLIGHT (Home page smooth scroll)
    ======================================================== */
    var sections   = document.querySelectorAll('section[id]');
    var navAnchors = document.querySelectorAll('.nav-links a');

    if (sections.length > 0 && navAnchors.length > 0) {
        window.addEventListener('scroll', function () {
            var scrollPos = window.scrollY + 120;

            sections.forEach(function (section) {
                var sectionTop    = section.offsetTop;
                var sectionHeight = section.offsetHeight;
                var sectionId     = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navAnchors.forEach(function (a) { a.classList.remove('active'); });
                    var activeLink = document.querySelector('.nav-links a[href="#' + sectionId + '"]');
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { passive: true });
    }

    /* ========================================================
       8. SHAKE ANIMATION KEYFRAMES (injected dynamically)
    ======================================================== */
    var shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%       { transform: translateX(-8px); }
            40%       { transform: translateX(8px); }
            60%       { transform: translateX(-4px); }
            80%       { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    /* ========================================================
       9. SMOOTH ANCHOR SCROLL (for in-page links)
    ======================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href').substring(1);
            var target   = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                var offset = 90; // header height offset
                var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    /* ========================================================
       10. SERVICE CARD HOVER TILT EFFECT
    ======================================================== */
    document.querySelectorAll('.service-card, .value-card, .work-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect   = card.getBoundingClientRect();
            var x      = (e.clientX - rect.left) / rect.width  - 0.5;
            var y      = (e.clientY - rect.top)  / rect.height - 0.5;
            var tiltX  = y * 6;
            var tiltY  = x * -6;
            card.style.transform = 'translateY(-10px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
            card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    console.log('%c🚀 Digital Solutions Website Loaded!', 'color:#0056D2; font-weight:bold; font-size:14px;');
});
