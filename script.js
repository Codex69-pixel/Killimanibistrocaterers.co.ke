// ============================================
// KILIMANIBISTRO CATERERS - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initChatWidget();
    initImageOptimization();
    initGalleryFeatures();
    initFormHandlers();
    initScrollEffects();
    initTabSwitchers();
    initStatsCounter();
    initVideoModal();
    initLightbox();
    initLogoSlider();
    initCookieBanner();
    initAnalytics();
    initServiceWorker();
});

// ============================================
// NAVIGATION & DROPDOWN
// ============================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Close all dropdowns when toggling mobile menu
            dropdownItems.forEach(item => {
                item.classList.remove('active');
                const dropdown = item.querySelector('.dropdown-menu');
                const icon = item.querySelector('.dropdown-icon');
                if (dropdown) dropdown.classList.remove('active');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
        });

        // Close mobile menu when clicking a link (non-dropdown links)
        document.querySelectorAll('.nav-link').forEach(link => {
            if (!link.closest('.nav-item-dropdown')) {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            }
        });
    }

    // Dropdown toggle functionality
    dropdownItems.forEach(item => {
        const dropdownLink = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');
        const icon = item.querySelector('.dropdown-icon');
        const dropdownLinks = dropdown ? dropdown.querySelectorAll('a') : [];
        
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const isActive = item.classList.contains('active');

                // First tap opens the dropdown; second tap follows the link
                if (!isActive) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close all other dropdowns
                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherDropdown = otherItem.querySelector('.dropdown-menu');
                            const otherIcon = otherItem.querySelector('.dropdown-icon');
                            if (otherDropdown) otherDropdown.classList.remove('active');
                            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                        }
                    });

                    // Open current dropdown
                    item.classList.add('active');
                    if (dropdown) dropdown.classList.add('active');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                } else {
                    // Allow navigation on second tap and close the mobile menu
                    if (hamburger && hamburger.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        if (navMenu) navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                }
            }
        });

        // Close the mobile menu when a dropdown link is chosen
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    if (hamburger) hamburger.classList.remove('active');
                    if (navMenu) navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item-dropdown')) {
            dropdownItems.forEach(item => {
                item.classList.remove('active');
                const dropdown = item.querySelector('.dropdown-menu');
                const icon = item.querySelector('.dropdown-icon');
                if (dropdown) dropdown.classList.remove('active');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile dropdowns on desktop
            dropdownItems.forEach(item => {
                item.classList.remove('active');
                const dropdown = item.querySelector('.dropdown-menu');
                const icon = item.querySelector('.dropdown-icon');
                if (dropdown) dropdown.classList.remove('active');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
            
            // Close mobile menu if open
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
}

// ============================================
// CHAT WIDGET
// ============================================

function initChatWidget() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatBox = document.querySelector('.chat-box');
    const chatClose = document.querySelector('.chat-close');
    
    if (chatToggle && chatBox) {
        // Toggle chat
        chatToggle.addEventListener('click', () => {
            chatBox.classList.toggle('active');
            chatToggle.classList.toggle('active');
        });
        
        // Close chat
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatBox.classList.remove('active');
                chatToggle.classList.remove('active');
            });
        }
        
        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                
                switch(action) {
                    case 'quote':
                        window.location.href = 'contact.html#quote';
                        break;
                    case 'follow':
                        window.open('https://www.instagram.com/kilimanibistro/?hl=en', '_blank');
                        break;
                    case 'contact':
                        window.location.href = 'contact.html';
                        break;
                    case 'whatsapp':
                        window.open('https://wa.me/254111553616', '_blank');
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
                
                chatBox.classList.remove('active');
                chatToggle.classList.remove('active');
            });
        });
        
        // Auto-open chat after delay on contact page
        if (window.location.pathname.includes('contact.html')) {
            setTimeout(() => {
                if (!sessionStorage.getItem('chatOpened')) {
                    chatBox.classList.add('active');
                    chatToggle.classList.add('active');
                    sessionStorage.setItem('chatOpened', 'true');
                }
            }, 3000);
        }
    }
}

// ============================================
// IMAGE OPTIMIZATION & LAZY LOADING
// ============================================

