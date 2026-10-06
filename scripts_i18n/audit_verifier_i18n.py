# -*- coding: utf-8 -*-
import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('shared/i18n/phraseDictionary.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find occurrences of 'Verification History'
for m in re.finditer(r'^\s*"Verification History":\s*"([^"]+)"', content, re.MULTILINE):
    print("Found line:", m.group(0).strip())

# Find occurrences of 'Approval Rate'
for m in re.finditer(r'^\s*"Approval Rate":\s*"([^"]+)"', content, re.MULTILINE):
    print("Approval Rate:", m.group(0).strip())
