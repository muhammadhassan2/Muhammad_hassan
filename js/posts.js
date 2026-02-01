/**
 * Posts Data and Management
 * Central location for all blog posts metadata
 */

const POSTS = [
    {
        id: 'understanding-move-semantics-cpp',
        title: 'Understanding Move Semantics in Modern C++',
        date: '2026-01-28',
        summary: 'A deep dive into move semantics, rvalue references, and how they improve performance in modern C++ applications.',
        tags: ['C++', 'Performance', 'Programming'],
        content: 'posts/understanding-move-semantics-cpp.md',
        readingTime: '8 min read'
    },
    {
        id: 'neural-networks-from-scratch',
        title: 'Building Neural Networks from Scratch',
        date: '2026-01-20',
        summary: 'Implementing a neural network using only NumPy to understand the fundamentals of backpropagation and gradient descent.',
        tags: ['AI', 'Machine Learning', 'Python'],
        content: 'posts/neural-networks-from-scratch.md',
        readingTime: '12 min read'
    },
    {
        id: 'intro-to-shader-programming',
        title: 'Introduction to Shader Programming',
        date: '2026-01-15',
        summary: 'Learn the basics of vertex and fragment shaders, and create your first GPU-accelerated visual effects.',
        tags: ['Graphics', 'Shaders', 'GLSL'],
        content: 'posts/intro-to-shader-programming.md',
        readingTime: '10 min read'
    },
    {
        id: 'probability-theory-ml',
        title: 'Probability Theory for Machine Learning',
        date: '2026-01-10',
        summary: 'Essential probability concepts every ML engineer should know, from Bayes theorem to probability distributions.',
        tags: ['Math', 'Machine Learning', 'Probability'],
        content: 'posts/probability-theory-ml.md',
        readingTime: '15 min read'
    },
    {
        id: 'modern-cpp-best-practices',
        title: 'Modern C++ Best Practices in 2026',
        date: '2026-01-05',
        summary: 'A comprehensive guide to writing clean, efficient, and maintainable C++ code using C++20 and C++23 features.',
        tags: ['C++', 'Best Practices', 'Software Engineering'],
        content: 'posts/modern-cpp-best-practices.md',
        readingTime: '10 min read'
    }
];

// Get all posts sorted by date (newest first)
function getAllPosts() {
    return [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get a single post by ID
function getPostById(id) {
    return POSTS.find(post => post.id === id);
}

// Get recent posts (limit)
function getRecentPosts(limit = 3) {
    return getAllPosts().slice(0, limit);
}

// Get posts by tag
function getPostsByTag(tag) {
    if (tag === 'all') {
        return getAllPosts();
    }
    return getAllPosts().filter(post => 
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
}

// Get all unique tags
function getAllTags() {
    const tags = new Set();
    POSTS.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// Search posts by title or summary
function searchPosts(query) {
    const lowerQuery = query.toLowerCase();
    return getAllPosts().filter(post => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.summary.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

// Get related posts (by tags)
function getRelatedPosts(postId, limit = 3) {
    const post = getPostById(postId);
    if (!post) return [];
    
    // Score posts by number of matching tags
    const scored = POSTS
        .filter(p => p.id !== postId)
        .map(p => ({
            ...p,
            score: p.tags.filter(tag => post.tags.includes(tag)).length
        }))
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score);
    
    return scored.slice(0, limit);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        POSTS,
        getAllPosts,
        getPostById,
        getRecentPosts,
        getPostsByTag,
        getAllTags,
        searchPosts,
        getRelatedPosts,
        formatDate
    };
}
