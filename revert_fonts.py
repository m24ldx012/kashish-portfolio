import os
import re

directory = r"c:\Users\kashi\.gemini\antigravity\scratch\kashish-portfolio"
new_link = '<link href="https://cdn.jsdelivr.net/npm/@fontsource/mona-sans@5.2.8/index.min.css" rel="stylesheet">'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if '@fontsource/mona-sans@5.0.19/index.css' in content:
                content = re.sub(r'<link[^>]*href=\"https://cdn\.jsdelivr\.net/npm/@fontsource/mona-sans@5\.0\.19/index\.css\"[^>]*>', new_link, content)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Reverted {filepath}")
