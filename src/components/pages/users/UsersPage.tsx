import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { Users, UserPlus, Mail, Shield } from 'lucide-react';
import { UserRole } from '../../../types/user.types';

export const UsersPage: React.FC = () => {
  const { users, addUser } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Viewer');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ name, email, role });
    setName('');
    setEmail('');
    setRole('Viewer');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Access Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization members, facility leads, and environmental audit roles.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite User
        </Button>
      </div>

      {/* User Table */}
      <Card className="overflow-hidden border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-[#217C70] font-bold flex items-center justify-center text-xs">
                        {user.initials}
                      </div>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{user.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                      <Shield className="w-3 h-3 text-[#217C70]" />
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.status === 'Active' ? 'good' : 'warning'} size="sm">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New User"
        subtitle="Grant role access to your SmartEco monitoring organization"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleInviteSubmit}>
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. alex@smarteco.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#217C70] focus:outline-none"
            >
              <option value="Admin">Admin (Full Control)</option>
              <option value="Facility Manager">Facility Manager (Edit Rooms & Thresholds)</option>
              <option value="Viewer">Viewer (Read-Only Access)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
