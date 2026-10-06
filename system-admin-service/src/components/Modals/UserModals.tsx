import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, Mail, Phone, Building, MapPin } from 'lucide-react';
import { AdminUser, UserRole, UserStatus } from '../../api/types';
import { useTranslation } from '../../i18n';
import { getRegionalConfig } from '@shared/i18n';
import toast from 'react-hot-toast';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastActive'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'deo' as UserRole,
    designation: '',
    department: '',
    district: regionalConfig.districts[0] || 'Default District',
    jurisdiction: '',
    status: 'active' as UserStatus,
    mfaEnabled: true,
  });

  useEffect(() => {
    if (regionalConfig.districts.length > 0) {
      setFormData((prev) => ({
        ...prev,
        district: regionalConfig.districts[0],
      }));
    }
  }, [currentLanguage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please provide name and email address.');
      return;
    }
    onAdd(formData);
    toast.success(`User ${formData.name} successfully registered.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t('userModal.title')}</h3>
              <p className="text-xs text-slate-400">{t('userModal.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.fullName')}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={regionalConfig.namePlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.officialEmail')}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={regionalConfig.emailDomain}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.mobile')}</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 94400 XXXXX"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.rbacRole')}</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="deo">Data Entry Operator (DEO - Port 3001)</option>
                <option value="verifier">Girdawar / Verifier (Port 3002)</option>
                <option value="legal">Legal Officer (Port 3003)</option>
                <option value="gis">GIS Specialist (Port 3004)</option>
                <option value="revenue">Tahsildar / Revenue Admin (Port 3005)</option>
                <option value="admin">CCLA System Administrator (Port 3006)</option>
                <option value="citizen">Citizen Public User (Port 3000)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.designation')}</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Senior Revenue Inspector"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.district')} ({regionalConfig.state})</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                {regionalConfig.districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.jurisdiction')}</label>
            <input
              type="text"
              value={formData.jurisdiction}
              onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              placeholder={regionalConfig.jurisdictionPlaceholder}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="mfa"
              checked={formData.mfaEnabled}
              onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
            />
            <label htmlFor="mfa" className="text-slate-300 font-semibold cursor-pointer">
              {t('userModal.enforceMfa')}
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-600/30"
            >
              {t('userModal.submitAdd')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditUserModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<AdminUser>) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);

  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('deo');
  const [status, setStatus] = useState<UserStatus>('active');
  const [designation, setDesignation] = useState('');
  const [district, setDistrict] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole(user.role || 'deo');
      setStatus(user.status || 'active');
      setDesignation(user.designation || '');
      setDistrict(user.district || regionalConfig.districts[0] || '');
      setJurisdiction(user.jurisdiction || '');
    }
  }, [user, currentLanguage]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user.id, {
      name,
      role,
      status,
      designation,
      district,
      jurisdiction,
    });
    toast.success(`User ${name} credentials updated.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div>
            <h3 className="text-base font-bold text-white">{t('userModal.editTitle')}</h3>
            <p className="text-xs text-slate-400 font-mono">{user.email} • ID: {user.id}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.fullName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.rbacRole')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="deo">Data Entry Operator (DEO)</option>
                <option value="verifier">Girdawar / Verifier</option>
                <option value="legal">Legal Officer</option>
                <option value="gis">GIS Specialist</option>
                <option value="revenue">Revenue Admin</option>
                <option value="admin">System Admin</option>
                <option value="citizen">Citizen</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('common.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.designation')}</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.district')} ({regionalConfig.state})</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                {regionalConfig.districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">{t('userModal.jurisdiction')}</label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
            >
              {t('userModal.submitSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

