import os
import re

root = os.path.abspath('.')
pattern = re.compile(r'from\s+[\'"](?:\.\./)+shared/(.*?)[\'"]')

count = 0
for dirpath, _, filenames in os.walk(root):
    if 'node_modules' in dirpath or '.git' in dirpath:
        continue
    for fname in filenames:
        if fname.endswith(('.ts', '.tsx', '.js', '.jsx')):
            fpath = os.path.join(dirpath, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = pattern.sub(r"from '@shared/\1'", content)
            if new_content != content:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {os.path.relpath(fpath, root)}")

print(f"Total files updated with @shared alias: {count}")
