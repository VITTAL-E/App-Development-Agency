const fs = require('fs');

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

const rtlButtonHtml = `<button aria-label="Toggle RTL mode" class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-all" type="button" title="Toggle RTL"><span class="material-symbols-outlined text-[18px]">format_textdirection_r_to_l</span></button>`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix home links if they are still #
    content = content.replace(/href="#"([^>]*)>(Home 1[^<]*)</g, 'href="index.html"$1>$2<');
    content = content.replace(/href="#"([^>]*)>(Home 2[^<]*)</g, 'href="home-2.html"$1>$2<');
    // Also handle possible exact matches without trailing text in case
    content = content.replace(/href="#"([^>]*)>Home</g, 'href="index.html"$1>Home<');
    
    // Add RTL button next to Theme toggle button
    if (!content.includes('aria-label="Toggle RTL mode"')) {
        // Find the theme toggle button and inject the RTL button right after it
        const themeButtonRegex = /(<button aria-label="Toggle color mode"[\s\S]*?<\/button>)/;
        content = content.replace(themeButtonRegex, `$1${rtlButtonHtml}`);
    }

    // Update the JS script inside the page to handle RTL logic
    // We already have a script at the bottom from apply_theme_fix.js
    // Let's modify it to also apply RTL.
    if (!content.includes('const applyRtl = (dir) => {')) {
        const replacementScript = `
    // RTL logic
    const savedDir = localStorage.getItem('dir') || 'ltr';
    const applyRtl = (dir) => {
      if (dir === 'rtl') {
        htmlElement.setAttribute('dir', 'rtl');
      } else {
        htmlElement.removeAttribute('dir');
      }
      
      const rtlBtns = document.querySelectorAll('button[aria-label="Toggle RTL mode"]');
      rtlBtns.forEach(btn => {
        const iconSpan = btn.querySelector('.material-symbols-outlined');
        if (iconSpan) {
          iconSpan.textContent = dir === 'rtl' ? 'format_textdirection_l_to_r' : 'format_textdirection_r_to_l';
        }
      });
    };
    
    applyRtl(savedDir);
    
    const rtlToggleBtns = document.querySelectorAll('button[aria-label="Toggle RTL mode"]');
    rtlToggleBtns.forEach(rtlToggleBtn => {
      const newRtlBtn = rtlToggleBtn.cloneNode(true);
      rtlToggleBtn.parentNode.replaceChild(newRtlBtn, rtlToggleBtn);
      
      newRtlBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isRtl = htmlElement.getAttribute('dir') === 'rtl';
        const newDir = isRtl ? 'ltr' : 'rtl';
        localStorage.setItem('dir', newDir);
        applyRtl(newDir);
      });
    });
`;

        // Inject the RTL script logic just before the end of the DOMContentLoaded callback
        content = content.replace(/(\s*\}\);\s*<\/script>\s*<\/body><\/html>)/, `${replacementScript}$1`);
    }

    fs.writeFileSync(file, content, 'utf8');
});

console.log("Successfully fixed home links and added RTL support.");
