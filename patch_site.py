import os
import re

theme_script = """
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
      themeToggleBtn.addEventListener('click', () => {
        const isDark = htmlElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
      });
    });
  });
</script>
</body>
"""

files = [
    "process.html",
    "portfolio.html",
    "blog.html",
    "home-2.html",
    "contact.html",
    "pricing.html",
    "services.html",
    "index.html"
]

for name in files:
    if not os.path.exists(name):
        continue
    print(f"Patching {name}...")
    with open(name, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Navigation links mapping
    html = re.sub(r'data-path="[^"]*home-1[^"]*"\s*href="[^"]*"', 'href="index.html"', html)
    html = re.sub(r'data-path="[^"]*home-2[^"]*"\s*href="[^"]*"', 'href="home-2.html"', html)
    html = re.sub(r'data-path="[^"]*services[^"]*"\s*href="[^"]*"', 'href="services.html"', html)
    html = re.sub(r'data-path="[^"]*portfolio[^"]*"\s*href="[^"]*"', 'href="portfolio.html"', html)
    html = re.sub(r'data-path="[^"]*process[^"]*"\s*href="[^"]*"', 'href="process.html"', html)
    html = re.sub(r'data-path="[^"]*pricing[^"]*"\s*href="[^"]*"', 'href="pricing.html"', html)
    html = re.sub(r'data-path="[^"]*blog[^"]*"\s*href="[^"]*"', 'href="blog.html"', html)
    html = re.sub(r'data-path="[^"]*contact[^"]*"\s*href="[^"]*"', 'href="contact.html"', html)

    # Some links might only have `data-path="client-portal"` etc. Let's fix them to `#` just in case, but they don't have pages.

    # Remove any existing theme script if we're running it multiple times
    html = re.sub(r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\', \(\) => \{\s*const themeToggleBtns[\s\S]*?</script>\s*</body>', '</body>', html)

    # Inject the theme toggle JS
    html = html.replace('</body>', theme_script)
    
    with open(name, "w", encoding="utf-8") as f:
        f.write(html)

print("Done patching files.")
