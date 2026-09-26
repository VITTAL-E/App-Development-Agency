import urllib.request
import re

files = {
    "process.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYyODYwMzY5YjcwNzc5OWQ1YzAwMjQzMDE4EgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086",
    "portfolio.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYyODYxNjM0NjEwMzM4NTlhMTMwMmNiZjM5EgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086",
    "blog.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYzYjhlZjkxNTMwNzNhY2Q0NmExMjMxMjljEgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086",
    "home-2.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYyODU4MzQ3MWMwNzc5OWU2ZTI4MjI0MjY5EgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086",
    "contact.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYyN2YzYzZlMmUwNWMyZmZiODRjMjNlM2QyEgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086",
    "pricing.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYyODVmODQwOTYwODlhZjcyYWVlMDc3ZTA3EgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086",
    "services.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYyODUyYmVlMDcwN2M0ZTBlN2QwMWExOTQwEgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086",
    "index.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YzYyODU0NTg1ZDIwMmE5OTViYjNmMGIxNDlmEgsSBxDetcr5rg8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNjc5OTI4NDc2MjUwMTY2NjAxOQ&filename=&opi=89354086"
}

for name, url in files.items():
    print(f"Downloading {name}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # Simple replace to hook up navigation links:
    # e.g., href="#" data-path="services" -> href="services.html"
    html = re.sub(r'data-path="home-1"\s*href="[^"]*"', 'href="index.html"', html)
    html = re.sub(r'data-path="home-2"\s*href="[^"]*"', 'href="home-2.html"', html)
    html = re.sub(r'data-path="services"\s*href="[^"]*"', 'href="services.html"', html)
    html = re.sub(r'data-path="portfolio"\s*href="[^"]*"', 'href="portfolio.html"', html)
    html = re.sub(r'data-path="process"\s*href="[^"]*"', 'href="process.html"', html)
    html = re.sub(r'data-path="pricing"\s*href="[^"]*"', 'href="pricing.html"', html)
    html = re.sub(r'data-path="blog"\s*href="[^"]*"', 'href="blog.html"', html)
    html = re.sub(r'data-path="contact"\s*href="[^"]*"', 'href="contact.html"', html)
    
    with open(name, "w", encoding="utf-8") as f:
        f.write(html)

print("Done downloading and patching files.")
