import subprocess
import time
import os

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
p = subprocess.Popen([
    chrome,
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    'http://localhost:3000/'
])

time.sleep(3)

try:
    res = subprocess.run(['node', 'infrastructure/scripts/read_cdp.js'], capture_output=True, text=True, timeout=8)
    print("CDP Output:")
    print(res.stdout)
    print("CDP Stderr:")
    print(res.stderr)
finally:
    p.terminate()
