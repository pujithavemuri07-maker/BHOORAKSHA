import os

file_path = "deo-service/src/pages/Dashboard/index.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    "Shift Activity & Throughput": "{t('deoDashboard.shiftActivity')}",
    "Live summary of verified dossiers in current session": "{t('deoDashboard.liveSummary')}",
    "Forwarded to Verifier": "{t('deoDashboard.forwardedVerifier')}",
    "Exceptions Corrected": "{t('deoDashboard.exceptionsCorrected')}",
    "Applications<": "{t('deoDashboard.applications')}<",
    "Dossiers<": "{t('deoDashboard.dossiers')}<"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Footer in index.tsx updated")
