// Import noble/post-quantum for SPHINCS+ verification
import { slh_dsa_sha2_128s, slh_dsa_sha2_128f, slh_dsa_sha2_192s, slh_dsa_sha2_192f, slh_dsa_sha2_256s, slh_dsa_sha2_256f, slh_dsa_shake_128s, slh_dsa_shake_128f, slh_dsa_shake_192s, slh_dsa_shake_192f, slh_dsa_shake_256s, slh_dsa_shake_256f } from '@noble/post-quantum/slh-dsa.js';

// SPHINCS+ variant mapping
const SPHINCS_VARIANTS: Record<string, any> = {
    'SHA2-128s': slh_dsa_sha2_128s,
    'SHA2-128f': slh_dsa_sha2_128f,
    'SHA2-192s': slh_dsa_sha2_192s,
    'SHA2-192f': slh_dsa_sha2_192f,
    'SHA2-256s': slh_dsa_sha2_256s,
    'SHA2-256f': slh_dsa_sha2_256f,
    'SHAKE-128s': slh_dsa_shake_128s,
    'SHAKE-128f': slh_dsa_shake_128f,
    'SHAKE-192s': slh_dsa_shake_192s,
    'SHAKE-192f': slh_dsa_shake_192f,
    'SHAKE-256s': slh_dsa_shake_256s,
    'SHAKE-256f': slh_dsa_shake_256f,
};

// Binary verification function
async function verifyBinarySignature(): Promise<void> {
    const resultContainer = document.getElementById('result-container');
    if (!resultContainer) return;

    try {
        // Get inputs
        const variantSelect = document.getElementById('variant-select') as HTMLSelectElement;
        const binaryFileInput = document.getElementById('binary-file-input') as HTMLInputElement;
        const publicKeyInput = document.getElementById('public-key-input') as HTMLTextAreaElement;
        const signatureInput = document.getElementById('signature-input') as HTMLTextAreaElement;

        // Validation
        if (!binaryFileInput.files || binaryFileInput.files.length === 0) {
            showResult('error', 'Please select a binary file.');
            return;
        }

        const publicKeyHex = publicKeyInput.value.trim().replace(/\s+/g, '');
        const signatureHex = signatureInput.value.trim().replace(/\s+/g, '');

        if (!publicKeyHex) {
            showResult('error', 'Please enter the public key.');
            return;
        }

        if (!signatureHex) {
            showResult('error', 'Please enter the signature.');
            return;
        }

        // Show loading state
        showResult('loading', 'Verifying signature...');

        // Get selected variant
        const variant = variantSelect.value;
        const sphincsVariant = SPHINCS_VARIANTS[variant];

        if (!sphincsVariant) {
            showResult('error', `Unsupported SPHINCS+ variant: ${variant}`);
            return;
        }

        // Read binary file
        const file = binaryFileInput.files[0];
        const fileBuffer = await file.arrayBuffer();
        const fileBytes = new Uint8Array(fileBuffer);

        // Convert hex strings to Uint8Array
        const publicKey = hexToBytes(publicKeyHex);
        const signature = hexToBytes(signatureHex);

        // Verify signature
        const isValid = sphincsVariant.verify(publicKey, fileBytes, signature);

        if (isValid) {
            showResult('success', 'Signature is valid! The binary is authentic.');
        } else {
            showResult('error', 'Signature verification failed! The binary may be tampered with.');
        }
    } catch (error) {
        console.error('Verification error:', error);
        showResult('error', `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Helper function to convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) {
        throw new Error('Invalid hex string length');
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

// Helper function to show verification result
function showResult(type: 'success' | 'error' | 'loading', message: string): void {
    const resultContainer = document.getElementById('result-container');
    if (!resultContainer) return;

    let icon = '';
    let bgColor = '';
    let textColor = '';
    let borderColor = '';

    if (type === 'success') {
        icon = `<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`;
        bgColor = 'bg-green-900/20';
        textColor = 'text-green-300';
        borderColor = 'border-green-700';
    } else if (type === 'error') {
        icon = `<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`;
        bgColor = 'bg-red-900/20';
        textColor = 'text-red-300';
        borderColor = 'border-red-700';
    } else {
        icon = `<svg class="w-8 h-8 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>`;
        bgColor = 'bg-blue-900/20';
        textColor = 'text-blue-300';
        borderColor = 'border-blue-700';
    }

    resultContainer.innerHTML = `
        <div class="p-6 ${bgColor} border ${borderColor} rounded-lg">
            <div class="flex items-center gap-4">
                ${icon}
                <p class="${textColor} text-lg font-semibold">${message}</p>
            </div>
        </div>
    `;
    resultContainer.classList.remove('hidden');
}

// Make verifyBinarySignature available globally
(window as any).verifyBinarySignature = verifyBinarySignature;

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