function initImageOptimization() {
    // Preload critical images
    const criticalImages = [
        'Images/logo.jpeg',
        'Images/catering-setup.jpg',
        'Images/cater%201.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Lazy load images with Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Handle lazy-loaded images
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Handle lazy-loaded background images
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.removeAttribute('data-bg');
                    }
                    
                    // Add loaded class for animations
                    img.classList.add('loaded');
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Observe all lazy-loaded images
        document.querySelectorAll('img[data-src], [data-bg]').forEach(element => {
            lazyImageObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Handle broken images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            
            // Try loading a fallback image
            if (this.dataset.fallback) {
                this.src = this.dataset.fallback;
            } else {
                // Use a placeholder
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiI+S2lsaW1hbmlic3RybyBDYXRlcmVyczwvdGV4dD48L3N2Zz4=';
            }
            
            setTimeout(() => {
                this.style.opacity = '1';
            }, 50);
        });
    });
}

// ============================================
// GALLERY FEATURES (FILTERING, LIGHTBOX, VIDEO)
// ============================================

function initGalleryFeatures() {
    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.dataset.filter;
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

function initVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const playButtons = document.querySelectorAll('.play-button');
    const modalClose = document.querySelector('.modal-close');
    
    if (videoModal && playButtons.length > 0) {
        playButtons.forEach(button => {
            button.addEventListener('click', () => {
                const videoId = button.dataset.video;
                const videoFrame = document.getElementById('videoFrame');
                
                // Example video URLs - REPLACE WITH YOUR ACTUAL VIDEOS
                const videoUrls = {
                    'wedding-highlights': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'corporate-event': 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                };
                
                if (videoUrls[videoId]) {
                    videoFrame.src = videoUrls[videoId] + '?autoplay=1&rel=0';
                    videoModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                const videoFrame = document.getElementById('videoFrame');
                videoFrame.src = '';
                videoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                const videoFrame = document.getElementById('videoFrame');
                videoFrame.src = '';
                videoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.style.display === 'flex') {
                const videoFrame = document.getElementById('videoFrame');
                videoFrame.src = '';
                videoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (lightbox && lightboxImg) {
        let currentIndex = 0;
        let imagesArray = [];
        
        // Initialize lightbox if there are gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            imagesArray = Array.from(galleryItems);
            
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    const imgSrc = item.querySelector('img').src;
                    const caption = item.querySelector('.gallery-overlay').innerHTML;
                    
                    lightboxImg.src = imgSrc;
                    lightboxCaption.innerHTML = caption;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    currentIndex = index;
                });
            });
            
            // Navigation functions
            function updateLightbox() {
                if (imagesArray.length > 0) {
                    const item = imagesArray[currentIndex];
                    const imgSrc = item.querySelector('img').src;
                    const caption = item.querySelector('.gallery-overlay').innerHTML;
                    
                    lightboxImg.src = imgSrc;
                    lightboxCaption.innerHTML = caption;
                }
            }
            
            // Previous button
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
                    updateLightbox();
                });
            }
            
            // Next button
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % imagesArray.length;
                    updateLightbox();
                });
            }
        }
        
        // Close lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close when clicking outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    lightbox.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    break;
                case 'ArrowLeft':
                    if (prevBtn) prevBtn.click();
                    break;
                case 'ArrowRight':
                    if (nextBtn) nextBtn.click();
                    break;
            }
        });
    }
}

// ============================================
// FORM HANDLERS
// ============================================

