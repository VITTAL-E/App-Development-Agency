const fs = require('fs');
const files = [
    'index.html', 'home-2.html', 'services.html', 'portfolio.html', 
    'process.html', 'pricing.html', 'blog.html', 'contact.html'
];

const targetImg = '<img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-contain relative z-10" src="https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32">';

const replacementImg = '<div class="w-8 h-8 overflow-hidden inline-block relative z-10 rounded-lg"><img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-left object-cover max-w-none" src="https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32"></div>';

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    // We want to replace it EVERYWHERE it appears (header and footer)
    html = html.split(targetImg).join(replacementImg);
    
    // In footer, there's a variant of the image tag without relative z-10:
    const footerTargetImg = '<img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32">';
    
    const footerReplacementImg = '<div class="w-8 h-8 overflow-hidden inline-block relative rounded-lg"><img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-left object-cover max-w-none" src="https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32"></div>';
    
    html = html.split(footerTargetImg).join(footerReplacementImg);
    
    fs.writeFileSync(f, html);
    console.log('Fixed ' + f);
});
