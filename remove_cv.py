import os
import re

directory = r"c:\Users\kashi\.gemini\antigravity\scratch\kashish-portfolio"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            content = re.sub(r'\s*<a[^>]*class="cv-button"[^>]*>CV</a>', '', content)

            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
                
print("CV button removed from HTML files.")
