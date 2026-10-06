import os
import subprocess

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
import os
import subprocess

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
res = subprocess.run([chrome, '--headless=new', '--disable-gpu', '--dump-dom', 'http://localhost:3000/'], capture_output=True, encoding='utf-8', errors='replace', timeout=10)

html = res.stdout
idx = html.find('id="root"')
print('--- HTML snippet at id="root": ---')
snippet = html[idx:idx+1500]
print(snippet.encode('ascii', errors='replace').decode('ascii'))