function initFormHandlers() {
    const forms = document.querySelectorAll('.contact-form');
    
    if (forms.length > 0) {
        forms.forEach(form => {
            // Client-side validation
            form.addEventListener('submit', function(e) {
                if (!validateForm(this)) {
                    e.preventDefault();
                    return false;
                }
                
                // Add loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitBtn.disabled = true;
                    
                    // Reset button after 5 seconds (in case of error)
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 5000);
                }
                
                // Track form submission
                trackEvent('form_submit', {
                    form_id: form.id || 'contact_form',
                    page: window.location.pathname
                });
                
                return true;
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    validateField(input);
                });
                
                input.addEventListener('input', () => {
                    clearFieldError(input);
                });
            });
            
            // Phone number formatting
            const phoneInput = form.querySelector('input[type="tel"]');
            if (phoneInput) {
                phoneInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.startsWith('254')) {
                        value = value.substring(3);
                    }
                    if (value.length > 0) {
                        value = '+254 ' + value;
                    }
                    e.target.value = value;
                });
            }
            
            // Set minimum date to today for event date
            const dateInput = form.querySelector('input[type="date"]');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
            }
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if field is empty
    if (!field.value.trim()) {
        errorMessage = 'This field is required';
        isValid = false;
    } 
    // Email validation
    else if (field.type === 'email' && !isValidEmail(field.value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
    }
    // Phone validation (Kenyan format)
    else if (field.type === 'tel' && !isValidKenyanPhone(field.value)) {
        errorMessage = 'Please enter a valid Kenyan phone number (e.g., +254 7XX XXX XXX)';
        isValid = false;
    }
    // Number validation
    else if (field.type === 'number') {
        const min = parseInt(field.getAttribute('min')) || 0;
        const max = parseInt(field.getAttribute('max')) || Infinity;
        const value = parseInt(field.value);
        
        if (value < min) {
            errorMessage = `Minimum value is ${min}`;
            isValid = false;
        } else if (value > max) {
            errorMessage = `Maximum value is ${max}`;
            isValid = false;
        }
    }
    // Date validation
    else if (field.type === 'date') {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errorMessage = 'Date cannot be in the past';
            isValid = false;
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidKenyanPhone(phone) {
    const re = /^\+254\s?\d{9}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#c41e3a';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// ============================================
// SCROLL EFFECTS & ANIMATIONS
// ============================================

function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    // Close mobile menu if open
                    const hamburger = document.querySelector('.hamburger');
                    const navMenu = document.querySelector('.nav-menu');
                    if (hamburger && navMenu && hamburger.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Calculate offset (consider fixed header)
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Sticky header with shadow
    const header = document.querySelector('.header');
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                header.style.backdropFilter = 'none';
                header.style.backgroundColor = '';
            }
            
            // Hide/show header on scroll direction (optional)
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // Animate elements on scroll
    if ('IntersectionObserver' in window) {
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animateOnScroll.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements to animate
        document.querySelectorAll('.service-card, .mission-card, .team-member, .value-card, .choose-card').forEach(element => {
            animateOnScroll.observe(element);
        });
    }
}

// ============================================
// TAB SWITCHERS & INTERACTIVE ELEMENTS
// ============================================

function initTabSwitchers() {
    // Signature dishes tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.dishes-panel');
    
    if (tabButtons.length > 0 && panels.length > 0) {
        function activateTab(tab) {
            // Update buttons
            tabButtons.forEach(btn => {
                const selected = btn.dataset.tab === tab;
                btn.classList.toggle('active', selected);
                btn.setAttribute('aria-selected', selected ? 'true' : 'false');
            });
            
            // Update panels
            panels.forEach(panel => {
                panel.classList.toggle('active', panel.id === tab);
            });
            
            // Track tab change
            trackEvent('tab_switch', {
                tab: tab,
                page: window.location.pathname
            });
        }
        
        // Click event
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activateTab(btn.dataset.tab);
            });
        });
        
        // Keyboard navigation
        const tabContainer = document.querySelector('.dish-tabs');
        if (tabContainer) {
            tabContainer.addEventListener('keydown', (e) => {
                const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
                if (!keys.includes(e.key)) return;
                
                e.preventDefault();
                const activeBtn = document.querySelector('.tab-btn.active');
                const btnList = Array.from(tabButtons);
                let index = btnList.indexOf(activeBtn);
                
                switch(e.key) {
                    case 'ArrowLeft':
                        index = (index - 1 + btnList.length) % btnList.length;
                        break;
                    case 'ArrowRight':
                        index = (index + 1) % btnList.length;
                        break;
                    case 'Home':
                        index = 0;
                        break;
                    case 'End':
                        index = btnList.length - 1;
                        break;
                }
                
                btnList[index].focus();
                activateTab(btnList[index].dataset.tab);
            });
        }
    }
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function initStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-item h3');
    
    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.count) || 0;
                        animateCounter(stat, target);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500; // 1.5 seconds
    const interval = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const displayValue = Math.floor(current);
        element.textContent = displayValue + (element.dataset.count?.includes('%') ? '%' : '+');
        
        // Add visual feedback
        if (current === target) {
            element.classList.add('counted');
        }
    }, interval);
}

// ============================================
// LOGO SLIDER (CLIENT LOGOS)
// ============================================

