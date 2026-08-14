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
  replace: jest.fn(),
} as unknown as Props['navigation'];

function makeRoute(formId?: string): Props['route'] {
  return {
    key: 'FormEntry',
    name: 'FormEntry',
    params: formId ? { formId } : undefined,
  } as unknown as Props['route'];
}

// See Login.test.tsx — this environment needs generous timeouts for
// assertions that depend on flushing re-renders across the full provider tree.
const ASYNC_TIMEOUT = { timeout: 15000 };

const existingValues = {
  appointmentDate: '20/04/2026',
  lastAppointmentDate: '10/01/2026',
  overallMood: 'estavel' as const,
  overallSummary: 'Semana estável.',
  sleep: 'Dormindo bem.',
  energy: 'Energia normal.',
  appetite: 'Apetite bom.',
  concentration: 'Concentração ok.',
  medications: [{ text: 'Losartana 25mg 1x ao dia' }],
  medicationAdherence: 'Sim, sempre.',
  medicationEffects: 'Nenhum efeito notado.',
  whatWentWell: 'Mantive a rotina de sono.',
  whatHasBeenHard: 'Ansiedade no trabalho.',
  context: 'Mudança de emprego.',
  questions: [{ text: 'Posso reduzir a dose?' }],
  todayFocus: 'Ajustar a medicação.',
  consultationNotes: '',
};

