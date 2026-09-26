const fs = require('fs');
const files = [
    'index.html', 'home-2.html', 'services.html', 'portfolio.html', 
    'process.html', 'pricing.html', 'blog.html', 'contact.html'
];

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    
    // 1. Fix dropdown hover gap.
    // The dropdown has: class="absolute left-0 top-full mt-2 w-64 rounded-xl bg-surface-container-lowest/90 border border-outline-variant/30 backdrop-blur-xl p-2 shadow-2xl hidden group-hover:flex flex-col gap-1 z-50"
    // We want to replace it with a wrapper that has pt-2 instead of mt-2.
    // Note: The previous dropdown had <a href="...">...</a><a href="...">...</a></div>
    // We will replace the start of the dropdown and add the extra closing div before the end of the parent.
    const oldDropdown = '<div class="absolute left-0 top-full mt-2 w-64 rounded-xl bg-surface-container-lowest/90 border border-outline-variant/30 backdrop-blur-xl p-2 shadow-2xl hidden group-hover:flex flex-col gap-1 z-50">';
    const newDropdown = '<div class="absolute left-0 top-full pt-2 w-64 hidden group-hover:flex flex-col z-50"><div class="rounded-xl bg-surface-container-lowest/90 border border-outline-variant/30 backdrop-blur-xl p-2 shadow-2xl flex flex-col gap-1">';
    
    if (html.includes(oldDropdown)) {
        html = html.replace(oldDropdown, newDropdown);
        // Now we need to close the extra div. The dropdown ends right before `</div><a class="px-3 py-2`
        html = html.replace(/<\/div><a class="px-3 py-2 rounded font-body-sm/g, '</div></div><a class="px-3 py-2 rounded font-body-sm');
    }
    
    // 2. Fix uncropped logo images globally.
    // Any img tag with src containing 'googleusercontent' and alt containing 'ApexLabs'
    // Let's use a regex to match the image tag.
    const imgRegex = /<img[^>]*src="https:\/\/lh3\.googleusercontent\.com[^>]*>/g;
    
    html = html.replace(imgRegex, (match) => {
        // If it's already cropped (inside our wrapper), don't wrap it again!
        // We can check if the previous string was the wrapper, but replace() doesn't give us the previous string directly.
        // But we know our wrapper adds `object-left object-cover max-w-none`.
        if (match.includes('object-cover')) {
            return match; // Already cropped
        }
        
        // Otherwise, wrap it.
        // We need to make sure the img height is preserved. The classes usually have `h-8` or `h-7`.
        let wrapperClass = "w-8 h-8";
        if (match.includes('h-7')) {
            wrapperClass = "w-7 h-7";
        }
        
        // Modify the image to have cropping classes
        let newImg = match.replace('object-contain', 'object-left object-cover max-w-none');
        // Remove relative z-10 if they exist on the image, put them on wrapper if needed
        let relativeZ10 = "";
        if (newImg.includes('relative')) {
            relativeZ10 += " relative";
            newImg = newImg.replace('relative', '');
        }
        if (newImg.includes('z-10')) {
            relativeZ10 += " z-10";
            newImg = newImg.replace('z-10', '');
        }
        
        return `<div class="${wrapperClass} overflow-hidden inline-block ${relativeZ10} rounded-lg">${newImg}</div>`;
    });
    
    fs.writeFileSync(f, html);
    console.log('Fixed ' + f);
});
