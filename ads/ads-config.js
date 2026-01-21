// Google AdSense Configuration
// Replace with your actual AdSense code after approval

const ADS_CONFIG = {
    enabled: true,
    publisherId: 'ca-pub-YOUR_PUBLISHER_ID_HERE',
    adSlots: {
        topBanner: '1234567890',
        middleRectangle: '2345678901',
        bottomBanner: '3456789012',
        sidebar: '4567890123'
    },
    adSizes: {
        topBanner: '728x90',
        middleRectangle: '336x280',
        bottomBanner: '728x90',
        sidebar: '300x600'
    },
    // Show placeholder ads until AdSense is approved
    showPlaceholders: true
};

// Ad loading functions
function loadAdTopBanner() {
    if (ADS_CONFIG.showPlaceholders) {
        return `
        <div class="ad-placeholder">
            <div class="ad-preview">
                <div style="width: 728px; height: 90px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
                    <p style="color: #666; font-size: 14px;">Google AdSense Top Banner (728x90)</p>
                </div>
                <p style="text-align: center; color: #999; font-size: 12px; margin-top: 5px;">Ad will appear here after AdSense approval</p>
            </div>
        </div>`;
    }
    
    return `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.publisherId}" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="${ADS_CONFIG.publisherId}"
        data-ad-slot="${ADS_CONFIG.adSlots.topBanner}"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>`;
}

function loadAdMiddleRectangle() {
    if (ADS_CONFIG.showPlaceholders) {
        return `
        <div class="ad-placeholder">
            <div class="ad-preview">
                <div style="width: 336px; height: 280px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
                    <p style="color: #666; font-size: 14px; text-align: center;">Google AdSense<br>Middle Rectangle<br>(336x280)</p>
                </div>
                <p style="text-align: center; color: #999; font-size: 12px; margin-top: 5px;">Ad will appear here after AdSense approval</p>
            </div>
        </div>`;
    }
    
    return `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.publisherId}" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="${ADS_CONFIG.publisherId}"
        data-ad-slot="${ADS_CONFIG.adSlots.middleRectangle}"
        data-ad-format="rectangle"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>`;
}

function loadAdSidebar() {
    if (ADS_CONFIG.showPlaceholders) {
        return `
        <div class="ad-placeholder">
            <div class="ad-preview">
                <div style="width: 300px; height: 600px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
                    <p style="color: #666; font-size: 14px; text-align: center;">Google AdSense<br>Sidebar Skyscraper<br>(300x600)</p>
                </div>
                <p style="text-align: center; color: #999; font-size: 12px; margin-top: 5px;">Ad will appear here after AdSense approval</p>
            </div>
        </div>`;
    }
    
    return `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.publisherId}" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="${ADS_CONFIG.publisherId}"
        data-ad-slot="${ADS_CONFIG.adSlots.sidebar}"
        data-ad-format="vertical"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>`;
}

// Initialize ads on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load ads into containers
    const adContainers = document.querySelectorAll('[data-ad-type]');
    
    adContainers.forEach(container => {
        const adType = container.getAttribute('data-ad-type');
        let adHtml = '';
        
        switch(adType) {
            case 'top-banner':
                adHtml = loadAdTopBanner();
                break;
            case 'middle-rectangle':
                adHtml = loadAdMiddleRectangle();
                break;
            case 'sidebar':
                adHtml = loadAdSidebar();
                break;
            case 'bottom-banner':
                adHtml = loadAdTopBanner(); // Same as top banner
                break;
        }
        
        container.innerHTML = adHtml;
    });
});

// Function to update AdSense settings after approval
function enableRealAds(publisherId, adSlots) {
    ADS_CONFIG.publisherId = publisherId;
    ADS_CONFIG.adSlots = adSlots;
    ADS_CONFIG.showPlaceholders = false;
    
    // Reload ads
    document.querySelectorAll('.ad-container').forEach(container => {
        container.innerHTML = '<div class="ad-loading">Loading ads...</div>';
    });
    
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ADS_CONFIG, loadAdTopBanner, loadAdMiddleRectangle, loadAdSidebar, enableRealAds };
}
