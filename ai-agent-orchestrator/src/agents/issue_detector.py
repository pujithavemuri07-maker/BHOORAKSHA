"""
Issue Detector Agent for Bhooraksha Old Document Digitization.
Cross-references digitized archival records with modern ULPIN cadastre data
to identify ownership mismatches, survey renumbering, area variances, and timeline gaps.
"""
from typing import Dict, Any, List

class IssueDetector:
    """
    Compares historical digitized land records against live state revenue & ULPIN registry.
    Detects land fraud, historical disputes, undocumented successions, and survey changes.
    """

    def run(self, old_data: Dict[str, Any], modern_data: Dict[str, Any]) -> Dict[str, Any]:
        issues: List[Dict[str, Any]] = []

        old_owner = str(old_data.get('owner_name', '')).strip()
        modern_owner = str(modern_data.get('owner_name', '')).strip()

        # 1. Check Ownership Mismatch
        if old_owner and modern_owner:
            similarity = self._fuzzy_similarity(old_owner, modern_owner)
            if similarity < 70:
                issues.append({
                    'id': 'ISSUE-OWN-01',
                    'type': 'ownership_mismatch',
                    'severity': 'HIGH',
                    'old_value': old_owner,
                    'modern_value': modern_owner,
                    'description': f'Owner name differs significantly (Fuzzy Similarity: {similarity}%). Old: "{old_owner}" vs Modern: "{modern_owner}".',
                    'recommendation': 'Notify current owner + request clarification on historical transfer chain.',
                    'recommended_route': 'legal',
                })

        # 2. Check Survey Number Format & Sub-division Renumbering
        old_survey = str(old_data.get('survey_number', '')).strip()
        modern_survey = str(modern_data.get('survey_number', '')).strip()
        if old_survey and modern_survey and old_survey != modern_survey:
            issues.append({
                'id': 'ISSUE-SRV-02',
                'type': 'survey_number_change',
                'severity': 'MEDIUM',
                'old_value': old_survey,
                'modern_value': modern_survey,
                'description': f'Survey number format shifted from "{old_survey}" to "{modern_survey}". Likely renumbered during cadastral re-survey or sub-division.',
                'recommendation': 'Link with archival note and verify spatial boundary match with GIS desk.',
                'recommended_route': 'gis',
            })

        # 3. Check Area Variation
        old_area = self._parse_area(old_data.get('area') or old_data.get('extent_area'))
        modern_area = self._parse_area(modern_data.get('area') or modern_data.get('extent_area'))

        if old_area > 0 and modern_area > 0:
            diff_pct = abs(old_area - modern_area) / modern_area * 100.0
            if diff_pct > 5.0:
                severity = 'HIGH' if diff_pct >= 15.0 else 'MEDIUM'
                issues.append({
                    'id': 'ISSUE-AREA-03',
                    'type': 'area_mismatch',
                    'severity': severity,
                    'old_value': f'{old_area:.2f} Acres',
                    'modern_value': f'{modern_area:.2f} Acres',
                    'description': f'Cadastral parcel extent differs by {diff_pct:.1f}% ({old_area:.2f} vs {modern_area:.2f} Acres).',
                    'recommendation': 'Conduct DGPS electronic boundary survey with GIS officer.',
                    'recommended_route': 'gis',
                })
            elif diff_pct > 0.1:
                issues.append({
                    'id': 'ISSUE-AREA-04',
                    'type': 'area_minor_variation',
                    'severity': 'LOW',
                    'old_value': f'{old_area:.2f} Acres',
                    'modern_value': f'{modern_area:.2f} Acres',
                    'description': f'Area variation of {diff_pct:.2f}% is within acceptable survey tolerance (<5%).',
                    'recommendation': 'No action required. Safe for automated mutation linking.',
                    'recommended_route': None,
                })

        # 4. Check Date Anomalies
        old_date = str(old_data.get('registration_date', ''))
        modern_date = str(modern_data.get('registration_date', ''))
        if len(old_date) >= 4 and len(modern_date) >= 4:
            try:
                old_yr = int(old_date[:4])
                mod_yr = int(modern_date[:4])
                if old_yr > mod_yr:
                    issues.append({
                        'id': 'ISSUE-DATE-05',
                        'type': 'date_chronology_anomaly',
                        'severity': 'HIGH',
                        'old_value': old_date,
                        'modern_value': modern_date,
                        'description': f'Archival document registration year ({old_yr}) is chronologically AFTER modern record ({mod_yr}).',
                        'recommendation': 'Possible fraudulent back-dating or record tampering. Immediate escalation to Legal Officer.',
                        'recommended_route': 'legal',
                    })
            except Exception:
                pass

        # Compute Composite Risk Score (0 - 100)
        risk_score = 0
        for issue in issues:
            if issue['severity'] == 'HIGH':
                risk_score += 35
            elif issue['severity'] == 'MEDIUM':
                risk_score += 15
            elif issue['severity'] == 'LOW':
                risk_score += 5

        risk_score = min(max(risk_score, 10), 95)
        risk_category = 'HIGH' if risk_score >= 70 else ('MEDIUM' if risk_score >= 40 else 'LOW')

        return {
            'issues': issues,
            'issue_count': len(issues),
            'high_severity_count': sum(1 for i in issues if i['severity'] == 'HIGH'),
            'risk_score': risk_score,
            'risk_category': risk_category,
            'recommended_routing': self._get_primary_route(issues),
        }

    def _fuzzy_similarity(self, s1: str, s2: str) -> int:
        """Calculates basic Levenshtein ratio or rapidfuzz match."""
        try:
            from rapidfuzz import fuzz
            return int(fuzz.ratio(s1.lower(), s2.lower()))
        except Exception:
            # Simple fallback similarity
            s1_clean = ''.join(c for c in s1.lower() if c.isalnum())
            s2_clean = ''.join(c for c in s2.lower() if c.isalnum())
            if s1_clean == s2_clean:
                return 100
            common = set(s1_clean).intersection(set(s2_clean))
            total = set(s1_clean).union(set(s2_clean))
            return int((len(common) / max(len(total), 1)) * 100)

    def _parse_area(self, val: Any) -> float:
        """Extracts float number from area string or numeric value."""
        if val is None:
            return 0.0
        if isinstance(val, (int, float)):
            return float(val)
        try:
            parts = str(val).replace('Acres', '').replace('Gunthas', '').strip().split()
            return float(parts[0])
        except Exception:
            return 0.0

    def _get_primary_route(self, issues: List[Dict[str, Any]]) -> str:
        for i in issues:
            if i['severity'] == 'HIGH' and i.get('recommended_route'):
                return i['recommended_route']
        for i in issues:
            if i.get('recommended_route'):
                return i['recommended_route']
        return 'verifier'
