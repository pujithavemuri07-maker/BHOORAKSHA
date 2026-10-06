# -*- coding: utf-8 -*-
"""
Inject extra admin terms into phraseDictionary.ts and domainLocales.ts across all 18 languages.
"""
import re
import sys

EXTRA_TERMS = {
    "Navigation Menu": {
        "hi": "नेविगेशन मेनू",
        "te": "నావిగేషన్ మెనూ",
        "ta": "வழிசெலுத்தல் மெனு",
        "bn": "নেভিগেশন মেনু",
        "mr": "नेव्हिगेशन मेनू",
        "gu": "નેવિગેશન મેનૂ",
        "kn": "ನ್ಯಾವಿಗೇಷನ್ ಮೆನು",
        "ml": "നാവിഗേഷൻ മെനു",
        "or": "ନେଭିଗେସନ୍ ମେନୁ",
        "pa": "ਨੇਵੀਗੇਸ਼ਨ ਮੀਨੂ",
        "as": "নেভিগেচন মেনু",
        "ur": "نیویگیشن مینو",
        "sa": "सञ्चरण-सूची",
        "kok": "नेव्हिगेशन मेनू",
        "mai": "नेविगेशन मेनू",
        "ks": "نیویگیشن مینو",
        "ne": "नेभिगेसन मेनु"
    },
    "11 Services Up": {
        "hi": "11 सेवाएं सक्रिय",
        "te": "11 సేవలు అందుబాటులో ఉన్నాయి",
        "ta": "11 சேவைகள் இயங்குகின்றன",
        "bn": "১১টি পরিষেবা সক্রিয়",
        "mr": "११ सेवा कार्यरत",
        "gu": "૧૧ સેવાઓ સક્રિય",
        "kn": "11 ಸೇವೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ",
        "ml": "11 സേവനങ്ങൾ സജീവം",
        "or": "୧୧ଟି ସେବା ସକ୍ରିୟ",
        "pa": "11 ਸੇਵਾਵਾਂ ਚਾਲੂ",
        "as": "১১টা সেৱা সক্ৰিয়",
        "ur": "11 سروسز فعال",
        "sa": "एकादश-सेवाः सक्रियाः",
        "kok": "११ सेवा चालू",
        "mai": "11 सेवा सक्रिय",
        "ks": "11 سروسز چالو",
        "ne": "११ सेवाहरू सक्रिय"
    },
    "SHA-256 Ledger: ACTIVE": {
        "hi": "SHA-256 लेज़र: सक्रिय",
        "te": "SHA-256 లెడ్జర్: సక్రియం",
        "ta": "SHA-256 லெட்ஜர்: செயலில்",
        "bn": "SHA-256 লেজার: সক্রিয়",
        "mr": "SHA-256 लेजर: सक्रिय",
        "gu": "SHA-256 ખાતાવહી: સક્રિય",
        "kn": "SHA-256 ಲೆಡ್ಜರ್: ಸಕ್ರಿಯ",
        "ml": "SHA-256 ലെഡ്ജർ: സജീവം",
        "or": "SHA-256 ଲେଜର: ସକ୍ରିୟ",
        "pa": "SHA-256 ਲੇਜ਼ਰ: ਸਰਗਰਮ",
        "as": "SHA-256 লেজাৰ: সক্ৰিয়",
        "ur": "SHA-256 لیجر: فعال",
        "sa": "SHA-256 लेखावही: सक्रिया",
        "kok": "SHA-256 लेजर: चालू",
        "mai": "SHA-256 लेजर: सक्रिय",
        "ks": "SHA-256 لیجر: سرگرم",
        "ne": "SHA-256 खाता: सक्रिय"
    },
    "Cluster Status:": {
        "hi": "क्लस्टर स्थिति:",
        "te": "క్లస్టర్ స్థితి:",
        "ta": "கிளஸ்டர் நிலை:",
        "bn": "ক্লাস্টার স্থিতি:",
        "mr": "क्लस्टर स्थिती:",
        "gu": "ક્લસ્ટર સ્થિતિ:",
        "kn": "ಕ್ಲಸ್ಟರ್ ಸ್ಥಿತಿ:",
        "ml": "ക്ലസ്റ്റർ നില:",
        "or": "କ୍ଲଷ୍ଟର ସ୍ଥିତି:",
        "pa": "ਕਲੱਸਟਰ ਸਥਿਤੀ:",
        "as": "ক্লাষ্টাৰ স্থিতি:",
        "ur": "کلسٹر کی حالت:",
        "sa": "समूह-स्थितिः:",
        "kok": "क्लस्टर स्थिती:",
        "mai": "क्लस्टर स्थिति:",
        "ks": "کلسٹر حالت:",
        "ne": "क्लस्टर स्थिति:"
    },
    "Cluster Status": {
        "hi": "क्लस्टर स्थिति",
        "te": "క్లస్టర్ స్థితి",
        "ta": "கிளஸ்டர் நிலை",
        "bn": "ক্লাস্টার স্থিতি",
        "mr": "क्लस्टर स्थिती",
        "gu": "ક્લસ્ટર સ્થિતિ",
        "kn": "ಕ್ಲಸ್ಟರ್ ಸ್ಥಿತಿ",
        "ml": "ക്ലസ്റ്റർ നില",
        "or": "କ୍ଲଷ୍ଟର ସ୍ଥିତି",
        "pa": "ਕਲੱਸਟਰ ਸਥਿਤੀ",
        "as": "ক্লাষ্টাৰ স্থিতি",
        "ur": "کلسٹر کی حالت",
        "sa": "समूह-स्थितिः",
        "kok": "क्लस्टर स्थिती",
        "mai": "क्लस्टर स्थिति",
        "ks": "کلسٹر حالت",
        "ne": "क्लस्टर स्थिति"
    },
    "Status:": {
        "hi": "स्थिति:",
        "te": "స్థితి:",
        "ta": "நிலை:",
        "bn": "স্থিতি:",
        "mr": "स्थिती:",
        "gu": "સ્થિતિ:",
        "kn": "ಸ್ಥಿತಿ:",
        "ml": "നില:",
        "or": "ସ୍ଥିତି:",
        "pa": "ਸਥਿਤੀ:",
        "as": "স্থিতি:",
        "ur": "حالت:",
        "sa": "स्थितिः:",
        "kok": "स्थिती:",
        "mai": "स्थिति:",
        "ks": "حالت:",
        "ne": "स्थिति:"
    },
    "Audit": {
        "hi": "ऑडिट",
        "te": "ఆడిట్",
        "ta": "தணிக்கை",
        "bn": "অডিট",
        "mr": "ऑडिट",
        "gu": "ઓડિટ",
        "kn": "ಆಡಿಟ್",
        "ml": "ഓഡിറ്റ്",
        "or": "ଅଡିଟ୍",
        "pa": "ਆਡਿਟ",
        "as": "অডিট",
        "ur": "آڈٹ",
        "sa": "लेखापरीक्षा",
        "kok": "ऑडिट",
        "mai": "ऑडिट",
        "ks": "آڈٹ",
        "ne": "लेखापरीक्षण"
    },
    "apps": {
        "hi": "आवेदन",
        "te": "దరఖాస్తులు",
        "ta": "விண்ணப்பங்கள்",
        "bn": "আবেদন",
        "mr": "अर्ज",
        "gu": "અરજીઓ",
        "kn": "ಅರ್ಜಿಗಳು",
        "ml": "അപേക്ഷകൾ",
        "or": "ଆବେଦନ",
        "pa": "ਅਰਜ਼ੀਆਂ",
        "as": "আবেদন",
        "ur": "درخواستیں",
        "sa": "आवेदनानि",
        "kok": "अर्ज",
        "mai": "आवेदन",
        "ks": "درخواستہٕ",
        "ne": "आवेदनहरू"
    },
    "ratified": {
        "hi": "अनुसमर्थित",
        "te": "ధృవీకరించబడింది",
        "ta": "அங்கீகரிக்கப்பட்டது",
        "bn": "অনুমোদিত",
        "mr": "मंजूर",
        "gu": "બહાલ",
        "kn": "ಅನುಮೋದಿಸಲಾಗಿದೆ",
        "ml": "അംഗീകരിച്ചു",
        "or": "ଅନୁମୋଦିତ",
        "pa": "ਪ੍ਰਵਾਨਿਤ",
        "as": "অনুমোদিত",
        "ur": "منظور شدہ",
        "sa": "अनुसमर्थितम्",
        "kok": "मान्य",
        "mai": "संपुष्ट",
        "ks": "منظور گٔمٕژ",
        "ne": "अनुमोदित"
    },
    "Logged out successfully": {
        "hi": "सफलतापूर्वक लॉग आउट किया गया",
        "te": "విజయవంతంగా లాగ్ అవుట్ అయ్యారు",
        "ta": "வெற்றிகரமாக வெளியேறியது",
        "bn": "সফলভাবে লগ আউট হয়েছে",
        "mr": "यशस्वीरित्या लॉग आउट केले",
        "gu": "સફળતાપૂર્વક લૉગ આઉટ થયા",
        "kn": "ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ ಔಟ್ ಮಾಡಲಾಗಿದೆ",
        "ml": "വിജയകരമായി ലോഗ് ഔട്ട് ചെയ്തു",
        "or": "ସଫଳତାର ସହିତ ଲଗ୍ ଆଉଟ୍ ହୋଇଛି",
        "pa": "ਸਫਲਤਾਪੂਰਵਕ ਲੌਗ ਆਉਟ ਕੀਤਾ ਗਿਆ",
        "as": "সফলভাৱে লগ আউট কৰা হৈছে",
        "ur": "کامیابی سے لاگ آؤٹ ہو گیا",
        "sa": "सफलतापूर्वकं बहिर्गमः कृतः",
        "kok": "यशस्वीपणान लॉग आऊट जालें",
        "mai": "सफलतापूर्वक लॉग आउट भेल",
        "ks": "کامیابی سان لاگ آؤٹ گۆو",
        "ne": "सफलतापूर्वक लग आउट भयो"
    }
}

