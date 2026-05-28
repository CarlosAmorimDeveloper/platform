import type { User, UserRole } from './user';

describe('User domain', () => {
  it('accepts a valid User object at runtime', () => {
    const user: User = { uid: 'u1', email: 'a@b.com', name: 'Alice', role: 'admin' };
    expect(user.uid).toBe('u1');
    expect(user.email).toBe('a@b.com');
    expect(user.name).toBe('Alice');
    expect(user.role).toBe('admin');
  });

  it('accepts both valid UserRole values', () => {
    const admin: UserRole = 'admin';
    const standard: UserRole = 'standard';
    expect(admin).toBe('admin');
    expect(standard).toBe('standard');
  });
});
