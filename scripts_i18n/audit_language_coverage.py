#!/usr/bin/env python3
"""Audit language coverage across all portal i18n files."""
import os, re, sys

ALL_LANGS = ['en','hi','te','ta','bn','mr','gu','kn','ml','or','pa','as','ur','sa','kok','mai','ks','ne']

services = {
    'Revenue Admin': 'revenue-admin-service/src/i18n/locales.ts',
    'System Admin': 'system-admin-service/src/i18n/locales.ts',
}

for svc, path in services.items():
    try:
        content = open(path, encoding='utf-8').read()
    except FileNotFoundError:
        print(f"{svc}: FILE NOT FOUND at {path}")
        continue
    found = []
    missing = []
    for lang in ALL_LANGS:
        # Match top-level language key like  "en": {
        pattern = r'"' + re.escape(lang) + r'":\s*\{'
        if re.search(pattern, content):
            found.append(lang)
        else:
            missing.append(lang)
    print(f"\n{svc}:")
    print(f"  Found ({len(found)}): {found}")
    print(f"  Missing ({len(missing)}): {missing}")

print("\n\nShared i18n locales folder:")
locales_dir = 'shared/i18n/locales'
dirs = sorted(os.listdir(locales_dir)) if os.path.isdir(locales_dir) else []
print(f"  Directories: {dirs}")
print(f"  Count: {len(dirs)}")
