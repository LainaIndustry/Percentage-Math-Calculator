// AdSense Management Script
// This file handles all ad-related functionality

const AD_CONFIG = {
    // Set to true when you get AdSense approval
    adsEnabled: false,
    
    // Your AdSense publisher ID (replace after approval)
    publisherId: 'ca-pub-YOUR_PUBLISHER_ID_HERE',
    
    // Ad slots configuration
    adSlots: {
        topBanner: '1234567890',
        middleRectangle: '2345678901',
        bottomBanner: '3456789012',
        sidebar: '4567890123',
        inContent: '5678901234'
    },
    
    // Ad refresh intervals (in seconds)
    refreshIntervals: {
        topBanner: 30,
        middleRectangle: 60,
        sidebar: 45
    },
    
    // Current ad timers
    timers: {},
    
    // User preferences
    userPrefs: {
        allowAds: true,
        darkModeAds: false
    }
};

// Initialize ads when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load user preferences
    loadAdPreferences();
    
    // Initialize ads if enabled
    if (AD_CONFIG.adsEnabled && AD_CONFIG.userPrefs.allowAds) {
        initializeAds();
        setupAdRefresh();
    } else {
        showPlaceholderAds();
    }
    
    // Setup ad consent dialog
    setupAdConsent();
});

// Load user ad preferences from localStorage
function loadAdPreferences() {
    const savedPrefs = localStorage.getItem('percentageMathAdPrefs');
    if (savedPrefs) {
        AD_CONFIG.userPrefs = { ...AD_CONFIG.userPrefs, ...JSON.parse(savedPrefs) };
    }
}

// Save user ad preferences
function saveAdPreferences() {
    localStorage.setItem('percentageMathAdPrefs', JSON.stringify(AD_CONFIG.userPrefs));
}

// Initialize Google AdSense
function initializeAds() {
    if (!AD_CONFIG.adsEnabled) {
        console.log('AdSense is not enabled yet. Using placeholders.');
        return;
    }
    
    // Load AdSense script
    loadAdSenseScript();
    
    // Initialize ad slots
    initializeAdSlots();
    
    console.log('AdSense initialized');
}

// Load Google AdSense script
function loadAdSenseScript() {
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

// Initialize individual ad slots
function initializeAdSlots() {
    // Top Banner Ad
    initializeAdSlot('ad-top-banner', AD_CONFIG.adSlots.topBanner, 'auto', true);
    
    // Middle Rectangle Ad
    initializeAdSlot('ad-middle-rectangle', AD_CONFIG.adSlots.middleRectangle, 'rectangle');
    
    // Bottom Banner Ad
    initializeAdSlot('ad-bottom-banner', AD_CONFIG.adSlots.bottomBanner, 'auto', true);
    
    // Sidebar Ad (for blog pages)
    initializeAdSlot('ad-sidebar', AD_CONFIG.adSlots.sidebar, 'vertical');
    
    // In-content Ad
    initializeAdSlot('ad-in-content', AD_CONFIG.adSlots.inContent, 'auto', true);
}

// Initialize a specific ad slot
function initializeAdSlot(containerId, adSlot, format = 'auto', responsive = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create ad element
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.setAttribute('data-ad-client', AD_CONFIG.publisherId);
    adElement.setAttribute('data-ad-slot', adSlot);
    adElement.setAttribute('data-ad-format', format);
    
    if (responsive) {
        adElement.setAttribute('data-full-width-responsive', 'true');
    }
    
    // Add ad to container
    container.appendChild(adElement);
    
    // Push ad to AdSense
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
        console.error('Error loading ad:', error);
        showPlaceholderAd(container, format);
    }
}

// Show placeholder ads (before AdSense approval)
function showPlaceholderAds() {
    // Replace all ad containers with placeholders
    const adContainers = document.querySelectorAll('[id^="ad-"]');
    
    adContainers.forEach(container => {
        const adType = container.id.replace('ad-', '');
        showPlaceholderAd(container, getFormatFromType(adType));
    });
}

