const fs = require('fs');

const themeButton = `<button aria-label="Toggle color mode" class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-all" type="button"><span class="material-symbols-outlined text-[18px]">dark_mode</span></button>`;
const rtlButton = `<button aria-label="Toggle RTL mode" class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-all" type="button" title="Toggle RTL"><span class="material-symbols-outlined text-[18px]">format_textdirection_r_to_l</span></button>`;

const buttonsCombo = themeButton + rtlButton;

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

    // Remove them if they were partially added.
    content = content.replace(new RegExp(themeButton.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    content = content.replace(new RegExp(rtlButton.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    
    // In all files, the "Client Portal" link exists in the header (except maybe some? Let's check "Client Portal").
    // If "Client Portal" is found, replace the exact `a` tag match.
    // If not, find "Start a Project" and inject before it.

    // Regex to match the `<a>` tag of Client Portal
    const cpMatch = content.match(/<a[^>]*>.*?Client Portal.*?<\/a>/);
    if (cpMatch) {
        content = content.replace(cpMatch[0], buttonsCombo + cpMatch[0]);
        console.log(`Fixed buttons in ${file} (via Client Portal)`);
    } else {
        const startProjMatch = content.match(/<a[^>]*>Start a Project<\/a>/);
        if (startProjMatch) {
             content = content.replace(startProjMatch[0], buttonsCombo + startProjMatch[0]);
             console.log(`Fixed buttons in ${file} (via Start a Project)`);
        } else {
             console.log(`Failed to find injection point in ${file}`);
        }
    }
    
    fs.writeFileSync(file, content, 'utf8');
});
