# -*- coding: utf-8 -*-
"""
Expands Bhooraksha phrase dictionary and domain locales to 18 languages:
1. en (English)
2. hi (Hindi)
3. te (Telugu)
4. ta (Tamil)
5. bn (Bengali)
6. mr (Marathi)
7. gu (Gujarati)
8. kn (Kannada)
9. ml (Malayalam)
10. or (Odia)
11. pa (Punjabi)
12. as (Assamese)
13. ur (Urdu - RTL)
14. sa (Sanskrit)
15. kok (Konkani)
16. mai (Maithili)
17. ks (Kashmiri - RTL)
18. ne (Nepali)
"""

import os
import json
import re

print("Starting 18-language dictionary expansion...")

# Load existing phrase dictionary by evaluating or parsing
dict_file = os.path.abspath("shared/i18n/phraseDictionary.ts")
with open(dict_file, "r", encoding="utf-8") as f:
    content = f.read()

# Parse PHRASE_DICTIONARY using json-like regex or extraction
# We can extract the JS object by replacing export const PHRASE_DICTIONARY: Record<string, Record<string, string>> = 
start_idx = content.find("export const PHRASE_DICTIONARY")
brace_start = content.find("{", start_idx)
brace_end = content.rfind("};")

json_str = content[brace_start:brace_end+1]
# Fix trailing commas if any
json_str = re.sub(r",\s*([\]}])", r"\1", json_str)
existing_dict = json.loads(json_str)

print(f"Loaded existing languages: {list(existing_dict.keys())}")
all_keys = list(existing_dict.get("hi", {}).keys())
print(f"Total keys in hi: {len(all_keys)}")

# Write test output
print("Step 1 done")
