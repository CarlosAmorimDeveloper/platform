import { render, screen, act } from '@testing-library/react';
import ReduxProvider from './ReduxProvider';
import { STORAGE_KEY } from './store';

beforeEach(() => {
  localStorage.clear();
});

async function renderProvider(ui = <div data-testid="child">ok</div>) {
  await act(async () => {
    render(<ReduxProvider>{ui}</ReduxProvider>);
  });
}

describe('ReduxProvider', () => {
  it('renders children', async () => {
    await renderProvider();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

describe('StoreHydrator', () => {
  it('hydrates the store from valid localStorage data', async () => {
    const state = {
      tasks: [
        { id: '1', title: 'Buy milk', completed: false, createdAt: '2024-01-01T00:00:00.000Z' },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    await renderProvider();

    // Valid state: removeItem should NOT have been called
    expect(removeItemSpy).not.toHaveBeenCalled();
    removeItemSpy.mockRestore();
  });

  it('does nothing when localStorage has no entry', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    await renderProvider();
    expect(removeItemSpy).not.toHaveBeenCalled();
    removeItemSpy.mockRestore();
  });

  it('removes entry when JSON is malformed', async () => {
    localStorage.setItem(STORAGE_KEY, '{not-valid-json{{');
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when stored value is not an object', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when stored value is null', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(null));
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when tasks array is missing', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notTasks: [] }));
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when a task is missing the id field', async () => {
    const bad = {
      tasks: [{ title: 'No id', completed: false, createdAt: '2024-01-01T00:00:00.000Z' }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bad));
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when a task is missing the title field', async () => {
    const bad = {
      tasks: [{ id: '1', completed: false, createdAt: '2024-01-01T00:00:00.000Z' }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bad));
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when a task has wrong type for completed', async () => {
    const bad = {
      tasks: [{ id: '1', title: 'Test', completed: 'yes', createdAt: '2024-01-01T00:00:00.000Z' }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bad));
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when a task is not an object', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: [null] }));
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('removes entry when localStorage.getItem throws', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new Error('storage error');
    });
    await renderProvider();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
