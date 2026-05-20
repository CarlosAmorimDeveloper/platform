import { TaskForm, TaskItem, TaskList } from './index';

describe('components/index re-exports', () => {
  it('exports TaskForm', () => expect(TaskForm).toBeDefined());
  it('exports TaskItem', () => expect(TaskItem).toBeDefined());
  it('exports TaskList', () => expect(TaskList).toBeDefined());
});
