import os
import re
import time

directory = r"c:\Users\kashi\.gemini\antigravity\scratch\kashish-portfolio"
timestamp = str(int(time.time()))

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Handle both root index.html and nested page HTMLs
            if 'href="../css/style.css' in content:
                css_link = f'<link rel="stylesheet" href="../css/style.css?v={timestamp}">'
                content = re.sub(r'<link rel="stylesheet" href="../css/style\.css[^>]*>', css_link, content)
            elif 'href="css/style.css' in content:
                css_link = f'<link rel="stylesheet" href="css/style.css?v={timestamp}">'
                content = re.sub(r'<link rel="stylesheet" href="css/style\.css[^>]*>', css_link, content)
                
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cache-busted {filepath}")
