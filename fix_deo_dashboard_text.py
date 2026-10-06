import os

file_path = "deo-service/src/pages/Dashboard/index.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    "<span>NEEDS DEO REVIEW</span>": "<span>{t('deoDashboard.needsDeoReview')}</span>",
    "<span>REVIEW QUEUE</span>": "<span>{t('deoDashboard.reviewQueue')}</span>",
    "<span>READY TO FORWARD</span>": "<span>{t('deoDashboard.readyToForward')}</span>",
    "<span>HISTORY</span>": "<span>{t('deoDashboard.history')}</span>",
    "<span>AI Extracts Data Automatically • DEO Verifies & Corrects Exceptions</span>": "<span>{t('deoDashboard.aiExtractsData')}</span>",
    "Statutory Classification & Workload Ordering": "{t('deoDashboard.statutoryClassification')}",
    "Order: Missing Documents → Needs Attention → Ready to Forward": "{t('deoDashboard.orderMissingDocs')}",
    "LOW RISK • ROUTINE": "{t('deoDashboard.lowRisk')}",
    "READY TO FORWARD</p>": "{t('deoDashboard.readyToForward')}</p>",
    "0 significant exceptions. Quick confirmation & forward to Verifier.": "{t('deoDashboard.zeroExceptions')}",
    "MEDIUM RISK": "{t('deoDashboard.mediumRisk')}",
    "NEEDS DEO REVIEW</p>": "{t('deoDashboard.needsDeoReview')}</p>",
    "Spelling or date variation. DEO reviews source doc & corrects exception.": "{t('deoDashboard.spellingDateVariation')}",
    "HIGH RISK • ACTION": "{t('deoDashboard.highRisk')}",
    "MISSING DOCUMENTS</p>": "{t('deoDashboard.missingDocuments')}</p>",
    "Required registered deed or identity document missing. Issue notice.": "{t('deoDashboard.requiredDeedMissing')}",
    "DEO Workload Queue": "{t('deoDashboard.deoWorkloadQueue')}",
    "'All Applications'": "t('deoDashboard.allApplications')",
    "'AI Processed'": "t('deoDashboard.aiProcessed')",
    "'Needs DEO Review'": "t('deoDashboard.needsDeoReview')",
    "'Missing Documents'": "t('deoDashboard.missingDocuments')",
    "'Ready to Forward'": "t('deoDashboard.readyToForward')",
    "'Returned for Correction'": "t('deoDashboard.returnedForCorrection')",
    "'API Fallback'": "t('deoDashboard.apiFallback')"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Dashboard strings replaced.")
