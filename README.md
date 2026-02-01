# 🚀 Technical Blog Website

A modern, responsive personal technical blog for publishing articles about programming, computer science, AI/ML, C++, shaders, and software engineering.

## ✨ Features

- **📱 Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- **🌓 Dark/Light Mode** - Automatic theme detection with manual toggle
- **⚡ Fast & Lightweight** - Vanilla JavaScript, no heavy frameworks
- **🎨 Syntax Highlighting** - Beautiful code blocks with Prism.js
- **📐 Math Support** - LaTeX equations rendered with KaTeX
- **🔍 Search & Filter** - Find posts by title, tags, or content
- **📄 Markdown Posts** - Write posts in simple Markdown format
- **♿ Accessible** - ARIA labels and semantic HTML
- **🎯 SEO Friendly** - Proper meta tags and structure

## 📁 Project Structure

```
├── index.html              # Home page
├── blog.html              # Blog listing page
├── post.html              # Single post template
├── about.html             # About page
├── css/
│   ├── main.css           # Main styles
│   └── prism.css          # Code syntax highlighting
├── js/
│   ├── main.js            # Home page logic
│   ├── blog.js            # Blog page logic
│   ├── post.js            # Post page logic
│   ├── posts.js           # Posts data management
│   ├── theme.js           # Theme switching
│   └── prism.js           # Syntax highlighter
├── posts/
│   ├── understanding-move-semantics-cpp.md
│   ├── neural-networks-from-scratch.md
│   ├── intro-to-shader-programming.md
│   ├── probability-theory-ml.md
│   └── modern-cpp-best-practices.md
└── README.md
```

## 🚀 Quick Start

### Option 1: Open Directly
1. Open `index.html` in your web browser
2. That's it! The site works entirely client-side

### Option 2: Use a Local Server (Recommended)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (install http-server first)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 📝 Adding New Blog Posts

### Step 1: Create the Markdown File

Create a new file in the `posts/` directory:

```markdown
<!-- posts/my-new-post.md -->
# My New Post Title

Your content here with **markdown** formatting.

## Code Examples

```python
def hello():
    print("Hello, World!")
```

## Math Equations

The quadratic formula is: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
```

### Step 2: Add Post Metadata

Edit [js/posts.js](js/posts.js) and add your post to the `POSTS` array:

```javascript
{
    id: 'my-new-post',
    title: 'My New Post Title',
    date: '2026-02-01',
    summary: 'A brief description of what this post covers.',
    tags: ['Python', 'Tutorial'],
    content: 'posts/my-new-post.md',
    readingTime: '5 min read'
}
```

### Step 3: View Your Post

Refresh the website and your post will appear automatically!

## 🎨 Customization

### Change Site Name and Branding

Edit the navigation brand in all HTML files.

### Modify Colors

Edit CSS variables in [css/main.css](css/main.css):

```css
:root {
    --accent-primary: #0066cc;    /* Primary color */
    --accent-secondary: #0052a3;  /* Hover color */
}
```

### Add Your Social Links

Edit footer and about page with your links.

### Customize About Page

Edit [about.html](about.html) to add your bio, tech stack, and contact information.

## 🌐 Deployment

### GitHub Pages (Free)
1. Create a repository named `username.github.io`
2. Push your files
3. Visit `https://username.github.io`

### Netlify/Vercel (Free)
Drag and drop deployment or connect your Git repository.

## 📦 Dependencies

All dependencies loaded from CDN - no build process required!
- **Marked.js** - Markdown parser
- **Prism.js** - Syntax highlighting
- **KaTeX** - Math rendering

## 🛠️ Browser Support

✅ Chrome/Edge, Firefox, Safari (latest versions)

## 📄 License

MIT License - Open source and free to use!

---

**Happy blogging! 🎉**