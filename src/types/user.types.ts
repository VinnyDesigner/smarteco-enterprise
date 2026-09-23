export type UserRole = 'Admin' | 'Facility Manager' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  initials: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}
