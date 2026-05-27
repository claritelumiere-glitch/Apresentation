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

    const animatableElements = document.querySelectorAll('.stat-item, .about-text, .about-image-wrapper, .gallery-header, .gallery-item, .cta-box, .animate-on-scroll');
    animatableElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Interactive Brazil Map (Leaflet)
    const mapEl = document.getElementById('brazil-map');
    if (mapEl && typeof L !== 'undefined') {
        const map = L.map('brazil-map', {
            center: [-14.5, -52],
            zoom: 4,
            scrollWheelZoom: false,
            zoomControl: true
        });

        // Carto Voyager — visual limpo e elegante
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            maxZoom: 18
        }).addTo(map);

        const spLatLng = [-23.5505, -46.6333];

        // Círculo de cobertura nacional
        L.circle(spLatLng, {
            color: '#D4AF37',
            fillColor: '#9B2C8A',
            fillOpacity: 0.08,
            weight: 1.5,
            radius: 1800000
        }).addTo(map);

        // Pin dourado customizado para a matriz
        const goldIcon = L.divIcon({
            className: 'custom-pin',
            html: '<div style="position:relative;width:36px;height:46px;"><svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 4px 8px rgba(74,26,107,0.4));"><defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F4D03F"/><stop offset="50%" stop-color="#DAA520"/><stop offset="100%" stop-color="#B8860B"/></linearGradient></defs><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="url(#pg)" stroke="#4A1A6B" stroke-width="1"/><circle cx="12" cy="12" r="4.5" fill="#4A1A6B"/></svg></div>',
            iconSize: [36, 46],
            iconAnchor: [18, 46],
            popupAnchor: [0, -42]
        });

        L.marker(spLatLng, { icon: goldIcon })
            .addTo(map)
            .bindPopup('<strong>Clarité Lumière</strong>Matriz · São Paulo / SP<br>Zona Norte')
            .openPopup();

        // Capitais atendidas (highlights)
        const capitais = [
            { nome: 'Rio de Janeiro', coords: [-22.9068, -43.1729] },
            { nome: 'Belo Horizonte', coords: [-19.9167, -43.9345] },
            { nome: 'Curitiba', coords: [-25.4284, -49.2733] },
            { nome: 'Brasília', coords: [-15.7942, -47.8822] },
            { nome: 'Salvador', coords: [-12.9714, -38.5014] },
            { nome: 'Recife', coords: [-8.0476, -34.8770] },
            { nome: 'Fortaleza', coords: [-3.7172, -38.5433] },
            { nome: 'Porto Alegre', coords: [-30.0346, -51.2177] },
            { nome: 'Manaus', coords: [-3.1190, -60.0217] }
        ];

        capitais.forEach(cidade => {
            L.circleMarker(cidade.coords, {
                radius: 5,
                color: '#D4AF37',
                fillColor: '#B8860B',
                fillOpacity: 0.8,
                weight: 1.5
            })
                .addTo(map)
                .bindPopup('<strong>' + cidade.nome + '</strong>Atendimento ativo');
        });

        // Habilita scroll-zoom quando clicar
        map.on('click', () => map.scrollWheelZoom.enable());
        map.on('mouseout', () => map.scrollWheelZoom.disable());
    }
});
