// Smooth scroll navigation
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (if we add a mobile menu button later)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const target = anchor.getAttribute('href');
            if (target && target !== '#') {
                const element = document.querySelector(target);
                if (element) {
                    const offset = 80; // Account for fixed navbar
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add scroll effect to navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg');
            } else {
                navbar.classList.remove('shadow-lg');
            }
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-4');
            }
        });
    }, observerOptions);

    // Add animation classes to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
        observer.observe(section);
    });

    // Copy to clipboard functionality for code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const wrapper = block.parentElement;
        if (wrapper) {
            const button = document.createElement('button');
            button.className = 'absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-gray-300 px-2 py-1 rounded text-sm transition';
            button.textContent = 'Copy';
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent || '').then(() => {
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                });
            });
            wrapper.style.position = 'relative';
            wrapper.appendChild(button);
        }
    });

    // Add particle effect to hero section (optional quantum effect)
    const hero = document.getElementById('hero');
    if (hero) {
        createQuantumParticles(hero);
    }
});

// Create quantum particle effect
function createQuantumParticles(container: HTMLElement): void {
    const particleCount = 30;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-quantum-accent rounded-full opacity-30';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${10 + Math.random() * 20}s infinite ease-in-out`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(particle);
        particles.push(particle);
    }

    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0.3;
            }
            25% {
                transform: translateY(-20px) translateX(10px);
                opacity: 0.6;
            }
            50% {
                transform: translateY(-10px) translateX(-10px);
                opacity: 0.3;
            }
            75% {
                transform: translateY(-30px) translateX(5px);
                opacity: 0.5;
            }
        }
    `;
    document.head.appendChild(style);
}