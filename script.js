// Mobile Navigation & Chat - safe guards if elements are missing
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navDropdown = document.querySelector('.nav-item-dropdown');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Dropdown menu on mobile
if (navDropdown) {
    const dropdownToggle = navDropdown.querySelector('.nav-link');
    
    dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            navDropdown.classList.toggle('active');
        }
    });

    // Close dropdown when clicking a dropdown link
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            navDropdown.classList.remove('active');
        });
    });
}

// Chat Widget (guarded)
const chatToggle = document.querySelector('.chat-toggle');
const chatBox = document.querySelector('.chat-box');
const chatClose = document.querySelector('.chat-close');

if (chatToggle && chatBox) {
    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('active');
    });

    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatBox.classList.remove('active');
        });
    }

    // Quick Actions in Chat
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;

            switch(action) {
                case 'quote':
                    window.location.href = 'contact.html#quote';
                    break;
                case 'menu':
                    window.location.href = 'services.html#menu';
                    break;
                case 'contact':
                    window.open('tel:+254706686281');
                    break;
            }

            chatBox.classList.remove('active');
        });
    });
}

// Form Submission Handler
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('.contact-form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Add honeypot check
        const honeypot = form.querySelector('[name="honeypot"]');
        if (honeypot && honeypot.value) {
            return; // Bot detected, don't submit
        }
        
        // Add timestamp
        formData.append('submitted_at', new Date().toISOString());
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send to Web3Forms
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(form);
                form.reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showSuccess(form) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thank you! Your message has been sent successfully.</p>
        `;
        
        form.parentNode.insertBefore(successMsg, form.nextSibling);
        
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }
    
    showError(message) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message || 'An error occurred. Please try again.'}</p>
        `;
        
        document.body.appendChild(errorMsg);
        
        setTimeout(() => {
            errorMsg.remove();
        }, 5000);
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Add scroll-based header effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Cookie Consent Banner
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            this.showCookieBanner();
        }, 2000);
    }
});

// Cookie Banner
function showCookieBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <p>We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.</p>
            <div class="cookie-buttons">
                <button class="btn btn-primary accept-cookies">Accept</button>
                <button class="btn btn-outline decline-cookies">Decline</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--primary-black);
            color: var(--primary-white);
            padding: 20px;
            z-index: 9999;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        
        .cookie-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }
        
        .cookie-buttons {
            display: flex;
            gap: 10px;
        }
        
        @media (max-width: 768px) {
            .cookie-content {
                flex-direction: column;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Handle cookie acceptance
    document.querySelector('.accept-cookies').addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.remove();
    });
    
    document.querySelector('.decline-cookies').addEventListener('click', () => {
        banner.remove();
    });
}

// Analytics (if enabled)
class Analytics {
    constructor() {
        this.init();
    }
    
    init() {
        // Track page views
        this.trackPageView();
        
        // Track outbound links
        this.trackOutboundLinks();
        
        // Track form submissions
        this.trackFormSubmissions();
    }
    
    trackPageView() {
        const data = {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
        
        // Send to your analytics endpoint
        // this.sendToAnalytics('pageview', data);
    }
    
    trackOutboundLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                const data = {
                    url: link.href,
                    text: link.textContent,
                    timestamp: new Date().toISOString()
                };
                // this.sendToAnalytics('outbound', data);
            }
        });
    }
    
    trackFormSubmissions() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.classList.contains('contact-form')) {
                const data = {
                    form: form.id || 'contact-form',
                    timestamp: new Date().toISOString()
                };
                // this.sendToAnalytics('form_submit', data);
            }
        });
    }
    
    sendToAnalytics(event, data) {
        // Implement your analytics API call here
        console.log('Analytics Event:', event, data);
    }
}

// Initialize analytics
// new Analytics();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Add to Home Screen Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install button
    showInstallPrompt();
});

function showInstallPrompt() {
    const installPrompt = document.createElement('div');
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = `
        <div class="install-content">
            <p>Install Kilimanibistro Caterers App?</p>
            <button class="btn btn-primary install-btn">Install</button>
            <button class="btn btn-outline cancel-install">Not Now</button>
        </div>
    `;
    
    document.body.appendChild(installPrompt);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .install-prompt {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-white);
            padding: 20px;
            border-radius: 10px;
            box-shadow: var(--shadow);
            z-index: 9999;
            max-width: 400px;
            width: 90%;
        }
        
        .install-content {
            text-align: center;
        }
        
        .install-content p {
            margin-bottom: 15px;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
    
    // Handle install
    document.querySelector('.install-btn').addEventListener('click', async () => {
        installPrompt.remove();
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
    });
    
    document.querySelector('.cancel-install').addEventListener('click', () => {
        installPrompt.remove();
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    const perfData = {
        dcl: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
        load: performance.getEntriesByType('navigation')[0].loadEventEnd,
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime
    };
    
    // Log performance data
    console.log('Performance Metrics:', perfData);
});