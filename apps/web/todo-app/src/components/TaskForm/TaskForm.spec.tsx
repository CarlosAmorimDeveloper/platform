import { fireEvent, renderWithStore, screen } from '@/test-utils';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('adds a task with the typed title on submit', () => {
    const { store } = renderWithStore(<TaskForm />);

    fireEvent.change(screen.getByLabelText('Título da nova tarefa'), {
      target: { value: 'Buy milk' },
    });
    fireEvent.click(screen.getByText('Adicionar'));

    expect(store.getState().tasks.tasks).toHaveLength(1);
    expect(store.getState().tasks.tasks[0]?.title).toBe('Buy milk');
  });

  it('clears the input after adding a task', () => {
    renderWithStore(<TaskForm />);
    const input = screen.getByLabelText('Título da nova tarefa') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.click(screen.getByText('Adicionar'));

    expect(input.value).toBe('');
  });

  it('disables the submit button so an empty title cannot be submitted via click', () => {
    renderWithStore(<TaskForm />);

    fireEvent.click(screen.getByText('Adicionar'));

    expect(screen.getByText('Adicionar')).toBeDisabled();
  });

  it('does not add a task when the form is submitted with an empty title', () => {
    // Submits the form directly (not via the disabled button) to exercise
    // handleSubmit's own guard against an empty/whitespace title.
    const { store, container } = renderWithStore(<TaskForm />);

    const form = container.querySelector('form');
    if (!form) throw new Error('expected a form element');
    fireEvent.submit(form);

    expect(store.getState().tasks.tasks).toHaveLength(0);
  });

  it('does not add a task when the form is submitted with a whitespace-only title', () => {
    const { store, container } = renderWithStore(<TaskForm />);

    fireEvent.change(screen.getByLabelText('Título da nova tarefa'), {
      target: { value: '   ' },
    });
    const form = container.querySelector('form');
    if (!form) throw new Error('expected a form element');
    fireEvent.submit(form);

    expect(store.getState().tasks.tasks).toHaveLength(0);
  });

  it('disables the submit button while the title is empty', () => {
    renderWithStore(<TaskForm />);

    expect(screen.getByText('Adicionar')).toBeDisabled();
  });
});
