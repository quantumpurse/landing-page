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

// ── Scroll-triggered reveal animations ───────────────────
function initRevealAnimations(): void {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to avoid re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ── Navbar scroll effect ─────────────────────────────────
function initNavbarScroll(): void {
    const navbar = document.getElementById('main-nav');
    if (!navbar) return;

    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            navbar.style.background = 'rgba(13, 19, 33, 0.9)';
            navbar.style.boxShadow = '0 1px 0 rgba(30, 41, 59, 0.5)';
        } else {
            navbar.style.background = 'rgba(13, 19, 33, 0.6)';
            navbar.style.boxShadow = 'none';
        }

        lastScrollY = scrollY;
    }, { passive: true });
}

// ── Smooth scrolling for anchor links ────────────────────
function initSmoothScroll(): void {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const target = anchor.getAttribute('href');
            if (target && target !== '#') {
                const element = document.querySelector(target);
                if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            }
        });
    });
}

// ── Mobile menu toggle ───────────────────────────────────
function initMobileMenu(): void {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    if (button && menu) {
        button.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

// ── Copy to clipboard for code blocks ────────────────────
function initCodeCopy(): void {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const wrapper = block.parentElement;
        if (wrapper) {
            const button = document.createElement('button');
            button.className = 'absolute top-2 right-2 text-xs text-gray-500 hover:text-white px-2 py-1 rounded border border-quantum-border bg-quantum-surface transition-colors';
            button.textContent = 'Copy';
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent || '').then(() => {
                    button.textContent = 'Copied!';
                    button.classList.add('text-quantum-accent', 'border-quantum-accent/30');
                    setTimeout(() => {
                        button.textContent = 'Copy';
                        button.classList.remove('text-quantum-accent', 'border-quantum-accent/30');
                    }, 2000);
                });
            });
            wrapper.style.position = 'relative';
            wrapper.appendChild(button);
        }
    });
}

// ── Initialize everything on DOM ready ───────────────────
document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initMobileMenu();
    initCodeCopy();
});
