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

    // 1. Remove any injected buttons from the JS script string (botched previous attempt)
    // The previous attempt did: `$1${rtlButtonHtml}` inside the JS string.
    content = content.replace(/querySelectorAll\('button\[aria-label="Toggle color mode"\]'\);<button aria-label="Toggle RTL mode".*?<\/button>/g, `querySelectorAll('button[aria-label="Toggle color mode"]');`);
    
    // 2. We want both buttons right before the "Client Portal" link.
    // First, let's remove them if they exist in the HTML (but not in JS querySelectorAll)
    // Actually, just find the `gap-space-sm` or `gap-space-md shrink-0` div where Client Portal is.
    
    // Let's find: `<a class="hidden sm:inline-flex items-center` or `<a class="hidden sm:flex items-center`
    // And if it doesn't have the buttons right before it, add them.
    
    // Remove existing buttons from the header (to avoid duplicates)
    // We can do this by regexing the exact button HTMLs out.
    // But it's safer to just replace them with empty if they appear right before the Client Portal link.
    content = content.replace(new RegExp(themeButton.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    content = content.replace(new RegExp(rtlButton.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    
    // Now both buttons are gone from the file completely. (Except in JS strings where they were used for querySelectorAll, which I didn't replace because I only removed the exact HTML strings).
    // Wait, what if querySelectorAll had exactly this string? No, querySelectorAll only had 'button[aria-label...]'.
    
    // 3. Inject them right before the Client Portal link.
    const targetLinks = [
        '<a class="hidden sm:inline-flex items-center gap-1.5 px-3.5',
        '<a class="hidden sm:flex items-center gap-1.5 px-3.5',
        '<a class="hidden sm:inline-flex items-center px-space-md py-space-sm',
        '<a class="hidden sm:flex items-center px-space-md py-space-sm'
    ];
    
    let injected = false;
    for (const target of targetLinks) {
        if (content.includes(target)) {
            content = content.replace(target, buttonsCombo + target);
            injected = true;
            break; // only do it once
        }
    }
    
    if (!injected) {
        console.log(`WARNING: Could not find injection point in ${file}`);
    } else {
        console.log(`Fixed buttons in ${file}`);
    }

    fs.writeFileSync(file, content, 'utf8');
});
