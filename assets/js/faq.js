// FAQ Toggle Functionality

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
});

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            } else {
                this.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Add keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = Array.from(faqQuestions).indexOf(this);
                let nextIndex;
                
                if (e.key === 'ArrowDown') {
                    nextIndex = currentIndex < faqQuestions.length - 1 ? currentIndex + 1 : 0;
                } else {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : faqQuestions.length - 1;
                }
                
                faqQuestions[nextIndex].focus();
            }
        });
    });
    
    // Open FAQ from URL hash
    const hash = window.location.hash;
    if (hash) {
        const faqItem = document.querySelector(hash);
        if (faqItem && faqItem.classList.contains('faq-item')) {
            faqItem.classList.add('active');
            const question = faqItem.querySelector('.faq-question');
            if (question) {
                question.setAttribute('aria-expanded', 'true');
                question.focus();
            }
        }
    }
}

// Search FAQ functionality (optional)
function initFAQSearcher() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search FAQs...';
    searchInput.className = 'faq-search';
    
    const faqSection = document.querySelector('.faq-section');
    if (faqSection) {
        const faqContainer = faqSection.querySelector('.faq-container');
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 16px;
            margin-bottom: 1rem;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-size: 1rem;
            background-color: var(--bg-color);
            color: var(--text-color);
        `;
        
        faqContainer.parentNode.insertBefore(searchInput, faqContainer);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.classList.add('active'); // Show answer if search matches
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                }
            });
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFAQ,
        initFAQSearcher
    };
}
