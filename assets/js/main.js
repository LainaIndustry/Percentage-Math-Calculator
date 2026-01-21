// Main JavaScript - Common functionality across all pages

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initDarkMode();
    initMobileMenu();
    initNavigation();
    initCurrentYear();
    initCookieConsent();
    initAdSense();
});

// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Toggle theme on button click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button aria-label
            const label = newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            darkModeToggle.setAttribute('aria-label', label);
            
            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Update aria-expanded
            const isExpanded = nav.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', false);
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', false);
                document.body.style.overflow = '';
            }
        });
    }
}

// Navigation - Highlight current page
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref.includes(currentPage.replace('.html', '')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update copyright year
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
}

// Cookie Consent
function initCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn cookie-accept">Accept</button>
                    <button class="btn cookie-decline">Decline</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--bg-color);
                color: var(--text-color);
                padding: 1rem;
                box-shadow: 0 -2px 10px var(--shadow-color);
                z-index: 1000;
                border-top: 1px solid var(--border-color);
            }
            .cookie-content {
                max-width: var(--max-width);
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
            }
            .cookie-banner p {
                margin: 0;
                flex: 1;
            }
            .cookie-buttons {
                display: flex;
                gap: 1rem;
            }
            .cookie-accept {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 8px 16px;
            }
            .cookie-decline {
                background: var(--bg-light);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                padding: 8px 16px;
            }
            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(cookieBanner);
        
        // Add event listeners
        cookieBanner.querySelector('.cookie-accept').addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
        
        cookieBanner.querySelector('.cookie-decline').addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'false');
            cookieBanner.style.display = 'none';
        });
    }
}

// AdSense Initialization
function initAdSense() {
    // Load ad configuration
    const adContainers = document.querySelectorAll('[data-ad]');
    
    adContainers.forEach(container => {
        const adType = container.getAttribute('data-ad');
        loadAd(adType, container);
    });
}

function loadAd(adType, container) {
    // This would be replaced with actual AdSense code
    // For now, show placeholders
    const placeholder = createAdPlaceholder(adType);
    container.innerHTML = placeholder;
}

function createAdPlaceholder(adType) {
    const sizes = {
        'top-banner': { width: 728, height: 90 },
        'middle-rectangle': { width: 336, height: 280 },
        'sidebar': { width: 300, height: 600 },
        'bottom-banner': { width: 728, height: 90 }
    };
    
    const size = sizes[adType] || sizes['middle-rectangle'];
    
    return `
        <div class="ad-placeholder" style="width: 100%; max-width: ${size.width}px; margin: 0 auto;">
            <div class="ad-preview" style="width: 100%; height: ${size.height}px; background: linear-gradient(45deg, var(--bg-light) 25%, var(--bg-lighter) 25%, var(--bg-lighter) 50%, var(--bg-light) 50%, var(--bg-light) 75%, var(--bg-lighter) 75%); background-size: 20px 20px; display: flex; align-items: center; justify-content: center; border: 2px dashed var(--border-color); border-radius: 8px;">
                <div style="text-align: center; color: var(--text-light); padding: 20px;">
                    <p style="font-weight: bold; margin-bottom: 5px;">AdSense ${adType.replace('-', ' ').toUpperCase()}</p>
                    <p style="font-size: 12px; margin: 0;">${size.width}×${size.height}</p>
                </div>
            </div>
            <p style="text-align: center; color: var(--text-lighter); font-size: 11px; margin-top: 5px;">Ad placeholder - Replace with AdSense code after approval</p>
        </div>
    `;
}

// Utility Functions
function formatNumber(num, decimals = 2) {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .notification-info {
                background: var(--primary-color);
            }
            .notification-success {
                background: var(--success-color);
            }
            .notification-error {
                background: var(--error-color);
            }
            .notification-warning {
                background: var(--warning-color);
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDarkMode,
        initMobileMenu,
        initNavigation,
        initCurrentYear,
        formatNumber,
        showNotification
    };
}
