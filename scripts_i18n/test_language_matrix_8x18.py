#!/usr/bin/env python3
"""
Complete 8x18 language matrix test + cross-portal sync + RTL test.
Tests all 144 portal/language combinations.
"""
import sys
import time
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

ALL_LANGS = [
    ('en', 'English'), ('hi', 'Hindi'), ('te', 'Telugu'), ('ta', 'Tamil'),
    ('bn', 'Bengali'), ('mr', 'Marathi'), ('gu', 'Gujarati'), ('kn', 'Kannada'),
    ('ml', 'Malayalam'), ('or', 'Odia'), ('pa', 'Punjabi'), ('as', 'Assamese'),
    ('ur', 'Urdu'), ('sa', 'Sanskrit'), ('kok', 'Konkani'), ('mai', 'Maithili'),
    ('ks', 'Kashmiri'), ('ne', 'Nepali'),
]

PORTALS = [
    ('Landing', 'http://localhost:8080/'),
    ('Citizen', 'http://localhost:8080/citizen/'),
    ('DEO', 'http://localhost:8080/deo/'),
    ('Verifier', 'http://localhost:8080/verifier/'),
    ('Legal', 'http://localhost:8080/legal/'),
    ('GIS', 'http://localhost:8080/gis/'),
    ('Revenue', 'http://localhost:8080/revenue/'),
    ('Admin', 'http://localhost:8080/admin/'),
]

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--no-sandbox')
opts.add_argument('--disable-dev-shm-usage')
opts.add_argument('--window-size=1920,1080')

driver = webdriver.Chrome(options=opts)

# Matrix: portal -> lang -> result
matrix = {}
for portal_name, _ in PORTALS:
    matrix[portal_name] = {}

def set_lang(driver, lang):
    driver.execute_script(
        "localStorage.setItem('bhooraksha_language', arguments[0]);"
        "document.cookie = 'bhooraksha_language=' + arguments[0] + '; path=/; max-age=31536000';"
        "try { window.dispatchEvent(new CustomEvent('bhooraksha_language_change', {detail: {lang: arguments[0]}})); } catch(e) {}",
        lang
    )

def get_page_text_length(driver):
    try:
        return len(driver.find_element(By.TAG_NAME, 'body').text)
    except:
        return 0

def check_lang_applied(driver, lang):
    html_lang = driver.find_element(By.TAG_NAME, 'html').get_attribute('lang')
    # Check if language attribute is set correctly
    return html_lang == lang

def check_rtl(driver, lang):
    if lang not in ('ur', 'ks'):
        return True  # not RTL, skip
    html_dir = driver.find_element(By.TAG_NAME, 'html').get_attribute('dir')
    return html_dir == 'rtl'

total = 0
passed = 0
failed = 0
blocked = 0

print("Starting 8x18 Language Matrix Test...")
print("="*80)

for portal_name, portal_url in PORTALS:
    print(f"\n{'='*20} {portal_name} {'='*20}")
    for lang_code, lang_name in ALL_LANGS:
        total += 1
        try:
            # Navigate to portal
            driver.get(portal_url)
            time.sleep(1.0)

            # Set language
            set_lang(driver, lang_code)
            time.sleep(0.8)

            # Reload to apply
            driver.get(portal_url)
            time.sleep(1.5)

            # Check 1: Page loaded (not blank)
            text_len = get_page_text_length(driver)
            if text_len < 50:
                matrix[portal_name][lang_code] = 'FAIL:BLANK'
                failed += 1
                print(f"  [FAIL] {lang_name}({lang_code}): BLANK PAGE (text={text_len})")
                continue

            # Check 2: html.lang attribute set
            lang_set = check_lang_applied(driver, lang_code)

            # Check 3: RTL for ur/ks
            rtl_ok = check_rtl(driver, lang_code)

            # Check 4: Language selector shows selected language
            sel_ok = False
            try:
                selects = driver.find_elements(By.XPATH, "//select")
                for sel in selects:
                    if sel.get_attribute('value') == lang_code:
                        sel_ok = True
                        break
            except:
                pass

            if lang_set and rtl_ok:
                matrix[portal_name][lang_code] = 'PASS'
                passed += 1
                rtl_note = ' (RTL confirmed)' if lang_code in ('ur', 'ks') else ''
                print(f"  [PASS] {lang_name}({lang_code}): text={text_len}ch, lang_attr={lang_set}{rtl_note}")
            else:
                issues = []
                if not lang_set:
                    issues.append(f"html.lang={driver.find_element(By.TAG_NAME,'html').get_attribute('lang')}")
                if not rtl_ok:
                    issues.append(f"dir={driver.find_element(By.TAG_NAME,'html').get_attribute('dir')} (expected rtl)")
                matrix[portal_name][lang_code] = f'FAIL:{",".join(issues)}'
                failed += 1
                print(f"  [FAIL] {lang_name}({lang_code}): {' | '.join(issues)}")

        except Exception as e:
            matrix[portal_name][lang_code] = f'BLOCKED:{str(e)[:40]}'
            blocked += 1
            print(f"  [BLOCKED] {lang_name}({lang_code}): {str(e)[:60]}")

        finally:
            # Reset to English between tests
            try:
                driver.execute_script("localStorage.setItem('bhooraksha_language','en');")
            except:
                pass
            time.sleep(0.3)

driver.quit()

print("\n\n" + "="*80)
print("8x18 LANGUAGE MATRIX RESULTS")
print("="*80)

# Print matrix
lang_codes = [l[0] for l in ALL_LANGS]
header = f"{'Portal':<10}" + "".join(f"{c:>5}" for c in lang_codes)
print(header)
print("-"*len(header))

for portal_name, _ in PORTALS:
    row = f"{portal_name:<10}"
    for lang_code in lang_codes:
        result = matrix[portal_name].get(lang_code, 'N/A')
        if result == 'PASS':
            row += f"{'P':>5}"
        elif result.startswith('FAIL'):
            row += f"{'F':>5}"
        elif result.startswith('BLOCKED'):
            row += f"{'B':>5}"
        else:
            row += f"{'?':>5}"
    print(row)

print(f"\nSummary: {total} total | {passed} PASS | {failed} FAIL | {blocked} BLOCKED")

# Cross-portal language sync test
print("\n" + "="*80)
print("CROSS-PORTAL LANGUAGE SYNC TEST")
print("="*80)

driver2 = webdriver.Chrome(options=opts)
try:
    # Set language in one portal, check in another
    driver2.get('http://localhost:8080/citizen/')
    time.sleep(1.5)
    set_lang(driver2, 'ta')  # Tamil
    time.sleep(0.8)

    driver2.get('http://localhost:8080/deo/')
    time.sleep(1.5)
    html_lang = driver2.find_element(By.TAG_NAME, 'html').get_attribute('lang')
    print(f"  Set Tamil on Citizen, navigated to DEO: html.lang={html_lang}")
    print(f"  Cross-portal sync: {'PASS' if html_lang == 'ta' else 'FAIL (expected ta)'}")

    # Test reverse
    set_lang(driver2, 'kn')  # Kannada
    driver2.get('http://localhost:8080/admin/')
    time.sleep(1.5)
    html_lang = driver2.find_element(By.TAG_NAME, 'html').get_attribute('lang')
    print(f"  Set Kannada on DEO, navigated to Admin: html.lang={html_lang}")
    print(f"  Cross-portal sync (reverse): {'PASS' if html_lang == 'kn' else 'FAIL (expected kn)'}")
finally:
    driver2.quit()

print("\nDone. Matrix test complete.")
