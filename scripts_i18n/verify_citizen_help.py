#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verification script for Citizen Help & Support Center in Telugu, Hindi, and Gujarati.
"""
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_citizen_help():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1440,900')

    driver = webdriver.Chrome(options=chrome_options)
    try:
        # Navigate to citizen help page
        driver.get("http://localhost:8080/citizen/help")
        time.sleep(2)

        # 1. Set language to Telugu ('te')
        driver.execute_script("localStorage.setItem('bhooraksha_language', 'te'); document.cookie = 'bhooraksha_language=te; path=/'; window.dispatchEvent(new Event('storage'));")
        driver.refresh()
        time.sleep(2)

        body_text = driver.find_element(By.TAG_NAME, "body").text
        print("=== TELUGU (te) VERIFICATION ===")
        
        # Check FAQ Header in Telugu
        faq_header_telugu = "తరచుగా అడిగే ప్రశ్నలు (FAQ)"
        assert faq_header_telugu in body_text, f"Missing '{faq_header_telugu}' in page text. Found text sample: {body_text[:300]}"
        print("✓ FAQ Header in Telugu confirmed:", faq_header_telugu)

        # Check Question 1 in Telugu
        q1_telugu = "AI ధృవీకరణ ప్రక్రియకు ఎంత సమయం పడుతుంది?"
        assert q1_telugu in body_text, f"Missing '{q1_telugu}' in page text"
        print("✓ Question 1 in Telugu confirmed:", q1_telugu)

        # Check Support banner in Telugu
        support_telugu = "పౌర సహాయం & మద్దతు కేంద్రం"
        assert support_telugu in body_text, f"Missing '{support_telugu}' in page text"
        print("✓ Support header in Telugu confirmed:", support_telugu)

        # Check 18 Regional Languages banner in Telugu
        lang18_telugu = "18 ప్రాంతీయ భాషలలో"
        assert lang18_telugu in body_text, f"Missing '{lang18_telugu}' in page text"
        print("✓ 18 Regional Languages banner in Telugu confirmed:", lang18_telugu)

        # Check Sidebar headers in Telugu
        assert "పౌర సేవలు" in body_text, "Missing 'Citizen Services' in Telugu"
        assert "సహాయం & ఖాతా" in body_text, "Missing 'Assistance & Account' in Telugu"
        print("✓ Sidebar headers in Telugu confirmed!")

        # Take screenshot for confirmation
        driver.save_screenshot("citizen_help_te_verified.png")
        print("✓ Saved screenshot to citizen_help_te_verified.png")

        # 2. Set language to Hindi ('hi')
        driver.execute_script("localStorage.setItem('bhooraksha_language', 'hi'); document.cookie = 'bhooraksha_language=hi; path=/'; window.dispatchEvent(new Event('storage'));")
        driver.refresh()
        time.sleep(2)
        body_text_hi = driver.find_element(By.TAG_NAME, "body").text
        print("\n=== HINDI (hi) VERIFICATION ===")
        assert "अक्सर पूछे जाने वाले प्रश्न (FAQ)" in body_text_hi
        assert "एआई सत्यापन प्रक्रिया में कितना समय लगता है?" in body_text_hi
        assert "नागरिक सहायता एवं समर्थन केंद्र" in body_text_hi
        assert "नागरिक सेवाएं" in body_text_hi
        print("✓ All Hindi elements confirmed!")

        # 3. Set language to Gujarati ('gu')
        driver.execute_script("localStorage.setItem('bhooraksha_language', 'gu'); document.cookie = 'bhooraksha_language=gu; path=/'; window.dispatchEvent(new Event('storage'));")
        driver.refresh()
        time.sleep(2)
        body_text_gu = driver.find_element(By.TAG_NAME, "body").text
        print("\n=== GUJARATI (gu) VERIFICATION ===")
        assert "વારંવાર પૂછાતા પ્રશ્નો (FAQ)" in body_text_gu
        assert "નાગરિક સહાય અને સમર્થન કેન્દ્ર" in body_text_gu
        print("✓ All Gujarati elements confirmed!")

        print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
    finally:
        driver.quit()

if __name__ == '__main__':
    test_citizen_help()
