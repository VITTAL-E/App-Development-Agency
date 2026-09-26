const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    
    // We will find all anchor tags and change their href to point to actual pages, 
    // replacing the # or data-path if needed.
    
    // 1. Remove all data-paths and ensure href is set.
    // However, the best way is to use a map.
    const map = {
        'home-1': 'index.html',
        'home-2': 'home-2.html',
        'services': 'services.html',
        'portfolio': 'portfolio.html',
        'process': 'process.html',
        'pricing': 'pricing.html',
        'tech-blog': 'blog.html',
        'contact': 'contact.html',
        'client-portal': '#' // default or whatever
    };

    // To properly fix links, it's better to just search for data-path="..." and replace the href="#" next to it.
    let newHtml = html.replace(/data-path="([^"]+)"\s*href="[^"]*"/g, (match, dataPath) => {
        for (const key in map) {
            if (dataPath.includes(key)) {
                return `href="${map[key]}"`;
            }
        }
        return `href="#"`;
    });
    
    // Also, handle the case where href comes first: href="#" data-path="..."
    newHtml = newHtml.replace(/href="[^"]*"\s*data-path="([^"]+)"/g, (match, dataPath) => {
        for (const key in map) {
            if (dataPath.includes(key)) {
                return `href="${map[key]}"`;
            }
        }
        return `href="#"`;
    });

    // Fix the theme logic
    // Some buttons might have onclick preventing defaults, but let's just make sure the theme JS is right.
    const themeScript = `
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtns = document.querySelectorAll('button[aria-label="Toggle color mode"]');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    const applyTheme = (theme) => {
      if (theme === 'dark') {
        htmlElement.classList.add('dark');
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('span.material-symbols-outlined');
            if (icon) icon.textContent = 'light_mode';
        });
      } else {
        htmlElement.classList.remove('dark');
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('span.material-symbols-outlined');
            if (icon) icon.textContent = 'dark_mode';
        });
      }
    };

    applyTheme(savedTheme);

    themeToggleBtns.forEach(themeToggleBtn => {
      // Remove any existing click listeners if possible (not easy, but we can clone to be sure)
      const newBtn = themeToggleBtn.cloneNode(true);
      themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);
      
      newBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Just in case it's a link
        const isDark = htmlElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
      });
    });
  });
</script>
</body>`;

    // Remove old theme script if it exists
    newHtml = newHtml.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*const themeToggleBtns[\s\S]*?<\/script>\s*<\/body>/, '</body>');
    
    // Inject the new one
    newHtml = newHtml.replace('</body>', themeScript);

    fs.writeFileSync(file, newHtml, 'utf8');
}
console.log('Fixed links and theme toggle');
