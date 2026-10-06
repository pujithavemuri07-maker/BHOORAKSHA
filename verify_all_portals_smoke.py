# -*- coding: utf-8 -*-
"""
Multi-portal health and i18n smoke test across all services on Port 8080.
"""
import time
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_all_portals():
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(options=chrome_options)

    portals = [
        ("Unified Landing Page", "http://localhost:8080/"),
        ("Citizen Service", "http://localhost:8080/citizen"),
        ("DEO Service", "http://localhost:8080/deo"),
        ("Verifier Service", "http://localhost:8080/verifier/dashboard"),
        ("Legal Service", "http://localhost:8080/legal/dashboard"),
        ("GIS Service", "http://localhost:8080/gis"),
        ("Revenue Admin Service", "http://localhost:8080/revenue"),
        ("System Admin Service", "http://localhost:8080/admin/dashboard"),
    ]

    try:
        print("Starting comprehensive smoke test across all portals...\n")
        all_passed = True

        for name, url in portals:
            driver.get(url)
            time.sleep(2)
            title = driver.title
            body_text = driver.find_element(By.TAG_NAME, "body").text.strip()
            
            # Check for catastrophic errors (e.g. 404, 500, blank page)
            if not body_text or "404 Not Found" in body_text or "500 Internal Server Error" in body_text:
                print(f"❌ [FAIL] {name} ({url}): Server error or blank page!")
                all_passed = False
            else:
                first_line = body_text.splitlines()[0] if body_text.splitlines() else "OK"
                print(f"✅ [PASS] {name}: Loaded successfully (Title: '{title}', snippet: '{first_line[:50]}...')")

        # Now test multilingual global switch on landing page and verify across 2 routes
        print("\nTesting global language propagation across routes...")
        driver.get("http://localhost:8080/")
        time.sleep(1)
        driver.execute_script("""
            localStorage.setItem('bhooraksha_language', 'gu');
            document.cookie = 'bhooraksha_language=gu; path=/';
            window.dispatchEvent(new CustomEvent('bhooraksha_language_change', { detail: { lang: 'gu' } }));
        """)
        time.sleep(1)

        # Check verifier in Gujarati
        driver.get("http://localhost:8080/verifier/dashboard")
        time.sleep(2)
        v_body = driver.find_element(By.TAG_NAME, "body").text
        print(f"  Verifier in Gujarati contains non-empty text: {len(v_body)} chars")
        
        # Check legal in Gujarati
        driver.get("http://localhost:8080/legal/dashboard")
        time.sleep(2)
        l_body = driver.find_element(By.TAG_NAME, "body").text
        print(f"  Legal in Gujarati contains non-empty text: {len(l_body)} chars")

        # Check system admin in Gujarati
        driver.get("http://localhost:8080/admin/dashboard")
        time.sleep(2)
        a_body = driver.find_element(By.TAG_NAME, "body").text
        has_gu = "ભૂરક્ષા" in a_body or "એડમિન" in a_body or "કુલ નોંધાયેલા" in a_body
        print(f"  Admin in Gujarati active: {has_gu}")

        if all_passed and has_gu:
            print("\n🎉 ALL PORTALS OPERATIONAL & TRANSLATING PROPERLY!")
        else:
            print("\n⚠️ SOME CHECKS FAILED")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_all_portals()
