import { User } from '../types/user.types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Pujitha Chitturi',
    email: 'pujitha@smarteco.io',
    role: 'Admin',
    initials: 'P',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'usr-2',
    name: 'Facility Director',
    email: 'director@smarteco.io',
    role: 'Facility Manager',
    initials: 'FD',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-3',
    name: 'ESG Compliance Auditor',
    email: 'auditor@smarteco.io',
    role: 'Viewer',
    initials: 'EA',
    status: 'Invited',
    lastActive: '1 day ago',
  },
];
