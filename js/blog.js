/**
 * Blog Page JavaScript
 * Handles filtering, searching, and pagination
 */

let currentTag = 'all';
let currentPage = 1;
const postsPerPage = 9;
let filteredPosts = [];

document.addEventListener('DOMContentLoaded', () => {
    initTagFilters();
    initSearch();
    loadPosts();
});

// Initialize tag filters
function initTagFilters() {
    const filterContainer = document.getElementById('tag-filters');
    if (!filterContainer) return;
    
    const tags = getAllTags();
    
    // Add "All" button (already in HTML)
    const allButton = filterContainer.querySelector('[data-tag="all"]');
    if (allButton) {
        allButton.addEventListener('click', () => filterByTag('all'));
    }
    
    // Add tag buttons
    tags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag';
        button.textContent = tag;
        button.setAttribute('data-tag', tag);
        button.addEventListener('click', () => filterByTag(tag));
        filterContainer.appendChild(button);
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });
}

// Handle search
function handleSearch(query) {
    if (query.trim() === '') {
        filterByTag(currentTag);
    } else {
        filteredPosts = searchPosts(query);
        currentPage = 1;
        displayPosts();
    }
}

// Filter posts by tag
function filterByTag(tag) {
    currentTag = tag;
    currentPage = 1;
    
    // Update active tag button
    document.querySelectorAll('.tag-filters .tag').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tag') === tag) {
            btn.classList.add('active');
        }
    });
    
    // Clear search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    loadPosts();
}

// Load posts based on current filter/search
function loadPosts() {
    filteredPosts = getPostsByTag(currentTag);
    displayPosts();
}

// Display posts for current page
function displayPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    if (postsToShow.length === 0) {
        container.innerHTML = '<p class="loading">No posts found.</p>';
        updatePagination();
        return;
    }
    
    container.innerHTML = postsToShow.map(post => createPostCard(post)).join('');
    updatePagination();
}

// Create HTML for a post card
function createPostCard(post) {
    return `
        <article class="post-card" onclick="navigateToPost('${post.id}')">
            <h3 class="post-card-title">${post.title}</h3>
            <time class="post-card-date">${formatDate(post.date)} • ${post.readingTime}</time>
            <p class="post-card-summary">${post.summary}</p>
            <div class="post-card-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `;
}

// Update pagination controls
function updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span>...</span>`;
        }
    }
    
    // Next button
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
    
    paginationContainer.innerHTML = html;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigate to post page
function navigateToPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}
