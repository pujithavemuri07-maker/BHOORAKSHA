import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useLegalStore } from '../../store/legalStore';

// Subcomponents
import { ProfileHeader } from './ProfileHeader';
import { OfficialIdentitySection } from './OfficialIdentitySection';
import { DepartmentPostingSection } from './DepartmentPostingSection';
import { LegalCredentialsSection } from './LegalCredentialsSection';
import { JurisdictionSection } from './JurisdictionSection';
import { RoleResponsibilitiesSection } from './RoleResponsibilitiesSection';
import { DecisionAuthoritySection } from './DecisionAuthoritySection';
import { DigitalSignatureSection } from './DigitalSignatureSection';
import { OfficialContactSection } from './OfficialContactSection';
import { WorkSummarySection } from './WorkSummarySection';
import { RecentActivitySection } from './RecentActivitySection';
import { AccountSecuritySection } from './AccountSecuritySection';

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const applications = useLegalStore((s) => s.applications);
  const history = useLegalStore((s) => s.history);

  const handleUpdateContact = (data: { email: string; phone: string; office: string }) => {
    updateUser(data);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. PROFILE HEADER */}
      <ProfileHeader user={user} />

      {/* 2 & 3. OFFICIAL IDENTITY & DEPARTMENT POSTING (2-column layout on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OfficialIdentitySection user={user} />
        <DepartmentPostingSection user={user} />
      </div>

      {/* 4. PROFESSIONAL & LEGAL CREDENTIALS */}
      <LegalCredentialsSection user={user} />

      {/* 5. OFFICIAL JURISDICTION */}
      <JurisdictionSection user={user} />

      {/* 6 & 7. ROLE & RESPONSIBILITIES + DECISION & AUTHORIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleResponsibilitiesSection />
        <DecisionAuthoritySection />
      </div>

      {/* 8. DIGITAL SIGNATURE & ACCOUNT VERIFICATION */}
      <DigitalSignatureSection />

      {/* 9. OFFICIAL CONTACT INFORMATION */}
      <OfficialContactSection user={user} onUpdateContact={handleUpdateContact} />

      {/* 10. LEGAL WORK SUMMARY */}
      <WorkSummarySection applications={applications} history={history} />

      {/* 11 & 12. RECENT OFFICIAL ACTIVITY + ACCOUNT SECURITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivitySection history={history} />
        <AccountSecuritySection />
      </div>
    </div>
  );
};

export default ProfilePage;
