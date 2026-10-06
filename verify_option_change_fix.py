# -*- coding: utf-8 -*-
"""
Verify language option dropdowns and role selection modal dismissal/navigation.
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

def test_option_change():
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 10)

    try:
        # Test 1: Citizen Portal Language Dropdown
        print("1. Testing Citizen Portal Language Option Dropdown (/citizen)...")
        driver.get("http://localhost:8080/citizen")
        time.sleep(2)
        
        lang_btn = driver.find_element(By.CSS_SELECTOR, "header div.relative button")
        lang_btn.click()
        time.sleep(1)

        logs = driver.get_log('browser')
        errors = [l for l in logs if l['level'] == 'SEVERE']
        print(f"  Console errors after opening language options in Citizen: {len(errors)}")
        for e in errors:
            print(f"    ERROR: {e['message']}")
        assert len(errors) == 0, "Citizen language dropdown threw runtime errors!"

        options = driver.find_elements(By.XPATH, "//div[contains(@class, 'max-h-72')]//button")
        print(f"  Language options visible: {len(options)}")
        assert len(options) > 10, "Language options not rendered in dropdown!"

        # Click Gujarati option
        gu_option = [o for o in options if "ગુજરાતી" in o.text or "Gujarati" in o.text]
        if gu_option:
            gu_option[0].click()
            time.sleep(1)
            print("  Successfully changed language option to Gujarati in Citizen Portal!")

        driver.save_screenshot("test_screenshots/citizen_lang_success.png")

        # Test 2: DEO Portal Language Dropdown
        print("\n2. Testing DEO Portal Language Option Dropdown (/deo)...")
        driver.get("http://localhost:8080/deo")
        time.sleep(2)

        deo_lang_btn = driver.find_element(By.CSS_SELECTOR, "header div.relative button")
        deo_lang_btn.click()
        time.sleep(1)

        deo_logs = driver.get_log('browser')
        deo_errors = [l for l in deo_logs if l['level'] == 'SEVERE']
        print(f"  Console errors after opening language options in DEO: {len(deo_errors)}")
        for e in deo_errors:
            print(f"    ERROR: {e['message']}")
        assert len(deo_errors) == 0, "DEO language dropdown threw runtime errors!"

        deo_options = driver.find_elements(By.XPATH, "//div[contains(@class, 'max-h-72')]//button")
        print(f"  DEO language options visible: {len(deo_options)}")
        assert len(deo_options) > 10, "DEO language options not rendered in dropdown!"

        driver.save_screenshot("test_screenshots/deo_lang_success.png")

        # Test 3: Landing Page Role Portals Modal Backdrop & Card Click
        print("\n3. Testing Landing Page Role Portals Modal Backdrop Dismissal...")
        driver.get("http://localhost:8080/")
        time.sleep(2)

        portal_btn = driver.find_element(By.XPATH, "//button[contains(., 'Portals') or contains(., 'पोर्टल') or contains(., 'પોર્ટલ')]")
        portal_btn.click()
        time.sleep(1)

        backdrop = driver.find_element(By.XPATH, "//div[contains(@class, 'backdrop-blur-md')]")
        print("  Modal blur screen is open.")
        
        # Click the backdrop to dismiss
        driver.execute_script("arguments[0].click();", backdrop)
        time.sleep(1)

        modals = driver.find_elements(By.XPATH, "//div[contains(@class, 'backdrop-blur-md')]")
        print(f"  Modal count after clicking backdrop: {len(modals)}")
        assert len(modals) == 0, "Modal did not dismiss on backdrop click!"
        print("  Backdrop click successfully dismissed blur screen!")

        # Re-open modal and click a card
        print("\n4. Testing Role Card navigation from modal...")
        portal_btn = driver.find_element(By.XPATH, "//button[contains(., 'Portals') or contains(., 'पोर्टल') or contains(., 'પોર્ટલ')]")
        portal_btn.click()
        time.sleep(1)

        # Click the Citizen Portal card inside the modal
        citizen_card = driver.find_element(By.XPATH, "//div[contains(@class, 'max-w-4xl')]//a[contains(@href, '/citizen/')]")
        citizen_card.click()
        time.sleep(2)

        curr_url = driver.current_url
        print(f"  Current URL after clicking card: {curr_url}")
        assert "/citizen" in curr_url, f"Failed to navigate to citizen portal, url is {curr_url}"
        print("  Card navigation verified successfully!")

        print("\nALL OPTION CHANGE & BLUR SCREEN TESTS PASSED WITH 0 ERRORS!")

    finally:
        driver.quit()

if __name__ == "__main__":
    test_option_change()
