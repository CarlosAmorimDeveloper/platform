export type UserRole = 'admin' | 'standard';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  workspaceId: string;
}
