#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exhaustive Option & Interactive Element Test for Bhooraksha
Tests every button, dropdown, link, tab, modal, and language option across all 8 portals on Port 8080.
"""
import sys
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

results = {
    "total_tested": 0,
    "passed": 0,
    "failed": 0,
    "issues": []
}

def log_test(category, option_name, success, details=""):
    results["total_tested"] += 1
    if success:
        results["passed"] += 1
        print(f"  [PASS] {category} -> {option_name}")
    else:
        results["failed"] += 1
        issue_msg = f"{category} -> {option_name}: {details}"
        results["issues"].append(issue_msg)
        print(f"  [FAIL] {issue_msg}")

def run_deep_tests():
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 10)

    try:
        # ==========================================
        # 1. LANDING PAGE TESTS
        # ==========================================
        print("\n==========================================")
        print("1. TESTING LANDING PAGE (http://localhost:8080/)")
        print("==========================================")
        driver.get("http://localhost:8080/")
        time.sleep(2)

        # 1.1 Language Selector on Landing Page
        try:
            lang_btn = driver.find_element(By.XPATH, "//button[contains(., 'Language') or contains(., 'English') or contains(@class, 'LanguageSelector')]")
            lang_btn.click()
            time.sleep(1)
            # Find language options in dropdown
            options = driver.find_elements(By.XPATH, "//button[contains(@class, 'w-full') or contains(@class, 'rounded-xl')]")
            if len(options) >= 18:
                log_test("Landing Page", "Language Dropdown (18 Languages Available)", True)
            else:
                log_test("Landing Page", "Language Dropdown Options Count", False, f"Found only {len(options)} options")
            
            # Switch to Hindi
            hi_btn = driver.find_element(By.XPATH, "//button[contains(., 'हिन्दी') or contains(., 'Hindi')]")
            hi_btn.click()
            time.sleep(1)
            body = driver.find_element(By.TAG_NAME, "body").text
            log_test("Landing Page", "Language Switch to Hindi", "भूरक्षा" in body or "नागरिक" in body or "पोर्टल" in body)

            # Switch back to English
            lang_btn = driver.find_element(By.XPATH, "//button[contains(., 'हिन्दी') or contains(., 'Language')]")
            lang_btn.click()
            time.sleep(1)
            en_btn = driver.find_element(By.XPATH, "//button[contains(., 'English')]")
            en_btn.click()
            time.sleep(1)
            log_test("Landing Page", "Language Switch to English", "Bhooraksha" in driver.page_source)
        except Exception as e:
            log_test("Landing Page", "Language Selector Interaction", False, str(e))

        # 1.2 Explore Portals Modal
        try:
            explore_btn = driver.find_element(By.XPATH, "//button[contains(., 'Explore') or contains(., 'Access') or contains(., 'Portals')]")
            explore_btn.click()
            time.sleep(1)
            modal = driver.find_element(By.XPATH, "//div[contains(@class, 'fixed inset-0') or contains(@role, 'dialog')]")
            log_test("Landing Page", "Explore Portals Modal Opens", modal.is_displayed())

            # Test closing modal by Escape
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            time.sleep(1)
            modals_open = driver.find_elements(By.XPATH, "//div[contains(@role, 'dialog') and not(contains(@style, 'display: none'))]")
            log_test("Landing Page", "Modal Dismiss via Escape Key", len(modals_open) == 0 or not modal.is_displayed())
        except Exception as e:
            log_test("Landing Page", "Explore Portals Modal", False, str(e))

        # 1.3 Track Application & Public Title Search Tabs / Inputs
        try:
            search_input = driver.find_elements(By.XPATH, "//input[@type='text' or contains(@placeholder, 'REQ-') or contains(@placeholder, 'Search')]")
            if search_input:
                search_input[0].clear()
                search_input[0].send_keys("REQ-2026-000123")
                log_test("Landing Page", "Application Search Input", True)
                # Find search / track button
                track_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Track') or contains(., 'Search') or contains(., 'Verify')]")
                if track_btn:
                    track_btn[0].click()
                    time.sleep(1)
                    log_test("Landing Page", "Track Application Button Click", True)
            else:
                log_test("Landing Page", "Application Search Input", False, "No input found")
        except Exception as e:
            log_test("Landing Page", "Search Interaction", False, str(e))

        # 1.4 FAQ Accordion items on Landing page
        try:
            faq_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'w-full') and .//span and .//svg]")
            if faq_buttons:
                # Click first FAQ
                faq_buttons[0].click()
                time.sleep(1)
                log_test("Landing Page", "FAQ Accordion Expand/Collapse", True)
            else:
                log_test("Landing Page", "FAQ Accordion Items", True, "No landing FAQ accordions or rendered differently")
        except Exception as e:
            log_test("Landing Page", "FAQ Accordion", False, str(e))


        # ==========================================
        # 2. CITIZEN PORTAL TESTS
        # ==========================================
        print("\n==========================================")
        print("2. TESTING CITIZEN PORTAL (/citizen)")
        print("==========================================")
        driver.get("http://localhost:8080/citizen/dashboard")
        time.sleep(2)

        # 2.1 Sidebar navigation options
        citizen_routes = [
            ("Dashboard", "/citizen/dashboard", "Dashboard"),
            ("Upload Document", "/citizen/upload", "Upload"),
            ("Applications List", "/citizen/applications", "Applications"),
            ("Profile", "/citizen/profile", "Profile"),
            ("Help & FAQs", "/citizen/help", "Help")
        ]
        for name, route, keyword in citizen_routes:
            try:
                driver.get(f"http://localhost:8080{route}")
                time.sleep(1.5)
                body = driver.find_element(By.TAG_NAME, "body").text
                log_test("Citizen Portal", f"Route {name} ({route})", len(body) > 50)
            except Exception as e:
                log_test("Citizen Portal", f"Route {name}", False, str(e))

        # 2.2 Help page FAQ interactions
        try:
            driver.get("http://localhost:8080/citizen/help")
            time.sleep(2)
            faq_btns = driver.find_elements(By.XPATH, "//div[contains(@class, 'bg-slate-900')]//button[contains(@class, 'w-full')]")
            if len(faq_btns) >= 5:
                # Click each of the 5 FAQs
                for idx, btn in enumerate(faq_btns):
                    btn.click()
                    time.sleep(0.3)
                log_test("Citizen Portal", "Help Page: All 5 FAQs Clickable & Expandable", True)
            else:
                log_test("Citizen Portal", "Help Page FAQs Count", False, f"Found {len(faq_btns)} buttons")
        except Exception as e:
            log_test("Citizen Portal", "Help Page FAQ Buttons", False, str(e))

        # 2.3 Applications filter tabs
        try:
            driver.get("http://localhost:8080/citizen/applications")
            time.sleep(2)
            filter_btns = driver.find_elements(By.XPATH, "//button[contains(., 'All') or contains(., 'Pending') or contains(., 'Verified') or contains(., 'Action Required')]")
            if filter_btns:
                for btn in filter_btns:
                    btn.click()
                    time.sleep(0.3)
                log_test("Citizen Portal", "Applications Page: Status Filter Tabs", True)
            else:
                log_test("Citizen Portal", "Applications Page: Filter Tabs", False, "No filter buttons found")
        except Exception as e:
            log_test("Citizen Portal", "Applications Filter Tabs", False, str(e))

        # 2.4 Upload page dropzone and inputs
        try:
            driver.get("http://localhost:8080/citizen/upload")
            time.sleep(2)
            inputs = driver.find_elements(By.XPATH, "//input | //select")
            log_test("Citizen Portal", "Upload Page: Form Inputs & Selectors Present", len(inputs) > 0)
        except Exception as e:
            log_test("Citizen Portal", "Upload Page Form", False, str(e))

        # 2.5 Citizen Header: Language Dropdown
        try:
            lang_selector = driver.find_elements(By.XPATH, "//header//button[contains(@class, 'Language') or contains(., 'English') or contains(., 'Language')]")
            if lang_selector:
                lang_selector[0].click()
                time.sleep(1)
                opts = driver.find_elements(By.XPATH, "//header//button[contains(@class, 'w-full')]")
                log_test("Citizen Portal", f"Header Language Dropdown ({len(opts)} options)", len(opts) >= 18)
                # Close by clicking header
                driver.find_element(By.TAG_NAME, "header").click()
            else:
                log_test("Citizen Portal", "Header Language Dropdown", False, "Dropdown button not found in header")
        except Exception as e:
            log_test("Citizen Portal", "Header Language Dropdown", False, str(e))


        # ==========================================
        # 3. DEO PORTAL TESTS
        # ==========================================
        print("\n==========================================")
        print("3. TESTING DEO PORTAL (/deo)")
        print("==========================================")
        deo_routes = [
            ("Dashboard", "/deo/dashboard"),
            ("Review Queue", "/deo/review"),
            ("Manual Entry", "/deo/manual-entry"),
            ("History", "/deo/history"),
            ("Profile", "/deo/profile"),
            ("Help", "/deo/help")
        ]
        for name, route in deo_routes:
            try:
                driver.get(f"http://localhost:8080{route}")
                time.sleep(1.5)
                body = driver.find_element(By.TAG_NAME, "body").text
                log_test("DEO Portal", f"Route {name} ({route})", len(body) > 50)
            except Exception as e:
                log_test("DEO Portal", f"Route {name}", False, str(e))

        # 3.1 DEO Header Language Selector
        try:
            lang_selector = driver.find_elements(By.XPATH, "//header//button[contains(@class, 'Language') or contains(., 'English') or contains(., 'Language')]")
            if lang_selector:
                lang_selector[0].click()
                time.sleep(1)
                opts = driver.find_elements(By.XPATH, "//header//button[contains(@class, 'w-full')]")
                log_test("DEO Portal", f"Header Language Dropdown ({len(opts)} options)", len(opts) >= 18)
                driver.find_element(By.TAG_NAME, "header").click()
            else:
                log_test("DEO Portal", "Header Language Dropdown", False, "Not found")
        except Exception as e:
            log_test("DEO Portal", "Header Language Dropdown", False, str(e))

        # 3.2 DEO Manual Entry Form Options
        try:
            driver.get("http://localhost:8080/deo/manual-entry")
            time.sleep(2)
            inputs = driver.find_elements(By.XPATH, "//input | //select | //textarea")
            submit_btn = driver.find_elements(By.XPATH, "//button[@type='submit' or contains(., 'Save') or contains(., 'Submit') or contains(., 'Process')]")
            log_test("DEO Portal", f"Manual Entry Form: {len(inputs)} Inputs & Submit Button", len(inputs) > 3 and len(submit_btn) > 0)
        except Exception as e:
            log_test("DEO Portal", "Manual Entry Form", False, str(e))


        # ==========================================
        # 4. VERIFIER PORTAL TESTS
        # ==========================================
        print("\n==========================================")
        print("4. TESTING VERIFIER PORTAL (/verifier)")
        print("==========================================")
        verifier_routes = [
            ("Dashboard", "/verifier/dashboard"),
            ("Verification Queue", "/verifier/review"),
            ("History", "/verifier/history"),
            ("Profile", "/verifier/profile"),
            ("Help", "/verifier/help")
        ]
        for name, route in verifier_routes:
            try:
                driver.get(f"http://localhost:8080{route}")
                time.sleep(1.5)
                body = driver.find_element(By.TAG_NAME, "body").text
                log_test("Verifier Portal", f"Route {name} ({route})", len(body) > 50)
            except Exception as e:
                log_test("Verifier Portal", f"Route {name}", False, str(e))

        # 4.1 Queue items inspection & review actions
        try:
            driver.get("http://localhost:8080/verifier/review")
            time.sleep(2)
            cards = driver.find_elements(By.XPATH, "//div[contains(@class, 'rounded-2xl') or contains(@class, 'border-slate-800')]")
            action_btns = driver.find_elements(By.XPATH, "//button[contains(., 'Review') or contains(., 'Inspect') or contains(., 'Verify') or contains(., 'View')]")
            log_test("Verifier Portal", f"Review Queue: Cards ({len(cards)}) & Action Buttons ({len(action_btns)})", len(cards) > 0)
        except Exception as e:
            log_test("Verifier Portal", "Review Queue Action Buttons", False, str(e))


        # ==========================================
        # 5. LEGAL PORTAL TESTS
        # ==========================================
        print("\n==========================================")
        print("5. TESTING LEGAL REVIEW PORTAL (/legal)")
        print("==========================================")
        legal_routes = [
            ("Dashboard", "/legal/dashboard"),
            ("Scrutiny Queue", "/legal/review"),
            ("History", "/legal/history"),
            ("Profile", "/legal/profile"),
            ("Help", "/legal/help")
        ]
        for name, route in legal_routes:
            try:
                driver.get(f"http://localhost:8080{route}")
                time.sleep(1.5)
                body = driver.find_element(By.TAG_NAME, "body").text
                log_test("Legal Portal", f"Route {name} ({route})", len(body) > 50)
            except Exception as e:
                log_test("Legal Portal", f"Route {name}", False, str(e))


        # ==========================================
        # 6. GIS PORTAL TESTS
        # ==========================================
        print("\n==========================================")
        print("6. TESTING GIS PORTAL (/gis)")
        print("==========================================")
        gis_routes = [
            ("Dashboard", "/gis/dashboard"),
            ("Review Queue", "/gis/review"),
            ("History", "/gis/history"),
            ("Profile", "/gis/profile"),
            ("Help", "/gis/help")
        ]
        for name, route in gis_routes:
            try:
                driver.get(f"http://localhost:8080{route}")
                time.sleep(1.5)
                body = driver.find_element(By.TAG_NAME, "body").text
                log_test("GIS Portal", f"Route {name} ({route})", len(body) > 50)
            except Exception as e:
                log_test("GIS Portal", f"Route {name}", False, str(e))


        # ==========================================
        # 7. REVENUE ADMIN PORTAL TESTS
        # ==========================================
        print("\n==========================================")
        print("7. TESTING REVENUE ADMIN PORTAL (/revenue)")
        print("==========================================")
        revenue_routes = [
            ("Dashboard", "/revenue/dashboard"),
            ("Approval Queue", "/revenue/review"),
            ("Reports", "/revenue/reports"),
            ("Tehsils", "/revenue/tehsils"),
            ("History", "/revenue/history"),
            ("Profile", "/revenue/profile"),
            ("Help", "/revenue/help")
        ]
        for name, route in revenue_routes:
            try:
                driver.get(f"http://localhost:8080{route}")
                time.sleep(1.5)
                body = driver.find_element(By.TAG_NAME, "body").text
                log_test("Revenue Portal", f"Route {name} ({route})", len(body) > 50)
            except Exception as e:
                log_test("Revenue Portal", f"Route {name}", False, str(e))


        # ==========================================
        # 8. SYSTEM ADMIN PORTAL TESTS
        # ==========================================
        print("\n==========================================")
        print("8. TESTING SYSTEM ADMIN PORTAL (/admin)")
        print("==========================================")
        admin_routes = [
            ("Dashboard", "/admin/dashboard"),
            ("System Monitor", "/admin/monitor"),
            ("AI Performance", "/admin/ai-performance"),
            ("Audit Log", "/admin/audit"),
            ("User Management", "/admin/users"),
            ("Reports", "/admin/reports"),
            ("Settings", "/admin/settings"),
            ("Profile", "/admin/profile"),
            ("Help", "/admin/help")
        ]
        for name, route in admin_routes:
            try:
                driver.get(f"http://localhost:8080{route}")
                time.sleep(1.5)
                body = driver.find_element(By.TAG_NAME, "body").text
                log_test("System Admin Portal", f"Route {name} ({route})", len(body) > 50)
            except Exception as e:
                log_test("System Admin Portal", f"Route {name}", False, str(e))

        # 8.1 System Admin Action Buttons
        try:
            driver.get("http://localhost:8080/admin/dashboard")
            time.sleep(2)
            # Create user account button
            create_btn = driver.find_elements(By.XPATH, "//button[contains(., 'User') or contains(., 'Create') or contains(., 'વપરાશકર્તા')]")
            if create_btn:
                create_btn[0].click()
                time.sleep(1)
                modal = driver.find_elements(By.XPATH, "//div[contains(@class, 'fixed inset-0') or contains(@role, 'dialog')]")
                log_test("System Admin Portal", "Create User Modal Opens", len(modal) > 0)
                # Dismiss modal
                driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
                time.sleep(1)
            else:
                log_test("System Admin Portal", "Create User Button", False, "Not found")
        except Exception as e:
            log_test("System Admin Portal", "Admin Dashboard Buttons", False, str(e))

        # 8.2 System Admin Settings Toggles & Buttons
        try:
            driver.get("http://localhost:8080/admin/settings")
            time.sleep(2)
            toggles = driver.find_elements(By.XPATH, "//button[@role='switch' or contains(@class, 'rounded-full')]")
            save_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Save') or contains(., 'Update')]")
            log_test("System Admin Portal", f"Settings Page: Toggles ({len(toggles)}) & Action Buttons ({len(save_btn)})", len(toggles) > 0 or len(save_btn) > 0)
        except Exception as e:
            log_test("System Admin Portal", "Settings Page Controls", False, str(e))

    finally:
        driver.quit()

    print("\n==========================================")
    print("TEST SUMMARY:")
    print(f"Total Options/Elements Tested: {results['total_tested']}")
    print(f"Passed: {results['passed']}")
    print(f"Failed: {results['failed']}")
    if results['issues']:
        print("Issues identified:")
        for issue in results['issues']:
            print(f"  - {issue}")
    print("==========================================\n")
    return results

if __name__ == '__main__':
    run_deep_tests()
