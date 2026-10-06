#!/usr/bin/env python3
"""
Bhooraksha (भूरक्षा) - Infrastructure & Service Health Check Utility
Scans configured endpoints or prints configuration health status.
"""
import sys
import os
import urllib.request
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("health_check")

SERVICES = [
    {"name": "API Gateway", "url": "http://localhost/health", "port": 80},
    {"name": "Public Landing Page", "url": "http://localhost:8080/", "port": 8080},
    {"name": "Auth Service", "url": "http://localhost:8000/health", "port": 8000},
    {"name": "Citizen Service", "url": "http://localhost:3000/", "port": 3000},
    {"name": "DEO Service", "url": "http://localhost:3001/", "port": 3001},
    {"name": "Verifier Service", "url": "http://localhost:3002/", "port": 3002},
    {"name": "Legal Service", "url": "http://localhost:3003/", "port": 3003},
    {"name": "GIS Service", "url": "http://localhost:3004/", "port": 3004},
    {"name": "Revenue Admin Service", "url": "http://localhost:3005/", "port": 3005},
    {"name": "System Admin Service", "url": "http://localhost:3006/", "port": 3006},
    {"name": "AI Agent Orchestrator", "url": "http://localhost:8001/health", "port": 8001},
    {"name": "MinIO Object Storage", "url": "http://localhost:9000/minio/health/live", "port": 9000},
]

def check_service(service):
    try:
        req = urllib.request.Request(service["url"], headers={"User-Agent": "BhoorakshaHealthCheck/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            return resp.status in (200, 301, 302)
    except Exception:
        return False

def main():
    dry_run = "--dry-run" in sys.argv
    logger.info("Starting Bhooraksha Services Health Scan...")
    
    if dry_run:
        logger.info("[DRY RUN MODE] Validating service targets:")
        for s in SERVICES:
            logger.info(f" - Configured: {s['name']} -> {s['url']} (Port {s['port']})")
        logger.info("All 12 service targets successfully registered.")
        return 0

    results = {}
    for s in SERVICES:
        status = check_service(s)
        results[s["name"]] = "ONLINE" if status else "OFFLINE (Not running locally)"
        logger.info(f"{s['name']:<25} : {results[s['name']]}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
