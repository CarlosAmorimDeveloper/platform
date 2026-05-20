import { store, STORAGE_KEY } from './store';
import { addTask, removeTask } from './taskSlice';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('STORAGE_KEY', () => {
  it('is the expected string', () => {
    expect(STORAGE_KEY).toBe('todo-app:tasks');
  });
});

describe('store subscribe — localStorage persistence', () => {
  it('writes state to localStorage when a task is dispatched', () => {
    store.dispatch(addTask({ title: 'Persist me' }));
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.tasks.some((t: { title: string }) => t.title === 'Persist me')).toBe(true);
  });

  it('updates localStorage after a task is removed', () => {
    store.dispatch(addTask({ title: 'Temp task' }));
    const id = store.getState().tasks.tasks.find((t) => t.title === 'Temp task')!.id;
    store.dispatch(removeTask(id));
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw!);
    expect(parsed.tasks.find((t: { title: string }) => t.title === 'Temp task')).toBeUndefined();
  });

  it('silently ignores a localStorage write error', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => store.dispatch(addTask({ title: 'Overflow' }))).not.toThrow();
    spy.mockRestore();
  });
});
