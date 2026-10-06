ERROR_MESSAGES = {
    "en": {
        "user_exists": "User with this email already exists.",
        "invalid_credentials": "Incorrect email or password.",
        "unauthorized": "Authentication required.",
        "forbidden": "You do not have permission to perform this action.",
        "otp_expired": "Invalid or expired OTP.",
    },
    "hi": {
        "user_exists": "इस ईमेल वाला उपयोगकर्ता पहले से मौजूद है।",
        "invalid_credentials": "गलत ईमेल या पासवर्ड।",
        "unauthorized": "प्रमाणीकरण आवश्यक है।",
        "forbidden": "आपके पास इस क्रिया की अनुमति नहीं है।",
        "otp_expired": "अमान्य या समाप्त हो चुका ओटीपी।",
    }
}

def get_message(key: str, lang: str = "en") -> str:
    lang_dict = ERROR_MESSAGES.get(lang, ERROR_MESSAGES["en"])
    return lang_dict.get(key, ERROR_MESSAGES["en"].get(key, key))
