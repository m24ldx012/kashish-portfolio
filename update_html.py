import os
import re

directory = r"c:\Users\kashi\.gemini\antigravity\scratch\kashish-portfolio"

new_footer = """<!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-cta">
                    <p class="footer-cta-text">
                        <span class="footer-cta-light">Let's create something</span>
                        <span class="footer-cta-bold">amazing together!</span>
                    </p>
                </div>
            </div>
        </div>
    </footer>"""

new_font = """<link href="https://cdn.jsdelivr.net/npm/@fontsource/mona-sans@5.2.8/index.min.css" rel="stylesheet">"""

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Replace font
            content = re.sub(
                r'<link[^>]*href="https://fonts\.googleapis\.com/css2\?family=Instrument\+Sans[^>]*rel="stylesheet">',
                new_font,
                content
            )

            # Some files might have it split across lines, replace specifically by href
            content = content.replace(
                'href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap"',
                'href="https://cdn.jsdelivr.net/npm/@fontsource/mona-sans@5.2.8/index.min.css"'
            )

            # Find Footer
            start = content.find("<!-- Footer")
            if start != -1:
                end = content.find("<!-- Scripts", start)
                if end == -1:
                    end = content.find("<script", start)
                    
                if end != -1:
                    content = content[:start] + new_footer + "\n\n    " + content[end:]

            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
                
print("HTML files updated.")
