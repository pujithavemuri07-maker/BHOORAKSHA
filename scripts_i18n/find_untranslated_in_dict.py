# -*- coding: utf-8 -*-
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('shared/i18n/phraseDictionary.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse dictionaries per language
langs = ['hi', 'te', 'ta', 'bn', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur', 'sa', 'kok', 'mai', 'ks', 'ne']

for lang in ['te', 'hi', 'ta', 'ur']:
    # extract block for lang
    pattern = rf"(\"{lang}\"|'{lang}'):\s*\{{([^}}]+)\}}"
    # Wait, the dictionary is very large, let's find lines between lang: { and };
    m = re.search(rf"(?:['\"]{lang}['\"])\s*:\s*\{{", content)
    if not m:
        print(f"Could not find start of {lang}")
        continue
    start = m.end()
    # find matching brace or next lang key
    next_m = re.search(r"\n  (?:['\"][a-z]{2,3}['\"])\s*:\s*\{", content[start:])
    block_end = start + next_m.start() if next_m else len(content)
    block = content[start:block_end]
    
    # check entries where value contains [a-zA-Z]
    # Note: acronyms like SHA-256, DEO, GIS, AI, ULPIN, SRO, PDF are okay, but full English words are not.
    print(f"\n--- Checking language: {lang} ---")
    bad_count = 0
    for line in block.split('\n'):
        pair = re.search(r'"([^"]+)":\s*"([^"]+)"', line)
        if pair:
            key, val = pair.group(1), pair.group(2)
            # Find English words of 3+ letters that are not standard acronyms
            words = re.findall(r'[a-zA-Z]{3,}', val)
            # allowed acronyms
            allowed = {'SHA', 'DEO', 'GIS', 'ULPIN', 'SRO', 'PDF', 'API', 'GPS', 'BHOORAKSHA', 'Bhooraksha', 'Govt', 'URL'}
            bad_words = [w for w in words if w not in allowed]
            if bad_words:
                bad_count += 1
                if bad_count <= 20:
                    print(f"  [{key}] -> '{val}' (flagged: {bad_words[:3]})")
    print(f"Total flagged entries in {lang}: {bad_count}")
