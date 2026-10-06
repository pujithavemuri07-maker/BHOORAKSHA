# -*- coding: utf-8 -*-
"""
Verification Script for Bhooraksha Verifier History Portal across Languages.
Specifically checks Telugu (user screenshot), Hindi, Urdu (RTL), Sanskrit, and English.
"""

import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def log(msg):
    try:
        print(msg, flush=True)
    except Exception:
        print(msg.encode('ascii', 'replace').decode('ascii'), flush=True)

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--lang=en-US")

driver = webdriver.Chrome(options=chrome_options)

try:
    log("======================================================================")
    log("STAGE 1: LOAD VERIFIER HISTORY AT http://localhost:8080/verifier/history")
    log("======================================================================")
    driver.get("http://localhost:8080/verifier/history")
    time.sleep(3)

    log(f"Current URL: {driver.current_url}")
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "BHOORAKSHA" in body_text, "Page should contain BHOORAKSHA"
    log("✓ Verifier portal loaded successfully")

    # Locate language selector
    lang_select_elem = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "header select"))
    )
    select = Select(lang_select_elem)
    options = [o.get_attribute("value") for o in select.options]
    log(f"Detected {len(options)} languages in header dropdown: {options}")
    assert len(options) == 18, f"Expected 18 languages, got {len(options)}"
    log("✓ All 18 languages present in dropdown!")

    log("\n======================================================================")
    log("STAGE 2: SWITCH TO TELUGU (te) AND VERIFY ALL USER SCREENSHOT ITEMS")
    log("======================================================================")
    select.select_by_value("te")
    time.sleep(2)

    page_html = driver.page_source
    page_text = driver.find_element(By.TAG_NAME, "body").text

    # Test the exact elements from user's screenshot
    checks_telugu = [
        ("ధృవీకరణ చరిత్ర", "Page Main Heading - Verification History"),
        ("ఆడిట్ సమగ్రతను ధృవీకరించండి", "Button - VERIFY AUDIT INTEGRITY"),
        ("ఆమోద రేటు", "Header Sub-banner - Approval Rate"),
        ("గిర్దావర్", "Subtitle - Girdawar in Telugu"),
        ("ఆడిట్ ఎంట్రీ ID", "Table Header - Audit Entry ID"),
        ("దరఖాస్తు ID & చక్రం", "Table Header - App ID & Cycle"),
        ("పౌరుడు & భూభాగం", "Table Header - Citizen & Parcel"),
        ("తీసుకున్న నిర్ణయం", "Table Header - Decision Taken"),
        ("వర్క్‌ఫ్లో పరివర్తన", "Table Header - Workflow Transition"),
        ("ఆమోదించబడింది & ఫార్వర్డ్ చేయబడింది", "Badge - APPROVED & FORWARDED"),
        ("వెరిఫైయర్ ద్వారా తిరస్కరించబడింది", "Badge - REJECTED BY VERIFIER"),
        ("DEO కు తిరిగి పంపబడింది", "Badge - RETURNED TO DEO"),
        ("రెవెన్యూ అడ్మిన్‌కు నివేదించబడింది", "Badge - ESCALATED TO REVENUE ADMIN"),
        ("వివరాలు చూడండి", "Action Button - VIEW DETAILS"),
        ("అన్ని నిర్ణయ చర్యలు", "Dropdown - All Decision Actions"),
        ("శేరిలింగంపల్లి రెవెన్యూ విభాగం", "Header Badge - Serilingampally Revenue Division"),
        ("రెవెన్యూ ధృవీకరణ (తనిఖీదారు)", "Sidebar Section - Revenue Verification (Checker)"),
        ("మద్దతు & వ్యవస్థ", "Sidebar Section - Support & Ecosystem")
    ]

    for expected, label in checks_telugu:
        found = expected in page_text or expected in page_html
        assert found, f"FAILED: '{expected}' ({label}) not found on page in Telugu mode!"
        log(f"  ✓ Found '{expected}' ({label})")

    # Verify that the broken mixed English/Telugu string "Verification చరిత్ర" is GONE!
    assert "Verification చరిత్ర" not in page_text, "Mixed string 'Verification చరిత్ర' MUST NOT appear!"
    assert "Verification చరిత్ర" not in page_html, "Mixed string 'Verification చరిత్ర' MUST NOT appear in HTML!"
    log("✓ Confirmed: Broken hybrid string 'Verification చరిత్ర' completely ELIMINATED!")

    # Verify that "VERIFY AUDIT INTEGRITY" button in English is GONE in Telugu mode!
    assert "VERIFY AUDIT INTEGRITY" not in page_text, "'VERIFY AUDIT INTEGRITY' should be translated in Telugu mode"
    log("✓ Confirmed: English audit button completely replaced by Telugu translation!")

    log("\n======================================================================")
    log("STAGE 3: SWITCH TO HINDI (hi) AND VERIFY")
    log("======================================================================")
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("hi")
    time.sleep(2)

    page_text = driver.find_element(By.TAG_NAME, "body").text
    checks_hindi = [
        ("सत्यापन इतिहास", "Heading - Verification History in Hindi"),
        ("ऑडिट अखंडता सत्यापित करें", "Button - VERIFY AUDIT INTEGRITY in Hindi"),
        ("स्वीकृति दर", "Header - Approval Rate in Hindi"),
        ("स्वीकृत और अग्रेषित", "Badge - APPROVED & FORWARDED in Hindi"),
        ("विवरण देखें", "Button - VIEW DETAILS in Hindi")
    ]
    for expected, label in checks_hindi:
        assert expected in page_text, f"FAILED: '{expected}' ({label}) not found in Hindi mode!"
        log(f"  ✓ Found '{expected}' ({label})")

    log("\n======================================================================")
    log("STAGE 4: SWITCH TO URDU (ur) AND VERIFY RTL DIRECTION")
    log("======================================================================")
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("ur")
    time.sleep(2)

    dir_val = driver.find_element(By.TAG_NAME, "html").get_attribute("dir")
    assert dir_val == "rtl", f"Expected dir='rtl' for Urdu, got '{dir_val}'"
    page_text = driver.find_element(By.TAG_NAME, "body").text
    assert "توثیق کی تاریخ" in page_text, "Urdu heading should appear"
    assert "منظوری کی شرح" in page_text, "Urdu approval rate should appear"
    log("✓ Urdu verified with dir='rtl' and full translation!")

    log("\n======================================================================")
    log("STAGE 5: SWITCH TO SANSKRIT (sa) AND VERIFY LTR")
    log("======================================================================")
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("sa")
    time.sleep(2)

    dir_val = driver.find_element(By.TAG_NAME, "html").get_attribute("dir")
    assert dir_val == "ltr", f"Expected dir='ltr' for Sanskrit, got '{dir_val}'"
    page_text = driver.find_element(By.TAG_NAME, "body").text
    assert "सत्यापन इतिहासः" in page_text, "Sanskrit heading should appear"
    assert "स्वीकृतिदरः" in page_text, "Sanskrit approval rate should appear"
    log("✓ Sanskrit verified with dir='ltr' and full translation!")

    log("\n======================================================================")
    log("STAGE 6: VERIFY PERSISTENCE ACROSS REFRESH")
    log("======================================================================")
    driver.refresh()
    time.sleep(3)
    page_text = driver.find_element(By.TAG_NAME, "body").text
    assert "सत्यापन इतिहासः" in page_text, "Sanskrit language should persist across reload"
    log("✓ Language persists across refresh!")

    log("\n======================================================================")
    log("STAGE 7: RESTORE ENGLISH (en)")
    log("======================================================================")
    lang_select_elem = driver.find_element(By.CSS_SELECTOR, "header select")
    select = Select(lang_select_elem)
    select.select_by_value("en")
    time.sleep(2)

    page_text = driver.find_element(By.TAG_NAME, "body").text
    assert "Verification History" in page_text, "English heading should be restored"
    assert "VERIFY AUDIT INTEGRITY" in page_text or "Verify Audit Integrity" in page_text, "English button should be restored"
    log("✓ English restored successfully!")

    log("\n======================================================================")
    log("ALL 7 VERIFICATION STAGES PASSED COMPLETELY AND FLAWLESSLY!")
    log("======================================================================")

except Exception as e:
    log(f"\n[ERROR] Verification failed: {e}")
    sys.exit(1)
finally:
    driver.quit()
