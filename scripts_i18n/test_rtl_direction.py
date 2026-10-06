#!/usr/bin/env python3
"""RTL direction test for ur and ks across portals."""
import sys
import time
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--no-sandbox')
opts.add_argument('--disable-dev-shm-usage')
opts.add_argument('--window-size=1280,900')
driver = webdriver.Chrome(options=opts)

results = []
test_cases = [
    ('Citizen', 'http://localhost:8080/citizen/', 'ur', 'Urdu'),
    ('Citizen', 'http://localhost:8080/citizen/', 'ks', 'Kashmiri'),
    ('DEO', 'http://localhost:8080/deo/', 'ur', 'Urdu'),
    ('Admin', 'http://localhost:8080/admin/', 'ur', 'Urdu'),
    ('Revenue', 'http://localhost:8080/revenue/', 'ur', 'Urdu'),
    # LTR check after RTL
    ('Citizen', 'http://localhost:8080/citizen/', 'hi', 'Hindi-LTR'),
    ('Citizen', 'http://localhost:8080/citizen/', 'sa', 'Sanskrit-LTR'),
]

for portal, url, lang, lang_name in test_cases:
    driver.get(url)
    time.sleep(1.5)
    driver.execute_script(
        "localStorage.setItem('bhooraksha_language', arguments[0]);"
        "document.cookie = 'bhooraksha_language=' + arguments[0] + '; path=/; max-age=31536000';"
        "window.dispatchEvent(new CustomEvent('bhooraksha_language_change', {detail: {lang: arguments[0]}}));",
        lang
    )
    time.sleep(1.2)
    driver.get(url)
    time.sleep(1.5)
    html_elem = driver.find_element(By.TAG_NAME, 'html')
    body_elem = driver.find_element(By.TAG_NAME, 'body')
    html_dir = html_elem.get_attribute('dir') or 'not-set'
    body_dir = body_elem.get_attribute('dir') or 'not-set'
    html_lang = html_elem.get_attribute('lang') or 'not-set'

    expected_dir = 'rtl' if lang in ('ur', 'ks') else 'ltr'
    status = 'PASS' if html_dir == expected_dir else 'FAIL'
    results.append((portal, lang_name, html_dir, body_dir, html_lang, status))

    # Reset to English
    driver.execute_script(
        "localStorage.setItem('bhooraksha_language', 'en');"
        "document.cookie = 'bhooraksha_language=en; path=/; max-age=31536000';"
    )
    time.sleep(0.5)

driver.quit()

print('\nRTL/LTR Direction Test Results:')
print('='*70)
passed = sum(1 for r in results if r[5] == 'PASS')
failed = sum(1 for r in results if r[5] == 'FAIL')
for portal, lang, html_dir, body_dir, html_lang, status in results:
    print(f'  [{status}] {portal}/{lang}: html.dir={html_dir}, body.dir={body_dir}, html.lang={html_lang}')
print(f'\nResult: {passed} PASS / {failed} FAIL')
