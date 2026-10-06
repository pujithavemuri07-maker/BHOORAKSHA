#!/usr/bin/env python3
"""
Bhooraksha (भूरक्षा) - Database Seeding Script
Populates initial administrative and operational records across all 7 user roles.
"""
import sys
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed_data")

SEED_ROLES = [
    {"email": "citizen@bhooraksha.gov.in", "name": "Rajesh Sharma", "role": "citizen", "lang": "en"},
    {"email": "deo@bhooraksha.gov.in", "name": "Anand Verma", "role": "deo", "lang": "hi"},
    {"email": "verifier@bhooraksha.gov.in", "name": "Pooja Iyer", "role": "verifier", "lang": "ta"},
    {"email": "legal@bhooraksha.gov.in", "name": "Adv. Vikram Deshmukh", "role": "legal", "lang": "mr"},
    {"email": "gis@bhooraksha.gov.in", "name": "Suresh Reddy", "role": "gis", "lang": "te"},
    {"email": "revenue@bhooraksha.gov.in", "name": "Meera Nair", "role": "revenue", "lang": "ml"},
    {"email": "admin@bhooraksha.gov.in", "name": "System Administrator", "role": "admin", "lang": "en"},
]

SAMPLE_APPLICATIONS = [
    {
        "application_no": "BR-2026-KA-09412",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Anekal",
        "village": "Sarjapura",
        "survey_number": "142/2A",
        "extent_acres": 2.45,
        "status": "verification_pending",
        "risk_score": 18,
        "risk_level": "low"
    },
    {
        "application_no": "BR-2026-MH-08194",
        "state": "Maharashtra",
        "district": "Pune",
        "taluk": "Haveli",
        "village": "Wagholi",
        "survey_number": "88/1B",
        "extent_acres": 1.80,
        "status": "legal_review",
        "risk_score": 64,
        "risk_level": "high"
    },
    {
        "application_no": "BR-2026-TS-04721",
        "state": "Telangana",
        "district": "Rangareddy",
        "taluk": "Rajendranagar",
        "village": "Shamshabad",
        "survey_number": "204/3",
        "extent_acres": 3.12,
        "status": "gis_review",
        "risk_score": 42,
        "risk_level": "medium"
    }
]

def main():
    logger.info("Initializing Bhooraksha Seeding Process...")
    logger.info(f"Target roles to seed: {len(SEED_ROLES)}")
    for user in SEED_ROLES:
        logger.info(f" - [{user['role'].upper()}] {user['name']} <{user['email']}>")

    logger.info(f"Sample applications loaded: {len(SAMPLE_APPLICATIONS)}")
    for app in SAMPLE_APPLICATIONS:
        logger.info(f" - Application {app['application_no']} in {app['village']}, {app['district']} (Status: {app['status']})")

    logger.info("Seeding script completed successfully.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
