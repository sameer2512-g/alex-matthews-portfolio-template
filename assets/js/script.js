// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeNavigation();
        initializeSmoothScrolling();
        initializeAnimations();
        initializeFormHandling();
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            try {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            } catch (error) {
                console.error('Error toggling navigation:', error);
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                try {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                } catch (error) {
                    console.error('Error closing navigation:', error);
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            try {
                if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            } catch (error) {
                console.error('Error handling outside click:', error);
            }
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            try {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error('Error with smooth scrolling:', error);
            }
        });
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    try {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.portfolio-item, .experience-item, .skill-item, .reference-item, .blog-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}

// Form handling (for contact forms)
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(form);
                const formObject = {};
                
                // Convert FormData to object
                for (let [key, value] of formData.entries()) {
                    formObject[key] = value;
                }
                
                // Validate form
                const validation = validateForm(formObject);
                
                if (validation.isValid) {
                    handleFormSubmission(form, formObject);
                } else {
                    displayFormErrors(form, validation.errors);
                }
            } catch (error) {
                console.error('Error handling form submission:', error);
                showNotification('An error occurred. Please try again.', 'error');
            }
        });
    });
}

// Form validation
function validateForm(data) {
    const errors = {};
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
        isValid = false;
    }
    
    return { isValid, errors };
}

// Display form errors
function displayFormErrors(form, errors) {
    // Clear previous errors
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());
    
    // Display new errors
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errors[fieldName];
            errorElement.style.color = '#ff4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            
            field.parentNode.insertBefore(errorElement, field.nextSibling);
            field.style.borderColor = '#ff4444';
        }
    });
}

// Handle form submission
function handleFormSubmission(form, data) {
    try {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Clear any error styling
            const fields = form.querySelectorAll('input, textarea');
            fields.forEach(field => {
                field.style.borderColor = '';
            });
            
            // Show success message
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            
            console.log('Form submitted:', data);
        }, 2000);
        
    } catch (error) {
        console.error('Error in form submission:', error);
        showNotification('An error occurred. Please try again.', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    try {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#10b981';
                break;
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            default:
                notification.style.backgroundColor = '#3b82f6';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Utility function to debounce events
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

// Handle scroll events for header background
function initializeScrollEffects() {
    try {
        const header = document.querySelector('.header');
        
        const handleScroll = debounce(() => {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            } else {
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    } catch (error) {
        console.error('Error initializing scroll effects:', error);
    }
}

// Initialize scroll effects
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollEffects();
});

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    try {
        // Close mobile menu with Escape key
        if (e.key === 'Escape') {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    } catch (error) {
        console.error('Error handling keyboard navigation:', error);
    }
});

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    try {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    } catch (error) {
        console.error('Error initializing lazy loading:', error);
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Error handling for uncaught errors
window.addEventListener('error', function(e) {
    console.error('Uncaught error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});