ALIASES = {
    "admin.navMenu": "Navigation Menu",
    "admin.clusterStatus": "Cluster Status:",
    "admin.servicesUp": "11 Services Up",
    "admin.sha256Active": "SHA-256 Ledger: ACTIVE",
    "admin.auditInspect": "Audit",
}

for k, v in ALIASES.items():
    if v in EXTRA_TERMS:
        EXTRA_TERMS[k] = EXTRA_TERMS[v]

langs = ['hi', 'te', 'ta', 'bn', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur', 'sa', 'kok', 'mai', 'ks', 'ne']

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for lang in langs:
        lang_header = f'"{lang}": {{\n'
        idx = content.find(lang_header)
        if idx != -1:
            next_header = content.find('\n  "', idx + len(lang_header))
            block_end = next_header if next_header != -1 else len(content)
            block = content[idx:block_end]
            
            insert_lines = []
            for term, trans in EXTRA_TERMS.items():
                val = trans.get(lang, "")
                if not val:
                    continue
                escaped_term = re.escape(term)
                if f'"{term}":' in block:
                    block = re.sub(rf'"{escaped_term}":\s*"[^"]*"', f'"{term}": "{val}"', block)
                else:
                    insert_lines.append(f'    "{term}": "{val}",')
            
            if insert_lines:
                block = block[:len(lang_header)] + "\n".join(insert_lines) + "\n" + block[len(lang_header):]
                
            content = content[:idx] + block + content[block_end:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

update_file('shared/i18n/phraseDictionary.ts')
update_file('shared/i18n/domainLocales.ts')
print("All extra terms injected successfully!")
