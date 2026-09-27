const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'contact_raw.html');

let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if we already have the mobile menu
    if (content.includes('id="mobile-menu"')) {
        console.log(`Skipping ${file}, mobile menu already present.`);
        return;
    }
    
    // Extract the nav items to replicate in the mobile menu
    const navMatch = content.match(/<nav[^>]*>([\s\S]*?)<\/nav>/);
    if (!navMatch) return;
    
    let navContent = navMatch[1];
    
    // We want to just extract the links. The home dropdown is complex, so we'll just simplify it to links
    // Actually, we can just replace the classes on the original nav items, or manually construct the list
    // To keep it simple, we construct it per page so we can preserve the active state logic already done by another script.
    
    // Let's just create a generic mobile menu using the same structure, but vertical
    // Home button:
    let homeClass = 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface';
    if (file === 'index.html' || file === 'home-2.html') {
        homeClass = 'bg-surface-container-high text-primary font-semibold shadow-[0_0_16px_rgba(6,182,212,0.2)] border border-primary/30';
    }
    
    // We'll extract each top-level link from the nav
    let mobileLinks = [];
    
    // Add Home link
    mobileLinks.push(`<a class="px-4 py-3 rounded-lg font-body-sm text-body-sm transition-all ${homeClass}" href="index.html">Home</a>`);
    
    // Extract other links: Services, Portfolio, Process, Pricing, Blog, Contact
    const pages = ['Services', 'Portfolio', 'Process', 'Pricing', 'Blog', 'Contact'];
    
    pages.forEach(page => {
        const pageLower = page.toLowerCase();
        let pageClass = 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-transparent';
        if (file === `${pageLower}.html`) {
            pageClass = 'bg-surface-container-high text-primary font-semibold shadow-[0_0_16px_rgba(6,182,212,0.2)] border border-primary/30';
        }
        mobileLinks.push(`<a class="px-4 py-3 rounded-lg font-body-sm text-body-sm transition-all ${pageClass}" href="${pageLower}.html">${page}</a>`);
    });
    
    const mobileMenuHtml = `
<div id="mobile-menu" class="hidden xl:hidden bg-surface-container-lowest border-t border-outline-variant/30 px-margin py-4 flex flex-col gap-2 shadow-2xl max-h-[70vh] overflow-y-auto">
  ${mobileLinks.join('\n  ')}
</div>`;
    
    const hamburgerHtml = `<button aria-label="Open mobile menu" class="xl:hidden w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-all ml-1" type="button" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"><span class="material-symbols-outlined text-[18px]">menu</span></button>`;
    
    // 1. Insert hamburger button before the last </div></div></header>
    // The exact end of the header inner content is usually </div></div></header>
    // We want to insert inside the gap-space-sm div
    let newContent = content.replace(/(<span class="material-symbols-outlined text-on-primary text-\[18px\]">person<\/span><\/div>)\s*<\/div>\s*<\/div>/, `$1${hamburgerHtml}</div></div>`);
    
    // 2. Insert mobile menu container right before </header>
    newContent = newContent.replace(/<\/header>/, `${mobileMenuHtml}</header>`);
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
        updatedCount++;
    }
});
console.log(`Total updated: ${updatedCount}`);
