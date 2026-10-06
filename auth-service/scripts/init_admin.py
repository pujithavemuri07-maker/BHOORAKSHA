#!/usr/bin/env python3
"""
Initialize default super-admin user for Bhooraksha.
"""
import sys
import logging
from src.database import SessionLocal
from src.models.user import User
from src.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("init_admin")

def init_admin():
    db = SessionLocal()
    try:
        admin_email = "admin@bhooraksha.gov.in"
        existing = db.query(User).filter(User.email == admin_email).first()
        if existing:
            logger.info("Default Admin user already exists.")
            return

        admin = User(
            email=admin_email,
            full_name="Chief Commissioner Land Administration (CCLA)",
            role="admin",
            password_hash=get_password_hash("Password@123"),
            is_active=True,
            is_verified=True,
            preferred_language="en",
        )
        db.add(admin)
        db.commit()
        logger.info("Super-admin user created successfully: admin@bhooraksha.gov.in")
    except Exception as e:
        logger.error(f"Error initializing admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_admin()