// Show individual placeholder ad
function showPlaceholderAd(container, format) {
    const dimensions = getAdDimensions(format);
    
    container.innerHTML = `
        <div class="ad-placeholder" style="width: 100%; max-width: ${dimensions.width}px; margin: 0 auto;">
            <div class="ad-preview" style="width: 100%; height: ${dimensions.height}px; background: linear-gradient(45deg, var(--bg-light) 25%, var(--bg-lighter) 25%, var(--bg-lighter) 50%, var(--bg-light) 50%, var(--bg-light) 75%, var(--bg-lighter) 75%); background-size: 20px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed var(--border-color); border-radius: 8px; padding: 20px;">
                <div style="text-align: center; color: var(--text-light); margin-bottom: 10px;">
                    <p style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">Ad Space</p>
                    <p style="font-size: 14px; margin: 0;">${dimensions.width}×${dimensions.height}</p>
                </div>
                <div style="text-align: center; max-width: 300px;">
                    <p style="font-size: 12px; color: var(--text-lighter); margin: 5px 0;">Ad will appear here after AdSense approval</p>
                    <button onclick="enableTestAds()" style="background: var(--primary-color); color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; margin-top: 10px;">
                        Click to Test Ad Layout
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get ad dimensions based on format
function getAdDimensions(format) {
    const dimensions = {
        'auto': { width: 728, height: 90 },
        'rectangle': { width: 336, height: 280 },
        'vertical': { width: 300, height: 600 },
        'banner': { width: 468, height: 60 },
        'large': { width: 970, height: 90 }
    };
    
    return dimensions[format] || dimensions['auto'];
}

// Get format from ad type
function getFormatFromType(adType) {
    if (adType.includes('banner')) return 'auto';
    if (adType.includes('rectangle')) return 'rectangle';
    if (adType.includes('sidebar')) return 'vertical';
    return 'auto';
}

// Setup ad refresh intervals
function setupAdRefresh() {
    if (!AD_CONFIG.adsEnabled) return;
    
    // Clear existing timers
    Object.values(AD_CONFIG.timers).forEach(timer => clearInterval(timer));
    AD_CONFIG.timers = {};
    
    // Setup refresh for each ad type
    Object.entries(AD_CONFIG.refreshIntervals).forEach(([adType, interval]) => {
        if (interval > 0) {
            AD_CONFIG.timers[adType] = setInterval(() => {
                refreshAd(adType);
            }, interval * 1000);
        }
    });
}

// Refresh specific ad
function refreshAd(adType) {
    const containerId = `ad-${adType}`;
    const container = document.getElementById(containerId);
    
    if (container && AD_CONFIG.adsEnabled) {
        // Remove old ad
        container.innerHTML = '';
        
        // Create new ad
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', AD_CONFIG.publisherId);
        adElement.setAttribute('data-ad-slot', AD_CONFIG.adSlots[adType]);
        adElement.setAttribute('data-ad-format', getFormatFromType(adType));
        
        if (adType.includes('banner')) {
            adElement.setAttribute('data-full-width-responsive', 'true');
        }
        
        container.appendChild(adElement);
        
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error('Error refreshing ad:', error);
        }
    }
}

// Setup ad consent dialog
function setupAdConsent() {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('adConsentGiven');
    
    if (!consentGiven) {
        showAdConsentDialog();
    }
}

// Show ad consent dialog
function showAdConsentDialog() {
    const dialog = document.createElement('div');
    dialog.id = 'ad-consent-dialog';
    dialog.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        left: 20px;
        max-width: 400px;
        background: var(--bg-color);
        color: var(--text-color);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px var(--shadow-color);
        z-index: 9999;
        border: 1px solid var(--border-color);
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">Advertisement Consent</h3>
        <p style="margin-bottom: 15px; font-size: 14px; line-height: 1.5;">
            We use ads to keep this service free. By clicking "Accept", you agree to see personalized ads. You can change this anytime in settings.
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button onclick="acceptAds()" style="flex: 1; background: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Accept Ads
            </button>
            <button onclick="declineAds()" style="flex: 1; background: var(--bg-light); color: var(--text-color); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                Decline
            </button>
            <button onclick="learnMoreAboutAds()" style="background: none; border: none; color: var(--primary-color); text-decoration: underline; padding: 10px; cursor: pointer; font-size: 13px;">
                Learn More
            </button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add styles for mobile
    if (window.innerWidth <= 768) {
        dialog.style.left = '10px';
        dialog.style.right = '10px';
        dialog.style.bottom = '10px';
    }
}

// Accept ads
function acceptAds() {
    AD_CONFIG.userPrefs.allowAds = true;
    saveAdPreferences();
    localStorage.setItem('adConsentGiven', 'true');
    
    // Hide dialog
    const dialog = document.getElementById('ad-consent-dialog');
    if (dialog) dialog.remove();
    
    // Initialize ads
    if (AD_CONFIG.adsEnabled) {
        initializeAds();
    }
    
    // Show confirmation
    showAdNotification('Ads enabled. Thank you for supporting us!', 'success');
}

// Decline ads
function declineAds() {
    AD_CONFIG.userPrefs.allowAds = false;
    saveAdPreferences();
    localStorage.setItem('adConsentGiven', 'false');
    
    // Hide dialog
    const dialog = document.getElementById('ad-consent-dialog');
    if (dialog) dialog.remove();
    
    // Show placeholders
    showPlaceholderAds();
    
    // Show confirmation
    showAdNotification('Ads disabled. You can enable them anytime in settings.', 'info');
}

// Learn more about ads
function learnMoreAboutAds() {
    const dialog = document.getElementById('ad-consent-dialog');
    if (dialog) {
        dialog.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px;">About Our Ads</h3>
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 15px;">
                <p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                    <strong>Why we show ads:</strong> Ads help us keep PercentageMath free for everyone. We don't charge users, so advertising allows us to maintain and improve our services.
                </p>
                <p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                    <strong>Ad types:</strong> We show Google AdSense ads that are relevant to percentage calculations, math tools, and educational content.
                </p>
                <p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                    <strong>Privacy:</strong> We respect your privacy. Ads are served by Google, and you can learn about Google's advertising practices in their privacy policy.
                </p>
                <p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                    <strong>Control:</strong> You can disable ads anytime. However, this may limit some features as we rely on ad revenue to operate.
                </p>
                <p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                    <strong>Alternative:</strong> If you prefer an ad-free experience, consider supporting us through alternative methods (coming soon).
                </p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="showAdConsentDialog()" style="background: none; border: none; color: var(--primary-color); text-decoration: underline; padding: 10px; cursor: pointer;">
                    ← Back
                </button>
                <button onclick="acceptAds()" style="flex: 1; background: var(--primary-color); color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                    I Understand, Accept Ads
                </button>
            </div>
        `;
    }
}

