import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Shield,
  Filter,
  CheckSquare,
  Square,
  MoreHorizontal,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useTranslation } from '../../i18n';
import { getRegionalConfig } from '@shared/i18n';
import { AdminUser, UserRole, UserStatus } from '../../api/types';
import { AddUserModal, EditUserModal } from '../../components/Modals/UserModals';
import toast from 'react-hot-toast';

export const UserManagementPage: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    batchToggleStatus,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.designation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || u.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;
      const matchesDistrict = selectedDistrict === 'all' || u.district === selectedDistrict;
      return matchesSearch && matchesRole && matchesStatus && matchesDistrict;
    });
  }, [users, searchQuery, selectedRole, selectedStatus, selectedDistrict]);

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchActivate = () => {
    if (selectedUserIds.length === 0) return;
    batchToggleStatus(selectedUserIds, 'active');
    toast.success(`Activated ${selectedUserIds.length} users.`);
    setSelectedUserIds([]);
  };

  const handleBatchSuspend = () => {
    if (selectedUserIds.length === 0) return;
    batchToggleStatus(selectedUserIds, 'suspended');
    toast.success(`Suspended ${selectedUserIds.length} users.`);
    setSelectedUserIds([]);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently revoke credentials for ${name}?`)) {
      deleteUser(id);
      toast.success(`User ${name} revoked.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/40 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Statewide Role-Based Access Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {t('admin.userManagement')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage multi-tenant accounts across 7 Bhooraksha service tiers (Citizen, DEO, Verifier, Legal, GIS, Tahsildar, and State CCLA Admin).
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.addUser')}</span>
        </button>
      </div>

      {/* Filter & Batch Actions Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by officer name, email, or designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Roles (7 Roles)</option>
            <option value="admin">System Admin</option>
            <option value="revenue">Tahsildar / Revenue</option>
            <option value="legal">Legal Officer</option>
            <option value="gis">GIS Specialist</option>
            <option value="verifier">Girdawar / Verifier</option>
            <option value="deo">Data Entry Operator</option>
            <option value="citizen">Citizen</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">{t('common.all')} Districts ({regionalConfig.state})</option>
            {regionalConfig.districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Selection Banner */}
        {selectedUserIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs animate-in fade-in">
            <span className="text-indigo-300 font-semibold">
              {selectedUserIds.length} user accounts selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchActivate}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                Set Active
              </button>
              <button
                onClick={handleBatchSuspend}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium"
              >
                Suspend Selected
              </button>
              <button
                onClick={() => setSelectedUserIds([])}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
                <th className="py-3 px-3 w-8">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold">Officer / User Name</th>
                <th className="py-3 px-3 font-semibold">Role Tier</th>
                <th className="py-3 px-3 font-semibold">Jurisdiction & Office</th>
                <th className="py-3 px-3 font-semibold">District</th>
                <th className="py-3 px-3 font-semibold">MFA</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleSelect(user.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {selectedUserIds.includes(user.id) ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-white text-xs">{user.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                    <div className="text-[10px] text-slate-500">{user.designation}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : user.role === 'revenue'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          : user.role === 'legal'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : user.role === 'gis'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-300">
                    <div className="text-xs truncate max-w-xs">{user.jurisdiction}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Last active: {user.lastActive}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-300 text-xs font-medium">
                    {user.district}
                  </td>

                  <td className="py-3 px-3">
                    {user.mfaEnabled ? (
                      <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        MFA ON
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
                        Standard
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : user.status === 'suspended'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {user.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserStatus(user.id);
                        }}
                        title={user.status === 'active' ? 'Suspend Access' : 'Activate Access'}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        {user.status === 'active' ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingUser(user);
                        }}
                        title="Edit User"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-200 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id, user.name);
                        }}
                        title="Revoke User"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={addUser}
      />

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={updateUser}
      />
    </div>
  );
};
