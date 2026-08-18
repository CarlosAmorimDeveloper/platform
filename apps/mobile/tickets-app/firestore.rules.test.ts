import fs from 'fs';
import path from 'path';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { collection, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

describe('Firestore security rules — tickets-app', () => {
  let testEnv: RulesTestEnvironment;

  const wsA = 'ws-a';
  const wsB = 'ws-b';
  const adminA = 'admin-a';
  const adminB = 'admin-b';
  const bob = 'bob';
  const eve = 'eve';
  const carol = 'carol';

  const userDoc = (role: 'admin' | 'standard', workspaceId: string) => ({
    email: `${role}@example.com`,
    name: 'Original Name',
    role,
    workspace_id: workspaceId,
  });

  async function seedWorkspacesAndUsers() {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'workspaces', wsA), { owner_id: adminA, name: 'Workspace A' });
      await setDoc(doc(db, 'workspaces', wsB), { owner_id: adminB, name: 'Workspace B' });
      await setDoc(doc(db, 'users', adminA), userDoc('admin', wsA));
      await setDoc(doc(db, 'users', bob), userDoc('standard', wsA));
      await setDoc(doc(db, 'users', eve), userDoc('standard', wsA));
      await setDoc(doc(db, 'users', adminB), userDoc('admin', wsB));
      await setDoc(doc(db, 'users', carol), userDoc('standard', wsB));
    });
  }

  async function seedTicket(ticketId: string, workspaceId: string, creatorId: string) {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(context.firestore().doc(`workspaces/${workspaceId}/tickets/${ticketId}`), {
        creator_id: creatorId,
        title: 'Ticket title',
        createdAt: Date.now(),
      });
    });
  }

  async function seedComment(
    ticketId: string,
    workspaceId: string,
    commentId: string,
    authorId: string,
  ) {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        context
          .firestore()
          .doc(`workspaces/${workspaceId}/tickets/${ticketId}/comments/${commentId}`),
        { author_id: authorId, text: 'Comment text', createdAt: Date.now() },
      );
    });
  }

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'tickets-app-emulator',
      firestore: {
        rules: fs.readFileSync(path.resolve(__dirname, 'firestore.rules'), 'utf8'),
        host: '127.0.0.1',
        port: 8081,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
  });

  describe('privilege escalation via users/{uid} update (the fixed vulnerability)', () => {
    it('denies a standard user promoting themselves to admin', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(updateDoc(doc(bobDb, 'users', bob), { role: 'admin' }));
    });

    it('denies a standard user moving themselves into another workspace', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(updateDoc(doc(bobDb, 'users', bob), { workspace_id: wsB }));
    });

    it('denies a standard user changing role and name together', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(updateDoc(doc(bobDb, 'users', bob), { role: 'admin', name: 'New Name' }));
    });

    it('allows a standard user to update only their own name', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(updateDoc(doc(bobDb, 'users', bob), { name: 'New Name' }));
    });

    it('denies a standard user updating another user in the same workspace', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(updateDoc(doc(bobDb, 'users', eve), { name: 'Hijacked' }));
    });
  });

  describe('admin management of users/{uid}', () => {
    it('allows an admin to create a user doc for a new member of their own workspace', async () => {
      await seedWorkspacesAndUsers();
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertSucceeds(setDoc(doc(adminDb, 'users', 'new-member'), userDoc('standard', wsA)));
    });

    it('denies an admin creating a user doc scoped to a different workspace', async () => {
      await seedWorkspacesAndUsers();
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertFails(setDoc(doc(adminDb, 'users', 'new-member'), userDoc('standard', wsB)));
    });

    it('allows an admin to update a member of their own workspace', async () => {
      await seedWorkspacesAndUsers();
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertSucceeds(updateDoc(doc(adminDb, 'users', bob), { role: 'admin' }));
    });

    it('denies an admin updating a user who belongs to a different workspace', async () => {
      await seedWorkspacesAndUsers();
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertFails(updateDoc(doc(adminDb, 'users', carol), { name: 'Hijacked' }));
    });

    it('denies an admin moving a member of their workspace to another workspace_id', async () => {
      await seedWorkspacesAndUsers();
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertFails(updateDoc(doc(adminDb, 'users', bob), { workspace_id: wsB }));
    });
  });

  describe('self-registration anti-abuse check', () => {
    it('allows self-registration as admin for a workspace that does not exist yet', async () => {
      await seedWorkspacesAndUsers();
      const newUserDb = testEnv.authenticatedContext('new-founder').firestore();
      await assertSucceeds(
        setDoc(doc(newUserDb, 'users', 'new-founder'), userDoc('admin', 'ws-brand-new')),
      );
    });

    it('denies self-registration as admin for a workspace that already exists', async () => {
      await seedWorkspacesAndUsers();
      const newUserDb = testEnv.authenticatedContext('squatter').firestore();
      await assertFails(setDoc(doc(newUserDb, 'users', 'squatter'), userDoc('admin', wsA)));
    });

    it('denies self-registration with role standard', async () => {
      await seedWorkspacesAndUsers();
      const newUserDb = testEnv.authenticatedContext('new-standard').firestore();
      await assertFails(
        setDoc(doc(newUserDb, 'users', 'new-standard'), userDoc('standard', 'ws-brand-new')),
      );
    });
  });

  describe('users/{uid} read access', () => {
    it('allows a user to read their own doc', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(getDoc(doc(bobDb, 'users', bob)));
    });

    it('allows reading a doc of another member of the same workspace', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(getDoc(doc(bobDb, 'users', adminA)));
    });

    it('denies reading a doc of a user in a different workspace', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(getDoc(doc(bobDb, 'users', carol)));
    });
  });

  describe('workspaces/{workspaceId} — the second fixed vulnerability', () => {
    it('allows creating a workspace with the creator as owner_id', async () => {
      await seedWorkspacesAndUsers();
      const newUserDb = testEnv.authenticatedContext('founder').firestore();
      await assertSucceeds(
        setDoc(doc(newUserDb, 'workspaces', 'ws-founded'), {
          owner_id: 'founder',
          name: 'Founded Workspace',
        }),
      );
    });

    it('denies creating a workspace claiming another uid as owner_id', async () => {
      await seedWorkspacesAndUsers();
      const newUserDb = testEnv.authenticatedContext('founder').firestore();
      await assertFails(
        setDoc(doc(newUserDb, 'workspaces', 'ws-founded'), {
          owner_id: 'someone-else',
          name: 'Founded Workspace',
        }),
      );
    });

    it('allows a member to read their own workspace', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(getDoc(doc(bobDb, 'workspaces', wsA)));
    });

    it('denies a non-member from reading a workspace', async () => {
      await seedWorkspacesAndUsers();
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(getDoc(doc(carolDb, 'workspaces', wsA)));
    });

    it('allows an admin member to update their own workspace', async () => {
      await seedWorkspacesAndUsers();
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertSucceeds(updateDoc(doc(adminDb, 'workspaces', wsA), { name: 'Renamed' }));
    });

    it('denies a standard member from updating the workspace doc', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(updateDoc(doc(bobDb, 'workspaces', wsA), { name: 'Renamed' }));
    });

    it('denies a standard member from deleting the workspace doc', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(deleteDoc(doc(bobDb, 'workspaces', wsA)));
    });

    it('allows an admin member to delete their own workspace', async () => {
      await seedWorkspacesAndUsers();
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertSucceeds(deleteDoc(doc(adminDb, 'workspaces', wsA)));
    });

    it('denies an admin of another workspace from updating a workspace they are not a member of', async () => {
      await seedWorkspacesAndUsers();
      const adminBDb = testEnv.authenticatedContext(adminB).firestore();
      await assertFails(updateDoc(doc(adminBDb, 'workspaces', wsA), { name: 'Hijacked' }));
    });
  });

  describe('tickets — cross-tenant isolation', () => {
    it('denies a member of another workspace from reading a ticket', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(getDoc(doc(carolDb, `workspaces/${wsA}/tickets`, 'ticket-1')));
    });

    it('denies a member of another workspace from listing tickets', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(getDocs(collection(carolDb, `workspaces/${wsA}/tickets`)));
    });

    it('denies a member of another workspace from creating a ticket', async () => {
      await seedWorkspacesAndUsers();
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(
        setDoc(doc(carolDb, `workspaces/${wsA}/tickets`, 'ticket-2'), {
          creator_id: carol,
          title: 'Intrusion',
          createdAt: Date.now(),
        }),
      );
    });

    it('denies a member of another workspace from updating a ticket', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(
        updateDoc(doc(carolDb, `workspaces/${wsA}/tickets`, 'ticket-1'), { title: 'Hijacked' }),
      );
    });

    it('denies a member of another workspace from deleting a ticket', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(deleteDoc(doc(carolDb, `workspaces/${wsA}/tickets`, 'ticket-1')));
    });
  });

  describe('tickets — create/update/delete rules within a workspace', () => {
    it('allows a workspace member to create a ticket with themselves as creator_id', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(
        setDoc(doc(bobDb, `workspaces/${wsA}/tickets`, 'ticket-1'), {
          creator_id: bob,
          title: 'Bug report',
          createdAt: Date.now(),
        }),
      );
    });

    it('denies creating a ticket with a creator_id other than the caller', async () => {
      await seedWorkspacesAndUsers();
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(
        setDoc(doc(bobDb, `workspaces/${wsA}/tickets`, 'ticket-1'), {
          creator_id: adminA,
          title: 'Bug report',
          createdAt: Date.now(),
        }),
      );
    });

    it('allows the creator to update their own ticket', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(
        updateDoc(doc(bobDb, `workspaces/${wsA}/tickets`, 'ticket-1'), { title: 'Updated' }),
      );
    });

    it('denies a non-creator, non-admin member from updating someone else’s ticket', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const eveDb = testEnv.authenticatedContext(eve).firestore();
      await assertFails(
        updateDoc(doc(eveDb, `workspaces/${wsA}/tickets`, 'ticket-1'), { title: 'Hijacked' }),
      );
    });

    it('allows an admin to update any ticket in their workspace', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertSucceeds(
        updateDoc(doc(adminDb, `workspaces/${wsA}/tickets`, 'ticket-1'), { title: 'Moderated' }),
      );
    });

    it('allows the creator to delete their own ticket', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(deleteDoc(doc(bobDb, `workspaces/${wsA}/tickets`, 'ticket-1')));
    });

    it('denies a non-creator, non-admin member from deleting someone else’s ticket', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const eveDb = testEnv.authenticatedContext(eve).firestore();
      await assertFails(deleteDoc(doc(eveDb, `workspaces/${wsA}/tickets`, 'ticket-1')));
    });

    it('allows an admin to delete any ticket in their workspace', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertSucceeds(deleteDoc(doc(adminDb, `workspaces/${wsA}/tickets`, 'ticket-1')));
    });
  });

  describe('comments — create/read/delete rules', () => {
    it('allows a workspace member to create a comment with themselves as author_id', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(
        setDoc(doc(bobDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1'), {
          author_id: bob,
          text: 'Looking into it',
          createdAt: Date.now(),
        }),
      );
    });

    it('denies creating a comment with an author_id other than the caller', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertFails(
        setDoc(doc(bobDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1'), {
          author_id: adminA,
          text: 'Impersonation',
          createdAt: Date.now(),
        }),
      );
    });

    it('denies a non-member from creating a comment', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(
        setDoc(doc(carolDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1'), {
          author_id: carol,
          text: 'Intrusion',
          createdAt: Date.now(),
        }),
      );
    });

    it('allows a workspace member to read a comment', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      await seedComment('ticket-1', wsA, 'comment-1', bob);
      const eveDb = testEnv.authenticatedContext(eve).firestore();
      await assertSucceeds(
        getDoc(doc(eveDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1')),
      );
    });

    it('denies a non-member from reading a comment', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      await seedComment('ticket-1', wsA, 'comment-1', bob);
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(
        getDoc(doc(carolDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1')),
      );
    });

    it('allows the author to delete their own comment', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      await seedComment('ticket-1', wsA, 'comment-1', bob);
      const bobDb = testEnv.authenticatedContext(bob).firestore();
      await assertSucceeds(
        deleteDoc(doc(bobDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1')),
      );
    });

    it('denies a non-author, non-admin member from deleting someone else’s comment', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      await seedComment('ticket-1', wsA, 'comment-1', bob);
      const eveDb = testEnv.authenticatedContext(eve).firestore();
      await assertFails(
        deleteDoc(doc(eveDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1')),
      );
    });

    it('allows an admin to delete any comment in their workspace', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      await seedComment('ticket-1', wsA, 'comment-1', bob);
      const adminDb = testEnv.authenticatedContext(adminA).firestore();
      await assertSucceeds(
        deleteDoc(doc(adminDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1')),
      );
    });

    it('denies a non-member from deleting a comment', async () => {
      await seedWorkspacesAndUsers();
      await seedTicket('ticket-1', wsA, bob);
      await seedComment('ticket-1', wsA, 'comment-1', bob);
      const carolDb = testEnv.authenticatedContext(carol).firestore();
      await assertFails(
        deleteDoc(doc(carolDb, `workspaces/${wsA}/tickets/ticket-1/comments`, 'comment-1')),
      );
    });
  });
});