function initLogoSlider() {
    const logoTrack = document.querySelector('.logo-track');
    if (!logoTrack) return;
    
    // Check if logos are duplicated (for seamless loop)
    const originalLogos = Array.from(logoTrack.children);
    const totalLogos = originalLogos.length;
    
    // If not duplicated, duplicate them
    if (totalLogos <= 8) { // Adjust based on your actual number of logos
        originalLogos.forEach(logo => {
            const clone = logo.cloneNode(true);
            logoTrack.appendChild(clone);
        });
    }
    
    // Pause animation on hover
    logoTrack.addEventListener('mouseenter', () => {
        logoTrack.style.animationPlayState = 'paused';
    });
    
    logoTrack.addEventListener('mouseleave', () => {
        logoTrack.style.animationPlayState = 'running';
    });
}

// ============================================
// COOKIE CONSENT BANNER
// ============================================

function initCookieBanner() {
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            createCookieBanner();
        }, 2000);
    }
}

function createCookieBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');
    
    banner.innerHTML = `
        <div class="cookie-content">
            <div class="cookie-text">
                <i class="fas fa-cookie-bite"></i>
                <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use our site, you consent to our use of cookies.</p>
            </div>
            <div class="cookie-actions">
                <button class="btn btn-outline cookie-btn" data-action="decline">Decline</button>
                <button class="btn btn-primary cookie-btn" data-action="accept">Accept All</button>
                <button class="btn btn-text cookie-btn" data-action="settings">Settings</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add styles if not already present
    if (!document.querySelector('#cookie-styles')) {
        const style = document.createElement('style');
        style.id = 'cookie-styles';
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 800px;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 30px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideUp 0.5s ease;
            }
            
            .cookie-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }
            
            .cookie-text {
                display: flex;
                align-items: flex-start;
                gap: 15px;
                flex: 1;
            }
            
            .cookie-text i {
                color: #c41e3a;
                font-size: 24px;
                margin-top: 5px;
            }
            
            .cookie-text p {
                margin: 0;
                color: #333;
                line-height: 1.5;
            }
            
            .cookie-actions {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateX(-50%) translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-text {
                    flex-direction: column;
                    align-items: center;
                }
                
                .cookie-actions {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle cookie actions
    banner.querySelectorAll('.cookie-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            
            switch(action) {
                case 'accept':
                    localStorage.setItem('cookiesAccepted', 'true');
                    trackEvent('cookies_accepted');
                    break;
                case 'decline':
                    localStorage.setItem('cookiesDeclined', 'true');
                    trackEvent('cookies_declined');
                    break;
                case 'settings':
                    // Open cookie settings modal (implement if needed)
                    alert('Cookie settings would open here');
                    return;
            }
            
            // Animate out
            banner.style.animation = 'slideDown 0.5s ease forwards';
            setTimeout(() => banner.remove(), 500);
        });
    });
    
    // Add slideDown animation
    if (!document.querySelector('#cookie-animations')) {
        const animStyle = document.createElement('style');
        animStyle.id = 'cookie-animations';
        animStyle.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-50%) translateY(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animStyle);
    }
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

function initAnalytics() {
    // Track page views
    trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
    });
    
    // Track outbound links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.hostname !== window.location.hostname) {
            trackEvent('outbound_click', {
                url: link.href,
                text: link.textContent.substring(0, 100),
                target: link.target || '_self'
            });
        }
    });
    
    // Track downloads
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.download) {
            trackEvent('file_download', {
                filename: link.download,
                url: link.href
            });
        }
    });
    
    // Track social shares
    document.addEventListener('click', (e) => {
        const shareBtn = e.target.closest('[data-share]');
        if (shareBtn) {
            const platform = shareBtn.dataset.share;
            trackEvent('social_share', {
                platform: platform,
                page: window.location.pathname
            });
        }
    });
}

function trackEvent(eventName, data = {}) {
    // Check if cookies are accepted
    if (localStorage.getItem('cookiesDeclined')) {
        return; // Don't track if user declined cookies
    }
    
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        ...data
    };
    
    // Log to console (for debugging)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Event tracked:', eventData);
    }
    
    // Send to your analytics endpoint
    // Example: sendToAnalyticsAPI(eventData);
}

// ============================================
// SERVICE WORKER FOR PWA
// ============================================

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('ServiceWorker update found!');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New update available
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed:', err);
                });
        });
    }
    
    // Add to Home Screen prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install prompt after delay
        setTimeout(() => {
            if (!localStorage.getItem('installPromptDismissed')) {
                showInstallPrompt();
            }
        }, 10000); // Show after 10 seconds
    });
    
    function showInstallPrompt() {
        const installPrompt = document.createElement('div');
        installPrompt.className = 'install-prompt';
        installPrompt.innerHTML = `
            <div class="install-content">
                <div class="install-icon">
                    <i class="fas fa-download"></i>
                </div>
                <div class="install-text">
                    <h4>Install Kilimanibistro App</h4>
                    <p>Get faster access and offline capabilities</p>
                </div>
                <div class="install-actions">
                    <button class="btn btn-text install-dismiss">Not Now</button>
                    <button class="btn btn-primary install-confirm">Install</button>
                </div>
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
                width: 90%;
                max-width: 500px;
                background: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 5px 30px rgba(0,0,0,0.2);
                z-index: 9998;
                animation: slideUp 0.5s ease;
            }
            
            .install-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .install-icon {
                color: #c41e3a;
                font-size: 24px;
            }
            
            .install-text {
                flex: 1;
            }
            
            .install-text h4 {
                margin: 0 0 5px 0;
                font-size: 1rem;
            }
            
            .install-text p {
                margin: 0;
                color: #666;
                font-size: 0.9rem;
            }
            
            .install-actions {
                display: flex;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);
        
        // Handle install
        installPrompt.querySelector('.install-confirm').addEventListener('click', async () => {
            installPrompt.remove();
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            trackEvent('pwa_install', { outcome: outcome });
            deferredPrompt = null;
        });
        
        // Handle dismiss
        installPrompt.querySelector('.install-dismiss').addEventListener('click', () => {
            installPrompt.remove();
            localStorage.setItem('installPromptDismissed', 'true');
            trackEvent('pwa_dismiss');
        });
    }
    
    function showUpdateNotification() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <p>A new version is available. Refresh to update?</p>
                <button class="btn btn-primary update-btn">Refresh</button>
            </div>
        `;
        
        document.body.appendChild(updateBanner);
        
        updateBanner.querySelector('.update-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Monitor Core Web Vitals
if ('PerformanceObserver' in window) {
    try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            
            trackEvent('web_vital', {
                metric: 'LCP',
                value: lastEntry.startTime,
                rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs_improvement' : 'poor'
            });
        });
        lcpObserver.observe({type: 'largest-contentful-paint', buffered: true});
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
                
                trackEvent('web_vital', {
                    metric: 'FID',
                    value: entry.processingStart - entry.startTime,
                    rating: entry.processingStart - entry.startTime < 100 ? 'good' : entry.processingStart - entry.startTime < 300 ? 'needs_improvement' : 'poor'
                });
            });
        });
        fidObserver.observe({type: 'first-input', buffered: true});
        
        // Cumulative Layout Shift
        let clsValue = 0;
        let clsEntries = [];
        
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsEntries.push(entry);
                    clsValue += entry.value;
                    console.log('CLS:', clsValue);
                    
                    trackEvent('web_vital', {
                        metric: 'CLS',
                        value: clsValue,
                        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
                    });
                }
            }
        });
        clsObserver.observe({type: 'layout-shift', buffered: true});
    } catch (e) {
        console.log('Performance monitoring error:', e);
    }
}

// Log page load performance
window.addEventListener('load', () => {
    if ('performance' in window) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        console.log(`Page loaded in ${loadTime}ms`);
        console.log(`DOM ready in ${domReadyTime}ms`);
        
        trackEvent('page_load', {
            load_time: loadTime,
            dom_ready_time: domReadyTime,
            connection_time: timing.connectEnd - timing.connectStart,
            dns_time: timing.domainLookupEnd - timing.domainLookupStart
        });
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Format phone number
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '+254 ' + match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return phone;
}

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    trackEvent('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error?.toString()
    });
    
    return false;
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    trackEvent('promise_rejection', {
        reason: e.reason?.toString()
    });
});

// ============================================
// EXPORT FOR MODULE USAGE (IF NEEDED)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        validateField,
        trackEvent,
        animateCounter,
        formatPhoneNumber
    };
}
