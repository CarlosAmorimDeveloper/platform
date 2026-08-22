import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { taskReducer } from '@/redux/taskSlice';
import type { TaskState } from '@/redux/taskSlice';

export function createTestStore(preloadedState?: TaskState): EnhancedStore<{ tasks: TaskState }> {
  return configureStore({
    reducer: { tasks: taskReducer },
    preloadedState: preloadedState && { tasks: preloadedState },
  });
}

export function renderWithStore(
  ui: ReactElement,
  options?: { preloadedState?: TaskState } & Omit<RenderOptions, 'wrapper'>,
): RenderResult & { store: EnhancedStore<{ tasks: TaskState }> } {
  const { preloadedState, ...renderOptions } = options ?? {};
  const store = createTestStore(preloadedState);

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>, renderOptions),
  };
}

export * from '@testing-library/react';