describe('FormEntry', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({ user: { uid: 'user-abc', email: 'user@example.com' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('creating a new form', () => {
    it('renders all 10 sections with their fields', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      expect(screen.getByTestId('form-entry-appointment-date-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-last-appointment-date-input')).toBeTruthy();
      expect(screen.getByText('Bem')).toBeTruthy();
      expect(screen.getByTestId('form-entry-overall-summary-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-sleep-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-energy-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-appetite-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-concentration-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-medication-adherence-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-medication-effects-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-what-went-well-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-what-has-been-hard-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-context-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-today-focus-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-consultation-notes-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-save-draft-button')).toBeTruthy();
      expect(screen.getByTestId('form-entry-submit-button')).toBeTruthy();
    });

    it('starts with 2 medication rows and 3 question rows', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      expect(screen.getByTestId('form-entry-medication-0-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-medication-1-input')).toBeTruthy();
      expect(screen.queryByTestId('form-entry-medication-2-input')).toBeNull();

      expect(screen.getByTestId('form-entry-question-0-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-question-1-input')).toBeTruthy();
      expect(screen.getByTestId('form-entry-question-2-input')).toBeTruthy();
      expect(screen.queryByTestId('form-entry-question-3-input')).toBeNull();
    });

    it('selects a single mood chip at a time', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-overall-mood-chip-estavel'));

      expect(
        screen.getByTestId('form-entry-overall-mood-chip-estavel').props.accessibilityState
          .selected,
      ).toBe(true);
      expect(
        screen.getByTestId('form-entry-overall-mood-chip-bem').props.accessibilityState.selected,
      ).toBe(false);
    });

    it('adds and removes a medication row', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-add-medication-button'));
      expect(screen.getByTestId('form-entry-medication-2-input')).toBeTruthy();

      fireEvent.press(screen.getByTestId('form-entry-remove-medication-2-button'));
      expect(screen.queryByTestId('form-entry-medication-2-input')).toBeNull();
    });

    it('adds and removes a question row', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-add-question-button'));
      expect(screen.getByTestId('form-entry-question-3-input')).toBeTruthy();

      fireEvent.press(screen.getByTestId('form-entry-remove-question-3-button'));
      expect(screen.queryByTestId('form-entry-question-3-input')).toBeNull();
    });

    it('removes every medication row down to zero', () => {
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-remove-medication-1-button'));
      fireEvent.press(screen.getByTestId('form-entry-remove-medication-0-button'));

      expect(screen.queryByTestId('form-entry-medication-0-input')).toBeNull();
    });

    it('saves as draft with the form completely empty', async () => {
      mockedCreateForm.mockResolvedValue('new-form-id');
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-save-draft-button'));

      await waitFor(() => {
        expect(mockedCreateForm).toHaveBeenCalledWith(
          'user-abc',
          expect.objectContaining({ appointmentDate: '', overallMood: null }),
          'draft',
        );
      }, ASYNC_TIMEOUT);
      await waitFor(() => {
        expect(mockNavigation.replace).toHaveBeenCalledWith('FormDetail', {
          formId: 'new-form-id',
        });
      }, ASYNC_TIMEOUT);
    }, 20000);

    it('calls createForm with status "submitted" and navigates to the new form detail when sending', async () => {
      mockedCreateForm.mockResolvedValue('new-form-id');
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.changeText(screen.getByTestId('form-entry-appointment-date-input'), '15/03/2026');
      fireEvent.press(screen.getByTestId('form-entry-overall-mood-chip-bem'));
      fireEvent.changeText(
        screen.getByTestId('form-entry-what-went-well-input'),
        'Dormi melhor essa semana.',
      );

      fireEvent.press(screen.getByTestId('form-entry-submit-button'));

      await waitFor(() => {
        expect(mockedCreateForm).toHaveBeenCalledWith(
          'user-abc',
          expect.objectContaining({
            appointmentDate: '15/03/2026',
            overallMood: 'bem',
            whatWentWell: 'Dormi melhor essa semana.',
          }),
          'submitted',
        );
      }, ASYNC_TIMEOUT);
      await waitFor(() => {
        expect(mockNavigation.replace).toHaveBeenCalledWith('FormDetail', {
          formId: 'new-form-id',
        });
      }, ASYNC_TIMEOUT);
    }, 20000);

    it('shows an error message when saving fails', async () => {
      mockedCreateForm.mockRejectedValue(new Error('network error'));
      render(<FormEntry navigation={mockNavigation} route={makeRoute()} />);

      fireEvent.press(screen.getByTestId('form-entry-submit-button'));

      await waitFor(() => {
        expect(
          screen.getByText('Não foi possível salvar o formulário. Tente novamente.'),
        ).toBeTruthy();
      }, ASYNC_TIMEOUT);
      expect(mockNavigation.replace).not.toHaveBeenCalled();
    }, 20000);
  });

  describe('editing an existing form', () => {
    it('shows a loading state while the existing form is fetched', () => {
      mockedGetForm.mockReturnValue(new Promise(() => {}));

      render(<FormEntry navigation={mockNavigation} route={makeRoute('form-1')} />);

      expect(screen.getByTestId('form-entry-loading')).toBeTruthy();
    });

    it('populates all sections with the loaded values', async () => {
      mockedGetForm.mockResolvedValue(existingValues);

      render(<FormEntry navigation={mockNavigation} route={makeRoute('form-1')} />);

      await waitFor(() => {
        expect(screen.getByTestId('form-entry-appointment-date-input').props.value).toBe(
          '20/04/2026',
        );
      }, ASYNC_TIMEOUT);
      expect(screen.getByTestId('form-entry-last-appointment-date-input').props.value).toBe(
        '10/01/2026',
      );
      expect(
        screen.getByTestId('form-entry-overall-mood-chip-estavel').props.accessibilityState
          .selected,
      ).toBe(true);
      expect(screen.getByTestId('form-entry-sleep-input').props.value).toBe('Dormindo bem.');
      expect(screen.getByTestId('form-entry-medication-0-input').props.value).toBe(
        'Losartana 25mg 1x ao dia',
      );
      expect(screen.getByTestId('form-entry-question-0-input').props.value).toBe(
        'Posso reduzir a dose?',
      );
      expect(screen.getByTestId('form-entry-today-focus-input').props.value).toBe(
        'Ajustar a medicação.',
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
        expect(mockedUpdateForm).toHaveBeenCalledWith('form-1', existingValues, 'submitted');
      }, ASYNC_TIMEOUT);
      expect(mockedCreateForm).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(mockNavigation.replace).toHaveBeenCalledWith('FormDetail', { formId: 'form-1' });
      }, ASYNC_TIMEOUT);
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
