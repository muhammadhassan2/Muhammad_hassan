/**
 * Main JavaScript for Home Page
 * Handles loading and displaying recent posts
 */

document.addEventListener('DOMContentLoaded', () => {
    loadRecentPosts();
    initMobileMenu();
});

// Load and display recent posts on home page
function loadRecentPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    const recentPosts = getRecentPosts(6);
    
    if (recentPosts.length === 0) {
        container.innerHTML = '<p class="loading">No posts available yet.</p>';
        return;
    }
    
    container.innerHTML = recentPosts.map(post => createPostCard(post)).join('');
}

// Create HTML for a post card
function createPostCard(post) {
    return `
        <article class="post-card" onclick="navigateToPost('${post.id}')">
            <h3 class="post-card-title">${post.title}</h3>
            <time class="post-card-date">${formatDate(post.date)}</time>
            <p class="post-card-summary">${post.summary}</p>
            <div class="post-card-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `;
}

// Navigate to post page
function navigateToPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// Mobile menu toggle
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}
