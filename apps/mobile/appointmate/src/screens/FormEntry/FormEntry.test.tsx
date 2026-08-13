import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { createForm, getForm, updateForm } from '../../services/formsService';
import { useAuth } from '../../context/AuthContext';
import type { AppStackParamList } from '../../navigation/types';
import { FormEntry } from './FormEntry';

jest.mock('../../services/formsService', () => ({
  createForm: jest.fn(),
  updateForm: jest.fn(),
  getForm: jest.fn(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockedCreateForm = createForm as jest.Mock;
const mockedUpdateForm = updateForm as jest.Mock;
const mockedGetForm = getForm as jest.Mock;
const mockedUseAuth = useAuth as jest.Mock;

type Props = NativeStackScreenProps<AppStackParamList, 'FormEntry'>;

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as Props['navigation'];

function makeRoute(formId?: string): Props['route'] {
  return {
    key: 'FormEntry',
    name: 'FormEntry',
    params: formId ? { formId } : undefined,
  } as unknown as Props['route'];
}

// See Login.test.tsx — this environment needs generous timeouts for
// assertions that depend on flushing re-renders across the full provider tree,
// and this screen has more Controller/useFieldArray re-renders than most.
const ASYNC_TIMEOUT = { timeout: 15000 };

describe('FormEntry', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({ user: { uid: 'user-abc', email: 'user@example.com' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('creating a new form', () => {
    it('renders the appointment fields, mood chips and submit button', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      expect(screen.getByTestId('form-entry-appointment-date-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-doctor-name-input')).toBeTruthy();
      expect(screen.getByText('Muito mal')).toBeTruthy();
      expect(screen.getByText('Muito bem')).toBeTruthy();
      expect(screen.getByTestId('form-entry-submit-button')).toBeTruthy();
    });

    it('does not show any medication or question rows initially', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      expect(screen.queryByTestId('form-entry-medication-0-name-input')).toBeNull();
      expect(screen.queryByTestId('form-entry-question-0-input')).toBeNull();
    });

    it('does not call createForm when submitting without a mood selected', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-submit-button'));

      expect(mockedCreateForm).not.toHaveBeenCalled();
    });

    it('selects a mood chip on press', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-mood-chip-bem'));

      expect(screen.getByTestId('form-entry-mood-chip-bem').props.accessibilityState.selected).toBe(
        true,
      );
      expect(screen.getByTestId('form-entry-mood-chip-mal').props.accessibilityState.selected).toBe(
        false,
      );
    });

    it('adds a medication row with a press of "Adicionar medicamento"', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-add-medication-button'));

      expect(screen.getByTestId('form-entry-medication-0-name-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-medication-0-dosage-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-medication-0-frequency-input')).toBeTruthy();
    });

    it('removes a medication row with a press of "Remover"', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-add-medication-button'));
      fireEvent.press(screen.getByTestId('form-entry-remove-medication-0-button'));

      expect(screen.queryByTestId('form-entry-medication-0-name-input')).toBeNull();
    });

    it('adds and removes a question row', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-add-question-button'));
      expect(screen.getByTestId('form-entry-question-0-input')).toBeTruthy();

      fireEvent.press(screen.getByTestId('form-entry-remove-question-0-button'));
      expect(screen.queryByTestId('form-entry-question-0-input')).toBeNull();
    });

    it('calls createForm with the filled values and navigates back on success', async () => {
      mockedCreateForm.mockResolvedValue('new-form-id');
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.changeText(screen.getByTestId('form-entry-appointment-date-input'), '15/03/2026');
      fireEvent.changeText(
        screen.getByTestId('form-entry-doctor-name-input'),
        'Dra. Ana (Psiquiatria)',
      );
      fireEvent.press(screen.getByTestId('form-entry-mood-chip-bem'));

      fireEvent.press(screen.getByTestId('form-entry-add-medication-button'));
      fireEvent.changeText(screen.getByTestId('form-entry-medication-0-name-input'), 'Sertralina');
      fireEvent.changeText(screen.getByTestId('form-entry-medication-0-dosage-input'), '50mg');
      fireEvent.changeText(
        screen.getByTestId('form-entry-medication-0-frequency-input'),
        '1x ao dia',
      );

      fireEvent.press(screen.getByTestId('form-entry-add-question-button'));
      fireEvent.changeText(
        screen.getByTestId('form-entry-question-0-input'),
        'Posso reduzir a dose?',
      );

      fireEvent.press(screen.getByTestId('form-entry-submit-button'));

      await waitFor(() => {
        expect(mockedCreateForm).toHaveBeenCalledWith('user-abc', {
          appointmentDate: '15/03/2026',
          doctorName: 'Dra. Ana (Psiquiatria)',
          mood: 'bem',
          medications: [{ name: 'Sertralina', dosage: '50mg', frequency: '1x ao dia' }],
          questions: [{ text: 'Posso reduzir a dose?' }],
        });
      }, ASYNC_TIMEOUT);

      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalled();
      }, ASYNC_TIMEOUT);
    }, 20000);

    it('shows an error message when createForm fails', async () => {
      mockedCreateForm.mockRejectedValue(new Error('network error'));
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-mood-chip-bem'));
      fireEvent.press(screen.getByTestId('form-entry-submit-button'));

      await waitFor(() => {
        expect(
          screen.getByText('Não foi possível salvar o formulário. Tente novamente.'),
        ).toBeTruthy();
      }, ASYNC_TIMEOUT);
      expect(mockNavigation.goBack).not.toHaveBeenCalled();
    }, 20000);
  });

  describe('editing an existing form', () => {
    const existingValues = {
      appointmentDate: '20/04/2026',
      doctorName: 'Dr. Carlos (Clínico geral)',
      mood: 'neutro' as const,
      medications: [{ name: 'Losartana', dosage: '25mg', frequency: '1x ao dia' }],
      questions: [{ text: 'Posso trocar de horário?' }],
    };

    it('shows a loading state while the existing form is fetched', () => {
      mockedGetForm.mockReturnValue(new Promise(() => {}));

      render(<FormEntry navigation={mockNavigation} route={makeRoute('form-1')} />);

      expect(screen.getByTestId('form-entry-loading')).toBeTruthy();
    });

    it('populates the form with the loaded values', async () => {
      mockedGetForm.mockResolvedValue(existingValues);

      render(<FormEntry navigation={mockNavigation} route={makeRoute('form-1')} />);

      await waitFor(() => {
        expect(screen.getByTestId('form-entry-appointment-date-input').props.value).toBe(
          '20/04/2026',
        );
      }, ASYNC_TIMEOUT);
      expect(screen.getByTestId('form-entry-doctor-name-input').props.value).toBe(
        'Dr. Carlos (Clínico geral)',
      );
      expect(
        screen.getByTestId('form-entry-mood-chip-neutro').props.accessibilityState.selected,
      ).toBe(true);
      expect(screen.getByTestId('form-entry-medication-0-name-input').props.value).toBe(
        'Losartana',
      );
      expect(screen.getByTestId('form-entry-question-0-input').props.value).toBe(
        'Posso trocar de horário?',
      );
    }, 20000);

    it('calls updateForm (not createForm) on submit', async () => {
      mockedGetForm.mockResolvedValue(existingValues);
      mockedUpdateForm.mockResolvedValue(undefined);

      render(<FormEntry navigation={mockNavigation} route={makeRoute('form-1')} />);

      await waitFor(() => {
        expect(screen.getByTestId('form-entry-submit-button')).toBeTruthy();
      }, ASYNC_TIMEOUT);

      fireEvent.press(screen.getByTestId('form-entry-submit-button'));

      await waitFor(() => {
        expect(mockedUpdateForm).toHaveBeenCalledWith('form-1', existingValues);
      }, ASYNC_TIMEOUT);
      expect(mockedCreateForm).not.toHaveBeenCalled();
    }, 20000);

    it('shows an error message when the form fails to load', async () => {
      mockedGetForm.mockRejectedValue(new Error('not found'));

      render(<FormEntry navigation={mockNavigation} route={makeRoute('form-1')} />);

      await waitFor(() => {
        expect(screen.getByText('Não foi possível carregar o formulário.')).toBeTruthy();
      }, ASYNC_TIMEOUT);
    }, 20000);
  });
});
