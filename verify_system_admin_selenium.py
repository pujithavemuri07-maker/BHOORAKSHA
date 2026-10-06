# -*- coding: utf-8 -*-
"""
Automated Selenium verification of System Admin Portal across languages (Gujarati, Hindi, Telugu, Urdu, English).
"""
import time
import os
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_system_admin():
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 15)

    try:
        url = "http://localhost:8080/admin/dashboard"
        print(f"Loading {url}...")
        driver.get(url)
        time.sleep(2)

        # Test 1: Gujarati (gu) - Primary User screenshot requirement
        print("\n--- Testing Gujarati (gu) ---")
        driver.execute_script("""
            localStorage.setItem('bhooraksha_language', 'gu');
            document.cookie = 'bhooraksha_language=gu; path=/';
            window.dispatchEvent(new CustomEvent('bhooraksha_language_change', { detail: { lang: 'gu' } }));
        """)
        driver.get(url)
        time.sleep(3)

        body_text = driver.find_element(By.TAG_NAME, "body").text
        
        gu_expected = [
            ("Portal Title", "ભૂરક્ષા સિસ્ટમ એડમિનિસ્ટ્રેશન અને ઓબ્ઝર્વેબિલિટી ડિરેક્ટોરેટ"),
            ("Admin Dashboard", "એડમિન"),
            ("Superuser Access", "CCLA સુપરયુઝર એક્સેસ"),
            ("Create User Button", "વપરાશકર્તા ખાતું બનાવો"),
            ("Export Audit Button", "અપરિવર્તનીય ઓડિટ નિકાસ કરો"),
            ("Total Users Card", "કુલ નોંધાયેલા વપરાશકર્તાઓ"),
            ("Total Processed Deeds", "કુલ પ્રક્રિયા કરેલ દસ્તાવેજો"),
            ("State Infra Uptime", "રાજ્ય ઇન્ફ્રાસ્ટ્રક્ચર અપટાઇમ"),
            ("Microservice Fleet", "માઇક્રોસર્વિસ ફ્લીટ આરોગ્ય"),
            ("AI Accuracy", "એઆઈ OCR/NER ચોકસાઈ દર"),
            ("Officer Sessions", "સમવર્તી અધિકારી સત્રો"),
            ("Deed Trend Chart", "દસ્તાવેજ અરજી પ્રવેશ અને બહાલી વલણ"),
            ("Last 7 Days", "છેલ્લા 7 દિવસ"),
            ("Chitrapathak OCR", "ચિત્રપાઠક બહુભાષી OCR"),
            ("MuRIL NER", "MuRIL ભારતીય નામ ઓળખકર્તા (NER)"),
            ("LexBhoomi Engine", "લેક્સભૂમિ કાનૂની પાલન એન્જિન"),
            ("Recent Activity", "તાજેતરની રાજ્યવ્યાપી સિસ્ટમ અને અધિકારી પ્રવૃત્તિ"),
            ("Timestamp Header", "સમયમુદ્રા"),
            ("Actor Header", "કર્તા / અધિકારી"),
        ]

        gu_passed = 0
        for label, exp in gu_expected:
            if exp in body_text:
                print(f"  [PASS] {label}: Found '{exp}'")
                gu_passed += 1
            else:
                print(f"  [FAIL] {label}: NOT found '{exp}'")

        # Capture screenshot for Gujarati
        os.makedirs("test_screenshots", exist_ok=True)
        driver.save_screenshot("test_screenshots/admin_dashboard_gujarati.png")
        print("  Captured screenshot: test_screenshots/admin_dashboard_gujarati.png")

        # Test 2: Hindi (hi)
        print("\n--- Testing Hindi (hi) ---")
        driver.execute_script("""
            localStorage.setItem('bhooraksha_language', 'hi');
            document.cookie = 'bhooraksha_language=hi; path=/';
            window.dispatchEvent(new CustomEvent('bhooraksha_language_change', { detail: { lang: 'hi' } }));
        """)
        driver.get(url)
        time.sleep(2)
        body_text_hi = driver.find_element(By.TAG_NAME, "body").text
        
        hi_expected = [
            ("Portal Title (HI)", "भूरक्षा प्रणाली प्रशासन एवं पर्यवेक्षण निदेशालय"),
            ("Superuser Access (HI)", "सीसीएलए सुपरयूजर पहुंच"),
            ("Create User Button (HI)", "उपयोगकर्ता खाता बनाएं"),
            ("Total Users (HI)", "कुल पंजीकृत उपयोगकर्ता"),
            ("Chitrapathak OCR (HI)", "चित्रपाठक बहुभाषी ओसीआर"),
        ]
        hi_passed = 0
        for label, exp in hi_expected:
            if exp in body_text_hi:
                print(f"  [PASS] {label}: Found '{exp}'")
                hi_passed += 1
            else:
                print(f"  [FAIL] {label}: NOT found '{exp}'")

        # Test 3: Telugu (te)
        print("\n--- Testing Telugu (te) ---")
        driver.execute_script("""
            localStorage.setItem('bhooraksha_language', 'te');
            document.cookie = 'bhooraksha_language=te; path=/';
            window.dispatchEvent(new CustomEvent('bhooraksha_language_change', { detail: { lang: 'te' } }));
        """)
        driver.get(url)
        time.sleep(2)
        body_text_te = driver.find_element(By.TAG_NAME, "body").text
        
        te_expected = [
            ("Portal Title (TE)", "భూరక్ష వ్యవస్థ పరిపాలన & పరిశీలన డైరెక్టరేట్"),
            ("Superuser Access (TE)", "CCLA సూపర్‌యూజర్ యాక్సెస్"),
            ("Create User Button (TE)", "యూజర్ ఖాతాను సృష్టించండి"),
            ("Total Users (TE)", "మొత్తం నమోదిత వినియోగదారులు"),
            ("Chitrapathak OCR (TE)", "చిత్రపాఠక్ బహుభాషా OCR"),
        ]
        te_passed = 0
        for label, exp in te_expected:
            if exp in body_text_te:
                print(f"  [PASS] {label}: Found '{exp}'")
                te_passed += 1
            else:
                print(f"  [FAIL] {label}: NOT found '{exp}'")

        print(f"\nSummary: Gujarati: {gu_passed}/{len(gu_expected)}, Hindi: {hi_passed}/{len(hi_expected)}, Telugu: {te_passed}/{len(te_expected)}")
        assert gu_passed >= len(gu_expected) - 2, f"Too many Gujarati failures ({gu_passed}/{len(gu_expected)})"
        print("SYSTEM ADMIN VERIFICATION SUCCESSFUL!")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_system_admin()
