// Blog JavaScript - Handles blog functionality

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Load blog posts if on blog page
    if (document.querySelector('.blog-grid')) {
        loadBlogPosts();
        setupBlogFilters();
        setupBlogSearch();
        setupPagination();
    }
    
    // Load blog post if on single post page
    if (document.querySelector('.blog-post-content')) {
        loadBlogPost();
        setupSocialShare();
        setupReadingProgress();
    }
});

// Blog Posts Loading
function loadBlogPosts(page = 1, postsPerPage = 6) {
    const blogGrid = document.getElementById('blogGrid');
    const noResults = document.getElementById('noResults');
    const currentPage = document.getElementById('currentPage');
    const totalPages = document.getElementById('totalPages');
    
    if (!blogGrid) return;
    
    // Get all posts (in real implementation, this would be from an API)
    const allPosts = window.BLOG_POSTS || getAllBlogPosts();
    
    // Filter by category if specified
    let filteredPosts = allPosts;
    const activeCategory = document.querySelector('.category-link.active');
    if (activeCategory && activeCategory.dataset.category !== 'all') {
        filteredPosts = getPostsByCategory(activeCategory.dataset.category);
    }
    
    // Filter by search if specified
    const searchInput = document.getElementById('blogSearch');
    if (searchInput && searchInput.value.trim()) {
        filteredPosts = searchPosts(filteredPosts, searchInput.value.trim());
    }
    
    // Calculate pagination
    const totalPosts = filteredPosts.length;
    const totalPageCount = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const pagePosts = filteredPosts.slice(startIndex, endIndex);
    
    // Update pagination controls
    if (currentPage) currentPage.textContent = page;
    if (totalPages) totalPages.textContent = totalPageCount;
    
    // Update pagination buttons
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= totalPageCount;
    
    // Clear grid
    blogGrid.innerHTML = '';
    
    // Show no results message if needed
    if (pagePosts.length === 0) {
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    // Render posts
    pagePosts.forEach(post => {
        const postElement = createBlogPostCard(post);
        blogGrid.appendChild(postElement);
    });
    
    // Store current state
    sessionStorage.setItem('blogCurrentPage', page);
    sessionStorage.setItem('blogCurrentCategory', activeCategory ? activeCategory.dataset.category : 'all');
    sessionStorage.setItem('blogCurrentSearch', searchInput ? searchInput.value : '');
}

// Create blog post card
function createBlogPostCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.dataset.id = post.id;
    card.dataset.category = post.category;
    
    // Format date
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="blog-image">
            ${post.image || '📝'}
        </div>
        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-date">${formattedDate}</span>
                <span class="blog-read-time">${post.readTime} read</span>
                <span class="blog-views">${post.views.toLocaleString()} views</span>
            </div>
            <span class="blog-category">${post.category}</span>
            <h3>${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <a href="blog-post.html?slug=${post.slug}" class="read-more">
                Read More →
            </a>
        </div>
    `;
    
    return card;
}

// Setup blog filters
function setupBlogFilters() {
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active category
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Reload posts
            loadBlogPosts(1);
        });
    });
    
    // Load saved category from session
    const savedCategory = sessionStorage.getItem('blogCurrentCategory');
    if (savedCategory) {
        const savedLink = document.querySelector(`.category-link[data-category="${savedCategory}"]`);
        if (savedLink) {
            categoryLinks.forEach(l => l.classList.remove('active'));
            savedLink.classList.add('active');
        }
    }
}

// Setup blog search
function setupBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const searchButton = document.querySelector('.blog-search button');
    
    if (!searchInput) return;
    
    // Load saved search
    const savedSearch = sessionStorage.getItem('blogCurrentSearch');
    if (savedSearch) {
        searchInput.value = savedSearch;
    }
    
    // Search on button click
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    }
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Debounced search on input
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 500);
    });
}

function performSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;
    
    // Save search term
    sessionStorage.setItem('blogCurrentSearch', searchInput.value);
    
    // Reload posts
    loadBlogPosts(1);
}

// Setup pagination
function setupPagination() {
    window.prevPage = function() {
        const currentPage = parseInt(document.getElementById('currentPage').textContent);
        if (currentPage > 1) {
            loadBlogPosts(currentPage - 1);
        }
    };
    
    window.nextPage = function() {
        const currentPage = parseInt(document.getElementById('currentPage').textContent);
        const totalPages = parseInt(document.getElementById('totalPages').textContent);
        if (currentPage < totalPages) {
            loadBlogPosts(currentPage + 1);
        }
    };
    
    // Load saved page from session
    const savedPage = sessionStorage.getItem('blogCurrentPage');
    if (savedPage) {
        loadBlogPosts(parseInt(savedPage));
    }
}

// Load single blog post
function loadBlogPost() {
    // Get slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        // Redirect to blog listing if no slug
        window.location.href = 'blog.html';
        return;
    }
    
    // Get post data (in real implementation, this would be from an API)
    const post = getPostBySlug(slug);
    
    if (!post) {
        // Show 404 or redirect
        document.querySelector('.blog-post-content').innerHTML = `
            <h2>Post Not Found</h2>
            <p>The blog post you're looking for doesn't exist.</p>
            <a href="blog.html" class="btn calculate-btn">Back to Blog</a>
        `;
        return;
    }
    
    // Update page title and meta
    document.title = `${post.title} | PercentageMath Blog`;
    
    // Update post content
    const postContainer = document.querySelector('.blog-post-content');
    if (postContainer) {
        postContainer.innerHTML = post.content;
        
        // Add styles for post content
        addBlogPostStyles();
    }
    
    // Update post header
    const postHeader = document.querySelector('.blog-post-header');
    if (postHeader) {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        postHeader.innerHTML = `
            <h1 class="blog-post-title">${post.title}</h1>
            <div class="blog-post-meta">
                <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span class="meta-text">${formattedDate}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    <span class="meta-text">${post.readTime} read</span>
                </span>
                <span class="meta-item">
                    <span class="meta-icon">👁️</span>
                    <span class="meta-text">${post.views.toLocaleString()} views</span>
                </span>
                <span class="meta-item">
                    <span class="meta-icon">📝</span>
                    <span class="meta-text">${post.author}</span>
                </span>
            </div>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
        `;
    }
    
    // Update related posts
    updateRelatedPosts(post);
    
    // Increment view count (in real implementation, this would be an API call)
    incrementViewCount(post.id);
}

// Setup social sharing
function setupSocialShare() {
    const shareButtons = document.querySelectorAll('.share-button');
    const currentUrl = encodeURIComponent(window.location.href);
    const currentTitle = encodeURIComponent(document.title);
    
    shareButtons.forEach(button => {
        const platform = button.classList[0].replace('share-', '');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            shareOnPlatform(platform, currentUrl, currentTitle);
        });
    });
}

function shareOnPlatform(platform, url, title) {
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            break;
        case 'pinterest':
            // Pinterest needs an image URL
            const imageUrl = encodeURIComponent('https://percentagemath.com/assets/images/blog-share.jpg');
            shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${imageUrl}&description=${title}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Setup reading progress
function setupReadingProgress() {
    const progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Update related posts
function updateRelatedPosts(currentPost) {
    const relatedContainer = document.querySelector('.related-grid');
    if (!relatedContainer) return;
    
    // Get related posts (same category, excluding current)
    const relatedPosts = getPostsByCategory(currentPost.category)
        .filter(post => post.id !== currentPost.id)
        .slice(0, 3);
    
    if (relatedPosts.length === 0) return;
    
    relatedContainer.innerHTML = relatedPosts.map(post => `
        <article class="related-card">
            <div class="related-image"></div>
            <div class="related-content">
                <h3>${post.title}</h3>
                <a href="blog-post.html?slug=${post.slug}" class="related-link">
                    Read Article →
                </a>
            </div>
        </article>
    `).join('');
}

// Increment view count (simulated)
function incrementViewCount(postId) {
    // In real implementation, this would be an API call
    console.log(`Incrementing views for post ${postId}`);
    
    // Simulate updating view count
    const post = BLOG_POSTS.find(p => p.id === postId);
    if (post) {
        post.views++;
    }
}

// Add blog post styles
function addBlogPostStyles() {
    const styleId = 'blog-post-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .blog-post-content h2 {
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
            font-size: 1.8rem;
        }
        
        .blog-post-content h3 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--text-color);
            font-size: 1.5rem;
        }
        
        .blog-post-content h4 {
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: var(--text-color);
            font-size: 1.3rem;
        }
        
        .blog-post-content p {
            margin-bottom: 1.5rem;
            line-height: 1.8;
        }
        
        .blog-post-content ul,
        .blog-post-content ol {
            margin: 1.5rem 0 1.5rem 2rem;
        }
        
        .blog-post-content li {
            margin-bottom: 0.75rem;
            line-height: 1.6;
        }
        
        .blog-post-content blockquote {
            border-left: 4px solid var(--primary-color);
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: var(--text-light);
        }
        
        .blog-post-content pre {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
            overflow-x: auto;
            margin: 1.5rem 0;
            font-family: 'Courier New', monospace;
        }
        
        .blog-post-content code {
            background: var(--bg-light);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: var(--secondary-color);
        }
        
        .blog-post-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
        }
        
        .blog-post-content th,
        .blog-post-content td {
            padding: 12px;
            border: 1px solid var(--border-color);
            text-align: left;
        }
        
        .blog-post-content th {
            background: var(--bg-light);
            font-weight: 600;
        }
        
        .formula-box,
        .proof-box,
        .example-box,
        .warning-box,
        .callout-box {
            background: var(--bg-light);
            border-radius: var(--radius-sm);
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-left: 4px solid var(--primary-color);
        }
        
        .warning-box {
            border-left-color: var(--warning-color);
            background: rgba(255, 152, 0, 0.1);
        }
        
        .callout-box {
            border-left-color: var(--success-color);
            background: rgba(76, 175, 80, 0.1);
        }
        
        .formula-box h3,
        .proof-box h3,
        .example-box h3,
        .warning-box h3,
        .callout-box h3 {
            margin-top: 0;
            color: inherit;
        }
        
        .conversion-table,
        .comparison-table,
        .example-table {
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        
        .metrics-grid,
        .properties-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .metric-card,
        .property {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
        }
        
        .discount-types {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .discount-type {
            background: var(--bg-lighter);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
        }
        
        .practice-problems {
            margin: 2rem 0;
        }
        
        .problem {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
            margin-bottom: 1rem;
        }
        
        .answer {
            display: block;
            margin-top: 0.5rem;
            color: var(--success-color);
            font-weight: 500;
        }
        
        .math-box {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
            margin: 1.5rem 0;
            font-family: 'Times New Roman', serif;
        }
        
        .set-theory {
            background: var(--bg-lighter);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
            margin: 1.5rem 0;
        }
        
        .challenge-box {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
            margin: 1.5rem 0;
            border: 2px solid var(--primary-color);
        }
        
        .case-study {
            background: var(--bg-lighter);
            padding: 2rem;
            border-radius: var(--radius);
            margin: 2rem 0;
            border-left: 4px solid var(--primary-color);
        }
        
        .visualization {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: var(--radius-sm);
            margin: 1.5rem 0;
            text-align: center;
        }
        
        .post-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .post-tag {
            background: var(--bg-light);
            color: var(--text-color);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .metrics-grid,
            .properties-grid,
            .discount-types {
                grid-template-columns: 1fr;
            }
            
            .blog-post-content h2 {
                font-size: 1.5rem;
            }
            
            .blog-post-content h3 {
                font-size: 1.3rem;
            }
            
            .formula-box,
            .proof-box,
            .example-box {
                padding: 1.25rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Newsletter subscription
function subscribeNewsletter() {
    const emailInput = document.querySelector('.newsletter-widget input');
    if (!emailInput || !emailInput.value) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    const email = emailInput.value;
    
    // Simulate subscription (in real implementation, this would be an API call)
    showNotification('Subscribed to newsletter!', 'success');
    emailInput.value = '';
    
    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
}

// Download cheat sheet
function downloadCheatSheet() {
    showNotification('Downloading cheat sheet...', 'info');
    
    // In real implementation, this would download a PDF
    // For now, show a message
    setTimeout(() => {
        showNotification('Cheat sheet downloaded!', 'success');
    }, 1000);
}

// Search posts function (helper)
function searchPosts(posts, query) {
    const searchTerm = query.toLowerCase();
    return posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.category.toLowerCase().includes(searchTerm)
    );
}

// Get posts by category (helper)
function getPostsByCategory(category) {
    return BLOG_POSTS.filter(post => post.category === category);
}

// Get post by slug (helper)
function getPostBySlug(slug) {
    return BLOG_POSTS.find(post => post.slug === slug);
}

// Show notification
function showNotification(message, type) {
    // Check if notification system exists in main.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback notification
        alert(message);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadBlogPosts,
        loadBlogPost,
        subscribeNewsletter,
        downloadCheatSheet
    };
}
