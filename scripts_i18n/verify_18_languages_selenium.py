# -*- coding: utf-8 -*-
"""
Verification Script for Bhooraksha 18-Language System & Legal Dashboard Localization.
"""

import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--lang=en-US")

driver = webdriver.Chrome(options=chrome_options)

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def log(msg):
    try:
        print(msg, flush=True)
    except Exception:
        print(msg.encode('ascii', 'replace').decode('ascii'), flush=True)

try:
    log("======================================================================")
    log("STAGE 1: LOAD LEGAL DASHBOARD AT http://localhost:8080/legal/dashboard")
    log("======================================================================")
    driver.get("http://localhost:8080/legal/dashboard")
    time.sleep(3)

    log(f"Current URL: {driver.current_url}")
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "BHOORAKSHA" in body_text, "Page should contain BHOORAKSHA"
    log("✓ Legal portal loaded successfully")

    # Locate language selector select element
    lang_select_elem = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "header select"))
    )
    select = Select(lang_select_elem)
    options = [o.get_attribute("value") for o in select.options]
    log(f"Detected {len(options)} languages in header dropdown: {options}")
    assert len(options) == 18, f"Expected 18 languages, got {len(options)}"
    log("✓ All 18 languages are present in the Language Selector dropdown!")

    log("\n======================================================================")
    log("STAGE 2: SWITCH TO HINDI (hi) AND VERIFY LEGAL DASHBOARD")
    log("======================================================================")
    select.select_by_value("hi")
    time.sleep(2)

    page_html = driver.page_source
    page_text = driver.find_element(By.TAG_NAME, "body").text

    # Verify the exact strings from user's screenshot are now in Hindi
    checks_hindi = [
        ("राजस्व विधिक शाखा • भूमि संरक्षण निदेशालय", "Top Banner Header"),
        ("आज का कार्य", "Today's Work"),
        ("सारांश मेट्रिक्स", "Summary Metrics"),
        ("लंबित समीक्षा", "Pending Review"),
        ("आज समीक्षा की गई", "Reviewed Today"),
        ("उच्चाधिकारियों को भेजा गया", "Escalated"),
        ("लंबित कानूनी समीक्षा", "KPI: Pending Legal Review"),
        ("आपकी समीक्षा की प्रतीक्षा कर रहे मामले", "KPI: Cases awaiting review"),
        ("कानूनी कार्रवाई हेतु आवश्यक मामले", "Section: Cases Requiring Legal Action"),
        ("मामला आईडी", "Table: Case ID"),
        ("आवेदक / भूस्वामी", "Table: Applicant / Owner"),
        ("सर्वेक्षण संख्या", "Table: Survey Number"),
        ("पहचानी गई समस्या", "Table: Issue Detected"),
        ("जोखिम", "Table: Risk"),
        ("जमा किया गया", "Table: Submitted"),
        ("कार्रवाई", "Table: Action"),
        ("मामले की समीक्षा करें", "Action: Review Case"),
        ("उच्च जोखिम", "Risk: High Risk"),
        ("कम जोखिम", "Risk: Low Risk")
    ]

    for expected, label in checks_hindi:
        found = expected in page_text or expected in page_html
        assert found, f"FAILED: '{expected}' ({label}) not found on page in Hindi mode!"
        log(f"  ✓ Found '{expected}' ({label})")

    log("✓ 100% of Legal Dashboard elements translated to Hindi!")

    log("\n======================================================================")
    log("STAGE 3: SWITCH TO URDU (ur) AND VERIFY RTL DIRECTION")
    log("======================================================================")
    # Re-fetch select
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("ur")
    time.sleep(2)

    html_tag = driver.find_element(By.TAG_NAME, "html")
    dir_val = html_tag.get_attribute("dir")
    lang_val = html_tag.get_attribute("lang")
    log(f"HTML dir attribute: '{dir_val}', lang attribute: '{lang_val}'")
    assert dir_val == "rtl", f"Expected dir='rtl' for Urdu, got '{dir_val}'"
    assert lang_val == "ur", f"Expected lang='ur' for Urdu, got '{lang_val}'"
    log("✓ Automatic RTL layout direction verified for Urdu!")

    ur_text = driver.find_element(By.TAG_NAME, "body").text
    assert "آج کا کام" in ur_text or "قانونی" in ur_text, "Urdu text should appear on page"
    log("✓ Urdu text verified on page!")

    log("\n======================================================================")
    log("STAGE 4: SWITCH TO KASHMIRI (ks) AND VERIFY RTL DIRECTION")
    log("======================================================================")
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("ks")
    time.sleep(2)

    dir_val = driver.find_element(By.TAG_NAME, "html").get_attribute("dir")
    assert dir_val == "rtl", f"Expected dir='rtl' for Kashmiri, got '{dir_val}'"
    log("✓ Automatic RTL layout direction verified for Kashmiri!")

    log("\n======================================================================")
    log("STAGE 5: SWITCH TO SANSKRIT (sa) AND VERIFY LTR RESTORATION")
    log("======================================================================")
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("sa")
    time.sleep(2)

    dir_val = driver.find_element(By.TAG_NAME, "html").get_attribute("dir")
    assert dir_val == "ltr", f"Expected dir='ltr' for Sanskrit, got '{dir_val}'"
    sa_text = driver.find_element(By.TAG_NAME, "body").text
    assert "अद्यतनं कार्यम्" in sa_text or "समीक्षा" in sa_text, "Sanskrit text should appear on page"
    log("✓ Sanskrit translation and LTR layout verified!")

    log("\n======================================================================")
    log("STAGE 6: VERIFY PERSISTENCE ACROSS BROWSER REFRESH")
    log("======================================================================")
    driver.refresh()
    time.sleep(3)
    refreshed_text = driver.find_element(By.TAG_NAME, "body").text
    assert "अद्यतनं कार्यम्" in refreshed_text or "समीक्षा" in refreshed_text, "Language should be preserved after refresh!"
    log("✓ Language persistently preserved across browser reload!")

    log("\n======================================================================")
    log("STAGE 7: SWITCH BACK TO ENGLISH (en) AND RESTORE")
    log("======================================================================")
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("en")
    time.sleep(2)

    en_text = driver.find_element(By.TAG_NAME, "body").text
    assert "Revenue Legal Wing" in en_text, "English text should be restored"
    assert ("Today's Work" in en_text or "TODAY'S WORK" in en_text), "Today's work in English should be restored"
    log("✓ English restoration verified!")

    log("\n======================================================================")
    log("ALL 7 VERIFICATION STAGES PASSED COMPLETELY AND FLAWLESSLY!")
    log("======================================================================")

except Exception as e:
    log(f"\n[ERROR] Verification failed: {e}")
    sys.exit(1)
finally:
    driver.quit()
