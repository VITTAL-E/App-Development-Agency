const fs = require('fs');

const buttonHtml = `<button aria-label="Toggle color mode" class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-all" type="button"><span class="material-symbols-outlined text-[18px]">dark_mode</span></button>`;

const targetHtml = `<a class="hidden sm:flex items-center`;
const replacement = buttonHtml + `<a class="hidden sm:flex items-center`;

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
    
    // Check if the file already has the toggle button in the HTML (ignoring the script block)
    const bodyContent = content.split('<body')[1];
    if (bodyContent && !bodyContent.includes('aria-label="Toggle color mode"')) {
        console.log(`Injecting button into ${file}`);
        content = content.replace(targetHtml, replacement);
        fs.writeFileSync(file, content, 'utf8');
    } else {
        console.log(`Button already exists in ${file}`);
    }
});
