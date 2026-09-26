const fs = require('fs');

const files = [
    "index.html",
    "home-2.html",
    "services.html",
    "portfolio.html",
    "process.html",
    "pricing.html",
    "blog.html",
    "contact.html"
];

const indexHtml = fs.readFileSync('index.html', 'utf8');
const headerMatch = indexHtml.match(/<header[^>]*>[\s\S]*?<\/header>/);
if (!headerMatch) {
    console.error("Could not find header in index.html");
    process.exit(1);
}
let baseHeader = headerMatch[0];

const logoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32";
const faviconTag = `<link rel="icon" href="${logoUrl}" type="image/x-icon">`;

// Normalizing classes
const normalLinkClass = "px-3 py-2 rounded font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all";
const activeLinkClass = "bg-surface-container-high text-primary font-title-sm shadow-[0_0_16px_rgba(6,182,212,0.2)] border border-primary/30";

const normalBtnClass = "flex items-center gap-1 px-3 py-2 rounded transition-all font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high";
const activeBtnClass = "flex items-center gap-1 px-3 py-2 rounded transition-all bg-surface-container-high text-primary font-title-sm shadow-[0_0_16px_rgba(6,182,212,0.2)] border border-primary/30";

baseHeader = baseHeader.replace(activeBtnClass, normalBtnClass);

baseHeader = baseHeader.replace(
    `<span class="font-title-sm text-[13px] text-primary font-semibold flex items-center justify-between">Home 1: App Development Agency`,
    `<span class="font-title-sm text-[13px] text-on-surface hover:text-primary font-semibold flex items-center justify-between">Home 1: App Development Agency`
);

// We need to move the buttons from the left to the right.
// Find the buttons.
const themeButton = `<button aria-label="Toggle color mode" class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-all" type="button"><span class="material-symbols-outlined text-[18px]">dark_mode</span></button>`;
const rtlButton = `<button aria-label="Toggle RTL mode" class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-all" type="button" title="Toggle RTL"><span class="material-symbols-outlined text-[18px]">format_textdirection_r_to_l</span></button>`;

// Remove them from baseHeader completely
baseHeader = baseHeader.replace(themeButton, "");
baseHeader = baseHeader.replace(rtlButton, "");

// Find where to insert them: after Contact</a></nav> inside the right side section.
// The right side section starts with `<div class="flex items-center gap-space-sm">`
// Let's insert them at the beginning of that div.
const rightSideSectionRegex = /(<\/nav><div class="flex items-center gap-space-sm">)/;
if (baseHeader.match(rightSideSectionRegex)) {
    baseHeader = baseHeader.replace(rightSideSectionRegex, `$1${themeButton}${rtlButton}`);
} else {
    console.log("Could not find right side section. Trying to append before Client Portal.");
    baseHeader = baseHeader.replace('<a class="hidden sm:flex items-center gap-1.5 px-3.5', `${themeButton}${rtlButton}<a class="hidden sm:flex items-center gap-1.5 px-3.5`);
}

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('<link rel="icon"')) {
        content = content.replace('</head>', `  ${faviconTag}\n</head>`);
    } else {
        content = content.replace(/<link rel="icon"[^>]*>/, faviconTag);
    }
    
    let fileHeader = baseHeader;
    
    if (file === "index.html" || file === "home-2.html") {
        fileHeader = fileHeader.replace(normalBtnClass, activeBtnClass);
        if (file === "index.html") {
            fileHeader = fileHeader.replace(
                `<span class="font-title-sm text-[13px] text-on-surface hover:text-primary font-semibold flex items-center justify-between">Home 1: App Development Agency`,
                `<span class="font-title-sm text-[13px] text-primary font-semibold flex items-center justify-between">Home 1: App Development Agency`
            );
        } else {
            fileHeader = fileHeader.replace(
                `<span class="font-title-sm text-[13px] text-on-surface hover:text-primary font-semibold flex items-center justify-between">Home 2: Startup &amp; MVP Studio`,
                `<span class="font-title-sm text-[13px] text-primary font-semibold flex items-center justify-between">Home 2: Startup &amp; MVP Studio`
            );
        }
    } else {
        const linkRegex = new RegExp(`(<a class=")${normalLinkClass}(" href="${file}">)`, 'g');
        fileHeader = fileHeader.replace(linkRegex, `$1px-3 py-2 rounded transition-all ${activeLinkClass}$2`);
    }
    
    content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/, fileHeader);
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Synced header and favicon for ${file}`);
}
