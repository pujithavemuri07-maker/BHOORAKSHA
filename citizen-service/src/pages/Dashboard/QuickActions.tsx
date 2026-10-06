import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, FileSearch, Award, Building, HelpCircle } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const QuickActions: React.FC = () => {
  const { t } = useTranslation();

  const actions = [
    {
      title: t('Upload Land Document'),
      desc: t('Verify registered sale deeds, passbooks, and certificates with AI'),
      icon: UploadCloud,
      href: '/citizen/upload',
      color: 'from-emerald-600 to-teal-600',
      tag: t('Instant AI Check'),
    },
    {
      title: t('Track All Applications'),
      desc: t('Real-time progress, inspection status, and pending approvals'),
      icon: FileSearch,
      href: '/citizen/applications',
      color: 'from-blue-600 to-indigo-600',
      tag: t('Live Status'),
    },
    {
      title: t('Download E-Certificates'),
      desc: t('Access digitally signed Tehsildar mutation sanction orders'),
      icon: Award,
      href: '/citizen/applications?status=APPROVED',
      color: 'from-purple-600 to-pink-600',
      tag: t('Tamper-Proof'),
    },
    {
      title: t('Share with Bank'),
      desc: t('Generate secure, 7-day tokenized verification link for home loan approval'),
      icon: Building,
      href: '/citizen/applications',
      color: 'from-amber-600 to-orange-600',
      tag: t('Fast Loan Clearance'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, i) => {
        const Icon = act.icon;
        return (
          <Link
            key={i}
            to={act.href}
            className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-md transition-all hover:scale-[1.01] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {act.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>{t('Open Service')} &rarr;</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
