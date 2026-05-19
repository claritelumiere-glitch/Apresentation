// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger menu logic
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}


// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Run animation only once
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Video Logic
    const video = document.getElementById('hero-video');
    const container = document.getElementById('hero-scroll-container');

    if (video && container) {
        // Attempt to pre-load and get metadata ready
        video.play().then(() => { video.pause(); }).catch(() => {});

        let targetTime = 0;
        let currentTime = 0;
        let isTicking = false;

        const updateVideo = () => {
            // Smoothly interpolate current time towards target time
            currentTime += (targetTime - currentTime) * 0.1; // Lower value = smoother but more lag
            
            // Only update video if difference is noticeable
            if (video.readyState >= 1 && Math.abs(currentTime - video.currentTime) > 0.01) {
                video.currentTime = currentTime;
            }
            
            requestAnimationFrame(updateVideo);
        };
        
        // Start the render loop
        requestAnimationFrame(updateVideo);
        
        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const rect = container.getBoundingClientRect();
                    const scrollableDistance = container.offsetHeight - window.innerHeight;
                    const scrolled = -rect.top;
                    
                    let progress = scrolled / scrollableDistance;
                    progress = Math.max(0, Math.min(1, progress));
                    
                    if (video.readyState >= 1) {
                        // Set target time instead of direct assignment
                        targetTime = progress * video.duration;
                    }
                    
                    isTicking = false;
                });
                isTicking = true;
            }
        });
    }

    const animatableElements = document.querySelectorAll('.stat-item, .about-text, .about-image-wrapper, .gallery-header, .gallery-item, .cta-box');
    animatableElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
});
