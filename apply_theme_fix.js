const fs = require('fs');

const originalColors = {
  "on-secondary": "#3c0091",
  "on-primary-fixed-variant": "#004e5c",
  "on-primary-container": "#00424f",
  "surface-bright": "#353944",
  "error-container": "#93000a",
  "background": "#0f131d",
  "inverse-on-surface": "#2c303b",
  "on-secondary-fixed": "#23005c",
  "on-surface": "#dfe2f1",
  "tertiary": "#4edea3",
  "on-secondary-fixed-variant": "#5516be",
  "tertiary-fixed-dim": "#4edea3",
  "tertiary-container": "#1bbd85",
  "surface-container-low": "#171b26",
  "secondary-fixed": "#e9ddff",
  "secondary-container": "#571bc1",
  "surface-container-high": "#262a35",
  "on-tertiary-fixed": "#002113",
  "on-error": "#690005",
  "primary-fixed-dim": "#4cd7f6",
  "on-background": "#dfe2f1",
  "surface-dim": "#0f131d",
  "on-tertiary-fixed-variant": "#005236",
  "primary-fixed": "#acedff",
  "on-primary": "#003640",
  "outline": "#869397",
  "surface-container-lowest": "#0a0e18",
  "on-surface-variant": "#bcc9cd",
  "surface-variant": "#313540",
  "on-primary-fixed": "#001f26",
  "primary": "#4cd7f6",
  "surface-container-highest": "#313540",
  "secondary": "#d0bcff",
  "tertiary-fixed": "#6ffbbe",
  "surface": "#0f131d",
  "inverse-primary": "#00687a",
  "on-tertiary": "#003824",
  "error": "#ffb4ab",
  "inverse-surface": "#dfe2f1",
  "on-secondary-container": "#c4abff",
  "on-error-container": "#ffdad6",
  "surface-container": "#1c1f2a",
  "surface-tint": "#4cd7f6",
  "secondary-fixed-dim": "#d0bcff",
  "primary-container": "#06b6d4",
  "outline-variant": "#3d494c",
  "on-tertiary-container": "#00452e"
};

// Very basic lightness inversion heuristic for light mode
function invertColor(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Invert lightness loosely. Keep primary the same, invert backgrounds.
    // If it's very dark (like #0f131d), make it very light (#f8fafc)
    // If it's very light (like #dfe2f1), make it very dark (#1e293b)
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let l = (max + min) / 2;
    
    if (l < 50) {
        // Dark color -> make it light (e.g., backgrounds, surface)
        return `#${(255-r).toString(16).padStart(2,'0')}${(255-g).toString(16).padStart(2,'0')}${(255-b).toString(16).padStart(2,'0')}`;
    } else {
        // Light color -> make it dark (e.g., text)
        return `#${(255-r).toString(16).padStart(2,'0')}${(255-g).toString(16).padStart(2,'0')}${(255-b).toString(16).padStart(2,'0')}`;
    }
}

// Actually, doing 255-r is a literal inversion, which preserves hue opposite.
// A better way is to use HSL, but since this is a quick fix, let's just 
// create a mapped light palette for surface and on-surface.
const lightColors = { ...originalColors };

// Override backgrounds
lightColors['background'] = '#ffffff';
lightColors['surface'] = '#f8fafc';
lightColors['surface-dim'] = '#f1f5f9';
lightColors['surface-bright'] = '#ffffff';
lightColors['surface-container-lowest'] = '#ffffff';
lightColors['surface-container-low'] = '#f8fafc';
lightColors['surface-container'] = '#f1f5f9';
lightColors['surface-container-high'] = '#e2e8f0';
lightColors['surface-container-highest'] = '#cbd5e1';
lightColors['surface-variant'] = '#e2e8f0';
lightColors['inverse-surface'] = '#1e293b';

// Override text
lightColors['on-background'] = '#0f172a';
lightColors['on-surface'] = '#0f172a';
lightColors['on-surface-variant'] = '#334155';
lightColors['inverse-on-surface'] = '#f8fafc';
lightColors['outline'] = '#94a3b8';
lightColors['outline-variant'] = '#cbd5e1';

let cssVars = `:root {\n`;
for (const [k, v] of Object.entries(lightColors)) {
    cssVars += `  --color-${k}: ${v};\n`;
}
cssVars += `}\n`;

cssVars += `.dark {\n`;
for (const [k, v] of Object.entries(originalColors)) {
    cssVars += `  --color-${k}: ${v};\n`;
}
cssVars += `}\n`;

const tailwindColors = {};
for (const k of Object.keys(originalColors)) {
    tailwindColors[k] = `var(--color-${k})`;
}

const jsSnippet = `
<style>
${cssVars}
</style>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    // Check localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    const applyTheme = (theme) => {
      if (theme === 'dark') {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
      
      // Update icons
      const currentBtns = document.querySelectorAll('button[aria-label="Toggle color mode"]');
      currentBtns.forEach(btn => {
        const iconSpan = btn.querySelector('.material-symbols-outlined');
        if (iconSpan) {
          iconSpan.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
        }
      });
    };
    
    applyTheme(savedTheme);
    
    // Bind events
    const themeToggleBtns = document.querySelectorAll('button[aria-label="Toggle color mode"]');
    themeToggleBtns.forEach(themeToggleBtn => {
      // Remove any existing click listeners by cloning
      const newBtn = themeToggleBtn.cloneNode(true);
      themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);
      
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = htmlElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
      });
    });
  });
</script>
</body></html>
`;

const files = [
    "process.html",
    "portfolio.html",
    "blog.html",
    "home-2.html",
    "contact.html",
    "pricing.html",
    "services.html",
    "index.html"
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Strip the old fix_links.js injection
    content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[^]*?<\/script>\s*<\/body><\/html>/, '</body></html>');
    
    // 2. Add our new jsSnippet
    content = content.replace(/<\/body><\/html>/, jsSnippet);
    
    // 3. Replace the Tailwind config colors with var(...)
    // First, let's find the original tailwind config block.
    // It's easier to just do a regex replace on the entire config string if it matches our colors,
    // but the colors might be stringified in different orders.
    // Since we know the exact json format from contact.html:
    const regex = /"colors":\s*\{.*?\}/s;
    content = content.replace(regex, '"colors": ' + JSON.stringify(tailwindColors, null, 2));
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log("Successfully applied fix and proper CSS variables for light/dark mode.");