// Show ad notification
function showAdNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px var(--shadow-color);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add animation styles if not already present
    if (!document.getElementById('ad-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'ad-notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enable AdSense (call this after approval)
function enableAdSense(publisherId, adSlots) {
    AD_CONFIG.adsEnabled = true;
    AD_CONFIG.publisherId = publisherId;
    AD_CONFIG.adSlots = { ...AD_CONFIG.adSlots, ...adSlots };
    
    // Save to localStorage
    localStorage.setItem('percentageMathAdConfig', JSON.stringify({
        adsEnabled: true,
        publisherId: publisherId,
        adSlots: AD_CONFIG.adSlots
    }));
    
    // Initialize ads
    initializeAds();
    setupAdRefresh();
    
    console.log('AdSense enabled with publisher ID:', publisherId);
}

// Enable test ads (for layout testing before approval)
function enableTestAds() {
    // Replace placeholders with test ads
    const adContainers = document.querySelectorAll('.ad-placeholder');
    
    adContainers.forEach(container => {
        container.innerHTML = `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border-radius: 6px;">
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">TEST AD</div>
                    <div style="font-size: 14px; opacity: 0.9;">AdSense Placement</div>
                    <div style="font-size: 12px; margin-top: 15px; opacity: 0.8;">This is how ads will appear</div>
                    <button onclick="this.parentElement.parentElement.innerHTML='Ad closed. Refresh page to see again.'" 
                            style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 5px 15px; border-radius: 4px; margin-top: 15px; cursor: pointer;">
                        Close Test Ad
                    </button>
                </div>
            </div>
        `;
    });
    
    showAdNotification('Test ads enabled. This simulates how real ads will look.', 'info');
}

// Toggle ads on/off
function toggleAds() {
    AD_CONFIG.userPrefs.allowAds = !AD_CONFIG.userPrefs.allowAds;
    saveAdPreferences();
    
    if (AD_CONFIG.userPrefs.allowAds && AD_CONFIG.adsEnabled) {
        initializeAds();
        showAdNotification('Ads enabled', 'success');
    } else {
        showPlaceholderAds();
        showAdNotification('Ads disabled', 'info');
    }
}

// Get ad settings for admin panel
function getAdSettings() {
    return {
        enabled: AD_CONFIG.adsEnabled,
        publisherId: AD_CONFIG.publisherId,
        adSlots: AD_CONFIG.adSlots,
        userPrefs: AD_CONFIG.userPrefs
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AD_CONFIG,
        initializeAds,
        enableAdSense,
        toggleAds,
        getAdSettings,
        acceptAds,
        declineAds,
        enableTestAds
    };
}
