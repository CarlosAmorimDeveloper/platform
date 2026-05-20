import { taskReducer, addTask, toggleTask, editTask, removeTask, hydrateState } from './taskSlice';
import type { TaskState } from './taskSlice';

const empty: TaskState = { tasks: [] };

describe('taskSlice', () => {
  describe('addTask', () => {
    it('appends a task with the given title', () => {
      const state = taskReducer(empty, addTask({ title: 'Buy milk' }));
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Buy milk');
      expect(state.tasks[0].completed).toBe(false);
      expect(typeof state.tasks[0].id).toBe('string');
      expect(typeof state.tasks[0].createdAt).toBe('string');
    });

    it('accumulates multiple tasks', () => {
      let state = taskReducer(empty, addTask({ title: 'First' }));
      state = taskReducer(state, addTask({ title: 'Second' }));
      expect(state.tasks).toHaveLength(2);
    });
  });

  describe('toggleTask', () => {
    it('marks an incomplete task completed', () => {
      let state = taskReducer(empty, addTask({ title: 'Buy milk' }));
      const id = state.tasks[0].id;
      state = taskReducer(state, toggleTask(id));
      expect(state.tasks[0].completed).toBe(true);
    });

    it('marks a completed task incomplete', () => {
      let state = taskReducer(empty, addTask({ title: 'Buy milk' }));
      const id = state.tasks[0].id;
      state = taskReducer(state, toggleTask(id));
      state = taskReducer(state, toggleTask(id));
      expect(state.tasks[0].completed).toBe(false);
    });

    it('is a no-op when the id does not exist', () => {
      let state = taskReducer(empty, addTask({ title: 'Buy milk' }));
      const before = state.tasks[0].completed;
      state = taskReducer(state, toggleTask('nonexistent'));
      expect(state.tasks[0].completed).toBe(before);
    });
  });

  describe('editTask', () => {
    it('updates the title of an existing task', () => {
      let state = taskReducer(empty, addTask({ title: 'Buy milk' }));
      const id = state.tasks[0].id;
      state = taskReducer(state, editTask({ id, title: 'Buy eggs' }));
      expect(state.tasks[0].title).toBe('Buy eggs');
    });

    it('is a no-op when the id does not exist', () => {
      let state = taskReducer(empty, addTask({ title: 'Buy milk' }));
      state = taskReducer(state, editTask({ id: 'nonexistent', title: 'whatever' }));
      expect(state.tasks[0].title).toBe('Buy milk');
    });
  });

  describe('removeTask', () => {
    it('removes the task with the given id', () => {
      let state = taskReducer(empty, addTask({ title: 'Buy milk' }));
      const id = state.tasks[0].id;
      state = taskReducer(state, removeTask(id));
      expect(state.tasks).toHaveLength(0);
    });

    it('leaves other tasks intact', () => {
      let state = taskReducer(empty, addTask({ title: 'First' }));
      state = taskReducer(state, addTask({ title: 'Second' }));
      const idFirst = state.tasks[0].id;
      state = taskReducer(state, removeTask(idFirst));
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Second');
    });
  });

  describe('hydrateState', () => {
    it('replaces state wholesale with the payload', () => {
      const hydrated: TaskState = {
        tasks: [
          { id: '99', title: 'Hydrated', completed: true, createdAt: '2024-01-01T00:00:00.000Z' },
        ],
      };
      const state = taskReducer(empty, hydrateState(hydrated));
      expect(state).toEqual(hydrated);
    });

    it('can hydrate into empty tasks', () => {
      let state = taskReducer(empty, addTask({ title: 'Will be gone' }));
      state = taskReducer(state, hydrateState({ tasks: [] }));
      expect(state.tasks).toHaveLength(0);
    });
  });
});
