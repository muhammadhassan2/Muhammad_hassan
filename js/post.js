/**
 * Single Post Page JavaScript
 * Handles loading and rendering markdown content
 */

document.addEventListener('DOMContentLoaded', () => {
    loadPost();
});

// Get post ID from URL
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load and display post
async function loadPost() {
    const postId = getPostIdFromUrl();
    
    if (!postId) {
        showError('Post not found');
        return;
    }
    
    const post = getPostById(postId);
    
    if (!post) {
        showError('Post not found');
        return;
    }
    
    // Update page metadata
    document.title = `${post.title} - TechBlog`;
    document.querySelector('meta[name="description"]').setAttribute('content', post.summary);
    
    // Display post header
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-date').textContent = formatDate(post.date);
    document.getElementById('post-reading-time').textContent = post.readingTime;
    
    // Display tags
    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = post.tags.map(tag => 
        `<span class="tag" onclick="window.location.href='blog.html'">${tag}</span>`
    ).join('');
    
    // Load and render markdown content
    try {
        const response = await fetch(post.content);
        if (!response.ok) {
            throw new Error('Failed to load post content');
        }
        
        const markdown = await response.text();
        renderMarkdown(markdown);
    } catch (error) {
        console.error('Error loading post:', error);
        showError('Failed to load post content. Please try again later.');
    }
    
    // Load related posts
    loadRelatedPosts(postId);
}

// Render markdown content
function renderMarkdown(markdown) {
    const container = document.getElementById('post-body');
    
    // Configure marked options
    marked.setOptions({
        highlight: function(code, lang) {
            if (Prism.languages[lang]) {
                return Prism.highlight(code, Prism.languages[lang], lang);
            }
            return code;
        },
        breaks: true,
        gfm: true
    });
    
    // Render markdown
    const html = marked.parse(markdown);
    container.innerHTML = html;
    
    // Render math equations with KaTeX
    renderMathInElement(container, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false}
        ],
        throwOnError: false
    });
    
    // Highlight code blocks
    Prism.highlightAllUnder(container);
}

// Load related posts
function loadRelatedPosts(postId) {
    const container = document.getElementById('related-posts-container');
    if (!container) return;
    
    const relatedPosts = getRelatedPosts(postId, 3);
    
    if (relatedPosts.length === 0) {
        container.parentElement.style.display = 'none';
        return;
    }
    
    container.innerHTML = relatedPosts.map(post => `
        <article class="post-card" onclick="navigateToPost('${post.id}')">
            <h3 class="post-card-title">${post.title}</h3>
            <time class="post-card-date">${formatDate(post.date)}</time>
            <p class="post-card-summary">${post.summary}</p>
            <div class="post-card-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `).join('');
}

// Show error message
function showError(message) {
    document.getElementById('post-title').textContent = 'Error';
    document.getElementById('post-body').innerHTML = `<p class="loading">${message}</p>`;
}

// Navigate to post page
function navigateToPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// Share functionality
function shareOnTwitter() {
    const url = window.location.href;
    const title = document.getElementById('post-title').textContent;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnLinkedIn() {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}
