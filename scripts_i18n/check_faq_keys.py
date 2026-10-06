# -*- coding: utf-8 -*-
with open('shared/i18n/phraseDictionary.ts', 'r', encoding='utf-8') as f:
    text = f.read()

keys = [
    'Citizen Services',
    'Assistance & Account',
    'Prototype Network Active',
    'Govt Network Live',
    'How long does the AI verification process take?',
    'The automated AI pipeline',
    'What documents are eligible for upload?',
    'What should I do if my document is flagged with "Correction Required"?',
    'How does the "Share with Bank" feature work?',
    'Is Bhooraksha available in regional Indian languages?',
    'In 13 Regional Languages',
    'In 18 Regional Languages'
]

for k in keys:
    print(f"{k} -> {k in text}")
