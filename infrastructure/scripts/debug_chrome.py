import subprocess
import time
import json
import urllib.request

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
# Start chrome with debugging port
proc = subprocess.Popen([
    chrome,
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    'http://localhost:3000/'
])

time.sleep(2)

try:
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        tabs = json.loads(resp.read().decode())
        print("Active Chrome Tabs:", tabs)
        if tabs:
            ws_url = tabs[0].get('webSocketDebuggerUrl')
            print("WS URL:", ws_url)
finally:
    proc.terminate()
