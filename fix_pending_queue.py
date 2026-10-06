import os

file_path = "deo-service/src/pages/Dashboard/PendingQueue.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "useTranslation" not in content:
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from '../../i18n';")
    content = content.replace("export const PendingQueue: React.FC<PendingQueueProps> = ({ applications }) => {", "export const PendingQueue: React.FC<PendingQueueProps> = ({ applications }) => {\n  const { t } = useTranslation();")

replacements = {
    "No applications matching selected filter in your exception queue.": "{t('deoDashboard.noApplications')}",
    "Application ID": "{t('deoDashboard.applicationId')}",
    "Citizen & Document": "{t('deoDashboard.citizenDocument')}",
    "Survey & Location": "{t('deoDashboard.surveyLocation')}",
    "Review Priority": "{t('deoDashboard.reviewPriority')}",
    ">Priority<": ">{t('deoDashboard.priority')}<",
    ">Status<": ">{t('deoDashboard.status')}<",
    ">Action<": ">{t('deoDashboard.action')}<",
    "<span>Manual Entry</span>": "<span>{t('deoDashboard.manualEntry')}</span>",
    "<span>Review</span>": "<span>{t('deoDashboard.reviewAction')}</span>"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("PendingQueue updated")
